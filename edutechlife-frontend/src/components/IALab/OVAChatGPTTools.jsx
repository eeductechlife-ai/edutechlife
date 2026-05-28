import React, { useState, useRef } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import VoiceReader from './VoiceReader';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Code, Image as ImageIcon, Layout, Cpu, Lightbulb, Play,
  CheckCircle2, AlertCircle, ChevronRight, ChevronLeft,
  X, Trophy, Award, RefreshCcw, BookOpen, Target, Zap, Bot, GraduationCap
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';
import { tools, quizScenarios } from '../../data/ova/chatGPTTools';

const iconMap = { Globe, Code, ImageIcon, Layout, Cpu };

const ToolIcon = ({ icon, iconColor, className }) => {
  const Icon = iconMap[icon];
  if (!Icon) return null;
  return <Icon className={`${className || 'w-10 h-10'} ${iconColor || 'text-blue-500'}`} />;
};

const WelcomeScreen = ({ onNext }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-[fadeIn_0.8s_ease-out_forwards] px-4 py-8 bg-white dark:bg-slate-800">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-[#13374b] dark:text-slate-100 font-semibold text-sm mb-4">
        <Bot size={16} className="text-[#259eb5]" /><span>{t('ova.chatgpttools.lab_badge')}</span>
      </div>
      <div className="w-16 h-16 bg-gradient-to-br from-[#259eb5] to-[#13374b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20 mb-6">
        <Zap className="text-white w-8 h-8" />
      </div>
      <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-tight text-[#13374b] dark:text-slate-100">{t('ova.chatgpttools.welcome_title')}</h1>
      <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light mb-2">{t('ova.chatgpttools.welcome_subtitle')}</p>
      <p className="text-slate-600 dark:text-slate-400 max-w-xl mb-4">{t('ova.chatgpttools.welcome_desc')}</p>
      <VoiceReader text={t('ova.chatgpttools.welcome_voice')} />
      <button onClick={onNext} className="mt-4 px-8 py-4 bg-gradient-to-r from-[#259eb5] to-[#13374b] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3"><Play size={20} />{t('ova.chatgpttools.start_btn')}</button>
    </div>
  );
};

