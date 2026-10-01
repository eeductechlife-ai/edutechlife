import { useEffect, useState, useRef } from "react";
import { useStudent } from "../../../context/StudentContext";
import { useTranslation } from "../../../i18n/I18nProvider";
import useValentinaAgent from "../../../hooks/useValentinaAgent";
import { getQuestionsByAge, getVakMode } from "../../../data/vakQuestions";
import { VALENTINA_MESSAGES, warmupTts } from "../vakVoice";
import { safeStorage } from "../../../utils/storage";
import { useSupabase } from "../../../hooks/useSupabase";
import { useNavigationHandlers } from "./navigation";
import {
  STORAGE_KEY,
  PROGRESS_TTL_MS,
  VALENTINA_RESULT_DELAY_MS,
} from "./constants";

const isTypingTarget = (el) =>
  !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");

export default function useDiagnosticoVAK({ onNavigate }) {
  const { t } = useTranslation();
  const { clearStudentInfo } = useStudent();
  const { supabase, userId } = useSupabase();

  const [phase, setPhase] = useState("intro");
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentMood, setStudentMood] = useState("");
  const [parentName, setParentName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [resumeOffer, setResumeOffer] = useState(null);

  const [valeriaEnabled, setValeriaEnabled] = useState(true);
  const [valeriaVolume] = useState(1.0);

  const [habeasDataAccepted, setHabeasDataAccepted] = useState(false);
  const [showHabeasModal, setShowHabeasModal] = useState(false);

  const [moodFeedbackText, setMoodFeedbackText] = useState("");
  const [showMoodFeedback, setShowMoodFeedback] = useState(false);

  const [ageQuestions, setAgeQuestions] = useState(() => getQuestionsByAge(12));

  const chartRef = useRef(null);
  const timeoutRefs = useRef([]);

  const setTimeoutSafe = (fn, delay) => {
    const id = setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter((tid) => tid !== id);
      fn();
    }, delay);
    timeoutRefs.current.push(id);
    return id;
  };

  const {
    isValentinaSpeaking,
    valeriaExpression,
    setValeriaVolume: setHookVolume,
    readQuestionWithOptions,
    speakAsValentina,
    stopSpeaking,
  } = useValentinaAgent({
    studentAge: parseInt(studentAge) || 12,
    enabled: valeriaEnabled,
  });

  useEffect(() => {
    warmupTts();
    // Versiones anteriores dejaban nombre, edad y resultado guardados en el
    // navegador; en equipos compartidos eso lo vería la siguiente persona.
    clearStudentInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Una prueba a medias solo se ofrece retomar si es reciente.
  useEffect(() => {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      const fresh =
        parsed.lastUpdate && Date.now() - parsed.lastUpdate < PROGRESS_TTL_MS;
      if (parsed.phase === "test" && fresh && Array.isArray(parsed.answers)) {
        setResumeOffer(parsed);
      } else {
        safeStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      safeStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // El progreso solo se guarda durante las preguntas y se borra al terminar.
  useEffect(() => {
    if (phase === "test") {
      safeStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          phase,
          studentName,
          studentAge,
          studentMood,
          currentQuestion,
          answers,
          startTime,
          lastUpdate: Date.now(),
        }),
      );
    } else if (phase === "result" || phase === "document-preview") {
      safeStorage.removeItem(STORAGE_KEY);
    }
  }, [
    phase,
    studentName,
    studentAge,
    studentMood,
    currentQuestion,
    answers,
    startTime,
  ]);

  useEffect(
    () => () => {
      timeoutRefs.current.forEach((id) => clearTimeout(id));
      timeoutRefs.current = [];
    },
    [],
  );

  // Valeria lee la pregunta, pero nunca bloquea las respuestas.
  useEffect(() => {
    if (phase !== "test" || !valeriaEnabled) return undefined;
    const q = ageQuestions[currentQuestion];
    if (!q) return undefined;
    readQuestionWithOptions(
      `${q.context} ${q.text}`,
      q.options,
      currentQuestion + 1,
      ageQuestions.length,
    );
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, phase, valeriaEnabled, ageQuestions]);

  useEffect(() => {
    if (phase === "result" && valeriaEnabled && diagnosis) {
      const timer = setTimeout(async () => {
        await speakAsValentina(
          VALENTINA_MESSAGES.all.resultsShort(
            diagnosis.studentName || studentName || "Estudiante",
            diagnosis.predominantStyle || "visual",
          ),
        );
      }, VALENTINA_RESULT_DELAY_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, valeriaEnabled, diagnosis]);

  const clearProgress = () => safeStorage.removeItem(STORAGE_KEY);

  const toggleHighContrast = () => setHighContrast((v) => !v);

  const {
    startTest,
    submitCalibration,
    handleAnswer,
    goBack,
    handleMoodSelect,
  } = useNavigationHandlers({
    studentName,
    studentAge,
    studentMood,
    currentQuestion,
    answers,
    ageQuestions,
    startTime,
    parentName,
    supabase,
    userId,
    setPhase,
    setStartTime,
    setAgeQuestions,
    setCurrentQuestion,
    setAnswers,
    setShowConfetti,
    setShowCelebration,
    setDiagnosis,
    setError,
    setShowMoodFeedback,
    setMoodFeedbackText,
    setStudentMood,
    setValeriaEnabled,
    setTimeoutSafe,
    stopSpeaking,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        toggleHighContrast();
        return;
      }
      if (e.key === "Escape" && onNavigate) {
        onNavigate("neuroentorno");
        return;
      }
      if (phase === "test" && !isTypingTarget(e.target)) {
        const option =
          ageQuestions[currentQuestion]?.options[Number(e.key) - 1];
        if (option) {
          e.preventDefault();
          handleAnswer(option);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQuestion, ageQuestions, answers, onNavigate]);

  const listenToQuestion = () => {
    const q = ageQuestions[currentQuestion];
    if (!q) return;
    if (!valeriaEnabled) {
      // Al activar la voz, el efecto de lectura dice la pregunta.
      setValeriaEnabled(true);
      return;
    }
    readQuestionWithOptions(
      `${q.context} ${q.text}`,
      q.options,
      currentQuestion + 1,
      ageQuestions.length,
    );
  };

  const resumeProgress = () => {
    if (!resumeOffer) return;
    const age = parseInt(resumeOffer.studentAge, 10) || 12;
    setStudentName(resumeOffer.studentName || "");
    setStudentAge(resumeOffer.studentAge || "");
    setStudentMood(resumeOffer.studentMood || "");
    setAgeQuestions(getQuestionsByAge(age));
    setValeriaEnabled(getVakMode(age) === "explorer");
    setAnswers(resumeOffer.answers || []);
    setCurrentQuestion(resumeOffer.currentQuestion || 0);
    setStartTime(resumeOffer.startTime || Date.now());
    setHabeasDataAccepted(true);
    setResumeOffer(null);
    setPhase("test");
  };

  const discardProgress = () => {
    clearProgress();
    setResumeOffer(null);
  };

  const resetAll = () => {
    stopSpeaking();
    clearProgress();
    setPhase("intro");
    setStudentName("");
    setStudentAge("");
    setStudentMood("");
    setParentName("");
    setCurrentQuestion(0);
    setAnswers([]);
    setDiagnosis(null);
    setStartTime(null);
    setError(null);
    setHabeasDataAccepted(false);
    setShowMoodFeedback(false);
    setMoodFeedbackText("");
  };

  return {
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
    chartRef,
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
    generatePDF: async () => {
      const { generatePDF: gen } = await import("../vakPDFGenerator");
      return gen({ diagnosis, t, setError, setPdfLoading });
    },
  };
}
