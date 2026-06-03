import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../i18n/I18nProvider';
import {
  BrainCircuit, ChevronRight, ChevronLeft,
  ArrowRightCircle, Star, Sparkles, CheckCircle2, Menu, MousePointer2,
  Lightbulb, Target, Globe, Zap, Settings, MessageSquare,
  TrendingUp, Cpu, Wrench, Share2, Search, Layout, Database,
  Bot, Volume2, Image, FileText, Link, HelpCircle, Rocket,
  ChevronDown, Users, Play, Briefcase
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';
import { OVAIntro } from './shared';
import VoiceReader from './VoiceReader';
import { infographicData } from '../../data/ova/ecosystemGuide';

const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-petroleum to-corporate rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] text-petroleum">edutech</span>
      <span className="font-[400] text-corporate">life</span>
    </div>
  </div>
);

const detailIconMap = { Search, Layout, Database, Zap, Settings, MessageSquare };

const DetailCard = ({ detail }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const DetailIcon = detailIconMap[detail.icon] || null;
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border-2 transition-all ${isExpanded ? 'border-corporate' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center gap-4 p-4 text-left">
        <div className={`shrink-0 transition-colors ${isExpanded ? 'text-corporate' : 'text-slate-400'}`}>
          {DetailIcon ? <DetailIcon size={20} /> : <ChevronDown size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="font-[900] text-petroleum text-xs uppercase">{detail.title}</h5>
            {detail.date && <span className="text-[10px] font-black text-corporate bg-corporate/10 px-2 py-0.5 rounded-md">{detail.date}</span>}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed">{detail.text}</p>
        </div>
        <ChevronDown size={18} className={`text-slate-300 dark:text-slate-500 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-corporate' : ''}`} />
      </button>
      {detail.extendedText && (
        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-0">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic flex gap-2">
                <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{detail.extendedText}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const sectionIcons = { TrendingUp, Cpu, Wrench, Share2 };

const SectionScreen = ({ section }) => {
  const { t } = useTranslation();
  const SectionIcon = sectionIcons[section.icon] || null;
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-petroleum to-corporate text-white rounded-xl flex items-center justify-center shadow-md">
          {SectionIcon && <SectionIcon size={22} />}
        </div>
        <div>
          <h4 className="font-[900] text-petroleum text-lg tracking-tighter lowercase">{section.title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{section.content}</p>
        </div>
      </div>
      <div className="space-y-2">
        {section.details.map((detail, idx) => (
          <DetailCard key={idx} detail={detail} />
        ))}
      </div>
    </div>
  );
};

const StrategiesScreen = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const strategies = [
    { k: 'gpts', icon: <Bot className="w-5 h-5" />, color: 'bg-petroleum' },
    { k: 'voice', icon: <Volume2 className="w-5 h-5" />, color: 'bg-corporate' },
    { k: 'dalle', icon: <Image className="w-5 h-5" />, color: 'bg-[#4361EE]' },
    { k: 'files', icon: <FileText className="w-5 h-5" />, color: 'bg-[#4CC9F0]' },
    { k: 'sharing', icon: <Link className="w-5 h-5" />, color: 'bg-[#F72585]' },
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">{t('ova.ecosystem.strategies_desc')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {strategies.map(s => (
          <button key={s.k} onClick={() => setActive(active === s.k ? null : s.k)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${active === s.k ? 'border-corporate bg-blue-50 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}>
            <div className={`w-10 h-10 ${s.color} text-white rounded-lg flex items-center justify-center mb-2 shadow-sm`}>{s.icon}</div>
            <h5 className="font-[900] text-petroleum text-xs uppercase tracking-wider">{t(`ova.ecosystem.strategies_${s.k}_title`)}</h5>
          </button>
        ))}
      </div>
      {active ? (
        <div className="p-4 bg-petroleum text-white rounded-xl">
          <h5 className="text-corporate font-[900] text-xs uppercase tracking-[0.2em] mb-2">{t(`ova.ecosystem.strategies_${active}_title`)}</h5>
          <p className="text-sm text-white leading-relaxed font-medium">{t(`ova.ecosystem.strategies_${active}_desc`)}</p>
        </div>
      ) : (
        <div className="text-center py-6 opacity-30 space-y-2">
          <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
          <p className="text-[10px] font-black uppercase tracking-widest">{t('ova.ecosystem.strategies_select')}</p>
        </div>
      )}
    </div>
  );
};

const QuizScreen = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const questions = [
    { key: 'q1', options: ['o1', 'o2', 'o3'] },
    { key: 'q2', options: ['o1', 'o2', 'o3'] },
    { key: 'q3', options: ['o1', 'o2', 'o3'] },
  ];

  const getScore = () => {
    const r = answers.reduce((sum, a) => sum + a, 0);
    if (r <= 3) return 'beginner';
    if (r <= 5) return 'creator';
    if (r <= 7) return 'pro';
    return 'power';
  };

  const handleAnswer = (val) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (step < 2) {
      setStep(step + 1);
    } else {
      setResult(getScore());
    }
  };

  const restart = () => { setStep(0); setAnswers([]); setResult(null); };

  if (result) {
    return (
      <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-corporate to-petroleum rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h4 className="font-[900] text-petroleum text-xl tracking-tighter lowercase">{t(`ova.ecosystem.quiz_result_${result}_title`)}</h4>
        <div className="p-4 bg-gradient-to-br from-corporate/5 to-white rounded-xl border border-corporate/20">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{t(`ova.ecosystem.quiz_result_${result}`)}</p>
        </div>
        <button onClick={restart} className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-petroleum font-black rounded-xl text-xs uppercase tracking-wider hover:bg-slate-200 transition-all">
          {t('ova.ecosystem.quiz_restart')}
        </button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-4 h-4 text-corporate" />
        <span className="text-[10px] font-black text-petroleum uppercase tracking-wider">{t('ova.ecosystem.quiz_desc')}</span>
      </div>
      <div className="flex gap-1.5 mb-4">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-petroleum' : i < step ? 'w-2 bg-corporate' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />
        ))}
      </div>
      <h4 className="font-[900] text-petroleum text-base leading-tight">{t(`ova.ecosystem.quiz_${q.key}`)}</h4>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i + 1)}
            className="w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-corporate rounded-xl text-left text-xs font-medium text-slate-600 dark:text-slate-300 transition-all">
            {t(`ova.ecosystem.quiz_${q.key}_${opt}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChallengeScreen = () => {
  const { t } = useTranslation();
  const [scenario, setScenario] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const scenarios = [
    { k: 'student', icon: <Star className="w-5 h-5" />, color: 'bg-petroleum' },
    { k: 'teacher', icon: <Zap className="w-5 h-5" />, color: 'bg-corporate' },
    { k: 'pro', icon: <Briefcase className="w-5 h-5" />, color: 'bg-[#4361EE]' },
  ];

  if (!scenario) {
    return (
      <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">{t('ova.ecosystem.challenge_desc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {scenarios.map(s => (
            <button key={s.k} onClick={() => { setScenario(s.k); setRevealed(false); }}
              className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-corporate rounded-xl text-center transition-all">
              <div className={`w-10 h-10 ${s.color} text-white rounded-lg flex items-center justify-center mx-auto mb-2`}>{s.icon}</div>
              <h5 className="font-[900] text-petroleum text-xs uppercase">{t(`ova.ecosystem.challenge_option_${s.k}`)}</h5>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <button onClick={() => { setScenario(null); setRevealed(false); }} className="text-[10px] font-black text-corporate uppercase tracking-wider hover:underline">
        &larr; {t('ova.ecosystem.challenge_desc')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">{t('ova.ecosystem.challenge_before_label')}</span>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-mono italic mt-2">{t(`ova.ecosystem.challenge_${scenario}_before`)}</p>
        </div>
        {revealed && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl animate-[fadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">{t('ova.ecosystem.challenge_after_label')}</span>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed mt-2">{t(`ova.ecosystem.challenge_${scenario}_after`)}</p>
          </div>
        )}
      </div>
      {!revealed && (
        <button onClick={() => setRevealed(true)}
          className="w-full py-3 bg-gradient-to-r from-petroleum to-corporate text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg">
          {t('ova.ecosystem.challenge_reveal')} <ArrowRightCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const ConclusionScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-petroleum to-corporate rounded-[2rem] flex items-center justify-center mx-auto shadow-lg">
        <Rocket className="w-8 h-8 text-white" />
      </div>
      <h4 className="font-[900] text-petroleum text-2xl tracking-tighter lowercase">{t('ova.ecosystem.conclusion_title')}</h4>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm max-w-lg mx-auto">{t('ova.ecosystem.conclusion_desc')}</p>
    </div>
  );
};

const screensData = {
  m1: { title: 'Evolución del Motor de IA' },
  m2: { title: 'Modos de Operación' },
  m3: { title: 'Caja de Herramientas' },
  m4: { title: 'Conectividad y Automatización' },
  m5: { title: 'Estrategias Exclusivas ChatGPT' },
  m6: { title: '¿Qué Perfil Eres?' },
  m7: { title: 'Reto Práctico' },
  m8: { title: 'Conclusión' }
};

OVAEcosystemGuide.propTypes = {
  onComplete: PropTypes.any,
};

export default function OVAEcosystemGuide({ onComplete }) {
  const { t, locale } = useTranslation();
  const [screen, setScreen] = useState('welcome');
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const certCompletedRef = useRef(false);
  const nav = ['welcome', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
  const curIdx = nav.indexOf(screen);

  const sections = infographicData.sections;

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

  const handleMarkComplete = () => {
    if (!certCompletedRef.current) {
      certCompletedRef.current = true;
      onComplete?.();
    }
  };

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return (
        <>
          <OVAIntro
            icon="fa-brain"
            badge={t('ova.ecosystem.lab_badge')}
            title="Dominando el Ecosistema ChatGPT"
            description={t('ova.ecosystem.welcome_desc')}
            onStart={nextScreen}
            startLabel={t('ova.ecosystem.start_btn')}
          />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.ecosystem.welcome_voice')} />
          </div>
        </>
      );
      case 'm1': return (
        <>
          <SectionScreen section={sections[0]} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={sections[0].content} />
          </div>
        </>
      );
      case 'm2': return (
        <>
          <SectionScreen section={sections[1]} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={sections[1].content} />
          </div>
        </>
      );
      case 'm3': return (
        <>
          <SectionScreen section={sections[2]} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={sections[2].content} />
          </div>
        </>
      );
      case 'm4': return (
        <>
          <SectionScreen section={sections[3]} />
          <div className="flex justify-center mt-6">
            <VoiceReader text={sections[3].content} />
          </div>
        </>
      );
      case 'm5': return (
        <>
          <StrategiesScreen />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.ecosystem.strategies_voice')} />
          </div>
        </>
      );
      case 'm6': return (
        <>
          <QuizScreen />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.ecosystem.quiz_voice')} />
          </div>
        </>
      );
      case 'm7': return (
        <>
          <ChallengeScreen />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.ecosystem.challenge_voice')} />
          </div>
        </>
      );
      case 'm8': return (
        <>
          <ConclusionScreen />
          <div className="flex justify-center mt-6">
            <VoiceReader text={t('ova.ecosystem.conclusion_voice')} />
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
          {screen !== 'welcome' && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-corporate/20">
              <Star className="text-corporate fill-current" size={14} />
              <span className="font-bold text-petroleum text-xs">{nav.filter(id => completed.includes(id)).length}/{nav.length - 1}</span>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú de navegación" className="min-w-[44px] min-h-[44px] p-2.5 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"><Menu className="w-5 h-5 text-petroleum" /></button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith('m') && (
            <div className="mb-4 border-b border-slate-50 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-1.5 text-corporate font-[900] text-[10px] tracking-[0.3em] uppercase"><Sparkles className="w-3 h-3" /> {t('ova.introprompt.master')}</div>
              <h1 className="text-lg md:text-xl font-[900] text-petroleum tracking-tighter leading-tight">{screensData[screen]?.title}</h1>
            </div>
          )}
          <div className="relative z-10 min-h-[180px] flex flex-col justify-center">{renderContent()}</div>
        </div>
      </main>

      {screen !== 'welcome' && (
        <>
          <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90">
            <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
              <button onClick={() => { if (curIdx > 1) setScreen(nav[curIdx - 1]); stopSpeech(); }} aria-label="Anterior" className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-petroleum dark:hover:text-corporate rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700" disabled={curIdx <= 1}><ChevronLeft className="w-5 h-5" /></button>
              <div className="flex gap-1.5">{nav.slice(1).map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i + 1 === curIdx ? 'w-8 bg-petroleum' : completed.includes(nav[i + 1]) ? 'w-2 bg-corporate' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />)}</div>
              <button onClick={isLastScreen ? handleMarkComplete : nextScreen} className={`px-6 min-h-[44px] rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] ${isLastScreen ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gradient-to-r from-petroleum to-corporate text-white'}`}>
                {isLastScreen ? t('ova.ecosystem.mark_complete') : t('ova.introprompt.next')} <ArrowRightCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
            <p>{t('ova.ecosystem.footer')}</p>
          </div>
        </>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">{t('ova.introprompt.map')}</h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-petroleum">
                <Star className="w-3 h-3 text-corporate fill-current" />
                {completed.filter(id => id.startsWith('m')).length}/{nav.filter(id => id.startsWith('m')).length}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const stepNum = idx;
                const isCompleted = completed.includes(id);
                const isCurrent = screen === id;
                return (
                  <button key={id} onClick={() => goToScreen(id)} className={`p-3 rounded-xl text-left text-xs font-[900] transition-all group w-full ${isCurrent ? 'bg-petroleum text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${isCompleted ? 'bg-corporate text-white' : isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>{stepNum}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`uppercase tracking-wider ${isCurrent ? 'text-white' : isCompleted ? 'text-petroleum dark:text-corporate' : 'text-slate-500 dark:text-slate-400'}`}>
                          {id === 'welcome' ? t('ova.introprompt.menu_welcome') : screensData[id]?.title}
                        </div>
                        <div className="mt-1.5 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'w-full bg-corporate' : isCurrent ? 'w-1/3 bg-petroleum' : 'w-0'}`} />
                        </div>
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
