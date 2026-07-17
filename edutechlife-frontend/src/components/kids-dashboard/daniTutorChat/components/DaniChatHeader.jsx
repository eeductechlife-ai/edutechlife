import { memo } from "react";
import { motion } from "framer-motion";
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
    return (
      <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <DaniAvatar />
          <div>
            <h3 className="text-white font-bold text-lg">Dani</h3>
            <p className="text-white/80 text-xs">
              {isSpeaking
                ? "Hablando..."
                : isTyping
                  ? "Escribiendo..."
                  : "Tu mentor virtual"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conversationCount > 0 && (
            <div className="bg-white/15 rounded-full px-2.5 py-1 text-white text-[10px] font-medium">
              💬 {conversationCount}
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
            title={
              voiceBlocked
                ? "Voz bloqueada por el navegador — toca para re-intentar"
                : voiceEnabled
                  ? "Desactivar voz"
                  : "Activar voz"
            }
          >
            {voiceBlocked ? "🔇" : voiceEnabled ? "🔊" : "🔇"}
            {voiceBlocked && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            )}
          </motion.button>
          {streak.current > 0 && (
            <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-bold flex items-center gap-1">
              🔥 {streak.current}
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
            title={
              "Modo Socrático: guía con preguntas — " +
              (socraticMode ? "ACTIVADO" : "DESACTIVADO")
            }
          >
            {socraticMode ? "🧠" : "💬"}
          </motion.button>
        </div>
      </div>
    );
  },
);

DaniChatHeader.displayName = "DaniChatHeader";

export default DaniChatHeader;
