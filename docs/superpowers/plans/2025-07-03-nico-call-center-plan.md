# Nico Call Center Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Nico from basic FAQ chatbot into hybrid call-center agent with local knowledge engine, streaming, proactive sales mode, and cross-platform TTS

**Architecture:** Three new/expanded layers: (1) `nicoKnowledge.js` — local intent-response engine for instant answers, (2) `nicoConversation.js` — conversation phase manager that activates proactive sales mode after 5 messages, (3) expanded `nico-training-data.json` with full services/prices/sales data. All integrated into `NicoModern.jsx` with streaming migration and TTS callback bugfixes.

**Tech Stack:** React 18, Google TTS backend, DeepSeek API (streaming), native SpeechSynthesis fallback, `AbortController`

---

### Task 1: Create nicoKnowledge.js (Knowledge Engine)

**Files:**
- Create: `src/components/Nico/nicoKnowledge.js`

- [ ] **Step 1: Write the file with intent structure and matching engine**

```js
const KNOWLEDGE = {
  intents: [
    {
      id: 'precios_vak',
      patterns: [
        'cuánto cuesta vak',
        'precio vak',
        'valor vak',
        'costo vak',
        'cuánto vale vak',
        'precios vak',
        'cuánto es vak',
        'precio del diagnóstico vak',
      ],
      category: 'precios',
      response: 'El diagnóstico VAK cuesta 0, es completamente gratuito. Incluye una evaluación completa de tu estilo de aprendizaje con resultados detallados y recomendaciones personalizadas. Los planes de seguimiento tienen costo.',
    },
    {
      id: 'precios_stem',
      patterns: [
        'cuánto cuesta stem',
        'precio stem',
        'valor stem',
        'costo stem',
        'cuánto vale stem',
        'precios stem',
        'cuánto es stem',
        'precio de robótica',
      ],
      category: 'precios',
      response: 'Los planes STEM varían según la modalidad y duración. Tenemos planes desde $X mensuales. La primera clase es gratuita para que puedas probar sin compromiso.',
    },
    {
      id: 'precios_tutorias',
      patterns: [
        'cuánto cuesta una tutoría',
        'precio tutoría',
        'valor tutorías',
        'costo tutorías',
        'precio de tutorías',
        'cuánto vale una tutoría',
      ],
      category: 'precios',
      response: 'Las tutorías personalizadas tienen un costo de $X por sesión. También ofrecemos paquetes mensuales con descuento. La primera tutoría es gratuita.',
    },
    {
      id: 'precios_bienestar',
      patterns: [
        'cuánto cuesta bienestar',
        'precio bienestar',
        'precio psicología',
        'costo bienestar',
        'cuánto vale bienestar',
        'precios bienestar',
      ],
      category: 'precios',
      response: 'Nuestro programa de bienestar tiene planes desde $X mensuales. Incluye sesiones con profesionales en psicología educativa.',
    },
    {
      id: 'precios_ingles',
      patterns: [
        'cuánto cuesta inglés',
        'precio inglés',
        'valor inglés',
        'costo inglés',
        'cuánto vale inglés',
        'precios inglés',
        'precio del curso de inglés',
      ],
      category: 'precios',
      response: 'Los cursos de inglés tienen planes desde $X mensuales. Contamos con niveles desde básico hasta avanzado, con profesores nativos.',
    },
    {
      id: 'primera_clase_gratis',
      patterns: [
        'primera clase gratis',
        'primera clase gratuita',
        'clase gratis',
        'clase gratuita',
        'prueba gratis',
        'sin costo',
        'gratuito',
      ],
      category: 'promociones',
      response: 'Sí, ofrecemos primera clase completamente gratuita en todos nuestros servicios para que puedas conocer la metodología sin compromiso.',
    },
    {
      id: 'cancelacion',
      patterns: [
        'cancelar',
        'cancelación',
        'cancelacion',
        'permanencia',
        'sin permanencia',
        'me puedo salir',
        'darse de baja',
        'terminar contrato',
      ],
      category: 'politicas',
      response: 'Puedes cancelar en cualquier momento, sin permanencia ni multas. Solo necesitas avisarnos con una semana de anticipación.',
    },
    {
      id: 'horarios',
      patterns: [
        'horarios',
        'horario',
        'horario de atención',
        'cuándo tienen clases',
        'en qué horario',
        'a qué hora',
        'días de clase',
        'fines de semana',
      ],
      category: 'generales',
      response: 'Tenemos horarios flexibles: mañanas de 8am a 12pm, tardes de 2pm a 6pm, y evenings. También ofrecemos clases los sábados. Modalidad presencial, online o híbrida.',
    },
    {
      id: 'modalidades',
      patterns: [
        'modalidad',
        'presencial',
        'online',
        'virtual',
        'hibrido',
        'híbrido',
        'a distancia',
        'en línea',
        'en linea',
      ],
      category: 'generales',
      response: 'Ofrecemos tres modalidades: presencial en nuestras instalaciones, online en vivo con profesor, e híbrida (combinación de ambas). Tú eliges la que mejor se adapte a tu estilo.',
    },
    {
      id: 'edades_vak',
      patterns: [
        'para qué edad es vak',
        'edad vak',
        'vak para niños',
        'vak para adultos',
        'quién puede hacer vak',
        'requisitos vak',
      ],
      category: 'servicios',
      response: 'El diagnóstico VAK es para todas las edades. Tenemos versiones adaptadas para niños desde 6 años, adolescentes y adultos. Cada evaluación se ajusta al rango de edad.',
    },
    {
      id: 'edades_stem',
      patterns: [
        'para qué edad es stem',
        'edad stem',
        'stem para niños',
        'stem para adolescentes',
        'robótica para niños',
      ],
      category: 'servicios',
      response: 'STEM está disponible para niños desde 4 años hasta 17 años. Tenemos programas por rangos: 4-6 años (iniciación), 7-10 años (exploración), 11-14 años (profundización), 15-17 años (avanzado).',
    },
    {
      id: 'inscripcion',
      patterns: [
        'cómo me inscribo',
        'inscribirme',
        'registrarme',
        'proceso de inscripción',
        'cómo me registro',
        'qué necesito para inscribirme',
        'requisitos de inscripción',
      ],
      category: 'inscripcion',
      response: 'El proceso es simple: 1) Toma el diagnóstico VAK gratuito para conocer tu estilo de aprendizaje, 2) Te asesoramos sobre el programa ideal para ti, 3) Te inscribes y comienzas con tu primera clase gratuita. ¿Quieres que te guíe en el proceso?',
    },
    {
      id: 'metodos_pago',
      patterns: [
        'métodos de pago',
        'formas de pago',
        'cómo pago',
        'medios de pago',
        'pago con tarjeta',
        'pago en efectivo',
        'transferencia',
        'pago mensual',
        'planes de pago',
      ],
      category: 'pagos',
      response: 'Aceptamos varios métodos de pago: tarjetas de crédito/débito, transferencia bancaria, efectivo, y pagos a través de nuestra plataforma. También ofrecemos planes mensuales y descuentos por pago anticipado.',
    },
    {
      id: 'contacto',
      patterns: [
        'contacto',
        'teléfono',
        'whatsapp',
        'correo',
        'email',
        'dirección',
        'dónde están',
        'ubicación',
        'cómo contactarlos',
      ],
      category: 'contacto',
      response: 'Puedes contactarnos por WhatsApp al +57 XXX XXX XXXX, por email a info@edutechlife.com, o visitarnos en nuestra dirección. También puedes dejar tus datos y te contactamos.',
    },
    {
      id: 'que_es_vak',
      patterns: [
        'qué es vak',
        'que es vak',
        'qué es el diagnóstico vak',
        'explicación vak',
        'para qué sirve vak',
        'en qué consiste vak',
        'beneficios vak',
      ],
      category: 'servicios',
      response: 'VAK es un diagnóstico de estilos de aprendizaje que identifica si eres Visual, Auditivo o Kinestésico. Con esta información, podemos personalizar tu experiencia educativa para que aprendas de la forma más efectiva.',
    },
    {
      id: 'que_es_stem',
      patterns: [
        'qué es stem',
        'que es stem',
        'explicación stem',
        'qué es robótica educativa',
        'para qué sirve stem',
        'en qué consiste stem',
      ],
      category: 'servicios',
      response: 'STEM es un programa educativo que integra Ciencia, Tecnología, Ingeniería y Matemáticas. A través de robótica, programación y proyectos prácticos, los estudiantes desarrollan pensamiento crítico y habilidades tecnológicas.',
    },
    {
      id: 'que_es_bienestar',
      patterns: [
        'qué es bienestar',
        'que es bienestar',
        'programa de bienestar',
        'apoyo psicológico',
        'psicología educativa',
        'bienestar emocional',
      ],
      category: 'servicios',
      response: 'Nuestro programa de bienestar ofrece apoyo psicológico y emocional para estudiantes y familias. Trabajamos manejo de ansiedad, habilidades socioemocionales, y desarrollo personal con profesionales certificados.',
    },
    {
      id: 'que_son_tutorias',
      patterns: [
        'qué son las tutorías',
        'que son las tutorías',
        'tutorías personalizadas',
        'clases particulares',
        'apoyo escolar',
        'refuerzo académico',
      ],
      category: 'servicios',
      response: 'Las tutorías personalizadas son sesiones uno a uno con profesionales especializados. Ofrecemos apoyo en matemáticas, ciencias, inglés y más. Cada sesión se adapta a las necesidades específicas del estudiante.',
    },
    {
      id: 'objeccion_caro',
      patterns: [
        'es muy caro',
        'muy costoso',
        'no tengo presupuesto',
        'está muy caro',
        'no me alcanza',
        'caro',
        'costoso',
      ],
      category: 'objeciones',
      response: 'Entiendo que el presupuesto es importante. Tenemos planes flexibles y la primera clase es gratuita para que puedas probar antes de decidir. También ofrecemos descuentos por pago anticipado y planes familiares. ¿Te gustaría conocer las opciones?',
    },
    {
      id: 'objeccion_tiempo',
      patterns: [
        'no tengo tiempo',
        'muy ocupado',
        'no me da tiempo',
        'sin tiempo',
        'horario complicado',
        'no tengo horario',
      ],
      category: 'objeciones',
      response: 'Entendemos que los horarios son ajustados. Por eso ofrecemos modalidad online y horarios flexibles incluyendo fines de semana. Las sesiones son de 45-60 minutos y tú eliges la frecuencia. ¿Qué horario te funcionaría mejor?',
    },
    {
      id: 'objeccion_no_estoy_seguro',
      patterns: [
        'no estoy seguro',
        'no estoy segura',
        'voy a pensarlo',
        'lo voy a pensar',
        'después te confirmo',
        'más adelante',
        'todavía no sé',
      ],
      category: 'objeciones',
      response: 'Por supuesto, tómate el tiempo que necesites. Mientras tanto, ¿te gustaría agendar una llamada informativa sin compromiso? Un especialista puede resolver todas tus dudas y ayudarte a decidir.',
    },
    {
      id: 'vak_resultado',
      patterns: [
        'resultados vak',
        'resultado vak',
        'mi estilo de aprendizaje',
        'soy visual',
        'soy auditivo',
        'soy kinestésico',
        'qué significa mi resultado',
      ],
      category: 'servicios',
      response: 'Tu resultado VAK identifica tu estilo de aprendizaje predominante. Si eres Visual, aprendes mejor con imágenes y diagramas. Auditivo, con explicaciones y música. Kinestésico, con movimiento y práctica. Usamos esta información para personalizar tu aprendizaje.',
    },
    {
      id: 'metodologia',
      patterns: [
        'metodología',
        'metodologia',
        'cómo enseñan',
        'método de enseñanza',
        'cómo son las clases',
        'sistema de aprendizaje',
      ],
      category: 'generales',
      response: 'Nuestra metodología combina diagnóstico personalizado (VAK), aprendizaje práctico (STEM), y acompañamiento emocional (Bienestar). Cada estudiante tiene un plan único basado en su estilo de aprendizaje, con clases interactivas y seguimiento continuo.',
    },
    {
      id: 'garantia',
      patterns: [
        'garantía',
        'garantia',
        'satisfacción garantizada',
        'qué pasa si no me gusta',
        'devolución',
        'reembolso',
      ],
      category: 'politicas',
      response: 'Ofrecemos primera clase gratuita para que pruebes sin riesgo. Además, si no estás satisfecho, puedes cancelar en cualquier momento sin penalización. Tu satisfacción es nuestra prioridad.',
    },
    {
      id: 'diferencia',
      patterns: [
        'por qué elegirlos',
        'diferencia',
        'qué los hace diferentes',
        'por qué edutechlife',
        'ventajas',
        'beneficios de elegirlos',
        'qué ofrecen que otros no',
      ],
      category: 'ventas',
      response: 'Nos diferenciamos por nuestro enfoque personalizado: usamos el diagnóstico VAK para adaptar cada clase a tu estilo de aprendizaje, combinamos tecnología STEM con apoyo emocional, y ofrecemos modalidades flexibles (presencial, online, híbrido). Además, primera clase gratuita y cancelación sin permanencia.',
    },
    {
      id: 'duracion_curso',
      patterns: [
        'cuánto dura el curso',
        'duración',
        'cuánto tiempo',
        'cuántas clases',
        'cuánto dura',
        'duración del programa',
      ],
      category: 'generales',
      response: 'La duración depende del programa y la frecuencia que elijas. Generalmente, los cursos son trimestrales o semestrales, con sesiones semanales de 45-60 minutos. Tú decides el ritmo que mejor se adapte a tu agenda.',
    },
    {
      id: 'profesores',
      patterns: [
        'profesores',
        'quiénes son los profesores',
        'instructores',
        'docentes',
        'certificación profesores',
        'están capacitados',
        'experiencia profesores',
      ],
      category: 'generales',
      response: 'Todos nuestros profesionales son certificados y con experiencia en sus áreas: docentes especializados en educación STEM, psicólogos educativos para bienestar, y tutores con experiencia en refuerzo académico. Todos reciben capacitación continua.',
    },
    {
      id: 'grupales_vs_individuales',
      patterns: [
        'clases grupales',
        'clases individuales',
        'grupales o individuales',
        'individual o grupal',
        'sesiones grupales',
        'clases personalizadas',
      ],
      category: 'servicios',
      response: 'Ofrecemos ambas modalidades. Las clases individuales son uno a uno con el profesor, ideal para atención personalizada. Las grupales (máximo 6 estudiantes) fomentan la colaboración y son más económicas. Tú eliges.',
    },
    {
      id: 'certificacion',
      patterns: [
        'certificación',
        'certificado',
        'diploma',
        'constancia',
        'recibo certificado',
      ],
      category: 'generales',
      response: 'Sí, al completar cada nivel o programa, entregamos una certificación oficial que acredita los conocimientos adquiridos. Es válida para hojas de vida y procesos académicos.',
    },
    {
      id: 'instalaciones',
      patterns: [
        'instalaciones',
        'dónde están ubicados',
        'dirección',
        'sede',
        'lugar',
        'cómo llegar',
      ],
      category: 'contacto',
      response: 'Nuestras instalaciones están ubicadas en [dirección]. Contamos con aulas equipadas con tecnología, laboratorio STEM, y espacios cómodos para aprendizaje. También ofrecemos clases online si prefieres desde casa.',
    },
  ],

  categories: {
    precios: { proactive: true, priority: 1, label: 'precios' },
    promociones: { proactive: true, priority: 2, label: 'promociones' },
    servicios: { proactive: true, priority: 3, label: 'servicios' },
    inscripcion: { proactive: true, priority: 4, label: 'inscripción' },
    ventas: { proactive: true, priority: 5, label: 'ventas' },
    objeciones: { proactive: true, priority: 6, label: 'objeciones' },
    pagos: { proactive: true, priority: 7, label: 'pagos' },
    politicas: { proactive: false, priority: 8, label: 'políticas' },
    generales: { proactive: false, priority: 9, label: 'generales' },
    contacto: { proactive: false, priority: 10, label: 'contacto' },
  },
}

const normalize = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchIntent(text) {
  if (!text) return null
  const normalized = normalize(text)

  for (const intent of KNOWLEDGE.intents) {
    for (const pattern of intent.patterns) {
      const normalizedPattern = normalize(pattern)
      if (normalized.includes(normalizedPattern)) {
        return {
          id: intent.id,
          response: intent.response,
          category: intent.category,
        }
      }
    }
  }

  return null
}

export function getProactiveMessage(phase, detectedTopics, userName) {
  if (phase !== 'proactive') return null

  const topicsHandled = new Set(detectedTopics || [])
  const categoriesByPriority = Object.entries(KNOWLEDGE.categories)
    .filter(([_, config]) => config.proactive)
    .sort((a, b) => a[1].priority - b[1].priority)

  for (const [cat, config] of categoriesByPriority) {
    if (!topicsHandled.has(config.label)) {
      const nameGreeting = userName && userName !== 'amigo' ? ` ${userName},` : ''
      return `${nameGreeting} ¿te gustaría conocer más sobre nuestros ${config.label}? Podemos encontrar el plan ideal para ti.`
    }
  }

  // If all topics covered, ask for action
  const nameGreeting = userName && userName !== 'amigo' ? ` ${userName},` : ''
  return `${nameGreeting} ¿qué te parece si agendamos una llamada gratuita con un especialista? Te puede ayudar a elegir el mejor programa.`
}

export function getKnowledgeStats() {
  return {
    totalIntents: KNOWLEDGE.intents.length,
    categories: Object.keys(KNOWLEDGE.categories).length,
  }
}
```

