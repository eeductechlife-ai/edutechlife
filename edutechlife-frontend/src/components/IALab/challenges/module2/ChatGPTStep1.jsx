import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import AutoGrowTextarea from '../shared/AutoGrowTextarea';
import CaseContextBanner from './CaseContextBanner';
import StepFeedback from '../shared/StepFeedback';
import ProgressStepper from '../shared/ProgressStepper';

const CASES = [
  {
    id: 'marketing',
    icon: 'fa-chart-line',
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    border: 'border-violet-200',
    selectedBorder: 'border-violet-500',
    selectedBg: 'bg-violet-500/10',
    labelKey: 'ialab.challenge.m2.step1_case_marketing',
    descKey: 'ialab.challenge.m2.step1_case_marketing_desc',
  },
  {
    id: 'support',
    icon: 'fa-headset',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    selectedBorder: 'border-emerald-500',
    selectedBg: 'bg-emerald-500/10',
    labelKey: 'ialab.challenge.m2.step1_case_support',
    descKey: 'ialab.challenge.m2.step1_case_support_desc',
  },
  {
    id: 'dev',
    icon: 'fa-code',
    gradient: 'from-sky-500 to-cyan-600',
    bgLight: 'bg-sky-50',
    border: 'border-sky-200',
    selectedBorder: 'border-sky-500',
    selectedBg: 'bg-sky-500/10',
    labelKey: 'ialab.challenge.m2.step1_case_dev',
    descKey: 'ialab.challenge.m2.step1_case_dev_desc',
  },
];

const RESOURCES = [
  { icon: 'fa-video', labelKey: 'ialab.challenge.m2.resource_video', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { icon: 'fa-file-pdf', labelKey: 'ialab.challenge.m2.resource_pdf', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  { icon: 'fa-flask', labelKey: 'ialab.challenge.m2.resource_ova', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const ChatGPTStep1 = ({ exercise, response, onResponseChange }) => {
  const { t } = useTranslation();
  const [selectedCase, setSelectedCase] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (response) {
      try {
        const parsed = JSON.parse(response);
        if (parsed.selectedCase) setSelectedCase(parsed.selectedCase);
        if (parsed.taskDescription) setTaskDescription(parsed.taskDescription);
      } catch { /* ignore */ }
    }
  }, [response]);

  const emitChange = (updates) => {
    const next = {
      selectedCase: updates.selectedCase !== undefined ? updates.selectedCase : selectedCase,
      taskDescription: updates.taskDescription !== undefined ? updates.taskDescription : taskDescription,
    };
    onResponseChange(JSON.stringify(next));
  };

  const handleCaseSelect = (id) => {
    setSelectedCase(id);
    setValidationErrors({});
    emitChange({ selectedCase: id });
  };

  const handleTaskChange = (value) => {
    setTaskDescription(value);
    if (value && value.length >= 20) {
      setValidationErrors({});
    }
    emitChange({ taskDescription: value });
  };

  const casoUso = exercise?.casoUso || exercise || '';
  const completed = [selectedCase, taskDescription.length >= 20].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={1} t={t} />

      <div className="bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-2xl p-6 border border-corporate/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center shadow-lg shadow-corporate/20 flex-shrink-0">
            <Icon name="fa-search" className="text-white text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step1_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('ialab.challenge.m2.step1_subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="fa-briefcase" className="text-corporate" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step1_scenario')}</h3>
        </div>
        <div className="bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-xl p-5 border border-corporate/20">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{casoUso}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RESOURCES.map((r) => (
            <span key={r.labelKey} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${r.bg} ${r.color} border border-current/20`}>
              <Icon name={r.icon} className="text-xs" />
              {t(r.labelKey)}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="fa-layer-group" className="text-petroleum" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step1_select_case')}</h3>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {CASES.map((c) => {
            const isSelected = selectedCase === c.id;
            return (
              <motion.div key={c.id} variants={cardVariants}>
                <button
                  onClick={() => handleCaseSelect(c.id)}
                  className={`relative rounded-xl border-2 p-5 text-left w-full transition-all duration-300 h-full ${
                    isSelected
                      ? `${c.selectedBg} ${c.selectedBorder} shadow-lg shadow-corporate/10`
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <Icon name="fa-check" className="text-white text-xs" />
                    </motion.div>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${c.gradient} flex items-center justify-center mb-4`}>
                    <Icon name={c.icon} className="text-white text-xl" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">{t(c.labelKey)}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t(c.descKey)}</p>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {selectedCase && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <CaseContextBanner selectedCase={selectedCase} stepNumber={1} />

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-petroleum/10 dark:bg-petroleum/20 flex items-center justify-center">
                <Icon name="fa-pencil" className="text-petroleum" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step1_task_question')}</h3>
            </div>
            <AutoGrowTextarea
              value={taskDescription}
              onChange={handleTaskChange}
              placeholder={t('ialab.challenge.m2.step1_task_placeholder')}
            />
            <div className="flex items-center justify-between">
              {validationErrors.task && (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <Icon name="fa-exclamation-triangle" className="text-xs" />
                  {validationErrors.task}
                </span>
              )}
              <span className="text-xs text-slate-400 ml-auto">{taskDescription.length} {t('ialab.challenge.m2.step1_chars')}</span>
            </div>
          </div>
        </motion.div>
      )}

      <StepFeedback
        completed={completed}
        total={2}
        hints={[t('ialab.challenge.m2.step1_tip_1'), t('ialab.challenge.m2.step1_tip_2')]}
        t={t}
      />

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-700/30">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="fa-lightbulb" className="text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m2.step1_tips_title')}</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step1_tip_1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step1_tip_2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="fa-check-circle" className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{t('ialab.challenge.m2.step1_tip_3')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatGPTStep1;
