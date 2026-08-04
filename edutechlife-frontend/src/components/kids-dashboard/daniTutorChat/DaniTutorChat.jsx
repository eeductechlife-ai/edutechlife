import { memo, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  Smile,
  Frown,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Heart,
  FileText,
  MessageSquare,
  X,
  Send,
  Mic,
} from "lucide-react";
import QuickActions from "../dani/QuickActions";
import RecentTopics from "../dani/RecentTopics";
import DaniChatHeader from "./components/DaniChatHeader";
import DaniChatMessages from "./components/DaniChatMessages";
import CrisisResourcesModal from "../CrisisResourcesModal";
import useDaniChat from "./useDaniChat";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";

const MOOD_ICONS = {
  feliz: Smile,
  triste: Frown,
  enojado: AlertTriangle,
  ansioso: AlertCircle,
  confundido: HelpCircle,
};
const MOOD_COLORS = {
  feliz: "text-green-500",
  triste: "text-blue-400",
  enojado: "text-red-400",
  ansioso: "text-amber-400",
  confundido: "text-[#64748B]",
};

const DaniTutorChat = memo(({ isOpen, onClose, activeTab }) => {
  const { t } = useTranslation();
  const { studentAge } = useSmartBoardKids();
  const isKid = studentAge && studentAge <= 11;
  const inputRef = useRef(null);
  const maxChars = 500;

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

  // Hook must be called first to get handleSendMessage
  const {
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
  } = useDaniChat({ isOpen, activeTab });

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      try {
        const timer = setTimeout(() => {
          if (inputRef?.current) {
            inputRef.current.focus();
          }
        }, 300);
        return () => clearTimeout(timer);
      } catch (error) {
        console.warn("Error focusing input:", error);
      }
    }
  }, [isOpen]);

  const handleBackdropKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  const handleContentClick = useCallback((e) => e.stopPropagation(), []);

  const handleCloseCrisis = useCallback(
    () => setShowCrisisResources(false),
    [],
  );
  const handleCloseEmotional = useCallback(
    () => setShowEmotionalBanner(false),
    [],
  );
  const handleCloseDocument = useCallback(() => setDocumentForDani(null), []);

  const handleInputChange = useCallback((e) => {
    if (e.target.value.length <= maxChars) {
      setInputText(e.target.value);
    }
  }, []);

  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(inputText);
      }
    },
    [handleSendMessage, inputText],
  );

  const handleClearInput = useCallback(() => setInputText(""), []);
  const handleSend = useCallback(
    () => handleSendMessage(inputText),
    [handleSendMessage, inputText],
  );

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="dani-chat-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ overscrollBehavior: "contain" }}
          ref={focusTrapRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("dani.chat_title")}
          onKeyDown={handleBackdropKeyDown}
        >
          {/* Transparent click-catcher to close on outside click (no gray overlay) */}
          <div
            className="absolute inset-0 pointer-events-auto"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative z-10 pointer-events-auto w-[calc(100vw-2rem)] sm:w-auto sm:max-w-2xl md:max-w-2xl max-h-[90vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
              darkMode
                ? "bg-[#0F172A] border-[#334155]"
                : "bg-[#F8FAFC] border-[#E2E8F0]"
            }`}
            onClick={handleContentClick}
          >
            <DaniChatHeader
              isSpeaking={isSpeaking}
              isTyping={isTyping}
              conversationCount={conversationCount}
              toggleVoice={toggleVoice}
              voiceEnabled={voiceEnabled}
              voiceBlocked={voiceBlocked}
              streak={streak}
              socraticMode={socraticMode}
              setSocraticMode={setSocraticMode}
              onClose={onClose}
            />

            {showCrisisResources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mt-2 px-4 py-3 bg-red-50 border border-red-300 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="text-red-500 mt-0.5"
                    size={22}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-800 mb-1">
                      {t("dani.crisis_title")}
                    </p>
                    <p className="text-xs text-red-700 leading-relaxed">
                      <strong>{t("dani.crisis_line1")}</strong>
                      {" | "}
                      <strong>{t("dani.crisis_line2")}</strong>
                      {" | "}
                      <strong>{t("dani.crisis_line3")}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleCloseCrisis}
                    className="text-red-400 hover:text-red-600 text-sm"
                    aria-label={t("dani.close")}
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}

            {showEmotionalBanner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mt-2 px-3 py-2 bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Heart
                    className="text-[#004B63]"
                    size={20}
                    aria-hidden="true"
                  />
                  <p className="text-xs text-[#004B63] flex-1">
                    {t("dani.emotional_banner")}
                  </p>
                  <button
                    onClick={handleCloseEmotional}
                    className="text-[#64748B] hover:text-[#004B63] text-xs"
                    aria-label={t("dani.close")}
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}

            {studentMoodHistory.length > 0 && (
              <div
                className={`flex gap-1 px-4 py-1.5 border-b ${
                  darkMode
                    ? "border-[#334155] bg-[#0F172A]"
                    : "border-[#E2E8F0] bg-white/50"
                }`}
              >
                <span className="text-[10px] text-[#64748B] mr-1">
                  {t("dani.mood_label")}
                </span>
                {studentMoodHistory.slice(-5).map((m, i) => {
                  const MoodIcon = MOOD_ICONS[m.mood] || MessageSquare;
                  return (
                    <span
                      key={i}
                      className={MOOD_COLORS[m.mood] || "text-[#64748B]"}
                    >
                      <MoodIcon size={14} aria-hidden="true" />
                    </span>
                  );
                })}
              </div>
            )}

            {documentForDani && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mt-2 px-3 py-2 bg-gradient-to-r from-[#4DA8C4]/10 to-[#66CCCC]/10 border border-[#4DA8C4]/30 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <FileText
                    className="text-[#004B63]"
                    size={18}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#004B63] truncate">
                      {t("dani.document_analyzing")}{" "}
                      {documentForDani.title || t("dani.document_summary")}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      {documentForDani.score != null
                        ? `${t("dani.document_score")} ${documentForDani.score}/100`
                        : t("dani.document_summary")}
                      {documentForDani.subject
                        ? ` • ${documentForDani.subject}`
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseDocument}
                    className="text-[#64748B] hover:text-[#004B63] text-xs"
                    aria-label={t("dani.document_close")}
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}

            <DaniChatMessages
              daniChatHistory={daniChatHistory}
              streamingMessage={streamingMessage}
              isTyping={isTyping}
              darkMode={darkMode}
              messagesEndRef={messagesEndRef}
            />

            <QuickActions onAction={handleQuickAction} darkMode={darkMode} />

            <RecentTopics
              topics={academicTopics.filter((t) => t.count > 0)}
              onTopicClick={handleTopicClick}
              darkMode={darkMode}
            />

            {/* Improved Chat Input */}
            <motion.div
              className={`flex flex-col gap-3 px-4 pb-4 ${
                darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Input field with improved styling */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={
                      activeTab === "examenes"
                        ? t("dani.placeholder_exam") ||
                          "Pregúntame sobre el examen..."
                        : activeTab === "materias"
                          ? t("dani.placeholder_subject") ||
                            "¿Qué materia quieres estudiar?"
                          : t("dani.placeholder") || "Pregúntale a Dani..."
                    }
                    maxLength={maxChars}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                      darkMode
                        ? "bg-[#1E293B] border border-[#334155] text-[#E2F0FF] placeholder-[#64748B] focus:ring-[#06B6D4]/50 focus:border-[#06B6D4]"
                        : "bg-white border border-[#E2E8F0] text-[#004B63] placeholder-[#94A3B8] focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9]"
                    }`}
                  />
                  {/* Clear button */}
                  {inputText.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleClearInput}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
                      }`}
                      type="button"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>

                {/* Microphone Button */}
                <motion.button
                  onClick={handleMicClick}
                  disabled={isTyping}
                  className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all font-medium ${
                    isListening
                      ? "bg-red-500 text-white shadow-lg"
                      : darkMode
                        ? "bg-[#1E293B] border border-[#334155] text-[#64748B] hover:bg-[#334155]"
                        : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  <Mic size={18} strokeWidth={2} />
                </motion.button>

                {/* Send Button */}
                <motion.button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isTyping}
                  className="w-11 h-11 bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] text-white rounded-lg flex items-center justify-center disabled:opacity-40 shadow-md flex-shrink-0 font-medium transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  <Send size={18} strokeWidth={2} />
                </motion.button>
              </div>

              {/* Character count */}
              {inputText.length > 0 && (
                <div className="flex justify-end px-1">
                  <span
                    className={`text-xs font-medium ${
                      inputText.length > maxChars * 0.9
                        ? "text-red-500"
                        : inputText.length > maxChars * 0.75
                          ? "text-amber-500"
                          : darkMode
                            ? "text-[#64748B]"
                            : "text-[#94A3B8]"
                    }`}
                  >
                    {inputText.length}/{maxChars}
                  </span>
                </div>
              )}

              {/* Status indicator */}
              {isTyping && (
                <motion.div
                  className={`flex items-center gap-2 px-2 py-2 text-xs font-medium rounded-lg ${
                    darkMode
                      ? "bg-[#1E293B] text-[#64748B]"
                      : "bg-[#F0F9FF] text-[#0369A1]"
                  }`}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" />
                  <span
                    className="inline-block w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="inline-block w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                  <span className="ml-1">Dani está escribiendo...</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {showCrisisResources && (
        <CrisisResourcesModal
          isOpen={showCrisisResources}
          onClose={() => setShowCrisisResources(false)}
          crisisLevel={crisisAlertLevel}
        />
      )}
    </>
  );
});

DaniTutorChat.displayName = "DaniTutorChat";

export default DaniTutorChat;
