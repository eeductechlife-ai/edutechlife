import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Code, Image as ImageIcon, Layout, Cpu, Lightbulb, Play,
  Volume2, Square, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft,
  X, Trophy, Award, RefreshCcw, BookOpen, Target, Zap, Bot, GraduationCap
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
    <button onClick={speak} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-[#259eb5] text-white hover:bg-[#13374b] shadow-md'}`} title="Escuchar con voz de Valerio">
      {isPlaying ? <Square size={16} /> : <Volume2 size={16} />}
      <span className="font-bold">{isPlaying ? 'Detener' : 'Escuchar con Valerio'}</span>
    </button>
  );
};

const tools = [
  { id: "browse", title: "Búsqueda Web (Browse)", icon: <Globe className="w-10 h-10 text-blue-500" />, desc: "Conecta a ChatGPT con el mundo real en tiempo real. Es tu ventana a la actualidad académica y profesional.", pros: ["Noticias 2025/2026", "Estadísticas actuales", "Verificación de hechos"], cons: ["Conceptos teóricos básicos", "Redacción creativa simple"], prompt: "Busca las últimas regulaciones de IA en Colombia para 2025 y resume los puntos clave.", audio: "La búsqueda web permite a ChatGPT acceder a internet en tiempo real. Úsala para datos actualizados, noticias recientes o verificar información que cambia rápidamente.", useCases: ["Revisión de literatura reciente", "Actualización de marcos legales", "Búsqueda de cotizaciones en vivo"] },
  { id: "code", title: "Intérprete de Código", icon: <Code className="w-10 h-10 text-emerald-500" />, desc: "Un motor de Python real dentro del chat. Ideal para científicos de datos, ingenieros y estudiantes de finanzas.", pros: ["Análisis de Excel/CSV", "Gráficos profesionales", "Cálculos matemáticos complejos"], cons: ["No genera imágenes artísticas", "No accede a URLs privadas"], prompt: "Analiza este Excel de ventas, genera una gráfica de barras por trimestre e identifica el producto estrella.", audio: "El intérprete de código ejecuta Python real. Es perfecto para analizar archivos de datos, crear visualizaciones y realizar cálculos estadísticos avanzados.", useCases: ["Limpieza de bases de datos", "Modelos matemáticos", "Conversión de formatos de archivo"] },
  { id: "dalle", title: "DALL-E 3", icon: <ImageIcon className="w-10 h-10 text-purple-500" />, desc: "Transforma tus ideas visuales en realidad. Crea material educativo e ilustraciones personalizadas con precisión.", pros: ["Infografías educativas", "Logos y conceptos", "Fondos para presentaciones"], cons: ["Texto denso dentro de imágenes", "Marcas registradas exactas"], prompt: "Genera una ilustración estilo infografía del ciclo del agua con las etapas etiquetadas claramente.", audio: "Dall-e es el sistema de generación de imágenes. Te permite crear material visual original para tus presentaciones o proyectos académicos.", useCases: ["Material didáctico visual", "Portadas para informes", "Visualización de conceptos abstractos"] },
  { id: "canvas", title: "Canvas", icon: <Layout className="w-10 h-10 text-orange-500" />, desc: "Un espacio de trabajo colaborativo. Edita texto y código en paralelo con la IA como si tuvieras un editor humano.", pros: ["Edición directa de documentos", "Sugerencias en tiempo real", "Ajuste de tono y longitud"], cons: ["Solo disponible en modelos 4o", "No es un editor de video"], prompt: "Abre Canvas y ayúdame a estructurar un ensayo sobre el impacto de la IA en la salud mental.", audio: "Canvas es un entorno de edición colaborativa. Abre un editor junto al chat donde tú y la inteligencia artificial pueden trabajar sobre el mismo documento simultáneamente.", useCases: ["Redacción iterativa de ensayos", "Revisión paso a paso de código", "Adaptación de manuales técnicos"] },
  { id: "memory", title: "Memoria y Proyectos", icon: <Cpu className="w-10 h-10 text-indigo-500" />, desc: "Personalización y organización a largo plazo. ChatGPT aprende tus preferencias y agrupa tu trabajo por objetivos.", pros: ["Recuerda tu perfil académico", "Organiza tesis y archivos", "Contexto compartido persistente"], cons: ["Requiere configuración de privacidad", "Uso optimizado en planes Plus"], prompt: "Recuerda que soy estudiante de Medicina y prefiero explicaciones técnicas con ejemplos clínicos.", audio: "La memoria permite que la inteligencia artificial recuerde tus preferencias. Los Proyectos organizan múltiples chats y archivos bajo un mismo contexto de trabajo.", useCases: ["Tutor personalizado", "Gestión de investigación", "Mantenimiento de estilo de redacción"] }
];

