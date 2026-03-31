import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Bot, User, CheckCircle } from 'lucide-react';
import useConversationMemory from '../../hooks/useConversationMemory';
import useLeadManagement from '../../hooks/useLeadManagement';
import useLeadCaptureLogic from '../../hooks/useLeadCaptureLogic';
import useAppointmentScheduling from '../../hooks/useAppointmentScheduling';
import { callDeepseek } from '../../utils/api';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import { createSpeechRecognition } from '../../utils/speechRecognition';

// Carga diferida para componentes que no se usan inmediatamente
const LeadCaptureForm = lazy(() => import('./LeadCaptureForm'));
const AppointmentScheduler = lazy(() => import('./AppointmentScheduler'));

const COLORS = {
  NAVY: '#0A1628',
  PETROLEUM: '#004B63',
  CORPORATE: '#4DA8C4',
  MINT: '#66CCCC',
  SOFT_BLUE: '#B2D8E5'
};

// Simple response cache
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const removeEmojis = (text) => {
  if (!text) return '';
  
  let cleanText = text;
  
  // Eliminar emojis Unicode completos
  const emojiRanges = [
    '\u{1F300}-\u{1F9FF}', // Emojis variados
    '\u{1F600}-\u{1F64F}', // Caritas sonrientes
    '\u{1F680}-\u{1F6FF}', // Transporte
    '\u{2600}-\u{26FF}',   // Misc
    '\u{2700}-\u{27BF}',   // Dingbats
    '\u{1FA00}-\u{1FA6F}', // Emoji 12+
    '\u{1FA70}-\u{1FAFF}', // Emoji 13+
    '\u{1F900}-\u{1F9FF}', // Emoji 11+
    '\u{1F018}-\u{1F270}', // Símbolos antiguos
    '\u{1F700}-\u{1F77F}', // Símbolos
  ];
  
  emojiRanges.forEach(range => {
    const regex = new RegExp(`[${range}]`, 'gmu');
    cleanText = cleanText.replace(regex, '');
  });
  
  // Eliminar selectores de variación
  cleanText = cleanText.replace(/[\uFE0F\uFE0E\u{1F3FB}-\u{1F3FF}]/gmu, '');
  
  // Eliminar "xxx" y variaciones (a veces aparecen como marcador)
  cleanText = cleanText.replace(/\bxxx+\b/gi, '');
  cleanText = cleanText.replace(/\bx{2,}\b/gi, '');
  
  // Eliminar caracteres especiales no deseados
  cleanText = cleanText.replace(/[*_~]{2,}/g, ''); // ***, ___, ~~~
  cleanText = cleanText.replace(/[▓░▒█▲▼◆■●○]{2,}/g, ''); // Bloques decorativos
  
  // Limpiar espacios múltiples
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  // Si queda vacío o solo espacios/puntos, devolver texto original sin emojis
  if (!cleanText || /^[\s.\-_]*$/.test(cleanText)) {
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/\bxxx+\b/gi, '')
      .replace(/\s+/g, ' ').trim();
  }
  
  return cleanText;
};

// Función para simplificar respuestas largas manteniendo claridad
const simplifyResponse = (text) => {
  if (!text || text.length <= 300) return text;
  
  // Dividir en oraciones
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= 3) {
    // Si ya es corta, devolver tal cual
    return text;
  }
  
  // Tomar las 3 primeras oraciones (las más importantes)
  const importantSentences = sentences.slice(0, 3);
  let simplified = importantSentences.join('. ') + '.';
  
  // Agregar oferta de más información si es necesario
  if (sentences.length > 3) {
    simplified += ' ¿Te gustaría más detalles sobre algún punto específico?';
  }
  
  return simplified;
};

// Función para optimizar conversaciones largas
const optimizeLongConversation = (messages, maxMessages = 20) => {
  if (messages.length <= maxMessages) {
    return messages;
  }
  
  // Mantener los primeros mensajes (saludo inicial)
  const firstMessages = messages.slice(0, 3);
  
  // Mantener los últimos mensajes (conversación reciente)
  const lastMessages = messages.slice(-(maxMessages - 3));
  
  // Crear mensaje de resumen si hay muchos mensajes en el medio
  const removedCount = messages.length - (firstMessages.length + lastMessages.length);
  if (removedCount > 0) {
    const summaryMessage = {
      role: 'system',
      content: `[Se omitieron ${removedCount} mensajes anteriores para optimizar la conversación]`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };
    
    return [...firstMessages, summaryMessage, ...lastMessages];
  }
  
  return [...firstMessages, ...lastMessages];
};