export default function OVAChatGPTTools({ onComplete }) {
  const { t } = useTranslation();
  const certCompletedRef = useRef(false);
  const [screen, setScreen] = useState('welcome');
  const [activeModal, setActiveModal] = useState(null);
  const [viewedTools, setViewedTools] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const progress = Math.round((viewedTools.length / tools.length) * 100);

  if (screen === 'welcome') return <WelcomeScreen onNext={() => setScreen('dashboard')} />;

  const openTool = (idx) => { setActiveModal(idx); if (!viewedTools.includes(idx)) setViewedTools([...viewedTools, idx]); };

  const handleQuizAnswer = (idx) => {
    if (feedback) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === quizScenarios[quizStep].correct;
    if (isCorrect) setScore(score + 1);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const nextQuestion = () => {
    if (quizStep < quizScenarios.length - 1) { setQuizStep(quizStep + 1); setFeedback(null); setSelectedAnswer(null); }
    else setQuizFinished(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8">
      <nav className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#259eb5] rounded-xl flex items-center justify-center shadow-lg shadow-[#259eb5]/20"><Zap className="text-white w-6 h-6" /></div>
          <span className="text-3xl font-black tracking-tight"><span className="text-[#259eb5]">Edu</span><span className="text-[#13374b] dark:text-slate-100">techlife</span></span>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/30 px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm">
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{t('ova.chatgpttools.nav_ecosystem')}</span>
          <div className="h-4 w-[2px] bg-slate-200 dark:bg-slate-600"></div>
          <span className="text-sm font-bold text-[#259eb5]">{t('ova.chatgpttools.nav_module')}</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-[#13374b] text-white p-6 md:p-8 rounded-[2rem] shadow-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><BookOpen size={140} /></div>
                <div className="relative z-10">
                  <h1 className="text-2xl md:text-4xl font-black mb-3">{t('ova.chatgpttools.dashboard_title')}</h1>
                  <p className="text-slate-300 text-base mb-6 max-w-xl">{t('ova.chatgpttools.dashboard_desc')}</p>
                  <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md inline-block min-w-[240px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{t('ova.chatgpttools.progress_label')}</span>
                      <span className="text-xl font-black">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <motion.div className="bg-cyan-400 h-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool, idx) => (
                  <motion.button key={tool.id} whileHover={{ y: -6 }} onClick={() => openTool(idx)}
                    className={`group relative text-left bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-xl ${viewedTools.includes(idx) ? 'border-emerald-200 dark:border-emerald-400' : 'border-slate-100 dark:border-slate-600 hover:border-[#259eb5]'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/30 transition-colors">
                        <ToolIcon icon={tool.icon} iconColor={tool.iconColor} className="w-10 h-10" />
                      </div>
                      {viewedTools.includes(idx) && <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full border border-emerald-200 dark:border-emerald-700"><CheckCircle2 size={16} /></div>}
                    </div>
                    <h3 className="text-xl font-black text-[#13374b] dark:text-slate-100 mb-2 group-hover:text-[#259eb5] transition-colors">{tool.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{tool.desc}</p>
                    <div className="flex items-center gap-1.5 text-[#259eb5] font-black text-[11px] uppercase tracking-widest">{t('ova.chatgpttools.explore_btn')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
                  </motion.button>
                ))}

                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowQuiz(true)}
                  className="lg:col-span-1 md:col-span-2 bg-gradient-to-br from-[#259eb5] to-[#13374b] p-6 rounded-2xl shadow-xl text-white group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10 transform group-hover:scale-125 transition-transform"><Trophy size={120} /></div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="bg-white/20 w-fit p-3 rounded-xl mb-4 backdrop-blur-md"><Target size={24} /></div>
                      <h3 className="text-2xl font-black mb-2">{t('ova.chatgpttools.challenge_title')}</h3>
                      <p className="text-slate-200 text-sm leading-relaxed mb-6">{t('ova.chatgpttools.challenge_desc')}</p>
                    </div>
                    <div className="bg-white text-[#13374b] dark:text-slate-100 font-black py-3 px-6 rounded-xl inline-flex items-center justify-center gap-2 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/30 transition-colors text-sm">{t('ova.chatgpttools.challenge_start')} <Play size={16} /></div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-3xl mx-auto">
              {!quizFinished ? (
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50 dark:border-slate-700">
                    <button onClick={() => { setShowQuiz(false); stopSpeech(); }} className="text-slate-600 dark:text-slate-300 hover:text-[#13374b] dark:hover:text-slate-100 flex items-center gap-1 font-bold transition-colors text-xs"><ChevronLeft size={16} /> {t('ova.chatgpttools.quit_btn')}</button>
                    <div className="flex gap-1.5">{quizScenarios.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === quizStep ? 'w-10 bg-[#259eb5]' : i < quizStep ? 'w-6 bg-emerald-400' : 'w-4 bg-slate-100 dark:bg-slate-700'}`} />)}</div>
                  </div>
                  <h2 className="text-[10px] font-black text-[#259eb5] uppercase tracking-widest mb-3">{t('ova.chatgpttools.case_label', { num: quizStep + 1 })}</h2>
                  <p className="text-xl md:text-2xl font-black text-[#13374b] dark:text-slate-100 mb-6 leading-tight">{quizScenarios[quizStep].question}</p>
                  <div className="space-y-3">
                    {quizScenarios[quizStep].options.map((opt, i) => {
                      const isCorrect = i === quizScenarios[quizStep].correct;
                      const isSelected = selectedAnswer === i;
                      let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between text-sm ";
                      if (!feedback) btnClass += "border-slate-100 dark:border-slate-600 hover:border-[#259eb5] hover:bg-slate-50 dark:hover:bg-slate-700/30";
                      else if (isCorrect) btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                      else if (isSelected) btnClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300";
                      else btnClass += "border-slate-50 dark:border-slate-700 opacity-40";
                      return <button key={i} disabled={feedback} onClick={() => handleQuizAnswer(i)} className={btnClass}>{opt}{feedback && isCorrect && <CheckCircle2 className="text-emerald-500" />}{feedback && isSelected && !isCorrect && <X className="text-rose-500" />}</button>;
                    })}
                  </div>
                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-5 rounded-xl border-l-6 ${feedback === 'correct' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-500'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg ${feedback === 'correct' ? 'bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-800/30 text-rose-600 dark:text-rose-400'}`}>{feedback === 'correct' ? <Trophy size={20} /> : <AlertCircle size={20} />}</div>
                        <div>
                          <h4 className="font-black text-sm mb-0.5">{feedback === 'correct' ? t('ova.chatgpttools.feedback_correct') : t('ova.chatgpttools.feedback_incorrect')}</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{quizScenarios[quizStep].explanation}</p>
                        </div>
                      </div>
                      <button onClick={nextQuestion} className="w-full mt-4 bg-[#13374b] text-white py-3 rounded-lg font-black hover:bg-[#259eb5] transition-colors shadow text-xs flex items-center justify-center gap-2">{quizStep < quizScenarios.length - 1 ? t('ova.chatgpttools.next_btn') : t('ova.chatgpttools.results_btn')} <ChevronRight size={16} /></button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl text-center border border-slate-100 dark:border-slate-600">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-cyan-50 dark:bg-cyan-900/20 rounded-full mb-6 relative">
                    <Trophy className="text-[#259eb5] w-12 h-12" />
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-white dark:border-slate-800 shadow">{score}</div>
                  </div>
                  <h2 className="text-2xl font-black text-[#13374b] dark:text-slate-100 mb-3">{t('ova.chatgpttools.report_title')}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{t('ova.chatgpttools.report_score', { score, total: quizScenarios.length })}</p>
                  <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl mb-6 text-left">
                    <h3 className="font-black text-[#13374b] dark:text-slate-100 mb-3 flex items-center gap-2 text-sm"><Award className="text-[#259eb5]" size={18} /> {t('ova.chatgpttools.profile_label')}</h3>
                    {score === 5 ? <p className="text-emerald-700 dark:text-emerald-300 font-bold text-sm leading-relaxed">{t('ova.chatgpttools.profile_master')}</p>
                    : score >= 3 ? <p className="text-amber-700 dark:text-amber-300 font-bold text-sm leading-relaxed">{t('ova.chatgpttools.profile_advanced')}</p>
                    : <p className="text-rose-700 dark:text-rose-300 font-bold text-sm leading-relaxed">{t('ova.chatgpttools.profile_explorer')}</p>}
                  </div>
                  {score >= 3 && !certCompletedRef.current && (
                    <button onClick={() => { certCompletedRef.current = true; onComplete?.(); }}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto mb-3 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {t('ova.chatgpttools.mark_complete')}
                    </button>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => { setQuizStep(0); setScore(0); setQuizFinished(false); setFeedback(null); setSelectedAnswer(null); setShowQuiz(false); }} className="bg-[#259eb5] text-white px-8 py-3 rounded-xl font-black shadow shadow-[#259eb5]/30 hover:bg-[#13374b] transition-colors text-sm flex items-center justify-center gap-2"><RefreshCcw size={16} /> {t('ova.chatgpttools.restart_btn')}</button>
                    <button onClick={() => setShowQuiz(false)} className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-xl font-black hover:border-[#13374b] dark:hover:border-slate-100 transition-colors text-sm">{t('ova.chatgpttools.back_btn')}</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeModal !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#13374b]/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85dvh] overflow-y-auto rounded-[2rem] shadow-2xl relative">
              <button onClick={() => { setActiveModal(null); stopSpeech(); }} className="sticky top-4 right-4 float-right z-10 p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-500 dark:text-slate-400 hover:text-rose-500 rounded-full transition-all shadow-sm"><X size={20} /></button>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-600">
                      <ToolIcon icon={tools[activeModal].icon} iconColor={tools[activeModal].iconColor} className="w-10 h-10" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-[#13374b] dark:text-slate-100">{tools[activeModal].title}</h1>
                      <div className="flex items-center gap-1.5 text-[#259eb5] font-black uppercase tracking-widest text-[10px] mt-0.5"><Zap size={12} /> {t('ova.chatgpttools.modal_ecosystem')}</div>
                    </div>
                  </div>
                  <VoiceReader text={tools[activeModal].audio} />
                </div>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">{tools[activeModal].desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                    <h3 className="flex items-center gap-1.5 font-black text-emerald-800 dark:text-emerald-300 mb-4 uppercase tracking-widest text-[10px]"><CheckCircle2 size={14} /> {t('ova.chatgpttools.modal_when')}</h3>
                    <ul className="space-y-2">{tools[activeModal].pros.map((pro, i) => <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {pro}</li>)}</ul>
                  </div>
                  <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 dark:border-rose-800">
                    <h3 className="flex items-center gap-1.5 font-black text-rose-800 dark:text-rose-300 mb-4 uppercase tracking-widest text-[10px]"><AlertCircle size={14} /> {t('ova.chatgpttools.modal_limits')}</h3>
                    <ul className="space-y-2">{tools[activeModal].cons.map((con, i) => <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /> {con}</li>)}</ul>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl mb-6">
                  <h3 className="flex items-center gap-1.5 font-black text-[#13374b] dark:text-slate-100 mb-4 uppercase tracking-widest text-[10px]"><Lightbulb size={14} className="text-[#259eb5]" /> {t('ova.chatgpttools.modal_usecases')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {tools[activeModal].useCases.map((u, i) => <div key={i} className="bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-500 flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 text-xs"><span className="text-[#259eb5] font-black">{i+1}.</span> {u}</div>)}
                  </div>
                </div>
                <div className="bg-[#13374b] rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{t('ova.chatgpttools.modal_prompt')}</h4>
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500" /><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /></div>
                  </div>
                  <code className="text-cyan-300 block text-sm font-mono leading-relaxed bg-black/20 p-4 rounded-xl italic">"{tools[activeModal].prompt}"</code>
                  <p className="text-slate-500 text-[9px] font-medium tracking-wide mt-3">{t('ova.chatgpttools.modal_tip')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-600 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 dark:text-slate-400 text-[10px] font-bold pb-8 uppercase tracking-widest">
        <p>{t('ova.chatgpttools.footer')}</p>
      </footer>

    </div>
  );
}
