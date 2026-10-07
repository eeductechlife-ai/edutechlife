import { memo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

  const reduceMotion = useReducedMotion();
  const startRef = useRef(null);

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

  // Escape cierra la bienvenida y el foco arranca en la acción principal.
  useEffect(() => {
    if (!show) return undefined;
    startRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOnboardingComplete(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, setOnboardingComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="onboarding-welcome"
          className="fixed inset-0 z-[80] flex items-center justify-center px-3 sm:px-4"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleExplore}
            aria-hidden="true"
          />

          {/* Card: nunca más alta que la pantalla; el contenido se desplaza y
              las acciones quedan siempre a la vista. */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            className="relative flex flex-col w-full max-w-sm max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleExplore}
              className="absolute top-2 right-2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Cerrar"
            >
              <X size={20} className="text-white" aria-hidden="true" />
            </button>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {/* Header — IngenIA navy */}
              <div
                className="px-5 pt-7 pb-5 sm:px-6 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #004B63 0%, #0A2540 100%)",
                }}
              >
                {/* Dani brand avatar */}
                <motion.div
                  className="mx-auto mb-3 flex items-center justify-center rounded-full"
                  style={{
                    width: 68,
                    height: 68,
                    background:
                      "radial-gradient(circle at 35% 30%, #1E3F73 0%, #0B1D3A 70%)",
                    boxShadow:
                      "0 0 0 3px rgba(111,240,255,0.4), 0 6px 20px rgba(3,10,30,0.45)",
                  }}
                  animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <DaniCharacter
                    size={60}
                    mood="happy"
                    animated={!reduceMotion}
                    title="Dani"
                  />
                </motion.div>

                <h2
                  id="onboarding-title"
                  className="!m-0 text-xl font-bold text-white mb-1.5"
                >
                  ¡Bienvenido/a a IngenIA!
                </h2>
                <p className="!m-0 text-white/90 text-[15px] leading-relaxed">
                  {welcomeText}
                </p>
              </div>

              {/* Features */}
              <div className="px-5 py-4">
                <h3 className="!m-0 text-xs font-bold text-[#004B63]/75 uppercase tracking-wider mb-3">
                  ¿Qué puedes hacer aquí?
                </h3>
                <ul className="space-y-3 p-0 m-0 list-none">
                  {FEATURES.map((f) => (
                    <li key={f.label} className="flex items-start gap-3">
                      <span
                        className="text-xl w-8 text-center flex-shrink-0 leading-6"
                        aria-hidden="true"
                      >
                        {f.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="!m-0 font-semibold text-[15px] leading-5 text-[#004B63]">
                          {f.label}
                        </p>
                        <p className="!m-0 text-[13px] leading-snug text-slate-600">
                          {f.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions: siempre visibles */}
            <div className="shrink-0 px-5 pt-3 pb-4 flex flex-col gap-2.5 border-t border-slate-100 bg-white">
              <button
                ref={startRef}
                type="button"
                onClick={handleStart}
                className="w-full min-h-[48px] px-3 rounded-xl text-white font-bold text-[15px] leading-tight hover:opacity-90 active:scale-95 transition-all shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004B63]"
                style={{ background: "#C2410C" }}
              >
                ¡Descubrir mi estilo de aprendizaje!
              </button>
              <button
                type="button"
                onClick={handleExplore}
                className="w-full min-h-[44px] rounded-xl border-2 border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
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
