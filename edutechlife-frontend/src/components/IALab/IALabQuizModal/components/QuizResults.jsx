import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../../../utils/iconMapping";
import { fireConfetti } from "../../../../utils/speech";
import { useIALabStore } from "../../../../store/ialabStore";
import { useTranslation } from "../../../../i18n/I18nProvider";

function AnswerReview({ quizQuestions, quizAnswers }) {
  const { t } = useTranslation();
  const [showReview, setShowReview] = useState(false);

  if (!quizQuestions || quizQuestions.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowReview((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          <Icon
            name="fa-list-check"
            className="text-sm mr-2"
            aria-hidden="true"
          />
          {t("ialab.quiz.review_answers")}
        </span>
        <Icon
          name={showReview ? "fa-chevron-up" : "fa-chevron-down"}
          className="text-sm text-slate-400"
          aria-hidden="true"
        />
      </button>
      {showReview && (
        <div className="mt-3 space-y-3">
          {quizQuestions.map((q, idx) => {
            const userAnswer = quizAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            const userOption = q.options.find((o) => o.id === userAnswer);
            const correctOption = q.options.find(
              (o) => o.id === q.correctAnswer,
            );
            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border-2 ${
                  isCorrect
                    ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700"
                    : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                      isCorrect ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    <Icon
                      name={isCorrect ? "fa-check" : "fa-xmark"}
                      className="text-xs"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="text-xs space-y-1">
                      <p
                        className={
                          isCorrect
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        <span className="font-medium">
                          {t("ialab.quiz.your_answer")}
                        </span>{" "}
                        {userOption?.label || t("ialab.quiz.unanswered")}
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-600 dark:text-emerald-400">
                          <span className="font-medium">
                            {t("ialab.quiz.correct_answer")}
                          </span>{" "}
                          {correctOption?.label}
                        </p>
                      )}
                      <p className="text-slate-500 mt-1">
                        {t("ialab.quiz.topic_label", {
                          topic: q.topic,
                          difficulty: q.difficulty,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function QuizResults({
  quizQuestions,
  quizAnswers,
  quizScore,
  quizPassed,
  quizResult,
  activeMod,
  PASSING_SCORE,
  TOTAL_QUESTIONS,
  generateTopicFeedback,
  isAdmin,
  onClose,
  onRetry,
}) {
  const { t } = useTranslation();
  const [displayScore, setDisplayScore] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (quizPassed) {
      fireConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#004B63", "#00BCD4", "#10B981"],
      });
    }
  }, [quizPassed]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showContent) return;
    if (displayScore < quizScore) {
      const step = Math.max(1, Math.ceil((quizScore - displayScore) / 8));
      const timer = setTimeout(
        () => setDisplayScore((s) => Math.min(s + step, quizScore)),
        40,
      );
      return () => clearTimeout(timer);
    }
  }, [showContent, displayScore, quizScore]);

  if (!quizResult) return null;

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <div
            className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 ${
              quizPassed ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            <div className="relative">
              <Icon
                name={quizPassed ? "fa-trophy" : "fa-exclamation-circle"}
                className={`text-5xl ${quizPassed ? "text-emerald-500" : "text-red-500"}`}
                aria-hidden="true"
              />
              <motion.div
                className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  quizPassed ? "bg-emerald-500" : "bg-red-500"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.3,
                }}
              >
                {displayScore}%
              </motion.div>
            </div>
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${quizPassed ? "text-emerald-600" : "text-red-600"}`}
          >
            {quizPassed ? t("ialab.quiz.passed") : t("ialab.quiz.failed")}
          </h2>
          <p className="text-slate-600">
            {quizPassed
              ? t("ialab.quiz.passed_msg")
              : t("ialab.quiz.failed_msg", { score: PASSING_SCORE })}
          </p>
        </div>

        <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                {quizResult.correctCount}
              </div>
              <div className="text-xs text-slate-500">
                {t("ialab.quiz.correct_count")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {TOTAL_QUESTIONS - quizResult.correctCount}
              </div>
              <div className="text-xs text-slate-500">
                {t("ialab.quiz.incorrect_count")}
              </div>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                quizPassed
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : "bg-gradient-to-r from-red-500 to-red-400"
              }`}
              style={{ width: `${quizScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-600">0%</span>
            <span className="text-xs text-slate-600">
              {t("ialab.quiz.min_score", { score: PASSING_SCORE })}
            </span>
            <span className="text-xs text-slate-600">100%</span>
          </div>
        </div>

        <AnswerReview quizQuestions={quizQuestions} quizAnswers={quizAnswers} />

        {!quizPassed && quizResult?.failedQuestions?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
              <Icon
                name="fa-lightbulb"
                className="text-sm"
                aria-hidden="true"
              />
              {t("ialab.quiz.improvement_areas")}
            </h4>
            <p className="text-xs text-red-600 leading-relaxed">
              {generateTopicFeedback(quizResult.failedQuestions).map(
                (msg, i) => (
                  <span key={i} className="block mb-1">
                    {msg}
                  </span>
                ),
              )}
            </p>
          </div>
        )}

        {quizPassed && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
              <Icon
                name="fa-check-circle"
                className="text-sm"
                aria-hidden="true"
              />
              {t("ialab.quiz.good_work")}
            </h4>
            <p className="text-xs text-emerald-600 leading-relaxed">
              {t("ialab.quiz.good_work_msg")}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 font-medium"
          >
            {t("ialab.quiz.back_to_module")}
          </button>
          {!quizPassed && onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-medium"
            >
              {t("ialab.quiz.retry")}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
