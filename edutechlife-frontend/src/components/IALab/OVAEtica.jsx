import React, { useState } from 'react';
import {
  History, MessageSquare, Layers, Zap, ChevronRight, ChevronLeft,
  Volume2, Square, CheckCircle2, Play, Trophy, Info, Menu, X,
  BookOpen, MousePointer2, AlertCircle, BrainCircuit, Sparkles, Rocket,
  Target, FileText, Cpu, Globe, ArrowRightCircle, AlertTriangle,
  Lightbulb, Search, Clock, Award, Star, GraduationCap, Bot, Settings
} from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const COLORS = { primary: '#0D2B5B', secondary: '#00B4D8', bg: '#F8FAFC', white: '#FFFFFF', gradient: 'linear-gradient(135deg, #0D2B5B 0%, #1A4D8C 100%)' };

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

const VoiceReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speak = () => {
    if (isPlaying) { stopSpeech(); setIsPlaying(false); return; }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button onClick={speak} className={`flex items-center gap-3 px-6 py-3 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${isPlaying ? 'bg-red-600 text-white shadow-red-600/30' : 'bg-[#F1F5F9] dark:bg-slate-700 text-[#0D2B5B] hover:bg-slate-200 dark:hover:bg-slate-600'}`} title="Escuchar con voz de Valerio">
      {isPlaying ? <Square size={16} /> : <Volume2 size={16} />}
      {isPlaying ? 'Detener' : 'Escuchar con Valerio'}
    </button>
  );
};

const Button = ({ children, onClick, className = '', disabled = false }) => (
  <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all disabled:opacity-30 ${className}`}>{children}</button>
);

const WelcomeScreen = ({ onNext }) => (
  <div className="text-center space-y-4 py-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D2B5B]/5 text-[#00B4D8] font-black text-[9px] uppercase tracking-[0.15em] border border-[#00B4D8]/20">
      <Bot size={14} /><span>Laboratorio Guiado por Valerio</span>
    </div>
    <div className="relative inline-block">
      <div className="absolute inset-0 bg-[#00B4D8] rounded-full blur-[60px] opacity-10 animate-pulse"></div>
      <div className="relative bg-white dark:bg-slate-800 p-6 rounded-[3rem] shadow-xl border border-slate-50 dark:border-slate-700">
        <div className="w-14 h-14 bg-gradient-to-tr from-[#0D2B5B] to-[#00B4D8] rounded-[1.4rem] flex items-center justify-center shadow-md rotate-3">
          <BrainCircuit className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
    <div className="space-y-1">
      <h1 className="text-3xl md:text-4xl font-[400] text-[#0D2B5B] leading-[0.9] tracking-tighter lowercase">comienzos de la</h1>
      <h2 className="text-2xl md:text-3xl font-[900] text-[#0D2B5B] tracking-tight">INTELIGENCIA ARTIFICIAL</h2>
    </div>
    <p className="text-slate-500 dark:text-slate-300 max-w-lg mx-auto font-bold text-[13px]">Hola, soy Valerio, tu coach de IA. En este laboratorio exploraremos los orígenes de la IA generativa y dominaremos el arte de la ingeniería de prompts.</p>
    <VoiceReader text="Hola, soy Valerio, tu coach de IA de Edutechlife. En este laboratorio exploraremos juntos los comienzos de la inteligencia artificial: desde el Test de Turing hasta la era de los modelos generativos. Aprenderemos qué son los prompts y cómo dominarlos." />
    <Button onClick={onNext} className="mx-auto bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white" icon={Play}>Comenzar Laboratorio</Button>
  </div>
);

const ModuleHistory = () => {
  const [active, setActive] = useState(0);
  const sections = [
    { t: "1950–1980 · Fundamentos", c: "En 1950, Alan Turing propuso el Test de Turing. En 1956, John McCarthy acuñó el término 'Inteligencia Artificial'. Se desarrollaron los primeros sistemas expertos, pero el progreso fue lento por limitaciones de hardware, llevando a los 'inviernos de la IA'.", icon: <Cpu className="w-8 h-8" /> },
    { t: "2010–2017 · Deep Learning", c: "Grandes volúmenes de datos y GPUs permitieron el renacimiento de la IA. En 2012, AlexNet demostró el poder de las redes neuronales profundas en visión artificial.", icon: <Layers className="w-8 h-8" /> },
    { t: "2017 · El Hito del Transformer", c: "Google publicó «Attention is All You Need», introduciendo la arquitectura Transformer. Permitió que los modelos procesaran relaciones entre palabras en contextos largos eficientemente.", icon: <Sparkles className="w-8 h-8" /> },
    { t: "2022–Actualidad · IA Generativa", c: "Con ChatGPT en noviembre de 2022, la IA generativa se volvió masiva. Modelos como GPT-4, Llama y Claude demostraron capacidades para crear contenido original: código, ensayos y razonamiento complejo.", icon: <Rocket className="w-8 h-8" /> }
  ];
  const text = sections[active].c;
  return (
    <div className="space-y-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {sections.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} className={`px-4 py-2 rounded-2xl text-[10px] font-[800] uppercase tracking-widest transition-all ${active === i ? 'bg-[#0D2B5B] text-white shadow-lg' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#00B4D8]'}`}>{s.t.split('·')[0]}</button>
          ))}
        </div>
        <VoiceReader text={text} />
      </div>
      <div className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-md relative overflow-hidden flex flex-col justify-center min-h-[150px]">
        <div className="absolute -right-4 -bottom-4 opacity-5 text-[#00B4D8]">{sections[active].icon}</div>
        <h4 className="text-[#0D2B5B] font-[900] text-lg mb-3 leading-none uppercase tracking-tighter">{sections[active].t}</h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">{sections[active].c}</p>
      </div>
    </div>
  );
};

const PromptConcept = () => (
  <div className="space-y-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div className="p-5 bg-[#F0F9FF] rounded-[2rem] border-2 border-white dark:border-slate-700 shadow-md relative overflow-hidden">
      <h4 className="text-[#0D2B5B] font-[900] text-xl mb-3 tracking-tighter leading-none lowercase">el prompt como interfaz</h4>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm max-w-2xl">Es la interfaz de comunicación entre el usuario y un modelo de lenguaje. Es el conjunto de instrucciones que sirven de puente entre la mente humana y la red neuronal de la IA. Su diseño determina la calidad de los resultados.</p>
      <VoiceReader text="Un prompt es la interfaz de comunicación entre el usuario y un modelo de lenguaje. Es el conjunto de instrucciones que sirven de puente entre la mente humana y la red neuronal de la IA. Su diseño determina la calidad de los resultados." />
    </div>
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-[1.5rem] flex items-center gap-3 shadow-sm">
      <div className="p-3 bg-amber-50 rounded-xl text-amber-500 shadow-inner"><Lightbulb size={24} /></div>
      <p className="text-[11px] text-slate-500 dark:text-slate-300 font-bold italic leading-relaxed">"Dominarás qué es un prompt, sus tipos y por qué su calidad determina directamente la calidad de la respuesta de la IA."</p>
    </div>
  </div>
);

const ModuleAnatomy = () => {
  const [sel, setSel] = useState(null);
  const elements = [
    { k: 'Rol', d: 'Define quién debe ser la IA (ej. experto en marketing, tutor). Establece el tono y nivel de experticia.', c: 'bg-[#0D2B5B]' },
    { k: 'Contexto', d: 'Proporciona antecedentes, audiencia objetivo y situación.', c: 'bg-[#00B4D8]' },
    { k: 'Tarea', d: 'La acción específica que quieres que realice. Debe ser clara y directa.', c: 'bg-[#4361EE]' },
    { k: 'Formato', d: 'Cómo quieres recibir la información: tabla, lista, ensayo, JSON.', c: 'bg-[#4CC9F0]' },
    { k: 'Restricción', d: 'Lo que NO quieres que la IA haga o límites específicos.', c: 'bg-[#F72585]' },
    { k: 'Ejemplos', d: 'Proporcionar muestras del estilo o resultado esperado (Few-Shot).', c: 'bg-[#FF9F1C]' }
  ];
  const text = sel ? sel.d : '';
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center animate-[zoomIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
      <div className="grid grid-cols-3 gap-2">
        {elements.map((el) => (
          <button key={el.k} onClick={() => setSel(el)} className={`p-4 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-2 group ${sel?.k === el.k ? 'border-[#00B4D8] bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
            <div className={`w-10 h-10 ${el.c} text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}><span className="text-lg font-black">{el.k[0]}</span></div>
            <span className="text-[9px] font-black text-[#0D2B5B] uppercase tracking-tighter leading-none">{el.k}</span>
          </button>
        ))}
      </div>
      <div className="bg-[#0D2B5B] text-white p-5 rounded-[1.8rem] shadow-lg relative min-h-[180px] flex flex-col justify-center border-b-2 border-[#00B4D8]">
        {sel ? (
          <div className="animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h5 className="text-[#00B4D8] font-[900] text-xs uppercase tracking-[0.3em] mb-3">Elemento: {sel.k}</h5>
            <p className="text-base leading-relaxed font-medium">{sel.d}</p>
            <div className="mt-4"><VoiceReader text={text} /></div>
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

const TechniquesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] slide-in-from-bottom">
    {[
      { t: 'Chain of Thought', d: 'Pide a la IA que «piensa paso a paso» para mejorar el razonamiento.', i: <BrainCircuit className="w-5 h-5" /> },
      { t: 'Few-Shot Prompting', d: 'Incluye ejemplos del resultado esperado para guiar el modelo.', i: <Layers className="w-5 h-5" /> },
      { t: 'Iteración', d: 'Refina el prompt basándote en la respuesta anterior.', i: <Zap className="w-5 h-5" /> },
      { t: 'Roles', d: 'Asigna una identidad experta para cambiar el enfoque del modelo.', i: <Globe className="w-5 h-5" /> },
      { t: 'Descomposición', d: 'Divide tareas complejas en pasos pequeños.', i: <Target className="w-5 h-5" /> },
      { t: 'Prompt Chaining', d: 'Usa la salida de un prompt como entrada del siguiente.', i: <Sparkles className="w-5 h-5" /> }
    ].map((s, i) => (
      <div key={i} className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.2rem] shadow-sm hover:shadow-lg transition-all group">
        <div className="p-3 bg-slate-50 dark:bg-slate-700 text-[#0D2B5B] rounded-[1rem] shadow-inner group-hover:bg-[#0D2B5B] group-hover:text-white transition-all">{s.i}</div>
        <div><h5 className="font-[900] text-[#0D2B5B] text-xs uppercase mb-1 tracking-tighter leading-none">{s.t}</h5><p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium leading-relaxed">{s.d}</p></div>
      </div>
    ))}
  </div>
);

const ErrorSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    {[
      { t: 'Prompts vagos', d: '«Ayúdame con mi tarea» no indica materia, objetivo ni formato.', i: <AlertTriangle /> },
      { t: 'Pedir demasiado', d: 'Hacer muchas peticiones en un solo prompt genera respuestas superficiales.', i: <FileText /> },
      { t: 'No verificar', d: 'Los modelos pueden generar contenido incorrecto con aparente confianza.', i: <Search /> },
      { t: 'No iterar', d: 'Si la primera respuesta no satisface, ajusta el prompt.', i: <Zap /> },
      { t: 'Olvidar el formato', d: 'Sin especificarlo, la respuesta puede ser difícil de usar.', i: <Info /> },
      { t: 'Asumir memoria', d: 'Cada sesión nueva empieza sin recordar conversaciones pasadas.', i: <Clock /> }
    ].map((e, i) => (
      <div key={i} className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
        <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">{e.i}</div>
        <h5 className="font-[900] text-[#0D2B5B] text-[10px] uppercase tracking-widest leading-none mb-1">{e.t}</h5>
        <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{e.d}</p>
      </div>
    ))}
  </div>
);

const QuizScreen = ({ onNext, addXp }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const questions = [
    { q: "Si un prompt genera una respuesta 'vaga y genérica', ¿cuál es la razón principal?", o: ["La IA no tiene suficiente memoria", "Falta de contexto y especificidad", "El servidor está saturado", "La IA no sabe español"], c: 1, f: "La IA no conoce tu contexto a menos que se lo proporciones explícitamente." },
    { q: "Al usar Chain of Thought, el objetivo principal es:", o: ["Que la IA responda más rápido", "Escribir textos creativos", "Obligar a la IA a mostrar su razonamiento paso a paso", "Ahorrar tokens"], c: 2, f: "Mejora drásticamente los resultados en tareas de lógica y resolución de problemas." },
    { q: "¿Por qué el prompt es un 'puente de comunicación'?", o: ["Conecta dos computadoras", "Es la interfaz que guía el razonamiento de la máquina", "Traduce idiomas", "Conecta a la IA con internet"], c: 1, f: "El prompt permite que la intención humana se convierta en una salida útil de la IA." },
    { q: "¿Cuál es la función de las Restricciones en un prompt?", o: ["Hacerlo más largo", "Dar ejemplos", "Establecer límites de lo que la IA NO debe hacer", "Elegir el idioma"], c: 2, f: "Las restricciones acotan el resultado evitando tecnicismos o extensiones excesivas." },
    { q: "¿Qué implica la Iteración en ingeniería de prompts?", o: ["Aceptar la primera respuesta", "Copiar el mismo prompt", "Evaluar, ajustar y refinar hasta lograr el resultado óptimo", "Reiniciar el sistema"], c: 2, f: "La ingeniería de prompts es un proceso dinámico de refinamiento constante." }
  ];
  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === questions[currentQ].c) { setScore(s => s + 1); addXp(100); }
  };
  const handleNext = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setSelected(null); setShowFeedback(false); }
    else { setShowResult(true); }
  };
  if (showResult) {
    return (
      <div className="text-center py-4 animate-[zoomIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white dark:border-slate-700"><Trophy className="w-10 h-10 text-amber-500" /></div>
        <h2 className="text-3xl font-black text-[#0D2B5B] tracking-tighter leading-none mb-2 uppercase">¡completado!</h2>
        <div className="bg-[#0D2B5B] text-white inline-block px-8 py-4 rounded-[2rem] mt-4 text-4xl font-black shadow-lg border-b-4 border-[#00B4D8]">{score} / 5</div>
        <p className="text-slate-500 dark:text-slate-300 mt-4 font-bold text-sm">{score === 5 ? '¡Puntuación perfecta! Valerio está orgulloso de ti.' : score >= 3 ? '¡Buen trabajo! Repasa los conceptos dudosos.' : 'No te preocupes, repasa el laboratorio. Valerio confía en ti.'}</p>
        <Button onClick={onNext} className="mt-6 bg-[#0D2B5B] text-white mx-auto">Recibir Certificado</Button>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
        <span>Pregunta {currentQ + 1} de 5</span>
        <span className="text-[#00B4D8]">Aciertos: {score}</span>
      </div>
      <h3 className="text-xl font-[900] text-[#0D2B5B] leading-tight">{questions[currentQ].q}</h3>
      <div className="grid gap-2">
        {questions[currentQ].o.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)} className={`p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all ${showFeedback ? i === questions[currentQ].c ? 'bg-green-50 border-green-500 text-green-700' : selected === i ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-transparent opacity-50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#00B4D8]'}`}>{opt}</button>
        ))}
      </div>
      {showFeedback && (
        <div className="p-5 bg-slate-100 dark:bg-slate-700 rounded-[2rem] animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] slide-in-from-top">
          <p className="text-xs font-bold leading-relaxed">{questions[currentQ].f}</p>
          <button onClick={handleNext} className="mt-4 w-full py-3 bg-[#0D2B5B] text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs">{currentQ === 4 ? 'Ver Resultados' : 'Continuar'} <ChevronRight size={14} /></button>
        </div>
      )}
    </div>
  );
};

