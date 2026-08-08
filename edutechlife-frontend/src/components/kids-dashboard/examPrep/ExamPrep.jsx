import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subjects, inpCls, gdCls } from "./examUtils";
import useExamPrep from "./useExamPrep";
import ExamList from "./components/ExamList";
import ExamDetail from "./components/ExamDetail";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useTranslation } from "../../../i18n/I18nProvider";
import { callDeepseek } from "../../../utils/api";

const ExamForm = memo(({ n, sN, s, sS, d, sD, g, sG, onAdd }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5"
    >
      <div>
        <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
          {t("kid.exam.name_label")}
        </label>
        <input
          type="text"
          value={n}
          onChange={(e) => sN(e.target.value)}
          placeholder={t("kid.exam.name_placeholder")}
          className={inpCls}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-[#004B63] mb-2 block">
          {t("kid.exam.subject_label")}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {subjects.map((sb) => (
            <motion.button
              key={sb.v}
              onClick={() => sS(sb.v)}
              className={`p-2.5 rounded-xl border-2 transition-all text-sm ${sb.v === s ? "border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold" : "border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1">{sb.i}</span>
              {t(`kid.exam.subject_${sb.v}`)}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
            {t("kid.exam.date_label")}
          </label>
          <input
            type="date"
            value={d}
            onChange={(e) => sD(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={inpCls}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#004B63] mb-1.5 block">
            {t("kid.exam.desired_grade_label")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={g}
              onChange={(e) => sG(Number(e.target.value))}
              className="flex-1 accent-[#4DA8C4]"
            />
            <span className="text-lg font-black text-[#4DA8C4] min-w-[3ch] text-center">
              {g}
            </span>
          </div>
        </div>
      </div>
      <motion.button
        onClick={onAdd}
        disabled={!n.trim() || !d}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${gdCls} w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {t("kid.exam.add_exam")}
      </motion.button>
    </motion.div>
  );
});

// Flashcard-based quick quiz from active deck
const DeckQuiz = memo(({ deck, onFinish, onTabChange }) => {
  const { t } = useTranslation();
  const { addPoints } = useSmartBoardKids();
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const generateQuiz = useCallback(async () => {
    setLoading(true);
    const cardContext = deck.cards
      .slice(0, 12)
      .map((c) => `• ${c.front}: ${c.back}`)
      .join("\n");
    // Prompt interno de IA (DeepSeek) — se mantiene en español a propósito.
    const prompt = `Genera un examen de 5 preguntas de opción múltiple (4 opciones A-D) basado en estas tarjetas de estudio:
${cardContext}

Responde SOLO con JSON:
{
  "questions": [
    { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..." }
  ]
}`;
    try {
      const res = await callDeepseek(prompt, {
        temperature: 0.6,
        maxTokens: 1200,
        isJson: true,
      });
      const parsed = typeof res === "string" ? JSON.parse(res) : res;
      setQuestions(parsed.questions || []);
    } catch {
      setQuestions([]);
    }
    setLoading(false);
  }, [deck]);

  const answer = useCallback(() => {
    const q = questions[qIdx];
    const correct = selected === q.correct;
    if (correct) setScore((s) => s + 1);
    setFeedback({ correct, explanation: q.explanation });
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        const finalScore = score + (correct ? 1 : 0);
        addPoints(
          finalScore * 15,
          t("kid.exam.deck_exam_points", { title: deck.title }),
        );
        setDone(true);
      } else {
        setQIdx((i) => i + 1);
        setSelected(null);
        setFeedback(null);
      }
    }, 1800);
  }, [qIdx, questions, selected, score, deck, addPoints, t]);

  if (!questions) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#004B63]/5 to-[#4DA8C4]/10 border border-[#4DA8C4]/20 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎴</span>
          <div>
            <p className="font-bold text-[#004B63]">
              {t("kid.exam.deck_exam_title", { title: deck.title })}
            </p>
            <p className="text-xs text-[#64748B]">
              {t("kid.exam.deck_quiz_desc", { count: deck.cards.length })}
            </p>
          </div>
        </div>
        <motion.button
          onClick={generateQuiz}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-bold text-white text-sm shadow-md disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #004B63, #0077B6)" }}
        >
          {loading
            ? t("kid.exam.generating")
            : t("kid.exam.generate_deck_exam")}
        </motion.button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-center space-y-4"
      >
        <span className="text-5xl block">
          {pct >= 80 ? "🏆" : pct >= 60 ? "✅" : "💪"}
        </span>
        <p
          className="text-4xl font-black"
          style={{
            color: pct >= 80 ? "#22C55E" : pct >= 60 ? "#EAB308" : "#EF4444",
          }}
        >
          {pct}%
        </p>
        <p className="text-sm text-[#64748B]">
          {t("kid.exam.score_correct", { score, total: questions.length })}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onFinish}
            className="flex-1 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#64748B] font-semibold"
          >
            {t("kid.exam.back")}
          </button>
          {pct < 80 && (
            <button
              onClick={() => onTabChange?.("flashcards")}
              className="flex-1 py-2 rounded-xl bg-[#4DA8C4] text-white text-sm font-semibold"
            >
              {t("kid.exam.review_flashcards")}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const q = questions[qIdx];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
            animate={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[#64748B]">
          {qIdx + 1}/{questions.length}
        </span>
      </div>
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <p className="font-semibold text-[#1E293B]">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const letter = opt.charAt(0);
            const isCorrect = letter === q.correct;
            return (
              <motion.button
                key={i}
                onClick={() => !feedback && setSelected(letter)}
                whileHover={{ scale: feedback ? 1 : 1.01 }}
                className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all flex items-center gap-3 ${
                  feedback
                    ? isCorrect
                      ? "border-green-400 bg-green-50 text-green-700"
                      : selected === letter
                        ? "border-red-400 bg-red-50 text-red-600"
                        : "border-[#E2E8F0] opacity-50"
                    : selected === letter
                      ? "border-[#4DA8C4] bg-[#4DA8C4]/5"
                      : "border-[#E2E8F0] hover:border-[#4DA8C4]/40"
                } text-[#475569]`}
                disabled={!!feedback}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    feedback && isCorrect
                      ? "bg-green-400 text-white"
                      : feedback && selected === letter
                        ? "bg-red-400 text-white"
                        : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {letter}
                </span>
                {opt.substring(3)}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl text-sm ${feedback.correct ? "bg-green-50 border border-green-200 text-green-700" : "bg-amber-50 border border-amber-200 text-amber-700"}`}
            >
              <strong>
                {feedback.correct
                  ? t("kid.exam.correct")
                  : t("kid.exam.incorrect")}
              </strong>{" "}
              — {feedback.explanation}
            </motion.div>
          )}
        </AnimatePresence>
        {!feedback && (
          <motion.button
            onClick={answer}
            disabled={!selected}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #4DA8C4, #66CCCC)" }}
          >
            {t("kid.exam.answer")}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});
DeckQuiz.displayName = "DeckQuiz";

const ExamPrep = memo(({ onTabChange }) => {
  const { t } = useTranslation();
  const { activeStudyDeck } = useSmartBoardKids();
  const [showDeckQuiz, setShowDeckQuiz] = useState(false);
  const {
    mode,
    setMode,
    detailId,
    setDetailId,
    name,
    setName,
    subject,
    setSubject,
    date,
    setDate,
    grade,
    setGrade,
    addExam,
    deleteExam,
    handleUploadMaterial,
    sorted,
    detailExam,
    tips,
    detailMaterials,
    setDocumentForDani,
  } = useExamPrep();

  return (
    <div className="space-y-6">
      {/* Active deck quick quiz */}
      {activeStudyDeck && !showDeckQuiz && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#0077B6] text-white"
        >
          <p className="text-xs text-white/70 mb-1">
            {t("kid.flashcards.active_deck")}
          </p>
          <p className="font-bold">{activeStudyDeck.title}</p>
          <p className="text-xs text-white/70 mb-3">
            {t("kid.exam.cards_ready", { count: activeStudyDeck.cards.length })}
          </p>
          <motion.button
            onClick={() => setShowDeckQuiz(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors"
          >
            {t("kid.exam.take_deck_exam")}
          </motion.button>
        </motion.div>
      )}

      {showDeckQuiz && activeStudyDeck ? (
        <DeckQuiz
          deck={activeStudyDeck}
          onFinish={() => setShowDeckQuiz(false)}
          onTabChange={onTabChange}
        />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <h3 className="text-lg font-bold text-[#004B63]">
              {t("kid.exam.title")}
            </h3>
            {mode === "form" ? (
              <motion.button
                onClick={() => setMode("list")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 text-sm rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
              >
                {t("kid.exam.cancel")}
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  setMode("form");
                  setDetailId(null);
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 20px rgba(77,168,196,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-1.5 text-sm rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-semibold shadow-md"
              >
                {t("kid.exam.new")}
              </motion.button>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {mode === "form" && (
              <ExamForm
                key="form"
                n={name}
                sN={setName}
                s={subject}
                sS={setSubject}
                d={date}
                sD={setDate}
                g={grade}
                sG={setGrade}
                onAdd={addExam}
              />
            )}

            {mode === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ExamList
                  exams={sorted}
                  onView={(e) => {
                    setDetailId(e.id);
                    setMode("detail");
                  }}
                  onDelete={deleteExam}
                />
              </motion.div>
            )}

            {mode === "detail" && detailExam && (
              <ExamDetail
                key="detail"
                e={detailExam}
                tips={tips}
                materials={detailMaterials}
                onDelete={deleteExam}
                onBack={() => {
                  setMode("list");
                  setDetailId(null);
                }}
                onAskDani={() => {
                  setDocumentForDani({
                    type: "exam_prep",
                    exam: detailExam,
                    tips,
                    materials: detailMaterials,
                  });
                  const btn = document.getElementById("openDaniChat");
                  if (btn) btn.click();
                }}
                onUploadMaterial={handleUploadMaterial}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
});

ExamPrep.displayName = "ExamPrep";
export { ExamPrep };
export default ExamPrep;
