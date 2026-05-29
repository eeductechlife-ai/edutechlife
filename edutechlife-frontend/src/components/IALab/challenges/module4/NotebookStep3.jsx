import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';
import ProgressStepper from '../../challenges/shared/ProgressStepper';

const M4_STEPS = [
  { key: 'step1', icon: 'fa-bookmark', labelKey: 'ialab.challenge.m4.step1_title' },
  { key: 'step2', icon: 'fa-compress', labelKey: 'ialab.challenge.m4.step2_title' },
  { key: 'step3', icon: 'fa-microphone', labelKey: 'ialab.challenge.m4.step3_title' },
];

const GAP_FIELDS = [
  { key: 'hook', maxLen: 200, titleKey: 'ialab.challenge.m4.step3.hook_title', placeholderKey: 'ialab.challenge.m4.step3.hook_placeholder', icon: 'fa-play' },
  { key: 'evidencia', maxLen: 300, titleKey: 'ialab.challenge.m4.step3.evidencia_title', placeholderKey: 'ialab.challenge.m4.step3.evidencia_placeholder', icon: 'fa-flask' },
  { key: 'transicion', maxLen: 150, titleKey: 'ialab.challenge.m4.step3.transicion_title', placeholderKey: 'ialab.challenge.m4.step3.transicion_placeholder', icon: 'fa-arrow-right' },
  { key: 'cierre', maxLen: 200, titleKey: 'ialab.challenge.m4.step3.cierre_title', placeholderKey: 'ialab.challenge.m4.step3.cierre_placeholder', icon: 'fa-stop' },
];

const QUIZ_DATA = [
  {
    titleKey: 'ialab.challenge.m4.step3.quiz1_title',
    options: [
      { key: 'ialab.challenge.m4.step3.quiz1_option1', value: 0 },
      { key: 'ialab.challenge.m4.step3.quiz1_option2', value: 1 },
      { key: 'ialab.challenge.m4.step3.quiz1_option3', value: 2 },
    ],
    correctValue: 1,
  },
  {
    titleKey: 'ialab.challenge.m4.step3.quiz2_title',
    options: [
      { key: 'ialab.challenge.m4.step3.quiz2_option1', value: 0 },
      { key: 'ialab.challenge.m4.step3.quiz2_option2', value: 1 },
      { key: 'ialab.challenge.m4.step3.quiz2_option3', value: 2 },
    ],
    correctValue: 1,
  },
];

