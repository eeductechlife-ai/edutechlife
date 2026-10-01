import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Contrast } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDiagnosticoVAK from "./useDiagnosticoVAK";
import { getQuestionsByAge } from "../../data/vakQuestions";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";
import { Confetti, Celebration } from "./vakComponents";
import ValeriaControls from "./ValeriaControls";
import VakError from "./VakError";
import DocumentPreviewScreen from "./screens/DocumentPreviewScreen";
import renderWelcome from "./screens/renderWelcome";
import renderCalibration from "./screens/renderCalibration";
import renderTest from "./screens/renderTest";
import renderResults from "./screens/renderResults";
import { getIconComponent } from "./getIconComponent";
import "./DiagnosticoVAK.css";

const DiagnosticoVAK = ({ onNavigate }) => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const {
    t,
    phase,
    setPhase,
    studentName,
    setStudentName,
    studentAge,
    setStudentAge,
    studentMood,
    parentName,
    setParentName,
    currentQuestion,
    answers,
    diagnosis,
    error,
    setError,
    pdfLoading,
    showConfetti,
    showCelebration,
    highContrast,
    valeriaEnabled,
    setValeriaEnabled,
    valeriaVolume,
    habeasDataAccepted,
    setHabeasDataAccepted,
    showHabeasModal,
    setShowHabeasModal,
    moodFeedbackText,
    showMoodFeedback,
    ageQuestions,
    isValentinaSpeaking,
    valeriaExpression,
    resumeOffer,
    startTest,
    submitCalibration,
    handleAnswer,
    goBack,
    handleMoodSelect,
    listenToQuestion,
    resumeProgress,
    discardProgress,
    resetAll,
    toggleHighContrast,
    setHookVolume,
    generatePDF,
  } = useDiagnosticoVAK({ onNavigate });

  const practiceInIngenIA = () => {
    track(EVENTS.VAK_RESULT_CTA, {
      target: "ingenia",
      dominant_style: diagnosis?.predominantStyle,
    });
    navigate("/conoce-ingenia");
  };

  const viewReport = () => {
    track(EVENTS.VAK_REPORT_VIEWED, {
      dominant_style: diagnosis?.predominantStyle,
    });
    setPhase("document-preview");
  };

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] pt-[calc(env(safe-area-inset-top,0px)+88px)] pb-6 md:pb-10 px-3 md:px-4 relative overflow-hidden font-sans antialiased ${highContrast ? "high-contrast-mode" : ""}`}
      style={
        highContrast
          ? {
              "--color-petroleum": "#000000",
              "--color-corporate": "#000000",
              "--color-gray-100": "#ffffff",
              "--color-gray-200": "#cccccc",
              "--color-gray-700": "#000000",
              "--color-gray-500": "#333333",
              filter: "contrast(1.3)",
            }
          : {}
      }
    >
      <Confetti active={showConfetti} />
      <Celebration
        active={showCelebration}
        styleName={diagnosis?.styleDetails?.name || ""}
      />

      <ValeriaControls
        valeriaEnabled={valeriaEnabled}
        setValeriaEnabled={setValeriaEnabled}
        valeriaVolume={valeriaVolume}
        setValeriaVolume={setHookVolume}
        isSpeaking={isValentinaSpeaking}
        valeriaExpression={valeriaExpression}
      />

      {/* Fondo liviano: en pantallas pequeñas solo queda el color plano. */}
      <div
        className="hidden md:block fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div
          className="absolute top-[10%] left-[10%] w-[360px] h-[360px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(77, 168, 196, 0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[15%] right-[10%] w-[320px] h-[320px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, rgba(102, 204, 204, 0.5) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            title={t("vak.ui.accessibility_title")}
            className="min-h-[40px] px-3 rounded-full bg-white border-2 border-[#B2D8E5] text-[#004B63] text-sm font-semibold flex items-center gap-2"
          >
            <Contrast size={18} strokeWidth={2.5} aria-hidden="true" />
            {t("vak.ui.high_contrast")}
          </button>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 md:p-6"
        >
          {error ? (
            <VakError
              onRestart={() => {
                setError(null);
                resetAll();
              }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                {phase === "intro" &&
                  renderWelcome({
                    t,
                    startTest,
                    resumeOffer,
                    resumeProgress,
                    discardProgress,
                    questionsTotal: resumeOffer
                      ? getQuestionsByAge(resumeOffer.studentAge).length
                      : 0,
                  })}
                {phase === "calibration" &&
                  renderCalibration({
                    t,
                    studentName,
                    setStudentName,
                    studentAge,
                    setStudentAge,
                    studentMood,
                    habeasDataAccepted,
                    setHabeasDataAccepted,
                    showHabeasModal,
                    setShowHabeasModal,
                    showMoodFeedback,
                    moodFeedbackText,
                    handleMoodSelect,
                    submitCalibration,
                  })}
                {phase === "test" &&
                  renderTest({
                    t,
                    currentQuestion,
                    ageQuestions,
                    answers,
                    studentAge,
                    isValentinaSpeaking,
                    handleAnswer,
                    goBack,
                    listenToQuestion,
                  })}
                {phase === "result" &&
                  renderResults({
                    t,
                    diagnosis,
                    parentName,
                    setParentName,
                    onViewDocument: viewReport,
                    onReset: resetAll,
                    onPractice: practiceInIngenIA,
                    reduceMotion,
                  })}
                {phase === "document-preview" && (
                  <DocumentPreviewScreen
                    diagnosis={diagnosis}
                    studentName={studentName}
                    studentAge={studentAge}
                    studentMood={studentMood}
                    parentName={parentName}
                    generatePDF={generatePDF}
                    pdfLoading={pdfLoading}
                    onBack={() => setPhase("result")}
                    getIconComponent={getIconComponent}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticoVAK;
