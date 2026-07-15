import { motion } from "framer-motion";
import { formatTime } from "../vakHelpers";
import QuestionCard from "../components/QuestionCard";

export default function renderTest({
  t,
  currentQuestion,
  ageQuestions,
  isValentinaSpeaking,
  feedbackPending,
  showFeedbackButton,
  handleAnswer,
  handleFeedbackClick,
  elapsedTime,
  readQuestionWithOptions,
  getIconComponent,
}) {
  const question = ageQuestions[currentQuestion];
  if (!question) return null;

  const progress = ((currentQuestion + 1) / ageQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {t("vak.ui.question")}
        </div>
        <div className="bg-[#66CCCC] text-white rounded-full px-3 py-1 text-xs font-semibold">
          {currentQuestion + 1} / {ageQuestions.length}
        </div>
      </div>

      <div className="mb-8">
        <div
          className="h-2 bg-gray-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentQuestion + 1}
          aria-valuemin={1}
          aria-valuemax={ageQuestions.length}
          aria-label={t("vak.ui.question")}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-[#4DA8C4] rounded-full"
          />
        </div>
      </div>

      <QuestionCard
        question={question}
        currentQuestion={currentQuestion}
        totalQuestions={ageQuestions.length}
        isValentinaSpeaking={isValentinaSpeaking}
        feedbackPending={feedbackPending}
        showFeedbackButton={showFeedbackButton}
        onAnswer={handleAnswer}
        onFeedbackClick={handleFeedbackClick}
        onRepeatQuestion={() => {
          if (!isValentinaSpeaking && !feedbackPending) {
            readQuestionWithOptions(
              question.text,
              question.options,
              currentQuestion + 1,
              ageQuestions.length,
            );
          }
        }}
        t={t}
        getIconComponent={getIconComponent}
      />

      <div className="text-center">
        <span className="text-xs text-slate-400 uppercase tracking-wider">
          {t("vak.ui.time_elapsed")}: {formatTime(elapsedTime)}
        </span>
      </div>
    </div>
  );
}
