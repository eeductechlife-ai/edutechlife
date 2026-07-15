import { useEffect, useState, useRef } from "react";
import {
  Eye,
  Video,
  Headphones,
  Activity,
  Sparkles,
  Rocket,
  Music,
  Volume,
  Wrench,
  ListOrdered,
  CheckSquare,
  Users,
  List,
  BookOpen,
  Mic,
  MessageCircle,
  Target,
  Zap,
  Globe,
  Cpu,
  Lightbulb,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { useTranslation } from "../../i18n/I18nProvider";
import useValentinaAgent from "../../hooks/useValentinaAgent";
import { getQuestionsByAge } from "../../data/vakQuestions";
import { VALENTINA_MESSAGES, warmupTts } from "./vakVoice";
import { safeStorage } from "../../utils/storage";
import { STYLE_MAP } from "./vakStyles";
import { MOOD_OPTIONS } from "./vakHelpers";
import { useSupabase } from "../../hooks/useSupabase";
import { saveVakDiagnostic } from "../../services/institutionalAnalytics";

export function getIconComponent(iconName) {
  switch (iconName) {
    case "Eye":
      return Eye;
    case "Video":
      return Video;
    case "Headphones":
      return Headphones;
    case "Activity":
      return Activity;
    case "Sparkles":
      return Sparkles;
    case "Rocket":
      return Rocket;
    case "Music":
      return Music;
    case "Volume":
      return Volume;
    case "Wrench":
      return Wrench;
    case "ListOrdered":
      return ListOrdered;
    case "CheckSquare":
      return CheckSquare;
    case "Users":
      return Users;
    case "List":
      return List;
    case "BookOpen":
      return BookOpen;
    case "Mic":
      return Mic;
    case "MessageCircle":
      return MessageCircle;
    case "Target":
      return Target;
    case "Zap":
      return Zap;
    case "Globe":
      return Globe;
    case "Cpu":
      return Cpu;
    case "Lightbulb":
      return Lightbulb;
    default:
      return Video;
  }
}

const getInstitutionSlugFromURL = () => {
  try {
    const slug = new URLSearchParams(window.location.search).get("inst");
    return slug ? slug.trim().toLowerCase() : null;
  } catch {
    return null;
  }
};

export default function useDiagnosticoVAK({ onNavigate }) {
  const { t } = useTranslation();
  const { studentInfo, updateStudentInfo } = useStudent();
  const { supabase, userId } = useSupabase();

  const [phase, setPhase] = useState("intro");
  const [studentName, setStudentName] = useState(studentInfo.name || "");
  const [studentAge, setStudentAge] = useState(studentInfo.age || "");
  const [studentEmail, setStudentEmail] = useState(studentInfo.email || "");
  const [studentPhone, setStudentPhone] = useState(studentInfo.phone || "");
  const [studentMood, setStudentMood] = useState(studentInfo.mood || "");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [diagnosis, setDiagnosis] = useState(studentInfo.diagnosis || null);
  const [date, setDate] = useState("");
  const [tempName, setTempName] = useState(studentInfo.name || "");
  const [tempAge, setTempAge] = useState(studentInfo.age || "");
  const [tempEmail, setTempEmail] = useState(studentInfo.email || "");
  const [tempPhone, setTempPhone] = useState(studentInfo.phone || "");
  const [tempMood, setTempMood] = useState(studentInfo.mood || "");
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedMoodOption, setSelectedMoodOption] = useState(() => {
    return MOOD_OPTIONS.find((m) => m.value === studentInfo.mood) || null;
  });
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const [valeriaEnabled, setValeriaEnabled] = useState(true);
  const [valeriaVolume, setValeriaVolume] = useState(1.0);
  const [valentinaIntroComplete, setValentinaIntroComplete] = useState(false);
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);

  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const [habeasDataAccepted, setHabeasDataAccepted] = useState(false);
  const [showHabeasModal, setShowHabeasModal] = useState(false);

  const [moodFeedbackText, setMoodFeedbackText] = useState("");
  const [showMoodFeedback, setShowMoodFeedback] = useState(false);

  const [ageQuestions, setAgeQuestions] = useState(() =>
    getQuestionsByAge(parseInt(studentInfo.age) || 12),
  );

  const chartRef = useRef(null);
  const timerRef = useRef(null);
  const questionJustReadRef = useRef(false);
  const timeoutRefs = useRef([]);
  const welcomeStartedRef = useRef(false);

  const setTimeoutSafe = (fn, delay) => {
    const id = setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter((t) => t !== id);
      fn();
    }, delay);
    timeoutRefs.current.push(id);
    return id;
  };

  const {
    isValentinaSpeaking,
    valeriaExpression,
    setValeriaVolume: setHookVolume,
    startWelcomeSequence,
    confirmNameAndAskAge,
    confirmAgeAndAskEmail,
    confirmEmailAndAskPhone,
    confirmPhoneAndAskMood,
    giveMoodFeedback,
    transitionToTest,
    readQuestionWithOptions,
    giveEncouragement,
    giveEncouragementNoName,
    giveProgressUpdate,
    announceResults,
    announceTestEnd,
    farewell,
    speakAsValentina,
  } = useValentinaAgent({
    studentName: studentName,
    studentAge: parseInt(studentAge) || 12,
    studentMood,
    phase,
    currentQuestion,
    totalQuestions: ageQuestions.length,
    diagnosis,
    enabled: valeriaEnabled,
  });

  useEffect(() => {
    warmupTts();
  }, []);

  useEffect(() => {
    if (phase === "intro" && valeriaEnabled && !welcomeStartedRef.current) {
      welcomeStartedRef.current = true;
      startWelcomeSequence(() => {
        setValentinaIntroComplete(true);
      });
    }
  }, [phase, valeriaEnabled]);

  useEffect(() => {
    if (phase !== "intro") return;
    const timeout = setTimeout(() => {
      setValentinaIntroComplete(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (
      phase === "test" &&
      currentQuestion < ageQuestions.length &&
      valeriaEnabled
    ) {
      const q = ageQuestions[currentQuestion];
      readQuestionWithOptions(
        q.text,
        q.options,
        currentQuestion + 1,
        ageQuestions.length,
      );
      questionJustReadRef.current = true;
    }
  }, [currentQuestion, phase, valeriaEnabled]);

  useEffect(() => {
    if (
      !isValentinaSpeaking &&
      questionJustReadRef.current &&
      phase === "test" &&
      valeriaEnabled
    ) {
      questionJustReadRef.current = false;
      const questionNum = currentQuestion + 1;
      if (questionNum === 6) {
        setFeedbackPending(true);
        setShowFeedbackButton(true);
      }
    }
  }, [isValentinaSpeaking, currentQuestion, phase, valeriaEnabled]);

  useEffect(() => {
    if (!valeriaEnabled) {
      setFeedbackPending(false);
      setShowFeedbackButton(false);
      questionJustReadRef.current = false;
    }
  }, [valeriaEnabled]);

  useEffect(() => {
    if (phase === "result" && valeriaEnabled && diagnosis) {
      const timer = setTimeout(async () => {
        const age =
          parseInt(studentAge) || parseInt(diagnosis.studentAge) || 12;
        const message = VALENTINA_MESSAGES.all.resultsShort(
          diagnosis.studentName || studentName || "Estudiante",
          diagnosis.predominantStyle || "visual",
          diagnosis.percentage || 0,
          age,
        );
        await speakAsValentina(message);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, valeriaEnabled, diagnosis]);

  useEffect(() => {
    if (phase === "intro") {
      setDate(new Date().toLocaleDateString());
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "calibration" && studentName.length >= 2 && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await confirmNameAndAskAge(studentName);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [studentName, phase, valeriaEnabled]);

  useEffect(() => {
    if (phase === "calibration" && studentMood && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await giveMoodFeedback(studentMood, studentName);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [studentMood, phase, valeriaEnabled]);

  useEffect(() => {
    if (phase === "test") {
      if (!startTime) {
        setStartTime(Date.now());
      }

      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, startTime]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => clearTimeout(id));
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    const savedData = safeStorage.getItem("edutechlife_vak_progress");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.phase && parsed.phase !== "intro") {
          setPhase(parsed.phase || "intro");
          setStudentName(parsed.studentName || "");
          setStudentAge(parsed.studentAge || "");
          setStudentEmail(parsed.studentEmail || "");
          setStudentPhone(parsed.studentPhone || "");
          setStudentMood(parsed.studentMood || "");
          setCurrentQuestion(parsed.currentQuestion || 0);
          setAnswers(parsed.answers || []);
          setStartTime(parsed.startTime || null);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const progressData = {
      phase,
      studentName,
      studentAge,
      studentEmail,
      studentPhone,
      studentMood,
      currentQuestion,
      answers,
      startTime,
      lastUpdate: Date.now(),
    };
    safeStorage.setItem(
      "edutechlife_vak_progress",
      JSON.stringify(progressData),
    );

    if (phase === "test" || phase === "calibration") {
      setShowSaveIndicator(true);
      setTimeoutSafe(() => setShowSaveIndicator(false), 1500);
    }
  }, [
    phase,
    studentName,
    studentAge,
    studentEmail,
    studentPhone,
    studentMood,
    currentQuestion,
    answers,
    startTime,
  ]);

  const clearProgress = () => {
    safeStorage.removeItem("edutechlife_vak_progress");
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        toggleHighContrast();
      }
      if (e.key === "Escape" && onNavigate) {
        onNavigate("neuroentorno");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [highContrast, onNavigate]);

  const startTest = () => {
    if (valeriaEnabled && !valentinaIntroComplete) return;
    setPhase("calibration");
  };

  const handleStart = async () => {
    setPhase("calibration");
  };

  const submitCalibration = async () => {
    if (!studentName.trim() || !studentAge || !studentMood) return;

    const age = parseInt(studentAge);
    if (age < 6 || age > 17) {
      setError(t("vak.ui.error_age_range"));
      return;
    }

    setStudentName(studentName.trim());
    setStudentAge(studentAge);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsTransitioning(true);

    setAgeQuestions(getQuestionsByAge(age));

    updateStudentInfo({
      name: studentName.trim(),
      age: studentAge,
      mood: studentMood || "neutral",
    });

    if (valeriaEnabled) {
      await Promise.race([
        transitionToTest(studentName.trim()),
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ]);
      setPhase("test");
      setCurrentQuestion(0);
    } else {
      setPhase("test");
      setCurrentQuestion(0);
    }
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handleFeedbackClick = async () => {
    setShowFeedbackButton(false);
    if (valeriaEnabled) {
      await giveProgressUpdate();
    }
    setFeedbackPending(false);
  };

  const handleAnswer = async (option) => {
    try {
      const idx = currentQuestion;
      const entry = { index: idx, text: option.text, type: option.type };
      const nextAnswers = [...answers, entry];
      setAnswers(nextAnswers);

      if (valeriaEnabled) {
        await giveEncouragementNoName();
      }

      if (idx < ageQuestions.length - 1) {
        setCurrentQuestion(idx + 1);
      } else {
        if (valeriaEnabled) {
          await announceTestEnd();
        }

        const c = { visual: 0, auditivo: 0, kinestesico: 0 };
        nextAnswers.forEach((a) => {
          if (a.type === "visual") c.visual++;
          else if (a.type === "auditivo") c.auditivo++;
          else if (a.type === "kinestesico") c.kinestesico++;
        });

        let predominant = "visual";
        let max = c.visual;
        if (c.auditivo > max) {
          predominant = "auditivo";
          max = c.auditivo;
        }
        if (c.kinestesico > max) {
          predominant = "kinestesico";
          max = c.kinestesico;
        }

        const style = STYLE_MAP[predominant];
        const res = {
          studentName: studentName || "Estudiante",
          studentAge: studentAge || "",
          studentEmail: studentEmail,
          studentPhone: studentPhone,
          studentMood: studentMood,
          parentName: parentName || "",
          parentPhone: parentPhone || "",
          parentEmail: parentEmail || "",
          date: date,
          timeSpent: elapsedTime,
          counts: c,
          predominantStyle: predominant,
          styleDetails: style,
          percentage: Math.round((max / ageQuestions.length) * 100),
          answers: nextAnswers,
        };

        setDiagnosis(res);

        updateStudentInfo({
          diagnosis: res,
        });

        if (supabase && userId) {
          saveVakDiagnostic(supabase, {
            userId,
            institutionId:
              studentInfo.institutionId || getInstitutionSlugFromURL(),
            diagnosis: res,
          })
            .then((r) => {
              if (r && !r.ok) {
                console.warn("[VAK] Diagnóstico no persistido:", r.error);
              }
            })
            .catch((e) => {
              console.warn("[VAK] Diagnóstico no persistido:", e?.message);
            });
        }

        setShowConfetti(true);
        setShowCelebration(true);

        clearProgress();

        setTimeoutSafe(() => {
          setShowConfetti(false);
          setShowCelebration(false);
          setPhase("parentdata");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoodSelect = (moodValue) => {
    setStudentMood(moodValue);
    const mensajes = {
      happy:
        "¡Qué alegría verte así! Vamos a pasarlo muy bien con este diagnóstico.",
      neutral:
        "Gracias por compartir cómo te sientes. Estoy aquí para guiarte.",
      sad: "Entiendo que no te sientas del todo bien. Este diagnóstico te ayudará a conocerte mejor y descubrirás cómo aprender de la forma que más te gusta. ¡Vamos juntos!",
    };
    setMoodFeedbackText(mensajes[moodValue] || mensajes.neutral);
    setShowMoodFeedback(true);
    setTimeoutSafe(() => setShowMoodFeedback(false), 4000);
  };

  const handleParentSubmit = () => {
    updateStudentInfo({
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
    });
    setDiagnosis((prev) =>
      prev
        ? {
            ...prev,
            parentName: parentName.trim(),
            parentPhone: parentPhone.trim(),
            parentEmail: parentEmail.trim(),
          }
        : prev,
    );
    setPhase("result");
  };

  return {
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
    answers,
    setAnswers,
    diagnosis,
    setDiagnosis,
    date,
    error,
    setError,
    pdfLoading,
    setPdfLoading,
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
    setValeriaVolume,
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
    timerRef,
    isValentinaSpeaking,
    valeriaExpression,
    setTimeoutSafe,
    readQuestionWithOptions,
    startTest,
    handleStart,
    submitCalibration,
    handleFeedbackClick,
    handleAnswer,
    handleMoodSelect,
    handleParentSubmit,
    clearProgress,
    toggleHighContrast,
    setHookVolume,
    generatePDF: async () => {
      const { generatePDF: gen } = await import("./vakPDFGenerator");
      return gen({ diagnosis, t, setError, setPdfLoading });
    },
  };
}
