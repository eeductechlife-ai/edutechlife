import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { GRADE_OPTIONS } from "../../../data/curriculum/curriculumHelper";

// Step 0 is inline (no tab navigation) — captures grade + school.
// Steps 1-3 navigate to their respective tabs.
const NAV_STEPS = [
  {
    tab: "vak",
    icon: "🧠",
    title: "Diagnóstico VAK",
    messages: {
      early: "¡Descubramos cómo aprendes mejor! Solo 2 minutitos 🌟",
      middle: "Hagamos tu diagnóstico de estilo de aprendizaje (2 min)",
      senior: "Identifica tu estilo de aprendizaje para optimizar tu estudio",
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
      middle: "Sube tu horario para organizarte mejor",
      senior: "Carga tu horario para recibir recordatorios personalizados",
    },
    cta: "Subir horario",
    flag: "hasUploadedSchedule",
  },
  {
    tab: "calificaciones",
    icon: "📊",
    title: "Tus Calificaciones",
    messages: {
      early: "¿Cuáles son tus notas? ¡Así vemos en qué podemos ayudarte! ⭐",
      middle: "Ingresa tus calificaciones para analizar tu rendimiento",
      senior: "Registra tus calificaciones para recomendaciones personalizadas",
    },
    cta: "Ingresar notas",
    flag: "hasGrades",
  },
];

// Inline step: school + grade capture (index = -1, shown before NAV_STEPS)
function GradeStep({ ageGroup, onDone }) {
  const { setGradeLevel, setCountryCode, setSchoolName } = useSmartBoardKids();
  const [grade, setGrade] = useState(null);
  const [school, setSchool] = useState("");

  const LEVEL_BG = {
    "Básica Primaria":
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    "Básica Secundaria":
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    "Media Vocacional":
      "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
  };

  const messages = {
    early: "¡Cuéntame un poco sobre ti! 🎒",
    middle: "Primero, cuéntame sobre tu colegio:",
    senior: "Para personalizar tu plan, necesito saber tu grado:",
  };

  function handleConfirm() {
    if (!grade) return;
    setGradeLevel(grade);
    setCountryCode("CO");
    if (school.trim()) setSchoolName(school.trim());
    onDone({ grade, school });
  }

  return (
    <div className="px-6 py-4">
      <div className="text-4xl text-center mb-3">🏫</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 text-center">
        {messages[ageGroup]}
      </h3>

      {/* School name — optional */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
          Nombre de tu colegio (opcional)
        </label>
        <input
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Ej: Colegio San José"
          className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#0096C7]"
        />
      </div>

      {/* Grade grid */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
          ¿En qué grado estás? *
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {GRADE_OPTIONS.map((o) => {
            const sel = grade === o.value;
            return (
              <button
                key={o.value}
                onClick={() => setGrade(o.value)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-all ${
                  sel
                    ? "border-[#0096C7] bg-[#0096C7] text-white shadow-md scale-105"
                    : `border-gray-200 dark:border-white/10 hover:border-[#0096C7]/50 ${LEVEL_BG[o.level] ?? ""}`
                }`}
              >
                <span
                  className={`font-bold text-sm ${sel ? "text-white" : "text-gray-800 dark:text-white"}`}
                >
                  {o.value}°
                </span>
                <span
                  className={`text-[9px] leading-tight ${sel ? "text-white/80" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {o.level.replace("Básica ", "").replace(" Vocacional", "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!grade}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          grade
            ? "bg-gradient-to-r from-[#0096C7] to-[#06D6A0] text-white hover:opacity-90 shadow-md"
            : "bg-gray-100 dark:bg-white/10 text-gray-400 cursor-not-allowed"
        }`}
      >
        {grade ? `¡Soy de ${grade}°! Continuar →` : "Selecciona tu grado"}
      </button>
    </div>
  );
}

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
    gradeLevel,
  } = useSmartBoardKids();

  // gradeDone = either already captured (gradeLevel in context) or skipped
  const [gradeDone, setGradeDone] = useState(!!gradeLevel);

  const show = hasSeenWelcome && !onboardingComplete && onboardingStep < 3;

  const ageGroup =
    studentAge <= 8 ? "early" : studentAge <= 12 ? "middle" : "senior";

  const flags = { vakCompleted, hasUploadedSchedule, hasGrades };

  // Phase: 0 = grade inline step, 1+ = NAV_STEPS
  const isGradePhase = !gradeDone;

  const navIndex = (() => {
    for (let i = onboardingStep; i < NAV_STEPS.length; i++) {
      if (!flags[NAV_STEPS[i].flag]) return i;
    }
    return NAV_STEPS.length;
  })();

  const isDone = gradeDone && navIndex >= NAV_STEPS.length;

  const handleGo = (tab) => {
    if (onTabChange) onTabChange(tab);
  };

  const handleSkip = () => {
    const next = navIndex + 1;
    if (next >= NAV_STEPS.length) {
      setOnboardingComplete(true);
    } else {
      setOnboardingStep(next);
    }
  };

  const handleClose = () => setOnboardingComplete(true);

  if (isDone && show) {
    setOnboardingComplete(true);
    return null;
  }

  // Total steps count: grade step + nav steps
  const totalSteps = 1 + NAV_STEPS.length;
  const currentStepNum = isGradePhase ? 0 : 1 + navIndex;
  const step = isGradePhase ? null : (NAV_STEPS[navIndex] ?? null);

  return (
    <AnimatePresence>
      {show && (isGradePhase || step) && (
        <motion.div
          key={`wizard-step-${currentStepNum}`}
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
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      i < currentStepNum
                        ? "bg-[#06D6A0]"
                        : i === currentStepNum
                          ? "bg-[#0096C7]"
                          : "bg-gray-200 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-right">
                Paso {currentStepNum + 1} de {totalSteps}
              </p>
            </div>

            {/* Grade inline step */}
            {isGradePhase && (
              <GradeStep
                ageGroup={ageGroup}
                onDone={() => setGradeDone(true)}
              />
            )}

            {/* Navigation steps */}
            {!isGradePhase && step && (
              <>
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
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

OnboardingWizard.displayName = "OnboardingWizard";
export default OnboardingWizard;
