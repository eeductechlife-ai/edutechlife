import { memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useIngenIAKids } from "../../context/IngenIAKidsContext";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";
import DaniCharacter from "./dani/DaniCharacter";

const FEATURES = [
  {
    icon: "🧠",
    label: "ADN de Aprendizaje",
    desc: "Descubre cómo aprendes mejor",
  },
  { icon: "📚", label: "Aprender", desc: "Materias con material a tu ritmo" },
  {
    icon: "🎮",
    label: "Practicar",
    desc: "Retos y ejercicios para subir notas",
  },
  { icon: "🎯", label: "Misiones", desc: "Gana XP completando desafíos" },
  { icon: "💬", label: "Habla con Dani", desc: "Tu tutora IA disponible 24/7" },
];

const WELCOME_TEXT = {
  early:
    "¡Hola! Soy Dani, tu tutora en IngenIA. ¡Aquí aprenderás cosas increíbles jugando y ganando puntos!",
  middle:
    "¡Hola! Soy Dani, tu tutora IA. Aquí practicarás tus materias, ganarás misiones y mejorarás tus notas. ¡Vamos!",
  senior:
    "Hola, soy Dani, tu asistente IA. En IngenIA organizarás tu estudio, practicarás por materia y te prepararás para el futuro.",
};

const OnboardingGuide = memo(({ onTabChange }) => {
  const {
    onboardingComplete,
    hasSeenWelcome,
    setHasSeenWelcome,
    setOnboardingComplete,
    studentAge,
  } = useIngenIAKids();

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
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close */}
            <button
              onClick={handleExplore}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} className="text-white" />
            </button>

            {/* Header — IngenIA navy */}
            <div
              className="px-6 pt-8 pb-6 text-center"
              style={{
                background: "linear-gradient(135deg, #004B63 0%, #0A2540 100%)",
              }}
            >
              {/* Dani brand avatar */}
              <motion.div
                className="mx-auto mb-4 flex items-center justify-center rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  background:
                    "radial-gradient(circle at 35% 30%, #1E3F73 0%, #0B1D3A 70%)",
                  boxShadow:
                    "0 0 0 3px rgba(111,240,255,0.4), 0 6px 20px rgba(3,10,30,0.45)",
                }}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <DaniCharacter size={72} mood="happy" animated title="Dani" />
              </motion.div>

              <h2 className="text-lg font-bold text-white mb-1">
                ¡Bienvenido/a a IngenIA!
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                {welcomeText}
              </p>
            </div>

            {/* Features */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold text-[#004B63]/60 uppercase tracking-widest mb-3">
                ¿Qué puedes hacer aquí?
              </p>
              <ul className="space-y-2.5">
                {FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <span className="text-lg w-7 text-center flex-shrink-0">
                      {f.icon}
                    </span>
                    <div className="min-w-0">
                      <span className="font-semibold text-sm text-[#004B63]">
                        {f.label}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        — {f.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex flex-col gap-2.5 pt-1">
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
                style={{ background: "#FB8500" }}
              >
                ¡Descubrir mi estilo de aprendizaje!
              </button>
              <button
                onClick={handleExplore}
                className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
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
