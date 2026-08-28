import { memo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../../../context/SmartBoardKidsContext";
import { useCompetencyTracking } from "../../../../hooks/useCompetencyTracking";
import { useFeedbackLog } from "../../../../hooks/useFeedbackLog";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { callDeepseekSmartboard } from "../../../../utils/api";

const DeckQuiz = memo(({ deck, onFinish, onTabChange }) => {
  const { t } = useTranslation();
  const { addPoints } = useSmartBoardKids();
  const { trackActivity } = useCompetencyTracking();
  const { logFeedback } = useFeedbackLog();
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [emotionalFeedback, setEmotionalFeedback] = useState(null);

  useEffect(() => {
    if (!emotionalFeedback || !done) return;
    const emotionMap = { easy: "happy", ok: "neutral", hard: "frustrated" };
    logFeedback({
      activity: "exam_prep",
      emotion: emotionMap[emotionalFeedback] || "neutral",
      score,
      context: { deckTitle: deck?.title },
    });
  }, [emotionalFeedback]);

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
      const res = await callDeepseekSmartboard(
        [{ role: "user", content: prompt }],
        {
          temperature: 0.6,
          maxTokens: 1200,
          isJson: true,
        },
      );
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
        if (deck?.subject) {
          trackActivity({
            subject: deck.subject,
            score: finalScore / questions.length,
          });
        }
      } else {
        setQIdx((i) => i + 1);
        setSelected(null);
        setFeedback(null);
      }
    }, 1800);
  }, [qIdx, questions, selected, score, deck, addPoints, t, trackActivity]);

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

        {/* Emotional feedback */}
        {!emotionalFeedback ? (
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-[#94A3B8]">¿Cómo te sentiste?</p>
            {[
              { emoji: "😊", label: "Fácil", value: "easy" },
              { emoji: "😐", label: "Normal", value: "ok" },
              { emoji: "😣", label: "Difícil", value: "hard" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setEmotionalFeedback(opt.value)}
                className="px-2 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#4DA8C4] transition-all text-sm"
                aria-label={opt.label}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#4DA8C4] font-semibold">
            {emotionalFeedback === "hard"
              ? "¡Dani te preparará más práctica!"
              : "¡Excelente actitud!"}
          </p>
        )}

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
export default DeckQuiz;
