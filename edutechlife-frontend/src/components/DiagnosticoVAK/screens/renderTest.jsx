import { motion } from "framer-motion";
import { getVakMode } from "../../../data/vakQuestions";
import QuestionCard from "../components/QuestionCard";

export default function renderTest({
  t,
  currentQuestion,
  ageQuestions,
  answers,
  studentAge,
  isValentinaSpeaking,
  handleAnswer,
  goBack,
  listenToQuestion,
}) {
  const question = ageQuestions[currentQuestion];
  if (!question) return null;

  const total = ageQuestions.length;
  const progress = ((currentQuestion + 1) / total) * 100;

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="!m-0 text-sm font-bold text-[#004B63]">
          {t("vak.ui.progress_label", {
            current: currentQuestion + 1,
            total,
          })}
        </p>
        <p className="!m-0 text-xs text-[#004B63]/60 hidden md:block">
          {t("vak.ui.keys_hint")}
        </p>
      </div>

      <div
        className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden mb-6"
        role="progressbar"
        aria-valuenow={currentQuestion + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={t("vak.ui.question")}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
        />
      </div>

      <QuestionCard
        question={question}
        currentQuestion={currentQuestion}
        totalQuestions={total}
        selectedText={answers[currentQuestion]?.text}
        mode={getVakMode(studentAge)}
        isSpeaking={isValentinaSpeaking}
        onAnswer={handleAnswer}
        onBack={goBack}
        onListen={listenToQuestion}
        t={t}
      />
    </div>
  );
}
