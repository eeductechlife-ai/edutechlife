import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../i18n/I18nProvider';
import { HelpCircle, Users, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

const PROFILE_KEYS = ['beginner', 'explorer', 'creator', 'pro'];

export default function ExpandedQuiz({ questions }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const getScore = () => {
    const r = answers.reduce((sum, a) => sum + a.score, 0);
    if (r <= 5) return 'beginner';
    if (r <= 8) return 'explorer';
    if (r <= 11) return 'creator';
    return 'pro';
  };

  const handleAnswer = (option) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getScore());
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center">
        <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">{t('ova.ecosystem.quiz_no_data')}</p>
      </div>
    );
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-emphasis)] rounded-full flex items-center justify-center mx-auto shadow-lg"
        >
          <Users className="w-8 h-8 text-white" />
        </motion.div>
        <h4 className="font-[900] text-[var(--theme-emphasis)] text-xl tracking-tighter lowercase">
          {t(`ova.ecosystem.quiz_result_${result}_title`)}
        </h4>
        <div className="p-4 bg-gradient-to-br from-[var(--theme-primary)]/5 to-white rounded-xl border border-[var(--theme-primary)]/20">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {t(`ova.ecosystem.quiz_result_${result}`)}
          </p>
        </div>
        <motion.button
          onClick={restart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-[var(--theme-emphasis)] font-black rounded-xl text-xs uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          {t('ova.ecosystem.quiz_restart')}
        </motion.button>
      </motion.div>
    );
  }

  const q = questions[step];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-[var(--theme-primary)]" />
        <span className="text-[10px] font-black text-[var(--theme-emphasis)] uppercase tracking-wider">{t('ova.ecosystem.quiz_desc')}</span>
        <span className="ml-auto text-[10px] font-black text-slate-400">{step + 1}/{questions.length}</span>
      </div>

      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label="Quiz progress"
      >
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? 'w-8 bg-[var(--theme-emphasis)]' : i < step ? 'w-2 bg-[var(--theme-primary)]' : 'w-2 bg-slate-200 dark:bg-slate-600'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h4 className="font-[900] text-[var(--theme-emphasis)] text-base leading-tight mb-3">{q.question}</h4>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = showFeedback && opt.score >= 2;
              const isWrong = showFeedback && isSelected && opt.score < 2;
              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  whileHover={!showFeedback ? { scale: 1.01 } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                  disabled={showFeedback}
                  aria-pressed={isSelected}
                  className={`w-full p-4 rounded-xl border-2 text-left text-xs font-medium transition-all flex items-start gap-3 ${
                    isWrong
                      ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
                      : isCorrect
                        ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                        : isSelected
                          ? 'bg-blue-50 border-[var(--theme-primary)]'
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[var(--theme-primary)]'
                  }`}
                >
                  {showFeedback && (
                    <span className="mt-0.5 shrink-0">
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : isWrong ? <XCircle className="w-4 h-4 text-red-500" /> : null}
                    </span>
                  )}
                  <div className="flex-1">
                    <span className="text-slate-600 dark:text-slate-300">{opt.text}</span>
                    {showFeedback && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`text-xs mt-2 leading-relaxed ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        {opt.feedback}
                      </motion.p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={handleNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            {step < questions.length - 1 ? t('ova.ecosystem.quiz_next') : t('ova.ecosystem.quiz_see_results')}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

ExpandedQuiz.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      feedback: PropTypes.string.isRequired,
    })).isRequired,
  })),
};
