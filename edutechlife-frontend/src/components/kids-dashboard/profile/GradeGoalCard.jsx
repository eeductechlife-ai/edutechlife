import { memo, useMemo } from "react";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { getMasteryState, MASTERY_STATES } from "../components/SubjectsView";
import { SUBJECT_META } from "../practicarHub/practicarConfig";
import {
  setHandoff,
  HANDOFF_PRACTICAR_SUBJECT,
  HANDOFF_CHALLENGE_SUBJECT,
} from "../practicarHub/practicarHandoff";

const PERIODS = ["p1", "p2", "p3", "p4"];
// MEN scale lower bounds for Básico, Alto, Superior.
const NEXT_BAND = [
  { min: 3.0, state: MASTERY_STATES[1] },
  { min: 4.0, state: MASTERY_STATES[2] },
  { min: 4.6, state: MASTERY_STATES[3] },
];

const num = (v) => (v == null || isNaN(Number(v)) ? null : Number(v));
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// Per-period average across subjects, so the trend reflects the whole report card.
function overallTrend(grades) {
  const byPeriod = PERIODS.map((p) => {
    const vals = grades.map((g) => num(g[p])).filter((v) => v != null);
    return vals.length ? mean(vals) : null;
  }).filter((v) => v != null);
  if (byPeriod.length < 2) return null;
  const delta =
    Math.round(
      (byPeriod[byPeriod.length - 1] - byPeriod[byPeriod.length - 2]) * 10,
    ) / 10;
  return { delta, dir: delta > 0.05 ? "up" : delta < -0.05 ? "down" : "flat" };
}

const GradeGoalCard = memo(function GradeGoalCard({ onTabChange }) {
  const {
    studentGrades,
    subjectsWithGrades,
    gradeAvg,
    darkMode: dm,
  } = useIngenIAKids();

  const data = useMemo(() => {
    const grades = (studentGrades || []).filter((g) => gradeAvg(g) > 0);
    if (!grades.length) return null;
    const avg = mean(grades.map(gradeAvg));
    const next = NEXT_BAND.find((b) => avg < b.min);
    const lever = (subjectsWithGrades || [])
      .filter((s) => s.gradeScore != null)
      .sort((a, b) => Number(a.gradeScore) - Number(b.gradeScore))[0];
    return {
      avg,
      state: getMasteryState(null, avg),
      trend: overallTrend(grades),
      next,
      lever,
      count: grades.length,
    };
  }, [studentGrades, subjectsWithGrades, gradeAvg]);

  const surface = dm
    ? "bg-[#1A2744] border-[#243152] text-white"
    : "bg-white border-[#EEF2F6] text-[#1E293B]";
  const sub = dm ? "text-[#94A3B8]" : "text-[#64748B]";

  if (!data) {
    return (
      <button
        type="button"
        onClick={() => onTabChange?.("calificaciones")}
        className={`w-full !flex items-center gap-3 p-4 rounded-2xl border text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#118AB2] ${surface}`}
      >
        <span className="text-2xl shrink-0" aria-hidden="true">
          📊
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black">Mi promedio</span>
          <span className={`block text-xs mt-0.5 ${sub}`}>
            Sube tus notas y te muestro cuánto te falta para el siguiente nivel.
          </span>
        </span>
        <span className="text-xs font-black text-[#118AB2] shrink-0">
          Subir →
        </span>
      </button>
    );
  }

  const { avg, state, trend, next, lever } = data;
  const gap = next ? Math.max(0.1, Math.round((next.min - avg) * 10) / 10) : 0;
  const leverChallenge = lever && SUBJECT_META[lever.id]?.challengeId;

  const practiceLever = () => {
    setHandoff(HANDOFF_PRACTICAR_SUBJECT, lever.id);
    if (leverChallenge) {
      setHandoff(HANDOFF_CHALLENGE_SUBJECT, leverChallenge);
      onTabChange?.("retos");
    } else {
      onTabChange?.("practicar");
    }
  };

  return (
    <section
      className={`rounded-2xl border p-4 ${surface}`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      aria-labelledby="grade-goal-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="grade-goal-title"
            className="!m-0 text-[11px] font-black uppercase tracking-wide text-[#118AB2]"
          >
            Mi promedio general
          </h3>
          <p className="!m-0 mt-1 flex items-baseline gap-2">
            <span
              className="text-3xl font-black tabular-nums leading-none"
              style={{ color: state.color }}
            >
              {avg.toFixed(1)}
            </span>
            {trend && trend.dir !== "flat" && (
              <span
                className="text-xs font-black px-1.5 py-0.5 rounded-full"
                style={{
                  background: trend.dir === "up" ? "#ECFDF5" : "#FEF2F2",
                  color: trend.dir === "up" ? "#10B981" : "#EF4444",
                }}
                aria-label={`${trend.dir === "up" ? "Subió" : "Bajó"} ${Math.abs(trend.delta).toFixed(1)} desde el periodo anterior`}
              >
                {trend.dir === "up" ? "↑" : "↓"}
                {Math.abs(trend.delta).toFixed(1)}
              </span>
            )}
          </p>
        </div>
        <span
          className="shrink-0 text-[11px] font-black px-2.5 py-1 rounded-full"
          style={{ background: state.bg, color: state.color }}
        >
          {state.emoji} {state.label}
        </span>
      </div>

      {next ? (
        <>
          <div
            className={`mt-3 h-2 rounded-full overflow-hidden ${dm ? "bg-[#243152]" : "bg-[#F1F5F9]"}`}
            role="progressbar"
            aria-label={`Progreso hacia ${next.state.label}`}
            aria-valuenow={Math.round((avg / next.min) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (avg / next.min) * 100)}%`,
                background: `linear-gradient(90deg, ${state.color}, ${next.state.color})`,
              }}
            />
          </div>
          <p className={`!m-0 mt-2 text-xs ${sub}`}>
            Te faltan{" "}
            <span className="font-black" style={{ color: next.state.color }}>
              +{gap.toFixed(1)}
            </span>{" "}
            para llegar a{" "}
            <span className="font-black" style={{ color: next.state.color }}>
              {next.state.emoji} {next.state.label} ({next.min.toFixed(1)})
            </span>
          </p>
        </>
      ) : (
        <p className={`!m-0 mt-2 text-xs ${sub}`}>
          ¡Estás en el nivel más alto de la escala! Sigue así 🏆
        </p>
      )}

      {lever && next && (
        <button
          type="button"
          onClick={practiceLever}
          className={`mt-3 w-full !flex items-center gap-2 px-3 py-2.5 rounded-xl text-left border ${
            dm
              ? "border-[#243152] bg-[#0F172A]/40"
              : "border-[#E2E8F0] bg-[#F8FAFC]"
          }`}
        >
          <span className="text-lg shrink-0" aria-hidden="true">
            {lever.icon || "📚"}
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-[11px] ${sub}`}>
              Lo que más sube tu promedio:
            </span>
            <span className="block text-sm font-black truncate">
              {lever.name} · {Number(lever.gradeScore).toFixed(1)}
            </span>
          </span>
          <span className="shrink-0 text-xs font-black text-white bg-[#118AB2] px-3 py-1.5 rounded-lg">
            Practicar
          </span>
        </button>
      )}
    </section>
  );
});

export default GradeGoalCard;
