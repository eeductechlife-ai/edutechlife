import React from 'react';
import {
  Brain, FileText, Play, Headphones, Star, AlertTriangle,
  BookOpen, Link as LinkIcon, Lightbulb
} from 'lucide-react';

export const MODULE_DATA = [
  {
    id: 1, title: "¿Qué es NotebookLM?", icon: <Brain className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Tu Asistente de Investigación", text: "NotebookLM es una herramienta experimental de Google impulsada por inteligencia artificial. A diferencia de un chatbot tradicional que busca en toda la web, NotebookLM se convierte en un experto personalizado únicamente en los documentos que tú le proporcionas." },
      { type: 'comparison', title: "NotebookLM vs ChatGPT", text: "Es crucial entender la diferencia para usar la herramienta correcta:", items: [
        { name: "Fuente de datos", nb: "Tus propios documentos subidos.", gpt: "Toda la internet." },
        { name: "Alucinaciones (Errores)", nb: "Casi nulas. Incluye citas directas a tu texto.", gpt: "Posibles. Puede inventar información." },
        { name: "Objetivo principal", nb: "Sintetizar y estudiar material propio.", gpt: "Generar ideas, redacción y consultas generales." }
      ]},
      { type: 'activity', title: "Comprueba tu aprendizaje", text: "Imagina que tienes un PDF de 200 páginas sobre Historia de Colombia y necesitas un resumen detallado con referencias exactas a las páginas. ¿Qué herramienta eliges?", options: [
        { text: "ChatGPT, porque sabe mucho de historia.", correct: false, feedback: "Incorrecto. ChatGPT podría resumir conceptos generales, pero no te dará las citas exactas de ese PDF específico." },
        { text: "NotebookLM, porque trabajará exclusivamente con mi PDF.", correct: true, feedback: "¡Excelente! NotebookLM analizará tu documento y te dará respuestas con citas directas al texto original." }
      ]}
    ]
  },
  {
    id: 2, title: "Herramientas y Fuentes", icon: <FileText className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Múltiples Formatos", text: "Para que NotebookLM funcione, debes crear un 'Cuaderno' (Notebook) y agregarle 'Fuentes'. Puedes subir varios tipos de archivos para enriquecer tu investigación." },
      { type: 'grid', title: "Tipos de Fuentes Aceptadas", items: [
        { title: "Archivos Locales", desc: "PDFs, Archivos de texto (.txt) y Markdown.", icon: <FileText className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Google Drive", desc: "Google Docs y Google Slides directamente desde tu nube.", icon: <BookOpen className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Enlaces Web", desc: "URLs de artículos o páginas web públicas.", icon: <LinkIcon className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Multimedia", desc: "Audios (mp3) y Videos de YouTube.", icon: <Headphones className="w-8 h-8 text-[#2FA8C6]" /> }
      ]},
      { type: 'activity', title: "Comprueba tu aprendizaje", text: "¿Cuál es la principal ventaja de subir diferentes tipos de fuentes (ej. un PDF y un video de YouTube) a un mismo cuaderno?", options: [
        { text: "La IA puede cruzar información y encontrar conexiones entre el texto y el video.", correct: true, feedback: "¡Exacto! Al mezclar fuentes, NotebookLM sintetiza la información de todas ellas, dándote una visión global." },
        { text: "Hace que la interfaz de la aplicación se vea más bonita.", correct: false, feedback: "Incorrecto. La verdadera ventaja es el cruce de información para un mejor análisis." }
      ]}
    ]
  },
  {
    id: 3, title: "Guía Paso a Paso", icon: <Play className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Tu Primer Cuaderno", text: "Crear tu espacio de estudio es muy sencillo. Solo necesitas una cuenta de Google y seguir estos 3 pasos fundamentales." },
      { type: 'steps', title: "Flujo de Trabajo", items: [
        "1. Crear: Haz clic en 'Nuevo Cuaderno' en la página principal.",
        "2. Alimentar: Sube tus PDFs, notas de clase o enlaces web en la sección de fuentes.",
        "3. Interactuar: Usa la barra de chat para hacer preguntas, pedir resúmenes o crear guías de estudio."
      ]},
      { type: 'activity', title: "Comprueba tu aprendizaje", text: "Después de subir tus fuentes, la IA te da una respuesta, pero quieres saber de dónde sacó esa información. ¿Qué debes hacer?", options: [
        { text: "Buscar la respuesta en Google manualmente.", correct: false, feedback: "Incorrecto. NotebookLM ya hace ese trabajo por ti." },
        { text: "Hacer clic en los números de 'Citas' que aparecen al final del texto generado.", correct: true, feedback: "¡Correcto! Esos números te llevan directamente a la línea exacta de tu documento original." }
      ]}
    ]
  },
  {
    id: 4, title: "Audio Overview (Podcasts)", icon: <Headphones className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Tus Apuntes en Audio", text: "Una de las herramientas más innovadoras de NotebookLM es el 'Audio Overview' (Resumen en Audio). Con un solo clic, la IA convierte todos tus documentos en una conversación estilo podcast entre dos presentadores virtuales." },
      { type: 'text', title: "¿Para qué sirve?", text: "Es ideal para estudiantes auditivos o para aprovechar tiempos muertos (como ir en transporte público). Los presentadores virtuales debaten los temas de tus documentos, hacen bromas y explican conceptos complejos con analogías fáciles de entender." },
      { type: 'activity', title: "Comprueba tu aprendizaje", text: "¿Cuál sería el mejor momento para utilizar la función de Audio Overview?", options: [
        { text: "Cuando tengo que entregar un ensayo escrito en 10 minutos.", correct: false, feedback: "Incorrecto. Para eso sería mejor pedirle al chat un esquema escrito." },
        { text: "Cuando voy en el bus camino a la universidad y quiero repasar mis lecturas.", correct: true, feedback: "¡Perfecto! El formato podcast es ideal para aprender mientras estás en movimiento sin mirar una pantalla." }
      ]}
    ]
  },
  {
    id: 5, title: "Aplicaciones Académicas", icon: <Star className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Casos de Uso Reales", text: "NotebookLM se adapta a cualquier carrera. Veamos cómo lo usan diferentes estudiantes." },
      { type: 'grid', title: "Ejemplos por Facultad", items: [
        { title: "Derecho", desc: "Subir decenas de sentencias judiciales para encontrar jurisprudencia cruzada.", icon: <BookOpen className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Medicina", desc: "Subir papers científicos médicos para extraer síntomas y tratamientos en una tabla.", icon: <Brain className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Ingeniería", desc: "Subir manuales técnicos extensos para buscar especificaciones precisas.", icon: <Lightbulb className="w-8 h-8 text-[#2FA8C6]" /> }
      ]},
      { type: 'activity', title: "Comprueba tu aprendizaje", text: "Eres estudiante de Humanidades y tienes que leer 3 libros diferentes sobre la Revolución Francesa. ¿Cómo te ayuda NotebookLM?", options: [
        { text: "Lee los libros por mí y yo no tengo que hacer nada.", correct: false, feedback: "Incorrecto. La IA asiste, pero el aprendizaje requiere tu análisis crítico." },
        { text: "Puedo subir los 3 libros y pedirle que me muestre en qué puntos los autores no están de acuerdo.", correct: true, feedback: "¡Excelente! El análisis comparativo de múltiples fuentes es el superpoder de NotebookLM." }
      ]}
    ]
  },
  {
    id: 6, title: "Consejos y Limitaciones", icon: <AlertTriangle className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Buenas Prácticas", text: "Recuerda: la IA es un asistente, no un reemplazo de tu intelecto. Siempre verifica la información haciendo clic en las citas." },
      { type: 'text', title: "Limitaciones Actuales", text: "NotebookLM no busca en internet en tiempo real (solo usa lo que tú le subes). Además, tiene un límite de fuentes por cuaderno (actualmente 50) y un límite de palabras por documento." },
      { type: 'activity', title: "Comprueba tu aprendizaje", text: "Estás haciendo una investigación sobre una noticia de última hora que ocurrió esta mañana. ¿Es NotebookLM tu mejor opción?", options: [
        { text: "No, porque NotebookLM no tiene conexión a internet para buscar noticias recientes.", correct: true, feedback: "¡Correcto! Para eventos en tiempo real, es mejor un buscador web tradicional o ChatGPT con navegación web." },
        { text: "Sí, siempre es la mejor opción para cualquier cosa.", correct: false, feedback: "Incorrecto. Conoce las limitaciones de tus herramientas para usarlas adecuadamente." }
      ]}
    ]
  }
];

