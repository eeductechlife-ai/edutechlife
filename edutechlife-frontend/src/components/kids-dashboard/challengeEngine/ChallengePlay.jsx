import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const OPTION_LABELS = ["A", "B", "C", "D"];
const TIME_LIMIT = 30;
const CIRC = 2 * Math.PI * 18;

const SUBJECT_COLORS = {
  math: "#FB8500",
  science: "#06D6A0",
  language: "#9D4EDD",
  social: "#EF476F",
  tech: "#118AB2",
  english: "#FFD166",
};

const ChallengePlay = memo(
  ({ question, currentIndex, total, onAnswer, darkMode, subject }) => {
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

    const subjectColor = SUBJECT_COLORS[subject?.id] || "#9D4EDD";

    useEffect(() => {
      setSelected(null);
      setRevealed(false);
      setTimeLeft(TIME_LIMIT);
    }, [currentIndex]);

    useEffect(() => {
      if (revealed) return;
      if (timeLeft <= 0) {
        setRevealed(true);
        setTimeout(() => onAnswer(-1), 1400);
        return;
      }
      const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }, [timeLeft, revealed, onAnswer]);

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
    const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";

    const timerPct = timeLeft / TIME_LIMIT;
    const timerColor =
      timeLeft > 15 ? subjectColor : timeLeft > 7 ? "#FB8500" : "#EF476F";
    const timerOffset = CIRC * (1 - timerPct);

    return (
      <div className="space-y-4">
        {/* Header: subject + dots + timer */}
        <div className="flex items-center gap-3">
          {/* Subject emoji pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-bold flex-shrink-0"
            style={{ background: subjectColor }}
          >
            <span>{subject?.emoji}</span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 flex-1">
            {Array.from({ length: total }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width:
                    i === currentIndex
                      ? "20px"
                      : i < currentIndex
                        ? "16px"
                        : "8px",
                  height: i === currentIndex ? "10px" : "8px",
                }}
                transition={{ duration: 0.3 }}
                className="rounded-full"
                style={{
                  background:
                    i <= currentIndex
                      ? subjectColor
                      : darkMode
                        ? "#334155"
                        : "#E2E8F0",
                  opacity: i > currentIndex ? 0.6 : 1,
                }}
              />
            ))}
          </div>

          {/* Countdown ring */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg width="48" height="48">
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke={darkMode ? "#334155" : "#E2E8F0"}
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke={timerColor}
                strokeWidth="4"
                strokeDasharray={CIRC}
                strokeDashoffset={timerOffset}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
                style={{
                  transition: "stroke-dashoffset 0.9s linear, stroke 0.3s",
                }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[11px] font-black tabular-nums"
              style={{ color: timerColor }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Question card */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 border-2 backdrop-blur-xl ${cardBg}`}
          style={{ borderColor: `${subjectColor}30` }}
        >
          <div
            className="w-8 h-1 rounded-full mb-3"
            style={{ background: subjectColor }}
          />
          <p className={`font-semibold text-sm leading-relaxed ${textPrimary}`}>
            {question.question}
          </p>
        </motion.div>

        {/* Options — Preguntados style */}
        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correct;
            const isSelected = idx === selected;
            const isTimeout = revealed && selected === null;

            let bgStyle;
            let borderColor;
            let textColor;
            let labelBg;
            let labelText;

            if (revealed && isCorrect) {
              bgStyle = "rgba(34,197,94,0.12)";
              borderColor = "rgba(34,197,94,0.6)";
              textColor = "#16A34A";
              labelBg = "#22C55E";
              labelText = "white";
            } else if (revealed && isSelected && !isCorrect) {
              bgStyle = "rgba(239,68,68,0.12)";
              borderColor = "rgba(239,68,68,0.6)";
              textColor = "#DC2626";
              labelBg = "#EF4444";
              labelText = "white";
            } else if (darkMode) {
              bgStyle = "rgba(51,65,85,0.5)";
              borderColor = "rgba(71,85,105,0.8)";
              textColor = "white";
              labelBg = "#475569";
              labelText = "white";
            } else {
              bgStyle = "#F8FAFC";
              borderColor = "#E2E8F0";
              textColor = "#1E293B";
              labelBg = "#EDE9FE";
              labelText = "#7C3AED";
            }

            return (
              <motion.button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                whileHover={
                  revealed ? {} : { scale: 1.01, borderColor: subjectColor }
                }
                whileTap={revealed ? {} : { scale: 0.99 }}
                className="w-full p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors"
                style={{ background: bgStyle, borderColor, color: textColor }}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors"
                  style={{ background: labelBg, color: labelText }}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className="text-sm flex-1">{option}</span>
                {revealed && isCorrect && (
                  <span className="ml-auto text-green-500 font-bold">✓</span>
                )}
                {revealed && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-500 font-bold">✕</span>
                )}
                {isTimeout && isCorrect && (
                  <span className="ml-auto text-green-500 text-xs font-bold">
                    correcta
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Time out indicator */}
        {revealed && selected === null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl border border-orange-300/50 bg-orange-50/80"
          >
            <p className="text-xs text-orange-700 font-semibold">
              ⏱ ¡Tiempo agotado! La respuesta correcta está marcada.
            </p>
          </motion.div>
        )}

        {/* Explanation after reveal */}
        {revealed && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border ${
              darkMode
                ? "bg-[#1E293B]/60 border-[#334155]/50"
                : "bg-purple-50/80 border-purple-200/50"
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
