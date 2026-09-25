import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";
import { usePracticeLog } from "./practicarHub/practicarProgress";
import { SUBJECT_META } from "./practicarHub/practicarConfig";
import {
  setHandoff,
  HANDOFF_PRACTICAR_SUBJECT,
  HANDOFF_CHALLENGE_SUBJECT,
  HANDOFF_CHALLENGE_DIFFICULTY,
  HANDOFF_CHALLENGE_AUTOSTART,
} from "./practicarHub/practicarHandoff";

const DAY_MS = 86400000;

function weakestSubject(subjects) {
  const score = (s) =>
    s.gradeScore != null
      ? Number(s.gradeScore)
      : ((Number(s.progress) || 0) / 100) * 5;
  return [...(subjects || [])]
    .filter((s) => SUBJECT_META[s.id]?.challengeId)
    .sort((a, b) => score(a) - score(b))[0];
}

function nextExam(exams) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (exams || [])
    .filter((x) => !x.completed && x.exam_date)
    .map((x) => ({
      ...x,
      days: Math.round((new Date(`${x.exam_date}T00:00:00`) - today) / DAY_MS),
    }))
    .filter((x) => x.days >= 0 && x.days <= 7)
    .sort((a, b) => a.days - b.days)[0];
}

const TuDiaPlan = memo(function TuDiaPlan({ onTabChange, darkMode }) {
  const { subjectsWithGrades, subjects, exams, streak } = useIngenIAKids();
  const { today } = usePracticeLog();
  const list = subjectsWithGrades?.length ? subjectsWithGrades : subjects;

  const steps = useMemo(() => {
    const did = (...types) => today.some((e) => types.includes(e.type));
    const weak = weakestSubject(list);
    const exam = nextExam(exams);

    const reto = {
      id: "reto",
      emoji: weak?.icon || "⚡",
      title: weak ? `Reto de ${weak.name}` : "Haz un reto",
      hint:
        weak?.gradeScore != null
          ? `Tu nota: ${Number(weak.gradeScore).toFixed(1)} · 10 min`
          : "10 min · sube tu nota",
      done: did("reto"),
      go: () => {
        const challengeId = weak && SUBJECT_META[weak.id]?.challengeId;
        if (challengeId) {
          setHandoff(HANDOFF_PRACTICAR_SUBJECT, weak.id);
          setHandoff(HANDOFF_CHALLENGE_SUBJECT, challengeId);
          setHandoff(HANDOFF_CHALLENGE_DIFFICULTY, "medium");
          setHandoff(HANDOFF_CHALLENGE_AUTOSTART, "1");
        }
        onTabChange?.("retos");
      },
    };

    const cards = {
      id: "cards",
      emoji: "🃏",
      title: "Repasa tus EduCards",
      hint: "5 min · la memoria se entrena repasando",
      done: did("educards"),
      go: () => onTabChange?.("flashcards"),
    };

    const third = exam
      ? {
          id: "exam",
          emoji: "📝",
          title: `Prepara tu examen de ${exam.subject}`,
          hint:
            exam.days === 0
              ? "¡Es hoy! Un repaso rápido"
              : exam.days === 1
                ? "Es mañana · repasa con Dani"
                : `Faltan ${exam.days} días`,
          done: did("oral", "material"),
          go: () => onTabChange?.("examenes"),
        }
      : {
          id: "oral",
          emoji: "🗣️",
          title: "Explícale un tema a Dani",
          hint: "5 min · si lo explicas, lo entiendes",
          done: did("oral"),
          go: () => onTabChange?.("oral"),
        };

    return [reto, cards, third];
  }, [today, list, exams, onTabChange]);

  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;
  const pct = Math.round((doneCount / steps.length) * 100);

  const surface = darkMode
    ? "bg-[#1E293B]/80 border-[#334155]/60"
    : "bg-white border-[#E2E8F0]";
  const textPrimary = darkMode ? "text-white" : "text-[#1E293B]";
  const textSub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`rounded-2xl border shadow-sm p-4 sm:p-5 ${surface}`}
      aria-labelledby="tu-dia-title"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="relative w-12 h-12 shrink-0 rounded-full grid place-items-center"
          style={{
            background: `conic-gradient(#06D6A0 ${pct * 3.6}deg, ${darkMode ? "#334155" : "#EDF3F7"} 0deg)`,
          }}
          role="img"
          aria-label={`${doneCount} de ${steps.length} pasos completados`}
        >
          <span
            className={`w-9 h-9 rounded-full grid place-items-center text-xs font-black tabular-nums ${
              darkMode ? "bg-[#1E293B] text-white" : "bg-white text-[#00303F]"
            }`}
          >
            {doneCount}/{steps.length}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3
            id="tu-dia-title"
            className={`!m-0 text-base font-black leading-tight ${textPrimary}`}
          >
            {allDone ? "¡Día completo! 🎉" : "Tu día en 3 pasos"}
          </h3>
          <p className={`!m-0 mt-0.5 text-xs leading-snug ${textSub}`}>
            {allDone
              ? streak?.current > 1
                ? `Llevas ${streak.current} días seguidos. ¡Así suben las notas!`
                : "Vuelve mañana para empezar tu racha 🔥"
              : "Unos 20 minutos que sí mueven tus notas"}
          </p>
        </div>
      </div>

      <ol className="!m-0 !p-0 list-none space-y-2">
        {steps.map((step, i) => (
          <li key={step.id}>
            <button
              type="button"
              onClick={step.go}
              aria-label={`${step.done ? "Hecho: " : `Paso ${i + 1}: `}${step.title}`}
              className={`w-full !flex items-center gap-3 min-h-[56px] px-3 py-2.5 rounded-xl text-left border transition-all active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#06D6A0]/30 ${
                step.done
                  ? darkMode
                    ? "bg-[#06D6A0]/10 border-[#06D6A0]/30"
                    : "bg-[#ECFDF5] border-[#A7F3D0]"
                  : darkMode
                    ? "bg-[#0F172A]/40 border-[#334155] hover:border-[#06D6A0]/50"
                    : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#06D6A0]/60"
              }`}
            >
              <span
                className={`w-9 h-9 shrink-0 rounded-lg grid place-items-center text-lg ${
                  step.done ? "text-[#059669]" : ""
                }`}
                style={
                  step.done
                    ? undefined
                    : { background: darkMode ? "#1E293B" : "#fff" }
                }
                aria-hidden="true"
              >
                {step.done ? (
                  <CheckCircle2 className="w-6 h-6" strokeWidth={2.4} />
                ) : (
                  step.emoji
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-sm font-bold leading-tight truncate ${
                    step.done
                      ? "text-[#059669] line-through decoration-2"
                      : textPrimary
                  }`}
                >
                  {step.title}
                </span>
                <span
                  className={`block text-[11px] mt-0.5 truncate ${textSub}`}
                >
                  {step.done ? "¡Listo por hoy!" : step.hint}
                </span>
              </span>
              {!step.done && (
                <ChevronRight
                  className="w-4 h-4 shrink-0 text-[#06D6A0]"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
            </button>
          </li>
        ))}
      </ol>
    </motion.section>
  );
});

export default TuDiaPlan;
