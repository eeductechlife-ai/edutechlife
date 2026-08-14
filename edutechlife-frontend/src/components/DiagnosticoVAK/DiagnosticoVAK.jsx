import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useDiagnosticoVAK from "./useDiagnosticoVAK";
import { getIconComponent } from "./getIconComponent";
import { Confetti, Celebration } from "./vakComponents";
import ValeriaControls from "./ValeriaControls";
import VakSkeleton from "./VakSkeleton";
import VakError from "./VakError";
import DocumentPreviewScreen from "./screens/DocumentPreviewScreen";
import renderWelcome from "./screens/renderWelcome";
import renderCalibration from "./screens/renderCalibration";
import renderTest from "./screens/renderTest";
import renderParentData from "./screens/renderParentData";
import renderResults from "./screens/renderResults";
import "./DiagnosticoVAK.css";

const DiagnosticoVAK = ({ onNavigate }) => {
  const {
    t,
    phase,
    setPhase,
    studentName,
    setStudentName,
    studentAge,
    setStudentAge,
    studentEmail,
    setStudentEmail,
    studentPhone,
    setStudentPhone,
    studentMood,
    setStudentMood,
    currentQuestion,
    setCurrentQuestion,
    setAnswers,
    diagnosis,
    setDiagnosis,
    error,
    setError,
    pdfLoading,
    emailError,
    setEmailError,
    ageError,
    setAgeError,
    elapsedTime,
    showConfetti,
    showCelebration,
    highContrast,
    showSaveIndicator,
    isTransitioning,
    valeriaEnabled,
    setValeriaEnabled,
    valeriaVolume,
    valentinaIntroComplete,
    setValentinaIntroComplete,
    feedbackPending,
    showFeedbackButton,
    parentName,
    setParentName,
    parentPhone,
    setParentPhone,
    parentEmail,
    setParentEmail,
    habeasDataAccepted,
    setHabeasDataAccepted,
    showHabeasModal,
    setShowHabeasModal,
    moodFeedbackText,
    showMoodFeedback,
    ageQuestions,
    chartRef,
    isValentinaSpeaking,
    valeriaExpression,
    setHookVolume,
    readQuestionWithOptions,
    startTest,
    submitCalibration,
    handleFeedbackClick,
    handleAnswer,
    handleMoodSelect,
    handleParentSubmit,
    toggleHighContrast,
    generatePDF,
  } = useDiagnosticoVAK({ onNavigate });

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

      <AnimatePresence>
        {showSaveIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[calc(env(safe-area-inset-top,0px)+76px)] right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-green-400"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              {t("vak.ui.save_indicator")} ✓
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleHighContrast}
        className="fixed top-[calc(env(safe-area-inset-top,0px)+76px)] left-4 z-50 p-3 bg-white rounded-full shadow-lg border-2 border-[var(--color-gray-200)] hover:border-[var(--color-corporate)] transition-all"
        title={t("vak.ui.accessibility_title")}
        aria-label={t("vak.ui.accessibility_label")}
      >
        {highContrast ? (
          <svg
            className="w-6 h-6 text-[var(--color-petroleum)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-[var(--color-gray-500)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        )}
      </button>

      <ValeriaControls
        valeriaEnabled={valeriaEnabled}
        setValeriaEnabled={setValeriaEnabled}
        valeriaVolume={valeriaVolume}
        setValeriaVolume={setHookVolume}
        isSpeaking={isValentinaSpeaking}
        valeriaExpression={valeriaExpression}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(77, 168, 196, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(77, 168, 196, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "perspective(800px) rotateX(65deg)",
            transformOrigin: "center top",
            backgroundPosition: "center center",
          }}
        ></div>

        <div
          className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full animate-orb-1 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(77, 168, 196, 0.6) 0%, rgba(77, 168, 196, 0.2) 40%, transparent 70%)",
            filter: "blur(60px)",
            transform: "translateZ(100px)",
          }}
        ></div>

        <div
          className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full animate-orb-2 opacity-25"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, rgba(102, 204, 204, 0.5) 0%, rgba(102, 204, 204, 0.15) 40%, transparent 70%)",
            filter: "blur(50px)",
            transform: "translateZ(80px)",
            animationDelay: "1.5s",
          }}
        ></div>

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-orb-3 opacity-20"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0, 194, 224, 0.4) 0%, rgba(0, 194, 224, 0.1) 30%, transparent 60%)",
            filter: "blur(70px)",
            transform: "translateZ(50px)",
            animationDelay: "3s",
          }}
        ></div>

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-full animate-float-3d"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
              boxShadow: "0 0 20px rgba(77, 168, 196, 0.5)",
              transform: `translateZ(${Math.random() * 100}px)`,
            }}
          />
        ))}

        <div className="absolute inset-0">
          <svg className="w-full h-full" style={{ opacity: 0.1 }}>
            <defs>
              <linearGradient
                id="line-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4DA8C4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#66CCCC" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {[...Array(8)].map((_, i) => {
              const x1 = 10 + Math.random() * 80;
              const y1 = 10 + Math.random() * 80;
              const x2 = 10 + Math.random() * 80;
              const y2 = 10 + Math.random() * 80;
              return (
                <line
                  key={i}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="url(#line-gradient)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="20"
                    dur={`${3 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}
          </svg>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8FAFC]/30 backdrop-blur-[1px]"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 md:p-6"
        >
          {error ? (
            <VakError
              onRestart={() => {
                setError(null);
                setPhase("intro");
              }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, x: 50, rotateY: -10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: 10 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                className="perspective-1000"
              >
                {phase === "intro" &&
                  renderWelcome({ t, valentinaIntroComplete, startTest })}
                {phase === "calibration" &&
                  renderCalibration({
                    t,
                    studentName,
                    setStudentName,
                    studentAge,
                    setStudentAge,
                    ageError,
                    setAgeError,
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
                  (isTransitioning ? (
                    <VakSkeleton />
                  ) : (
                    renderTest({
                      t,
                      currentQuestion,
                      ageQuestions,
                      isValentinaSpeaking,
                      feedbackPending,
                      showFeedbackButton,
                      handleAnswer,
                      handleFeedbackClick,
                      elapsedTime,
                      readQuestionWithOptions,
                      getIconComponent,
                    })
                  ))}
                {phase === "parentdata" &&
                  renderParentData({
                    t,
                    parentName,
                    setParentName,
                    parentPhone,
                    setParentPhone,
                    parentEmail,
                    setParentEmail,
                    emailError,
                    setEmailError,
                    onSubmit: handleParentSubmit,
                  })}
                {phase === "result" &&
                  renderResults({
                    t,
                    diagnosis,
                    studentMood,
                    elapsedTime,
                    onGeneratePDF: generatePDF,
                    pdfLoading,
                    onViewDocument: () => setPhase("document-preview"),
                    onReset: () => {
                      setPhase("intro");
                      setStudentName("");
                      setStudentAge("");
                      setStudentMood("");
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setDiagnosis(null);
                      setError(null);
                      setHabeasDataAccepted(false);
                      setValentinaIntroComplete(false);
                    },
                    onGoHome: () => (window.location.href = "/"),
                    getIconComponent,
                    chartRef,
                  })}
                {phase === "document-preview" && (
                  <DocumentPreviewScreen
                    diagnosis={diagnosis}
                    studentName={studentName}
                    studentAge={studentAge}
                    studentEmail={studentEmail}
                    studentMood={studentMood}
                    parentName={parentName}
                    parentPhone={parentPhone}
                    parentEmail={parentEmail}
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