- [ ] **Step 2: Verify the file**

Run: `node -e "require('./src/components/Nico/nicoKnowledge.js')" 2>&1 || true`

### Task 2: Create nicoConversation.js (Phase Manager)

**Files:**
- Create: `src/components/Nico/nicoConversation.js`

- [ ] **Step 1: Write the file**

```js
export const PHASE_REACTIVE = 'reactive'
export const PHASE_PROACTIVE = 'proactive'
export const PROACTIVE_THRESHOLD = 5
export const PROACTIVE_INTERVAL = 3

export function getConversationPhase(messageCount) {
  return messageCount < PROACTIVE_THRESHOLD ? PHASE_REACTIVE : PHASE_PROACTIVE
}

export function shouldInsertProactiveMessage(phase, messageCount, lastProactiveIndex) {
  if (phase !== PHASE_PROACTIVE) return false
  if (lastProactiveIndex === null || lastProactiveIndex === undefined) return false
  return (messageCount - lastProactiveIndex) >= PROACTIVE_INTERVAL
}

export function getProactiveMessageByContext(phase, detectedTopics, userName) {
  if (phase !== PHASE_PROACTIVE) return null

  const name = userName && userName !== 'amigo' ? userName : null

  // Build contextual proactive messages based on what's been discussed
  const topics = detectedTopics || []
  const hasNotDiscussedPricing = !topics.some(t => t.includes('precio') || t.includes('plan'))
  const hasNotDiscussedServices = topics.length === 0

  if (hasNotDiscussedServices) {
    return name
      ? `${name}, ¿te gustaría conocer los servicios educativos que ofrecemos? Tenemos opciones para todas las edades.`
      : '¿Te gustaría conocer los servicios educativos que ofrecemos? Tenemos opciones para todas las edades.'
  }

  if (hasNotDiscussedPricing && topics.length > 0) {
    const interest = topics[topics.length - 1]
    return name
      ? `${name}, ¿sabías que tenemos primera clase gratuita en ${interest}? Puedes probar sin compromiso.`
      : `¿Sabías que tenemos primera clase gratuita en ${interest}? Puedes probar sin compromiso.`
  }

  return name
    ? `${name}, ¿qué te parece si agendamos una llamada con un especialista? Te ayudará a elegir el mejor plan.`
    : '¿Qué te parece si agendamos una llamada con un especialista? Te ayudará a elegir el mejor plan.'
}
```

