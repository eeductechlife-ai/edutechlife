import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Bot, User, CheckCircle, RotateCcw } from 'lucide-react';
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
  
  // Eliminar formato markdown - Negritas **texto** -> texto
  cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleanText = cleanText.replace(/__([^_]+)__/g, '$1');
  
  // Eliminar formato markdown - Cursivas *texto* -> texto
  cleanText = cleanText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1');
  cleanText = cleanText.replace(/(?<!_)_([^_]+)_(?!_)/g, '$1');
  
  // Eliminar encabezados markdown # ## ###
  cleanText = cleanText.replace(/^#{1,6}\s+/gm, '');
  
  // Eliminar listas con guiones o números - item
  cleanText = cleanText.replace(/^[\s]*[-*+]\s+/gm, '');
  cleanText = cleanText.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // Eliminar enlaces [texto](url) -> texto
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Eliminar bloques de código `codigo` -> codigo
  cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  
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
  
  // Eliminar barras verticales consecutivas | |
  cleanText = cleanText.replace(/\|{2,}/g, '');
  
  // Limpiar espacios múltiples
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  // Si queda vacío o solo espacios/puntos, devolver texto original sin emojis
  if (!cleanText || /^[\s.\-_]*$/.test(cleanText)) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
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

// Función para eliminar muletilla de presentación de las respuestas
const removeGreetingMulletilla = (text) => {
  if (!text) return text;
  
  // Patrones de muletilla que la IA podría usar al inicio
  const mulletillaPatterns = [
    // Presentaciones de Nico
    /^hola soy nico[\s,.]+/i,
    /^hola[\s,]+soy nico[\s,.]+/i,
    /^soy nico[\s,.]+/i,
    /^soy nico de edutechlife[\s,.]+/i,
    /^soy el asistente nico[\s,.]+/i,
    /^nico aquí[\s,.]+/i,
    /^como nico[\s,.]+/i,
    /^nicolas[\s,.]+/i,
    /^yo soy nico[\s,.]+/i,
    // Saludos genéricos al inicio (no debe decir "Hola" al inicio de respuestas)
    /^¡*hola[!.*]*[\s,]+/i,
    /^buenos días[\s,!.*]*/i,
    /^buenas tardes[\s,!.*]*/i,
    /^buenas noches[\s,!.*]*/i,
    /^que tal[\s,!.*]*/i,
    /^buen día[\s,!.*]*/i,
    // Saludos con nombre
    /^hola\s+[a-záéíóúñ]+\s*,[\s,]+/i,
    /^¡hola\s+[a-záéíóúñ]+!*\s*/i
  ];
  
  let cleanText = text;
  
  for (const pattern of mulletillaPatterns) {
    cleanText = cleanText.replace(pattern, '');
  }
  
  // Limpiar espacios, puntuación y caracteres leftover resultantes
  cleanText = cleanText.replace(/^[\s,.-¡!¿?]+/, '').replace(/\s{2,}/g, ' ');
  
  // Si la respuesta quedó vacía o muy corta, devolver original
  if (cleanText.trim().length < 5) {
    return text;
  }
  
  // Asegurar que la primera letra sea mayúscula si hay texto
  if (cleanText.length > 0) {
    cleanText = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
  }
  
  return cleanText.trim();
};

// Función para determinar si se debe pedir el nombre de forma sutil
const shouldAskForName = (userContext) => {
  const { messagesSinceStart = 0, nameAskedOnce, dontWantName, userName } = userContext;
  
  // Solo preguntar si:
  // - Han pasado 2+ mensajes del usuario
  // - NO se ha obtenido el nombre aún
  // - NO se ha preguntado antes
  // - El usuario NO ha indicado que no quiere dar su nombre
  return (
    messagesSinceStart >= 2 &&
    !userName &&
    !nameAskedOnce &&
    !dontWantName
  );
};

// Función para usar el nombre cada 3-4 respuestas de forma natural
const useNameInResponse = (response, userContext) => {
  const { userName, nameUsageCounter = 0 } = userContext;
  
  // Si no hay nombre o el contador no está en rango válido, devolver respuesta normal
  if (!userName || nameUsageCounter < 3) {
    return { response, newCounter: nameUsageCounter };
  }
  
  // Solo usar nombre si el contador está entre 3 y 4
  if (nameUsageCounter > 4) {
    return { response, newCounter: 0 }; // Resetear contador
  }
  
  // Ocasionalmente usar el nombre (aproximadamente la mitad de las veces en rango 3-4)
  if (Math.random() > 0.5) {
    const nameInsertPatterns = [
      `${userName}, `,
      `${userName}, `,
      `para ${userName}, `
    ];
    
    const randomPattern = nameInsertPatterns[Math.floor(Math.random() * nameInsertPatterns.length)];
    const responseWithName = randomPattern + response.charAt(0).toLowerCase() + response.slice(1);
    
    return { response: responseWithName, newCounter: nameUsageCounter + 1 };
  }
  
  return { response, newCounter: nameUsageCounter + 1 };
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

// Función para detectar nombre, edad e intereses del mensaje
const extractUserContext = (message) => {
  const lowerMessage = message.toLowerCase();
  const context = { 
    userName: null, 
    detectedInterest: null, 
    studentAge: null,
    conversationStage: null,
    detectedTopics: [],
    dontWantName: false
  };
  
  // Detectar si el usuario NO quiere dar su nombre
  const dontWantPatterns = [
    /no (quiero|prefiero|me gusta|voy a)/i,
    /no te voy a dar/i,
    /no te dare/i,
    /sin nombre/i,
    /anonimo/i,
    /olvida.*nombre/i,
    /no importa.*nombre/i,
    /no es necesario.*nombre/i,
    /no necesito.*nombre/i
  ];
  
  for (const pattern of dontWantPatterns) {
    if (pattern.test(message)) {
      context.dontWantName = true;
      break;
    }
  }
  
  // Si no quiere dar nombre, no intentar extraer
  if (context.dontWantName) {
    return context;
  }
  
  // Extraer nombre
  const namePatterns = [
    /me llamo\s+([a-záéíóúñ]+)/i,
    /mi nombre es\s+([a-záéíóúñ]+)/i,
    /soy\s+([a-záéíóúñ]+)\s*(?:y|tengo|estoy)/i,
    /(?:llámame|dime)\s+([a-záéíóúñ]+)/i,
    /^([a-záéíóúñ]+)$/i
  ];
  
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1].length > 2) {
      context.userName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      break;
    }
  }
  
  // Extraer edad
  const agePatterns = [
    /tengo\s+(\d+)\s*años/i,
    /de\s+(\d+)\s*años/i,
    /(\d+)\s*años\s*(?:de|tengo|para)/i,
    /para\s+(?:un|una)\s+niñ[oa]\s+de\s+(\d+)/i
  ];
  
  for (const pattern of agePatterns) {
    const match = message.match(pattern);
    if (match) {
      context.studentAge = parseInt(match[1]);
      break;
    }
  }
  
  // Detectar intereses
  const interestPatterns = [
    { pattern: /vak|estilo.*aprendizaje|visual|auditivo|kinestésico/i, interest: 'VAK' },
    { pattern: /stem|robótica|robotica|programación|scratch|python|lego|arduino/i, interest: 'STEM' },
    { pattern: /tutoría|tutoria|clases.*matemáticas|clases.*ciencias|profesor/i, interest: 'Tutoría' },
    { pattern: /bienestar|psicología|psicologia|ansiedad|estrés|emocional/i, interest: 'Bienestar' },
    { pattern: /inglés|ingles|english|idioma/i, interest: 'Inglés' }
  ];
  
  for (const { pattern, interest } of interestPatterns) {
    if (pattern.test(lowerMessage)) {
      context.detectedInterest = interest;
      break;
    }
  }
  
  return context;
};

