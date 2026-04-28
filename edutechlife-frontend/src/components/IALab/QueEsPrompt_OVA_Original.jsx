import React, { useState, useEffect, useRef } from 'react';
import {
 History,
 MessageSquare,
 Layers,
 Zap,
 ChevronRight,
 ChevronLeft,
 Volume2,
 CheckCircle2,
 Play,
 Trophy,
 Info,
 Menu,
 X,
 BookOpen,
 MousePointer2,
 Loader2,
 Square,
 AlertCircle,
 BrainCircuit,
 Sparkles,
 Rocket,
 Target,
 FileText,
 Cpu,
 Globe,
 ArrowRightCircle,
 AlertTriangle,
 Lightbulb,
 Search,
 Clock
} from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const COLORS = {
 primary: '#0D2B5B',
 secondary: '#00B4D8',
 bg: '#F8FAFC',
 white: '#FFFFFF',
 gradient: 'linear-gradient(135deg, #0D2B5B 0%, #1A4D8C 100%)'
};

const Logo = () => (
 <div className="flex items-center gap-2 select-none group cursor-pointer">
   <div className="relative w-9 h-9 flex items-center justify-center">
     <div className="absolute inset-0 bg-gradient-to-tr from-[#0D2B5B] to-[#00B4D8] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
     <BrainCircuit className="w-5 h-5 text-white relative z-10" />
   </div>
   <div className="text-xl tracking-tighter flex items-center lowercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
     <span className="font-[900]" style={{ color: COLORS.primary }}>edutech</span>
     <span className="font-[400]" style={{ color: COLORS.secondary }}>life</span>
   </div>
 </div>
);

const ModuleHistory = () => {
 const [active, setActive] = useState(0);
 const sections = [
   {
     t: "1950–1980 · Fundamentos",
     c: "En 1950, el matemático Alan Turing propuso el célebre Test de Turing, planteando la pregunta: ¿puede una máquina pensar? En 1956, durante la Conferencia de Dartmouth, John McCarthy acuñó el término 'Inteligencia Artificial'. Durante las siguientes décadas, se desarrollaron los primeros sistemas expertos, pero el progreso fue lento debido a las limitaciones de hardware, lo que llevó a los llamados 'inviernos de la IA'.",
     icon: <Cpu className="w-8 h-8" />
   },
   {
     t: "2010–2017 · Deep Learning",
     c: "La disponibilidad de grandes volúmenes de datos (Big Data) y el aumento en la potencia de procesamiento (GPUs) permitieron el renacimiento de la IA. En 2012, el modelo AlexNet demostró el poder de las redes neuronales profundas. La IA comenzó a superar a los humanos en tareas específicas de visión artificial y traducción.",
     icon: <Layers className="w-8 h-8" />
   },
   {
     t: "2017 · El Hito del Transformer",
     c: "Google publicó el paper «Attention is All You Need», introduciendo la arquitectura Transformer. Esta innovación permitió que los modelos «prestaran atención» a las relaciones entre palabras en contextos largos de forma eficiente, sentando las bases para los modelos de lenguaje modernos como GPT.",
     icon: <Sparkles className="w-8 h-8" />
   },
   {
     t: "2022–Actualidad · IA Generativa",
     c: "Con el lanzamiento de ChatGPT en noviembre de 2022, la IA generativa se volvió masiva. Modelos como GPT-4, Llama de Meta y Claude de Anthropic demostraron capacidades asombrosas no solo para procesar información, sino para crear contenido original: código, ensayos, poemas y razonamiento lógico complejo.",
     icon: <Rocket className="w-8 h-8" />
   }
 ];

 return (
   <div className="space-y-6 animate-in fade-in">
     <div className="flex flex-wrap gap-2 justify-center">
       {sections.map((s, i) => (
         <button
           key={i}
           onClick={() => setActive(i)}
           className={`px-4 py-2 rounded-2xl text-[10px] font-[800] uppercase tracking-widest transition-all ${active === i ? 'bg-[#0D2B5B] text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400 hover:border-[#00B4D8]'}`}
         >
           {s.t.split('·')[0]}
         </button>
       ))}
     </div>
     <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[220px]">
       <div className="absolute -right-4 -bottom-4 opacity-5 text-[#00B4D8]">
          {sections[active].icon}
       </div>
       <h4 className="text-[#0D2B5B] font-[900] text-lg mb-3 leading-none uppercase tracking-tighter">{sections[active].t}</h4>
       <p className="text-slate-600 leading-relaxed text-sm font-medium">{sections[active].c}</p>
     </div>
   </div>
 );
};

