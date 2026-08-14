import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callDeepseek } from "../../utils/api";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const getSubjects = (t) => [
  {
    id: "matematicas",
    label: t("oral.subject_matematicas"),
    icon: "🔢",
    color: "#4DA8C4",
  },
  {
    id: "lenguaje",
    label: t("oral.subject_lenguaje"),
    icon: "📖",
    color: "#FF6B9D",
  },
  {
    id: "ciencias",
    label: t("oral.subject_ciencias"),
    icon: "🔬",
    color: "#66CCCC",
  },
  {
    id: "sociales",
    label: t("oral.subject_sociales"),
    icon: "🌍",
    color: "#FFD166",
  },
  {
    id: "ingles",
    label: t("oral.subject_ingles"),
    icon: "🇬🇧",
    color: "#A855F7",
  },
];

const getDifficulties = (t) => [
  {
    id: "facil",
    label: t("oral.difficulty_facil"),
    color: "#22C55E",
    icon: "🌱",
  },
  {
    id: "medio",
    label: t("oral.difficulty_medio"),
    color: "#EAB308",
    icon: "🔥",
  },
  {
    id: "dificil",
    label: t("oral.difficulty_dificil"),
    color: "#EF4444",
    icon: "💀",
  },
];

const dc = (dm, l, d) => (dm ? d : l);