// Sistema de respuestas rápidas para preguntas comunes
const getQuickResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Preguntas sobre servicios
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenas')) {
    return `Hola soy Nico, en qué te puedo ayudar. Ofrecemos servicios educativos como VAK, STEM, tutorías y bienestar. ¿Te interesa alguno?`;
  }
  
  if (lowerMessage.includes('qué es') && lowerMessage.includes('vak')) {
    return `VAK son estilos de aprendizaje: Visual, Auditivo y Kinestésico. Identificamos cómo aprendes mejor para personalizar tu educación.`;
  }
  
  if (lowerMessage.includes('qué es') && lowerMessage.includes('stem')) {
    return `STEM es Ciencia, Tecnología, Ingeniería y Matemáticas. Desarrollamos habilidades del futuro con proyectos prácticos.`;
  }
  
  if (lowerMessage.includes('tutoría') || lowerMessage.includes('clases')) {
    return `Ofrecemos tutorías personalizadas en todas las materias. ¿Qué nivel educativo necesitas?`;
  }
  
  if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta')) {
    return `Tenemos diferentes planes según tus necesidades. ¿Te gustaría una clase gratuita para conocer nuestros servicios?`;
  }
  
  if (lowerMessage.includes('clase gratuita') || lowerMessage.includes('prueba')) {
    return `¡Excelente! Para agendar tu clase gratuita, necesito tu nombre y teléfono. ¿Me los compartes?`;
  }
  
  if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('whatsapp')) {
    return `Puedes contactarnos al WhatsApp: +57 300 123 4567 o visitar edutechlife.com`;
  }
  
  // Preguntas generales
  if (lowerMessage.includes('quién eres') || lowerMessage.includes('qué haces')) {
    return `Hola soy Nico, en qué te puedo ayudar. Soy asistente virtual de EdutechLife. Ayudo a personas a encontrar el mejor camino educativo.`;
  }
  
  if (lowerMessage.includes('ayuda') || lowerMessage.includes('información')) {
    return `Con gusto te ayudo. ¿Te interesa VAK, STEM, tutorías o bienestar educativo?`;
  }
  
  // Más respuestas rápidas agregadas
  if (lowerMessage.includes('edad') || lowerMessage.includes('años')) {
    return `Trabajamos con todas las edades: niños, adolescentes y adultos. ¿Para qué edad necesitas los servicios?`;
  }
  
  if (lowerMessage.includes('horario') || lowerMessage.includes('horas')) {
    return `Tenemos horarios flexibles: mañana, tarde y noche. ¿Qué horario te funciona mejor?`;
  }
  
  if (lowerMessage.includes('online') || lowerMessage.includes('virtual')) {
    return `¡Sí! Ofrecemos clases 100% online y también presenciales. ¿Cuál prefieres?`;
  }
  
  if (lowerMessage.includes('presencial') || lowerMessage.includes('físico')) {
    return `Tenemos sedes en varias ciudades. ¿En qué ciudad te encuentras?`;
  }
  
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thank you')) {
    return `¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que te pueda asistir?`;
  }
  
  if (lowerMessage.includes('adiós') || lowerMessage.includes('chao') || lowerMessage.includes('bye')) {
    return `¡Fue un gusto ayudarte! Recuerda que puedes contactarnos al WhatsApp: +57 300 123 4567. ¡Hasta pronto!`;
  }
  
  if (lowerMessage.includes('nombre') && lowerMessage.includes('llamas')) {
    return `Hola soy Nico, en qué te puedo ayudar. Soy tu asistente educativo. ¿Cuál es tu nombre?`;
  }
  
  if (lowerMessage.includes('bienestar') || lowerMessage.includes('salud mental')) {
    return `El bienestar educativo incluye apoyo emocional, manejo de estrés y técnicas de estudio. ¿Te interesa algún área específica?`;
  }
  
  if (lowerMessage.includes('matemática') || lowerMessage.includes('matemáticas')) {
    return `Tenemos tutores especializados en matemáticas para todos los niveles. ¿Qué tema necesitas reforzar?`;
  }
  
  if (lowerMessage.includes('inglés') || lowerMessage.includes('english')) {
    return `Ofrecemos clases de inglés para todos los niveles, desde básico hasta avanzado. ¿Qué nivel tienes?`;
  }
  
  return null; // No hay respuesta rápida disponible
};

// Función para generar sugerencias de preguntas basadas en el contexto
const getQuestionSuggestions = (messages, currentTopic = '') => {
  const suggestions = [];
  
  // Si no hay mensajes o es el inicio de la conversación
  if (messages.length <= 2) {
    suggestions.push(
      '¿Qué es VAK y cómo funciona?',
      '¿Qué cursos de STEM ofrecen?',
      '¿Cómo son las tutorías personalizadas?',
      '¿Ofrecen clases de inglés?'
    );
  } else {
    // Analizar el último mensaje para sugerencias contextuales
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    if (lastMessage.includes('vak')) {
      suggestions.push(
        '¿Cómo se identifica mi estilo de aprendizaje?',
        '¿Hay test VAK disponible?',
        '¿Cuánto dura el proceso VAK?'
      );
    } else if (lastMessage.includes('stem')) {
      suggestions.push(
        '¿Para qué edades son los cursos STEM?',
        '¿Necesito conocimientos previos?',
        '¿Qué proyectos prácticos hacen?'
      );
    } else if (lastMessage.includes('tutoría') || lastMessage.includes('clase')) {
      suggestions.push(
        '¿Qué materias ofrecen?',
        '¿Son clases individuales o grupales?',
        '¿Qué horarios tienen?'
      );
    } else if (lastMessage.includes('precio') || lastMessage.includes('cuesta')) {
      suggestions.push(
        '¿Hay planes de pago?',
        '¿Ofrecen becas o descuentos?',
        '¿Incluyen materiales?'
      );
    } else {
      // Sugerencias generales
      suggestions.push(
        '¿Tienen sedes presenciales?',
        '¿Cómo me inscribo?',
        '¿Ofrecen certificados?',
        '¿Puedo probar una clase gratis?'
      );
    }
  }
  
  return suggestions.slice(0, 4); // Máximo 4 sugerencias
};

// Función para generar opciones de conversación después de 3 intercambios
const getConversationOptions = (messages, conversationContext = {}) => {
  const userMessages = messages.filter(msg => msg.role === 'user').length;
  
  // Solo mostrar opciones después de 3 preguntas del usuario
  if (userMessages < 3) {
    return null;
  }
  
  // Analizar el contexto de la conversación
  const lastMessages = messages.slice(-4).map(msg => msg.content.toLowerCase()).join(' ');
  
  const options = [];
  
  // Opciones basadas en el contexto de la conversación
  if (lastMessages.includes('vak') || lastMessages.includes('aprendizaje')) {
    options.push(
      { text: 'Quiero hacer el test VAK', action: 'test_vak' },
      { text: 'Más información sobre VAK', action: 'info_vak' },
      { text: 'Agendar diagnóstico VAK', action: 'schedule_vak' }
    );
  } else if (lastMessages.includes('stem') || lastMessages.includes('ciencia') || lastMessages.includes('tecnología')) {
    options.push(
      { text: 'Ver proyectos STEM', action: 'view_stem' },
      { text: 'Información de cursos STEM', action: 'info_stem' },
      { text: 'Agendar clase demostrativa', action: 'demo_stem' }
    );
  } else if (lastMessages.includes('tutoría') || lastMessages.includes('clase') || lastMessages.includes('profesor')) {
    options.push(
      { text: 'Ver materias disponibles', action: 'view_subjects' },
      { text: 'Conocer tutores', action: 'meet_tutors' },
      { text: 'Agendar tutoría de prueba', action: 'trial_tutoring' }
    );
  } else if (lastMessages.includes('precio') || lastMessages.includes('cuesta') || lastMessages.includes('valor')) {
    options.push(
      { text: 'Ver planes y precios', action: 'view_pricing' },
      { text: 'Información de becas', action: 'info_scholarships' },
      { text: 'Agendar asesoría personalizada', action: 'schedule_consultation' }
    );
  } else {
    // Opciones generales si no hay contexto claro
    options.push(
      { text: 'Conocer más sobre VAK', action: 'learn_vak' },
      { text: 'Explorar cursos STEM', action: 'explore_stem' },
      { text: 'Información de tutorías', action: 'info_tutoring' },
      { text: 'Agendar llamada informativa', action: 'schedule_call' }
    );
  }
  
  return options.slice(0, 3); // Máximo 3 opciones
};