- [ ] **Step 2: Verify the file**

Run: `node -e "require('./src/components/Nico/nicoConversation.js')" 2>&1 || true`

### Task 3: Expand nico-training-data.json

**Files:**
- Modify: `src/data/nico-training-data.json`

- [ ] **Step 1: Read the current training data**

- [ ] **Step 2: Expand with full service details, sales scripts, and FAQs**

```json
{
  "company": {
    "name": "EdutechLife",
    "description": "Centro de innovación educativa que potencia el talento de niños, jóvenes y adultos a través de programas personalizados de aprendizaje. Combinamos diagnóstico VAK, educación STEM, tutorías especializadas y bienestar emocional.",
    "mission": "Transformar la educación a través de la personalización, la tecnología y el acompañamiento emocional.",
    "vision": "Ser líderes en educación personalizada en Latinoamérica para 2030.",
    "metrics": {
      "students": 5000,
      "successRate": "95%",
      "yearsExperience": 8,
      "satisfactionRate": "4.8/5"
    }
  },
  "services": {
    "vak": {
      "name": "Diagnóstico VAK",
      "description": "Evaluación completa de estilos de aprendizaje (Visual, Auditivo, Kinestésico). Incluye resultados detallados y recomendaciones personalizadas para optimizar tu forma de aprender.",
      "benefits": ["Aprende según tu estilo natural", "Mejora tu rendimiento académico", "Descubre tus fortalezas de aprendizaje"],
      "price": "Gratuito",
      "duration": "30-45 minutos",
      "audience": "Niños desde 6 años, adolescentes y adultos"
    },
    "stem": {
      "name": "Educación STEM",
      "description": "Programa de Ciencia, Tecnología, Ingeniería y Matemáticas a través de robótica educativa, programación, y proyectos prácticos.",
      "benefits": ["Desarrolla pensamiento crítico", "Prepara para carreras del futuro", "Aprendizaje práctico y divertido"],
      "price": "Desde $X/mes",
      "duration": "Sesiones semanales de 60 min",
      "audience": "Niños desde 4 hasta 17 años",
      "levels": [
        {"name": "Iniciación", "age": "4-6 años", "description": "Introducción a la robótica con kits educativos"},
        {"name": "Exploración", "age": "7-10 años", "description": "Programación básica con Scratch y Lego"},
        {"name": "Profundización", "age": "11-14 años", "description": "Python, Arduino y proyectos electrónicos"},
        {"name": "Avanzado", "age": "15-17 años", "description": "Desarrollo de apps e inteligencia artificial"}
      ]
    },
    "tutorias": {
      "name": "Tutorías Personalizadas",
      "description": "Sesiones uno a uno con profesionales especializados en matemáticas, ciencias, inglés y más.",
      "benefits": ["Atención totalmente personalizada", "Refuerzo en áreas específicas", "Flexibilidad de horarios"],
      "price": "Desde $X/sesión",
      "duration": "45-60 min por sesión",
      "audience": "Todas las edades"
    },
    "bienestar": {
      "name": "Bienestar Emocional",
      "description": "Programa de apoyo psicológico y emocional para estudiantes y familias. Manejo de ansiedad, habilidades socioemocionales y desarrollo personal.",
      "benefits": ["Mejora la salud emocional", "Desarrolla resiliencia", "Apoyo profesional certificado"],
      "price": "Desde $X/mes",
      "duration": "Sesiones semanales de 50 min",
      "audience": "Estudiantes y familias"
    },
    "ingles": {
      "name": "Curso de Inglés",
      "description": "Clases de inglés con profesores nativos y metodología inmersiva. Niveles desde básico hasta avanzado.",
      "benefits": ["Profesores nativos", "Metodología inmersiva", "Certificación internacional"],
      "price": "Desde $X/mes",
      "duration": "Sesiones semanales de 60 min",
      "audience": "Todas las edades"
    }
  },
  "pricing": {
    "firstClassFree": true,
    "cancellationPolicy": "Cancelación en cualquier momento sin permanencia. Aviso con una semana de anticipación.",
    "paymentMethods": ["Tarjeta crédito", "Tarjeta débito", "Transferencia bancaria", "Efectivo", "Pago en plataforma"],
    "discounts": ["Pago anticipado (5% descuento)", "Plan familiar (10% descuento)", "Referidos (1 mes gratis)"],
    "plans": [
      {"name": "Plan Básico", "price": "Desde $X/mes", "features": ["2 sesiones por semana", "Material incluido", "Acceso a plataforma"]},
      {"name": "Plan Premium", "price": "Desde $X/mes", "features": ["4 sesiones por semana", "Material incluido", "Acceso a plataforma", "Tutor personal", "Informes de progreso"]},
      {"name": "Plan Integral", "price": "Desde $X/mes", "features": ["Sesiones ilimitadas", "Material incluido", "Acceso a plataforma", "Tutor personal", "Informes de progreso", "Apoyo emocional incluido"]}
    ]
  },
  "modalities": {
    "presencial": "Clases en nuestras instalaciones con todos los equipos y materiales incluidos",
    "online": "Clases en vivo con profesor a través de nuestra plataforma virtual",
    "hibrido": "Combina clases presenciales y online según tu conveniencia"
  },
  "schedule": {
    "weekdays": "Lunes a Viernes",
    "morning": "8:00 AM - 12:00 PM (GMT-5)",
    "afternoon": "2:00 PM - 6:00 PM (GMT-5)",
    "evening": "6:00 PM - 8:00 PM (GMT-5)",
    "saturday": "9:00 AM - 1:00 PM (GMT-5)"
  },
  "age_groups": [
    {"label": "Pequeños Exploradores", "range": "4-6 años"},
    {"label": "Jóvenes Talentos", "range": "7-10 años"},
    {"label": "Mentes Brillantes", "range": "11-14 años"},
    {"label": "Futuros Líderes", "range": "15-17 años"},
    {"label": "Adultos", "range": "18+ años"}
  ],
  "contact": {
    "whatsapp": "+57 XXX XXX XXXX",
    "email": "info@edutechlife.com",
    "phone": "+57 XXX XXX XXXX",
    "address": "[Dirección de las instalaciones]",
    "website": "https://edutechlife.com",
    "socialMedia": {
      "instagram": "@edutechlife",
      "facebook": "/edutechlife",
      "tiktok": "@edutechlife"
    }
  },
  "faqs": [
    {"q": "¿Cómo sé qué servicio necesito?", "a": "Recomendamos empezar con el diagnóstico VAK gratuito. Identifica tu estilo de aprendizaje y te orientamos sobre el mejor programa."},
    {"q": "¿Puedo cambiar de plan?", "a": "Sí, puedes cambiar de plan en cualquier momento. Solo avísanos con anticipación."},
    {"q": "¿Hay clases de prueba?", "a": "Sí, ofrecemos primera clase gratuita en todos nuestros servicios."},
    {"q": "¿Trabajan con colegios?", "a": "Sí, tenemos programas institucionales para colegios y empresas. Contáctanos para más información."},
    {"q": "¿Ofrecen becas?", "a": "Sí, contamos con un programa de becas por rendimiento académico y situación socioeconómica. Consulta por las convocatorias vigentes."}
  ],
  "sales_scripts": {
    "qualification": {
      "questions": [
        "¿Para quién estás buscando el programa?",
        "¿Qué edad tiene?",
        "¿Qué área le interesa más?",
        "¿Prefieres modalidad presencial u online?"
      ]
    },
    "objections": {
      "expensive": "Entendemos. Tenemos planes flexibles y primera clase gratis. Además, piensa que es una inversión en el futuro educativo.",
      "no_time": "Nuestras sesiones son flexibles. Tú eliges horario y frecuencia. También ofrecemos online para mayor comodidad.",
      "not_sure": "Te entiendo. ¿Qué te parece si agendamos una llamada informativa sin compromiso? Resolvemos todas tus dudas."
    },
    "closing": [
      "¿Te gustaría agendar tu primera clase gratuita?",
      "¿Quieres que te guíe en el proceso de inscripción?",
      "¿Te parece bien si un especialista te llama para darte más información?"
    ]
  },
  "troubleshooting": {
    "platform_access": "Si tienes problemas para acceder a la plataforma, verifica tu conexión a internet o intenta con otro navegador. Si el problema persiste, contacta a soporte.",
    "payment_issues": "Si tu pago no fue procesado, verifica los datos de tu tarjeta o intenta con otro método de pago. Puedes contactarnos por WhatsApp para asistencia.",
    "class_rescheduling": "Si necesitas reprogramar una clase, hazlo con al menos 24 horas de anticipación desde tu perfil en la plataforma o contactándonos directamente."
  }
}
```

