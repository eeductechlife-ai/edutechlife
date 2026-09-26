import { memo, useState, useEffect, useRef } from "react";
import { speakAsDani, stopDani } from "../practicarHub/daniSpeak";
import { ListenButton } from "../practicarHub/MaterialViews";
import { motion, AnimatePresence } from "framer-motion";
import QuestionText from "./QuestionText";
import { questionToSpeech, prettyMath } from "./questionTable";

const OPTION_LABELS = ["A", "B", "C", "D"];
const CIRC = 2 * Math.PI * 18;

const PRAISE = ["¡Correcto! 🎉", "¡Muy bien! ⭐", "¡Eso es! 🙌", "¡Genial! 🚀"];

// Brings the feedback + "Siguiente" above the phone's bottom bar. Vertical
// only: scrollIntoView would also nudge the overflow-hidden dashboard sideways.
function revealBelow(el, bottomGap = 96) {
  if (!el) return;
  let box = el.parentElement;
  while (box && !/(auto|scroll)/.test(getComputedStyle(box).overflowY))
    box = box.parentElement;
  const scroller = box || document.scrollingElement;
  const viewBottom = box
    ? box.getBoundingClientRect().bottom
    : window.innerHeight;
  const overflow = el.getBoundingClientRect().bottom - (viewBottom - bottomGap);
  if (overflow > 0) scroller.scrollBy({ top: overflow, behavior: "smooth" });
}

function TimerRing({ timeLeft, limit, color, darkMode }) {
  const tone =
    timeLeft > limit / 2 ? color : timeLeft > limit / 4 ? "#FB8500" : "#EF476F";
  return (
    <div
      className="relative w-12 h-12 flex-shrink-0"
      role="timer"
      aria-label={`Quedan ${timeLeft} segundos`}
    >
      <svg width="48" height="48" aria-hidden="true">
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
          stroke={tone}
          strokeWidth="4"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - timeLeft / limit)}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-black tabular-nums"
        style={{ color: tone }}
      >
        {timeLeft}
      </span>
    </div>
  );
}

