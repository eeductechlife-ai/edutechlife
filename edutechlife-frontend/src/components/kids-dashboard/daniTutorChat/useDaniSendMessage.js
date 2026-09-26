import { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { callDaniOrchestrator } from "../../../utils/api";
import { stopSpeech } from "../../../utils/speech";
import { inferMoodFromText, extractTopic } from "../dani/chatUtils";
import { getQuickActionMessage } from "./daniQuickActions";
import {
  processStreamChunkVoice,
  speakRemainingText,
  clearVoiceQueue,
} from "./daniChatVoice";
import {
  isEmotionalBannerNeeded,
  isCrisisAlert,
  recordMoodIfNeeded,
} from "./daniChatMood";
import { trackTopicFromMessage } from "./daniChatTopics";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

export default function useDaniSendMessage({
  getToken,
  setInputText,
  setIsTyping,
  daniMood,
  setDaniMood,
  socraticMode,
  documentForDani,
  setDocumentForDani,
  addDaniMessage,
  daniChatHistory,
  recordMoodInference,
  trackAcademicTopic,
  voiceEnabled,
  isSpeakingRef,
  pendingSentenceRef,
  setIsSpeaking,
  setVoiceBlocked,
  setShowEmotionalBanner,
  setShowCrisisResources,
  setCrisisAlertLevel,
  setStreamingMessage,
  studentAge,
  studentDbId,
}) {
  const { t } = useTranslation();
  const isKid = studentAge && studentAge <= 11;
  const abortRef = useRef(null);

  const kidErrorMessages = useMemo(
    () => ({
      generic: "¡Ups! Dani se quedó pensando. ¿Puedes intentar de nuevo?",
      timeout:
        "Dani está pensando muy profundo... Espera un poco y vuelve a intentar.",
      network:
        "¡Oh! Parece que el internet se fue de paseo. Revisa tu conexión y vuelve a intentar.",
    }),
    [],
  );

  // Metadata frames arrive as JSON strings with "__"-prefixed keys.
  const handleMeta = useCallback(
    (meta) => {
      if (meta.__crisisAlert) {
        setCrisisAlertLevel(meta.__crisisAlert);
        setShowCrisisResources(true);
      }
      if (meta.__emotionalState === "frustrated") setShowEmotionalBanner(true);
      if (meta.__emotionalState === "confused") setDaniMood("thinking");
    },
    [
      setCrisisAlertLevel,
      setShowCrisisResources,
      setShowEmotionalBanner,
      setDaniMood,
    ],
  );

  const handleSendMessage = useCallback(
    async (text, { isRetry = false } = {}) => {
      if (!text.trim() || abortRef.current) return;

      const userMessage = {
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };
      if (!isRetry) addDaniMessage(userMessage);
      setInputText("");
      setIsTyping(true);
      setDaniMood("thinking");

      const controller = new AbortController();
      abortRef.current = controller;
      let fullResponse = "";

      try {
        const currentMood = daniMood;
        const hasDocumentContext = !!documentForDani;

        // Detect mood for emotional UI (stays frontend-side)
        const mood = inferMoodFromText(userMessage.text);
        if (isEmotionalBannerNeeded(mood)) setShowEmotionalBanner(true);
        if (isCrisisAlert(mood)) setShowCrisisResources(true);

        // Failed replies are UI-only; the model must not see them as turns.
        const usable = daniChatHistory.filter(
          (msg) => !msg.isError && msg.text && typeof msg.text === "string",
        );
        // On retry the failed question is already the last turn in history.
        if (isRetry && usable.at(-1)?.role === "user") usable.pop();
        const history = usable
          .slice(-12)
          .map((msg) => ({ role: msg.role, content: msg.text }));

        if (hasDocumentContext) setDocumentForDani(null);

        pendingSentenceRef.current = "";
        clearVoiceQueue();

        const token = await getToken();
        if (!token)
          throw new Error(
            "Tu sesión se cerró. Vuelve a iniciar sesión para seguir.",
          );

        track("dani_message_sent", {
          socratic_mode: socraticMode,
          has_document: !!hasDocumentContext,
        });
        track(EVENTS.DANI_MESSAGE, {
          socratic_mode: socraticMode,
          has_document: !!hasDocumentContext,
        });

        const voiceOpts = {
          pendingSentenceRef,
          voiceEnabled,
          isSpeakingRef,
          daniMood: currentMood,
          setIsSpeaking,
          setVoiceBlocked,
        };

        await callDaniOrchestrator(
          {
            message: userMessage.text,
            ...(studentDbId ? { studentId: studentDbId } : {}),
            socraticMode,
            documentContext: hasDocumentContext ? documentForDani : null,
            history,
          },
          { token, signal: controller.signal },
          (data) => {
            if (data.startsWith('{"__')) {
              try {
                handleMeta(JSON.parse(data));
                return;
              } catch {
                // Not metadata after all: treat as text below.
              }
            }
            fullResponse += data;
            setDaniMood("explaining");
            setStreamingMessage(fullResponse);
            processStreamChunkVoice(data, voiceOpts);
          },
        );

        speakRemainingText(pendingSentenceRef.current.trim(), voiceOpts);
        setStreamingMessage("");

        const reply = fullResponse.trim();
        if (!reply) throw new Error("Respuesta vacía del servidor");
        addDaniMessage({ role: "assistant", text: reply });

        recordMoodIfNeeded(mood, userMessage.text, recordMoodInference);
        trackTopicFromMessage(userMessage, extractTopic, trackAcademicTopic);
      } catch (error) {
        setStreamingMessage("");

        if (controller.signal.aborted) {
          // The student pressed "stop": keep what Dani had already said.
          const partial = fullResponse.trim();
          if (partial)
            addDaniMessage({
              role: "assistant",
              text: `${partial} …`,
              stopped: true,
            });
          return;
        }

        console.error("Error calling Dani:", error);
        const isAuth =
          error.status === 401 ||
          error.status === 403 ||
          error.message?.includes("sesión") ||
          error.message?.includes("iniciar sesión");
        const isServer =
          error.status >= 400 ||
          error.message?.includes("400") ||
          error.message?.includes("500") ||
          error.message?.includes("servidor");
        const isTimeout =
          error.message?.includes("timeout") ||
          error.message?.includes("Tiempo de espera") ||
          error.message?.includes("tardó") ||
          error.name === "AbortError";
        const errorMsg = isAuth
          ? isKid
            ? "¡Ups! Tu sesión expiró. Vuelve a entrar para seguir con Dani. 🔓"
            : "Tu sesión se cerró. Vuelve a iniciar sesión para continuar."
          : isKid
            ? isServer
              ? kidErrorMessages.generic
              : isTimeout
                ? kidErrorMessages.timeout
                : kidErrorMessages.network
            : isServer
              ? t("dani.error_generic")
              : isTimeout
                ? t("dani.error_timeout")
                : t("dani.error_network");
        addDaniMessage({
          role: "assistant",
          text: errorMsg,
          isError: true,
          retryText: isAuth ? undefined : userMessage.text,
        });
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setIsTyping(false);
        setDaniMood("happy");
      }
    },
    [
      addDaniMessage,
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
      isKid,
      getToken,
      setIsTyping,
      setInputText,
      pendingSentenceRef,
      isSpeakingRef,
      setIsSpeaking,
      setShowEmotionalBanner,
      setShowCrisisResources,
      setStreamingMessage,
      studentDbId,
      kidErrorMessages,
      setDocumentForDani,
      handleMeta,
    ],
  );

  const stopResponse = useCallback(() => {
    abortRef.current?.abort();
    clearVoiceQueue();
    stopSpeech();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, [setIsSpeaking, isSpeakingRef]);

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

  const handleRetry = useCallback(
    (text) => handleSendMessage(text, { isRetry: true }),
    [handleSendMessage],
  );

  return {
    handleSendMessage,
    handleRetry,
    stopResponse,
    handleQuickAction,
    handleTopicClick,
  };
}