- [ ] **Step 3: Update the PROMPT_NICO_SOPORTE at line 597 of NicoModern.jsx**

The prompt already includes training data references. No change needed to the prompt structure — the training data expansion automatically gives the AI more context when DeepSeek is called.

### Task 4: Fix All 11 TTS Call Arguments in NicoModern.jsx

**Files:**
- Modify: `src/components/Nico/NicoModern.jsx` (lines 737, 925, 1095, 1117, 1178-1182, 1189-1194, 1255-1260, 1416, 1503, 1511, 1600)

- [ ] **Step 1: Fix line 737 — greeting**

Old:
```js
speakTextConversational(greeting, 'nico_premium', null, setAudioPermissionError);
```

New:
```js
speakTextConversational(greeting, 'nico_premium', {}, undefined, setAudioPermissionError);
```

- [ ] **Step 2: Fix line 925 — quick response voice**

Old:
```js
speakTextConversational(textToSpeak, 'nico_premium', null, setAudioPermissionError);
```

New:
```js
speakTextConversational(textToSpeak, 'nico_premium', {}, undefined, setAudioPermissionError);
```

- [ ] **Step 3: Fix line 1095 — main response voice**

Old:
```js
speakTextConversational(textToSpeak, 'nico_premium', null, setAudioPermissionError);
```

