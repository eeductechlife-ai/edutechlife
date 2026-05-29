import React, { useState, useRef } from 'react';
import VoiceReader from './VoiceReader';
import { useTranslation } from '../../i18n/I18nProvider';
import {
  BrainCircuit, Bot, Play, ChevronRight, ChevronLeft,
  ArrowRightCircle, Star, Award, Trophy, Sparkles, BookOpen, CheckCircle2,
  Menu, X, MousePointer2, AlertTriangle, Zap, Info, Search, Clock,
  Lightbulb, Target, Globe, Layers, FileText, GraduationCap, Settings,
  Volume2, Square, Cpu, MessageSquare, AlertCircle, Rocket, HelpCircle
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';

const COLORS = { primary: '#0D2B5B', secondary: '#00B4D8', bg: '#F8FAFC', white: '#FFFFFF' };

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

const WhatIsPrompt = () => {
  const { t } = useTranslation();
  const text = t('ova.introprompt.whatis_desc') || 'Un prompt es la instrucción o punto de partida que le damos a la Inteligencia Artificial. En un entorno de aprendizaje, un buen prompt marca la diferencia entre una respuesta genérica y un recurso verdaderamente útil.';
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
    </div>
  );
};

const ImportanceQuality = () => {
  const { t } = useTranslation();
  const text = t('ova.introprompt.importance_desc');
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-gradient-to-br from-amber-50 to-white rounded-[2rem] border-2 border-amber-100 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5 text-amber-600" /></div>
          <h4 className="text-[#0D2B5B] font-[900] text-xl tracking-tighter lowercase">{t('ova.introprompt.importance_title')}</h4>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">{text}</p>
        <div className="mt-3"><VoiceReader text={t('ova.introprompt.importance_voice')} /></div>
      </div>
    </div>
  );
};

