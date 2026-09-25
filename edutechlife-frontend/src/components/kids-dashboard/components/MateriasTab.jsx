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
  // Open to every age: the plan is a simple checklist, and the grade
  // analysis in Notas sends kids here.
  { id: "plan", label: "Mi Plan", emoji: "🎯" },
];

const VIEW_INFO = {
  materias: {
    title: "Mis Materias",
    sub: "Tu nota en cada materia y cómo mejorarla",
  },
  horario: { title: "Mi Horario", sub: "Clases y distribución semanal" },
  calificaciones: {
    title: "Mis Notas",
    sub: "Escríbelas o sube una foto de tu boletín",
  },
  plan: { title: "Mi Plan de Mejora", sub: "Actividades IA para esta semana" },
};

const STYLE_LABEL = {
  visual: "👁️ Visual",
  auditivo: "👂 Auditivo",
  kinestesico: "🏃 Kinestésico",
};

function UnifiedPlanView({ vakResult, onTabChange }) {
  // The ADN stores `predominantStyle`; reading `style` always showed
  // "Personalizado".
  const style = STYLE_LABEL[vakResult?.predominantStyle];
  return (
    <div className="space-y-3">
      {style && (
        <div className="rounded-2xl border border-[#9D4EDD]/20 bg-[#9D4EDD]/5 px-3 py-2 flex items-center gap-2">
          <span className="text-base flex-shrink-0" aria-hidden="true">
            🧠
          </span>
          <p className="!m-0 flex-1 min-w-0 text-xs text-[#475569]">
            Plan hecho para tu estilo{" "}
            <span className="font-black text-[#7B2FF7]">{style}</span>
          </p>
          <button
            type="button"
            onClick={() => onTabChange?.("vak")}
            className="min-h-[36px] px-2 text-[11px] font-bold text-[#9D4EDD] whitespace-nowrap flex-shrink-0"
          >
            Ver mi ADN →
          </button>
        </div>
      )}
      <Suspense fallback={<SectionFallback tab="plan" />}>
        <ImprovementPlan onTabChange={onTabChange} />
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

          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${views.length}, minmax(0, 1fr))`,
            }}
          >
            {views.map((v) => {
              const active = activeView === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setActiveView(v.id);
                    // Each view is also a dashboard tab: switching it keeps the
                    // top bar title ("Notas", "Horario"…) in sync with the content.
                    onTabChange?.(v.id);
                  }}
                  aria-pressed={active}
                  className={`flex flex-col items-center justify-center gap-0.5 min-h-[52px] px-1 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                    active
                      ? "bg-white text-[#118AB2] shadow-md"
                      : "bg-white/15 text-white/80 hover:bg-white/25"
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {v.emoji}
                  </span>
                  <span className="truncate max-w-full">{v.label}</span>
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