New:
```js
speakTextConversational(textToSpeak, 'nico_premium', {}, undefined, setAudioPermissionError);
```

- [ ] **Step 4: Fix line 1117 — error response voice**

Old:
```js
speakTextConversational(cleanErrorMessage, 'nico_premium', null, setAudioPermissionError);
```

New:
```js
speakTextConversational(cleanErrorMessage, 'nico_premium', {}, undefined, setAudioPermissionError);
```

- [ ] **Step 5: Fix lines 1178-1182 — appointment question (CRITICAL: callback in wrong arg)**

Old:
```js
speakTextConversational(
  removeEmojis(appointmentQuestion.content),
  'nico_premium',
  () => console.log('✅ Pregunta de agendamiento hablada')
);
```

New:
```js
speakTextConversational(
  removeEmojis(appointmentQuestion.content),
  'nico_premium',
  {},
  () => console.log('✅ Pregunta de agendamiento hablada'),
  undefined
);
```

- [ ] **Step 6: Fix lines 1189-1194 — appointment confirmation**

Old:
```js
speakTextConversational(
  removeEmojis(successMessage.content),
  'nico_premium',
  null,
  setAudioPermissionError
);
```

New:
```js
speakTextConversational(
  removeEmojis(successMessage.content),
  'nico_premium',
  {},
  undefined,
  setAudioPermissionError
);
```

