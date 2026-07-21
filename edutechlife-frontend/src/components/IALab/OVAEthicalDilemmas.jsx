import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../i18n/I18nProvider';
import { Brain, Scale, Shield, AlertTriangle, CheckCircle, XCircle, Award, BookOpen } from 'lucide-react';
import { dilemmas, accordionData } from '../../data/ova/ethicalDilemmas';
import { OVAIntro, OVAValerioBar } from './shared';


OVAEthicalDilemmas.propTypes = {
  onComplete: PropTypes.func,
};

export default function OVAEthicalDilemmas({ onComplete }) {
  const { t } = useTranslation();
  const certCompletedRef = useRef(false);
  const [screen, setScreen] = useState('intro');
  const [activeSection, setActiveSection] = useState('intro');
  const [currentDilemma, setCurrentDilemma] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);

  const totalDilemmas = dilemmas.length;
  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const allAnswered = Object.keys(answers).length === totalDilemmas;

  useEffect(() => {
    if (activeSection === 'principles' && allAnswered && !certCompletedRef.current) {
      certCompletedRef.current = true;
      onComplete?.();
    }
  }, [activeSection, allAnswered, onComplete]);

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    if (idx === dilemmas[currentDilemma].correct) {
      setAnswers(prev => ({ ...prev, [currentDilemma]: { ...prev[currentDilemma], correct: true } }));
    } else {
      setAnswers(prev => ({ ...prev, [currentDilemma]: { ...prev[currentDilemma], correct: false } }));
    }
  };

  const nextDilemma = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentDilemma < totalDilemmas - 1) {
      setCurrentDilemma(currentDilemma + 1);
    }
  };

  const prevDilemma = () => {
    if (currentDilemma > 0) {
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCurrentDilemma(currentDilemma - 1);
    }
  };

  const navItems = [
    { id: 'intro', icon: <BookOpen size={18} /> },
    { id: 'dilemmas', icon: <Scale size={18} /> },
    { id: 'principles', icon: <Shield size={18} /> },
  ];

  const getValerioText = () => {
    if (activeSection === 'intro') {
      return t('ova.ethical_dilemmas.intro_voice');
    }
    if (activeSection === 'dilemmas') {
      return `${dilemmas[currentDilemma].scenario} ${dilemmas[currentDilemma].opts.join('. ')}`;
    }
    return t('ova.ethical_dilemmas.principles_voice');
  };

  if (screen === 'intro') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center rounded-2xl">
        <OVAIntro
          icon="fa-scale-balanced"
          badge={t('ova.ethical_dilemmas.intro_badge')}
          title={t('ova.ethical_dilemmas.intro_title')}
          description={t('ova.ethical_dilemmas.intro_desc')}
          audioText={t('ova.ethical_dilemmas.intro_audio')}
          onStart={() => setScreen('slides')}
          startLabel={t('ova.ethical_dilemmas.start_btn')}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-cyan-50 to-white dark:from-gray-900 dark:to-gray-800 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden relative min-h-[500px] rounded-2xl">
      <aside className="w-full md:w-64 bg-white/90 dark:bg-slate-800/90 flex flex-col shadow-xl z-10 md:min-h-full border-r border-cyan-100 dark:border-gray-700">
        <div className="p-6 text-center border-b border-cyan-50 dark:border-gray-700">
          <div className="flex items-center gap-2 justify-center select-none">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-corporate to-petroleum rounded-xl rotate-3 shadow-md"></div>
              <Brain className="w-5 h-5 text-white relative z-10" />
            </div>
            <div className="text-xl tracking-tighter flex items-center lowercase font-bold">
              <span className="text-corporate">edu</span><span className="text-petroleum">techlife</span>
            </div>
          </div>
          <p className="text-[10px] uppercase mt-2 text-slate-600 dark:text-slate-300 font-bold tracking-[0.2em]">{t('ova.ethical_dilemmas.sidebar_subtitle', 'Laboratorio de Ética en IA')}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setCurrentDilemma(0); setSelectedAnswer(null); setShowFeedback(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-w-max md:min-w-0 ${activeSection === item.id ? 'bg-gradient-to-r from-corporate to-petroleum text-white font-semibold shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-50 hover:text-petroleum'}`}>
              {item.icon}<span className="text-sm md:text-base">{t(`ova.ethical_dilemmas.nav_${item.id}`)}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto relative" style={{ maxHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto bg-white/85 dark:bg-slate-800/85 backdrop-blur-[20px] border border-corporate/15 shadow-xl rounded-3xl p-6 md:p-10 min-h-[80vh] flex flex-col relative z-10 border-t-4 border-t-corporate">

          {activeSection === 'intro' && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl md:text-4xl font-black text-petroleum dark:text-slate-100 mb-6 font-montserrat">
                {t('ova.ethical_dilemmas.intro_title', 'Dilemas Éticos en Inteligencia Artificial')}
              </h2>
              <div className="w-full h-64 md:h-80 rounded-2xl mb-8 overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700">
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000" alt="Dilemas éticos en inteligencia artificial" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                {t('ova.ethical_dilemmas.intro_text', 'La inteligencia artificial plantea dilemas éticos que no tienen respuestas fáciles. En este laboratorio, enfrentarás situaciones reales donde deberás elegir el camino más ético.')}
              </p>
              <div className="mt-6 p-6 bg-cyan-50 dark:bg-cyan-900/20 border-l-8 border-corporate rounded-r-2xl italic text-petroleum dark:text-slate-100 font-medium">
                &ldquo;{t('ova.ethical_dilemmas.intro_quote', 'La tecnología no es buena ni mala, pero el uso que hacemos de ella sí tiene consecuencias éticas.')}&rdquo;
              </div>
              <div className="mt-8 flex gap-4">
                <button onClick={() => setActiveSection('dilemmas')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-corporate to-petroleum text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                  <Scale size={18} />
                  {t('ova.ethical_dilemmas.start_btn', 'Comenzar Dilemas')}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'dilemmas' && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards] flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-petroleum dark:text-slate-100 font-montserrat">
                  {t('ova.ethical_dilemmas.dilemmas_title', 'Dilemas Éticos')}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {currentDilemma + 1} / {totalDilemmas}
                  </span>
                  <div className="flex gap-1">
                    {dilemmas.map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${answers[i]?.correct ? 'bg-emerald-400' : answers[i] ? 'bg-rose-400' : i === currentDilemma ? 'bg-corporate scale-125' : 'bg-slate-200 dark:bg-slate-600'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-700">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="text-amber-500" size={20} />
                    <span className="text-xs uppercase tracking-widest text-amber-600 font-bold">
                      {t('ova.ethical_dilemmas.scenario_label', 'ESCENARIO')} {currentDilemma + 1}
                    </span>
                  </div>
                  <p className="text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                    {dilemmas[currentDilemma].scenario}
                  </p>
                </div>

                <div className="space-y-3">
                  {dilemmas[currentDilemma].opts.map((opt, idx) => {
                    const isCorrect = idx === dilemmas[currentDilemma].correct;
                    const isSelected = selectedAnswer === idx;
                    const showResult = showFeedback && isSelected;
                    return (
                      <button key={idx} onClick={() => handleAnswer(idx)}
                        disabled={showFeedback}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm md:text-base
                          ${showResult && isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-900 dark:text-emerald-100' :
                            showResult && !isCorrect ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 text-rose-900 dark:text-rose-100' :
                            isSelected ? 'border-corporate bg-cyan-50 dark:bg-slate-700 shadow-md' :
                            'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-corporate hover:bg-cyan-50/50'}
                        `}>
                        <div className="flex items-start gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
                            ${showResult && isCorrect ? 'bg-emerald-500 text-white' :
                              showResult && !isSelected ? 'bg-slate-200 dark:bg-slate-600 text-slate-500' :
                              showResult && isSelected ? 'bg-rose-500 text-white' :
                              'bg-corporate/20 text-petroleum dark:text-slate-300'}`}>
                            {showResult && isCorrect ? <CheckCircle size={14} /> :
                             showResult && isSelected ? <XCircle size={14} /> :
                             String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <div className={`mt-6 p-5 rounded-2xl border-l-8 ${selectedAnswer === dilemmas[currentDilemma].correct ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-400'}`}>
                    <div className="flex items-start gap-3">
                      {selectedAnswer === dilemmas[currentDilemma].correct
                        ? <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                        : <XCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
                      }
                      <div>
                        <p className={`font-bold mb-1 ${selectedAnswer === dilemmas[currentDilemma].correct ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'}`}>
                          {selectedAnswer === dilemmas[currentDilemma].correct
                            ? t('ova.ethical_dilemmas.correct_label', '¡Correcto!')
                            : t('ova.ethical_dilemmas.incorrect_label', 'Incorrecto')}
                        </p>
                        <p className={`text-sm ${selectedAnswer === dilemmas[currentDilemma].correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                          {dilemmas[currentDilemma].feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {showFeedback && currentDilemma < totalDilemmas - 1 && (
                  <button onClick={nextDilemma}
                    className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-corporate to-petroleum text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    {t('ova.ethical_dilemmas.next_btn', 'Siguiente Dilema')}
                  </button>
                )}

                {showFeedback && currentDilemma === totalDilemmas - 1 && (
                  <button onClick={() => setActiveSection('principles')}
                    className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    {t('ova.ethical_dilemmas.see_results_btn', 'Ver Resultados')}
                  </button>
                )}

                {currentDilemma > 0 && !showFeedback && (
                  <button onClick={prevDilemma}
                    className="mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-petroleum transition-colors">
                    &larr; {t('ova.ethical_dilemmas.prev_btn', 'Anterior')}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeSection === 'principles' && (
            <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
              <h2 className="text-3xl font-black text-petroleum dark:text-slate-100 mb-6 font-montserrat">
                {t('ova.ethical_dilemmas.principles_title', 'Principios de IA Ética')}
              </h2>

              {allAnswered && (
                <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-4 mb-4">
                    <Award className="w-12 h-12 text-emerald-500" />
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                        {t('ova.ethical_dilemmas.results_title', 'Tus Resultados')}
                      </h3>
                      <p className="text-emerald-700 dark:text-emerald-300">
                        {correctCount} / {totalDilemmas} {t('ova.ethical_dilemmas.correct_count', 'correctas')}
                        {correctCount === totalDilemmas ? ' ' + t('ova.ethical_dilemmas.perfect_score', '¡Puntuación perfecta!') : ''}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-white/50 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all" style={{ width: `${(correctCount / totalDilemmas) * 100}%` }} />
                  </div>
                </div>
              )}

              <p className="text-base text-slate-600 dark:text-slate-300 mb-8">
                {t('ova.ethical_dilemmas.principles_text', 'Estos son los pilares fundamentales para guiar tus decisiones éticas al usar inteligencia artificial.')}
              </p>

              <div className="space-y-4 mb-8">
                {accordionData.map((item) => {
                  const isOpen = openAccordion === item.id;
                  return (
                    <div key={item.id} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-corporate/15 shadow-md rounded-xl overflow-hidden">
                      <button onClick={() => setOpenAccordion(isOpen ? null : item.id)}
                        className="w-full text-left p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex justify-between items-center font-bold text-petroleum dark:text-slate-100 text-base">
                        <span><span className="mr-2">{item.icon}</span> {item.title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      {isOpen && <div className="p-5 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{item.content}</div>}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col items-center">
                <button onClick={() => { setActiveSection('intro'); setCurrentDilemma(0); setSelectedAnswer(null); setShowFeedback(false); setAnswers({}); }}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-corporate to-petroleum text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                  {t('ova.ethical_dilemmas.back_to_start', 'Volver al Inicio')}
                </button>
              </div>
            </div>
          )}

        </div>
        <footer className="mt-4 text-center text-slate-600 dark:text-slate-300 text-xs py-4">
          {t('ova.ethical_dilemmas.footer')}
        </footer>
      </main>

      <OVAValerioBar text={getValerioText()} />
    </div>
  );
}
