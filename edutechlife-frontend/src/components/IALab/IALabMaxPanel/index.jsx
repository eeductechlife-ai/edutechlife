import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "../../../lib/supabase";
import {
  useIALabProgressContext,
  useIALabUIContext,
} from "../../../context/IALabContext";
import { useIALabStore } from "../../../store/ialabStore";
import {
  speakTextConversational,
  stopSpeech,
  prefetchTts,
} from "../../../utils/speech";
import { cleanTextForTTS } from "../../../utils/textCleaner";
import SectionErrorBoundary from "../SectionErrorBoundary";
import { useMaxVoice } from "./useMaxVoice";
import { useTranslation } from "../../../i18n/I18nProvider";
import MaxPanelHeader from "./MaxPanelHeader";
import MaxContextBar from "./MaxContextBar";
import MaxQuickActions from "./MaxQuickActions";
// ENHANCED: Use improved conversation area with professional features
import MaxEnhancedConversationArea from "./MaxEnhancedConversationArea";
// FALLBACK: Keep original as emergency backup
import MaxChatInput from "./MaxChatInput";
import { generateFallbackResponse } from "./maxPrompts";
import {
  useDebouncedInput,
  useResponseCache,
  PerformanceMetrics,
} from "./maxPerfOptimizations";
import { useToast } from "./MaxUIEnhancements";
import { createSpeechQueue } from "./maxSpeechQueue";
import { MAX_MEMORY_KEY, splitIntoSentences } from "./IALabMaxPanelParts";
import {
  sanitizeStudentName,
  loadSavedConversation,
  takeCompleteSentences,
  streamMaxResponse,
  isCoarsePointer,
} from "./maxPanelHelpers";
import {
  useMaxSystemPrompt,
  useMaxLifecycle,
  useMaxPersistence,
  useKeyboardOffset,
  useMaxQuickActions,
  useMaxWelcome,
} from "./useMaxPanelEffects";

