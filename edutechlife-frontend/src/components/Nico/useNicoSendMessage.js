import { useRef, useCallback } from "react";
import { callDeepseekStream } from "../../utils/api";
import { speakTextConversational } from "../../utils/speech";
import { matchIntent } from "./nicoKnowledge";
import {
  getConversationPhase,
  shouldInsertProactiveMessage,
  getProactiveMessageByContext,
} from "./nicoConversation";
import { responseCache, CACHE_DURATION, setResponseCache } from "./nicoCache";
import {
  removeEmojis,
  removeGreetingMulletilla,
  shouldAskForName,
} from "./nicoTextUtils";
import {
  extractUserContext,
  getQuickResponse,
  getConversationOptions,
  optimizeLongConversation,
} from "./nicoContext";
import { PROMPT_NICO_SOPORTE } from "./nicoPrompts";

export function useNicoSendMessage({
  message,
  messages,
  isLoading,
  userContext,
  userMessageCount,
  conversationPhase,
  lastProactiveIndex,
  showedConversationOptions,
  showLeadForm,
  showScheduler,
  leadSaved,
  showLeadSuccess,
  showAppointmentSuccess,
  currentLead,
  audioEnabled,
  greetingSent,

  setMessage,
  setMessages,
  setIsLoading,
  setUserContext,
  setUserMessageCount,
  setConversationPhase,
  setLastProactiveIndex,
  setShowedConversationOptions,
  setShowLeadSuccess,
  setShowAppointmentSuccess,
  setGreetingSent,

  initialName,

  memory,
  processMessage,
  getContextualPrompt,
  analyzeMessage,
  shouldShowLeadForm,
  prepareLeadContext,
  showForm,
  hideForm,
  showSchedulerWithContext,
  hideScheduler,
  updateLeadInfo,

  saveLead,
  scheduleAppointment,

  voice: {
    isSpeakingRef,
    sentenceQueueRef,
    clearSpeechSafetyTimeout,
    setSpeechSafetyTimeout,
    speakFromQueue,
    processStreamChunk,
    finishStreamAudio,
    setAudioPermissionError,
  },
}) {
  const lastStreamUpdateRef = useRef(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendNewLeadNotification = (leadData) => {
    if (leadData.email) {
    }
  };

  const sendAppointmentEmailConfirmation = async () => {
    try {
    } catch (error) {
      console.error("Error en simulación de email:", error);
    }
  };

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
      return optimizeLongConversation(newMessages, 25);
    });
    setIsLoading(true);

    const detectedContext = extractUserContext(userMessage);
    setUserContext((prev) => {
      const newTopics = [...prev.detectedTopics];
      if (
        detectedContext.detectedInterest &&
        !newTopics.includes(detectedContext.detectedInterest)
      ) {
        newTopics.push(detectedContext.detectedInterest);
      }

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
        lowerMsg.includes("c\u00f3mo empezar")
      ) {
        newStage = "accion";
      } else if (newTopics.length > 0) {
        newStage = "interes";
      }

      const shouldAsk = shouldAskForName(prev);
      let newNameAskedOnce = prev.nameAskedOnce;
      if (
        shouldAsk &&
        (lowerMsg.includes("c\u00f3mo te llamas") ||
          lowerMsg.includes("tu nombre") ||
          lowerMsg.includes("te llamas"))
      ) {
        newNameAskedOnce = true;
      }

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
        detectedTopics: newTopics.slice(-5),
        messagesSinceStart: prev.messagesSinceStart + 1,
        nameAskedOnce: newNameAskedOnce,
        dontWantName: newDontWantName,
      };
    });

    const quickResponse = getQuickResponse(userMessage, userContext);
    if (quickResponse) {
      const noMulletilla = removeGreetingMulletilla(quickResponse);
      const cleanResponse = removeEmojis(noMulletilla);

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

      setUserMessageCount((prev) => prev + 1);
      const currentPhase = getConversationPhase(userMessageCount + 1);
      setConversationPhase(currentPhase);

      setIsLoading(false);
      return;
    }

    processMessage("user", userMessage);

    const analysis = analyzeMessage(userMessage, "user");

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

    const lowerMessage = userMessage.toLowerCase();
    const lastMessage = messages[messages.length - 1];
    const isAppointmentResponse = lastMessage?.isAppointmentPrompt;

    if (isAppointmentResponse) {
      const positiveResponses = [
        "s\u00ed",
        "si",
        "claro",
        "por supuesto",
        "me encantar\u00eda",
        "quiero",
        "agenda",
        "agendar",
        "s\u00ed quiero",
        "si quiero",
      ];
      const negativeResponses = [
        "no",
        "ahora no",
        "despu\u00e9s",
        "m\u00e1s tarde",
        "no gracias",
      ];

      const isPositive = positiveResponses.some((response) =>
        lowerMessage.includes(response),
      );
      const isNegative = negativeResponses.some((response) =>
        lowerMessage.includes(response),
      );

      if (isPositive) {
        const recentLead = messages.find((msg) => msg.isLeadSuccess);
        let leadData = {};

        if (recentLead) {
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
      }
    }

    try {
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
        const memoryContext = getContextualPrompt();
        const userNameFromState = userContext?.userName;
        const contextInfo = userNameFromState
          ? `El usuario se llama ${userNameFromState}.`
          : "";
        const enhancedSystemPrompt = memoryContext
          ? `${PROMPT_NICO_SOPORTE}\nContexto: ${memoryContext.substring(0, 500)} ${contextInfo}`
          : `${PROMPT_NICO_SOPORTE} ${contextInfo}`;

        const placeholderObj = {
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
          isStreaming: true,
        };
        setMessages((prev) => [...prev, placeholderObj]);

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

            processStreamChunk(chunk, audioEnabled);
          },
        );

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

        setResponseCache(cacheKey, {
          response: fullResponse,
          timestamp: Date.now(),
        });
        processMessage("assistant", fullResponse);

        finishStreamAudio(audioEnabled);
      }

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
                "Para hacer nuestra conversaci\u00f3n m\u00e1s productiva, \u00bfte gustar\u00eda...",
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

      if (currentLead) {
        updateLeadInfo({
          lastInteraction: new Date().toISOString(),
          lastMessage: userMessage,
        });
      }

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
      const isTimeout =
        error.message?.includes("tiempo") ||
        error.message?.includes("timeout") ||
        error.message?.includes("Timeout");
      const errorMessage = isTimeout
        ? `El servicio esta tardando mucho en responder. \u00bfQuieres preguntarme por nuestros servicios educativos como VAK, STEM, tutor\u00edas o bienestar?`
        : `Hubo un problema de conexion. Puedo contarte sobre VAK, STEM, tutor\u00edas y bienestar. \u00bfTe interesa alguno?`;

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

  const handleSaveLead = async (leadData) => {
    try {
      const leadId = saveLead({
        nombre: leadData.nombreCompleto,
        telefono: leadData.telefono,
        email: leadData.email,
        motivo: leadData.interesPrincipal || "Inter\u00e9s general",
        messages: messages.slice(-10),
      });

      setShowLeadSuccess(true);

      setTimeout(() => {
        setShowLeadSuccess(false);
      }, 5000);

      sendNewLeadNotification(leadData);

      const successMessage = {
        role: "assistant",
        content: `Perfecto ${leadData.nombreCompleto.split(" ")[0]}, hemos registrado tu interes en ${leadData.interesPrincipal || "nuestros servicios"}.`,
        timestamp: new Date().toISOString(),
        isLeadSuccess: true,
      };

      setMessages((prev) => [...prev, successMessage]);

      setTimeout(() => {
        const appointmentQuestion = {
          role: "assistant",
          content: `\u00bfTe gustar\u00eda agendar una llamada gratuita con uno de nuestros especialistas para profundizar en ${leadData.interesPrincipal || "tus necesidades"}?`,
          timestamp: new Date().toISOString(),
          isAppointmentPrompt: true,
        };

        setMessages((prev) => [...prev, appointmentQuestion]);

        if (audioEnabled) {
          setTimeout(() => {
            speakTextConversational(
              removeEmojis(appointmentQuestion.content),
              "nico_premium",
              {},
              () => {},
              undefined,
            );
          }, 400);
        }
      }, 500);

      if (audioEnabled) {
        speakTextConversational(
          removeEmojis(successMessage.content),
          "nico_premium",
          {},
          undefined,
          setAudioPermissionError,
        );
      }

      const leadForScheduling = {
        id: leadId,
        ...leadData,
      };

      return leadForScheduling;
    } catch (error) {
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

  const handleScheduleAppointment = async (appointmentData) => {
    try {
      const appointment = scheduleAppointment(appointmentData);

      sendAppointmentEmailConfirmation(appointmentData);

      setShowAppointmentSuccess(true);

      setTimeout(() => {
        setShowAppointmentSuccess(false);
      }, 5000);

      const successMessage = {
        role: "assistant",
        content: `Excelente. Hemos agendado tu llamada para el ${new Date(appointmentData.date).toLocaleDateString("es-CO")} a las ${appointmentData.time}. Recibiras confirmacion por ${appointmentData.leadPhone ? "WhatsApp" : "email"}.`,
        timestamp: new Date().toISOString(),
        isAppointmentSuccess: true,
      };

      setMessages((prev) => [...prev, successMessage]);

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
      const errorMessage = {
        role: "assistant",
        content:
          "Hubo un error al agendar la cita. Por favor intenta de nuevo o contacta directamente por WhatsApp.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      throw error;
    }
  };

  return {
    handleSendMessage,
    handleSaveLead,
    handleScheduleAppointment,
    scrollToBottom,
    messagesEndRef,
    lastStreamUpdateRef,
  };
}
