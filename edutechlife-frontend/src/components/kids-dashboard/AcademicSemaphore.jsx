import { memo } from "react";
import { motion } from "framer-motion";

const SUBJECT_LABELS = {
  matematicas: "Matemáticas",
  lenguaje: "Lengua",
  ciencias_naturales: "Ciencias",
  ciencias_sociales: "Sociales",
  ingles: "Inglés",
  tecnologia: "Tecnología",
};

function getColor(mastery, grade) {
  const score =
    mastery !== undefined ? mastery : grade !== undefined ? grade / 5 : null;
  if (score === null)
    return {
      dot: "bg-gray-300 dark:bg-gray-600",
      label: "Sin datos",
      tier: "none",
    };
  if (score >= 0.7)
    return { dot: "bg-emerald-500", label: "Dominio alto", tier: "green" };
  if (score >= 0.4)
    return { dot: "bg-amber-400", label: "En progreso", tier: "yellow" };
  return { dot: "bg-red-500", label: "Necesita refuerzo", tier: "red" };
}

/**
 * Displays a traffic-light per subject based on mastery or grade data.
 *
 * @param {object}  props
 * @param {object}  props.masteryBySubject  - { subject: 0.0-1.0 }
 * @param {object}  [props.gradeMap]        - { subject: 1.0-5.0 }
 * @param {boolean} [props.compact]         - smaller layout for sidebar/tab
 */
const AcademicSemaphore = memo(
  ({ masteryBySubject = {}, gradeMap = {}, compact = false }) => {
    const subjects = Array.from(
      new Set([...Object.keys(masteryBySubject), ...Object.keys(gradeMap)]),
    ).filter((s) => SUBJECT_LABELS[s]);

    if (!subjects.length) return null;

    return (
      <div
        className={
          compact
            ? "flex flex-wrap gap-2"
            : "grid grid-cols-2 sm:grid-cols-3 gap-2"
        }
      >
        {subjects.map((subj, i) => {
          const mastery = masteryBySubject[subj];
          const grade = gradeMap[subj];
          const { dot, label, tier } = getColor(mastery, grade);

          const bgClass =
            tier === "green"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              : tier === "yellow"
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                : tier === "red"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10";

          return (
            <motion.div
              key={subj}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${bgClass}`}
              role="status"
              aria-label={`${SUBJECT_LABELS[subj]}: ${label}`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
                  {SUBJECT_LABELS[subj]}
                </p>
                {mastery !== undefined && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {Math.round(mastery * 100)}%
                  </p>
                )}
                {mastery === undefined && grade !== undefined && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Nota: {grade}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  },
);

AcademicSemaphore.displayName = "AcademicSemaphore";
export default AcademicSemaphore;
