import React, { useState, useEffect, useRef } from 'react';
import VoiceReader from './VoiceReader';
import { contentScreens, questionsData } from '../../data/ova/notebookLab';
import { useTranslation } from '../../i18n/I18nProvider';

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
      <div className={`relative flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-[#EAEAEA] dark:border-slate-600 shadow-[0_4px_15px_rgba(47,168,198,0.15)] ${isLarge ? 'w-12 h-12 md:w-14 md:h-14' : 'w-10 h-10'}`}>
        <BrainIcon className={`text-[#2FA8C6] ${isLarge ? 'w-7 h-7' : 'w-5 h-5'}`} />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#1E3A5F] rounded-full border-2 border-white shadow-[0_0_8px_#1E3A5F] animate-pulse"></div>
      </div>
      <h1 className={`font-bold tracking-tight ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
        <span className="text-[#2FA8C6]">Edu</span><span className="text-[#1E3A5F] dark:text-slate-100">techlife</span>
      </h1>
    </div>
  );
};

const infoSteps = ['welcome', 'content-0', 'content-1', 'content-2'];
const totalSteps = infoSteps.length + questionsData.length + 1;

export default function OVANotebookLab({ onComplete }) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState('welcome');
  const certCompletedRef = useRef(false);
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

  if (gameState === 'welcome') {
    return (
      <div className="w-full relative" style={{ minHeight: '400px' }}>
        <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] bg-[length:50px_50px]" /><div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(47,168,198,0.15)_0%,rgba(255,255,255,0)_70%)]" /><div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(30,58,95,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="w-full flex items-center justify-center py-12 px-4 relative z-10">
          <div className="w-full max-w-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-8 md:p-14 rounded-3xl animate-[fadeIn_0.6s_ease-out_forwards] text-center border-t-4 border-t-[#2FA8C6] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <BrainIcon className="w-40 h-40 text-[#1E3A5F]" />
            </div>
            <div className="mb-6 flex justify-center animate-[float_6s_ease-in-out_infinite]"><EdutechLogo size="large" /></div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E0F7FA] dark:bg-teal-900/30 text-[#004B63] dark:text-teal-200 font-semibold text-[10px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20 mb-6">
              <BrainIcon className="w-3.5 h-3.5" /><span>{t('ova.notebooklab.lab_title')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-6 tracking-tight font-montserrat">{t('ova.notebooklab.welcome_title')}</h2>
            <div className="bg-[#EAEAEA]/50 dark:bg-slate-700/50 p-6 rounded-2xl mb-6 text-[#1E3A5F] dark:text-slate-100 text-base md:text-lg leading-relaxed border border-[#2FA8C6]/20 shadow-inner">
              <p className="mb-4"><strong>{t('ova.notebooklab.welcome_hello')}</strong> {t('ova.notebooklab.welcome_desc_p1')}</p>
              <p>{t('ova.notebooklab.welcome_desc_p2')}</p>
            </div>
            <div className="flex justify-center mb-6">
              <VoiceReader text={t('ova.notebooklab.welcome_audio')} />
            </div>
            <button onClick={startGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E3A5F] hover:scale-105 shadow-[0_10px_20px_rgba(47,168,198,0.3)]"
              style={{ animation: 'pulseGlow 3s infinite' }}
            >
              <span className="flex items-center gap-3 text-lg tracking-wide"><NetworkIcon /> {t('ova.notebooklab.start_cta')}</span>
            </button>
          </div>
        </div>
        
      </div>
    );
  }

  if (gameState === 'results') {

    const percentage = Math.round((score / questionsData.length) * 100);
    let message = "", submessage = "";
    if (percentage === 100) { message = t('ova.notebooklab.result_perfect_title'); submessage = t('ova.notebooklab.result_perfect_desc'); }
    else if (percentage >= 70) { message = t('ova.notebooklab.result_good_title'); submessage = t('ova.notebooklab.result_good_desc'); }
    else { message = t('ova.notebooklab.result_bad_title'); submessage = t('ova.notebooklab.result_bad_desc'); }
    return (
      <div className="w-full relative" style={{ minHeight: '400px' }}>
        <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] bg-[length:50px_50px]" /><div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(47,168,198,0.15)_0%,rgba(255,255,255,0)_70%)]" /><div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(30,58,95,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="w-full flex items-center justify-center py-12 px-4 relative z-10">
          <div className="w-full max-w-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-8 md:p-16 rounded-3xl animate-[fadeIn_0.6s_ease-out_forwards] text-center border-t-4 border-t-[#1E3A5F]">
            <div className="mb-6 flex justify-center"><EdutechLogo size="small" /></div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] uppercase tracking-[0.15em] border border-emerald-200 dark:border-emerald-700 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 4.5 7.5c-1.5.5-1.5 2.5 0 3.5"/><path d="M10 17.5V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2"/><path d="M20 12.5V19a1 1 0 0 1-1 1h-2"/><path d="M18 4a2 2 0 0 1 2 2"/><path d="M10 4.5V12"/><path d="M2 10.5V12"/><path d="M2 17a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2"/><path d="M20 8.5V12"/></svg>
              <span>{t('ova.notebooklab.completed_label')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#1E3A5F] dark:text-slate-100 font-montserrat">{t('ova.notebooklab.results_title')}</h2>
            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] my-8 drop-shadow-sm">{score}<span className="text-4xl text-gray-400 dark:text-slate-400">/7</span></div>
            <h3 className="text-2xl font-semibold text-[#2FA8C6] mb-4">{message}</h3>
            <p className="text-[#1E3A5F]/80 dark:text-slate-100/80 mb-6 text-lg">{submessage}</p>
            <div className="flex justify-center mb-4"><VoiceReader text={submessage} /></div>
            {score >= 3 && !certCompletedRef.current && (
              <button onClick={() => { certCompletedRef.current = true; onComplete?.(); }}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto mb-3 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t('ova.notebooklab.mark_complete')}
              </button>
            )}
            <button onClick={startGame} className="px-8 py-3 rounded-xl bg-white dark:bg-slate-800 text-[#1E3A5F] dark:text-slate-100 border-2 border-[#EAEAEA] dark:border-slate-600 hover:border-[#2FA8C6] hover:text-[#2FA8C6] dark:hover:text-[#2FA8C6] transition-all font-semibold flex items-center justify-center gap-2 mx-auto shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {t('ova.notebooklab.restart')}
            </button>
          </div>
        </div>
        
      </div>
    );
  }

  if (gameState === 'content') {
    const screen = contentScreens[contentIdx];
    const isFirst = contentIdx === 0;
    const isLast = contentIdx === contentScreens.length - 1;
    return (
      <div className="w-full relative" style={{ minHeight: '400px' }}>
        <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] bg-[length:50px_50px]" /><div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(47,168,198,0.15)_0%,rgba(255,255,255,0)_70%)]" /><div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(30,58,95,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="w-full py-6 px-4 relative z-10">
          <div className="w-full max-w-5xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]" key={screen.id}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <EdutechLogo size="small" />
              <div className="flex items-center gap-3">
                <span className="text-[#1E3A5F] dark:text-slate-100 font-semibold bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full border border-[#EAEAEA] dark:border-slate-600 shadow-sm text-sm">
                  {contentIdx + 1} / {contentScreens.length}
                </span>
              </div>
            </div>
            <div className="w-full bg-[#EAEAEA] dark:bg-slate-700 rounded-full h-2.5 mb-8 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${((1 + contentIdx) / totalSteps) * 100}%` }} />
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/5 flex flex-col gap-6">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#EAEAEA] dark:border-slate-600 h-64 lg:h-auto lg:flex-grow bg-white dark:bg-slate-800">
                  <img src={screen.image} alt={screen.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm font-semibold bg-[#2FA8C6]/90 w-fit px-4 py-1.5 rounded-lg backdrop-blur-md shadow-lg border border-white/20">
                      <NetworkIcon /> {t('ova.notebooklab.learning_badge')}
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#EAEAEA] dark:border-slate-600 shadow-sm">
                  <VoiceReader text={screen.valerioText} />
                </div>
              </div>
              <div className="w-full lg:w-3/5 max-h-[600px] overflow-y-auto">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-6 md:p-10 rounded-3xl flex flex-col border-t-4 border-t-[#2FA8C6]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F7FA] dark:bg-teal-900/30 text-[#004B63] dark:text-teal-200 font-semibold text-[9px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20 w-fit mb-4">
                    <BrainIcon className="w-3 h-3" /><span>{screen.subtitle}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1E3A5F] dark:text-slate-100 mb-4 font-montserrat">{screen.title}</h2>
                  <p className="text-[#1E3A5F]/80 dark:text-slate-100/80 text-sm leading-relaxed mb-6">{screen.valerioText}</p>

                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-[#1E3A5F] dark:text-slate-100 uppercase tracking-wider mb-3">{t('ova.notebooklab.objectives_title')}</h3>
                    <div className="space-y-2">
                      {screen.achievements.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#E8F8F5] dark:bg-emerald-900/30 border border-[#22c55e]/20">
                          <CheckIcon />
                          <span className="text-xs font-medium text-[#166534] dark:text-emerald-300 leading-relaxed">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-[#1E3A5F] dark:text-slate-100 uppercase tracking-wider mb-3">{t('ova.notebooklab.warnings_title')}</h3>
                    <div className="space-y-2">
                      {screen.warnings.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FDEDEC] dark:bg-red-900/30 border border-[#ef4444]/20">
                          <CrossIcon />
                          <span className="text-xs font-medium text-[#991b1b] dark:text-red-300 leading-relaxed">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#1E3A5F] dark:text-slate-100 uppercase tracking-wider mb-3">{t('ova.notebooklab.example_title')}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span className="text-xs font-medium text-red-700 dark:text-red-300 leading-relaxed">{screen.example.weak}</span>
                      </div>
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#E8F8F5] dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-xs font-medium text-[#166534] dark:text-emerald-300 leading-relaxed">{screen.example.strong}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8 px-2">
              <button onClick={prevContent} disabled={isFirst}
                className="p-3 bg-white dark:bg-slate-800 border border-[#EAEAEA] dark:border-slate-600 text-[#1E3A5F] dark:text-slate-100 rounded-xl disabled:opacity-30 hover:border-[#2FA8C6] transition-all disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="flex gap-2">
                {contentScreens.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === contentIdx ? 'w-8 bg-[#1E3A5F] dark:bg-slate-100' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />
                ))}
              </div>
              <button onClick={nextContent}
                className="px-6 py-3 bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2">
                {isLast ? t('ova.notebooklab.start_quiz') : t('ova.notebooklab.next')} <ArrowRight />
              </button>
            </div>
            <footer className="mt-8 pt-6 border-t border-[#EAEAEA] dark:border-slate-600 text-center">
              <p className="text-slate-600 dark:text-slate-300 text-xs">{t('ova.notebooklab.footer')}</p>
            </footer>
          </div>
        </div>
        
      </div>
    );
  }

  const currentQ = questionsData[currentQIndex];
  return (
    <div className="w-full relative" style={{ minHeight: '400px' }}>
      <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] bg-[length:50px_50px]" /><div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(47,168,198,0.15)_0%,rgba(255,255,255,0)_70%)]" /><div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(30,58,95,0.08)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="w-full py-6 px-4 relative z-10" key={currentQ.id}>
        <div className="w-full max-w-6xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <EdutechLogo size="small" />
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E0F7FA] dark:bg-teal-900/30 text-[#004B63] dark:text-teal-200 font-semibold text-[10px] uppercase tracking-[0.15em] border border-[#2FA8C6]/20">
                <BrainIcon className="w-3.5 h-3.5" /><span>{t('ova.notebooklab.lab_title')}</span>
              </div>
              <span className="text-[#1E3A5F] dark:text-slate-100 font-semibold bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full border border-[#EAEAEA] dark:border-slate-600 shadow-sm text-sm">
                {t('ova.notebooklab.node_label', { current: currentQIndex + 1, total: questionsData.length })}
              </span>
              <span className="text-white font-semibold bg-[#2FA8C6] px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(47,168,198,0.4)] text-sm">
                {t('ova.notebooklab.score_label')} {score}
              </span>
            </div>
          </div>
          <div className="w-full bg-[#EAEAEA] dark:bg-slate-700 rounded-full h-2.5 mb-8 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-[#2FA8C6] to-[#1E3A5F] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((1 + contentScreens.length + currentQIndex) / totalSteps) * 100}%` }} />
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/5 flex flex-col gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#EAEAEA] dark:border-slate-600 group h-64 lg:h-auto lg:flex-grow bg-white dark:bg-slate-800">
                <img src={currentQ.image} alt={t('ova.notebooklab.image_alt')} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white text-sm font-semibold bg-[#2FA8C6]/90 w-fit px-4 py-1.5 rounded-lg backdrop-blur-md shadow-lg border border-white/20">
                    <NetworkIcon /> {t('ova.notebooklab.scenario_badge')}
                  </div>
                </div>
              </div>
              {isAnswered && (
                <div className={`p-6 rounded-2xl border animate-[fadeIn_0.6s_ease-out_forwards] shadow-sm ${selectedOption === currentQ.correct ? 'bg-[#E8F8F5] dark:bg-emerald-900/30 border-[#22c55e]/40' : 'bg-[#FDEDEC] dark:bg-red-900/30 border-[#ef4444]/40'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {selectedOption === currentQ.correct ? (
                      <span className="flex items-center gap-2 text-[#166534] font-bold text-lg"><CheckCircle /> {t('ova.notebooklab.correct_label')}</span>
                    ) : (
                      <span className="flex items-center gap-2 text-[#991b1b] font-bold text-lg"><XCircle /> {t('ova.notebooklab.incorrect_label')}</span>
                    )}
                  </div>
                  <p className="text-[#1E3A5F] dark:text-slate-100 text-sm leading-relaxed font-medium opacity-90">{currentQ.explanation}</p>
                  <div className="mt-4 pt-4 border-t border-white/40"><VoiceReader text={currentQ.explanation} /></div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-3/5">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-[#2FA8C6]/15 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-6 md:p-10 rounded-3xl h-full flex flex-col border-t-4 border-t-[#2FA8C6]">
                <h2 className="text-xl md:text-2xl font-semibold text-[#1E3A5F] dark:text-slate-100 mb-8 leading-relaxed font-montserrat">{currentQ.question}</h2>
                <div className="space-y-4 flex-grow">
                  {currentQ.options.map((option, index) => {
                    let btnClass = "bg-white/95 dark:bg-slate-800/95 border border-[#EAEAEA] dark:border-slate-600 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 enabled:hover:border-[#2FA8C6] enabled:hover:shadow-[0_8px_25px_rgba(47,168,198,0.15)] enabled:hover:-translate-y-0.5 w-full text-left p-4 md:p-5 rounded-2xl flex items-start gap-4 ";
                    let iconClass = "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors ";
                    let textClass = "text-base md:text-lg font-medium transition-colors ";
                    if (!isAnswered) { btnClass += "cursor-pointer"; iconClass += "bg-[#EAEAEA] dark:bg-slate-600 text-[#1E3A5F] dark:text-slate-100"; textClass += "text-[#1E3A5F]/80 dark:text-slate-100/80"; }
                    else if (index === currentQ.correct) { btnClass += "bg-[#E8F8F5] dark:bg-emerald-900/30 !border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.15)]"; iconClass += "bg-[#22c55e] text-white"; textClass += "text-[#166534] dark:text-emerald-300"; }
                    else if (index === selectedOption) { btnClass += "bg-[#FDEDEC] dark:bg-red-900/30 !border-[#ef4444]"; iconClass += "bg-[#ef4444] text-white"; textClass += "text-[#991b1b] dark:text-red-300"; }
                    else { btnClass += "opacity-50 cursor-not-allowed bg-white dark:bg-slate-800"; iconClass += "bg-[#EAEAEA] dark:bg-slate-600 text-[#1E3A5F]/50 dark:text-slate-100/50"; textClass += "text-[#1E3A5F]/50 dark:text-slate-100/50"; }
                    return (
                      <button key={index} onClick={() => handleOptionClick(index)} disabled={isAnswered} className={btnClass}>
                        <div className={iconClass}>{['A', 'B', 'C', 'D'][index]}</div>
                        <span className={textClass}>{option}</span>
                      </button>
                    );
                  })}
                </div>
                {!isAnswered && (
                  <div className="mt-6 flex flex-col items-start gap-3 animate-[fadeIn_0.6s_ease-out_forwards]">
                    <button onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#EAEAEA]/40 dark:bg-slate-700/40 hover:bg-[#EAEAEA] dark:hover:bg-slate-700 border border-[#2FA8C6]/30 rounded-xl text-[#1E3A5F] dark:text-slate-100 font-semibold text-sm transition-all duration-300">
                      <LightbulbIcon />{showHint ? t('ova.notebooklab.hide_hint') : t('ova.notebooklab.show_hint')}
                    </button>
                    {showHint && (
                      <div className="w-full p-4 bg-[#E8F8F5] dark:bg-emerald-900/30 border border-[#2FA8C6]/50 rounded-xl text-[#1E3A5F] dark:text-slate-100 text-sm md:text-base font-medium animate-[fadeIn_0.6s_ease-out_forwards] shadow-inner">
                        <span className="text-[#2FA8C6] font-bold mr-2">{t('ova.notebooklab.hint_prefix')}</span> {currentQ.hint}
                      </div>
                    )}
                  </div>
                )}
                {isAnswered && (
                  <div className="mt-8 flex justify-end animate-[fadeIn_0.6s_ease-out_forwards]">
                    <button onClick={nextQuestion}
                      className="px-8 py-3.5 bg-[#1E3A5F] hover:bg-[#2FA8C6] text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-[0_8px_20px_rgba(47,168,198,0.4)] hover:-translate-y-1">
                      {currentQIndex === questionsData.length - 1 ? t('ova.notebooklab.process_results') : t('ova.notebooklab.next_node')} <ArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <footer className="mt-8 pt-6 border-t border-[#EAEAEA] dark:border-slate-600 text-center">
            <p className="text-slate-600 dark:text-slate-300 text-xs">{t('ova.notebooklab.footer')}</p>
          </footer>
        </div>
      </div>
      
    </div>
  );
}
