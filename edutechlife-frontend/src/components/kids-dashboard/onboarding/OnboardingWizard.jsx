import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";

const STEPS = [
  {
    tab: "vak",
    icon: "🧠",
    title: "Diagnóstico VAK",
    messages: {
      early: "¡Primero descubramos cómo aprendes mejor! Solo 2 minutitos 🌟",
      middle: "Primero hagamos tu diagnóstico de estilo de aprendizaje (2 min)",
      senior:
        "Identifica tu estilo de aprendizaje para optimizar tu estudio (2 min)",
    },
    cta: "Ir al diagnóstico",
    flag: "vakCompleted",
  },
  {
    tab: "horario",
    icon: "📅",
    title: "Tu Horario Escolar",
    messages: {
      early: "¡Ahora sube tu horario! Así Dani sabe cuándo ayudarte 📚",
      middle: "Ahora sube tu horario escolar para que puedas organizarte mejor",
      senior:
        "Carga tu horario escolar para recibir recordatorios y planificar tu estudio",
    },
    cta: "Ir al horario",
    flag: "hasUploadedSchedule",
  },
  {
    tab: "calificaciones",
    icon: "📊",
    title: "Tus Calificaciones",
    messages: {
      early: "¿Cuáles son tus notas? ¡Así vemos en qué podemos ayudarte! ⭐",
      middle: "Ingresa tus últimas calificaciones para analizar tu rendimiento",
      senior:
        "Registra tus calificaciones para obtener análisis y recomendaciones personalizadas",
    },
    cta: "Ir a calificaciones",
    flag: "hasGrades",
  },
];

const OnboardingWizard = memo(({ onTabChange }) => {
  const {
    hasSeenWelcome,
    onboardingComplete,
    setOnboardingComplete,
    onboardingStep,
    setOnboardingStep,
    vakCompleted,
    hasUploadedSchedule,
    hasGrades,
    studentAge,
  } = useSmartBoardKids();

  const show = hasSeenWelcome && !onboardingComplete && onboardingStep < 3;

  const ageGroup =
    studentAge <= 8 ? "early" : studentAge <= 12 ? "middle" : "senior";

  const flags = { vakCompleted, hasUploadedSchedule, hasGrades };

  // Current step = first incomplete step at or after onboardingStep
  const currentIndex = (() => {
    for (let i = onboardingStep; i < STEPS.length; i++) {
      if (!flags[STEPS[i].flag]) return i;
    }
    return STEPS.length; // all done
  })();

  const isDone = currentIndex >= STEPS.length;

  const handleGo = (tab) => {
    if (onTabChange) onTabChange(tab);
    // Don't advance step here — the flag will update when user completes
  };

  const handleSkip = () => {
    const next = currentIndex + 1;
    if (next >= STEPS.length) {
      setOnboardingComplete(true);
    } else {
      setOnboardingStep(next);
    }
  };

  const handleClose = () => {
    setOnboardingComplete(true);
  };

  // Auto-complete when all flags are true
  if (isDone && show) {
    setOnboardingComplete(true);
    return null;
  }

  const step = STEPS[currentIndex] ?? null;

  return (
    <AnimatePresence>
      {show && step && (
        <motion.div
          key={`wizard-step-${currentIndex}`}
          className="fixed inset-0 z-[75] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Cerrar wizard"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>

            {/* Progress bar */}
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center gap-1 mb-1">
                {STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      i < currentIndex
                        ? "bg-[#06D6A0]"
                        : i === currentIndex
                          ? "bg-[#0096C7]"
                          : "bg-gray-200 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-right">
                Paso {currentIndex + 1} de {STEPS.length}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-4 text-center">
              <motion.div
                className="text-5xl mb-4"
                key={step.icon}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {step.icon}
              </motion.div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.messages[ageGroup]}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleGo(step.tab)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0096C7] to-[#06D6A0] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
              >
                {step.cta}
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/20 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Omitir por ahora
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

OnboardingWizard.displayName = "OnboardingWizard";

export default OnboardingWizard;
