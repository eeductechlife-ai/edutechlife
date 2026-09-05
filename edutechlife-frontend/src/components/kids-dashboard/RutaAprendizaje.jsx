import { memo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";

const STEPS = [
  {
    key: "vak",
    emoji: "🧠",
    label: "Estilo VAK",
    doneLabel: "Descubriste tu estilo",
    pendingLabel: "Descubre cómo aprendes mejor",
    tab: "perfil",
    color: "#9D4EDD",
  },
  {
    key: "horario",
    emoji: "📅",
    label: "Horario",
    doneLabel: "Horario registrado",
    pendingLabel: "Agrega tu horario de clases",
    tab: "horario",
    color: "#0096C7",
  },
  {
    key: "grades",
    emoji: "📊",
    label: "Calificaciones",
    doneLabel: "Notas registradas",
    pendingLabel: "Sube tus calificaciones",
    tab: "calificaciones",
    color: "#F59E0B",
  },
  {
    key: "plan",
    emoji: "📋",
    label: "Plan de estudio",
    doneLabel: "Plan creado",
    pendingLabel: "Crea tu plan de estudio",
    tab: "plan",
    color: "#06D6A0",
  },
  {
    key: "practico",
    emoji: "🚀",
    label: "Practicando",
    doneLabel: "¡Estás en racha!",
    pendingLabel: "Empieza a practicar",
    tab: "inicio",
    color: "#EF4444",
  },
];

const RutaAprendizaje = memo(({ onTabChange }) => {
  const {
    vakCompleted,
    hasUploadedSchedule,
    hasGrades,
    onboardingComplete,
    darkMode,
  } = useSmartBoardKids();

  const hasPlan = false; // Fase 2

  const stepDone = [
    !!vakCompleted,
    !!hasUploadedSchedule,
    !!hasGrades,
    hasPlan,
    onboardingComplete && hasPlan,
  ];

  const allDone = stepDone.every(Boolean);
  if (onboardingComplete && allDone) return null;

  const completedCount = stepDone.filter(Boolean).length;
  const totalCount = STEPS.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const currentIdx = stepDone.findIndex((d) => !d);
  const currentStep = currentIdx >= 0 ? STEPS[currentIdx] : null;

  const cardBg = darkMode ? "rgba(15,23,42,0.88)" : "rgba(255,255,255,0.95)";
  const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = darkMode ? "#F1F5F9" : "#0F172A";
  const textSecondary = darkMode ? "#94A3B8" : "#64748B";
  const trackBg = darkMode ? "rgba(255,255,255,0.10)" : "#E2E8F0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl p-4 md:p-5"
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header: título + progreso */}
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: textSecondary }}
        >
          Tu ruta de aprendizaje
        </p>
        <span
          className="text-xs font-black"
          style={{ color: currentStep?.color || "#06D6A0" }}
        >
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-2 rounded-full mb-4" style={{ background: trackBg }}>
        <motion.div
          className="h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: currentStep?.color
              ? `linear-gradient(to right, ${currentStep.color}bb, ${currentStep.color})`
              : "#06D6A0",
          }}
        />
      </div>

      {allDone ? (
        <p className="text-base font-bold" style={{ color: textPrimary }}>
          🎉 ¡Ruta completa! Sigue aprendiendo cada día.
        </p>
      ) : (
        <>
          {/* Pasos completados — chips pequeños */}
          {completedCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {STEPS.slice(0, currentIdx).map((step) => (
                <span
                  key={step.key}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${step.color}18`,
                    color: step.color,
                    border: `1px solid ${step.color}30`,
                  }}
                >
                  ✓ {step.label}
                </span>
              ))}
            </div>
          )}

          {/* Siguiente paso — CTA grande */}
          {currentStep && (
            <motion.button
              type="button"
              onClick={() => onTabChange?.(currentStep.tab)}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:opacity-90 active:scale-98"
              style={{
                background: `${currentStep.color}14`,
                border: `1.5px solid ${currentStep.color}40`,
              }}
            >
              <motion.span
                className="text-3xl leading-none flex-shrink-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {currentStep.emoji}
              </motion.span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: currentStep.color }}
                >
                  Siguiente paso
                </div>
                <div
                  className="text-base font-black leading-tight"
                  style={{ color: textPrimary }}
                >
                  {currentStep.pendingLabel}
                </div>
              </div>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full text-white flex-shrink-0"
                style={{ backgroundColor: currentStep.color }}
              >
                Ir →
              </span>
            </motion.button>
          )}

          {/* Próximos pasos (los que faltan después del actual) */}
          {currentIdx < STEPS.length - 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {STEPS.slice(currentIdx + 1).map((step) => (
                <span
                  key={step.key}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: trackBg,
                    color: textSecondary,
                  }}
                >
                  {step.emoji} {step.label}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
});

RutaAprendizaje.displayName = "RutaAprendizaje";
export default RutaAprendizaje;
