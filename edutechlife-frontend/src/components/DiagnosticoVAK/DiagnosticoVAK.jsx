import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Eye, Download, Brain, Sparkles, ArrowRight, Check, Volume, VolumeOff, RotateCcw, Video, Headphones, Activity, Target, Zap, Users, Globe, Cpu, Lightbulb, Wrench, ListOrdered, CheckSquare, CheckCircle2, Rocket, List, BookOpen, Mic, MessageCircle, Smile, Meh, Frown, Clock, Shield, User, Mail, Phone, Music, Star, Heart, AlertCircle, Search } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { speakTextConversational } from '../../utils/speech';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '../../contexts/StudentContext';
import useValentinaAgent from '../../hooks/useValentinaAgent';
import { getQuestionsByAge, getAgeGroupKey } from '../../data/vakQuestions';
import { VALENTINA_MESSAGES, getAgeGroup } from '../../utils/valentinaMessages';
import { safeStorage } from '../../utils/storage';
import './DiagnosticoVAK.css';

// Componente de Confetti
const Confetti = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
        <Sparkles size={64} strokeWidth={1} className="text-[#4DA8C4] opacity-50 animate-pulse" />
      </div>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#4DA8C4', '#66CCCC', '#B2D8E5'][i % 3],
            animation: `confetti-fall ${1 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s infinite`
          }}
        />
      ))}
    </div>
  );
};

// Componente de celebración
const Celebration = ({ active, styleName }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-6 flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
          <Sparkles size={32} strokeWidth={1.5} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[var(--color-petroleum)]">¡Completado!</h3>
          <p className="text-[var(--color-gray-500)]">Eres un aprendiz <span className="font-bold text-[var(--color-corporate)]">{styleName}</span></p>
        </div>
        <div className="text-5xl">🎊</div>
      </div>
    </div>
  );
};

// Mapeo de expresiones a iconos y colores EdutechLife
const EXPRESSION_CONFIG = {
  neutral: { color: '#4DA8C4', bgColor: '#4DA8C4/20' },
  happy: { color: '#66CCCC', bgColor: '#66CCCC/20' },
  excited: { color: '#4DA8C4', bgColor: '#4DA8C4/30' },
  thinking: { color: '#004B63', bgColor: '#004B63/15' },
  encouraging: { color: '#66CCCC', bgColor: '#66CCCC/25' },
  celebrating: { color: '#4DA8C4', bgColor: '#4DA8C4/30' },
  calm: { color: '#B2D8E5', bgColor: '#B2D8E5/20' },
  proud: { color: '#4DA8C4', bgColor: '#4DA8C4/25' },
  concerned: { color: '#004B63', bgColor: '#004B63/10' },
  curious: { color: '#66CCCC', bgColor: '#66CCCC/20' },
};

// Componentes de Valeria - Guía del Diagnóstico
const ValeriaControls = ({ 
  valeriaEnabled, 
  setValeriaEnabled, 
  valeriaVolume, 
  setValeriaVolume,
  isSpeaking,
  valeriaExpression
}) => {
  const config = EXPRESSION_CONFIG[valeriaExpression] || EXPRESSION_CONFIG.neutral;
  
  return (
    <div className="valeria-controls-bar">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3">
        <div className="valeria-logo">
          <div className="valeria-avatar-container">
            <div className={`valeria-avatar ${isSpeaking ? 'speaking' : ''}`}
              style={{ background: `linear-gradient(135deg, ${config.color}22, ${config.color}44)` }}>
              <Brain size={20} strokeWidth={2} style={{ color: config.color }} />
            </div>
            {isSpeaking && (
              <div className="valeria-avatar-pulse" style={{ borderColor: config.color }}></div>
            )}
          </div>
          <div className="valeria-logo-content">
            <span className="valeria-logo-text">Valeria</span>
            <span className="valeria-logo-subtitle">Psicóloga VAK</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isSpeaking && (
            <div className="valeria-speaking-indicator">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <span>Hablando...</span>
            </div>
          )}
          
          <button
            onClick={() => setValeriaEnabled(!valeriaEnabled)}
            className={`valeria-btn-toggle-premium ${!valeriaEnabled ? 'muted' : ''}`}
            title={valeriaEnabled ? "Silenciar voz" : "Activar voz"}
          >
            {valeriaEnabled ? <Volume className="valeria-icon-premium" /> : <VolumeOff className="valeria-icon-premium" />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={valeriaVolume}
            onChange={(e) => setValeriaVolume(parseFloat(e.target.value))}
            className="valeria-volume-slider"
            disabled={!valeriaEnabled}
            title="Volumen"
          />
          
          <span className="valeria-volume-label">
            {Math.round(valeriaVolume * 100)}%
          </span>
          
        </div>
      </div>
    </div>
  );
};

const MOOD_OPTIONS = [
  { value: 'happy', label: 'Bien', icon: 'Smile', message: '¡Qué genial que estás con buena energía! Vamos a pasarlo muy bien.' },
  { value: 'neutral', label: 'Regular', icon: 'Meh', message: 'Gracias por compartir. Estoy aquí para acompañarte en cada paso.' },
  { value: 'sad', label: 'No muy bien', icon: 'Frown', message: 'Entiendo cómo te sientes. Este diagnóstico te ayudará a conocerte mejor.' }
];

const STYLE_MAP = {
  visual: { 
    name: 'APRENDIZ VISUAL', 
    color: 'var(--color-corporate)', 
    bgGradient: 'linear-gradient(135deg, rgba(77, 168, 196, 0.15), rgba(77, 168, 196, 0.05))',
    description: 'Tu cerebro procesa mejor la información cuando la ves. Aprendes más fácil con imágenes, gráficos, colores y diagramas.',
    strategies: ['Usa colores y subrayados en tus notas', 'Crea mapas mentales y diagramas', 'Prefiere videos educativos', 'Usa flashcards con imágenes', 'Organiza en esquemas visuales'],
    icon: 'Video', // Icono más moderno y corporativo
    tip: 'Visiona el contenido antes de estudiarlo para mejor comprensión'
  },
  auditivo: { 
    name: 'APRENDIZ AUDITIVO', 
    color: 'var(--color-mint)', 
    bgGradient: 'linear-gradient(135deg, rgba(102, 204, 204, 0.15), rgba(102, 204, 204, 0.05))',
    description: 'Aprendes mejor escuchando y hablando. Retienes información a través de conversaciones y audio.',
    strategies: ['Graba y escucha tus notas', 'Explica en voz alto lo que aprendes', 'Escucha podcasts educativos', 'Participa en debates y discusiones', 'Usa grabadora para clases'],
    icon: 'Headphones', // Icono más moderno y corporativo
    tip: 'Graba tus notas y escúchalas en tus momentos de ocio'
  },
  kinestesico: { 
    name: 'APRENDIZ KINESTÉSICO', 
    color: 'var(--color-accent)', 
    bgGradient: 'linear-gradient(135deg, rgba(0, 194, 224, 0.15), rgba(0, 194, 224, 0.05))',
    description: 'Necesitas moverte y practicar para aprender. Tu mejor aprendizaje viene de la experiencia práctica.',
    strategies: ['Toma notas a mano', 'Haz pausas activas cada 25 minutos', 'Practica con ejercicios reales', 'Usa el cuerpo para memorizar', 'Aprende haciendo proyectos'],
    icon: 'Activity', // Icono más moderno y corporativo
    tip: 'Estudiar de pie o caminando mejora tu concentración'
  }
};

