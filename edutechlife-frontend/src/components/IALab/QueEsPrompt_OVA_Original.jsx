import React, { useState, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types';
import {
 Layers,
 Zap,
 ChevronLeft,
 Volume2,
 CheckCircle2,
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
import { useTranslation } from '../../i18n/I18nProvider';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import Quiz from './que-es-prompt/Quiz';
import Sidebar from './que-es-prompt/Sidebar';

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
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const sections = [
    {
      t: t('ialab.que_es_prompt.history_0_title'),
      c: t('ialab.que_es_prompt.history_0_content'),
      icon: <Cpu className="w-8 h-8" />
    },
    {
      t: t('ialab.que_es_prompt.history_1_title'),
      c: t('ialab.que_es_prompt.history_1_content'),
      icon: <Layers className="w-8 h-8" />
    },
    {
      t: t('ialab.que_es_prompt.history_2_title'),
      c: t('ialab.que_es_prompt.history_2_content'),
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      t: t('ialab.que_es_prompt.history_3_title'),
      c: t('ialab.que_es_prompt.history_3_content'),
      icon: <Rocket className="w-8 h-8" />
    }
  ];

 return (
   <div className="space-y-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
     <div className="flex flex-wrap gap-2 justify-center">
       {sections.map((s, i) => (
         <button
           key={i}
           onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-2xl text-[10px] font-[800] uppercase tracking-widest transition-all ${active === i ? 'bg-[#0D2B5B] text-white shadow-lg' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-[#00B4D8]'}`}
         >
           {s.t.split('·')[0]}
         </button>
       ))}
     </div>
      <div className="p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[220px]">
       <div className="absolute -right-4 -bottom-4 opacity-5 text-[#00B4D8]">
          {sections[active].icon}
       </div>
       <h4 className="text-[#0D2B5B] font-[900] text-lg mb-3 leading-none uppercase tracking-tighter">{sections[active].t}</h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">{sections[active].c}</p>
     </div>
   </div>
 );
};

const ModuleAnatomy = () => {
 const { t } = useTranslation();
 const [sel, setSel] = useState(null);
  const elements = [
    { k: 'Rol', d: t('ialab.que_es_prompt.anatomy_rol'), i: '👤', c: 'bg-[#0D2B5B]' },
    { k: 'Contexto', d: t('ialab.que_es_prompt.anatomy_contexto'), i: '🌍', c: 'bg-[#00B4D8]' },
    { k: 'Tarea', d: t('ialab.que_es_prompt.anatomy_tarea'), i: '⚡', c: 'bg-[#4361EE]' },
    { k: 'Formato', d: t('ialab.que_es_prompt.anatomy_formato'), i: '📄', c: 'bg-[#4CC9F0]' },
    { k: 'Restricción', d: t('ialab.que_es_prompt.anatomy_restriccion'), i: '🚫', c: 'bg-[#F72585]' },
    { k: 'Ejemplos', d: t('ialab.que_es_prompt.anatomy_ejemplos'), i: '✨', c: 'bg-[#FF9F1C]' }
  ];

 return (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center animate-[zoomIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
     <div className="grid grid-cols-3 gap-2">
       {elements.map((el) => (
         <button
           key={el.k}
           onClick={() => setSel(el)}
            className={`p-4 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-2 group ${sel?.k === el.k ? 'border-[#00B4D8] bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-500'}`}
         >
           <div className={`w-10 h-10 ${el.c} text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>{el.i}</div>
           <span className="text-[9px] font-black text-[#0D2B5B] uppercase tracking-tighter leading-none">{el.k}</span>
         </button>
       ))}
     </div>
     <div className="bg-[#0D2B5B] text-white p-8 rounded-[3rem] shadow-2xl relative min-h-[250px] flex flex-col justify-center border-b-4 border-[#00B4D8]">
       {sel ? (
         <div className="animate-[slideInFromRight_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h5 className="text-[#00B4D8] font-[900] text-xs uppercase tracking-[0.3em] mb-3">{t('ialab.que_es_prompt.element_label', { name: sel.k })}</h5>
           <p className="text-base leading-relaxed font-medium">{sel.d}</p>
         </div>
       ) : (
         <div className="text-center opacity-30 space-y-3">
           <MousePointer2 className="w-8 h-8 mx-auto animate-bounce" />
            <p className="text-[9px] font-black uppercase tracking-widest leading-none">{t('ialab.que_es_prompt.explore_anatomy')}</p>
         </div>
       )}
     </div>
   </div>
 );
};



const QueEsPrompt_OVA_Original = ({ onClose, onComplete }) => {
 const { t } = useTranslation();
 const [screen, setScreen] = useState('welcome');
 const [completed, setCompleted] = useState([]);
 const [quizScore, setQuizScore] = useState(null);
 const [audioLoading, setAudioLoading] = useState(false);
 const [playing, setPlaying] = useState(false);
 const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const autoCompletedRef = useRef(false);

  useEffect(() => {
    if (quizScore !== null && quizScore >= 3 && !autoCompletedRef.current) {
      autoCompletedRef.current = true;
      onComplete?.();
    }
  }, [quizScore, onComplete]);

  const screensData = useMemo(() => ({
   welcome: {
     title: t('ialab.que_es_prompt.title'),
     content: t('ialab.que_es_prompt.welcome_content')
   },
   menu: {
     title: t('ialab.que_es_prompt.menu_title'),
     content: t('ialab.que_es_prompt.menu_desc')
   },
   m1: {
     title: t('ialab.que_es_prompt.screen_m1'),
     content: t('ialab.que_es_prompt.m1_content')
   },
   m2: {
     title: t('ialab.que_es_prompt.screen_m2'),
     content: t('ialab.que_es_prompt.m2_content')
   },
   m3: {
     title: t('ialab.que_es_prompt.screen_m3'),
     content: t('ialab.que_es_prompt.m3_content')
   },
   m4: {
     title: t('ialab.que_es_prompt.screen_m4'),
     content: t('ialab.que_es_prompt.m4_content')
   },
   m5: {
     title: t('ialab.que_es_prompt.screen_m5'),
     content: t('ialab.que_es_prompt.m5_content')
   },
   m6: {
     title: t('ialab.que_es_prompt.screen_m6'),
     content: t('ialab.que_es_prompt.m6_content')
   }
  }), [t]);

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
  };

 const renderContent = () => {
   switch (screen) {
     case 'welcome':
       return (
         <div className="text-center space-y-10 py-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-[#00B4D8] rounded-full blur-[80px] opacity-10 animate-pulse"></div>
                <div className="relative bg-white dark:bg-slate-800 p-10 rounded-[4rem] shadow-2xl border border-slate-50 dark:border-slate-700">
                  <div className="w-20 h-20 bg-gradient-to-tr from-[#0D2B5B] to-[#00B4D8] rounded-[1.8rem] flex items-center justify-center shadow-xl rotate-3">
                     <BrainCircuit className="w-10 h-10 text-white" />
                  </div>
               </div>
            </div>
            <div className="space-y-2">
               <h1 className="text-5xl md:text-7xl font-[400] text-[#0D2B5B] leading-[0.9] tracking-tighter lowercase">
                  {t('ialab.que_es_prompt.welcome_subtitle')}
                </h1>
                <h2 className="text-3xl md:text-5xl font-[900] text-[#0D2B5B] tracking-tight">
                  {t('ialab.que_es_prompt.welcome_title')}
                </h2>
            </div>
            <button onClick={() => setScreen('menu')} className="group px-12 py-5 bg-[#0D2B5B] text-white rounded-[2rem] font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto" style={{ background: COLORS.gradient }}>
              {t('ialab.que_es_prompt.start_module')} <ArrowRightCircle className="w-6 h-6" />
            </button>
         </div>
       );
     case 'menu':
       return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-[slideInFromBottom_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
           {nav.slice(2).map((id) => (
              <button key={id} onClick={() => setScreen(id)} className="group bg-white dark:bg-slate-700 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-600 shadow-lg hover:border-[#00B4D8] transition-all flex flex-col items-center text-center gap-4 relative overflow-hidden">
                <div className="bg-[#F0F9FF] dark:bg-slate-600 text-[#0D2B5B] dark:text-white p-4 rounded-[1.5rem] shadow-sm group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
               </div>
               <span className="font-[900] text-[#0D2B5B] text-[10px] uppercase tracking-[0.1em] leading-tight">{screensData[id].title}</span>
               {completed.includes(id) && <div className="absolute top-4 right-4 bg-green-50 dark:bg-green-900/30 p-1 rounded-full"><CheckCircle2 className="text-green-500 w-4 h-4" /></div>}
             </button>
           ))}
         </div>
       );
     case 'm1': return <ModuleHistory />;
      case 'm2': return (
        <div className="space-y-8 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
           <div className="p-10 bg-[#F0F9FF] dark:bg-slate-700/30 rounded-[4rem] border-4 border-white dark:border-slate-700 shadow-xl relative overflow-hidden group">
            <h4 className="text-[#0D2B5B] font-[900] text-3xl mb-6 tracking-tighter leading-none lowercase">{t('ialab.que_es_prompt.m2_subtitle')}</h4>
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-lg max-w-2xl">
              {t('ialab.que_es_prompt.m2_interface_desc')}
            </p>
          </div>
           <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
             <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 shadow-inner"><Lightbulb size={32} /></div>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
               &ldquo;{t('ialab.que_es_prompt.m2_quote')}&rdquo;
             </p>
          </div>
        </div>
      );
     case 'm3': return <ModuleAnatomy />;
      case 'm4': return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[slideInFromBottom_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          {[
            { t: t('ialab.que_es_prompt.m4_technique_0_title'), d: t('ialab.que_es_prompt.m4_technique_0_desc'), i: <BrainCircuit className="w-5 h-5"/> },
            { t: t('ialab.que_es_prompt.m4_technique_1_title'), d: t('ialab.que_es_prompt.m4_technique_1_desc'), i: <Layers className="w-5 h-5"/> },
            { t: t('ialab.que_es_prompt.m4_technique_2_title'), d: t('ialab.que_es_prompt.m4_technique_2_desc'), i: <Zap className="w-5 h-5"/> },
            { t: t('ialab.que_es_prompt.m4_technique_3_title'), d: t('ialab.que_es_prompt.m4_technique_3_desc'), i: <Globe className="w-5 h-5"/> },
            { t: t('ialab.que_es_prompt.m4_technique_4_title'), d: t('ialab.que_es_prompt.m4_technique_4_desc'), i: <Target className="w-5 h-5"/> },
            { t: t('ialab.que_es_prompt.m4_technique_5_title'), d: t('ialab.que_es_prompt.m4_technique_5_desc'), i: <Sparkles className="w-5 h-5"/> }
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-[2.2rem] shadow-sm hover:shadow-lg transition-all group">
              <div className="p-3 bg-slate-50 dark:bg-slate-600 text-[#0D2B5B] dark:text-white rounded-[1rem] shadow-inner group-hover:bg-[#0D2B5B] group-hover:text-white transition-all">{s.i}</div>
              <div><h5 className="font-[900] text-[#0D2B5B] text-xs uppercase mb-1 tracking-tighter leading-none">{s.t}</h5><p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{s.d}</p></div>
           </div>
         ))}
       </div>
     );
      case 'm5': return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          {[
            { t: t('ialab.que_es_prompt.m5_error_0_title'), d: t('ialab.que_es_prompt.m5_error_0_desc'), i: <AlertTriangle /> },
            { t: t('ialab.que_es_prompt.m5_error_1_title'), d: t('ialab.que_es_prompt.m5_error_1_desc'), i: <FileText /> },
            { t: t('ialab.que_es_prompt.m5_error_2_title'), d: t('ialab.que_es_prompt.m5_error_2_desc'), i: <Search /> },
            { t: t('ialab.que_es_prompt.m5_error_3_title'), d: t('ialab.que_es_prompt.m5_error_3_desc'), i: <Zap /> },
            { t: t('ialab.que_es_prompt.m5_error_4_title'), d: t('ialab.que_es_prompt.m5_error_4_desc'), i: <Info /> },
            { t: t('ialab.que_es_prompt.m5_error_5_title'), d: t('ialab.que_es_prompt.m5_error_5_desc'), i: <Clock /> }
          ].map((e, i) => (
            <div key={i} className="p-5 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
              <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">{e.i}</div>
             <h5 className="font-[900] text-[#0D2B5B] text-[10px] uppercase tracking-widest leading-none mb-1">{e.t}</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{e.d}</p>
           </div>
         ))}
       </div>
     );
     case 'm6': return quizScore !== null ? (
       <div className="text-center py-8 animate-[zoomIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
         <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white"><Trophy className="w-16 h-16 text-amber-500" /></div>
          <h2 className="text-5xl font-black text-[#0D2B5B] tracking-tighter leading-none mb-3 uppercase">{t('ialab.que_es_prompt.quiz_completed')}</h2>
          <div className="bg-[#0D2B5B] text-white inline-block px-12 py-6 rounded-[3rem] mt-6 text-6xl font-black shadow-xl border-b-8 border-[#00B4D8]">{t('ialab.que_es_prompt.quiz_result', { score: quizScore, total: 5 })}</div>
           <p className="text-slate-500 dark:text-slate-400 mt-10 font-black text-lg uppercase tracking-[0.2em] opacity-40">{t('ialab.que_es_prompt.edutechlife_master')}</p>
           <button onClick={() => { setScreen('menu'); setQuizScore(null); }} className="mt-12 px-12 py-4 bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-bold rounded-[1.5rem] hover:bg-slate-200 dark:hover:bg-slate-600 transition-all uppercase tracking-[0.1em] text-[10px]">{t('ialab.que_es_prompt.quiz_finalize')}</button>
       </div>
     ) : (
       <Quiz onComplete={(s) => { setQuizScore(s); setCompleted([...completed, 'm6']); }} />
     );
     default: return null;
   }
 };

 return (
    <div className="w-full h-fit bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-blue-100">

     {/* Header */}
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b dark:border-slate-700 z-10 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
       <Logo />
       <div className="flex items-center gap-8">
         <div className="hidden lg:flex flex-col items-end">
             <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1">{t('ialab.que_es_prompt.progress')}</span>
            <div
              role="progressbar"
              aria-valuenow={completed.length}
              aria-valuemin={0}
              aria-valuemax={6}
              aria-label={t('ialab.que_es_prompt.progress')}
              className="w-32 h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700 shadow-inner"
            >
              <div className="h-full bg-gradient-to-r from-[#0D2B5B] to-[#00B4D8] transition-all duration-1000 ease-out shadow-lg" style={{ width: `${(completed.length/6)*100}%` }}></div>
           </div>
         </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú de navegación" className="p-3 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-[1.2rem] transition-all shadow-sm border border-slate-100 dark:border-slate-600"><Menu className="w-6 h-6 text-[#0D2B5B]" /></button>
          <button onClick={onClose} className="p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-[1.2rem] transition-all shadow-sm border border-red-100 dark:border-red-900/30" aria-label={t('ialab.que_es_prompt.close_aria')}>
           <X className="w-6 h-6 text-red-500" />
         </button>
       </div>
     </header>

     {errorMsg && (
       <div className="mx-auto mt-4 max-w-lg bg-red-600 text-white px-6 py-4 rounded-[2rem] text-xs font-black flex items-center gap-4 shadow-2xl animate-[slideInFromTop_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
         <AlertCircle className="w-5 h-5 flex-shrink-0" /> {errorMsg}
       </div>
     )}

     {/* Main Content */}
     <main className="flex-1 pt-6 px-4 md:px-6 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-[4.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.08)] p-12 md:p-20 relative overflow-hidden border border-slate-50 dark:border-slate-700">
         {screen.startsWith('m') && (
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-slate-50 dark:border-slate-700 pb-12">
             <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#00B4D8] font-[900] text-[10px] tracking-[0.4em] uppercase"><Sparkles className="w-4 h-4" /> {t('ialab.que_es_prompt.edutechlife_master')}</div>
               <h1 className="text-4xl md:text-6xl font-[900] text-[#0D2B5B] tracking-tighter leading-[0.85]">{screensData[screen].title}</h1>
             </div>
             <button
               onClick={() => handleTTS(screensData[screen].content)}
               disabled={audioLoading}
                className={`flex items-center gap-4 px-10 py-4 rounded-[2.5rem] font-black text-[10px] transition-all shadow-xl group ${playing ? 'bg-red-600 text-white shadow-red-600/30' : 'bg-[#F1F5F9] dark:bg-slate-700 text-[#0D2B5B] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'}`}
             >
               {audioLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> ...</> : playing ? <><Square className="w-4 h-4 fill-current" /> {t('ialab.que_es_prompt.stop')}</> : <><Volume2 className="w-4 h-4 group-hover:scale-125 transition-transform" /> {t('ialab.que_es_prompt.audio')}</>}
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
        <footer className="sticky bottom-0 w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl border-t border-slate-100 dark:border-slate-700 p-4 md:p-6 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex justify-center">
         <div className="w-full max-w-4xl flex justify-between items-center gap-6">
<button
              onClick={() => {
                if (curIdx > 0) setScreen(nav[curIdx - 1]);
                stopSpeech();
                setPlaying(false);
              }}
              aria-label={t('ova.nav.prev_aria')}
              className="p-4 bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0D2B5B] dark:hover:text-white rounded-[1.5rem] disabled:opacity-10 transition-all shadow-inner border border-slate-50 dark:border-slate-600"
              disabled={curIdx === 0}
            >
              <ChevronLeft className="w-6 h-6" />
           </button>
           
            <div className="flex gap-3" role="group" aria-label="Navigation steps">
              {nav.map((_, i) => (
                 <div
                   key={i}
                   aria-current={i === curIdx ? 'step' : undefined}
                   className={`h-2 rounded-full transition-all duration-700 ${i === curIdx ? 'w-16 bg-[#0D2B5B]' : 'w-2.5 bg-slate-200 dark:bg-slate-600'}`}
                 ></div>
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
              {t('ialab.que_es_prompt.next')} <ArrowRightCircle className="w-6 h-6" />
           </button>
         </div>
       </footer>
     )}

      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} screen={screen} setScreen={setScreen} completed={completed} screensData={screensData} />


   </div>
 );
};

QueEsPrompt_OVA_Original.propTypes = {
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
};

export default QueEsPrompt_OVA_Original;