const IALabMaxPanel = ({ isOpen, onClose, initialMessage = "" }) => {
  const { t, locale } = useTranslation();
  const {
    activeMod = 1,
    modules = [],
    completedModules = [],
  } = useIALabProgressContext() ?? {};
  // Shared Supabase singleton for academic memory (optional)
  const supabaseClient = supabase;

  const { user } = useIALabUIContext() ?? {};

  const [maxState, setMaxState] = useState("idle");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(loadSavedConversation);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Performance optimizations (with fallbacks)
  const debouncedInput = useDebouncedInput(userInput, 300);
  const cache = useResponseCache();
  const { toasts, show } = useToast();
  const metricsRef = useRef(null);

  // Initialize performance metrics in dev only
  useEffect(() => {
    if (import.meta.env.DEV && !metricsRef.current) {
      metricsRef.current = new PerformanceMetrics();
    }
  }, []);

  const welcomeSpokenRef = useRef(false);
  const abortRef = useRef(null);
  const firstChunkRef = useRef(false);
  const pendingSentenceRef = useRef("");
  const streamDoneRef = useRef(false);
  const conversationFinalizedRef = useRef(false);
  const fullResponseRef = useRef("");

  // Nombre para personalizar la conversación (sin marcadores genéricos).
  const rawStudentName = user?.firstName || user?.full_name || "";
  const studentName = sanitizeStudentName(rawStudentName);
  const currentModule = modules.find((m) => m.id === activeMod);
  const userLevel = completedModules.length;
  const lastVisitedLesson = useIALabStore((s) => s.lastVisitedLesson);
  const lessonProgress = useIALabStore((s) => s.lessonProgress);
  const currentLesson =
    lastVisitedLesson?.moduleId === activeMod
      ? { ...lastVisitedLesson, lesson: null, progress: 0 }
      : null;
  const conversationRef = useRef(conversation);
  conversationRef.current = conversation;
  const prefersReducedMotion = useReducedMotion();

  const voice = useMaxVoice(isOpen, setUserInput, locale);

  const systemPrompt = useMaxSystemPrompt({
    locale,
    currentModule,
    modules,
    studentName,
    userLevel,
    completedModules,
    t,
    currentLesson,
    supabaseClient,
    user,
  });

  const finalizeMessage = useCallback((fullText) => {
    if (conversationFinalizedRef.current) return;
    conversationFinalizedRef.current = true;
    const maxMessage = {
      id: `max_${Date.now()}`,
      type: "max",
      content: fullText,
      timestamp: new Date().toISOString(),
    };
    setConversation((prev) => [...prev, maxMessage]);
    setMessage(fullText);
    setStreamingMessage("");
    setMaxState("idle");
  }, []);

  // Cola de voz "voz primero, texto después": el texto se revela cuando cada
  // frase empieza a sonar; la cola avanza solo al terminar el audio, y la
  // siguiente frase se precarga en paralelo para no dejar huecos.
  const ttsQueueRef = useRef(
    createSpeechQueue({
      speak: (text, onEnd, onStart) =>
        speakTextConversational(
          cleanTextForTTS(text),
          "max",
          {},
          onEnd,
          undefined,
          onStart,
        ),
      prefetch: (nextText) => prefetchTts(cleanTextForTTS(nextText), "max"),
      reveal: (sentence) =>
        setStreamingMessage((prev) => (prev ? prev + " " : "") + sentence),
      onSpeak: () => setMaxState("speaking"),
      onIdle: () => setMaxState("idle"),
      onFinalize: () => {
        if (streamDoneRef.current && fullResponseRef.current) {
          finalizeMessage(fullResponseRef.current);
        }
      },
      isStreamDone: () => streamDoneRef.current,
    }),
  );

  useMaxLifecycle({
    isOpen,
    activeMod,
    t,
    finalizeMessage,
    setMaxState,
    welcomeSpokenRef,
    ttsQueueRef,
    pendingSentenceRef,
    streamDoneRef,
    fullResponseRef,
    conversationRef,
  });

  useMaxPersistence({ conversation, supabaseClient, user, currentModule });

  const quickActions = useMaxQuickActions({
    currentModule,
    userLevel,
    locale,
    currentLesson,
    t,
  });

  useEffect(() => {
    if (isOpen && initialMessage) {
      setUserInput(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useMaxWelcome({
    isOpen,
    welcomeSpokenRef,
    setMaxState,
    setMessage,
    setConversation,
    t,
    locale,
    studentName,
    currentModule,
    userLevel,
    activeMod,
  });

  const processUserInput = useCallback(
    async (inputText) => {
      if (!inputText.trim() || isProcessing) return;

      setIsProcessing(true);
      setMaxState("thinking");
      setStreamingMessage("");
      ttsQueueRef.current.reset();
      pendingSentenceRef.current = "";
      streamDoneRef.current = false;
      conversationFinalizedRef.current = false;
      fullResponseRef.current = "";
      stopSpeech();

      const userMessage = {
        id: `user_${Date.now()}`,
        type: "user",
        content: inputText,
        timestamp: new Date().toISOString(),
      };

      setConversation((prev) => [...prev, userMessage]);
      setUserInput("");

      const messages = [
        { role: "system", content: systemPrompt },
        // Solo los últimos 12 turnos para acotar el costo de cada respuesta.
        ...conversationRef.current.slice(-12).map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
        })),
        { role: "user", content: inputText },
      ];

      const controller = new AbortController();
      abortRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      try {
        firstChunkRef.current = false;
        pendingSentenceRef.current = "";
        streamDoneRef.current = false;
        conversationFinalizedRef.current = false;
        fullResponseRef.current = "";
        let fullResponse = "";

        await streamMaxResponse(messages, controller.signal, (chunk) => {
          fullResponse += chunk;
          fullResponseRef.current = fullResponse;
          if (!firstChunkRef.current && chunk.trim()) {
            firstChunkRef.current = true;
          }

          // El texto NO se adelanta a la voz: solo se acumulan frases
          // completas para que MAX las hable primero y el texto se
          // revele en la burbuja cuando cada frase empieza a sonar.
          pendingSentenceRef.current += chunk;
          const { sentences, rest } = takeCompleteSentences(
            pendingSentenceRef.current,
          );
          pendingSentenceRef.current = rest;
          sentences.forEach((sentence) => ttsQueueRef.current.push(sentence));
        });

        clearTimeout(timeoutId);

        if (fullResponse.length < 5) {
          throw new Error("Respuesta vacía o muy corta");
        }

        // El LLM terminó: la respuesta se fija en la conversación cuando la
        // cola de voz se vacía (o al revelarse todo por el watchdog), para que
        // el texto siga copiándose sincronizado con el audio hasta el final.
        streamDoneRef.current = true;
        fullResponseRef.current = fullResponse;

        const remaining = pendingSentenceRef.current.trim();
        if (remaining.length > 3) {
          ttsQueueRef.current.push(remaining);
        }

        if (
          ttsQueueRef.current.pending() === 0 &&
          !ttsQueueRef.current.isPlaying()
        ) {
          finalizeMessage(fullResponse);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          if (import.meta.env.DEV)
            console.warn("⚠️ Timeout al contactar DeepSeek");
        } else {
          if (import.meta.env.DEV)
            console.warn("⚠️ API DeepSeek no disponible:", error.message);
        }

        const fallbackResponse = generateFallbackResponse(inputText, locale, {
          currentModule,
          userLevel,
        });

        // Voz primero: la respuesta de respaldo se habla frase por frase y
        // el texto se revela cuando cada frase empieza a sonar (misma cola).
        streamDoneRef.current = true;
        fullResponseRef.current = fallbackResponse;
        const sentences = splitIntoSentences(fallbackResponse);
        if (sentences.length === 0) {
          finalizeMessage(fallbackResponse);
        } else {
          setStreamingMessage("");
          setMaxState("thinking");
          ttsQueueRef.current.push(sentences);
        }
      } finally {
        setIsProcessing(false);
        abortRef.current = null;
      }
    },
    [
      currentModule,
      userLevel,
      isProcessing,
      locale,
      studentName,
      completedModules,
      t,
      systemPrompt,
      finalizeMessage,
    ],
  );

  const handleQuickAction = (action) => {
    processUserInput(action.prompt);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      processUserInput(userInput);
    }
  };

  const handleKeyDown = (e) => {
    // En pantallas táctiles Enter inserta un salto de línea (no existe Shift),
    // así que el envío se hace con el botón. Con teclado físico se mantiene
    // Enter = enviar.
    if (e.key === "Enter" && !e.shiftKey && !isCoarsePointer()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    if (abortRef.current) abortRef.current.abort();
    setShowClearConfirm(true);
  };

  const confirmClearConversation = () => {
    conversationFinalizedRef.current = false;
    streamDoneRef.current = false;
    fullResponseRef.current = "";
    ttsQueueRef.current.reset();
    setConversation([]);
    setMessage("");
    setStreamingMessage("");
    setShowClearConfirm(false);
    try {
      localStorage.removeItem(MAX_MEMORY_KEY);
    } catch {
      /* ignore */
    }
  };

  const cancelClearConversation = () => {
    setShowClearConfirm(false);
  };

  const keyboardOffset = useKeyboardOffset();

  if (!isOpen) return null;

  if (!currentModule) {
    return (
      <div className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col">
        <div className="relative w-[85vw] max-w-[380px] h-full bg-white shadow-2xl flex flex-col items-center justify-center p-8 z-10">
          <div className="w-12 h-12 border-2 border-[var(--theme-emphasis)]/30 border-t-[var(--theme-emphasis)] rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">
            {t("ialab.max.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SectionErrorBoundary name="MaxPanel">
      <div
        className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col w-full sm:w-[85vw] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[460px] overflow-hidden"
        style={{ bottom: keyboardOffset }}
        role="dialog"
        aria-label={t("ialab.max.panel_aria")}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            stopSpeech();
            onClose();
          }
        }}
      >
        <motion.div
          initial={prefersReducedMotion ? false : { x: "100%" }}
          animate={prefersReducedMotion ? false : { x: 0 }}
          transition={
            prefersReducedMotion
              ? undefined
              : { type: "spring", stiffness: 300, damping: 30 }
          }
          className="relative w-full h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden"
          role="document"
          style={{ willChange: "transform" }}
        >
          <MaxPanelHeader
            maxState={maxState}
            setMaxState={setMaxState}
            currentModule={currentModule}
            userLevel={userLevel}
            onClose={onClose}
          />

          <div className="flex-1 overflow-hidden flex flex-col">
            <MaxContextBar currentModule={currentModule} />
            <MaxQuickActions
              quickActions={quickActions}
              onAction={handleQuickAction}
              disabled={isProcessing}
            />

            {/* ENHANCED with professional features - safe fallback to original */}
            <MaxEnhancedConversationArea
              conversation={conversation}
              isProcessing={isProcessing}
              moduleTitle={currentModule?.title}
              streamingMessage={streamingMessage}
              onMessageAction={(action, msgId) => {
                if (action === "helpful") {
                  if (import.meta.env.DEV) {
                    console.log(`Message ${msgId} marked as helpful`);
                  }
                }
              }}
            />

            <MaxChatInput
              userInput={userInput}
              onInputChange={setUserInput}
              onKeyDown={handleKeyDown}
              onSend={handleSendMessage}
              onClear={handleClearConversation}
              onVoiceToggle={voice.toggleVoice}
              isProcessing={isProcessing}
              isListening={voice.isListening}
              speechSupported={voice.speechSupported}
              speechError={voice.speechError}
              showClearConfirm={showClearConfirm}
              onConfirmClear={confirmClearConversation}
              onCancelClear={cancelClearConversation}
              conversationLength={conversation.length}
              moduleTitle={currentModule?.title}
            />
          </div>
        </motion.div>
      </div>
    </SectionErrorBoundary>
  );
};

IALabMaxPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  initialMessage: PropTypes.string,
};

export default IALabMaxPanel;
