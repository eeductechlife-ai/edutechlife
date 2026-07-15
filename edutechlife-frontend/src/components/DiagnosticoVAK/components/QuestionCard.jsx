import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";

export default function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  isValentinaSpeaking,
  feedbackPending,
  showFeedbackButton,
  onAnswer,
  onFeedbackClick,
  onRepeatQuestion,
  t,
  getIconComponent,
}) {
  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10"
    >
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#004B63] text-center leading-tight">
        {question.text}
      </h2>

      {showFeedbackButton && (
        <div className="flex justify-center my-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onFeedbackClick}
            className="px-8 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            <Sparkles size={24} strokeWidth={2} />
            {t("vak.ui.want_feedback")}
          </motion.button>
        </div>
      )}

      <div className="space-y-4 max-w-2xl mx-auto">
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const IconComponent =
            typeof opt.icon === "string"
              ? getIconComponent(opt.icon)
              : opt.icon;

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={
                isValentinaSpeaking || feedbackPending
                  ? {}
                  : { scale: 1.01, x: 5 }
              }
              whileTap={
                isValentinaSpeaking || feedbackPending ? {} : { scale: 0.99 }
              }
              onClick={() =>
                !isValentinaSpeaking && !feedbackPending && onAnswer(opt)
              }
              disabled={isValentinaSpeaking || feedbackPending}
              className={`w-full text-left p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 group relative overflow-hidden ${
                isValentinaSpeaking || feedbackPending
                  ? "bg-gray-100/50 border-gray-200 cursor-not-allowed opacity-60"
                  : "bg-white/80 border-gray-100 hover:border-[#4DA8C4]"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4DA8C4]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center group-hover:bg-[#4DA8C4]/20 transition-all">
                  <span className="text-base font-bold text-[#4DA8C4]">
                    {letter}
                  </span>
                </div>

                <div className="flex-1 text-base font-medium text-slate-600 leading-relaxed">
                  {opt.text}
                </div>

                {IconComponent && (
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center text-[#4DA8C4] group-hover:bg-[#4DA8C4]/20 transition-all">
                    <IconComponent size={20} strokeWidth={2} />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onRepeatQuestion}
          disabled={isValentinaSpeaking || feedbackPending}
          className="text-[#4DA8C4] text-xs font-medium uppercase tracking-wider flex items-center gap-2 hover:text-[#66CCCC] transition-colors px-4 py-2 rounded-full hover:bg-[#4DA8C4]/5"
          title={t("vak.ui.listen_again")}
        >
          <RotateCcw size={16} strokeWidth={2} />
          <span>{t("vak.ui.repeat_question")}</span>
        </button>
      </div>
    </motion.div>
  );
}
