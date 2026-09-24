import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  setHandoff,
  HANDOFF_PRACTICAR_SUBJECT,
} from "../practicarHub/practicarHandoff";

// Colombian report-card scale (Decreto 1290): Bajo < 3.0, Básico 3.0–3.9,
// Alto 4.0–4.5, Superior 4.6–5.0. Progress-only subjects map 60/80/92 %.
export const MASTERY_STATES = [
  {
    key: "recovery",
    label: "Bajo",
    hint: "Necesitas repasar",
    emoji: "🆘",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    key: "practice",
    label: "Básico",
    hint: "Vas en camino, ¡refuérzala!",
    emoji: "📈",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    key: "mastery",
    label: "Alto",
    hint: "¡Muy bien!",
    emoji: "⭐",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    key: "transfer",
    label: "Superior",
    hint: "¡Excelente!",
    emoji: "🏆",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

export function getMasteryState(progress, gradeScore) {
  const score =
    gradeScore != null && !isNaN(Number(gradeScore))
      ? Number(gradeScore)
      : ((Number(progress) || 0) / 100) * 5;
  if (score < 3.0) return MASTERY_STATES[0];
  if (score < 4.0) return MASTERY_STATES[1];
  if (score < 4.6) return MASTERY_STATES[2];
  return MASTERY_STATES[3];
}

const SubjectsView = memo(function SubjectsView({ subjects, onTabChange }) {
  const { t } = useTranslation();

  const practice = (subject) => {
    setHandoff(HANDOFF_PRACTICAR_SUBJECT, subject.id);
    onTabChange?.("practicar");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {subjects.map((subject, index) => {
        const hasGrade = subject.gradeScore != null;
        const ms = getMasteryState(subject.progress, subject.gradeScore);
        return (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-[0_10px_30px_-18px_rgba(0,48,63,0.35)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${subject.color}22` }}
                aria-hidden="true"
              >
                {subject.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#00303F] truncate">
                  {subject.name}
                </h4>
                <p className="text-xs text-[#64748B]">
                  {hasGrade ? ms.hint : t("smartboard.progress")}
                </p>
              </div>
              {hasGrade ? (
                <div className="text-right shrink-0">
                  <p
                    className="text-2xl font-black tabular-nums leading-none"
                    style={{ color: ms.color }}
                  >
                    {subject.gradeScore.toFixed(1)}
                  </p>
                  <span
                    className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: ms.bg, color: ms.color }}
                  >
                    {ms.emoji} {ms.label}
                  </span>
                </div>
              ) : (
                <p className="text-lg font-black tabular-nums text-[#64748B] shrink-0">
                  {subject.progress}%
                </p>
              )}
            </div>

            <div
              className="mt-3 w-full h-2 bg-[#EDF3F7] rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={subject.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Avance en ${subject.name}`}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: hasGrade ? ms.color : subject.color }}
                initial={{ width: 0 }}
                animate={{ width: `${subject.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            <button
              type="button"
              onClick={() => practice(subject)}
              className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold transition-colors"
              style={
                ms.key === "recovery" || ms.key === "practice"
                  ? { background: ms.color, color: "#fff" }
                  : { background: "#F1F5F9", color: "#00303F" }
              }
            >
              🎯 Practicar {subject.name}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
});

export default SubjectsView;