const quizScenarios = [
  { question: "Eres un docente preparando un manual de laboratorio de 20 páginas. Necesitas que la IA te ayude a reescribir solo la sección de 'Normas de Seguridad', ajustando el tono para adolescentes, sin alterar el resto del documento. ¿Qué entorno te ofrece el flujo más óptimo?", options: ["Proyectos y Memoria", "Canvas", "Intérprete de Código", "Búsqueda Web"], correct: 1, explanation: "Canvas permite editar secciones específicas de un documento largo de forma paralela en un editor lateral, manteniendo el contexto sin regenerar todo el texto." },
  { question: "Tienes un archivo Excel con las calificaciones de 3,000 estudiantes, desordenadas y con formatos inconsistentes. Quieres limpiar la base y predecir la deserción. ¿Qué herramienta es indispensable?", options: ["DALL-E 3", "Canvas", "Búsqueda Web", "Intérprete de Código"], correct: 3, explanation: "El Intérprete de Código ejecuta Python, lo que permite procesar archivos masivos, limpiar datos y realizar cálculos estadísticos exactos." },
  { question: "Asesoras a un estudiante en su tesis de grado. Quieres que ChatGPT recuerde la metodología, las correcciones y el marco teórico en cada sesión sin tener que volver a explicar el contexto. ¿Qué función usarías?", options: ["Memoria y Proyectos", "Intérprete de Código", "Canvas", "Búsqueda Web"], correct: 0, explanation: "Los Proyectos agrupan conversaciones bajo instrucciones comunes, y la Memoria guarda el contexto a largo plazo de forma persistente." },
  { question: "Un estudiante menciona una fluctuación del dólar que ocurrió hace apenas una hora. Necesitas que ChatGPT genere un análisis sobre las causas inmediatas. ¿Qué herramienta activas?", options: ["Canvas", "Búsqueda Web (Browse)", "Memoria", "Intérprete de Código"], correct: 1, explanation: "Para analizar eventos en tiempo real o noticias de última hora, es obligatorio usar la Búsqueda Web para acceder a datos actuales fuera del entrenamiento base." },
  { question: "Quieres diseñar el póster de la feria de ciencias. Pides a ChatGPT una imagen con un párrafo largo de bases del concurso y logos exactos de patrocinadores. ¿Qué sucederá?", options: ["El póster quedará perfecto y listo para imprimir.", "El intérprete de código bloqueará la solicitud por privacidad.", "La imagen tendrá errores en el texto largo y logos inexactos.", "Canvas abrirá un editor gráfico manual."], correct: 2, explanation: "DALL-E 3 es excelente para arte conceptual, pero tiene dificultades con textos largos y logos de marcas registradas exactos debido a restricciones legales y técnicas." }
];

