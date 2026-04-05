import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Eye, Download, Brain, Sparkles, ArrowRight, Check, Volume, VolumeOff, RotateCcw, Video, Headphones, Activity, Target, Zap, Users, Globe, Cpu, Lightbulb, Wrench, ListOrdered, CheckSquare, CheckCircle2, Rocket, List, BookOpen, Mic, MessageCircle, Smile, Meh, Frown, Info, Clock } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '../../contexts/StudentContext';
import useValentinaAgent from '../../hooks/useValentinaAgent';
import './DiagnosticoVAK.css';

// Componente de Confetti
const Confetti = ({ active }) => {
  if (!active) return null;
  
  // Versión simplificada sin window para evitar errores SSR
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="text-center text-6xl opacity-50 animate-pulse">🎊</div>
    </div>
  );
};

// Componente de celebración con fuegos artificiales
const Celebration = ({ active, styleName }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-6 flex items-center gap-4 animate-pulse">
        <div className="text-5xl">🎉</div>
        <div>
          <h3 className="text-2xl font-bold text-[var(--color-petroleum)]">¡Completado!</h3>
          <p className="text-[var(--color-gray-500)]">Eres un aprendiz <span className="font-bold text-[var(--color-corporate)]">{styleName}</span></p>
        </div>
        <div className="text-5xl">🎊</div>
      </div>
    </div>
  );
};

// Mapeo de expresiones a emojis
const EXPRESSION_EMOJIS = {
  neutral: '🧠',
  happy: '😊',
  excited: '🤩',
  thinking: '🤔',
  encouraging: '💪',
  celebrating: '🎉',
  calm: '😌',
  proud: '🌟',
  concerned: '😟',
  curious: '🤓',
};

