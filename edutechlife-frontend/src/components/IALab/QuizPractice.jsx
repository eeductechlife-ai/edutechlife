import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';
import { getQuizPracticeData } from '../../data/ialabQuizPracticeData';
import { useIALabStore } from '../../store/ialabStore';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ScoreCircle({ pct, size = 130 }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
      <defs>
        <linearGradient id="quizScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#004B63" />
          <stop offset="100%" stopColor="#00BCD4" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle
        cx="60" cy="60" r={radius} fill="none"
        stroke="url(#quizScoreGrad)" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={animated ? circumference * (1 - pct / 100) : circumference}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      />
    </svg>
  );
}

export default function QuizPractice({ moduleId }) {
  const { t, locale } = useTranslation();
  const data = getQuizPracticeData(locale);
  const allQuestions = data[moduleId] || data[1];

  const questions = useMemo(() => {
    const shuffled = shuffleArray(allQuestions);
    return shuffled.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  }, [allQuestions]);

  const addXp = useIALabStore((s) => s.addXp);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQ];
  const isAnswerCorrect =
    selected !== null && currentQuestion?.correctAnswer === selected;

  const handleSelect = useCallback((optId) => {
    if (selected !== null) return;
    setSelected(optId);
  }, [selected]);

  const handleNext = useCallback(() => {
    if (!currentQuestion) return;
    const correct = currentQuestion.correctAnswer === selected;
    const newAnswers = [...answers, { questionId: currentQuestion.id, correct, difficulty: currentQuestion.difficulty }];
    setAnswers(newAnswers);

    if (currentQ >= questions.length - 1) {
      setShowResult(true);
      const pct = Math.round((newAnswers.filter((a) => a.correct).length / questions.length) * 100);
      if (pct >= 60) addXp(50);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
    }
  }, [currentQ, selected, answers, questions, currentQuestion, addXp]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  }, []);

  const getDifficultyLabel = (d) => {
    if (d === 'easy') return t('ialab.flashcards.practice_easy');
    if (d === 'medium') return t('ialab.flashcards.practice_medium');
    return t('ialab.flashcards.practice_hard');
  };

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-slate-500">{t('ialab.flashcards.practice_no_questions')}</p>
      </div>
    );
  }

  if (showResult) {
    const totalCorrect = answers.filter((a) => a.correct).length;
    const pct = Math.round((totalCorrect / questions.length) * 100);
    const passed = pct >= 60;
    const easyStats = { correct: answers.filter((a) => a.difficulty === 'easy' && a.correct).length, total: answers.filter((a) => a.difficulty === 'easy').length };
    const mediumStats = { correct: answers.filter((a) => a.difficulty === 'medium' && a.correct).length, total: answers.filter((a) => a.difficulty === 'medium').length };
    const hardStats = { correct: answers.filter((a) => a.difficulty === 'hard' && a.correct).length, total: answers.filter((a) => a.difficulty === 'hard').length };

    return (
      <div className="p-6 sm:p-8 text-center">
        <div className="relative w-[130px] h-[130px] mx-auto mb-4">
          <ScoreCircle pct={pct} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className={`text-2xl font-bold ${passed ? 'text-emerald-600' : 'text-[var(--theme-emphasis)]'}`}>
                {pct}%
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[var(--theme-emphasis)] mb-1">
          {t('ialab.flashcards.practice_completed_title')}
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          {t('ialab.flashcards.practice_completed_desc')}
        </p>

        {passed && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold mb-5">
            <Icon name="fa-star" className="text-amber-400" />
            +50 XP
          </div>
        )}

        <div className="flex justify-center gap-6 sm:gap-10 mb-6">
          <div className="text-center">
            <span className="text-2xl font-bold text-emerald-600">{totalCorrect}</span>
            <p className="text-xs text-slate-500 mt-0.5">{t('ialab.flashcards.practice_correct')}</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-red-500">{questions.length - totalCorrect}</span>
            <p className="text-xs text-slate-500 mt-0.5">{t('ialab.flashcards.practice_incorrect')}</p>
          </div>
        </div>

        <div className="max-w-xs mx-auto mb-6 space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t('ialab.flashcards.practice_stats_by_difficulty')}
          </p>
          {[
            { label: getDifficultyLabel('easy'), stats: easyStats, color: 'text-emerald-600' },
            { label: getDifficultyLabel('medium'), stats: mediumStats, color: 'text-amber-600' },
            { label: getDifficultyLabel('hard'), stats: hardStats, color: 'text-red-600' },
          ].map(({ label, stats, color }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{label}</span>
              <span className={`font-semibold ${color}`}>
                {stats.correct}/{stats.total}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--theme-emphasis)]/10 text-[var(--theme-emphasis)] text-sm font-semibold hover:bg-[var(--theme-emphasis)]/20 transition-all active:scale-[0.97]"
          >
            <Icon name="fa-rotate" aria-hidden="true" />
            {t('ialab.flashcards.practice_try_again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-[1.5px] bg-gradient-to-br from-[var(--theme-emphasis)]/20 via-[var(--theme-primary)]/10 to-[var(--theme-emphasis)]/5 rounded-[1.75rem]">
      <div className="relative bg-white dark:bg-slate-800 rounded-[calc(1.75rem-1.5px)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-emphasis)] via-[var(--theme-emphasis)]-dark to-[var(--theme-primary)] rounded-t-[calc(1.75rem-1.5px)]" />

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10">
                <span className="text-[10px] font-semibold text-[var(--theme-emphasis)] uppercase tracking-wide">
                  {t('ialab.flashcards.practice_badge')}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Icon name={currentQuestion?.difficulty === 'easy' ? 'fa-chevron-down' : currentQuestion?.difficulty === 'hard' ? 'fa-chevron-up' : 'fa-minus'} className="text-xs" aria-hidden="true" />
                {currentQuestion ? getDifficultyLabel(currentQuestion.difficulty) : ''}
              </span>
              <span className="text-xs text-slate-400 tabular-nums ml-1">
                {currentQ + 1}/{questions.length}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-base font-bold text-[var(--theme-emphasis)] dark:text-white mb-5 leading-relaxed">
                {currentQuestion?.question}
              </p>

              <div className="space-y-2.5">
                {currentQuestion?.options.map((opt) => {
                  let borderClass = 'border-slate-200/60 dark:border-slate-600 hover:border-[var(--theme-emphasis)]/30 dark:hover:border-[var(--theme-emphasis)]/50 hover:bg-[var(--theme-emphasis)]/5 dark:hover:bg-[var(--theme-emphasis)]/10';
                  let bgClass = 'bg-white dark:bg-slate-800';
                  let textClass = 'text-slate-700 dark:text-slate-200';
                  let iconWrapper = null;

                  if (selected === opt.id) {
                    if (opt.id === currentQuestion.correctAnswer) {
                      borderClass = 'border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                      bgClass = 'bg-emerald-50 dark:bg-emerald-900/20';
                      textClass = 'text-emerald-700 dark:text-emerald-300';
                      iconWrapper = (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon name="fa-check" className="text-emerald-500 text-sm" />
                        </div>
                      );
                    } else {
                      borderClass = 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20';
                      bgClass = 'bg-red-50 dark:bg-red-900/20';
                      textClass = 'text-red-600 dark:text-red-300';
                      iconWrapper = (
                        <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon name="fa-xmark" className="text-red-500 text-sm" />
                        </div>
                      );
                    }
                  } else if (selected !== null && opt.id === currentQuestion.correctAnswer) {
                    borderClass = 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10';
                    bgClass = 'bg-emerald-50/50 dark:bg-emerald-900/10';
                    textClass = 'text-emerald-700 dark:text-emerald-300';
                    iconWrapper = (
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-check" className="text-emerald-500 text-sm" />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={selected !== null}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${borderClass} ${bgClass} ${selected !== null ? 'cursor-default' : 'cursor-pointer active:scale-[0.99] hover:shadow-sm'}`}
                    >
                      <span className={`flex-1 text-sm leading-relaxed ${textClass}`}>
                        {opt.label}
                      </span>
                      {iconWrapper || (
                        <div className="w-7 h-7 rounded-lg border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
            >
              <div
                className={`p-3 sm:p-4 rounded-xl text-sm mb-4 flex items-start gap-3 ${
                  isAnswerCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isAnswerCorrect ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                  <Icon name={isAnswerCorrect ? 'fa-check' : 'fa-xmark'} className={`text-lg ${isAnswerCorrect ? 'text-emerald-500' : 'text-red-500'}`} />
                </div>
                <div>
                  <span className="font-semibold">
                    {isAnswerCorrect
                      ? t('ialab.flashcards.practice_feedback_correct')
                      : t('ialab.flashcards.practice_feedback_incorrect')}
                  </span>
                  {currentQuestion?.feedback && (
                    <p className="text-sm mt-1 opacity-85">{currentQuestion.feedback}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleNext}
                className="group w-full py-3 rounded-xl bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white text-sm font-semibold shadow-md shadow-[var(--theme-emphasis)]/20 hover:shadow-lg hover:shadow-[var(--theme-emphasis)]/30 transition-all duration-200 active:scale-[0.99] inline-flex items-center justify-center gap-2"
              >
                <span>{currentQ >= questions.length - 1 ? t('ialab.flashcards.practice_view_results') : t('ialab.flashcards.practice_next')}</span>
                <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                  <Icon name="fa-chevron-right" className="text-white text-xs" />
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