const defaultData = { hook: '', evidencia: '', transicion: '', cierre: '', quiz: [false, false] };

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const NotebookStep3 = ({ exercise, response, onResponseChange, topic = '' }) => {
  const { t, locale } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const parseResponse = useCallback(() => {
    if (!response) return { ...defaultData };
    try {
      const parsed = JSON.parse(response);
      return {
        hook: parsed.hook || '',
        evidencia: parsed.evidencia || '',
        transicion: parsed.transicion || '',
        cierre: parsed.cierre || '',
        quiz: Array.isArray(parsed.quiz) ? parsed.quiz : [false, false],
      };
    } catch {
      return { ...defaultData };
    }
  }, [response]);

  const [data, setData] = useState(defaultData);
  const [selectedOptions, setSelectedOptions] = useState([-1, -1]);

  useEffect(() => {
    const d = parseResponse();
    setData(d);
    const initialSelected = [-1, -1];
    if (d.quiz[0]) initialSelected[0] = QUIZ_DATA[0].correctValue;
    if (d.quiz[1]) initialSelected[1] = QUIZ_DATA[1].correctValue;
    setSelectedOptions(initialSelected);
  }, [parseResponse]);

  const sync = (next) => {
    setData(next);
    onResponseChange(JSON.stringify(next));
  };

  const updateGap = (key, value) => {
    sync({ ...data, [key]: value });
  };

  const handleQuizSelect = (qIndex, optionValue) => {
    const newSelected = [...selectedOptions];
    newSelected[qIndex] = optionValue;
    setSelectedOptions(newSelected);
    const isCorrect = optionValue === QUIZ_DATA[qIndex].correctValue;
    const newQuiz = [...data.quiz];
    newQuiz[qIndex] = isCorrect;
    sync({ ...data, quiz: newQuiz });
  };

  const filledGaps = GAP_FIELDS.filter(f => data[f.key].trim().length > 0).length;
  const quizAnswered = data.quiz.filter(q => q !== false).length;
  const totalItems = GAP_FIELDS.length + QUIZ_DATA.length;

  const allFilled = GAP_FIELDS.every(f => data[f.key].trim().length > 0);

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={3} completedSteps={{ step1: true, step2: true }} t={t} steps={M4_STEPS} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-microphone" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step3.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('ialab.challenge.m4.step3.subtitle')}</p>
          </div>
        </div>
      </motion.div>

      <ResearchContextBanner topic={topic} stepNumber={3} locale={locale} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {t('ialab.challenge.m4.step3_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {t('ialab.challenge.m4.step3_howto_desc')}
        </p>
      </motion.div>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate-dark/20 flex items-center justify-center">
          <Icon name="fa-pen" className="text-corporate dark:text-corporate-dark w-4 h-4" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step3.script_label')}</h4>
      </div>

      <motion.div
        variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="space-y-4"
      >
        {GAP_FIELDS.map((field, idx) => {
          const fieldOk = data[field.key].trim().length > 0;
          return (
            <motion.div
              key={field.key}
              variants={shouldReduceMotion ? undefined : sectionVariants}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-corporate/10 dark:bg-corporate-dark/20 flex items-center justify-center">
                    <span className="text-corporate dark:text-corporate-dark font-bold text-xs">{idx + 1}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t(field.titleKey)}</h4>
                  {fieldOk && <Icon name="fa-check-circle" className="text-emerald-500 text-sm" />}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {data[field.key].length}/{field.maxLen}
                </span>
              </div>
              <AutoGrowTextarea
                value={data[field.key]}
                onChange={(v) => updateGap(field.key, v)}
                placeholder={t(field.placeholderKey)}
                maxLength={field.maxLen}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="space-y-4">
        {QUIZ_DATA.map((quiz, qIdx) => (
          <motion.div
            key={qIdx}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + qIdx * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Icon name="fa-question-circle" className="text-amber-500 dark:text-amber-400 text-sm" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{t(quiz.titleKey)}</h4>
            </div>
            <div className="space-y-2 ml-1">
              {quiz.options.map((opt) => {
                const isSelected = selectedOptions[qIdx] === opt.value;
                const isCorrect = data.quiz[qIdx] === true && isSelected;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600'
                          : 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${qIdx}`}
                      checked={isSelected}
                      onChange={() => handleQuizSelect(qIdx, opt.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-slate-300 dark:border-slate-500'
                      }`}
                    >
                      {isSelected && <Icon name="fa-check" className="text-white w-3 h-3" />}
                    </div>
                    <span className={`text-sm font-medium ${
                      isSelected
                        ? isCorrect
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-red-700 dark:text-red-300'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}>
                      {t(opt.key)}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {allFilled && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
              <Icon name="fa-eye" className="text-white text-sm" />
            </div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step3.preview_title')}</h4>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600 p-4 space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gradient-to-r from-petroleum to-corporate text-white text-[10px] font-bold rounded uppercase">
                {t('ialab.challenge.m4.step3.hook_title')}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{data.hook}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold rounded uppercase mt-0.5">
                {t('ialab.challenge.m4.step3.evidencia_title')}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{data.evidencia}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded uppercase">
                {t('ialab.challenge.m4.step3.transicion_title')}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{data.transicion}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded uppercase mt-0.5">
                {t('ialab.challenge.m4.step3.cierre_title')}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{data.cierre}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 cursor-default opacity-80"
            >
              <Icon name="fa-play-circle" className="text-xl" />
              <span className="text-sm font-semibold">{t('ialab.challenge.m4.step3.preview_play')}</span>
            </button>
          </div>
        </motion.div>
      )}

      <StepFeedback
        completed={filledGaps + quizAnswered}
        total={totalItems}
        hints={[t('ialab.challenge.m4.step3_howto_desc')]}
        t={t}
      />
    </div>
  );
};

export default NotebookStep3;
