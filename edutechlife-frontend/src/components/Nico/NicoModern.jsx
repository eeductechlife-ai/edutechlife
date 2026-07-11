import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Bot,
  User,
  CheckCircle,
  RotateCcw,
  Calendar,
} from "lucide-react";
import useConversationMemory from "../../hooks/useConversationMemory";
import useLeadManagement from "../../hooks/useLeadManagement";
import useLeadCaptureLogic from "../../hooks/useLeadCaptureLogic";
import useAppointmentScheduling from "../../hooks/useAppointmentScheduling";
import { callDeepseekStream } from "../../utils/api";
import {
  speakTextConversational,
  stopSpeech,
  warmupTts,
  prefetchTts,
} from "../../utils/speech";
import {
  createSpeechRecognition,
  requestMicrophonePermission,
  getPermissionErrorMessage,
} from "../../utils/speechRecognition";
import { matchIntent } from "./nicoKnowledge";
import {
  getConversationPhase,
  shouldInsertProactiveMessage,
  getProactiveMessageByContext,
} from "./nicoConversation";
import { COLORS } from "./nicoColors";
import { responseCache, CACHE_DURATION, setResponseCache } from "./nicoCache";
import {
  removeEmojis,
  removeGreetingMulletilla,
  shouldAskForName,
} from "./nicoTextUtils";
import {
  extractUserContext,
  getQuickResponse,
  getQuestionSuggestions,
  getConversationOptions,
  optimizeLongConversation,
} from "./nicoContext";
import { PROMPT_NICO_SOPORTE } from "./nicoPrompts";

// Carga diferida para componentes que no se usan inmediatamente
const LeadCaptureForm = lazy(() => import("./LeadCaptureForm"));
const AppointmentScheduler = lazy(() => import("./AppointmentScheduler"));

