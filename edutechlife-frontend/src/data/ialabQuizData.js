export const TOTAL_QUESTIONS = 12;
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

import { MODULE_EXAMS_EN } from './ialabQuizData.en';

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
      correctAnswer: 'm1q3_b', topic: 'Marco de Maestría', difficulty: 'fácil',
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
      correctAnswer: 'm1q8_b', topic: 'Marco de Maestría', difficulty: 'difícil',
      feedback: 'Practica con las plantillas JSON del módulo para dominar la estructura RTF.'
    },
    {
      id: 'm1q9', question: 'Trabajas en una empresa que lanza un nuevo producto cada mes. Necesitas que ChatGPT redacte correos promocionales consistentes con la voz de la marca. ¿Cuál es la estrategia más eficiente para mantener consistencia sin reescribir instrucciones cada vez?',
      options: [
        { id: 'm1q9_a', label: 'Crear un GPT personalizado con instrucciones de tono, voz y ejemplos de la marca en la base de conocimiento' },
        { id: 'm1q9_b', label: 'Copiar y pegar las instrucciones manualmente en cada nueva conversación' },
        { id: 'm1q9_c', label: 'Usar el chat estándar y pedirle que recuerde el tono cada vez' },
        { id: 'm1q9_d', label: 'Escribir los correos manualmente sin ayuda de IA' }
      ],
      correctAnswer: 'm1q9_a', topic: 'GPTs Personalizados', difficulty: 'medio',
      feedback: 'Un GPT personalizado con instrucciones persistentes y base de conocimiento es la forma más eficiente de mantener consistencia. Revisa el tema de GPTs personalizados en los recursos del módulo.'
    },
    {
      id: 'm1q10', question: 'Escribes un prompt pidiendo un plan de marketing. La IA te da algo genérico. ¿Cuál es el mejor siguiente paso?',
      options: [
        { id: 'm1q10_a', label: 'Aceptar el resultado genérico porque la IA ya dio lo mejor que podía' },
        { id: 'm1q10_b', label: 'Refinar el prompt agregando contexto específico: industria, presupuesto, audiencia objetivo y ejemplos de campañas anteriores' },
        { id: 'm1q10_c', label: 'Cambiar completamente de tema y empezar de cero' },
        { id: 'm1q10_d', label: 'Quejarse con el equipo de soporte de la IA' }
      ],
      correctAnswer: 'm1q10_b', topic: 'Refinamiento Iterativo', difficulty: 'fácil',
      feedback: 'La ingeniería de prompts es un proceso iterativo. Cada refinamiento agrega contexto que la IA necesita para darte resultados específicos y útiles. Revisa el tema "Refinamiento de Prompts" en los recursos del módulo.'
    },
    {
      id: 'm1q11', question: '¿Cuál es la diferencia clave entre un prompt zero-shot y uno few-shot?',
      options: [
        { id: 'm1q11_a', label: 'Zero-shot no usa ejemplos; few-shot incluye ejemplos en el prompt para guiar a la IA' },
        { id: 'm1q11_b', label: 'Zero-shot funciona sin internet; few-shot necesita conexión' },
        { id: 'm1q11_c', label: 'Zero-shot solo funciona con imágenes; few-shot solo con texto' },
        { id: 'm1q11_d', label: 'No hay diferencia, son términos intercambiables' }
      ],
      correctAnswer: 'm1q11_a', topic: 'Estrategias de Prompting', difficulty: 'medio',
      feedback: 'En zero-shot le das una instrucción directa (una sola vez). En few-shot le proporcionas ejemplos (varias muestras) para establecer el patrón de respuesta deseado. Revisa el tema de estrategias de prompting en los recursos del módulo.'
    },
    {
      id: 'm1q12', question: '¿Qué ventaja tiene usar un system prompt (instrucción del sistema) en lugar de incluir instrucciones en cada mensaje?',
      options: [
        { id: 'm1q12_a', label: 'El system prompt establece el comportamiento base de la IA para toda la conversación, evitando repetir instrucciones' },
        { id: 'm1q12_b', label: 'El system prompt hace que la IA responda más rápido' },
        { id: 'm1q12_c', label: 'El system prompt solo funciona en la versión paga de ChatGPT' },
        { id: 'm1q12_d', label: 'No hay diferencia, ambos métodos funcionan igual' }
      ],
      correctAnswer: 'm1q12_a', topic: 'System Prompts', difficulty: 'medio',
      feedback: 'Los system prompts definen el rol, tono y reglas base para toda la interacción. Esto es especialmente útil en GPTs personalizados y aplicaciones donde la consistencia es clave. Revisa el tema de system prompts en los recursos del módulo.'
    },
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
      id: 'm2q9', question: 'Un equipo de 5 vendedores quiere usar ChatGPT para mantener actualizada su base de conocimientos de productos. Cada vendedor tiene conversaciones diferentes con clientes distintos. ¿Cuál es la mejor estrategia para que todos compartan información actualizada?',
      options: [
        { id: 'm2q9_a', label: 'Crear un Proyecto compartido con instrucciones de producto y actualizar la base de conocimiento centralizada' },
        { id: 'm2q9_b', label: 'Cada vendedor mantiene su propio chat con las instrucciones que recuerda' },
        { id: 'm2q9_c', label: 'Usar un GPT público que todos puedan descargar' },
        { id: 'm2q9_d', label: 'Compartir capturas de pantalla de los chats por correo electrónico' }
      ],
      correctAnswer: 'm2q9_a', topic: 'Proyectos ChatGPT', difficulty: 'medio',
      feedback: 'Los Proyectos en ChatGPT permiten agrupar conversaciones bajo instrucciones y archivos compartidos. Revisa el tema de Proyectos en los recursos del módulo.'
    },
    {
      id: 'm2q10', question: 'Estás diseñando un GPT de atención al cliente. Quieres que pueda consultar el catálogo de productos actualizado diariamente. ¿Qué funcionalidad debes activar?',
      options: [
        { id: 'm2q10_a', label: 'Subir el catálogo como base de conocimiento y usar Actions (API) para consultar actualizaciones en tiempo real' },
        { id: 'm2q10_b', label: 'Pedir al usuario que copie y pegue el catálogo cada vez' },
        { id: 'm2q10_c', label: 'Usar DALL-E para generar imágenes del catálogo' },
        { id: 'm2q10_d', label: 'No es posible consultar datos actualizados en un GPT' }
      ],
      correctAnswer: 'm2q10_a', topic: 'GPTs Personalizados', difficulty: 'difícil',
      feedback: 'Los GPTs pueden tener base de conocimiento estática + Actions (API calls) para datos dinámicos. Esto permite consultar información actualizada en tiempo real. Revisa el tema "Conecta ChatGPT con el Mundo Real".'
    },
    {
      id: 'm2q11', question: 'Un GPT que creaste para tu startup está funcionando muy bien internamente. Tu socio sugiere publicarlo en la GPT Store para que otras startups también lo usen. ¿Qué consideración de privacidad debes evaluar PRIMERO?',
      options: [
        { id: 'm2q11_a', label: 'Si el GPT contiene datos sensibles de tu empresa en la base de conocimiento o en las instrucciones del sistema' },
        { id: 'm2q11_b', label: 'Si el nombre del GPT es lo suficientemente llamativo' },
        { id: 'm2q11_c', label: 'Si el GPT tiene suficientes funcionalidades para justificar su precio' },
        { id: 'm2q11_d', label: 'Si el logo del GPT se ve profesional' }
      ],
      correctAnswer: 'm2q11_a', topic: 'Privacidad GPT', difficulty: 'medio',
      feedback: 'Antes de publicar un GPT, verifica que no contenga datos confidenciales (secretos comerciales, datos de clientes, estrategias internas). Lo que funciona internamente no siempre es seguro para publicación pública. Repasa el tema de privacidad en GPTs.'
    },
    {
      id: 'm2q12', question: 'Quieres crear un flujo automatizado donde ChatGPT analice comentarios de redes sociales, identifique quejas urgentes y envíe notificaciones al equipo de soporte. ¿Qué combinación de herramientas necesitas?',
      options: [
        { id: 'm2q12_a', label: 'Un GPT personalizado con Actions (API) conectado a la red social + webhook al sistema de tickets del equipo' },
        { id: 'm2q12_b', label: 'ChatGPT estándar con Búsqueda Web activada' },
        { id: 'm2q12_c', label: 'DALL-E 3 para generar respuestas visuales automáticas' },
        { id: 'm2q12_d', label: 'Canvas para editar manualmente cada comentario' }
      ],
      correctAnswer: 'm2q12_a', topic: 'Automatización', difficulty: 'difícil',
      feedback: 'La automatización con IA requiere: un GPT preparado para la tarea + Actions (API) para conectarse a servicios externos + un webhook o API para disparar acciones. Repasa el tema de automatización y Function Calling en el módulo.'
    },
  ],
  3: [
    {
      id: 'm3q1', question: '¿Qué es Deep Research en Gemini y para qué sirve?',
      options: [
        { id: 'm3q1_a', label: 'Una función que hace búsquedas superficiales en Google' },
        { id: 'm3q1_b', label: 'Una herramienta que investiga a profundidad, analiza múltiples fuentes y genera informes con citas verificables' },
        { id: 'm3q1_c', label: 'Un juego de preguntas y respuestas' },
        { id: 'm3q1_d', label: 'Una extensión para el navegador Chrome' }
      ],
      correctAnswer: 'm3q1_b', topic: 'Deep Research', difficulty: 'fácil',
      feedback: 'Deep Research crea informes detallados con fuentes citadas y verificables. Explora el tema "Investiga como un Detective Digital".'
    },
    {
      id: 'm3q2', question: '¿Por qué es importante verificar las fuentes que Gemini cita en sus investigaciones?',
      options: [
        { id: 'm3q2_a', label: 'Porque las citas siempre son incorrectas' },
        { id: 'm3q2_b', label: 'Porque aunque Gemini es muy preciso, siempre debes confirmar que la fuente es real y el contexto es correcto' },
        { id: 'm3q2_c', label: 'Porque Gemini no proporciona fuentes' },
        { id: 'm3q2_d', label: 'Porque las fuentes solo funcionan en inglés' }
      ],
      correctAnswer: 'm3q2_b', topic: 'Verificación de Fuentes', difficulty: 'medio',
      feedback: 'La verificación humana es esencial. Incluso la mejor IA puede cometer errores. Revisa el OVA "De Cero a Experto en IA".'
    },
    {
      id: 'm3q3', question: '¿Qué ventaja ofrece Canvas al trabajar con documentos largos en un entorno de IA?',
      options: [
        { id: 'm3q3_a', label: 'Solo sirve para hacer dibujos artísticos' },
        { id: 'm3q3_b', label: 'Permite editar partes específicas de un texto sin tener que regenerar todo el contenido, ideal para informes y ensayos' },
        { id: 'm3q3_c', label: 'Convierte automáticamente cualquier texto en un video' },
        { id: 'm3q3_d', label: 'Traduce documentos a más de 200 idiomas' }
      ],
      correctAnswer: 'm3q3_b', topic: 'Canvas', difficulty: 'medio',
      feedback: 'Canvas es perfecto para editar secciones de documentos extensos. Revisa el OVA "Gemini en Acción: Casos Reales".'
    },
    {
      id: 'm3q4', question: '¿Cómo se integra Gemini con Google Workspace (Docs, Sheets, Gmail)?',
      options: [
        { id: 'm3q4_a', label: 'No se integra, son productos separados' },
        { id: 'm3q4_b', label: 'Gemini puede resumir correos, analizar datos en Sheets y ayudar a redactar en Docs directamente desde cada aplicación' },
        { id: 'm3q4_c', label: 'Solo funciona en Google Slides' },
        { id: 'm3q4_d', label: 'Requiere instalar un programa adicional en la computadora' }
      ],
      correctAnswer: 'm3q4_b', topic: 'Google Workspace', difficulty: 'medio',
      feedback: 'Gemini está integrado en todo Google Workspace. Repasa el tema "Gemini en Google Drive: Guía Completa".'
    },
    {
      id: 'm3q5', question: '¿Qué es el "grounding" o conexión a datos en tiempo real en Gemini?',
      options: [
        { id: 'm3q5_a', label: 'Una técnica para que la IA funcione sin internet' },
        { id: 'm3q5_b', label: 'La capacidad de conectar las respuestas de Gemini con información actualizada de Google Search y otras fuentes en vivo' },
        { id: 'm3q5_c', label: 'Un tipo de cable para conectar la computadora' },
        { id: 'm3q5_d', label: 'Una función que solo funciona los fines de semana' }
      ],
      correctAnswer: 'm3q5_b', topic: 'Grounding', difficulty: 'difícil',
      feedback: 'El grounding te da respuestas basadas en información actual. Explora el tema "Respuestas Siempre Actualizadas".'
    },
    {
      id: 'm3q6', question: 'En el contexto de aprendizaje guiado, ¿cuál es la mejor manera de usar Gemini para estudiar un tema nuevo?',
      options: [
        { id: 'm3q6_a', label: 'Pedirle que escriba todo el ensayo y entregarlo sin leer' },
        { id: 'm3q6_b', label: 'Usarlo como tutor: hacer preguntas progresivas, pedir ejemplos, verificar conceptos y practicar con ejercicios guiados' },
        { id: 'm3q6_c', label: 'Solo usarlo para traducir textos' },
        { id: 'm3q6_d', label: 'Evitar usarlo porque confunde más de lo que ayuda' }
      ],
      correctAnswer: 'm3q6_b', topic: 'Aprendizaje Guiado', difficulty: 'fácil',
      feedback: 'La IA es tu tutor personal 24/7. Úsala para aprender activamente, no para evitar el esfuerzo. Repasa el laboratorio guiado por Valerio.'
    },
    {
      id: 'm3q7', question: 'Tienes que investigar las 5 tendencias principales de IA en 2025. ¿Qué flujo de trabajo con Gemini te daría el resultado más completo y verificable?',
      options: [
        { id: 'm3q7_a', label: 'Preguntar "¿cuáles son las tendencias de IA?" y aceptar la primera respuesta' },
        { id: 'm3q7_b', label: 'Usar Deep Research con instrucciones específicas, verificar cada fuente citada, cruzar datos con Google Search y generar un informe estructurado' },
        { id: 'm3q7_c', label: 'Buscar en Google manualmente y copiar los primeros resultados' },
        { id: 'm3q7_d', label: 'Usar solo el chat básico sin pedir fuentes' }
      ],
      correctAnswer: 'm3q7_b', topic: 'Investigación Profesional', difficulty: 'difícil',
      feedback: 'El flujo profesional combina Deep Research + verificación + síntesis. Practica con el OVA "Casos Prácticos de Gemini".'
    },
    {
      id: 'm3q8', question: 'Un periodista necesita investigar un tema complejo (cambio climático en Latinoamérica) con fuentes verificables. Tiene 2 horas para preparar un informe. ¿Qué flujo con Gemini le daría el mejor resultado en el menor tiempo?',
      options: [
        { id: 'm3q8_a', label: 'Usar Deep Research con palabras clave específicas, luego verificar las fuentes citadas y sintetizar en un informe estructurado en Google Docs con Gemini integrado' },
        { id: 'm3q8_b', label: 'Leer 20 artículos manualmente en Google y escribir el informe desde cero' },
        { id: 'm3q8_c', label: 'Pedirle al chat de Gemini que resuma todo de una sola vez sin pedir fuentes' },
        { id: 'm3q8_d', label: 'Usar solo Google Search tradicional sin ayuda de IA' }
      ],
      correctAnswer: 'm3q8_a', topic: 'Deep Research', difficulty: 'medio',
      feedback: 'La combinación Deep Research + verificación + Gemini en Google Docs acelera la investigación sin sacrificar precisión. Deep Research encuentra y analiza fuentes, tú verificas y sintetizas. Repasa el tema "Investiga como un Detective Digital".'
    },
    {
      id: 'm3q9', question: 'Gemini puede procesar texto, imágenes, audio y video en una misma conversación. ¿Cómo se llama esta capacidad?',
      options: [
        { id: 'm3q9_a', label: 'Multimodalidad — Gemini puede entender y razonar sobre múltiples tipos de contenido simultáneamente' },
        { id: 'm3q9_b', label: 'Transfer learning — Gemini aprende de un tipo de dato y lo aplica a otro' },
        { id: 'm3q9_c', label: 'Tokenización avanzada — Gemini convierte todo a tokens numéricos' },
        { id: 'm3q9_d', label: 'Procesamiento por lotes — Gemini procesa cada tipo de dato por separado' }
      ],
      correctAnswer: 'm3q9_a', topic: 'Multimodalidad', difficulty: 'fácil',
      feedback: 'La multimodalidad es una de las capacidades más potentes de Gemini: puedes mostrarle una imagen, pedirle que analice un video, y que lea un PDF todo en la misma conversación. Revisa el OVA "Gemini en Acción: Casos Reales".'
    },
    {
      id: 'm3q10', question: 'Estás en una reunión y necesitas que Gemini analice un gráfico financiero que te acaban de mostrar en la computadora, sin tener que subir el archivo. ¿Cómo puedes hacerlo?',
      options: [
        { id: 'm3q10_a', label: 'Usar Gemini Live para compartir pantalla y hacer preguntas en tiempo real sobre lo que se muestra' },
        { id: 'm3q10_b', label: 'Tomar foto del gráfico con el celular y subirla después de la reunión' },
        { id: 'm3q10_c', label: 'Dibujar el gráfico de memoria y pedirle a Gemini que lo interprete' },
        { id: 'm3q10_d', label: 'No es posible — Gemini solo analiza archivos subidos explícitamente' }
      ],
      correctAnswer: 'm3q10_a', topic: 'Gemini Live', difficulty: 'medio',
      feedback: 'Gemini Live permite interacciones en tiempo real con capacidad de compartir pantalla, ideal para reuniones y sesiones de trabajo colaborativo. Repasa el tema "Gemini en Tiempo Real" en los recursos del módulo.'
    },
    {
      id: 'm3q11', question: '¿Cuál es la ventaja de usar extensiones de Gemini (Google Flights, Hotels, Maps) integradas en el chat?',
      options: [
        { id: 'm3q11_a', label: 'Gemini puede acceder a información actualizada de servicios de Google sin salir del chat, dando respuestas contextuales con datos en vivo' },
        { id: 'm3q11_b', label: 'Las extensiones reemplazan completamente a los sitios web de Google' },
        { id: 'm3q11_c', label: 'Solo funcionan para reservar vuelos, no para otras tareas' },
        { id: 'm3q11_d', label: 'Requieren una suscripción adicional a Google One' }
      ],
      correctAnswer: 'm3q11_a', topic: 'Extensiones Gemini', difficulty: 'medio',
      feedback: 'Las extensiones conectan Gemini con servicios de Google en tiempo real, permitiendo respuestas contextuales y actualizadas. Es parte del ecosistema de grounding de Gemini. Repasa el tema "Extiende las Capacidades de Gemini".'
    },
    {
      id: 'm3q12', question: 'Un estudiante universitario usa Gemini Advanced para investigar. ¿Qué beneficio adicional obtiene con Google One AI Premium?',
      options: [
        { id: 'm3q12_a', label: 'Acceso a Gemini en Gmail, Docs, Sheets y Slides, más almacenamiento en la nube y las capacidades más avanzadas del modelo' },
        { id: 'm3q12_b', label: 'Solo más almacenamiento en Google Drive, sin beneficios de IA' },
        { id: 'm3q12_c', label: 'Acceso ilimitado a DALL-E 3 para generar imágenes' },
        { id: 'm3q12_d', label: 'Eliminación completa de los límites de uso de Gemini' }
      ],
      correctAnswer: 'm3q12_a', topic: 'Google One', difficulty: 'fácil',
      feedback: 'Google One AI Premium integra Gemini en todo Workspace + da acceso al modelo más avanzado + almacenamiento adicional. Es el plan más completo para estudiantes e investigadores. Revisa el tema "Planes y Suscripciones de Gemini".'
    },
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
    {
      id: 'm4q9', question: 'Tienes 10 fuentes en tu notebook y quieres extraer solo las conclusiones principales sobre un tema específico (ej: "eficiencia energética"). ¿Cuál es la forma más eficiente de hacerlo?',
      options: [
        { id: 'm4q9_a', label: 'Hacer una pregunta específica a NotebookLM como "Según mis fuentes, ¿cuáles son las conclusiones principales sobre eficiencia energética? Las respuestas deben citar textualmente las fuentes"' },
        { id: 'm4q9_b', label: 'Leer las 10 fuentes completas una por una y tomar notas manualmente' },
        { id: 'm4q9_c', label: 'Pedirle a ChatGPT que haga el análisis sin subir las fuentes' },
        { id: 'm4q9_d', label: 'Usar la Guía de Estudio automática y copiar todo sin filtrar' }
      ],
      correctAnswer: 'm4q9_a', topic: 'NotebookLM', difficulty: 'medio',
      feedback: 'La ventaja de NotebookLM es que puedes hacer preguntas específicas y obtienes respuestas citadas de tus fuentes. No necesitas leer todo — la IA encuentra las secciones relevantes por ti. Repasa el video "Primeros Pasos con NotebookLM".'
    },
    {
      id: 'm4q10', question: '¿Cuál es el límite actual de fuentes que puedes agregar a un solo notebook en NotebookLM?',
      options: [
        { id: 'm4q10_a', label: 'Hasta 50 fuentes por notebook, cada fuente puede tener hasta 500,000 palabras aproximadamente' },
        { id: 'm4q10_b', label: 'Ilimitado, puedes subir todas las fuentes que quieras sin restricción' },
        { id: 'm4q10_c', label: 'Máximo 10 fuentes por notebook, sin importar su tamaño' },
        { id: 'm4q10_d', label: 'Máximo 100 fuentes pero cada una de solo 10 páginas' }
      ],
      correctAnswer: 'm4q10_a', topic: 'Límites NotebookLM', difficulty: 'medio',
      feedback: 'Conocer los límites técnicos de las herramientas es parte del uso profesional. NotebookLM permite hasta 50 fuentes con un límite de palabras considerable. Revisa la documentación y los recursos del módulo sobre NotebookLM.'
    },
    {
      id: 'm4q11', question: 'Generas un Audio Overview desde tu notebook y los anfitriones IA conversan sobre tus fuentes. ¿Qué control tienes sobre el contenido del audio generado?',
      options: [
        { id: 'm4q11_a', label: 'Puedes personalizar los temas a cubrir y regenerar si no te gusta el resultado, pero el formato es conversacional entre dos voces IA' },
        { id: 'm4q11_b', label: 'No tienes ningún control, el audio se genera automáticamente sin opciones' },
        { id: 'm4q11_c', label: 'Puedes elegir la voz exacta, el tono y escribir el guion completo manualmente' },
        { id: 'm4q11_d', label: 'Solo puedes decidir si incluir música de fondo o no' }
      ],
      correctAnswer: 'm4q11_a', topic: 'Audio Overview', difficulty: 'fácil',
      feedback: 'Audio Overview genera un podcast conversacional automático. Puedes regenerarlo si no se ajusta a lo que necesitas y orientarlo con las instrucciones del notebook. Revisa el video "Audio Overview: Tu Contenido en Podcast".'
    },
    {
      id: 'm4q12', question: 'Un abogado sube 30 contratos legales a un notebook y pregunta: "¿Qué contratos tienen cláusulas de confidencialidad que expiran en menos de 2 años?" NotebookLM responde citando 5 contratos específicos con números de página. ¿Qué validación adicional debería hacer el abogado?',
      options: [
        { id: 'm4q12_a', label: 'Hacer clic en cada cita para verificar que la interpretación de la IA coincide con el texto completo de la cláusula, no solo el fragmento citado' },
        { id: 'm4q12_b', label: 'Confiar en la respuesta porque NotebookLM cita textualmente las fuentes' },
        { id: 'm4q12_c', label: 'Revisar solo 1 de los 5 contratos citados para ahorrar tiempo' },
        { id: 'm4q12_d', label: 'Pedirle a ChatGPT que verifique si NotebookLM tenía razón' }
      ],
      correctAnswer: 'm4q12_a', topic: 'Validación Legal', difficulty: 'difícil',
      feedback: 'En contextos legales, la verificación humana es obligatoria. Aunque NotebookLM cita textualmente, el contexto completo de la cláusula puede cambiar la interpretación. La IA acelera la revisión, pero el profesional legal es el responsable final. Repasa el tema de verificación de fuentes en el módulo.'
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
    },
    {
      id: 'm5q9', question: 'La Unión Europea clasifica los sistemas de IA por nivel de riesgo (mínimo, limitado, alto, inaceptable). Un sistema que determina el acceso a servicios financieros esenciales (como aprobar una hipoteca) entraría en la categoría de "alto riesgo". ¿Qué obligación impone esta clasificación?',
      options: [
        { id: 'm5q9_a', label: 'Evaluaciones de conformidad, documentación técnica, transparencia y supervisión humana obligatoria' },
        { id: 'm5q9_b', label: 'Prohibición total del uso de IA en servicios financieros' },
        { id: 'm5q9_c', label: 'Registro voluntario sin obligaciones específicas' },
        { id: 'm5q9_d', label: 'Solo pagar una tasa anual por usar el sistema' }
      ],
      correctAnswer: 'm5q9_a', topic: 'Marco Regulatorio', difficulty: 'difícil',
      feedback: 'El AI Act europeo es el primer marco regulatorio integral de IA. Los sistemas de alto riesgo requieren evaluaciones de conformidad, documentación, transparencia y supervisión humana. Es importante conocer el marco regulatorio al desarrollar soluciones de IA. Revisa el tema "Marco Legal y Regulatorio de la IA".'
    },
    {
      id: 'm5q10', question: 'Un equipo de data scientists entrena un modelo para predecir éxito académico. Descubren que el modelo asigna puntuaciones más bajas a estudiantes de ciertas regiones geográficas, incluso controlando por calificaciones y recursos. ¿Qué métrica de equidad deberían priorizar para diagnosticar el problema?',
      options: [
        { id: 'm5q10_a', label: 'Paridad demográfica — verificar si la tasa de predicción positiva es similar entre grupos geográficos' },
        { id: 'm5q10_b', label: 'Precisión general del modelo sin desglosar por grupos' },
        { id: 'm5q10_c', label: 'Velocidad de entrenamiento del modelo' },
        { id: 'm5q10_d', label: 'Cantidad total de datos de entrenamiento' }
      ],
      correctAnswer: 'm5q10_a', topic: 'Equidad Algorítmica', difficulty: 'difícil',
      feedback: 'La paridad demográfica (demographic parity) mide si las predicciones del modelo son equitativas entre grupos. Si el modelo predice éxito con menor frecuencia para ciertas regiones, hay un sesgo que debe investigarse y corregirse. Revisa el OVA "Laboratorio: Detecta el Sesgo".'
    },
    {
      id: 'm5q11', question: 'Estás desarrollando una app educativa con IA que recopila datos de rendimiento de estudiantes. Siguiendo el principio de minimización de datos, ¿cuál es la práctica correcta?',
      options: [
        { id: 'm5q11_a', label: 'Recopilar solo los datos estrictamente necesarios para la funcionalidad educativa, con consentimiento informado y política de eliminación clara' },
        { id: 'm5q11_b', label: 'Recopilar todos los datos posibles "por si acaso" se necesitan después' },
        { id: 'm5q11_c', label: 'Compartir los datos automáticamente con terceros sin notificar a los usuarios' },
        { id: 'm5q11_d', label: 'Almacenar los datos indefinidamente sin plan de eliminación' }
      ],
      correctAnswer: 'm5q11_a', topic: 'Privacidad por Diseño', difficulty: 'medio',
      feedback: 'La minimización de datos es un principio fundamental de privacidad: solo recopila lo necesario, con consentimiento, y ten un plan claro de eliminación. Repasa el tema "Protege tus Datos en la Era de la IA" y el PDF "Manual de Privacidad en IA".'
    },
    {
      id: 'm5q12', question: 'Un equipo de IA documenta su modelo con una model card (tarjeta de modelo). Según las mejores prácticas, ¿qué información DEBE incluir?',
      options: [
        { id: 'm5q12_a', label: 'Propósito del modelo, datos de entrenamiento, métricas de rendimiento por subgrupos, limitaciones conocidas y consideraciones éticas' },
        { id: 'm5q12_b', label: 'Solo el nombre del modelo y la versión' },
        { id: 'm5q12_c', label: 'Los nombres completos de los desarrolladores y sus salarios' },
        { id: 'm5q12_d', label: 'El código fuente completo del modelo' }
      ],
      correctAnswer: 'm5q12_a', topic: 'Documentación Ética', difficulty: 'medio',
      feedback: 'Las model cards son un estándar de transparencia en IA. Incluyen propósito, datos, métricas por subgrupo, limitaciones y consideraciones éticas. Permiten a los usuarios entender las capacidades y limitaciones del modelo antes de usarlo. Repasa el tema de transparencia en IA en los recursos del módulo.'
    }
  ]
};

export function getModuleExams(locale) {
  if (locale && locale.startsWith('en')) {
    return MODULE_EXAMS_EN;
  }
  return MODULE_EXAMS;
}
