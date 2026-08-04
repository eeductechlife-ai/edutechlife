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
import ChatInputImproved from "./components/ChatInputImproved";
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
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current.focus(), 300);
      return () => clearTimeout(timer);
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-l from-black/30 via-black/10 to-transparent z-50 flex items-end justify-end p-4 md:p-8 backdrop-blur-sm"
        style={{ overscrollBehavior: "contain" }}
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("dani.chat_title")}
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
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

          <ChatInputImproved
            inputText={inputText}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onMicClick={handleMicClick}
            isListening={isListening}
            isTyping={isTyping}
            darkMode={darkMode}
            studentAge={studentAge}
            placeholder={
              activeTab === "examenes"
                ? t("dani.placeholder_exam") || "Pregúntame sobre el examen..."
                : activeTab === "materias"
                  ? t("dani.placeholder_subject") ||
                    "¿Qué materia quieres estudiar?"
                  : t("dani.placeholder") || "Pregúntale a Dani..."
            }
            maxChars={maxChars}
          />
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
