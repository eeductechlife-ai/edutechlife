import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, CheckCircle } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Bienvenido a SmartBoard",
    description:
      "Tu plataforma de aprendizaje adaptativo. ¡Descubre cómo aprendes mejor!",
    highlight: "center",
    duration: 5,
  },
  {
    id: "dani",
    title: "Conoce a Dani",
    description:
      "Tu tutor IA disponible 24/7. Dani responde tus preguntas, explica conceptos y se adapta a tu estilo de aprendizaje.",
    highlight: "dani-fab",
    target: "dani-fab-button",
    duration: 7,
  },
  {
    id: "missions",
    title: "Misiones Diarias",
    description:
      "Completa desafíos personalizados cada día. Gana puntos, sube de nivel y desbloqueá recompensas.",
    highlight: "missions",
    target: "missions-tab",
    duration: 6,
  },
  {
    id: "vak",
    title: "Diagnóstico VAK",
    description:
      "Descubre tu estilo de aprendizaje (Visual, Auditivo o Kinestésico). SmartBoard se adapta solo para ti.",
    highlight: "vak",
    target: "vak-tab",
    duration: 6,
  },
  {
    id: "progress",
    title: "Monitorea tu Progreso",
    description:
      "Visualiza tu crecimiento académico. Aprende cuáles son tus fortalezas y áreas de mejora.",
    highlight: "progress",
    target: "progress-tab",
    duration: 5,
  },
  {
    id: "complete",
    title: "¡Listo para comenzar!",
    description:
      "Ya estás preparado. Explora, aprende y diviértete. Tu tutor Dani está siempre disponible.",
    highlight: "center",
    duration: 4,
  },
];

const OnboardingOverlay = ({ step, isHighlighting }) => {
  if (!isHighlighting || !step.target) return null;

  const element = document.getElementById(step.target);
  if (!element) return null;

  const rect = element.getBoundingClientRect();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-40"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Spotlight effect around target */}
      <motion.div
        className="absolute border-2 border-blue-400 rounded-lg"
        style={{
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.7)",
            "0 0 0 10px rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

const OnboardingGuide = memo(() => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ONBOARDING_STEPS[0].duration);

  const step = ONBOARDING_STEPS[currentStep];

  // Check if onboarding already completed
  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (completed) {
      setHasCompleted(true);
    } else {
      // Show onboarding after a small delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  // Timer for auto-advance
  useEffect(() => {
    if (!isVisible || hasCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep((s) => s + 1);
            return ONBOARDING_STEPS[currentStep + 1].duration;
          } else {
            handleComplete();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, currentStep, hasCompleted]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      setTimeLeft(ONBOARDING_STEPS[currentStep + 1].duration);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setIsVisible(false);
    setHasCompleted(true);
  };

  if (!isVisible || hasCompleted) return null;

  return (
    <>
      <OnboardingOverlay
        step={step}
        isHighlighting={step.highlight === "dani-fab"}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto"
          onClick={() => {}}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Card */}
          <motion.div
            className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 max-w-md shadow-2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} className="text-gray-600" />
            </button>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  {step.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="flex gap-1">
                {ONBOARDING_STEPS.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`h-1 rounded-full transition-all ${
                      idx === currentStep
                        ? "bg-blue-500"
                        : idx < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300"
                    }`}
                    animate={{ flex: idx === currentStep ? 1.2 : 1 }}
                  />
                ))}
              </div>

              {/* Time indicator */}
              <div className="text-sm text-gray-600 flex items-center justify-between">
                <span>
                  Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
                </span>
                <span className="font-mono text-blue-600">{timeLeft}s</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 px-4 py-2 rounded-lg text-gray-700 hover:bg-white/50 transition-colors text-sm font-medium"
                >
                  Omitir
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? (
                    <>
                      <CheckCircle size={16} />
                      Comenzar
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
});

OnboardingGuide.displayName = "OnboardingGuide";

export default OnboardingGuide;
