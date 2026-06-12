import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import { OVAIntro, OVAValerioBar } from './shared';
import SectionErrorBoundary from './SectionErrorBoundary';
import { FOCUS_RING } from './constants/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, ChevronRight, 
  ChevronLeft, Award, Play, BookOpen, Brain, Star, FileText, 
  Lightbulb, AlertTriangle, Link as LinkIcon 
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';
import { MODULE_DATA, FINAL_CHALLENGE } from '../../data/ova/podcastGuide';
import { useTranslation } from '../../i18n/I18nProvider';


OVANotebookPodcastGuide.propTypes = {
  onComplete: PropTypes.func,
};

export default function OVANotebookPodcastGuide({ onComplete }) {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState('intro');
  const certCompletedRef = useRef(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [score, setScore] = useState(0);
  const [activityState, setActivityState] = useState(null);
  const [challengeAnswers, setChallengeAnswers] = useState([]);

  const totalSlides = MODULE_DATA.reduce((acc, mod) => acc + mod.content.length, 0);
  const currentTotalProgress = Math.min(100, (MODULE_DATA.slice(0, currentModuleIndex).reduce((acc, mod) => acc + mod.content.length, 0) + currentSlide) / totalSlides * 100);

  useEffect(() => {
    stopSpeech();
  }, [currentSlide, currentModuleIndex, currentScreen]);

  useEffect(() => {
    if (currentScreen === 'certificate' && score >= 100 && !certCompletedRef.current) {
      certCompletedRef.current = true;
      onComplete?.();
    }
  }, [currentScreen, score, onComplete]);

  const EdutechLogo = () => (
    <div className="flex items-center gap-2 select-none">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-corporate to-petroleum rounded-xl rotate-3 shadow-md"></div>
        <Brain className="w-5 h-5 text-white relative z-10" />
      </div>
      <div className="text-xl tracking-tighter flex items-center lowercase font-bold">
        <span className="text-petroleum">edu</span><span className="text-corporate">techlife</span>
      </div>
    </div>
  );

  const getValerioText = () => {
    if (currentScreen === 'modules') {
      const module = MODULE_DATA[currentModuleIndex];
      const slide = module.content[currentSlide];
      let text = `${slide.title}. `;
      if (slide.text) text += `${slide.text}. `;
      if (slide.items) {
        if (typeof slide.items[0] === 'string') text += slide.items.join(". ");
        else slide.items.forEach(item => text += `${item.title || item.name}: ${item.desc || item.nb}. `);
      }
      return text;
    }
    if (currentScreen === 'challenge') {
      const question = FINAL_CHALLENGE[currentSlide];
      return `${t('ova.podcastguide.challenge_title')}. ${question.question}`;
    }
    if (currentScreen === 'certificate') {
      return t('ova.podcastguide.cert_voice');
    }
    return '';
  };

  if (currentScreen === 'intro') {
    return (
      <SectionErrorBoundary name="OVAPodcastGuide-intro">
        <OVAIntro
          icon="fa-brain"
          badge={t('ova.podcastguide.badge')}
          title={t('ova.podcastguide.welcome_title')}
          description={t('ova.podcastguide.welcome_desc')}
          audioText={t('ova.podcastguide.welcome_voice')}
          onStart={() => setCurrentScreen('modules')}
          startLabel={t('ova.podcastguide.start_cta')}
        />
      </SectionErrorBoundary>
    );
  }

  if (currentScreen === 'modules') {
    const module = MODULE_DATA[currentModuleIndex];
    const slide = module.content[currentSlide];
    let textToRead = `${slide.title}. `;
    if (slide.text) textToRead += `${slide.text}. `;
    if (slide.items) {
      if (typeof slide.items[0] === 'string') textToRead += slide.items.join(". ");
      else slide.items.forEach(item => textToRead += `${item.title || item.name}: ${item.desc || item.nb}. `);
    }

    return (
      <SectionErrorBoundary name="OVAPodcastGuide-modules">
      <div className="w-full bg-slate-50 dark:bg-slate-800 font-sans flex flex-col relative" style={{ minHeight: '400px' }}>
        <div className="fixed inset-0 -z-10 opacity-60 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[length:50px_50px]" /><div className="fixed -top-[15%] -left-[10%] w-[50vw] h-[50vw] -z-10 bg-[radial-gradient(circle,rgba(0,188,212,0.15)_0%,rgba(255,255,255,0)_70%)]" /><div className="fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] -z-10 bg-[radial-gradient(circle,rgba(10,53,80,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-20 border-b border-gray-100 dark:border-slate-700">
          <EdutechLogo />
          <div className="flex-1 w-full md:w-auto mx-0 md:mx-8 order-last md:order-none">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 font-bold mb-1"><span>{t('ova.podcastguide.progress_label')}</span><span>{Math.round(currentTotalProgress)}%</span></div>
            <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-corporate to-petroleum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: `${currentTotalProgress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold"><Star className="w-5 h-5 fill-current" /> {score} {t('ova.podcastguide.score_label')}</div>

          </div>
        </header>
        <div className="flex flex-1 flex-col md:flex-row">
          <aside className="w-full md:w-64 bg-white/90 dark:bg-slate-800/90 border-r border-gray-200 dark:border-slate-600 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-4">{t('ova.podcastguide.modules_label')}</h3>
              <div className="space-y-2">
                {MODULE_DATA.map((mod, idx) => (
                  <button key={mod.id} onClick={() => { setCurrentModuleIndex(idx); setCurrentSlide(0); setActivityState(null); }}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2 transition-colors cursor-pointer ${currentModuleIndex === idx ? 'bg-corporate text-white shadow-md' : idx < currentModuleIndex ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'text-gray-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-corporate'}`}>
                    {idx < currentModuleIndex ? <CheckCircle className="w-5 h-5" /> : mod.icon}<span className="font-medium text-sm">{mod.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
            <AnimatePresence mode="wait">
              <motion.div key={`${currentModuleIndex}-${currentSlide}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-10 min-h-[60vh] flex flex-col">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-petroleum font-semibold text-[9px] uppercase tracking-[0.15em] border border-corporate/20 w-fit mb-6">
                  {t('ova.podcastguide.module_badge', { current: currentModuleIndex + 1, total: MODULE_DATA.length })}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-petroleum dark:text-slate-100 mb-6 font-montserrat">{slide.title}</h2>
                <div className="flex-1">
                  {slide.type === 'text' && <p className="text-base text-gray-600 dark:text-slate-300 leading-relaxed">{slide.text}</p>}
                  {slide.type === 'comparison' && (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-50 dark:bg-slate-700/30 text-petroleum dark:text-slate-100"><th className="p-4 border-b-2">{t('ova.podcastguide.comparison_feature')}</th><th className="p-4 border-b-2 text-corporate">{t('ova.podcastguide.comparison_nb')}</th><th className="p-4 border-b-2">{t('ova.podcastguide.comparison_gpt')}</th></tr></thead>
                        <tbody>{slide.items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30"><td className="p-4 font-semibold text-gray-700 dark:text-slate-200">{item.name}</td><td className="p-4 text-green-600 bg-green-50/30 dark:bg-green-900/20">{item.nb}</td><td className="p-4 text-gray-500 dark:text-slate-400">{item.gpt}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  )}
                  {slide.type === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {slide.items.map((item, i) => (
                        <div key={i} className="p-6 border-2 border-gray-100 dark:border-slate-700 rounded-xl hover:border-corporate transition-all bg-white dark:bg-slate-800 hover:shadow-lg flex items-start gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">{item.icon}</div>
                          <div><h4 className="font-bold text-petroleum dark:text-slate-100 text-lg mb-1">{item.title}</h4><p className="text-gray-500 dark:text-slate-400 text-sm">{item.desc}</p></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {slide.type === 'steps' && (
                    <div className="space-y-4 mt-4">
                      {slide.items.map((step, i) => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} key={i}
                          className="flex items-center gap-4 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                          <div className="w-10 h-10 bg-corporate text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">{i + 1}</div>
                          <p className="text-gray-700 dark:text-slate-200 font-medium">{step.substring(3)}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {slide.type === 'activity' && (
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 mt-4">
                      <p className="text-lg text-petroleum dark:text-slate-100 font-medium mb-6">{slide.text}</p>
                      <div className="space-y-3">
                        {slide.options.map((opt, i) => (
                          <button key={i} onClick={() => { if (opt.correct) { setActivityState('correct'); if (activityState !== 'correct') setScore(s => s + 20); } else setActivityState('incorrect'); }}
                            className={`w-full p-4 text-left rounded-lg border-2 ${FOCUS_RING} font-medium flex items-center justify-between ${activityState === 'correct' && opt.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''} ${activityState === 'incorrect' && !opt.correct ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''} ${!activityState ? 'border-gray-200 dark:border-slate-600 hover:border-corporate hover:bg-white dark:hover:bg-slate-800 bg-white dark:bg-slate-800' : ''}`}>
                            <span>{opt.text}</span>
                            {activityState === 'correct' && opt.correct && <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />}
                            {activityState === 'incorrect' && !opt.correct && <XCircle className="text-red-500 w-6 h-6 shrink-0" />}
                          </button>
                        ))}
                      </div>
                      {activityState && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-4 rounded-lg font-medium flex items-start gap-3 ${activityState === 'correct' ? 'bg-green-100 dark:bg-green-900/30 text-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-800'}`}>
                          {activityState === 'correct' ? <CheckCircle className="w-6 h-6 mt-0.5 shrink-0"/> : <AlertTriangle className="w-6 h-6 mt-0.5 shrink-0"/>}
                          <p>{slide.options.find(o => activityState === 'correct' ? o.correct : !o.correct)?.feedback}</p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100 dark:border-slate-700">
                  <button disabled={currentSlide === 0} onClick={() => { setActivityState(null); setCurrentSlide(s => s - 1); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${FOCUS_RING} ${currentSlide === 0 ? 'opacity-0 cursor-default' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'}`}><ChevronLeft className="w-5 h-5" /> {t('ova.podcastguide.prev_btn')}</button>
                  <div className="flex gap-2">{module.content.map((_, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-corporate' : 'bg-gray-200 dark:bg-slate-600'}`} />))}</div>
                  {slide.type !== 'activity' ? (
                    <button onClick={() => { setActivityState(null); setCurrentSlide(s => s + 1); }}
                      className={`flex items-center gap-2 px-6 py-3 bg-petroleum hover:bg-petroleum-dark text-white rounded-xl font-bold shadow-md ${FOCUS_RING}`}>{t('ova.podcastguide.next_btn')} <ChevronRight className="w-5 h-5" /></button>
                  ) : (
                    <button disabled={activityState !== 'correct'} onClick={() => {
                      if (currentModuleIndex < MODULE_DATA.length - 1) { setCurrentModuleIndex(i => i + 1); setCurrentSlide(0); setActivityState(null); }
                      else setCurrentScreen('challenge'); }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md ${FOCUS_RING} ${activityState === 'correct' ? 'bg-corporate hover:bg-corporate-dark text-white animate-pulse' : 'bg-gray-200 dark:bg-slate-600 text-gray-400 dark:text-slate-400 cursor-not-allowed'}`}>
                      {currentModuleIndex < MODULE_DATA.length - 1 ? t('ova.podcastguide.next_module') : t('ova.podcastguide.final_challenge')} <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <OVAValerioBar text={getValerioText()} />
      </div>
    </SectionErrorBoundary>
    );
  }

  if (currentScreen === 'challenge') {
    const question = FINAL_CHALLENGE[currentSlide];
    return (
      <SectionErrorBoundary name="OVAPodcastGuide-challenge">
      <div className="w-full relative min-h-[500px]" style={{ background: '#004B63' }}>
        <div className="w-full min-h-screen p-4 md:p-8 flex items-center justify-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-petroleum dark:text-slate-100 font-montserrat">{t('ova.podcastguide.challenge_title')}</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">{t('ova.podcastguide.challenge_question', { current: currentSlide + 1, total: FINAL_CHALLENGE.length })}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-200 dark:border-slate-600 mb-8">
              <p className="text-lg text-gray-800 dark:text-slate-200 font-medium leading-relaxed">{question.question}</p>
            </div>
            <div className="space-y-4 mb-8">
              {question.options.map((opt, i) => (
                <button key={i} disabled={activityState !== null} onClick={() => { if (opt.correct) { setActivityState('correct'); setScore(s => s + 50); } else setActivityState('incorrect'); }}
                  className={`w-full p-5 text-left rounded-xl border-2 ${FOCUS_RING} font-medium flex items-center justify-between ${activityState === 'correct' && opt.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''} ${activityState === 'incorrect' && !opt.correct ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''} ${!activityState ? 'border-gray-200 dark:border-slate-600 hover:border-corporate hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-slate-800' : ''} ${activityState !== null && opt.correct && activityState === 'incorrect' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <span>{opt.text}</span>
                  {activityState !== null && opt.correct && <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />}
                  {activityState === 'incorrect' && !opt.correct && <XCircle className="text-red-500 w-6 h-6 shrink-0" />}
                </button>
              ))}
            </div>
            {activityState && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-corporate rounded-r-xl">
                <p className="text-petroleum dark:text-slate-100 font-bold mb-1">{t('ova.podcastguide.challenge_analysis')}</p>
                <p className="text-gray-700 dark:text-slate-200">{question.feedback}</p>
              </motion.div>
            )}
            <div className="flex justify-end">
              <button disabled={!activityState} onClick={() => { if (currentSlide < FINAL_CHALLENGE.length - 1) { setCurrentSlide(s => s + 1); setActivityState(null); } else setCurrentScreen('certificate'); }}
                className={`px-8 py-4 rounded-xl font-bold ${FOCUS_RING} shadow-lg text-lg flex items-center gap-2 ${activityState ? 'bg-gradient-to-r from-corporate to-petroleum text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-400 dark:text-slate-400 cursor-not-allowed'}`}>
                {currentSlide < FINAL_CHALLENGE.length - 1 ? t('ova.podcastguide.challenge_next') : t('ova.podcastguide.challenge_results')} <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
        <OVAValerioBar text={getValerioText()} />
      </div>
    </SectionErrorBoundary>
    );
  }

  if (currentScreen === 'certificate') {

    return (
      <SectionErrorBoundary name="OVAPodcastGuide-certificate">
      <div className="w-full relative min-h-[500px]" style={{ background: 'linear-gradient(135deg, #004B63, #0D1B2A)' }}>
        <div className="w-full min-h-screen p-4 md:p-8 flex items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}
            className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-corporate to-petroleum"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white dark:border-slate-700">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-petroleum dark:text-slate-100 mb-2 font-montserrat">{t('ova.podcastguide.cert_title')}</h2>
            <p className="text-xl text-gray-500 dark:text-slate-400 mb-8">{t('ova.podcastguide.cert_subtitle')}</p>
            <div className="bg-gray-50 dark:bg-slate-700/30 rounded-2xl p-8 mb-8 border border-gray-100 dark:border-slate-700">
              <p className="text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">{t('ova.podcastguide.cert_score_label')}</p>
              <p className="text-6xl font-black text-corporate mb-4">{score}</p>
              <p className="text-gray-600 dark:text-slate-300">{t('ova.podcastguide.cert_message')}</p>
            </div>
            <button onClick={() => { setCurrentScreen('intro'); setCurrentModuleIndex(0); setCurrentSlide(0); setScore(0); }}
              className={`mt-4 bg-gradient-to-r from-corporate to-petroleum text-white px-8 py-4 rounded-xl font-bold shadow-lg ${FOCUS_RING} hover:shadow-xl`}>
              {t('ova.podcastguide.cert_reset')}
            </button>
          </motion.div>
        </div>
        <OVAValerioBar text={getValerioText()} />
      </div>
    </SectionErrorBoundary>
    );
  }

  return null;
}
