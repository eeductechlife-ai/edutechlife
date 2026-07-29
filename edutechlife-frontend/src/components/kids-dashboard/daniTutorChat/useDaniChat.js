import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  callDeepseek,
  callDeepseekStream,
  callDaniChatStream,
} from "../../../utils/api";
import {
  PROMPT_DANI_EXPERTO,
  PROMPT_TUTOR_TAREAS,
  PROMPT_DANI_SOCRATICO,
} from "../../../constants/prompts";
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
  const { studentAge } = useSmartBoardKids();
  const isKid = studentAge && studentAge <= 11;

  const kidErrorMessages = {
    generic: "¡Ups! Dani se quedó pensando. ¿Puedes intentar de nuevo?",
    timeout: "Dani está pensando muy profundo... Espera un poco y vuelve a intentar.",
    network: "¡Oh! Parece que el internet se fue de paseo. Revisa tu conexión y vuelve a intentar.",
  };
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
    missions,
    subjects,
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

    const pendingMissions = (missions || []).filter((m) => !m.completed);
    if (pendingMissions.length > 0) {
      const names = pendingMissions
        .slice(0, 3)
        .map((m) => `"${m.title}"`)
        .join(", ");
      const missionText =
        pendingMissions.length === 1
          ? `Tienes 1 misión pendiente: ${names}.`
          : `Tienes ${pendingMissions.length} misiones pendientes: ${names}${pendingMissions.length > 3 ? " y más." : "."}`;
      parts.push(missionText);
      parts.push("¿Quieres que empecemos con alguna?");
    }

    if (!parts.some((p) => p.includes("misiones"))) {
      const lowProgress = (subjects || []).filter(
        (s) => (s.progress || 0) > 0 && (s.progress || 0) < 50,
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
        let systemPrompt = hasDocumentContext
          ? PROMPT_TUTOR_TAREAS
          : PROMPT_DANI_EXPERTO;

        const memoryInjection = buildMemoryInjection();
        if (memoryInjection) {
          systemPrompt += "\n\n" + memoryInjection;
        }

        const cs = daniMemory?.studentProfile?.communicationStyle;
        if (cs === "shy") {
          systemPrompt +=
            "\n\n## ADAPTACIÓN\nEste estudiante es reservado. Sé paciente, usa preguntas abiertas y celebra cada intento.";
        } else if (cs === "direct") {
          systemPrompt +=
            "\n\n## ADAPTACIÓN\nEste estudiante es directo. Ve al grano, respuestas concisas.";
        } else if (cs === "playful") {
          systemPrompt +=
            "\n\n## ADAPTACIÓN\nEste estudiante es juguetón. Usa emojis, mantén un tono alegre.";
        } else if (cs === "curious") {
          systemPrompt +=
            "\n\n## ADAPTACIÓN\nEste estudiante es curioso. Ofrece datos interesantes, invita a explorar.";
        }

        if (socraticMode) {
          systemPrompt += `\n\n${PROMPT_DANI_SOCRATICO}`;
        }

        let contextInfo = buildDaniContext();

        if (hasDocumentContext) {
          contextInfo += `\n\n## ANÁLISIS DE DOCUMENTO DEL ESTUDIANTE\n`;
          contextInfo += `Título: ${documentForDani.title || "Documento"}\n`;
          contextInfo += `Materia: ${documentForDani.subject || "General"}\n`;
          contextInfo += `Resumen: ${documentForDani.summary || ""}\n`;
          contextInfo += `Fortalezas: ${documentForDani.strengths?.join(", ") || ""}\n`;
          contextInfo += `Áreas de mejora: ${documentForDani.improvements?.join(", ") || ""}\n`;
          contextInfo += `Puntuación: ${documentForDani.score}/100\n`;
          contextInfo += `Dificultad: ${documentForDani.difficulty || "N/A"}\n`;
          contextInfo += `\nPreguntas guía para la tutoría:\n${documentForDani.tutoringQuestions?.map((q, i) => `${i + 1}. ${q}`).join("\n") || ""}\n`;
          contextInfo += `\nIMPORTANTE: El estudiante acaba de subir este documento. Usa el análisis para guiar la tutoría. Pregúntale qué parte quiere mejorar o qué no entiende.`;
        }

        const mood = inferMoodFromText(userMessage.text);

        if (isEmotionalBannerNeeded(mood)) {
          setShowEmotionalBanner(true);
          const supportPrompt = getMoodSupportPrompt(mood, userMessage.text);
          if (supportPrompt) systemPrompt += supportPrompt;
        }

        if (isCrisisAlert(mood)) {
          setShowCrisisResources(true);
        }

        const messages = [{ role: "system", content: systemPrompt }];

        if (contextInfo) {
          messages.push({
            role: "user",
            content: `[INFORMACIÓN DEL ESTUDIANTE - USA ESTO PARA PERSONALIZAR TU RESPUESTA]\n${contextInfo}\n\nNota: Esta información se actualiza en cada mensaje. No la repitas textualmente en tu respuesta, úsala para adaptar tu tono y sugerencias.`,
          });
        }

        if (isCrisisAlert(mood)) {
          const crisisMsg = getCrisisUserMessage(mood);
          if (crisisMsg) {
            messages.push({
              role: "user",
              content: crisisMsg,
            });
          }
        }

        const history = daniChatHistory.slice(-15).map((msg) => ({
          role: msg.role,
          content: msg.text,
        }));
        messages.push(...history);

        messages.push({ role: "user", content: userMessage.text });

        if (hasDocumentContext) {
          setDocumentForDani(null);
        }

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
        const errorMsg = isKid
          ? error.message?.includes("400") || error.message?.includes("500")
            ? kidErrorMessages.generic
            : error.message?.includes("timeout") ||
                error.message?.includes("Tiempo de espera")
              ? kidErrorMessages.timeout
              : kidErrorMessages.network
          : error.message?.includes("400") || error.message?.includes("500")
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