// Base de conocimientos completa para Nico
const getQuickResponse = (userMessage, userContext = {}) => {
  const lowerMessage = userMessage.toLowerCase().trim();
  const { userName, detectedInterest, studentAge, messagesSinceStart = 0 } = userContext;
  
  // Usar nombre del contexto si está disponible
  const namePrefix = userName ? `${userName}, ` : '';
  
  // ==================== PEDIR NOMBRE DE FORMA SUTIL ====================
  // Verificar si debe pedir el nombre (después de 2+ mensajes, sin nombre, no preguntado)
  if (shouldAskForName(userContext)) {
    // Preguntar de forma sutil con contexto
    return '¿Para personalizar mi ayuda, cómo te llamas?';
  }
  
  // ==================== SALUDOS ====================
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenas') || lowerMessage === 'hi') {
    // No presentarise, solo responder directamente
    return '¿En qué puedo ayudarte? Puedo informarte sobre VAK, STEM, tutorías, precios y más.';
  }
  
  // ==================== SERVICIOS - VAK ====================
  if ((lowerMessage.includes('qué es') || lowerMessage.includes('que es') || lowerMessage.includes('definicion') || lowerMessage.includes('explic')) && (lowerMessage.includes('vak') || lowerMessage.includes('estilo'))) {
    return 'VAK son los tres estilos de aprendizaje: Visual (aprendes viendo), Auditivo (aprendes escuchando) y Kinestésico (aprendes haciendo). Identificamos cuál es el tuyo con un diagnóstico gratuito de 30 minutos.';
  }
  
  if (lowerMessage.includes('diagnóstico') || lowerMessage.includes('test') || lowerMessage.includes('prueba')) {
    if (lowerMessage.includes('vak')) {
      return 'El diagnóstico VAK es un test gratuito de aproximadamente 30 minutos. Identifica tu estilo de aprendizaje para personalizar tu educación. ¿Te gustaría agendarlo?';
    }
  }
  
  if (lowerMessage.includes('visual') || lowerMessage.includes('auditivo') || lowerMessage.includes('kinest') || lowerMessage.includes('quinest')) {
    return 'Los estilos VAK son: Visual (mapas mentales, diagramas), Auditivo (podcasts, debates) y Kinestésico (experimentos, movimiento). ¿Cuál te interesa más?';
  }
  
  // ==================== SERVICIOS - STEM ====================
  if ((lowerMessage.includes('qué es') || lowerMessage.includes('que es')) && (lowerMessage.includes('stem') || lowerMessage.includes('steam'))) {
    return 'STEM es Science, Technology, Engineering y Mathematics. Desarrollamos habilidades del futuro con proyectos prácticos de robótica y programación. Para niños desde 5 años.';
  }
  
  if (lowerMessage.includes('robótica') || lowerMessage.includes('robotica') || lowerMessage.includes('lego') || lowerMessage.includes('arduino')) {
    return 'Ofrecemos robótica con LEGO y Arduino para niños y adolescentes. Aprenden construyen y programan robots reales. ¿Para qué edad sería?';
  }
  
  if (lowerMessage.includes('programación') || lowerMessage.includes('programacion') || lowerMessage.includes('scratch') || lowerMessage.includes('python') || lowerMessage.includes('javascript')) {
    return 'Programación: Scratch para niños, Python y JavaScript para adolescentes. Desde cero hasta nivel avanzado. ¿Qué edad tiene el estudiante?';
  }
  
  // ==================== SERVICIOS - TUTORÍAS ====================
  if (lowerMessage.includes('tutoría') || lowerMessage.includes('tutoria') || lowerMessage.includes('clases') || lowerMessage.includes('profesor') || lowerMessage.includes('docente')) {
    return 'Ofrecemos tutorías personalizadas en: Matemáticas, Ciencias, Inglés y Técnicas de estudio. Para todas las edades. ¿Qué materia necesitas?';
  }
  
  if (lowerMessage.includes('matemática') || lowerMessage.includes('matematicas') || lowerMessage.includes('álgebra') || lowerMessage.includes('geometría') || lowerMessage.includes('calculo')) {
    return 'Tenemos tutores especializados en matemáticas para todos los niveles: escolar, universitario y preparación para exámenes. ¿Qué tema necesitas reforzar?';
  }
  
  if (lowerMessage.includes('ciencias') || lowerMessage.includes('física') || lowerMessage.includes('fisica') || lowerMessage.includes('química') || lowerMessage.includes('quimica') || lowerMessage.includes('biología') || lowerMessage.includes('biologia')) {
    return 'Ofrecemos clases de física, química y biología para todos los niveles. ¿Qué materia y nivel necesitas?';
  }
  
  if (lowerMessage.includes('inglés') || lowerMessage.includes('ingles') || lowerMessage.includes('english') || lowerMessage.includes('idioma')) {
    return 'Clases de inglés para todos los niveles: básico, intermedio, avanzado, preparación para exámenes (TOEFL, IELTS). ¿Cuál es tu nivel actual?';
  }
  
  if (lowerMessage.includes('técnicas') || lowerMessage.includes('tecnicas') || lowerMessage.includes('estudio') || lowerMessage.includes('aprender')) {
    return 'Enseñamos técnicas de estudio efectivas: mapas mentales, resumen, memoria, gestión del tiempo. ¿Para qué edad buscas?';
  }
  
  // ==================== SERVICIOS - BIENESTAR ====================
  if (lowerMessage.includes('bienestar') || lowerMessage.includes('salud mental') || lowerMessage.includes('psicología') || lowerMessage.includes('psicologia') || lowerMessage.includes('emocional')) {
    return 'Nuestro servicio de bienestar incluye: acompañamiento psicológico escolar, desarrollo de inteligencia emocional, manejo de ansiedad académica y coaching motivacional. ¿Qué necesitas?';
  }
  
  if (lowerMessage.includes('ansiedad') || lowerMessage.includes('estrés') || lowerMessage.includes('estres') || lowerMessage.includes('presión')) {
    return 'Ayudamos con manejo de ansiedad y estrés académico. Incluye técnicas de relajación, coaching y acompañamiento psicológico. ¿Para quién es?';
  }
  
  // ==================== PRECIOS Y PLANES ====================
  if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta') || lowerMessage.includes('valor') || lowerMessage.includes('cuanto') || lowerMessage.includes('costo')) {
    return 'Tenemos diferentes planes según tus necesidades. La primera clase es gratuita para que conozcas nuestro método. ¿Te interesa que te envíe información de planes?';
  }
  
  if (lowerMessage.includes('plan') || lowerMessage.includes('paquete') || lowerMessage.includes('mensual')) {
    return 'Ofrecemos planes mensuales con descuento por pago anticipado, paquetes de clases y planes por hora. ¿Qué tipo de plan prefieres?';
  }
  
  if (lowerMessage.includes('descuento') || lowerMessage.includes('becas') || lowerMessage.includes('becas')) {
    return 'Tenemos descuentos para hermanos y becas disponibles para casos especiales. ¿Te interesa alguna de estas opciones?';
  }
  
  // ==================== PRIMERA CLASE ====================
  if (lowerMessage.includes('primera') || lowerMessage.includes('gratis') || lowerMessage.includes('gratuita') || lowerMessage.includes('prueba') || lowerMessage.includes('demo')) {
    return 'La primera clase es SIEMPRE gratuita y sin compromiso. Dura aproximadamente 30-45 minutos para que conoces nuestro método. ¿Te gustaría agendar?';
  }
  
  // ==================== MODALIDADES ====================
  if (lowerMessage.includes('online') || lowerMessage.includes('virtual') || lowerMessage.includes('remoto')) {
    return 'Sí, tenemos clases 100% online por videollamada. Puedes tomar desde cualquier lugar. ¿Te interesa esta modalidad?';
  }
  
  if (lowerMessage.includes('presencial') || lowerMessage.includes('físico') || lowerMessage.includes('fisico') || lowerMessage.includes('sede')) {
    return 'Tenemos modalidad presencial en Bogotá y otras ciudades. También puedes optar por clases híbridas. ¿En qué ciudad te encuentras?';
  }
  
  if (lowerMessage.includes('híbrido') || lowerMessage.includes('hibrido') || lowerMessage.includes('mixto')) {
    return 'Sí, ofreciendo clases híbridas que combinan presencial y online. ¿Qué ciudad indicas para verificar disponibilidad?';
  }
  
  // ==================== HORARIOS ====================
  if (lowerMessage.includes('horario') || lowerMessage.includes('hora') || lowerMessage.includes('disponible')) {
    return 'Nuestros horarios son: Mañana (8am-12pm), Tarde (2pm-6pm), Noche (6pm-8pm). Disponible de lunes a sábado. ¿Qué horario te funciona mejor?';
  }
  
  if (lowerMessage.includes('lunes') || lowerMessage.includes('martes') || lowerMessage.includes('miercoles') || lowerMessage.includes('jueves') || lowerMessage.includes('viernes') || lowerMessage.includes('sábado') || lowerMessage.includes('sabado') || lowerMessage.includes('domingo')) {
    return 'Estamos disponibles de lunes a sábado. ¿Qué día y horario te funciona mejor para una clase?';
  }
  
  // ==================== EDADES ====================
  if (lowerMessage.includes('niños') || lowerMessage.includes('ninos') || lowerMessage.includes('niña') || lowerMessage.includes('niño') || lowerMessage.includes('chico') || lowerMessage.includes('chica')) {
    return 'Trabajamos con niños desde 5 años. Para esa edad ofrecemos programas de robótica con LEGO y programación con Scratch de forma lúdica. ¿Cuántos años tiene?';
  }
  
  if (lowerMessage.includes('adolescentes') || lowerMessage.includes('joven') || lowerMessage.includes('juven') || lowerMessage.includes('teen')) {
    return 'Para adolescentes (12-17 años) tenemos STEM avanzado, tutorías académicas y preparación para exámenes. ¿Qué necesita el estudiante?';
  }
  
  if (lowerMessage.includes('adultos') || lowerMessage.includes('universitario') || lowerMessage.includes('profesional')) {
    return 'Para adultos y universitarios offerizamos tutorías especializadas, preparación de exámenes y cursos de inglés. ¿Qué necesitas?';
  }
  
  // ==================== INSCRIPCIÓN ====================
  if (lowerMessage.includes('inscribir') || lowerMessage.includes('inscripcion') || lowerMessage.includes('empezar') || lowerMessage.includes('iniciar') || lowerMessage.includes('cómo comenzar') || lowerMessage.includes('comenzar')) {
    return 'Para inscribirte es很简单: agendamos tu primera clase gratuita de 30-45 minutos. En esa sesión conocernos tus necesidades y diseñamos un plan personalizado. ¿Te gustaría agendar?';
  }
  
  if (lowerMessage.includes('qué necesito') || lowerMessage.includes('requisito') || lowerMessage.includes('necesito')) {
    return 'Solo necesitas tener interés en aprender. Para agendar la primera clase gratuita, solo necesitamos tu nombre y un contacto (whatsapp o email). ¿Me los compartes?';
  }
  
  // ==================== CONTACTO ====================
  if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('telefono') || lowerMessage.includes('whatsapp') || lowerMessage.includes('celular')) {
    return 'Puedes contactarnos por WhatsApp: +57 300 123 4567, por email: info@edutechlife.com o en nuestra web: www.edutechlife.com';
  }
  
  if (lowerMessage.includes('ubicación') || lowerMessage.includes('ubicacion') || lowerMessage.includes('dirección') || lowerMessage.includes('direccion') || lowerMessage.includes('donde')) {
    return 'Tenemos sedes presenciales en Bogotá y otras ciudades. También puedes tomar clases online desde cualquier lugar. ¿En qué ciudad te encuentras?';
  }
  
  if (lowerMessage.includes('web') || lowerMessage.includes('página') || lowerMessage.includes('pagina') || lowerMessage.includes('sitio')) {
    return 'Visita nuestra web: www.edutechlife.com ahí encontrarás toda la información sobre servicios, precios y puedes agendar tu clase gratuita.';
  }
  
  // ==================== IDENTIDAD ====================
  if (lowerMessage.includes('quién eres') || lowerMessage.includes('quien eres') || lowerMessage.includes('qué haces') || lowerMessage.includes('que haces')) {
    return 'Asistente virtual de EdutechLife. Ayudo a personas a encontrar el mejor camino educativo según sus necesidades.';
  }
  
  // ==================== DESPEDIDAS ====================
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
    return 'De nada. Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?';
  }
  
  if (lowerMessage.includes('adiós') || lowerMessage.includes('chao') || lowerMessage.includes('bye') || lowerMessage.includes('hasta luego')) {
    return 'Fue un gusto ayudarte. Recuerda que puedes contactarnos al WhatsApp: +57 300 123 4567. ¡Hasta pronto!';
  }
  
  // ==================== AYUDA ====================
  if (lowerMessage.includes('ayuda') || lowerMessage.includes('información') || lowerMessage.includes('informacion') || lowerMessage.includes('duda')) {
    return 'Con gusto te ayudo. Puedo informarte sobre VAK, STEM, tutorías, precios, horarios, modalidades o cualquier otra duda. ¿Qué necesitas saber?';
  }
  
  return null; // No hay respuesta predefinida, usar IA
};

// Función para generar sugerencias de preguntas basadas en el contexto
const getQuestionSuggestions = (messages, userContext = {}) => {
  const suggestions = [];
  const { conversationStage, detectedTopics = [], studentAge } = userContext;
  
  // Obtener los temas ya mencionados en la conversación
  const lastMessages = messages.slice(-6).map(m => m.content.toLowerCase()).join(' ');
  const mentionedTopics = [];
  
  if (lastMessages.includes('vak') || lastMessages.includes('estilo')) mentionedTopics.push('VAK');
  if (lastMessages.includes('stem') || lastMessages.includes('robótica') || lastMessages.includes('programación')) mentionedTopics.push('STEM');
  if (lastMessages.includes('tutoría') || lastMessages.includes('clase') || lastMessages.includes('matemática')) mentionedTopics.push('Tutoría');
  if (lastMessages.includes('precio') || lastMessages.includes('cuesta') || lastMessages.includes('plan')) mentionedTopics.push('Precios');
  if (lastMessages.includes('bienestar') || lastMessages.includes('psicología')) mentionedTopics.push('Bienestar');
  if (lastMessages.includes('inglés') || lastMessages.includes('ingles')) mentionedTopics.push('Inglés');
  
  // Etapa 1: Inicio - Sin contexto previo
  if (mentionedTopics.length === 0 || conversationStage === 'inicio') {
    return [
      '¿Qué servicios ofrecen?',
      '¿Qué es el diagnóstico VAK?',
      '¿Tienen clases de programación?',
      '¿Cuál es el costo de las tutorías?'
    ];
  }
  
  // Etapa 2: Descubrimiento - Usuario mostró interés en un tema
  if (mentionedTopics.includes('VAK')) {
    suggestions.push(
      '¿Cómo se hace el test VAK?',
      '¿Cuánto tiempo dura el diagnóstico?',
      '¿Es gratuito?',
      '¿Qué incluye el resultado?'
    );
  } else if (mentionedTopics.includes('STEM')) {
    suggestions.push(
      '¿Para qué edad es適合?',
      '¿Qué proyectos prácticos hacen?',
      '¿Necesito conocimientos previos?',
      '¿Tienen robots LEGO o Arduino?'
    );
  } else if (mentionedTopics.includes('Tutoría')) {
    suggestions.push(
      '¿Qué materias ofrecen?',
      '¿Son clases individuales?',
      '¿Cómo son los tutores?',
      '¿Puedo tomar una clase de prueba?'
    );
  } else if (mentionedTopics.includes('Precios')) {
    suggestions.push(
      '¿Qué planes tienen disponibles?',
      '¿Hay descuentos por pago anticipado?',
      '¿Ofrecen becas?',
      '¿Cómo funciona la primera clase gratuita?'
    );
  } else if (mentionedTopics.includes('Inglés')) {
    suggestions.push(
      '¿Qué nivel de inglés ofrecen?',
      '¿Preparan para exámenes internacionales?',
      '¿Tienen clases de conversación?',
      '¿Cuántas clases por mes incluyen?'
    );
  } else {
    //Sugerencias generales basadas en etapa
    suggestions.push(
      '¿Cómo me inscribo?',
      '¿Tienen modalidad online?',
      '¿Qué horarios tienen disponibles?',
      '¿Primera clase es gratis?'
    );
  }
  
  return suggestions.slice(0, 4);
};