- [ ] **Step 7: Fix lines 1255-1260 — schedule confirmation**

Old:
```js
speakTextConversational(
  removeEmojis(successMessage.content),
  'nico_premium',
  null,
  setAudioPermissionError
);
```

New:
```js
speakTextConversational(
  removeEmojis(successMessage.content),
  'nico_premium',
  {},
  undefined,
  setAudioPermissionError
);
```

- [ ] **Step 8: Fix line 1416 — handleSpeakResponse (CRITICAL: setIsSpeaking in wrong arg)**

Old:
```js
speakTextConversational(textToSpeak, 'nico_premium', () => {
  setIsSpeaking(false);
}, setAudioPermissionError);
```

New:
```js
speakTextConversational(textToSpeak, 'nico_premium', {}, () => {
  setIsSpeaking(false);
}, setAudioPermissionError);
```

- [ ] **Step 9: Fix line 1503 — welcome message**

Old:
```js
speakTextConversational(textToSpeak, 'nico_premium', null, setAudioPermissionError);
```

New:
```js
speakTextConversational(textToSpeak, 'nico_premium', {}, undefined, setAudioPermissionError);
```

- [ ] **Step 10: Fix line 1511 — reconnection greeting**

Old:
```js
speakTextConversational(textToSpeak, 'nico_premium', null, setAudioPermissionError);
```

