import { useCallback } from "react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { callDaniChatStream } from "../../../utils/api";
import {
  PROMPT_DANI_EXPERTO,
  PROMPT_TUTOR_TAREAS,
  PROMPT_DANI_SOCRATICO,
} from "../../../constants/prompts";
import { inferMoodFromText, extractTopic } from "../dani/chatUtils";
import { getQuickActionMessage } from "./daniQuickActions";
import { processStreamChunkVoice, speakRemainingText } from "./daniChatVoice";
import {
  getMoodSupportPrompt,
  getCrisisUserMessage,
  isEmotionalBannerNeeded,
  isCrisisAlert,
  recordMoodIfNeeded,
} from "./daniChatMood";
import { trackTopicFromMessage } from "./daniChatTopics";

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
            try {
              const parsed = JSON.parse(data);
              if (parsed.__crisisAlert) {
                setCrisisAlertLevel(parsed.__crisisAlert);
                setShowCrisisResources(true);
                return;
              }
            } catch {}

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
      daniMemory,
      updateDaniMemory,
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
