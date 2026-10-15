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
  valeriaLine = "",
}) {
  const question = ageQuestions[currentQuestion];
  if (!question) return null;

  const total = ageQuestions.length;
  const progress = ((currentQuestion + 1) / total) * 100;

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4">
      <div className="flex items-center justify-end mb-3">
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

      {valeriaLine && (
        <motion.div
          key={valeriaLine}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 flex items-start gap-2.5"
          role="status"
          aria-live="polite"
        >
          <img
            src="/valeria.webp"
            alt=""
            className={`h-10 w-10 shrink-0 rounded-full border-2 object-cover ${
              isValentinaSpeaking ? "border-[#06D6A0]" : "border-white"
            } shadow-sm`}
          />
          <p className="!m-0 rounded-2xl rounded-tl-sm bg-[#072F46] px-3.5 py-2 text-sm leading-snug text-white shadow-sm">
            <span className="sr-only">Valeria: </span>
            {valeriaLine}
          </p>
        </motion.div>
      )}

      <QuestionCard
        question={question}
        showHalfway={!valeriaLine}
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
