import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { NEXT_STEP_MODES } from "../../adaptiveNextStep";
import { NextStepCard } from "../../ui";
import { useFeedbackLog } from "../../../../hooks/useFeedbackLog";

const PRACTICE_GRADIENT =
  "linear-gradient(135deg, #EF476F 0%, #FF6B9D 55%, #FF8FA3 100%)";

const FlashcardResults = memo(
  ({
    rate,
    correct,
    incorrect,
    onRestart,
    onBack,
    onTalkToDani,
    darkMode = false,
  }) => {
    const { t } = useTranslation();
    const { logFeedback } = useFeedbackLog();
    const [emotionalFeedback, setEmotionalFeedback] = useState(null);

    const cardBg = darkMode ? "#1E293B" : "#ffffff";
    const borderColor = darkMode ? "rgba(42,58,84,0.6)" : "#E2E8F0";
    const textPrimary = darkMode ? "#F1F5F9" : "#004B63";
    const textSecondary = darkMode ? "#94A3B8" : "#64748B";
    const statBg = darkMode
      ? "rgba(255,107,157,0.10)"
      : "rgba(255,107,157,0.08)";
    const hoverBg = darkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9";

    useEffect(() => {
      if (!emotionalFeedback) return;
      const emotionMap = { easy: "happy", ok: "neutral", hard: "frustrated" };
      logFeedback({
        activity: "flashcard",
        emotion: emotionMap[emotionalFeedback] || "neutral",
        score: rate,
        context: { correct, incorrect },
      });
    }, [emotionalFeedback]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-6 rounded-2xl shadow-md text-center"
          style={{ background: cardBg, border: `1px solid ${borderColor}` }}
        >
          {/* Score ring */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-black text-xl"
            style={{
              background: PRACTICE_GRADIENT,
              boxShadow: "0 8px 24px rgba(239,71,111,0.35)",
            }}
          >
            {rate}%
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: textPrimary }}>
            {t("kid.flashcards.study_completed")}
          </h3>
          <p className="text-sm" style={{ color: textSecondary }}>
            {rate >= 80
              ? "¡Excelente trabajo! 🌟"
              : rate >= 60
                ? "¡Buen esfuerzo! Sigue practicando 💪"
                : "Vamos a repasar un poco más 🎯"}
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mt-4">
            <div className="p-3 rounded-xl" style={{ background: statBg }}>
              <p
                className="text-2xl font-black tabular-nums"
                style={{ color: "#EF476F" }}
              >
                {correct}
              </p>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                {t("kid.flashcards.correct_label")}
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{
                background: darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,75,99,0.05)",
              }}
            >
              <p
                className="text-2xl font-black tabular-nums"
                style={{ color: textPrimary }}
              >
                {correct + incorrect}
              </p>
              <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                {t("kid.flashcards.reviewed_label")}
              </p>
            </div>
          </div>

          {/* Emotional feedback */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {!emotionalFeedback ? (
              <>
                <p className="text-xs" style={{ color: textSecondary }}>
                  ¿Cómo te sentiste?
                </p>
                {[
                  { emoji: "😊", label: "Fácil", value: "easy" },
                  { emoji: "😐", label: "Normal", value: "ok" },
                  { emoji: "😣", label: "Difícil", value: "hard" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setEmotionalFeedback(opt.value)}
                    className="text-xl px-2 py-1 rounded-lg transition-colors"
                    style={{ color: textPrimary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = hoverBg)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    aria-label={opt.label}
                  >
                    {opt.emoji}
                  </button>
                ))}
              </>
            ) : null}
          </div>

          {/* Adaptive next step */}
          {emotionalFeedback && (
            <NextStepCard
              className="mt-4"
              score={rate}
              feedback={emotionalFeedback}
              ctaOverrides={{
                recovery: "Pídele un ejemplo más simple a Dani",
                transfer: "Rétate con Dani a algo más difícil",
                practice: "Repasar una vez más",
              }}
              onAction={(step) => {
                const wantsDani =
                  step.mode !== NEXT_STEP_MODES.PRACTICE && onTalkToDani;
                (wantsDani ? onTalkToDani : onRestart)?.();
              }}
            />
          )}

          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <motion.button
              onClick={onRestart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-white rounded-xl font-bold text-sm shadow-md"
              style={{ background: PRACTICE_GRADIENT }}
            >
              {t("kid.flashcards.study_again")}
            </motion.button>
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: darkMode ? "rgba(255,255,255,0.06)" : "#F8FAFC",
                border: `1px solid ${borderColor}`,
                color: textSecondary,
              }}
            >
              {t("kid.flashcards.back")}
            </motion.button>
            {onTalkToDani && (
              <motion.button
                onClick={onTalkToDani}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-1.5 text-white"
                style={{
                  background: "linear-gradient(135deg, #0077B6, #00B4D8)",
                }}
              >
                🤖 Hablar con Dani
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  },
);

FlashcardResults.displayName = "FlashcardResults";

export default FlashcardResults;
