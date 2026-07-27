import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { callDaniChatStream } from "../../../utils/api";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { speakTextConversational, stopSpeech } from "../../../utils/speech";
import useFocusTrap from "../../../hooks/useFocusTrap";
import { inferMoodFromText, extractTopic } from "../dani/chatUtils";
import { getVoiceOverrides, primeSpeech } from "./DaniVoiceController";
import { getQuickActionMessage } from "./daniQuickActions";
import {
  retrySpeech as retrySpeechFn,
  toggleVoice as toggleVoiceFn,
  handleMicClick as handleMicClickFn,
  processStreamChunkVoice,
  speakRemainingText,
} from "./daniChatVoice";
import {
  getMoodSupportPrompt,
  getCrisisUserMessage,
  isEmotionalBannerNeeded,
  isCrisisAlert,
  recordMoodIfNeeded,
} from "./daniChatMood";
import { trackTopicFromMessage } from "./daniChatTopics";

export default function useDaniChat({ isOpen, onClose, activeTab }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const {
    daniChatHistory,
    addDaniMessage,
    daniMood,
    setDaniMood,
    vakResult,
    totalPoints,
    streak,
    buildDaniContext,
    recordMoodInference,
    trackAcademicTopic,
    academicTopics,
    studentMoodHistory,
    conversationCount,
    darkMode,
    calendarEvents,
    documentForDani,
    setDocumentForDani,
    daniMemory,
    updateDaniMemory,
    buildMemoryInjection,
    subscriptionTier,
  } = useSmartBoardKids();

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem("edutechlife_dani_voice");
    return saved !== null ? saved === "true" : true;
  });
  const [socraticMode, setSocraticMode] = useState(() => {
    const saved = localStorage.getItem("edutechlife_dani_socratic");
    return saved === "true";
  });
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [showEmotionalBanner, setShowEmotionalBanner] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceBlocked, setVoiceBlocked] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [crisisAlertLevel, setCrisisAlertLevel] = useState(null);
  const messagesEndRef = useRef(null);
  const hasSentWelcome = useRef(false);
  const isSpeakingRef = useRef(false);
  const speechPrimed = useRef(false);
  const pendingSentenceRef = useRef("");
  const focusTrapRef = useFocusTrap(isOpen);
  const [streamingMessage, setStreamingMessage] = useState("");

  const buildRichWelcome = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour < 12
        ? t("dani.welcome_morning")
        : hour < 18
          ? t("dani.welcome_afternoon")
          : t("dani.welcome_evening");

    const parts = [];

    parts.push(greeting);

    if (streak.current >= 2) {
      parts.push(t("dani.welcome_streak", { days: streak.current }));
    }

    const tabMessages = {
      misiones: "Veo que estabas viendo tus misiones.",
      materias: "Estabas repasando tus materias.",
      actividades: "Estabas en la sección de actividades.",
      calendario: "Estabas viendo tu calendario.",
      puntos: "Estabas revisando tus puntos y recompensas.",
      noticias: "Estabas leyendo las noticias tech.",
      vak: "Estabas en tu perfil VAK.",
      inicio: "",
      dani: "",
    };
    const tabContext = tabMessages[activeTab] || "";
    if (tabContext) parts.push(tabContext);

    const savedMissions = localStorage.getItem("edutechlife_missions");
    if (savedMissions) {
      try {
        const allMissions = JSON.parse(savedMissions);
        const pending = allMissions.filter((m) => !m.completed);
        if (pending.length > 0) {
          const names = pending
            .slice(0, 3)
            .map((m) => `"${m.title}"`)
            .join(", ");
          const missionText =
            pending.length === 1
              ? `Tienes 1 misión pendiente: ${names}.`
              : `Tienes ${pending.length} misiones pendientes: ${names}${pending.length > 3 ? " y más." : "."}`;
          parts.push(missionText);
          parts.push("¿Quieres que empecemos con alguna?");
        }
      } catch (e) {}
    }

    if (!parts.some((p) => p.includes("misiones"))) {
      const savedSubjects = localStorage.getItem("edutechlife_subjects");
      if (savedSubjects) {
        try {
          const allSubjects = JSON.parse(savedSubjects);
          const lowProgress = allSubjects.filter(
            (s) => s.progress > 0 && s.progress < 50,
          );
          if (lowProgress.length > 0) {
            const names = lowProgress
              .slice(0, 3)
              .map((s) => `${s.name} (${s.progress}%)`)
              .join(", ");
            parts.push(
              `Noté que ${names} necesitan un poco más de práctica. ¿Quieres repasar algún tema en específico?`,
            );
          }
        } catch (e) {}
      }
    }

    if (!vakResult) {
      parts.push(
        "¿Sabías que aún no has descubierto tu estilo de aprendizaje? Podemos hacer el diagnóstico VAK ahora mismo 🧠",
      );
    }

    const todayStr = now.toISOString().split("T")[0];
    const todayEvents = calendarEvents.filter((e) => e.date === todayStr);
    if (todayEvents.length > 0) {
      const eventNames = todayEvents.map((e) => e.title).join(", ");
      parts.push(
        `Hoy tienes agendado: ${eventNames}. ¿Cómo te sientes al respecto?`,
      );
    }

    if (!parts.some((p) => p.includes("¿"))) {
      parts.push(t("dani.welcome_first"));
    }

    return parts.join(" ");
  }, [streak, vakResult, calendarEvents, activeTab, t]);

  useEffect(() => {
    localStorage.setItem("edutechlife_dani_voice", voiceEnabled);
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem("edutechlife_dani_socratic", socraticMode);
  }, [socraticMode]);

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
    return () => {
      stopSpeech();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    };
  }, [isOpen]);

  const retrySpeech = useCallback(() => {
    retrySpeechFn({ setVoiceBlocked, speechPrimed });
  }, [setVoiceBlocked, speechPrimed]);

  const toggleVoice = useCallback(() => {
    toggleVoiceFn({ isSpeaking, stopSpeech, setVoiceEnabled, setVoiceBlocked });
  }, [isSpeaking, setVoiceEnabled, setVoiceBlocked]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [daniChatHistory]);

  useEffect(() => {
    if (!isOpen) {
      hasSentWelcome.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || speechPrimed.current) return;
    primeSpeech();
    speechPrimed.current = true;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || hasSentWelcome.current || daniChatHistory.length > 0) return;
    setIsTyping(true);
    setDaniMood("thinking");

    const welcomeText = buildRichWelcome();

    const showWelcome = () => {
      hasSentWelcome.current = true;
      setIsTyping(false);
      setDaniMood("happy");
      addDaniMessage({ role: "assistant", text: welcomeText });
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      const voiceOverrides = getVoiceOverrides(daniMood);
      speakTextConversational(
        welcomeText,
        "dani",
        voiceOverrides,
        () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
        },
        (err) => {
          if (err && err.includes("bloqueado")) {
            setVoiceBlocked(true);
          }
        },
      );
    };

    const timeout = setTimeout(showWelcome, 300);

    return () => {
      clearTimeout(timeout);
      if (!hasSentWelcome.current) setIsTyping(false);
    };
  }, [isOpen]);

  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      const userMessage = {
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };
      addDaniMessage(userMessage);
      setInputText("");
      setIsTyping(true);
      setDaniMood("thinking");

      try {
        const currentMood = daniMood;
        const hasDocumentContext = !!documentForDani;

        // Dani's identity + safety prompt lives on the server. The client only
        // supplies STUDENT CONTEXT (data) so responses stay personalized.
        const contextParts = [];

        const baseContext = buildDaniContext();
        if (baseContext) contextParts.push(baseContext);

        const memoryInjection = buildMemoryInjection();
        if (memoryInjection) contextParts.push(memoryInjection);

        const csHint = {
          shy: "Estilo del estudiante: reservado. Sé paciente, usa preguntas abiertas y celebra cada intento.",
          direct:
            "Estilo del estudiante: directo. Ve al grano con respuestas concisas.",
          playful:
            "Estilo del estudiante: juguetón. Usa emojis y un tono alegre.",
          curious:
            "Estilo del estudiante: curioso. Ofrece datos interesantes e invita a explorar.",
        }[daniMemory?.studentProfile?.communicationStyle];
        if (csHint) contextParts.push(csHint);

        if (hasDocumentContext) {
          contextParts.push(
            `ANÁLISIS DE DOCUMENTO DEL ESTUDIANTE\n` +
              `Título: ${documentForDani.title || "Documento"}\n` +
              `Materia: ${documentForDani.subject || "General"}\n` +
              `Resumen: ${documentForDani.summary || ""}\n` +
              `Fortalezas: ${documentForDani.strengths?.join(", ") || ""}\n` +
              `Áreas de mejora: ${documentForDani.improvements?.join(", ") || ""}\n` +
              `Puntuación: ${documentForDani.score}/100\n` +
              `Dificultad: ${documentForDani.difficulty || "N/A"}\n` +
              `Preguntas guía:\n${documentForDani.tutoringQuestions?.map((q, i) => `${i + 1}. ${q}`).join("\n") || ""}\n` +
              `IMPORTANTE: El estudiante acaba de subir este documento. Usa el análisis para guiar la tutoría; pregúntale qué parte quiere mejorar o qué no entiende.`,
          );
        }

        const mood = inferMoodFromText(userMessage.text);

        if (isEmotionalBannerNeeded(mood)) {
          setShowEmotionalBanner(true);
          const supportPrompt = getMoodSupportPrompt(mood, userMessage.text);
          if (supportPrompt) contextParts.push(supportPrompt.trim());
        }

        if (isCrisisAlert(mood)) {
          setShowCrisisResources(true);
        }

        const context = contextParts.filter(Boolean).join("\n\n");

        // Conversation = recent history + optional crisis nudge + current message.
        // No system message — the server owns Dani's system prompt.
        const messages = daniChatHistory
          .slice(-15)
          .filter((msg) => typeof msg.text === "string" && msg.text.trim())
          .map((msg) => ({ role: msg.role, content: msg.text }));

        if (isCrisisAlert(mood)) {
          const crisisMsg = getCrisisUserMessage(mood);
          if (crisisMsg) messages.push({ role: "user", content: crisisMsg });
        }

        messages.push({ role: "user", content: userMessage.text });

        if (hasDocumentContext) {
          setDocumentForDani(null);
        }

        const language =
          typeof localStorage !== "undefined" &&
          localStorage.getItem("edutechlife_locale") === "en"
            ? "en"
            : "es";

        let fullResponse = "";
        pendingSentenceRef.current = "";

        // Get auth token and use authenticated SmartBoard Dani endpoint
        const token = await getToken();
        if (!token) {
          throw new Error("No auth token — user must be logged in");
        }

        await callDaniChatStream(
          messages,
          {
            temperature: 0.7,
            maxTokens: 800,
            token,
            context,
            socratic: socraticMode,
            language,
          },
          (data) => {
            // Handle crisis alerts (passed as JSON stringified objects)
            try {
              const parsed = JSON.parse(data);
              if (parsed.__crisisAlert) {
                setCrisisAlertLevel(parsed.__crisisAlert);
                setShowCrisisResources(true);
                return; // Don't add to chat
              }
            } catch {
              // Not JSON, continue as normal chunk
            }

            // Normal chunk handling
            const chunk = data;
            fullResponse += chunk;
            setDaniMood("explaining");
            setStreamingMessage(fullResponse);

            processStreamChunkVoice(chunk, {
              pendingSentenceRef,
              voiceEnabled,
              isSpeakingRef,
              daniMood: currentMood,
              setIsSpeaking,
              setVoiceBlocked,
            });
          },
        );

        const remaining = pendingSentenceRef.current.trim();
        speakRemainingText(remaining, {
          voiceEnabled,
          isSpeakingRef,
          daniMood: currentMood,
          setIsSpeaking,
          setVoiceBlocked,
        });

        setDaniMood("explaining");
        setStreamingMessage("");
        try {
          const chartMatch = fullResponse.match(/<!CHART>(.*?)<\/!CHART>/s);
          if (chartMatch) {
            const chartData = JSON.parse(chartMatch[1].trim());
            addDaniMessage({
              role: "assistant",
              type: "chart",
              data: chartData,
            });
          }
          const videoMatch = fullResponse.match(/<!VIDEO>(.*?)<\/!VIDEO>/s);
          if (videoMatch) {
            const videoData = JSON.parse(videoMatch[1].trim());
            addDaniMessage({
              role: "assistant",
              type: "video",
              data: videoData,
            });
          }
        } catch (e) {}

        const cleanResponse = fullResponse
          .replace(/<memoria>[\s\S]*?<\/memoria>/, "")
          .trim();
        addDaniMessage({
          role: "assistant",
          text: cleanResponse || fullResponse,
        });

        try {
          const memoriaMatch = fullResponse.match(
            /<memoria>([\s\S]*?)<\/memoria>/,
          );
          if (memoriaMatch) {
            const parsed = JSON.parse(memoriaMatch[1].trim());
            updateDaniMemory(parsed);
          }
        } catch (e) {
          console.warn("[Dani] Memoria parse error:", e.message);
        }

        recordMoodIfNeeded(mood, userMessage.text, recordMoodInference);

        trackTopicFromMessage(userMessage, extractTopic, trackAcademicTopic);
      } catch (error) {
        console.error("Error calling Dani:", error);
        const errorMsg =
          error.message?.includes("400") || error.message?.includes("500")
            ? t("dani.error_generic")
            : error.message?.includes("timeout") ||
                error.message?.includes("Tiempo de espera")
              ? t("dani.error_timeout")
              : t("dani.error_network");
        addDaniMessage({
          role: "assistant",
          text: errorMsg,
        });
      } finally {
        setIsTyping(false);
        setDaniMood("happy");
      }
    },
    [
      addDaniMessage,
      buildDaniContext,
      daniChatHistory,
      recordMoodInference,
      trackAcademicTopic,
      setDaniMood,
      voiceEnabled,
      setVoiceBlocked,
      socraticMode,
      documentForDani,
      daniMood,
      t,
    ],
  );

  const handleQuickAction = useCallback(
    (action) => {
      handleSendMessage(getQuickActionMessage(action));
    },
    [handleSendMessage],
  );

  const handleTopicClick = useCallback(
    (topic) => {
      handleSendMessage(
        `Dani, explícame sobre ${topic}, quiero entenderlo bien`,
      );
    },
    [handleSendMessage],
  );

  const handleMicClick = useCallback(() => {
    handleMicClickFn({
      isListening,
      setInputText,
      handleSendMessage,
      setIsListening,
    });
  }, [isListening, handleSendMessage]);

  return {
    focusTrapRef,
    isSpeaking,
    isTyping,
    conversationCount,
    toggleVoice,
    voiceEnabled,
    voiceBlocked,
    streak,
    socraticMode,
    setSocraticMode,
    showCrisisResources,
    setShowCrisisResources,
    showEmotionalBanner,
    setShowEmotionalBanner,
    studentMoodHistory,
    darkMode,
    documentForDani,
    setDocumentForDani,
    daniChatHistory,
    streamingMessage,
    messagesEndRef,
    handleQuickAction,
    academicTopics,
    handleTopicClick,
    inputText,
    setInputText,
    handleSendMessage,
    isListening,
    handleMicClick,
    crisisAlertLevel,
  };
}