const ChallengePlay = memo(
  ({
    question,
    currentIndex,
    total,
    onAnswer,
    onExit,
    darkMode,
    subject,
    timeLimit,
    autoRead = false,
  }) => {
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [confirmExit, setConfirmExit] = useState(false);
    const feedbackRef = useRef(null);
    const rootRef = useRef(null);

    const color = subject?.color || "#9D4EDD";
    const isLast = currentIndex + 1 >= total;

    useEffect(() => {
      setSelected(null);
      setRevealed(false);
      setTimeLeft(timeLimit);
      // New question starts at the top, not where "Siguiente" was.
      const el = rootRef.current;
      if (!el) return;
      let box = el.parentElement;
      while (box && !/(auto|scroll)/.test(getComputedStyle(box).overflowY))
        box = box.parentElement;
      const scroller = box || document.scrollingElement;
      const top =
        el.getBoundingClientRect().top -
        (box ? box.getBoundingClientRect().top : 0);
      if (top < 0) scroller.scrollBy({ top: top - 12, behavior: "smooth" });
    }, [currentIndex, timeLimit]);

    const spoken = question
      ? `${questionToSpeech(question.question).replace(/[.\s]+$/, "")}${/[?!]$/.test(question.question.trim()) ? "" : "."} ${question.options
          .map((o, i) => `Opción ${OPTION_LABELS[i]}: ${o}`)
          .join(". ")}.`
      : "";

    // Young readers (6–8) hear each question automatically.
    useEffect(() => {
      if (!autoRead || !spoken) return;
      speakAsDani(spoken);
      return () => stopDani();
    }, [autoRead, spoken]);

    useEffect(() => {
      if (!timeLimit || revealed) return;
      if (timeLeft <= 0) {
        setRevealed(true);
        return;
      }
      const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }, [timeLeft, revealed, timeLimit]);

    const gotIt = revealed && selected === question?.correct;
    const timedOut = revealed && selected === null;

    useEffect(() => {
      if (!revealed || !question) return undefined;
      const t = setTimeout(() => revealBelow(feedbackRef.current), 60);
      // Young readers also hear the feedback, not just the question.
      if (autoRead) {
        const verdict = gotIt
          ? PRAISE[currentIndex % PRAISE.length].replace(
              /[^\p{L}\p{N}¡!¿?,. ]/gu,
              "",
            )
          : `${timedOut ? "Se acabó el tiempo." : "Casi."} La respuesta correcta es ${question.options[question.correct]}.`;
        speakAsDani(`${verdict} ${question.explanation || ""}`);
      }
      return () => clearTimeout(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [revealed]);

    if (!question) return null;

    const pick = (idx) => {
      if (revealed) return;
      stopDani();
      setSelected(idx);
      setRevealed(true);
    };

    const next = () => {
      stopDani();
      onAnswer(selected ?? -1);
    };

    const surface = darkMode
      ? "bg-[#1E293B] border-[#334155]"
      : "bg-white border-[#E2E8F0]";
    const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
    const textSub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

    return (
      <div ref={rootRef} className="space-y-4">
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 text-white"
            style={{ background: color }}
            aria-hidden="true"
          >
            {subject?.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${textSub}`}>
              Pregunta {currentIndex + 1} de {total}
            </p>
            <div
              className={`mt-1 h-2 rounded-full overflow-hidden ${darkMode ? "bg-[#334155]" : "bg-[#EEF2F6]"}`}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={false}
                animate={{
                  width: `${((currentIndex + (revealed ? 1 : 0)) / total) * 100}%`,
                }}
              />
            </div>
          </div>
          {timeLimit ? (
            <TimerRing
              timeLeft={timeLeft}
              limit={timeLimit}
              color={color}
              darkMode={darkMode}
            />
          ) : null}
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 border-2 ${surface}`}
          style={{ borderColor: `${color}40` }}
        >
          <QuestionText
            text={question.question}
            darkMode={darkMode}
            className={`font-bold text-base sm:text-lg leading-snug ${textPrimary}`}
          />
          <ListenButton
            text={spoken}
            label="Escuchar"
            className={`mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${darkMode ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#1E293B]"}`}
          />
        </motion.div>

        <div
          className="space-y-2.5"
          role="group"
          aria-label="Opciones de respuesta"
        >
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correct;
            const isSelected = idx === selected;
            let tone = darkMode
              ? {
                  bg: "#1E293B",
                  border: "#334155",
                  text: "#fff",
                  chip: "#475569",
                  chipText: "#fff",
                }
              : {
                  bg: "#fff",
                  border: "#E2E8F0",
                  text: "#1E293B",
                  chip: `${color}1F`,
                  chipText: color,
                };
            if (revealed && isCorrect) {
              tone = {
                bg: "rgba(34,197,94,0.12)",
                border: "#22C55E",
                text: darkMode ? "#86EFAC" : "#15803D",
                chip: "#22C55E",
                chipText: "#fff",
              };
            } else if (revealed && isSelected) {
              tone = {
                bg: "rgba(239,68,68,0.10)",
                border: "#EF4444",
                text: darkMode ? "#FCA5A5" : "#B91C1C",
                chip: "#EF4444",
                chipText: "#fff",
              };
            } else if (revealed) {
              tone = { ...tone, text: darkMode ? "#64748B" : "#94A3B8" };
            }
            return (
              <motion.button
                key={idx}
                type="button"
                onClick={() => pick(idx)}
                disabled={revealed}
                whileTap={revealed ? {} : { scale: 0.98 }}
                className="w-full min-h-[56px] px-3.5 py-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D4EDD]"
                style={{
                  background: tone.bg,
                  borderColor: tone.border,
                  color: tone.text,
                }}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: tone.chip, color: tone.chipText }}
                  aria-hidden="true"
                >
                  {revealed && isCorrect
                    ? "✓"
                    : revealed && isSelected
                      ? "✕"
                      : OPTION_LABELS[idx]}
                </span>
                <span className="text-[15px] sm:text-base font-medium leading-snug flex-1">
                  {prettyMath(option)}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.div
              ref={feedbackRef}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border-2 p-4 space-y-3 ${
                gotIt
                  ? darkMode
                    ? "bg-green-500/10 border-green-500/40"
                    : "bg-green-50 border-green-200"
                  : darkMode
                    ? "bg-amber-500/10 border-amber-500/40"
                    : "bg-amber-50 border-amber-200"
              }`}
              role="status"
            >
              <p
                className={`text-base font-black ${gotIt ? "text-green-600" : "text-amber-600"}`}
              >
                {gotIt
                  ? PRAISE[currentIndex % PRAISE.length]
                  : timedOut
                    ? "⏱ ¡Se acabó el tiempo!"
                    : "Casi… ¡así se aprende! 💪"}
              </p>
              {!gotIt && (
                <p className={`text-sm ${textPrimary}`}>
                  La respuesta correcta es{" "}
                  <strong>
                    {OPTION_LABELS[question.correct]}:{" "}
                    {prettyMath(question.options[question.correct])}
                  </strong>
                </p>
              )}
              {question.explanation && (
                <p className={`text-sm leading-relaxed ${textSub}`}>
                  💡 {prettyMath(question.explanation)}
                </p>
              )}
              <button
                type="button"
                onClick={next}
                autoFocus
                className="w-full py-3.5 rounded-xl font-black text-white text-base shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, #9D4EDD 100%)`,
                }}
              >
                {isLast ? "Ver mi resultado 🏁" : "Siguiente →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {onExit && !revealed && (
          <>
            <button
              type="button"
              onClick={() => setConfirmExit(true)}
              className={`w-full py-2 text-xs font-semibold ${textSub}`}
            >
              Salir del reto
            </button>
            <AnimatePresence>
              {confirmExit && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`rounded-2xl p-4 border text-center space-y-3 ${
                    darkMode
                      ? "bg-[#1E293B] border-[#334155]"
                      : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <p
                    className={`text-sm font-bold ${darkMode ? "text-white" : "text-[#1E293B]"}`}
                  >
                    ¿Seguro que quieres salir? 🤔
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                  >
                    Perderás el progreso de este reto.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmExit(false)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border ${
                        darkMode
                          ? "border-[#334155] text-[#94A3B8]"
                          : "border-[#E2E8F0] text-[#64748B]"
                      }`}
                    >
                      Continuar reto
                    </button>
                    <button
                      type="button"
                      onClick={onExit}
                      className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-[#EF476F]"
                    >
                      Salir
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    );
  },
);

ChallengePlay.displayName = "ChallengePlay";
export default ChallengePlay;