// Función para obtener saludo según hora del día
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Buenos días';
  } else if (hour >= 12 && hour < 19) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
};

// Prompt optimizado para conversación natural y fluida
const PROMPT_NICO_SOPORTE = `Eres NICO, asistente educativo conversacional. Sigue estas reglas:

1. PRESENTACIÓN:
   - Solo preséntate en el PRIMER mensaje: "Hola soy Nico, en qué te puedo ayudar"
   - NO te presentes nuevamente en respuestas posteriores
   - NO digas "Soy Nico de EdutechLife" después del saludo inicial

2. PROHIBICIONES ABSOLUTAS:
   - NO uses NUNCA emojis de ningún tipo
   - NO uses emoticones como :) :( :D :(
   - NO uses "xxx" o cualquier marcador especial
   - NO uses asteriscos multiples *** o guiones bajos ___ para decoracion
   - Tu respuesta debe ser 100% texto limpio, sin simbolos especiales, sin decoracion

3. CONVERSACIÓN NATURAL:
   - Mantén un tono conversacional y amigable
   - Usa el contexto de la conversación para respuestas relevantes
   - Si el usuario ya sabe quién eres, no te repitas
   - Responde como si fuera una conversación humana fluida

4. SERVICIOS EDUCATIVOS:
   - Explica servicios cuando el usuario pregunte: VAK, STEM, tutorías, bienestar
   - Sé específico y útil, no genérico
   - Ofrece información concreta, no solo descripciones generales

5. FLUJO DE CONVERSACIÓN:
   - Después de 2-3 intercambios, ofrece opciones para guiar la conversación
   - Pregunta el nombre solo si es relevante para el servicio
   - Si hay interés genuino, sugiere captura de datos o clase gratuita

6. ESTILO:
   - Español natural y coloquial
   - Respuestas concisas pero completas
   - Evita frases repetitivas o robóticas
   - Adapta tu lenguaje al tono del usuario`;
