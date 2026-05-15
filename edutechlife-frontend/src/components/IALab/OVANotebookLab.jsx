import React, { useState, useEffect } from 'react';
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
      title="Escuchar con voz de Valerio"
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      )}
      {isPlaying ? 'Detener' : 'Escuchar con Valerio'}
    </button>
  );
};

const BrainIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);

const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

const CheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);

const XCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const NetworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FA8C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

const EdutechLogo = ({ size = "large" }) => {
  const isLarge = size === "large";
  return (
    <div className="flex items-center justify-center gap-3 select-none">
      <div className={`relative flex items-center justify-center rounded-xl bg-white border border-[#EAEAEA] shadow-[0_4px_15px_rgba(47,168,198,0.15)] ${isLarge ? 'w-12 h-12 md:w-14 md:h-14' : 'w-10 h-10'}`}>
        <BrainIcon className={`text-[#2FA8C6] ${isLarge ? 'w-7 h-7' : 'w-5 h-5'}`} />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#1E3A5F] rounded-full border-2 border-white shadow-[0_0_8px_#1E3A5F] animate-pulse"></div>
      </div>
      <h1 className={`font-bold tracking-tight ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
        <span className="text-[#2FA8C6]">Edu</span><span className="text-[#1E3A5F]">techlife</span>
      </h1>
    </div>
  );
};

const contentScreens = [
  {
    id: 'intro',
    title: '¿Qué es NotebookLM y para qué sirve?',
    subtitle: 'Comprender qué es NotebookLM, cómo funciona y por qué es revolucionario',
    objective: 'Entender el concepto de IA basada en fuentes propias y crear tu primer notebook',
    valerioText: 'NotebookLM es una herramienta de Google que revoluciona la gestión del conocimiento personal. A diferencia de los chatbots tradicionales, trabaja exclusivamente con los documentos que tú le entregas. Esto significa que sus respuestas están 100% fundamentadas en tus fuentes, eliminando el riesgo de alucinaciones. Tu objetivo es comprender cómo funciona y por qué es diferente a los chatbots genéricos.',
    achievements: [
      { text: 'Entender el concepto de IA basada en fuentes propias' },
      { text: 'Crear tu primer notebook con documentos' },
      { text: 'Diferenciar NotebookLM de chatbots genéricos' },
    ],
    warnings: [
      { text: 'Subir documentos sin curar ni organizar' },
      { text: 'Esperar que funcione sin fuentes de calidad' },
      { text: 'No entender que solo responde basado en tus fuentes' },
    ],
    example: { weak: 'Notebook vacío: Sin fuentes subidas, sin contexto', strong: 'Notebook potente: 5 PDFs de investigación académica + 3 artículos de industria = Asistente experto que responde con citas textuales de tus documentos' },
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'features',
    title: 'Curaduría de Fuentes y Síntesis de Documentos',
    subtitle: 'Calidad sobre cantidad en tu investigación',
    objective: 'Aprender a seleccionar, organizar y sintetizar documentos para maximizar el valor de tu notebook',
    valerioText: 'La curaduría de fuentes es la clave para sacar el máximo provecho a NotebookLM. No se trata de subir la mayor cantidad de documentos, sino de seleccionar los más relevantes y organizarlos estratégicamente. Aprenderás a elegir fuentes confiables, categorizarlas por temas y generar síntesis cruzadas que te den una visión integral de tu investigación.',
    achievements: [
      { text: 'Seleccionar fuentes relevantes y confiables' },
      { text: 'Organizar documentos por categorías temáticas' },
      { text: 'Generar síntesis cruzadas entre múltiples fuentes' },
    ],
    warnings: [
      { text: 'Subir 50 documentos sin filtro de calidad' },
      { text: 'Mezclar fuentes contradictorias sin contexto' },
      { text: 'No actualizar las fuentes regularmente' },
    ],
    example: { weak: 'Subir todo lo que encuentro sobre IA sin ningún criterio', strong: '10 papers seleccionados por relevancia, organizados por tema (ética, técnica, aplicaciones), con notas de contexto para cada grupo' },
    image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'practices',
    title: 'Audio Overviews y Gestión Documental con IA',
    subtitle: 'Tu conocimiento en formato podcast',
    objective: 'Transformar documentos complejos en conversaciones de audio con dos presentadores virtuales',
    valerioText: 'Una de las funciones más impresionantes de NotebookLM es Audio Overview. Esta herramienta convierte tus documentos en conversaciones de podcast generadas por IA, con dos presentadores virtuales que discuten los hallazgos clave. Es ideal para repasar contenido mientras te desplazas, pero recuerda complementarlo con resúmenes escritos y siempre revisar el contenido generado.',
    achievements: [
      { text: 'Generar Audio Overviews desde tus documentos' },
      { text: 'Personalizar el tono y enfoque del podcast' },
      { text: 'Usar audio para repaso y aprendizaje móvil' },
    ],
    warnings: [
      { text: 'Esperar audio perfecto con documentos cortos' },
      { text: 'No revisar el contenido generado antes de compartir' },
      { text: 'Usar solo audio sin complementar con resúmenes escritos' },
    ],
    example: { weak: 'Conversación vaga y genérica sobre el tema sin profundidad', strong: 'Podcast de 15 minutos donde dos presentadores discuten los hallazgos clave de 5 papers sobre neuroplasticidad, con ejemplos prácticos y analogías claras' },
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
  },
];

const questionsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question: "Según la guía, ¿cuál es el 'superpoder' principal de NotebookLM?",
    options: [
      "Busca información en todo internet para darte respuestas más largas.",
      "Trabaja exclusivamente con las fuentes y documentos que tú le entregas.",
      "Traduce documentos a más de 100 idiomas automáticamente.",
      "Crea videos animados a partir de tus textos de estudio."
    ],
    correct: 1,
    explanation: "¡Correcto! NotebookLM se diferencia porque solo usa la información que tú subes. Así se asegura de no inventar datos que no están en tus apuntes.",
    hint: "Lee bien las opciones; este asistente está diseñado para ser totalmente fiel a tus propios documentos, no a internet."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question: "¿Cuál es la diferencia más importante entre usar ChatGPT y NotebookLM para estudiar?",
    options: [
      "ChatGPT usa 'todo el internet' y NotebookLM usa 'solo tus fuentes cargadas'.",
      "ChatGPT es gratis y NotebookLM siempre es de pago.",
      "NotebookLM solo funciona en celulares y ChatGPT en computadoras.",
      "ChatGPT es para matemáticas y NotebookLM es para historia."
    ],
    correct: 0,
    explanation: "Exacto. Mientras ChatGPT tiene conocimiento general de toda la web, NotebookLM se enfoca en ser súper preciso y estricto solo con los documentos que tú elegiste.",
    hint: "Piensa en el origen de los datos de cada uno. Uno busca en todo el mundo y el otro solo en lo que tú le das."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question: "¿Qué increíble función tiene NotebookLM para ayudarte a 'escuchar' tus documentos?",
    options: [
      "Una canción estilo rap con las palabras clave más importantes.",
      "Un audiolibro monótono narrado por tu propia voz clonada.",
      "Una alarma para despertarte recordando el texto principal.",
      "Un 'Podcast' (Audio Overview) generado por IA con dos voces que conversan sobre tu tema."
    ],
    correct: 3,
    explanation: "¡Muy bien! La herramienta 'Audio Overview' crea una simulación de podcast muy realista donde dos anfitriones discuten tus apuntes, ideal para estudiar escuchando.",
    hint: "Es un formato de audio muy popular hoy en día en el que dos anfitriones conversan sobre un tema."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question: "Se dice que NotebookLM está 'libre de alucinaciones'. ¿Qué significa esto?",
    options: [
      "Que no te permite subir documentos sobre temas de ciencia ficción.",
      "Que bloquea automáticamente las páginas web con virus o publicidad engañosa.",
      "Que la IA no inventa datos, sus respuestas se basan 100% en la evidencia de tus textos.",
      "Que corrige tu ortografía y gramática sin que te des cuenta."
    ],
    correct: 2,
    explanation: "Correcto. Como la IA está restringida (amarrada) solo a tus PDFs o documentos, se elimina casi por completo el riesgo de que invente información falsa (alucinación).",
    hint: "En el mundo de la IA, 'alucinar' significa inventar cosas que no son reales."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question: "Si estás haciendo un trabajo en grupo para la escuela o universidad, ¿puedes usar NotebookLM con tus compañeros?",
    options: [
      "No, es una herramienta estrictamente para uso individual.",
      "Sí, puedes compartir tus 'Cuadernos' con tu equipo igual que un Google Doc.",
      "Solo si todos están conectados a la misma red Wi-Fi en el mismo salón.",
      "Sí, pero la IA solo le responderá las preguntas al creador del grupo."
    ],
    correct: 1,
    explanation: "¡Así es! Puedes colaborar en equipo. Todos pueden leer el mismo cuaderno, hacerle preguntas a las mismas fuentes y escuchar el mismo podcast generado.",
    hint: "Como es una herramienta de Google, su función para grupos se parece mucho a cómo compartes archivos en Google Drive."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question: "Según las 'Mejores Prácticas' de la guía, ¿qué debes hacer SIEMPRE que NotebookLM te da una respuesta?",
    options: [
      "Verificar siempre la cita o la parte exacta de donde sacó la información.",
      "Borrar el documento original de tu computadora porque ya no lo necesitas.",
      "Pedirle que lo traduzca a otro idioma para asegurar que sea de buena calidad.",
      "Copiar y pegar la respuesta directamente en tu tarea sin necesidad de leerla."
    ],
    correct: 0,
    explanation: "Excelente. NotebookLM es un gran asistente, pero tú eres el estudiante. Siempre debes verificar haciendo clic en las citas para ver de qué parte del texto original sacó la idea.",
    hint: "Recuerda que tú eres el estudiante y la máquina es el asistente. Debes asegurarte de revisar las fuentes."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question: "Según el manual, ¿cuántos documentos o fuentes diferentes puedes subir a un mismo cuaderno en NotebookLM?",
    options: [
      "Solo 1 fuente muy larga a la vez.",
      "Hasta 5 fuentes pequeñas.",
      "Fuentes ilimitadas (todo lo que tengas en tu computadora).",
      "Hasta 50 fuentes de diversos formatos."
    ],
    correct: 3,
    explanation: "Correcto. Puedes alimentar tu cuaderno con hasta 50 fuentes distintas (como PDFs, documentos, enlaces, etc.) para que la IA cruce la información entre todas ellas.",
    hint: "No es infinito, pero es un número lo suficientemente grande como para armar una tesis completa (medio centenar)."
  }
];

const infoSteps = ['welcome', 'content-0', 'content-1', 'content-2'];
const totalSteps = infoSteps.length + questionsData.length + 1;

export default function OVANotebookLab() {
  const [gameState, setGameState] = useState('welcome');
  const [contentIdx, setContentIdx] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (gameState === 'results' && score > 4) {
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2FA8C6', '#1E3A5F', '#EAEAEA'] });
      });
    }
  }, [gameState, score]);

  const startGame = () => {
    setGameState('content');
    setContentIdx(0);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  const nextContent = () => {
    if (contentIdx < contentScreens.length - 1) {
      setContentIdx(prev => prev + 1);
    } else {
      setGameState('quiz');
      setCurrentQIndex(0);
    }
  };

  const prevContent = () => {
    if (contentIdx > 0) setContentIdx(prev => prev - 1);
  };

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questionsData[currentQIndex].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questionsData.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setGameState('results');
    }
  };

  const currentStep = gameState === 'welcome' ? 0
    : gameState === 'content' ? 1 + contentIdx
    : gameState === 'quiz' ? 1 + contentScreens.length + currentQIndex
    : totalSteps - 1;

  const styles = `
    .tech-grid-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; background-image: linear-gradient(to right, #EAEAEA 1px, transparent 1px), linear-gradient(to bottom, #EAEAEA 1px, transparent 1px); background-size: 50px 50px; opacity: 0.6; }
    .hologram-glow-1 { position: fixed; top: -15%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(47,168,198,0.15) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
    .hologram-glow-2 { position: fixed; bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(30,58,95,0.08) 0%, rgba(255,255,255,0) 70%); z-index: -1; }
    .glass-panel { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(47, 168, 198, 0.15); box-shadow: 0 10px 40px rgba(30, 58, 95, 0.08); }
    .glass-panel-interactive { background: rgba(255, 255, 255, 0.95); border: 1px solid #EAEAEA; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .glass-panel-interactive:hover:not(:disabled) { border-color: #2FA8C6; box-shadow: 0 8px 25px rgba(47, 168, 198, 0.15); transform: translateY(-2px); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 15px rgba(47, 168, 198, 0.4); } 50% { box-shadow: 0 0 30px rgba(47, 168, 198, 0.8); } }
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(47, 168, 198, 0.3); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(47, 168, 198, 0.6); }
  `;

  if (gameState === 'welcome') {
    return (
      <div className="w-full relative" style={{ minHeight: '400px' }}>
        <div className="tech-grid-bg" /><div className="hologram-glow-1" /><div className="hologram-glow-2" />
        <div className="w-full flex items-center justify-center py-12 px-4 relative z-10">
          <div className="w-full max-w-3xl glass-panel p-8 md:p-14 rounded-3xl animate-fade-in text-center border-t-4 border-t-[#2FA8C6] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <BrainIcon className="w-40 h-40 text-[#1E3A5F]" />
            </div>
            <div className="mb-6 flex justify-center animate-float"><EdutechLogo size="large" /></div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E0F7FA] text-[#004B63] font-semibold text-[10px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20 mb-6">
              <BrainIcon className="w-3.5 h-3.5" /><span>Laboratorio Guiado por Valerio</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-6 tracking-tight font-montserrat">Desafío: El Cuaderno del Futuro</h2>
            <div className="bg-[#EAEAEA]/50 p-6 rounded-2xl mb-6 text-[#1E3A5F] text-base md:text-lg leading-relaxed border border-[#2FA8C6]/20 shadow-inner">
              <p className="mb-4"><strong>¡Hola! Soy Valerio, tu coach de IA.</strong> Bienvenido al laboratorio interactivo de NotebookLM. Vamos a explorar esta poderosa herramienta de Google que está transformando la investigación académica.</p>
              <p>Primero aprenderás los conceptos clave, luego pondremos a prueba tu conocimiento con 7 preguntas. ¿Estás listo?</p>
            </div>
            <div className="flex justify-center mb-6">
              <VoiceReader text="¡Hola! Soy Valerio, tu coach de IA. Bienvenido al laboratorio interactivo de NotebookLM. Vamos a explorar esta herramienta de Google que está transformando la investigación académica. Primero aprenderás los conceptos clave, luego pondremos a prueba tu conocimiento con 7 preguntas." />
            </div>
            <button onClick={startGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] rounded-xl focus:outline-none hover:scale-105 shadow-[0_10px_20px_rgba(47,168,198,0.3)]"
              style={{ animation: 'pulseGlow 3s infinite' }}
            >
              <span className="flex items-center gap-3 text-lg tracking-wide"><NetworkIcon /> Iniciar Ecosistema Interactivo</span>
            </button>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (gameState === 'results') {
    const percentage = Math.round((score / questionsData.length) * 100);
    let message = "", submessage = "";
    if (percentage === 100) { message = "¡Maestría Absoluta!"; submessage = "Entiendes perfectamente la simbiosis entre la IA y la curaduría humana. Estás listo para liderar la innovación académica."; }
    else if (percentage >= 70) { message = "¡Pensamiento Crítico Sólido!"; submessage = "Tienes una gran comprensión de las capacidades y límites tecnológicos. Solo afina algunos detalles estratégicos."; }
    else { message = "Requiere Recalibración."; submessage = "Recuerda: la IA procesa, pero tú dominas. Te sugerimos repasar los fundamentos para evitar la dependencia pasiva."; }
    return (
      <div className="w-full relative" style={{ minHeight: '400px' }}>
        <div className="tech-grid-bg" /><div className="hologram-glow-1" /><div className="hologram-glow-2" />
        <div className="w-full flex items-center justify-center py-12 px-4 relative z-10">
          <div className="w-full max-w-2xl glass-panel p-8 md:p-16 rounded-3xl animate-fade-in text-center border-t-4 border-t-[#1E3A5F]">
            <div className="mb-6 flex justify-center"><EdutechLogo size="small" /></div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-[10px] uppercase tracking-[0.15em] border border-emerald-200 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 4.5 7.5c-1.5.5-1.5 2.5 0 3.5"/><path d="M10 17.5V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2"/><path d="M20 12.5V19a1 1 0 0 1-1 1h-2"/><path d="M18 4a2 2 0 0 1 2 2"/><path d="M10 4.5V12"/><path d="M2 10.5V12"/><path d="M2 17a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2"/><path d="M20 8.5V12"/></svg>
              <span>Laboratorio Completado</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#1E3A5F] font-montserrat">Análisis de Rendimiento</h2>
            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] my-8 drop-shadow-sm">{score}<span className="text-4xl text-gray-400">/7</span></div>
            <h3 className="text-2xl font-semibold text-[#2FA8C6] mb-4">{message}</h3>
            <p className="text-[#1E3A5F]/80 mb-6 text-lg">{submessage}</p>
            <div className="flex justify-center mb-6"><VoiceReader text={submessage} /></div>
            <button onClick={startGame} className="px-8 py-3 rounded-xl bg-white text-[#1E3A5F] border-2 border-[#EAEAEA] hover:border-[#2FA8C6] hover:text-[#2FA8C6] transition-all font-semibold flex items-center justify-center gap-2 mx-auto shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Reiniciar Simulación
            </button>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (gameState === 'content') {
    const screen = contentScreens[contentIdx];
    const isFirst = contentIdx === 0;
    const isLast = contentIdx === contentScreens.length - 1;
    return (
      <div className="w-full relative" style={{ minHeight: '400px' }}>
        <div className="tech-grid-bg" /><div className="hologram-glow-1" /><div className="hologram-glow-2" />
        <div className="w-full py-6 px-4 relative z-10">
          <div className="w-full max-w-5xl mx-auto animate-fade-in" key={screen.id}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <EdutechLogo size="small" />
              <div className="flex items-center gap-3">
                <span className="text-[#1E3A5F] font-semibold bg-white px-4 py-1.5 rounded-full border border-[#EAEAEA] shadow-sm text-sm">
                  {contentIdx + 1} / {contentScreens.length}
                </span>
              </div>
            </div>
            <div className="w-full bg-[#EAEAEA] rounded-full h-2.5 mb-8 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${((1 + contentIdx) / totalSteps) * 100}%` }} />
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/5 flex flex-col gap-6">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#EAEAEA] h-64 lg:h-auto lg:flex-grow bg-white">
                  <img src={screen.image} alt={screen.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm font-semibold bg-[#2FA8C6]/90 w-fit px-4 py-1.5 rounded-lg backdrop-blur-md shadow-lg border border-white/20">
                      <NetworkIcon /> Aprendizaje Interactivo
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm">
                  <VoiceReader text={screen.valerioText} />
                </div>
              </div>
              <div className="w-full lg:w-3/5 max-h-[600px] overflow-y-auto">
                <div className="glass-panel p-6 md:p-10 rounded-3xl flex flex-col border-t-4 border-t-[#2FA8C6]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F7FA] text-[#004B63] font-semibold text-[9px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20 w-fit mb-4">
                    <BrainIcon className="w-3 h-3" /><span>{screen.subtitle}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1E3A5F] mb-4 font-montserrat">{screen.title}</h2>
                  <p className="text-[#1E3A5F]/80 text-sm leading-relaxed mb-6">{screen.valerioText}</p>

                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider mb-3">🎯 Objetivos de aprendizaje</h3>
                    <div className="space-y-2">
                      {screen.achievements.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#E8F8F5] border border-[#22c55e]/20">
                          <CheckIcon />
                          <span className="text-xs font-medium text-[#166534] leading-relaxed">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider mb-3">⚠️ Errores comunes a evitar</h3>
                    <div className="space-y-2">
                      {screen.warnings.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FDEDEC] border border-[#ef4444]/20">
                          <CrossIcon />
                          <span className="text-xs font-medium text-[#991b1b] leading-relaxed">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider mb-3">💡 Ejemplo práctico</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-50 border border-red-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span className="text-xs font-medium text-red-700 leading-relaxed">{screen.example.weak}</span>
                      </div>
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#E8F8F5] border border-emerald-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-xs font-medium text-[#166534] leading-relaxed">{screen.example.strong}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8 px-2">
              <button onClick={prevContent} disabled={isFirst}
                className="p-3 bg-white border border-[#EAEAEA] text-[#1E3A5F] rounded-xl disabled:opacity-30 hover:border-[#2FA8C6] transition-all disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="flex gap-2">
                {contentScreens.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === contentIdx ? 'w-8 bg-[#1E3A5F]' : 'w-2 bg-slate-200'}`} />
                ))}
              </div>
              <button onClick={nextContent}
                className="px-6 py-3 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2">
                {isLast ? 'Comenzar Evaluación' : 'Siguiente'} <ArrowRight />
              </button>
            </div>
            <footer className="mt-8 pt-6 border-t border-[#EAEAEA] text-center">
              <p className="text-slate-400 text-xs">Laboratorio guiado por <strong className="text-[#2FA8C6]">Valerio</strong> &mdash; Coach de IA de Edutechlife.</p>
            </footer>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  const currentQ = questionsData[currentQIndex];
  return (
    <div className="w-full relative" style={{ minHeight: '400px' }}>
      <div className="tech-grid-bg" /><div className="hologram-glow-1" /><div className="hologram-glow-2" />
      <div className="w-full py-6 px-4 relative z-10" key={currentQ.id}>
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <EdutechLogo size="small" />
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E0F7FA] text-[#004B63] font-semibold text-[10px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20">
                <BrainIcon className="w-3.5 h-3.5" /><span>Laboratorio Guiado por Valerio</span>
              </div>
              <span className="text-[#1E3A5F] font-semibold bg-white px-4 py-1.5 rounded-full border border-[#EAEAEA] shadow-sm text-sm">
                Nodo de Aprendizaje {currentQIndex + 1} / {questionsData.length}
              </span>
              <span className="text-white font-semibold bg-[#2FA8C6] px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(47,168,198,0.4)] text-sm">
                Datos: {score}
              </span>
            </div>
          </div>
          <div className="w-full bg-[#EAEAEA] rounded-full h-2.5 mb-8 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((1 + contentScreens.length + currentQIndex) / totalSteps) * 100}%` }} />
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/5 flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#EAEAEA] group h-64 lg:h-auto lg:flex-grow bg-white">
                <img src={currentQ.image} alt="Contexto visual" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white text-sm font-semibold bg-[#2FA8C6]/90 w-fit px-4 py-1.5 rounded-lg backdrop-blur-md shadow-lg border border-white/20">
                    <NetworkIcon /> Escenario Interactivo
                  </div>
                </div>
              </div>
              {isAnswered && (
                <div className={`p-6 rounded-2xl border animate-fade-in shadow-sm ${selectedOption === currentQ.correct ? 'bg-[#E8F8F5] border-[#22c55e]/40' : 'bg-[#FDEDEC] border-[#ef4444]/40'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {selectedOption === currentQ.correct ? (
                      <span className="flex items-center gap-2 text-[#166534] font-bold text-lg"><CheckCircle /> Análisis Validado</span>
                    ) : (
                      <span className="flex items-center gap-2 text-[#991b1b] font-bold text-lg"><XCircle /> Desviación Crítica</span>
                    )}
                  </div>
                  <p className="text-[#1E3A5F] text-sm leading-relaxed font-medium opacity-90">{currentQ.explanation}</p>
                  <div className="mt-4 pt-4 border-t border-white/40"><VoiceReader text={currentQ.explanation} /></div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-3/5">
              <div className="glass-panel p-6 md:p-10 rounded-3xl h-full flex flex-col border-t-4 border-t-[#2FA8C6]">
                <h2 className="text-xl md:text-2xl font-semibold text-[#1E3A5F] mb-8 leading-relaxed font-montserrat">{currentQ.question}</h2>
                <div className="space-y-4 flex-grow">
                  {currentQ.options.map((option, index) => {
                    let btnClass = "glass-panel-interactive w-full text-left p-4 md:p-5 rounded-2xl flex items-start gap-4 ";
                    let iconClass = "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors ";
                    let textClass = "text-base md:text-lg font-medium transition-colors ";
                    if (!isAnswered) { btnClass += "cursor-pointer"; iconClass += "bg-[#EAEAEA] text-[#1E3A5F]"; textClass += "text-[#1E3A5F]/80"; }
                    else if (index === currentQ.correct) { btnClass += "bg-[#E8F8F5] !border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.15)]"; iconClass += "bg-[#22c55e] text-white"; textClass += "text-[#166534]"; }
                    else if (index === selectedOption) { btnClass += "bg-[#FDEDEC] !border-[#ef4444]"; iconClass += "bg-[#ef4444] text-white"; textClass += "text-[#991b1b]"; }
                    else { btnClass += "opacity-50 cursor-not-allowed bg-white"; iconClass += "bg-[#EAEAEA] text-[#1E3A5F]/50"; textClass += "text-[#1E3A5F]/50"; }
                    return (
                      <button key={index} onClick={() => handleOptionClick(index)} disabled={isAnswered} className={btnClass}>
                        <div className={iconClass}>{['A', 'B', 'C', 'D'][index]}</div>
                        <span className={textClass}>{option}</span>
                      </button>
                    );
                  })}
                </div>
                {!isAnswered && (
                  <div className="mt-6 flex flex-col items-start gap-3 animate-fade-in">
                    <button onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#EAEAEA]/40 hover:bg-[#EAEAEA] border border-[#2FA8C6]/30 rounded-xl text-[#1E3A5F] font-semibold text-sm transition-all duration-300">
                      <LightbulbIcon />{showHint ? 'Ocultar Pista' : 'Ver Pista'}
                    </button>
                    {showHint && (
                      <div className="w-full p-4 bg-[#E8F8F5] border border-[#2FA8C6]/50 rounded-xl text-[#1E3A5F] text-sm md:text-base font-medium animate-fade-in shadow-inner">
                        <span className="text-[#2FA8C6] font-bold mr-2">💡 Pista:</span> {currentQ.hint}
                      </div>
                    )}
                  </div>
                )}
                {isAnswered && (
                  <div className="mt-8 flex justify-end animate-fade-in">
                    <button onClick={nextQuestion}
                      className="px-8 py-3.5 bg-[#1E3A5F] hover:bg-[#2FA8C6] text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-[0_8px_20px_rgba(47,168,198,0.4)] hover:-translate-y-1">
                      {currentQIndex === questionsData.length - 1 ? 'Procesar Resultados' : 'Siguiente Nodo'} <ArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <footer className="mt-8 pt-6 border-t border-[#EAEAEA] text-center">
            <p className="text-slate-400 text-xs">Laboratorio guiado por <strong className="text-[#2FA8C6]">Valerio</strong> &mdash; Coach de IA de Edutechlife.</p>
          </footer>
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
}
