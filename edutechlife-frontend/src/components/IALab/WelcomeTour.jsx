import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles, Trophy, Zap, MessageCircle, BookOpen } from "lucide-react";
import { safeStorage } from "../../utils/storage";
import { useIALabStore } from "../../store/ialabStore";

const TOUR_KEY = "ialab-welcome-tour-completed";
const VISIT_COUNT_KEY = "ialab-visit-count";

const STEPS = [
  {
    icon: Sparkles,
    title: "¡Bienvenido a IA Lab Academic!",
    description:
      "Tu ruta hacia el dominio de la IA comienza aquí. En 5 módulos progresivos aprenderás desde prompts básicos hasta ética avanzada.",
    highlight: "5 Módulos · 28-40 horas · Certificado profesional",
  },
  {
    icon: BookOpen,
    title: "Tu ruta de aprendizaje",
    description:
      "Cada módulo tiene contenido, actividades, un desafío y un examen. Debes obtener 80% para desbloquear el siguiente módulo.",
    highlight: "Artesano → Arquitecto → Detective → Alquimista → Guardián",
  },
  {
    icon: Trophy,
    title: "Gamificación que motiva",
    description:
      "Gana XP por cada actividad, mantén rachas diarias y desbloquea badges. Tu progreso es tuyo y se guarda automáticamente.",
    highlight: "XP · Rachas · Badges · Certificado final",
  },
  {
    icon: MessageCircle,
    title: "Valerio, tu coach IA",
    description:
      "Un tutor personal disponible 24/7. Pregúntale cualquier duda sobre los módulos, prompts, herramientas o ética.",
    highlight: "Disponible en todos los módulos",
  },
  {
    icon: Zap,
    title: "¡Estás listo para empezar!",
    description:
      "Comienza con el Módulo 1 (Artesano Digital) y avanza a tu ritmo. Recuerda: cada pequeño paso te acerca a ser un Guardián Digital.",
    highlight: "Tu primer módulo te espera",
  },
];

function isReturningStudent() {
  try {
    const tourCompleted = safeStorage.getItem(TOUR_KEY);
    if (tourCompleted) return true;

    const visitCountRaw = safeStorage.getItem(VISIT_COUNT_KEY);
    const visitCount = visitCountRaw ? parseInt(visitCountRaw, 10) : 0;
    if (visitCount >= 2) return true;

    return false;
  } catch {
    return true;
  }
}

function incrementVisitCount() {
  try {
    const raw = safeStorage.getItem(VISIT_COUNT_KEY);
    const count = raw ? parseInt(raw, 10) : 0;
    safeStorage.setItem(VISIT_COUNT_KEY, String(count + 1));
  } catch {
    // no-op
  }
}

function hasExistingProgress(store) {
  if (!store) return false;
  const moduleProgress = store.moduleProgress || {};
  const hasAnyModuleActivity = Object.values(moduleProgress).some(
    (mod) => mod?.exam || mod?.challenge || mod?.resourcesCompleted || (mod?.currentScore || 0) > 0,
  );
  const hasXp = (store.totalXp || 0) > 0;
  const hasCompletedLessons = Array.isArray(store.completedLessons) && store.completedLessons.length > 0;
  return hasAnyModuleActivity || hasXp || hasCompletedLessons;
}

export default function WelcomeTour({ forceShow = false, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const totalXp = useIALabStore((s) => s.totalXp);
  const completedLessons = useIALabStore((s) => s.completedLessons);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    if (isReturningStudent()) {
      incrementVisitCount();
      return;
    }

    const hasProgress = hasExistingProgress({ moduleProgress, totalXp, completedLessons });
    if (hasProgress) {
      safeStorage.setItem(TOUR_KEY, new Date().toISOString());
      incrementVisitCount();
      return;
    }

    incrementVisitCount();
    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [forceShow, moduleProgress, totalXp, completedLessons]);

  const handleClose = useCallback(() => {
    safeStorage.setItem(TOUR_KEY, new Date().toISOString());
    setIsOpen(false);
    if (onComplete) onComplete();
  }, [onComplete]);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  }, [step, handleClose]);

  const handlePrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight" || e.key === "Enter") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      aria-describedby="tour-description"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "rgba(10, 43, 91, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={handleClose}
    >
      <div
        className="relative rounded-3xl max-w-md w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,249,252,0.98) 100%)",
          boxShadow: "0 25px 60px -12px rgba(0, 75, 99, 0.45), 0 0 0 1px rgba(0, 188, 212, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            color: "var(--ialab-petroleum, #004B63)",
            boxShadow: "0 2px 8px rgba(0, 75, 99, 0.15)",
          }}
          aria-label="Cerrar tour de bienvenida"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="h-32 flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--ialab-petroleum, #004B63) 0%, var(--ialab-teal, #2596be) 50%, var(--ialab-cyan, #00BCD4) 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl" style={{ background: "rgba(255,255,255,0.4)" }} />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-2xl" style={{ background: "rgba(102, 204, 204, 0.5)" }} />
          </div>
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center transform transition-transform hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 10px 30px rgba(0, 75, 99, 0.35)",
            }}
          >
            <Icon className="w-10 h-10" style={{ color: "var(--ialab-petroleum, #004B63)" }} aria-hidden="true" />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2
            id="tour-title"
            className="text-xl sm:text-2xl font-bold mb-2 text-center"
            style={{ color: "var(--ialab-petroleum, #004B63)", fontFamily: "'Montserrat', sans-serif" }}
          >
            {currentStep.title}
          </h2>
          <p
            id="tour-description"
            className="text-sm leading-relaxed mb-4 text-center"
            style={{ color: "#334155" }}
          >
            {currentStep.description}
          </p>
          <div
            className="rounded-xl px-4 py-3 mb-6 text-center"
            style={{
              background: "linear-gradient(90deg, rgba(0, 188, 212, 0.08) 0%, rgba(102, 204, 204, 0.12) 100%)",
              border: "1px solid rgba(0, 188, 212, 0.2)",
            }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--ialab-teal, #2596be)" }}>
              {currentStep.highlight}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-6" role="tablist" aria-label="Progreso del tour">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-label={`Paso ${i + 1} de ${STEPS.length}`}
                onClick={() => setStep(i)}
                className="rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  height: "6px",
                  width: i === step ? "32px" : "8px",
                  background:
                    i === step
                      ? "var(--ialab-cyan, #00BCD4)"
                      : i < step
                      ? "rgba(0, 188, 212, 0.4)"
                      : "rgba(148, 163, 184, 0.3)",
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 0}
              className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2"
              style={{ color: "var(--ialab-petroleum, #004B63)" }}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Atrás
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background:
                  "linear-gradient(135deg, var(--ialab-petroleum, #004B63) 0%, var(--ialab-teal, #2596be) 100%)",
                boxShadow: "0 6px 18px rgba(0, 75, 99, 0.35)",
              }}
            >
              {isLast ? "¡Empezar!" : "Siguiente"}
              {!isLast && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
              {isLast && <Sparkles className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>

          {!isLast && (
            <button
              type="button"
              onClick={handleClose}
              className="w-full mt-3 text-xs transition-colors focus-visible:outline-none focus-visible:underline"
              style={{ color: "#64748B" }}
            >
              Saltar tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function resetWelcomeTour() {
  safeStorage.removeItem(TOUR_KEY);
  safeStorage.removeItem(VISIT_COUNT_KEY);
}
