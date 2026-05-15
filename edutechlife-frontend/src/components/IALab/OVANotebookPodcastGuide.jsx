import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, CheckCircle, XCircle, ChevronRight, 
  ChevronLeft, Award, Play, BookOpen, Brain, Star, FileText, 
  Headphones, Lightbulb, AlertTriangle, Link as LinkIcon 
} from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const VoiceReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speak = () => {
    if (isPlaying) { stopSpeech(); setIsPlaying(false); return; }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button onClick={speak}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200 shadow-sm' : 'bg-[#E0F7FA] text-[#004B63] hover:bg-[#B2EBF2] hover:shadow-md'
      }`}
      title="Escuchar con voz de Valerio">
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      )}
      {isPlaying ? 'Detener' : 'Escuchar con Valerio'}
    </button>
  );
};

const MODULE_DATA = [
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

const FINAL_CHALLENGE = [
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

export default function OVANotebookPodcastGuide() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [score, setScore] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [activityState, setActivityState] = useState(null);
  const [challengeAnswers, setChallengeAnswers] = useState([]);

  const totalSlides = MODULE_DATA.reduce((acc, mod) => acc + mod.content.length, 0);
  const currentTotalProgress = Math.min(100, (MODULE_DATA.slice(0, currentModuleIndex).reduce((acc, mod) => acc + mod.content.length, 0) + currentSlide) / totalSlides * 100);

  const handleNarrate = (textToRead) => {
    if (!('speechSynthesis' in window)) return;
    if (isNarrating) { window.speechSynthesis.cancel(); setIsNarrating(false); return; }
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-MX'; utterance.pitch = 1.2; utterance.rate = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const latamVoice = voices.find(v => v.lang.includes('es-MX') || v.lang.includes('es-US') || (v.lang.includes('es') && !v.lang.includes('ES')));
    if (latamVoice) utterance.voice = latamVoice;
    utterance.onend = () => setIsNarrating(false);
    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
  };

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
  }, [currentSlide, currentModuleIndex, currentScreen]);

  const EdutechLogo = () => (
    <div className="flex items-center gap-2 select-none">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A5F] to-[#2FA8C6] rounded-xl rotate-3 shadow-md"></div>
        <Brain className="w-5 h-5 text-white relative z-10" />
      </div>
      <div className="text-xl tracking-tighter flex items-center lowercase font-bold">
        <span className="text-[#1E3A5F]">edu</span><span className="text-[#2FA8C6]">techlife</span>
      </div>
    </div>
  );

  if (currentScreen === 'welcome') {
    return (
      <div className="w-full relative min-h-[500px] bg-gradient-to-br from-gray-50 to-[#EAEAEA] flex items-center justify-center p-6 font-sans">
        <div className="tech-grid-bg" /><div className="hologram-glow-1" /><div className="hologram-glow-2" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
          <div className="md:w-1/2 bg-white p-12 text-[#1E3A5F] flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E0F7FA] text-[#004B63] font-semibold text-[10px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20 mb-6 w-fit">
              <Brain className="w-3.5 h-3.5" /><span>Laboratorio Guiado por Valerio</span>
            </div>
            <EdutechLogo />
            <h1 className="text-3xl md:text-4xl font-bold mb-4 mt-4 font-montserrat" style={{ fontFamily: 'Poppins, sans-serif' }}>NotebookLM en la Práctica</h1>
            <p className="text-lg text-[#2FA8C6] mb-4 font-medium">Tu Asistente de Investigación con IA</p>
            <p className="text-gray-600 leading-relaxed mb-6">Descubre cómo transformar tu manera de estudiar, investigar y organizar información utilizando el poder de la inteligencia artificial de Google.</p>
            <VoiceReader text="Bienvenido al curso interactivo NotebookLM en la Práctica. Soy Valerio, tu coach de IA. A lo largo de 6 módulos aprenderás desde los fundamentos hasta las aplicaciones avanzadas de NotebookLM. Cada módulo incluye actividades prácticas para comprobar tu aprendizaje." />
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-center items-center bg-[#F5F7FA] border-l border-gray-100">
            <Brain className="w-32 h-32 text-[#2FA8C6] mb-8 opacity-80" />
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6 text-center">¿Estás listo para el futuro del aprendizaje?</h2>
            <button onClick={() => setCurrentScreen('modules')}
              className="w-full bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg">
              Comenzar Curso <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
        <style>{`
          .tech-grid-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; background-image: linear-gradient(to right, #EAEAEA 1px, transparent 1px), linear-gradient(to bottom, #EAEAEA 1px, transparent 1px); background-size: 50px 50px; opacity: 0.6; }
          .hologram-glow-1 { position: fixed; top: -15%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(47,168,198,0.15) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
          .hologram-glow-2 { position: fixed; bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(30,58,95,0.08) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 15px rgba(47, 168, 198, 0.4); } 50% { box-shadow: 0 0 30px rgba(47, 168, 198, 0.8); } }
          .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
          ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(47, 168, 198, 0.3); border-radius: 4px; }
        `}</style>
      </div>
    );
  }

  if (currentScreen === 'modules') {
    const module = MODULE_DATA[currentModuleIndex];
    const slide = module.content[currentSlide];
    let textToRead = `${slide.title}. `;
    if (slide.text) textToRead += `${slide.text}. `;
    if (slide.items) {
      if (typeof slide.items[0] === 'string') textToRead += slide.items.join(". ");
      else slide.items.forEach(item => textToRead += `${item.title || item.name}: ${item.desc || item.nb}. `);
    }

    return (
      <div className="w-full bg-[#F5F7FA] font-sans flex flex-col relative" style={{ minHeight: '400px' }}>
        <div className="tech-grid-bg" /><div className="hologram-glow-1" /><div className="hologram-glow-2" />
        <header className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-20 border-b border-gray-100">
          <EdutechLogo />
          <div className="flex-1 w-full md:w-auto mx-0 md:mx-8 order-last md:order-none">
            <div className="flex justify-between text-xs text-gray-500 font-bold mb-1"><span>Progreso</span><span>{Math.round(currentTotalProgress)}%</span></div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F]" initial={{ width: 0 }} animate={{ width: `${currentTotalProgress}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold"><Star className="w-5 h-5 fill-current" /> {score} Pts</div>
            <button onClick={() => handleNarrate(textToRead)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-sm ${isNarrating ? 'bg-red-100 text-red-600' : 'bg-[#E0F7FA] text-[#004B63] hover:bg-[#B2EBF2]'}`}>
              {isNarrating ? <><VolumeX className="w-5 h-5"/> Detener</> : <><Volume2 className="w-5 h-5"/> Audio</>}
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col md:flex-row">
          <aside className="w-full md:w-64 bg-white/90 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Módulos</h3>
              <div className="space-y-2">
                {MODULE_DATA.map((mod, idx) => (
                  <button key={mod.id} onClick={() => { setCurrentModuleIndex(idx); setCurrentSlide(0); setActivityState(null); }}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${currentModuleIndex === idx ? 'bg-[#2FA8C6] text-white shadow-md' : idx < currentModuleIndex ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-blue-50 hover:text-[#2FA8C6]'}`}>
                    {idx < currentModuleIndex ? <CheckCircle className="w-5 h-5" /> : mod.icon}<span className="font-medium text-sm">{mod.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
            <AnimatePresence mode="wait">
              <motion.div key={`${currentModuleIndex}-${currentSlide}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[60vh] flex flex-col">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F7FA] text-[#004B63] font-semibold text-[9px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20 w-fit mb-6">
                  Módulo {currentModuleIndex + 1} / {MODULE_DATA.length}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-6 font-montserrat">{slide.title}</h2>
                <div className="flex-1">
                  {slide.type === 'text' && <p className="text-base text-gray-600 leading-relaxed">{slide.text}</p>}
                  {slide.type === 'comparison' && (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-50 text-[#1E3A5F]"><th className="p-4 border-b-2">Característica</th><th className="p-4 border-b-2 text-[#2FA8C6]">NotebookLM</th><th className="p-4 border-b-2">ChatGPT</th></tr></thead>
                        <tbody>{slide.items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50"><td className="p-4 font-semibold text-gray-700">{item.name}</td><td className="p-4 text-green-600 bg-green-50/30">{item.nb}</td><td className="p-4 text-gray-500">{item.gpt}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  )}
                  {slide.type === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {slide.items.map((item, i) => (
                        <div key={i} className="p-6 border-2 border-gray-100 rounded-xl hover:border-[#2FA8C6] transition-all bg-white hover:shadow-lg flex items-start gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">{item.icon}</div>
                          <div><h4 className="font-bold text-[#1E3A5F] text-lg mb-1">{item.title}</h4><p className="text-gray-500 text-sm">{item.desc}</p></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {slide.type === 'steps' && (
                    <div className="space-y-4 mt-4">
                      {slide.items.map((step, i) => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} key={i}
                          className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 bg-[#2FA8C6] text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">{i + 1}</div>
                          <p className="text-gray-700 font-medium">{step.substring(3)}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {slide.type === 'activity' && (
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mt-4">
                      <p className="text-lg text-[#1E3A5F] font-medium mb-6">{slide.text}</p>
                      <div className="space-y-3">
                        {slide.options.map((opt, i) => (
                          <button key={i} onClick={() => { if (opt.correct) { setActivityState('correct'); if (activityState !== 'correct') setScore(s => s + 20); } else setActivityState('incorrect'); }}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium flex items-center justify-between ${activityState === 'correct' && opt.correct ? 'border-green-500 bg-green-50' : ''} ${activityState === 'incorrect' && !opt.correct ? 'border-red-500 bg-red-50' : ''} ${!activityState ? 'border-gray-200 hover:border-[#2FA8C6] hover:bg-white bg-white' : ''}`}>
                            <span>{opt.text}</span>
                            {activityState === 'correct' && opt.correct && <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />}
                            {activityState === 'incorrect' && !opt.correct && <XCircle className="text-red-500 w-6 h-6 shrink-0" />}
                          </button>
                        ))}
                      </div>
                      {activityState && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-4 rounded-lg font-medium flex items-start gap-3 ${activityState === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {activityState === 'correct' ? <CheckCircle className="w-6 h-6 mt-0.5 shrink-0"/> : <AlertTriangle className="w-6 h-6 mt-0.5 shrink-0"/>}
                          <p>{slide.options.find(o => activityState === 'correct' ? o.correct : !o.correct)?.feedback}</p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
                  <button disabled={currentSlide === 0} onClick={() => { setActivityState(null); setCurrentSlide(s => s - 1); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentSlide === 0 ? 'opacity-0 cursor-default' : 'text-gray-500 hover:bg-gray-100'}`}><ChevronLeft className="w-5 h-5" /> Anterior</button>
                  <div className="flex gap-2">{module.content.map((_, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-[#2FA8C6]' : 'bg-gray-200'}`} />))}</div>
                  {slide.type !== 'activity' ? (
                    <button onClick={() => { setActivityState(null); setCurrentSlide(s => s + 1); }}
                      className="flex items-center gap-2 px-6 py-3 bg-[#1E3A5F] hover:bg-[#152943] text-white rounded-xl font-bold shadow-md transition-all">Siguiente <ChevronRight className="w-5 h-5" /></button>
                  ) : (
                    <button disabled={activityState !== 'correct'} onClick={() => {
                      if (currentModuleIndex < MODULE_DATA.length - 1) { setCurrentModuleIndex(i => i + 1); setCurrentSlide(0); setActivityState(null); }
                      else setCurrentScreen('challenge'); }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all ${activityState === 'correct' ? 'bg-[#2FA8C6] hover:bg-[#258a9e] text-white animate-pulse' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                      {currentModuleIndex < MODULE_DATA.length - 1 ? 'Siguiente Módulo' : 'Desafío Final'} <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <style>{`
          .tech-grid-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; background-image: linear-gradient(to right, #EAEAEA 1px, transparent 1px), linear-gradient(to bottom, #EAEAEA 1px, transparent 1px); background-size: 50px 50px; opacity: 0.6; }
          .hologram-glow-1 { position: fixed; top: -15%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(47,168,198,0.15) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
          .hologram-glow-2 { position: fixed; bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(30,58,95,0.08) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
          ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(47, 168, 198, 0.3); border-radius: 4px; }
        `}</style>
      </div>
    );
  }

  if (currentScreen === 'challenge') {
    const question = FINAL_CHALLENGE[currentSlide];
    return (
      <div className="w-full relative min-h-[500px]" style={{ background: '#1E3A5F' }}>
        <div className="w-full min-h-screen p-4 md:p-8 flex items-center justify-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#1E3A5F] font-montserrat">Desafío Final</h2>
              <p className="text-gray-500 mt-2">Pregunta {currentSlide + 1} de {FINAL_CHALLENGE.length}</p>
            </div>
            <div className="bg-[#F5F7FA] p-6 rounded-xl border border-gray-200 mb-8">
              <p className="text-lg text-gray-800 font-medium leading-relaxed">{question.question}</p>
            </div>
            <div className="space-y-4 mb-8">
              {question.options.map((opt, i) => (
                <button key={i} disabled={activityState !== null} onClick={() => { if (opt.correct) { setActivityState('correct'); setScore(s => s + 50); } else setActivityState('incorrect'); }}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all font-medium flex items-center justify-between ${activityState === 'correct' && opt.correct ? 'border-green-500 bg-green-50' : ''} ${activityState === 'incorrect' && !opt.correct ? 'border-red-500 bg-red-50' : ''} ${!activityState ? 'border-gray-200 hover:border-[#2FA8C6] hover:bg-blue-50 bg-white' : ''} ${activityState !== null && opt.correct && activityState === 'incorrect' ? 'border-green-500 bg-green-50' : ''}`}>
                  <span>{opt.text}</span>
                  {activityState !== null && opt.correct && <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />}
                  {activityState === 'incorrect' && !opt.correct && <XCircle className="text-red-500 w-6 h-6 shrink-0" />}
                </button>
              ))}
            </div>
            {activityState && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-blue-50 border-l-4 border-[#2FA8C6] rounded-r-xl">
                <p className="text-[#1E3A5F] font-bold mb-1">Análisis:</p>
                <p className="text-gray-700">{question.feedback}</p>
              </motion.div>
            )}
            <div className="flex justify-end">
              <button disabled={!activityState} onClick={() => { if (currentSlide < FINAL_CHALLENGE.length - 1) { setCurrentSlide(s => s + 1); setActivityState(null); } else setCurrentScreen('certificate'); }}
                className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg text-lg flex items-center gap-2 ${activityState ? 'bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {currentSlide < FINAL_CHALLENGE.length - 1 ? 'Siguiente Escenario' : 'Ver Resultados'} <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'certificate') {
    return (
      <div className="w-full relative min-h-[500px]" style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D1B2A)' }}>
        <div className="w-full min-h-screen p-4 md:p-8 flex items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}
            className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F]"></div>
            <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-[#1E3A5F] mb-2 font-montserrat">¡Felicitaciones!</h2>
            <p className="text-xl text-gray-500 mb-8">Has dominado NotebookLM</p>
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-100">
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-2">Puntaje Final</p>
              <p className="text-6xl font-black text-[#2FA8C6] mb-4">{score}</p>
              <p className="text-gray-600">Estás listo para usar la Inteligencia Artificial como un verdadero experto en tus investigaciones.</p>
            </div>
            <div className="flex justify-center mb-8"><EdutechLogo /></div>
            <VoiceReader text="¡Felicitaciones! Has completado el curso de NotebookLM. Estás listo para usar la Inteligencia Artificial como un experto en tus investigaciones." />
            <button onClick={() => { setCurrentScreen('welcome'); setCurrentModuleIndex(0); setCurrentSlide(0); setScore(0); }}
              className="mt-4 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:shadow-xl">
              Volver al Inicio
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
