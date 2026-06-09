import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';;
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Zap, ChevronRight, ChevronLeft,
  CheckCircle2, Trophy, Info, Menu, X,
  BookOpen, MousePointer2, BrainCircuit, Sparkles, Rocket,
  Target, FileText, Cpu, Globe, ArrowRightCircle, AlertTriangle,
  Lightbulb, Search, Clock, Award, Star, XCircle
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';
import { useOVATranslations } from '../../hooks/useOVATranslations';
import { useTranslation } from '../../i18n/I18nProvider';
import { OVAIntro } from './shared';
import VoiceReader from './VoiceReader';

const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-petroleum to-corporate rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="font-[900] text-petroleum">edutech</span>
      <span className="font-[400] text-corporate">life</span>
    </div>
  </div>
);

const Button = ({ children, onClick, className = '', disabled = false }) => (
  <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all disabled:opacity-30 ${className}`}>{children}</button>
);

const ModuleHistory = ({ texts }) => {
  const [active, setActive] = useState(0);
  const sections = [
    { t: texts.history_title_1, c: texts.history_desc_1, icon: <Cpu className="w-5 h-5" />, era: '1940s' },
    { t: texts.history_title_2, c: texts.history_desc_2, icon: <Layers className="w-5 h-5" />, era: '1960s' },
    { t: texts.history_title_3, c: texts.history_desc_3, icon: <Sparkles className="w-5 h-5" />, era: '2000s' },
    { t: texts.history_title_4, c: texts.history_desc_4, icon: <Rocket className="w-5 h-5" />, era: '2020s' }
  ];
  return (
    <div className="animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="relative flex flex-col md:flex-row gap-6 md:gap-0">
        <div className="hidden md:flex flex-col items-center gap-2 pt-2 relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-petroleum via-corporate to-petroleum -translate-x-1/2 rounded-full" />
          {sections.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} className="relative flex items-center gap-4 w-full group cursor-pointer z-10">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${active === i ? 'bg-petroleum border-corporate shadow-lg shadow-corporate/30 scale-125' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-corporate'}`}>
                {active === i && <div className="w-2 h-2 bg-white rounded-full animate-ping absolute" />}
                <div className={`w-2 h-2 rounded-full ${active === i ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600'}`} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${active === i ? 'text-petroleum' : 'text-slate-400 dark:text-slate-500 group-hover:text-petroleum'}`}>{s.era}</span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-md relative overflow-hidden min-h-[160px]"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 text-corporate scale-150">{sections[active].icon}</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-petroleum to-corporate text-white rounded-lg shadow-md">{sections[active].icon}</div>
                <h4 className="text-petroleum font-[900] text-lg leading-none uppercase tracking-tighter">{sections[active].t}</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">{sections[active].c}</p>
              <div className="mt-3 flex gap-1.5">
                {sections.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-petroleum' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {sections.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${active === i ? 'bg-petroleum text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>{s.era}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptConcept = ({ texts }) => (
  <div className="space-y-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div className="p-5 bg-[#F0F9FF] rounded-[2rem] border-2 border-white dark:border-slate-700 shadow-md relative overflow-hidden">
      <h4 className="text-petroleum font-[900] text-xl mb-3 tracking-tighter leading-none lowercase">{texts.prompt_title}</h4>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm max-w-2xl">{texts.prompt_desc}</p>
    </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-[1.5rem] flex items-center gap-3 shadow-sm">
      <div className="p-3 bg-corporate/10 rounded-xl text-corporate shadow-inner"><Lightbulb size={24} /></div>
      <p className="text-xs text-slate-500 dark:text-slate-300 font-bold italic leading-relaxed">{texts.prompt_tip}</p>
    </div>
  </div>
);

const ModuleAnatomy = ({ texts }) => {
  const [sel, setSel] = useState(null);
  const elements = [
    { k: texts.anatomy_rol, d: texts.anatomy_rol_desc, c: 'bg-petroleum' },
    { k: texts.anatomy_contexto, d: texts.anatomy_contexto_desc, c: 'bg-corporate' },
    { k: texts.anatomia_tarea, d: texts.anatomia_tarea_desc, c: 'bg-[#4361EE]' },
    { k: texts.anatomia_formato, d: texts.anatomia_formato_desc, c: 'bg-[#4CC9F0]' },
    { k: texts.anatomia_restriccion, d: texts.anatomia_restriccion_desc, c: 'bg-[#F72585]' },
    { k: texts.anatomia_ejemplos, d: texts.anatomia_ejemplos_desc, c: 'bg-[#FF9F1C]' }
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center animate-[zoomIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
      <div className="grid grid-cols-3 gap-2">
        {elements.map((el) => (
          <button key={el.k} onClick={() => setSel(el)} className={`p-4 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-2 group ${sel?.k === el.k ? 'border-corporate bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
            <div className={`w-10 h-10 ${el.c} text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}><span className="text-lg font-black">{el.k[0]}</span></div>
            <span className="text-xs font-black text-petroleum uppercase tracking-tighter leading-none">{el.k}</span>
          </button>
        ))}
      </div>
      <div className="bg-petroleum text-white p-5 rounded-[1.8rem] shadow-lg relative min-h-[180px] flex flex-col justify-center border-b-2 border-corporate">
        {sel ? (
          <div className="animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h5 className="text-corporate font-[900] text-xs uppercase tracking-[0.3em] mb-3">{texts.anatomy_element_label} {sel.k}</h5>
            <p className="text-base text-white leading-relaxed font-medium">{sel.d}</p>
          </div>
        ) : (
          <div className="text-center opacity-30 space-y-3">
            <MousePointer2 className="w-8 h-8 mx-auto animate-bounce" />
            <p className="text-xs font-black uppercase tracking-widest leading-none">{texts.anatomy_placeholder}</p>
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
        <div className="p-3 bg-slate-50 dark:bg-slate-700 text-petroleum rounded-[1rem] shadow-inner group-hover:bg-petroleum group-hover:text-white transition-all">{s.i}</div>
        <div><h5 className="font-[900] text-petroleum text-xs uppercase mb-1 tracking-tighter leading-none">{s.t}</h5><p className="text-xs text-slate-500 dark:text-slate-300 font-medium leading-relaxed">{s.d}</p></div>
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
        <h5 className="font-[900] text-petroleum text-xs uppercase tracking-widest leading-none mb-1">{e.t}</h5>
        <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{e.d}</p>
      </div>
    ))}
  </div>
);

const QuizScreen = ({ texts, onNext, addXp, onScore }) => {
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
    else { setShowResult(true); onScore?.(score); }
  };
  if (showResult) {
    return (
      <div className="text-center py-4 animate-[zoomIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
        <div className="w-20 h-20 bg-corporate/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white dark:border-slate-700"><Trophy className="w-10 h-10 text-corporate" /></div>
        <h2 className="text-3xl font-black text-petroleum tracking-tighter leading-none mb-2 uppercase">{texts.quiz_result_title}</h2>
        <div className="bg-petroleum text-white inline-block px-8 py-4 rounded-[2rem] mt-4 text-4xl font-black shadow-lg border-b-4 border-corporate">{score} / 5</div>
        <p className="text-slate-500 dark:text-slate-300 mt-4 font-bold text-sm">{score === 5 ? texts.quiz_result_perfect : score >= 3 ? texts.quiz_result_good : texts.quiz_result_keep_trying}</p>
        <Button onClick={onNext} className="mt-6 bg-petroleum text-white mx-auto">{texts.quiz_result_cta}</Button>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
        <span>{texts.quiz_label_question} {currentQ + 1} {texts.quiz_label_of} 5</span>
        <span className="text-corporate">{texts.quiz_label_score} {score}</span>
      </div>
      <h3 className="text-xl font-[900] text-petroleum leading-tight">{questions[currentQ].q}</h3>
      <div className="grid gap-2">
        {questions[currentQ].o.map((opt, i) => {
          const isCorrect = showFeedback && i === questions[currentQ].c;
          const isWrong = showFeedback && selected === i && i !== questions[currentQ].c;
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              whileTap={{ scale: 0.97 }}
              animate={isCorrect ? { scale: [1, 1.02, 1], transition: { duration: 0.4 } } : isWrong ? { x: [0, -4, 4, -2, 2, 0], transition: { duration: 0.4 } } : {}}
              className={`p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all flex items-center justify-between gap-3 ${isCorrect ? 'bg-green-50 border-green-500 text-green-700 shadow-md' : isWrong ? 'bg-red-50 border-red-500 text-red-700 shadow-md' : showFeedback ? 'bg-slate-50 border-transparent opacity-50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate'}`}
            >
              <span className="flex-1">{opt}</span>
              {isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />}
              {isWrong && <XCircle className="w-5 h-5 shrink-0 text-red-500" />}
            </motion.button>
          );
        })}
      </div>
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="p-5 bg-slate-100 dark:bg-slate-700 rounded-[2rem]"
        >
          <p className="text-xs font-bold leading-relaxed">{questions[currentQ].f}</p>
          <button onClick={handleNext} className="mt-4 w-full py-3 bg-petroleum text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs">{currentQ === 4 ? texts.quiz_label_see_results : texts.quiz_label_continue} <ChevronRight size={14} /></button>
        </motion.div>
      )}
    </div>
  );
};

const CertificateScreen = ({ texts, quizScore }) => {
  const getMessage = () => {
    if (quizScore === null) return texts.certificate_desc;
    if (quizScore === 5) return texts.quiz_result_perfect;
    if (quizScore >= 3) return texts.quiz_result_good;
    return texts.quiz_result_keep_trying;
  };
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
          <Trophy className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      <h2 className="text-3xl font-black text-petroleum mb-2 uppercase tracking-tighter">{texts.quiz_result_title}</h2>
      {quizScore !== null ? (
        <>
          <div className="bg-petroleum text-white inline-block px-10 py-5 rounded-[2rem] text-5xl font-black shadow-lg border-b-4 border-corporate mb-5">
            {quizScore} / 5
          </div>
          <div className="flex justify-center gap-1.5 mb-5">
            {[1,2,3,4,5].map(i => (
              <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}>
                <Star className={`w-7 h-7 ${i <= quizScore ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-200 dark:text-slate-600'}`} />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-16 h-16 bg-corporate/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-corporate" />
        </div>
      )}
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-6 leading-relaxed">{getMessage()}</p>
    </div>
  );
};


