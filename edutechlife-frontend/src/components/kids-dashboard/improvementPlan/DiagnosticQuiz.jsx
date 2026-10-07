import { useState } from "react";
import { motion } from "framer-motion";
import { diagnosticSubjectsFor } from "./useImprovementPlan";

const OPTIONS = [
  { value: 0.25, label: "Me cuesta", emoji: "😅" },
  { value: 0.5, label: "Más o menos", emoji: "🙂" },
  { value: 0.75, label: "Lo domino", emoji: "💪" },
];

const GRADIENT =
  "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)";

/**
 * Diagnóstico de arranque en frío: para un estudiante sin dominio ni notas,
 * una autoevaluación corta siembra el dominio (POST /adaptive/mastery) y
 * permite generar un plan personalizado desde el primer día.
 */
export default function DiagnosticQuiz({
  gradeLevel,
  darkMode,
  onSubmit,
  busy,
}) {
  const subjects = diagnosticSubjectsFor(gradeLevel);
  const [answers, setAnswers] = useState({});

  if (subjects.length === 0) return null;

  const complete = subjects.every((s) => answers[s.id] != null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full rounded-2xl border p-4 text-left ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-[#E2E8F0] shadow-sm"
      }`}
    >
      <h3
        className={`!m-0 text-sm font-black ${darkMode ? "text-white" : "text-[#1E293B]"}`}
      >
        🎯 Diagnóstico rápido (2 min)
      </h3>
      <p
        className={`!m-0 mt-1 mb-3 text-xs ${darkMode ? "text-gray-400" : "text-[#64748B]"}`}
      >
        ¿Cómo te va en cada materia? Con esto Dani arma tu plan desde el primer
        día.
      </p>

      <div className="space-y-3">
        {subjects.map((s) => (
          <div key={s.id}>
            <p
              className={`!m-0 mb-1 text-xs font-bold ${darkMode ? "text-gray-200" : "text-[#334155]"}`}
            >
              {s.label}
            </p>
            <div
              role="radiogroup"
              aria-label={s.label}
              className="grid grid-cols-3 gap-1.5"
            >
              {OPTIONS.map((o) => {
                const active = answers[s.id] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [s.id]: o.value }))
                    }
                    className={`min-h-[40px] rounded-xl text-xs font-bold border-2 transition-colors ${
                      active
                        ? "text-white border-transparent"
                        : darkMode
                          ? "border-gray-600 text-gray-300"
                          : "border-[#E2E8F0] text-[#334155] bg-white"
                    }`}
                    style={active ? { background: GRADIENT } : {}}
                  >
                    <span className="mr-1">{o.emoji}</span>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={!complete || busy}
        onClick={() => onSubmit(answers)}
        className="mt-4 w-full min-h-[44px] rounded-xl font-black text-sm text-white disabled:opacity-50 transition-opacity"
        style={{ background: GRADIENT }}
      >
        {busy ? "Creando tu plan…" : "Ver mi plan personalizado"}
      </button>
    </motion.div>
  );
}
