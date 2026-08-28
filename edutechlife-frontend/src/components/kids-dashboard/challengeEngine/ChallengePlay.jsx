import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const OPTION_LABELS = ["A", "B", "C", "D"];

const ChallengePlay = memo(
  ({ question, currentIndex, total, onAnswer, darkMode, subject }) => {
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
      setSelected(null);
      setRevealed(false);
    }, [currentIndex]);

    if (!question) return null;

    const handleSelect = (idx) => {
      if (revealed) return;
      setSelected(idx);
      setRevealed(true);
      setTimeout(() => onAnswer(idx), 1200);
    };

    const cardBg = darkMode
      ? "bg-[#1E293B]/80 border-[#334155]/50"
      : "bg-white/80 border-[#E2E8F0]/50";
    const textPrimary = darkMode ? "text-white" : "text-[#004B63]";

    const progress = ((currentIndex + 1) / total) * 100;

    return (
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-lg">{subject?.emoji}</span>
          <div className="flex-1 h-2 rounded-full bg-[#E2E8F0]/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#9D4EDD] to-[#4DA8C4]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={`text-xs font-bold ${textPrimary}`}>
            {currentIndex + 1}/{total}
          </span>
        </div>

        {/* Question card */}
        <div className={`rounded-2xl p-5 border backdrop-blur-xl ${cardBg}`}>
          <p className={`font-semibold text-sm leading-relaxed ${textPrimary}`}>
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correct;
            const isSelected = idx === selected;

            let optionStyle;
            if (revealed && isCorrect) {
              optionStyle =
                "bg-green-500/20 border-green-500/50 text-green-300";
            } else if (revealed && isSelected && !isCorrect) {
              optionStyle = "bg-red-500/20 border-red-500/50 text-red-300";
            } else if (darkMode) {
              optionStyle =
                "bg-[#334155]/50 border-[#475569] text-white hover:border-[#4DA8C4]";
            } else {
              optionStyle =
                "bg-[#F8FAFC] border-[#E2E8F0] text-[#004B63] hover:border-[#4DA8C4]";
            }

            return (
              <motion.button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                whileHover={revealed ? {} : { scale: 1.01 }}
                whileTap={revealed ? {} : { scale: 0.99 }}
                className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${optionStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    revealed && isCorrect
                      ? "bg-green-500 text-white"
                      : revealed && isSelected
                        ? "bg-red-500 text-white"
                        : darkMode
                          ? "bg-[#475569] text-white"
                          : "bg-[#E2E8F0] text-[#004B63]"
                  }`}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className="text-sm">{option}</span>
                {revealed && isCorrect && (
                  <span className="ml-auto text-green-400">✓</span>
                )}
                {revealed && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-400">✕</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation after reveal */}
        {revealed && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border ${
              darkMode
                ? "bg-[#1E293B]/60 border-[#334155]/50"
                : "bg-blue-50/80 border-blue-200/50"
            }`}
          >
            <p
              className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
            >
              💡 {question.explanation}
            </p>
          </motion.div>
        )}
      </div>
    );
  },
);

ChallengePlay.displayName = "ChallengePlay";
export default ChallengePlay;
