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
      id: 'm1q2', question: '¿Qué técnica permite guiar el razonamiento de la IA paso a paso?',
      options: [
        { id: 'm1q2_a', label: 'Zero-Shot Prompting' }, { id: 'm1q2_b', label: 'Chain-of-Thought' },
        { id: 'm1q2_c', label: 'Few-Shot Prompting' }, { id: 'm1q2_d', label: 'Contexto Dinámico' }
      ],
      correctAnswer: 'm1q2_b', topic: 'Chain-of-Thought', difficulty: 'medio',
      feedback: 'Revisa los recursos sobre técnicas avanzadas de prompting en el módulo.'
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
      id: 'm1q4', question: '¿Qué es el "Zero-Shot Prompting" y cuándo es más efectivo?',
      options: [
        { id: 'm1q4_a', label: 'Dar 0 instrucciones a la IA' },
        { id: 'm1q4_b', label: 'Obtener buenos resultados sin proporcionar ejemplos previos' },
        { id: 'm1q4_c', label: 'Usar prompts con 0 palabras' },
        { id: 'm1q4_d', label: 'Reiniciar la conversación con la IA' }
      ],
      correctAnswer: 'm1q4_b', topic: 'Zero-Shot Prompting', difficulty: 'medio',
      feedback: 'Revisa el video "Anatomía de un Prompt en 6 Minutos" y la guía interactiva.'
    },
    {
      id: 'm1q5', question: '¿Cómo se aplica el "Contexto Dinámico" en prompts complejos?',
      options: [
        { id: 'm1q5_a', label: 'Haciendo prompts más largos automáticamente' },
        { id: 'm1q5_b', label: 'Personalizando respuestas según necesidades específicas del usuario' },
        { id: 'm1q5_c', label: 'Eliminando la necesidad de pensar en el contexto' },
        { id: 'm1q5_d', label: 'Usando siempre el mismo contexto para todas las preguntas' }
      ],
      correctAnswer: 'm1q5_b', topic: 'Contexto Dinámico', difficulty: 'difícil',
      feedback: 'Estudia el OVA "Tu Primer Prompt: Laboratorio Interactivo" para dominar el contexto.'
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
      id: 'm1q7', question: '¿Cuál es la diferencia entre "Few-Shot" y "Zero-Shot" prompting?',
      options: [
        { id: 'm1q7_a', label: 'Few-Shot proporciona ejemplos, Zero-Shot no' },
        { id: 'm1q7_b', label: 'Zero-Shot es más rápido que Few-Shot' },
        { id: 'm1q7_c', label: 'Few-Shot usa menos palabras' },
        { id: 'm1q7_d', label: 'No hay diferencia significativa' }
      ],
      correctAnswer: 'm1q7_a', topic: 'Técnicas de Prompting', difficulty: 'difícil',
      feedback: 'Compara las técnicas en el laboratorio "Tu Primer Prompt".'
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
      id: 'm2q1', question: '¿Cuál es la principal ventaja de usar las herramientas integradas de ChatGPT como Búsqueda Web y Análisis de Datos?',
      options: [
        { id: 'm2q1_a', label: 'Hacen que ChatGPT responda más rápido' },
        { id: 'm2q1_b', label: 'Permiten acceder a información actualizada y procesar datos en tiempo real' },
        { id: 'm2q1_c', label: 'Eliminan la necesidad de escribir prompts' },
        { id: 'm2q1_d', label: 'Solo funcionan en la versión gratuita' }
      ],
      correctAnswer: 'm2q1_b', topic: 'Herramientas ChatGPT', difficulty: 'fácil',
      feedback: 'Revisa el PDF "Las Herramientas Integradas de ChatGPT" y el video "ChatGPT desde Cero".'
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
      id: 'm2q3', question: '¿Qué diferencia principal hay entre un GPT personalizado y ChatGPT estándar?',
      options: [
        { id: 'm2q3_a', label: 'El GPT personalizado es más barato' },
        { id: 'm2q3_b', label: 'El GPT personalizado tiene instrucciones fijas, conocimiento propio y puede conectarse a APIs externas' },
        { id: 'm2q3_c', label: 'ChatGPT estándar no puede procesar textos largos' },
        { id: 'm2q3_d', label: 'El GPT personalizado funciona sin internet' }
      ],
      correctAnswer: 'm2q3_b', topic: 'GPTs Personalizados', difficulty: 'medio',
      feedback: 'Revisa el video "Crea tu Primer GPT en 18 Minutos" y la guía visual de GPTs.'
    },
    {
      id: 'm2q4', question: '¿Para qué sirve la función de Canvas en ChatGPT?',
      options: [
        { id: 'm2q4_a', label: 'Para dibujar imágenes desde cero' },
        { id: 'm2q4_b', label: 'Para editar secciones específicas de documentos largos sin reescribir todo el texto' },
        { id: 'm2q4_c', label: 'Para traducir documentos automáticamente' },
        { id: 'm2q4_d', label: 'Para crear presentaciones animadas' }
      ],
      correctAnswer: 'm2q4_b', topic: 'Canvas', difficulty: 'medio',
      feedback: 'Canvas es ideal para trabajar con documentos largos. Explora el OVA "Explora el Ecosistema ChatGPT".'
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
      id: 'm2q7', question: '¿Cuál es el mayor beneficio de automatizar tareas con un GPT personalizado según el módulo?',
      options: [
        { id: 'm2q7_a', label: 'Reemplaza completamente al trabajador humano' },
        { id: 'm2q7_b', label: 'Libera tiempo para enfocarte en tareas creativas y de alto valor' },
        { id: 'm2q7_c', label: 'Reduce el costo de la suscripción de ChatGPT' },
        { id: 'm2q7_d', label: 'Aumenta la velocidad del internet' }
      ],
      correctAnswer: 'm2q7_b', topic: 'Automatización', difficulty: 'fácil',
      feedback: 'La automatización con IA te libera de tareas repetitivas. Repasa el OVA "Laboratorio: Construye un GPT".'
    },
    {
      id: 'm2q8', question: 'Un estudiante usa ChatGPT para escribir su ensayo completo y lo entrega sin leerlo. Según las buenas prácticas del módulo, ¿cuál es el uso correcto de la IA?',
      options: [
        { id: 'm2q8_a', label: 'Usar la IA para generar ideas, recibir retroalimentación y mejorar borradores propios' },
        { id: 'm2q8_b', label: 'La IA debe hacer todo el trabajo porque es más rápida' },
        { id: 'm2q8_c', label: 'Usar herramientas para ocultar que se usó IA' },
        { id: 'm2q8_d', label: 'Evitar completamente el uso de IA en la educación' }
      ],
      correctAnswer: 'm2q8_a', topic: 'Uso Responsable', difficulty: 'fácil',
      feedback: 'La IA es un compañero cognitivo, no un reemplazo. Revisa el OVA "Laboratorio: Construye un GPT".'
    }
  ],
  3: [
    {
      id: 'm3q1', question: '¿Qué hace único a Google Gemini frente a otros modelos de IA?',
      options: [
        { id: 'm3q1_a', label: 'Solo funciona en teléfonos Android' },
        { id: 'm3q1_b', label: 'Es capaz de procesar texto, imágenes, audio y video simultáneamente de forma multimodal' },
        { id: 'm3q1_c', label: 'Es el único modelo de IA que existe' },
        { id: 'm3q1_d', label: 'Solo genera imágenes, no texto' }
      ],
      correctAnswer: 'm3q1_b', topic: 'Gemini Multimodal', difficulty: 'fácil',
      feedback: 'Gemini es multimodal: entiende y procesa texto, imágenes, audio y video al mismo tiempo. Repasa el video "Gemini en 14 Minutos".'
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
      id: 'm4q1', question: '¿Cuál es el "superpoder" principal de NotebookLM que lo diferencia de otros asistentes de IA?',
      options: [
        { id: 'm4q1_a', label: 'Busca información en todo internet para darte respuestas más largas' },
        { id: 'm4q1_b', label: 'Trabaja exclusivamente con tus propios documentos y fuentes, sin inventar información' },
        { id: 'm4q1_c', label: 'Traduce documentos a más de 100 idiomas automáticamente' },
        { id: 'm4q1_d', label: 'Crea videos animados a partir de tus textos' }
      ],
      correctAnswer: 'm4q1_b', topic: 'NotebookLM', difficulty: 'fácil',
      feedback: 'NotebookLM solo usa tus documentos, eliminando casi por completo el riesgo de alucinaciones. Repasa el video "Primeros Pasos con NotebookLM".'
    },
    {
      id: 'm4q2', question: '¿Cuántos documentos o fuentes diferentes puedes subir a un mismo cuaderno en NotebookLM?',
      options: [
        { id: 'm4q2_a', label: 'Solo 1 fuente muy larga a la vez' },
        { id: 'm4q2_b', label: 'Hasta 5 fuentes pequeñas' },
        { id: 'm4q2_c', label: 'Fuentes ilimitadas' },
        { id: 'm4q2_d', label: 'Hasta 50 fuentes de diversos formatos (PDFs, Docs, enlaces, videos)' }
      ],
      correctAnswer: 'm4q2_d', topic: 'NotebookLM', difficulty: 'fácil',
      feedback: 'Puedes subir hasta 50 fuentes en formatos variados. Revisa la guía y el laboratorio del módulo.'
    },
    {
      id: 'm4q3', question: '¿Qué es la función "Audio Overview" de NotebookLM?',
      options: [
        { id: 'm4q3_a', label: 'Un reproductor de música de fondo mientras estudias' },
        { id: 'm4q3_b', label: 'Un podcast generado por IA donde dos voces conversan y analizan tus documentos' },
        { id: 'm4q3_c', label: 'Una alarma que te avisa cuando terminas de leer' },
        { id: 'm4q3_d', label: 'Un audiolibro narrado por tu propia voz clonada' }
      ],
      correctAnswer: 'm4q3_b', topic: 'Audio Overview', difficulty: 'fácil',
      feedback: 'Audio Overview convierte tus apuntes en podcasts. Ideal para aprender mientras viajas. Repasa el video "Convierte PDFs en Podcasts".'
    },
    {
      id: 'm4q4', question: '¿Por qué se dice que NotebookLM está "libre de alucinaciones"?',
      options: [
        { id: 'm4q4_a', label: 'Porque no te permite subir documentos de ciencia ficción' },
        { id: 'm4q4_b', label: 'Porque la IA solo responde basándose en tus documentos, incluyendo citas textuales verificables' },
        { id: 'm4q4_c', label: 'Porque bloquea páginas web con virus' },
        { id: 'm4q4_d', label: 'Porque corrige tu ortografía automáticamente' }
      ],
      correctAnswer: 'm4q4_b', topic: 'Precisión', difficulty: 'medio',
      feedback: 'Al estar limitado a tus fuentes, NotebookLM no inventa datos. Cada respuesta incluye citas que puedes verificar.'
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
      id: 'm4q8', question: '¿Puedes usar NotebookLM para trabajar en equipo con compañeros de clase?',
      options: [
        { id: 'm4q8_a', label: 'No, es una herramienta estrictamente individual' },
        { id: 'm4q8_b', label: 'Sí, puedes compartir tus cuadernos con tu equipo igual que un Google Doc para que todos consulten las mismas fuentes' },
        { id: 'm4q8_c', label: 'Solo si todos usan el mismo modelo de computadora' },
        { id: 'm4q8_d', label: 'Sí, pero solo el creador puede hacer preguntas' }
      ],
      correctAnswer: 'm4q8_b', topic: 'Colaboración', difficulty: 'fácil',
      feedback: 'NotebookLM permite colaboración en equipo como Google Docs. Todos pueden consultar las mismas fuentes.'
    }
  ],
  5: [
    {
      id: 'm5q1', question: 'Un sistema de IA para contratación rechaza sistemáticamente a candidatos de ciertos códigos postales. ¿Qué tipo de sesgo está manifestando?',
      options: [
        { id: 'm5q1_a', label: 'Sesgo de automatización' },
        { id: 'm5q1_b', label: 'Sesgo de datos históricos y representación' },
        { id: 'm5q1_c', label: 'Error de conexión a internet' },
        { id: 'm5q1_d', label: 'Sesgo de velocidad de procesamiento' }
      ],
      correctAnswer: 'm5q1_b', topic: 'Sesgos en IA', difficulty: 'fácil',
      feedback: 'Los sesgos en los datos de entrenamiento reflejan y amplifican desigualdades históricas. Repasa el video "¿Tu IA es Injusta? Descúbrelo Aquí".'
    },
    {
      id: 'm5q2', question: '¿Qué significa que una IA "alucine" y cómo se relaciona con la ética?',
      options: [
        { id: 'm5q2_a', label: 'Que la IA tiene sueños mientras procesa datos' },
        { id: 'm5q2_b', label: 'Que la IA genera información falsa con apariencia de verdad, lo cual es un riesgo ético grave si no se verifica' },
        { id: 'm5q2_c', label: 'Que la IA necesita descansar cada cierto tiempo' },
        { id: 'm5q2_d', label: 'Que la IA puede crear imágenes surrealistas' }
      ],
      correctAnswer: 'm5q2_b', topic: 'Alucinaciones', difficulty: 'fácil',
      feedback: 'Las alucinaciones son información inventada. Como usuario ético, debes verificar siempre. Repasa el laboratorio "Detecta el Sesgo".'
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
      id: 'm5q5', question: '¿Qué principio ético se viola cuando un sistema de IA toma decisiones que afectan a personas sin que puedan entender cómo se llegó a esa conclusión?',
      options: [
        { id: 'm5q5_a', label: 'Principio de velocidad' },
        { id: 'm5q5_b', label: 'Principio de Transparencia y Explicabilidad' },
        { id: 'm5q5_c', label: 'Principio de economía' },
        { id: 'm5q5_d', label: 'Principio de entretenimiento' }
      ],
      correctAnswer: 'm5q5_b', topic: 'Transparencia', difficulty: 'medio',
      feedback: 'La transparencia es un pilar ético fundamental. Los usuarios tienen derecho a entender cómo se toman las decisiones que les afectan.'
    },
    {
      id: 'm5q6', question: 'Según el decálogo del usuario ético presentado en el módulo, ¿qué debes hacer siempre al usar IA en trabajos académicos?',
      options: [
        { id: 'm5q6_a', label: 'Ocultar que usaste IA para que parezca trabajo original' },
        { id: 'm5q6_b', label: 'Declarar explícitamente cuándo y cómo usaste IA, verificando siempre la información antes de usarla' },
        { id: 'm5q6_c', label: 'Usar IA solo para el formato, nunca para el contenido' },
        { id: 'm5q6_d', label: 'Pedirle a la IA que escriba todo y solo revisar la ortografía' }
      ],
      correctAnswer: 'm5q6_b', topic: 'Uso Responsable', difficulty: 'fácil',
      feedback: 'La honestidad académica incluye declarar el uso de IA. Repasa el decálogo del usuario ético en el módulo.'
    },
    {
      id: 'm5q7', question: '¿Qué es el sesgo de automatización y por qué es peligroso?',
      options: [
        { id: 'm5q7_a', label: 'Es cuando la IA se apaga automáticamente' },
        { id: 'm5q7_b', label: 'Es la tendencia humana a confiar excesivamente en las decisiones de la IA, abandonando el pensamiento crítico y la verificación' },
        { id: 'm5q7_c', label: 'Es un error técnico que solo afecta a computadoras viejas' },
        { id: 'm5q7_d', label: 'Es cuando la IA procesa datos más rápido de lo normal' }
      ],
      correctAnswer: 'm5q7_b', topic: 'Sesgo de Automatización', difficulty: 'difícil',
      feedback: 'Confiar ciegamente en la IA es peligroso. Siempre mantén tu pensamiento crítico activo. Repasa el OVA "Laboratorio: Detecta el Sesgo".'
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
