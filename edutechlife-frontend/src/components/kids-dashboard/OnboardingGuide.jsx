import { memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";

const FEATURES = [
  { icon: "🧠", label: "VAK", desc: "Descubre tu estilo de aprendizaje" },
  { icon: "📅", label: "Horario", desc: "Organiza tu semana escolar" },
  {
    icon: "📊",
    label: "Calificaciones",
    desc: "Monitorea tu progreso académico",
  },
  { icon: "🃏", label: "Educards", desc: "Repasa con tarjetas inteligentes" },
  { icon: "💬", label: "Habla con Dani", desc: "Tu tutor IA disponible 24/7" },
];

const WELCOME_TEXT = {
  early:
    "¡Hola! Soy Dani 🤖 ¡Tu amigo robot! Aquí aprenderás cosas increíbles. ¡Empecemos!",
  middle:
    "¡Hola! Soy Dani, tu tutor IA. En SmartBoard vas a aprender con tecnología, organizar tu horario y mejorar tus notas. ¡Vamos!",
  senior:
    "Bienvenido/a a SmartBoard. Soy Dani, tu asistente IA. Aquí organizarás tu estudio, analizarás tus calificaciones y te prepararás para el futuro tecnológico.",
};

const OnboardingGuide = memo(({ onTabChange }) => {
  const {
    onboardingComplete,
    hasSeenWelcome,
    setHasSeenWelcome,
    setOnboardingComplete,
    studentAge,
  } = useSmartBoardKids();

  const show = !onboardingComplete && !hasSeenWelcome;

  const trackedRef = useRef(false);
  useEffect(() => {
    if (show && !trackedRef.current) {
      trackedRef.current = true;
      track(EVENTS.ONBOARDING_STARTED, {});
    }
  }, [show]);

  const ageGroup =
    studentAge <= 8 ? "early" : studentAge <= 12 ? "middle" : "senior";

  const welcomeText = WELCOME_TEXT[ageGroup] ?? WELCOME_TEXT.middle;

  const handleStart = () => {
    setHasSeenWelcome(true);
    if (onTabChange) onTabChange("vak");
  };

  const handleExplore = () => {
    setOnboardingComplete(true);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="onboarding-welcome"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleExplore}
          />

          {/* Card */}
          <motion.div
            className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close */}
            <button
              onClick={handleExplore}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>

            {/* Header gradient */}
            <div className="bg-gradient-to-br from-[#0096C7] to-[#06D6A0] px-6 pt-8 pb-6 text-center">
              <motion.div
                className="text-6xl mb-3"
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🤖
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">
                ¡Bienvenido/a a SmartBoard!
              </h2>
              <p className="text-white/90 text-sm leading-relaxed">
                {welcomeText}
              </p>
            </div>

            {/* Features */}
            <div className="px-6 py-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                ¿Qué puedes hacer aquí?
              </p>
              <ul className="space-y-2">
                {FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center flex-shrink-0">
                      {f.icon}
                    </span>
                    <div>
                      <span className="font-semibold text-sm text-gray-800 dark:text-white">
                        {f.label}
                      </span>{" "}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        — {f.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStart}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0096C7] to-[#06D6A0] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
              >
                ¡Empezar mi diagnóstico VAK!
              </button>
              <button
                onClick={handleExplore}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Explorar primero
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

OnboardingGuide.displayName = "OnboardingGuide";

export default OnboardingGuide;
