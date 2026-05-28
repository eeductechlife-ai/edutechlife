import React, { useState, useEffect, useRef } from 'react';
import {
  History, MessageSquare, Layers, Zap, ChevronRight, ChevronLeft,
  Volume2, Square, CheckCircle2, Play, Trophy, Info, Menu, X,
  BookOpen, MousePointer2, AlertCircle, BrainCircuit, Sparkles, Rocket,
  Target, FileText, Cpu, Globe, ArrowRightCircle, AlertTriangle,
  Lightbulb, Search, Clock, Award, Star, GraduationCap, Bot, Settings
} from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';
import { useOVATranslations } from '../../hooks/useOVATranslations';

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

const VoiceReader = ({ text, listenLabel = 'Escuchar con Valerio', stopLabel = 'Detener' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speak = () => {
    if (isPlaying) { stopSpeech(); setIsPlaying(false); return; }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button onClick={speak} className={`flex items-center gap-3 px-6 py-3 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${isPlaying ? 'bg-red-600 text-white shadow-red-600/30' : 'bg-[#F1F5F9] dark:bg-slate-700 text-[#0D2B5B] hover:bg-slate-200 dark:hover:bg-slate-600'}`} title={listenLabel}>
      {isPlaying ? <Square size={16} /> : <Volume2 size={16} />}
      {isPlaying ? stopLabel : listenLabel}
    </button>
  );
};

const Button = ({ children, onClick, className = '', disabled = false }) => (
  <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all disabled:opacity-30 ${className}`}>{children}</button>
);

const WelcomeScreen = ({ texts, onNext }) => (
  <div className="text-center space-y-4 py-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D2B5B]/5 text-[#00B4D8] font-black text-[9px] uppercase tracking-[0.15em] border border-[#00B4D8]/20">
      <Bot size={14} /><span>{texts.welcome_label}</span>
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
      <h1 className="text-3xl md:text-4xl font-[400] text-[#0D2B5B] leading-[0.9] tracking-tighter lowercase">{texts.welcome_title_1}</h1>
      <h2 className="text-2xl md:text-3xl font-[900] text-[#0D2B5B] tracking-tight">{texts.welcome_title_2}</h2>
    </div>
    <p className="text-slate-500 dark:text-slate-300 max-w-lg mx-auto font-bold text-[13px]">{texts.welcome_desc}</p>
    <VoiceReader text={texts.welcome_voice} listenLabel={texts.btn_listen} stopLabel={texts.btn_stop} />
    <Button onClick={onNext} className="mx-auto bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white" icon={Play}>{texts.welcome_cta}</Button>
  </div>
);

const ModuleHistory = ({ texts }) => {
  const [active, setActive] = useState(0);
  const sections = [
    { t: texts.history_title_1, c: texts.history_desc_1, icon: <Cpu className="w-8 h-8" /> },
    { t: texts.history_title_2, c: texts.history_desc_2, icon: <Layers className="w-8 h-8" /> },
    { t: texts.history_title_3, c: texts.history_desc_3, icon: <Sparkles className="w-8 h-8" /> },
    { t: texts.history_title_4, c: texts.history_desc_4, icon: <Rocket className="w-8 h-8" /> }
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
        <VoiceReader text={text} listenLabel={texts.btn_listen} stopLabel={texts.btn_stop} />
      </div>
      <div className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-md relative overflow-hidden flex flex-col justify-center min-h-[150px]">
        <div className="absolute -right-4 -bottom-4 opacity-5 text-[#00B4D8]">{sections[active].icon}</div>
        <h4 className="text-[#0D2B5B] font-[900] text-lg mb-3 leading-none uppercase tracking-tighter">{sections[active].t}</h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">{sections[active].c}</p>
      </div>
    </div>
  );
};

const PromptConcept = ({ texts }) => (
  <div className="space-y-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div className="p-5 bg-[#F0F9FF] rounded-[2rem] border-2 border-white dark:border-slate-700 shadow-md relative overflow-hidden">
      <h4 className="text-[#0D2B5B] font-[900] text-xl mb-3 tracking-tighter leading-none lowercase">{texts.prompt_title}</h4>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm max-w-2xl">{texts.prompt_desc}</p>
      <VoiceReader text={texts.prompt_voice} listenLabel={texts.btn_listen} stopLabel={texts.btn_stop} />
    </div>
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-[1.5rem] flex items-center gap-3 shadow-sm">
      <div className="p-3 bg-amber-50 rounded-xl text-amber-500 shadow-inner"><Lightbulb size={24} /></div>
      <p className="text-[11px] text-slate-500 dark:text-slate-300 font-bold italic leading-relaxed">{texts.prompt_tip}</p>
    </div>
  </div>
);

const ModuleAnatomy = ({ texts }) => {
  const [sel, setSel] = useState(null);
  const elements = [
    { k: texts.anatomy_rol, d: texts.anatomy_rol_desc, c: 'bg-[#0D2B5B]' },
    { k: texts.anatomy_contexto, d: texts.anatomy_contexto_desc, c: 'bg-[#00B4D8]' },
    { k: texts.anatomia_tarea, d: texts.anatomia_tarea_desc, c: 'bg-[#4361EE]' },
    { k: texts.anatomia_formato, d: texts.anatomia_formato_desc, c: 'bg-[#4CC9F0]' },
    { k: texts.anatomia_restriccion, d: texts.anatomia_restriccion_desc, c: 'bg-[#F72585]' },
    { k: texts.anatomia_ejemplos, d: texts.anatomia_ejemplos_desc, c: 'bg-[#FF9F1C]' }
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
            <h5 className="text-[#00B4D8] font-[900] text-xs uppercase tracking-[0.3em] mb-3">{texts.anatomy_element_label} {sel.k}</h5>
            <p className="text-base leading-relaxed font-medium">{sel.d}</p>
            <div className="mt-4"><VoiceReader text={text} listenLabel={texts.btn_listen} stopLabel={texts.btn_stop} /></div>
          </div>
        ) : (
          <div className="text-center opacity-30 space-y-3">
            <MousePointer2 className="w-8 h-8 mx-auto animate-bounce" />
            <p className="text-[9px] font-black uppercase tracking-widest leading-none">{texts.anatomy_placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TechniquesSection = ({ texts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] slide-in-from-bottom">
    {[
      { t: texts.technique_1_title, d: texts.technique_1_desc, i: <BrainCircuit className="w-5 h-5" /> },
      { t: texts.technique_2_title, d: texts.technique_2_desc, i: <Layers className="w-5 h-5" /> },
      { t: texts.technique_3_title, d: texts.technique_3_desc, i: <Zap className="w-5 h-5" /> },
      { t: texts.technique_4_title, d: texts.technique_4_desc, i: <Globe className="w-5 h-5" /> },
      { t: texts.technique_5_title, d: texts.technique_5_desc, i: <Target className="w-5 h-5" /> },
      { t: texts.technique_6_title, d: texts.technique_6_desc, i: <Sparkles className="w-5 h-5" /> }
    ].map((s, i) => (
      <div key={i} className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.2rem] shadow-sm hover:shadow-lg transition-all group">
        <div className="p-3 bg-slate-50 dark:bg-slate-700 text-[#0D2B5B] rounded-[1rem] shadow-inner group-hover:bg-[#0D2B5B] group-hover:text-white transition-all">{s.i}</div>
        <div><h5 className="font-[900] text-[#0D2B5B] text-xs uppercase mb-1 tracking-tighter leading-none">{s.t}</h5><p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium leading-relaxed">{s.d}</p></div>
      </div>
    ))}
  </div>
);

const ErrorSection = ({ texts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    {[
      { t: texts.error_1_title, d: texts.error_1_desc, i: <AlertTriangle /> },
      { t: texts.error_2_title, d: texts.error_2_desc, i: <FileText /> },
      { t: texts.error_3_title, d: texts.error_3_desc, i: <Search /> },
      { t: texts.error_4_title, d: texts.error_4_desc, i: <Zap /> },
      { t: texts.error_5_title, d: texts.error_5_desc, i: <Info /> },
      { t: texts.error_6_title, d: texts.error_6_desc, i: <Clock /> }
    ].map((e, i) => (
      <div key={i} className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
        <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">{e.i}</div>
        <h5 className="font-[900] text-[#0D2B5B] text-[10px] uppercase tracking-widest leading-none mb-1">{e.t}</h5>
        <p className="text-[10px] text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{e.d}</p>
      </div>
    ))}
  </div>
);

const QuizScreen = ({ texts, onNext, addXp }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const questions = [
    { q: texts.quiz_1_q, o: [texts.quiz_1_o1, texts.quiz_1_o2, texts.quiz_1_o3, texts.quiz_1_o4], c: 1, f: texts.quiz_1_f },
    { q: texts.quiz_2_q, o: [texts.quiz_2_o1, texts.quiz_2_o2, texts.quiz_2_o3, texts.quiz_2_o4], c: 2, f: texts.quiz_2_f },
    { q: texts.quiz_3_q, o: [texts.quiz_3_o1, texts.quiz_3_o2, texts.quiz_3_o3, texts.quiz_3_o4], c: 1, f: texts.quiz_3_f },
    { q: texts.quiz_4_q, o: [texts.quiz_4_o1, texts.quiz_4_o2, texts.quiz_4_o3, texts.quiz_4_o4], c: 2, f: texts.quiz_4_f },
    { q: texts.quiz_5_q, o: [texts.quiz_5_o1, texts.quiz_5_o2, texts.quiz_5_o3, texts.quiz_5_o4], c: 2, f: texts.quiz_5_f }
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
        <h2 className="text-3xl font-black text-[#0D2B5B] tracking-tighter leading-none mb-2 uppercase">{texts.quiz_result_title}</h2>
        <div className="bg-[#0D2B5B] text-white inline-block px-8 py-4 rounded-[2rem] mt-4 text-4xl font-black shadow-lg border-b-4 border-[#00B4D8]">{score} / 5</div>
        <p className="text-slate-500 dark:text-slate-300 mt-4 font-bold text-sm">{score === 5 ? texts.quiz_result_perfect : score >= 3 ? texts.quiz_result_good : texts.quiz_result_keep_trying}</p>
        <Button onClick={onNext} className="mt-6 bg-[#0D2B5B] text-white mx-auto">{texts.quiz_result_cta}</Button>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
        <span>{texts.quiz_label_question} {currentQ + 1} {texts.quiz_label_of} 5</span>
        <span className="text-[#00B4D8]">{texts.quiz_label_score} {score}</span>
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
          <button onClick={handleNext} className="mt-4 w-full py-3 bg-[#0D2B5B] text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs">{currentQ === 4 ? texts.quiz_label_see_results : texts.quiz_label_continue} <ChevronRight size={14} /></button>
        </div>
      )}
    </div>
  );
};

const CertificateScreen = ({ texts, xp, onReset, showMarkButton, onMarkComplete }) => (
  <div className="mx-auto animate-fade-in text-center">
    <h2 className="text-2xl font-extrabold text-[#0D2B5B] mb-3">{texts.certificate_title}</h2>
    <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">{texts.certificate_desc}</p>
    <div className="bg-gradient-to-br from-[#0D2B5B] to-[#0A1F3F] p-[2px] rounded-2xl shadow-lg mx-auto max-w-md transform hover:scale-105 transition-transform duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[14px] p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-100 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-tr-full opacity-50"></div>
        <div className="flex justify-center mb-3"><Logo /></div>
        <div className="text-[10px] font-bold tracking-widest text-[#00B4D8] uppercase mb-1">{texts.certificate_badge}</div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">{texts.certificate_subtitle}</h3>
        <div className="flex justify-center gap-4 text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-700 py-2 mb-3 text-xs">
          <div><div className="text-[9px] uppercase tracking-wider">{texts.certificate_label_xp}</div><div className="text-sm font-bold text-[#0D2B5B]">{xp} / 500</div></div>
          <div><div className="text-[9px] uppercase tracking-wider">{texts.certificate_label_coach}</div><div className="text-sm font-bold text-[#0D2B5B]">{texts.certificate_coach_name}</div></div>
          <div><div className="text-[9px] uppercase tracking-wider">{texts.certificate_label_date}</div><div className="text-sm font-bold text-[#0D2B5B]">{new Date().toLocaleDateString()}</div></div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white shadow border-2 border-white"><Award size={24} /></div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
      {showMarkButton && onMarkComplete && (
        <button onClick={onMarkComplete}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {texts.certificate_mark_done}
        </button>
      )}
      <Button onClick={onReset} className="bg-transparent text-[#0D2B5B] border-2 border-[#0D2B5B] hover:bg-slate-50 dark:hover:bg-slate-700 text-xs">{texts.certificate_reset}</Button>
      <Button onClick={() => alert(texts.certificate_explore_alert)} className="bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white text-xs">{texts.certificate_explore}</Button>
    </div>
  </div>
);

export default function OVAEtica({ onComplete }) {
  const texts = useOVATranslations('etica');
  const certCompletedRef = useRef(false);
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

  const screensData = {
    m1: { title: texts.screen_m1 },
    m2: { title: texts.screen_m2 },
    m3: { title: texts.screen_m3 },
    m4: { title: texts.screen_m4 },
    m5: { title: texts.screen_m5 },
    m6: { title: texts.screen_m6 }
  };

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen texts={texts} onNext={nextScreen} />;
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
      case 'm1': return <ModuleHistory texts={texts} />;
      case 'm2': return <PromptConcept texts={texts} />;
      case 'm3': return <ModuleAnatomy texts={texts} />;
      case 'm4': return <TechniquesSection texts={texts} />;
      case 'm5': return <ErrorSection texts={texts} />;
      case 'm6': return <QuizScreen texts={texts} onNext={() => { setScreen('certificate'); }} addXp={addXp} />;
      case 'certificate': return <CertificateScreen texts={texts} xp={xp} onReset={() => { setScreen('welcome'); setXp(0); setQuizScore(null); setCompleted([]); }} showMarkButton={!certCompletedRef.current} onMarkComplete={() => { certCompletedRef.current = true; onComplete?.(); }} />;
      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{texts.progress_label}</span>
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
                <div className="flex items-center gap-1.5 text-[#00B4D8] font-[900] text-[8px] tracking-[0.3em] uppercase"><Sparkles className="w-3 h-3" /> {texts.edutechlife_master}</div>
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
            <button onClick={() => { if (curIdx < nav.length - 1) { if (screen.startsWith('m')) { const newC = [...completed]; if (!newC.includes(screen)) newC.push(screen); setCompleted(newC); } setScreen(nav[curIdx + 1]); stopSpeech(); } }} className="px-6 py-3 bg-gradient-to-r from-[#0D2B5B] to-[#1A4D8C] text-white rounded-xl font-[900] text-[11px] shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em]">{texts.btn_next} <ArrowRightCircle className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && screen !== 'certificate' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-[10px]">
          <p>{texts.footer} <strong className="text-[#00B4D8]">{texts.footer_coach}</strong> — {texts.footer_tagline}</p>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-6 h-6 text-slate-600 dark:text-slate-300" /></button>
            <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-[10px] tracking-[0.3em] uppercase border-b-2 border-slate-50 dark:border-slate-700 pb-4">{texts.sidebar_title}</h3>
            {nav.map(id => (
              <button key={id} onClick={() => { setScreen(id); setIsMenuOpen(false); }} className={`p-4 rounded-xl text-left text-[11px] font-[900] transition-all flex items-center justify-between group ${screen === id ? 'bg-[#0D2B5B] text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                <span className="uppercase tracking-wider">{id === 'welcome' ? texts.sidebar_welcome : id === 'menu' ? texts.sidebar_menu : id === 'certificate' ? texts.sidebar_certificate : screensData[id]?.title}</span>
                {completed.includes(id) && <CheckCircle2 className="w-4 h-4 text-[#00B4D8]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