const WelcomeScreen = ({ onNext }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in px-4 py-8">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-[#13374b] font-semibold text-sm mb-4">
      <Bot size={16} className="text-[#259eb5]" /><span>Laboratorio Guiado por Valerio</span>
    </div>
    <div className="w-16 h-16 bg-gradient-to-br from-[#259eb5] to-[#13374b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20 mb-6">
      <Zap className="text-white w-8 h-8" />
    </div>
    <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#13374b]">Domina las Herramientas</h1>
    <p className="text-lg md:text-xl text-slate-500 font-light mb-2">ChatGPT</p>
    <p className="text-slate-600 max-w-xl mb-4">Hola, soy Valerio, tu coach de IA. En este laboratorio exploraremos 5 herramientas clave del ecosistema ChatGPT: Búsqueda Web, Intérprete de Código, DALL-E 3, Canvas y Memoria. ¡Descubramos juntos sus fortalezas!</p>
    <VoiceReader text="Hola, soy Valerio, tu coach de IA de Edutechlife. En este laboratorio exploraremos 5 herramientas clave del ecosistema ChatGPT: Búsqueda Web, Intérprete de Código, DALL-E 3, Canvas y Memoria y Proyectos. Aprenderemos cuándo usar cada una y sus limitaciones." />
    <button onClick={onNext} className="mt-4 px-8 py-4 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3"><Play size={20} />Comenzar Laboratorio</button>
  </div>
);

