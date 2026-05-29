export const TOTAL_QUESTIONS = 8;
export const PASSING_SCORE = 80;
export const MAX_ATTEMPTS = 3;
export const ATTEMPT_COOLDOWN_MS = 12 * 60 * 60 * 1000;
export const SUGGESTED_TIME_MINUTES = 20;
export const SUGGESTED_TIME_SECONDS = SUGGESTED_TIME_MINUTES * 60;

export const MAX_SECURITY_WARNINGS = 3;
// These are now translated via t() in IALabQuizModal.jsx using ialab.quiz.security_warning_* keys.
// This constant is kept for backward compatibility but no longer used for display.
export const SECURITY_WARNING_MESSAGES = [
  "Advertencia: No cambies de ventana durante el examen",
  "Segunda advertencia: El sistema detectó que abriste otra ventana",
  "Última advertencia: Si vuelves a cambiar de ventana, el examen se cerrará automáticamente"
];
export const SECURITY_VIOLATION_PENALTY = 1;
export const SCREENSHOT_OVERLAY_DURATION = 5000;
export const SECURITY_MESSAGE_DURATION = 3000;
export const SECURITY_LOG_PREFIX = 'exam_security_logs';

// NOTE: Question content (question text, options, feedback) is currently in Spanish.
// For full i18n of questions, load localized question data from a locale-aware module
// (e.g., `import { MODULE_EXAMS } from './ialabQuizData.es'`) based on the current locale.
// Only the exam UI wrapping text (buttons, labels, messages) is translated via t() in IALabQuizModal.jsx.
export const MODULE_EXAMS = {
  1: [
    {
      id: 'm1q1', question: '¿Cuál es el propósito principal de la ingeniería de prompts?',
      options: [
        { id: 'm1q1_a', label: 'Hacer preguntas más largas a la IA' },
        { id: 'm1q1_b', label: 'Dar instrucciones claras y efectivas para obtener resultados útiles' },
        { id: 'm1q1_c', label: 'Usar palabras técnicas complicadas' },
        { id: 'm1q1_d', label: 'Hacer que la IA escriba código automáticamente' }
      ],
      correctAnswer: 'm1q1_b', topic: 'Ingeniería de Prompts', difficulty: 'fácil',
      feedback: 'Repasa el tema "IA Generativa: Tu Primer Paso" en los recursos del módulo.'
    },
    {
      id: 'm1q2', question: 'Un estudiante escribe: "Escribe un texto sobre inteligencia artificial para estudiantes." Según el método RTF (Rol, Tarea, Formato), ¿qué componentes están presentes y cuáles faltan?',
      options: [
        { id: 'm1q2_a', label: 'La Tarea está presente; faltan el Rol y el Formato — no define qué perfil adopta la IA ni cómo estructurar la respuesta' },
        { id: 'm1q2_b', label: 'Todos los componentes de RTF están presentes en el prompt' },
        { id: 'm1q2_c', label: 'Solo falta el Rol; la Tarea y el Formato están bien definidos' },
        { id: 'm1q2_d', label: 'Solo falta el Formato; el Rol y la Tarea están bien definidos' }
      ],
      correctAnswer: 'm1q2_a', topic: 'Método RTF', difficulty: 'medio',
      feedback: 'El prompt tiene una Tarea clara ("escribe un texto") pero no define el Rol de la IA (¿divulgador? ¿profesor?) ni el Formato (¿lista? ¿ensayo? ¿cuántas palabras?). Revisa la guía "Anatomía de un Prompt" (PDF) y el video "Cómo crear un buen prompt".'
    },
    {
      id: 'm1q3', question: '¿Cuál es una ventaja clave del método RTF (Rol, Tarea, Formato)?',
      options: [
        { id: 'm1q3_a', label: 'Hace las preguntas más cortas' },
        { id: 'm1q3_b', label: 'Estructura las instrucciones para obtener respuestas organizadas y alineadas' },
        { id: 'm1q3_c', label: 'Elimina la necesidad de contexto' },
        { id: 'm1q3_d', label: 'Automatiza completamente el proceso' }
      ],
      correctAnswer: 'm1q3_b', topic: 'Mastery Framework', difficulty: 'fácil',
      feedback: 'Repasa "La Fórmula del Prompt Perfecto" en los recursos del módulo.'
    },
    {
      id: 'm1q4', question: 'Según la guía "Anatomía de un Prompt" (PDF del módulo) y el video "Cómo crear un buen prompt", ¿cuál de estos prompts está MEJOR estructurado para obtener una respuesta precisa y útil?',
      options: [
        { id: 'm1q4_a', label: '"Dime todo sobre el cambio climático"' },
        { id: 'm1q4_b', label: '"Actúa como un divulgador científico. Explica 3 causas del cambio climático y sus efectos concretos. Usa un tono accesible para público general y termina con una conclusión de 2 líneas."' },
        { id: 'm1q4_c', label: '"Cambio climático: causas y efectos"' },
        { id: 'm1q4_d', label: '"Necesito información sobre el cambio climático para un trabajo escolar"' }
      ],
      correctAnswer: 'm1q4_b', topic: 'Estructura de Prompts', difficulty: 'medio',
      feedback: 'El prompt B sigue la estructura recomendada en el PDF y el video: define un Rol (divulgador científico), una Tarea específica (explicar 3 causas y efectos) y un Formato claro (tono accesible, conclusión de 2 líneas).'
    },
    {
      id: 'm1q5', question: 'Un estudiante necesita un resumen ejecutivo de un artículo sobre redes neuronales para presentarlo a directivos sin formación técnica. Escribe: "Resume este artículo sobre redes neuronales." La IA devuelve un texto técnico de 3 páginas. ¿Cuál es la causa del problema y cómo debería modificarse el prompt?',
      options: [
        { id: 'm1q5_a', label: 'El artículo es demasiado extenso; debería dividir el texto en partes más pequeñas' },
        { id: 'm1q5_b', label: 'Falta especificar el Rol, la Audiencia y el Formato. Debería ser: "Actúa como un consultor tecnológico. Resumen ejecutivo en 5 viñetas para directivos sin formación técnica. Máximo 200 palabras."' },
        { id: 'm1q5_c', label: 'La IA no comprende el tema; debería usar otra herramienta de IA' },
        { id: 'm1q5_d', label: 'El problema es la palabra "resume"; debería usar "sintetiza" en su lugar' }
      ],
      correctAnswer: 'm1q5_b', topic: 'Aplicación RTF', difficulty: 'difícil',
      feedback: 'El prompt original solo tiene una Tarea genérica. Para un resultado útil, necesita definir el Rol (consultor tecnológico), la Audiencia (directivos no técnicos) y el Formato (5 viñetas, 200 palabras). Revisa el OVA "Cómo comunicarte con la IA" y la guía PDF.'
    },
    {
      id: 'm1q6', question: '¿Qué consideraciones éticas son clave al usar IA generativa?',
      options: [
        { id: 'm1q6_a', label: 'Solo la velocidad de respuesta' },
        { id: 'm1q6_b', label: 'Sesgos, privacidad, transparencia y uso responsable' },
        { id: 'm1q6_c', label: 'El costo de la API' },
        { id: 'm1q6_d', label: 'La cantidad de tokens usados' }
      ],
      correctAnswer: 'm1q6_b', topic: 'Ética en IA', difficulty: 'medio',
      feedback: 'Repasa los recursos del módulo sobre uso responsable de IA.'
    },
    {
      id: 'm1q7', question: 'Compara estos dos prompts para la misma tarea:\n\nPrompt A: "Háblame del ciclo del agua."\nPrompt B: "Actúa como un profesor de ciencias naturales. Explica el ciclo del agua en 4 etapas clave para estudiantes de 10-12 años. Incluye una analogía simple por cada etapa y termina con una pregunta de verificación."\n\n¿Cuál es la razón principal por la que el Prompt B obtendrá un mejor resultado?',
      options: [
        { id: 'm1q7_a', label: 'El Prompt B es más largo, por lo tanto la IA se esfuerza más en la respuesta' },
        { id: 'm1q7_b', label: 'El Prompt B usa el método RTF completo (Rol + Tarea + Formato + Audiencia), dando instrucciones claras y específicas' },
        { id: 'm1q7_c', label: 'El Prompt A usa palabras demasiado simples para la IA' },
        { id: 'm1q7_d', label: 'El Prompt B usa un tono más formal y técnico' }
      ],
      correctAnswer: 'm1q7_b', topic: 'Análisis Comparativo RTF', difficulty: 'difícil',
      feedback: 'El Prompt B sigue el método RTF: define un Rol (profesor de ciencias), una Tarea específica (explicar en 4 etapas), una Audiencia (estudiantes 10-12 años) y un Formato (analogías + pregunta). El Prompt A es genérico y carece de estructura. Revisa el PDF "Anatomía de un Prompt".'
    },
    {
      id: 'm1q8', question: '¿Cómo se estructura un prompt usando RTF para análisis de mercado?',
      options: [
        { id: 'm1q8_a', label: 'Pidiendo directamente "analiza el mercado"' },
        { id: 'm1q8_b', label: 'Definiendo Rol, Tarea y Formato para guiar la respuesta de la IA' },
        { id: 'm1q8_c', label: 'Usando la menor cantidad de palabras posible' },
        { id: 'm1q8_d', label: 'Copiando prompts de internet' }
      ],
      correctAnswer: 'm1q8_b', topic: 'Mastery Framework', difficulty: 'difícil',
      feedback: 'Practica con las plantillas JSON del módulo para dominar la estructura RTF.'
    }
  ],
  2: [
    {
      id: 'm2q1', question: 'Eres analista de datos en una startup de e-commerce. Recibes un CSV con 10,000 registros de ventas del último trimestre y necesitas identificar qué productos crecen más. También debes comparar los resultados con las tendencias actuales del mercado. ¿Cuál es la mejor estrategia combinando herramientas de ChatGPT?',
      options: [
        { id: 'm2q1_a', label: 'Usar el Intérprete de Código para analizar el CSV y Búsqueda Web para investigar tendencias del sector' },
        { id: 'm2q1_b', label: 'Usar Canvas para pegar los datos manualmente y DALL-E para graficarlos' },
        { id: 'm2q1_c', label: 'Usar solo Búsqueda Web para encontrar artículos sobre tendencias de mercado' },
        { id: 'm2q1_d', label: 'Usar DALL-E 3 para que genere el análisis automáticamente desde el CSV' }
      ],
      correctAnswer: 'm2q1_a', topic: 'Herramientas ChatGPT', difficulty: 'medio',
      feedback: 'El Intérprete de Código ejecuta Python sobre el CSV para cálculos y gráficos, mientras Búsqueda Web obtiene datos actuales del mercado. Combinarlos da un análisis completo. Revisa el OVA "Laboratorio: Herramientas ChatGPT".'
    },
    {
      id: 'm2q2', question: '¿Qué herramienta de ChatGPT deberías usar para analizar un archivo Excel con datos de ventas y crear gráficos?',
      options: [
        { id: 'm2q2_a', label: 'DALL-E 3' },
        { id: 'm2q2_b', label: 'Intérprete de Código (Análisis de Datos)' },
        { id: 'm2q2_c', label: 'Canvas' },
        { id: 'm2q2_d', label: 'Búsqueda Web' }
      ],
      correctAnswer: 'm2q2_b', topic: 'Análisis de Datos', difficulty: 'medio',
      feedback: 'El Intérprete de Código ejecuta Python para procesar archivos y crear visualizaciones. Repasa el OVA "Laboratorio: Herramientas ChatGPT".'
    },
    {
      id: 'm2q3', question: 'Un despacho de abogados te pide crear un GPT personalizado que ayude a sus abogados a redactar contratos. Debe acceder a plantillas legales, verificar jurisprudencia actualizada y generar cláusulas según el caso. ¿Qué configuración es la más adecuada?',
      options: [
        { id: 'm2q3_a', label: 'System prompt con instrucciones legales detalladas + base de conocimiento con plantillas + Function Calling a base de jurisprudencia' },
        { id: 'm2q3_b', label: 'Solo un system prompt genérico que diga "eres un asistente legal"' },
        { id: 'm2q3_c', label: 'Activar Búsqueda Web y DALL-E 3 para buscar ejemplos visuales de contratos' },
        { id: 'm2q3_d', label: 'Un GPT sin instrucciones personalizadas, solo con análisis de datos activado' }
      ],
      correctAnswer: 'm2q3_a', topic: 'GPTs Personalizados', difficulty: 'medio',
      feedback: 'Un GPT personalizado efectivo combina: system prompt especializado, base de conocimiento con documentos relevantes y Function Calling para datos externos. Revisa el video "Crea tu Primer GPT en 18 Minutos" y la guía visual de GPTs.'
    },
    {
      id: 'm2q4', question: 'Tienes un GPT de atención al cliente conectado a una API de pedidos mediante Function Calling. La función registrada extrae automáticamente datos como número de pedido y email desde la conversación. Cuando un usuario escribe "¿Dónde está mi pedido #789? Mi correo es ana@ejemplo.com", ¿qué ocurre internamente?',
      options: [
        { id: 'm2q4_a', label: 'ChatGPT identifica los datos relevantes (#789, ana@ejemplo.com) y ejecuta la función automáticamente contra la API de pedidos' },
        { id: 'm2q4_b', label: 'El usuario debe llenar un formulario aparte con sus datos antes de recibir ayuda' },
        { id: 'm2q4_c', label: 'ChatGPT busca en internet el número de pedido para rastrearlo' },
        { id: 'm2q4_d', label: 'Function Calling envía el mensaje completo del usuario a la API sin procesar' }
      ],
      correctAnswer: 'm2q4_a', topic: 'Function Calling', difficulty: 'difícil',
      feedback: 'Function Calling permite que ChatGPT extraiga parámetros estructurados del lenguaje natural y ejecute funciones automáticamente. Repasa el tema "Conecta ChatGPT con el Mundo Real" y la Lección 3 del módulo.'
    },
    {
      id: 'm2q5', question: '¿Qué permite hacer Function Calling con la API de OpenAI?',
      options: [
        { id: 'm2q5_a', label: 'Llamar por teléfono al soporte técnico' },
        { id: 'm2q5_b', label: 'Conectar ChatGPT con servicios externos como bases de datos, APIs del clima o sistemas de correo' },
        { id: 'm2q5_c', label: 'Crear funciones matemáticas más rápidas' },
        { id: 'm2q5_d', label: 'Descargar automáticamente todos los plugins disponibles' }
      ],
      correctAnswer: 'm2q5_b', topic: 'Function Calling', difficulty: 'difícil',
      feedback: 'Function Calling conecta ChatGPT con el mundo real. Repasa los recursos del tema "Conecta ChatGPT con el Mundo Real".'
    },
    {
      id: 'm2q6', question: 'Estás preparando una tesis y necesitas que ChatGPT recuerde tu marco teórico en cada sesión. ¿Qué función deberías usar?',
      options: [
        { id: 'm2q6_a', label: 'Búsqueda Web' },
        { id: 'm2q6_b', label: 'DALL-E 3' },
        { id: 'm2q6_c', label: 'Proyectos y Memoria' },
        { id: 'm2q6_d', label: 'Intérprete de Código' }
      ],
      correctAnswer: 'm2q6_c', topic: 'Proyectos ChatGPT', difficulty: 'difícil',
      feedback: 'Los Proyectos agrupan conversaciones bajo instrucciones comunes y la Memoria guarda contexto. Revisa la guía de ChatGPT.'
    },
    {
      id: 'm2q7', question: 'Un community manager recibe 200+ comentarios diarios en redes sociales. Muchos son preguntas frecuentes (horarios, precios, disponibilidad). Quiere automatizar las respuestas con un GPT personalizado. ¿Cuál es el flujo de trabajo más efectivo?',
      options: [
        { id: 'm2q7_a', label: 'Crear un GPT con instrucciones sobre tono de marca, subir una base de conocimiento con FAQs y conectarlo por API a la plataforma de redes sociales' },
        { id: 'm2q7_b', label: 'Pedirle a ChatGPT estándar que responda cada comentario manualmente uno por uno' },
        { id: 'm2q7_c', label: 'Configurar Búsqueda Web para que encuentre respuestas automáticas en internet' },
        { id: 'm2q7_d', label: 'Usar DALL-E 3 para generar imágenes que respondan visualmente los comentarios' }
      ],
      correctAnswer: 'm2q7_a', topic: 'Automatización', difficulty: 'medio',
      feedback: 'Un GPT personalizado con instrucciones y base de conocimiento, conectado por API, automatiza respuestas manteniendo consistencia. Repasa el OVA "Laboratorio: Construye un GPT" y el tema de automatización del módulo.'
    },
    {
      id: 'm2q8', question: 'Una empresa implementa un GPT automatizado para responder quejas de clientes en redes sociales. El GPT es rápido pero ocasionalmente da información incorrecta sobre políticas de devolución. ¿Cuál es la mejor práctica para usar la IA responsablemente en este caso?',
      options: [
        { id: 'm2q8_a', label: 'Implementar supervisión humana con alertas automáticas cuando el GPT tenga baja confianza, y auditar respuestas periódicamente' },
        { id: 'm2q8_b', label: 'Desactivar el GPT y que todo el equipo responda manualmente sin ayuda de IA' },
        { id: 'm2q8_c', label: 'Ignorar los errores porque la velocidad de respuesta es lo más importante' },
        { id: 'm2q8_d', label: 'Configurar el GPT para que siempre dé respuestas genéricas sin información específica' }
      ],
      correctAnswer: 'm2q8_a', topic: 'Uso Responsable', difficulty: 'medio',
      feedback: 'La IA debe aumentar la capacidad humana, no reemplazarla sin supervisión. La mejor práctica es un sistema híbrido: IA para velocidad + supervisión humana para precisión. Revisa las buenas prácticas del módulo sobre uso responsable de IA.'
    },
    {
      id: 'm3q2', question: '¿Qué es Deep Research en Gemini y para qué sirve?',
      options: [
        { id: 'm3q2_a', label: 'Una función que hace búsquedas superficiales en Google' },
        { id: 'm3q2_b', label: 'Una herramienta que investiga a profundidad, analiza múltiples fuentes y genera informes con citas verificables' },
        { id: 'm3q2_c', label: 'Un juego de preguntas y respuestas' },
        { id: 'm3q2_d', label: 'Una extensión para el navegador Chrome' }
      ],
      correctAnswer: 'm3q2_b', topic: 'Deep Research', difficulty: 'fácil',
      feedback: 'Deep Research crea informes detallados con fuentes citadas y verificables. Explora el tema "Investiga como un Detective Digital".'
    },
    {
      id: 'm3q3', question: '¿Por qué es importante verificar las fuentes que Gemini cita en sus investigaciones?',
      options: [
        { id: 'm3q3_a', label: 'Porque las citas siempre son incorrectas' },
        { id: 'm3q3_b', label: 'Porque aunque Gemini es muy preciso, siempre debes confirmar que la fuente es real y el contexto es correcto' },
        { id: 'm3q3_c', label: 'Porque Gemini no proporciona fuentes' },
        { id: 'm3q3_d', label: 'Porque las fuentes solo funcionan en inglés' }
      ],
      correctAnswer: 'm3q3_b', topic: 'Verificación de Fuentes', difficulty: 'medio',
      feedback: 'La verificación humana es esencial. Incluso la mejor IA puede cometer errores. Revisa el OVA "De Cero a Experto en IA".'
    },
    {
      id: 'm3q4', question: '¿Qué ventaja ofrece Canvas al trabajar con documentos largos en un entorno de IA?',
      options: [
        { id: 'm3q4_a', label: 'Solo sirve para hacer dibujos artísticos' },
        { id: 'm3q4_b', label: 'Permite editar partes específicas de un texto sin tener que regenerar todo el contenido, ideal para informes y ensayos' },
        { id: 'm3q4_c', label: 'Convierte automáticamente cualquier texto en un video' },
        { id: 'm3q4_d', label: 'Traduce documentos a más de 200 idiomas' }
      ],
      correctAnswer: 'm3q4_b', topic: 'Canvas', difficulty: 'medio',
      feedback: 'Canvas es perfecto para editar secciones de documentos extensos. Revisa el OVA "Gemini en Acción: Casos Reales".'
    },
    {
      id: 'm3q5', question: '¿Cómo se integra Gemini con Google Workspace (Docs, Sheets, Gmail)?',
      options: [
        { id: 'm3q5_a', label: 'No se integra, son productos separados' },
        { id: 'm3q5_b', label: 'Gemini puede resumir correos, analizar datos en Sheets y ayudar a redactar en Docs directamente desde cada aplicación' },
        { id: 'm3q5_c', label: 'Solo funciona en Google Slides' },
        { id: 'm3q5_d', label: 'Requiere instalar un programa adicional en la computadora' }
      ],
      correctAnswer: 'm3q5_b', topic: 'Google Workspace', difficulty: 'medio',
      feedback: 'Gemini está integrado en todo Google Workspace. Repasa el tema "Gemini en Google Drive: Guía Completa".'
    },
    {
      id: 'm3q6', question: '¿Qué es el "grounding" o conexión a datos en tiempo real en Gemini?',
      options: [
        { id: 'm3q6_a', label: 'Una técnica para que la IA funcione sin internet' },
        { id: 'm3q6_b', label: 'La capacidad de conectar las respuestas de Gemini con información actualizada de Google Search y otras fuentes en vivo' },
        { id: 'm3q6_c', label: 'Un tipo de cable para conectar la computadora' },
        { id: 'm3q6_d', label: 'Una función que solo funciona los fines de semana' }
      ],
      correctAnswer: 'm3q6_b', topic: 'Grounding', difficulty: 'difícil',
      feedback: 'El grounding te da respuestas basadas en información actual. Explora el tema "Respuestas Siempre Actualizadas".'
    },
    {
      id: 'm3q7', question: 'En el contexto de aprendizaje guiado, ¿cuál es la mejor manera de usar Gemini para estudiar un tema nuevo?',
      options: [
        { id: 'm3q7_a', label: 'Pedirle que escriba todo el ensayo y entregarlo sin leer' },
        { id: 'm3q7_b', label: 'Usarlo como tutor: hacer preguntas progresivas, pedir ejemplos, verificar conceptos y practicar con ejercicios guiados' },
        { id: 'm3q7_c', label: 'Solo usarlo para traducir textos' },
        { id: 'm3q7_d', label: 'Evitar usarlo porque confunde más de lo que ayuda' }
      ],
      correctAnswer: 'm3q7_b', topic: 'Aprendizaje Guiado', difficulty: 'fácil',
      feedback: 'La IA es tu tutor personal 24/7. Úsala para aprender activamente, no para evitar el esfuerzo. Repasa el laboratorio guiado por Valerio.'
    },
    {
      id: 'm3q8', question: 'Tienes que investigar las 5 tendencias principales de IA en 2025. ¿Qué flujo de trabajo con Gemini te daría el resultado más completo y verificable?',
      options: [
        { id: 'm3q8_a', label: 'Preguntar "¿cuáles son las tendencias de IA?" y aceptar la primera respuesta' },
        { id: 'm3q8_b', label: 'Usar Deep Research con instrucciones específicas, verificar cada fuente citada, cruzar datos con Google Search y generar un informe estructurado' },
        { id: 'm3q8_c', label: 'Buscar en Google manualmente y copiar los primeros resultados' },
        { id: 'm3q8_d', label: 'Usar solo el chat básico sin pedir fuentes' }
      ],
      correctAnswer: 'm3q8_b', topic: 'Investigación Profesional', difficulty: 'difícil',
      feedback: 'El flujo profesional combina Deep Research + verificación + síntesis. Practica con el OVA "Casos Prácticos de Gemini".'
    }
  ],
  4: [
    {
      id: 'm4q1', question: 'Eres investigador en biología marina y necesitas analizar 15 papers académicos sobre el impacto del cambio climático en arrecifes de coral para una publicación. Tu supervisor te pregunta: "¿Por qué usarías NotebookLM en lugar de ChatGPT para esta investigación?" ¿Cuál es la razón más convincente?',
      options: [
        { id: 'm4q1_a', label: 'NotebookLM trabaja exclusivamente con tus documentos y cita textualmente de cada fuente, eliminando el riesgo de que invente datos que no están en tus papers' },
        { id: 'm4q1_b', label: 'ChatGPT no puede leer PDFs académicos, solo documentos de texto simple' },
        { id: 'm4q1_c', label: 'NotebookLM es más rápido porque no requiere conexión a internet para funcionar' },
        { id: 'm4q1_d', label: 'ChatGPT solo procesa información en inglés y los papers pueden estar en otros idiomas' }
      ],
      correctAnswer: 'm4q1_a', topic: 'NotebookLM', difficulty: 'medio',
      feedback: 'NotebookLM está diseñado para investigación basada en fuentes propias: cero alucinaciones, citas verificables y análisis contextual profundo. ChatGPT es excelente para tareas generales, pero para investigación académica con fuentes específicas, NotebookLM es la herramienta correcta. Repasa el video "Primeros Pasos con NotebookLM".'
    },
    {
      id: 'm4q2', question: 'Eres estudiante de ciencias ambientales y encuentras 30 documentos sobre cambio climático: 10 papers académicos revisados por pares, 5 artículos de noticias verificados, 8 blogs de opinión personal, 4 datasets gubernamentales y 3 documentales científicos. Tu notebook en NotebookLM acepta hasta 50 fuentes. ¿Cuál es la estrategia de curación más inteligente?',
      options: [
        { id: 'm4q2_a', label: 'Seleccionar los 10 papers + 4 datasets + 3 documentales como fuentes prioritarias, dejando fuera los blogs de opinión no verificados' },
        { id: 'm4q2_b', label: 'Subir los 30 documentos completos porque hay espacio disponible en el notebook' },
        { id: 'm4q2_c', label: 'Subir solo los 8 blogs porque usan un lenguaje más sencillo de entender' },
        { id: 'm4q2_d', label: 'Subir solo los 5 artículos de noticias porque tienen la fecha más reciente' }
      ],
      correctAnswer: 'm4q2_a', topic: 'NotebookLM', difficulty: 'medio',
      feedback: 'La curación no es cuestión de espacio — es seleccionar fuentes confiables y relevantes. Los papers académicos y datasets gubernamentales son verificables; los blogs de opinión añaden ruido y sesgo no fundamentado. Repasa la lección "Selecciona Fuentes como Experto" y el OVA "Simulador: Análisis de Documentos".'
    },
    {
      id: 'm4q3', question: 'Eres estudiante de medicina y tienes 3 PDFs de fisiología cardíaca que debes estudiar para un examen. Mañana tienes un viaje de 45 minutos en bus y quieres aprovechar ese tiempo para repasar. ¿Cuál es la mejor estrategia usando NotebookLM?',
      options: [
        { id: 'm4q3_a', label: 'Subir los 3 PDFs a un notebook, generar un Audio Overview que los analice y escucharlo durante el viaje' },
        { id: 'm4q3_b', label: 'Leer los 3 PDFs completos en el bus aunque haya movimiento y poca luz' },
        { id: 'm4q3_c', label: 'Pedirle a ChatGPT que haga un resumen general y leerlo en el bus' },
        { id: 'm4q3_d', label: 'Esperar a llegar a casa para leer los PDFs con calma' }
      ],
      correctAnswer: 'm4q3_a', topic: 'Audio Overview', difficulty: 'medio',
      feedback: 'Audio Overview convierte tus documentos en un podcast conversacional con dos voces IA que analizan el contenido. Es ideal para repasar material denso cuando no puedes leer, como durante un viaje. Repasa el video "Audio Overview: Tu Contenido en Podcast".'
    },
    {
      id: 'm4q4', question: 'NotebookLM responde: "La neuroplasticidad ocurre principalmente en la infancia (Fuente: neuroplasticidad.pdf, página 5)". Haces clic en la cita y en el PDF lees textual: "La neuroplasticidad es más activa durante la infancia, pero continúa durante toda la vida". ¿Qué concluyes?',
      options: [
        { id: 'm4q4_a', label: 'La IA interpretó correctamente pero simplificó el matiz — la cita original dice algo más preciso, demostrando por qué siempre debes verificar las citas textuales' },
        { id: 'm4q4_b', label: 'NotebookLM se equivocó completamente, la fuente original no dice nada parecido' },
        { id: 'm4q4_c', label: 'El PDF está mal escrito y deberías eliminarlo del notebook' },
        { id: 'm4q4_d', label: 'La respuesta de la IA es correcta porque citó el PDF correctamente, no necesitas leer la fuente original' }
      ],
      correctAnswer: 'm4q4_a', topic: 'Precisión', difficulty: 'difícil',
      feedback: 'Este es un caso clásico de por qué verificar citas es esencial. La IA no alucinó — interpretó correctamente pero perdió un matiz importante ("más activa" ≠ "ocurre principalmente"). La IA te da velocidad; tú le das precisión. Revisa la infografía "Resúmenes Inteligentes con NotebookLM".'
    },
    {
      id: 'm4q5', question: '¿Cuál es la mejor práctica al organizar tus fuentes en NotebookLM para una investigación?',
      options: [
        { id: 'm4q5_a', label: 'Subir las 50 fuentes de una vez sin organizar' },
        { id: 'm4q5_b', label: 'Seleccionar fuentes relevantes y confiables, organizarlas por temas y categorías para obtener mejores resultados' },
        { id: 'm4q5_c', label: 'Subir solo resúmenes, nunca los documentos completos' },
        { id: 'm4q5_d', label: 'Mezclar fuentes académicas con blogs sin distinción' }
      ],
      correctAnswer: 'm4q5_b', topic: 'Curaduría', difficulty: 'medio',
      feedback: 'La calidad de tus fuentes determina la calidad de las respuestas. Repasa el tema "Selecciona Fuentes como Experto".'
    },
    {
      id: 'm4q6', question: 'Si encuentras dos fuentes que se contradicen en NotebookLM, ¿qué debes hacer?',
      options: [
        { id: 'm4q6_a', label: 'Eliminar ambas fuentes y buscar otras nuevas' },
        { id: 'm4q6_b', label: 'Analizar ambas, identificar las razones de la contradicción y documentarlo como parte de tu investigación' },
        { id: 'm4q6_c', label: 'Quedarte solo con la fuente más reciente' },
        { id: 'm4q6_d', label: 'Ignorar la contradicción y seguir adelante' }
      ],
      correctAnswer: 'm4q6_b', topic: 'Análisis Crítico', difficulty: 'difícil',
      feedback: 'Las contradicciones son oportunidades de aprendizaje. Analizarlas fortalece tu investigación. Repasa el simulador de análisis documental.'
    },
    {
      id: 'm4q7', question: 'Según las mejores prácticas del módulo, ¿qué debes hacer SIEMPRE que NotebookLM te da una respuesta con citas?',
      options: [
        { id: 'm4q7_a', label: 'Verificar las citas haciendo clic en ellas para confirmar que la información es correcta y está en contexto' },
        { id: 'm4q7_b', label: 'Copiar y pegar la respuesta sin revisar' },
        { id: 'm4q7_c', label: 'Borrar el documento original porque ya no lo necesitas' },
        { id: 'm4q7_d', label: 'Traducir la respuesta a otro idioma para verificar su calidad' }
      ],
      correctAnswer: 'm4q7_a', topic: 'Verificación', difficulty: 'medio',
      feedback: 'Siempre verifica las citas. La IA es tu asistente, pero tú eres el responsable final. Repasa el OVA del módulo.'
    },
    {
      id: 'm4q8', question: 'Un equipo de 4 estudiantes investiga el mismo tema para un proyecto integrador. Cada uno tiene documentos diferentes y quieren aprovechar NotebookLM para trabajar juntos. ¿Cuál es el flujo de trabajo colaborativo más eficiente?',
      options: [
        { id: 'm4q8_a', label: 'Cada estudiante crea su notebook con sus fuentes y comparte el enlace con el equipo; todos pueden consultar y hacer preguntas sobre las fuentes de los demás' },
        { id: 'm4q8_b', label: 'Un solo estudiante crea un notebook y los demás le piden que haga las preguntas por ellos' },
        { id: 'm4q8_c', label: 'Cada estudiante trabaja por separado y al final del proyecto comparan resultados manualmente' },
        { id: 'm4q8_d', label: 'Los 4 estudiantes se turnan para usar una misma computadora con un solo notebook abierto' }
      ],
      correctAnswer: 'm4q8_a', topic: 'Colaboración', difficulty: 'medio',
      feedback: 'NotebookLM permite compartir notebooks como Google Docs. Cada miembro puede tener su notebook temático y compartirlo, dando acceso a todo el equipo para consultar fuentes y hacer preguntas de forma independiente. Repasa el OVA "Laboratorio: Crea tu Notebook".'
    },
  ],
  5: [
    {
      id: 'm5q1', question: 'Un sistema de contratación basado en IA fue entrenado con datos históricos de una empresa tecnológica donde el 78% de los empleados eran hombres. El sistema aprendió a priorizar CVs con palabras como "ingeniero" y "líder técnico", y penalizaba términos como "voluntariado" o "licencia parental". Las candidatas mujeres con calificaciones equivalentes recibían puntuaciones más bajas. ¿Qué tipo de sesgo está presente y en qué etapa del pipeline de IA se originó?',
      options: [
        { id: 'm5q1_a', label: 'Sesgo de muestreo — los datos de entrenamiento no representaban equitativamente a la población, originado en la recolección de datos' },
        { id: 'm5q1_b', label: 'Sesgo de automatización — el sistema decidió por sí mismo sin supervisión humana' },
        { id: 'm5q1_c', label: 'Sesgo de confirmación — los reclutadores buscaban confirmar sus propias creencias' },
        { id: 'm5q1_d', label: 'Sesgo de etiquetado — las etiquetas fueron puestas incorrectamente por anotadores externos' }
      ],
      correctAnswer: 'm5q1_a', topic: 'Sesgos en IA', difficulty: 'medio',
      feedback: 'Este es un caso clásico de sesgo de muestreo (sampling bias). Los datos históricos de una empresa con 78% de hombres no representan a la población general de candidatos. El sesgo se originó en la recolección de datos, antes del entrenamiento. Repasa el OVA "Laboratorio: Detecta el Sesgo" y el PDF "Guía de Detección de Sesgos".'
    },
    {
      id: 'm5q2', question: 'Usas ChatGPT para investigar un tratamiento contra la ansiedad. La IA responde: "Según un estudio de Harvard de 2023, el 89% de los pacientes redujo sus síntomas con esta terapia". Intentas buscar el estudio y no encuentras nada. Las cifras y la fuente parecen inventadas. ¿Cuál es la acción más responsable?',
      options: [
        { id: 'm5q2_a', label: 'No usar esa información hasta verificarla con fuentes confiables, reportar el posible error y documentar que la IA alucinó' },
        { id: 'm5q2_b', label: 'Usar la información igual porque la IA rara vez se equivoca en datos concretos' },
        { id: 'm5q2_c', label: 'Pedirle a la misma IA que busque la fuente nuevamente y confiar en lo que responda' },
        { id: 'm5q2_d', label: 'Ignorar el incidente porque las alucinaciones son poco comunes y no afectan' }
      ],
      correctAnswer: 'm5q2_a', topic: 'Alucinaciones', difficulty: 'medio',
      feedback: 'Las alucinaciones son información falsa con apariencia de verdad. Son especialmente peligrosas en contextos de salud donde pueden tener consecuencias graves. Siempre verifica fuentes de información crítica. Repasa el laboratorio "Detecta el Sesgo".'
    },
    {
      id: 'm5q3', question: 'Estás usando IA para un diagnóstico médico y el resultado contradice tu criterio profesional. ¿Cómo actúas éticamente?',
      options: [
        { id: 'm5q3_a', label: 'Aceptas la IA sin cuestionar porque es más inteligente' },
        { id: 'm5q3_b', label: 'Cuestionas el posible sesgo de automatización, verificas con otros expertos y usas tu criterio profesional' },
        { id: 'm5q3_c', label: 'Dejas que la IA decida el tratamiento' },
        { id: 'm5q3_d', label: 'Apagas la computadora y empiezas de nuevo' }
      ],
      correctAnswer: 'm5q3_b', topic: 'Responsabilidad', difficulty: 'medio',
      feedback: 'El sesgo de automatización nos hace confiar ciegamente en la IA. Tu criterio profesional es irremplazable. Repasa el tema "Ética en IA: Lo Esencial".'
    },
    {
      id: 'm5q4', question: '¿Cuál de las siguientes NO es una buena práctica de privacidad al usar IA?',
      options: [
        { id: 'm5q4_a', label: 'Subir datos personales de clientes a un chatbot público para que los analice' },
        { id: 'm5q4_b', label: 'Leer las políticas de privacidad antes de usar una herramienta de IA' },
        { id: 'm5q4_c', label: 'No compartir información confidencial en conversaciones con IA' },
        { id: 'm5q4_d', label: 'Usar versiones empresariales que ofrecen protección de datos' }
      ],
      correctAnswer: 'm5q4_a', topic: 'Privacidad', difficulty: 'medio',
      feedback: 'Nunca subas datos sensibles a herramientas públicas. Repasa el PDF "Manual de Privacidad en IA" y el video del módulo.'
    },
    {
      id: 'm5q5', question: 'Un banco implementa un sistema de IA para aprobar o rechazar solicitudes de crédito. Un cliente es rechazado y pide saber por qué. El banco responde: "Es una decisión de la IA, no podemos explicar cómo funciona internamente". ¿Qué principio ético se viola y qué debería hacer el banco?',
      options: [
        { id: 'm5q5_a', label: 'Transparencia y explicabilidad — el banco debería auditar el modelo y proporcionar explicaciones comprensibles al cliente' },
        { id: 'm5q5_b', label: 'Privacidad — el banco debería ocultar el uso de IA para proteger al cliente' },
        { id: 'm5q5_c', label: 'Velocidad — el banco debería procesar las solicitudes más rápido' },
        { id: 'm5q5_d', label: 'Eficiencia — el banco debería reemplazar a los analistas humanos' }
      ],
      correctAnswer: 'm5q5_a', topic: 'Transparencia', difficulty: 'medio',
      feedback: 'La transparencia es un pilar ético fundamental. Los ciudadanos tienen derecho a entender decisiones automatizadas que les afectan. El AI Act de la UE exige explicabilidad en decisiones de alto riesgo como créditos. Repasa el video "IA Ética: Principios y Práctica" y el PDF "Código de Ética para Uso de IA".'
    },
    {
      id: 'm5q6', question: 'Eres diseñador UX en una agencia digital. Tu jefe te pide usar IA para generar 50 reseñas falsas positivas de un producto que aún no se ha lanzado, para mejorar su reputación inicial en redes. ¿Cuál es la postura más ética?',
      options: [
        { id: 'm5q6_a', label: 'Negarte a generar reseñas falsas, explicar que viola principios éticos de transparencia y proponer alternativas legítimas de promoción' },
        { id: 'm5q6_b', label: 'Generar las reseñas porque tu jefe lo pidió y es parte de tu trabajo' },
        { id: 'm5q6_c', label: 'Generar las reseñas pero modificar algunos detalles para que parezcan menos falsas' },
        { id: 'm5q6_d', label: 'Renunciar inmediatamente sin dar explicaciones' }
      ],
      correctAnswer: 'm5q6_a', topic: 'Uso Responsable', difficulty: 'medio',
      feedback: 'Generar reseñas falsas viola principios éticos de transparencia y honestidad, y puede tener consecuencias legales (publicidad engañosa). El mejor camino es proponer alternativas éticas. Repasa el OVA "Laboratorio: Dilemas Éticos" y el decálogo del usuario ético.'
    },
    {
      id: 'm5q7', question: 'Un conductor con piloto automático viene distraído mirando el celular. El sistema detecta un obstáculo y frena a tiempo. El conductor confía en que siempre funcionará. Semanas después, con poca luz, el sistema no detecta un objeto pequeño y ocurre un accidente. ¿Qué sesgo describe esta situación y cómo prevenirla?',
      options: [
        { id: 'm5q7_a', label: 'Sesgo de automatización — el conductor delegó su atención sin supervisión crítica. Se previene con entrenamiento en límites del sistema y supervisión activa' },
        { id: 'm5q7_b', label: 'Sesgo de muestreo — los datos de entrenamiento no incluían objetos pequeños con poca luz' },
        { id: 'm5q7_c', label: 'Sesgo algorítmico — el sistema discriminaba contra ciertos tipos de objetos' },
        { id: 'm5q7_d', label: 'Error humano normal — los accidentes ocurren, no hay sesgo involucrado' }
      ],
      correctAnswer: 'm5q7_a', topic: 'Sesgo de Automatización', difficulty: 'difícil',
      feedback: 'El sesgo de automatización es la tendencia humana a confiar excesivamente en sistemas automatizados, abandonando el pensamiento crítico. El conductor asumió que el sistema era infalible. Repasa el OVA "Laboratorio: Detecta el Sesgo" y el tema "Sesgos Algorítmicos y Equidad".'
    },
    {
      id: 'm5q8', question: 'Quieres usar IA para un proyecto pero te preocupa la privacidad de los datos. Según el módulo, ¿cuál es la estrategia más responsable?',
      options: [
        { id: 'm5q8_a', label: 'No usar IA nunca para nada relacionado con datos' },
        { id: 'm5q8_b', label: 'Usar herramientas con protección de datos empresarial, anonimizar información sensible y nunca compartir datos personales en chats públicos' },
        { id: 'm5q8_c', label: 'Compartir los datos en redes sociales para que la comunidad ayude' },
        { id: 'm5q8_d', label: 'Confiar en que la IA automáticamente protege todos los datos' }
      ],
      correctAnswer: 'm5q8_b', topic: 'Protección de Datos', difficulty: 'difícil',
      feedback: 'La protección de datos es responsabilidad tuya. Usa herramientas seguras, anonimiza y nunca compartas información sensible. Repasa "Protege tus Datos en la Era de la IA".'
    }
  ]
};
