import { memo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useImprovementPlan } from "./useImprovementPlan";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
const transition = { duration: 0.4, ease: "easeOut" };

function WeekCard({ week, weekIdx, onToggle, darkMode }) {
  const done = week.activities.filter((a) => a.done).length;
  const total = week.activities.length;

  return (
    <motion.div
      {...fadeIn}
      transition={{ ...transition, delay: weekIdx * 0.08 }}
      className={`rounded-2xl p-4 border ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Semana {week.week}: {week.title || week.focus}
        </h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0096C7]/10 text-[#0096C7]">
          {done}/{total}
        </span>
      </div>

      {week.danTip && (
        <p className="text-xs italic mb-3 text-[#06D6A0] leading-snug">
          💬 {week.danTip}
        </p>
      )}

      <ul className="space-y-2">
        {week.activities.map((act, ai) => (
          <li key={ai} className="flex items-start gap-2">
            <button
              onClick={() => onToggle(weekIdx, ai)}
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                act.done
                  ? "bg-[#06D6A0] border-[#06D6A0]"
                  : darkMode
                    ? "border-gray-500 hover:border-[#06D6A0]"
                    : "border-gray-300 hover:border-[#06D6A0]"
              }`}
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
                    ? "line-through opacity-50"
                    : darkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                }`}
              >
                {act.titulo}
              </span>
              {act.duracion && (
                <span className="ml-2 text-xs text-gray-400">
                  {act.duracion}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ImprovementPlan() {
  const { vakResult, studentGrades, darkMode } = useSmartBoardKids();
  const { plan, isGenerating, error, generatePlan, markActivityDone, hasPlan } =
    useImprovementPlan();

  const canGenerate = vakResult && studentGrades && studentGrades.length > 0;

  const totalActivities = hasPlan
    ? plan.weeks.reduce((s, w) => s + w.activities.length, 0)
    : 0;
  const doneActivities = hasPlan
    ? plan.weeks.reduce(
        (s, w) => s + w.activities.filter((a) => a.done).length,
        0,
      )
    : 0;

  if (isGenerating) {
    return (
      <motion.div
        {...fadeIn}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 gap-4"
      >
        <div className="w-12 h-12 rounded-full border-4 border-[#0096C7] border-t-transparent animate-spin" />
        <p
          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
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
        <span className="text-6xl">📋</span>
        <div>
          <h2
            className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Tu Plan de Mejora
          </h2>
          <p
            className={`text-sm max-w-xs mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {canGenerate
              ? "Genera tu plan personalizado basado en tu estilo VAK y tus calificaciones"
              : "Primero completa tu diagnóstico VAK y agrega tus calificaciones para generar tu plan"}
          </p>
        </div>
        {error && <p className="text-sm text-red-500 max-w-xs">{error}</p>}
        <button
          onClick={generatePlan}
          disabled={!canGenerate}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            canGenerate
              ? "bg-[#0096C7] hover:bg-[#0077B6] text-white shadow-md hover:shadow-lg active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          🚀 Generar mi plan
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div {...fadeIn} transition={transition} className="space-y-4">
      {/* Header con progreso */}
      <div
        className={`rounded-2xl p-4 ${
          darkMode
            ? "bg-gradient-to-r from-[#0077B6]/40 to-[#06D6A0]/20"
            : "bg-gradient-to-r from-[#0096C7]/10 to-[#06D6A0]/10"
        }`}
      >
        <h2
          className={`font-bold text-lg mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          📋 Mi Plan de Mejora
        </h2>
        <p
          className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          {doneActivities} de {totalActivities} actividades completadas
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-[#06D6A0] h-2 rounded-full transition-all duration-500"
            style={{
              width:
                totalActivities > 0
                  ? `${(doneActivities / totalActivities) * 100}%`
                  : "0%",
            }}
          />
        </div>
      </div>

      {/* Top actions */}
      {plan.topActions?.length > 0 && (
        <div>
          <h3
            className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Acciones clave
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.topActions.map((action, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: ["#0096C7", "#06D6A0", "#FFD166"][i % 3] + "22",
                  color: ["#0077B6", "#05a87e", "#c9960a"][i % 3],
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
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs font-semibold mr-1 self-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Reforzar:
          </span>
          {plan.weakSubjects.map((sub, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium"
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
          className={`text-xs px-4 py-2 rounded-lg border transition-colors ${
            darkMode
              ? "border-gray-600 text-gray-400 hover:border-[#0096C7] hover:text-[#0096C7]"
              : "border-gray-300 text-gray-500 hover:border-[#0096C7] hover:text-[#0096C7]"
          }`}
        >
          ↺ Regenerar plan
        </button>
      </div>
    </motion.div>
  );
}

export default memo(ImprovementPlan);