const CertificateScreen = ({ xp, onReset }) => (
  <div className="mx-auto animate-fade-in text-center">
    <h2 className="text-2xl font-extrabold text-[#0D2B5B] mb-3">¡Felicidades, Explorador de la IA!</h2>
    <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">Has completado el laboratorio guiado por Valerio. Ahora comprendes los orígenes de la IA generativa y el arte de la ingeniería de prompts.</p>
    <div className="bg-gradient-to-br from-[#0D2B5B] to-[#0A1F3F] p-[2px] rounded-2xl shadow-lg mx-auto max-w-md transform hover:scale-105 transition-transform duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[14px] p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-100 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-tr-full opacity-50"></div>
        <div className="flex justify-center mb-3"><Logo /></div>
        <div className="text-[10px] font-bold tracking-widest text-[#00B4D8] uppercase mb-1">Certificado de Finalización</div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Laboratorio: Comienzos de la IA</h3>
        <div className="flex justify-center gap-4 text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-700 py-2 mb-3 text-xs">
          <div><div className="text-[9px] uppercase tracking-wider">XP</div><div className="text-sm font-bold text-[#0D2B5B]">{xp} / 500</div></div>
          <div><div className="text-[9px] uppercase tracking-wider">Coach</div><div className="text-sm font-bold text-[#0D2B5B]">Valerio</div></div>
          <div><div className="text-[9px] uppercase tracking-wider">Fecha</div><div className="text-sm font-bold text-[#0D2B5B]">{new Date().toLocaleDateString()}</div></div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white shadow border-2 border-white"><Award size={24} /></div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
      <Button onClick={onReset} className="bg-transparent text-[#0D2B5B] border-2 border-[#0D2B5B] hover:bg-slate-50 dark:hover:bg-slate-700 text-xs">Reiniciar</Button>
      <Button onClick={() => alert('¡Sigue aprendiendo con Edutechlife y Valerio!')} className="bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white text-xs">Explorar más cursos</Button>
    </div>
  </div>
);