const ModuleAnatomy = () => {
 const [sel, setSel] = useState(null);
 const elements = [
   { k: 'Rol', d: 'Define quién debe ser la IA (ej. experto en marketing, tutor de matemáticas, programador senior). Esto establece el tono y el nivel de experticia.', i: '👤', c: 'bg-[#0D2B5B]' },
   { k: 'Contexto', d: 'Proporciona antecedentes, audiencia objetivo y situación (ej. "Estoy preparando una clase para niños de 10 años sobre el sistema solar").', i: '🌍', c: 'bg-[#00B4D8]' },
   { k: 'Tarea', d: 'La acción específica que quieres que realice (ej. "Escribe un resumen", "Genera 5 ideas", "Corrige este código"). Debe ser clara y directa.', i: '⚡', c: 'bg-[#4361EE]' },
   { k: 'Formato', d: 'Cómo quieres recibir la información (ej. una tabla, una lista de puntos, un ensayo de 3 párrafos, un archivo JSON).', i: '📄', c: 'bg-[#4CC9F0]' },
   { k: 'Restricción', d: 'Lo que NO quieres que la IA haga o límites específicos (ej. "No uses tecnicismos", "Máximo 100 palabras").', i: '🚫', c: 'bg-[#F72585]' },
   { k: 'Ejemplos', d: 'Proporcionar muestras del estilo o resultado esperado (técnica Few-Shot). Ayuda a la IA a entender el patrón deseado.', i: '✨', c: 'bg-[#FF9F1C]' }
 ];

 return (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center animate-in zoom-in">
     <div className="grid grid-cols-3 gap-2">
       {elements.map((el) => (
         <button
           key={el.k}
           onClick={() => setSel(el)}
           className={`p-4 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-2 group ${sel?.k === el.k ? 'border-[#00B4D8] bg-blue-50 shadow-md' : 'bg-white border-slate-50 hover:border-slate-200'}`}
         >
           <div className={`w-10 h-10 ${el.c} text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>{el.i}</div>
           <span className="text-[9px] font-black text-[#0D2B5B] uppercase tracking-tighter leading-none">{el.k}</span>
         </button>
       ))}
     </div>
     <div className="bg-[#0D2B5B] text-white p-8 rounded-[3rem] shadow-2xl relative min-h-[250px] flex flex-col justify-center border-b-4 border-[#00B4D8]">
       {sel ? (
         <div className="animate-in slide-in-from-right">
           <h5 className="text-[#00B4D8] font-[900] text-xs uppercase tracking-[0.3em] mb-3">Elemento: {sel.k}</h5>
           <p className="text-base leading-relaxed font-medium">{sel.d}</p>
         </div>
       ) : (
         <div className="text-center opacity-30 space-y-3">
           <MousePointer2 className="w-8 h-8 mx-auto animate-bounce" />
           <p className="text-[9px] font-black uppercase tracking-widest leading-none">Explora la anatomía interactiva</p>
         </div>
       )}
     </div>
   </div>
 );
};

const Quiz = ({ onComplete }) => {
 const [currentQ, setCurrentQ] = useState(0);
 const [score, setScore] = useState(0);
 const [selected, setSelected] = useState(null);
 const [showFeedback, setShowFeedback] = useState(false);

 const questions = [
   {
     q: "Si un prompt genera una respuesta 'vaga y genérica', ¿cuál es probablemente la razón principal según la lectura?",
     o: ["La IA no tiene suficiente memoria", "Falta de contexto y especificidad en la instrucción", "El servidor de la IA está saturado", "La IA no sabe hablar español"],
     c: 1,
     f: "La lectura enfatiza que la IA no conoce tu contexto personal a menos que tú se lo proporciones explícitamente."
   },
   {
     q: "Al usar la técnica 'Chain of Thought' (Cadena de Pensamiento), el objetivo principal es:",
     o: ["Que la IA responda más rápido", "Hacer que la IA escriba textos creativos", "Obligar a la IA a mostrar su razonamiento paso a paso para mejorar la precisión", "Ahorrar tokens en la respuesta"],
     c: 2,
     f: "Esta técnica mejora drásticamente los resultados en tareas de lógica y resolución de problemas."
   },
   {
     q: "¿Por qué el prompt se define como un 'puente de comunicación'?",
     o: ["Porque permite conectar dos computadoras", "Porque es la única interfaz que guía el razonamiento y la creatividad de la máquina", "Porque traduce idiomas automáticamente", "Porque conecta a la IA con el internet"],
     c: 1,
     f: "El prompt es la herramienta que permite que la intención humana se convierta en una salida útil de la IA."
   },
   {
     q: "En la 'Anatomía de un Prompt', ¿cuál es la función del componente de Restricciones?",
     o: ["Hacer el prompt más largo", "Dar ejemplos del resultado", "Establecer límites y condiciones de lo que la IA NO debe hacer", "Elegir el idioma de salida"],
     c: 2,
     f: "Las restricciones acotan el resultado final evitando tecnicismos innecesarios o extensiones excesivas."
   },
   {
     q: "¿Qué implica la 'Iteración' en la ingeniería de prompts?",
     o: ["Aceptar la primera respuesta de la IA", "Copiar y pegar el mismo prompt varias veces", "Evaluar, identificar limitaciones y ajustar la instrucción hasta lograr el resultado óptimo", "Apagar y encender el sistema"],
     c: 2,
     f: "La ingeniería de prompts es un proceso dinámico y estratégico de refinamiento constante."
   }
 ];

 const handleSelect = (idx) => {
   if (showFeedback) return;
   setSelected(idx);
   setShowFeedback(true);
   if (idx === questions[currentQ].c) setScore(score + 1);
 };

 const handleNext = () => {
   if (currentQ < questions.length - 1) {
     setCurrentQ(currentQ + 1);
     setSelected(null);
     setShowFeedback(false);
   } else {
     onComplete(score);
   }
 };

 return (
   <div className="space-y-6 animate-in fade-in">
     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
       <span>Análisis de Lectura {currentQ + 1} de 5</span>
       <span className="text-[#00B4D8]">Aciertos: {score}</span>
     </div>
     <h3 className="text-xl font-[900] text-[#0D2B5B] leading-tight">{questions[currentQ].q}</h3>
     <div className="grid gap-2">
       {questions[currentQ].o.map((opt, i) => (
         <button
           key={i}
           onClick={() => handleSelect(i)}
           className={`p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all ${
             showFeedback
               ? i === questions[currentQ].c ? 'bg-green-50 border-green-500 text-green-700' : selected === i ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-transparent opacity-50'
               : 'bg-white border-slate-100 hover:border-[#00B4D8]'
           }`}
         >
           {opt}
         </button>
       ))}
     </div>
     {showFeedback && (
       <div className="p-5 bg-slate-100 rounded-[2rem] animate-in slide-in-from-top">
         <p className="text-xs font-bold leading-relaxed">{questions[currentQ].f}</p>
         <button onClick={handleNext} className="mt-4 w-full py-3 bg-[#0D2B5B] text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs">
           {currentQ === 4 ? "Ver Resultados Finales" : "Continuar Análisis"} <ChevronRight size={14}/>
         </button>
       </div>
     )}
   </div>
 );
};

const QueEsPrompt_OVA_Original = ({ onClose }) => {
 const [screen, setScreen] = useState('welcome');
 const [completed, setCompleted] = useState([]);
 const [quizScore, setQuizScore] = useState(null);
 const [audioLoading, setAudioLoading] = useState(false);
 const [playing, setPlaying] = useState(false);
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");

 const screensData = {
   welcome: {
     title: 'Historia de la IA Generativa e Ingeniería de Prompts',
     content: 'Bienvenidos. La IA generativa es una realidad que transforma la educación y el trabajo. Hoy aprenderás la habilidad más importante: saber hablarle a la máquina con inteligencia y criterio.'
   },
   menu: {
     title: '¿Qué aprenderás en este módulo?',
     content: 'Esta guía contextualiza el origen de la IA generativa y desarrolla la habilidad de diseño inteligente de prompts.'
   },
   m1: {
     title: 'Breve Historia de la IA Generativa',
     content: 'Más de 70 años de investigación culminaron en los modelos actuales. Conocerás los hitos clave desde el Test de Turing hasta la arquitectura Transformer.'
   },
   m2: {
     title: 'El concepto de prompt',
     content: 'Un prompt es la interfaz de comunicación entre el usuario y un modelo de lenguaje. Es el conjunto de instrucciones que sirven de puente entre la mente humana y la IA.'
   },
   m3: {
     title: 'Anatomía de un Prompt',
     content: 'Un prompt efectivo incluye rol, contexto, tarea, formato, restricciones y ejemplos. Aprenderás a integrar cada componente.'
   },
   m4: {
     title: 'Ingeniería de prompts',
     content: 'Dispondrás de estrategias concretas como Chain of Thought, few-shot e iteración para obtener resultados de alta calidad.'
   },
   m5: {
     title: 'Errores Comunes al Diseñar Prompts',
     content: 'Evita fallos como prompts vagos, pedir demasiado en una sola instrucción o no verificar la información generada.'
   },
   m6: {
     title: 'Reto de Comprensión General',
     content: 'Es hora de demostrar tu capacidad de interpretación y comprensión de la lectura. El futuro pertenece a quienes sepan colaborar con la IA.'
   }
 };

 const nav = ['welcome', 'menu', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6'];
 const curIdx = nav.indexOf(screen);

 const handleTTS = (text) => {
   if (playing) { stopSpeech(); setPlaying(false); return; }
   setErrorMsg("");
   setAudioLoading(true);
   speakTextConversational(text, 'valerio', () => {
       setPlaying(false);
       setAudioLoading(false);
   });
   setPlaying(true);
   setAudioLoading(false);
 };

 const renderContent = () => {
   switch (screen) {
     case 'welcome':
       return (
         <div className="text-center space-y-10 py-6 animate-in fade-in duration-1000">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-[#00B4D8] rounded-full blur-[80px] opacity-10 animate-pulse"></div>
               <div className="relative bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50">
                  <div className="w-20 h-20 bg-gradient-to-tr from-[#0D2B5B] to-[#00B4D8] rounded-[1.8rem] flex items-center justify-center shadow-xl rotate-3">
                     <BrainCircuit className="w-10 h-10 text-white" />
                  </div>
               </div>
            </div>
            <div className="space-y-2">
               <h1 className="text-5xl md:text-7xl font-[400] text-[#0D2B5B] leading-[0.9] tracking-tighter lowercase">
                 ia generativa
               </h1>
               <h2 className="text-3xl md:text-5xl font-[900] text-[#0D2B5B] tracking-tight">
                 INGENIERIA DE PROMPTS
               </h2>
            </div>
            <button onClick={() => setScreen('menu')} className="group px-12 py-5 bg-[#0D2B5B] text-white rounded-[2rem] font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto" style={{ background: COLORS.gradient }}>
              Comenzar Módulo <ArrowRightCircle className="w-6 h-6" />
            </button>
         </div>
       );
     case 'menu':
       return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom">
           {nav.slice(2).map((id) => (
             <button key={id} onClick={() => setScreen(id)} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg hover:border-[#00B4D8] transition-all flex flex-col items-center text-center gap-4 relative overflow-hidden">
               <div className="bg-[#F0F9FF] text-[#0D2B5B] p-4 rounded-[1.5rem] shadow-sm group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
               </div>
               <span className="font-[900] text-[#0D2B5B] text-[10px] uppercase tracking-[0.1em] leading-tight">{screensData[id].title}</span>
               {completed.includes(id) && <div className="absolute top-4 right-4 bg-green-50 p-1 rounded-full"><CheckCircle2 className="text-green-500 w-4 h-4" /></div>}
             </button>
           ))}
         </div>
       );
     case 'm1': return <ModuleHistory />;
     case 'm2': return (
       <div className="space-y-8 animate-in fade-in">
         <div className="p-10 bg-[#F0F9FF] rounded-[4rem] border-4 border-white shadow-xl relative overflow-hidden group">
           <h4 className="text-[#0D2B5B] font-[900] text-3xl mb-6 tracking-tighter leading-none lowercase">el prompt como interfaz</h4>
           <p className="text-slate-600 leading-relaxed font-bold text-lg max-w-2xl">
             Es la interfaz de comunicación entre el usuario y un modelo de lenguaje. Es el conjunto de instrucciones que sirven de puente entre la mente humana y la red neuronal de la IA. Su diseño determina la calidad de los resultados.
           </p>
         </div>
         <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 shadow-inner"><Lightbulb size={32} /></div>
            <p className="text-xs md:text-sm text-slate-500 font-bold italic leading-relaxed">
              "Dominarás qué es un prompt, sus tipos y por qué su calidad determina directamente la calidad de la respuesta de la IA."
            </p>
         </div>
       </div>
     );
     case 'm3': return <ModuleAnatomy />;
     case 'm4': return (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom">
         {[
           { t: 'Chain of Thought', d: 'Pide a la IA que «piensa paso a paso» para mejorar el razonamiento.', i: <BrainCircuit className="w-5 h-5"/> },
           { t: 'Few-Shot Prompting', d: 'Incluye ejemplos del resultado esperado para guiar el modelo.', i: <Layers className="w-5 h-5"/> },
           { t: 'Iteración', d: 'Refina el prompt basándote en la respuesta anterior.', i: <Zap className="w-5 h-5"/> },
           { t: 'Roles', d: 'Asigna una identidad experta para cambiar el enfoque del modelo.', i: <Globe className="w-5 h-5"/> },
           { t: 'Descomposición', d: 'Divide tareas complejas en pasos pequeños y manejables.', i: <Target className="w-5 h-5"/> },
           { t: 'Prompt Chaining', d: 'Usa la salida de un prompt como entrada del siguiente.', i: <Sparkles className="w-5 h-5"/> }
         ].map((s, i) => (
           <div key={i} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-[2.2rem] shadow-sm hover:shadow-lg transition-all group">
             <div className="p-3 bg-slate-50 text-[#0D2B5B] rounded-[1rem] shadow-inner group-hover:bg-[#0D2B5B] group-hover:text-white transition-all">{s.i}</div>
             <div><h5 className="font-[900] text-[#0D2B5B] text-xs uppercase mb-1 tracking-tighter leading-none">{s.t}</h5><p className="text-[10px] text-slate-500 font-medium leading-relaxed">{s.d}</p></div>
           </div>
         ))}
       </div>
     );
     case 'm5': return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in">
         {[
           { t: 'Prompts vagos', d: '«Ayúdame con mi tarea» no indica materia, objetivo ni formato.', i: <AlertTriangle /> },
           { t: 'Pedir demasiado', d: 'Hacer muchas peticiones en un solo prompt genera respuestas superficiales.', i: <FileText /> },
           { t: 'No verificar', d: 'Los modelos pueden generar contenido incorrecto con aparente confianza.', i: <Search /> },
           { t: 'No iterar', d: 'Si la primera respuesta no satisface, ajusta el prompt en lugar de abandonar.', i: <Zap /> },
           { t: 'Olvidar el formato', d: 'Sin especificarlo, la respuesta puede ser difícil de usar directamente.', i: <Info /> },
           { t: 'Asumir memoria', d: 'Cada sesión nueva empieza sin recordar conversaciones pasadas.', i: <Clock /> }
         ].map((e, i) => (
           <div key={i} className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
             <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">{e.i}</div>
             <h5 className="font-[900] text-[#0D2B5B] text-[10px] uppercase tracking-widest leading-none mb-1">{e.t}</h5>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{e.d}</p>
           </div>
         ))}
       </div>
     );
     case 'm6': return quizScore !== null ? (
       <div className="text-center py-8 animate-in zoom-in">
         <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white"><Trophy className="w-16 h-16 text-amber-500" /></div>
         <h2 className="text-5xl font-black text-[#0D2B5B] tracking-tighter leading-none mb-3 uppercase">¡completado!</h2>
         <div className="bg-[#0D2B5B] text-white inline-block px-12 py-6 rounded-[3rem] mt-6 text-6xl font-black shadow-xl border-b-8 border-[#00B4D8]">{quizScore} / 5</div>
         <p className="text-slate-500 mt-10 font-black text-lg uppercase tracking-[0.2em] opacity-40">edutechlife master</p>
         <button onClick={() => { setScreen('menu'); setQuizScore(null); }} className="mt-12 px-12 py-4 bg-slate-100 text-slate-500 font-bold rounded-[1.5rem] hover:bg-slate-200 transition-all uppercase tracking-[0.1em] text-[10px]">Finalizar</button>
       </div>
     ) : (
       <Quiz onComplete={(s) => { setQuizScore(s); setCompleted([...completed, 'm6']); }} />
     );
     default: return null;
   }
 };

 return (
   <div className="w-full h-fit bg-[#F8FAFC] text-slate-900 font-sans flex flex-col overflow-x-hidden selection:bg-blue-100">

     {/* Header */}
     <header className="sticky top-0 w-full bg-white/80 backdrop-blur-2xl border-b z-10 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
       <Logo />
       <div className="flex items-center gap-8">
         <div className="hidden lg:flex flex-col items-end">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">PROGRESO</span>
           <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
             <div className="h-full bg-gradient-to-r from-[#0D2B5B] to-[#00B4D8] transition-all duration-1000 ease-out shadow-lg" style={{ width: `${(completed.length/6)*100}%` }}></div>
           </div>
         </div>
         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-[#F1F5F9] hover:bg-slate-200 rounded-[1.2rem] transition-all shadow-sm border border-slate-100"><Menu className="w-6 h-6 text-[#0D2B5B]" /></button>
         <button onClick={onClose} className="p-3 bg-red-50 hover:bg-red-100 rounded-[1.2rem] transition-all shadow-sm border border-red-100" aria-label="Cerrar OVA">
           <X className="w-6 h-6 text-red-500" />
         </button>
       </div>
     </header>

     {errorMsg && (
       <div className="mx-auto mt-4 max-w-lg bg-red-600 text-white px-6 py-4 rounded-[2rem] text-xs font-black flex items-center gap-4 shadow-2xl animate-in slide-in-from-top">
         <AlertCircle className="w-5 h-5 flex-shrink-0" /> {errorMsg}
       </div>
     )}

     {/* Main Content */}
     <main className="flex-1 pt-6 px-4 md:px-6 flex items-center justify-center">
       <div className="w-full max-w-5xl bg-white rounded-[4.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.08)] p-12 md:p-20 relative overflow-hidden border border-slate-50">
         {screen.startsWith('m') && (
           <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-slate-50 pb-12">
             <div className="space-y-3">
               <div className="flex items-center gap-2 text-[#00B4D8] font-[900] text-[10px] tracking-[0.4em] uppercase"><Sparkles className="w-4 h-4" /> edutechlife master</div>
               <h1 className="text-4xl md:text-6xl font-[900] text-[#0D2B5B] tracking-tighter leading-[0.85]">{screensData[screen].title}</h1>
             </div>
             <button
               onClick={() => handleTTS(screensData[screen].content)}
               disabled={audioLoading}
               className={`flex items-center gap-4 px-10 py-4 rounded-[2.5rem] font-black text-[10px] transition-all shadow-xl group ${playing ? 'bg-red-600 text-white shadow-red-600/30' : 'bg-[#F1F5F9] text-[#0D2B5B] hover:bg-slate-200'}`}
             >
               {audioLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> ...</> : playing ? <><Square className="w-4 h-4 fill-current" /> DETENER</> : <><Volume2 className="w-4 h-4 group-hover:scale-125 transition-transform" /> AUDIO</>}
             </button>
           </div>
         )}
         
         <div className="relative z-10 min-h-[450px] flex flex-col justify-center">
           {renderContent()}
         </div>

         <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-[#00B4D8] rounded-full blur-[150px] opacity-[0.05] pointer-events-none"></div>
         <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-[#0D2B5B] rounded-full blur-[150px] opacity-[0.05] pointer-events-none"></div>
       </div>
     </main>

     {/* Nav Footer Fixed Bottom */}
     {screen !== 'welcome' && (
       <footer className="sticky bottom-0 w-full bg-white/90 backdrop-blur-3xl border-t border-slate-100 p-4 md:p-6 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex justify-center">
         <div className="w-full max-w-4xl flex justify-between items-center gap-6">
           <button
             onClick={() => {
               if (curIdx > 0) setScreen(nav[curIdx - 1]);
               stopSpeech();
               setPlaying(false);
             }}
             className="p-4 bg-[#F1F5F9] text-slate-400 hover:text-[#0D2B5B] rounded-[1.5rem] disabled:opacity-10 transition-all shadow-inner border border-slate-50"
             disabled={curIdx === 0}
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
           
           <div className="flex gap-3">
             {nav.map((_, i) => (
               <div key={i} className={`h-2 rounded-full transition-all duration-700 ${i === curIdx ? 'w-16 bg-[#0D2B5B]' : 'w-2.5 bg-slate-200'}`}></div>
             ))}
           </div>

           <button
             onClick={() => {
               if (curIdx < nav.length - 1) {
                 if (screen.startsWith('m')) {
                   const newC = [...completed];
                   if (!newC.includes(screen)) newC.push(screen);
                   setCompleted(newC);
                 }
                 setScreen(nav[curIdx + 1]);
                 stopSpeech();
                 setPlaying(false);
               }
             }}
             className="px-10 py-4 bg-[#0D2B5B] text-white rounded-[1.8rem] font-[900] text-xs shadow-xl active:scale-95 transition-all flex items-center gap-3 uppercase tracking-[0.2em]"
             style={{ background: COLORS.gradient }}
           >
             Siguiente <ArrowRightCircle className="w-6 h-6" />
           </button>
         </div>
       </footer>
     )}

     {/* Sidebar */}
     {isMenuOpen && (
       <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsMenuOpen(false)}>
         <div className="absolute right-0 h-full w-[400px] bg-white shadow-2xl p-12 flex flex-col gap-6 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMenuOpen(false)} className="self-end p-3 hover:bg-slate-100 rounded-full transition-colors"><X className="w-8 h-8 text-slate-400" /></button>
            <h3 className="font-[900] text-slate-300 text-xs tracking-[0.4em] mt-12 mb-8 uppercase border-b-2 border-slate-50 pb-6">Mapa del Módulo</h3>
            {nav.map(id => (
              <button key={id} onClick={() => { setScreen(id); setIsMenuOpen(false); }} className={`p-6 rounded-[2.5rem] text-left text-xs font-[900] transition-all flex items-center justify-between group ${screen === id ? 'bg-[#0D2B5B] text-white shadow-xl' : 'hover:bg-slate-50 text-slate-500'}`}>
                <span className="uppercase tracking-widest">{screensData[id].title}</span>
                {completed.includes(id) && <CheckCircle2 className="w-6 h-6 text-[#00B4D8]" />}
              </button>
            ))}
         </div>
       </div>
     )}

     <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
       body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #F8FAFC; color: #0D2B5B; }
       @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
       @keyframes slideInFromBottom { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
       @keyframes slideInFromRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
       @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
       @keyframes slideInFromTop { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
       .animate-in { animation: fadeIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
       .slide-in-from-bottom { animation: slideInFromBottom 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
       .slide-in-from-right { animation: slideInFromRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
       .zoom-in { animation: zoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
       .slide-in-from-top { animation: slideInFromTop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
     `}</style>
   </div>
 );
};

export default QueEsPrompt_OVA_Original;
