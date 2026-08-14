import React, { useState, useEffect, useRef } from "react";
import useConversationMemory from "../../hooks/useConversationMemory";
import useLeadManagement from "../../hooks/useLeadManagement";
import useLeadCaptureLogic from "../../hooks/useLeadCaptureLogic";
import useAppointmentScheduling from "../../hooks/useAppointmentScheduling";
import {
  useNicoContext,
  buildNicoSystemPrompt,
} from "../../hooks/useNicoContext";
import { useNicoConversationMemory } from "../../hooks/useNicoConversationMemory";
import {
  warmupTts,
  prefetchTts,
  stopSpeech,
  speakTextConversational,
} from "../../utils/speech";
import { COLORS } from "./nicoColors";
import { responseCache } from "./nicoCache";
import { useNicoVoice } from "./useNicoVoice";
import { useNicoSendMessage } from "./useNicoSendMessage";
import { ChatButton, ChatHeader } from "./nicoChatComponents";
import { ChatMessages } from "./nicoChatMessages";
import { ChatInput } from "./nicoChatInput";
import { useTranslation } from "../../i18n/I18nProvider";

const NicoModern = ({
  studentName: initialName = "amigo",
  onNavigate,
  onInteraction,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [typingDots, setTypingDots] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioActivated, setAudioActivated] = useState(false);
  const [audioPermissionError, setAudioPermissionError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showedConversationOptions, setShowedConversationOptions] =
    useState(false);

  const [userContext, setUserContext] = useState({
    userName: null,
    detectedInterest: null,
    studentAge: null,
    conversationStage: "inicio",
    detectedTopics: [],
    conversationPath: [],
    messagesSinceStart: 0,
    nameAskedOnce: false,
    dontWantName: false,
    nameUsageCounter: 0,
  });

  const [conversationPhase, setConversationPhase] = useState("reactive");
  const [lastProactiveIndex, setLastProactiveIndex] = useState(0);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const inputRef = useRef(null);
  const handleSendMessageRef = useRef(null);

  // Load academic context and conversation memory
  const { context: nicoContext, isLoading: contextLoading } = useNicoContext();
  const {
    saveConversation,
    buildConversationContext,
    isSaving: savingConversation,
  } = useNicoConversationMemory();

  const {
    memory = {},
    processMessage = () => {},
    clearMemory = () => {},
    getContextualPrompt = () => "",
  } = useConversationMemory("nico-chat") || {};

  const { currentLead, updateLeadInfo, saveLead } = useLeadManagement();

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
  const [greetingSent, setGreetingSent] = useState(false);
  const [systemPromptContext, setSystemPromptContext] = useState("");
  const [conversationHistoryContext, setConversationHistoryContext] =
    useState("");

  const voice = useNicoVoice({
    audioEnabled,
    setMessage,
    messages,
    setMessages,
    setAudioPermissionError,
    handleSendMessageRef,
  });

  const {
    handleSendMessage,
    handleSaveLead,
    handleScheduleAppointment,
    scrollToBottom,
    messagesEndRef,
  } = useNicoSendMessage({
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

    // Academic context and conversation memory
    systemPromptContext,
    conversationHistoryContext,
    saveConversation,
    nicoContext,

    voice: {
      isSpeakingRef: voice.isSpeakingRef,
      sentenceQueueRef: voice.sentenceQueueRef,
      clearSpeechSafetyTimeout: voice.clearSpeechSafetyTimeout,
      setSpeechSafetyTimeout: voice.setSpeechSafetyTimeout,
      speakFromQueue: voice.speakFromQueue,
      processStreamChunk: voice.processStreamChunk,
      finishStreamAudio: voice.finishStreamAudio,
      setAudioPermissionError,
    },
  });

  handleSendMessageRef.current = handleSendMessage;

  useEffect(() => {
    if (isOpen && !greetingSent && (!messages || messages.length === 0)) {
      setGreetingSent(true);

      const greeting = t("nico.greeting");

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
  }, [isOpen, greetingSent, messages, audioEnabled, t]);

  useEffect(() => {
    if (messages.length === 0 && memory?.conversationHistory?.length > 0) {
      setMessages(memory.conversationHistory);
    }
  }, []);

  // Initialize academic context in system prompt
  useEffect(() => {
    if (nicoContext) {
      const systemPrompt = buildNicoSystemPrompt(nicoContext);
      setSystemPromptContext(systemPrompt);
    }
  }, [nicoContext]);

  // Load conversation history context
  useEffect(() => {
    const loadConversationContext = async () => {
      try {
        const context = await buildConversationContext(5);
        setConversationHistoryContext(context);
      } catch (err) {
        console.warn("[NicoModern] Failed to load conversation context:", err);
      }
    };

    if (isOpen && messages.length > 0) {
      loadConversationContext();
    }
  }, [isOpen]);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        warmupTts();
        prefetchTts(t("nico.greeting_tts"), "nico_premium");
        prefetchTts(t("nico.farewell_tts"), "nico_premium");
        prefetchTts(t("nico.free_class_tts"), "nico_premium");
      } catch (error) {
        console.error("Error inicializando servicios:", error);
      }
    };

    initializeServices();

    return () => {
      voice.clearSpeechSafetyTimeout();
      voice.isSpeakingRef.current = false;
      voice.sentenceQueueRef.current = [];
      stopSpeech();
    };
  }, [buildConversationContext, t]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (!isOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (message.trim() && !isLoading) {
          handleSendMessage();
        }
      }

      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        resetChat();
        setIsOpen(false);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setAudioEnabled((prev) => !prev);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        voice.handleVoiceInput();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [
    isOpen,
    message,
    isLoading,
    voice.isListening,
    handleSendMessage,
    voice.handleVoiceInput,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setMessage("");
    setIsLoading(false);
    setShowSuggestions(true);
    setShowedConversationOptions(false);
    setGreetingSent(false);
    voice.isSpeakingRef.current = false;
    voice.clearSpeechSafetyTimeout();
    voice.sentenceQueueRef.current = [];
    stopSpeech();
    clearMemory();
    responseCache.clear();
    if (voice.speechRecognitionRef.current) {
      voice.speechRecognitionRef.current.stop();
    }
    if (showLeadForm) hideForm();
    if (showScheduler) hideScheduler();
    setShowLeadSuccess(false);
    setShowAppointmentSuccess(false);
  };

  const startNewConversation = () => {
    resetChat();
  };

  const toggleChat = () => {
    const willOpen = !isOpen;

    if (!willOpen) {
      resetChat();
    }

    setIsOpen(willOpen);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (willOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);

      if (messages.length === 0) {
        const welcomeMessage = t("nico.greeting");
        const welcomeMessageObj = {
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, welcomeMessageObj]);

        if (audioEnabled) {
          speakTextConversational(
            welcomeMessage.replace(
              /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]/gu,
              "",
            ),
            "nico_premium",
            {},
            undefined,
            setAudioPermissionError,
          );
        }
      } else if (audioEnabled) {
        const userName = memory?.userName || initialName;
        const nameGreeting = userName !== "amigo" ? ` ${userName}` : "";
        const reconnectMessage = `${t("nico.greeting")}${nameGreeting}`;
        speakTextConversational(
          reconnectMessage,
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
      content: t("nico.cache_cleared"),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, cacheClearedMessage]);
  };

  const viewHistory = () => {
    setShowHistory(!showHistory);
  };

  if (!isOpen) {
    return <ChatButton onClick={toggleChat} />;
  }

  const handleToggleAudio = () => {
    const newAudioEnabled = !audioEnabled;
    setAudioEnabled(newAudioEnabled);
    setAudioPermissionError(null);

    if (newAudioEnabled) {
      const confirmation = t("nico.audio_enabled");
      speakTextConversational(
        confirmation,
        "nico_premium",
        {},
        undefined,
        setAudioPermissionError,
      );
    } else {
      stopSpeech();
    }
  };

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
        <ChatHeader
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
          onNewConversation={startNewConversation}
          onClose={toggleChat}
        />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          showSuggestions={showSuggestions}
          onToggleSuggestions={setShowSuggestions}
          showLeadForm={showLeadForm}
          leadCaptureContext={leadCaptureContext}
          onSaveLead={handleSaveLead}
          onCancelLead={hideForm}
          showLeadSuccess={showLeadSuccess}
          showScheduler={showScheduler}
          schedulerContext={schedulerContext}
          onSchedule={handleScheduleAppointment}
          onCancelSchedule={hideScheduler}
          showAppointmentSuccess={showAppointmentSuccess}
          userContext={userContext}
          onSuggestionClick={(suggestion) => {
            setMessage(suggestion);
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 50);
          }}
          onScheduleOption={(interest) => {
            showSchedulerWithContext({
              leadData: {},
              interest: interest,
            });
          }}
          onAskQuestion={(question) => {
            setMessage(question);
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                setTimeout(() => handleSendMessage(), 100);
              }
            }, 50);
          }}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          message={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          onSend={handleSendMessage}
          isLoading={isLoading}
          isListening={voice.isListening}
          isSpeaking={voice.isSpeaking}
          interimTranscript={voice.interimTranscript}
          audioPermissionError={audioPermissionError}
          onVoiceInput={voice.handleVoiceInput}
          onSpeakResponse={voice.handleSpeakResponse}
          onClearChat={clearChat}
          onClearCache={clearCache}
          inputRef={inputRef}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default NicoModern;
