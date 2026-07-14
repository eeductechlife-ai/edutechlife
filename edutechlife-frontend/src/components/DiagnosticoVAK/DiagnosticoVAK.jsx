import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import {
  Eye,
  Download,
  Sparkles,
  ArrowRight,
  Check,
  Volume,
  RotateCcw,
  Video,
  Headphones,
  Activity,
  Target,
  Zap,
  Users,
  Globe,
  Cpu,
  Lightbulb,
  Wrench,
  ListOrdered,
  CheckSquare,
  CheckCircle2,
  Rocket,
  List,
  BookOpen,
  Mic,
  MessageCircle,
  Smile,
  Meh,
  Frown,
  Music,
  User,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { speakTextConversational, warmupTts } from "../../utils/speech";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { useStudent } from "../../context/StudentContext";
import { useTranslation } from "../../i18n/I18nProvider";
import useValentinaAgent from "../../hooks/useValentinaAgent";
import { getQuestionsByAge } from "../../data/vakQuestions";
import { VALENTINA_MESSAGES, getAgeGroup } from "../../utils/valentinaMessages";
import { safeStorage } from "../../utils/storage";
import { STYLE_MAP } from "./vakStyles";
import {
  MOOD_OPTIONS,
  buildResultsURL,
  getMoodLabel,
  getMoodFeedback,
  formatTime,
  validateEmail,
} from "./vakHelpers";
import { Confetti, Celebration } from "./vakComponents.jsx";
import "./DiagnosticoVAK.css";
import ValeriaControls from "./ValeriaControls";
import VakSkeleton from "./VakSkeleton";
import VakError from "./VakError";
import HabeasDataModal from "./screens/HabeasDataModal";
import DocumentPreviewScreen from "./screens/DocumentPreviewScreen";
import { useSupabase } from "../../hooks/useSupabase";
import { saveVakDiagnostic } from "../../services/institutionalAnalytics";

const getIconComponent = (iconName) => {
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
};

// Slug institucional desde la URL (?inst=colegio-x) — enlaces B2B por colegio.
// No se resuelve a uuid en el cliente: el trigger server-side lo valida.
const getInstitutionSlugFromURL = () => {
  try {
    const slug = new URLSearchParams(window.location.search).get("inst");
    return slug ? slug.trim().toLowerCase() : null;
  } catch {
    return null;
  }
};

const DiagnosticoVAK = ({ onNavigate }) => {
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

  // Estados para Valeria
  const [valeriaEnabled, setValeriaEnabled] = useState(true);
  const [valeriaVolume, setValeriaVolume] = useState(1.0);
  const [valentinaIntroComplete, setValentinaIntroComplete] = useState(false);
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);

  // Estados para datos del padre/tutor
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  // Habeas Data
  const [habeasDataAccepted, setHabeasDataAccepted] = useState(false);
  const [showHabeasModal, setShowHabeasModal] = useState(false);

  // Feedback de ánimo
  const [moodFeedbackText, setMoodFeedbackText] = useState("");
  const [showMoodFeedback, setShowMoodFeedback] = useState(false);

  // Preguntas por edad
  const [ageQuestions, setAgeQuestions] = useState(() =>
    getQuestionsByAge(parseInt(studentInfo.age) || 12),
  );

  const chartRef = useRef(null);
  const isChartInView = useInView(chartRef);
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

  // Hook de Valeria actualizado con nuevos métodos conversacionales
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

  // Efecto: Pre-calentar TTS inmediatamente al montar (elimina latencia cold start)
  useEffect(() => {
    warmupTts();
  }, []);
  // Efecto: Hablar al entrar en intro (solo una vez, incluso en StrictMode)
  useEffect(() => {
    if (phase === "intro" && valeriaEnabled && !welcomeStartedRef.current) {
      welcomeStartedRef.current = true;
      startWelcomeSequence(() => {
        setValentinaIntroComplete(true);
      });
    }
  }, [phase, valeriaEnabled]);

  // Fallback: permitir continuar tras 3s aunque Valeria no hable
  useEffect(() => {
    if (phase !== "intro") return;
    const timeout = setTimeout(() => {
      setValentinaIntroComplete(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Efecto: Leer pregunta al entrar en fase test
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

  // Efecto: Detectar cuando Valeria termina de leer pregunta 3/6/9 para activar feedback
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

  // Limpiar feedback si se desactiva Valeria
  useEffect(() => {
    if (!valeriaEnabled) {
      setFeedbackPending(false);
      setShowFeedbackButton(false);
      questionJustReadRef.current = false;
    }
  }, [valeriaEnabled]);

  // Efecto: Hablar resultados cortos al entrar a la pantalla de resultados
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

  // Efecto conversacional: Confirmar nombre y pedir edad
  useEffect(() => {
    if (phase === "calibration" && studentName.length >= 2 && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await confirmNameAndAskAge(studentName);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [studentName, phase, valeriaEnabled]);

  // Efecto conversacional: Dar feedback cuando se selecciona el ánimo
  useEffect(() => {
    if (phase === "calibration" && studentMood && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await giveMoodFeedback(studentMood, studentName);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [studentMood, phase, valeriaEnabled]);

  // Timer para mostrar tiempo en resultados
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

  // Limpiar todos los timeouts pendientes al desmontar
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => clearTimeout(id));
      timeoutRefs.current = [];
    };
  }, []);

  // Persistencia de datos en localStorage
  useEffect(() => {
    // Cargar datos guardados al iniciar
    const savedData = safeStorage.getItem("edutechlife_vak_progress");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.phase && parsed.phase !== "intro") {
          // Restaurar progreso si existe
          setPhase(parsed.phase || "intro");
          setStudentName(parsed.studentName || "");
          setStudentAge(parsed.studentAge || ""); // Nuevo: cargar edad
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

  // Guardar progreso en cada cambio significativo
  useEffect(() => {
    const progressData = {
      phase,
      studentName,
      studentAge, // Nuevo: guardar edad
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

    // Mostrar indicador de guardado
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

  // Limpiar localStorage al completar el test
  const clearProgress = () => {
    safeStorage.removeItem("edutechlife_vak_progress");
  };

  // Alternar modo de alto contraste
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + C: Alternar contraste alto
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        toggleHighContrast();
      }
      // Escape: Volver al diagnóstico
      if (e.key === "Escape" && onNavigate) {
        onNavigate("neuroentorno");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [highContrast, onNavigate]);

  const validateEmail = (email) => {
    if (!email) return true; // Email es opcional
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

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

    // Actualizar preguntas según la edad
    setAgeQuestions(getQuestionsByAge(age));

    // Actualizar información del estudiante en el contexto global
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

      // Dar aliento SIN mencionar nombre
      if (valeriaEnabled) {
        await giveEncouragementNoName();
      }

      if (idx < ageQuestions.length - 1) {
        setCurrentQuestion(idx + 1);
      } else {
        // Es el último pregunta
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

        // Actualizar diagnóstico en el contexto global
        updateStudentInfo({
          diagnosis: res,
        });

        // Persistir a Supabase para el panel institucional de Valeria
        // (best-effort: solo si hay usuario autenticado; no bloquea el flujo).
        // La institución llega como slug vía ?inst= en enlaces de colegios;
        // el trigger server-side valida que el slug exista en `institutions`.
        if (supabase && userId) {
          saveVakDiagnostic(supabase, {
            userId,
            institutionId:
              studentInfo.institutionId || getInstitutionSlugFromURL(),
            diagnosis: res,
          })
            .then((r) => {
              if (r && !r.ok) {
                // Slug mal configurado en un enlace de campaña, RLS, etc.
                console.warn("[VAK] Diagnóstico no persistido:", r.error);
              }
            })
            .catch((e) => {
              console.warn("[VAK] Diagnóstico no persistido:", e?.message);
            });
        }

        // Activar celebración antes de mostrar resultados
        setShowConfetti(true);
        setShowCelebration(true);

        // Limpiar progreso guardado
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

  const generatePDF = async () => {
    if (!diagnosis) {
      console.error("No hay diagnóstico disponible para PDF");
      setError(t("vak.ui.pdf_error_no_data"));
      return;
    }

    const el = document.getElementById("document-preview-content");
    if (!el) {
      console.error("No se encontró el elemento del documento preview");
      setError(t("vak.ui.pdf_error_internal"));
      return;
    }

    // Verificar que el elemento tenga contenido
    const contentLength = el.innerHTML.length;

    if (!contentLength || contentLength < 100) {
      console.error("El documento preview está vacío o es muy corto");
      setError(t("vak.ui.pdf_error_empty"));
      return;
    }

    // Verificar que el diagnóstico tenga los datos necesarios

    if (!diagnosis.styleDetails) {
      console.warn("styleDetails falta, recuperando desde STYLE_MAP...");
      const recoveredStyle = STYLE_MAP[diagnosis.predominantStyle];
      if (recoveredStyle) {
        const updatedDiagnosis = { ...diagnosis, styleDetails: recoveredStyle };
        setDiagnosis(updatedDiagnosis);
        // Esperar a que se actualice el estado
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    setPdfLoading(true);

    const fileName = `Diagnostico_VAK_${(diagnosis.studentName || "estudiante").replace(/\s+/g, "_")}_${diagnosis.date || new Date().toISOString().split("T")[0]}`;
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3,
        width: 794,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      const { default: html2pdf } = await import("html2pdf.js");
      await html2pdf().set(opt).from(el).save();
    } catch (e) {
      console.error("Error al generar PDF:", e);
      setError(
        t("vak.ui.pdf_generic_error", {
          message: e.message || "Error desconocido",
        }),
      );
    } finally {
      setPdfLoading(false);
    }
  };

  const renderWelcome = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#66CCCC]/10 to-[#4DA8C4]/5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* SECCIÓN: ¿QUÉ ES? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#B2D8E5]/50 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
              <Target size={24} strokeWidth={2} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#004B63]">
              {t("vak.ui.what_is_vak")}
            </h2>
          </div>
          <p className="text-[#004B63]/80 leading-relaxed text-base">
            {t("vak.ui.vak_intro")}
          </p>
        </motion.div>

        {/* SECCIÓN: LOS 3 ESTILOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-[#004B63] mb-4 text-center">
            {t("vak.ui.three_styles_title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* VISUAL */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#4DA8C4] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mb-4 mx-auto">
                <Eye size={32} strokeWidth={1.5} className="text-[#4DA8C4]" />
              </div>
              <h3 className="text-lg font-bold text-[#4DA8C4] text-center mb-3 uppercase tracking-wide">
                {t("vak.ui.visual")}
              </h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                {t("vak.ui.visual_short_desc")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_images_videos")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_mind_maps")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_diagrams")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_colors_schemas")}</span>
                </div>
              </div>
            </div>

            {/* AUDITIVO */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#66CCCC] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#66CCCC]/10 flex items-center justify-center mb-4 mx-auto">
                <Headphones
                  size={32}
                  strokeWidth={1.5}
                  className="text-[#66CCCC]"
                />
              </div>
              <h3 className="text-lg font-bold text-[#66CCCC] text-center mb-3 uppercase tracking-wide">
                {t("vak.ui.auditory")}
              </h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                {t("vak.ui.auditory_short_desc")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_podcasts_audio")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_debates_discussions")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_explain_aloud")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#66CCCC] shrink-0"
                  />
                  <span>{t("vak.ui.feature_music_rhythms")}</span>
                </div>
              </div>
            </div>

            {/* KINESTÉSICO */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#4DA8C4] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mb-4 mx-auto">
                <Activity
                  size={32}
                  strokeWidth={1.5}
                  className="text-[#4DA8C4]"
                />
              </div>
              <h3 className="text-lg font-bold text-[#4DA8C4] text-center mb-3 uppercase tracking-wide">
                {t("vak.ui.kinesthetic")}
              </h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                {t("vak.ui.kinesthetic_short_desc")}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_hands_on")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_movement_breaks")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_projects")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-[#4DA8C4] shrink-0"
                  />
                  <span>{t("vak.ui.feature_role_play")}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECCIÓN: ¿QUÉ RECIBIRÁS? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-3xl p-6 md:p-8 shadow-xl mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {t("vak.ui.what_you_get_title")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.personalized_diagnosis")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Lightbulb size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.adapted_strategies")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Download size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.pdf_report")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Zap size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">
                {t("vak.ui.practical_tips")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* SECCIÓN: ¿QUÉ ESPERAR? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-[#B2D8E5]/50 mb-6"
        >
          <h2 className="text-xl font-bold text-[#004B63] mb-6 text-center">
            {t("vak.ui.what_to_expect_title")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <Clock size={28} strokeWidth={2} className="text-[#4DA8C4]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">10 min</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.duration")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#66CCCC]/10 flex items-center justify-center mx-auto mb-2">
                <List size={28} strokeWidth={2} className="text-[#66CCCC]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">10</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.questions_count")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <Target size={28} strokeWidth={2} className="text-[#4DA8C4]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">100%</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.personalized_label")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2
                  size={28}
                  strokeWidth={2}
                  className="text-[#4DA8C4]"
                />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">100%</p>
              <p className="text-xs text-[#004B63]/60">
                {t("vak.ui.confidential_label")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              {t("vak.ui.no_wrong_answers")}
            </span>
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              {t("vak.ui.answer_honestly")}
            </span>
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              {t("vak.ui.valeria_will_guide")}
            </span>
          </div>
        </motion.div>

        {/* BOTÓN COMENZAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={valentinaIntroComplete ? { scale: 1.02 } : {}}
            whileTap={valentinaIntroComplete ? { scale: 0.98 } : {}}
            onClick={startTest}
            disabled={!valentinaIntroComplete}
            className={`w-full rounded-2xl py-5 px-8 shadow-xl transition-all duration-300 ${
              valentinaIntroComplete
                ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:shadow-2xl"
                : "bg-[#B2D8E5] cursor-not-allowed"
            }`}
          >
            <span className="text-lg font-bold text-white flex items-center justify-center gap-3">
              {valentinaIntroComplete ? (
                <>
                  <Rocket size={24} strokeWidth={2} />
                  {t("vak.ui.start_diagnosis_btn")}
                </>
              ) : (
                <>
                  <Volume size={24} strokeWidth={2} className="animate-pulse" />
                  {t("vak.ui.waiting_for_valeria")}
                </>
              )}
            </span>
          </motion.button>
        </motion.div>

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-[#004B63]/50 mt-6"
        >
          {t("vak.ui.developed_by")}{" "}
          <span className="font-semibold text-[#4DA8C4]">EdutechLife</span>
        </motion.p>
      </motion.div>
    </div>
  );

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

  const renderCalibration = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#66CCCC]/10 to-[#4DA8C4]/5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md text-center relative z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center shadow-lg mb-4">
            <User size={32} strokeWidth={2} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#004B63] text-center">
            {t("vak.ui.tell_me_about_you")}
          </h1>
          <p className="text-sm text-[#004B63]/70 leading-relaxed mt-2">
            {t("vak.ui.fill_data_personalize")}
          </p>
        </motion.div>

        {/* Input Nombre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block text-left">
            {t("vak.ui.your_name_label")}
          </label>
          <div className="relative">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t("vak.ui.your_name_placeholder")}
              className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
            />
          </div>
        </motion.div>

        {/* Input Edad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block text-left">
            {t("vak.ui.your_age_label")}
          </label>
          <div className="relative">
            <input
              type="number"
              min="6"
              max="17"
              value={studentAge}
              onChange={(e) => {
                setStudentAge(e.target.value);
                const val = parseInt(e.target.value);
                setAgeError(
                  e.target.value.length > 0 &&
                    (isNaN(val) || val < 6 || val > 17),
                );
              }}
              placeholder={t("vak.ui.your_age_placeholder")}
              className={`w-full rounded-2xl border-2 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 transition-all shadow-md ${
                ageError
                  ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                  : "border-[#B2D8E5]/50 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4]"
              }`}
            />
          </div>
          {ageError && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠</span>
              <span>{t("vak.ui.error_age_range")}</span>
            </p>
          )}
        </motion.div>

        {/* Selector de Ánimo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-3 block text-left">
            {t("vak.ui.how_feel_today")}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "happy", label: t("vak.ui.mood_good"), icon: Smile },
              { value: "neutral", label: t("vak.ui.mood_neutral"), icon: Meh },
              { value: "sad", label: t("vak.ui.mood_bad"), icon: Frown },
            ].map((mood) => {
              const IconComponent = mood.icon;
              return (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`relative rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
                    studentMood === mood.value
                      ? "bg-[#4DA8C4]/10 ring-2 ring-[#4DA8C4] shadow-lg"
                      : "bg-white/80 border-2 border-[#B2D8E5]/30 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      studentMood === mood.value
                        ? "bg-[#4DA8C4]/20"
                        : "bg-[#4DA8C4]/5"
                    }`}
                  >
                    <IconComponent
                      size={24}
                      strokeWidth={2}
                      className={
                        studentMood === mood.value
                          ? "text-[#4DA8C4]"
                          : "text-[#4DA8C4]"
                      }
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      studentMood === mood.value
                        ? "text-[#004B63]"
                        : "text-[#004B63]/60"
                    }`}
                  >
                    {mood.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback de ánimo */}
          {showMoodFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-[#4DA8C4]/10 rounded-2xl border border-[#4DA8C4]/20"
            >
              <p className="text-sm text-[#004B63] font-medium leading-relaxed">
                {moodFeedbackText}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Habeas Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-start gap-3 bg-[#B2D8E5]/20 rounded-2xl p-4">
            <input
              type="checkbox"
              checked={habeasDataAccepted}
              onChange={(e) => setHabeasDataAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#4DA8C4] text-[#4DA8C4] focus:ring-[#4DA8C4] cursor-pointer accent-[#4DA8C4]"
            />
            <div className="text-left">
              <p className="text-xs text-[#004B63]/80 leading-relaxed">
                {t("vak.ui.accept_data_policy")}
              </p>
              <button
                onClick={() => setShowHabeasModal(true)}
                className="text-xs text-[#4DA8C4] font-medium hover:underline mt-1"
              >
                {t("vak.ui.view_habeas_data")}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Botón Iniciar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <motion.button
            whileHover={
              studentName.trim() &&
              studentAge &&
              studentMood &&
              habeasDataAccepted
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              studentName.trim() &&
              studentAge &&
              studentMood &&
              habeasDataAccepted
                ? { scale: 0.98 }
                : {}
            }
            onClick={submitCalibration}
            disabled={
              !studentName.trim() ||
              !studentAge ||
              !studentMood ||
              !habeasDataAccepted
            }
            className={`w-full rounded-2xl py-4 px-6 shadow-xl transition-all ${
              studentName.trim() &&
              studentAge &&
              studentMood &&
              habeasDataAccepted
                ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:shadow-2xl"
                : "bg-[#B2D8E5] cursor-not-allowed"
            }`}
          >
            <span
              className={`text-lg font-bold flex items-center justify-center gap-2 ${
                studentName.trim() &&
                studentAge &&
                studentMood &&
                habeasDataAccepted
                  ? "text-white"
                  : "text-[#004B63]/50"
              }`}
            >
              {t("vak.ui.start_test_btn")}
              <ArrowRight size={20} strokeWidth={2} />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modal Habeas Data */}
      {showHabeasModal && (
        <HabeasDataModal
          onClose={() => setShowHabeasModal(false)}
          onAccept={() => {
            setHabeasDataAccepted(true);
            setShowHabeasModal(false);
          }}
        />
      )}
    </div>
  );

  const renderTest = () => {
    const question = ageQuestions[currentQuestion];
    if (!question) return null;

    const progress = ((currentQuestion + 1) / ageQuestions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto p-4">
        {/* Top Bar con número de pregunta */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {t("vak.ui.question")}
          </div>
          <div className="bg-[#66CCCC] text-white rounded-full px-3 py-1 text-xs font-semibold">
            {currentQuestion + 1} / {ageQuestions.length}
          </div>
        </div>

        {/* Barra de progreso fina */}
        <div className="mb-8">
          <div
            className="h-2 bg-gray-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={currentQuestion + 1}
            aria-valuemin={1}
            aria-valuemax={ageQuestions.length}
            aria-label={t("vak.ui.question")}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-[#4DA8C4] rounded-full"
            />
          </div>
        </div>

        {/* Pregunta sin recuadro - Diseño limpio y moderno */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#004B63] text-center leading-tight">
            {question.text}
          </h2>

          {/* Botón de feedback para preguntas 3, 6, 9 */}
          {showFeedbackButton && (
            <div className="flex justify-center my-8">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleFeedbackClick}
                className="px-8 py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <Sparkles size={24} strokeWidth={2} />
                {t("vak.ui.want_feedback")}
              </motion.button>
            </div>
          )}

          {/* Opciones de Respuesta - Diseño Soft Outline / Minimalist */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {question.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const IconComponent =
                typeof opt.icon === "string"
                  ? getIconComponent(opt.icon)
                  : opt.icon;

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={
                    isValentinaSpeaking || feedbackPending
                      ? {}
                      : { scale: 1.01, x: 5 }
                  }
                  whileTap={
                    isValentinaSpeaking || feedbackPending
                      ? {}
                      : { scale: 0.99 }
                  }
                  onClick={() =>
                    !isValentinaSpeaking &&
                    !feedbackPending &&
                    handleAnswer(opt)
                  }
                  disabled={isValentinaSpeaking || feedbackPending}
                  className={`w-full text-left p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 group relative overflow-hidden ${
                    isValentinaSpeaking || feedbackPending
                      ? "bg-gray-100/50 border-gray-200 cursor-not-allowed opacity-60"
                      : "bg-white/80 border-gray-100 hover:border-[#4DA8C4]"
                  }`}
                >
                  {/* Efecto de fondo sutil al hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4DA8C4]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                  <div className="flex items-center gap-4 relative z-10">
                    {/* Letra de la opción - Estilo moderno y limpio */}
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center group-hover:bg-[#4DA8C4]/20 transition-all">
                      <span className="text-base font-bold text-[#4DA8C4]">
                        {letter}
                      </span>
                    </div>

                    {/* Texto de la opción */}
                    <div className="flex-1 text-base font-medium text-slate-600 leading-relaxed">
                      {opt.text}
                    </div>

                    {/* Icono integrado - Contenedor Soft Outline */}
                    {IconComponent && (
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center text-[#4DA8C4] group-hover:bg-[#4DA8C4]/20 transition-all">
                        <IconComponent size={20} strokeWidth={2} />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Botón para repetir la pregunta - Icono Soft Outline */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                if (!isValentinaSpeaking && !feedbackPending) {
                  readQuestionWithOptions(
                    question.text,
                    question.options,
                    currentQuestion + 1,
                    ageQuestions.length,
                  );
                }
              }}
              disabled={isValentinaSpeaking || feedbackPending}
              className="text-[#4DA8C4] text-xs font-medium uppercase tracking-wider flex items-center gap-2 hover:text-[#66CCCC] transition-colors px-4 py-2 rounded-full hover:bg-[#4DA8C4]/5"
              title={t("vak.ui.listen_again")}
            >
              <RotateCcw size={16} strokeWidth={2} />
              <span>{t("vak.ui.repeat_question")}</span>
            </button>
          </div>
        </motion.div>

        {/* Indicador de tiempo */}
        <div className="text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider">
            {t("vak.ui.time_elapsed")}: {formatTime(elapsedTime)}
          </span>
        </div>
      </div>
    );
  };

  const renderParentData = () => {
    const isValid =
      parentName.trim() &&
      parentPhone.trim() &&
      parentEmail.trim() &&
      validateEmail(parentEmail);

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#66CCCC]/10 to-[#4DA8C4]/5 blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <motion.div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center shadow-lg mb-4">
              <Sparkles size={32} strokeWidth={2} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#004B63] mb-2">
              {t("vak.ui.almost_done")}
            </h1>
            <p className="text-sm text-[#004B63]/70 leading-relaxed">
              {t("vak.ui.parent_data_instruction")}
            </p>
          </motion.div>

          {/* Form */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
                <User
                  size={14}
                  strokeWidth={2}
                  className="inline mr-1 text-[#4DA8C4]"
                />
                {t("vak.ui.parent_name_label")}
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder={t("vak.ui.parent_name_placeholder")}
                className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
                <Phone
                  size={14}
                  strokeWidth={2}
                  className="inline mr-1 text-[#4DA8C4]"
                />
                {t("vak.ui.contact_phone_label")}
              </label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder={t("vak.ui.phone_placeholder")}
                className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
                <Mail
                  size={14}
                  strokeWidth={2}
                  className="inline mr-1 text-[#4DA8C4]"
                />
                {t("vak.ui.email_label")}
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => {
                  setParentEmail(e.target.value);
                  setEmailError(
                    e.target.value.length > 0 && !validateEmail(e.target.value),
                  );
                }}
                placeholder={t("vak.ui.email_placeholder")}
                className={`w-full rounded-2xl border-2 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 transition-all shadow-md ${
                  emailError
                    ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                    : "border-[#B2D8E5]/50 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4]"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span>
                  <span>
                    {t("vak.ui.invalid_email") || "Correo electrónico inválido"}
                  </span>
                </p>
              )}
            </motion.div>
          </div>

          {/* Botón continuar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <motion.button
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
              onClick={() => {
                if (isValid) {
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
                }
              }}
              disabled={!isValid}
              className={`w-full rounded-2xl py-4 px-6 shadow-xl transition-all font-bold text-lg ${
                isValid
                  ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white hover:shadow-2xl"
                  : "bg-[#B2D8E5] text-[#004B63]/50 cursor-not-allowed"
              }`}
            >
              {t("vak.ui.view_results_btn")}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  const renderResults = () => {
    if (!diagnosis || !diagnosis.styleDetails) {
      return (
        <div className="p-10 text-center text-gray-500">
          {t("vak.ui.no_results_available")}
        </div>
      );
    }

    const qrUrl = buildResultsURL(diagnosis);
    const StyleIcon = getIconComponent(diagnosis.styleDetails?.icon || "Eye");
    const moodFeedback = getMoodFeedback(studentMood, MOOD_OPTIONS);

    const radarData = [
      { subject: "Visual", A: diagnosis.counts?.visual || 0, fullMark: 10 },
      { subject: "Auditivo", A: diagnosis.counts?.auditivo || 0, fullMark: 10 },
      {
        subject: "Kinestésico",
        A: diagnosis.counts?.kinestesico || 0,
        fullMark: 10,
      },
    ];

    return (
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Header del resultado */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[#004B63] text-center">
            {t("vak.ui.diagnosis_completed")}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            {t("vak.ui.hello_greeting_name")}{" "}
            <span className="font-semibold text-[#4DA8C4]">
              {diagnosis.studentName}
            </span>
            {t("vak.ui.hello_results_suffix")}
          </p>
        </div>

        {/* Layout dividido en 2 columnas con efecto 3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Efecto de conexión 3D entre columnas */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-[#4DA8C4] to-[#66CCCC] opacity-20 hidden md:block"></div>

          {/* Columna Izquierda (Dominante) - Estrategias con efecto 3D */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="rounded-[2rem] bg-gradient-to-br from-[#E6F4F1] to-white border border-[#B2D8E5] p-6 relative overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            {/* Efecto de profundidad 3D */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4DA8C4] to-transparent opacity-30"></div>
            <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-[#4DA8C4]/10 blur-xl"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#4DA8C4] flex items-center justify-center">
                <StyleIcon size={24} strokeWidth={2} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#4DA8C4] uppercase tracking-wide">
                  {diagnosis.styleDetails.name}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {diagnosis.percentage}% {t("vak.ui.percentage_match")}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {diagnosis.styleDetails.description}
            </p>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">
                {t("vak.ui.recommended_strategies")}
              </h3>
              {(diagnosis.styleDetails.strategies || [])
                .slice(0, 5)
                .map((strategy, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-[#4DA8C4]/10 flex items-center justify-center mt-0.5">
                      <CheckCircle2
                        className="w-5 h-5 text-[#4DA8C4]"
                        size={20}
                        strokeWidth={2}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700 leading-relaxed">
                      {strategy}
                    </span>
                  </div>
                ))}
            </div>

            {/* Consejo personalizado */}
            <div className="mt-6 p-4 bg-[#F0FDFF] rounded-xl border-l-4 border-[#4DA8C4]">
              <p className="text-xs text-[#004B63] font-medium mb-1">
                {t("vak.ui.personalized_tip_title")}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {diagnosis.styleDetails?.tip}
              </p>
            </div>
          </motion.div>

          {/* Columna Derecha - Gráficos y Puntuaciones */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="space-y-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Radar Chart */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-[#004B63] mb-4">
                {t("vak.ui.vak_profile")}
              </h3>
              <div
                className="w-full aspect-square max-w-[300px] mx-auto"
                ref={chartRef}
                role="img"
                aria-label={`${t("vak.ui.vak_profile")}: ${radarData
                  .map((d) => `${d.subject} ${d.A}/${d.fullMark}`)
                  .join(", ")}`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#64748B", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 10]}
                      tick={{ fill: "#94A3B8", fontSize: 10 }}
                    />
                    <Radar
                      name={t("vak.ui.scores")}
                      dataKey="A"
                      stroke="#4DA8C4"
                      fill="#4DA8C4"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Puntuaciones numéricas */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-[#004B63] mb-4">
                {t("vak.ui.scores")}
              </h3>

              {/* Visual */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: "#4DA8C4" }}>
                    Visual
                  </span>
                  <span className="text-slate-600">
                    {diagnosis.counts?.visual || 0}/10
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(diagnosis.counts?.visual || 0) * 10}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#4DA8C4" }}
                  />
                </div>
              </div>

              {/* Auditivo */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: "#66CCCC" }}>
                    Auditivo
                  </span>
                  <span className="text-slate-600">
                    {diagnosis.counts?.auditivo || 0}/10
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(diagnosis.counts?.auditivo || 0) * 10}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#66CCCC" }}
                  />
                </div>
              </div>

              {/* Kinestésico */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: "#B2D8E5" }}>
                    Kinestésico
                  </span>
                  <span className="text-slate-600">
                    {diagnosis.counts?.kinestesico || 0}/10
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(diagnosis.counts?.kinestesico || 0) * 10}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#B2D8E5" }}
                  />
                </div>
              </div>
            </div>

            {/* Estado de ánimo y tiempo */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl bg-[#F0FDFF] flex items-center justify-center"
                    style={{ color: moodFeedback.color }}
                  >
                    {React.createElement(getIconComponent(moodFeedback.icon), {
                      size: 20,
                      strokeWidth: 2,
                    })}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#004B63]">
                      {t("vak.ui.mood_section")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {getMoodLabel(studentMood, t)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#004B63]">
                    {t("vak.ui.time_section")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTime(diagnosis.timeSpent || elapsedTime)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Botón para ver documento completo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex justify-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase("document-preview")}
            className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Eye size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-base font-semibold">
              {t("vak.ui.view_document_btn")}
            </span>
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
          </motion.button>
        </motion.div>

        {/* Action Buttons (Inferiores) con iconos Soft Outline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            disabled={pdfLoading}
            className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Efecto de brillo 3D */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            {pdfLoading ? (
              <>
                <div className="relative z-10 w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <span className="relative z-10 text-base font-semibold">
                  {t("vak.ui.generating_pdf")}
                </span>
              </>
            ) : (
              <>
                <Download size={20} strokeWidth={2} className="relative z-10" />
                <span className="relative z-10 text-base font-semibold">
                  {t("vak.ui.download_pdf_result")}
                </span>
              </>
            )}

            {/* Efecto de sombra 3D */}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/")}
            className="relative bg-white border-2 border-[#004B63] text-[#004B63] rounded-full px-8 py-4 flex items-center gap-3 overflow-hidden group"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Efecto de brillo 3D */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#004B63]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            <Rocket size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-base font-semibold">
              {t("vak.ui.go_home")}
            </span>

            {/* Efecto de sombra 3D */}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#004B63]/10 blur-md rounded-full"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
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
            }}
            className="text-[#004B63]/50 hover:text-[#4DA8C4] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={16} strokeWidth={2} />
            {t("vak.ui.back_to_start")}
          </motion.button>
        </motion.div>

        {/* Información adicional */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            {t("vak.ui.total_time")}:{" "}
            {formatTime(diagnosis.timeSpent || elapsedTime)} •{" "}
            {t("vak.ui.mood_section")}: {getMoodLabel(studentMood, t)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] py-6 md:py-10 px-3 md:px-4 relative overflow-hidden font-sans antialiased ${highContrast ? "high-contrast-mode" : ""}`}
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
      {/* EFECTOS DE CELEBRACIÓN */}
      <Confetti active={showConfetti} />
      <Celebration
        active={showCelebration}
        styleName={diagnosis?.styleDetails?.name || ""}
      />

      {/* Indicador de guardado automático */}
      <AnimatePresence>
        {showSaveIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-green-400"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              {t("vak.ui.save_indicator")} ✓
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de accesibilidad */}
      <button
        onClick={toggleHighContrast}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg border-2 border-[var(--color-gray-200)] hover:border-[var(--color-corporate)] transition-all"
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

      {/* Barra de controles de Valeria */}
      <ValeriaControls
        valeriaEnabled={valeriaEnabled}
        setValeriaEnabled={setValeriaEnabled}
        valeriaVolume={valeriaVolume}
        setValeriaVolume={setHookVolume}
        isSpeaking={isValentinaSpeaking}
        valeriaExpression={valeriaExpression}
      />

      {/* EFECTO 3D CON BÓVEDAS - Como en el resto de la página */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Grid 3D perspectiva con bóvedas */}
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

        {/* Bóvedas flotantes animadas - Efecto 3D */}
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

        {/* Partículas de conexión 3D */}
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

        {/* Líneas de conexión 3D */}
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

        {/* Capa de desenfoque para profundidad */}
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
                {phase === "intro" && renderWelcome()}
                {phase === "calibration" && renderCalibration()}
                {phase === "test" &&
                  (isTransitioning ? <VakSkeleton /> : renderTest())}
                {phase === "parentdata" && renderParentData()}
                {phase === "result" && renderResults()}
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
