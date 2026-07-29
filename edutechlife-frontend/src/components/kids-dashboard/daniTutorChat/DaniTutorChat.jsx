import { memo, useRef, useEffect } from "react";
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
  const inputRef = useRef(null);
  const maxChars = 500;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
  } = useDaniChat({ isOpen, onClose, activeTab });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-4 md:p-8"
        style={{ overscrollBehavior: "contain" }}
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("dani.chat_title")}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full max-w-md h-[600px] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
            darkMode
              ? "bg-[#0F172A] border-[#334155]"
              : "bg-[#F8FAFC] border-[#E2E8F0]"
          }`}
          onClick={(e) => e.stopPropagation()}
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
                  onClick={() => setShowCrisisResources(false)}
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
                  onClick={() => setShowEmotionalBanner(false)}
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
                  onClick={() => setDocumentForDani(null)}
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

          <div
            className={`p-4 border-t ${
              darkMode
                ? "bg-[#0F172A] border-[#334155]"
                : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      if (e.target.value.length <= maxChars) {
                        setInputText(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputText);
                      }
                    }}
                    placeholder={
                      activeTab === "examenes"
                        ? t("dani.placeholder_exam") ||
                          "Pregúntame sobre el examen..."
                        : activeTab === "materias"
                          ? t("dani.placeholder_subject") ||
                            "¿Qué materia quieres estudiar?"
                          : t("dani.placeholder")
                    }
                    maxLength={maxChars}
                    className={`w-full px-4 py-3 pr-10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/50 placeholder-[#64748B] transition-all ${
                      darkMode
                        ? "bg-[#1E293B] border border-[#334155] text-[#E2F0FF]"
                        : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#004B63]"
                    }`}
                  />
                  {inputText.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      onClick={() => setInputText("")}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                        darkMode
                          ? "text-[#64748B] hover:text-white"
                          : "text-[#94A3B8] hover:text-[#004B63]"
                      }`}
                      aria-label={t("dani.clear_input") || "Limpiar"}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </motion.button>
                  )}
                </div>
                <motion.button
                  onClick={handleMicClick}
                  disabled={isTyping}
                  aria-label={
                    isListening ? t("dani.mic_stop") : t("dani.mic_start")
                  }
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                    isListening
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                      : darkMode
                        ? "bg-[#1E293B] border border-[#334155] text-[#64748B] hover:bg-[#334155]"
                        : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#E2E8F0]"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic size={20} strokeWidth={2} />
                </motion.button>
                <motion.button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || isTyping}
                  aria-label={t("dani.send")}
                  className="w-12 h-12 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl flex items-center justify-center disabled:opacity-40 shadow-lg flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={20} strokeWidth={2} />
                </motion.button>
              </div>
              <div className="flex items-center justify-between px-1">
                {inputText.length > 0 && (
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      inputText.length > maxChars * 0.9
                        ? "text-red-500"
                        : inputText.length > maxChars * 0.75
                          ? "text-amber-500"
                          : "text-[#64748B]"
                    }`}
                  >
                    {inputText.length}/{maxChars}
                  </span>
                )}
                <span />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <CrisisResourcesModal
        isOpen={showCrisisResources}
        onClose={() => setShowCrisisResources(false)}
        crisisLevel={crisisAlertLevel}
      />
    </AnimatePresence>
  );
});

DaniTutorChat.displayName = "DaniTutorChat";

export default DaniTutorChat;
