import React, { useState } from 'react';
import VoiceReader from './VoiceReader';
import { useTranslation } from '../../i18n/I18nProvider';
import {
  BrainCircuit, Bot, Play, ChevronRight, ChevronLeft,
  ArrowRightCircle, Star, Award, Trophy, Sparkles, BookOpen, CheckCircle2,
  Menu, X, MousePointer2, AlertTriangle, Zap, Info, Search, Clock,
  Lightbulb, Target, Globe, Layers, FileText, GraduationCap, Settings
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';

const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0D2B5B] to-[#00B4D8] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] text-[#0D2B5B]">edutech</span>
      <span className="font-[400] text-[#00B4D8]">life</span>
    </div>
  </div>
);

const Button = ({ children, onClick, className = '', icon: Icon = null, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
    {Icon && <Icon size={18} />}{children}
  </button>
);

const WelcomeScreen = ({ onNext }) => {
  const { t } = useTranslation();
  return (
  <div className="text-center space-y-4 py-4 animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D2B5B]/5 text-[#00B4D8] font-black text-[9px] uppercase tracking-[0.15em] border border-[#00B4D8]/20">
      <Bot size={14} /><span>{t('ova.introprompt.lab_title')}</span>
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
      <h1 className="text-3xl md:text-4xl font-[400] text-[#0D2B5B] leading-[0.9] tracking-tighter lowercase">{t('ova.introprompt.welcome_title1')}</h1>
      <h2 className="text-2xl md:text-3xl font-[900] text-[#0D2B5B] tracking-tight">{t('ova.introprompt.welcome_title2')}</h2>
    </div>
    <p className="text-slate-500 dark:text-slate-300 max-w-lg mx-auto font-bold text-[13px]">{t('ova.introprompt.welcome_desc')}</p>
    <VoiceReader text={t('ova.introprompt.welcome_audio')} />
    <Button onClick={onNext} className="mx-auto bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white" icon={Play}>{t('ova.introprompt.start')}</Button>
  </div>
);
};

const WhatIsPrompt = ({ onNext, addXp }) => {
  const { t } = useTranslation();
  React.useEffect(() => { addXp(50); }, []);
  const text = "Un prompt es un conjunto de instrucciones que le das a la inteligencia artificial para guiar su respuesta. Es el puente entre tu intención humana y la capacidad de la máquina. La calidad del resultado depende directamente de la calidad del prompt.";
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-[#F0F9FF] rounded-[2rem] border-2 border-white dark:border-slate-700 shadow-md">
        <h4 className="text-[#0D2B5B] font-[900] text-xl mb-3 tracking-tighter lowercase">{t('ova.introprompt.whatis_title')}</h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">{text}</p>
        <div className="mt-3"><VoiceReader text={text} /></div>
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
        <Lightbulb className="text-amber-500 shrink-0 mt-1" size={20} />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t('ova.introprompt.whatis_tip')}</p>
      </div>
      <div className="flex justify-end"></div>
    </div>
  );
};