const NicoModern = ({
  studentName: initialName = "amigo",
  onNavigate,
  onInteraction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [typingDots, setTypingDots] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioActivated, setAudioActivated] = useState(false);
  const [audioPermissionError, setAudioPermissionError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showedConversationOptions, setShowedConversationOptions] =
    useState(false);

  // Estado para contexto de conversación
  const [userContext, setUserContext] = useState({
    userName: null,
    detectedInterest: null,
    studentAge: null,
    conversationStage: "inicio", // 'inicio' | 'descubrimiento' | 'interes' | 'informacion' | 'accion'
    detectedTopics: [], // Array de temas detectados ['VAK', 'STEM', 'Precios']
    conversationPath: [], // Camino de la conversación para evitar repeticiones
    messagesSinceStart: 0, // Contador de mensajes del usuario
    nameAskedOnce: false, // Ya se preguntó el nombre
    dontWantName: false, // Usuario no quiere dar su nombre
    nameUsageCounter: 0, // Controlar uso del nombre cada 3-4 respuestas
  });

  const [conversationPhase, setConversationPhase] = useState("reactive");
  const [lastProactiveIndex, setLastProactiveIndex] = useState(0);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const pendingSentenceRef = useRef("");
  const isSpeakingRef = useRef(false);
  const sentenceQueueRef = useRef([]);
  const speechTimeoutRef = useRef(null);
  const lastStreamUpdateRef = useRef(0);
  const streamFullResponseRef = useRef("");

  const clearSpeechSafetyTimeout = () => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  };

  const setSpeechSafetyTimeout = () => {
    clearSpeechSafetyTimeout();
    speechTimeoutRef.current = setTimeout(() => {
      if (isSpeakingRef.current) {
        isSpeakingRef.current = false;
        stopSpeech();
        speakFromQueue();
      }
    }, 12000);
  };

  const speakFromQueue = () => {
    if (isSpeakingRef.current) return;
    if (sentenceQueueRef.current.length === 0) return;

    // Tomar maximo 3 oraciones para evitar acumular mucho texto
    const sentences = sentenceQueueRef.current.splice(0, 3);
    const combined = sentences.join(" ").trim();

    if (combined.length < 8) return;

    isSpeakingRef.current = true;
    const cleanText = removeEmojis(combined);
    if (cleanText.length === 0) {
      isSpeakingRef.current = false;
      speakFromQueue();
      return;
    }

    setSpeechSafetyTimeout();
    try {
      speakTextConversational(
        cleanText,
        "nico_premium",
        {},
        () => {
          isSpeakingRef.current = false;
          clearSpeechSafetyTimeout();
          speakFromQueue();
        },
        setAudioPermissionError,
      );
    } catch (e) {
      isSpeakingRef.current = false;
      clearSpeechSafetyTimeout();
      speakFromQueue();
    }
  };

  const {
    memory = {},
    processMessage = () => {},
    clearMemory = () => {},
    getContextualPrompt = () => "",
  } = useConversationMemory("nico-chat") || {};

  const { currentLead, updateLeadInfo, saveLead } = useLeadManagement();

  // Lógica de captura de leads
  const {
    showLeadForm,
    leadCaptureContext,
    analyzeMessage,
    shouldShowLeadForm,
    prepareLeadContext,
    showForm,
    hideForm,
    handleLeadSaved,
    getStats,
  } = useLeadCaptureLogic({
    minMessagesBeforeAsk: 3,
    maxMessagesBeforeForce: 8,
    interestThreshold: 0.7,
  });

  const [leadSaved, setLeadSaved] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);

  // Lógica de agendamiento de citas
  const {
    appointments,
    showScheduler,
    schedulerContext,
    recentlyScheduled,
    scheduleAppointment,
    getUpcomingAppointments,
    showSchedulerWithContext,
    hideScheduler,
    clearRecentlyScheduled,
  } = useAppointmentScheduling({
    defaultDuration: 30,
    defaultModality: "videollamada",
    reminderHours: 24,
  });

  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false);

  // Estado para controlar el saludo automático
  const [greetingSent, setGreetingSent] = useState(false);

  // Saludo automático cuando se abre el chat
  useEffect(() => {
    if (isOpen && !greetingSent && (!messages || messages.length === 0)) {
      setGreetingSent(true);

      const greeting =
        "Hola soy Nico, asistente de EdutechLife. ¿En que puedo ayudarte?";

      const greetingMessageObj = {
        role: "assistant",
        content: greeting,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...(prev || []), greetingMessageObj]);

      if (audioEnabled) {
        speakTextConversational(
          greeting,
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }
    }
  }, [isOpen, greetingSent, messages, audioEnabled]);

  useEffect(() => {
    if (messages.length === 0 && memory?.conversationHistory?.length > 0) {
      setMessages(memory.conversationHistory);
    }
  }, []);

  // Inicializar servicios básicos y pre-calentar TTS
  useEffect(() => {
    const initializeServices = async () => {
      try {
        warmupTts();
        // Pre-cachear frases comunes de Nico
        prefetchTts(
          "Hola, soy Nico, asistente de EdutechLife. En que puedo ayudarte?",
          "nico_premium",
        );
        prefetchTts(
          "De nada. Hay algo mas en que pueda ayudarte?",
          "nico_premium",
        );
        prefetchTts(
          "La primera clase es gratuita. Te gustaria agendarla?",
          "nico_premium",
        );
      } catch (error) {
        console.error("Error inicializando servicios:", error);
      }
    };

    initializeServices();

    return () => {
      clearSpeechSafetyTimeout();
      isSpeakingRef.current = false;
      sentenceQueueRef.current = [];
      stopSpeech();
    };
  }, []);

  // Atajos de teclado globales
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Solo procesar atajos si el chat está abierto
      if (!isOpen) return;

      // Ctrl/Cmd + Enter: Enviar mensaje
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (message.trim() && !isLoading) {
          handleSendMessage();
        }
      }

      // Esc: Cerrar chat si está abierto
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        resetChat();
        setIsOpen(false);
      }

      // Ctrl/Cmd + K: Alternar audio
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setAudioEnabled((prev) => !prev);
      }

      // Ctrl/Cmd + M: Alternar micrófono
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isOpen, message, isLoading, isListening]);

  // Función para enviar email de bienvenida (simulación)
  const sendNewLeadNotification = (leadData) => {
    // Solo enviar email si hay dirección de correo
    if (leadData.email) {
      // En un sistema real, aquí se llamaría al servicio de email
    }
  };

  // Función para enviar confirmación de cita por email (simulada)
  const sendAppointmentEmailConfirmation = async (appointmentData) => {
    try {
    } catch (error) {
      console.error("❌ Error en simulación de email:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (overrideText) => {
    const trimmedMessage = (
      typeof overrideText === "string" ? overrideText : message
    ).trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage = trimmedMessage;
    setMessage("");

    const userMessageObj = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, userMessageObj];
      return optimizeLongConversation(newMessages, 25); // Límite de 25 mensajes
    });
    setIsLoading(true);

    // Detectar contexto del usuario (nombre, edad, intereses)
    const detectedContext = extractUserContext(userMessage);
    setUserContext((prev) => {
      // Actualizar temas detectados
      const newTopics = [...prev.detectedTopics];
      if (
        detectedContext.detectedInterest &&
        !newTopics.includes(detectedContext.detectedInterest)
      ) {
        newTopics.push(detectedContext.detectedInterest);
      }

      // Actualizar etapa basada en el mensaje
      let newStage = prev.conversationStage;
      const lowerMsg = userMessage.toLowerCase();
      if (newTopics.length === 0) {
        newStage = "inicio";
      } else if (
        lowerMsg.includes("precio") ||
        lowerMsg.includes("cuesta") ||
        lowerMsg.includes("plan")
      ) {
        newStage = "informacion";
      } else if (
        lowerMsg.includes("inscribir") ||
        lowerMsg.includes("agendar") ||
        lowerMsg.includes("cómo empezar")
      ) {
        newStage = "accion";
      } else if (newTopics.length > 0) {
        newStage = "interes";
      }

      // Determinar si debemos marcar que ya pedimos el nombre
      const shouldAsk = shouldAskForName(prev);
      let newNameAskedOnce = prev.nameAskedOnce;
      if (
        shouldAsk &&
        (lowerMsg.includes("cómo te llamas") ||
          lowerMsg.includes("tu nombre") ||
          lowerMsg.includes("te llamas"))
      ) {
        newNameAskedOnce = true;
      }

      // Si el usuario proporciona su nombre, usar ese valor
      // Si el usuario dice que no quiere dar su nombre, marcar dontWantName
      const newDontWantName = detectedContext.dontWantName
        ? true
        : prev.dontWantName && !detectedContext.userName;

      return {
        ...prev,
        userName: detectedContext.userName || prev.userName,
        studentAge: detectedContext.studentAge || prev.studentAge,
        detectedInterest:
          detectedContext.detectedInterest || prev.detectedInterest,
        conversationStage: newStage,
        detectedTopics: newTopics.slice(-5), // Mantener últimos 5 temas
        messagesSinceStart: prev.messagesSinceStart + 1, // Incrementar contador de mensajes
        nameAskedOnce: newNameAskedOnce,
        dontWantName: newDontWantName,
      };
    });

    // Primero verificar si hay respuesta rápida disponible
    const quickResponse = getQuickResponse(userMessage, userContext);
    if (quickResponse) {
      // Primero eliminar muletilla de presentación
      const noMulletilla = removeGreetingMulletilla(quickResponse);
      // Luego limpiar emojis
      const cleanResponse = removeEmojis(noMulletilla);

      // Respuesta inmediata sin llamar a API
      const assistantMessageObj = {
        role: "assistant",
        content: cleanResponse,
        timestamp: new Date().toISOString(),
        isQuickResponse: true,
      };

      setMessages((prev) => {
        const newMessages = [...prev, assistantMessageObj];
        return optimizeLongConversation(newMessages, 25);
      });
      processMessage("assistant", quickResponse);

      // Voz inmediata
      if (audioEnabled) {
        const noMulletillaVoice = removeGreetingMulletilla(quickResponse);
        const textToSpeak = removeEmojis(noMulletillaVoice);
        speakTextConversational(
          textToSpeak,
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }

      // Track user message count for proactive phase
      setUserMessageCount((prev) => prev + 1);
      const currentPhase = getConversationPhase(userMessageCount + 1);
      setConversationPhase(currentPhase);

      setIsLoading(false);
      return;
    }

    // Procesamiento en paralelo para velocidad
    processMessage("user", userMessage);

    // Análisis simplificado para leads
    const analysis = analyzeMessage(userMessage, "user");

    // Verificación rápida de formulario de lead
    if (!showLeadForm && !leadSaved) {
      const shouldShow = shouldShowLeadForm(
        analysis,
        memory?.userName || initialName,
      );

      if (shouldShow) {
        const context = prepareLeadContext(
          analysis,
          memory?.userName || initialName,
          {
            userName: memory?.userName,
            primaryInterest: memory?.userProfile?.interests?.[0],
          },
        );

        showForm(context);
        setIsLoading(false);
        return;
      }
    }

    // Verificar si el usuario respondió positivamente a la pregunta de agendamiento
    const lowerMessage = userMessage.toLowerCase();
    const lastMessage = messages[messages.length - 1];
    const isAppointmentResponse = lastMessage?.isAppointmentPrompt;

    if (isAppointmentResponse) {
      const positiveResponses = [
        "sí",
        "si",
        "claro",
        "por supuesto",
        "me encantaría",
        "quiero",
        "agenda",
        "agendar",
        "sí quiero",
        "si quiero",
      ];
      const negativeResponses = [
        "no",
        "ahora no",
        "después",
        "más tarde",
        "no gracias",
      ];

      const isPositive = positiveResponses.some((response) =>
        lowerMessage.includes(response),
      );
      const isNegative = negativeResponses.some((response) =>
        lowerMessage.includes(response),
      );

      if (isPositive) {
        // Mostrar scheduler de citas

        // Buscar datos del lead más reciente
        const recentLead = messages.find((msg) => msg.isLeadSuccess);
        let leadData = {};

        if (recentLead) {
          // Extraer nombre del mensaje de éxito
          const nameMatch = recentLead.content.match(/Perfecto (\w+),/);
          if (nameMatch) {
            leadData.nombreCompleto = nameMatch[1];
          }
        }

        showSchedulerWithContext({
          leadData,
          interest: memory?.userProfile?.interests?.[0] || "Consulta general",
        });

        setIsLoading(false);
        return;
      } else if (isNegative) {
        // Respuesta negativa - continuar conversación normalmente
        // Continuar con flujo normal
      }
    }

    try {
      // 1. Try local knowledge engine first (instant, no API call)
      const localMatch = matchIntent(userMessage);
      if (localMatch) {
        const cleanResponse = removeEmojis(localMatch.response);
        const assistantMessageObj = {
          role: "assistant",
          content: cleanResponse,
          timestamp: new Date().toISOString(),
          isLocalResponse: true,
        };
        setMessages((prev) => {
          const newMessages = [...prev, assistantMessageObj];
          return optimizeLongConversation(newMessages, 25);
        });
        processMessage("assistant", cleanResponse);

        if (audioEnabled) {
          speakTextConversational(
            cleanResponse,
            "nico_premium",
            {},
            undefined,
            setAudioPermissionError,
          );
        }

        setUserMessageCount((prev) => prev + 1);
        setUserContext((prev) => ({
          ...prev,
          messagesSinceStart: prev.messagesSinceStart + 1,
        }));

        const currentPhase = getConversationPhase(userMessageCount + 1);
        setConversationPhase(currentPhase);
        if (
          shouldInsertProactiveMessage(
            currentPhase,
            userMessageCount + 1,
            lastProactiveIndex,
          )
        ) {
          setTimeout(() => {
            const proactiveMsg = getProactiveMessageByContext(
              currentPhase,
              userContext.detectedTopics,
              userContext.userName,
            );
            if (proactiveMsg) {
              const proactiveObj = {
                role: "assistant",
                content: proactiveMsg,
                timestamp: new Date().toISOString(),
                isProactive: true,
              };
              setMessages((prev) => [...prev, proactiveObj]);
              setLastProactiveIndex(userMessageCount + 1);
              if (audioEnabled) {
                speakTextConversational(
                  proactiveMsg,
                  "nico_premium",
                  {},
                  undefined,
                  setAudioPermissionError,
                );
              }
            }
          }, 500);
        }

        setIsLoading(false);
        return;
      }

      // 2. No local match — use cache or streaming
      const cacheKey = userMessage.toLowerCase().trim();
      const cached = responseCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        const cleanResponse = removeEmojis(cached.response);
        const assistantMessageObj = {
          role: "assistant",
          content: cleanResponse,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => {
          const newMessages = [...prev, assistantMessageObj];
          return optimizeLongConversation(newMessages, 25);
        });
        processMessage("assistant", cached.response);

        if (audioEnabled) {
          speakTextConversational(
            cleanResponse,
            "nico_premium",
            {},
            undefined,
            setAudioPermissionError,
          );
        }
      } else {
        // Contexto simplificado para velocidad
        const memoryContext = getContextualPrompt();
        const userNameFromState = userContext?.userName;
        const contextInfo = userNameFromState
          ? `El usuario se llama ${userNameFromState}.`
          : "";
        const enhancedSystemPrompt = memoryContext
          ? `${PROMPT_NICO_SOPORTE}\nContexto: ${memoryContext.substring(0, 500)} ${contextInfo}`
          : `${PROMPT_NICO_SOPORTE} ${contextInfo}`;

        // Create placeholder message
        const placeholderObj = {
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
          isStreaming: true,
        };
        setMessages((prev) => [...prev, placeholderObj]);

        // Stream the response
        let fullResponse = "";
        const streamMessages = [
          { role: "system", content: enhancedSystemPrompt },
          { role: "user", content: userMessage },
        ];
        await callDeepseekStream(
          streamMessages,
          { maxTokens: 2000, temperature: 0.7 },
          false,
          (chunk) => {
            fullResponse += chunk;
            const now = Date.now();
            if (now - lastStreamUpdateRef.current >= 80) {
              lastStreamUpdateRef.current = now;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.isStreaming) {
                  updated[updated.length - 1] = {
                    ...last,
                    content: removeEmojis(fullResponse),
                  };
                }
                return updated;
              });
            }

            if (audioEnabled) {
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
                // Si no se esta hablando, hablar inmediato
                if (sentence.length >= 8 && !isSpeakingRef.current) {
                  isSpeakingRef.current = true;
                  const cleanSentence = removeEmojis(sentence);
                  if (cleanSentence.length > 0) {
                    setSpeechSafetyTimeout();
                    speakTextConversational(
                      cleanSentence,
                      "nico_premium",
                      {},
                      () => {
                        isSpeakingRef.current = false;
                        clearSpeechSafetyTimeout();
                        speakFromQueue();
                      },
                      setAudioPermissionError,
                    ).catch(() => {
                      isSpeakingRef.current = false;
                      clearSpeechSafetyTimeout();
                      speakFromQueue();
                    });
                  } else {
                    isSpeakingRef.current = false;
                  }
                } else if (sentence.length >= 3) {
                  // Si ya se esta hablando, encolar
                  sentenceQueueRef.current.push(sentence);
                }
              }
            }
          },
        );

        // Mark as complete (force full content in case throttled)
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last) {
            updated[updated.length - 1] = {
              ...last,
              content: removeEmojis(fullResponse),
              isStreaming: false,
            };
          }
          return updated;
        });

        // Cache
        setResponseCache(cacheKey, {
          response: fullResponse,
          timestamp: Date.now(),
        });
        processMessage("assistant", fullResponse);

        // Speak remaining text after streaming
        if (audioEnabled) {
          const remaining = pendingSentenceRef.current.trim();
          if (remaining.length >= 3) {
            sentenceQueueRef.current.push(remaining);
          }
          pendingSentenceRef.current = "";
          if (sentenceQueueRef.current.length > 0) {
            if (!isSpeakingRef.current) {
              speakFromQueue();
            }
          }
        }
      }

      // Verificar si debemos mostrar opciones de conversación
      const userMsgCount =
        messages.filter((msg) => msg.role === "user").length + 1;
      if (userMsgCount >= 2 && !showedConversationOptions) {
        setTimeout(() => {
          const options = getConversationOptions([...messages], userContext);
          if (options) {
            setShowedConversationOptions(true);
            const optionsMessage = {
              role: "assistant",
              content:
                "Para hacer nuestra conversación más productiva, ¿te gustaría...",
              timestamp: new Date().toISOString(),
              hasOptions: true,
              options: options,
            };
            setMessages((prev) => {
              const newMessages = [...prev, optionsMessage];
              return optimizeLongConversation(newMessages, 25);
            });
          }
        }, 300);
      }

      // Actualización rápida de lead si existe
      if (currentLead) {
        updateLeadInfo({
          lastInteraction: new Date().toISOString(),
          lastMessage: userMessage,
        });
      }

      // Track user message count for proactive phase
      setUserMessageCount((prev) => prev + 1);
      const currentPhase = getConversationPhase(userMessageCount + 1);
      setConversationPhase(currentPhase);
      if (
        shouldInsertProactiveMessage(
          currentPhase,
          userMessageCount + 1,
          lastProactiveIndex,
        )
      ) {
        setTimeout(() => {
          const proactiveMsg = getProactiveMessageByContext(
            currentPhase,
            userContext.detectedTopics,
            userContext.userName,
          );
          if (proactiveMsg) {
            const proactiveObj = {
              role: "assistant",
              content: proactiveMsg,
              timestamp: new Date().toISOString(),
              isProactive: true,
            };
            setMessages((prev) => [...prev, proactiveObj]);
            setLastProactiveIndex(userMessageCount + 1);
            if (audioEnabled) {
              speakTextConversational(
                proactiveMsg,
                "nico_premium",
                {},
                undefined,
                setAudioPermissionError,
              );
            }
          }
        }, 500);
      }
    } catch (error) {
      console.warn("Error en respuesta:", error.message);

      // Respuesta de error según el tipo
      const isTimeout =
        error.message?.includes("tiempo") ||
        error.message?.includes("timeout") ||
        error.message?.includes("Timeout");
      const errorMessage = isTimeout
        ? `El servicio esta tardando mucho en responder. ¿Quieres preguntarme por nuestros servicios educativos como VAK, STEM, tutorías o bienestar?`
        : `Hubo un problema de conexion. Puedo contarte sobre VAK, STEM, tutorías y bienestar. ¿Te interesa alguno?`;

      const noMulletillaError = removeGreetingMulletilla(errorMessage);
      const cleanErrorMessage = removeEmojis(noMulletillaError);

      const errorMessageObj = {
        role: "assistant",
        content: cleanErrorMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessageObj]);

      if (audioEnabled) {
        speakTextConversational(
          cleanErrorMessage,
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para guardar lead desde el formulario
  const handleSaveLead = async (leadData) => {
    try {
      // Crear lead en el sistema de gestión
      const leadId = saveLead({
        nombre: leadData.nombreCompleto,
        telefono: leadData.telefono,
        email: leadData.email,
        motivo: leadData.interesPrincipal || "Interés general",
        messages: messages.slice(-10), // Últimos 10 mensajes para contexto
      });

      // Actualizar estado
      setLeadSaved(true);
      setShowLeadSuccess(true);

      // Ocultar éxito después de 5 segundos
      setTimeout(() => {
        setShowLeadSuccess(false);
      }, 5000);

      // Manejar en la lógica de captura
      handleLeadSaved(leadData);

      // Enviar notificaciones de nuevo lead
      sendNewLeadNotification(leadData);

      // Track lead capture (simplified)

      // Agregar mensaje de confirmación al chat
      const successMessage = {
        role: "assistant",
        content: `Perfecto ${leadData.nombreCompleto.split(" ")[0]}, hemos registrado tu interes en ${leadData.interesPrincipal || "nuestros servicios"}.`,
        timestamp: new Date().toISOString(),
        isLeadSuccess: true,
      };

      setMessages((prev) => [...prev, successMessage]);

      // Preguntar si quiere agendar cita (después de 500ms)
      setTimeout(() => {
        const appointmentQuestion = {
          role: "assistant",
          content: `¿Te gustaría agendar una llamada gratuita con uno de nuestros especialistas para profundizar en ${leadData.interesPrincipal || "tus necesidades"}?`,
          timestamp: new Date().toISOString(),
          isAppointmentPrompt: true,
        };

        setMessages((prev) => [...prev, appointmentQuestion]);

        // Hablar la pregunta si audio está activado
        if (audioEnabled) {
          setTimeout(() => {
            speakTextConversational(
              removeEmojis(appointmentQuestion.content),
              "nico_premium",
              {},
              () => console.log("✅ Pregunta de agendamiento hablada"),
              undefined,
            );
          }, 400);
        }
      }, 500);

      // Hablar confirmación inicial si audio está activado
      if (audioEnabled) {
        speakTextConversational(
          removeEmojis(successMessage.content),
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }

      // Guardar datos del lead para posible agendamiento
      const leadForScheduling = {
        id: leadId,
        ...leadData,
      };

      return leadForScheduling;
    } catch (error) {
      console.error("Error guardando lead:", error);

      // Mensaje de error al usuario
      const errorMessage = {
        role: "assistant",
        content:
          "Hubo un error al guardar tu informacion. Por favor intenta de nuevo o contacta directamente por WhatsApp.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      throw error;
    }
  };

  // Función para manejar agendamiento de citas
  const handleScheduleAppointment = async (appointmentData) => {
    try {
      // Agendar la cita
      const appointment = scheduleAppointment(appointmentData);

      // Enviar confirmación por email (simulación)
      sendAppointmentEmailConfirmation(appointmentData);

      // Mostrar éxito
      setShowAppointmentSuccess(true);

      // Ocultar éxito después de 5 segundos
      setTimeout(() => {
        setShowAppointmentSuccess(false);
      }, 5000);

      // Track appointment scheduling (simplified)

      // Appointment scheduled successfully

      // Agregar mensaje de confirmación al chat
      const successMessage = {
        role: "assistant",
        content: `Excelente. Hemos agendado tu llamada para el ${new Date(appointmentData.date).toLocaleDateString("es-CO")} a las ${appointmentData.time}. Recibiras confirmacion por ${appointmentData.leadPhone ? "WhatsApp" : "email"}.`,
        timestamp: new Date().toISOString(),
        isAppointmentSuccess: true,
      };

      setMessages((prev) => [...prev, successMessage]);

      // Hablar confirmación si audio está activado
      if (audioEnabled) {
        speakTextConversational(
          removeEmojis(successMessage.content),
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }

      return appointment;
    } catch (error) {
      console.error("❌ Error agendando cita:", error);

      // Mensaje de error al usuario
      const errorMessage = {
        role: "assistant",
        content:
          "⚠️ Hubo un error al agendar la cita. Por favor intenta de nuevo o contacta directamente por WhatsApp.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      throw error;
    }
  };

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const speechRecognition = createSpeechRecognition({
      onResult: (fullText, finalText, hasFinal) => {
        // Escribir cada palabra detectada directamente en el textarea
        setMessage(fullText);

        // Mostrar texto interino si no es final
        if (!hasFinal) {
          // Extraer solo la parte interina (lo nuevo desde el último texto final)
          const interimOnly = fullText.replace(finalText, "").trim();
          if (interimOnly) {
            setInterimTranscript(interimOnly);
          }
        } else {
          setInterimTranscript("");
        }
      },
      onEnd: (finalText) => {
        setIsListening(false);
        setInterimTranscript("");

        // Si hay texto final, enviar automáticamente con el texto directo
        if (finalText && finalText.trim() !== "") {
          setMessage(finalText);
          handleSendMessage(finalText);
        }
      },
      onError: (error, message) => {
        console.error("Speech recognition error:", error, message);
        setIsListening(false);
        setInterimTranscript("");
      },
    });

    setRecognition(speechRecognition?.recognition || null);
    speechRecognitionRef.current = speechRecognition;

    return () => {
      if (speechRecognition) {
        speechRecognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setTypingDots((prev) => (prev + 1) % 4);
      }, 300);
    } else {
      setTypingDots(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleVoiceInput = async () => {
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
      setInterimTranscript("");
      return;
    }

    if (!recognition) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "🔇 El reconocimiento de voz no está disponible en este navegador. Prueba con Chrome o Safari.",
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
      return;
    }

    const permission = await requestMicrophonePermission();
    if (!permission.success) {
      console.error("Microphone permission error:", permission.error);
      const errorContent =
        permission.error === "NotAllowedError"
          ? "🔇 Permiso de micrófono denegado. Para usar voz, habilita el micrófono en la configuración de tu navegador y recarga la página."
          : `🔇 ${permission.message}`;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorContent,
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
      setInterimTranscript("Escuchando...");
    } catch (error) {
      console.error("Error starting recognition:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "🔇 Error al iniciar el reconocimiento de voz. Por favor, intenta de nuevo.",
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    }
  };

  const handleSpeakResponse = async () => {
    const lastAssistantMessage = messages
      .slice()
      .reverse()
      .find((msg) => msg.role === "assistant" && !msg.isError);

    if (!lastAssistantMessage) return;

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    setAudioPermissionError(null);

    const textToSpeak = removeEmojis(lastAssistantMessage.content);

    if (!textToSpeak || textToSpeak.trim() === "") {
      setIsSpeaking(false);
      return;
    }

    try {
      speakTextConversational(
        textToSpeak,
        "nico_premium",
        {},
        () => {
          setIsSpeaking(false);
        },
        setAudioPermissionError,
      );
    } catch (error) {
      console.error("❌ Error de voz:", error.message);
      setAudioPermissionError(error.message);
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Función para reiniciar completamente el chat
  const resetChat = () => {
    setMessages([]);
    setMessage("");
    setIsLoading(false);
    setIsListening(false);
    setIsSpeaking(false);
    setShowSuggestions(true);
    setShowedConversationOptions(false);
    setGreetingSent(false); // Reiniciar estado del saludo
    isSpeakingRef.current = false;
    clearSpeechSafetyTimeout();
    sentenceQueueRef.current = [];
    stopSpeech();

    // Limpiar memoria de conversación
    clearMemory();

    // Limpiar caché de respuestas para esta sesión
    responseCache.clear();

    // Detener reconocimiento de voz si está activo
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }

    // Cerrar formularios si están abiertos
    if (showLeadForm) hideForm();
    if (showScheduler) hideScheduler();
    setShowLeadSuccess(false);
    setShowAppointmentSuccess(false);
  };

  // Función para iniciar nueva conversación sin cerrar el chat
  const startNewConversation = () => {
    resetChat();
  };

  const toggleChat = () => {
    const willOpen = !isOpen;

    // Si se va a CERRAR el chat, reiniciar todo
    if (!willOpen) {
      resetChat();
    }

    setIsOpen(willOpen);

    // Feedback táctil si está disponible
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // Vibración corta de 50ms
    }

    if (willOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);

      // Saludo automático inmediato al abrir el chat
      if (messages.length === 0) {
        // Chat vacío: Saludo exacto solicitado
        const welcomeMessage = `Hola soy Nico, asistente de EdutechLife. ¿En que puedo ayudarte?`;

        // Mensaje de bienvenida inmediato
        const welcomeMessageObj = {
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, welcomeMessageObj]);

        // Voz automática inmediata - sin setTimeout para preservar gesto del usuario
        if (audioEnabled) {
          const textToSpeak = removeEmojis(welcomeMessage);
          speakTextConversational(
            textToSpeak,
            "nico_premium",
            {},
            undefined,
            setAudioPermissionError,
          );
        }
      } else if (audioEnabled) {
        // Reconexión: saludo rápido en voz
        const userName = memory?.userName || initialName;
        const nameGreeting = userName !== "amigo" ? ` ${userName}` : "";
        const reconnectMessage = `Hola soy Nico, asistente de EdutechLife. ¿En que puedo ayudarte?${nameGreeting}`;
        const textToSpeak = removeEmojis(reconnectMessage);
        speakTextConversational(
          textToSpeak,
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const clearChat = () => {
    setMessages([]);
    clearMemory();
  };

  const clearCache = () => {
    responseCache.clear();
    const cacheClearedMessage = {
      role: "assistant",
      content:
        "✅ Caché limpiado. Las próximas respuestas se generarán desde cero.",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, cacheClearedMessage]);
  };

  const viewHistory = () => {
    setShowHistory(!showHistory);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-gentle-pulse safe-area-bottom flex items-center justify-center"
        style={{
          backgroundColor: COLORS.PETROLEUM,
          background: `linear-gradient(135deg, ${COLORS.PETROLEUM} 0%, ${COLORS.CORPORATE} 100%)`,
        }}
      >
        <Bot className="w-8 h-8 text-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 ${isExpanded ? "inset-0 md:inset-4" : "bottom-4 right-4 md:bottom-6 md:right-6"} transition-all duration-300`}
    >
      <div
        className={`flex flex-col bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 ${
          isExpanded
            ? "w-full h-full"
            : "w-[calc(100vw-2rem)] md:w-96 h-[500px] md:h-[600px] max-w-md"
        }`}
        style={{ borderColor: COLORS.SOFT_BLUE }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: COLORS.NAVY }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.CORPORATE }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
                style={{ backgroundColor: COLORS.MINT }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white">Nico</h3>
              <p className="text-xs" style={{ color: COLORS.SOFT_BLUE }}>
                EdutechLife AI Support
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newAudioEnabled = !audioEnabled;
                setAudioEnabled(newAudioEnabled);
                setAudioPermissionError(null);

                // Feedback inmediato
                if (newAudioEnabled) {
                  // Si se activa el audio, Nico confirma
                  const confirmation = "Audio activado. Puedes hablar conmigo.";
                  speakTextConversational(
                    confirmation,
                    "nico_premium",
                    {},
                    undefined,
                    setAudioPermissionError,
                  );
                } else {
                  // Si se desactiva, detener cualquier audio en curso
                  stopSpeech();
                }
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                audioEnabled
                  ? "scale-105 ring-2 ring-opacity-50"
                  : "hover:opacity-80"
              }`}
              style={{
                backgroundColor: audioEnabled ? COLORS.MINT : COLORS.PETROLEUM,
                border: audioEnabled ? `2px solid ${COLORS.CORPORATE}` : "none",
              }}
              title={audioEnabled ? "Desactivar audio" : "Activar audio"}
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-white" />
              ) : (
                <VolumeX className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Botón Nueva Conversación */}
            <button
              onClick={startNewConversation}
              className="p-2 rounded-lg hover:opacity-80 transition"
              style={{ backgroundColor: COLORS.CORPORATE }}
              title="Nueva Conversación"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={toggleChat}
              className="p-2 rounded-lg hover:opacity-80 transition"
              style={{ backgroundColor: COLORS.PETROLEUM }}
              title="Cerrar"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{
            backgroundColor: COLORS.NAVY,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${COLORS.PETROLEUM}20 0%, transparent 50%)`,
          }}
        >
          {(messages || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: COLORS.CORPORATE }}
              >
                <Bot className="w-10 h-10 text-white -mt-1" />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: COLORS.SOFT_BLUE }}
              >
                Nico
              </h3>
              <p className="text-sm mb-6" style={{ color: COLORS.MINT }}>
                Asistente de EdutechLife
              </p>
              <p className="text-sm mb-6" style={{ color: COLORS.CORPORATE }}>
                Puedo ayudarte con información sobre nuestros servicios
                educativos: VAK, STEM, tutorías y bienestar.
              </p>
              <p className="text-xs italic mb-4" style={{ color: COLORS.MINT }}>
                Escribe tu pregunta en el campo de abajo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 ${
                      msg.role === "user"
                        ? "rounded-br-none"
                        : msg.isSystem
                          ? "rounded-2xl"
                          : "rounded-bl-none"
                    }`}
                    style={{
                      backgroundColor:
                        msg.role === "user"
                          ? COLORS.CORPORATE
                          : msg.isSystem
                            ? COLORS.NAVY + "40"
                            : COLORS.SOFT_BLUE,
                      color: msg.role === "user" ? "white" : COLORS.NAVY,
                      border: msg.isSystem
                        ? "1px solid " + COLORS.MINT + "40"
                        : "none",
                      fontStyle: msg.isSystem ? "italic" : "normal",
                    }}
                  >
                    {!msg.isSystem && (
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {msg.role === "user" ? (
                            <User className="w-4 h-4 mr-2" />
                          ) : (
                            <Bot
                              className="w-4 h-4 mr-2"
                              style={{ color: COLORS.PETROLEUM }}
                            />
                          )}
                          <span className="text-xs font-semibold">
                            {msg.role === "user" ? "Tú" : "Nico"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {msg.isQuickResponse && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              ⚡
                            </span>
                          )}
                          {msg.isCached && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              💾
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm mb-3">
                      {msg.content}
                    </p>

                    {/* Opciones de conversación */}
                    {msg.hasOptions && msg.options && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex flex-col space-y-2">
                          {msg.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                // Manejar diferentes acciones
                                if (
                                  option.action.startsWith("schedule_") ||
                                  option.action.startsWith("demo_") ||
                                  option.action.startsWith("trial_")
                                ) {
                                  // Para acciones de agendamiento, mostrar formulario
                                  const interest = option.action.includes("vak")
                                    ? "VAK"
                                    : option.action.includes("stem")
                                      ? "STEM"
                                      : option.action.includes("tutoring")
                                        ? "Tutorías"
                                        : "Consulta general";
                                  showSchedulerWithContext({
                                    leadData: {},
                                    interest: interest,
                                  });
                                } else if (
                                  option.action.startsWith("info_") ||
                                  option.action.startsWith("learn_") ||
                                  option.action.startsWith("view_")
                                ) {
                                  // Para acciones informativas, enviar pregunta relacionada
                                  setMessage(option.text);
                                  setTimeout(() => {
                                    if (inputRef.current) {
                                      inputRef.current.focus();
                                      setTimeout(
                                        () => handleSendMessage(),
                                        100,
                                      );
                                    }
                                  }, 50);
                                } else if (
                                  option.action === "test_vak" ||
                                  option.action === "meet_tutors"
                                ) {
                                  // Para acciones específicas, enviar mensaje contextual
                                  const question =
                                    option.action === "test_vak"
                                      ? "¿Cómo funciona el test VAK y cómo puedo hacerlo?"
                                      : "¿Cómo puedo conocer a los tutores disponibles?";
                                  setMessage(question);
                                  setTimeout(() => {
                                    if (inputRef.current) {
                                      inputRef.current.focus();
                                      setTimeout(
                                        () => handleSendMessage(),
                                        100,
                                      );
                                    }
                                  }, 50);
                                }
                              }}
                              className="text-left p-3 rounded-lg hover:scale-[1.02] transition active:scale-95 text-sm"
                              style={{
                                backgroundColor: COLORS.SOFT_BLUE,
                                color: COLORS.NAVY,
                                border: `1px solid ${COLORS.CORPORATE}`,
                              }}
                            >
                              {option.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Sugerencias de preguntas contextuales */}
              {showSuggestions &&
                messages.length > 0 &&
                !showLeadForm &&
                !showScheduler && (
                  <div className="mt-4 mb-2">
                    <p className="text-xs font-medium mb-2 text-gray-500">
                      ¿Te interesa saber sobre...?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getQuestionSuggestions(messages, userContext).map(
                        (suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setMessage(suggestion);
                              setTimeout(() => {
                                if (inputRef.current) {
                                  inputRef.current.focus();
                                }
                              }, 50);
                            }}
                            className="text-xs px-3 py-2 rounded-full hover:scale-105 transition active:scale-95"
                            style={{
                              backgroundColor: COLORS.SOFT_BLUE,
                              color: COLORS.NAVY,
                              border: `1px solid ${COLORS.CORPORATE}40`,
                            }}
                          >
                            {suggestion}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="text-xs mt-2 text-gray-400 hover:text-gray-600"
                    >
                      Ocultar sugerencias
                    </button>
                  </div>
                )}

              {/* Botón para mostrar sugerencias si están ocultas */}
              {!showSuggestions &&
                messages.length > 2 &&
                !showLeadForm &&
                !showScheduler && (
                  <button
                    onClick={() => setShowSuggestions(true)}
                    className="text-xs mt-2 text-gray-400 hover:text-gray-600 flex items-center"
                  >
                    <span>💡 Mostrar sugerencias de preguntas</span>
                  </button>
                )}

              {/* Formulario de Captura de Leads */}
              {showLeadForm && leadCaptureContext && (
                <div className="mb-4 animate-slideUp">
                  <Suspense
                    fallback={
                      <div className="p-4 text-center text-gray-500">
                        Cargando formulario...
                      </div>
                    }
                  >
                    <LeadCaptureForm
                      userName={leadCaptureContext.userName}
                      userInterest={leadCaptureContext.userInterest}
                      onSave={handleSaveLead}
                      onCancel={hideForm}
                      autoFocus={true}
                    />
                  </Suspense>
                </div>
              )}

              {/* Confirmación de Lead Guardado */}
              {showLeadSuccess && (
                <div
                  className="mb-4 p-4 rounded-xl animate-fadeIn"
                  style={{
                    backgroundColor: COLORS.MINT + "40",
                    border: `2px solid ${COLORS.MINT}`,
                  }}
                >
                  <div className="flex items-center">
                    <CheckCircle
                      className="w-5 h-5 mr-2"
                      style={{ color: COLORS.PETROLEUM }}
                    />
                    <div>
                      <p className="font-medium" style={{ color: COLORS.NAVY }}>
                        ✅ Información guardada exitosamente
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.PETROLEUM }}
                      >
                        Un asesor se contactará contigo pronto
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scheduler de Citas */}
              {showScheduler && schedulerContext && (
                <div className="mb-4 animate-slideUp">
                  <Suspense
                    fallback={
                      <div className="p-4 text-center text-gray-500">
                        Cargando calendario...
                      </div>
                    }
                  >
                    <AppointmentScheduler
                      leadData={schedulerContext.leadData}
                      onSchedule={handleScheduleAppointment}
                      onCancel={hideScheduler}
                      autoFocus={true}
                    />
                  </Suspense>
                </div>
              )}

              {/* Confirmación de Cita Agendada */}
              {showAppointmentSuccess && (
                <div
                  className="mb-4 p-4 rounded-xl animate-fadeIn"
                  style={{
                    backgroundColor: COLORS.CORPORATE + "40",
                    border: `2px solid ${COLORS.CORPORATE}`,
                  }}
                >
                  <div className="flex items-center">
                    <Calendar
                      className="w-5 h-5 mr-2"
                      style={{ color: COLORS.PETROLEUM }}
                    />
                    <div>
                      <p className="font-medium" style={{ color: COLORS.NAVY }}>
                        📅 Cita agendada exitosamente
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.PETROLEUM }}
                      >
                        Recibirás confirmación y recordatorio
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Panel de Recordatorios y Agenda */}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[80%] rounded-2xl rounded-bl-none p-4"
                    style={{ backgroundColor: COLORS.SOFT_BLUE }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: COLORS.PETROLEUM }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: COLORS.CORPORATE,
                            animationDelay: "0.1s",
                          }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: COLORS.MINT,
                            animationDelay: "0.2s",
                          }}
                        />
                      </div>
                      <span style={{ color: COLORS.NAVY }}>
                        Nico está pensando...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="p-4 border-t"
          style={{
            backgroundColor: COLORS.NAVY,
            borderColor: COLORS.PETROLEUM,
          }}
        >
          {interimTranscript && (
            <div
              className="mb-3 p-3 rounded-xl animate-pulse"
              style={{
                backgroundColor: COLORS.MINT + "40",
                border: `1px solid ${COLORS.MINT}`,
              }}
            >
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <div
                    className="w-2 h-2 rounded-full bg-red-500 animate-ping"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-ping"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: COLORS.NAVY }}
                >
                  {interimTranscript}
                </span>
              </div>
            </div>
          )}

          {audioPermissionError && (
            <div
              className="mb-3 p-3 rounded-xl"
              style={{
                backgroundColor: "#FFEBEE",
                border: "1px solid #EF9A9A",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#C62828" }}
                  >
                    🔇 Audio bloqueado. Presiona el botón de volumen y concede
                    permisos.
                  </span>
                </div>
                <button
                  onClick={() => setAudioPermissionError(null)}
                  className="ml-2 p-1 rounded hover:bg-red-100"
                  aria-label="Descartar"
                >
                  <X className="w-4 h-4" style={{ color: "#C62828" }} />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isListening
                  ? "scale-105 ring-4 ring-opacity-50"
                  : "hover:scale-105"
              }`}
              style={{
                backgroundColor: isListening ? "#FF4757" : COLORS.PETROLEUM,
                boxShadow: isListening ? `0 0 20px ${COLORS.MINT}80` : "none",
              }}
              title={isListening ? "Detener grabación" : "Hablar con Nico"}
            >
              <div className="relative">
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  </>
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </div>
            </button>

            <button
              onClick={handleSpeakResponse}
              disabled={(messages || []).length === 0 || isSpeaking}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isSpeaking
                  ? "scale-105 ring-4 ring-opacity-50"
                  : "hover:scale-105"
              }`}
              style={{
                backgroundColor: isSpeaking ? COLORS.MINT : COLORS.CORPORATE,
                opacity: (messages || []).length === 0 ? 0.5 : 1,
                boxShadow: isSpeaking ? `0 0 20px ${COLORS.MINT}80` : "none",
              }}
              title={isSpeaking ? "Detener voz" : "Escuchar respuesta de Nico"}
            >
              <div className="relative">
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
                  </>
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </div>
            </button>

            <button
              onClick={clearChat}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: COLORS.PETROLEUM }}
              title="Limpiar conversación"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={clearCache}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: COLORS.CORPORATE }}
              title="Limpiar caché de respuestas"
            >
              <div className="relative">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
            </button>
          </div>

          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 text-sm md:text-base"
              style={{
                backgroundColor: COLORS.SOFT_BLUE,
                color: COLORS.NAVY,
                borderColor: COLORS.CORPORATE,
                minHeight: "50px",
                maxHeight: "120px",
              }}
              rows={2}
            />

            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="p-3 rounded-xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: message.trim()
                  ? COLORS.PETROLEUM
                  : COLORS.CORPORATE,
              }}
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs" style={{ color: COLORS.MINT }}>
              Presiona Enter para enviar • Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicoModern;
