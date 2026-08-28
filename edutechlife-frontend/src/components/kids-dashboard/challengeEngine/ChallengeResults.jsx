import { memo } from "react";
import { motion } from "framer-motion";

function getResultBadge(score) {
  if (score >= 90)
    return {
      emoji: "🏆",
      label: "Excelente",
      color: "from-yellow-400 to-amber-500",
    };
  if (score >= 70)
    return {
      emoji: "⭐",
      label: "Muy bien",
      color: "from-green-400 to-emerald-500",
    };
  if (score >= 50)
    return {
      emoji: "💪",
      label: "Buen intento",
      color: "from-blue-400 to-cyan-500",
    };
  return {
    emoji: "🌱",
    label: "Sigue practicando",
    color: "from-purple-400 to-violet-500",
  };
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
    const badge = getResultBadge(score);
    const correct = answers.filter((a) => a.isCorrect).length;
    const xpEarned =
      score >= 70 ? difficulty.xp : Math.round(difficulty.xp * 0.3);

    const cardBg = darkMode
      ? "bg-[#1E293B]/80 border-[#334155]/50"
      : "bg-white/80 border-[#E2E8F0]/50";
    const textPrimary = darkMode ? "text-white" : "text-[#004B63]";
    const textSecondary = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

    return (
      <div className="space-y-5">
        {/* Score card */}
        <div
          className={`rounded-2xl p-6 border backdrop-blur-xl text-center ${cardBg}`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-5xl mb-3"
          >
            {badge.emoji}
          </motion.div>
          <h3 className={`text-lg font-bold mb-1 ${textPrimary}`}>
            {badge.label}
          </h3>
          <div
            className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold text-2xl mb-3`}
          >
            {score}%
          </div>
          <div
            className={`flex items-center justify-center gap-4 text-xs ${textSecondary}`}
          >
            <span>
              ✅ {correct}/{questions.length} correctas
            </span>
            <span>⚡ +{xpEarned} XP</span>
            <span>
              {subject.emoji} {subject.label}
            </span>
          </div>
        </div>

        {/* Review answers */}
        <div className={`rounded-2xl p-5 border backdrop-blur-xl ${cardBg}`}>
          <h4 className={`text-sm font-bold mb-3 ${textPrimary}`}>
            📋 Revisión
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
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
                  <p className={`font-semibold mb-1 ${textPrimary}`}>
                    {i + 1}. {q.question}
                  </p>
                  {!answer?.isCorrect && (
                    <p className={textSecondary}>✓ {q.options[q.correct]}</p>
                  )}
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
            className="flex-1 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#9D4EDD] to-[#4DA8C4] text-white shadow-lg"
          >
            🔄 Nuevo Reto
          </motion.button>
          <motion.button
            onClick={() => onTabChange?.("progreso")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm border ${
              darkMode
                ? "border-[#334155] text-white hover:bg-[#334155]/50"
                : "border-[#E2E8F0] text-[#004B63] hover:bg-[#F8FAFC]"
            }`}
          >
            📊 Ver Progreso
          </motion.button>
        </div>
      </div>
    );
  },
);

ChallengeResults.displayName = "ChallengeResults";
export default ChallengeResults;
