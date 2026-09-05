import { memo, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
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
import QuickActions from "./components/QuickActionsImproved";
import RecentTopics from "../dani/RecentTopics";
import DaniChatHeader from "./components/DaniChatHeader";
import DaniChatMessages from "./components/DaniChatMessages";
import CrisisResourcesModal from "../CrisisResourcesModal";
import useDaniChat from "./useDaniChat";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { track } from "../../../lib/analytics";
import { SB_COLORS, SB_GRADIENTS, SB_SHADOWS } from "../smartboardTheme";

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

const DaniTutorChat = memo(({ isOpen, onClose, activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const { studentAge } = useSmartBoardKids();
  const isKid = studentAge && studentAge <= 11;
  const ageGroup =
    studentAge <= 8 ? "early" : studentAge <= 12 ? "middle" : "senior";
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
    if (isOpen) track("dani_opened", { tab: activeTab });
  }, [isOpen, activeTab]);

  useEffect(() => {
    // Auto-focus only on desktop — on mobile the keyboard would shift the viewport
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isOpen && isDesktop && inputRef?.current) {
      try {
        const timer = setTimeout(() => {
          if (inputRef?.current) {
            inputRef.current.focus({ preventScroll: true });
          }
        }, 400);
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

  const handleOralExamMode = useCallback(() => {
    onClose();
    onTabChange?.("oral");
  }, [onClose, onTabChange]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Floating chat widget — no backdrop, SmartBoard stays fully visible */}
            <motion.div
              key="dani-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className={`fixed right-4 z-[55]
                bottom-[5.5rem] sm:bottom-24 md:bottom-8
                w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px]
                max-h-[70dvh] sm:max-h-[min(580px,calc(100dvh-8rem))]
                rounded-2xl flex flex-col overflow-hidden border ${
                  darkMode ? "border-[#2A3A54]" : "border-[#E2E8F0]"
                }`}
              style={{
                boxShadow: SB_SHADOWS.float,
                background: darkMode ? SB_COLORS.bgDark : SB_COLORS.bgLight,
              }}
              ref={focusTrapRef}
              role="complementary"
              aria-label={t("dani.chat_title")}
              onKeyDown={handleBackdropKeyDown}
              onClick={handleContentClick}
            >
              <div className="flex-shrink-0">
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
              </div>

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
                  className="mx-4 mt-2 px-3 py-2 rounded-xl border"
                  style={{
                    background: `linear-gradient(135deg, ${SB_COLORS.primary}18, ${SB_COLORS.cyan}18)`,
                    borderColor: `${SB_COLORS.primary}40`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Heart
                      size={20}
                      aria-hidden="true"
                      style={{ color: SB_COLORS.deep }}
                    />
                    <p
                      className="text-xs flex-1"
                      style={{ color: SB_COLORS.deepAlt }}
                    >
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
                  className="mx-4 mt-2 px-3 py-2 rounded-xl border"
                  style={{
                    background: `linear-gradient(135deg, ${SB_COLORS.primary}18, ${SB_COLORS.cyan}18)`,
                    borderColor: `${SB_COLORS.primary}40`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FileText
                      size={18}
                      aria-hidden="true"
                      style={{ color: SB_COLORS.deep }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-bold truncate"
                        style={{ color: SB_COLORS.deep }}
                      >
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

              {/* Bottom controls — flex-shrink-0 keeps this block at the bottom */}
              <div className="flex-shrink-0 flex flex-col min-h-0">
                {/* Scrollable optional extras (quick actions, topics, oral exam) */}
                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "clamp(0px, 30dvh, 180px)" }}
                >
                  <QuickActions
                    onAction={handleQuickAction}
                    darkMode={darkMode}
                    studentAge={studentAge}
                    hasHistory={daniChatHistory.length > 0}
                  />

                  <RecentTopics
                    topics={academicTopics.filter((t) => t.count > 0)}
                    onTopicClick={handleTopicClick}
                    darkMode={darkMode}
                  />

                  {/* Oral Exam Mode trigger */}
                  <div
                    className={`px-4 pt-2 pb-1 border-t ${darkMode ? "border-[#1E293B]" : "border-[#F1F5F9]"}`}
                  >
                    <motion.button
                      type="button"
                      onClick={handleOralExamMode}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        darkMode
                          ? "bg-[#1E293B] hover:bg-[#243347] text-[#7DD3FC] border border-[#2A3A54]"
                          : "bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]"
                      }`}
                      style={
                        !isListening
                          ? {
                              background: darkMode
                                ? SB_COLORS.surfaceDarkAlt
                                : SB_COLORS.surfaceLight,
                              borderColor: darkMode
                                ? SB_COLORS.borderDark
                                : SB_COLORS.borderLight,
                              color: SB_COLORS.textMutedLight,
                            }
                          : {}
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      aria-label={
                        isListening ? "Detener micrófono" : "Activar micrófono"
                      }
                    >
                      <span className="text-base">🎤</span>
                      <span>Modo Examen Oral</span>
                      <span
                        className={`ml-auto text-[10px] font-medium ${darkMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}
                      >
                        Habla con Dani
                      </span>
                    </motion.button>
                  </div>
                </div>
                {/* end scrollable extras */}

                {/* Improved Chat Input — always fully visible */}
                <motion.div
                  className="flex flex-col gap-3 px-4 pb-4"
                  style={{
                    background: darkMode ? SB_COLORS.bgDark : SB_COLORS.bgLight,
                  }}
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
                        className={`w-full px-4 rounded-xl font-medium focus:outline-none focus:ring-2 transition-all ${
                          ageGroup === "early"
                            ? "py-4 text-base"
                            : ageGroup === "senior"
                              ? "py-2.5 text-sm"
                              : "py-3 text-sm"
                        } ${
                          darkMode
                            ? "border text-[#E2F0FF] placeholder-[#64748B]"
                            : "border text-[#004B63] placeholder-[#94A3B8]"
                        }`}
                        style={{
                          background: darkMode
                            ? SB_COLORS.surfaceDarkAlt
                            : SB_COLORS.surfaceLight,
                          borderColor: darkMode
                            ? SB_COLORS.borderDark
                            : SB_COLORS.borderLight,
                          "--tw-ring-color": `${SB_COLORS.primary}80`,
                        }}
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
                      className={`${ageGroup === "early" ? "w-12 h-12" : "w-11 h-11"} rounded-lg flex items-center justify-center flex-shrink-0 transition-all font-medium border ${
                        isListening
                          ? "bg-red-500 text-white shadow-lg border-red-500"
                          : ""
                      }`}
                      style={
                        !isListening
                          ? {
                              background: darkMode
                                ? SB_COLORS.surfaceDarkAlt
                                : SB_COLORS.surfaceLight,
                              borderColor: darkMode
                                ? SB_COLORS.borderDark
                                : SB_COLORS.borderLight,
                              color: SB_COLORS.textMutedLight,
                            }
                          : {}
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      aria-label={
                        isListening ? "Detener micrófono" : "Activar micrófono"
                      }
                    >
                      <Mic size={18} strokeWidth={2} />
                    </motion.button>

                    {/* Send Button */}
                    <motion.button
                      onClick={handleSend}
                      disabled={!inputText.trim() || isTyping}
                      className={`${ageGroup === "early" ? "w-12 h-12" : "w-11 h-11"} text-white rounded-lg flex items-center justify-center disabled:opacity-40 shadow-md flex-shrink-0 font-medium transition-all`}
                      style={{ background: SB_GRADIENTS.brandSoft }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      aria-label="Enviar mensaje"
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
              </div>
              {/* end flex-shrink-0 bottom controls */}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showCrisisResources && (
        <CrisisResourcesModal
          isOpen={showCrisisResources}
          onClose={() => setShowCrisisResources(false)}
          crisisLevel={crisisAlertLevel}
        />
      )}
    </>,
    document.body,
  );
});

DaniTutorChat.displayName = "DaniTutorChat";

export default DaniTutorChat;
