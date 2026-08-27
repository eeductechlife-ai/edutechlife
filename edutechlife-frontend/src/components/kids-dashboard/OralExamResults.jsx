import { memo } from "react";
import { motion } from "framer-motion";
import { dc } from "./oralExamUtils";
import { NextStepCard } from "./ui";
import { useTranslation } from "../../i18n/I18nProvider";

const OralExamResults = memo(
  ({
    dm,
    results,
    animateScore,
    emotionalFeedback,
    hasDeck,
    setEmotionalFeedback,
    setPhase,
    setResults,
    setAnswers,
    setSubject,
    setDifficulty,
    onTabChange,
  }) => {
    const { t } = useTranslation();
    return (
      <motion.div
        key="results"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className={`p-8 rounded-2xl border text-center ${dc(dm, "bg-[#1E293B] border-[#334155]", "bg-white border-[#E2E8F0] shadow-sm")}`}
        >
          <motion.span
            className="text-6xl block mb-4"
            animate={
              animateScore
                ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
                : {}
            }
            transition={{ duration: 0.6 }}
          >
            {results.grade >= 80 ? "🏆" : results.grade >= 50 ? "👍" : "💪"}
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black mb-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
          >
            {results.grade}%
          </motion.p>
          <p
            className={`text-sm ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
          >
            {t("oral.correct_count", {
              correct: results.correctCount,
              total: results.total,
            })}
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 h-3 rounded-full bg-[#E2E8F0] overflow-hidden"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
              initial={{ width: 0 }}
              animate={{ width: `${results.grade}%` }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-4 text-sm font-bold ${dc(dm, "text-[#4DA8C4]", "text-[#004B63]")}`}
          >
            {t("oral.xp_earned", { points: results.earnedPoints })}
          </motion.p>
        </motion.div>

        {!emotionalFeedback && (
          <div className="flex items-center justify-center gap-3 py-2">
            <p className="text-xs text-[#94A3B8]">¿Cómo te sentiste?</p>
            {[
              { emoji: "😊", label: "Fácil", value: "easy" },
              { emoji: "😐", label: "Normal", value: "ok" },
              { emoji: "😣", label: "Difícil", value: "hard" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setEmotionalFeedback(opt.value)}
                aria-label={opt.label}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#4DA8C4] transition-all"
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-[10px] font-bold text-[#64748B]">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        )}
        {emotionalFeedback && (
          <NextStepCard
            score={results.grade}
            feedback={emotionalFeedback}
            dark={dm}
            onAction={(step) => {
              if (step.tab) {
                onTabChange?.(step.tab);
              } else {
                setPhase("setup");
                setResults(null);
                setAnswers([]);
                setSubject(null);
                setDifficulty(null);
              }
            }}
          />
        )}

        <div className="space-y-2">
          {results.grade >= 60 && hasDeck && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange?.("examenes")}
              className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#0077B6] text-white rounded-xl font-bold text-sm"
            >
              {t("oral.ready_final_exam")}
            </motion.button>
          )}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setPhase("setup");
              setResults(null);
              setAnswers([]);
              setSubject(null);
              setDifficulty(null);
            }}
            className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm"
          >
            {t("oral.review_again")}
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

OralExamResults.displayName = "OralExamResults";
export default OralExamResults;