New:
```js
speakTextConversational(textToSpeak, 'nico_premium', {}, undefined, setAudioPermissionError);
```

- [ ] **Step 11: Fix line 1600 — audio toggle confirmation**

Old:
```js
speakTextConversational(confirmation, 'nico_premium', null, setAudioPermissionError);
```

New:
```js
speakTextConversational(confirmation, 'nico_premium', {}, undefined, setAudioPermissionError);
```

### Task 5: Migrate to Streaming + Integrate Knowledge Engine

**Files:**
- Modify: `src/components/Nico/NicoModern.jsx`

- [ ] **Step 1: Update imports (line 7)**

Old:
```js
import { callDeepseek } from '../../utils/api';
```

New:
```js
import { callDeepseekStream } from '../../utils/api';
import { matchIntent } from './nicoKnowledge';
import { getConversationPhase, shouldInsertProactiveMessage, getProactiveMessageByContext } from './nicoConversation';
```

- [ ] **Step 2: Add state for proactive mode (after line 660, around userContext)**

```js
const [conversationPhase, setConversationPhase] = useState('reactive');
const [lastProactiveIndex, setLastProactiveIndex] = useState(0);
const [userMessageCount, setUserMessageCount] = useState(0);
```

- [ ] **Step 3: Replace the API call + response logic (lines 1000-1056)**

Old block (lines 1000-1056):
```js
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
        const userNameFromState = userContext?.userName;
        const contextInfo = userNameFromState ? `El usuario se llama ${userNameFromState}.` : '';
        const enhancedSystemPrompt = memoryContext 
          ? `${PROMPT_NICO_SOPORTE}\nContexto: ${memoryContext.substring(0, 200)} ${contextInfo}`
          : `${PROMPT_NICO_SOPORTE} ${contextInfo}`;
        
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
```