const screensData = {
  m1: { title: 'Breve Historia de la IA Generativa' },
  m2: { title: 'El concepto de prompt' },
  m3: { title: 'Anatomía de un Prompt' },
  m4: { title: 'Ingeniería de prompts' },
  m5: { title: 'Errores Comunes al Diseñar Prompts' },
  m6: { title: 'Reto de Comprensión General' }
};

export default function OVAEtica() {
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [xp, setXp] = useState(0);
  const totalXp = 500;
  const addXp = (amount) => {
    setXp(prev => Math.min(prev + amount, totalXp));
    import('../../store/ialabStore').then(m => m.useIALabStore.getState().addXp(amount));
  };
  const nextScreen = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setScreen('m1'); };

  const nav = ['welcome', 'menu', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6'];
  const curIdx = nav.indexOf(screen);

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onNext={nextScreen} />;
      case 'menu':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] slide-in-from-bottom">
            {nav.slice(2).map((id) => (
              <button key={id} onClick={() => setScreen(id)} className="group bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg hover:border-[#00B4D8] transition-all flex flex-col items-center text-center gap-4 relative overflow-hidden">
                <div className="bg-[#F0F9FF] dark:bg-blue-900/30 text-[#0D2B5B] p-4 rounded-[1.5rem] shadow-sm group-hover:scale-110 transition-transform"><BookOpen className="w-6 h-6" /></div>
                <span className="font-[900] text-[#0D2B5B] text-[10px] uppercase tracking-[0.1em] leading-tight">{screensData[id].title}</span>
                {completed.includes(id) && <div className="absolute top-4 right-4 bg-green-50 p-1 rounded-full"><CheckCircle2 className="text-green-500 w-4 h-4" /></div>}
              </button>
            ))}
          </div>
        );
      case 'm1': return <ModuleHistory />;
      case 'm2': return <PromptConcept />;
      case 'm3': return <ModuleAnatomy />;
      case 'm4': return <TechniquesSection />;
      case 'm5': return <ErrorSection />;
      case 'm6': return <QuizScreen onNext={() => { setScreen('certificate'); }} addXp={addXp} />;
      case 'certificate': return <CertificateScreen xp={xp} onReset={() => { setScreen('welcome'); setXp(0); setQuizScore(null); setCompleted([]); }} />;
      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">PROGRESO</span>
            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700 shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#0D2B5B] to-[#00B4D8] transition-all duration-1000 ease-out shadow-lg" style={{ width: `${(xp / totalXp) * 100}%` }}></div>
            </div>
          </div>
          {screen !== 'welcome' && screen !== 'certificate' && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-[#00B4D8]/20">
              <Star className="text-yellow-500 fill-current" size={14} />
              <span className="font-bold text-[#0D2B5B] text-[11px]">{xp} XP</span>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all shadow-sm border border-slate-100 dark:border-slate-700"><Menu className="w-5 h-5 text-[#0D2B5B]" /></button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith('m') && (
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 border-b border-slate-50 dark:border-slate-700 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#00B4D8] font-[900] text-[8px] tracking-[0.3em] uppercase"><Sparkles className="w-3 h-3" /> edutechlife master</div>
                <h1 className="text-xl md:text-2xl font-[900] text-[#0D2B5B] tracking-tighter leading-tight">{screensData[screen].title}</h1>
              </div>
            </div>
          )}
          <div className="relative z-10 min-h-[200px] flex flex-col justify-center">{renderContent()}</div>
          <div className="absolute -top-40 -right-40 w-[300px] h-[300px] bg-[#00B4D8] rounded-full blur-[100px] opacity-[0.04] pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-[#0D2B5B] rounded-full blur-[100px] opacity-[0.04] pointer-events-none"></div>
        </div>
      </main>

      {screen !== 'welcome' && screen !== 'certificate' && (
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl">
          <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
            <button onClick={() => { if (curIdx > 0) setScreen(nav[curIdx - 1]); stopSpeech(); }} className="p-3 bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0D2B5B] dark:hover:text-[#00B4D8] rounded-xl disabled:opacity-10 transition-all shadow-inner border border-slate-50 dark:border-slate-700" disabled={curIdx === 0}><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-2">
              {nav.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === curIdx ? 'w-10 bg-[#0D2B5B]' : 'w-2 bg-slate-200 dark:bg-slate-600'}`}></div>)}
            </div>
            <button onClick={() => { if (curIdx < nav.length - 1) { if (screen.startsWith('m')) { const newC = [...completed]; if (!newC.includes(screen)) newC.push(screen); setCompleted(newC); } setScreen(nav[curIdx + 1]); stopSpeech(); } }} className="px-6 py-3 bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white rounded-xl font-[900] text-[11px] shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em]">Siguiente <ArrowRightCircle className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && screen !== 'certificate' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-[10px]">
          <p>Laboratorio guiado por <strong className="text-[#00B4D8]">Valerio</strong> — Coach de IA de Edutechlife.</p>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-6 h-6 text-slate-600 dark:text-slate-300" /></button>
            <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-[10px] tracking-[0.3em] uppercase border-b-2 border-slate-50 dark:border-slate-700 pb-4">Mapa del Módulo</h3>
            {nav.map(id => (
              <button key={id} onClick={() => { setScreen(id); setIsMenuOpen(false); }} className={`p-4 rounded-xl text-left text-[11px] font-[900] transition-all flex items-center justify-between group ${screen === id ? 'bg-[#0D2B5B] text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                <span className="uppercase tracking-wider">{id === 'welcome' ? 'Inicio' : id === 'menu' ? 'Menú' : id === 'certificate' ? 'Certificado' : screensData[id]?.title}</span>
                {completed.includes(id) && <CheckCircle2 className="w-4 h-4 text-[#00B4D8]" />}
              </button>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}