const TypesPrompts = () => {
  const { t } = useTranslation();
  const [sel, setSel] = useState(null);
  const types = [
    { k: 'abierto', i: <Layers className="w-5 h-5" /> },
    { k: 'cerrado', i: <Target className="w-5 h-5" /> },
    { k: 'instructivo', i: <Zap className="w-5 h-5" /> },
    { k: 'creativo', i: <Sparkles className="w-5 h-5" /> },
    { k: 'refinamiento', i: <Globe className="w-5 h-5" /> }
  ];
  const labels = { abierto: 'Prompt Abierto', cerrado: 'Prompt Cerrado', instructivo: 'Prompt Instructivo', creativo: 'Prompt Creativo', refinamiento: 'Prompt de Refinamiento' };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {types.map(tp => (
          <button key={tp.k} onClick={() => setSel(tp)} className={`p-4 rounded-xl border-2 transition-all text-left ${sel?.k === tp.k ? 'border-[#00B4D8] bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-700 text-[#0D2B5B] rounded-lg">{tp.i}</div>
              <div>
                <h5 className="font-[900] text-[#0D2B5B] text-[11px] uppercase leading-none mb-1">{labels[tp.k]}</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed">{t(`ova.introprompt.types_desc_${tp.k}`)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {sel && (
        <div className="p-4 bg-[#0D2B5B] text-white rounded-xl">
          <p className="text-xs font-medium"><span className="text-[#00B4D8] font-black uppercase text-[10px]">{labels[sel.k]}:</span> {t(`ova.introprompt.types_desc_${sel.k}`)}</p>
          <div className="mt-2"><VoiceReader text={`${labels[sel.k]}: ${t(`ova.introprompt.types_desc_${sel.k}`)}`} /></div>
        </div>
      )}
    </div>
  );
};

const EffectiveAnatomy = () => {
  const { t } = useTranslation();
  const [sel, setSel] = useState(null);
  const elements = [
    { k: 'rol', c: 'bg-[#0D2B5B]', i: '👤' },
    { k: 'contexto', c: 'bg-[#00B4D8]', i: '🌍' },
    { k: 'tarea', c: 'bg-[#4361EE]', i: '⚡' },
    { k: 'formato', c: 'bg-[#4CC9F0]', i: '📄' },
    { k: 'restriccion', c: 'bg-[#F72585]', i: '🚫' }
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">{t('ova.introprompt.anatomy_explore')}</p>
      <div className="grid grid-cols-5 gap-2">
        {elements.map(el => (
          <button key={el.k} onClick={() => setSel(el)} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 group ${sel?.k === el.k ? 'border-[#00B4D8] bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200'}`}>
            <div className={`w-8 h-8 ${el.c} text-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}><span className="text-sm">{el.i}</span></div>
            <span className="text-[8px] font-black text-[#0D2B5B] uppercase tracking-tighter leading-none">{t(`ova.introprompt.anatomy_${el.k}`)}</span>
          </button>
        ))}
      </div>
      {sel ? (
        <div className="p-4 bg-[#0D2B5B] text-white rounded-xl">
          <h5 className="text-[#00B4D8] font-[900] text-[10px] uppercase tracking-[0.2em] mb-2">{t(`ova.introprompt.anatomy_${sel.k}`)}</h5>
          <p className="text-sm leading-relaxed font-medium">{t(`ova.introprompt.anatomy_${sel.k}_desc`)}</p>
          <div className="mt-2"><VoiceReader text={t(`ova.introprompt.anatomy_${sel.k}_desc`)} /></div>
        </div>
      ) : (
        <div className="text-center py-6 opacity-30 space-y-2">
          <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
          <p className="text-[8px] font-black uppercase tracking-widest">{t('ova.introprompt.text_select')}</p>
        </div>
      )}
    </div>
  );
};

const UniversalTemplate = () => {
  const { t } = useTranslation();
  const text = t('ova.introprompt.universal_desc');
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-gradient-to-br from-purple-50 to-white rounded-[2rem] border-2 border-purple-100 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Award className="w-5 h-5 text-purple-600" /></div>
          <h4 className="text-[#0D2B5B] font-[900] text-xl tracking-tighter lowercase">{t('ova.introprompt.universal_title')}</h4>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 bg-[#0D2B5B] text-white rounded-full text-[10px] font-black uppercase tracking-wider">Rol</span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#00B4D8] text-white rounded-full text-[10px] font-black uppercase tracking-wider">Contexto</span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#4361EE] text-white rounded-full text-[10px] font-black uppercase tracking-wider">Tarea</span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#F72585] text-white rounded-full text-[10px] font-black uppercase tracking-wider">Restricciones</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">{text}</p>
        <div className="mt-3"><VoiceReader text={t('ova.introprompt.universal_voice')} /></div>
      </div>
    </div>
  );
};

const EngineeringStrategies = () => {
  const { t } = useTranslation();
  const text = t('ova.introprompt.strategies_desc');
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-gradient-to-br from-green-50 to-white rounded-[2rem] border-2 border-green-100 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Settings className="w-5 h-5 text-green-600" /></div>
          <h4 className="text-[#0D2B5B] font-[900] text-xl tracking-tighter lowercase">{t('ova.introprompt.strategies_title')}</h4>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">{text}</p>
        <div className="mt-3"><VoiceReader text={t('ova.introprompt.strategies_voice')} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { i: '🧠', t: 'Chain of Thought', d: 'Pide a la IA que «piense paso a paso» para mejorar el razonamiento.' },
          { i: '✨', t: 'Few-Shot', d: 'Incluye ejemplos del resultado esperado para guiar el modelo.' },
          { i: '🔄', t: 'Iteración', d: 'Refina el prompt basándote en la respuesta anterior.' },
          { i: '🎭', t: 'Roles', d: 'Asigna una identidad experta para cambiar el enfoque.' }
        ].map(s => (
          <div key={s.t} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
            <span className="text-lg mb-1 block">{s.i}</span>
            <h5 className="font-[900] text-[#0D2B5B] text-[9px] uppercase tracking-wider mb-0.5">{s.t}</h5>
            <p className="text-[9px] text-slate-500 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommonErrors = () => {
  const { t } = useTranslation();
  const errors = [
    { k: 'vagos', i: <AlertTriangle size={16} /> },
    { k: 'demasiado', i: <FileText size={16} /> },
    { k: 'verificar', i: <Search size={16} /> },
    { k: 'iterar', i: <Zap size={16} /> },
    { k: 'formato', i: <Info size={16} /> },
    { k: 'memoria', i: <Clock size={16} /> }
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {errors.map(e => (
          <div key={e.k} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-2">{e.i}</div>
            <p className="text-[9px] text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{t(`ova.introprompt.errors_${e.k}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Conclusion = () => {
  const { t } = useTranslation();
  const text = t('ova.introprompt.conclusion_desc');
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[#0D2B5B] to-[#00B4D8] rounded-[2rem] flex items-center justify-center mx-auto shadow-lg">
        <Rocket className="w-8 h-8 text-white" />
      </div>
      <h4 className="text-[#0D2B5B] font-[900] text-2xl tracking-tighter lowercase">{t('ova.introprompt.conclusion_title')}</h4>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm max-w-lg mx-auto">{text}</p>
      <div className="flex justify-center"><VoiceReader text={t('ova.introprompt.conclusion_voice')} /></div>
    </div>
  );
};

const screensData = {
  m1: { title: '¿Qué es un Prompt?' },
  m2: { title: 'Importancia de la Calidad' },
  m3: { title: 'Tipos de Prompts' },
  m4: { title: 'Anatomía Efectiva' },
  m5: { title: 'Plantilla Universal' },
  m6: { title: 'Ingeniería y Estrategias' },
  m7: { title: 'Errores Comunes' },
  m8: { title: 'Conclusión' }
};

export default function OVAIntroPrompt({ onComplete }) {
  const { t } = useTranslation();
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = ['welcome', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
  const curIdx = nav.indexOf(screen);

  const nextScreen = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (screen === 'welcome') { setScreen('m1'); return; }
    const c = [...completed];
    if (!c.includes(screen)) c.push(screen);
    setCompleted(c);
    const next = nav.indexOf(screen) + 1;
    if (next < nav.length) setScreen(nav[next]);
  };

  const goToScreen = (id) => {
    setScreen(id);
    setIsMenuOpen(false);
  };

  const isLastScreen = screen === 'm8';

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onNext={nextScreen} />;
      case 'm1': return <WhatIsPrompt />;
      case 'm2': return <ImportanceQuality />;
      case 'm3': return <TypesPrompts />;
      case 'm4': return <EffectiveAnatomy />;
      case 'm5': return <UniversalTemplate />;
      case 'm6': return <EngineeringStrategies />;
      case 'm7': return <CommonErrors />;
      case 'm8': return <Conclusion />;
      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          {screen !== 'welcome' && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-[#00B4D8]/20">
              <Star className="text-yellow-500 fill-current" size={14} />
              <span className="font-bold text-[#0D2B5B] text-[11px]">{nav.filter(id => completed.includes(id)).length}/{nav.length - 1}</span>
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
            <button onClick={() => { if (curIdx > 1) setScreen(nav[curIdx - 1]); stopSpeech(); }} className="p-3 bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0D2B5B] dark:hover:text-[#00B4D8] rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700" disabled={curIdx <= 1}><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-1.5">{nav.slice(1).map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i + 1 === curIdx ? 'w-8 bg-[#0D2B5B]' : completed.includes(nav[i + 1]) ? 'w-2 bg-[#00B4D8]' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />)}</div>
            <button onClick={nextScreen} className={`px-6 py-3 rounded-xl font-[900] text-[11px] shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] ${isLastScreen ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white'}`}>
              {isLastScreen ? t('ova.introprompt.quiz_mark') : t('ova.introprompt.next')} <ArrowRightCircle className="w-4 h-4" />
            </button>
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
              <button key={id} onClick={() => goToScreen(id)} className={`p-3 rounded-lg text-left text-[10px] font-[900] transition-all flex items-center justify-between ${screen === id ? 'bg-[#0D2B5B] text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
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