// Componentes de Valeria - Guía del Diagnóstico
const ValeriaControls = ({ 
  valeriaEnabled, 
  setValeriaEnabled, 
  valeriaVolume, 
  setValeriaVolume,
  isSpeaking,
  valeriaExpression,
  onStart,
  showStart 
}) => {
  const currentEmoji = EXPRESSION_EMOJIS[valeriaExpression] || EXPRESSION_EMOJIS.neutral;
  
  return (
    <div className="valeria-controls-bar">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3">
        <div className="valeria-logo">
          <div className="valeria-avatar-container">
            <div className={`valeria-avatar ${isSpeaking ? 'speaking' : ''}`}>
              <span className="valeria-avatar-emoji">{currentEmoji}</span>
            </div>
            {isSpeaking && (
              <div className="valeria-avatar-pulse"></div>
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
          
          {showStart && (
            <button onClick={onStart} className="valeria-btn-start">
              Comenzar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const QUESTIONS = [
  { id: 1, text: '¿Cómo prefieres aprender a usar una nueva app en tu celular?', options: [
    { text: 'Tutoriales en video', type: 'visual', icon: '📹' },
    { text: 'Explicación paso a paso', type: 'auditivo', icon: '🎧' },
    { text: 'Prueba y error', type: 'kinestesico', icon: '🧪' },
    { text: 'Opiniones de otros usuarios', type: 'visual', icon: '💬' }
  ]},
  { id: 2, text: 'En clase, ¿cómo retienes mejor la información?', options: [
    { text: 'Notas con colores', type: 'visual', icon: '🎨' },
    { text: 'Grabo la clase', type: 'auditivo', icon: '🎙️' },
    { text: 'Hago experimentos', type: 'kinestesico', icon: '🔬' },
    { text: 'Resúmenes orales', type: 'auditivo', icon: '📝' }
  ]},
  { id: 3, text: '¿Qué haces para memorizar fechas?', options: [
    { text: 'Tarjetas visuales', type: 'visual', icon: '🃏' },
    { text: 'Listas orales', type: 'auditivo', icon: '📢' },
    { text: 'Recitar moviéndote', type: 'kinestesico', icon: '🏃' },
    { text: 'Escribir repetidamente', type: 'kinestesico', icon: '✍️' }
  ]},
  { id: 4, text: 'Un nuevo control en un juego. ¿Qué haces?', options: [
    { text: 'Leer instrucciones', type: 'visual', icon: '📖' },
    { text: 'Escuchar indicaciones', type: 'auditivo', icon: '👂' },
    { text: 'Practicar moviéndote', type: 'kinestesico', icon: '🎮' },
    { text: 'Ver un tutorial', type: 'visual', icon: '▶️' }
  ]},
  { id: 5, text: 'Como explicas una idea a un amigo que no entiende un tema?', options: [
    { text: 'Dibujo o esquema', type: 'visual', icon: '🎯' },
    { text: 'Explicación verbal', type: 'auditivo', icon: '🗣️' },
    { text: 'Demostración física', type: 'kinestesico', icon: '👋' },
    { text: 'Audio explicando', type: 'auditivo', icon: '🎵' }
  ]},
  { id: 6, text: 'Tipo de contenido en redes', options: [
    { text: 'Imágenes y textos', type: 'visual', icon: '🖼️' },
    { text: 'Podcasts', type: 'auditivo', icon: '🎧' },
    { text: 'Manuales prácticos', type: 'kinestesico', icon: '📚' },
    { text: 'Infografías', type: 'visual', icon: '📊' }
  ]},
  { id: 7, text: 'Investigar para un trabajo. ¿Cómo lo haces?', options: [
    { text: 'Imágenes y videos', type: 'visual', icon: '🔍' },
    { text: 'Documentales', type: 'auditivo', icon: '🎬' },
    { text: 'Experimentos', type: 'kinestesico', icon: '⚗️' },
    { text: 'Páginas organizadas', type: 'visual', icon: '📋' }
  ]},
  { id: 8, text: 'Qué te relaja después de un día de clases?', options: [
    { text: 'Ver vídeos', type: 'visual', icon: '📺' },
    { text: 'Música/podcasts', type: 'auditivo', icon: '🎵' },
    { text: 'Deporte o movimiento', type: 'kinestesico', icon: '⚽' },
    { text: 'Videojuegos/manualidades', type: 'kinestesico', icon: '🎨' }
  ]},
  { id: 9, text: 'Un tema nuevo. ¿Cómo aprendes mejor?', options: [
    { text: 'Con gráficos', type: 'visual', icon: '📈' },
    { text: 'Con explicaciones orales', type: 'auditivo', icon: '👨‍🏫' },
    { text: 'Con ejercicios prácticos', type: 'kinestesico', icon: '✏️' },
    { text: 'Notas con colores', type: 'visual', icon: '🌈' }
  ]},
  { id: 10, text: '¿Cómo te preparas para una presentación?', options: [
    { text: 'Diapositivas y tarjetas', type: 'visual', icon: '📑' },
    { text: 'Ensayo en voz alta', type: 'auditivo', icon: '🎤' },
    { text: 'Práctica frente a un espejo', type: 'kinestesico', icon: '🪞' },
    { text: 'Grabo mi voz y escucho', type: 'auditivo', icon: '🎙️' }
  ]}
];

const MOOD_OPTIONS = [
  { value: 'happy', label: 'Feliz', emoji: '😊', color: '#22C55E', message: '¡Qué genial que estás con buena energía! Este entusiasmo va a potenciar tu experiencia de aprendizaje.' },
  { value: 'excited', label: 'Emocionado', emoji: '🎉', color: '#F59E0B', message: '¡Tu energía es increíble! Vamos a descubrir tu estilo de aprendizaje.' },
  { value: 'calm', label: 'Tranquilo', emoji: '😌', color: '#3B82F6', message: 'Perfecto, la calma te ayudará a reflexionar y obtener resultados precisos.' },
  { value: 'curious', label: 'Curioso', emoji: '🤔', color: '#8B5CF6', message: '¡La curiosidad es clave! Estás a punto de descubrir algo genial sobre ti.' },
  { value: 'tired', label: 'Cansado', emoji: '😴', color: '#6B7280', message: '¡Aún cansado puedes descubrir mucho! Este test es rápido y fácil.' },
  { value: 'stressed', label: 'Estresado', emoji: '😰', color: '#EF4444', message: 'No te preocupes, este test te dará herramientas para entender mejor tu aprendizaje.' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: '#4DA8C4', message: '¡Perfecto! Vamos a descubrir tu estilo de aprendizaje.' },
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
  
  const pdfTemplateRef = useRef(null);
  const chartRef = useRef(null);
  const isChartInView = useInView(chartRef);
  const timerRef = useRef(null);
  
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
    farewell
  } = useValentinaAgent({
    studentName: tempName,
    studentAge: parseInt(tempAge) || 12,
    studentMood,
    phase,
    currentQuestion,
    totalQuestions: QUESTIONS.length,
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
    if (phase === 'test' && currentQuestion < QUESTIONS.length && valeriaEnabled) {
      const q = QUESTIONS[currentQuestion];
      readQuestionWithOptions(q.text, q.options, currentQuestion + 1, QUESTIONS.length);
    }
  }, [currentQuestion, phase, valeriaEnabled]);

  useEffect(() => {
    if (phase === 'intro') {
      setDate(new Date().toLocaleDateString());
    }
  }, [phase]);

  // Efecto conversacional: Detectar cuando se escribe el nombre y confirmar
  useEffect(() => {
    if (phase === 'calibration' && tempName.length >= 2 && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await confirmNameAndAskAge(tempName);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tempName, phase, valeriaEnabled]);

  // Efecto conversacional: Detectar cuando se escribe la edad y confirmar
  useEffect(() => {
    const age = parseInt(tempAge);
    if (phase === 'calibration' && tempAge.length >= 1 && age >= 6 && age <= 17 && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await confirmAgeAndAskEmail(tempName, age);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tempAge, phase, valeriaEnabled]);

  // Efecto conversacional: Detectar cuando se escribe el email y confirmar
  useEffect(() => {
    if (phase === 'calibration' && tempEmail.length > 0 && validateEmail(tempEmail) && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await confirmEmailAndAskPhone();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tempEmail, phase, valeriaEnabled]);

  // Efecto conversacional: Detectar cuando se escribe el teléfono y confirmar
  useEffect(() => {
    if (phase === 'calibration' && tempPhone.length >= 7 && valeriaEnabled) {
      const timer = setTimeout(async () => {
        await confirmPhoneAndAskMood(tempName);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tempPhone, phase, valeriaEnabled]);

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

  // Persistencia de datos en localStorage
  useEffect(() => {
    // Cargar datos guardados al iniciar
    const savedData = localStorage.getItem('edutechlife_vak_progress');
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
        console.log('No se pudo restaurar el progreso');
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
    localStorage.setItem('edutechlife_vak_progress', JSON.stringify(progressData));
    
    // Mostrar indicador de guardado
    if (phase === 'test' || phase === 'calibration') {
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 1500);
    }
  }, [phase, studentName, studentAge, studentEmail, studentPhone, studentMood, currentQuestion, answers, startTime]);

  // Limpiar localStorage al completar el test
  const clearProgress = () => {
    localStorage.removeItem('edutechlife_vak_progress');
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
    // IMPORTANTE: Si Valeria aún no termina de hablar, no hacer nada
    if (valeriaEnabled && !valentinaIntroComplete) {
      return;
    }
    
    // Hacer que Valeria explique el diagnóstico antes de mostrar la vista de datos
    if (valeriaEnabled) {
      const introMessage = "¡Hola! Soy Valeria, tu psicóloga de EdutechLife. Vamos a comenzar con tu diagnóstico de estilo de aprendizaje VAK. Este diagnóstico identificará cómo procesas y retienes información de manera más efectiva. Existen tres estilos principales: visual, auditivo y kinestésico. El estilo visual aprende mejor viendo imágenes y diagramas. El auditivo aprende mejor escuchando y hablando. Y el kinestésico aprende mejor haciendo y practicando. Para personalizar tu experiencia y darte las mejores estrategias, necesito que me compartas tu nombre y cómo te sientes hoy. Esto me ayudará a adaptar mis consejos a tu estado emocional actual. Cuando estés listo, ingresa tu nombre y selecciona cómo te sientes.";
      speakTextConversational(introMessage, 'valeria', () => {
        // IMPORTANTE: Solo cambiar de fase cuando Valeria TERMINE de hablar
        setValentinaIntroComplete(true);
        setPhase('calibration');
      });
    } else {
      // Si no está habilitado el audio, mostrar directamente la pantalla de datos
      setValentinaIntroComplete(true);
      setPhase('calibration');
    }
  };

  const handleStart = async () => {
    setPhase('calibration');
  };

  const submitCalibration = async () => {
    if (!studentName.trim()) return;
    
    setStudentName(studentName.trim());
    setStartTime(Date.now());
    setElapsedTime(0);
    
    // Actualizar información del estudiante en el contexto global
    updateStudentInfo({
      name: studentName.trim(),
      mood: studentMood || 'neutral'
    });
    
    // IMPORTANTE: Hacer la transición al test SOLO después de que Valentina termine de hablar
    if (valeriaEnabled) {
      await transitionToTest(studentName.trim());
      // No necesitamos setTimeout adicional porque transitionToTest ya espera a que Valentina termine
      setPhase('test');
      setCurrentQuestion(0);
    } else {
      // Si no está habilitado el audio, cambiar directamente
      setPhase('test');
      setCurrentQuestion(0);
    }
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
      
      // Verificar progreso cada 3 preguntas (3, 6, 9)
      if (valeriaEnabled && ((idx + 1) === 3 || (idx + 1) === 6 || (idx + 1) === 9)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await giveProgressUpdate();
      }
      
      if (idx < QUESTIONS.length - 1) {
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
          studentEmail: studentEmail,
          studentPhone: studentPhone,
          studentMood: studentMood,
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
        
        setTimeout(() => {
          setPhase('result');
          // Anunciar resultados después de un momento
          if (valeriaEnabled) {
            setTimeout(() => {
              announceResults();
            }, 1000);
          }
        }, 2000); // Mostrar celebración por 2 segundos
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const exportPDF = async () => {
    if (!diagnosis) return;
    
    const el = pdfTemplateRef.current;
    if (!el) return;
    
    setPdfLoading(true);
    
    // Mensaje de Valentina al exportar
    const exportMessage = `¡Excelente ${studentName}! Estoy generando tu informe personalizado con todos los detalles de tu diagnóstico VAK. Este documento incluye mis recomendaciones como psicóloga educativa.`;
    
    // Mostrar mensaje de Valentina
    setValentinaMessage(exportMessage);
    addToChatHistory(exportMessage, 'valentina');
    speakAsValentina(exportMessage);
    
    const fileName = `Diagnostico_VAK_${(diagnosis.studentName || 'estudiante').replace(/\s+/g, '_')}_${diagnosis.date || date}`;
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      await html2pdf().set(opt).from(el).save();
      
      // Mensaje de éxito
      const successMessage = `¡Listo ${studentName}! Tu informe se ha descargado correctamente. Recuerda que puedes consultarme cualquier duda sobre tus estrategias de aprendizaje.`;
      setTimeout(() => {
        setValentinaMessage(successMessage);
        addToChatHistory(successMessage, 'valentina');
        speakAsValentina(successMessage);
      }, 1000);
      
    } catch (e) {
      console.error('PDF error:', e);
      setError('Error al generar PDF');
      
      // Mensaje de error de Valentina
      const errorMessage = `Oh no ${studentName}, hubo un problema al generar tu informe. Por favor, intenta nuevamente o contáctanos para ayuda.`;
      setValentinaMessage(errorMessage);
      addToChatHistory(errorMessage, 'valentina');
      speakAsValentina(errorMessage);
      
    } finally {
      setPdfLoading(false);
    }
  };

  const getMoodFeedback = () => {
    const mood = MOOD_OPTIONS.find(m => m.value === studentMood);
    return mood || MOOD_OPTIONS[6];
  };

  // Generar comentario de Valentina para el diagnóstico
  const getValentinaCommentary = () => {
    if (!diagnosis || !studentAge) return '';
    
    const age = parseInt(studentAge);
    let ageGroup = 'teen';
    if (age >= 6 && age <= 10) ageGroup = 'child';
    else if (age >= 11 && age <= 14) ageGroup = 'preteen';
    
    const style = diagnosis.predominantStyle;
    const percentage = diagnosis.percentage;
    
    const comments = {
      visual: {
        child: `¡Hola ${studentName}! Como psicóloga educativa, veo que eres un aprendiz visual (${percentage}%). Esto significa que aprendes mejor viendo imágenes, colores y diagramas. Te recomiendo usar muchos colores en tus notas y ver videos educativos. ¡Dibujar lo que aprendes te ayudará mucho!`,
        preteen: `Hola ${studentName}, como tu psicóloga educativa, he identificado que tu estilo predominante es visual (${percentage}%). Tu cerebro procesa mejor la información cuando la ves. Te sugiero crear mapas mentales, usar flashcards con imágenes y organizar tu estudio con esquemas visuales.`,
        teen: `Estimado ${studentName}, según mi análisis como psicóloga especializada en VAK, tu perfil es predominantemente visual (${percentage}%). Esto indica que retienes mejor la información a través de estímulos visuales. Estrategias efectivas incluyen: infografías, diagramas de flujo, y el uso de colores para categorizar información.`
      },
      auditivo: {
        child: `¡Hola ${studentName}! Soy Valeria, tu psicóloga. Descubrí que aprendes mejor escuchando (${percentage}%). ¡Eso es genial! Te recomiendo grabar tus clases, escuchar cuentos educativos y explicar lo que aprendes en voz alta. ¡Tu oído es tu superpoder!`,
        preteen: `Hola ${studentName}, como psicóloga educativa de EdutechLife, he determinado que tu estilo de aprendizaje es auditivo (${percentage}%). Aprendes mejor a través del sonido y la palabra hablada. Te aconsejo: grabar tus notas, participar en debates, y usar podcasts educativos.`,
        teen: `${studentName}, mi evaluación como psicóloga especialista en metodología VAK revela que tu estilo predominante es auditivo (${percentage}%). Esto significa que procesas información eficientemente a través del canal auditivo. Recomendaciones: grabaciones de clases, discusiones grupales, y explicaciones verbales.`
      },
      kinestesico: {
        child: `¡Hola ${studentName}! ¡Qué emocionante! Como psicóloga, veo que aprendes mejor moviéndote y tocando (${percentage}%). Eres un aprendiz kinestésico. Te sugiero: estudiar caminando, hacer experimentos, y usar tus manos para aprender. ¡El movimiento es tu aliado!`,
        preteen: `Hola ${studentName}, según mi análisis como psicóloga educativa, tu estilo de aprendizaje es kinestésico (${percentage}%). Necesitas actividad física y experiencia práctica para aprender efectivamente. Recomiendo: tomar notas a mano, hacer pausas activas, y proyectos prácticos.`,
        teen: `Estimado ${studentName}, mi diagnóstico como psicóloga especializada en VAK indica que tu perfil es kinestésico (${percentage}%). Aprendes mejor a través de la experiencia práctica y el movimiento. Estrategias recomendadas: aprendizaje basado en proyectos, simulaciones, y estudio con intervalos de actividad.`
      }
    };
    
    return comments[style]?.[ageGroup] || `Hola ${studentName}, como psicóloga educativa de EdutechLife, he analizado tu perfil VAK. Tu estilo predominante es ${style} (${percentage}%). Esto te brinda ventajas específicas en tu proceso de aprendizaje.`;
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
        {/* ENCABEZADO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] shadow-2xl mb-6">
            <Brain size={48} strokeWidth={1.5} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#004B63] mb-3 tracking-tight">
            Diagnóstico VAK
          </h1>
          <p className="text-lg text-[#4DA8C4] font-medium">
            Descubre tu estilo de aprendizaje
          </p>
        </motion.div>

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
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#00C2E0] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-[#00C2E0]/10 flex items-center justify-center mb-4 mx-auto">
                <Activity size={32} strokeWidth={1.5} className="text-[#00C2E0]" />
              </div>
              <h3 className="text-lg font-bold text-[#00C2E0] text-center mb-3 uppercase tracking-wide">Kinestésico</h3>
              <p className="text-sm text-[#004B63]/70 text-center mb-4">
                Aprende mejor haciendo
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#00C2E0] shrink-0" />
                  <span>Experimentos prácticos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#00C2E0] shrink-0" />
                  <span>Movimiento y pausas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#00C2E0] shrink-0" />
                  <span>Proyectos manuales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#004B63]/80">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#00C2E0] shrink-0" />
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
              <div className="w-14 h-14 rounded-2xl bg-[#00C2E0]/10 flex items-center justify-center mx-auto mb-2">
                <Target size={28} strokeWidth={2} className="text-[#00C2E0]" />
              </div>
              <p className="text-2xl font-bold text-[#004B63]">100%</p>
              <p className="text-xs text-[#004B63]/60">Personalizado</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={28} strokeWidth={2} className="text-[#10B981]" />
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

  const renderCalibration = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      {/* Efectos 3D de fondo para intro */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#4DA8C4]/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-[#66CCCC]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-md text-center relative z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Título principal con efecto 3D */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-extrabold text-[#0A1628] text-center">
            Cuéntame sobre ti
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            Completa estos datos para personalizar tu diagnóstico VAK
          </p>
        </motion.div>

        {/* Input Nombre - Estilo píldora con efecto 3D */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full rounded-full border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4 text-base font-medium text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]/30 focus:border-transparent transition-all shadow-lg"
            />
            <div className="absolute -bottom-1 left-4 right-4 h-2 bg-gradient-to-r from-transparent via-[#4DA8C4]/20 to-transparent rounded-full blur-sm"></div>
          </div>
        </motion.div>

        {/* Selector de Ánimo - 3 tarjetas con iconos Soft Outline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">¿Cómo te sientes hoy?</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'happy', label: 'Bien', icon: Smile, color: 'from-[#4DA8C4] to-[#66CCCC]' },
              { value: 'neutral', label: 'Regular', icon: Meh, color: 'from-gray-400 to-gray-300' },
              { value: 'sad', label: 'Mal', icon: Frown, color: 'from-gray-500 to-gray-400' }
            ].map((mood) => {
              const IconComponent = mood.icon;
              return (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStudentMood(mood.value)}
                  className={`relative rounded-2xl p-4 flex flex-col items-center justify-center transition-all overflow-hidden ${
                    studentMood === mood.value
                      ? 'bg-gradient-to-br from-white to-cyan-50 ring-2 ring-[#4DA8C4] shadow-lg'
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Efecto de fondo gradiente cuando está seleccionado */}
                  {studentMood === mood.value && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-10`}></div>
                  )}
                  
                  {/* Icono Soft Outline */}
                  <div className="w-12 h-12 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center mb-2 relative z-10">
                    <IconComponent size={24} strokeWidth={2} className="text-[#4DA8C4]" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider relative z-10">{mood.label}</span>
                  
                  {/* Efecto de sombra 3D */}
                  <div className="absolute -bottom-1 left-2 right-2 h-2 bg-black/5 blur-sm rounded-full"></div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Botón Continuar - Estilo píldora con efecto flotante 3D */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={submitCalibration}
            disabled={!studentName.trim()}
            className="relative w-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full py-4 px-6 shadow-xl hover:shadow-2xl transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <span className="relative z-10 text-base font-semibold flex items-center justify-center gap-2">
              Iniciar Diagnóstico
              <ArrowRight size={20} strokeWidth={2} />
            </span>
            
            {/* Efecto de sombra 3D */}
            <div className="absolute -bottom-2 left-4 right-4 h-3 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
          </motion.button>
        </motion.div>

        {/* Información adicional */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-slate-400 uppercase tracking-wider mt-6"
        >
          Solo tomará 3 minutos • 10 preguntas • 100% confidencial
        </motion.p>
      </motion.div>
    </div>
  );

  const renderTest = () => {
    const question = QUESTIONS[currentQuestion];
    if (!question) return null;
    
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    
    return (
      <div className="max-w-3xl mx-auto p-4">
        {/* Top Bar con número de pregunta */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pregunta</div>
          <div className="bg-[#66CCCC] text-white rounded-full px-3 py-1 text-xs font-semibold">
            {currentQuestion + 1} / {QUESTIONS.length}
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A1628] text-center leading-tight">
            {question.text}
          </h2>

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
                  whileHover={isValentinaSpeaking ? {} : { scale: 1.01, x: 5 }}
                  whileTap={isValentinaSpeaking ? {} : { scale: 0.99 }}
                  onClick={() => !isValentinaSpeaking && handleAnswer(opt)}
                  disabled={isValentinaSpeaking}
                  className={`w-full text-left p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 group relative overflow-hidden ${
                    isValentinaSpeaking 
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
                if (!isValentinaSpeaking) {
                  readQuestionWithOptions(question.text, question.options, currentQuestion + 1, QUESTIONS.length);
                }
              }}
              disabled={isValentinaSpeaking}
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
          <h1 className="text-2xl font-extrabold text-[#0A1628] text-center">
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
            <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#4DA8C4]/10 flex items-center justify-center">
                  <Lightbulb size={18} strokeWidth={2} className="text-[#4DA8C4]" />
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Consejo del día</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{diagnosis.styleDetails.tip}</p>
            </div>
          </motion.div>

          {/* Columna Derecha (Gráfica) con efecto 3D */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
            className="bg-white rounded-[2rem] shadow-sm p-6 relative overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Efecto de profundidad 3D */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#66CCCC] to-transparent opacity-30"></div>
            <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-[#66CCCC]/10 blur-xl"></div>
            <h3 className="text-sm font-semibold text-slate-700 mb-6">Distribución VAK</h3>
            
            {/* Placeholder estilizado para Radar Chart */}
            <div className="h-64 flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                {/* Círculo base */}
                <div className="absolute inset-0 border-2 border-gray-100 rounded-full"></div>
                
                {/* Líneas del radar */}
                <div className="absolute inset-8 border-2 border-gray-200 rounded-full"></div>
                <div className="absolute inset-16 border-2 border-gray-300 rounded-full"></div>
                
                {/* Puntos de datos */}
                <div 
                  className="absolute w-3 h-3 bg-[#4DA8C4] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: '50%', left: `${50 + (diagnosis.counts?.visual || 0) * 4}%` }}
                />
                <div 
                  className="absolute w-3 h-3 bg-[#66CCCC] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${50 - (diagnosis.counts?.auditivo || 0) * 4}%`, left: '50%' }}
                />
                <div 
                  className="absolute w-3 h-3 bg-[#B2D8E5] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${50 + (diagnosis.counts?.kinestesico || 0) * 4}%`, left: `${50 - (diagnosis.counts?.kinestesico || 0) * 4}%` }}
                />
                
                {/* Etiquetas */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-[#4DA8C4]">
                  Visual: {diagnosis.counts?.visual || 0}/10
                </div>
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-sm font-medium text-[#66CCCC]">
                  Auditivo: {diagnosis.counts?.auditivo || 0}/10
                </div>
                <div className="absolute -bottom-2 left-1/4 transform -translate-x-1/2 text-sm font-medium text-[#B2D8E5]">
                  Kinestésico: {diagnosis.counts?.kinestesico || 0}/10
                </div>
              </div>
            </div>

            {/* Barras de porcentaje */}
            <div className="space-y-4">
              {[
                { key: 'visual', label: 'Visual', color: '#4DA8C4', value: diagnosis.counts?.visual || 0 },
                { key: 'auditivo', label: 'Auditivo', color: '#66CCCC', value: diagnosis.counts?.auditivo || 0 },
                { key: 'kinestesico', label: 'Kinestésico', color: '#B2D8E5', value: diagnosis.counts?.kinestesico || 0 }
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
                    <span className="text-slate-600 font-medium">{item.value}/10</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value * 10}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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
            onClick={() => onNavigate && onNavigate('neuroentorno')}
            className="relative bg-white border-2 border-[#0A1628] text-[#0A1628] rounded-full px-8 py-4 flex items-center gap-3 overflow-hidden group"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Efecto de brillo 3D */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A1628]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <Rocket size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-base font-semibold">Ir a IA Lab</span>
            
            {/* Efecto de sombra 3D */}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#0A1628]/10 blur-md rounded-full"></div>
          </motion.button>
        </motion.div>

        {/* Información adicional */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Tiempo total: {formatTime(diagnosis.timeSpent || elapsedTime)} • Estado de ánimo: {moodFeedback.label}</p>
        </div>
      </div>
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
        showStart={phase === 'intro'}
        onStart={handleStart}
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
        {/* Botón de volver (solo visible cuando hay navegación) */}
        {onNavigate && (
          <div className="mb-6">
            <button 
              onClick={() => onNavigate('neuroentorno')}
              className="text-[#4DA8C4] hover:text-[#66CCCC] flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Volver al Dashboard</span>
            </button>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 md:p-6"
        >
        
        <div ref={pdfTemplateRef} style={{ display: 'none' }}>
          {diagnosis && (
            <div style={{ padding: '40px', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#ffffff' }}>
              {/* Header con logo */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '3px solid #4DA8C4', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ color: '#004B63', margin: '0 0 5px 0', fontSize: '24px', fontWeight: '800' }}>Dictamen Oficial VAK</h1>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Edutechlife • Inteligencia Cognitiva</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '24px' }}>🧠</span>
                  </div>
                </div>
              </div>
              
              {/* Información del estudiante */}
              <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                <h3 style={{ color: '#004B63', margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>Datos del Estudiante</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '12px' }}>Nombre completo</p>
                    <p style={{ margin: 0, color: '#004B63', fontSize: '16px', fontWeight: '600' }}>{diagnosis.studentName}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '12px' }}>Fecha de evaluación</p>
                    <p style={{ margin: 0, color: '#004B63', fontSize: '16px' }}>{diagnosis.date}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '12px' }}>Correo electrónico</p>
                    <p style={{ margin: 0, color: '#004B63', fontSize: '14px' }}>{diagnosis.studentEmail || 'No proporcionado'}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '12px' }}>Estado de ánimo</p>
                    <p style={{ margin: 0, color: '#004B63', fontSize: '14px' }}>
                      {MOOD_OPTIONS.find(m => m.value === diagnosis.studentMood)?.emoji} {MOOD_OPTIONS.find(m => m.value === diagnosis.studentMood)?.label || 'Neutral'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Resultado principal */}
              <div style={{ margin: '30px 0', padding: '30px', background: 'linear-gradient(135deg, #004B63 0%, #0A3550 100%)', borderRadius: '16px', textAlign: 'center', color: 'white' }}>
                <p style={{ margin: '0 0 10px 0', color: '#66CCCC', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Perfil de Aprendizaje</p>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '32px', fontWeight: '800' }}>{diagnosis.styleDetails?.name}</h2>
                <div style={{ fontSize: '56px', fontWeight: '800', margin: '10px 0' }}>{diagnosis.percentage}%</div>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>{diagnosis.styleDetails?.description}</p>
              </div>

              {/* Puntuaciones */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: 1, padding: '20px', border: '2px solid #4DA8C4', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>👁️</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Visual</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4DA8C4' }}>{diagnosis.counts?.visual || 0}<span style={{ fontSize: '16px', color: '#64748B' }}>/10</span></div>
                </div>
                <div style={{ flex: 1, padding: '20px', border: '2px solid #66CCCC', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>👂</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Auditivo</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#66CCCC' }}>{diagnosis.counts?.auditivo || 0}<span style={{ fontSize: '16px', color: '#64748B' }}>/10</span></div>
                </div>
                <div style={{ flex: 1, padding: '20px', border: '2px solid #00C2E0', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>⚡</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Kinestésico</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00C2E0' }}>{diagnosis.counts?.kinestesico || 0}<span style={{ fontSize: '16px', color: '#64748B' }}>/10</span></div>
                </div>
              </div>

              {/* Estrategias */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#004B63', marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #4DA8C4', paddingBottom: '10px' }}>📚 Estrategias de Aprendizaje Recomendadas</h4>
                <ul style={{ paddingLeft: '20px', color: '#334155', lineHeight: '2' }}>
                  {(diagnosis.styleDetails?.strategies || []).map((s, i) => (
                    <li key={i} style={{ marginBottom: '12px', fontSize: '14px' }}>
                      <strong>{i + 1}.</strong> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consejo */}
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(77,168,196,0.1), rgba(102,204,204,0.1))', borderRadius: '12px', borderLeft: '4px solid #4DA8C4', marginBottom: '20px' }}>
                <h4 style={{ color: '#004B63', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>💡 Consejo Personalizado</h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>{diagnosis.styleDetails?.tip}</p>
              </div>

              {/* Comentario de Valeria - Psicóloga Educativa */}
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(102,204,204,0.1), rgba(77,168,196,0.1))', borderRadius: '12px', borderLeft: '4px solid #66CCCC', marginBottom: '30px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4DA8C4, #66CCCC)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '18px' }}>👩‍🏫</span>
                  </div>
                  <div>
                    <h4 style={{ color: '#004B63', margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700' }}>Valeria Rodríguez</h4>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '11px' }}>Psicóloga Educativa • Especialista VAK</p>
                  </div>
                </div>
                <p style={{ margin: 0, color: '#334155', fontSize: '13px', lineHeight: '1.6', fontStyle: 'italic' }}>
                  {getValentinaCommentary()}
                </p>
                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>EdutechLife • 12 años de experiencia</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>VAK Certified</span>
                </div>
              </div>

              {/* Tiempo */}
              {diagnosis.timeSpent && (
                <div style={{ textAlign: 'center', padding: '15px', background: '#F8FAFC', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>
                    ⏱️ Tiempo de evaluación: <strong>{Math.floor(diagnosis.timeSpent / 60)}:{(diagnosis.timeSpent % 60).toString().padStart(2, '0')} minutos</strong>
                  </p>
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed #ccc', textAlign: 'center', fontSize: '11px', color: '#999' }}>
                <p style={{ margin: '0 0 5px 0' }}>Documento generado automáticamente por el Ecosistema Edutechlife</p>
                <p style={{ margin: 0 }}>ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}-{Date.now().toString().slice(-6)} | edutechlife.co</p>
              </div>
            </div>
          )}
        </div>
        
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
              {phase === 'result' && renderResults()}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticoVAK;