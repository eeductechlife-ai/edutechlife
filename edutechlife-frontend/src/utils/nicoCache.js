// Sistema de Cache de 3 Niveles para respuestas instantáneas
// Nivel 1: Respuestas predefinidas (0ms)
// Nivel 2: Cache en memoria LRU (5ms)
// Nivel 3: Backend con streaming (200ms+)

// ==================== NIVEL 1: RESPUESTAS PREDEFINIDAS ====================

export const INSTANT_RESPONSES = new Map([
  // Saludos y básicos
  ['hola', '¡Hola! Soy Nico, tu asistente premium de EdutechLife. ¿En qué puedo ayudarte hoy?'],
  ['buenos días', '¡Buenos días! Es un placer atenderte. Soy Nico de EdutechLife. ¿Cómo puedo ayudarte?'],
  ['buenas tardes', '¡Buenas tardes! Bienvenido a EdutechLife. Soy Nico, tu asistente virtual. ¿En qué te puedo asistir?'],
  ['buenas noches', '¡Buenas noches! Aquí estoy para ayudarte. Soy Nico de EdutechLife. ¿Qué necesitas?'],
  ['hey', '¡Hey! 👋 Soy Nico, tu asistente de EdutechLife. ¿Listo para transformar tu aprendizaje?'],
  ['qué tal', '¡Todo excelente! 😊 Soy Nico de EdutechLife. ¿Y tú, en qué puedo ayudarte hoy?'],
  
  // Metodología VAK
  ['qué es vak', 'VAK es nuestra metodología premium que identifica tu estilo de aprendizaje único: Visual (aprendes viendo), Auditivo (aprendes escuchando) o Kinestésico (aprendes haciendo). ¿Te gustaría hacer el diagnóstico gratuito?'],
  ['metodología vak', 'La metodología VAK es nuestro sistema científico que personaliza el aprendizaje según tu estilo: Visual, Auditivo o Kinestésico. ¡El 95% de estudiantes mejoran sus notas con este método!'],
  ['estilo de aprendizaje', 'En EdutechLife identificamos tu estilo de aprendizaje con tecnología de punta: Visual, Auditivo o Kinestésico. Así personalizamos cada clase para maximizar tu potencial.'],
  ['visual auditivo kinestésico', '¡Exacto! Esos son los 3 estilos de aprendizaje VAK. Visuales aprenden con imágenes, Auditivos con sonidos, Kinestésicos con movimiento. ¿Sabes cuál es tu estilo?'],
  ['diagnóstico vak', '¡El diagnóstico VAK es gratuito! Identifica tu estilo de aprendizaje en 10 minutos. Te da un plan personalizado de estudio. ¿Te interesa agendarlo?'],
  
  // EdutechLife - Qué somos
  ['qué es edutechlife', 'EdutechLife es la plataforma educativa líder que combina tecnología de vanguardia con bienestar emocional. Transformamos el aprendizaje con metodología VAK, programas STEM y apoyo psicológico.'],
  ['quién es edutechlife', 'Somos el ecosistema educativo más innovador de Latinoamérica. Combinamos neurociencia, tecnología y pedagogía para maximizar el potencial de cada estudiante.'],
  ['a qué se dedican', 'Nos dedicamos a revolucionar la educación con: 1) Diagnóstico VAK, 2) Programas STEM/STEAM, 3) Acompañamiento académico, 4) Bienestar emocional, 5) Consultoría educativa B2B.'],
  
  // Servicios
  ['servicios', 'Ofrecemos: 🎯 Diagnóstico VAK (gratuito), 🚀 Programas STEM (robótica, programación), 📚 Tutoría personalizada, 💙 Apoyo emocional, 🏢 Consultoría para instituciones. ¿Cuál te interesa?'],
  ['qué ofrecen', 'Ofrecemos soluciones educativas integrales: desde diagnóstico de aprendizaje hasta programas de tecnología avanzada y bienestar emocional. Todo personalizado.'],
  ['cursos', 'Tenemos cursos de: Robótica educativa, Programación para niños, Matemáticas VAK, Ciencias STEAM, Inglés conversacional, y más. ¿Qué área te interesa?'],
  ['clases', 'Nuestras clases son 100% personalizadas con metodología VAK. Tenemos modalidad presencial, online e híbrida. Primera clase es gratuita. ¿Te animas?'],
  
  // STEM/STEAM
  ['stem', 'STEM significa Ciencia, Tecnología, Ingeniería y Matemáticas. En EdutechLife lo convertimos en STEAM añadiendo Arte para creatividad. ¡Preparamos para los trabajos del futuro!'],
  ['steam', 'STEAM es nuestra evolución de STEM: Ciencia, Tecnología, Ingeniería, Arte y Matemáticas. Desarrollamos pensamiento crítico + creatividad. ¡Los niños aman nuestros talleres!'],
  ['robótica', '¡Nuestra robótica educativa es increíble! Los niños construyen y programan robots reales. Desarrollan lógica, resolución de problemas y trabajo en equipo. ¿Para qué edad buscas?'],
  ['programación', 'Enseñamos programación desde los 6 años. Python, Scratch, desarrollo web, apps móviles. Los niños crean sus propios videojuegos y aplicaciones. ¡Es el lenguaje del futuro!'],
  
  // Precios y planes
  ['precios', 'Tenemos planes para todos los presupuestos. Desde sesiones individuales hasta programas completos. La primera clase es gratuita para que conozcas nuestra metodología. ¿Te gustaría agendarla?'],
  ['cuánto cuesta', 'Los costos varían según el programa y frecuencia. Lo mejor es que pruebes la primera clase gratis y luego nuestro asesor te presenta el plan ideal para ti. ¿Te interesa?'],
  ['planes', 'Tenemos: Plan Básico (tutoría), Plan Premium (VAK + STEM), Plan Elite (programa completo). Todos incluyen bienestar emocional. ¿Cuál te gustaría conocer?'],
  
  // Inscripción y contacto
  ['inscribirme', '¡Excelente decisión! Para inscribirte necesito: 1) Tu nombre, 2) Edad del estudiante, 3) WhatsApp para contacto. ¿Me los proporcionas?'],
  ['cómo me inscribo', 'Es muy fácil: 1) Agendamos clase gratis, 2) Conoces nuestra metodología, 3) Elegimos el plan ideal, 4) ¡Comienzas a aprender! ¿Comenzamos?'],
  ['contacto', 'Puedes contactarnos al WhatsApp: +52 55 1234 5678 o visitar nuestra sede. También puedes dejarme tus datos y un asesor te contacta en menos de 24h.'],
  ['whatsapp', 'Nuestro WhatsApp es +52 55 1234 5678. Atendemos de lunes a sábado de 8am a 8pm. ¡Escríbenos y te ayudamos al instante!'],
  ['teléfono', 'Puedes llamarnos al +52 55 1234 5678. Nuestro horario es de lunes a sábado de 8am a 8pm. ¡Estamos para servirte!'],
  
  // Ubicación
  ['ubicación', 'Tenemos sedes en las principales ciudades. También ofrecemos modalidad online para todo el mundo. ¿Prefieres presencial u online?'],
  ['dónde están', 'Estamos en múltiples ubicaciones. Lo mejor es que nos contactes por WhatsApp +52 55 1234 5678 y te damos la sede más cercana a ti.'],
  ['dirección', 'Para darte la dirección exacta más cercana, necesito saber tu ciudad. También tenemos modalidad 100% online. ¿Cuál prefieres?'],
  
  // Edades
  ['edades', 'Trabajamos con: 👶 Niños (5-11 años), 🧒 Adolescentes (12-17 años), 🧑 Adultos (18+). También tenemos programas para padres y docentes.'],
  ['niños', '¡Perfecto! Para niños tenemos programas especiales: Robótica junior, Programación con juegos, Matemáticas divertidas, Desarrollo emocional. ¿Qué edad tiene el niño?'],
  ['adolescentes', 'Para adolescentes ofrecemos: Programación real, Robótica avanzada, Preparación académica, Orientación vocacional, Inteligencia emocional. ¿Qué necesita específicamente?'],
  
  // Modalidades
  ['presencial', '¡Presencial es excelente! Tenemos aulas equipadas con tecnología de punta. El ambiente es motivador y colaborativo. ¿En qué ciudad estás?'],
  ['online', 'Modalidad online 100% efectiva. Usamos plataformas interactivas, realidad aumentada y seguimiento personalizado. ¡Aprendes desde cualquier lugar!'],
  ['híbrido', 'Híbrido es lo mejor de ambos mundos: algunas sesiones presenciales y otras online. Flexibilidad total manteniendo el contacto humano.'],
  
  // Primera clase
  ['primera clase gratis', '¡Así es! La primera clase es completamente gratuita y sin compromiso. Conoces al tutor, experimentas la metodología VAK y ves si te gusta. ¿La agendamos?'],
  ['clase gratis', 'Exacto, primera clase gratuita. Sin costo, sin compromiso. Es nuestra manera de que experimentes la transformación educativa EdutechLife. ¿Qué día te viene bien?'],
  ['prueba gratuita', 'Ofrecemos clase de prueba gratuita. Dura 60 minutos, conoces la metodología, resuelves dudas y decides si continuas. ¿Te animas a probar?'],
  
  // Agradecimientos
  ['gracias', '¡De nada! 😊 Es un placer ayudarte. ¿Hay algo más sobre EdutechLife que te gustaría saber?'],
  ['muchas gracias', '¡El gusto es mío! 💙 Recuerda que estoy aquí para lo que necesites sobre educación innovadora. ¿En qué más puedo colaborarte?'],
  ['excelente', '¡Me alegra mucho! ✨ Si necesitas más información o quieres agendar tu clase gratis, aquí estoy. ¿Qué más te gustaría saber?'],
  
  // Despedidas
  ['adiós', '¡Hasta luego! Que tengas un excelente día. Recuerda que aquí estaré cuando necesites información sobre EdutechLife. ¡Éxito!'],
  ['hasta luego', '¡Nos vemos! 👋 Cualquier duda sobre educación innovadora, aquí estoy. ¡Que te vaya súper bien!'],
  ['chao', '¡Chao! 😊 Vuelve cuando quieras. EdutechLife está para transformar tu aprendizaje. ¡Hasta pronto!'],
  
  // Preguntas frecuentes adicionales
  ['tutores', 'Nuestros tutores son profesionales certificados con experiencia en pedagogía VAK. Pasamos por 4 filtros de selección. ¡Son los mejores!'],
  ['certificados', 'Sí, al finalizar nuestros programas entregamos certificados con validez. También preparamos para certificaciones internacionales.'],
  ['resultados', 'El 95% de nuestros estudiantes mejoran sus calificaciones. El 87% aumenta su confianza académica. Tenemos casos de éxito documentados.'],
  ['tiempo', 'Los programas duran desde 1 mes (intensivo) hasta 1 año (completo). Adaptamos a tus objetivos y disponibilidad. ¿Qué meta tienes?'],
  ['horarios', 'Tenemos horarios flexibles: mañana, tarde y noche. También fines de semana. Adaptamos a tu disponibilidad. ¿Qué horario prefieres?'],
]);

// ==================== NIVEL 2: CACHE EN MEMORIA LRU ====================

class LRUCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Mover al final (reciente)
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
    }
    
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.has(key)) {
      // Actualizar y mover al final
      this.cache.set(key, value);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
        this.accessOrder.push(key);
      }
    } else {
      // Nuevo elemento
      if (this.cache.size >= this.maxSize) {
        // Eliminar el menos usado
        const oldestKey = this.accessOrder.shift();
        this.cache.delete(oldestKey);
      }
      this.cache.set(key, value);
      this.accessOrder.push(key);
    }
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  get size() {
    return this.cache.size;
  }

  get hitRate() {
    // Para métricas
    return this.cache.size / this.maxSize;
  }
}

// Instancia global del cache
export const memoryCache = new LRUCache(1000);

// ==================== FUNCIONES DE BÚSQUEDA INTELIGENTE ====================

export function findInstantResponse(userMessage) {
  const lowerMsg = userMessage.toLowerCase().trim();
  
  // Búsqueda exacta primero
  if (INSTANT_RESPONSES.has(lowerMsg)) {
    return INSTANT_RESPONSES.get(lowerMsg);
  }
  
  // Búsqueda por palabras clave
  for (const [key, response] of INSTANT_RESPONSES) {
    if (lowerMsg.includes(key) && key.length > 3) {
      return response;
    }
  }
  
  // Búsqueda en cache de memoria
  const cached = memoryCache.get(lowerMsg);
  if (cached) {
    return cached;
  }
  
  return null;
}

export function addToCache(userMessage, response) {
  const lowerMsg = userMessage.toLowerCase().trim();
  memoryCache.set(lowerMsg, response);
}

export function getCacheStats() {
  return {
    instantResponses: INSTANT_RESPONSES.size,
    memoryCacheSize: memoryCache.size,
    memoryCacheHitRate: memoryCache.hitRate,
    totalCacheSize: INSTANT_RESPONSES.size + memoryCache.size
  };
}

// ==================== SISTEMA DE SUGERENCIAS ====================

export const SUGGESTED_QUESTIONS = [
  '¿Qué es la metodología VAK?',
  '¿Tienen clases de robótica?',
  '¿Cuánto cuesta la primera clase?',
  '¿Trabajan con adolescentes?',
  '¿Qué programas STEM ofrecen?',
  '¿Cómo me inscribo?',
  '¿Tienen modalidad online?',
  '¿Qué es EdutechLife?'
];

// ==================== INICIALIZACIÓN DEL CACHE ====================

// Pre-cargar cache con respuestas comunes
export function initializeCache() {
  console.log('🔄 Inicializando cache de Nico...');
  console.log(`📊 Respuestas instantáneas: ${INSTANT_RESPONSES.size}`);
  console.log(`💾 Cache LRU tamaño máximo: ${memoryCache.maxSize}`);
  
  // Agregar algunas respuestas al cache de memoria para empezar
  const initialCache = [
    ['hola nico', '¡Hola! Me encanta que me llames por mi nombre. 😊 Soy Nico, tu asistente de EdutechLife. ¿En qué puedo ayudarte?'],
    ['nico ayuda', '¡Claro que sí! Estoy aquí para ayudarte con todo sobre EdutechLife. ¿Qué necesitas saber?'],
    ['edutechlife vak', '¡Perfecta combinación! EdutechLife es la plataforma y VAK es nuestra metodología estrella. Juntos transformamos el aprendizaje.'],
  ];
  
  initialCache.forEach(([key, value]) => {
    memoryCache.set(key, value);
  });
  
  console.log('✅ Cache de Nico inicializado correctamente');
  return getCacheStats();
}