// Función para generar opciones de conversación después de 3 intercambios
const getConversationOptions = (messages, userContext = {}) => {
  const userMessages = messages.filter(msg => msg.role === 'user').length;
  const { conversationStage, detectedInterest, studentAge } = userContext;
  
  // Solo mostrar opciones después de 2 preguntas del usuario
  if (userMessages < 2) {
    return null;
  }
  
  // Analizar el contexto de la conversación
  const lastMessages = messages.slice(-6).map(msg => msg.content.toLowerCase()).join(' ');
  
  // Determinar etapa y tema
  let currentStage = 'descubrimiento';
  let currentTopic = null;
  
  // Detectar etapa basada en palabras clave
  if (lastMessages.includes('inscribir') || lastMessages.includes('agendar') || lastMessages.includes('cómo empezar')) {
    currentStage = 'accion';
  } else if (lastMessages.includes('precio') || lastMessages.includes('cuesta') || lastMessages.includes('valor') || lastMessages.includes('plan')) {
    currentStage = 'informacion';
    currentTopic = 'Precios';
  } else if (lastMessages.includes('vak') || lastMessages.includes('stem') || lastMessages.includes('tutoría')) {
    currentStage = 'interes';
    if (lastMessages.includes('vak')) currentTopic = 'VAK';
    else if (lastMessages.includes('stem')) currentTopic = 'STEM';
    else if (lastMessages.includes('tutoría')) currentTopic = 'Tutoría';
  }
  
  const options = [];
  
  // Opciones según etapa y tema
  if (currentStage === 'descubrimiento' || currentTopic === null) {
    options.push(
      { text: 'Conocer diagnóstico VAK', action: 'learn_vak' },
      { text: 'Ver cursos STEM', action: 'explore_stem' },
      { text: 'Información de tutorías', action: 'info_tutoring' }
    );
  } else if (currentTopic === 'VAK') {
    options.push(
      { text: 'Agendar diagnóstico VAK', action: 'schedule_vak' },
      { text: 'Más sobre estilos de aprendizaje', action: 'more_vak' },
      { text: 'Ver otros servicios', action: 'other_services' }
    );
  } else if (currentTopic === 'STEM') {
    options.push(
      { text: 'Ver proyectos de robótica', action: 'view_robotics' },
      { text: 'Cursos de programación', action: 'view_programming' },
      { text: 'Agendar clase demo', action: 'demo_stem' }
    );
  } else if (currentTopic === 'Tutoría') {
    options.push(
      { text: 'Ver materias disponibles', action: 'view_subjects' },
      { text: 'Agendar tutoría de prueba', action: 'trial_tutoring' },
      { text: 'Conocer tutores', action: 'meet_tutors' }
    );
  } else if (currentStage === 'informacion' || currentTopic === 'Precios') {
    options.push(
      { text: 'Ver planes y precios', action: 'view_pricing' },
      { text: 'Información de becas', action: 'info_scholarships' },
      { text: 'Descuentos disponibles', action: 'view_discounts' }
    );
  } else if (currentStage === 'accion') {
    options.push(
      { text: 'Agendar llamada ahora', action: 'schedule_call' },
      { text: 'Contactar por WhatsApp', action: 'contact_whatsapp' },
      { text: 'Solicitar más información', action: 'request_info' }
    );
  }
  
  return options.slice(0, 3);
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

// Prompt completo para conversación natural y fluida de Nico
const PROMPT_NICO_SOPORTE = `Eres NICO, asistente educativo conversacional de EdutechLife. Tu objetivo es ayudar a los usuarios con sus preguntas sobre educación de forma natural, directa y útil.

## INFORMACIÓN DE EDUTECHLIFE (CONOCE ESTA INFO)

### SERVICIOS:
1. **DIAGNÓSTICO VAK**: Identificación del estilo de aprendizaje (Visual, Auditivo, Kinestésico) para personalizar la educación. El diagnóstico dura aproximadamente 30 minutos y es gratuito.

2. **PROGRAMAS STEM/STEAM**: 
   - Robótica con LEGO y Arduino
   - Programación: Scratch (niños), Python, JavaScript
   - Pensamiento computacional
   - Para niños desde 5 años hasta adolescentes

3. **TUTORÍA ACADÉMICA PERSONALIZADA**:
   - Matemáticas (todos los niveles)
   - Ciencias (física, química, biología)
   - Inglés (conversacional, grammar, exámenes)
   - Técnicas de estudio
   - Para todas las edades

4. **BIENESTAR EDUCATIVO**:
   - Acompañamiento psicológico escolar
   - Desarrollo de inteligencia emocional
   - Manejo de ansiedad académica
   - Coaching motivacional

### MODALIDADES:
- Presencial (Bogotá y otras ciudades)
- Online (clases por videollamada)
- Híbrido (combinación de presencial y online)

### EDADES:
- Niños: 5-11 años
- Adolescentes: 12-17 años
- Adultos: 18+ años

### PRECIOS Y PLANES:
- Primera clase: SIEMPRE gratuita (sin compromiso)
- Planes mensuales con descuento por pago anticipado
- Planes por hora o por paquete de clases
- Descuentos para hermanos
- Becas disponibles para casos especiales

### HORARIOS:
- Mañana: 8am - 12pm
- Tarde: 2pm - 6pm
- Noche: 6pm - 8pm
- Disponible de lunes a sábado

### CONTACTO:
- WhatsApp: +57 300 123 4567
- Email: info@edutechlife.com
- Web: www.edutechlife.com

## REGLAS DE CONVERSACIÓN

### 1. RESPUESTA DIRECTA (LA REGLA MÁS IMPORTANTE):
- El usuario hace una pregunta -> Tú respondes DIRECTAMENTE
- NO empieces con "Claro", "Por supuesto", "Con gusto"
- NO digas introducciones largas
- Ejemplo MALO: "Claro, con gusto te explico sobre VAK. VAK son los estilos..."
- Ejemplo BUENO: "VAK son los estilos de aprendizaje: Visual, Auditivo y Kinestésico. Identificamos cuál es el tuyo para personalizar tu educación."

### 2. PRESENTACIÓN - REGLA CRÍTICA:
- El saludo "Hola soy Nico, asistente de EdutechLife. ¿En que puedo ayudarte?" SOLO aparece UNA VEZ al inicio de la conversación cuando el usuario abre el chat
- En TODAS las demás respuestas, NUNCA te presentes
- NUNCA digas: "Soy Nico", "Hola soy Nico", "Soy Nico de EdutechLife", "Nico aquí", etc.
- Esta muletilla NO debe aparecer en ninguna respuesta después del primer mensaje
- Si detectas que estás a punto de presentarte, salta directamente a responder la pregunta

### 3. PROHIBICIONES ABSOLUTAS:
- NO uses emojis de ningún tipo
- NO uses emoticones :) :( :D
- NO uses "xxx" o marcadores especiales
- NO uses asteriscos * para negritas
- NO uses formato markdown (#, -, listas)
- Tu respuesta debe ser 100% texto plano

### 4. CONVERSACIÓN NATURAL:
- Sé conversacional, no un robot
- Usa el contexto de la conversación
- Si el usuario te pregunta algo específico, responde específicamente
- No des información que no te piden
- Si no sabes algo, sé honesto: "No tengo esa información específica, pero puedo contactarte con alguien que te ayude"

### 5. FLUJO DE CONVERSACIÓN:
- Responde a la pregunta del usuario
- Si es relevante, ofrece información adicional útil
- No preguntes innecesariamente
- Solo captura datos (nombre, teléfono) si hay interés genuino en un servicio

### 6. ESTILO:
- Español natural y coloquial
- Respuestas de 1-3 oraciones (a menos que necesite más detalle)
- Evita frases repetitivas
- Adapta tu lenguaje al tono del usuario

### 7. CONTEXTO Y PERSONALIZACIÓN:
- Si conoces el nombre del usuario, úsalo en tus respuestas (ej: "Juan, te explico...")
- Si el usuario ya expresó interés en un servicio (VAK, STEM, tutorías), haz referencia a eso en lugar de preguntar de nuevo
- Si el usuario menciona su edad o la del estudiante, tenlo en cuenta para recomendar servicios apropiados
- Usa la información de conversaciones previas para hacer las respuestas más relevantes

## EJEMPLOS DE RESPUESTAS IDEALES:

Pregunta: "¿Qué es VAK?"
Respuesta ideal: "VAK son los tres estilos de aprendizaje: Visual (aprendes viendo), Auditivo (aprendes escuchando) y Kinestésico (aprendes haciendo). Identificamos cuál es el tuyo con un diagnóstico gratuito."

Pregunta: "¿Cuánto cuestan las clases?"
Respuesta ideal: "Tenemos diferentes planes según tus necesidades. La primera clase es gratuita para que conoces nuestro método. ¿Te interesa que te envíe información de planes?"

Pregunta: "¿Tienen sede en Medellín?"
Respuesta ideal: "Tenemos modalidad presencial en Bogotá y otras ciudades. También puedes tomar clases online desde cualquier lugar. ¿Dónde te encuentras actualmente?"`;

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
  
  // Estado para contexto de conversación
  const [userContext, setUserContext] = useState({
    userName: null,
    detectedInterest: null,
    studentAge: null,
    conversationStage: 'inicio', // 'inicio' | 'descubrimiento' | 'interes' | 'informacion' | 'accion'
    detectedTopics: [], // Array de temas detectados ['VAK', 'STEM', 'Precios']
    conversationPath: [], // Camino de la conversación para evitar repeticiones
    messagesSinceStart: 0, // Contador de mensajes del usuario
    nameAskedOnce: false, // Ya se preguntó el nombre
    dontWantName: false, // Usuario no quiere dar su nombre
    nameUsageCounter: 0 // Controlar uso del nombre cada 3-4 respuestas
  });
  
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
      
      const greeting = "Hola soy Nico, asistente de EdutechLife. ¿En que puedo ayudarte?";
      
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
    
    // Detectar contexto del usuario (nombre, edad, intereses)
    const detectedContext = extractUserContext(userMessage);
    setUserContext(prev => {
      // Actualizar temas detectados
      const newTopics = [...prev.detectedTopics];
      if (detectedContext.detectedInterest && !newTopics.includes(detectedContext.detectedInterest)) {
        newTopics.push(detectedContext.detectedInterest);
      }
      
      // Actualizar etapa basada en el mensaje
      let newStage = prev.conversationStage;
      const lowerMsg = userMessage.toLowerCase();
      if (newTopics.length === 0) {
        newStage = 'inicio';
      } else if (lowerMsg.includes('precio') || lowerMsg.includes('cuesta') || lowerMsg.includes('plan')) {
        newStage = 'informacion';
      } else if (lowerMsg.includes('inscribir') || lowerMsg.includes('agendar') || lowerMsg.includes('cómo empezar')) {
        newStage = 'accion';
      } else if (newTopics.length > 0) {
        newStage = 'interes';
      }
      
      // Determinar si debemos marcar que ya pedimos el nombre
      const shouldAsk = shouldAskForName(prev);
      let newNameAskedOnce = prev.nameAskedOnce;
      if (shouldAsk && lowerMsg.includes('cómo te llamas') || lowerMsg.includes('tu nombre') || lowerMsg.includes('te llamas')) {
        newNameAskedOnce = true;
      }
      
      // Si el usuario proporciona su nombre, usar ese valor
      // Si el usuario dice que no quiere dar su nombre, marcar dontWantName
      const newDontWantName = detectedContext.dontWantName ? true : (prev.dontWantName && !detectedContext.userName);
      
      return {
        ...prev,
        userName: detectedContext.userName || prev.userName,
        studentAge: detectedContext.studentAge || prev.studentAge,
        detectedInterest: detectedContext.detectedInterest || prev.detectedInterest,
        conversationStage: newStage,
        detectedTopics: newTopics.slice(-5), // Mantener últimos 5 temas
        messagesSinceStart: prev.messagesSinceStart + 1, // Incrementar contador de mensajes
        nameAskedOnce: newNameAskedOnce,
        dontWantName: newDontWantName
      };
    });
    
    // Primero verificar si hay respuesta rápida disponible
    const quickResponse = getQuickResponse(userMessage, userContext);
    if (quickResponse) {
      // Primero eliminar muletilla de presentación
      const noMulletilla = removeGreetingMulletilla(quickResponse);
      // Luego limpiar emojis
      const cleanResponse = removeEmojis(noMulletilla);
      
      // Respuesta inmediata sin llamar a API
      const assistantMessageObj = { 
        role: 'assistant', 
        content: cleanResponse,
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
          const noMulletillaVoice = removeGreetingMulletilla(quickResponse);
          const textToSpeak = removeEmojis(noMulletillaVoice);
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
      
      // Eliminar muletilla de presentación si la IA la incluyó
      const noMulletillaResponse = removeGreetingMulletilla(simplifiedResponse);
      
      // Usar nombre del usuario ocasionalmente (cada 3-4 respuestas)
      const { response: responseWithName, newCounter: counterAfterResponse } = useNameInResponse(noMulletillaResponse, userContext);
      
      // Limpiar texto de markdown y emojis antes de guardar
      const cleanResponse = removeEmojis(responseWithName);
      
      // Actualizar contador de uso del nombre
      setUserContext(prev => ({
        ...prev,
        nameUsageCounter: counterAfterResponse
      }));
      
      // Respuesta asistente optimizada
      const assistantMessageObj = { 
        role: 'assistant', 
        content: cleanResponse,
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
      if (userMessageCount >= 2 && !showedConversationOptions) {
        // Esperar un momento antes de mostrar opciones
        setTimeout(() => {
          const options = getConversationOptions([...messages, assistantMessageObj], userContext);
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
          const textToSpeak = removeEmojis(cleanResponse);
          speakTextConversational(textToSpeak, 'nico_premium');
        }, 100); // Reducido a 100ms para respuesta más rápida
      }
      
    } catch (error) {
      console.warn('Error en respuesta:', error.message);
      
      // Respuesta de error rápida y útil
      const errorMessage = `Parece que hubo un problema técnico. Puedo decirte que ofrecemos servicios educativos como VAK, STEM, tutorías y bienestar. Te interesa alguno?`;
      
      // Eliminar muletilla y limpiar texto
      const noMulletillaError = removeGreetingMulletilla(errorMessage);
      const cleanErrorMessage = removeEmojis(noMulletillaError);
      
      const errorMessageObj = { 
        role: 'assistant', 
        content: cleanErrorMessage,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
      
       if (audioEnabled) {
        setTimeout(() => {
          speakTextConversational(cleanErrorMessage, 'nico_premium');
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
        content: `Perfecto ${leadData.nombreCompleto.split(' ')[0]}, hemos registrado tu interes en ${leadData.interesPrincipal || 'nuestros servicios'}.`,
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
      console.error('Error guardando lead:', error);
      
      // Mensaje de error al usuario
      const errorMessage = {
        role: 'assistant',
        content: 'Hubo un error al guardar tu informacion. Por favor intenta de nuevo o contacta directamente por WhatsApp.',
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
        content: `Excelente. Hemos agendado tu llamada para el ${new Date(appointmentData.date).toLocaleDateString('es-CO')} a las ${appointmentData.time}. Recibiras confirmacion por ${appointmentData.leadPhone ? 'WhatsApp' : 'email'}.`,
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
            () => console.log('Confirmacion de cita hablada')
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

  // Función para iniciar nueva conversación sin cerrar el chat
  const startNewConversation = () => {
    resetChat();
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
        const welcomeMessage = `Hola soy Nico, asistente de EdutechLife. ¿En que puedo ayudarte?`;
        
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
          const reconnectMessage = `Hola soy Nico, asistente de EdutechLife. ¿En que puedo ayudarte?${nameGreeting}`;
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
          className={`flex flex-col bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 ${
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
                <h3 className="font-bold text-white">Nico</h3>
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
            
            {/* Botón Nueva Conversación */}
            <button
              onClick={startNewConversation}
              className="p-2 rounded-lg hover:opacity-80 transition"
              style={{ backgroundColor: COLORS.CORPORATE }}
              title="Nueva Conversación"
            >
              <RotateCcw className="w-4 h-4 text-white" />
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
                  Nico
                </h3>
                <p className="text-sm mb-6" style={{ color: COLORS.MINT }}>
                  Asistente de EdutechLife
                </p>
                 <p className="text-sm mb-6" style={{ color: COLORS.CORPORATE }}>
                   Puedo ayudarte con información sobre nuestros servicios educativos: VAK, STEM, tutorías y bienestar.
                 </p>
                 <p className="text-xs italic mb-4" style={{ color: COLORS.MINT }}>
                   Escribe tu pregunta en el campo de abajo
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
                      {getQuestionSuggestions(messages, userContext).map((suggestion, index) => (
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