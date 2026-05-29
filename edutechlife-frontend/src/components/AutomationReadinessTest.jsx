import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/I18nProvider';
import { getQuestions, getLevels } from './AutomationData';

const AutomationReadinessTest = ({ onComplete }) => {
  const { t, locale } = useTranslation();
  const questions = getQuestions(locale);
  const levels = getLevels(locale);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [animateResult, setAnimateResult] = useState(false);

  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = useCallback((value) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  }, [currentQ?.id]);

  const handleNext = useCallback(() => {
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      calculateResult();
    }
  }, [step]);

  const handlePrev = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  const calculateResult = () => {
    const total = Object.values(answers).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
    const level = levels.find(l => total >= l.min && total <= l.max) || levels[0];
    setResult({ score: total, ...level });
    setAnimateResult(true);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setAnimateResult(false);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${result.color}15` }}>
            <svg className="w-10 h-10" style={{ color: result.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4" style={{ background: `${result.color}15`, color: result.color }}>
            {result.name}
          </div>

            <h3 className="text-2xl font-black text-[#004B63] mb-2">
              {t('automation.test.tu_nivel')}: {result.score}/40
            </h3>
          <p className="text-slate-500 mb-6">{result.description}</p>

          <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(result.score / 40) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${result.color}, ${result.color}dd)` }}
            />
          </div>

          <div className="text-left bg-slate-50 rounded-2xl p-6 mb-6">
            <h4 className="font-bold text-[#004B63] text-sm mb-3">{t('automation.test.acciones')}:</h4>
            <ul className="space-y-2">
              {result.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${result.color}15`, color: result.color }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#004B63]/5 border border-[#004B63]/10 rounded-xl mb-6">
            <svg className="w-4 h-4 text-[#4DA8C4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
            <span className="text-xs font-semibold text-[#004B63]">{result.standards}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onComplete?.(result)}
              className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full font-bold text-sm hover:shadow-lg transition-all"
            >
              Generar Plan Personalizado
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-full font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              {t('automation.test.retry')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider">
              Categoría: {currentQ.category}
            </span>
            <h3 className="text-lg font-bold text-[#004B63] mt-1">
              {t('automation.test.pregunta')} {step + 1} {t('automation.test.de')} {questions.length}
            </h3>
          </div>
          <span className="text-sm font-semibold text-slate-400">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl font-bold text-[#004B63] mb-6">{currentQ.text}</p>

            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-sm font-medium ${
                    answers[currentQ.id] === opt.value
                      ? 'border-[#4DA8C4] bg-[#4DA8C4]/5 text-[#004B63]'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      answers[currentQ.id] === opt.value
                        ? 'border-[#4DA8C4] bg-[#4DA8C4]'
                        : 'border-slate-300'
                    }`}>
                      {answers[currentQ.id] === opt.value && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('automation.test.prev')}
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="px-6 py-2.5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-full text-sm font-bold hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step < questions.length - 1 ? (
              <>{t('automation.test.next')} <svg className="w-4 h-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
            ) : t('automation.test.complete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationReadinessTest;
