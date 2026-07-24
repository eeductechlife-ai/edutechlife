import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { Volume2, VolumeX, Flame, Brain, MessageSquare } from "lucide-react";
import DaniAvatar from "../../dani/DaniAvatar";

const DaniChatHeader = memo(
  ({
    isSpeaking,
    isTyping,
    conversationCount,
    toggleVoice,
    voiceEnabled,
    voiceBlocked,
    streak,
    socraticMode,
    setSocraticMode,
  }) => {
    const { t } = useTranslation();
    return (
      <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <DaniAvatar />
          <div>
            <h3 className="text-white font-bold text-lg">{t('dani.title')}</h3>
            <p className="text-white/80 text-xs" aria-live="polite">
              {isSpeaking
                ? t('dani.status_speaking')
                : isTyping
                  ? t('dani.status_writing')
                  : t('dani.status_ready')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conversationCount > 0 && (
            <div className="bg-white/15 rounded-full px-2.5 py-1 text-white text-[10px] font-medium flex items-center gap-1">
              <MessageSquare size={12} aria-hidden="true" />
              {conversationCount}
            </div>
          )}
          <motion.button
            onClick={toggleVoice}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all relative ${
              voiceEnabled
                ? "bg-white/30 text-white hover:bg-white/40"
                : "bg-white/10 text-white/50 hover:bg-white/20"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={
              voiceBlocked
                ? t('dani.voice_blocked')
                : voiceEnabled
                  ? t('dani.voice_disable')
                  : t('dani.voice_enable')
            }
            aria-pressed={voiceEnabled}
          >
            {voiceBlocked ? <VolumeX size={18} aria-hidden="true" /> : voiceEnabled ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
            {voiceBlocked && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            )}
          </motion.button>
          {streak.current > 0 && (
            <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-bold flex items-center gap-1">
              <Flame size={16} className="text-orange-400" aria-hidden="true" />
              {streak.current}
            </div>
          )}
          <motion.button
            onClick={() => setSocraticMode((prev) => !prev)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
              socraticMode
                ? "bg-purple-500/40 text-purple-200 hover:bg-purple-500/50"
                : "bg-white/10 text-white/50 hover:bg-white/20"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={socraticMode ? t('dani.socratic_on') : t('dani.socratic_off')}
            aria-pressed={socraticMode}
          >
            {socraticMode ? <Brain size={18} aria-hidden="true" /> : <MessageSquare size={18} aria-hidden="true" />}
          </motion.button>
        </div>
      </div>
    );
  },
);

DaniChatHeader.displayName = "DaniChatHeader";

export default DaniChatHeader;