Button.propTypes = {
  onClick: PropTypes.any,
  disabled: PropTypes.any,
};

export default function OVAEtica({ onComplete }) {
  const { locale } = useTranslation();
  const texts = useOVATranslations('etica');
  const certCompletedRef = useRef(false);
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [xp, setXp] = useState(0);
  const totalXp = 500;

  useEffect(() => {
    if (screen === 'certificate' && !certCompletedRef.current) {
      certCompletedRef.current = true;
      onComplete?.();
    }
  }, [screen, onComplete]);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screenVariants = {
    enter: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    center: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? {} : { opacity: 0, y: -20 }
  };
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

  const getValerioText = () => {
    switch (screen) {
      case 'welcome': return texts.welcome_voice;
      case 'm1': return texts.history_desc_1;
      case 'm2': return texts.prompt_voice;
      case 'm3': return texts.anatomy_rol_desc;
      case 'm4': return texts.technique_1_desc;
      case 'm5': return texts.error_1_desc;
      case 'm6': return texts.quiz_1_q;
      case 'certificate': return texts.certificate_desc;
      default: return '';
    }
  };

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return (
        <>
          <OVAIntro
            icon="fa-brain"
            badge={texts.welcome_label}
            title={`${texts.welcome_title_1} ${texts.welcome_title_2}`}
            description={texts.welcome_desc}
            onStart={() => setScreen('m1')}
          />
          <div className="flex justify-center mt-6">
            <VoiceReader text={texts.welcome_voice} />
          </div>
        </>
      );
      case 'menu':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] slide-in-from-bottom">
            {nav.slice(2).map((id) => (
              <button key={id} onClick={() => setScreen(id)} className="group bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg hover:border-corporate transition-all flex flex-col items-center text-center gap-4 relative overflow-hidden">
                <div className="bg-[#F0F9FF] dark:bg-blue-900/30 text-petroleum p-4 rounded-[1.5rem] shadow-sm group-hover:scale-110 transition-transform"><BookOpen className="w-6 h-6" /></div>
                <span className="font-[900] text-petroleum text-xs uppercase tracking-[0.1em] leading-tight">{screensData[id].title}</span>
                {completed.includes(id) && <div className="absolute top-4 right-4 bg-green-50 p-1 rounded-full"><CheckCircle2 className="text-green-500 w-4 h-4" /></div>}
              </button>
            ))}
          </div>
        );
      case 'm1': return (
        <>
          <ModuleHistory texts={texts} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={texts.history_desc_1 + ' ' + texts.history_desc_2 + ' ' + texts.history_desc_3 + ' ' + texts.history_desc_4} />
          </div>
        </>
      );
      case 'm2': return (
        <>
          <PromptConcept texts={texts} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={texts.prompt_desc + ' ' + texts.prompt_tip} />
          </div>
        </>
      );
      case 'm3': return (
        <>
          <ModuleAnatomy texts={texts} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={texts.anatomy_rol_desc + ' ' + texts.anatomy_contexto_desc + ' ' + texts.anatomia_tarea_desc + ' ' + texts.anatomia_formato_desc + ' ' + texts.anatomia_restriccion_desc + ' ' + texts.anatomia_ejemplos_desc} />
          </div>
        </>
      );
      case 'm4': return (
        <>
          <TechniquesSection texts={texts} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={texts.technique_1_desc + ' ' + texts.technique_2_desc + ' ' + texts.technique_3_desc + ' ' + texts.technique_4_desc + ' ' + texts.technique_5_desc + ' ' + texts.technique_6_desc} />
          </div>
        </>
      );
      case 'm5': return (
        <>
          <ErrorSection texts={texts} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={texts.error_1_desc + ' ' + texts.error_2_desc + ' ' + texts.error_3_desc + ' ' + texts.error_4_desc + ' ' + texts.error_5_desc + ' ' + texts.error_6_desc} />
          </div>
        </>
      );
      case 'm6': return <QuizScreen texts={texts} onNext={() => { setScreen('certificate'); }} addXp={addXp} onScore={setQuizScore} />;
      case 'certificate': return (
        <>
          <CertificateScreen texts={texts} quizScore={quizScore} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={texts.certificate_desc} />
          </div>
        </>
      );
      default: return null;
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{texts.progress_label}</span>
            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700 shadow-inner">
              <div className="h-full bg-gradient-to-r from-petroleum to-corporate transition-all duration-1000 ease-out shadow-lg" style={{ width: `${(xp / totalXp) * 100}%` }}></div>
            </div>
          </div>
          {screen !== 'welcome' && screen !== 'certificate' && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-corporate/20">
              <Star className="text-corporate fill-current" size={14} />
              <span className="font-bold text-petroleum text-xs">{xp} XP</span>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú de navegación" className="p-2 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all shadow-sm border border-slate-100 dark:border-slate-700"><Menu className="w-5 h-5 text-petroleum" /></button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith('m') && (
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 border-b border-slate-50 dark:border-slate-700 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-corporate font-[900] text-[10px] tracking-[0.3em] uppercase"><Sparkles className="w-3 h-3" /> {texts.edutechlife_master}</div>
                <h1 className="text-xl md:text-2xl font-[900] text-petroleum tracking-tighter leading-tight">{screensData[screen].title}</h1>
              </div>
            </div>
          )}
          <div className="relative z-10 min-h-[200px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute -top-40 -right-40 w-[300px] h-[300px] bg-corporate rounded-full blur-[100px] opacity-[0.04] pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-petroleum rounded-full blur-[100px] opacity-[0.04] pointer-events-none"></div>
        </div>
      </main>

      {screen !== 'welcome' && screen !== 'certificate' && (
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl">
          <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
            <button onClick={() => { if (curIdx > 0) setScreen(nav[curIdx - 1]); stopSpeech(); }} aria-label="Anterior" className="p-3 bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-petroleum dark:hover:text-corporate rounded-xl disabled:opacity-10 transition-all shadow-inner border border-slate-50 dark:border-slate-700" disabled={curIdx === 0}><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-2">
              {nav.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === curIdx ? 'w-10 bg-petroleum' : 'w-2 bg-slate-200 dark:bg-slate-600'}`}></div>)}
            </div>
            <button onClick={() => { if (curIdx < nav.length - 1) { if (screen.startsWith('m')) { const newC = [...completed]; if (!newC.includes(screen)) newC.push(screen); setCompleted(newC); } setScreen(nav[curIdx + 1]); stopSpeech(); } }} className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em]">{texts.btn_next} <ArrowRightCircle className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {screen !== 'welcome' && screen !== 'certificate' && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
          <p>{texts.footer} <strong className="text-corporate">{texts.footer_coach}</strong> — {texts.footer_tagline}</p>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">{texts.sidebar_title}</h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-petroleum">
                <Star className="w-3 h-3 text-corporate fill-current" />
                {completed.filter(id => id.startsWith('m')).length}/6
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const stepNum = id.startsWith('m') ? nav.slice(2).indexOf(id) + 1 : null;
                const isCompleted = completed.includes(id);
                const isCurrent = screen === id;
                return (
                  <button key={id} onClick={() => { setScreen(id); setIsMenuOpen(false); }} className={`p-3 rounded-xl text-left text-xs font-[900] transition-all group w-full ${isCurrent ? 'bg-petroleum text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      {id.startsWith('m') ? (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${isCompleted ? 'bg-corporate text-white' : isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>{stepNum}</div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCompleted || isCurrent ? 'text-white' : 'text-slate-400'}`}>
                          {id === 'welcome' ? <BookOpen className="w-4 h-4" /> : id === 'menu' ? <Layers className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`uppercase tracking-wider ${isCurrent ? 'text-white' : isCompleted ? 'text-petroleum dark:text-corporate' : 'text-slate-500 dark:text-slate-400'}`}>
                          {id === 'welcome' ? texts.sidebar_welcome : id === 'menu' ? texts.sidebar_menu : id === 'certificate' ? texts.sidebar_certificate : screensData[id]?.title}
                        </div>
                        {id.startsWith('m') && (
                          <div className="mt-1.5 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'w-full bg-corporate' : isCurrent ? 'w-1/3 bg-petroleum' : 'w-0'}`} />
                          </div>
                        )}
                      </div>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-corporate shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
