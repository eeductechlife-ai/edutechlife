import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { callDeepseek, callDeepseekStream } from "../../utils/api";
import {
  PROMPT_DANI_EXPERTO,
  PROMPT_TUTOR_TAREAS,
  PROMPT_DANI_SOCRATICO,
} from "../../constants/prompts";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import {
  speakTextConversational,
  stopSpeech,
  iniciarReconocimiento,
  stopRecognition,
} from "../../utils/speech";
import useFocusTrap from "../../hooks/useFocusTrap";
import DaniAvatar from "./dani/DaniAvatar";
import ChartRenderer from "./dani/ChartRenderer";
import VideoEmbed from "./dani/VideoEmbed";
import MessageBubble from "./dani/MessageBubble";
import QuickActions from "./dani/QuickActions";
import RecentTopics from "./dani/RecentTopics";
import { inferMoodFromText, extractTopic } from "./dani/chatUtils";

// ==========================================
// Main Dani Tutor Chat Component
// ==========================================
const DaniTutorChat = memo(({ isOpen, onClose, activeTab }) => {
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

  // ==========================================
  // Rich contextual welcome builder
  // ==========================================
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

    // 1. Greeting
    parts.push(`${greeting}! Soy Dani, tu mentor virtual.`);

    // 2. Streak
    if (streak.current >= 5) {
      parts.push(
        `Llevas ${streak.current} días seguidos, ¡qué impresionante! 🔥`,
      );
    } else if (streak.current >= 2) {
      parts.push(`Ya llevas ${streak.current} días de racha, ¡sigue así!`);
    }

    // 3. Current tab context
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

    // 4. Pending missions (read from localStorage directly)
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

    // 5. Low-progress subjects (only if missions weren't mentioned)
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

    // 6. VAK not completed
    if (!vakResult) {
      parts.push(
        "¿Sabías que aún no has descubierto tu estilo de aprendizaje? Podemos hacer el diagnóstico VAK ahora mismo 🧠",
      );
    }

    // 7. Today's events
    const todayStr = now.toISOString().split("T")[0];
    const todayEvents = calendarEvents.filter((e) => e.date === todayStr);
    if (todayEvents.length > 0) {
      const eventNames = todayEvents.map((e) => e.title).join(", ");
      parts.push(
        `Hoy tienes agendado: ${eventNames}. ¿Cómo te sientes al respecto?`,
      );
    }

    // 8. Final question if none was asked yet
    if (!parts.some((p) => p.includes("¿"))) {
      parts.push("¿En qué te gustaría que te ayude hoy? 😊");
    }

    return parts.join(" ");
  }, [streak, vakResult, calendarEvents, activeTab]);

  // Persist voice preference
  useEffect(() => {
    localStorage.setItem("edutechlife_dani_voice", voiceEnabled);
  }, [voiceEnabled]);

  // Persist socratic mode
  useEffect(() => {
    localStorage.setItem("edutechlife_dani_socratic", socraticMode);
  }, [socraticMode]);

  // Stop speech when chat closes
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [daniChatHistory]);

  // Reset welcome flag so it plays again on next open
  useEffect(() => {
    if (!isOpen) {
      hasSentWelcome.current = false;
    }
  }, [isOpen]);

  // Prime SpeechSynthesis immediately (required by Chrome)
  useEffect(() => {
    if (!isOpen || speechPrimed.current) return;
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("");
        utterance.volume = 0;
        utterance.text = "";
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.cancel();
        speechPrimed.current = true;
      }
    } catch (e) {
      // Silently fail — priming is best-effort
    }
  }, [isOpen]);

  const getVoiceOverrides = useCallback(() => {
    const mood = daniMood || "neutral";
    const map = {
      happy: { pitch: 2, speakingRate: 1.05 },
      excited: { pitch: 3, speakingRate: 1.1 },
      encouraging: { pitch: 1.5, speakingRate: 0.95 },
      thinking: { pitch: -1, speakingRate: 0.85 },
      explaining: { pitch: 0, speakingRate: 0.9 },
      serious: { pitch: -2, speakingRate: 0.85 },
      sad: { pitch: -3, speakingRate: 0.8 },
      supportive: { pitch: 1, speakingRate: 0.9 },
    };
    return map[mood] || {};
  }, [daniMood]);

  // Proactive contextual welcome every time chat opens
  useEffect(() => {
    if (!isOpen || hasSentWelcome.current || daniChatHistory.length > 0) return;
    hasSentWelcome.current = true;
    setIsTyping(true);
    setDaniMood("thinking");

    const welcomeText = buildRichWelcome();

    const showWelcome = () => {
      setIsTyping(false);
      setDaniMood("happy");
      addDaniMessage({ role: "assistant", text: welcomeText });
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      const voiceOverrides = getVoiceOverrides();
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

    // Short delay so the typing indicator is visible
    const timeout = setTimeout(showWelcome, 300);

    return () => clearTimeout(timeout);
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
        // Use document analysis context if available
        const hasDocumentContext = !!documentForDani;
        let systemPrompt = hasDocumentContext
          ? PROMPT_TUTOR_TAREAS
          : PROMPT_DANI_EXPERTO;

        // Inject memory context
        const memoryInjection = buildMemoryInjection();
        if (memoryInjection) {
          systemPrompt += "\n\n" + memoryInjection;
        }

        // Personality adaptation based on memory
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

        // Socratic mode: append socratic instructions
        if (socraticMode) {
          systemPrompt += `\n\n${PROMPT_DANI_SOCRATICO}`;
        }

        // Build context info string
        let contextInfo = buildDaniContext();

        // Inject document analysis if present
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

        // Detect mood from user message (before API call for prompt modification)
        const mood = inferMoodFromText(userMessage.text);

        // Emotional support: modify system prompt if negative mood detected
        if (
          mood &&
          ["triste", "enojado", "ansioso"].includes(mood.mood) &&
          mood.confidence >= 0.7
        ) {
          setShowEmotionalBanner(true);
          systemPrompt += `\n\n## INSTRUCCIÓN DE APOYO EMOCIONAL\nEl estudiante está mostrando signos de ${mood.mood} en su mensaje: "${userMessage.text.substring(0, 100)}". Prioriza la VALIDACIÓN EMOCIONAL antes de continuar con contenido académico. Ofrece estrategias de afrontamiento concretas y un espacio seguro para que el estudiante se exprese.`;
        }

        // Crisis detection: show banner
        if (mood && mood.mood === "CRISIS_ALERT" && mood.confidence >= 0.9) {
          setShowCrisisResources(true);
        }

        // Build messages array for API
        const messages = [{ role: "system", content: systemPrompt }];

        // Add context as a separate user message (not system, to keep it fresh)
        if (contextInfo) {
          messages.push({
            role: "user",
            content: `[INFORMACIÓN DEL ESTUDIANTE - USA ESTO PARA PERSONALIZAR TU RESPUESTA]\n${contextInfo}\n\nNota: Esta información se actualiza en cada mensaje. No la repitas textualmente en tu respuesta, úsala para adaptar tu tono y sugerencias.`,
          });
        }

        // Crisis: inject hotline info into messages
        if (mood && mood.mood === "CRISIS_ALERT" && mood.confidence >= 0.9) {
          messages.push({
            role: "user",
            content: `[ALERTA DE CRISIS - RESPUESTA OBLIGATORIA]\nEl estudiante ha expresado pensamientos de crisis. Es CRÍTICO que:\n1. Respondas con apoyo emocional inmediato\n2. Proporciones las siguientes líneas de ayuda colombianas:\n   • Línea 106 — Atención en salud mental (24/7)\n   • Línea 123 — Emergencias\n   • Línea 141 — ICBF\n3. NO continúes con contenido académico hasta abordar esto\n\nTu prioridad #1 es la seguridad y bienestar del estudiante.`,
          });
        }

        // Add chat history (last 15 messages for token efficiency)
        const history = daniChatHistory.slice(-15).map((msg) => ({
          role: msg.role,
          content: msg.text,
        }));
        messages.push(...history);

        // Add current user message
        messages.push({ role: "user", content: userMessage.text });

        // Clear document context after first use
        if (hasDocumentContext) {
          setDocumentForDani(null);
        }

        // Streaming response with sentence-level TTS
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
                const cleanSentence = sentence
                  .replace(
                    /[😊🔥🧠🎉💙📚💭🌟📅💬🎯🤔📖🔬🌍🎨💻🤖⭐💎📰✨]/gu,
                    "",
                  )
                  .trim();
                if (cleanSentence.length > 0) {
                  const voiceOverrides = getVoiceOverrides();
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

        // Speak remaining text
        const remaining = pendingSentenceRef.current.trim();
        if (remaining.length >= 8 && voiceEnabled) {
          setIsSpeaking(true);
          isSpeakingRef.current = true;
          const cleanRemaining = remaining
            .replace(/[😊🔥🧠🎉💙📚💭🌟📅💬🎯🤔📖🔬🌍🎨💻🤖⭐💎📰✨]/gu, "")
            .trim();
          if (cleanRemaining.length > 0) {
            const voiceOverrides = getVoiceOverrides();
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
        // Check for structured data in response
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
        } catch (e) {
          // Ignore parse errors
        }
        // Parse <memoria> block (invisible to user)
        const cleanResponse = fullResponse
          .replace(/<memoria>[\s\S]*?<\/memoria>/, "")
          .trim();
        addDaniMessage({
          role: "assistant",
          text: cleanResponse || fullResponse,
        });

        // Extract memory metadata
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

        // Record mood inference
        if (mood) {
          recordMoodInference(
            mood.mood,
            mood.confidence,
            userMessage.text.substring(0, 100),
          );
        }

        // Track academic topic
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
      const now = new Date();
      const hour = now.getHours();
      const timeOfDay =
        hour < 12 ? "hoy" : hour < 18 ? "esta tarde" : "esta noche";

      const actionMessages = {
        ayuda_tarea: `Dani, necesito ayuda con mi tarea. ¿Me puedes explicar paso a paso y darme estrategias según mi estilo de aprendizaje?`,
        motivame: `Dani, necesito que me motives un poco. ¿Qué me dirías para seguir adelante con mis estudios ${timeOfDay}?`,
        vak_estrategias: `Dani, recuérdame cuál es mi estilo VAK y dame estrategias concretas para estudiar mejor`,
        que_hacer_hoy: `Dani, ¿qué me recomiendas hacer ${timeOfDay} para ser productivo en mis estudios?`,
        explicar_tema: `Dani, explícame un tema académico interesante de forma fácil y divertida`,
        apoyo_emocional: `Dani, necesito apoyo emocional. No me siento bien y necesito que me ayudes a sentirme mejor.`,
      };

      handleSendMessage(actionMessages[action] || action);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-4 md:p-8"
        style={{ overscrollBehavior: "contain" }}
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chat con Dani"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full max-w-md h-[600px] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
            darkMode
              ? "bg-[#0F172A] border-[#334155]"
              : "bg-[#F8FAFC] border-[#E2E8F0]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <DaniAvatar />
              <div>
                <h3 className="text-white font-bold text-lg">Dani</h3>
                <p className="text-white/80 text-xs">
                  {isSpeaking
                    ? "Hablando..."
                    : isTyping
                      ? "Escribiendo..."
                      : "Tu mentor virtual"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {conversationCount > 0 && (
                <div className="bg-white/15 rounded-full px-2.5 py-1 text-white text-[10px] font-medium">
                  💬 {conversationCount}
                </div>
              )}
              <motion.button
                onClick={toggleVoice}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all relative ${
                  voiceEnabled
                    ? "bg-white/30 text-white hover:bg-white/40"
                    : "bg-white/10 text-white/50 hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={
                  voiceBlocked
                    ? "Voz bloqueada por el navegador — toca para re-intentar"
                    : voiceEnabled
                      ? "Desactivar voz"
                      : "Activar voz"
                }
              >
                {voiceBlocked ? "🔇" : voiceEnabled ? "🔊" : "🔇"}
                {voiceBlocked && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                )}
              </motion.button>
              {streak.current > 0 && (
                <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-bold flex items-center gap-1">
                  🔥 {streak.current}
                </div>
              )}
              <motion.button
                onClick={() => setSocraticMode((prev) => !prev)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                  socraticMode
                    ? "bg-purple-500/40 text-purple-200 hover:bg-purple-500/50"
                    : "bg-white/10 text-white/50 hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={
                  "Modo Socrático: guía con preguntas — " +
                  (socraticMode ? "ACTIVADO" : "DESACTIVADO")
                }
              >
                {socraticMode ? "🧠" : "💬"}
              </motion.button>
            </div>
          </div>

          {/* Crisis Resources Banner */}
          {showCrisisResources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mt-2 px-4 py-3 bg-red-50 border border-red-300 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">🆘</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-800 mb-1">
                    Líneas de ayuda disponibles
                  </p>
                  <p className="text-xs text-red-700 leading-relaxed">
                    <strong>Línea 106</strong> — Atención en salud mental (24/7)
                    {" | "}
                    <strong>Línea 123</strong> — Emergencias{" | "}
                    <strong>Línea 141</strong> — ICBF
                  </p>
                </div>
                <button
                  onClick={() => setShowCrisisResources(false)}
                  className="text-red-400 hover:text-red-600 text-sm"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Emotional Support Banner */}
          {showEmotionalBanner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mt-2 px-3 py-2 bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🤗</span>
                <p className="text-xs text-[#004B63] flex-1">
                  Parece que no te sientes muy bien... ¿Quieres hablar de eso?
                </p>
                <button
                  onClick={() => setShowEmotionalBanner(false)}
                  className="text-[#64748B] hover:text-[#004B63] text-xs"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Mood bar — subtle indicator of recent detected moods */}
          {studentMoodHistory.length > 0 && (
            <div
              className={`flex gap-1 px-4 py-1.5 border-b ${
                darkMode
                  ? "border-[#334155] bg-[#0F172A]"
                  : "border-[#E2E8F0] bg-white/50"
              }`}
            >
              <span className="text-[10px] text-[#64748B] mr-1">Estado:</span>
              {studentMoodHistory.slice(-5).map((m, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    m.mood === "feliz"
                      ? "text-green-500"
                      : m.mood === "triste"
                        ? "text-blue-400"
                        : m.mood === "enojado"
                          ? "text-red-400"
                          : m.mood === "ansioso"
                            ? "text-amber-400"
                            : "text-[#64748B]"
                  }`}
                >
                  {m.mood === "feliz"
                    ? "😊"
                    : m.mood === "triste"
                      ? "😢"
                      : m.mood === "enojado"
                        ? "😤"
                        : m.mood === "ansioso"
                          ? "😰"
                          : m.mood === "confundido"
                            ? "🤔"
                            : "💭"}
                </span>
              ))}
            </div>
          )}

          {/* Document Context Banner */}
          {documentForDani && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mt-2 px-3 py-2 bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#004B63] truncate">
                    Analizando: {documentForDani.title || "Documento"}
                  </p>
                  <p className="text-[10px] text-[#64748B]">
                    {documentForDani.score != null
                      ? `Puntuación: ${documentForDani.score}/100`
                      : "Resumen de estudio"}
                    {documentForDani.subject
                      ? ` • ${documentForDani.subject}`
                      : ""}
                  </p>
                </div>
                <button
                  onClick={() => setDocumentForDani(null)}
                  className="text-[#64748B] hover:text-[#004B63] text-xs"
                  aria-label="Cerrar documento"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Messages Container */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-2 ${
              darkMode ? "scrollbar-thin scrollbar-thumb-[#334155]" : ""
            }`}
            role="log"
            aria-live="polite"
            aria-label="Mensajes del chat"
          >
            {daniChatHistory.map((msg, index) => {
              if (msg.type === "chart") {
                return (
                  <ChartRenderer
                    key={index}
                    chartData={msg.data}
                    darkMode={darkMode}
                  />
                );
              }
              if (msg.type === "video") {
                return (
                  <VideoEmbed
                    key={index}
                    videoData={msg.data}
                    darkMode={darkMode}
                  />
                );
              }
              return (
                <MessageBubble
                  key={index}
                  message={msg}
                  isDani={msg.role === "assistant"}
                  darkMode={darkMode}
                />
              );
            })}
            {streamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="mr-3 mt-1 flex-shrink-0">
                  <DaniAvatar />
                </div>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-md shadow-sm ${
                    darkMode
                      ? "bg-[#1E293B] border border-[#334155] text-[#E2E8F0]"
                      : "bg-white border border-[#E2E8F0] text-[#004B63]"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {streamingMessage}
                    <motion.span
                      className="inline-block w-1.5 h-4 bg-[#4DA8C4] ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  </p>
                </div>
              </motion.div>
            )}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div
                  className={`rounded-2xl rounded-tl-md px-4 py-3 shadow-sm ${
                    darkMode
                      ? "bg-[#1E293B] border border-[#334155]"
                      : "bg-white border border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#4DA8C4] rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} darkMode={darkMode} />

          {/* Recent Topics */}
          <RecentTopics
            topics={academicTopics.filter((t) => t.count > 0)}
            onTopicClick={handleTopicClick}
            darkMode={darkMode}
          />

          {/* Input Area */}
          <div
            className={`p-4 border-t ${
              darkMode
                ? "bg-[#0F172A] border-[#334155]"
                : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSendMessage(inputText)
                }
                placeholder="Pregúntale a Dani..."
                autoFocus
                className={`flex-1 px-4 py-3 rounded-full text-sm focus:outline-none focus:border-[#4DA8C4] placeholder-[#64748B] ${
                  darkMode
                    ? "bg-[#1E293B] border border-[#334155] text-[#E2F0FF] focus:border-[#4DA8C4]"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#004B63]"
                }`}
              />
              <motion.button
                onClick={handleMicClick}
                disabled={isTyping}
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isListening
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#E2E8F0]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isListening ? "Toca para detener" : "Hablar con Dani"}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="w-12 h-12 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white rounded-full flex items-center justify-center disabled:opacity-50 shadow-lg flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

DaniTutorChat.displayName = "DaniTutorChat";

export default DaniTutorChat;
