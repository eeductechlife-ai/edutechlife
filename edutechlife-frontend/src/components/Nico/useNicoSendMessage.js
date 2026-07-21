import { useRef, useCallback } from "react";
import { callDeepseekStream } from "../../utils/api";
import { speakTextConversational } from "../../utils/speech";
import { matchIntent } from "./nicoKnowledge";
import { responseCache, CACHE_DURATION, setResponseCache } from "./nicoCache";
import {
  removeEmojis,
  removeGreetingMulletilla,
  shouldAskForName,
} from "./nicoTextUtils";
import {
  extractUserContext,
  getQuickResponse,
  optimizeLongConversation,
} from "./nicoContext";
import { PROMPT_NICO_SOPORTE } from "./nicoPrompts";
import { checkAppointmentResponse } from "./nicoIntentMatcher";
import {
  createUserMessage,
  createAssistantMessage,
  createStreamingPlaceholder,
  buildErrorContent,
} from "./nicoMessageCache";
import {
  handlePostStreamActions,
  advanceMessagePhase,
  tryInsertProactiveMessage,
} from "./nicoPhaseManager";

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

    const userMessageObj = createUserMessage(userMessage);

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

      const assistantMessageObj = createAssistantMessage(cleanResponse, { isQuickResponse: true });

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

      advanceMessagePhase(userMessageCount, setUserMessageCount, setConversationPhase);

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

    const result = checkAppointmentResponse(
      userMessage,
      messages,
      showSchedulerWithContext,
      memory,
      setIsLoading,
    );
    if (result.handled) return;

    try {
      const localMatch = matchIntent(userMessage);
      if (localMatch) {
        const cleanResponse = removeEmojis(localMatch.response);
        const assistantMessageObj = createAssistantMessage(cleanResponse, { isLocalResponse: true });
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

        setUserContext((prev) => ({
          ...prev,
          messagesSinceStart: prev.messagesSinceStart + 1,
        }));

        const currentPhase = advanceMessagePhase(
          userMessageCount,
          setUserMessageCount,
          setConversationPhase,
        );
        tryInsertProactiveMessage({
          currentPhase,
          userMessageCount,
          lastProactiveIndex,
          userContext,
          audioEnabled,
          setMessages,
          setLastProactiveIndex,
          setAudioPermissionError,
        });

        setIsLoading(false);
        return;
      }

      const cacheKey = userMessage.toLowerCase().trim();
      const cached = responseCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        const cleanResponse = removeEmojis(cached.response);
        const assistantMessageObj = createAssistantMessage(cleanResponse);
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

        const placeholderObj = createStreamingPlaceholder();
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

      handlePostStreamActions({
        messages,
        showedConversationOptions,
        userContext,
        userMessageCount,
        lastProactiveIndex,
        audioEnabled,
        currentLead,
        userMessage,
        setShowedConversationOptions,
        setMessages,
        setUserMessageCount,
        setConversationPhase,
        setLastProactiveIndex,
        setAudioPermissionError,
        updateLeadInfo,
      });
    } catch (error) {
      const isTimeout =
        error.message?.includes("tiempo") ||
        error.message?.includes("timeout") ||
        error.message?.includes("Timeout");
      const errorMessage = buildErrorContent(isTimeout);

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
