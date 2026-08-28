import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { NEXT_STEP_MODES } from "../../adaptiveNextStep";
import { NextStepCard } from "../../ui";
import { useFeedbackLog } from "../../../../hooks/useFeedbackLog";

const FlashcardResults = memo(
  ({ rate, correct, incorrect, onRestart, onBack, onTalkToDani }) => {
    const { t } = useTranslation();
    const { logFeedback } = useFeedbackLog();
    const [emotionalFeedback, setEmotionalFeedback] = useState(null);

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
          className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-md text-center"
        >
          <span className="text-5xl block mb-4">🎉</span>
          <h3 className="text-lg font-bold text-[#004B63] mb-2">
            {t("kid.flashcards.study_completed")}
          </h3>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mt-4">
            <div className="p-3 rounded-xl bg-[#66CCCC]/10">
              <p className="text-2xl font-black text-[#004B63]">{rate}%</p>
              <p className="text-xs text-[#64748B]">
                {t("kid.flashcards.correct_label")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#4DA8C4]/10">
              <p className="text-2xl font-black text-[#004B63]">
                {correct + incorrect}
              </p>
              <p className="text-xs text-[#64748B]">
                {t("kid.flashcards.reviewed_label")}
              </p>
            </div>
          </div>
          {/* Emotional feedback */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {!emotionalFeedback ? (
              <>
                <p className="text-xs text-[#94A3B8]">¿Cómo te sentiste?</p>
                {[
                  { emoji: "😊", label: "Fácil", value: "easy" },
                  { emoji: "😐", label: "Normal", value: "ok" },
                  { emoji: "😣", label: "Difícil", value: "hard" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setEmotionalFeedback(opt.value)}
                    className="text-xl px-2 py-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                    aria-label={opt.label}
                  >
                    {opt.emoji}
                  </button>
                ))}
              </>
            ) : null}
          </div>

          {/* Adaptive next step — recovery / practice / transfer (§54–57) */}
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
              className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm shadow-md"
            >
              {t("kid.flashcards.study_again")}
            </motion.button>
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm"
            >
              {t("kid.flashcards.back")}
            </motion.button>
            {onTalkToDani && (
              <motion.button
                onClick={onTalkToDani}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-1.5"
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
