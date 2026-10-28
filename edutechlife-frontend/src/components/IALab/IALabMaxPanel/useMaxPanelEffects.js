import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../../../config/api";
import {
  speakTextConversational,
  stopSpeech,
  prefetchTts,
} from "../../../utils/speech";
import { useIALabStore } from "../../../store/ialabStore";
import { ALL_LESSONS } from "../../../data/ialab";
import { readAuthIdentity } from "../../../hooks/useAuthIdentity";
import { buildMaxSystemPrompt, buildContextualWelcome } from "./maxPrompts";
import { buildMaxQuickActions } from "./quickActionsBuilder";
import {
  startSession,
  endSession,
  updateSession,
} from "../../../services/maxMemory";
import { MaxAcademicMemory } from "../../../services/maxAcademicMemory";
import { MAX_MEMORY_KEY, LESSONS_BY_LOCALE } from "./IALabMaxPanelParts";
import {
  extractTopicsFromMessages,
  calculateProgress,
  detectSentiment,
} from "./maxPanelHelpers";

// Encabezados comunes de las peticiones de precalentamiento
const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(sessionStorage.getItem("auth_token")
    ? {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      }
    : {}),
});

// Build system prompt with academic personalization (async)
export const useMaxSystemPrompt = ({
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
}) => {
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    let isMounted = true;

    const buildPrompt = async () => {
      try {
        const userId = user?.id || readAuthIdentity().userId;
        const prompt = await buildMaxSystemPrompt({
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
        const prompt = await buildMaxSystemPrompt({
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

  return systemPrompt;
};

// Ciclo de vida del panel: sesión, precalentamiento del backend y limpieza
// de la voz al cerrar; mientras está abierto, mantiene vivo el backend.
export const useMaxLifecycle = ({
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
}) => {
  const warmupDoneRef = useRef(false);
  const warmupRef = useRef(null);

  useEffect(() => {
    let warmupTimeoutId;
    if (isOpen) {
      startSession(activeMod);
      if (!warmupDoneRef.current) {
        warmupDoneRef.current = true;
        const baseUrl = API_BASE_URL;
        const controller = new AbortController();
        warmupRef.current = controller;
        warmupTimeoutId = setTimeout(() => controller.abort(), 12000);
        fetch(`${baseUrl}/api/chat/stream`, {
          method: "POST",
          headers: authHeaders(),
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
          headers: authHeaders(),
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
          prefetchTts(t(`ialab.max.ova_intro_${activeMod}`), "max");
        }
        prefetchTts(t("ialab.max.system_instructions"), "sistema");
      }
    } else {
      warmupDoneRef.current = false;
      welcomeSpokenRef.current = false;
      ttsQueueRef.current.reset();
      pendingSentenceRef.current = "";
      endSession(conversationRef.current);
      stopSpeech();
      setMaxState("idle");
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
    const baseUrl = API_BASE_URL;
    const interval = setInterval(() => {
      fetch(`${baseUrl}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
    }, 180000);
    return () => clearInterval(interval);
  }, [isOpen]);
};

// Guarda la conversación en localStorage y registra la sesión académica
export const useMaxPersistence = ({
  conversation,
  supabaseClient,
  user,
  currentModule,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(MAX_MEMORY_KEY, JSON.stringify(conversation));
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
        localStorage.setItem(MAX_MEMORY_KEY, JSON.stringify(conversation));
      } catch {
        /* ignore */
      }
    };
  }, [conversation, supabaseClient, user?.id, currentModule?.id]);

  // Helper: Record academic session
  const recordAcademicSession = useCallback(async () => {
    try {
      if (!supabaseClient || !user?.id || !currentModule?.id) return;

      const academicMemory = new MaxAcademicMemory(supabaseClient, user.id);

      // Extract topics from conversation
      const userMessages = conversation
        .filter((m) => m.type === "user")
        .map((m) => m.content);

      const lastMessage =
        conversation.length > 0
          ? conversation[conversation.length - 1].content
          : "";
      const sentiment = detectSentiment(lastMessage);

      await academicMemory.recordSession({
        moduleId: currentModule.id,
        topicsCovered: extractTopicsFromMessages(userMessages),
        questionsAsked: userMessages,
        weakAreasIdentified: [],
        progressMade: calculateProgress(conversation),
        sentiment,
      });
    } catch (err) {
      console.warn("[recordAcademicSession] Error:", err.message);
      // Silent fail - don't disrupt UX
    }
  }, [conversation, supabaseClient, user?.id, currentModule?.id]);
};

// Teclado móvil: se sube el panel con el viewport visual para que el cuadro
// de texto y el botón de enviar queden siempre visibles sobre el teclado.
export const useKeyboardOffset = () => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  useEffect(() => {
    const vv =
      typeof window !== "undefined" ? window.visualViewport : undefined;
    if (!vv) return undefined;
    const onViewportChange = () => {
      const offset = Math.max(
        0,
        Math.round(window.innerHeight - vv.height - vv.offsetTop),
      );
      // <80px suele ser chrome del navegador, no teclado.
      setKeyboardOffset(offset > 80 ? offset : 0);
    };
    vv.addEventListener("resize", onViewportChange);
    vv.addEventListener("scroll", onViewportChange);
    onViewportChange();
    return () => {
      vv.removeEventListener("resize", onViewportChange);
      vv.removeEventListener("scroll", onViewportChange);
    };
  }, []);
  return keyboardOffset;
};

// Acciones rápidas según el módulo y la última lección visitada
export const useMaxQuickActions = ({
  currentModule,
  userLevel,
  locale,
  currentLesson,
  t,
}) => {
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    const lessons = currentModule
      ? (LESSONS_BY_LOCALE[locale] || ALL_LESSONS)?.[currentModule.id] || []
      : [];
    const currentLessonData = currentLesson?.lessonId
      ? lessons.find((l) => l.id === currentLesson.lessonId)
      : null;
    const lessonTitle = currentLessonData?.title || "";
    const actions = buildMaxQuickActions({
      locale,
      currentModule,
      lessonTitle,
      userLevel,
      t,
    });
    setQuickActions(actions);
  }, [currentModule, userLevel, locale, currentLesson?.lessonId]);

  return quickActions;
};

// Saludo de bienvenida al abrir el panel (completo solo la primera vez)
export const useMaxWelcome = ({
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
}) => {
  useEffect(() => {
    if (isOpen && !welcomeSpokenRef.current) {
      welcomeSpokenRef.current = true;
      setMaxState("speaking");

      const alreadyWelcomed = useIALabStore.getState().getMaxWelcomed();
      if (!alreadyWelcomed) {
        useIALabStore.getState().setMaxWelcomed();
        const introGreeting = t("ialab.max.intro_greeting");
        speakTextConversational(introGreeting, "max", {}, () =>
          setMaxState("idle"),
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
            type: "max",
            content: welcomeMessage,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        const greeting = studentName
          ? t("ialab.max.greeting_name", { name: studentName })
          : t("ialab.max.greeting_anon");
        speakTextConversational(greeting, "max", {}, () => setMaxState("idle"));
      }
    }
  }, [isOpen]);
};
