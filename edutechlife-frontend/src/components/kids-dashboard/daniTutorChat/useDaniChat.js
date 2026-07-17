import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { callDeepseek, callDeepseekStream } from "../../../utils/api";
import {
  PROMPT_DANI_EXPERTO,
  PROMPT_TUTOR_TAREAS,
  PROMPT_DANI_SOCRATICO,
} from "../../../constants/prompts";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import {
  speakTextConversational,
  stopSpeech,
  iniciarReconocimiento,
  stopRecognition,
} from "../../../utils/speech";
import useFocusTrap from "../../../hooks/useFocusTrap";
import { inferMoodFromText, extractTopic } from "../dani/chatUtils";
import { getVoiceOverrides, primeSpeech, stripEmoji } from "./DaniVoiceController";
import { getQuickActionMessage } from "./daniQuickActions";

export default function useDaniChat({ isOpen, onClose, activeTab }) {
  const navigate = useNavigate();
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
        ? "¡Buenos días"
        : hour < 18
          ? "¡Buenas tardes"
          : "¡Buenas noches";

    const parts = [];

    parts.push(`${greeting}! Soy Dani, tu mentor virtual.`);

    if (streak.current >= 5) {
      parts.push(
        `Llevas ${streak.current} días seguidos, ¡qué impresionante! 🔥`,
      );
    } else if (streak.current >= 2) {
      parts.push(`Ya llevas ${streak.current} días de racha, ¡sigue así!`);
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
      parts.push("¿En qué te gustaría que te ayude hoy? 😊");
    }

    return parts.join(" ");
  }, [streak, vakResult, calendarEvents, activeTab]);

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
    setVoiceBlocked(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
      speechPrimed.current = true;
    }
  }, []);

  const toggleVoice = useCallback(() => {
    if (isSpeaking) stopSpeech();
    setVoiceEnabled((prev) => !prev);
    setVoiceBlocked(false);
  }, [isSpeaking]);

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

        if (
          mood &&
          ["triste", "enojado", "ansioso"].includes(mood.mood) &&
          mood.confidence >= 0.7
        ) {
          setShowEmotionalBanner(true);
          systemPrompt += `\n\n## INSTRUCCIÓN DE APOYO EMOCIONAL\nEl estudiante está mostrando signos de ${mood.mood} en su mensaje: "${userMessage.text.substring(0, 100)}". Prioriza la VALIDACIÓN EMOCIONAL antes de continuar con contenido académico. Ofrece estrategias de afrontamiento concretas y un espacio seguro para que el estudiante se exprese.`;
        }

        if (mood && mood.mood === "CRISIS_ALERT" && mood.confidence >= 0.9) {
          setShowCrisisResources(true);
        }

        const messages = [{ role: "system", content: systemPrompt }];

        if (contextInfo) {
          messages.push({
            role: "user",
            content: `[INFORMACIÓN DEL ESTUDIANTE - USA ESTO PARA PERSONALIZAR TU RESPUESTA]\n${contextInfo}\n\nNota: Esta información se actualiza en cada mensaje. No la repitas textualmente en tu respuesta, úsala para adaptar tu tono y sugerencias.`,
          });
        }

        if (mood && mood.mood === "CRISIS_ALERT" && mood.confidence >= 0.9) {
          messages.push({
            role: "user",
            content: `[ALERTA DE CRISIS - RESPUESTA OBLIGATORIA]\nEl estudiante ha expresado pensamientos de crisis. Es CRÍTICO que:\n1. Respondas con apoyo emocional inmediato\n2. Proporciones las siguientes líneas de ayuda colombianas:\n   • Línea 106 — Atención en salud mental (24/7)\n   • Línea 123 — Emergencias\n   • Línea 141 — ICBF\n3. NO continúes con contenido académico hasta abordar esto\n\nTu prioridad #1 es la seguridad y bienestar del estudiante.`,
          });
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

        await callDeepseekStream(
          messages,
          {
            temperature: 0.7,
            maxTokens: 800,
          },
          false,
          (chunk) => {
            fullResponse += chunk;
            setDaniMood("explaining");
            setStreamingMessage(fullResponse);
            setDaniMood("explaining");

            pendingSentenceRef.current += chunk;
            while (true) {
              const match = pendingSentenceRef.current.match(/[.!?](?:\s|$)/);
              if (!match) break;
              const endIdx = match.index + 1;
              const sentence = pendingSentenceRef.current
                .slice(0, endIdx)
                .trim();
              pendingSentenceRef.current = pendingSentenceRef.current.slice(
                endIdx + match[0].length,
              );
              if (
                voiceEnabled &&
                sentence.length >= 8 &&
                !isSpeakingRef.current
              ) {
                setIsSpeaking(true);
                isSpeakingRef.current = true;
                const cleanSentence = stripEmoji(sentence);
                if (cleanSentence.length > 0) {
                  const voiceOverrides = getVoiceOverrides(daniMood);
                  speakTextConversational(
                    cleanSentence,
                    "dani",
                    voiceOverrides,
                    () => {
                      setIsSpeaking(false);
                      isSpeakingRef.current = false;
                    },
                    (err) => {
                      setIsSpeaking(false);
                      isSpeakingRef.current = false;
                      if (err && err.includes("bloqueado"))
                        setVoiceBlocked(true);
                    },
                  );
                } else {
                  setIsSpeaking(false);
                  isSpeakingRef.current = false;
                }
              }
            }
          },
        );

        const remaining = pendingSentenceRef.current.trim();
        if (remaining.length >= 8 && voiceEnabled) {
          setIsSpeaking(true);
          isSpeakingRef.current = true;
          const cleanRemaining = stripEmoji(remaining);
          if (cleanRemaining.length > 0) {
            const voiceOverrides = getVoiceOverrides(daniMood);
            speakTextConversational(
              cleanRemaining,
              "dani",
              voiceOverrides,
              () => {
                setIsSpeaking(false);
                isSpeakingRef.current = false;
              },
              (err) => {
                setIsSpeaking(false);
                isSpeakingRef.current = false;
                if (err && err.includes("bloqueado")) setVoiceBlocked(true);
              },
            );
          }
        }

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

        if (mood) {
          recordMoodInference(
            mood.mood,
            mood.confidence,
            userMessage.text.substring(0, 100),
          );
        }

        const subject = extractTopic(userMessage.text);
        if (subject) {
          trackAcademicTopic(subject.topic);
        }
      } catch (error) {
        console.error("Error calling Dani:", error);
        const errorMsg = error.message?.includes("400")
          ? "El servidor no entendió el mensaje. ¿Puedes intentar de nuevo?"
          : error.message?.includes("500")
            ? "El servidor está teniendo problemas. Vuelve a intentar en un momento."
            : error.message?.includes("timeout") ||
                error.message?.includes("Tiempo de espera")
              ? "La respuesta tardó demasiado. ¿Puedes repetirlo?"
              : "Ups, tuve un problema de conexión. ¿Puedes intentar de nuevo? 🙏";
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
    if (isListening) {
      stopRecognition();
      return;
    }
    iniciarReconocimiento(
      setInputText,
      (finalText) => {
        if (finalText.trim()) {
          handleSendMessage(finalText);
        }
      },
      setIsListening,
    );
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
  };
}
