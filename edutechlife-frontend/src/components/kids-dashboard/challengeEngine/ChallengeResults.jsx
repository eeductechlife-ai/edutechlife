import { memo } from "react";
import { motion } from "framer-motion";

const EXPLORE_GRADIENT =
  "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)";

const SUBJECT_COLORS = {
  math: "#FB8500",
  science: "#06D6A0",
  language: "#9D4EDD",
  social: "#EF476F",
  tech: "#118AB2",
  english: "#FFD166",
};

function getResultLabel(score) {
  if (score >= 90)
    return { emoji: "🏆", label: "¡Excelente!", sub: "Dominas esta categoría" };
  if (score >= 70)
    return { emoji: "⭐", label: "¡Muy bien!", sub: "Token desbloqueado" };
  if (score >= 50)
    return { emoji: "💪", label: "Buen intento", sub: "Sigue practicando" };
  return { emoji: "🌱", label: "Casi…", sub: "¡Inténtalo de nuevo!" };
}

const ChallengeResults = memo(
  ({
    score,
    answers,
    questions,
    difficulty,
    subject,
    onRetry,
    onTabChange,
    darkMode,
  }) => {
    const result = getResultLabel(score);
    const correct = answers.filter((a) => a.isCorrect).length;
    const xpEarned =
      score >= 70 ? difficulty.xp : Math.round(difficulty.xp * 0.3);
    const tokenEarned = score >= 70;
    const subjectColor = SUBJECT_COLORS[subject?.id] || "#9D4EDD";

    const cardBg = darkMode
      ? "bg-[#1E293B]/80 border-[#334155]/50"
      : "bg-white/80 border-[#E2E8F0]/50";
    const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
    const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

    return (
      <div className="space-y-5">
        {/* Main result card */}
        <div
          className={`rounded-2xl p-6 border backdrop-blur-xl text-center relative overflow-hidden ${cardBg}`}
        >
          {/* Decorative circle */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-5"
            style={{
              background: subjectColor,
              transform: "translate(30%,-30%)",
            }}
          />

          {/* Subject token (Preguntados-style badge) */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 12,
                delay: 0.1,
              }}
              className="relative"
            >
              {/* Token hex-like circle */}
              <div
                className="w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white"
                style={{
                  background: `linear-gradient(135deg, ${subjectColor} 0%, ${subjectColor}CC 100%)`,
                }}
              >
                <span className="text-3xl mb-0.5">{subject?.emoji}</span>
                <span className="text-white text-[9px] font-black tracking-wide uppercase opacity-90">
                  {subject?.label?.slice(0, 8)}
                </span>
              </div>
              {/* Token earned badge */}
              {tokenEarned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white shadow-lg"
                  style={{ background: EXPLORE_GRADIENT }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="text-5xl font-black mb-1 tabular-nums"
              style={{ color: subjectColor }}
            >
              {score}%
            </div>
            <div className={`text-lg font-bold ${textPrimary}`}>
              {result.emoji} {result.label}
            </div>
            <div className={`text-xs mt-0.5 ${textSecondary}`}>
              {result.sub}
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-[#E2E8F0]/30"
          >
            <div className="text-center">
              <div className={`text-sm font-black ${textPrimary}`}>
                {correct}/{questions.length}
              </div>
              <div className={`text-[10px] ${textSecondary}`}>correctas</div>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]/40" />
            <div className="text-center">
              <div
                className="text-sm font-black"
                style={{ color: tokenEarned ? "#22C55E" : "#FB8500" }}
              >
                +{xpEarned} XP
              </div>
              <div className={`text-[10px] ${textSecondary}`}>ganados</div>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]/40" />
            <div className="text-center">
              <div className={`text-sm font-black ${textPrimary}`}>
                {difficulty.label}
              </div>
              <div className={`text-[10px] ${textSecondary}`}>nivel</div>
            </div>
          </motion.div>

          {/* Token earned banner */}
          {tokenEarned && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${subjectColor} 0%, #9D4EDD 100%)`,
              }}
            >
              🎖 Token de {subject?.label} desbloqueado
            </motion.div>
          )}
        </div>

        {/* Review answers */}
        <div className={`rounded-2xl p-5 border backdrop-blur-xl ${cardBg}`}>
          <h4 className={`text-sm font-bold mb-3 ${textPrimary}`}>
            📋 Revisión
          </h4>
          <div className="space-y-2.5 max-h-56 overflow-y-auto">
            {questions.map((q, i) => {
              const answer = answers[i];
              return (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs ${
                    answer?.isCorrect
                      ? darkMode
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-green-50 border-green-200"
                      : darkMode
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={
                        answer?.isCorrect ? "text-green-500" : "text-red-500"
                      }
                    >
                      {answer?.isCorrect ? "✓" : "✕"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold mb-0.5 ${textPrimary}`}>
                        {i + 1}. {q.question}
                      </p>
                      {!answer?.isCorrect && (
                        <p className={textSecondary}>
                          Correcta: {q.options[q.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-white shadow-lg"
            style={{ background: EXPLORE_GRADIENT }}
          >
            🎡 Nueva Ruleta
          </motion.button>
          <motion.button
            onClick={() => onTabChange?.("progreso")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm border ${
              darkMode
                ? "border-[#334155] text-white hover:bg-[#334155]/50"
                : "border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]"
            }`}
          >
            📊 Mi Progreso
          </motion.button>
        </div>
      </div>
    );
  },
);

ChallengeResults.displayName = "ChallengeResults";
export default ChallengeResults;
