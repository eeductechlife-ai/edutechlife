import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Send, Mic, MicOff, ChevronRight, User, Sparkles, Download, Volume2, VolumeX, CheckCircle, ArrowLeft, Loader2, Eye, EyeOff, Award, Target, Zap, TrendingUp, BookOpen, Headphones, Hand, Eye as EyeIcon, AlertCircle, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import voiceEngine from '../utils/voiceEngine';

const calculateSpeechTimeout = (text) => {
  const baseTime = 500;
  const charsPerSecond = 150;
  const textLength = text.replace(/[#*`_~🎉🎯💡✨👏👍🎨🎧🎮🎬📚©®™°•↑↓→←↔↕]/g, '').length;
  return Math.max(1500, baseTime + (textLength / charsPerSecond) * 1000);
};

const calculateTypingTimeout = (text) => {
  const baseTime = 800;
  const wordsPerSecond = 20;
  const wordCount = text.split(/\s+/).length;
  return Math.max(1000, baseTime + (wordCount / wordsPerSecond) * 1000);
};

const DiagnosticoVAK = ({ onNavigate }) => {
  const [phase, setPhase] = useState('calibration');
  const [studentName, setStudentName] = useState('');
  const [mood, setMood] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Voice States
  const [voiceMode, setVoiceMode] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentCaption, setCurrentCaption] = useState('');
  const [voiceReady, setVoiceReady] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pdfTemplateRef = useRef(null);

  // Valeria Profile
  const VALERIA_PROFILE = {
    name: 'Valeria',
    title: 'Psicopedagoga Virtual Experta',
    experience: '12 años de experiencia',
    specialty: 'Metodología VAK y Neurociencias Aplicadas',
    greeting: `¡Hola! Soy Valeria, psicopedagoga virtual con más de 12 años de experiencia aplicando la metodología VAK en instituciones educativas. Estoy aquí para ayudarte a descubrir tu estilo de aprendizaje único. Este diagnóstico me permitirá darte herramientas personalizadas para que estudies de la manera más efectiva. ¿Cuál es tu nombre?`,
    nameResponse: (name) => `Mucho gusto, ${name}. Soy Valeria, psicopedagoga especialista en estilos de aprendizaje. Con ${VALERIA_PROFILE.experience} trabajando con estudiantes, he ayudado a miles de jóvenes a descubrir cómo aprenden mejor. ¿Cómo te sientes el día de hoy?`,
    moodIntro: (name) => `Gracias por compartirlo conmigo, ${name}. Como especialista en neuroeducación, sé que el estado emocional influye directamente en cómo procesamos nueva información. Ahora vamos a comenzar un diagnóstico divertido y rápido. Te haré 10 preguntas sobre situaciones cotidianas. ¿Listo/a?`,
    expertPhrases: [
      'Basándome en mi experiencia con miles de estudiantes...',
      'Según la metodología VAK que he aplicado exitosamente por más de una década...',
      'Como psicopedagoga con amplia experiencia en diagnóstico...',
      'En mi práctica profesional he observado que...',
    ]
  };

  // Questions with 4 options - School scenarios
  const questions = [
    {
      id: 1,
      text: "¿Cómo prefieres aprender a usar una nueva app en tu celular?",
      options: [
        { text: "Busco tutoriales en video o capturas de pantalla", type: "visual", icon: EyeIcon },
        { text: "Pido a alguien que me explique paso a paso", type: "auditivo", icon: Headphones },
        { text: "Empiezo a tocar todo y aprendo probando", type: "kinestesico", icon: Hand },
        { text: "Busco reseñas o comentarios de otros usuarios", type: "visual", icon: TrendingUp }
      ]
    },
    {
      id: 2,
      text: "En clase, ¿cómo retienes mejor la información de una lección?",
      options: [
        { text: "Copio las notas con colores y dibujos", type: "visual", icon: EyeIcon },
        { text: "Grabo la clase y la escucho después", type: "auditivo", icon: Headphones },
        { text: "Hago actividades o experimentos relacionados", type: "kinestesico", icon: Hand },
        { text: "Resumo lo importante hablando con un compañero", type: "auditivo", icon: User }
      ]
    },
    {
      id: 3,
      text: "¿Qué haces cuando necesitas memorizar fechas o datos para un examen?",
      options: [
        { text: "Hago tarjetas con colores y las repaso visualmente", type: "visual", icon: EyeIcon },
        { text: "Grabo una lista y la escucho repetidamente", type: "auditivo", icon: Headphones },
        { text: "Camino reciteando en voz alta mientras me muevo", type: "kinestesico", icon: Hand },
        { text: "Escribo las fechas muchas veces a mano", type: "kinestesico", icon: BookOpen }
      ]
    },
    {
      id: 4,
      text: "Estás en un video juego y necesitas aprender un nuevo control. ¿Qué haces?",
      options: [
        { text: "Leo las instrucciones escritas en pantalla", type: "visual", icon: EyeIcon },
        { text: "Escucho los comentarios del juego", type: "auditivo", icon: Headphones },
        { text: "Juego y aprendo tocando los botones", type: "kinestesico", icon: Hand },
        { text: "Busco un video tutorial en internet", type: "visual", icon: TrendingUp }
      ]
    },
    {
      id: 5,
      text: "¿Cómo explicas una idea a un amigo que no entiende un tema?",
      options: [
        { text: "Le hago un dibujo o esquema en papel", type: "visual", icon: EyeIcon },
        { text: "Le explico hablando con ejemplos", type: "auditivo", icon: Headphones },
        { text: "Busco algo físico para mostrarle cómo funciona", type: "kinestesico", icon: Hand },
        { text: "Le mando un audio explicándole", type: "auditivo", icon: Volume2 }
      ]
    },
    {
      id: 6,
      text: "¿Qué tipo de contenido prefieres ver en redes sociales?",
      options: [
        { text: "Reels o TikTok con imágenes y textos dinámicos", type: "visual", icon: EyeIcon },
        { text: "Podcasts o audios cortos e interesantes", type: "auditivo", icon: Headphones },
        { text: "Videos de manualidades o experimentos", type: "kinestesico", icon: Hand },
        { text: "Infografías con datos interesantes", type: "visual", icon: TrendingUp }
      ]
    },
    {
      id: 7,
      text: "Necesitas investigar para un trabajo escolar. ¿Cómo lo haces?",
      options: [
        { text: "Busco imágenes y videos relacionados con el tema", type: "visual", icon: EyeIcon },
        { text: "Escucho documentales o entrevistas sobre el tema", type: "auditivo", icon: Headphones },
        { text: "Hago un experimento o modelo físico del tema", type: "kinestesico", icon: Hand },
        { text: "Busco páginas con mucha información organizada", type: "visual", icon: BookOpen }
      ]
    },
    {
      id: 8,
      text: "¿Qué actividad te relaja más después de un día largo de clases?",
      options: [
        { text: "Ver series, películas o videos en internet", type: "visual", icon: EyeIcon },
        { text: "Escuchar música o podcasts", type: "auditivo", icon: Headphones },
        { text: "Hacer deporte, bailar o caminar", type: "kinestesico", icon: Hand },
        { text: "Jugar videojuegos o hacer manualidades", type: "kinestesico", icon: Zap }
      ]
    },
    {
      id: 9,
      text: "Tu profesor/a explica un tema nuevo. ¿Cómo aprendes mejor?",
      options: [
        { text: "Con presentaciones visuales, gráficos y diagramas", type: "visual", icon: EyeIcon },
        { text: "Cuando me explica con palabras y ejemplos orales", type: "auditivo", icon: Headphones },
        { text: "Cuando puedo hacer ejercicios prácticos inmediatamente", type: "kinestesico", icon: Hand },
        { text: "Cuando me deja tomar notas con diferentes colores", type: "visual", icon: BookOpen }
      ]
    },
    {
      id: 10,
      text: "¿Cómo te preparas mejor para una presentación o exposición?",
      options: [
        { text: "Preparo diapositivas y tarjetas visuales", type: "visual", icon: EyeIcon },
        { text: "Ensayo en voz alta muchas veces", type: "auditivo", icon: Headphones },
        { text: "Practico frente a un espejo moviéndome", type: "kinestesico", icon: Hand },
        { text: "Grabo mi voz para escucharme y mejorar", type: "auditivo", icon: Volume2 }
      ]
    }
  ];

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem('edutechlife_vak_state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setMessages(parsed.messages || []);
      setCurrentQuestion(parsed.currentQuestion || 0);
      setAnswers(parsed.answers || {});
      setPhase(parsed.phase || 'calibration');
      setStudentName(parsed.studentName || '');
      setMood(parsed.mood || '');
    }
  }, []);

  // Save state
  useEffect(() => {
    const state = {
      phase,
      studentName,
      mood,
      messages,
      currentQuestion,
      answers
    };
    localStorage.setItem('edutechlife_vak_state', JSON.stringify(state));
  }, [phase, studentName, mood, messages, currentQuestion, answers]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentCaption]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.code === 'Space' && voiceMode && !isSpeaking) {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
      
      if (e.code === 'Enter' && phase === 'calibration') {
        if (messages.length <= 2 && !mood) {
          handleNameSubmit();
        } else if (messages.length > 2 && !mood) {
          handleMoodSubmit();
        }
      }
      
      if (e.key === '1' && phase === 'test') {
        const options = questions[currentQuestion]?.options;
        if (options?.[0]) handleAnswer(options[0], 0);
      }
      if (e.key === '2' && phase === 'test') {
        const options = questions[currentQuestion]?.options;
        if (options?.[1]) handleAnswer(options[1], 1);
      }
      if (e.key === '3' && phase === 'test') {
        const options = questions[currentQuestion]?.options;
        if (options?.[2]) handleAnswer(options[2], 2);
      }
      if (e.key === '4' && phase === 'test') {
        const options = questions[currentQuestion]?.options;
        if (options?.[3]) handleAnswer(options[3], 3);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voiceMode, isSpeaking, isListening, phase, messages.length, mood, currentQuestion, questions, handleAnswer, handleNameSubmit, handleMoodSubmit, startListening, stopListening]);

  // Progress bar
  useEffect(() => {
    if (phase === 'test') {
      setProgress(((currentQuestion) / questions.length) * 100);
    }
  }, [currentQuestion, phase]);

  // Initialize Valeria greeting
  useEffect(() => {
    if (phase === 'calibration' && messages.length === 0) {
      setTimeout(() => {
        addMessage('assistant', VALERIA_PROFILE.greeting);
      }, 500);
    }
  }, [phase]);

  // Voice Engine Setup
  useEffect(() => {
    voiceEngine.onSpeakStart = () => {
      setIsSpeaking(true);
      setIsListening(false);
    };

    voiceEngine.onSpeakEnd = () => {
      setIsSpeaking(false);
      setCurrentCaption('');
      
      if (voiceMode && phase === 'test') {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    };

    voiceEngine.onListeningStart = () => {
      setIsListening(true);
    };

    voiceEngine.onListeningEnd = () => {
      setIsListening(false);
    };

    voiceEngine.onInterimResult = (text) => {
      setInterimTranscript(text);
    };

    voiceEngine.onFinalResult = (text) => {
      setInterimTranscript('');
      handleUserSpeech(text);
    };

    voiceEngine.onError = (error) => {
      console.error('Voice error:', error);
      setIsListening(false);
      
      let errorMessage = 'Error de voz';
      if (error === 'not-allowed') {
        errorMessage = 'Permiso de micrófono denegado';
      } else if (error === 'no-speech') {
        errorMessage = 'No se detectó voz, intenta de nuevo';
      } else if (error === 'network') {
        errorMessage = 'Error de red, verifica tu conexión';
      }
      setVoiceError(errorMessage);
      setTimeout(() => setVoiceError(null), 3000);
    };

    setVoiceReady(true);

    return () => {
      voiceEngine.stop();
      voiceEngine.onSpeakStart = null;
      voiceEngine.onSpeakEnd = null;
      voiceEngine.onListeningStart = null;
      voiceEngine.onListeningEnd = null;
      voiceEngine.onInterimResult = null;
      voiceEngine.onFinalResult = null;
      voiceEngine.onError = null;
    };
  }, [voiceMode, phase, startListening, handleUserSpeech]);

  // Add message to chat
  const addMessage = useCallback((role, content) => {
    setMessages(prev => [...prev, { id: Date.now(), role, content, timestamp: new Date() }]);
    
    if (role === 'assistant' && voiceMode) {
      setCurrentCaption(content);
      voiceEngine.speak(content);
    }
  }, [voiceMode]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    voiceEngine.stop();
    setIsSpeaking(false);
    setCurrentCaption('');
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!voiceMode || isSpeaking) return;
    
    setInterimTranscript('');
    voiceEngine.startListening();
  }, [voiceMode, isSpeaking]);

  // Stop listening
  const stopListening = useCallback(() => {
    voiceEngine.stopListening();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Toggle voice mode
  const toggleVoiceMode = useCallback(() => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    
    if (newMode) {
      voiceEngine.setConversationMode(true);
      addMessage('assistant', 'He activado el modo voz. Ahora puedes hablarme y te responderé en voz alta. Cuando veas el ícono verde del micrófono, puedes hablarme tu respuesta. 🎤');
    } else {
      voiceEngine.setConversationMode(false);
      stopSpeaking();
      stopListening();
    }
  }, [voiceMode, addMessage, stopSpeaking, stopListening]);

  // Toggle captions
  const toggleCaptions = useCallback(() => {
    setCaptionsEnabled(prev => !prev);
  }, []);

  // Handle user speech input
  const handleUserSpeech = useCallback((text) => {
    if (!text.trim()) return;
    
    if (phase === 'calibration') {
      if (messages.length <= 2) {
        setStudentName(text);
        addMessage('user', text);
        setIsTyping(true);
        
        const response = VALERIA_PROFILE.nameResponse(text);
        setTimeout(() => {
          setIsTyping(false);
          addMessage('assistant', response);
          
          if (voiceMode) {
            setTimeout(() => startListening(), calculateSpeechTimeout(response));
          }
        }, calculateTypingTimeout(text));
      } else if (!mood) {
        setMood(text);
        addMessage('user', text);
        setIsTyping(true);
        
        const moodResponse = VALERIA_PROFILE.moodIntro(studentName || text);
        const questionText = questions[0].text;
        
        setTimeout(() => {
          setIsTyping(false);
          addMessage('assistant', moodResponse);
          
          setTimeout(() => {
            addMessage('assistant', questionText);
            setPhase('test');
            
            if (voiceMode) {
              setTimeout(() => startListening(), calculateSpeechTimeout(questionText));
            }
          }, calculateTypingTimeout(moodResponse));
        }, calculateTypingTimeout(text));
      }
    }
  }, [phase, messages.length, mood, studentName, addMessage, voiceMode, startListening]);

  // Handle text input (name)
  const handleNameSubmit = () => {
    if (!studentName.trim()) return;
    handleUserSpeech(studentName);
  };

  // Handle mood input
  const handleMoodSubmit = () => {
    if (!mood.trim()) return;
    handleUserSpeech(mood);
  };

  // Handle answer selection
  const handleAnswer = useCallback((option, index) => {
    if (soundEnabled) {
      playSelectSound();
    }
    
    const newAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(newAnswers);
    
    addMessage('user', option.text);
    setIsTyping(true);
    
    const expertPhrase = VALERIA_PROFILE.expertPhrases[Math.floor(Math.random() * VALERIA_PROFILE.expertPhrases.length)];
    const responses = [
      `${expertPhrase} esta respuesta es muy reveladora.`,
      'Interesante elección. Cada respuesta me ayuda a conocerte mejor.',
      `${expertPhrase} eso me dice mucho sobre cómo procesas información.`,
      '¡Excelente! Continuemos con la siguiente pregunta.'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const transitionText = `${randomResponse} Aquí va la siguiente:`;
    const nextQuestion = questions[currentQuestion + 1].text;
    const completionText = `${randomResponse} ¡Excelente! Ya completaste todas las preguntas. Ahora analizaré tus respuestas para darte tu perfil de aprendizaje personalizado.`;
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentQuestion < questions.length - 1) {
        addMessage('assistant', transitionText);
        
        setTimeout(() => {
          addMessage('assistant', nextQuestion);
          setCurrentQuestion(prev => prev + 1);
          
          if (voiceMode) {
            setTimeout(() => startListening(), calculateSpeechTimeout(nextQuestion));
          }
        }, calculateTypingTimeout(transitionText));
      } else {
        addMessage('assistant', completionText);
        
        setTimeout(() => {
          analyzeResults(newAnswers);
        }, calculateSpeechTimeout(completionText));
      }
    }, calculateTypingTimeout(option.text));
  }, [answers, currentQuestion, addMessage, voiceMode, startListening, soundEnabled]);

  const playSelectSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio not supported
    }
  };

  // Analyze results
  const analyzeResults = async (finalAnswers) => {
    setIsTyping(true);
    addMessage('assistant', 'Analizando tus respuestas... esto es fascinante. Cada patrón que veo me confirma tu estilo único de aprendizaje. 🎯');

    setTimeout(() => {
      const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
      Object.values(finalAnswers).forEach(answer => {
        if (answer.type === 'visual') counts.visual++;
        else if (answer.type === 'auditivo') counts.auditivo++;
        else if (answer.type === 'kinestesico') counts.kinestesico++;
      });

      const maxType = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

      const styles = {
        visual: {
          name: "APRENDIZ VISUAL",
          icon: EyeIcon,
          color: '#4DA8C4',
          bgColor: 'rgba(77, 168, 196, 0.15)',
          borderColor: '#4DA8C4',
          description: `${VALERIA_PROFILE.name}, como psicopedagoga con ${VALERIA_PROFILE.experience}, puedo decirte que eres un aprendiz VISUAL. Tu cerebro procesa mejor la información cuando la ves. Los gráficos, mapas mentales, colores y todo lo visual son tus aliados para aprender.`,
          hacks: [
            "Usa colores, marcadores y subrayados para destacar información importante",
            "Crea mapas mentales con imágenes y símbolos",
            "Visualiza conceptos: imagina escenas mientras estudias",
            "Usa videos educativos y tutoriales gráficos",
            "Organiza tus notas con esquemas y diagrams coloridos"
          ]
        },
        auditivo: {
          name: "APRENDIZ AUDITIVO",
          icon: Headphones,
          color: '#66CCCC',
          bgColor: 'rgba(102, 204, 204, 0.15)',
          borderColor: '#66CCCC',
          description: `${VALERIA_PROFILE.name}, con mi experiencia en diagnóstico VAK, he identificado que eres un aprendiz AUDITIVO. Aprendes mejor escuchando y hablando. Las explicaciones orales y los sonidos son tu puerta al conocimiento.`,
          hacks: [
            "Graba tus notas y escuchalas mientras caminas o haces ejercicio",
            "Explica los temas en voz alta, como si enseñaras a alguien",
            "Escucha podcasts y audiolibros sobre tus materias",
            "Participa en discussions y debates sobre lo que aprendes",
            "Usa música instrumental suave mientras estudias"
          ]
        },
        kinestesico: {
          name: "APRENDIZ KINESTÉSICO",
          icon: Hand,
          color: '#FF6B9D',
          bgColor: 'rgba(255, 107, 157, 0.15)',
          borderColor: '#FF6B9D',
          description: `${VALERIA_PROFILE.name}, basándome en más de una década aplicando la metodología VAK, puedo confirmarte que eres un aprendiz KINESTÉSICO. Necesitas tocar, moverte y experimentar para aprender de verdad. El movimiento y la práctica activa son tus mejores aliados.`,
          hacks: [
            "Usa tarjetas o fichas físicas que puedas manipular",
            "Toma notas a mano, no en laptop",
            "Haz pausas activas: levántate, estírate entre temas",
            "Busca ejercicios prácticos y experimentos",
            "Relaciona lo que aprendes con experiencias de tu vida"
          ]
        }
      };

      const result = {
        studentName,
        mood,
        counts,
        predominantStyle: maxType,
        styleDetails: styles[maxType],
        date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
        percentage: Math.round((counts[maxType] / 10) * 100)
      };

      setDiagnosis(result);
      setPhase('result');
      setIsTyping(false);
      setShowResults(true);
      
      addMessage('assistant', `${studentName}, aquí está tu resultado. Tu perfil como ${styles[maxType].name} es súper claro. Ahora tendrás herramientas personalizadas para estudiar de la manera más efectiva para ti. 🎉`);
    }, 3500);
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!diagnosis || !studentName) return;
    
    setPdfLoading(true);
    setShowPdfPreview(true);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const element = pdfTemplateRef.current;
    if (!element) {
      setPdfLoading(false);
      setShowPdfPreview(false);
      return;
    }
    
    const fileName = `Diagnostico_VAK_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setPdfLoading(false);
    setShowPdfPreview(false);
  };

  // Reset test
  const handleReset = () => {
    setPhase('calibration');
    setStudentName('');
    setMood('');
    setMessages([]);
    setCurrentQuestion(0);
    setAnswers({});
    setDiagnosis(null);
    setProgress(0);
    setShowResults(false);
    stopSpeaking();
    stopListening();
    localStorage.removeItem('edutechlife_vak_state');
  };

  // Get status text
  const getStatusText = () => {
    if (isSpeaking) return 'Hablando...';
    if (isListening) return 'Escuchando...';
    if (voiceMode) return 'Modo voz activo';
    return 'En línea';
  };

  // Get header glow color based on state
  const getGlowColor = () => {
    if (isListening) return '#FF6B9D';
    if (isSpeaking) return '#4DA8C4';
    if (voiceMode) return '#66CCCC';
    return '#004B63';
  };

  // Get status icon
  const StatusIcon = isListening ? MicOff : isSpeaking ? Volume2 : Brain;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0F19 0%, #0D1321 50%, #1a1f2e 100%)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${getGlowColor()}40, transparent)`, filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #66CCCC40, transparent)', filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite reverse' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFD16640, transparent)', filter: 'blur(60px)', animation: 'float 6s ease-in-out infinite' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto p-6">
        {/* Premium Header */}
        <div className="mb-8">
          {/* Back Button */}
          <button
            onClick={() => {
              if (phase === 'test' && Object.keys(answers).length > 0) {
                setShowExitConfirm(true);
              } else {
                onNavigate('landing');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Volver</span>
          </button>

          {/* Main Header Card */}
          <div 
            className="relative rounded-3xl p-8 overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 75, 99, 0.6) 0%, rgba(11, 15, 25, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${getGlowColor()}40`,
              boxShadow: `0 0 40px ${getGlowColor()}20, inset 0 1px 0 rgba(255,255,255,0.1)`
            }}
          >
            {/* Animated Border Glow */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-50"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${getGlowColor()}, transparent)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            />

            {/* Content */}
            <div className="relative flex items-center justify-between">
              {/* Left: Valeria Info */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${getGlowColor()}, #004B63)`,
                      boxShadow: `0 0 30px ${getGlowColor()}40`
                    }}
                  >
                    <StatusIcon className="w-10 h-10 text-white" />
                  </div>
                  {/* Status Ring */}
                  <div 
                    className="absolute -inset-2 rounded-3xl border-2 animate-pulse"
                    style={{ borderColor: getGlowColor() }}
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white font-montserrat">
                      {VALERIA_PROFILE.name}
                    </h1>
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      <span className="text-xs text-white/80">Premium</span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    {VALERIA_PROFILE.title} • {VALERIA_PROFILE.experience}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {VALERIA_PROFILE.specialty}
                  </p>
                </div>
              </div>

              {/* Right: Voice Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    soundEnabled 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                  title="Sonidos de interfaz"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleCaptions}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    captionsEnabled 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                  title="Subtítulos"
                >
                  {captionsEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleVoiceMode}
                  className={`px-6 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all duration-300 ${
                    voiceMode 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {voiceMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  <span>{voiceMode ? 'Voz ON' : 'Voz OFF'}</span>
                </button>
                
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-3 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-500/30"
                  >
                    <VolumeX className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : isSpeaking ? 'bg-green-500 animate-bounce' : 'bg-[#66CCCC]'}`}
                  />
                  <span className="text-white/60 text-sm">{getStatusText()}</span>
                </div>
              </div>

              {voiceMode && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
                  <span className="text-white/80 text-xs">
                    {isListening ? 'Habla ahora...' : isSpeaking ? 'Escuchando...' : 'Listo para escuchar'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (Test Phase) */}
        {phase === 'test' && (
          <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(0, 75, 99, 0.3)', backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-sm font-medium">Progreso del Diagnóstico</span>
              <span className="text-white font-bold font-mono">{currentQuestion + 1} / {questions.length}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #004B63, #4DA8C4, #66CCCC)',
                  boxShadow: '0 0 20px #4DA8C440'
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {['Visual', 'Auditivo', 'Kinestésico'].map((type, i) => {
                const counts = { visual: 0, auditivo: 0, kinestesico: 0 };
                Object.values(answers).forEach(a => counts[a.type]++);
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      i === 0 ? 'bg-[#4DA8C4]' : i === 1 ? 'bg-[#66CCCC]' : 'bg-[#FF6B9D]'
                    }`} />
                    <span className="text-white/50 text-xs">{type}: {counts[['visual', 'auditivo', 'kinestesico'][i]]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div 
          className="rounded-3xl overflow-hidden"
          style={{ 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Captions Display */}
          {captionsEnabled && (currentCaption || interimTranscript) && (
            <div 
              className={`px-6 py-4 border-b border-white/10 ${isSpeaking ? 'animate-pulse' : ''}`}
              style={{ background: 'rgba(77, 168, 196, 0.1)' }}
            >
              <p className="text-white/90 text-sm font-medium">
                {isSpeaking ? currentCaption : interimTranscript}
                {isListening && interimTranscript && <span className="animate-pulse">...</span>}
              </p>
            </div>
          )}

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="h-[400px] overflow-y-auto p-6 space-y-6"
          >
            {messages.map((message, index) => (
              <div 
                key={message.id}
                className={`flex animate-message-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`flex gap-4 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC]' 
                      : 'bg-gradient-to-br from-[#004B63] to-[#4DA8C4]'
                  }`}>
                    {message.role === 'assistant' 
                      ? <Brain className="w-6 h-6 text-white" />
                      : <User className="w-6 h-6 text-white" />
                    }
                  </div>
                  
                  {/* Bubble */}
                  <div 
                    className={`rounded-2xl px-6 py-4 ${
                      message.role === 'assistant'
                        ? 'rounded-tl-none'
                        : 'rounded-tr-none'
                    }`}
                    style={{
                      background: message.role === 'assistant' 
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'linear-gradient(135deg, #4DA8C4, #66CCCC)',
                      border: message.role === 'assistant' 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : 'none'
                    }}
                  >
                    <p className="text-white font-open-sans whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <span className={`text-xs mt-2 block ${message.role === 'assistant' ? 'text-white/40' : 'text-white/70'}`}>
                      {new Date(message.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-message-in">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none px-6 py-4 bg-white/5 border border-white/10">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-[#4DA8C4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#004B63] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Name */}
          {phase === 'calibration' && messages.length > 0 && !mood && (
            <div className="p-6 border-t border-white/10" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={studentName || interimTranscript}
                    onChange={(e) => setStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    placeholder="Escribe tu nombre..."
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4DA8C4] transition-all font-open-sans"
                  />
                  {voiceMode && (
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleNameSubmit}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-semibold hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* Input Area - Mood */}
          {phase === 'calibration' && messages.length > 2 && mood === '' && (
            <div className="p-6 border-t border-white/10" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={mood || interimTranscript}
                    onChange={(e) => setMood(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMoodSubmit()}
                    placeholder="¿Cómo te sientes hoy?"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#4DA8C4] transition-all font-open-sans"
                  />
                  {voiceMode && (
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleMoodSubmit}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-semibold hover:shadow-lg hover:shadow-[#4DA8C4]/30 transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </button>
              </div>
            </div>
          )}

          {/* Options - Test Phase */}
          {phase === 'test' && questions[currentQuestion] && (
            <div className="p-6 border-t border-white/10" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
              {/* Question */}
              <h3 className="text-xl font-bold text-white mb-6 font-montserrat">
                {questions[currentQuestion].text}
              </h3>
              
              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => {
                  const OptionIcon = option.icon;
                  const typeColors = {
                    visual: { bg: 'rgba(77, 168, 196, 0.1)', border: '#4DA8C4', icon: '#4DA8C4' },
                    auditivo: { bg: 'rgba(102, 204, 204, 0.1)', border: '#66CCCC', icon: '#66CCCC' },
                    kinestesico: { bg: 'rgba(255, 107, 157, 0.1)', border: '#FF6B9D', icon: '#FF6B9D' }
                  };
                  const colors = typeColors[option.type];
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option, index)}
                      className="group relative p-5 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                      style={{
                        background: colors.bg,
                        border: `1px solid ${colors.border}40`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${colors.border}20` }}
                        >
                          <OptionIcon className="w-6 h-6" style={{ color: colors.icon }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/40 text-xs">{String.fromCharCode(65 + index)})</span>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white/60 text-xs font-mono">{index + 1}</span>
                          </div>
                          <p className="text-white font-medium">{option.text}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Voice Button */}
              {voiceMode && !isListening && !isSpeaking && (
                <button
                  onClick={startListening}
                  className="mt-6 w-full py-4 rounded-xl border-2 border-dashed border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <Mic className="w-5 h-5" />
                  <span>También puedes decir tu respuesta en voz alta</span>
                </button>
              )}
              
              {/* Keyboard Shortcuts Hint */}
              <div className="mt-6 flex items-center justify-center gap-6 text-white/40 text-xs">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded bg-white/10 font-mono">1-4</kbd>
                  <span>Seleccionar</span>
                </div>
                {voiceMode && (
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 rounded bg-white/10 font-mono">Espacio</kbd>
                    <span>Micrófono</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {phase === 'result' && diagnosis && showResults && (
          <div className="mt-8 animate-results-in">
            {/* Result Card */}
            <div 
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 75, 99, 0.8) 0%, rgba(11, 15, 25, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${diagnosis.styleDetails.borderColor}40`,
                boxShadow: `0 0 60px ${diagnosis.styleDetails.borderColor}20`
              }}
            >
              {/* Header with Animation */}
              <div 
                className="relative p-12 text-center"
                style={{
                  background: `linear-gradient(135deg, ${diagnosis.styleDetails.borderColor}20 0%, transparent 100%)`
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <diagnosis.styleDetails.icon className="w-64 h-64" style={{ color: diagnosis.styleDetails.color }} />
                </div>
                
                <div className="relative">
                  <div 
                    className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6"
                    style={{ 
                      background: `linear-gradient(135deg, ${diagnosis.styleDetails.color}, ${diagnosis.styleDetails.borderColor})`,
                      boxShadow: `0 0 40px ${diagnosis.styleDetails.color}40`
                    }}
                  >
                    <diagnosis.styleDetails.icon className="w-12 h-12 text-white" />
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white font-montserrat mb-2">
                    {diagnosis.styleDetails.name}
                  </h2>
                  <p className="text-white/60 text-lg">
                    {diagnosis.percentage}% de compatibilidad
                  </p>
                  
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-[#FFD166]" />
                    <span className="text-[#FFD166] text-sm">Perfil Descubierto</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Visual', value: diagnosis.counts.visual, color: '#4DA8C4' },
                    { label: 'Auditivo', value: diagnosis.counts.auditivo, color: '#66CCCC' },
                    { label: 'Kinestésico', value: diagnosis.counts.kinestesico, color: '#FF6B9D' }
                  ].map((stat, i) => (
                    <div 
                      key={stat.label}
                      className="text-center p-4 rounded-xl"
                      style={{ 
                        background: `${stat.color}10`,
                        border: `1px solid ${stat.color}30`
                      }}
                    >
                      <div className="text-3xl font-bold font-montserrat" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="text-white/60 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/90 leading-relaxed">
                    {diagnosis.styleDetails.description}
                  </p>
                </div>

                {/* Hacks */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white font-montserrat mb-4 flex items-center gap-3">
                    <Target className="w-6 h-6 text-[#FFD166]" />
                    Estrategias de Estudio Personalizadas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {diagnosis.styleDetails.hacks.map((hack, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl"
                        style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                      >
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: diagnosis.styleDetails.color }} />
                        <p className="text-white/80">{hack}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleExportPDF}
                    disabled={pdfLoading}
                    className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF6B9D] to-[#FF8E53] text-white font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-[#FF6B9D]/30 transition-all"
                  >
                    {pdfLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>DESCARGAR REPORTE PDF</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 px-6 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    Nuevo Diagnóstico
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(11, 15, 25, 0.9)', backdropFilter: 'blur(8px)' }}>
          <div 
            className="rounded-2xl p-8 max-w-md w-full"
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 75, 99, 0.9) 0%, rgba(11, 15, 25, 0.95) 100%)',
              border: '1px solid #4DA8C440'
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B9D]/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#FF6B9D]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-montserrat">
                  ¿Abandonar diagnóstico?
                </h3>
                <p className="text-white/60 text-sm">
                  Perderás tu progreso actual
                </p>
              </div>
            </div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Has respondido {Object.keys(answers).length} de {questions.length} preguntas. 
              Si sales ahora, perderás todo tu progreso y tendrás que comenzar de nuevo.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Continuar
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  handleReset();
                  onNavigate('landing');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#FF6B9D] text-white font-semibold hover:bg-[#FF6B9D]/80 transition-all"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Error Toast */}
      {voiceError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl bg-red-500/90 text-white flex items-center gap-3 shadow-lg animate-slide-up">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{voiceError}</span>
          <button 
            onClick={() => setVoiceError(null)}
            className="ml-2 hover:bg-white/20 rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PDF Loading Overlay */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(11, 15, 25, 0.95)' }}>
          <div 
            className="p-12 rounded-3xl text-center"
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 75, 99, 0.8) 0%, rgba(11, 15, 25, 0.95) 100%)',
              border: '1px solid #4DA8C440'
            }}
          >
            <Loader2 className="w-16 h-16 text-[#4DA8C4] animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white font-montserrat mb-2">
              Generando Reporte Profesional
            </h3>
            <p className="text-white/60">
              La psicóloga virtual está preparando tu documento PDF...
            </p>
          </div>
        </div>
      )}

      {/* Hidden PDF Template */}
      <div ref={pdfTemplateRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', background: 'white', fontFamily: "'Open Sans', Arial, sans-serif" }}>
        <div style={{ background: 'linear-gradient(135deg, #004B63 0%, #4DA8C4 100%)', padding: '25px 30px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🎓</div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>EDUTECHLIFE</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>DIAGNÓSTICO NEURO-EDUCATIVO VAK</div>
              <div style={{ fontSize: '10px', opacity: '0.8', marginTop: '5px' }}>Fecha: {diagnosis?.date}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '25px 30px' }}>
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Estudiante</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#004B63' }}>{diagnosis?.studentName}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Estado Emocional</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#004B63' }}>{diagnosis?.mood || 'No registrado'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Diagnóstico</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#4DA8C4' }}>{diagnosis?.styleDetails?.name}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#004B63', marginBottom: '15px' }}>📊 Análisis de Resultados</div>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#4DA8C4' }}>{diagnosis?.counts?.visual || 0}/10</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Visual</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#66CCCC' }}>{diagnosis?.counts?.auditivo || 0}/10</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Auditivo</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#FF6B9D' }}>{diagnosis?.counts?.kinestesico || 0}/10</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Kinestésico</div>
              </div>
            </div>
          </div>

          <p style={{ marginTop: '20px', fontSize: '12px', lineHeight: '1.8', color: '#334155' }}>
            {diagnosis?.styleDetails?.description}
          </p>
        </div>

        <div style={{ padding: '25px 30px', borderTop: '2px solid #E2E8F0' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#004B63', marginBottom: '15px' }}>💡 Estrategias de Estudio</div>
          {(diagnosis?.styleDetails?.hacks || []).map((hack, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 15px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '10px', borderLeft: '4px solid #4DA8C4' }}>
              <div style={{ width: '28px', height: '28px', background: '#4DA8C4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', flexShrink: 0 }}>✓</div>
              <div style={{ fontSize: '11px', lineHeight: '1.6', color: '#334155' }}>{hack}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#004B63', padding: '20px 30px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '9px', opacity: '0.9' }}>
              <strong style={{ display: 'block', fontSize: '10px' }}>DOCUMENTO OFICIAL VERIFICADO</strong>
              Edutechlife v2.286 - Neuro-Educación Premium
            </div>
            <div style={{ fontSize: '9px', opacity: '0.8', textAlign: 'right' }}>
              <strong>{VALERIA_PROFILE.name} - {VALERIA_PROFILE.title}</strong><br/>
              {VALERIA_PROFILE.experience}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes message-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes results-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-message-in {
          animation: message-in 0.4s ease-out forwards;
        }
        .animate-results-in {
          animation: results-in 0.6s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DiagnosticoVAK;