export default function OVAChatGPTTools() {
  const [screen, setScreen] = useState('welcome');
  const [activeModal, setActiveModal] = useState(null);
  const [viewedTools, setViewedTools] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const progress = Math.round((viewedTools.length / tools.length) * 100);

  if (screen === 'welcome') return <WelcomeScreen onNext={() => setScreen('dashboard')} />;

  const openTool = (idx) => { setActiveModal(idx); if (!viewedTools.includes(idx)) setViewedTools([...viewedTools, idx]); };

  const handleQuizAnswer = (idx) => {
    if (feedback) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === quizScenarios[quizStep].correct;
    if (isCorrect) setScore(score + 1);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const nextQuestion = () => {
    if (quizStep < quizScenarios.length - 1) { setQuizStep(quizStep + 1); setFeedback(null); setSelectedAnswer(null); }
    else setQuizFinished(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-4 md:p-8">
      <nav className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#259eb5] rounded-xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20"><Zap className="text-white w-6 h-6" /></div>
          <span className="text-3xl font-black tracking-tight"><span className="text-[#259eb5]">Edu</span><span className="text-[#13374b]">techlife</span></span>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ecosistema ChatGPT</span>
          <div className="h-4 w-[2px] bg-slate-200"></div>
          <span className="text-sm font-bold text-[#259eb5]">Módulo de Competencias</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-[#13374b] text-white p-6 md:p-8 rounded-[2rem] shadow-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><BookOpen size={140} /></div>
                <div className="relative z-10">
                  <h1 className="text-2xl md:text-4xl font-black mb-3">Domina las Herramientas</h1>
                  <p className="text-slate-300 text-base mb-6 max-w-xl">Explora las 5 dimensiones del ecosistema ChatGPT antes de enfrentarte al desafío de toma de decisiones estratégicas.</p>
                  <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md inline-block min-w-[240px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Progreso</span>
                      <span className="text-xl font-black">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <motion.div className="bg-cyan-400 h-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool, idx) => (
                  <motion.button key={tool.id} whileHover={{ y: -6 }} onClick={() => openTool(idx)}
                    className={`group relative text-left bg-white p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-xl ${viewedTools.includes(idx) ? 'border-emerald-200' : 'border-slate-100 hover:border-[#259eb5]'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-cyan-50 transition-colors">{tool.icon}</div>
                      {viewedTools.includes(idx) && <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full border border-emerald-200"><CheckCircle2 size={16} /></div>}
                    </div>
                    <h3 className="text-xl font-black text-[#13374b] mb-2 group-hover:text-[#259eb5] transition-colors">{tool.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{tool.desc}</p>
                    <div className="flex items-center gap-1.5 text-[#259eb5] font-black text-[11px] uppercase tracking-widest">Explorar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
                  </motion.button>
                ))}

                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowQuiz(true)}
                  className="lg:col-span-1 md:col-span-2 bg-gradient-to-br from-[#259eb5] to-[#13374b] p-6 rounded-2xl shadow-xl text-white group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10 transform group-hover:scale-125 transition-transform"><Trophy size={120} /></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="bg-white/20 w-fit p-3 rounded-xl mb-4 backdrop-blur-md"><Target size={24} /></div>
                      <h3 className="text-2xl font-black mb-2">Desafío Estratégico</h3>
                      <p className="text-slate-200 text-sm leading-relaxed mb-6">Analiza 5 escenarios reales y elige la mejor herramienta.</p>
                    </div>
                    <div className="bg-white text-[#13374b] font-black py-3 px-6 rounded-xl inline-flex items-center justify-center gap-2 group-hover:bg-cyan-50 transition-colors text-sm">Iniciar <Play size={16} /></div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-3xl mx-auto">
              {!quizFinished ? (
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                    <button onClick={() => { setShowQuiz(false); stopSpeech(); }} className="text-slate-400 hover:text-[#13374b] flex items-center gap-1 font-bold transition-colors text-xs"><ChevronLeft size={16} /> Salir</button>
                    <div className="flex gap-1.5">{quizScenarios.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === quizStep ? 'w-10 bg-[#259eb5]' : i < quizStep ? 'w-6 bg-emerald-400' : 'w-4 bg-slate-100'}`} />)}</div>
                  </div>
                  <h2 className="text-[10px] font-black text-[#259eb5] uppercase tracking-widest mb-3">Caso {quizStep + 1}</h2>
                  <p className="text-xl md:text-2xl font-black text-[#13374b] mb-6 leading-tight">{quizScenarios[quizStep].question}</p>
                  <div className="space-y-3">
                    {quizScenarios[quizStep].options.map((opt, i) => {
                      const isCorrect = i === quizScenarios[quizStep].correct;
                      const isSelected = selectedAnswer === i;
                      let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between text-sm ";
                      if (!feedback) btnClass += "border-slate-100 hover:border-[#259eb5] hover:bg-slate-50";
                      else if (isCorrect) btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                      else if (isSelected) btnClass += "border-rose-500 bg-rose-50 text-rose-700";
                      else btnClass += "border-slate-50 opacity-40";
                      return <button key={i} disabled={feedback} onClick={() => handleQuizAnswer(i)} className={btnClass}>{opt}{feedback && isCorrect && <CheckCircle2 className="text-emerald-500" />}{feedback && isSelected && !isCorrect && <X className="text-rose-500" />}</button>;
                    })}
                  </div>
                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-5 rounded-xl border-l-6 ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{feedback === 'correct' ? <Trophy size={20} /> : <AlertCircle size={20} />}</div>
                        <div>
                          <h4 className="font-black text-sm mb-0.5">{feedback === 'correct' ? '¡Correcto!' : 'Incorrecto'}</h4>
                          <p className="text-slate-600 text-xs leading-relaxed">{quizScenarios[quizStep].explanation}</p>
                        </div>
                      </div>
                      <button onClick={nextQuestion} className="w-full mt-4 bg-[#13374b] text-white py-3 rounded-lg font-black hover:bg-[#259eb5] transition-colors shadow text-xs flex items-center justify-center gap-2">{quizStep < quizScenarios.length - 1 ? 'Siguiente' : 'Ver Resultados'} <ChevronRight size={16} /></button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl text-center border border-slate-100">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-cyan-50 rounded-full mb-6 relative">
                    <Trophy className="text-[#259eb5] w-12 h-12" />
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-white shadow">{score}</div>
                  </div>
                  <h2 className="text-2xl font-black text-[#13374b] mb-3">Reporte de Competencias</h2>
                  <p className="text-slate-500 text-sm mb-6">Acertaste {score} de {quizScenarios.length} decisiones estratégicas.</p>
                  <div className="bg-slate-50 p-5 rounded-2xl mb-6 text-left">
                    <h3 className="font-black text-[#13374b] mb-3 flex items-center gap-2 text-sm"><Award className="text-[#259eb5]" size={18} /> Perfil:</h3>
                    {score === 5 ? <p className="text-emerald-700 font-bold text-sm leading-relaxed">Nivel Maestro: Dominas perfectamente cada herramienta.</p>
                    : score >= 3 ? <p className="text-amber-700 font-bold text-sm leading-relaxed">Nivel Avanzado: Tienes buen criterio, refuerza matices técnicos.</p>
                    : <p className="text-rose-700 font-bold text-sm leading-relaxed">Nivel Explorador: Revisa las tarjetas informativas nuevamente.</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => { setQuizStep(0); setScore(0); setQuizFinished(false); setFeedback(null); setSelectedAnswer(null); setShowQuiz(false); }} className="bg-[#259eb5] text-white px-8 py-3 rounded-xl font-black shadow shadow-[#259eb5]/30 hover:bg-[#13374b] transition-colors text-sm flex items-center justify-center gap-2"><RefreshCcw size={16} /> Reiniciar</button>
                    <button onClick={() => setShowQuiz(false)} className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-black hover:border-[#13374b] transition-colors text-sm">Volver</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeModal !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#13374b]/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[2rem] shadow-2xl relative">
              <button onClick={() => { setActiveModal(null); stopSpeech(); }} className="sticky top-4 right-4 float-right z-10 p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-500 rounded-full transition-all shadow-sm"><X size={20} /></button>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl shadow-inner border border-slate-100">{tools[activeModal].icon}</div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-[#13374b]">{tools[activeModal].title}</h1>
                      <div className="flex items-center gap-1.5 text-[#259eb5] font-black uppercase tracking-widest text-[10px] mt-0.5"><Zap size={12} /> Función del Ecosistema</div>
                    </div>
                  </div>
                  <VoiceReader text={tools[activeModal].audio} />
                </div>
                <p className="text-base text-slate-500 leading-relaxed mb-6 font-medium">{tools[activeModal].desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                    <h3 className="flex items-center gap-1.5 font-black text-emerald-800 mb-4 uppercase tracking-widest text-[10px]"><CheckCircle2 size={14} /> Cuándo usarlo</h3>
                    <ul className="space-y-2">{tools[activeModal].pros.map((pro, i) => <li key={i} className="flex items-start gap-2 text-slate-700 font-bold text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {pro}</li>)}</ul>
                  </div>
                  <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                    <h3 className="flex items-center gap-1.5 font-black text-rose-800 mb-4 uppercase tracking-widest text-[10px]"><AlertCircle size={14} /> Limitaciones</h3>
                    <ul className="space-y-2">{tools[activeModal].cons.map((con, i) => <li key={i} className="flex items-start gap-2 text-slate-700 font-bold text-xs"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /> {con}</li>)}</ul>
                  </div>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl mb-6">
                  <h3 className="flex items-center gap-1.5 font-black text-[#13374b] mb-4 uppercase tracking-widest text-[10px]"><Lightbulb size={14} className="text-[#259eb5]" /> Casos de Uso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {tools[activeModal].useCases.map((u, i) => <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 font-bold text-slate-600 text-xs"><span className="text-[#259eb5] font-black">{i+1}.</span> {u}</div>)}
                  </div>
                </div>
                <div className="bg-[#13374b] rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Prompt Estratégico</h4>
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500" /><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /></div>
                  </div>
                  <code className="text-cyan-300 block text-sm font-mono leading-relaxed bg-black/20 p-4 rounded-xl italic">"{tools[activeModal].prompt}"</code>
                  <p className="text-slate-400 text-[9px] font-medium tracking-wide mt-3">Tip: Copia y adapta esta instrucción para tus flujos en Edutechlife.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold pb-8 uppercase tracking-widest">
        <p>Laboratorio guiado por <span className="text-[#259eb5]">Valerio</span> — Coach de IA de Edutechlife.</p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