New block:
```js
    try {
      // 1. Try local knowledge engine first (instant)
      const localMatch = matchIntent(userMessage)
      if (localMatch) {
        const cleanResponse = removeEmojis(localMatch.response)
        const assistantMessageObj = {
          role: 'assistant',
          content: cleanResponse,
          timestamp: new Date().toISOString(),
          isLocalResponse: true
        }
        setMessages(prev => {
          const newMessages = [...prev, assistantMessageObj];
          return optimizeLongConversation(newMessages, 25);
        })
        processMessage('assistant', cleanResponse)

        if (audioEnabled) {
          speakTextConversational(cleanResponse, 'nico_premium', {}, undefined, setAudioPermissionError)
        }

        setUserMessageCount(prev => prev + 1)
        setUserContext(prev => ({
          ...prev,
          messagesSinceStart: prev.messagesSinceStart + 1
        }))

        // Evaluate proactive mode after local response
        const phase = getConversationPhase(userMessageCount + 1)
        setConversationPhase(phase)
        if (shouldInsertProactiveMessage(phase, userMessageCount + 1, lastProactiveIndex)) {
          setTimeout(() => {
            const proactiveMsg = getProactiveMessageByContext(phase, userContext.detectedTopics, userContext.userName)
            if (proactiveMsg) {
              const proactiveObj = {
                role: 'assistant',
                content: proactiveMsg,
                timestamp: new Date().toISOString(),
                isProactive: true
              }
              setMessages(prev => [...prev, proactiveObj])
              setLastProactiveIndex(userMessageCount + 1)
              if (audioEnabled) {
                speakTextConversational(proactiveMsg, 'nico_premium', {}, undefined, setAudioPermissionError)
              }
            }
          }, 1500)
        }

        setIsLoading(false)
        return
      }

      // 2. No local match — use cache or streaming
      const cacheKey = userMessage.toLowerCase().trim();
      const cached = responseCache.get(cacheKey);
      
      let fullResponse = '';
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        fullResponse = cached.response;
        
        const cleanResponse = removeEmojis(fullResponse)
        const assistantMessageObj = { 
          role: 'assistant', 
          content: cleanResponse,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => {
          const newMessages = [...prev, assistantMessageObj];
          return optimizeLongConversation(newMessages, 25);
        })
        processMessage('assistant', fullResponse)
        
        if (audioEnabled) {
          speakTextConversational(cleanResponse, 'nico_premium', {}, undefined, setAudioPermissionError)
        }
      } else {
        // Contexto para streaming
        const memoryContext = getContextualPrompt();
        const userNameFromState = userContext?.userName;
        const contextInfo = userNameFromState ? `El usuario se llama ${userNameFromState}.` : '';
        const enhancedSystemPrompt = memoryContext 
          ? `${PROMPT_NICO_SOPORTE}\nContexto: ${memoryContext.substring(0, 200)} ${contextInfo}`
          : `${PROMPT_NICO_SOPORTE} ${contextInfo}`;
        
        // Create placeholder message
        const placeholderObj = { 
          role: 'assistant', 
          content: '',
          timestamp: new Date().toISOString(),
          isStreaming: true
        }
        setMessages(prev => [...prev, placeholderObj])
        
        // Stream the response
        await callDeepseekStream(
          [{ role: 'user', content: userMessage }],
          {
            systemPrompt: enhancedSystemPrompt,
            maxTokens: 2000,
            temperature: 0.7,
          },
          (chunk) => {
            fullResponse += chunk
            // Update the last message in real-time
            setMessages(prev => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last && last.isStreaming) {
                const cleanChunk = removeEmojis(fullResponse)
                updated[updated.length - 1] = {
                  ...last,
                  content: cleanChunk,
                }
              }
              return updated
            })
          }
        )
        
        // Mark as complete
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last) {
            updated[updated.length - 1] = {
              ...last,
              isStreaming: false,
            }
          }
          return updated
        })
        
        // Cache
        responseCache.set(cacheKey, {
          response: fullResponse,
          timestamp: Date.now()
        })
        processMessage('assistant', fullResponse)
        
        // Speak after streaming completes
        if (audioEnabled && fullResponse) {
          const cleanText = removeEmojis(fullResponse)
          speakTextConversational(cleanText, 'nico_premium', {}, undefined, setAudioPermissionError)
        }
      }
```

- [ ] **Step 4: Add proactive phase evaluation after streaming response (before catch block)**

```js
      // Evaluate proactive mode after streaming
      setUserMessageCount(prev => prev + 1)
      const phase = getConversationPhase(userMessageCount + 1)
      setConversationPhase(phase)
      if (shouldInsertProactiveMessage(phase, userMessageCount + 1, lastProactiveIndex)) {
        setTimeout(() => {
          const proactiveMsg = getProactiveMessageByContext(phase, userContext.detectedTopics, userContext.userName)
          if (proactiveMsg) {
            const proactiveObj = {
              role: 'assistant',
              content: proactiveMsg,
              timestamp: new Date().toISOString(),
              isProactive: true
            }
            setMessages(prev => [...prev, proactiveObj])
            setLastProactiveIndex(userMessageCount + 1)
            if (audioEnabled) {
              speakTextConversational(proactiveMsg, 'nico_premium', {}, undefined, setAudioPermissionError)
            }
          }
        }, 1500)
      }
```

### Task 6: Remove simplifyResponse + Update Error Handling

**Files:**
- Modify: `src/components/Nico/NicoModern.jsx`

- [ ] **Step 1: Remove simplifyResponse function (lines 108-129)**

Delete the entire function block.

- [ ] **Step 2: Update error handling in catch block — remove reference to simplifyResponse**

The line `const simplifiedResponse = simplifyResponse(response);` is already gone from Task 5 streaming migration. Verify no other references to `simplifyResponse` exist.

- [ ] **Step 3: Add the import for nicoConversation at top of file**

In Task 5 Step 1 we already added the imports. Verify they're present.

### Task 7: Fix Safari AbortSignal Compatibility in speech.js

**Files:**
- Modify: `src/utils/speech.js`

- [ ] **Step 1: Replace AbortSignal.timeout with AbortController at line 444**

Old:
```js
signal: AbortSignal.timeout(20000),
```

New:
```js
signal: (() => { const c = new AbortController(); setTimeout(() => c.abort(), 20000); return c.signal; })(),
```

- [ ] **Step 2: Run tests**

### Task 8: Build Verification

- [ ] **Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run tests**

Run: `npm test` (or the project's test command)
Expected: All tests pass

- [ ] **Step 3: Lint check**

Run: `npm run lint` (if available)
Expected: No lint errors
