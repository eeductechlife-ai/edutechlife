import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, Copy, PlayCircle, X, Bot } from 'lucide-react';
import useConversationMemory from '../../hooks/useConversationMemory';
import useLeadManagement from '../../hooks/useLeadManagement';
import { callDeepseek } from '../../utils/api';
import { PROMPT_NICO_SOPORTE } from '../../constants/prompts';
import { speakTextConversational } from '../../utils/speech';
import { checkSpeechRecognitionSupport } from '../../utils/speechRecognition';

const NicoSupport = ({ studentName: initialName = 'amigo', onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [greetingSent, setGreetingSent] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastCategory, setLastCategory] = useState(null);
  const [lastAssistantResponse, setLastAssistantResponse] = useState('');
  const [micPermissionError, setMicPermissionError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [leadData, setLeadData] = useState({
    nombre: null,
    telefono: null,
    email: null,
    motivo: null,
    stage: 'inicio',
  });
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const nameLearnedRef = useRef(false);
  const recognitionRef = useRef(null);

  const {
    memory,
    setUserName,
    processMessage,
    incrementConversationCount,
    generateContext,
    getRecentHistory,
    clearMemory,
    learnFromUser,
    updateUserContext,
  } = useConversationMemory({
    persistKey: 'edutechlife_nico_support_memory',
    maxHistoryLength: 200,
    maxFactsLength: 500,
  });

  const {
    createLead,
    addMessageToLead,
  } = useLeadManagement();

  useEffect(() => {
    if (memory.userName) {
      nameLearnedRef.current = true;
    }
  }, [memory.userName]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [memory.conversationHistory, scrollToBottom]);

  const addMessage = useCallback((role, content) => {
    processMessage(role, content);
  }, [processMessage]);

  const generateContextualResponse = useCallback((userMessage, context) => {
    const lowerMsg = userMessage.toLowerCase();
    const msgLength = userMessage.length;
    const userName = memory.userName;
    
    const patterns = {
      greeting: ['hola', 'buenos días', 'buenas', 'qué tal', 'saludos', 'hey', 'holiwis', 'ola', 'buen día', 'hola nico', 'buenos dias'],
      feeling: ['cómo estás', 'cómo te sientes', 'qué haces', 'qué tal', 'como te encuentra'],
      good: ['bien', 'genial', 'excelente', 'feliz', 'contento', 'happy', 'cool', 'awesome', 'estoy bien', 'todo bien', 'muy bien'],
      tired: ['cansado', 'fatigado', 'aburrido', 'siento sueño', 'con sueño', 'sin energia'],
      sad: ['triste', 'mal', 'deprimido', 'desanimado', 'desanimada', 'malito', 'de mal humor'],
      nervous: ['nervioso', 'ansioso', 'preocupado', 'estresado', 'asustado', 'con miedo'],
      help: ['ayuda', 'que hago', 'no entiendo', 'perdido', 'duda', 'cómo', 'qué es', 'necesito ayuda'],
      thanks: ['gracias', 'muchas gracias', 'excelente', 'maravilloso', 'genial', 'perfecto', 'te lo agradesco'],
      bye: ['adiós', 'hasta luego', 'me voy', 'nos vemos', 'bye', ' Chau', 'me despedida', 'hasta mañana'],
      subject: ['matemática', 'física', 'química', 'historia', 'biología', 'literatura', 'español', 'inglés', 'geografía', 'arte'],
      ai: ['qué eres', 'quién eres', 'eres real', 'inteligencia artificial', 'qué puedes hacer', 'como funcionas'],
      learn: ['aprender', 'estudiar', 'clase', 'tarea', 'examen', 'prueba', 'quiz', 'lección'],
      name: ['me llamo', 'soy', 'mi nombre', 'llámame', 'dime', 'yo soy'],
      remember: ['recuerdas', 'sabes mi nombre', 'cómo me llamo', 'quién soy', 'te acuerdas'],
      motivation: ['motivame', 'anímame', 'dame ánimos', 'palabras bonitas', 'frases', 'inspirame'],
      schedule: ['horario', 'horarios', 'abren', 'cierran', 'a qué hora', 'cuando abren', 'cuando cierran', 'atención'],
      location: ['dónde están', 'ubicación', 'dirección', 'direccion', 'donde queda', 'cómo llego', 'sucursal', 'sede'],
      prices: ['precio', 'precios', 'cuánto cuesta', 'cuanto sale', 'cuánto vale', 'inversión', 'costo', 'plan', 'planes', 'paquete'],
      noMore: ['no', 'nada', 'eso es todo', 'eso sería todo', 'no gracias', 'no necesito nada', 'ya no', 'eso', 'ya está', 'ya me voy', 'nada más', 'nada más gracias', 'eso es todo'],
      servicios: ['servicios', 'programas', 'cursos', 'clases', 'qué ofrecen', 'tienen', 'ofrecen'],
      metodologia: ['método', 'metodología', 'cómo enseñan', 'cómo aprenden', 'estilo aprendizaje', 'VAK'],
      stem: ['stem', 'robótica', 'programación', 'tecnología', 'coding', 'robotica'],
      psicologia: ['psicológico', 'emocional', 'bienestar', 'estrés', 'ansiedad', 'psicólogo', 'psicología'],
      edades: ['edad', 'niños', 'niño', 'niña', 'adolescentes', 'adolescente', 'primaria', 'secundaria', 'kid', 'kids'],
      modalidad: ['presencial', 'en línea', 'virtual', 'híbrido', 'online', 'presencial'],
      inscription: ['inscribir', 'matricular', 'comenzar', 'iniciar', 'cómo empiezo', 'quiero apuntar'],
      primeraClase: ['prueba', 'demo', 'gratis', 'sin costo', 'primera clase', 'gratuit'],
      resultados: ['resultados', 'mejorar', 'efectividad', 'mejoras', 'funciona', 'efectivo'],
      ventajas: ['ventajas', 'beneficios', 'por qué elegir', 'por qué ustedes', 'diferencial', 'qué los hace diferentes'],
      descuentos: ['descuento', 'promoción', 'oferta', 'promociones'],
      talleres: ['taller', 'talleres', 'workshop', 'actividad'],
      diagnostico: ['diagnóstico', 'diagnostico', 'test', 'estilo', 'perfil aprendizaje'],
      padres: ['padre', 'madre', 'papá', 'mamá', 'familia', 'familiar', 'pariente'],
      materias: ['materia', 'materias', 'matemáticas', 'física', 'química', 'inglés', 'biología', 'historia'],
      equipo: ['equipo', 'profesores', 'docentes', 'maestros', 'experiencia', 'años'],
      contacto: ['teléfono', 'whatsapp', 'llamar', 'escribir', 'contactar', 'comunicar'],
      queEs: ['qué es', 'qué hacen', 'en qué consiste', 'cómo funciona'],
    };

    for (const [key, keywords] of Object.entries(patterns)) {
      if (keywords.some(k => lowerMsg.includes(k))) {
        setLastCategory(key);
        return getResponseByCategory(key, lowerMsg, msgLength, context);
      }
    }
    
    return getDynamicResponse(lowerMsg, msgLength, context);
  }, [memory.userName, setLastCategory]);

  const getResponseByCategory = (category, message, length, context) => {
    const userName = memory.userName || 'amigo';
    const responses = {
      greeting: () => {
        if (memory.conversationCount > 0 && userName !== 'amigo') {
          return [
            `¡Hola ${userName}! Qué alegría verte de nuevo. ¿Cómo estás hoy?`,
            `¡Hey ${userName}! Qué bueno tenerte aquí otra vez.`,
            `¡${userName}! Me alegra mucho que vuelvas.`,
          ];
        } else if (memory.conversationCount > 0) {
          return [
            `¡Hola de nuevo! ¿Cómo estás hoy?`,
            `¡Hey! Qué bueno que regresaste.`,
          ];
        }
        return [
          `¡Hola! Soy Nico, tu agente de atención de EdutechLife. ¿En qué te puedo ayudar?`,
          `¡Hola! Soy Nico. ¿Cómo te llamas?`,
        ];
      },
      feeling: () => [
        '¡Yo estoy bien! ¿Y tú cómo estás?',
        '¡Aquí feliz de poder ayudarte! ¿Qué necesitas?',
      ],
      good: () => [
        '¡Me alegra mucho! 😊 ¿En qué puedo ayudarte?',
        '¡Eso es genial! ¿Necesitas algo de EdutechLife?',
      ],
      tired: () => [
        '¡Descansa! Cuando necesites ayuda, aquí estaré. 😊',
        '¡Ánimo! Todo mejora. ¿En qué te puedo apoyar?',
      ],
      sad: () => [
        '¡Ánimo! Todo mejora. ¿Necesitas ayuda con algo?',
        '¡Aquí estoy para ayudarte! ¿Qué necesitas?',
      ],
      nervous: () => [
        '¡Tranquilo! Todo estará bien. ¿En qué puedo ayudarte?',
        '¡Respira! Estoy aquí para apoyarte. ¿Qué necesitas?',
      ],
      help: () => [
        '¡Con gusto! Cuéntame qué necesitas y te ayudo. 😊',
        '¡Estoy para ayudarte! ¿Cuál es tu duda?',
      ],
      thanks: () => [
        '¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?',
        '¡Para eso estoy! ¿Necesitas algo más?',
      ],
      bye: () => [
        '¡Hasta luego! 😊 Que te vaya muy bien. ¡Vuelve cuando quieras!',
        '¡Nos vemos! 👋 ¿任何 cosa, aquí estaré.',
      ],
      subject: () => ['¡Qué interesante! ¿Necesitas ayuda con alguna materia específica?'],
      ai: () => [
        '¡Buena pregunta! Soy Nico, el asistente de EdutechLife. Puedo ayudarte con información sobre nuestros servicios.',
        'Soy Nico, tu asistente virtual de EdutechLife. ¿En qué te puedo ayudar?',
      ],
      learn: () => ['¿Sobre qué tema te gustaría aprender?Tenemos clases de matemáticas, física, y más.'],
      name: () => {
        const extractedName = message.match(/(?:me llamo|soy|mi nombre es|llámame|dime|yo soy)\s+(?:que )?(.+?)(?:\.|,|$)/i);
        if (extractedName) {
          const newName = extractedName[1].trim();
          setUserName(newName);
          nameLearnedRef.current = true;
          return [
            `¡Mucho gusto ${newName}! 😊 ¿En qué puedo ayudarte hoy?`,
            `¡Hola ${newName}! Encantado de conocerte. ¿Qué te gustaría saber de EdutechLife?`,
            `¡Perfecto ${newName}! ¿En qué te puedo apoyar?`,
          ];
        }
        return ['¿Cómo te llamas? Si prefieres no compartirlo, no hay problema 😊'];
      },
      remember: () => {
        if (memory.userName && memory.userName !== 'amigo') {
          return [`¡Claro! Tu nombre es ${memory.userName}. ¿En qué te ayudo?`];
        }
        return ['No tenemos datos tuyos aún. ¿Cómo te llamas?'];
      },
      motivation: () => [
        '¡Tú puedes! 💪 Cada día es una oportunidad de aprender algo nuevo.',
        '¡Believe in yourself! 🌟 El éxito viene con esfuerzo y práctica.',
      ],
      schedule: () => [
        '¡Nuestro horario de atención es de lunes a sábado! ¿Te interesa alguna clase?',
        '¡Estamos para servirte! ¿Cuándo te gustaría tu primera clase?',
      ],
      location: () => [
        '¡Escríbenos al WhatsApp para más información! 📱',
        '¡Contáctanos para saber más sobre nuestras sedes! 😊',
      ],
      prices: () => [
        '¡Tenemos planes para todos los presupuestos! ¿Cuál te interesa?',
        '¡Escríbenos para darte los detalles! 😊',
      ],
      noMore: () => [
        '¡Perfecto! 😊 Que tengas un excelente día. ¡Vuelve cuando quieras!',
        '¡Genial! 👋 ¡Éxito en todo. Hasta luego!',
      ],
      servicios: () => [
        'Ofrecemos clases particulares, tutoring, programas STEM y apoyo emocional. ¿Cuál te interesa?',
        '¡Tenemos muchos servicios! Desde clases de matemáticas hasta robótica. ¿Qué necesitas?',
      ],
      metodologia: () => [
        '¡Usamos el método VAK (Visual, Auditivo, Kinestésico) para personalizar el aprendizaje! 😊',
        '¡Nuestro enfoque es 100% personalizado! Adaptamos las clases a tu estilo de aprendizaje.',
      ],
      stem: () => [
        '¡Tenemos geniales programas de STEM! Robótica, programación y más. ¿Te interesa alguno?',
        '¡La tecnología es el futuro! Nuestras clases de STEM te preparan para ese futuro. 😊',
      ],
      psicologia: () => [
        '¡Contamos con apoyo psicológico para estudiantes! Tu bienestar emocional es importante. 💙',
        '¡En EdutechLife nos preocupamos por tu bienestar emocional! 😊',
      ],
      edades: () => [
        '¡Trabajamos con niños de 5 a 17 años! ¿Qué edad tiene el estudiante?',
        '¡Tenemos programas para todas las edades! ¿Para quién buscas clases?',
      ],
      modalidad: () => [
        '¡Puedes tomar clases presencial, en línea o híbrido! ¿Cuál prefieres?',
        '¡Lo que tú prefieras! Presencial, en línea o híbrido. 😊',
      ],
      inscription: () => [
        '¡Me alegra que quieras inscribirte! ¿Me das tus datos para contactarte? 😊',
        '¡Vamos a inscribirte! ¿Cómo te llamas y qué WhatsApp?',
      ],
      primeraClase: () => [
        '¡Primera clase gratis! 😊 ¿Te animas a probarla?',
        '¡Sin compromiso! Tu primera clase es gratuita. ¿La agendamos?',
      ],
      resultados: () => [
        '¡El 95% de padres ven mejoras en sus hijos! 📈 ¿Te interesa?',
        '¡Nuestro método funciona! 😊 ¿Quieres más información?',
      ],
      ventajas: () => [
        '¡Somos únicos combinando STEM con bienestar emocional! 💙 ¿Te cuento más?',
        '¡Profesores certificados + apoyo psicológico! 😊 ¿Qué más quieres saber?',
      ],
      descuentos: () => [
        '¡Tenemos promociones todo el año! 😊 ¿Te enteraste de alguna en específico?',
        '¡Escríbenos para ver las ofertas disponibles! 📱',
      ],
      talleres: () => [
        '¡Ofrecemos talleres interactivos! ¿Te interesa alguno específico? 😊',
        '¡Tenemos talleres de ciencia, arte y más! ¿Cuál te llama la atención?',
      ],
      diagnostico: () => [
        '¡Sí! Hacemos tests de estilo de aprendizaje gratis. ¿Lo agendamos? 😊',
        '¡El diagnóstico es sin costo! 😊 ¿Cuándo te viene mejor?',
      ],
      padres: () => [
        '¡Perfecto! Para padres tenemos información especial. ¿Tienes hijos en edad escolar?',
        '¡Nos encantaría ayudar a tu familia! 😊 ¿Cuántos hijos tienes?',
      ],
      materias: () => [
        '¡Ofrecemos todas las materias! Matemáticas, física, química, biología, y más. ¿Cuál necesitas?',
        '¡Cualquier materia que necesites! 😊 ¿Cuál es la materia?',
      ],
      equipo: () => [
        '¡Más de 10 años de experiencia! Equipo de psicólogos y docentes especializados. ¿Te cuento más?',
        'Contamos con maestros certificados y psicólogos educativos. ¡Son los mejores!',
      ],
      contacto: () => [
        'Escríbenos al WhatsApp: 55 1234 5678. ¡Respondemos rápido!',
        'Nuestro WhatsApp es 55 1234 5678. ¿Te lo guardo para que nos escribas?',
      ],
      queEs: () => [
        '¡EdutechLife es una plataforma educativa que combina STEM con bienestar emocional! 💙',
        '¡Somos mucho más que clases! Ayudamos a estudiantes a réussir academically y emocionalmente. 😊',
      ],
    };

    const responseGenerator = responses[category];
    if (responseGenerator) {
      const categoryResponses = responseGenerator();
      return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
    
    return responses.help()[0];
  };

  const getDynamicResponse = (message, length, context) => {
    const userName = memory.userName || 'amigo';
    
    if (memory.conversationCount <= 1 && !nameLearnedRef.current && length < 15) {
      return 'Por cierto, ¿cómo te llamas? Así te puedo llamar por tu nombre';
    }

    const followUps = [
      '¿Hay algo más que quieras saber de EdutechLife?',
      '¿Te interesa algo en específico?',
      '¿Qué más te gustaría saber?',
      '¿En qué más puedo ayudarte?',
      '¿Te puedo ayudar con algo más?',
      '¿Tienes alguna otra duda?',
      '¿Hay algo más sobre nuestros servicios que quieras conocer?',
      '¿En qué área de EdutechLife te gustaría más información?',
    ];
    
    let selectedResponse = followUps[Math.floor(Math.random() * followUps.length)];
    
    let attempts = 0;
    while (selectedResponse === lastAssistantResponse && attempts < 5) {
      selectedResponse = followUps[Math.floor(Math.random() * followUps.length)];
      attempts++;
    }
    
    setLastAssistantResponse(selectedResponse);
    return selectedResponse;
  };

  const handleMessage = useCallback(async (text) => {
    if (!text.trim()) return { text: '' };
    
    const context = generateContext();
    addMessage('user', text);
    setInputText('');
    setIsAILoading(true);
    setIsProcessing(true);
    
    try {
      const response = await callDeepseek(text, PROMPT_NICO_SOPORTE);
      
      if (response && !response.includes('Error:') && response.length > 10) {
        addMessage('assistant', response);
        setIsAILoading(false);
        setIsProcessing(false);
        
        learnFromUser(text, 'user_message');
        
        return { text: response };
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      setIsAILoading(false);
      setIsProcessing(false);
      
      let fallbackMsg = generateContextualResponse(text, context);
      
      if (error.message.includes('timeout') || error.message.includes('tiempo')) {
        fallbackMsg = '¡Hola! Estoy teniendo un poco de dificultad para conectar. ¿Podrías intentar de nuevo en un momento? 😊';
      }
      
      addMessage('assistant', fallbackMsg);
      
      return { text: fallbackMsg };
    }
  }, [addMessage, generateContext, generateContextualResponse, learnFromUser]);

  const startListening = useCallback(() => {
    if (!checkSpeechRecognitionSupport()) {
      setMicPermissionError('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'es-ES';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 1;

    let finalTranscript = '';
    let lastResultIndex = 0;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setMicPermissionError('');
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      
      for (let i = lastResultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + transcript.trim();
        } else {
          interim += transcript;
        }
      }
      lastResultIndex = event.results.length;
      
      setInterimText(finalTranscript + ' ' + interim);
      setInputText(finalTranscript + ' ' + interim);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimText('');
      
      if (finalTranscript.trim()) {
        handleMessage(finalTranscript.trim()).then(({ text: response }) => {
          if (response && isAudioEnabled) {
            setIsSpeaking(true);
            speakTextConversational(response, 'nico', () => {
              setIsSpeaking(false);
            });
          }
        });
      }
      finalTranscript = '';
      lastResultIndex = 0;
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimText('');
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicPermissionError('Por favor, permite el acceso al micrófono en tu navegador');
      }
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  }, [handleMessage, isAudioEnabled]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const speak = useCallback((text) => {
    if (!text || !isAudioEnabled) return;
    setIsSpeaking(true);
    speakTextConversational(text, 'nico', () => {
      setIsSpeaking(false);
    });
  }, [isAudioEnabled]);

  const stopSpeaking = useCallback(() => {
    speakTextConversational.stop?.();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const extraerDatosDelMensaje = (texto) => {
    const datos = {};
    const lowerTexto = texto.toLowerCase();
    
    const nombreMatch = texto.match(/(?:me llamo|soy|llamo)\s+([A-Za-zÁ-Úá-ú]+)/i);
    if (nombreMatch) {
      datos.nombre = nombreMatch[1];
    }

    const telefonoMatch = texto.match(/(\+?\d{10,15})/);
    if (telefonoMatch) {
      datos.telefono = telefonoMatch[1];
    }

    const emailMatch = texto.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      datos.email = emailMatch[0];
    }

    const motivoKeywords = ['porque', 'para', 'me interesa', 'necesito', 'quiero', 'mi objetivo', 'mi meta', 'busco', 'me gustaría', 'tengo interés'];
    if (motivoKeywords.some(kw => lowerTexto.includes(kw)) && texto.length > 20) {
      datos.motivo = texto.substring(0, 200);
    }

    return datos;
  };

  const getRespuestaSolicitudDatos = (leadData) => {
    if (!leadData.nombre && memory.conversationCount < 3) {
      return "Por cierto, ¿cómo te llamas? Me gusta saber a quién le hablo";
    }
    if (!leadData.telefono) {
      return `${leadData.nombre}, ¿me das tu WhatsApp para enviarte info y que un asesor te contacte?`;
    }
    if (!leadData.motivo) {
      return "¿Cuál es tu principal interés? Así te paso la mejor info.";
    }
    return null;
  };

  const shouldAskForData = (texto, leadData, mensajeAnterior) => {
    if (leadData.stage === 'cerrado') return false;
    if (leadData.motivo && leadData.nombre && leadData.telefono) {
      if (leadData.stage !== 'cerrado') {
        setLeadData(prev => ({ ...prev, stage: 'cerrado' }));
        if (currentLeadId) {
          const finalLead = {
            ...leadData,
            stage: 'cerrado',
            updatedAt: new Date().toISOString(),
          };
          addMessageToLead(currentLeadId, `Lead cerrado: ${leadData.motivo}`);
        }
      }
      return false;
    }

    const lowerTexto = texto.toLowerCase();
    const compraKeywords = ['quiero', 'me interesa', 'inscribirme', 'comprar', 'suscribirme', 'precio', 'cuánto', 'plan', 'cuál'];
    const hasCompraIntent = compraKeywords.some(kw => lowerTexto.includes(kw));

    if (!hasCompraIntent) return false;
    if (mensajeAnterior && mensajeAnterior.toLowerCase().includes('¿me das')) return false;
    
    return true;
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return;
    
    const text = inputText;
    const context = generateContext();
    
    const datosExtraidos = extraerDatosDelMensaje(text);
    if (datosExtraidos.nombre) {
      setLeadData(prev => ({ ...prev, nombre: datosExtraidos.nombre }));
    }
    if (datosExtraidos.telefono) {
      setLeadData(prev => ({ ...prev, telefono: datosExtraidos.telefono }));
    }
    if (datosExtraidos.email) {
      setLeadData(prev => ({ ...prev, email: datosExtraidos.email }));
    }
    if (datosExtraidos.motivo) {
      setLeadData(prev => ({ ...prev, motivo: datosExtraidos.motivo }));
    }
    
    setMessageCount(prev => prev + 1);
    
    const fallbackResponse = generateContextualResponse(text, context);
    const isGenericResponse = fallbackResponse.includes('¿Cómo te llamas?') || 
                               fallbackResponse.includes('¿Qué más me') ||
                               fallbackResponse.includes('¡Cuéntame más');
    
    if (!isGenericResponse && fallbackResponse) {
      addMessage('user', text);
      addMessage('assistant', fallbackResponse);
      setInputText('');
      return;
    }
    
    const currentLeadData = {
      nombre: datosExtraidos.nombre ? datosExtraidos.nombre : leadData.nombre,
      telefono: datosExtraidos.telefono ? datosExtraidos.telefono : leadData.telefono,
      email: datosExtraidos.email ? datosExtraidos.email : leadData.email,
      motivo: leadData.motivo,
      stage: leadData.stage,
    };
    
    const needsMoreData = shouldAskForData(text, currentLeadData, memory.conversationHistory[memory.conversationHistory.length - 1]?.content);
    const dataRequestResponse = getRespuestaSolicitudDatos(currentLeadData);
    
    if (needsMoreData && dataRequestResponse) {
      addMessage('user', text);
      setTimeout(() => {
        addMessage('assistant', dataRequestResponse);
        if (isAudioEnabled) speak(dataRequestResponse);
      }, 100);
      setInputText('');
      return;
    }
    
    const { text: response } = await handleMessage(text);
    setInputText('');
  }, [inputText, leadData, memory.conversationHistory, handleMessage, addMessage, createLead, generateContext, generateContextualResponse]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const detectarIntentVenta = (texto) => {
    const keywords = ['precio', 'cuánto', 'cuesta', 'plan', 'comprar', 'inscribir', 'suscribirme', 'quiero', 'me interesa'];
    return keywords.some(kw => texto.toLowerCase().includes(kw));
  };

  const sendGreeting = useCallback(() => {
    if (!greetingSent) {
      const userName = memory.userName || 'amigo';
      const greeting = userName && userName !== 'amigo'
        ? `¡Hola! Soy Nico, tu asistente de EdutechLife. ¿En qué te puedo ayudar?`
        : '¡Hola! Soy Nico, tu asistente de EdutechLife. ¿En qué te puedo ayudar?';
      
      addMessage('assistant', greeting);
      setGreetingSent(true);
      incrementConversationCount();
      
      if (isAudioEnabled) {
        setTimeout(() => speak(greeting), 500);
      }
    }
  }, [greetingSent, memory.userName, addMessage, incrementConversationCount, isAudioEnabled, speak]);

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePlayMessage = (text, index) => {
    if (!isAudioEnabled) return;
    if (playingMessageId === index) {
      setPlayingMessageId(null);
      return;
    }
    setPlayingMessageId(index);
    speakTextConversational(text, 'nico', () => {
      setPlayingMessageId(null);
    });
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setTimeout(() => {
      sendGreeting();
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000]">
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4DA8C4] via-[#66CCCC] to-[#004B63] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}
      
      {isOpen && (
        <div className="w-96 max-h-[600px] bg-gradient-to-br from-[#0A1628] via-[#0F2847] to-[#0A1628] rounded-3xl shadow-2xl border border-[#4DA8C4]/40 overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-[#4DA8C4]/40 flex items-center justify-between bg-gradient-to-r from-[#004B63]/80 to-[#0A1628]/80">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4DA8C4] via-[#66CCCC] to-[#004B63] flex items-center justify-center text-[#0A1628] font-bold shadow-lg shadow-[#4DA8C4]/30 border-2 border-[#66CCCC]/50">
                N
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  NICO Soporte
                </h3>
                <p className="text-[#66CCCC] text-[10px] flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : isSpeaking ? 'bg-green-500 animate-pulse' : isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-[#66CCCC] animate-pulse'}`}></span>
                  {isListening ? 'Escuchando' : isSpeaking ? 'Hablando' : isProcessing ? 'Escribiendo' : 'En línea'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-1.5 rounded-xl transition-all ${isAudioEnabled ? 'bg-[#4DA8C4] text-white shadow-lg' : 'bg-[#0A1628]/50 text-[#66CCCC] hover:text-white hover:bg-[#4DA8C4]'}`}
                title={isAudioEnabled ? 'Audio Activado - Nico hablará' : 'Audio Desactivado'}
              >
                {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              
              {isSpeaking && isAudioEnabled && (
                <button onClick={stopSpeaking} className="p-1.5 rounded-xl bg-red-500 text-white shadow-lg">
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
              
              {isListening && (
                <button onClick={stopListening} className="p-1.5 rounded-xl bg-red-500 text-white shadow-lg">
                  <MicOff className="w-3.5 h-3.5" />
                </button>
              )}
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  setGreetingSent(false);
                  clearMemory();
                  setLastCategory(null);
                }}
                className="p-1.5 rounded-full bg-[#0A1628]/50 text-[#66CCCC] hover:text-white hover:bg-[#4DA8C4] transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#4DA8C4]/50 scrollbar-track-transparent"
            style={{ maxHeight: '420px' }}
          >
            {memory.conversationHistory.length === 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#004B63]/30 border border-[#4DA8C4]/30">
                <Bot className="w-4 h-4 text-[#66CCCC]" />
                <span className="text-sm text-[#66CCCC]">¡Hola! Soy Nico, tu asistente de EdutechLife. ¿En qué te puedo ayudar?</span>
              </div>
            )}
            
            {memory.conversationHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="self-start max-w-[85%] p-4 rounded-2xl rounded-tl-none bg-gradient-to-br from-[#004B63]/60 to-[#0A1628] border border-[#4DA8C4]/40 shadow-lg relative group">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white font-medium">{msg.content}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {isAudioEnabled && (
                        <button onClick={() => handlePlayMessage(msg.content, index)} className="p-1 rounded-full bg-[#4DA8C4]/40 hover:bg-[#4DA8C4]/60 text-[#66CCCC]">
                          {playingMessageId === index ? <VolumeX className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                        </button>
                      )}
                      <button onClick={() => handleCopyMessage(msg.content)} className="p-1 rounded-full bg-[#4DA8C4]/40 hover:bg-[#4DA8C4]/60 text-[#66CCCC]">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                
                {msg.role === 'user' && (
                  <div className="self-end max-w-[85%] p-4 rounded-2xl rounded-tr-none bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-[#0A1628] font-bold shadow-lg border border-[#66CCCC]/30">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </div>
                )}
              </div>
            ))}
            
            {isAILoading && (
              <div className="self-start max-w-[85%]">
                <div className="p-4 rounded-2xl rounded-tl-none bg-gradient-to-br from-[#004B63]/60 to-[#0A1628] border border-[#4DA8C4]/40 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-xs text-[#66CCCC] font-medium">{isProcessing ? 'Nico está escribiendo...' : 'Nico está pensando...'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[#4DA8C4]/30 bg-gradient-to-t from-[#004B63]/40 to-[#0A1628]">
            {micPermissionError && (
              <div className="mb-2 text-xs text-red-400 bg-red-500/20 px-3 py-1 rounded-lg">
                {micPermissionError}
              </div>
            )}
            
            <div className="flex gap-3 items-center">
              <button
                onClick={toggleListening}
                disabled={isSpeaking}
                className={`p-3 rounded-full transition-all hover:scale-105 disabled:opacity-50 ${isListening ? 'bg-cyan-400 text-white animate-pulse shadow-lg shadow-cyan-400/50' : 'bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white shadow-lg shadow-[#4DA8C4]/30'}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <div className="flex-1 bg-[#0A1628]/80 border border-[#4DA8C4]/40 rounded-full px-5 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Escuchando..." : "Escribe tu mensaje..."}
                  className="w-full bg-transparent text-white placeholder-[#66CCCC] focus:outline-none focus:border-[#4DA8C4]/50 text-sm"
                />
                {isListening && interimText && (
                  <div className="text-sm text-[#66CCCC] opacity-70 mt-1 animate-pulse">
                    {interimText}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-3 rounded-full bg-gradient-to-r from-[#4DA8C4] via-[#66CCCC] to-[#4DA8C4] bg-[length:200%_100%] text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg shadow-[#4DA8C4]/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NicoSupport;
