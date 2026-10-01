import { motion } from "framer-motion";
import { ArrowLeft, Volume2 } from "lucide-react";

const LETTERS = ["A", "B", "C"];

export default function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  selectedText,
  mode,
  isSpeaking,
  onAnswer,
  onBack,
  onListen,
  t,
}) {
  const explorer = mode === "explorer";
  const halfway = currentQuestion === Math.floor(totalQuestions / 2);

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {halfway && (
        <p
          role="status"
          className="mb-4 text-center text-sm font-bold text-[#047857] bg-[#06D6A0]/15 rounded-full py-1.5"
        >
          {t("vak.ui.halfway")}
        </p>
      )}

      <div className="rounded-2xl bg-[#F0FDFF] border border-[#B2D8E5] p-4 mb-5 flex gap-3 items-start">
        <span
          className={`${explorer ? "text-5xl" : "text-4xl"} leading-none shrink-0`}
          aria-hidden="true"
        >
          {question.emoji}
        </span>
        <div className="min-w-0">
          <p className="!m-0 text-sm text-[#004B63]/70 leading-snug">
            {question.context}
          </p>
          <h2
            className={`!m-0 mt-1 font-extrabold text-[#004B63] leading-tight ${
              explorer ? "text-2xl" : "text-xl md:text-2xl"
            }`}
          >
            {question.text}
          </h2>
        </div>
      </div>

      <div className="space-y-3" role="group" aria-label={question.text}>
        {question.options.map((opt, i) => {
          const picked = selectedText === opt.text;
          return (
            <motion.button
              key={opt.text}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(opt)}
              aria-pressed={picked}
              className={`w-full text-left rounded-2xl border-2 px-4 flex items-center gap-4 transition-colors ${
                explorer ? "min-h-[72px] py-3" : "min-h-[60px] py-2.5"
              } ${
                picked
                  ? "border-[#004B63] bg-[#E6F4F1]"
                  : "border-[#B2D8E5] bg-white hover:border-[#4DA8C4]"
              }`}
            >
              <span
                className="w-8 h-8 shrink-0 rounded-lg bg-[#004B63] text-white text-sm font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {LETTERS[i]}
              </span>
              <span
                className={`${explorer ? "text-3xl" : "text-2xl"} leading-none shrink-0`}
                aria-hidden="true"
              >
                {opt.emoji}
              </span>
              <span
                className={`flex-1 font-semibold text-[#1E293B] leading-snug ${
                  explorer ? "text-lg" : "text-base"
                }`}
              >
                {opt.text}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={currentQuestion === 0}
          className="min-h-[44px] px-3 rounded-xl text-sm font-bold text-[#004B63] flex items-center gap-1.5 disabled:invisible"
        >
          <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
          {t("vak.ui.previous")}
        </button>
        <button
          type="button"
          onClick={onListen}
          className="min-h-[44px] px-4 rounded-xl text-sm font-bold bg-[#E6F4F1] text-[#004B63] flex items-center gap-2"
          aria-live="polite"
        >
          <Volume2 size={18} strokeWidth={2.5} aria-hidden="true" />
          {isSpeaking ? t("vak.ui.speaking") : t("vak.ui.listen")}
        </button>
      </div>
    </motion.div>
  );
}
