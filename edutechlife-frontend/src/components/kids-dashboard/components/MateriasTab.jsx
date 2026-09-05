import { memo, useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubjectsView from "./SubjectsView";
import { SectionFallback } from "./SkeletonLoader";

const WeeklyScheduleView = lazy(() => import("../schedule"));
const GradeScanner = lazy(() => import("../GradeScanner"));
const ImprovementPlan = lazy(
  () => import("../improvementPlan/ImprovementPlan"),
);

const LEARN_GRADIENT =
  "linear-gradient(135deg, #06D6A0 0%, #1B9AAA 60%, #118AB2 100%)";

const VIEWS_BASE = [
  { id: "materias", label: "Materias", emoji: "📚" },
  { id: "horario", label: "Horario", emoji: "🗓" },
  { id: "calificaciones", label: "Notas", emoji: "📊" },
  { id: "plan", label: "Mi Plan", emoji: "🎯", minAge: 10 },
];

const VIEW_INFO = {
  materias: { title: "Mis Materias", sub: "Progreso y nivel por asignatura" },
  horario: { title: "Mi Horario", sub: "Clases y distribución semanal" },
  calificaciones: { title: "Mis Notas", sub: "Calificaciones por materia" },
  plan: { title: "Mi Plan de Mejora", sub: "Actividades IA para esta semana" },
};

function UnifiedPlanView({ vakResult, onTabChange }) {
  return (
    <div className="space-y-4">
      {vakResult && (
        <div className="rounded-2xl border border-[#9D4EDD]/20 bg-[#9D4EDD]/5 px-4 py-3 flex items-center gap-3">
          <span className="text-lg flex-shrink-0">🧠</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#7B2FF7] uppercase tracking-wide">
              Estilo VAK: {vakResult.style || "Personalizado"}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              Tu plan incluye actividades adaptadas a cómo aprendes mejor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onTabChange?.("perfil")}
            className="text-[10px] font-bold text-[#9D4EDD] hover:underline whitespace-nowrap flex-shrink-0"
          >
            Ver perfil →
          </button>
        </div>
      )}
      <Suspense fallback={<SectionFallback tab="plan" />}>
        <ImprovementPlan />
      </Suspense>
    </div>
  );
}

const MateriasTab = memo(function MateriasTab({
  subjects,
  onTabChange,
  defaultView = "materias",
  ageGroup = "middle",
  vakResult = null,
}) {
  const views = VIEWS_BASE.filter((v) => !(v.minAge && ageGroup === "early"));

  const [activeView, setActiveView] = useState(() => {
    if (views.some((v) => v.id === defaultView)) return defaultView;
    return "materias";
  });

  const currentView = views.find((v) => v.id === activeView) || views[0];
  const info = VIEW_INFO[activeView] || VIEW_INFO.materias;

  return (
    <div className="space-y-4">
      <div
        className="relative rounded-2xl overflow-hidden p-4"
        style={{ background: LEARN_GRADIENT }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <span className="text-xl">{currentView.emoji}</span>
            </div>
            <div>
              <h3 className="text-base font-black text-white">{info.title}</h3>
              <p className="text-xs text-white/75">{info.sub}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {views.map((v) => {
              const active = activeView === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveView(v.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-white text-[#118AB2] shadow-md"
                      : "bg-white/15 text-white/80 hover:bg-white/25"
                  }`}
                >
                  <span>{v.emoji}</span>
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translate(30%,-30%)",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.22 }}
        >
          {activeView === "materias" && (
            <SubjectsView subjects={subjects} onTabChange={onTabChange} />
          )}
          {activeView === "horario" && (
            <Suspense fallback={<SectionFallback tab="horario" />}>
              <WeeklyScheduleView />
            </Suspense>
          )}
          {activeView === "calificaciones" && (
            <Suspense fallback={<SectionFallback tab="calificaciones" />}>
              <GradeScanner onTabChange={onTabChange} />
            </Suspense>
          )}
          {activeView === "plan" && (
            <UnifiedPlanView vakResult={vakResult} onTabChange={onTabChange} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default MateriasTab;
