import { memo } from "react";
import { motion } from "framer-motion";

const ChallengeSetup = memo(
  ({
    subject,
    setSubject,
    difficulty,
    setDifficulty,
    onStart,
    loading,
    error,
    darkMode,
    subjects,
    difficulties,
  }) => {
    const cardBg = darkMode
      ? "bg-[#1E293B]/80 border-[#334155]/50"
      : "bg-white/80 border-[#E2E8F0]/50";
    const textPrimary = darkMode ? "text-white" : "text-[#004B63]";
    const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

    return (
      <div className="space-y-5">
        {/* Subject Selection */}
        <div className={`rounded-2xl p-5 border backdrop-blur-xl ${cardBg}`}>
          <h3 className={`text-sm font-bold mb-3 ${textPrimary}`}>
            1. Elige la materia
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {subjects.map((s) => {
              const selected = subject?.id === s.id;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => setSubject(s)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selected
                      ? "bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] text-white border-transparent shadow-md"
                      : darkMode
                        ? "bg-[#334155]/50 border-[#475569] text-white hover:border-[#4DA8C4]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#004B63] hover:border-[#4DA8C4]"
                  }`}
                >
                  <div className="text-xl mb-1">{s.emoji}</div>
                  <div className="text-xs font-semibold">{s.label}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className={`rounded-2xl p-5 border backdrop-blur-xl ${cardBg}`}>
          <h3 className={`text-sm font-bold mb-3 ${textPrimary}`}>
            2. Nivel de dificultad
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((d) => {
              const selected = difficulty?.id === d.id;
              return (
                <motion.button
                  key={d.id}
                  onClick={() => setDifficulty(d)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selected
                      ? "bg-gradient-to-br from-[#9D4EDD] to-[#C77DFF] text-white border-transparent shadow-md"
                      : darkMode
                        ? "bg-[#334155]/50 border-[#475569] text-white hover:border-[#9D4EDD]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#004B63] hover:border-[#9D4EDD]"
                  }`}
                >
                  <div className="text-xl mb-1">{d.emoji}</div>
                  <div className="text-xs font-bold">{d.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${selected ? "text-white/80" : textSecondary}`}
                  >
                    {d.questions} preguntas · {d.xp} XP
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          disabled={!subject || !difficulty || loading}
          whileHover={{ scale: subject && difficulty ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${
            subject && difficulty && !loading
              ? "bg-gradient-to-r from-[#9D4EDD] to-[#4DA8C4] text-white shadow-lg hover:shadow-xl"
              : darkMode
                ? "bg-[#334155] text-[#64748B] cursor-not-allowed"
                : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.span>
              Generando reto...
            </span>
          ) : (
            "🚀 Iniciar Reto"
          )}
        </motion.button>
      </div>
    );
  },
);

ChallengeSetup.displayName = "ChallengeSetup";
export default ChallengeSetup;
