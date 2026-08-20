import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  Trophy,
  RefreshCcw,
  Lightbulb,
  Target,
} from "lucide-react";
import { Icon } from "../../../utils/iconMapping";

const IntegrationExercise = ({
  icon = "fa-puzzle-piece",
  badge,
  title,
  description,
  questions,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (idx) => {
    if (feedback) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) setScore(score + 1);
    setFeedback(isCorrect ? "correct" : "incorrect");
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setFeedback(null);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
      onComplete?.();
    }
  };

  const restart = () => {
    setStarted(false);
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setFinished(false);
  };

  if (!started) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider border border-indigo-200 dark:border-indigo-700 mb-6">
            <Icon name={icon} className="text-sm" />
            <span>{badge || t("ialab.integration_exercise.badge")}</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-6">
            <Star className="text-white text-2xl sm:text-3xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--theme-emphasis)] dark:text-white mb-4 font-montserrat leading-tight">
            {title || t("ialab.integration_exercise.title")}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
              {description}
            </p>
          )}
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
          >
            <span className="flex items-center gap-2">
              <Target className="text-sm" />
              {t("ialab.integration_exercise.start")}
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl text-center border border-slate-100 dark:border-slate-700"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-6 relative">
            <Trophy className="text-indigo-500 w-10 h-10" />
            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-slate-800 shadow">
              {score}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--theme-emphasis)] dark:text-white mb-2">
            {t("ialab.integration_exercise.completed_title")}
          </h2>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 my-4">
            {percentage}%
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {t("ialab.integration_exercise.score", {
              score,
              total: questions.length,
            })}
          </p>
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold hover:border-indigo-500 transition-all text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCcw size={16} />
            {t("ialab.integration_exercise.retry")}
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
              {t("ialab.integration_exercise.question_label", {
                current: currentQ + 1,
                total: questions.length,
              })}
            </span>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentQ ? "w-8 bg-indigo-500" : i < currentQ ? "w-2 bg-emerald-400" : "w-2 bg-slate-200 dark:bg-slate-600"}`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-[var(--theme-emphasis)] dark:text-white mb-6 leading-tight">
            {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isSelected = selectedAnswer === i;
              let btnClass =
                "w-full p-4 rounded-xl border-2 text-left font-medium transition-all text-sm ";
              if (!feedback) {
                btnClass +=
                  "border-gray-100 dark:border-slate-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20";
              } else if (isCorrect) {
                btnClass +=
                  "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
              } else if (isSelected) {
                btnClass +=
                  "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
              } else {
                btnClass += "border-gray-50 dark:border-slate-700 opacity-40";
              }
              return (
                <button
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(i)}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${!feedback ? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300" : isCorrect ? "bg-emerald-500 text-white" : isSelected ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500"}`}
                    >
                      {["A", "B", "C", "D"][i]}
                    </div>
                    <span>{opt}</span>
                    {feedback && isCorrect && (
                      <CheckCircle2
                        className="text-emerald-500 ml-auto shrink-0"
                        size={18}
                      />
                    )}
                    {feedback && isSelected && !isCorrect && (
                      <XCircle
                        className="text-red-500 ml-auto shrink-0"
                        size={18}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl border-l-4 ${feedback === "correct" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500" : "bg-red-50 dark:bg-red-900/20 border-red-500"}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-1.5 rounded-lg ${feedback === "correct" ? "bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600" : "bg-red-100 dark:bg-red-800/30 text-red-600"}`}
                >
                  {feedback === "correct" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">
                    {feedback === "correct"
                      ? t("ialab.integration_exercise.correct")
                      : t("ialab.integration_exercise.incorrect")}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
              <button
                onClick={nextQuestion}
                className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-bold transition-colors text-sm flex items-center justify-center gap-2"
              >
                {currentQ < questions.length - 1
                  ? t("ialab.integration_exercise.next")
                  : t("ialab.integration_exercise.see_results")}
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

IntegrationExercise.propTypes = {
  icon: PropTypes.string,
  badge: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      correct: PropTypes.number.isRequired,
      explanation: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onComplete: PropTypes.func,
};

export default IntegrationExercise;
