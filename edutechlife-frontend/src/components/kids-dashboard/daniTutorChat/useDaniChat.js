import { useState, useRef, useEffect, useCallback } from "react";
import { useAuthIdentity } from "../../../hooks/useAuthIdentity";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { speakTextConversational, stopSpeech } from "../../../utils/speech";
import useFocusTrap from "../../../hooks/useFocusTrap";
import { getVoiceOverrides, primeSpeech } from "./DaniVoiceController";
import {
  retrySpeech as retrySpeechFn,
  toggleVoice as toggleVoiceFn,
  handleMicClick as handleMicClickFn,
} from "./daniChatVoice";
import useDaniWelcome from "./useDaniWelcome";
import useDaniSendMessage from "./useDaniSendMessage";

export default function useDaniChat({ isOpen, activeTab }) {
  const { t } = useTranslation();
  // El backend espera un JWT; ahora es el de la sesion de Supabase.
  const { token } = useAuthIdentity();
  const getToken = useCallback(async () => token, [token]);
  const {
    daniChatHistory,
    addDaniMessage,
    daniMood,
    setDaniMood,
    vakResult,
    totalPoints,
    streak,
    buildDaniContext,
    buildMemoryInjection,
    recordMoodInference,
    trackAcademicTopic,
    academicTopics,
    studentMoodHistory,
    conversationCount,
    darkMode,
    calendarEvents,
    documentForDani,
    setDocumentForDani,
    daniMemory,
    updateDaniMemory,
    missions,
    subjects,
    studentAge,
  } = useSmartBoardKids();

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem("edutechlife_dani_voice");
    return saved !== null ? saved === "true" : true;
  });
  const [socraticMode, setSocraticMode] = useState(() => {
    const saved = localStorage.getItem("edutechlife_dani_socratic");
    return saved === "true";
  });
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [showEmotionalBanner, setShowEmotionalBanner] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceBlocked, setVoiceBlocked] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [crisisAlertLevel, setCrisisAlertLevel] = useState(null);
  const messagesEndRef = useRef(null);
  const hasSentWelcome = useRef(false);
  const isSpeakingRef = useRef(false);
  const speechPrimed = useRef(false);
  const pendingSentenceRef = useRef("");
  const focusTrapRef = useFocusTrap(isOpen);
  const [streamingMessage, setStreamingMessage] = useState("");

  const buildRichWelcome = useDaniWelcome({
    streak,
    vakResult,
    calendarEvents,
    activeTab,
    t,
    missions,
    subjects,
  });

  const { handleSendMessage, handleQuickAction, handleTopicClick } =
    useDaniSendMessage({
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
    });

  useEffect(() => {
    localStorage.setItem("edutechlife_dani_voice", voiceEnabled);
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem("edutechlife_dani_socratic", socraticMode);
  }, [socraticMode]);

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
    return () => {
      stopSpeech();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    };
  }, [isOpen]);

  const retrySpeech = useCallback(() => {
    retrySpeechFn({ setVoiceBlocked, speechPrimed });
  }, [setVoiceBlocked, speechPrimed]);

  const toggleVoice = useCallback(() => {
    toggleVoiceFn({ isSpeaking, stopSpeech, setVoiceEnabled, setVoiceBlocked });
  }, [isSpeaking, setVoiceEnabled, setVoiceBlocked]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [daniChatHistory]);

  useEffect(() => {
    if (!isOpen) {
      hasSentWelcome.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || speechPrimed.current) return;
    primeSpeech();
    speechPrimed.current = true;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || hasSentWelcome.current || daniChatHistory.length > 0) return;
    setIsTyping(true);
    setDaniMood("thinking");

    const welcomeText = buildRichWelcome();

    const showWelcome = () => {
      hasSentWelcome.current = true;
      setIsTyping(false);
      setDaniMood("happy");
      addDaniMessage({ role: "assistant", text: welcomeText });
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      const voiceOverrides = getVoiceOverrides(daniMood);
      speakTextConversational(
        welcomeText,
        "dani",
        voiceOverrides,
        () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
        },
        (err) => {
          if (err && err.includes("bloqueado")) {
            setVoiceBlocked(true);
          }
        },
      );
    };

    const timeout = setTimeout(showWelcome, 300);
    return () => {
      clearTimeout(timeout);
      if (!hasSentWelcome.current) setIsTyping(false);
    };
  }, [isOpen]);

  const handleMicClick = useCallback(() => {
    handleMicClickFn({
      isListening,
      setInputText,
      handleSendMessage,
      setIsListening,
    });
  }, [isListening, handleSendMessage]);

  return {
    focusTrapRef,
    isSpeaking,
    isTyping,
    conversationCount,
    toggleVoice,
    voiceEnabled,
    voiceBlocked,
    streak,
    socraticMode,
    setSocraticMode,
    showCrisisResources,
    setShowCrisisResources,
    showEmotionalBanner,
    setShowEmotionalBanner,
    studentMoodHistory,
    darkMode,
    documentForDani,
    setDocumentForDani,
    daniChatHistory,
    streamingMessage,
    messagesEndRef,
    handleQuickAction,
    academicTopics,
    handleTopicClick,
    inputText,
    setInputText,
    handleSendMessage,
    isListening,
    handleMicClick,
    crisisAlertLevel,
  };
}