const buildResultsURL = (diag) => {
  if (!diag) return '';
  try {
    const base = 'https://edutechlife.co';
    const payload = encodeURIComponent(JSON.stringify({ 
      studentName: diag.studentName, 
      date: diag.date, 
      predominantStyle: diag.predominantStyle, 
      percentage: diag.percentage 
    }));
    const dataURL = `${base}/diagnosis/vak/results?payload=${payload}`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dataURL)}`;
    return qrURL;
  } catch (e) {
    return '';
  }
};

// Función para obtener el componente de icono basado en el nombre
const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'Eye': return Eye;
    case 'Video': return Video;
    case 'Headphones': return Headphones;
    case 'Activity': return Activity;
    case 'Sparkles': return Sparkles;
    case 'Rocket': return Rocket;
    case 'Music': return Music;
    case 'Volume': return Volume;
    case 'Wrench': return Wrench;
    case 'ListOrdered': return ListOrdered;
    case 'CheckSquare': return CheckSquare;
    case 'Users': return Users;
    case 'List': return List;
    case 'BookOpen': return BookOpen;
    case 'Mic': return Mic;
    case 'MessageCircle': return MessageCircle;
    case 'Target': return Target;
    case 'Zap': return Zap;
    case 'Globe': return Globe;
    case 'Cpu': return Cpu;
    case 'Lightbulb': return Lightbulb;
    default: return Video;
  }
};

const DiagnosticoVAK = ({ onNavigate }) => {
  const { studentInfo, updateStudentInfo } = useStudent();
  
  const [phase, setPhase] = useState('intro');
  const [studentName, setStudentName] = useState(studentInfo.name || '');
  const [studentAge, setStudentAge] = useState(studentInfo.age || '');
  const [studentEmail, setStudentEmail] = useState(studentInfo.email || '');
  const [studentPhone, setStudentPhone] = useState(studentInfo.phone || '');
  const [studentMood, setStudentMood] = useState(studentInfo.mood || '');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [diagnosis, setDiagnosis] = useState(studentInfo.diagnosis || null);
  const [date, setDate] = useState('');
  const [tempName, setTempName] = useState(studentInfo.name || '');
  const [tempAge, setTempAge] = useState(studentInfo.age || '');
  const [tempEmail, setTempEmail] = useState(studentInfo.email || '');
  const [tempPhone, setTempPhone] = useState(studentInfo.phone || '');
  const [tempMood, setTempMood] = useState(studentInfo.mood || '');
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedMoodOption, setSelectedMoodOption] = useState(() => {
    return MOOD_OPTIONS.find(m => m.value === studentInfo.mood) || null;
  });
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  
  // Estados para Valeria
  const [valeriaEnabled, setValeriaEnabled] = useState(true);
  const [valeriaVolume, setValeriaVolume] = useState(1.0);
  const [valentinaIntroComplete, setValentinaIntroComplete] = useState(false);
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);
  
  // Estados para datos del padre/tutor
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  
  // Habeas Data
  const [habeasDataAccepted, setHabeasDataAccepted] = useState(false);
  const [showHabeasModal, setShowHabeasModal] = useState(false);
  
  // Feedback de ánimo
  const [moodFeedbackText, setMoodFeedbackText] = useState('');
  const [showMoodFeedback, setShowMoodFeedback] = useState(false);
  
  // Preguntas por edad
  const [ageQuestions, setAgeQuestions] = useState(() => 
    getQuestionsByAge(parseInt(studentInfo.age) || 12)
  );
  
  const chartRef = useRef(null);
  const isChartInView = useInView(chartRef);
  const timerRef = useRef(null);
  const questionJustReadRef = useRef(false);
  const timeoutRefs = useRef([]);
  const setTimeoutSafe = (fn, delay) => {
    const id = setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter(t => t !== id);
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
    speakAsValentina
  } = useValentinaAgent({
    studentName: studentName,
    studentAge: parseInt(studentAge) || 12,
    studentMood,
    phase,
    currentQuestion,
    totalQuestions: ageQuestions.length,
    diagnosis,
    enabled: valeriaEnabled
  });

  // Efecto: Hablar al entrar en intro
  useEffect(() => {
    if (phase === 'intro' && valeriaEnabled) {
      const timer = setTimeout(() => {
        startWelcomeSequence(() => {
          // Cuando Valeria termina de hablar, habilitar el botón
          setValentinaIntroComplete(true);
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, valeriaEnabled]);

  // Efecto: Leer pregunta al entrar en fase test
  useEffect(() => {
    if (phase === 'test' && currentQuestion < ageQuestions.length && valeriaEnabled) {
      const q = ageQuestions[currentQuestion];
      readQuestionWithOptions(q.text, q.options, currentQuestion + 1, ageQuestions.length);
      questionJustReadRef.current = true;
    }
  }, [currentQuestion, phase, valeriaEnabled]);

  // Efecto: Detectar cuando Valeria termina de leer pregunta 3/6/9 para activar feedback
  useEffect(() => {
    if (!isValentinaSpeaking && questionJustReadRef.current && phase === 'test' && valeriaEnabled) {
      questionJustReadRef.current = false;
      const questionNum = currentQuestion + 1;
      if (questionNum === 3 || questionNum === 6 || questionNum === 9) {
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
    if (phase === 'result' && valeriaEnabled && diagnosis) {
      const timer = setTimeout(async () => {
        const age = parseInt(studentAge) || parseInt(diagnosis.studentAge) || 12;
        const message = VALENTINA_MESSAGES.all.resultsShort(
          diagnosis.studentName || studentName || 'Estudiante',
          diagnosis.predominantStyle || 'visual',
          diagnosis.percentage || 0,
          age
        );
        await speakAsValentina(message);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, valeriaEnabled, diagnosis]);

  useEffect(() => {
    if (phase === 'intro') {
      setDate(new Date().toLocaleDateString());
    }
  }, [phase]);

  // Efecto conversacional: Confirmar nombre y pedir edad
  useEffect(() => {
    if (phase === 'calibration' && studentName.length >= 2 && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await confirmNameAndAskAge(studentName);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [studentName, phase, valeriaEnabled]);

  // Efecto conversacional: Dar feedback cuando se selecciona el ánimo
  useEffect(() => {
    if (phase === 'calibration' && studentMood && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await giveMoodFeedback(studentMood, studentName);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [studentMood, phase, valeriaEnabled]);

  // Timer para mostrar tiempo en resultados
  useEffect(() => {
    if (phase === 'test') {
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
      timeoutRefs.current.forEach(id => clearTimeout(id));
      timeoutRefs.current = [];
    };
  }, []);

  // Persistencia de datos en localStorage
  useEffect(() => {
    // Cargar datos guardados al iniciar
    const savedData = safeStorage.getItem('edutechlife_vak_progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.phase && parsed.phase !== 'intro') {
          // Restaurar progreso si existe
          setPhase(parsed.phase || 'intro');
          setStudentName(parsed.studentName || '');
          setStudentAge(parsed.studentAge || ''); // Nuevo: cargar edad
          setStudentEmail(parsed.studentEmail || '');
          setStudentPhone(parsed.studentPhone || '');
          setStudentMood(parsed.studentMood || '');
          setCurrentQuestion(parsed.currentQuestion || 0);
          setAnswers(parsed.answers || []);
          setStartTime(parsed.startTime || null);
        }
      } catch (e) {

      }
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
      lastUpdate: Date.now()
    };
    safeStorage.setItem('edutechlife_vak_progress', JSON.stringify(progressData));
    
    // Mostrar indicador de guardado
    if (phase === 'test' || phase === 'calibration') {
      setShowSaveIndicator(true);
      setTimeoutSafe(() => setShowSaveIndicator(false), 1500);
    }
  }, [phase, studentName, studentAge, studentEmail, studentPhone, studentMood, currentQuestion, answers, startTime]);

  // Limpiar localStorage al completar el test
  const clearProgress = () => {
    safeStorage.removeItem('edutechlife_vak_progress');
  };

  // Alternar modo de alto contraste
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + C: Alternar contraste alto
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        toggleHighContrast();
      }
      // Escape: Volver al diagnóstico
      if (e.key === 'Escape' && onNavigate) {
        onNavigate('neuroentorno');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [highContrast, onNavigate]);

  const validateEmail = (email) => {
    if (!email) return true; // Email es opcional
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    if (valeriaEnabled && !valentinaIntroComplete) return;
    setPhase('calibration');
  };

  const handleStart = async () => {
    setPhase('calibration');
  };

  const submitCalibration = async () => {
    if (!studentName.trim() || !studentAge || !studentMood) return;
    
    const age = parseInt(studentAge);
    if (age < 6 || age > 17) {
      setError('La edad debe estar entre 6 y 17 años');
      return;
    }
    
    setStudentName(studentName.trim());
    setStudentAge(studentAge);
    setStartTime(Date.now());
    setElapsedTime(0);
    
    // Actualizar preguntas según la edad
    setAgeQuestions(getQuestionsByAge(age));
    
    // Actualizar información del estudiante en el contexto global
    updateStudentInfo({
      name: studentName.trim(),
      age: studentAge,
      mood: studentMood || 'neutral'
    });
    
    if (valeriaEnabled) {
      await transitionToTest(studentName.trim());
      setPhase('test');
      setCurrentQuestion(0);
    } else {
      setPhase('test');
      setCurrentQuestion(0);
    }
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
        nextAnswers.forEach(a => {
          if (a.type === 'visual') c.visual++;
          else if (a.type === 'auditivo') c.auditivo++;
          else if (a.type === 'kinestesico') c.kinestesico++;
        });
        
        let predominant = 'visual';
        let max = c.visual;
        if (c.auditivo > max) { predominant = 'auditivo'; max = c.auditivo; }
        if (c.kinestesico > max) { predominant = 'kinestesico'; max = c.kinestesico; }
        
        const style = STYLE_MAP[predominant];
        const res = {
          studentName: studentName || 'Estudiante',
          studentAge: studentAge || '',
          studentEmail: studentEmail,
          studentPhone: studentPhone,
          studentMood: studentMood,
          parentName: parentName || '',
          parentPhone: parentPhone || '',
          parentEmail: parentEmail || '',
          date: date,
          timeSpent: elapsedTime,
          counts: c,
          predominantStyle: predominant,
          styleDetails: style,
          percentage: Math.round((max / 10) * 100),
          answers: nextAnswers
        };
        
        setDiagnosis(res);
        
        // Actualizar diagnóstico en el contexto global
        updateStudentInfo({
          diagnosis: res
        });
        
        // Activar celebración antes de mostrar resultados
        setShowConfetti(true);
        setShowCelebration(true);
        
        // Limpiar progreso guardado
        clearProgress();
        
        setTimeoutSafe(() => {
          setShowConfetti(false);
          setShowCelebration(false);
          setPhase('parentdata');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const generatePDF = async () => {
    if (!diagnosis) {
      console.error('No hay diagnóstico disponible para PDF');
      setError('No hay información de diagnóstico para generar el PDF');
      return;
    }
    
    const el = document.getElementById('document-preview-content');
    if (!el) {
      console.error('No se encontró el elemento del documento preview');
      setError('Error interno: No se puede generar el PDF en este momento');
      return;
    }
    
    // Verificar que el elemento tenga contenido
    const contentLength = el.innerHTML.length;

    if (!contentLength || contentLength < 100) {
      console.error('El documento preview está vacío o es muy corto');
      setError('El contenido del PDF está vacío. Por favor, recarga la página e intenta de nuevo.');
      return;
    }
    
    // Verificar que el diagnóstico tenga los datos necesarios

    if (!diagnosis.styleDetails) {
      console.warn('styleDetails falta, recuperando desde STYLE_MAP...');
      const recoveredStyle = STYLE_MAP[diagnosis.predominantStyle];
      if (recoveredStyle) {
        const updatedDiagnosis = { ...diagnosis, styleDetails: recoveredStyle };
        setDiagnosis(updatedDiagnosis);
        // Esperar a que se actualice el estado
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    setPdfLoading(true);
    
    const fileName = `Diagnostico_VAK_${(diagnosis.studentName || 'estudiante').replace(/\s+/g, '_')}_${diagnosis.date || new Date().toISOString().split('T')[0]}`;
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true, 
        logging: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {

      await html2pdf().set(opt).from(el).save();

    } catch (e) {
      console.error('Error al generar PDF:', e);
      setError(`Error al generar PDF: ${e.message || 'Error desconocido'}`);
    } finally {
      setPdfLoading(false);
    }
  };

  const getMoodFeedback = () => {
    const mood = MOOD_OPTIONS.find(m => m.value === studentMood);
    return mood || MOOD_OPTIONS[1];
  };

  const getCaracteristicasEstilo = (style) => {
    const map = {
      visual: [
        'Aprende mejor viendo imágenes, gráficos y diagramas',
        'Prefiere mapas mentales, esquemas y resúmenes visuales',
        'Excelente memoria fotográfica para rostros y lugares',
        'Organizado, detallista y con buena percepción espacial',
        'Se distrae con ruidos fuertes o ambientes caóticos',
        'Disfruta el arte, el diseño y las presentaciones visuales',
        'Procesa información rápidamente cuando está bien presentada',
        'Prefiere leer instrucciones antes que escucharlas'
      ],
      auditivo: [
        'Aprende mejor escuchando explicaciones y participando en diálogos',
        'Prefiere debates, discusiones y dinámicas verbales',
        'Excelente memoria para melodías, ritmos y secuencias habladas',
        'Se expresa con claridad y fluidez verbal',
        'Disfruta la música, los podcasts y los audiolibros',
        'Puede distraerse con estímulos visuales excesivos',
        'Procesa información repitiendo en voz alta o grabando',
        'Tiene facilidad para aprender idiomas y expresión oral'
      ],
      kinestesico: [
        'Aprende mejor haciendo, tocando y experimentando físicamente',
        'Prefiere actividades prácticas, proyectos y experimentos',
        'Excelente coordinación motora y memoria muscular',
        'Necesita movimiento frecuente para mantener la concentración',
        'Disfruta los deportes, la danza y las manualidades',
        'Aprendizaje experiencial: recuerda lo que vive y siente',
        'Procesa información mientras camina o se mueve',
        'Tiene facilidad para trabajos que requieren destreza física'
      ]
    };
    return map[style] || map.visual;
  };

  const getTipsPadres = (style) => {
    const map = {
      visual: [
        'Crea un espacio de estudio visualmente organizado con colores y esquemas',
        'Utiliza calendarios visuales y listas de tareas con dibujos o iconos',
        'Refuerza el aprendizaje con documentales, infografías y videos educativos',
        'Anímalo a usar mapas mentales, cuadros sinópticos y resúmenes con colores',
        'Evita distracciones auditivas como música con letra o ruido ambiental',
        'Proporciona marcadores, post-its y herramientas de diseño visual',
        'Permite que decore y personalice su espacio de estudio'
      ],
      auditivo: [
        'Lee en voz alta los temas de estudio o pídele que te explique lo aprendido',
        'Graba las lecciones importantes para que pueda repasarlas después',
        'Utiliza podcasts educativos, audiolibros y canciones didácticas',
        'Fomenta discusiones y debates sobre temas escolares en casa',
        'Crea rimas, canciones o mnemotecnias para memorizar conceptos',
        'Permítele estudiar con música instrumental de fondo si lo necesita',
        'Anímalo a participar en grupos de estudio y exposiciones orales'
      ],
      kinestesico: [
        'Permite pausas activas frecuentes cada 20-25 minutos de estudio',
        'Utiliza experimentos prácticos, maquetas y proyectos manuales',
        'Anímalo a caminar, moverse o usar un balance board mientras repasa',
        'Proporciona materiales manipulables como plastilina, rompecabezas o kits',
        'Integra el movimiento en la rutina: estudiar de pie o con intervalos activos',
        'Usa juegos de rol, simulaciones y actividades al aire libre para enseñar',
        'Permite que tome notas a mano en lugar de escribir en computadora'
      ]
    };
    return map[style] || map.visual;
  };

  const getCarrerasRecomendadas = (style) => {
    const map = {
      visual: ['Diseño Gráfico y Comunicación Visual', 'Arquitectura y Urbanismo', 'Cine, Fotografía y Producción Audiovisual', 'Desarrollo Web, UX/UI y Diseño Digital', 'Ilustración, Animación y Arte Digital', 'Marketing Visual y Publicidad', 'Ingeniería en Sistemas (interfaces visuales)', 'Diseño de Interiores y Decoración'],
      auditivo: ['Música, Composición y Producción Musical', 'Periodismo y Comunicación Social', 'Derecho y Ciencias Jurídicas', 'Psicología Clínica y Educativa', 'Docencia y Pedagogía', 'Traducción e Interpretación de Idiomas', 'Locución, Radio y Medios Audiovisuales', 'Terapia del Lenguaje y Foniatría'],
      kinestesico: ['Ingeniería Civil, Mecánica o Industrial', 'Medicina, Cirugía y Enfermería', 'Ciencias del Deporte y Entrenamiento Físico', 'Gastronomía y Artes Culinarias', 'Artes Escénicas: Teatro, Danza y Circo', 'Diseño Industrial y Fabricación Digital', 'Fisioterapia y Rehabilitación Física', 'Arquitectura Paisajista y Construcción']
    };
    return map[style] || map.visual;
  };

  // Generar informe profesional de Valeria para el diagnóstico
  const getValentinaCommentary = () => {
    if (!diagnosis) return '';
    
    const age = parseInt(diagnosis.studentAge) || parseInt(studentAge);
    if (!age || isNaN(age)) return '';
    
    let ageGroup = 'teen';
    if (age >= 6 && age <= 10) ageGroup = 'child';
    else if (age >= 11 && age <= 14) ageGroup = 'preteen';
    
    const style = diagnosis.predominantStyle;
    const percentage = diagnosis.percentage;
    const name = diagnosis.studentName || studentName || 'Estudiante';
    const counts = diagnosis.counts || { visual: 0, auditivo: 0, kinestesico: 0 };
    
    const styleNames = {
      visual: 'VISUAL',
      auditivo: 'AUDITIVO',
      kinestesico: 'KINESTÉSICO'
    };

    const buildReport = (styleKey) => {
      const styleName = styleNames[styleKey];
      const secondPlace = Object.entries(counts)
        .filter(([k]) => k !== styleKey)
        .sort(([,a], [,b]) => b - a)[0];
      const secondName = secondPlace ? styleNames[secondPlace[0]] : '';
      const secondScore = secondPlace ? secondPlace[1] : 0;

      const reportSections = {
        visual: {
          child: [
            `Informe Psicopedagógico — ${name}`,
            `Después de aplicar y analizar el Diagnóstico VAK, he identificado que tu estilo de aprendizaje predominante es VISUAL con un ${percentage}% de correspondencia. Esto significa que tu cerebro procesa y retiene información de manera más eficiente cuando utilizas el canal visual: imágenes, colores, diagramas y organizadores gráficos.`,
            `Puntajes obtenidos: Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10 — Kinestésico ${counts.kinestesico}/10. Tu segundo canal más desarrollado es ${secondName} con ${secondScore}/10, lo que indica que también puedes beneficiarte de estrategias complementarias de ese estilo.`,
            `Fortalezas identificadas: Excelente capacidad para recordar información presentada visualmente; habilidad para organizar ideas mediante esquemas y mapas conceptuales; facilidad para detectar detalles y patrones; buena orientación espacial y sentido estético.`,
            `Como psicóloga educativa especialista en metodología VAK, te recomiendo priorizar estas estrategias: utiliza colores y símbolos en tus apuntes, crea mapas mentales antes de cada evaluación, transforma texto en diagramas de flujo, y complementa tu estudio con videos educativos e infografías.`,
            `Confío en que aplicando estas recomendaciones potenciarás significativamente tu rendimiento académico. Tu perfil visual es una fortaleza enorme en un mundo cada vez más gráfico y digital. ¡Adelante!`
          ],
          preteen: [
            `Informe Psicopedagógico — ${name}`,
            `Tras aplicar el Diagnóstico VAK y analizar detalladamente tus respuestas, determino que tu estilo de aprendizaje predominante es VISUAL con un ${percentage}% de consistencia. Procesas mejor la información cuando puedes verla representada gráficamente: imágenes, esquemas, colores y organizadores visuales facilitan tu comprensión y memoria.`,
            `Desglose de resultados: canal Visual ${counts.visual}/10, Auditivo ${counts.auditivo}/10, Kinestésico ${counts.kinestesico}/10. Tu perfil muestra un ${secondName} como canal secundario con ${secondScore}/10, lo que enriquece tu versatilidad para aprender en diferentes contextos.`,
            `Fortalezas detectadas: Piensas en imágenes y recuerdas con facilidad lo que has visto; tienes buena capacidad de síntesis visual; eres observador y detallista; aprendes rápidamente con demostraciones visuales; disfrutas organizar información de manera estructurada.`,
            `Recomendaciones basadas en evidencia: diseña tus apuntes con colores y jerarquía visual, utiliza herramientas digitales como Canva o Notion para organizar información, transforma conceptos complejos en dibujos o diagramas, y practica con flashcards visuales. Alterna con estrategias auditivas como explicar en voz alta lo que aprendes.`,
            `Tu perfil visual es una ventaja competitiva en tu formación académica. Implementa estas estrategias de manera constante y verás una mejora notable en tu rendimiento. Estoy aquí para acompañarte en este proceso.`
          ],
          teen: [
            `Informe Psicopedagógico VAK — ${name}`,
            `Tras aplicar el instrumento de Diagnóstico VAK (Visual-Auditivo-Kinestésico) y realizar el análisis cuantitativo y cualitativo de tus respuestas, determino que tu perfil de aprendizaje predominante es VISUAL con un ${percentage}% de correspondencia sobre el total de ítems evaluados. Este resultado indica que tu sistema de representación primario procesa información de manera más eficiente a través del canal visual, privilegiando estímulos como imágenes, gráficos, diagramas, mapas conceptuales y códigos cromáticos.`,
            `Resultados cuantitativos: canal Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10 — Kinestésico ${counts.kinestesico}/10. Se observa que tu canal secundario es ${secondName} con ${secondScore}/10, lo que sugiere que posees flexibilidad cognitiva para beneficiarte de estrategias multimodales. La diferencia entre tu canal primario y los secundarios refleja una clara especialización en el procesamiento visual de la información.`,
            `Fortalezas cognitivas identificadas: capacidad sobresaliente para sintetizar información compleja en representaciones visuales; memoria fotográfica para detalles y patrones; habilidad para establecer relaciones conceptuales mediante organizadores gráficos; pensamiento espacial desarrollado; preferencia por el orden visual y la estética en la presentación de información.`,
            `Recomendaciones estratégicas fundamentadas en neuroeducación: implementa la técnica de Cornell con códigos de color para la toma de apuntes; utiliza software de mapas mentales como XMind o MindMeister para estructurar conocimientos; complementa tu estudio con infografías, tutoriales visuales y documentales; practica la conversión de información textual a diagramas de flujo o cuadros sinópticos. Integra estrategias de tu canal secundario para maximizar la retención.`,
            `Como especialista en psicología educativa con enfoque VAK, concluyo que tu perfil visual constituye una ventaja significativa en entornos académicos que demandan procesamiento simbólico y representación gráfica. La implementación sistemática de estas recomendaciones optimizará tu rendimiento y facilitará un aprendizaje más profundo y significativo.`
          ]
        },
        auditivo: {
          child: [
            `Informe Psicopedagógico — ${name}`,
            `¡Qué emoción! Después de completar el Diagnóstico VAK, he descubierto que tu estilo de aprendizaje predominante es AUDITIVO con un ${percentage}% de correspondencia. Esto quiere decir que tu cerebro aprende mejor cuando escuchas, hablas y trabajas con sonidos y palabras. ¡Tu oído es tu superpoder!`,
            `Resultados: Auditivo ${counts.auditivo}/10 — Visual ${counts.visual}/10 — Kinestésico ${counts.kinestesico}/10. Tu segundo canal más fuerte es ${secondName} con ${secondScore}/10, lo que significa que también puedes aprender combinando con imágenes o movimiento.`,
            `Tus fortalezas: Tienes una memoria excelente para canciones, rimas y explicaciones; te expresas muy bien y te gusta participar en clase; aprendes fácilmente cuando alguien te explica; disfrutas los cuentos y las conversaciones; eres bueno para recordar instrucciones verbales.`,
            `Te recomiendo: graba tus clases y escúchalas después, explica en voz alta lo que aprendiste, escucha podcasts educativos, inventa canciones para memorizar, y participa en grupos de estudio donde puedas hablar y discutir.`,
            `Tu forma de aprender es muy valiosa. Usa estos consejos y verás cómo todo se vuelve más fácil. ¡Estoy muy orgullosa de ti!`
          ],
          preteen: [
            `Informe Psicopedagógico — ${name}`,
            `Tras analizar tus respuestas en el Diagnóstico VAK, determino que tu estilo de aprendizaje predominante es AUDITIVO con un ${percentage}% de correspondencia. Eres una persona que procesa y retiene información de manera óptima a través del canal auditivo, aprovechando el sonido, la palabra hablada y las explicaciones verbales.`,
            `Desglose de puntajes: Auditivo ${counts.auditivo}/10 — Visual ${counts.visual}/10 — Kinestésico ${counts.kinestesico}/10. Tu segundo canal más desarrollado es ${secondName} con ${secondScore}/10, lo que amplía tus posibilidades de aprendizaje cuando combinas estrategias.`,
            `Fortalezas identificadas: Excelente memoria para secuencias verbales y melodías; facilidad para expresar ideas de forma clara y organizada; buena capacidad para seguir instrucciones orales; aprendes eficazmente en discusiones y debates; disfrutas explorar temas a través de podcasts y audiolibros.`,
            `Estrategias recomendadas: utiliza grabadoras de voz para registrar tus clases y repasarlas, participa activamente en debates y exposiciones, estudia en voz alta explicando los temas como si enseñaras a alguien más, escucha contenido educativo relevante y coméntalo con compañeros. Complementa con resúmenes escritos para reforzar.`,
            `Tu perfil auditivo es una fortaleza en entornos colaborativos y de diálogo. Aplicando estas estrategias potenciarás tu aprendizaje y te sentirás más seguro en tu proceso académico. Cuenta conmigo para seguir acompañándote.`
          ],
          teen: [
            `Informe Psicopedagógico VAK — ${name}`,
            `Tras aplicar el instrumento de Diagnóstico VAK (Visual-Auditivo-Kinestésico) y realizar el análisis cuantitativo y cualitativo de tus respuestas, determino que tu perfil de aprendizaje predominante es AUDITIVO con un ${percentage}% de correspondencia. Este resultado indica que tu sistema de representación primario procesa información de manera más eficiente a través del canal auditivo, privilegiando estímulos como la palabra hablada, las explicaciones verbales, los debates y los recursos sonoros.`,
            `Resultados cuantitativos: Auditivo ${counts.auditivo}/10 — Visual ${counts.visual}/10 — Kinestésico ${counts.kinestesico}/10. Se observa que tu canal secundario es ${secondName} con ${secondScore}/10, lo que sugiere que posees flexibilidad cognitiva para beneficiarte de estrategias multimodales complementarias.`,
            `Fortalezas cognitivas identificadas: capacidad sobresaliente para procesar y retener información verbal; habilidad para articular ideas con claridad y estructura lógica; memoria auditiva desarrollada para secuencias, ritmos y patrones sonoros; facilidad para el aprendizaje de idiomas y expresión oral; pensamiento dialéctico desarrollado a través de la discusión y el debate.`,
            `Recomendaciones estratégicas fundamentadas en neuroeducación: implementa la técnica de grabación y repaso auditivo para consolidar contenidos; participa activamente en grupos de discusión y seminarios; utiliza la técnica de Feynman (explicar en voz alta como si enseñaras) para verificar comprensión; complementa tu estudio con podcasts académicos y audiolibros especializados; integra estrategias visuales complementarias como esquemas para reforzar la retención.`,
            `Como especialista en psicología educativa con enfoque VAK, concluyo que tu perfil auditivo constituye una ventaja significativa en entornos académicos que demandan procesamiento verbal, expresión oral y pensamiento crítico-discursivo. La implementación sistemática de estas recomendaciones optimizará tu rendimiento y facilitará un aprendizaje más profundo y significativo.`
          ]
        },
        kinestesico: {
          child: [
            `Informe Psicopedagógico — ${name}`,
            `¡Qué increíble! Después de hacer el Diagnóstico VAK, descubrí que tu estilo de aprendizaje predominante es KINESTÉSICO con un ${percentage}% de correspondencia. ¡Eres un aprendiz que necesita moverse, tocar y experimentar! Tu cuerpo es parte importante de cómo aprendes.`,
            `Puntajes obtenidos: Kinestésico ${counts.kinestesico}/10 — Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10. Tu segundo canal más desarrollado es ${secondName} con ${secondScore}/10.`,
            `Tus fortalezas: Aprendes mejor cuando haces las cosas con tus propias manos; tienes mucha energía y coordinación; eres muy bueno para los deportes y actividades físicas; recuerdas mejor lo que has vivido y practicado; eres creativo y te gusta construir cosas.`,
            `Te recomiendo: toma notas a mano en lugar de escribir en computadora, haz pausas para moverte cada 20 minutos, estudia caminando o de pie, usa materiales como plastilina o maquetas para entender conceptos, y convierte el estudio en un juego o experimento.`,
            `¡Tu forma de aprender es muy especial! Aprovecha estas estrategias y verás lo fácil que puede ser estudiar cuando usas todo tu cuerpo. ¡Sigue brillando!`
          ],
          preteen: [
            `Informe Psicopedagógico — ${name}`,
            `Tras analizar tus respuestas en el Diagnóstico VAK, determino que tu estilo de aprendizaje predominante es KINESTÉSICO con un ${percentage}% de correspondencia. Eres una persona que necesita la experiencia práctica y el movimiento para procesar y retener información de manera efectiva.`,
            `Desglose de puntajes: Kinestésico ${counts.kinestesico}/10 — Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10. Tu canal secundario es ${secondName} con ${secondScore}/10, lo que enriquece tu perfil de aprendizaje.`,
            `Fortalezas identificadas: Excelente coordinación y memoria muscular; facilidad para aprender mediante experimentación y práctica directa; alta energía y capacidad de concentración en actividades físicas; pensamiento creativo aplicado a la resolución de problemas; aprendizaje significativo a través de experiencias concretas.`,
            `Estrategias recomendadas: toma notas escritas a mano para activar la memoria muscular, realiza pausas activas cada 20-25 minutos, estudia en movimiento (caminando o de pie), utiliza materiales manipulables como maquetas o kits de experimentos, y aplica lo aprendido en proyectos prácticos. Complementa con resúmenes visuales para reforzar.`,
            `Tu perfil kinestésico es una fortaleza en contextos que requieren aplicación práctica y resolución activa de problemas. Implementa estas recomendaciones y transformarás tu experiencia de aprendizaje. Estoy aquí para apoyarte.`
          ],
          teen: [
            `Informe Psicopedagógico VAK — ${name}`,
            `Tras aplicar el instrumento de Diagnóstico VAK (Visual-Auditivo-Kinestésico) y realizar el análisis cuantitativo y cualitativo de tus respuestas, determino que tu perfil de aprendizaje predominante es KINESTÉSICO con un ${percentage}% de correspondencia. Este resultado indica que tu sistema de representación primario procesa información de manera más eficiente a través del canal kinestésico, privilegiando la experiencia práctica, el movimiento, la manipulación de objetos y el aprendizaje basado en la acción.`,
            `Resultados cuantitativos: Kinestésico ${counts.kinestesico}/10 — Visual ${counts.visual}/10 — Auditivo ${counts.auditivo}/10. Se observa que tu canal secundario es ${secondName} con ${secondScore}/10, lo que sugiere que posees flexibilidad cognitiva para complementar tu aprendizaje con estrategias multimodales.`,
            `Fortalezas cognitivas identificadas: capacidad sobresaliente para el aprendizaje experiencial y la aplicación práctica de conocimientos; excelente coordinación motora y memoria procedimental; facilidad para resolver problemas mediante ensayo y error; pensamiento concreto aplicado a situaciones reales; alta resistencia y concentración en actividades que involucran movimiento y manipulación.`,
            `Recomendaciones estratégicas fundamentadas en neuroeducación: implementa la técnica de estudio activo alternando períodos de 25 minutos de trabajo con 5 minutos de movimiento; utiliza métodos de aprendizaje basados en proyectos y simulaciones prácticas; transforma conceptos abstractos en experiencias concretas mediante maquetas, laboratorios o prototipos; estudia en espacios que permitan movimiento; complementa con organizadores visuales y discusiones orales para integrar los canales secundarios.`,
            `Como especialista en psicología educativa con enfoque VAK, concluyo que tu perfil kinestésico constituye una ventaja significativa en entornos de aprendizaje activo y aplicación práctica del conocimiento. La implementación sistemática de estas recomendaciones optimizará tu rendimiento y facilitará un aprendizaje más profundo, significativo y duradero.`
          ]
        }
      };

      return reportSections[styleKey]?.[ageGroup]?.join('\n\n') || 
        `Hola ${name}, soy Valeria, psicóloga educativa especialista en VAK. Tras analizar tus respuestas, he identificado que tu estilo de aprendizaje predominante es ${styleName} con un ${percentage}% de correspondencia. Tus resultados completos son: Visual ${counts.visual}/10, Auditivo ${counts.auditivo}/10, Kinestésico ${counts.kinestesico}/10. Te recomiendo implementar las estrategias detalladas en este informe para optimizar tu proceso de aprendizaje.`;
    };

    return buildReport(style);
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
            <h2 className="text-xl font-bold text-[#004B63]">¿Qué es el diagnóstico VAK?</h2>
          </div>
          <p className="text-[#004B63]/80 leading-relaxed text-base">
            El diagnóstico <span className="font-bold text-[#4DA8C4]">VAK</span> identifica tu estilo de aprendizaje predominante: 
            <span className="font-semibold"> Visual</span>, 
            <span className="font-semibold"> Auditivo</span> o 
            <span className="font-semibold"> Kinestésico</span>. 
            Conocer tu estilo te permite recibir <span className="font-semibold text-[#4DA8C4]">estrategias personalizadas</span> para mejorar tu rendimiento académico.
          </p>
        </motion.div>

        {/* SECCIÓN: LOS 3 ESTILOS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-[#004B63] mb-4 text-center">Los 3 Estilos de Aprendizaje</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* VISUAL */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#4DA8C4] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mb-4 mx-auto">
                <Eye size={32} strokeWidth={1.5} className="text-[#4DA8C4]" />
              </div>
              <h3 className="text-lg font-bold text-[#4DA8C4] text-center mb-3 uppercase tracking-wide">Visual</h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                Aprende mejor viendo
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Imágenes y videos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Mapas mentales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Diagramas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Colores y esquemas</span>
                </div>
              </div>
            </div>

            {/* AUDITIVO */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#66CCCC] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#66CCCC]/10 flex items-center justify-center mb-4 mx-auto">
                <Headphones size={32} strokeWidth={1.5} className="text-[#66CCCC]" />
              </div>
              <h3 className="text-lg font-bold text-[#66CCCC] text-center mb-3 uppercase tracking-wide">Auditivo</h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                Aprende mejor escuchando
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#66CCCC] shrink-0" />
                  <span>Podcasts y audio</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#66CCCC] shrink-0" />
                  <span>Debates y discussions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#66CCCC] shrink-0" />
                  <span>Explicar en voz alta</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#66CCCC] shrink-0" />
                  <span>Música y ritmos</span>
                </div>
              </div>
            </div>

            {/* KINESTÉSICO */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#4DA8C4] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mb-4 mx-auto">
                <Activity size={32} strokeWidth={1.5} className="text-[#4DA8C4]" />
              </div>
              <h3 className="text-lg font-bold text-[#4DA8C4] text-center mb-3 uppercase tracking-wide">Kinestésico</h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                Aprende mejor haciendo
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Experimentos prácticos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Movimiento y pausas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Proyectos manuales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#4DA8C4] shrink-0" />
                  <span>Juegos de roles</span>
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
          <h2 className="text-xl font-bold text-white mb-6 text-center">¿Qué recibirás?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">Diagnóstico Personalizado</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Lightbulb size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">Estrategias Adaptadas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Download size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">Informe PDF</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Zap size={24} strokeWidth={2} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm">Tips Prácticos</p>
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
          <h2 className="text-xl font-bold text-[#004B63] mb-6 text-center">¿Qué esperar?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <Clock size={28} strokeWidth={2} className="text-[#4DA8C4]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">3 min</p>
              <p className="text-xs text-[#004B63]/60">Duración</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#66CCCC]/10 flex items-center justify-center mx-auto mb-2">
                <List size={28} strokeWidth={2} className="text-[#66CCCC]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">10</p>
              <p className="text-xs text-[#004B63]/60">Preguntas</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <Target size={28} strokeWidth={2} className="text-[#4DA8C4]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">100%</p>
              <p className="text-xs text-[#004B63]/60">Personalizado</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={28} strokeWidth={2} className="text-[#4DA8C4]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">100%</p>
              <p className="text-xs text-[#004B63]/60">Confidencial</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              No hay respuestas incorrectas
            </span>
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              Responde honestamente
            </span>
            <span className="inline-flex items-center gap-2 bg-[#B2D8E5]/30 text-[#004B63] px-4 py-2 rounded-full">
              <Check size={16} strokeWidth={2} className="text-[#4DA8C4]" />
              Valeria te guiará paso a paso
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
                ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:shadow-2xl'
                : 'bg-[#B2D8E5] cursor-not-allowed'
            }`}
          >
            <span className="text-lg font-bold text-white flex items-center justify-center gap-3">
              {valentinaIntroComplete ? (
                <>
                  <Rocket size={24} strokeWidth={2} />
                  Comenzar Diagnóstico
                </>
              ) : (
                <>
                  <Volume size={24} strokeWidth={2} className="animate-pulse" />
                  Esperando a Valeria...
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
          Desarrollado por <span className="font-semibold text-[#4DA8C4]">EdutechLife</span>
        </motion.p>
      </motion.div>
    </div>
  );

  const handleMoodSelect = (moodValue) => {
    setStudentMood(moodValue);
    const mensajes = {
      happy: '¡Qué alegría verte así! Vamos a pasarlo muy bien con este diagnóstico.',
      neutral: 'Gracias por compartir cómo te sientes. Estoy aquí para guiarte.',
      sad: 'Entiendo que no te sientas del todo bien. Este diagnóstico te ayudará a conocerte mejor y descubrirás cómo aprender de la forma que más te gusta. ¡Vamos juntos!'
    };
    setMoodFeedbackText(mensajes[moodValue] || mensajes.neutral);
    setShowMoodFeedback(true);
    setTimeoutSafe(() => setShowMoodFeedback(false), 4000);
  };

  const renderHabeasDataModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowHabeasModal(false)}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center">
              <Shield size={20} strokeWidth={2} className="text-[#4DA8C4]" />
            </div>
            <h2 className="text-lg font-bold text-[#004B63]">Habeas Data</h2>
          </div>
          <button onClick={() => setShowHabeasModal(false)} className="text-[#004B63]/40 hover:text-[#004B63]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div className="space-y-4 text-sm text-[#004B63]/80">
          <div className="bg-[#B2D8E5]/20 rounded-2xl p-4">
            <h3 className="font-bold text-[#004B63] mb-2">POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</h3>
            <p className="mb-2"><span className="font-semibold">EDUTECHLIFE S.A.S.</span></p>
            <p className="text-xs text-[#004B63]/60">De acuerdo con la Ley 1581 de 2012 de la República de Colombia</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">1. Responsable del Tratamiento</h4>
            <p>EdutechLife S.A.S., con domicilio en Colombia. Correo de contacto: protecciondedatos@edutechlife.com</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">2. Finalidad del Tratamiento</h4>
            <p>Los datos personales recolectados (nombre, edad, correo electrónico, teléfono) serán utilizados exclusivamente para:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Generar el diagnóstico de estilo de aprendizaje VAK.</li>
              <li>Enviar el informe de resultados al correo electrónico registrado.</li>
              <li>Fines estadísticos anonimizados para la mejora continua del servicio.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">3. Derechos del Titular</h4>
            <p>Como titular de los datos, tienes derecho a:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Conocer, actualizar y rectificar tus datos personales.</li>
              <li>Solicitar prueba de la autorización otorgada.</li>
              <li>Ser informado sobre el uso dado a tus datos.</li>
              <li>Revocar la autorización en cualquier momento.</li>
              <li>Acceder de forma gratuita a tus datos personales.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">4. Atención de Consultas y Reclamos</h4>
            <p>Para cualquier consulta o reclamo relacionado con el tratamiento de tus datos personales, puedes contactarnos a través de:</p>
            <p className="mt-1">Correo: protecciondedatos@edutechlife.com</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#004B63] mb-1">5. Vigencia</h4>
            <p>Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades descritas y de acuerdo con las disposiciones legales aplicables.</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setHabeasDataAccepted(true);
            setShowHabeasModal(false);
          }}
          className="w-full mt-6 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl py-3 font-bold text-sm hover:shadow-lg transition-all"
        >
          Aceptar y continuar
        </button>
      </motion.div>
    </div>
  );

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
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-md text-center relative z-10"
        style={{ transformStyle: 'preserve-3d' }}
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
            Cuéntame sobre ti
          </h1>
          <p className="text-sm text-[#004B63]/70 leading-relaxed mt-2">
            Completa tus datos para personalizar tu diagnóstico
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
            Tu nombre
          </label>
          <div className="relative">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Escribe tu nombre completo"
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
            Tu edad
          </label>
          <div className="relative">
            <input
              type="number"
              min="6"
              max="17"
              value={studentAge}
              onChange={(e) => setStudentAge(e.target.value)}
              placeholder="Entre 6 y 17 años"
              className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
            />
          </div>
        </motion.div>

        {/* Selector de Ánimo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-3 block text-left">¿Cómo te sientes hoy?</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'happy', label: 'Bien', icon: Smile },
              { value: 'neutral', label: 'Regular', icon: Meh },
              { value: 'sad', label: 'No muy bien', icon: Frown }
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
                      ? 'bg-[#4DA8C4]/10 ring-2 ring-[#4DA8C4] shadow-lg'
                      : 'bg-white/80 border-2 border-[#B2D8E5]/30 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                    studentMood === mood.value ? 'bg-[#4DA8C4]/20' : 'bg-[#4DA8C4]/5'
                  }`}>
                    <IconComponent size={24} strokeWidth={2} className={
                      studentMood === mood.value ? 'text-[#4DA8C4]' : 'text-[#4DA8C4]'
                    } />
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    studentMood === mood.value ? 'text-[#004B63]' : 'text-[#004B63]/60'
                  }`}>{mood.label}</span>
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
                Acepto las <span className="font-semibold text-[#4DA8C4]">políticas de tratamiento de datos personales</span> de EdutechLife.
              </p>
              <button
                onClick={() => setShowHabeasModal(true)}
                className="text-xs text-[#4DA8C4] font-medium hover:underline mt-1"
              >
                Ver documento Habeas Data
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
            whileHover={studentName.trim() && studentAge && studentMood && habeasDataAccepted ? { scale: 1.02 } : {}}
            whileTap={studentName.trim() && studentAge && studentMood && habeasDataAccepted ? { scale: 0.98 } : {}}
            onClick={submitCalibration}
            disabled={!studentName.trim() || !studentAge || !studentMood || !habeasDataAccepted}
            className={`w-full rounded-2xl py-4 px-6 shadow-xl transition-all ${
              studentName.trim() && studentAge && studentMood && habeasDataAccepted
                ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] hover:shadow-2xl'
                : 'bg-[#B2D8E5] cursor-not-allowed'
            }`}
          >
            <span className={`text-lg font-bold flex items-center justify-center gap-2 ${
              studentName.trim() && studentAge && studentMood && habeasDataAccepted ? 'text-white' : 'text-[#004B63]/50'
            }`}>
              Iniciar Diagnóstico
              <ArrowRight size={20} strokeWidth={2} />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modal Habeas Data */}
      {showHabeasModal && renderHabeasDataModal()}
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
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pregunta</div>
          <div className="bg-[#66CCCC] text-white rounded-full px-3 py-1 text-xs font-semibold">
            {currentQuestion + 1} / {ageQuestions.length}
          </div>
        </div>

        {/* Barra de progreso fina */}
        <div className="mb-8">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
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
                ¡Quiero saber cómo voy!
              </motion.button>
            </div>
          )}

          {/* Opciones de Respuesta - Diseño Soft Outline / Minimalist */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {question.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const IconComponent = typeof opt.icon === 'string' ? getIconComponent(opt.icon) : opt.icon;
              
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={isValentinaSpeaking || feedbackPending ? {} : { scale: 1.01, x: 5 }}
                  whileTap={isValentinaSpeaking || feedbackPending ? {} : { scale: 0.99 }}
                  onClick={() => !isValentinaSpeaking && !feedbackPending && handleAnswer(opt)}
                  disabled={isValentinaSpeaking || feedbackPending}
                  className={`w-full text-left p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 group relative overflow-hidden ${
                    isValentinaSpeaking || feedbackPending
                      ? 'bg-gray-100/50 border-gray-200 cursor-not-allowed opacity-60' 
                      : 'bg-white/80 border-gray-100 hover:border-[#4DA8C4]'
                  }`}
                >
                  {/* Efecto de fondo sutil al hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4DA8C4]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    {/* Letra de la opción - Estilo moderno y limpio */}
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center group-hover:bg-[#4DA8C4]/20 transition-all">
                      <span className="text-base font-bold text-[#4DA8C4]">{letter}</span>
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
                  readQuestionWithOptions(question.text, question.options, currentQuestion + 1, ageQuestions.length);
                }
              }}
              disabled={isValentinaSpeaking || feedbackPending}
              className="text-[#4DA8C4] text-xs font-medium uppercase tracking-wider flex items-center gap-2 hover:text-[#66CCCC] transition-colors px-4 py-2 rounded-full hover:bg-[#4DA8C4]/5"
              title="Escuchar la pregunta de nuevo"
            >
              <RotateCcw size={16} strokeWidth={2} />
              <span>Repetir pregunta</span>
            </button>
          </div>
        </motion.div>

        {/* Indicador de tiempo */}
        <div className="text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Tiempo transcurrido: {formatTime(elapsedTime)}</span>
        </div>
      </div>
    );
  };

  const renderParentData = () => {
    const isValid = parentName.trim() && parentPhone.trim() && parentEmail.trim() && validateEmail(parentEmail);
    
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
            <h1 className="text-2xl font-extrabold text-[#004B63] mb-2">¡Casi terminamos!</h1>
            <p className="text-sm text-[#004B63]/70 leading-relaxed">
              Completa los datos del acudiente para enviar los resultados de tu diagnóstico VAK
            </p>
          </motion.div>
          
          {/* Form */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
                <User size={14} strokeWidth={2} className="inline mr-1 text-[#4DA8C4]" />
                Nombre del acudiente
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Nombre completo del padre o tutor"
                className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
              />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
                <Phone size={14} strokeWidth={2} className="inline mr-1 text-[#4DA8C4]" />
                Teléfono de contacto
              </label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="Ej: 300 123 4567"
                className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
              />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="text-xs font-medium text-[#004B63]/60 uppercase tracking-wider mb-2 block">
                <Mail size={14} strokeWidth={2} className="inline mr-1 text-[#4DA8C4]" />
                Correo electrónico
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-2xl border-2 border-[#B2D8E5]/50 bg-white px-5 py-3.5 text-base font-medium text-[#004B63] placeholder-[#004B63]/30 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-[#4DA8C4] transition-all shadow-md"
              />
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
                    parentEmail: parentEmail.trim()
                  });
                  setPhase('result');
                }
              }}
              disabled={!isValid}
              className={`w-full rounded-2xl py-4 px-6 shadow-xl transition-all font-bold text-lg ${
                isValid
                  ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white hover:shadow-2xl'
                  : 'bg-[#B2D8E5] text-[#004B63]/50 cursor-not-allowed'
              }`}
            >
              Ver mis resultados
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
          No hay resultados disponibles.
        </div>
      );
    }
    
    const qrUrl = buildResultsURL(diagnosis);
    const StyleIcon = getIconComponent(diagnosis.styleDetails?.icon || 'Eye');
    const moodFeedback = getMoodFeedback();
    
    const radarData = [
      { subject: 'Visual', A: diagnosis.counts?.visual || 0, fullMark: 10 },
      { subject: 'Auditivo', A: diagnosis.counts?.auditivo || 0, fullMark: 10 },
      { subject: 'Kinestésico', A: diagnosis.counts?.kinestesico || 0, fullMark: 10 },
    ];
    
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Header del resultado */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[#004B63] text-center">
            ¡Diagnóstico Completado!
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            Hola, <span className="font-semibold text-[#4DA8C4]">{diagnosis.studentName}</span>. Aquí están tus resultados.
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
            transition={{ type: 'spring', stiffness: 100 }}
            className="rounded-[2rem] bg-gradient-to-br from-[#E6F4F1] to-white border border-[#B2D8E5] p-6 relative overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
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
                  {diagnosis.percentage}% de coincidencia
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {diagnosis.styleDetails.description}
            </p>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Estrategias Recomendadas</h3>
              {(diagnosis.styleDetails.strategies || []).slice(0, 5).map((strategy, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-[#4DA8C4]/10 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-[#4DA8C4]" size={20} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-relaxed">{strategy}</span>
                </div>
              ))}
            </div>

            {/* Consejo personalizado */}
            <div className="mt-6 p-4 bg-[#F0FDFF] rounded-xl border-l-4 border-[#4DA8C4]">
              <p className="text-xs text-[#004B63] font-medium mb-1">Consejo Personalizado</p>
              <p className="text-sm text-slate-600 leading-relaxed">{diagnosis.styleDetails?.tip}</p>
            </div>
          </motion.div>

          {/* Columna Derecha - Gráficos y Puntuaciones */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            className="space-y-6"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Radar Chart */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-[#004B63] mb-4">Perfil VAK</h3>
              <div className="w-full aspect-square max-w-[300px] mx-auto" ref={chartRef}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Radar
                      name="Puntuación"
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
              <h3 className="text-lg font-bold text-[#004B63] mb-4">Puntuaciones</h3>
              
              {/* Visual */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: '#4DA8C4' }}>Visual</span>
                  <span className="text-slate-600">{diagnosis.counts?.visual || 0}/10</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(diagnosis.counts?.visual || 0) * 10}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#4DA8C4' }}
                  />
                </div>
              </div>

              {/* Auditivo */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: '#66CCCC' }}>Auditivo</span>
                  <span className="text-slate-600">{diagnosis.counts?.auditivo || 0}/10</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(diagnosis.counts?.auditivo || 0) * 10}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#66CCCC' }}
                  />
                </div>
              </div>

              {/* Kinestésico */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: '#B2D8E5' }}>Kinestésico</span>
                  <span className="text-slate-600">{diagnosis.counts?.kinestesico || 0}/10</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(diagnosis.counts?.kinestesico || 0) * 10}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#B2D8E5' }}
                  />
                </div>
              </div>
            </div>

            {/* Estado de ánimo y tiempo */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F0FDFF] flex items-center justify-center" style={{ color: moodFeedback.color }}>
                    {React.createElement(getIconComponent(moodFeedback.icon), { size: 20, strokeWidth: 2 })}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#004B63]">Estado de ánimo</p>
                    <p className="text-xs text-slate-500">{moodFeedback.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#004B63]">Tiempo</p>
                  <p className="text-xs text-slate-500">{formatTime(diagnosis.timeSpent || elapsedTime)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Botón para ver documento completo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="flex justify-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('document-preview')}
            className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Eye size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-base font-semibold">Ver Documento Completo</span>
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
          </motion.button>
        </motion.div>

        {/* Action Buttons (Inferiores) con iconos Soft Outline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            disabled={pdfLoading}
            className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Efecto de brillo 3D */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {pdfLoading ? (
              <>
                <div className="relative z-10 w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <span className="relative z-10 text-base font-semibold">Generando PDF...</span>
              </>
            ) : (
              <>
                <Download size={20} strokeWidth={2} className="relative z-10" />
                <span className="relative z-10 text-base font-semibold">Descargar PDF del Resultado</span>
              </>
            )}
            
            {/* Efecto de sombra 3D */}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="relative bg-white border-2 border-[#004B63] text-[#004B63] rounded-full px-8 py-4 flex items-center gap-3 overflow-hidden group"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Efecto de brillo 3D */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#004B63]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <Rocket size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-base font-semibold">Ir a inicio</span>
            
            {/* Efecto de sombra 3D */}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#004B63]/10 blur-md rounded-full"></div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPhase('intro');
              setStudentName('');
              setStudentAge('');
              setStudentMood('');
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
            Volver al inicio
          </motion.button>
        </motion.div>

        {/* Información adicional */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Tiempo total: {formatTime(diagnosis.timeSpent || elapsedTime)} • Estado de ánimo: {moodFeedback.label}</p>
        </div>
      </div>
    );
  };

  const renderDocumentPreview = () => {
    if (!diagnosis) {
      return (
        <div className="p-10 text-center text-gray-500">
          No hay diagnóstico disponible para mostrar.
        </div>
      );
    }
    
    const StyleIcon = getIconComponent(diagnosis.styleDetails?.icon || 'Eye');
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="max-w-4xl mx-auto"
      >
        {/* Document Preview Container - Print Optimized - Compact */}
        <div id="document-preview-content" style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          fontFamily: 'Montserrat, sans-serif',
          color: '#334155',
          lineHeight: '1.5',
          fontSize: '13px'
        }}>
          {/* Header - Compact */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '15px',
            borderBottom: '2px solid #4DA8C4',
            marginBottom: '20px'
          }}>
            <div>
              <h1 style={{
                color: '#004B63',
                margin: '0 0 3px 0',
                fontSize: '20px',
                fontWeight: '800'
              }}>Dictamen Psicopedagógico VAK</h1>
              <p style={{
                margin: 0,
                color: '#64748B',
                fontSize: '11px'
              }}>Edutechlife • Inteligencia Cognitiva</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>VAK</span>
              </div>
            </div>
          </div>

          {/* Student & Parent Data - Side by side - Compact */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {/* Student Data - Compact */}
            <div style={{
              background: '#F8FAFC',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <h3 style={{
                color: '#004B63',
                margin: '0 0 8px 0',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '6px'
              }}>Estudiante</h3>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#64748B', marginRight: '5px' }}>Nombre:</span>
                <span style={{ color: '#004B63', fontWeight: '600' }}>{diagnosis.studentName}</span>
              </div>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#64748B', marginRight: '5px' }}>Edad:</span>
                <span style={{ color: '#004B63' }}>{diagnosis.studentAge || studentAge || 'N/A'} años</span>
              </div>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#64748B', marginRight: '5px' }}>Fecha:</span>
                <span style={{ color: '#004B63' }}>{diagnosis.date}</span>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: '#64748B', marginRight: '5px' }}>Ánimo:</span>
                <span style={{ color: '#004B63' }}>{(() => {
                  const mood = MOOD_OPTIONS.find(m => m.value === (diagnosis.studentMood || studentMood));
                  return mood ? mood.label : 'Neutral';
                })()}</span>
              </div>
            </div>

            {/* Parent Data - Compact */}
            <div style={{
              background: '#F0FDFF',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <h3 style={{
                color: '#004B63',
                margin: '0 0 8px 0',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '6px'
              }}>Acudiente</h3>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#64748B', marginRight: '5px' }}>Nombre:</span>
                <span style={{ color: '#004B63' }}>{parentName || 'N/A'}</span>
              </div>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#64748B', marginRight: '5px' }}>Tel:</span>
                <span style={{ color: '#004B63' }}>{parentPhone || 'N/A'}</span>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: '#64748B', marginRight: '5px' }}>Email:</span>
                <span style={{ color: '#004B63' }}>{parentEmail || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Main Result - Lighter background for better readability */}
          <div style={{
            margin: '20px 0',
            padding: '20px',
            background: 'linear-gradient(135deg, #4DA8C4 0%, #66CCCC 100%)',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <p style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.9)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Perfil de Aprendizaje</p>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '800' }}>{diagnosis.styleDetails?.name}</h2>
            <div style={{ fontSize: '48px', fontWeight: '800', margin: '8px 0' }}>{diagnosis.percentage}%</div>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '13px', lineHeight: '1.4' }}>{diagnosis.styleDetails?.description}</p>
          </div>

          {/* Scores - Compact horizontal layout */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              flex: 1,
              padding: '10px',
              border: '1.5px solid #4DA8C4',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#4DA8C4', fontWeight: 'bold', marginBottom: '3px' }}>VISUAL</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4DA8C4' }}>{diagnosis.counts?.visual || 0}<span style={{ fontSize: '12px', color: '#64748B' }}>/10</span></div>
            </div>
            <div style={{
              flex: 1,
              padding: '10px',
              border: '1.5px solid #66CCCC',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#66CCCC', fontWeight: 'bold', marginBottom: '3px' }}>AUDITIVO</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#66CCCC' }}>{diagnosis.counts?.auditivo || 0}<span style={{ fontSize: '12px', color: '#64748B' }}>/10</span></div>
            </div>
            <div style={{
              flex: 1,
              padding: '10px',
              border: '1.5px solid #B2D8E5',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#B2D8E5', fontWeight: 'bold', marginBottom: '3px' }}>KINESTÉSICO</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4DA8C4' }}>{diagnosis.counts?.kinestesico || 0}<span style={{ fontSize: '12px', color: '#64748B' }}>/10</span></div>
            </div>
          </div>

          {/* Análisis de Resultados — Nuevo */}
          <div style={{
            padding: '12px',
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            marginBottom: '20px'
          }}>
            <h4 style={{
              color: '#004B63',
              margin: '0 0 8px 0',
              fontSize: '13px',
              borderBottom: '1.5px solid #4DA8C4',
              paddingBottom: '5px'
            }}>Análisis de Resultados</h4>
            <p style={{ margin: 0, color: '#334155', fontSize: '11px', lineHeight: '1.5' }}>
              {diagnosis.predominantStyle === 'visual' && `El canal Visual obtuvo ${diagnosis.counts?.visual || 0} de 10 puntos, siendo el sistema de representación dominante. Esto indica que el estudiante procesa información de manera óptima a través de imágenes, gráficos y organizadores visuales.`}
              {diagnosis.predominantStyle === 'auditivo' && `El canal Auditivo obtuvo ${diagnosis.counts?.auditivo || 0} de 10 puntos, siendo el sistema de representación dominante. Esto indica que el estudiante procesa información de manera óptima a través de la palabra hablada, explicaciones verbales y recursos sonoros.`}
              {diagnosis.predominantStyle === 'kinestesico' && `El canal Kinestésico obtuvo ${diagnosis.counts?.kinestesico || 0} de 10 puntos, siendo el sistema de representación dominante. Esto indica que el estudiante procesa información de manera óptima a través de la experiencia práctica, el movimiento y la manipulación de objetos.`}
              {' '}Los puntajes secundarios complementan el perfil, sugiriendo que aunque existe una especialización clara, el estudiante puede beneficiarse de estrategias multimodales para enriquecer su aprendizaje. Se recomienda priorizar las estrategias del estilo predominante sin descuidar los canales secundarios.
            </p>
          </div>

          {/* 2-Column Layout for Content - Enhanced */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {/* Left Column */}
            <div>
              {/* Características - All items */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{
                  color: '#004B63',
                  marginBottom: '8px',
                  fontSize: '13px',
                  borderBottom: '1.5px solid #4DA8C4',
                  paddingBottom: '5px'
                }}>Características del Estilo</h4>
                <div style={{ fontSize: '11px' }}>
                  {getCaracteristicasEstilo(diagnosis.predominantStyle).map((c, i) => (
                    <div key={i} style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: '#4DA8C4', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.3' }}>•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fortalezas del Estilo */}
              <div style={{
                padding: '10px',
                background: 'linear-gradient(135deg, rgba(77,168,196,0.08), rgba(102,204,204,0.08))',
                borderRadius: '8px',
                borderLeft: '3px solid #4DA8C4'
              }}>
                <h4 style={{
                  color: '#004B63',
                  margin: '0 0 6px 0',
                  fontSize: '11px',
                  textTransform: 'uppercase'
                }}>Fortalezas Identificadas</h4>
                <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
                  {diagnosis.predominantStyle === 'visual' && (
                    <>El estudiante posee una capacidad natural para procesar información visual, destacando en: memoria fotográfica, organización espacial, atención al detalle, síntesis gráfica de conceptos, y aprendizaje mediante observación. Estas fortalezas le permiten destacar en entornos que requieren análisis visual y pensamiento estructurado.</>
                  )}
                  {diagnosis.predominantStyle === 'auditivo' && (
                    <>El estudiante posee una capacidad natural para procesar información auditiva, destacando en: memoria verbal, expresión oral estructurada, aprendizaje mediante diálogo, facilidad para idiomas, y retención de secuencias sonoras. Estas fortalezas le permiten destacar en entornos colaborativos y de comunicación verbal.</>
                  )}
                  {diagnosis.predominantStyle === 'kinestesico' && (
                    <>El estudiante posee una capacidad natural para el aprendizaje experiencial, destacando en: coordinación motora, aprendizaje mediante práctica directa, resolución activa de problemas, pensamiento concreto, y memoria procedimental. Estas fortalezas le permiten destacar en entornos que requieren aplicación práctica y experimentación.</>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Estrategias - All items */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{
                  color: '#004B63',
                  marginBottom: '8px',
                  fontSize: '13px',
                  borderBottom: '1.5px solid #4DA8C4',
                  paddingBottom: '5px'
                }}>Estrategias de Estudio</h4>
                <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '11px', lineHeight: '1.5' }}>
                  {(diagnosis.styleDetails?.strategies || []).map((s, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{s}</li>
                  ))}
                </ol>
              </div>

              {/* Recommended Careers - All items */}
              <div>
                <h4 style={{
                  color: '#004B63',
                  marginBottom: '8px',
                  fontSize: '13px',
                  borderBottom: '1.5px solid #66CCCC',
                  paddingBottom: '5px'
                }}>Carreras Recomendadas</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {getCarrerasRecomendadas(diagnosis.predominantStyle).map((c, i) => (
                    <span key={i} style={{
                      padding: '4px 8px',
                      background: '#F0FDFF',
                      borderRadius: '12px',
                      color: '#004B63',
                      fontSize: '10px',
                      fontWeight: '500',
                      border: '1px solid #B2D8E5'
                    }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tips para Padres - All items standalone */}
          <div style={{
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(77,168,196,0.06), rgba(102,204,204,0.06))',
            borderRadius: '8px',
            borderLeft: '3px solid #66CCCC',
            marginBottom: '20px'
          }}>
            <h4 style={{
              color: '#004B63',
              margin: '0 0 8px 0',
              fontSize: '12px',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '5px'
            }}>Recomendaciones para Padres y Acudientes</h4>
            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
              {getTipsPadres(diagnosis.predominantStyle).map((t, i) => (
                <div key={i} style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#66CCCC', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.3' }}>•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Valeria's Commentary - Expanded */}
          <div style={{
            padding: '15px',
            background: 'linear-gradient(135deg, rgba(102,204,204,0.1), rgba(77,168,196,0.1))',
            borderRadius: '8px',
            borderLeft: '3px solid #66CCCC',
            marginBottom: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>VR</span>
              </div>
              <div>
                <h4 style={{ color: '#004B63', margin: '0', fontSize: '13px', fontWeight: '700' }}>Valeria Rodríguez</h4>
                <p style={{ margin: 0, color: '#64748B', fontSize: '10px' }}>Psicóloga Educativa • Especialista en Metodología VAK</p>
              </div>
            </div>
            <div style={{ margin: 0, color: '#334155', fontSize: '11px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {getValentinaCommentary()}
            </div>
          </div>

          {/* Personalized Advice - Compact */}
          {diagnosis.styleDetails?.tip && (
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, rgba(77,168,196,0.1), rgba(102,204,204,0.1))',
              borderRadius: '8px',
              borderLeft: '3px solid #4DA8C4',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#004B63', margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase' }}>Consejo Personalizado</h4>
              <p style={{ margin: 0, color: '#334155', fontSize: '11px', lineHeight: '1.4' }}>{diagnosis.styleDetails?.tip}</p>
            </div>
          )}

          {/* Footer - Compact */}
          <div style={{
            marginTop: '20px',
            paddingTop: '12px',
            borderTop: '1px dashed #ccc',
            textAlign: 'center',
            fontSize: '10px',
            color: '#999'
          }}>
            <p style={{ margin: '0 0 3px 0' }}>Documento generado por EdutechLife • Inteligencia Cognitiva</p>
            <p style={{ margin: 0 }}>Ley 1581 de 2012 | Habeas Data | edutechlife.co</p>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            disabled={pdfLoading}
            className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {pdfLoading ? (
              <>
                <div className="relative z-10 w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <span className="relative z-10 text-base font-semibold">Generando PDF...</span>
              </>
            ) : (
              <>
                <Download size={20} strokeWidth={2} className="relative z-10" />
                <span className="relative z-10 text-base font-semibold">Descargar PDF</span>
              </>
            )}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('result')}
            className="relative bg-white border-2 border-[#004B63] text-[#004B63] rounded-full px-8 py-4 flex items-center gap-3 overflow-hidden group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#004B63]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <ArrowRight size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-base font-semibold">Volver a Resultados</span>
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#004B63]/10 blur-md rounded-full"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="text-[#004B63]/50 hover:text-[#4DA8C4] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Rocket size={16} strokeWidth={2} />
            <span>Ir a inicio</span>
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  const renderError = () => (
    <div className="p-10 text-center">
      <div className="text-red-500 mb-4 font-semibold">Ocurrió un error al cargar el Diagnóstico VAK.</div>
      <button 
        className="btn-primary"
        onClick={() => { setError(null); setPhase('intro'); }}
      >
        Volver a iniciar
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#F8FAFC] py-6 md:py-10 px-3 md:px-4 relative overflow-hidden font-sans antialiased ${highContrast ? 'high-contrast-mode' : ''}`} style={highContrast ? {
      '--color-petroleum': '#000000',
      '--color-corporate': '#000000',
      '--color-gray-100': '#ffffff',
      '--color-gray-200': '#cccccc',
      '--color-gray-700': '#000000',
      '--color-gray-500': '#333333',
      filter: 'contrast(1.3)'
    } : {}}>
      {/* EFECTOS DE CELEBRACIÓN */}
      <Confetti active={showConfetti} />
      <Celebration active={showCelebration} styleName={diagnosis?.styleDetails?.name || ''} />
      
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
            <span className="text-sm font-medium text-green-700">Guardado ✓</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botón de accesibilidad */}
      <button
        onClick={toggleHighContrast}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg border-2 border-[var(--color-gray-200)] hover:border-[var(--color-corporate)] transition-all"
        title="Alt+C: Alternar modo de alto contraste"
        aria-label="Alternar modo de alto contraste"
      >
        {highContrast ? (
          <svg className="w-6 h-6 text-[var(--color-petroleum)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-[var(--color-gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
            backgroundSize: '60px 60px',
            transform: 'perspective(800px) rotateX(65deg)',
            transformOrigin: 'center top',
            backgroundPosition: 'center center'
          }}
        ></div>
        
        {/* Bóvedas flotantes animadas - Efecto 3D */}
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full animate-orb-1 opacity-30" 
          style={{ 
            background: 'radial-gradient(circle at 30% 30%, rgba(77, 168, 196, 0.6) 0%, rgba(77, 168, 196, 0.2) 40%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'translateZ(100px)'
          }}></div>
        
        <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full animate-orb-2 opacity-25" 
          style={{ 
            background: 'radial-gradient(circle at 70% 70%, rgba(102, 204, 204, 0.5) 0%, rgba(102, 204, 204, 0.15) 40%, transparent 70%)',
            filter: 'blur(50px)',
            transform: 'translateZ(80px)',
            animationDelay: '1.5s'
          }}></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-orb-3 opacity-20" 
          style={{ 
            background: 'radial-gradient(circle at center, rgba(0, 194, 224, 0.4) 0%, rgba(0, 194, 224, 0.1) 30%, transparent 60%)',
            filter: 'blur(70px)',
            transform: 'translateZ(50px)',
            animationDelay: '3s'
          }}></div>
        
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
              boxShadow: '0 0 20px rgba(77, 168, 196, 0.5)',
              transform: `translateZ(${Math.random() * 100}px)`
            }}
          />
        ))}
        
        {/* Líneas de conexión 3D */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" style={{ opacity: 0.1 }}>
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
        
        {error ? renderError() : (
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: 10 }}
              transition={{ 
                duration: 0.5, 
                type: 'spring',
                stiffness: 100,
                damping: 20
              }}
              className="perspective-1000"
            >
              {phase === 'intro' && renderWelcome()}
              {phase === 'calibration' && renderCalibration()}
              {phase === 'test' && renderTest()}
              {phase === 'parentdata' && renderParentData()}
              {phase === 'result' && renderResults()}
              {phase === 'document-preview' && renderDocumentPreview()}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticoVAK;