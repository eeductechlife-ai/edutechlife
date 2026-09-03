import { useCallback } from "react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { callDaniOrchestrator } from "../../../utils/api";
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

export default function useDaniSendMessage({
  getToken,
  inputText,
  setInputText,
  setIsTyping,
  daniMood,
  setDaniMood,
  socraticMode,
  documentForDani,
  setDocumentForDani,
  addDaniMessage,
  buildDaniContext,
  buildMemoryInjection,
  daniChatHistory,
  daniMemory,
  updateDaniMemory,
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

  const kidErrorMessages = {
    generic: "¡Ups! Dani se quedó pensando. ¿Puedes intentar de nuevo?",
    timeout:
      "Dani está pensando muy profundo... Espera un poco y vuelve a intentar.",
    network:
      "¡Oh! Parece que el internet se fue de paseo. Revisa tu conexión y vuelve a intentar.",
  };

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

        // Detect mood for emotional UI (stays frontend-side)
        const mood = inferMoodFromText(userMessage.text);
        if (isEmotionalBannerNeeded(mood)) setShowEmotionalBanner(true);
        if (isCrisisAlert(mood)) setShowCrisisResources(true);

        // Build lean history for orchestrator (last 12 turns)
        const history = daniChatHistory
          .slice(-12)
          .filter((msg) => msg.text && typeof msg.text === "string")
          .map((msg) => ({ role: msg.role, content: msg.text }));

        if (hasDocumentContext) setDocumentForDani(null);

        let fullResponse = "";
        pendingSentenceRef.current = "";
        clearVoiceQueue(); // clear any pending audio from previous response

        const token = await getToken();
        if (!token) throw new Error("No auth token — user must be logged in");

        track("dani_message_sent", {
          socratic_mode: socraticMode,
          has_document: !!hasDocumentContext,
        });

        await callDaniOrchestrator(
          {
            message: userMessage.text,
            ...(studentDbId ? { studentId: studentDbId } : {}),
            socraticMode,
            documentContext: hasDocumentContext ? documentForDani : null,
            history,
          },
          { token },
          (data) => {
            try {
              const parsed = JSON.parse(data);
              // Handle metadata events from orchestrator
              if (
                parsed.emotionalState &&
                parsed.emotionalState !== "neutral"
              ) {
                if (parsed.emotionalState === "frustrated")
                  setShowEmotionalBanner(true);
              }
              if (parsed.crisisAlert) {
                setCrisisAlertLevel(parsed.crisisAlert);
                setShowCrisisResources(true);
                return;
              }
              if (parsed.__crisisAlert) {
                setCrisisAlertLevel(parsed.__crisisAlert);
                setShowCrisisResources(true);
                return;
              }
              // Orchestrator sends { chunk } objects
              if (parsed.chunk) {
                fullResponse += parsed.chunk;
                setDaniMood("explaining");
                setStreamingMessage(fullResponse);
                processStreamChunkVoice(parsed.chunk, {
                  pendingSentenceRef,
                  voiceEnabled,
                  isSpeakingRef,
                  daniMood: currentMood,
                  setIsSpeaking,
                  setVoiceBlocked,
                });
                return;
              }
            } catch {}
            // Fallback: raw text chunk
            fullResponse += data;
            setDaniMood("explaining");
            setStreamingMessage(fullResponse);
            processStreamChunkVoice(data, {
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
        } catch {}

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
      setCrisisAlertLevel,
      setStreamingMessage,
      updateDaniMemory,
      studentDbId,
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

  return {
    handleSendMessage,
    handleQuickAction,
    handleTopicClick,
  };
}
