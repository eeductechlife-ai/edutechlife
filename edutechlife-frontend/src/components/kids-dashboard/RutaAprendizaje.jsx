import { memo } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";

const STEPS = [
  { key: "vak", emoji: "🧠", label: "VAK", tab: "vak" },
  { key: "horario", emoji: "📅", label: "Horario", tab: "horario" },
  {
    key: "grades",
    emoji: "📊",
    label: "Calificaciones",
    tab: "calificaciones",
  },
  { key: "plan", emoji: "📋", label: "Mi Plan", tab: "plan" },
  { key: "practico", emoji: "🚀", label: "Practicando", tab: "inicio" },
];

const COLOR_DONE = "#06D6A0";
const COLOR_CURRENT = "#0096C7";
const COLOR_PENDING = "#CBD5E1";

function StepCircle({ emoji, done, current, onClick }) {
  const bg = done ? COLOR_DONE : current ? COLOR_CURRENT : COLOR_PENDING;
  const inner = done ? (
    <span className="text-white font-bold text-base">✓</span>
  ) : (
    <span className="text-base">{emoji}</span>
  );

  if (current) {
    return (
      <motion.button
        onClick={onClick}
        animate={{
          scale: [1, 1.08, 1],
          boxShadow: [
            `0 0 0px ${COLOR_CURRENT}`,
            `0 0 14px ${COLOR_CURRENT}88`,
            `0 0 0px ${COLOR_CURRENT}`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
        style={{ background: bg }}
        aria-label="Ir a este paso"
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}
    >
      {inner}
    </div>
  );
}

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

  // Hide if onboarding is complete and all prior steps done
  if (onboardingComplete && allDone) return null;

  const currentIdx = stepDone.findIndex((d) => !d);

  const cardBg = darkMode ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.92)";
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const textPrimary = darkMode ? "#F1F5F9" : "#0F172A";
  const textSecondary = darkMode ? "#94A3B8" : "#64748B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl p-4 md:p-5 mb-2"
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: textSecondary }}
      >
        Tu ruta de aprendizaje
      </p>

      {allDone ? (
        <p className="text-base font-bold" style={{ color: textPrimary }}>
          🎉 ¡Journey completo! Sigue aprendiendo cada día.
        </p>
      ) : (
        <div className="overflow-x-auto pb-1">
          <div className="flex items-start gap-0 min-w-max md:min-w-0 md:w-full">
            {STEPS.map((step, i) => {
              const done = stepDone[i];
              const current = i === currentIdx;
              const last = i === STEPS.length - 1;

              return (
                <div key={step.key} className="flex items-start">
                  {/* Step column */}
                  <div className="flex flex-col items-center gap-1.5 w-16">
                    <StepCircle
                      emoji={step.emoji}
                      done={done}
                      current={current}
                      onClick={
                        current ? () => onTabChange?.(step.tab) : undefined
                      }
                    />
                    <span
                      className="text-[10px] font-semibold text-center leading-tight px-0.5"
                      style={{
                        color: current
                          ? COLOR_CURRENT
                          : done
                            ? COLOR_DONE
                            : textSecondary,
                      }}
                    >
                      {step.label}
                    </span>
                    {current && (
                      <button
                        onClick={() => onTabChange?.(step.tab)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: COLOR_CURRENT }}
                      >
                        → Ir
                      </button>
                    )}
                  </div>

                  {/* Connector line */}
                  {!last && (
                    <div
                      className="h-0.5 w-6 mt-6 flex-shrink-0"
                      style={{
                        background:
                          stepDone[i] && stepDone[i + 1]
                            ? COLOR_DONE
                            : stepDone[i]
                              ? `linear-gradient(to right, ${COLOR_DONE}, ${COLOR_PENDING})`
                              : COLOR_PENDING,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
});

RutaAprendizaje.displayName = "RutaAprendizaje";
export default RutaAprendizaje;
