import { useState, useRef, useEffect, useCallback } from "react";
import { speakTextConversational, stopSpeech } from "../../utils/speech";
import {
  createSpeechRecognition,
  requestMicrophonePermission,
} from "../../utils/speechRecognition";
import { removeEmojis } from "./nicoTextUtils";
import { SPEECH_SAFETY_TIMEOUT } from "./nicoConfig";

export function useNicoVoice({
  audioEnabled,
  setMessage,
  messages,
  setMessages,
  setAudioPermissionError,
  handleSendMessageRef,
}) {
  const isSpeakingRef = useRef(false);
  const sentenceQueueRef = useRef([]);
  const speechTimeoutRef = useRef(null);
  const pendingSentenceRef = useRef("");

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  const speechRecognitionRef = useRef(null);

  const clearSpeechSafetyTimeout = useCallback(() => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  }, []);

  const setSpeechSafetyTimeout = useCallback(() => {
    clearSpeechSafetyTimeout();
    speechTimeoutRef.current = setTimeout(() => {
      if (isSpeakingRef.current) {
        isSpeakingRef.current = false;
        stopSpeech();
        speakFromQueue();
      }
    }, SPEECH_SAFETY_TIMEOUT);
  }, [clearSpeechSafetyTimeout]);

  const speakFromQueue = useCallback(() => {
    if (isSpeakingRef.current) return;
    if (sentenceQueueRef.current.length === 0) return;

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
  }, [
    setAudioPermissionError,
    clearSpeechSafetyTimeout,
    setSpeechSafetyTimeout,
  ]);

  const processStreamChunk = useCallback(
    (chunk, audioEnabledFlag) => {
      if (!audioEnabledFlag) return;

      pendingSentenceRef.current += chunk;
      while (true) {
        const match = pendingSentenceRef.current.match(/[.!?](?:\s|$)/);
        if (!match) break;
        const endIdx = match.index + 1;
        const sentence = pendingSentenceRef.current.slice(0, endIdx).trim();
        pendingSentenceRef.current = pendingSentenceRef.current.slice(
          endIdx + match[0].length,
        );

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
          sentenceQueueRef.current.push(sentence);
        }
      }
    },
    [
      setAudioPermissionError,
      clearSpeechSafetyTimeout,
      setSpeechSafetyTimeout,
      speakFromQueue,
    ],
  );

  const finishStreamAudio = useCallback(
    (audioEnabledFlag) => {
      if (!audioEnabledFlag) return;
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
    },
    [speakFromQueue],
  );

  useEffect(() => {
    const speechRecognition = createSpeechRecognition({
      onResult: (fullText, finalText, hasFinal) => {
        setMessage(fullText);
        if (!hasFinal) {
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
        if (finalText && finalText.trim() !== "") {
          setMessage(finalText);
          if (handleSendMessageRef?.current) {
            handleSendMessageRef.current(finalText);
          }
        }
      },
      onError: () => {
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
            "El reconocimiento de voz no est\u00e1 disponible en este navegador. Prueba con Chrome o Safari.",
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
      return;
    }

    const permission = await requestMicrophonePermission();
    if (!permission.success) {
      const errorContent =
        permission.error === "NotAllowedError"
          ? "Permiso de micr\u00f3fono denegado. Para usar voz, habilita el micr\u00f3fono en la configuraci\u00f3n de tu navegador y recarga la p\u00e1gina."
          : permission.message;
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Error al iniciar el reconocimiento de voz. Por favor, intenta de nuevo.",
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
      setAudioPermissionError(error.message);
      setIsSpeaking(false);
    }
  };

  return {
    isSpeakingRef,
    sentenceQueueRef,
    speechTimeoutRef,
    clearSpeechSafetyTimeout,
    setSpeechSafetyTimeout,
    speakFromQueue,
    processStreamChunk,
    finishStreamAudio,
    isListening,
    isSpeaking,
    interimTranscript,
    recognition,
    speechRecognitionRef,
    handleVoiceInput,
    handleSpeakResponse,
  };
}
