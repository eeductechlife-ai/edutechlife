import { memo, useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MissionsView from "./MissionsView";
import { SectionFallback } from "./SkeletonLoader";

const TechNewsFeed = lazy(() => import("../news/TechNewsFeed"));

const EXPLORE_GRADIENT =
  "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)";

const VIEWS = [
  { id: "misiones", label: "Misiones", emoji: "🎯" },
  { id: "noticias", label: "Tech & IA", emoji: "🌐" },
];

const VIEW_LABELS = {
  misiones: { title: "Misiones Diarias", sub: "Completa retos y gana XP" },
  noticias: {
    title: "Tech & IA",
    sub: "Noticias de tecnología e inteligencia artificial",
  },
};

const ExplorarTab = memo(function ExplorarTab({
  missions,
  onCompleteMission,
  defaultView = "misiones",
}) {
  const [activeView, setActiveView] = useState(defaultView);
  const currentView = VIEWS.find((v) => v.id === activeView) || VIEWS[0];
  const info = VIEW_LABELS[activeView] || VIEW_LABELS.misiones;

  return (
    <div className="space-y-4">
      <div
        className="relative rounded-2xl overflow-hidden p-4"
        style={{ background: EXPLORE_GRADIENT }}
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

          <div className="flex gap-2">
            {VIEWS.map((v) => {
              const active = activeView === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveView(v.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "bg-white text-[#7B2FF7] shadow-md"
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
          {activeView === "misiones" && (
            <MissionsView
              missions={missions}
              onCompleteMission={onCompleteMission}
            />
          )}
          {activeView === "noticias" && (
            <Suspense fallback={<SectionFallback tab="noticias" />}>
              <TechNewsFeed />
            </Suspense>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default ExplorarTab;
