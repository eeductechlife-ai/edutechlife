import { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getVideoQuiz } from "../../../data/ialabVideoQuizzes";

const PASS_COUNT = 2; // de 3

/**
 * Micro-quiz de comprensión que aparece al terminar un video.
 * Evita la pseudocognición: además de "verlo completo", el estudiante debe
 * demostrar que entendió. Al aprobar (>=2/3) se marca el video como visto.
 */
export default function VideoMicroQuiz({ videoId, onPassed }) {
  const { t, locale } = useTranslation();
  const questions = getVideoQuiz(videoId, locale) || [];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const q = questions[current];
  const correctCount = answers.filter((a) => a).length;
  const passed = finished && correctCount >= Math.min(PASS_COUNT, total);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    const isCorrect = selected === q.correct;
    const nextAnswers = [...answers, isCorrect];
    setAnswers(nextAnswers);
    if (current >= total - 1) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  if (total === 0) {
    // Sin preguntas para este video: no bloquear, ofrecer continuar.
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-4">
        <button
          type="button"
          onClick={() => onPassed?.()}
          className="px-6 py-3 rounded-xl bg-white text-slate-900 text-sm font-bold"
        >
          {t("ialab.video_quiz.continue")}
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("ialab.video_quiz.title")}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-5 sm:p-7 my-auto">
        {!finished ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0">
                <Icon name="fa-brain" className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold theme-text leading-tight">
                  {t("ialab.video_quiz.title")}
                </h3>
                <p className="text-xs theme-text-muted">
                  {t("ialab.video_quiz.progress", {
                    current: current + 1,
                    total,
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-1 mb-4" aria-hidden="true">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < current
                      ? "bg-[var(--theme-primary)]"
                      : i === current
                        ? "bg-[var(--theme-emphasis)]"
                        : "bg-slate-200 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm font-semibold theme-text leading-snug mb-4">
              {q.q}
            </p>

            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                const isSel = selected === idx;
                const showResult = selected !== null;
                const isCorrect = idx === q.correct;
                let cls =
                  "w-full text-left p-3.5 rounded-xl border-2 text-sm transition-all theme-text";
                if (!showResult)
                  cls +=
                    " border-slate-200 dark:border-slate-600 hover:border-[var(--theme-primary)] cursor-pointer";
                else if (isCorrect)
                  cls +=
                    " border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                else if (isSel)
                  cls +=
                    " border-rose-300 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
                else
                  cls += " border-slate-200 dark:border-slate-600 opacity-60";
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={showResult}
                    className={cls}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{opt}</span>
                      {showResult && isCorrect && (
                        <Icon
                          name="fa-check"
                          className="text-emerald-500 flex-shrink-0"
                        />
                      )}
                      {showResult && isSel && !isCorrect && (
                        <Icon
                          name="fa-xmark"
                          className="text-rose-500 flex-shrink-0"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className="mt-4">
                <p className="text-xs theme-text-muted mb-3">{q.feedback}</p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-sm font-bold"
                >
                  {current >= total - 1
                    ? t("ialab.video_quiz.see_result")
                    : t("ialab.video_quiz.next")}
                </button>
              </div>
            )}
          </>
        ) : passed ? (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
              <Icon name="fa-check" className="text-emerald-600 text-xl" />
            </div>
            <h3 className="text-base font-bold theme-text mb-1">
              {t("ialab.video_quiz.passed_title")}
            </h3>
            <p className="text-sm theme-text-muted mb-5">
              {t("ialab.video_quiz.passed_desc", {
                correct: correctCount,
                total,
              })}
            </p>
            <button
              type="button"
              onClick={() => onPassed?.()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-sm font-bold"
            >
              {t("ialab.video_quiz.continue")}
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
              <Icon name="fa-rotate-left" className="text-amber-600 text-xl" />
            </div>
            <h3 className="text-base font-bold theme-text mb-1">
              {t("ialab.video_quiz.retry_title")}
            </h3>
            <p className="text-sm theme-text-muted mb-5">
              {t("ialab.video_quiz.retry_desc", {
                correct: correctCount,
                total,
              })}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-sm font-bold"
            >
              {t("ialab.video_quiz.retry")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

VideoMicroQuiz.propTypes = {
  videoId: PropTypes.string,
  onPassed: PropTypes.func,
};
