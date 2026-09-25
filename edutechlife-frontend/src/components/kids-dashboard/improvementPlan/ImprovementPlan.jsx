import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useIngenIAKids } from "../../../context/IngenIAKidsContext";
import { useImprovementPlan } from "./useImprovementPlan";
import { activityRoute, routeLabel } from "./planActivity";
import {
  setHandoff,
  HANDOFF_PLAN_ACTIVITY,
} from "../practicarHub/practicarHandoff";

const PROGRESS_GRADIENT =
  "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
const transition = { duration: 0.4, ease: "easeOut" };

const TIPO_EMOJI = {
  visual: "👀",
  auditivo: "🎧",
  kinestesico: "✋",
  lectura: "📖",
};

function WeekCard({
  week,
  weekIdx,
  onToggle,
  onOpen,
  routeLabelFor,
  darkMode,
}) {
  const done = week.activities.filter((a) => a.done).length;
  const total = week.activities.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <motion.div
      {...fadeIn}
      transition={{ ...transition, delay: weekIdx * 0.08 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-[#E2E8F0] shadow-sm"
      }`}
    >
      {/* Week header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: darkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}
      >
        <h3
          className={`!m-0 font-bold text-sm leading-snug pr-2 ${darkMode ? "text-white" : "text-[#1E293B]"}`}
        >
          Semana {week.week}: {week.title || week.focus}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: PROGRESS_GRADIENT }}
            />
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(251,133,0,0.12)", color: "#C05621" }}
          >
            {done}/{total}
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        {week.danTip && (
          <p className="text-xs italic mb-3 text-[#92400E] bg-[#FB8500]/8 rounded-xl px-3 py-2 leading-snug">
            💬 {week.danTip}
          </p>
        )}

        {/* Each task: tick it (left) or go do it right now (▶ button). */}
        <ul className="space-y-2">
          {week.activities.map((act, ai) => (
            <li
              key={ai}
              className={`rounded-xl border ${act.done ? "border-transparent opacity-80" : darkMode ? "border-gray-700" : "border-[#F1F5F9]"}`}
            >
              <div className="flex items-start">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={act.done}
                  aria-label={`${act.titulo}: ${act.done ? "hecha" : "marcar como hecha"}`}
                  onClick={() => onToggle(weekIdx, ai)}
                  className={`flex-1 min-w-0 min-h-[44px] !flex items-start !justify-start gap-3 px-2 py-2 rounded-xl text-left transition-colors ${darkMode ? "hover:bg-white/5" : "hover:bg-[#FFF7ED]"}`}
                >
                  <span
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      act.done
                        ? "border-[#FB8500]"
                        : darkMode
                          ? "border-gray-500"
                          : "border-[#CBD5E1]"
                    }`}
                    style={act.done ? { background: PROGRESS_GRADIENT } : {}}
                    aria-hidden="true"
                  >
                    {act.done && (
                      <svg viewBox="0 0 10 8" className="w-3 h-3" fill="none">
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className={`text-sm leading-snug ${
                        act.done
                          ? "line-through opacity-40"
                          : darkMode
                            ? "text-gray-200"
                            : "text-[#334155]"
                      }`}
                    >
                      {TIPO_EMOJI[act.tipo] ? `${TIPO_EMOJI[act.tipo]} ` : ""}
                      {act.titulo}
                    </span>
                    {act.duracion && (
                      <span className="ml-2 text-xs text-[#94A3B8] whitespace-nowrap">
                        ⏱ {act.duracion}
                      </span>
                    )}
                  </span>
                </button>
              </div>
              {!act.done && onOpen && (
                <button
                  type="button"
                  onClick={() => onOpen(weekIdx, ai)}
                  className="mx-2 mb-2 w-[calc(100%-1rem)] min-h-[40px] !flex items-center !justify-between gap-2 px-3 rounded-lg text-xs font-black text-white"
                  style={{ background: PROGRESS_GRADIENT }}
                >
                  <span>▶ Hazla ahora</span>
                  <span className="font-bold text-white/90">
                    {routeLabelFor?.(weekIdx, ai)}
                  </span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ImprovementPlan({ onTabChange }) {
  const { vakResult, darkMode, gradeLevel, studentGrades } = useIngenIAKids();
  const { plan, isGenerating, error, generatePlan, markActivityDone, hasPlan } =
    useImprovementPlan();
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [openWeek, setOpenWeek] = useState(null);

  // Grades and ADN make the plan more precise, but neither blocks it.
  const hasGrades = (studentGrades || []).length > 0;
  const sub = darkMode ? "text-gray-400" : "text-[#64748B]";
  const hintBtn = `w-full max-w-xs min-h-[44px] !flex items-center !justify-center gap-2 px-4 rounded-xl text-xs font-bold border ${darkMode ? "border-gray-600 text-gray-200" : "border-[#E2E8F0] text-[#334155] bg-white"}`;

  const totalActivities = hasPlan
    ? plan.weeks.reduce((s, w) => s + w.activities.length, 0)
    : 0;
  const doneActivities = hasPlan
    ? plan.weeks.reduce(
        (s, w) => s + w.activities.filter((a) => a.done).length,
        0,
      )
    : 0;
  const globalPct =
    totalActivities > 0
      ? Math.round((doneActivities / totalActivities) * 100)
      : 0;
  // Opens on the first week that still has something to do.
  const firstPending = hasPlan
    ? Math.max(
        0,
        plan.weeks.findIndex((w) => w.activities.some((a) => !a.done)),
      )
    : 0;
  const shownWeek =
    hasPlan && openWeek != null && openWeek < plan.weeks.length
      ? openWeek
      : firstPending;

  // "▶ Hazla ahora": hand the task to Practicar, which opens the right tool
  // with the topic filled in (and generates the material right away).
  const routeOf = (wi, ai) =>
    activityRoute(plan.weeks[wi].activities[ai], plan.weeks[wi], {
      weakSubjects: plan.weakSubjects,
      vakStyle: vakResult?.predominantStyle,
    });
  const openActivity = (wi, ai) => {
    setHandoff(
      HANDOFF_PLAN_ACTIVITY,
      JSON.stringify({ ...routeOf(wi, ai), planRef: { week: wi, act: ai } }),
    );
    onTabChange?.("practicar");
  };

  if (isGenerating) {
    return (
      <motion.div
        {...fadeIn}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 gap-4"
      >
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#FB8500", borderTopColor: "transparent" }}
        />
        <p
          className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-[#64748B]"}`}
        >
          Dani está armando tu plan… 📋
        </p>
        <p className={`text-xs ${sub}`}>Esto tarda unos segundos.</p>
      </motion.div>
    );
  }

  if (!hasPlan) {
    return (
      <motion.div
        {...fadeIn}
        transition={transition}
        className="flex flex-col items-center justify-center py-8 gap-5 text-center px-4"
      >
        <span className="text-6xl" aria-hidden="true">
          📋
        </span>
        <div>
          <h2
            className={`!m-0 text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-[#1E293B]"}`}
          >
            Tu Plan de Mejora
          </h2>
          <p className={`!m-0 mt-1 text-sm max-w-xs mx-auto ${sub}`}>
            Dani te arma un plan de 4 semanas con actividades cortas para subir
            tus notas. Vas marcando lo que haces. ✅
          </p>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-500 max-w-xs">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={generatePlan}
          className="w-full max-w-xs px-6 py-3.5 rounded-xl font-black text-base text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
          style={{ background: PROGRESS_GRADIENT }}
        >
          🚀 Generar mi plan
        </button>
        {!hasGrades && (
          <button
            type="button"
            onClick={() => onTabChange?.("calificaciones")}
            className={hintBtn}
          >
            📊 Escribe tus notas primero para un plan más exacto
          </button>
        )}
        {!vakResult && (
          <button
            type="button"
            onClick={() => onTabChange?.("vak")}
            className={hintBtn}
          >
            🧠 Haz tu ADN de Aprendizaje para personalizarlo
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div {...fadeIn} transition={transition} className="space-y-3">
      {/* Progress strip — the "Mi Plan de Mejora" title is already in the
          Aprender header, so no second banner title here. */}
      <div
        className="rounded-2xl px-4 py-3 text-white"
        style={{ background: PROGRESS_GRADIENT }}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="!m-0 text-xs font-bold !text-white">
            {globalPct === 100
              ? "🏆 ¡Completaste tu plan!"
              : `Llevas ${doneActivities} de ${totalActivities} actividades`}
            {gradeLevel ? ` · Grado ${gradeLevel}` : ""}
          </p>
          <span className="text-xl font-black leading-none">{globalPct}%</span>
        </div>
        <div
          className="mt-2 w-full h-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.3)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${globalPct}%`,
              background: "rgba(255,255,255,0.9)",
            }}
          />
        </div>
      </div>

      {/* Key actions + subjects to reinforce, folded into one compact card. */}
      {(plan.topActions?.length > 0 || plan.weakSubjects?.length > 0) && (
        <div
          className={`rounded-2xl border px-3.5 py-3 space-y-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-[#FFF7ED] border-[#FED7AA]"}`}
        >
          {plan.weakSubjects?.length > 0 && (
            <p
              className={`!m-0 text-xs font-bold ${darkMode ? "text-gray-200" : "text-[#9A3412]"}`}
            >
              💪 Reforzar: {plan.weakSubjects.join(" · ")}
            </p>
          )}
          {plan.topActions?.length > 0 && (
            <ol className="space-y-1">
              {plan.topActions.map((action, i) => (
                <li
                  key={i}
                  className={`text-xs leading-snug flex gap-1.5 ${darkMode ? "text-gray-300" : "text-[#7C2D12]"}`}
                >
                  <span className="font-black text-[#FB8500]">{i + 1}.</span>
                  {action}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* One week at a time: a selector instead of four stacked cards keeps
          the plan to about one phone screen. */}
      <div
        role="tablist"
        aria-label="Semanas del plan"
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${plan.weeks.length}, minmax(0, 1fr))`,
        }}
      >
        {plan.weeks.map((w, wi) => {
          const d = w.activities.filter((a) => a.done).length;
          const complete = d === w.activities.length;
          const active = wi === shownWeek;
          return (
            <button
              key={wi}
              type="button"
              role="tab"
              data-pill
              aria-selected={active}
              onClick={() => setOpenWeek(wi)}
              className={`min-h-[52px] !flex flex-col !items-center !justify-center gap-0.5 rounded-xl border-2 text-xs font-black transition-colors ${
                active
                  ? "text-white border-transparent shadow-md"
                  : darkMode
                    ? "border-gray-700 text-gray-300"
                    : "border-[#E2E8F0] text-[#334155] bg-white"
              }`}
              style={active ? { background: PROGRESS_GRADIENT } : {}}
            >
              <span>
                {complete ? "✅ " : ""}Sem {w.week}
              </span>
              <span
                className={`text-[10px] font-bold ${active ? "text-white/90" : "text-[#94A3B8]"}`}
              >
                {d}/{w.activities.length}
              </span>
            </button>
          );
        })}
      </div>
      <WeekCard
        key={shownWeek}
        week={plan.weeks[shownWeek]}
        weekIdx={shownWeek}
        onToggle={markActivityDone}
        onOpen={onTabChange ? openActivity : null}
        routeLabelFor={(wi, ai) => routeLabel(routeOf(wi, ai))}
        darkMode={darkMode}
      />

      {/* Regenerar: a new plan replaces the ticks, so ask once. */}
      <div className="flex flex-col items-center gap-2 pt-2 pb-4">
        {error && (
          <p role="alert" className="text-sm text-red-500 text-center max-w-xs">
            {error}
          </p>
        )}
        {confirmRegen ? (
          <div className="flex flex-col items-center gap-2">
            <p className={`!m-0 text-xs font-semibold text-center ${sub}`}>
              Tu plan nuevo empieza de cero. ¿Seguro?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmRegen(false);
                  setOpenWeek(null);
                  generatePlan();
                }}
                className="min-h-[40px] px-4 rounded-xl text-xs font-black text-white"
                style={{ background: PROGRESS_GRADIENT }}
              >
                Sí, hacer uno nuevo
              </button>
              <button
                type="button"
                onClick={() => setConfirmRegen(false)}
                className={`min-h-[40px] px-4 rounded-xl text-xs font-bold border ${darkMode ? "border-gray-600 text-gray-300" : "border-[#E2E8F0] text-[#64748B]"}`}
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (doneActivities > 0) return setConfirmRegen(true);
              setOpenWeek(null);
              generatePlan();
            }}
            className={`min-h-[40px] text-xs px-4 py-2 rounded-lg border transition-colors font-medium ${
              darkMode
                ? "border-gray-600 text-gray-400 hover:border-[#FB8500] hover:text-[#FB8500]"
                : "border-[#E2E8F0] text-[#64748B] hover:border-[#FB8500] hover:text-[#FB8500]"
            }`}
          >
            ↺ Hacer un plan nuevo
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default memo(ImprovementPlan);