const NicoModern = ({ studentName: initialName = 'amigo', onNavigate, onInteraction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [typingDots, setTypingDots] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showedConversationOptions, setShowedConversationOptions] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  
  const { 
    memory = {}, 
    processMessage = () => {}, 
    clearMemory = () => {},
    getContextualPrompt = () => ''
  } = useConversationMemory('nico-chat') || {};
  
  const { 
    currentLead, 
    updateLeadInfo, 
    saveLead 
  } = useLeadManagement();

  // Lógica de captura de leads
  const {
    showLeadForm,
    leadCaptureContext,
    analyzeMessage,
    shouldShowLeadForm,
    prepareLeadContext,
    showForm,
    hideForm,
    handleLeadSaved,
    getStats
  } = useLeadCaptureLogic({
    minMessagesBeforeAsk: 3,
    maxMessagesBeforeForce: 8,
    interestThreshold: 0.7
  });

  const [leadSaved, setLeadSaved] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);

  // Lógica de agendamiento de citas
  const {
    appointments,
    showScheduler,
    schedulerContext,
    recentlyScheduled,
    scheduleAppointment,
    getUpcomingAppointments,
    showSchedulerWithContext,
    hideScheduler,
    clearRecentlyScheduled
  } = useAppointmentScheduling({
    defaultDuration: 30,
    defaultModality: 'videollamada',
    reminderHours: 24
  });

  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false);
  
  // Estado para controlar el saludo automático
  const [greetingSent, setGreetingSent] = useState(false);
  
  // Saludo automático cuando se abre el chat
  useEffect(() => {
    if (isOpen && !greetingSent && (!messages || messages.length === 0)) {
      setGreetingSent(true);
      
      const greeting = "Hola soy Nico, en qué te puedo ayudar";
      
      const greetingMessageObj = {
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...(prev || []), greetingMessageObj]);
      
      if (audioEnabled) {
        setTimeout(() => {
          speakTextConversational(greeting, 'nico_premium');
        }, 300);
      }
    }
  }, [isOpen, greetingSent, messages, audioEnabled]);

  useEffect(() => {
    if (messages.length === 0 && memory?.conversationHistory?.length > 0) {
      setMessages(memory.conversationHistory);
    }
  }, []);

   // Inicializar servicios básicos
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Servicios inicializados correctamente
        console.log('Servicios de Nico inicializados');
      } catch (error) {
        console.error('Error inicializando servicios:', error);
      }
    };

    initializeServices();
  }, []);

  // Atajos de teclado globales
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Solo procesar atajos si el chat está abierto
      if (!isOpen) return;
      
      // Ctrl/Cmd + Enter: Enviar mensaje
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (message.trim() && !isLoading) {
          handleSendMessage();
        }
      }
      
      // Esc: Cerrar chat si está abierto
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        resetChat();
        setIsOpen(false);
      }
      
      // Ctrl/Cmd + K: Alternar audio
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setAudioEnabled(prev => !prev);
      }
      
      // Ctrl/Cmd + M: Alternar micrófono
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen, message, isLoading, isListening]);

  // Función para enviar email de bienvenida (simulación)
  const sendNewLeadNotification = (leadData) => {
    // Solo enviar email si hay dirección de correo
    if (leadData.email) {
      console.log('📧 Simulando email de bienvenida para:', leadData.email);
      // En un sistema real, aquí se llamaría al servicio de email
    }
  };

  // Función para enviar confirmación de cita por email (simulada)
  const sendAppointmentEmailConfirmation = async (appointmentData) => {
    try {
      console.log('📧 Email de confirmación simulado para:', appointmentData.leadName);
      console.log('Detalles de la cita:', {
        fecha: appointmentData.date,
        hora: appointmentData.time,
        modalidad: appointmentData.modality,
        duracion: appointmentData.duration,
        tema: appointmentData.topic || 'Consulta general'
      });
    } catch (error) {
      console.error('❌ Error en simulación de email:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage = trimmedMessage;
    setMessage('');
    
    const userMessageObj = { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => {
      const newMessages = [...prev, userMessageObj];
      return optimizeLongConversation(newMessages, 25); // Límite de 25 mensajes
    });
    setIsLoading(true);

    // Primero verificar si hay respuesta rápida disponible
    const quickResponse = getQuickResponse(userMessage);
    if (quickResponse) {
      // Respuesta inmediata sin llamar a API
      const assistantMessageObj = { 
        role: 'assistant', 
        content: quickResponse,
        timestamp: new Date().toISOString(),
        isQuickResponse: true
      };
      
      setMessages(prev => {
        const newMessages = [...prev, assistantMessageObj];
        return optimizeLongConversation(newMessages, 25);
      });
      processMessage('assistant', quickResponse);
      
      // Voz inmediata
      if (audioEnabled) {
        setTimeout(() => {
          const textToSpeak = removeEmojis(quickResponse);
          speakTextConversational(textToSpeak, 'nico_premium');
        }, 50);
      }
      
      setIsLoading(false);
      return;
    }

    // Procesamiento en paralelo para velocidad
    processMessage('user', userMessage);
    
    // Análisis simplificado para leads
    const analysis = analyzeMessage(userMessage, 'user');
    
    // Verificación rápida de formulario de lead
    if (!showLeadForm && !leadSaved) {
      const shouldShow = shouldShowLeadForm(analysis, memory?.userName || initialName);
      
      if (shouldShow) {
        const context = prepareLeadContext(
          analysis, 
          memory?.userName || initialName,
          {
            userName: memory?.userName,
            primaryInterest: memory?.userProfile?.interests?.[0]
          }
        );
        
        showForm(context);
        setIsLoading(false);
        return;
      }
    }

    // Verificar si el usuario respondió positivamente a la pregunta de agendamiento
    const lowerMessage = userMessage.toLowerCase();
    const lastMessage = messages[messages.length - 1];
    const isAppointmentResponse = lastMessage?.isAppointmentPrompt;
    
    if (isAppointmentResponse) {
      const positiveResponses = ['sí', 'si', 'claro', 'por supuesto', 'me encantaría', 'quiero', 'agenda', 'agendar', 'sí quiero', 'si quiero'];
      const negativeResponses = ['no', 'ahora no', 'después', 'más tarde', 'no gracias'];
      
      const isPositive = positiveResponses.some(response => lowerMessage.includes(response));
      const isNegative = negativeResponses.some(response => lowerMessage.includes(response));
      
      if (isPositive) {
        // Mostrar scheduler de citas
        console.log('📅 Usuario quiere agendar cita');
        
        // Buscar datos del lead más reciente
        const recentLead = messages.find(msg => msg.isLeadSuccess);
        let leadData = {};
        
        if (recentLead) {
          // Extraer nombre del mensaje de éxito
          const nameMatch = recentLead.content.match(/Perfecto (\w+),/);
          if (nameMatch) {
            leadData.nombreCompleto = nameMatch[1];
          }
        }
        
        showSchedulerWithContext({
          leadData,
          interest: memory?.userProfile?.interests?.[0] || 'Consulta general'
        });
        
        setIsLoading(false);
        return;
        
      } else if (isNegative) {
        // Respuesta negativa - continuar conversación normalmente
        console.log('📅 Usuario no quiere agendar cita ahora');
        // Continuar con flujo normal
      }
    }

    try {
      // Cache optimizado para velocidad
      const cacheKey = userMessage.toLowerCase().trim();
      const cached = responseCache.get(cacheKey);
      
      let response;
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        response = cached.response;
      } else {
        // Contexto simplificado para velocidad
        const memoryContext = getContextualPrompt();
        const enhancedSystemPrompt = memoryContext 
          ? `${PROMPT_NICO_SOPORTE}\nContexto: ${memoryContext.substring(0, 200)}`
          : PROMPT_NICO_SOPORTE;
        
        response = await callDeepseek(userMessage, enhancedSystemPrompt);
        
        // Cachear respuesta
        responseCache.set(cacheKey, {
          response,
          timestamp: Date.now()
        });
      }
      
      // Simplificar respuesta si es muy larga
      const simplifiedResponse = simplifyResponse(response);
      
      // Respuesta asistente optimizada
      const assistantMessageObj = { 
        role: 'assistant', 
        content: simplifiedResponse,
        timestamp: new Date().toISOString(),
        wasSimplified: simplifiedResponse !== response
      };
      
      setMessages(prev => {
        const newMessages = [...prev, assistantMessageObj];
        return optimizeLongConversation(newMessages, 25);
      });
       processMessage('assistant', simplifiedResponse);
      
      // Verificar si debemos mostrar opciones de conversación
      const userMessageCount = messages.filter(msg => msg.role === 'user').length + 1; // +1 por el mensaje actual
      if (userMessageCount >= 3 && !showedConversationOptions) {
        // Esperar un momento antes de mostrar opciones
        setTimeout(() => {
          const options = getConversationOptions([...messages, assistantMessageObj]);
          if (options) {
            setShowedConversationOptions(true);
            
            // Crear mensaje con opciones
            const optionsMessage = {
              role: 'assistant',
              content: 'Para hacer nuestra conversación más productiva, ¿te gustaría...',
              timestamp: new Date().toISOString(),
              hasOptions: true,
              options: options
            };
            
            setMessages(prev => {
              const newMessages = [...prev, optionsMessage];
              return optimizeLongConversation(newMessages, 25);
            });
          }
        }, 1000);
      }
      
      // Actualización rápida de lead si existe
      if (currentLead) {
        updateLeadInfo({ 
          lastInteraction: new Date().toISOString(),
          lastMessage: userMessage
        });
      }

      // Voz en paralelo para no bloquear interfaz
      if (audioEnabled) {
        setTimeout(() => {
          const textToSpeak = removeEmojis(simplifiedResponse);
          speakTextConversational(textToSpeak, 'nico_premium');
        }, 100); // Reducido a 100ms para respuesta más rápida
      }
      
    } catch (error) {
      console.warn('⚠️ Error en respuesta:', error.message);
      
      // Respuesta de error rápida y útil
      const errorMessage = `¡Hola! Parece que hubo un problema técnico. Como asistente de EdutechLife, puedo decirte que ofrecemos servicios educativos como VAK, STEM, tutorías y bienestar. ¿Te interesa alguno?`;
      
      const errorMessageObj = { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
      
       if (audioEnabled) {
        setTimeout(() => {
          speakTextConversational(errorMessage, 'nico_premium');
        }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para guardar lead desde el formulario
  const handleSaveLead = async (leadData) => {
    try {
      console.log('💾 Guardando lead:', leadData);
      
      // Crear lead en el sistema de gestión
      const leadId = saveLead({
        nombre: leadData.nombreCompleto,
        telefono: leadData.telefono,
        email: leadData.email,
        motivo: leadData.interesPrincipal || 'Interés general',
        messages: messages.slice(-10) // Últimos 10 mensajes para contexto
      });

      // Actualizar estado
      setLeadSaved(true);
      setShowLeadSuccess(true);
      
      // Ocultar éxito después de 5 segundos
      setTimeout(() => {
        setShowLeadSuccess(false);
      }, 5000);

      // Manejar en la lógica de captura
      handleLeadSaved(leadData);

      // Enviar notificaciones de nuevo lead
      sendNewLeadNotification(leadData);

      // Track lead capture (simplified)
      console.log('Lead captured:', {
        nombreCompleto: leadData.nombreCompleto,
        telefono: leadData.telefono,
        email: leadData.email,
        interesPrincipal: leadData.interesPrincipal || 'Interés general'
      });

      // Agregar mensaje de confirmación al chat
      const successMessage = {
        role: 'assistant',
        content: `✅ Perfecto ${leadData.nombreCompleto.split(' ')[0]}, hemos registrado tu interés en ${leadData.interesPrincipal || 'nuestros servicios'}.`,
        timestamp: new Date().toISOString(),
        isLeadSuccess: true
      };
      
      setMessages(prev => [...prev, successMessage]);
      
      // Preguntar si quiere agendar cita (después de 1 segundo)
      setTimeout(() => {
        const appointmentQuestion = {
          role: 'assistant',
          content: `¿Te gustaría agendar una llamada gratuita con uno de nuestros especialistas para profundizar en ${leadData.interesPrincipal || 'tus necesidades'}?`,
          timestamp: new Date().toISOString(),
          isAppointmentPrompt: true
        };
        
        setMessages(prev => [...prev, appointmentQuestion]);
        
        // Hablar la pregunta si audio está activado
        if (audioEnabled) {
          setTimeout(() => {
            speakTextConversational(
              removeEmojis(appointmentQuestion.content),
              'nico_premium',
              () => console.log('✅ Pregunta de agendamiento hablada')
            );
          }, 800);
        }
      }, 1000);
      
      // Hablar confirmación inicial si audio está activado
      if (audioEnabled) {
        setTimeout(() => {
          speakTextConversational(
            removeEmojis(successMessage.content),
            'nico_premium',
            () => console.log('✅ Confirmación de lead hablada')
          );
        }, 500);
      }

      console.log('✅ Lead guardado exitosamente con ID:', leadId);
      
      // Guardar datos del lead para posible agendamiento
      const leadForScheduling = {
        id: leadId,
        ...leadData
      };
      
      return leadForScheduling;

    } catch (error) {
      console.error('❌ Error guardando lead:', error);
      
      // Mensaje de error al usuario
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Hubo un error al guardar tu información. Por favor intenta de nuevo o contacta directamente por WhatsApp.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    }
  };

  // Función para manejar agendamiento de citas
  const handleScheduleAppointment = async (appointmentData) => {
    try {
      console.log('📅 Agendando cita:', appointmentData);
      
      // Agendar la cita
      const appointment = scheduleAppointment(appointmentData);
      
      // Enviar confirmación por email (simulación)
      sendAppointmentEmailConfirmation(appointmentData);
      
      // Mostrar éxito
      setShowAppointmentSuccess(true);
      
      // Ocultar éxito después de 5 segundos
      setTimeout(() => {
        setShowAppointmentSuccess(false);
      }, 5000);
      
      // Track appointment scheduling (simplified)
      console.log('Appointment scheduled:', {
        id: appointment.id,
        leadName: appointmentData.leadName,
        date: appointmentData.date,
        time: appointmentData.time,
        modality: appointmentData.modality,
        duration: appointmentData.duration,
        topic: appointmentData.topic || 'Consulta general'
      });
        // Appointment scheduled successfully
        console.log('Appointment metrics updated');

      // Agregar mensaje de confirmación al chat
      const successMessage = {
        role: 'assistant',
        content: `✅ ¡Excelente! Hemos agendado tu llamada para el ${new Date(appointmentData.date).toLocaleDateString('es-CO')} a las ${appointmentData.time}. Recibirás confirmación por ${appointmentData.leadPhone ? 'WhatsApp' : 'email'}.`,
        timestamp: new Date().toISOString(),
        isAppointmentSuccess: true
      };
      
      setMessages(prev => [...prev, successMessage]);
      
      // Hablar confirmación si audio está activado
      if (audioEnabled) {
        setTimeout(() => {
          speakTextConversational(
            removeEmojis(successMessage.content),
            'nico_premium',
            () => console.log('✅ Confirmación de cita hablada')
          );
        }, 500);
      }
      
      console.log('✅ Cita agendada exitosamente:', appointment.id);
      return appointment;
      
    } catch (error) {
      console.error('❌ Error agendando cita:', error);
      
      // Mensaje de error al usuario
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Hubo un error al agendar la cita. Por favor intenta de nuevo o contacta directamente por WhatsApp.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    }
  };

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const speechRecognition = createSpeechRecognition({
      onResult: (fullText, finalText, hasFinal) => {
        // Escribir cada palabra detectada directamente en el textarea
        setMessage(fullText);
        console.log('🎤 STT: Texto detectado:', fullText);
        
        // Mostrar texto interino si no es final
        if (!hasFinal) {
          // Extraer solo la parte interina (lo nuevo desde el último texto final)
          const interimOnly = fullText.replace(finalText, '').trim();
          if (interimOnly) {
            setInterimTranscript(interimOnly);
          }
        } else {
          setInterimTranscript('');
        }
      },
      onEnd: (finalText) => {
        setIsListening(false);
        setInterimTranscript('');
        
        // Si hay texto final, enviar automáticamente
        if (finalText && finalText.trim() !== '') {
          setMessage(finalText);
          setTimeout(() => {
            handleSendMessage();
          }, 500);
        }
      },
      onError: (error, message) => {
        console.error('Speech recognition error:', error, message);
        setIsListening(false);
        setInterimTranscript('');
      }
    });

    setRecognition(speechRecognition?.recognition || null);
    speechRecognitionRef.current = speechRecognition;

    return () => {
      if (speechRecognition) {
        speechRecognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setTypingDots((prev) => (prev + 1) % 4);
      }, 300);
    } else {
      setTypingDots(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleVoiceInput = async () => {
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    if (!recognition) {
      console.error('Speech recognition not available');
      return;
    }

    try {
      // Check microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      recognition.start();
      setIsListening(true);
      setInterimTranscript('Escuchando...');
    } catch (error) {
      console.error('Microphone permission error:', error);
      addMessage({
        role: 'assistant',
        content: '🔇 Permiso de micrófono requerido. Por favor, habilita el micrófono en tu navegador.',
        timestamp: new Date().toISOString(),
        isError: true
      });
    }
  };

  const handleSpeakResponse = async () => {
    const lastAssistantMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'assistant' && !msg.isError);
    
    if (!lastAssistantMessage) return;

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    const textToSpeak = removeEmojis(lastAssistantMessage.content);
    
    if (!textToSpeak || textToSpeak.trim() === '') {
      console.log('🔇 Texto vacío, omitiendo voz');
      setIsSpeaking(false);
      return;
    }
    
    try {
      console.log('🔊 Reproduciendo respuesta...');
      await speakTextConversational(textToSpeak, 'nico_premium', () => {
        setIsSpeaking(false);
      });
    } catch (error) {
      console.error('❌ Error de voz:', error.message);
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Función para reiniciar completamente el chat
  const resetChat = () => {
    setMessages([]);
    setMessage('');
    setIsLoading(false);
    setIsListening(false);
    setIsSpeaking(false);
    setShowSuggestions(true);
    setShowedConversationOptions(false);
    setGreetingSent(false); // Reiniciar estado del saludo
    stopSpeech();
    
    // Limpiar memoria de conversación
    clearMemory();
    
    // Limpiar caché de respuestas para esta sesión
    responseCache.clear();
    
    // Detener reconocimiento de voz si está activo
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    // Cerrar formularios si están abiertos
    if (showLeadForm) hideForm();
    if (showScheduler) hideScheduler();
    setShowLeadSuccess(false);
    setShowAppointmentSuccess(false);
  };

  const toggleChat = () => {
    const willOpen = !isOpen;
    
    // Si se va a CERRAR el chat, reiniciar todo
    if (!willOpen) {
      resetChat();
    }
    
    setIsOpen(willOpen);
    
    // Feedback táctil si está disponible
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); // Vibración corta de 50ms
    }
    
    if (willOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
      
      // Saludo automático inmediato al abrir el chat
      if (messages.length === 0) {
        // Chat vacío: Saludo exacto solicitado
        const welcomeMessage = `Hola soy Nico, en qué te puedo ayudar`;
        
        // Mensaje de bienvenida inmediato
        const welcomeMessageObj = {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, welcomeMessageObj]);
        
        // Voz automática inmediata (50ms en lugar de 300ms)
        if (audioEnabled) {
          setTimeout(() => {
            const textToSpeak = removeEmojis(welcomeMessage);
            speakTextConversational(textToSpeak, 'nico_premium');
          }, 50);
        }
      } else if (audioEnabled) {
        // Reconexión: saludo rápido en voz
        setTimeout(() => {
          const userName = memory?.userName || initialName;
          const nameGreeting = userName !== 'amigo' ? ` ${userName}` : '';
          const reconnectMessage = `Hola soy Nico, en qué te puedo ayudar${nameGreeting}`;
          const textToSpeak = removeEmojis(reconnectMessage);
          speakTextConversational(textToSpeak, 'nico_premium');
        }, 50);
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const clearChat = () => {
    setMessages([]);
    clearMemory();
  };

  const clearCache = () => {
    responseCache.clear();
    const cacheClearedMessage = {
      role: 'assistant',
      content: '✅ Caché limpiado. Las próximas respuestas se generarán desde cero.',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, cacheClearedMessage]);
  };

  const viewHistory = () => {
    setShowHistory(!showHistory);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-gentle-pulse"
        style={{ 
          backgroundColor: COLORS.PETROLEUM,
          background: `linear-gradient(135deg, ${COLORS.PETROLEUM} 0%, ${COLORS.CORPORATE} 100%)`
        }}
      >
        <Bot className="w-8 h-8 text-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
      </button>
    );
  }

  return (
     <div className={`fixed z-50 ${isExpanded ? 'inset-0 md:inset-4' : 'bottom-4 right-4 md:bottom-6 md:right-6'} transition-all duration-300`}>
       <div 
         className={`bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 ${
           isExpanded ? 'w-full h-full' : 'w-[calc(100vw-2rem)] md:w-96 h-[500px] md:h-[600px] max-w-md'
         }`}
         style={{ borderColor: COLORS.SOFT_BLUE }}
       >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: COLORS.NAVY }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.CORPORATE }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
                style={{ backgroundColor: COLORS.MINT }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white">Nico Assistant</h3>
              <p className="text-xs" style={{ color: COLORS.SOFT_BLUE }}>
                EdutechLife AI Support
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newAudioEnabled = !audioEnabled;
                setAudioEnabled(newAudioEnabled);
                
                // Feedback inmediato
                if (newAudioEnabled) {
                  // Si se activa el audio, Nico confirma
                  const confirmation = "Audio activado. Puedes hablar conmigo.";
                  speakTextConversational(confirmation, 'nico_premium', () => {
                    console.log('✅ Audio activado confirmado');
                  });
                } else {
                  // Si se desactiva, detener cualquier audio en curso
                  stopSpeech();
                }
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                audioEnabled ? 'scale-105 ring-2 ring-opacity-50' : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: audioEnabled ? COLORS.MINT : COLORS.PETROLEUM,
                border: audioEnabled ? `2px solid ${COLORS.CORPORATE}` : 'none'
              }}
              title={audioEnabled ? "Desactivar audio" : "Activar audio"}
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-white" />
              ) : (
                <VolumeX className="w-4 h-4 text-white" />
              )}
            </button>
           
           <button
             onClick={toggleChat}
             className="p-2 rounded-lg hover:opacity-80 transition"
             style={{ backgroundColor: COLORS.PETROLEUM }}
             title="Cerrar"
           >
             <X className="w-4 h-4 text-white" />
           </button>
         </div>
        </div>

        {/* Messages Container */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{ 
            backgroundColor: COLORS.NAVY,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${COLORS.PETROLEUM}20 0%, transparent 50%)`
          }}
        >
          {(messages || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: COLORS.CORPORATE }}
              >
                <Bot className="w-10 h-10 text-white" />
              </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.SOFT_BLUE }}>
                  Hola soy Nico
                </h3>
                <p className="text-sm mb-6" style={{ color: COLORS.MINT }}>
                  En qué te puedo ayudar
                </p>
                 <p className="text-sm mb-6" style={{ color: COLORS.CORPORATE }}>
                   Puedes preguntarme sobre nuestros servicios educativos: VAK, STEM, tutorías personalizadas o bienestar educativo.
                 </p>
                 <p className="text-xs italic mb-4" style={{ color: COLORS.MINT }}>
                   Escribe tu pregunta en el campo de abajo para comenzar
                 </p>
            </div>
          ) : (
             <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div
                       className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 ${
                        msg.role === 'user' 
                          ? 'rounded-br-none' 
                          : msg.isSystem ? 'rounded-2xl' : 'rounded-bl-none'
                      }`}
                      style={{
                        backgroundColor: msg.role === 'user' 
                          ? COLORS.CORPORATE 
                          : msg.isSystem 
                            ? COLORS.NAVY + '40' 
                            : COLORS.SOFT_BLUE,
                        color: msg.role === 'user' ? 'white' : COLORS.NAVY,
                        border: msg.isSystem ? '1px solid ' + COLORS.MINT + '40' : 'none',
                        fontStyle: msg.isSystem ? 'italic' : 'normal'
                      }}
                    >
                       {!msg.isSystem && (
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center">
                             {msg.role === 'user' ? (
                               <User className="w-4 h-4 mr-2" />
                             ) : (
                               <Bot className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                             )}
                             <span className="text-xs font-semibold">
                               {msg.role === 'user' ? 'Tú' : 'Nico'}
                             </span>
                           </div>
                           <div className="flex items-center space-x-1">
                             {msg.isQuickResponse && (
                               <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                 ⚡
                               </span>
                             )}
                             {msg.isCached && (
                               <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                 💾
                               </span>
                             )}
                           </div>
                         </div>
                       )}
                        <p className="whitespace-pre-wrap text-sm mb-3">{msg.content}</p>
                        
                        {/* Opciones de conversación */}
                        {msg.hasOptions && msg.options && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex flex-col space-y-2">
                              {msg.options.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    // Manejar diferentes acciones
                                    if (option.action.startsWith('schedule_') || option.action.startsWith('demo_') || option.action.startsWith('trial_')) {
                                      // Para acciones de agendamiento, mostrar formulario
                                      const interest = option.action.includes('vak') ? 'VAK' : 
                                                      option.action.includes('stem') ? 'STEM' : 
                                                      option.action.includes('tutoring') ? 'Tutorías' : 'Consulta general';
                                      showSchedulerWithContext({
                                        leadData: {},
                                        interest: interest
                                      });
                                    } else if (option.action.startsWith('info_') || option.action.startsWith('learn_') || option.action.startsWith('view_')) {
                                      // Para acciones informativas, enviar pregunta relacionada
                                      setMessage(option.text);
                                      setTimeout(() => {
                                        if (inputRef.current) {
                                          inputRef.current.focus();
                                          setTimeout(() => handleSendMessage(), 100);
                                        }
                                      }, 50);
                                    } else if (option.action === 'test_vak' || option.action === 'meet_tutors') {
                                      // Para acciones específicas, enviar mensaje contextual
                                      const question = option.action === 'test_vak' ? 
                                        '¿Cómo funciona el test VAK y cómo puedo hacerlo?' : 
                                        '¿Cómo puedo conocer a los tutores disponibles?';
                                      setMessage(question);
                                      setTimeout(() => {
                                        if (inputRef.current) {
                                          inputRef.current.focus();
                                          setTimeout(() => handleSendMessage(), 100);
                                        }
                                      }, 50);
                                    }
                                  }}
                                  className="text-left p-3 rounded-lg hover:scale-[1.02] transition active:scale-95 text-sm"
                                  style={{
                                    backgroundColor: COLORS.SOFT_BLUE,
                                    color: COLORS.NAVY,
                                    border: `1px solid ${COLORS.CORPORATE}`
                                  }}
                                >
                                  {option.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                 ))}
               
               {/* Sugerencias de preguntas contextuales */}
               {showSuggestions && messages.length > 0 && !showLeadForm && !showScheduler && (
                 <div className="mt-4 mb-2">
                   <p className="text-xs font-medium mb-2 text-gray-500">¿Te interesa saber sobre...?</p>
                   <div className="flex flex-wrap gap-2">
                     {getQuestionSuggestions(messages).map((suggestion, index) => (
                       <button
                         key={index}
                         onClick={() => {
                           setMessage(suggestion);
                           setTimeout(() => {
                             if (inputRef.current) {
                               inputRef.current.focus();
                             }
                           }, 50);
                         }}
                         className="text-xs px-3 py-2 rounded-full hover:scale-105 transition active:scale-95"
                         style={{
                           backgroundColor: COLORS.SOFT_BLUE,
                           color: COLORS.NAVY,
                           border: `1px solid ${COLORS.CORPORATE}40`
                         }}
                       >
                         {suggestion}
                       </button>
                     ))}
                   </div>
                   <button
                     onClick={() => setShowSuggestions(false)}
                     className="text-xs mt-2 text-gray-400 hover:text-gray-600"
                   >
                     Ocultar sugerencias
                   </button>
                 </div>
               )}
               
               {/* Botón para mostrar sugerencias si están ocultas */}
               {!showSuggestions && messages.length > 2 && !showLeadForm && !showScheduler && (
                 <button
                   onClick={() => setShowSuggestions(true)}
                   className="text-xs mt-2 text-gray-400 hover:text-gray-600 flex items-center"
                 >
                   <span>💡 Mostrar sugerencias de preguntas</span>
                 </button>
               )}
               
               {/* Formulario de Captura de Leads */}
               {showLeadForm && leadCaptureContext && (
                 <div className="mb-4 animate-slideUp">
                   <Suspense fallback={<div className="p-4 text-center text-gray-500">Cargando formulario...</div>}>
                     <LeadCaptureForm
                       userName={leadCaptureContext.userName}
                       userInterest={leadCaptureContext.userInterest}
                       onSave={handleSaveLead}
                       onCancel={hideForm}
                       autoFocus={true}
                     />
                   </Suspense>
                 </div>
               )}

              {/* Confirmación de Lead Guardado */}
              {showLeadSuccess && (
                <div className="mb-4 p-4 rounded-xl animate-fadeIn" style={{ 
                  backgroundColor: COLORS.MINT + '40',
                  border: `2px solid ${COLORS.MINT}`
                }}>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" style={{ color: COLORS.PETROLEUM }} />
                    <div>
                      <p className="font-medium" style={{ color: COLORS.NAVY }}>
                        ✅ Información guardada exitosamente
                      </p>
                      <p className="text-sm" style={{ color: COLORS.PETROLEUM }}>
                        Un asesor se contactará contigo pronto
                      </p>
                    </div>
                  </div>
                </div>
              )}

               {/* Scheduler de Citas */}
               {showScheduler && schedulerContext && (
                 <div className="mb-4 animate-slideUp">
                   <Suspense fallback={<div className="p-4 text-center text-gray-500">Cargando calendario...</div>}>
                     <AppointmentScheduler
                       leadData={schedulerContext.leadData}
                       onSchedule={handleScheduleAppointment}
                       onCancel={hideScheduler}
                       autoFocus={true}
                     />
                   </Suspense>
                 </div>
               )}

              {/* Confirmación de Cita Agendada */}
              {showAppointmentSuccess && (
                <div className="mb-4 p-4 rounded-xl animate-fadeIn" style={{ 
                  backgroundColor: COLORS.CORPORATE + '40',
                  border: `2px solid ${COLORS.CORPORATE}`
                }}>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" style={{ color: COLORS.PETROLEUM }} />
                    <div>
                      <p className="font-medium" style={{ color: COLORS.NAVY }}>
                        📅 Cita agendada exitosamente
                      </p>
                      <p className="text-sm" style={{ color: COLORS.PETROLEUM }}>
                        Recibirás confirmación y recordatorio
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Panel de Recordatorios y Agenda */}


              {isLoading && (
                <div className="flex justify-start">
                  <div 
                    className="max-w-[80%] rounded-2xl rounded-bl-none p-4"
                    style={{ backgroundColor: COLORS.SOFT_BLUE }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: COLORS.PETROLEUM }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: COLORS.CORPORATE, animationDelay: '0.1s' }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: COLORS.MINT, animationDelay: '0.2s' }}
                        />
                      </div>
                      <span style={{ color: COLORS.NAVY }}>Nico está pensando...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: COLORS.NAVY,
            borderColor: COLORS.PETROLEUM
          }}
        >
          {interimTranscript && (
            <div className="mb-3 p-3 rounded-xl animate-pulse" style={{ 
              backgroundColor: COLORS.MINT + '40',
              border: `1px solid ${COLORS.MINT}`
            }}>
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: COLORS.NAVY }}>
                  {interimTranscript}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isListening ? 'scale-105 ring-4 ring-opacity-50' : 'hover:scale-105'
              }`}
              style={{ 
                backgroundColor: isListening ? '#FF4757' : COLORS.PETROLEUM,
                boxShadow: isListening ? `0 0 20px ${COLORS.MINT}80` : 'none'
              }}
              title={isListening ? "Detener grabación" : "Hablar con Nico"}
            >
              <div className="relative">
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  </>
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
            
            <button
              onClick={handleSpeakResponse}
              disabled={(messages || []).length === 0 || isSpeaking}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isSpeaking ? 'scale-105 ring-4 ring-opacity-50' : 'hover:scale-105'
              }`}
              style={{ 
                backgroundColor: isSpeaking ? COLORS.MINT : COLORS.CORPORATE,
                opacity: (messages || []).length === 0 ? 0.5 : 1,
                boxShadow: isSpeaking ? `0 0 20px ${COLORS.MINT}80` : 'none'
              }}
              title={isSpeaking ? "Detener voz" : "Escuchar respuesta de Nico"}
            >
              <div className="relative">
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
                  </>
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </div>
            </button>

            
            <button
              onClick={clearChat}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: COLORS.PETROLEUM }}
              title="Limpiar conversación"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={clearCache}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: COLORS.CORPORATE }}
              title="Limpiar caché de respuestas"
            >
              <div className="relative">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
            </button>
          </div>
          
           <div className="flex space-x-2">
             <textarea
               ref={inputRef}
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               onKeyPress={handleKeyPress}
               placeholder="Escribe tu mensaje aquí..."
               className="flex-1 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 text-sm md:text-base"
               style={{
                 backgroundColor: COLORS.SOFT_BLUE,
                 color: COLORS.NAVY,
                 borderColor: COLORS.CORPORATE,
                 minHeight: '50px',
                 maxHeight: '120px'
               }}
              rows={2}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="p-3 rounded-xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: message.trim() ? COLORS.PETROLEUM : COLORS.CORPORATE
              }}
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs" style={{ color: COLORS.MINT }}>
              Presiona Enter para enviar • Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicoModern;