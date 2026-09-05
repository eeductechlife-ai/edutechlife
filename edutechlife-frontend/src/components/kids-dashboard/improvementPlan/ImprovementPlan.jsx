import { memo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useImprovementPlan } from "./useImprovementPlan";

const PROGRESS_GRADIENT =
  "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
const transition = { duration: 0.4, ease: "easeOut" };

function WeekCard({ week, weekIdx, onToggle, darkMode }) {
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
          className={`font-bold text-sm ${darkMode ? "text-white" : "text-[#1E293B]"}`}
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

        <ul className="space-y-2">
          {week.activities.map((act, ai) => (
            <li key={ai} className="flex items-start gap-3">
              <button
                onClick={() => onToggle(weekIdx, ai)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  act.done
                    ? "border-[#FB8500]"
                    : darkMode
                      ? "border-gray-500 hover:border-[#FB8500]"
                      : "border-[#CBD5E1] hover:border-[#FB8500]"
                }`}
                style={act.done ? { background: PROGRESS_GRADIENT } : {}}
                aria-label={
                  act.done ? "Marcar como pendiente" : "Marcar como hecha"
                }
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
              </button>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm leading-snug ${
                    act.done
                      ? "line-through opacity-40"
                      : darkMode
                        ? "text-gray-200"
                        : "text-[#334155]"
                  }`}
                >
                  {act.titulo}
                </span>
                {act.duracion && (
                  <span className="ml-2 text-xs text-[#94A3B8]">
                    {act.duracion}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ImprovementPlan() {
  const { vakResult, darkMode, gradeLevel } = useSmartBoardKids();
  const { plan, isGenerating, error, generatePlan, markActivityDone, hasPlan } =
    useImprovementPlan();

  const canGenerate = !!vakResult;

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
          className={`text-sm ${darkMode ? "text-gray-300" : "text-[#64748B]"}`}
        >
          Dani está analizando tu perfil...
        </p>
      </motion.div>
    );
  }

  if (!hasPlan) {
    return (
      <motion.div
        {...fadeIn}
        transition={transition}
        className="flex flex-col items-center justify-center py-16 gap-6 text-center px-4"
      >
        {/* Banner */}
        <div
          className="w-full relative rounded-2xl overflow-hidden p-5"
          style={{ background: PROGRESS_GRADIENT }}
        >
          <div className="relative z-10 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-black text-white drop-shadow-sm">
                Mi Plan
              </h3>
              <p className="text-xs text-white/80">
                Plan personalizado de mejora académica
              </p>
            </div>
          </div>
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
            style={{
              background: "rgba(255,255,255,0.4)",
              transform: "translate(30%,-30%)",
            }}
          />
        </div>

        <span className="text-6xl">📋</span>
        <div>
          <h2
            className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-[#1E293B]"}`}
          >
            Tu Plan de Mejora
          </h2>
          <p
            className={`text-sm max-w-xs mx-auto ${darkMode ? "text-gray-400" : "text-[#64748B]"}`}
          >
            {canGenerate
              ? "Genera tu plan personalizado basado en tu estilo VAK y tus calificaciones"
              : "Primero completa tu diagnóstico VAK para generar tu plan"}
          </p>
        </div>
        {error && <p className="text-sm text-red-500 max-w-xs">{error}</p>}
        <button
          onClick={generatePlan}
          disabled={!canGenerate}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            canGenerate
              ? "text-white shadow-md hover:shadow-lg active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          style={canGenerate ? { background: PROGRESS_GRADIENT } : {}}
        >
          🚀 Generar mi plan
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div {...fadeIn} transition={transition} className="space-y-4">
      {/* Header banner */}
      <div
        className="relative rounded-2xl overflow-hidden p-5"
        style={{ background: PROGRESS_GRADIENT }}
      >
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <span className="text-2xl">📋</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-white drop-shadow-sm">
                Mi Plan de Mejora
              </h3>
              {gradeLevel && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    color: "white",
                  }}
                >
                  Grado {gradeLevel}
                </span>
              )}
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              {doneActivities} de {totalActivities} actividades completadas
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-2xl font-black text-white">{globalPct}%</span>
          </div>
        </div>
        {/* Progress bar inside banner */}
        <div
          className="relative z-10 mt-3 w-full h-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.3)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${globalPct}%`,
              background: "rgba(255,255,255,0.85)",
            }}
          />
        </div>
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translate(30%,-30%)",
          }}
        />
      </div>

      {/* Top actions */}
      {plan.topActions?.length > 0 && (
        <div>
          <h3
            className={`text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-gray-400" : "text-[#64748B]"}`}
          >
            Acciones clave
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.topActions.map((action, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: [
                    "rgba(251,133,0,0.12)",
                    "rgba(243,114,44,0.12)",
                    "rgba(255,209,102,0.2)",
                  ][i % 3],
                  color: ["#C05621", "#B34A10", "#92400E"][i % 3],
                }}
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Materias débiles */}
      {plan.weakSubjects?.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-[#64748B]"}`}
          >
            Reforzar:
          </span>
          {plan.weakSubjects.map((sub, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: "rgba(251,133,0,0.12)", color: "#C05621" }}
            >
              {sub}
            </span>
          ))}
        </div>
      )}

      {/* Semanas */}
      <div className="space-y-3">
        {plan.weeks.map((week, wi) => (
          <WeekCard
            key={wi}
            week={week}
            weekIdx={wi}
            onToggle={markActivityDone}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Regenerar */}
      <div className="flex justify-center pt-2 pb-4">
        <button
          onClick={generatePlan}
          className={`text-xs px-4 py-2 rounded-lg border transition-colors font-medium ${
            darkMode
              ? "border-gray-600 text-gray-400 hover:border-[#FB8500] hover:text-[#FB8500]"
              : "border-[#E2E8F0] text-[#64748B] hover:border-[#FB8500] hover:text-[#FB8500]"
          }`}
        >
          ↺ Regenerar plan
        </button>
      </div>
    </motion.div>
  );
}

export default memo(ImprovementPlan);
