import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import {
  setHandoff,
  HANDOFF_PRACTICAR_SUBJECT,
  HANDOFF_CHALLENGE_DIFFICULTY,
  HANDOFF_CHALLENGE_AUTOSTART,
  HANDOFF_CHALLENGE_SUBJECT,
} from "../practicarHub/practicarHandoff";
import { SUBJECT_META } from "../practicarHub/practicarConfig";
import { PASSING_GRADE } from "../kidsDashboardConfig";
import { readableTextOn, ensureContrast } from "../../../utils/contrast";

function TrendBadge({ trend }) {
  if (!trend || (trend.dir !== "up" && trend.dir !== "down")) return null;
  const up = trend.dir === "up";
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-black px-1.5 py-0.5 rounded-full ml-1"
      style={{
        background: up ? "#ECFDF5" : "#FEF2F2",
        color: up
          ? ensureContrast("#10B981", "#ECFDF5")
          : ensureContrast("#EF4444", "#FEF2F2"),
      }}
    >
      {up ? "↑" : "↓"}
      {Math.abs(trend.delta).toFixed(1)}
    </span>
  );
}

// Colombian report-card scale (Decreto 1290): Bajo < 3.0, Básico 3.0–3.9,
// Alto 4.0–4.5, Superior 4.6–5.0. Progress-only subjects map 60/80/92 %.
const RAW_MASTERY_STATES = [
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

// `color` sirve para barras y botones de fondo; para TEXTO se usa `text` (sobre
// blanco) o `textOnTint` (sobre `bg`): el ámbar y el verde originales daban
// 2,1 y 2,5:1.
export const MASTERY_STATES = RAW_MASTERY_STATES.map((state) => ({
  ...state,
  text: ensureContrast(state.color, "#FFFFFF"),
  textOnTint: ensureContrast(state.color, state.bg),
}));

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

// Colores por tema: la lista de materias seguía en blanco con el modo oscuro.
const TONE = {
  light: {
    card: "bg-white",
    border: "#E2E8F0",
    title: "text-[#00303F]",
    strong: "text-[#1E293B]",
    muted: "text-[#475569]",
    track: "bg-[#EDF3F7]",
    idleButton: { background: "#F1F5F9", color: "#00303F" },
    urgent: "text-[#B91C1C]",
    shadow: "shadow-[0_10px_30px_-18px_rgba(0,48,63,0.35)]",
  },
  dark: {
    card: "bg-[#1E293B]",
    border: "#334155",
    title: "text-white",
    strong: "text-white",
    muted: "text-[#94A3B8]",
    track: "bg-[#334155]",
    idleButton: { background: "#334155", color: "#F1F5F9" },
    urgent: "text-[#FCA5A5]",
    shadow: "shadow-none",
  },
};

const SubjectsView = memo(function SubjectsView({ subjects, onTabChange }) {
  const { t } = useTranslation();
  const { darkMode } = useIngenIAKids();
  const tone = darkMode ? TONE.dark : TONE.light;

  const practice = (subject, urgent = false) => {
    setHandoff(HANDOFF_PRACTICAR_SUBJECT, subject.id);
    const challengeId = SUBJECT_META[subject.id]?.challengeId;
    if (urgent && challengeId) {
      setHandoff(HANDOFF_CHALLENGE_SUBJECT, challengeId);
      setHandoff(HANDOFF_CHALLENGE_DIFFICULTY, "medium");
      setHandoff(HANDOFF_CHALLENGE_AUTOSTART, "1");
      onTabChange?.("retos");
    } else {
      onTabChange?.("practicar");
    }
  };

  // Declining + low-score subjects first, then rest sorted by score ascending.
  const score = (s) =>
    s.gradeScore != null
      ? Number(s.gradeScore)
      : (Number(s.progress) || 0) / 20;
  // Para ordenar: bajando y por debajo de 3.5 va primero. Para el tono: solo se
  // marca "urgente" (rojo) por debajo de la nota para aprobar (3.0).
  const needsFocus = (s) => s.trend?.dir === "down" && score(s) < 3.5;
  const isUrgent = (s) => s.trend?.dir === "down" && score(s) < PASSING_GRADE;
  const ordered = [...subjects].sort((a, b) => {
    const au = needsFocus(a) ? 0 : 1;
    const bu = needsFocus(b) ? 0 : 1;
    if (au !== bu) return au - bu;
    return score(a) - score(b);
  });

  const atRiskCount = ordered.filter(
    (s) => s.gradeScore != null && score(s) < 3.0,
  ).length;

  return (
    <div className="space-y-3">
      {atRiskCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 p-3 rounded-2xl"
          style={{
            background: "rgba(239,71,111,0.07)",
            border: "1px solid rgba(239,71,111,0.25)",
          }}
        >
          <span className="text-xl shrink-0">🚨</span>
          <div>
            <p className={`!m-0 text-sm font-black ${tone.strong}`}>
              {atRiskCount === 1
                ? "1 materia en desempeño Bajo"
                : `${atRiskCount} materias en desempeño Bajo`}
            </p>
            <p className={`!m-0 text-xs mt-0.5 ${tone.muted}`}>
              Nota menor a 3.0 según la escala MEN. Practica para recuperarla.
            </p>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        {ordered.map((subject, index) => {
          const hasGrade = subject.gradeScore != null;
          const ms = getMasteryState(subject.progress, subject.gradeScore);
          const urgent = isUrgent(subject);
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`${tone.card} p-3 sm:p-4 rounded-2xl border ${tone.shadow}`}
              style={{
                borderColor: urgent ? "rgba(239,71,111,0.4)" : tone.border,
                boxShadow: urgent
                  ? "0 0 0 2px rgba(239,71,111,0.12)"
                  : undefined,
              }}
            >
              {urgent && (
                <div
                  className={`flex items-center gap-1.5 mb-2 text-xs font-black ${tone.urgent}`}
                >
                  <span aria-hidden="true">💪</span> Un reto corto hoy te ayuda
                  a subirla
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${subject.color}22` }}
                  aria-hidden="true"
                >
                  {subject.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`!m-0 text-base font-bold leading-tight truncate ${tone.title}`}
                  >
                    {subject.name}
                  </h4>
                  <p className={`!m-0 mt-0.5 text-xs ${tone.muted}`}>
                    {hasGrade ? ms.hint : t("ingenia.progress")}
                  </p>
                </div>
                {hasGrade ? (
                  <div className="text-right shrink-0">
                    <p
                      className="!m-0 text-2xl font-black tabular-nums leading-none"
                      style={{
                        color: darkMode
                          ? ensureContrast(ms.color, "#1E293B")
                          : ms.text,
                      }}
                    >
                      {subject.gradeScore.toFixed(1)}
                      <TrendBadge trend={subject.trend} />
                    </p>
                    <span
                      className="inline-block mt-1 text-xs font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: ms.bg, color: ms.textOnTint }}
                    >
                      {ms.emoji} {ms.label}
                    </span>
                  </div>
                ) : (
                  <p
                    className={`text-lg font-black tabular-nums shrink-0 ${tone.muted}`}
                  >
                    {subject.progress}%
                  </p>
                )}
              </div>

              <div className="mt-2.5 flex items-center gap-3">
                <div
                  className={`flex-1 h-2 rounded-full overflow-hidden ${tone.track}`}
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
                  onClick={() => practice(subject, urgent)}
                  aria-label={`Practicar ${subject.name}`}
                  className="shrink-0 min-h-[40px] px-3.5 rounded-xl text-xs font-black transition-all active:scale-95"
                  style={
                    urgent
                      ? { background: "#EF4444", color: "#fff" }
                      : !hasGrade
                        ? // No grade yet is not a bad grade: no alarm red.
                          {
                            background: subject.color,
                            color: readableTextOn(subject.color),
                          }
                        : ms.key === "recovery" || ms.key === "practice"
                          ? {
                              background: ms.color,
                              color: readableTextOn(ms.color),
                            }
                          : tone.idleButton
                  }
                >
                  {urgent ? "💪 Reforzar" : "🎯 Practicar"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default SubjectsView;
