import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
import { callDeepseekStream } from "../../../utils/api";

import SectionErrorBoundary from "../SectionErrorBoundary";
import { useValerioVoice } from "./useValerioVoice";
import { useTranslation } from "../../../i18n/I18nProvider";
import ValerioPanelHeader from "./ValerioPanelHeader";
import ValerioContextBar from "./ValerioContextBar";
import ValerioQuickActions from "./ValerioQuickActions";
// ENHANCED: Use improved conversation area with professional features
import ValerioEnhancedConversationArea from "./ValerioEnhancedConversationArea";
// FALLBACK: Keep original as emergency backup
import ValerioConversationArea from "./ValerioConversationArea";
import ValerioChatInput from "./ValerioChatInput";
import {
  buildValerioSystemPrompt,
  generateFallbackResponse,
  buildContextualWelcome,
} from "./valerioPrompts";
import {
  startSession,
  endSession,
  updateSession,
} from "../../../services/valerioMemory";
import { ValerioAcademicMemory } from "../../../services/valerioAcademicMemory";
import {
  useDebouncedInput,
  useResponseCache,
  PerformanceMetrics,
} from "./valerioPerfOptimizations";
import { useToast } from "./ValerioUIEnhancements";
import { createSpeechQueue } from "./valerioSpeechQueue";
import {
  ALL_LESSONS,
  ALL_LESSONS_EN,
  ALL_LESSONS_PT,
} from "../../../data/ialab";

const VALERIO_MEMORY_KEY = "ialab_valerio_conversation";

const LESSONS_BY_LOCALE = {
  en: ALL_LESSONS_EN,
  pt: ALL_LESSONS_PT,
  es: ALL_LESSONS,
};

// Divide un texto en frases completas para hablarlas de una en una
const splitIntoSentences = (text) => {
  const sentences = [];
  let pending = text;
  while (true) {
    const match = pending.match(/[.!?…](?:\s|$|[\n\r])/);
    if (!match) break;
    const endIdx = match.index + 1;
    const sentence = pending.slice(0, endIdx).trim();
    pending = pending.slice(endIdx + match[0].length);
    if (sentence.length >= 5) sentences.push(sentence);
  }
  const rest = pending.trim();
  if (rest.length > 3) sentences.push(rest);
  return sentences;
};

