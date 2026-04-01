import React, { useEffect, useState, useRef } from 'react';
import { Eye, Download, Brain, Eye as EyeIcon, Ear, Hand, Sparkles, ArrowRight, Check, PartyPopper } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useInView, motion, AnimatePresence } from 'framer-motion';

// Componente de Confetti
const Confetti = ({ active }) => {
  const colors = ['#4DA8C4', '#66CCCC', '#00C2E0', '#FFD700', '#FF6B9D', '#8B5CF6'];
  const confettiCount = 50;
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(confettiCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            scale: 1
          }}
          animate={{
            y: window.innerHeight + 20,
            x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200,
            rotate: Math.random() * 720 - 360,
            scale: [1, 0.8, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut'
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        />
      ))}
    </div>
  );
};

// Componente de celebración con fuegos artificiales
const Celebration = ({ active, styleName }) => {
  if (!active) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
    >
      {/* Fuegos artificiales */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight,
            scale: 0
          }}
          animate={{ 
            y: Math.random() * window.innerHeight * 0.5,
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            repeat: 2,
            repeatDelay: 0.5
          }}
          className="absolute"
        >
          <div className="text-6xl">🎆</div>
        </motion.div>
      ))}
      
      {/* Mensaje de celebración */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl p-6 flex items-center gap-4"
      >
        <div className="text-5xl">🎉</div>
        <div>
          <h3 className="text-2xl font-bold text-[var(--color-petroleum)]">¡Completado!</h3>
          <p className="text-[var(--color-gray-500)]">Eres un aprendiz <span className="font-bold text-[var(--color-corporate)]">{styleName}</span></p>
        </div>
        <div className="text-5xl">🎊</div>
      </motion.div>
    </motion.div>
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
    icon: EyeIcon,
    tip: 'Visiona el contenido antes de estudiarlo para mejor comprensión'
  },
  auditivo: { 
    name: 'APRENDIZ AUDITIVO', 
    color: 'var(--color-mint)', 
    bgGradient: 'linear-gradient(135deg, rgba(102, 204, 204, 0.15), rgba(102, 204, 204, 0.05))',
    description: 'Aprendes mejor escuchando y hablando. Retienes información a través de conversaciones y audio.',
    strategies: ['Graba y escucha tus notas', 'Explica en voz alta lo que aprendes', 'Escucha podcasts educativos', 'Participa en debates y discusiones', 'Usa grabadora para clases'],
    icon: Ear,
    tip: 'Graba tus notas y escúchalas en tus momentos de ocio'
  },
  kinestesico: { 
    name: 'APRENDIZ KINESTÉSICO', 
    color: 'var(--color-accent)', 
    bgGradient: 'linear-gradient(135deg, rgba(0, 194, 224, 0.15), rgba(0, 194, 224, 0.05))',
    description: 'Necesitas moverte y practicar para aprender. Tu mejor aprendizaje viene de la experiencia práctica.',
    strategies: ['Toma notas a mano', 'Haz pausas activas cada 25 minutos', 'Practica con ejercicios reales', 'Usa el cuerpo para memorizar', 'Aprende haciendo proyectos'],
    icon: Hand,
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

const DiagnosticoVAK = ({ onNavigate }) => {
  const [phase, setPhase] = useState('intro');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentMood, setStudentMood] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [date, setDate] = useState('');
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [tempMood, setTempMood] = useState('');
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedMoodOption, setSelectedMoodOption] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const pdfTemplateRef = useRef(null);
  const chartRef = useRef(null);
  const isChartInView = useInView(chartRef);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'intro') {
      setDate(new Date().toLocaleDateString());
    }
  }, [phase]);

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
  }, [phase, studentName, studentEmail, studentPhone, studentMood, currentQuestion, answers, startTime]);

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
      // Escape: Volver al ecosistema
      if (e.key === 'Escape' && onNavigate) {
        onNavigate('ecosystem');
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
    setPhase('calibration');
  };

  const submitCalibration = () => {
    if (!tempName.trim()) return;
    
    // Validar email si se proporcionó
    if (tempEmail.trim() && !validateEmail(tempEmail.trim())) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    
    setStudentName(tempName.trim());
    setStudentEmail(tempEmail.trim());
    setStudentPhone(tempPhone.trim());
    setStudentMood(selectedMoodOption?.value || 'neutral');
    setStartTime(Date.now());
    setElapsedTime(0);
    setPhase('test');
    setCurrentQuestion(0);
  };

  const handleAnswer = (option) => {
    try {
      const idx = currentQuestion;
      const entry = { index: idx, text: option.text, type: option.type };
      const nextAnswers = [...answers, entry];
      setAnswers(nextAnswers);
      
      if (idx < QUESTIONS.length - 1) {
        setCurrentQuestion(idx + 1);
      } else {
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
        // Activar celebración antes de mostrar resultados
        setShowConfetti(true);
        setShowCelebration(true);
        
        // Limpiar progreso guardado
        clearProgress();
        
        setTimeout(() => {
          setPhase('result');
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
    } catch (e) {
      console.error('PDF error:', e);
      setError('Error al generar PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const getMoodFeedback = () => {
    const mood = MOOD_OPTIONS.find(m => m.value === studentMood);
    return mood || MOOD_OPTIONS[6];
  };

  const renderIntro = () => (
    <div className="text-center p-8 md:p-12 relative">
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-[var(--color-corporate)]/20 rounded-full blur-[80px] animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-[var(--color-mint)]/20 rounded-full blur-[60px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-[var(--color-accent)]/15 rounded-full blur-[50px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Icono Brain 3D con efectos */}
        <div className="w-32 h-32 mx-auto mb-8 relative perspective-500">
          {/* Capa de brillo posterior */}
          <div className="absolute inset-4 bg-gradient-to-br from-[var(--color-corporate)] to-[var(--color-mint)] rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          
          {/* Tarjeta 3D principal */}
          <motion.div 
            whileHover={{ rotateX: 10, rotateY: -10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative w-full h-full bg-gradient-to-br from-[var(--color-corporate)] to-[var(--color-mint)] rounded-3xl flex items-center justify-center shadow-[var(--shadow-xl)] border border-white/20"
          >
            <Brain className="w-16 h-16 text-white drop-shadow-lg" />
            
            {/* Partículas decorativas */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </motion.div>
        </div>
        
        {/* Badge con glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[var(--color-corporate)]/20 mb-4 shadow-[var(--shadow-md)]"
        >
          <Sparkles className="w-4 h-4 text-[var(--color-corporate)] animate-pulse" />
          <span className="text-sm font-bold text-[var(--color-corporate)] tracking-wide">DIAGNÓSTICO COGNITIVO</span>
          <div className="w-2 h-2 bg-[var(--color-corporate)] rounded-full animate-pulse"></div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="display-2 text-[var(--color-petroleum)] mb-4"
        >
          Estilo de Aprendizaje <span className="text-gradient-primary">VAK</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="body-lg text-[var(--color-gray-500)] max-w-lg mx-auto mb-8"
        >
          Una evaluación científica para identificar cómo procesas y retienes información de manera más efectiva. ¡Descubrirás tu superpower para aprender!
        </motion.p>

        {/* Tarjetas de estilos con efectos 3D */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {[
            { icon: EyeIcon, label: 'Visual', color: 'var(--color-corporate)', bg: 'from-[var(--color-corporate)]/10 to-transparent' },
            { icon: Ear, label: 'Auditivo', color: 'var(--color-mint)', bg: 'from-[var(--color-mint)]/10 to-transparent' },
            { icon: Hand, label: 'Kinestésico', color: 'var(--color-accent)', bg: 'from-[var(--color-accent)]/10 to-transparent' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.6 + idx * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.08, y: -5, rotateX: 5 }}
              className="perspective-100 group"
            >
              <div className={`px-6 py-4 rounded-2xl bg-gradient-to-r ${item.bg} white border border-[var(--color-gray-200)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-corporate)]/30 transition-all duration-300 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-md group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <span className="text-sm font-bold text-[var(--color-petroleum)]">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Botón principal con efectos especiales */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(77,168,196,0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary px-12 py-5 text-lg shadow-[var(--shadow-lg)] relative overflow-hidden"
          onClick={startTest}
        >
          {/* Efecto de brillo animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
          <span className="relative z-10 flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            Comenzar Evaluación
            <ArrowRight className="w-5 h-5" />
          </span>
        </motion.button>
        
        {/* Info con animación */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-[var(--color-gray-400)] mt-6 flex items-center justify-center gap-4"
        >
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--color-corporate)] rounded-full animate-pulse"></span>
            3 minutos
          </span>
          <span className="w-px h-3 bg-[var(--color-gray-300)]"></span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--color-mint)] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
            10 preguntas
          </span>
          <span className="w-px h-3 bg-[var(--color-gray-300)]"></span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
            100% personalizado
          </span>
        </motion.p>
      </motion.div>
    </div>
  );

  const renderCalibration = () => (
    <div className="p-8 md:p-10 max-w-xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-mint)]/10 border border-[var(--color-mint)]/20 mb-3">
          <span className="text-sm font-semibold text-[var(--color-mint)]">ETAPA 1/4</span>
        </div>
        <h3 className="heading-2 text-[var(--color-petroleum)]">Configuremos tu experiencia</h3>
        <p className="text-[var(--color-gray-500)] mt-2">Completa tus datos para personalizar tu resultado</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-5"
      >
        <div className="relative">
          <label className="block text-sm font-semibold text-[var(--color-petroleum)] mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[var(--color-corporate)]/10 flex items-center justify-center">👤</span>
            Nombre completo
          </label>
          <input 
            className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-[var(--color-gray-200)] focus:border-[var(--color-corporate)] focus:shadow-[0_0_20px_rgba(77,168,196,0.2)] transition-all duration-300 text-[var(--color-petroleum)] font-semibold placeholder-[var(--color-gray-400)]"
            placeholder="¿Cómo te llamas?"
            value={tempName} 
            onChange={(e) => setTempName(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && submitCalibration()}
          />
        </div>
        
        <div className="relative">
          <label className="block text-sm font-semibold text-[var(--color-petroleum)] mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[var(--color-corporate)]/10 flex items-center justify-center">📧</span>
            Correo electrónico <span className="text-[var(--color-gray-400)]">(opcional)</span>
          </label>
          <div className="relative">
            <input 
              type="email"
              className={`w-full px-5 py-4 rounded-2xl bg-white border-2 transition-all duration-300 text-[var(--color-petroleum)] font-semibold placeholder-[var(--color-gray-400)] ${
                emailError 
                  ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                  : 'border-[var(--color-gray-200)] focus:border-[var(--color-corporate)] focus:shadow-[0_0_20px_rgba(77,168,196,0.2)]'
              }`}
              placeholder="tu@email.com"
              value={tempEmail} 
              onChange={(e) => {
                setTempEmail(e.target.value);
                if (emailError) setEmailError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && submitCalibration()}
            />
            {tempEmail && !emailError && validateEmail(tempEmail) && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          {emailError && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2 flex items-center gap-2"
            >
              <span>⚠️</span> Por favor ingresa un correo válido
            </motion.p>
          )}
        </div>
        
        <div className="relative">
          <label className="block text-sm font-semibold text-[var(--color-petroleum)] mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[var(--color-corporate)]/10 flex items-center justify-center">📱</span>
            Teléfono (opcional)
          </label>
          <input 
            type="tel"
            className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-[var(--color-gray-200)] focus:border-[var(--color-corporate)] focus:shadow-[0_0_20px_rgba(77,168,196,0.2)] transition-all duration-300 text-[var(--color-petroleum)] font-semibold placeholder-[var(--color-gray-400)]"
            placeholder="+51 999 999 999"
            value={tempPhone} 
            onChange={(e) => setTempPhone(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && submitCalibration()}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[var(--color-petroleum)] mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[var(--color-mint)]/10 flex items-center justify-center">✨</span>
            ¿Cómo te sientes hoy?
          </label>
          <p className="text-xs text-[var(--color-gray-500)] mb-4">Tu respuesta ayudará a personalizar tu experiencia y resultados</p>
          
          <div className="grid grid-cols-4 gap-3">
            {MOOD_OPTIONS.map((mood, idx) => {
              const isSelected = selectedMoodOption?.value === mood.value;
              return (
                <motion.button
                  key={mood.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.08, y: -8 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelectedMoodOption(mood)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden ${
                    isSelected
                      ? 'border-[var(--color-corporate)] shadow-[0_0_30px_rgba(77,168,196,0.3)]'
                      : 'border-[var(--color-gray-200)] bg-white hover:border-[var(--color-gray-300)] hover:shadow-[var(--shadow-lg)]'
                  }`}
                  style={{
                    background: isSelected ? `linear-gradient(135deg, ${mood.color}10, white)` : undefined
                  }}
                >
                  {/* Fondo decorativo */}
                  {!isSelected && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${mood.color}15 0%, transparent 70%)`
                      }}
                    />
                  )}
                  
                  {/* Emoji con efecto */}
                  <div className={`relative text-4xl transition-all duration-300 ${isSelected ? 'scale-125' : ''}`}>
                    {mood.emoji}
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full animate-ping opacity-30" style={{ backgroundColor: mood.color }} />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-bold relative z-10 transition-colors duration-300 ${
                    isSelected ? 'text-[var(--color-petroleum)]' : 'text-[var(--color-gray-600)]'
                  }`}>
                    {mood.label}
                  </span>
                  
                  {/* Indicador de selección */}
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: mood.color }}
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
          
          {/* Feedback visual del mood seleccionado */}
          <AnimatePresence>
            {selectedMoodOption && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                className="mt-4 p-4 rounded-2xl border-2"
                style={{
                  borderColor: selectedMoodOption.color,
                  background: `linear-gradient(135deg, ${selectedMoodOption.color}15, white)`
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedMoodOption.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-petroleum)]">
                      ¡Perfecto! Te sientes {selectedMoodOption.label.toLowerCase()}
                    </p>
                    <p className="text-xs text-[var(--color-gray-500)]">
                      {selectedMoodOption.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full py-4 text-lg mt-6 shadow-[var(--shadow-lg)]"
          onClick={submitCalibration}
          disabled={!tempName.trim()}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Iniciar Test
        </motion.button>
      </motion.div>
    </div>
  );

  const renderTest = () => {
    const question = QUESTIONS[currentQuestion];
    if (!question) return null;
    
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    const questionsRemaining = QUESTIONS.length - currentQuestion - 1;
    const estimatedTime = questionsRemaining * 15; // ~15 segundos por pregunta
    
    return (
      <div className="p-6 md:p-10">
        {/* Header con progreso y tiempo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-[var(--color-corporate)]/20 shadow-[var(--shadow-sm)]">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-corporate)] animate-pulse"></span>
            </div>
            <span className="text-sm font-bold text-[var(--color-corporate)] tracking-wide">PREGUNTA {currentQuestion + 1} / {QUESTIONS.length}</span>
          </div>
          
          {/* Indicador de tiempo */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-mint)]/10 border border-[var(--color-mint)]/20">
              <svg className="w-4 h-4 text-[var(--color-mint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono text-[var(--color-petroleum)]">{formatTime(elapsedTime)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-gray-100)] border border-[var(--color-gray-200)]">
              <span className="text-[var(--color-gray-500)]">~</span>
              <span className="font-mono text-[var(--color-gray-600)]">{Math.ceil(estimatedTime / 60)}:{(estimatedTime % 60).toString().padStart(2, '0')} min</span>
              <span className="text-xs text-[var(--color-gray-400)]">restante</span>
            </div>
          </div>
        </motion.div>
        
        {/* Progress bar mejorado con shimmer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-2.5 bg-[var(--color-gray-100)] rounded-full mb-8 overflow-hidden"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-corporate)] via-[var(--color-mint)] to-[var(--color-corporate)] relative overflow-hidden"
          >
            {/* Efecto shimmer en la barra */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </motion.div>
          
          {/* Puntos de progreso */}
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                i < currentQuestion 
                  ? 'bg-[var(--color-corporate)] left-[10%]' 
                  : i === currentQuestion 
                    ? 'bg-[var(--color-corporate)] scale-150' 
                    : 'bg-[var(--color-gray-300)]'
              }`}
              style={{ left: `${i * 10 + 5}%` }}
            />
          ))}
        </motion.div>
        
        {/* Pregunta con diseño mejorado */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="perspective-1000"
        >
          {/* Número de pregunta decorativo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[var(--color-corporate)] to-[var(--color-mint)] shadow-[var(--shadow-lg)] mb-4">
              <span className="text-3xl font-bold text-white">{currentQuestion + 1}</span>
            </div>
          </div>
          
          <h3 className="heading-2 text-[var(--color-petroleum)] mb-8 leading-relaxed text-center px-4">
            {question.text}
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {question.options.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ 
                  scale: 1.01, 
                  y: -6,
                  rotateX: 2,
                  rotateY: -2
                }}
                whileTap={{ scale: 0.98 }}
                className="relative p-5 rounded-2xl bg-white border-2 border-[var(--color-gray-200] 
                  hover:border-[var(--color-corporate)] 
                  hover:shadow-[0_20px_40px_rgba(77,168,196,0.15),0_0_0_1px_rgba(77,168,196,0.1)]
                  transition-all duration-300 text-left flex items-center gap-4 group
                  perspective-500"
                onClick={() => handleAnswer(opt)}
              >
                {/* Efecto de brillo en el borde */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 40%, rgba(77,168,196,0.1) 50%, transparent 60%)'
                  }}
                />
                
                {/* Número con efecto 3D y gradiente */}
                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0
                  bg-gradient-to-br from-[var(--color-gray-50)] to-[var(--color-gray-100)]
                  border-2 border-[var(--color-gray-200]
                  group-hover:from-[var(--color-corporate)] group-hover:to-[var(--color-mint)]
                  group-hover:border-[var(--color-corporate)]
                  group-hover:text-white
                  transition-all duration-300 shadow-lg group-hover:shadow-[var(--shadow-lg)]"
                >
                  <span className="group-hover:scale-110 transition-transform">{opt.icon}</span>
                  
                  {/* Indicador de selección */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-corporate)] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                
                {/* Texto de la opción */}
                <div className="flex-1">
                  <span className="text-base font-semibold text-[var(--color-gray-700)] group-hover:text-[var(--color-petroleum)] transition-colors block">
                    {opt.text}
                  </span>
                  <span className="text-xs text-[var(--color-gray-400)] group-hover:text-[var(--color-corporate)] transition-colors">
                    Opción {String.fromCharCode(65 + i)}
                  </span>
                </div>
                
                {/* Flecha animada */}
                <ArrowRight className="w-6 h-6 text-[var(--color-gray-300)] group-hover:text-[var(--color-corporate)] group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderResults = () => {
    if (!diagnosis || !diagnosis.styleDetails) {
      return (
        <div className="p-10 text-center text-[var(--color-gray-500)]">
          No hay resultados disponibles.
        </div>
      );
    }
    
    const qrUrl = buildResultsURL(diagnosis);
    const StyleIcon = diagnosis.styleDetails.icon;
    const moodFeedback = getMoodFeedback();
    
    const radarData = [
      { subject: 'Visual', A: diagnosis.counts?.visual || 0, fullMark: 10 },
      { subject: 'Auditivo', A: diagnosis.counts?.auditivo || 0, fullMark: 10 },
      { subject: 'Kinestésico', A: diagnosis.counts?.kinestesico || 0, fullMark: 10 },
    ];
    
    return (
      <div className="p-6 md:p-10 space-y-6">
        {/* HERO SECTION - Resultado principal con efectos 3D */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative rounded-3xl overflow-hidden text-center py-12 px-6 perspective-1000"
          style={{ background: diagnosis.styleDetails.bgGradient }}
        >
          {/* Capas de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-petroleum)] via-[var(--color-navy)] to-[var(--color-petroleum)]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-mint)]/20 via-transparent to-transparent"></div>
          
          {/* Orbes decorativos */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-corporate)] rounded-full blur-[140px] opacity-25 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-mint)] rounded-full blur-[120px] opacity-25 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          
          {/* Grid decorativo */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          ></div>
          
          <div className="relative z-10">
            {/* Emoji con animación */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="text-7xl mb-4 inline-block"
            >
              {moodFeedback.emoji}
              <span className="absolute -inset-4 rounded-full animate-ping opacity-30" style={{ backgroundColor: moodFeedback.color }}></span>
            </motion.div>
            
            {/* Badge de bienvenida */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 border border-white/20 backdrop-blur-md mb-4"
            >
              <span className="text-2xl">👋</span>
              <span className="text-lg font-bold text-white">Hola, {diagnosis.studentName}!</span>
              <span className="w-2 h-2 bg-[var(--color-mint)] rounded-full animate-pulse"></span>
            </motion.div>
            
            {/* Mensaje personalizado */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/90 text-lg mb-8 max-w-lg mx-auto leading-relaxed"
            >
              {moodFeedback.message}
            </motion.p>
            
            {/* Icono del estilo con efecto 3D */}
            <motion.div 
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="relative inline-block mb-6"
            >
              <div className="w-28 h-28 mx-auto rounded-3xl bg-white/10 flex items-center justify-center border border-white/30 backdrop-blur-md shadow-[0_0_40px_rgba(77,168,196,0.3)] perspective-500"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <StyleIcon className="w-14 h-14 text-white" style={{ filter: 'drop-shadow(0 0 20px rgba(77,168,196,0.5))' }} />
              </div>
              {/* Anillo decorativo */}
              <div className="absolute -inset-4 rounded-3xl border-2 border-white/20 animate-pulse-slow"></div>
            </motion.div>
            
            {/* Título del estilo */}
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-3xl md:text-4xl font-black text-white mb-4 tracking-wide"
              style={{ 
                textShadow: '0 0 40px rgba(77, 168, 196, 0.6), 0 0 80px rgba(77, 168, 196, 0.3)',
                letterSpacing: '0.05em'
              }}
            >
              {diagnosis.styleDetails.name}
            </motion.h3>
            
            {/* Porcentaje con efecto especial */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
              className="mb-6"
            >
              <div className="text-8xl md:text-9xl font-black text-white font-mono tracking-tighter relative inline-block"
                style={{
                  textShadow: '0 0 60px rgba(102, 204, 204, 0.8), 0 0 120px rgba(102, 204, 204, 0.4)'
                }}
              >
                {diagnosis.percentage}%
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-t-lg"></div>
              </div>
              <div className="text-white/60 text-sm mt-2 uppercase tracking-widest">de coincidencia</div>
            </motion.div>
            
            {/* Tiempo empleado */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md mt-2"
            >
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white/80 font-mono text-sm">
                Tiempo: <span className="text-white font-bold">{formatTime(diagnosis.timeSpent || elapsedTime)}</span>
              </span>
            </motion.div>
            
            {/* Descripción */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-white/80 max-w-md mx-auto text-base leading-relaxed"
            >
              {diagnosis.styleDetails.description}
            </motion.p>
          </div>
        </motion.div>
        
        {/* Sección de métricas con gráfico y barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico Radar */}
            <motion.div 
              ref={chartRef} 
              initial={{ opacity: 0, x: -30, rotateY: -30 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 1, type: 'spring' }}
              className="h-[300px] w-full bg-white rounded-3xl border border-[var(--color-gray-200)] p-6 shadow-[var(--shadow-lg)] perspective-1000"
            >
              <div className="text-sm font-bold text-[var(--color-petroleum)] mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-[var(--color-corporate)] rounded-full animate-pulse"></span>
                Distribución de Estilos
              </div>
                {isChartInView && (
                    <ResponsiveContainer width="100%" height="85%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="var(--color-gray-200)" />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tick={{ 
                                fill: 'var(--color-petroleum)', 
                                fontSize: 13, 
                                fontWeight: 700, 
                                fontFamily: 'var(--font-display)' 
                              }} 
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                            <Radar 
                              name="Estilo" 
                              dataKey="A" 
                              stroke="var(--color-corporate)" 
                              strokeWidth={3} 
                              fill="var(--color-corporate)" 
                              fillOpacity={0.3} 
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                )}
            </motion.div>
            
            {/* Barras de puntuación */}
            <div className="space-y-4">
                {[
                  { key: 'visual', label: 'Visual', icon: '👁️', color: 'var(--color-corporate)', barColor: 'from-[var(--color-corporate)] to-[var(--color-mint)]' },
                  { key: 'auditivo', label: 'Auditivo', icon: '👂', color: 'var(--color-mint)', barColor: 'from-[var(--color-mint)] to-[var(--color-accent)]' },
                  { key: 'kinestesico', label: 'Kinestésico', icon: '⚡', color: 'var(--color-accent)', barColor: 'from-[var(--color-accent)] to-[var(--color-corporate)]' }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.key}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + idx * 0.1 }}
                    className="p-5 rounded-2xl bg-white border border-[var(--color-gray-200)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <span className="font-bold text-[var(--color-petroleum)]">{item.label}</span>
                        </div>
                        <div className="text-mono-counter" style={{ color: item.color }}>
                          {diagnosis.counts?.[item.key] || 0}
                          <span className="text-sm text-[var(--color-gray-400)]">/10</span>
                        </div>
                    </div>
                    {/* Barra de progreso animada */}
                    <div className="h-3 bg-[var(--color-gray-100)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(diagnosis.counts?.[item.key] || 0) * 10}%` }}
                        transition={{ delay: 1.3 + idx * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${item.barColor}`}
                      >
                        <div className="h-full w-full bg-gradient-to-r from-white/30 to-transparent animate-shimmer"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
            </div>
        </div>
        
        {/* Consejo personalizado */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[var(--color-corporate)]/10 via-[var(--color-mint)]/10 to-[var(--color-accent)]/10 border-2 border-[var(--color-corporate)]/20 relative overflow-hidden"
        >
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-corporate)]/10 rounded-full blur-[40px]"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--color-mint)]/10 rounded-full blur-[30px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💡</span>
              <span className="text-lg font-bold text-[var(--color-petroleum)]">CONSEJO PERSONALIZADO</span>
              <span className="px-3 py-1 rounded-full bg-[var(--color-corporate)]/20 text-xs font-bold text-[var(--color-corporate)]">
                {moodFeedback.label}
              </span>
            </div>
            <p className="text-[var(--color-gray-700)] text-lg leading-relaxed">
              {diagnosis.styleDetails.tip}
            </p>
          </div>
        </motion.div>
        
        {/* Estrategias recomendadas */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
            <div className="text-lg font-bold text-[var(--color-petroleum)] mb-4 flex items-center gap-3">
              <span className="text-2xl">🎯</span> 
              <span>Estrategias Recomendadas</span>
              <span className="text-sm text-[var(--color-gray-400)]">(Basado en tu perfil)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(diagnosis.styleDetails.strategies || []).slice(0, 3).map((s, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.7 + idx * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="p-5 rounded-2xl bg-white border-2 border-[var(--color-gray-200)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-corporate)]/30 transition-all duration-300 relative overflow-hidden group"
                >
                    {/* Barra superior */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-corporate)] via-[var(--color-mint)] to-[var(--color-accent)]"></div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-[var(--color-corporate)]/10 flex items-center justify-center text-[var(--color-corporate)] font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="text-mono-sm text-[var(--color-gray-400)]">Estrategia</div>
                    </div>
                    <div className="text-[var(--color-petroleum)] font-semibold text-base leading-relaxed group-hover:text-[var(--color-corporate)] transition-colors">
                      {s}
                    </div>
                </motion.div>
            ))}
            </div>
        </motion.div>
        
        {/* Botones de acción */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="pt-6 border-t border-[var(--color-gray-200)] flex flex-col md:flex-row items-center justify-between gap-6"
        >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(77,168,196,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary px-10 py-5 text-lg flex items-center gap-3 shadow-[var(--shadow-lg)] relative overflow-hidden"
              onClick={exportPDF}
              disabled={pdfLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
              <Download className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{pdfLoading ? 'Generando...' : 'Descargar Resultados'}</span>
            </motion.button>
            
            {qrUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.1 }}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-[var(--shadow-md)] border-2 border-[var(--color-gray-200)] hover:border-[var(--color-corporate)]/30 transition-all"
            >
                <div className="relative">
                  <img src={qrUrl} alt="QR" className="w-16 h-16 rounded-xl" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-corporate)] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div>
                    <div className="text-xs font-bold text-[var(--color-petroleum)] uppercase tracking-wider">Verificar</div>
                    <div className="text-xs text-[var(--color-gray-400)] font-mono mt-1">edutechlife.co</div>
                </div>
            </motion.div>
            )}
        </motion.div>
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
    <div className={`min-h-screen section-bg-gradient py-6 md:py-10 px-3 md:px-4 relative overflow-hidden ${highContrast ? 'high-contrast-mode' : ''}`} style={highContrast ? {
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
      
      {/* FONDO 3D - ETAPA 2 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid 3D perspectiva */}
        <div 
          className="absolute inset-0 opacity-[0.03] hidden sm:block"
          style={{
            backgroundImage: `
              linear-gradient(rgba(77, 168, 196, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(77, 168, 196, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top'
          }}
        ></div>
        
        {/* Orbes flotantes animados */}
        <div className="absolute top-[5%] left-[5%] w-96 h-96 rounded-full animate-orb-1 opacity-40" 
          style={{ background: 'radial-gradient(circle, rgba(77, 168, 196, 0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full animate-orb-2 opacity-30" 
          style={{ background: 'radial-gradient(circle, rgba(102, 204, 204, 0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 rounded-full animate-orb-3 opacity-25" 
          style={{ background: 'radial-gradient(circle, rgba(0, 194, 224, 0.4) 0%, transparent 70%)' }}></div>
        
        {/* Partículas flotantes */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Zonas de glow decorativas */}
        <div className="fixed top-[5%] left-[25%] w-32 h-32 bg-[var(--color-corporate)]/5 rounded-full blur-[60px] animate-pulse-slow pointer-events-none"></div>
        <div className="fixed bottom-[15%] left-[10%] w-40 h-40 bg-[var(--color-mint)]/5 rounded-full blur-[80px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.5s' }}></div>
        <div className="fixed top-[40%] right-[15%] w-28 h-28 bg-[var(--color-accent)]/5 rounded-full blur-[50px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto mb-4 md:mb-6 flex justify-start">
        <button 
          onClick={onNavigate ? () => onNavigate('ecosystem') : undefined}
          className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Volver al Ecosistema</span>
          <span className="sm:hidden">Volver</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto glass-card rounded-2xl md:rounded-[2rem] overflow-hidden relative z-10 shadow-[var(--shadow-xl)]"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-corporate)] via-[var(--color-mint)] to-[var(--color-petroleum)]"></div>
        
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
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(77,168,196,0.1), rgba(102,204,204,0.1))', borderRadius: '12px', borderLeft: '4px solid #4DA8C4', marginBottom: '30px' }}>
                <h4 style={{ color: '#004B63', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>💡 Consejo Personalizado</h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>{diagnosis.styleDetails?.tip}</p>
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
              {phase === 'intro' && renderIntro()}
              {phase === 'calibration' && renderCalibration()}
              {phase === 'test' && renderTest()}
              {phase === 'result' && renderResults()}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default DiagnosticoVAK;