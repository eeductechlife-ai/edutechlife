import { memo } from "react";
import { motion } from "framer-motion";
import QuestionText from "./QuestionText";
import { RotateCcw, Layers, ArrowLeft } from "lucide-react";
import {
  setHandoff,
  HANDOFF_FLASHCARDS_TOPIC,
  HANDOFF_FLASHCARDS_DECK,
} from "../practicarHub/practicarHandoff";
import { useIngenIAKidsSafe } from "../../../context/IngenIAKidsContext";
import {
  usePlanTaskOnFinish,
  PlanTaskDoneBanner,
} from "../improvementPlan/PlanTaskDone";

const RESULT_COPY = {
  early: [
    {
      min: 90,
      emoji: "🏆",
      title: "¡Eres un campeón!",
      sub: "¡Lo lograste! ¡Eres súper inteligente! 🌟",
    },
    {
      min: 70,
      emoji: "⭐",
      title: "¡Muy bien hecho!",
      sub: "¡Casi perfecto! Practica un poco más y ¡llegas! 🎉",
    },
    {
      min: 50,
      emoji: "💪",
      title: "¡Sigue intentando!",
      sub: "¡Eso! Cada vez lo harás mejor. ¡Tú puedes! 🚀",
    },
    {
      min: 0,
      emoji: "🌱",
      title: "¡Estás aprendiendo!",
      sub: "Equivocarse está bien. ¡Repasa y vuelve a jugar! 😊",
    },
  ],
  other: [
    {
      min: 90,
      emoji: "🏆",
      title: "¡Excelente!",
      sub: "Dominas este tema. ¡Prueba un nivel más difícil!",
    },
    {
      min: 70,
      emoji: "⭐",
      title: "¡Muy bien!",
      sub: "Vas por buen camino. Un reto más y lo dominas.",
    },
    {
      min: 50,
      emoji: "💪",
      title: "¡Buen intento!",
      sub: "Repasa lo que falló y vuelve a intentarlo.",
    },
    {
      min: 0,
      emoji: "🌱",
      title: "¡Estás aprendiendo!",
      sub: "Equivocarse es parte de aprender. Repasa y prueba otra vez.",
    },
  ],
};

function resultCopy(score, isEarly) {
  const table = isEarly ? RESULT_COPY.early : RESULT_COPY.other;
  return table.find((r) => score >= r.min);
}