const AnatomyScreen = ({ onNext, addXp }) => {
  const { t } = useTranslation();
  React.useEffect(() => { addXp(50); }, []);
  const [sel, setSel] = useState(null);
  const elements = [
    { k: 'Rol', d: 'Define quién debe ser la IA. Ej: "Actúa como un experto en marketing".', c: 'bg-[#0D2B5B]', i: '👤' },
    { k: 'Contexto', d: 'Antecedentes y situación. Ej: "Estoy preparando una clase para niños de 10 años".', c: 'bg-[#00B4D8]', i: '🌍' },
    { k: 'Tarea', d: 'La acción específica. Ej: "Escribe un resumen", "Genera 5 ideas".', c: 'bg-[#4361EE]', i: '⚡' },
    { k: 'Formato', d: 'Cómo quieres la respuesta. Ej: tabla, lista, ensayo, JSON.', c: 'bg-[#4CC9F0]', i: '📄' },
    { k: 'Restricción', d: 'Lo que NO debe hacer. Ej: "No uses tecnicismos, máximo 100 palabras".', c: 'bg-[#F72585]', i: '🚫' },
    { k: 'Ejemplos', d: 'Muestras del resultado esperado (Few-Shot). Ayuda a la IA a entender el patrón.', c: 'bg-[#FF9F1C]', i: '✨' }
  ];
  const text = sel ? sel.d : '';
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        <div className="grid grid-cols-3 gap-2">
          {elements.map(el => (
            <button key={el.k} onClick={() => setSel(el)} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 group ${sel?.k === el.k ? 'border-[#00B4D8] bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
              <div className={`w-8 h-8 ${el.c} text-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}><span className="text-sm">{el.i}</span></div>
              <span className="text-[8px] font-black text-[#0D2B5B] uppercase tracking-tighter leading-none">{el.k}</span>
            </button>
          ))}
        </div>
        <div className="bg-[#0D2B5B] text-white p-5 rounded-xl shadow-lg min-h-[160px] flex flex-col justify-center border-b-2 border-[#00B4D8]">
          {sel ? (
            <div className="animate-[slideInRight_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <h5 className="text-[#00B4D8] font-[900] text-[10px] uppercase tracking-[0.2em] mb-2">{t('ova.introprompt.anatomy_element', { name: sel.k })}</h5>
              <p className="text-sm leading-relaxed font-medium text-white">{sel.d}</p>
              <div className="mt-3"><VoiceReader text={text} /></div>
            </div>
          ) : (
            <div className="text-center opacity-30 space-y-2">
              <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
              <p className="text-[8px] font-black uppercase tracking-widest">{t('ova.introprompt.anatomy_explore')}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4"></div>
    </div>
  );
};

const TypesScreen = ({ onNext, addXp }) => {
  React.useEffect(() => { addXp(50); }, []);
  const [sel, setSel] = useState(null);
  const types = [
    { t: 'Prompt Abierto', d: 'Permite respuestas creativas y variadas. Ej: "Escribe un cuento sobre un robot que aprende a sentir emociones".', i: <Layers className="w-5 h-5" /> },
    { t: 'Prompt Cerrado', d: 'Restringe la respuesta a opciones específicas. Ej: "¿Cuál es la capital de Francia? a) París b) Londres c) Madrid"', i: <Target className="w-5 h-5" /> },
    { t: 'Prompt Instructivo', d: 'Indica pasos o acciones específicas. Ej: "Traduce al inglés, luego resume en 3 oraciones".', i: <Zap className="w-5 h-5" /> },
    { t: 'Prompt Creativo', d: 'Estimula la imaginación con escenarios hipotéticos. Ej: "Actúa como un chef fusión y crea una receta combinando cocina japonesa y mexicana".', i: <Sparkles className="w-5 h-5" /> },
    { t: 'Prompt de Refinamiento', d: 'Pide mejorar o ajustar un resultado previo. Ej: "Haz este texto más formal y profesional".', i: <Globe className="w-5 h-5" /> }
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {types.map(t => (
          <button key={t.t} onClick={() => setSel(t)} className={`p-4 rounded-xl border-2 transition-all text-left ${sel?.t === t.t ? 'border-[#00B4D8] bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-700 text-[#0D2B5B] rounded-lg">{t.i}</div>
              <div>
                <h5 className="font-[900] text-[#0D2B5B] text-[11px] uppercase leading-none mb-1">{t.t}</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed">{t.d}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {sel && (
        <div className="mt-3 p-4 bg-[#0D2B5B] text-white rounded-xl">
          <p className="text-xs font-medium"><span className="text-[#00B4D8] font-black uppercase text-[10px]">{sel.t}:</span> {sel.d.split('Ej:')[1] || sel.d}</p>
          <div className="mt-2"><VoiceReader text={`${sel.t}: ${sel.d}`} /></div>
        </div>
      )}
      <div className="flex justify-end mt-4"></div>
    </div>
  );
};

const MistakesScreen = ({ onNext, addXp }) => {
  React.useEffect(() => { addXp(50); }, []);
  const mistakes = [
    { t: 'Prompts Vagas', d: '«Ayúdame con mi tarea» no indica materia ni objetivo.', i: <AlertTriangle size={16} /> },
    { t: 'Pedir Demasiado', d: 'Varias peticiones en un solo prompt genera respuestas superficiales.', i: <FileText size={16} /> },
    { t: 'No Verificar', d: 'La IA puede generar datos incorrectos con aparente confianza.', i: <Search size={16} /> },
    { t: 'No Iterar', d: 'Si la respuesta no satisface, ajusta el prompt.', i: <Zap size={16} /> },
    { t: 'Sin Formato', d: 'Sin especificarlo, la respuesta puede ser difícil de usar.', i: <Info size={16} /> },
    { t: 'Asumir Memoria', d: 'Cada sesión nueva empieza sin contexto previo.', i: <Clock size={16} /> }
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {mistakes.map(m => (
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-2">{m.i}</div>
            <h5 className="font-[900] text-[#0D2B5B] text-[9px] uppercase tracking-wider mb-1">{m.t}</h5>
            <p className="text-[9px] text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{m.d}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4"></div>
    </div>
  );
};

const QuizScreen = ({ onNext, addXp, onReset, showMarkButton, onMarkComplete }) => {
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const questions = [
    { q: "¿Qué es un prompt?", o: ["Un programa de computadora", "Un conjunto de instrucciones para guiar a la IA", "Un tipo de lenguaje de programación", "Un hardware especial"], c: 1 },
    { q: "¿Cuál es el elemento del prompt que define la identidad que debe tomar la IA?", o: ["Tarea", "Formato", "Rol", "Contexto"], c: 2 },
    { q: "¿Qué tipo de prompt permite respuestas creativas y variadas?", o: ["Cerrado", "Abierto", "Instructivo", "Técnico"], c: 1 },
    { q: "¿Qué debes hacer si la primera respuesta de la IA no es satisfactoria?", o: ["Aceptarla", "Probar con otra IA", "Refinar el prompt (iterar)", "Reiniciar el equipo"], c: 2 },
    { q: "¿Por qué es importante incluir el formato en un prompt?", o: ["Para hacerlo más largo", "Para especificar cómo quieres la respuesta", "Para confundir a la IA", "No es importante"], c: 1 }
  ];
  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx); setShowFeedback(true);
    if (idx === questions[currentQ].c) { setScore(s => s + 1); addXp(100); }
  };
  const handleNext = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(q => q + 1); setSelected(null); setShowFeedback(false); }
    else setShowResult(true);
  };
  if (showResult) {
    
    return (
    <div className="text-center py-4 animate-[zoomIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
      <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white dark:border-slate-700"><Trophy className="w-10 h-10 text-amber-500" /></div>
      <h2 className="text-3xl font-black text-[#0D2B5B] tracking-tighter leading-none mb-2 uppercase">{t('ova.introprompt.quiz_completed')}</h2>
      <div className="bg-[#0D2B5B] text-white inline-block px-8 py-4 rounded-[2rem] mt-4 text-4xl font-black shadow-lg border-b-4 border-[#00B4D8]">{score} / 5</div>
      <p className="text-slate-500 dark:text-slate-300 mt-4 font-bold text-sm">{score === 5 ? t('ova.introprompt.quiz_perfect') : score >= 3 ? t('ova.introprompt.quiz_good') : t('ova.introprompt.quiz_bad')}</p>
      {score >= 3 && showMarkButton && onMarkComplete && (
        <div className="mt-6 flex justify-center">
          <button onClick={onMarkComplete}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {t('ova.introprompt.quiz_mark')}
          </button>
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <Button onClick={onReset} className="bg-[#0D2B5B] text-white">{t('ova.introprompt.quiz_reset')}</Button>
      </div>
    </div>
  );
}
  return (
    <div className="space-y-4 animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300"><span>{t('ova.introprompt.quiz_question', { current: currentQ + 1 })}</span><span className="text-[#00B4D8]">{score}</span></div>
      <h3 className="text-lg font-[900] text-[#0D2B5B] leading-tight">{questions[currentQ].q}</h3>
      <div className="grid gap-2">
        {questions[currentQ].o.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)} className={`p-3 rounded-xl text-left text-sm font-bold border-2 transition-all ${showFeedback ? i === questions[currentQ].c ? 'bg-green-50 border-green-500 text-green-700' : selected === i ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-transparent opacity-50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#00B4D8]'}`}>{opt}</button>
        ))}
      </div>
      {showFeedback && (
        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <button onClick={handleNext} className="w-full py-2.5 bg-[#0D2B5B] text-white font-black rounded-lg flex items-center justify-center gap-2 text-xs">{currentQ === 4 ? t('ova.introprompt.quiz_results') : t('ova.introprompt.quiz_continue')} <ChevronRight size={12} /></button>
        </div>
      )}
    </div>
  );
};