export const FINAL_CHALLENGE = [
  { question: "Un estudiante tiene 20 PDFs, 3 videos de YouTube y notas personales para preparar su tesis. ¿Qué estrategia con NotebookLM sería más eficiente y por qué?", options: [
    { text: "Crear un cuaderno diferente para cada tipo de archivo para no confundir a la IA.", correct: false },
    { text: "Subir todo al mismo cuaderno para que la IA cruce la información, encuentre patrones y genere conexiones entre los PDFs y los videos.", correct: true },
    { text: "Leer los PDFs por su cuenta y solo subir los videos a la plataforma.", correct: false }
  ], feedback: "Agrupar fuentes relacionadas permite análisis complejos e integrales." },
  { question: "Un compañero usa respuestas de IA sin verificar fuentes. ¿Cómo NotebookLM ayuda a reducir ese problema específico?", options: [
    { text: "NotebookLM bloquea automáticamente las respuestas incorrectas.", correct: false },
    { text: "NotebookLM te obliga a leer todo el documento antes de responder.", correct: false },
    { text: "NotebookLM incluye hipervínculos (citas) en cada respuesta que te llevan directamente al párrafo exacto del documento original.", correct: true }
  ], feedback: "Las citas verificables son la clave de la confianza académica en NotebookLM." },
  { question: "¿Cuál sería la mejor forma de usar 'Audio Overview' para un estudiante con largos tiempos de transporte diario?", options: [
    { text: "Generar un podcast con todas sus lecturas complejas de la semana para escucharlas y asimilar conceptos de forma conversacional en el bus.", correct: true },
    { text: "Usarlo para que la IA dicte el texto exacto del libro de forma robótica mientras duerme.", correct: false },
    { text: "Grabar su propia voz leyendo y subirla para que la IA la edite.", correct: false }
  ], feedback: "El Audio Overview convierte textos densos en charlas amenas, ideales para tiempos de tránsito." },
  { question: "¿Por qué mezclar diferentes tipos de fuentes (ej. artículos científicos + videos de entrevistas) mejora el análisis en NotebookLM?", options: [
    { text: "Porque hace que el cuaderno se vea más profesional y organizado.", correct: false },
    { text: "Porque proporciona diferentes perspectivas sobre un mismo tema, permitiendo a la IA dar respuestas más ricas y multidimensionales.", correct: true },
    { text: "Porque la plataforma obliga a subir al menos 3 formatos distintos.", correct: false }
  ], feedback: "La diversidad de fuentes enriquece el contexto y la calidad de las respuestas de la IA." },
  { question: "Analiza este escenario: Un estudiante debe entregar un informe sobre el impacto económico del clima de la semana actual. ¿Por qué NotebookLM NO sería la herramienta principal?", options: [
    { text: "Porque NotebookLM es malo para analizar temas de economía y matemáticas.", correct: false },
    { text: "Porque la interfaz no soporta números ni gráficas financieras.", correct: false },
    { text: "Porque NotebookLM se basa en documentos subidos estáticos y no realiza búsquedas web en vivo para obtener datos climáticos de la semana actual.", correct: true }
  ], feedback: "Es vital saber cuándo usar IA de análisis cerrado vs IA conectada a la web en tiempo real." }
];