const ChallengeResults = memo(
  ({
    score,
    answers,
    questions,
    difficulty,
    subject,
    onRetry,
    onEasier,
    onTabChange,
    darkMode,
  }) => {
    const ctx = useIngenIAKidsSafe();
    const setFlashcardDecks = ctx?.setFlashcardDecks;
    const isEarly = ctx?.studentAge != null && ctx.studentAge <= 9;
    // A reto opened from "Mi Plan" ticks its task when it ends.
    const planTask = usePlanTaskOnFinish("retos", true);
    const copy = resultCopy(score, isEarly);
    const correct = answers.filter((a) => a.isCorrect).length;
    const xpEarned =
      score >= 70 ? difficulty.xp : Math.round(difficulty.xp * 0.3);
    const color = subject?.color || "#9D4EDD";
    const mistakes = questions
      .map((q, i) => ({ q, i, a: answers[i] }))
      .filter(({ a }) => !a?.isCorrect);

    const surface = darkMode
      ? "bg-[#1E293B] border-[#334155]"
      : "bg-white border-[#E2E8F0]";
    const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
    const textSub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";
    const secondaryBtn = `w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 ${
      darkMode
        ? "border-[#334155] text-white"
        : "border-[#E2E8F0] text-[#1E293B] bg-white"
    }`;

    // Missed questions become a ready-to-study deck, so the review is about
    // exactly what the kid got wrong; with no mistakes, fall back to a new
    // AI deck on the subject.
    const reviewWithCards = () => {
      if (mistakes.length && setFlashcardDecks) {
        const deckId = `reto-${Date.now().toString(36)}`;
        const day = new Date().toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
        });
        setFlashcardDecks((prev) => [
          ...prev,
          {
            id: deckId,
            title: `Repaso de ${subject?.label || "mi reto"} · ${day}`,
            description: "Las preguntas que fallaste en tu reto",
            cards: mistakes.map(({ q }, n) => ({
              id: `${deckId}-${n}`,
              front: q.question,
              back: q.options[q.correct],
              example: q.explanation || "",
              icon: subject?.emoji,
            })),
            createdAt: new Date().toISOString(),
            stats: { totalStudied: 0, correct: 0, incorrect: 0, streak: 0 },
            metadata: { source: "reto", challengeId: subject?.id },
          },
        ]);
        setHandoff(HANDOFF_FLASHCARDS_DECK, deckId);
      } else {
        setHandoff(HANDOFF_FLASHCARDS_TOPIC, subject?.label || "");
      }
      onTabChange?.("flashcards");
    };

    return (
      <div className="space-y-4">
        <PlanTaskDoneBanner task={planTask} onTabChange={onTabChange} />
        <div
          className={`rounded-2xl border-2 p-6 text-center ${surface}`}
          style={{ borderColor: `${color}40` }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="text-6xl"
            aria-hidden="true"
          >
            {copy.emoji}
          </motion.div>
          <p className={`mt-2 text-2xl font-black ${textPrimary}`}>
            {copy.title}
          </p>
          <p className={`mt-1 text-sm ${textSub}`}>{copy.sub}</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div
              className={`rounded-xl py-3 ${darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}
            >
              <p className="text-2xl font-black tabular-nums" style={{ color }}>
                {correct}/{questions.length}
              </p>
              <p className={`text-[11px] font-semibold ${textSub}`}>
                correctas
              </p>
            </div>
            <div
              className={`rounded-xl py-3 ${darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}
            >
              <p className="text-2xl font-black tabular-nums text-[#22C55E]">
                {isEarly ? `+${xpEarned}⭐` : `+${xpEarned}`}
              </p>
              <p className={`text-[11px] font-semibold ${textSub}`}>
                {isEarly ? "estrellas" : "puntos XP"}
              </p>
            </div>
            <div
              className={`rounded-xl py-3 ${darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}
            >
              <p className="text-2xl" aria-hidden="true">
                {subject?.emoji}
              </p>
              <p
                className={`text-[11px] font-semibold truncate px-1 ${textSub}`}
              >
                {subject?.label}
              </p>
            </div>
          </div>
        </div>

        {mistakes.length > 0 && (
          <div className={`rounded-2xl border p-4 ${surface}`}>
            <p className={`text-sm font-black mb-3 ${textPrimary}`}>
              {isEarly
                ? `📚 ¡Repasemos estos! (${mistakes.length})`
                : `📚 Para repasar (${mistakes.length})`}
            </p>
            <ul className="space-y-2.5">
              {mistakes.map(({ q, i }) => (
                <li
                  key={i}
                  className={`rounded-xl p-3 text-sm ${darkMode ? "bg-[#0F172A]" : "bg-[#FFF7ED]"}`}
                >
                  <QuestionText
                    text={q.question}
                    darkMode={darkMode}
                    className={`font-semibold ${textPrimary}`}
                  />
                  <p className="mt-1 text-green-600 font-semibold">
                    ✓ {q.options[q.correct]}
                  </p>
                  {q.explanation && (
                    <p className={`mt-1 text-xs leading-relaxed ${textSub}`}>
                      💡 {q.explanation}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2.5">
          <motion.button
            type="button"
            onClick={onRetry}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, #9D4EDD 100%)`,
            }}
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            {isEarly
              ? `¡Jugar otro reto! 🎮`
              : `Otro reto de ${subject?.label}`}
          </motion.button>
          {score < 50 && difficulty.id !== "easy" && onEasier && (
            <button type="button" onClick={onEasier} className={secondaryBtn}>
              🌱 Probar un nivel más fácil
            </button>
          )}
          {mistakes.length > 0 && (
            <button
              type="button"
              onClick={reviewWithCards}
              className={secondaryBtn}
            >
              <Layers className="w-4 h-4" aria-hidden="true" />
              {isEarly
                ? `Repasar ${mistakes.length === 1 ? "el error" : `los ${mistakes.length} errores`} 📖`
                : `Repasar mis ${mistakes.length === 1 ? "error" : `${mistakes.length} errores`} con EduCards`}
            </button>
          )}
          <button
            type="button"
            onClick={() => onTabChange?.("practicar")}
            className={secondaryBtn}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {isEarly ? "Volver a practicar" : "Volver a Practicar"}
          </button>
        </div>
      </div>
    );
  },
);

ChallengeResults.displayName = "ChallengeResults";
export default ChallengeResults;
