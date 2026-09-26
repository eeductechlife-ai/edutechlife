import { memo, useRef, useEffect, useMemo, useCallback, useState } from "react";
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
  Camera,
  Square,
  Loader2,
} from "lucide-react";
import QuickActions from "./components/QuickActionsImproved";
import { QUICK_ACTION_PREFILL } from "./daniQuickActions";
import { photoPrefill } from "./daniPhoto";
import RecentTopics from "../dani/RecentTopics";
import DaniChatHeader from "./components/DaniChatHeader";
import DaniChatMessages from "./components/DaniChatMessages";
import CrisisResourcesModal from "../CrisisResourcesModal";
import useDaniChat from "./useDaniChat";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { track } from "../../../lib/analytics";
import { SB_COLORS, SB_GRADIENTS, SB_SHADOWS } from "../ingenIATheme";

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
  const { studentAge } = useIngenIAKids();
  const ageGroup =
    studentAge == null
      ? "middle"
      : studentAge <= 9
        ? "early"
        : studentAge <= 12
          ? "middle"
          : "senior";
  const inputRef = useRef(null);
  const maxChars = 1500;
  const photoInputRef = useRef(null);
  const [photoError, setPhotoError] = useState("");

  // Hook must be called first to get handleSendMessage
  const {
    focusTrapRef,
    isSpeaking,
    isTyping,
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
    handleRetry,
    stopResponse,
    startNewConversation,
    readPhoto,
    isReadingPhoto,
    isListening,
    handleMicClick,
    crisisAlertLevel,
  } = useDaniChat({ isOpen, activeTab });

  const hasUserMessages = useMemo(
    () => daniChatHistory.some((m) => m.role === "user"),
    [daniChatHistory],
  );

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }, []);

  // Keep the textarea as tall as its content, up to ~5 lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [inputText]);

  const onQuickAction = useCallback(
    (action) => {
      const prefill = QUICK_ACTION_PREFILL[action];
      if (prefill) {
        setInputText(prefill);
        focusInput();
        return;
      }
      handleQuickAction(action);
    },
    [handleQuickAction, setInputText, focusInput],
  );

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
      setPhotoError("");
    }
  }, []);

  const handleSend = useCallback(() => {
    if (!inputText.trim() || isTyping) return;
    handleSendMessage(inputText);
    if (window.matchMedia("(min-width: 768px)").matches) focusInput();
  }, [handleSendMessage, inputText, isTyping, focusInput]);

  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleClearInput = useCallback(() => {
    setInputText("");
    focusInput();
  }, [setInputText, focusInput]);

  const handlePhotoPicked = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setPhotoError("");
      try {
        const text = await readPhoto(file);
        if (!text) {
          setPhotoError(
            "No pude leer texto en la foto. Tómala con buena luz y la hoja derecha.",
          );
          return;
        }
        setInputText(photoPrefill(text).slice(0, maxChars));
        focusInput();
      } catch (err) {
        setPhotoError(err.message || "No pude leer la foto. Intenta de nuevo.");
      }
    },
    [readPhoto, setInputText, focusInput],
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
            {/* Floating chat widget — no backdrop, IngenIA stays fully visible */}
            <motion.div
              key="dani-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className={`fixed z-[60] inset-0 sm:inset-auto sm:right-4
                sm:bottom-24 md:bottom-8
                w-full sm:w-[440px] md:w-[460px]
                h-[100dvh] sm:h-auto sm:max-h-[min(580px,calc(100dvh-8rem))]
                pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:pt-0 sm:pb-0
                sm:rounded-2xl flex flex-col overflow-hidden sm:border ${
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
                  toggleVoice={toggleVoice}
                  voiceEnabled={voiceEnabled}
                  voiceBlocked={voiceBlocked}
                  streak={streak}
                  socraticMode={socraticMode}
                  setSocraticMode={setSocraticMode}
                  onClose={onClose}
                  onNewConversation={startNewConversation}
                  canStartNew={hasUserMessages}
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
                onRetry={handleRetry}
                ageGroup={ageGroup}
              />

              {/* Bottom controls — flex-shrink-0 keeps this block at the bottom */}
              <div className="flex-shrink-0 flex flex-col min-h-0">
                {/* Scrollable optional extras (quick actions, topics, oral exam) */}
                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "clamp(0px, 30dvh, 180px)" }}
                >
                  <QuickActions
                    onAction={onQuickAction}
                    darkMode={darkMode}
                    studentAge={studentAge ?? 10}
                    hasHistory={hasUserMessages}
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
                      onClick={handleOralExamMode}
                      className={`w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        darkMode
                          ? "bg-[#1E293B] hover:bg-[#243347] text-[#7DD3FC] border border-[#2A3A54]"
                          : "bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]"
                      }`}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      aria-label="Modo Examen Oral: practica hablando con Dani"
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

                {/* Chat input — always fully visible */}
                <div
                  className={`flex flex-col gap-1.5 px-3 pt-2 pb-3 border-t ${
                    darkMode ? "border-[#1E293B]" : "border-[#F1F5F9]"
                  }`}
                  style={{
                    background: darkMode ? SB_COLORS.bgDark : SB_COLORS.bgLight,
                  }}
                >
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <label htmlFor="dani-chat-input" className="sr-only">
                        Escríbele a Dani
                      </label>
                      <textarea
                        id="dani-chat-input"
                        ref={inputRef}
                        rows={1}
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        enterKeyHint="send"
                        placeholder={
                          activeTab === "examenes"
                            ? t("dani.placeholder_exam") ||
                              "Pregúntame sobre el examen..."
                            : activeTab === "materias"
                              ? t("dani.placeholder_subject") ||
                                "¿Qué materia quieres estudiar?"
                              : ageGroup === "early"
                                ? "Escríbeme tu pregunta 😊"
                                : "Escribe tu pregunta o tu tarea…"
                        }
                        maxLength={maxChars}
                        className={`block w-full resize-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 pr-9 rounded-xl font-medium leading-snug focus:outline-none focus:ring-2 transition-[border-color,box-shadow] border text-base ${
                          ageGroup === "early" ? "py-3.5" : "py-3"
                        } ${
                          darkMode
                            ? "text-[#E2F0FF] placeholder-[#64748B]"
                            : "text-[#004B63] placeholder-[#94A3B8]"
                        }`}
                        style={{
                          background: darkMode
                            ? SB_COLORS.surfaceDarkAlt
                            : SB_COLORS.surfaceLight,
                          borderColor: darkMode
                            ? SB_COLORS.borderDark
                            : SB_COLORS.borderLight,
                          "--tw-ring-color": `${SB_COLORS.primary}80`,
                          maxHeight: 132,
                        }}
                      />
                      {inputText.length > 0 && (
                        <button
                          onClick={handleClearInput}
                          className={`absolute right-1 top-1.5 w-8 h-8 flex items-center justify-center rounded-lg ${
                            darkMode
                              ? "text-[#64748B] hover:text-[#E2F0FF]"
                              : "text-[#94A3B8] hover:text-[#004B63]"
                          }`}
                          type="button"
                          aria-label="Borrar lo que escribí"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoPicked}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <motion.button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={isTyping || isReadingPhoto}
                      className={`${ageGroup === "early" ? "w-12 h-12" : "w-11 h-11"} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors border disabled:opacity-40`}
                      style={{
                        background: darkMode
                          ? SB_COLORS.surfaceDarkAlt
                          : SB_COLORS.surfaceLight,
                        borderColor: darkMode
                          ? SB_COLORS.borderDark
                          : SB_COLORS.borderLight,
                        color: SB_COLORS.textMutedLight,
                      }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      aria-label={
                        isReadingPhoto
                          ? "Leyendo tu foto"
                          : "Enviar foto de tu tarea"
                      }
                      title="Foto de tu tarea"
                    >
                      {isReadingPhoto ? (
                        <Loader2
                          size={18}
                          strokeWidth={2}
                          className="animate-spin"
                        />
                      ) : (
                        <Camera size={18} strokeWidth={2} />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={handleMicClick}
                      disabled={isTyping}
                      className={`${ageGroup === "early" ? "w-12 h-12" : "w-11 h-11"} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors border disabled:opacity-40 ${
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
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      aria-pressed={isListening}
                      aria-label={
                        isListening ? "Detener micrófono" : "Hablarle a Dani"
                      }
                    >
                      <Mic size={18} strokeWidth={2} />
                    </motion.button>

                    <motion.button
                      onClick={isTyping ? stopResponse : handleSend}
                      disabled={!isTyping && !inputText.trim()}
                      className={`${ageGroup === "early" ? "w-12 h-12" : "w-11 h-11"} text-white rounded-xl flex items-center justify-center disabled:opacity-40 shadow-md flex-shrink-0 transition-opacity`}
                      style={{ background: SB_GRADIENTS.brandSoft }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      aria-label={
                        isTyping
                          ? "Detener respuesta de Dani"
                          : "Enviar mensaje"
                      }
                      title={isTyping ? "Detener" : "Enviar"}
                    >
                      {isTyping ? (
                        <Square
                          size={16}
                          strokeWidth={2.5}
                          fill="currentColor"
                        />
                      ) : (
                        <Send size={18} strokeWidth={2} />
                      )}
                    </motion.button>
                  </div>

                  <div
                    className={`flex items-center justify-between px-1 text-[11px] ${
                      darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
                    }`}
                  >
                    {photoError ? (
                      <span role="alert" className="text-red-500 font-medium">
                        {photoError}
                      </span>
                    ) : isReadingPhoto ? (
                      <span aria-live="polite">📷 Leyendo tu foto…</span>
                    ) : (
                      <span className="hidden md:inline">
                        Enter para enviar · Shift+Enter para nueva línea
                      </span>
                    )}
                    {inputText.length > maxChars * 0.75 && (
                      <span
                        className={`ml-auto font-medium ${
                          inputText.length > maxChars * 0.9
                            ? "text-red-500"
                            : "text-amber-500"
                        }`}
                      >
                        {inputText.length}/{maxChars}
                      </span>
                    )}
                  </div>
                </div>
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