const screensData = {
  m1: { title: '¿Qué es un Prompt?' },
  m2: { title: 'Anatomía del Prompt' },
  m3: { title: 'Tipos de Prompts' },
  m4: { title: 'Errores Comunes' },
  m5: { title: 'Evaluación Final' }
};

export default function OVAIntroPrompt({ onComplete }) {
  const { t } = useTranslation();
  const certCompletedRef = useRef(false);
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [xp, setXp] = useState(0);
  const totalXp = 500;
  const addXp = (amount) => {
    setXp(p => Math.min(p + amount, totalXp));
    import('../../store/ialabStore').then(m => m.useIALabStore.getState().addXp(amount));
  };
  const nextScreen = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setScreen('m1'); };
  const nav = ['welcome', 'm1', 'm2', 'm3', 'm4', 'm5'];
  const curIdx = nav.indexOf(screen);

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onNext={nextScreen} />;
      case 'm1': return <WhatIsPrompt onNext={() => { setScreen('m2'); }} addXp={addXp} />;
      case 'm2': return <AnatomyScreen onNext={() => { setScreen('m3'); }} addXp={addXp} />;
      case 'm3': return <TypesScreen onNext={() => { setScreen('m4'); }} addXp={addXp} />;
      case 'm4': return <MistakesScreen onNext={() => { setScreen('m5'); }} addXp={addXp} />;
      case 'm5': return <QuizScreen onNext={() => {}} addXp={addXp} onReset={() => { setScreen('welcome'); setXp(0); setCompleted([]); }} showMarkButton={!certCompletedRef.current} onMarkComplete={() => { certCompletedRef.current = true; onComplete?.(); }} />;
      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{t('ova.introprompt.progress')}</span>
            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700 shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#0D2B5B] to-[#00B4D8] transition-all duration-1000 ease-out" style={{ width: `${(xp / totalXp) * 100}%` }}></div>
            </div>
          </div>
          {screen !== 'welcome' && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-[#00B4D8]/20">
              <Star className="text-yellow-500 fill-current" size={14} />
              <span className="font-bold text-[#0D2B5B] text-[11px]">{xp} XP</span>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"><Menu className="w-5 h-5 text-[#0D2B5B]" /></button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith('m') && (
            <div className="mb-4 border-b border-slate-50 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-1.5 text-[#00B4D8] font-[900] text-[8px] tracking-[0.3em] uppercase"><Sparkles className="w-3 h-3" /> {t('ova.introprompt.master')}</div>
              <h1 className="text-lg md:text-xl font-[900] text-[#0D2B5B] tracking-tighter leading-tight">{screensData[screen]?.title}</h1>
            </div>
          )}
          <div className="relative z-10 min-h-[180px] flex flex-col justify-center">{renderContent()}</div>
        </div>
      </main>

      {screen !== 'welcome' && (
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90">
          <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
            <button onClick={() => { if (curIdx > 0) setScreen(nav[curIdx - 1]); stopSpeech(); }} className="p-3 bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0D2B5B] dark:hover:text-[#00B4D8] rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700" disabled={curIdx <= 1}><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-2">{nav.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === curIdx ? 'w-10 bg-[#0D2B5B]' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />)}</div>
            <button onClick={() => { if (curIdx < nav.length - 1) { if (screen.startsWith('m')) { const c = [...completed]; if (!c.includes(screen)) c.push(screen); setCompleted(c); } setScreen(nav[curIdx + 1]); stopSpeech(); } }} className="px-6 py-3 bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white rounded-xl font-[900] text-[11px] shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em]">{t('ova.introprompt.next')} <ArrowRightCircle className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-[10px]">
          <p>{t('ova.introprompt.footer')}</p>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 h-full w-[260px] bg-white dark:bg-slate-800 shadow-2xl p-5 flex flex-col gap-3 animate-[slideInRight_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMenuOpen(false)} className="self-end p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><X className="w-5 h-5 text-slate-600 dark:text-slate-300" /></button>
            <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-[9px] tracking-[0.3em] uppercase border-b-2 border-slate-50 dark:border-slate-700 pb-3">{t('ova.introprompt.map')}</h3>
            {nav.map(id => (
              <button key={id} onClick={() => { setScreen(id); setIsMenuOpen(false); }} className={`p-3 rounded-lg text-left text-[10px] font-[900] transition-all flex items-center justify-between ${screen === id ? 'bg-[#0D2B5B] text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                <span className="uppercase tracking-wider">{id === 'welcome' ? t('ova.introprompt.menu_welcome') : screensData[id]?.title}</span>
                {completed.includes(id) && <CheckCircle2 className="w-3 h-3 text-[#00B4D8]" />}
              </button>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}