const OralExamSimulator = memo(({ onTabChange }) => {
  const { darkMode: dm, addPoints, activeStudyDeck } = useSmartBoardKids();
  const { t } = useTranslation();
  const SUBJECTS = getSubjects(t);
  const DIFFICULTIES = getDifficulties(t);
  const [phase, setPhase] = useState("setup");
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openAnswer, setOpenAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);

  // When there's an active flashcard deck, use it as context
  const hasDeck = !!activeStudyDeck?.cards?.length;
  const deckContext = hasDeck
    ? activeStudyDeck.cards
        .slice(0, 10)
        .map((c) => `• ${c.front}: ${c.back}`)
        .join("\n")
    : null;

  const generateExam = useCallback(async () => {
    setLoading(true);
    try {
      let prompt;
      if (hasDeck) {
        prompt = `Eres Dani, tutora IA de EdutechLife. El estudiante está repasando el tema "${activeStudyDeck.title}". Aquí están sus tarjetas de estudio:
${deckContext}

Genera una conversación de repaso oral con 4 preguntas basadas en esas tarjetas. Las primeras 3 son de selección múltiple (4 opciones A-D, 1 correcta). La última es abierta. Habla de forma amigable como Dani. Responde SOLO con JSON:
{
  "questions": [
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "B", "explanation": "..." },
    { "type": "open", "question": "...", "modelAnswer": "puntos clave", "explanation": "..." }
  ]
}`;
      } else {
        prompt = `Genera un repaso oral conversacional de ${subject.label} nivel ${difficulty.label} para un estudiante colombiano de grado 6-7. Dani hace 4 preguntas amigables. Las primeras 3 son opción múltiple con 4 opciones (A, B, C, D) y solo 1 correcta. La última es una pregunta abierta. Responde SOLO con JSON:
{
  "questions": [
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "B", "explanation": "..." },
    { "type": "open", "question": "...", "modelAnswer": "puntos clave que debe incluir la respuesta", "explanation": "..." }
  ]
}`;
      }
      const res = await callDeepseek(prompt, {
        temperature: 0.7,
        maxTokens: 1500,
        isJson: true,
      });
      const parsed = typeof res === "string" ? JSON.parse(res) : res;
      setQuestions(parsed.questions || []);
      setPhase("exam");
      setCurrentQ(0);
      setAnswers([]);
      setFeedback(null);
    } catch (e) {
      console.warn("Error generating repaso:", e);
    }
    setLoading(false);
  }, [subject, difficulty, hasDeck, deckContext, activeStudyDeck]);

  const handleAnswer = useCallback(() => {
    const q = questions[currentQ];
    let isCorrect = false;
    let answerText = "";

    if (q.type === "multiple") {
      isCorrect = selectedOption === q.correct;
      answerText = selectedOption;
    } else {
      answerText = openAnswer;
      isCorrect = openAnswer.trim().length > 10;
    }

    // Los puntos se otorgan una sola vez al finalizar el examen
    // (correctCount * 10), no por cada respuesta — evita el doble pago.

    const newAnswers = [
      ...answers,
      { questionIdx: currentQ, answer: answerText, correct: isCorrect },
    ];
    setAnswers(newAnswers);

    setFeedback({ correct: isCorrect, explanation: q.explanation });

    if (currentQ < questions.length - 1) {
      setTimeout(() => {
        setCurrentQ((prev) => prev + 1);
        setFeedback(null);
        setSelectedOption(null);
        setOpenAnswer("");
      }, 2000);
    } else {
      setTimeout(() => {
        const correctCount = newAnswers.filter((a) => a.correct).length;
        const grade = Math.round((correctCount / questions.length) * 100);
        const earnedPoints = correctCount * 10;
        addPoints(
          earnedPoints,
          t("oral.points_desc", { subject: subject.label }),
        );
        setResults({
          correctCount,
          total: questions.length,
          grade,
          earnedPoints,
        });
        setAnimateScore(true);
        setPhase("results");
      }, 2000);
    }
  }, [
    currentQ,
    questions,
    selectedOption,
    openAnswer,
    answers,
    addPoints,
    subject,
    t,
  ]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#A855F7] flex items-center justify-center text-lg shadow-md">
          🗣️
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
          >
            {t("oral.title")}
          </h3>
          <p
            className={`text-xs ${dc(dm, "text-[#64748B]", "text-[#94A3B8]")}`}
          >
            {hasDeck
              ? t("oral.reviewing_deck", { title: activeStudyDeck.title })
              : t("oral.subtitle_no_deck")}
          </p>
        </div>
      </motion.div>

      {/* Active deck banner */}
      {hasDeck && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0077B6] text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70">{t("oral.active_deck")}</p>
              <p className="font-bold">{activeStudyDeck.title}</p>
              <p className="text-xs text-white/70">
                {t("oral.cards_count", { count: activeStudyDeck.cards.length })}
              </p>
            </div>
            <motion.button
              onClick={generateExam}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? t("oral.loading") : t("oral.start_review")}
            </motion.button>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {phase === "setup" && !hasDeck && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700">
              💡 <strong>{t("oral.tip_label")}</strong> {t("oral.tip_desc")}
              <button
                onClick={() => onTabChange?.("flashcards")}
                className="ml-1 font-bold underline"
              >
                {t("oral.go_flashcards")}
              </button>
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-3 ${dc(dm, "text-[#004B63]", "text-white")}`}
              >
                {t("oral.pick_subject")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUBJECTS.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSubject(s)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      subject?.id === s.id
                        ? "border-[#4DA8C4] bg-[#4DA8C4]/5"
                        : dc(
                            dm,
                            "border-[#334155] bg-[#1E293B]",
                            "border-[#E2E8F0] bg-white",
                          )
                    }`}
                  >
                    <span className="text-3xl block mb-1">{s.icon}</span>
                    <p
                      className={`text-xs font-bold ${dc(dm, "text-white", "text-[#004B63]")}`}
                    >
                      {s.label}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {subject && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p
                  className={`text-sm font-semibold mb-3 ${dc(dm, "text-[#004B63]", "text-white")}`}
                >
                  {t("oral.select_difficulty")}
                </p>
                <div className="flex gap-3">
                  {DIFFICULTIES.map((d) => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${
                        difficulty?.id === d.id
                          ? "border-[#4DA8C4] bg-[#4DA8C4]/5"
                          : dc(
                              dm,
                              "border-[#334155] bg-[#1E293B]",
                              "border-[#E2E8F0] bg-white",
                            )
                      }`}
                    >
                      <span className="text-2xl block mb-1">{d.icon}</span>
                      <p
                        className={`text-xs font-bold ${dc(dm, "text-white", "text-[#004B63]")}`}
                      >
                        {d.label}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {subject && difficulty && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateExam}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#FF6B9D] to-[#A855F7] text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />{" "}
                    {t("oral.generating_questions")}
                  </>
                ) : (
                  <>
                    <span className="text-xl">🗣️</span>{" "}
                    {t("oral.talk_with_dani")}
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === "exam" && questions[currentQ] && (
          <motion.div
            key="exam"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentQ + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span
                className={`text-xs font-bold ${dc(dm, "text-white", "text-[#004B63]")}`}
              >
                {currentQ + 1}/{questions.length}
              </span>
            </div>

            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border ${dc(dm, "bg-[#1E293B] border-[#334155]", "bg-white border-[#E2E8F0] shadow-sm")}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">
                  {questions[currentQ].type === "multiple" ? "❓" : "✍️"}
                </span>
                <div>
                  <p
                    className={`text-xs font-semibold mb-1 ${dc(dm, "text-[#4DA8C4]", "text-[#004B63]")}`}
                  >
                    {questions[currentQ].type === "multiple"
                      ? t("oral.multiple_choice")
                      : t("oral.open_question")}
                  </p>
                  <p
                    className={`text-base font-semibold ${dc(dm, "text-white", "text-[#1E293B]")}`}
                  >
                    {questions[currentQ].question}
                  </p>
                </div>
              </div>

              {questions[currentQ].type === "multiple" ? (
                <div className="space-y-2">
                  {questions[currentQ].options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() =>
                          !feedback && setSelectedOption(opt.charAt(0))
                        }
                        className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all flex items-center gap-3 ${
                          feedback
                            ? opt.charAt(0) === questions[currentQ].correct
                              ? "border-green-400 bg-green-50 text-green-700"
                              : selectedOption === opt.charAt(0)
                                ? "border-red-400 bg-red-50 text-red-700"
                                : dc(
                                    dm,
                                    "border-[#334155] opacity-50",
                                    "border-[#E2E8F0] opacity-50",
                                  )
                            : selectedOption === opt.charAt(0)
                              ? "border-[#4DA8C4] bg-[#4DA8C4]/5"
                              : dc(
                                  dm,
                                  "border-[#334155] hover:border-[#4DA8C4]/50",
                                  "border-[#E2E8F0] hover:border-[#4DA8C4]/50",
                                )
                        } ${dc(dm, "text-[#CBD5E1]", "text-[#475569]")}`}
                        disabled={!!feedback}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            feedback &&
                            opt.charAt(0) === questions[currentQ].correct
                              ? "bg-green-400 text-white"
                              : feedback && selectedOption === opt.charAt(0)
                                ? "bg-red-400 text-white"
                                : dc(
                                    dm,
                                    "bg-[#334155] text-[#94A3B8]",
                                    "bg-[#F1F5F9] text-[#64748B]",
                                  )
                          }`}
                        >
                          {letter}
                        </span>
                        {opt.substring(3)}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  disabled={!!feedback}
                  placeholder={t("oral.answer_placeholder")}
                  rows={4}
                  className={`w-full p-3 rounded-xl border text-sm resize-none ${
                    feedback
                      ? "border-green-400 bg-green-50"
                      : dc(
                          dm,
                          "bg-[#0F172A] border-[#334155] text-white",
                          "bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]",
                        )
                  } focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]`}
                />
              )}

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-xl ${feedback.correct ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
                  >
                    <p className="text-sm font-bold mb-1">
                      {feedback.correct
                        ? t("oral.correct")
                        : t("oral.incorrect")}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {feedback.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!feedback && (
                <motion.button
                  onClick={handleAnswer}
                  disabled={
                    questions[currentQ].type === "multiple"
                      ? !selectedOption
                      : openAnswer.trim().length < 3
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {currentQ < questions.length - 1
                    ? t("oral.answer_continue")
                    : t("oral.finish_exam")}
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}

        {phase === "results" && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className={`p-8 rounded-2xl border text-center ${dc(dm, "bg-[#1E293B] border-[#334155]", "bg-white border-[#E2E8F0] shadow-sm")}`}
            >
              <motion.span
                className="text-6xl block mb-4"
                animate={
                  animateScore
                    ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                {results.grade >= 80 ? "🏆" : results.grade >= 50 ? "👍" : "💪"}
              </motion.span>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-black mb-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
              >
                {results.grade}%
              </motion.p>
              <p
                className={`text-sm ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
              >
                {t("oral.correct_count", {
                  correct: results.correctCount,
                  total: results.total,
                })}
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-4 h-3 rounded-full bg-[#E2E8F0] overflow-hidden"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                  initial={{ width: 0 }}
                  animate={{ width: `${results.grade}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`mt-4 text-sm font-bold ${dc(dm, "text-[#4DA8C4]", "text-[#004B63]")}`}
              >
                {t("oral.xp_earned", { points: results.earnedPoints })}
              </motion.p>
            </motion.div>

            <div className="space-y-2">
              {results.grade >= 60 && hasDeck && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTabChange?.("examenes")}
                  className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#0077B6] text-white rounded-xl font-bold text-sm"
                >
                  {t("oral.ready_final_exam")}
                </motion.button>
              )}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPhase("setup");
                  setResults(null);
                  setAnswers([]);
                  setSubject(null);
                  setDifficulty(null);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm"
              >
                {t("oral.review_again")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

OralExamSimulator.displayName = "OralExamSimulator";
export { OralExamSimulator };
export default OralExamSimulator;
