import { memo, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../../../config/api";
import { useTranslation } from "../../../../i18n/I18nProvider";
import {
  Volume2,
  VolumeX,
  Flame,
  Brain,
  MessageSquare,
  X,
  Flag,
  RotateCcw,
} from "lucide-react";
import DaniAvatar from "../components/DaniAvatar";

const DaniChatHeader = memo(
  ({
    isSpeaking,
    isTyping,
    toggleVoice,
    voiceEnabled,
    voiceBlocked,
    streak,
    socraticMode,
    setSocraticMode,
    onClose,
    onNewConversation,
    canStartNew = false,
  }) => {
    const { t } = useTranslation();
    const [showReport, setShowReport] = useState(false);

    const handleReport = () => {
      const msg =
        "🚨 Un estudiante ha reportado un mensaje inapropiado en el chat con Dani.";
      try {
        fetch(`${API_BASE_URL}/api/ingenia/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: "inappropriate_content",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {}
      setShowReport(true);
      setTimeout(() => setShowReport(false), 3000);
    };

    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-[#004B63] via-[#1A7A9A] to-[#4DA8C4] shadow-lg">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            backgroundSize: "200% 100%",
          }}
        />
        <div className="relative px-3 py-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all flex-shrink-0"
              aria-label={t("dani.close")}
            >
              <X size={20} strokeWidth={2.5} aria-hidden="true" />
            </motion.button>
            <DaniAvatar
              size="sm"
              isSpeaking={isSpeaking}
              isThinking={isTyping && !isSpeaking}
            />
            <div className="min-w-0">
              <h3 className="text-white font-bold text-lg leading-tight">
                {t("dani.title")}
              </h3>
              <p className="text-white/80 text-xs truncate" aria-live="polite">
                {isSpeaking
                  ? t("dani.status_speaking")
                  : isTyping
                    ? t("dani.status_writing")
                    : t("dani.status_ready")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {canStartNew && (
              <motion.button
                onClick={onNewConversation}
                className="min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 text-white/80 hover:bg-white/25 hover:text-white flex items-center justify-center transition-all"
                whileTap={{ scale: 0.9 }}
                aria-label="Nueva conversación"
                title="Nueva conversación"
              >
                <RotateCcw size={18} aria-hidden="true" />
              </motion.button>
            )}
            <motion.button
              onClick={toggleVoice}
              className={`min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm transition-all relative ${
                voiceEnabled
                  ? "bg-white/30 text-white hover:bg-white/40"
                  : "bg-white/10 text-white/50 hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={
                voiceBlocked
                  ? t("dani.voice_blocked")
                  : voiceEnabled
                    ? t("dani.voice_disable")
                    : t("dani.voice_enable")
              }
              aria-pressed={voiceEnabled}
            >
              {voiceBlocked ? (
                <VolumeX size={20} aria-hidden="true" />
              ) : voiceEnabled ? (
                <Volume2 size={20} aria-hidden="true" />
              ) : (
                <VolumeX size={20} aria-hidden="true" />
              )}
              {voiceBlocked && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              )}
            </motion.button>
            {streak.current > 0 && (
              <div className="hidden sm:flex bg-white/20 rounded-full px-3 py-1.5 text-white text-xs font-bold items-center gap-1 min-h-[28px]">
                <Flame
                  size={16}
                  className="text-orange-400"
                  aria-hidden="true"
                />
                {streak.current}
              </div>
            )}
            <motion.button
              onClick={() => setSocraticMode((prev) => !prev)}
              className={`min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm transition-all ${
                socraticMode
                  ? "bg-purple-500/40 text-purple-200 hover:bg-purple-500/50"
                  : "bg-white/10 text-white/50 hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={
                socraticMode ? t("dani.socratic_on") : t("dani.socratic_off")
              }
              aria-pressed={socraticMode}
            >
              {socraticMode ? (
                <Brain size={20} aria-hidden="true" />
              ) : (
                <MessageSquare size={20} aria-hidden="true" />
              )}
            </motion.button>
            <motion.button
              onClick={handleReport}
              className="min-w-[40px] min-h-[40px] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 text-white/50 hover:bg-red-500/40 hover:text-red-200 flex items-center justify-center transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Reportar contenido inapropiado"
              title="Reportar"
            >
              <Flag size={18} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
        {showReport && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-0 left-0 right-0 bg-green-500/90 text-white text-xs text-center py-1.5 font-medium"
          >
            Reporte enviado. Revisaremos el contenido.
          </motion.div>
        )}
      </div>
    );
  },
);

DaniChatHeader.displayName = "DaniChatHeader";

export default DaniChatHeader;