const IALabValerioPanel = ({ isOpen, onClose, initialMessage = "" }) => {
  const { t, locale } = useTranslation();
  const { activeMod, modules, completedModules } = useIALabProgressContext();
  // Shared Supabase singleton for academic memory (optional)
  const supabaseClient = supabase;

  const { user } = useIALabUIContext();

  const [valerioState, setValerioState] = useState("idle");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(() => {
    try {
      const saved = localStorage.getItem(VALERIO_MEMORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [quickActions, setQuickActions] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");

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
  const warmupDoneRef = useRef(false);
  const warmupRef = useRef(null);
  const firstChunkRef = useRef(false);
  const pendingSentenceRef = useRef("");
  const streamDoneRef = useRef(false);
  const conversationFinalizedRef = useRef(false);
  const fullResponseRef = useRef("");

  const studentName = user?.firstName || user?.full_name || "";
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

  const voice = useValerioVoice(isOpen, setUserInput, locale);

  // Build system prompt with academic personalization (async)
  useEffect(() => {
    let isMounted = true;

    const buildPrompt = async () => {
      try {
        const userId = user?.id || window.Clerk?.session?.user?.id;
        const prompt = await buildValerioSystemPrompt({
          locale,
          currentModule,
          modules,
          studentName,
          userLevel,
          completedModules,
          t,
          currentLesson,
          supabaseClient,
          userId,
        });
        if (isMounted) setSystemPrompt(prompt);
      } catch (err) {
        console.warn("[buildPrompt] Error:", err.message);
        // Fallback to sync version if async fails
        const prompt = await buildValerioSystemPrompt({
          locale,
          currentModule,
          modules,
          studentName,
          userLevel,
          completedModules,
          t,
          currentLesson,
        });
        if (isMounted) setSystemPrompt(prompt);
      }
    };

    buildPrompt();
    return () => {
      isMounted = false;
    };
  }, [
    locale,
    currentModule?.id,
    studentName,
    userLevel,
    completedModules?.length,
    currentLesson?.lessonId,
    supabaseClient,
    user?.id,
    t,
  ]);

  const finalizeMessage = useCallback((fullText) => {
    if (conversationFinalizedRef.current) return;
    conversationFinalizedRef.current = true;
    const valerioMessage = {
      id: `valerio_${Date.now()}`,
      type: "valerio",
      content: fullText,
      timestamp: new Date().toISOString(),
    };
    setConversation((prev) => [...prev, valerioMessage]);
    setMessage(fullText);
    setStreamingMessage("");
    setValerioState("idle");
  }, []);

  // Cola de voz "voz primero, texto después": el texto se revela cuando cada
  // frase empieza a sonar; la cola avanza solo al terminar el audio, y la
  // siguiente frase se precarga en paralelo para no dejar huecos.
  const ttsQueueRef = useRef(
    createSpeechQueue({
      speak: (text, onEnd, onStart) =>
        speakTextConversational(
          cleanTextForTTS(text),
          "valerio",
          {},
          onEnd,
          undefined,
          onStart,
        ),
      prefetch: (nextText) => prefetchTts(cleanTextForTTS(nextText), "valerio"),
      reveal: (sentence) =>
        setStreamingMessage((prev) => (prev ? prev + " " : "") + sentence),
      onSpeak: () => setValerioState("speaking"),
      onIdle: () => setValerioState("idle"),
      onFinalize: () => {
        if (streamDoneRef.current && fullResponseRef.current) {
          finalizeMessage(fullResponseRef.current);
        }
      },
      isStreamDone: () => streamDoneRef.current,
    }),
  );

  useEffect(() => {
    let warmupTimeoutId;
    if (isOpen) {
      startSession(activeMod);
      if (!warmupDoneRef.current) {
        warmupDoneRef.current = true;
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ||
          import.meta.env.VITE_API_URL ||
          "https://edutechlife-backend.onrender.com";
        const controller = new AbortController();
        warmupRef.current = controller;
        warmupTimeoutId = setTimeout(() => controller.abort(), 12000);
        fetch(`${baseUrl}/api/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "ping" }],
            temperature: 0.5,
            maxTokens: 10,
          }),
          signal: controller.signal,
        })
          .then((r) => r.body?.cancel?.())
          .catch(() => {});
        fetch(`${baseUrl}/api/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text: "Hola" },
            voice: { languageCode: "es-US", name: "es-US-Neural2-C" },
            audioConfig: { audioEncoding: "MP3" },
          }),
          signal: controller.signal,
        })
          .then((r) => r.body?.cancel?.())
          .catch(() => {});
        if (activeMod) {
          prefetchTts(t(`ialab.valerio.ova_intro_${activeMod}`), "valerio");
        }
        prefetchTts(t("ialab.valerio.system_instructions"), "sistema");
      }
    } else {
      warmupDoneRef.current = false;
      welcomeSpokenRef.current = false;
      ttsQueueRef.current.reset();
      pendingSentenceRef.current = "";
      endSession(conversationRef.current);
      stopSpeech();
      setValerioState("idle");
    }
    return () => {
      clearTimeout(warmupTimeoutId);
      warmupRef.current?.abort();
      ttsQueueRef.current.reset();
      pendingSentenceRef.current = "";
      // Si la respuesta ya se generó pero el audio no terminó, fijarla en la
      // conversación para no perderla al cerrar el panel
      if (streamDoneRef.current && fullResponseRef.current) {
        finalizeMessage(fullResponseRef.current);
      }
      streamDoneRef.current = false;
      endSession(conversationRef.current);
      stopSpeech();
    };
  }, [isOpen, finalizeMessage]);

  useEffect(() => {
    if (!isOpen) return;
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      "https://edutechlife-backend.onrender.com";
    const interval = setInterval(() => {
      fetch(`${baseUrl}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
    }, 180000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(VALERIO_MEMORY_KEY, JSON.stringify(conversation));
      } catch {
        /* ignore */
      }
      if (conversation.length > 0) {
        updateSession({ messageCount: conversation.length });
      }

      // Record academic session to Supabase (non-blocking)
      if (
        conversation.length > 2 &&
        supabaseClient &&
        user?.id &&
        currentModule?.id
      ) {
        recordAcademicSession().catch(() => {
          /* silent fail - don't block UI */
        });
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      try {
        localStorage.setItem(VALERIO_MEMORY_KEY, JSON.stringify(conversation));
      } catch {
        /* ignore */
      }
    };
  }, [conversation, supabaseClient, user?.id, currentModule?.id]);

  // Helper: Record academic session
  const recordAcademicSession = useCallback(async () => {
    try {
      if (!supabaseClient || !user?.id || !currentModule?.id) return;

      const academicMemory = new ValerioAcademicMemory(supabaseClient, user.id);

      // Extract topics from conversation
      const userMessages = conversation
        .filter((m) => m.type === "user")
        .map((m) => m.content);

      // Basic sentiment detection (could be enhanced)
      const lastMessage =
        conversation.length > 0
          ? conversation[conversation.length - 1].content
          : "";
      let sentiment = "neutral";
      if (lastMessage.toLowerCase().match(/confus|no entend|no entiend/))
        sentiment = "confused";
      if (lastMessage.toLowerCase().match(/gracias|excelent|perfecto/))
        sentiment = "confident";

      await academicMemory.recordSession({
        moduleId: currentModule.id,
        topicsCovered: extractTopicsFromMessages(userMessages),
        questionsAsked: userMessages,
        weakAreasIdentified: [],
        progressMade: calculateProgress(),
        sentiment,
      });
    } catch (err) {
      console.warn("[recordAcademicSession] Error:", err.message);
      // Silent fail - don't disrupt UX
    }
  }, [conversation, supabaseClient, user?.id, currentModule?.id]);

  // Helper: Extract topics from messages
  const extractTopicsFromMessages = (messages) => {
    const topics = new Set();
    const keywords = {
      "prompt engineering": ["prompt", "instruction", "role"],
      IA: ["ai", "ia", "inteligencia", "artificial"],
      "text to speech": ["tts", "audio", "voice"],
      chatgpt: ["chatgpt", "gpt", "openai"],
      gemini: ["gemini", "google"],
    };

    messages.forEach((msg) => {
      const lower = msg.toLowerCase();
      Object.entries(keywords).forEach(([topic, kws]) => {
        if (kws.some((kw) => lower.includes(kw))) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics).slice(0, 5);
  };

  // Helper: Calculate progress (simple heuristic)
  const calculateProgress = () => {
    const userMessages = conversation.filter((m) => m.type === "user").length;
    return Math.min(userMessages * 15, 95); // 15% per question, max 95%
  };

  useEffect(() => {
    const lessons = currentModule
      ? (LESSONS_BY_LOCALE[locale] || ALL_LESSONS)?.[currentModule.id] || []
      : [];
    const currentLessonData = currentLesson?.lessonId
      ? lessons.find((l) => l.id === currentLesson.lessonId)
      : null;
    const lessonTitle = currentLessonData?.title || "";
    const topicRef = lessonTitle
      ? `"${currentModule?.title}" > "${lessonTitle}"`
      : `"${currentModule?.title}"`;
    const actions = [
      {
        id: "explain_topic",
        label: t("ialab.valerio.quick_explain_topic"),
        icon: "fa-book",
        prompt:
          {
            en: `Explain the main topic of ${topicRef} clearly and concisely.`,
            pt: `Explique o tópico principal de ${topicRef} de forma clara e concisa.`,
            es: `Explica el tema principal de ${topicRef} de manera clara y concisa.`,
          }[locale] ||
          `Explica el tema principal de ${topicRef} de manera clara y concisa.`,
      },
      {
        id: "give_example",
        label: t("ialab.valerio.quick_give_example"),
        icon: "fa-lightbulb",
        prompt:
          {
            en: `Provide a practical example related to "${currentModule?.challenge || "prompt engineering"}".`,
            pt: `Forneça um exemplo prático relacionado a "${currentModule?.challenge || "engenharia de prompts"}".`,
            es: `Proporciona un ejemplo práctico relacionado con "${currentModule?.challenge || "ingeniería de prompts"}".`,
          }[locale] ||
          `Proporciona un ejemplo práctico relacionado con "${currentModule?.challenge || "ingeniería de prompts"}".`,
      },
      {
        id: "help_challenge",
        label: t("ialab.valerio.quick_help_challenge"),
        icon: "fa-puzzle-piece",
        prompt:
          {
            en: `How can I effectively approach the "${currentModule?.challenge}" challenge?`,
            pt: `Como posso abordar o desafio "${currentModule?.challenge}" de forma eficaz?`,
            es: `¿Cómo puedo abordar el desafío "${currentModule?.challenge}" de manera efectiva?`,
          }[locale] ||
          `¿Cómo puedo abordar el desafío "${currentModule?.challenge}" de manera efectiva?`,
      },
      {
        id: "study_tips",
        label: t("ialab.valerio.quick_study_tips"),
        icon: "fa-graduation-cap",
        prompt:
          {
            en: `Give me study tips for the "${currentModule?.title}" module (level ${userLevel < 3 ? "beginner" : userLevel < 6 ? "intermediate" : "advanced"}). I am currently on the lesson "${lessonTitle || currentModule?.title}".`,
            pt: `Dê-me dicas de estudo para o módulo "${currentModule?.title}" (nível ${userLevel < 3 ? "iniciante" : userLevel < 6 ? "intermediário" : "avançado"}). Estou na lição "${lessonTitle || currentModule?.title}".`,
            es: `Dame consejos de estudio para el módulo "${currentModule?.title}" (nivel ${userLevel < 3 ? "principiante" : userLevel < 6 ? "intermedio" : "avanzado"}). Estoy en la lección "${lessonTitle || currentModule?.title}".`,
          }[locale] ||
          `Dame consejos de estudio para el módulo "${currentModule?.title}" (nivel ${userLevel < 3 ? "principiante" : userLevel < 6 ? "intermedio" : "avanzado"}). Estoy en la lección "${lessonTitle || currentModule?.title}".`,
      },
    ];
    setQuickActions(actions);
  }, [currentModule, userLevel, locale, currentLesson?.lessonId]);

  useEffect(() => {
    if (isOpen && initialMessage) {
      setUserInput(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (isOpen && !welcomeSpokenRef.current) {
      welcomeSpokenRef.current = true;
      setValerioState("speaking");

      const alreadyWelcomed = useIALabStore.getState().getValerioWelcomed();
      if (!alreadyWelcomed) {
        useIALabStore.getState().setValerioWelcomed();
        const introGreeting = t("ialab.valerio.intro_greeting");
        speakTextConversational(introGreeting, "valerio", {}, () =>
          setValerioState("idle"),
        );
        const welcomeMessage = buildContextualWelcome({
          locale,
          studentName,
          currentModule,
          userLevel,
          activeMod,
        });
        setMessage(welcomeMessage);
        setConversation([
          {
            id: "welcome",
            type: "valerio",
            content: welcomeMessage,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        const greeting = studentName
          ? t("ialab.valerio.greeting_name", { name: studentName })
          : t("ialab.valerio.greeting_anon");
        speakTextConversational(greeting, "valerio", {}, () =>
          setValerioState("idle"),
        );
      }
    }
  }, [isOpen]);

  const processUserInput = useCallback(
    async (inputText) => {
      if (!inputText.trim() || isProcessing) return;

      setIsProcessing(true);
      setValerioState("thinking");
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
        ...conversationRef.current.map((m) => ({
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

        let retries = 0;
        const maxRetries = 1;

        while (true) {
          try {
            await callDeepseekStream(
              messages,
              { temperature: 0.7, maxTokens: 2000, signal: controller.signal },
              false,
              (chunk) => {
                fullResponse += chunk;
                fullResponseRef.current = fullResponse;
                if (!firstChunkRef.current && chunk.trim()) {
                  firstChunkRef.current = true;
                }

                // El texto NO se adelanta a la voz: solo se acumulan frases
                // completas para que MAX las hable primero y el texto se
                // revele en la burbuja cuando cada frase empieza a sonar.
                pendingSentenceRef.current += chunk;
                while (true) {
                  const match = pendingSentenceRef.current.match(
                    /[.!?…](?:\s|$|[\n\r])/,
                  );
                  if (!match) break;
                  const endIdx = match.index + 1;
                  const sentence = pendingSentenceRef.current
                    .slice(0, endIdx)
                    .trim();
                  pendingSentenceRef.current = pendingSentenceRef.current.slice(
                    endIdx + match[0].length,
                  );
                  if (sentence.length >= 5) {
                    ttsQueueRef.current.push(sentence);
                  }
                }
              },
            );
            break;
          } catch (err) {
            if (
              retries < maxRetries &&
              (err.name === "AbortError" || err.name === "TimeoutError")
            ) {
              retries++;
              if (import.meta.env.DEV)
                console.warn(`⚠️ Reintentando (${retries}/${maxRetries})...`);
              await new Promise((r) => setTimeout(r, 2000));
              continue;
            }
            throw err;
          }
        }

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
          setValerioState("thinking");
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
    if (e.key === "Enter" && !e.shiftKey) {
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
      localStorage.removeItem(VALERIO_MEMORY_KEY);
    } catch {
      /* ignore */
    }
  };

  const cancelClearConversation = () => {
    setShowClearConfirm(false);
  };

  if (!isOpen) return null;

  if (!currentModule) {
    return (
      <div className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col">
        <div className="relative w-[85vw] max-w-[380px] h-full bg-white shadow-2xl flex flex-col items-center justify-center p-8 z-10">
          <div className="w-12 h-12 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">
            {t("ialab.valerio.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SectionErrorBoundary name="ValerioPanel">
      <div
        className="fixed right-0 top-0 bottom-0 z-[90] flex flex-col"
        role="dialog"
        aria-label={t("ialab.valerio.panel_aria")}
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
          className="relative w-full sm:w-[85vw] sm:max-w-[380px] h-full bg-white shadow-2xl flex flex-col z-10"
          role="document"
          style={{ willChange: "transform" }}
        >
          <ValerioPanelHeader
            valerioState={valerioState}
            setValerioState={setValerioState}
            currentModule={currentModule}
            userLevel={userLevel}
            onClose={onClose}
          />

          <div className="flex-1 overflow-hidden flex flex-col">
            <ValerioContextBar currentModule={currentModule} />
            <ValerioQuickActions
              quickActions={quickActions}
              onAction={handleQuickAction}
              disabled={isProcessing}
            />

            {/* ENHANCED with professional features - safe fallback to original */}
            <ValerioEnhancedConversationArea
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

            <ValerioChatInput
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

IALabValerioPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  initialMessage: PropTypes.string,
};

export default IALabValerioPanel;
