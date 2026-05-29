import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import ProgressStepper from '../../challenges/shared/ProgressStepper';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';

const PIPELINE_STAGES = [
  { id: 'data', labelKey: 'ialab.challenge.m5.step1.pipeline_data' },
  { id: 'training', labelKey: 'ialab.challenge.m5.step1.pipeline_training' },
  { id: 'deployment', labelKey: 'ialab.challenge.m5.step1.pipeline_deployment' },
  { id: 'monitoring', labelKey: 'ialab.challenge.m5.step1.pipeline_monitoring' },
];

const M5_STEPS = [
  { key: 'step1', icon: 'fa-search', labelKey: 'ialab.challenge.m5.step1_title' },
  { key: 'step2', icon: 'fa-chart-line', labelKey: 'ialab.challenge.m5.step2_title' },
  { key: 'step3', icon: 'fa-shield-alt', labelKey: 'ialab.challenge.m5.step3_title' },
];

const getNombre = (sesgo) => (typeof sesgo === 'string' ? sesgo : sesgo?.nombre || '');
const getDescripcion = (sesgo) => (typeof sesgo === 'string' ? '' : sesgo?.descripcion || '');

const EthicsStep1 = ({ exercise, response, onResponseChange, topic = '', exercises }) => {
  const { t, locale } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const casoEtico = exercises?.casoEtico || exercise || '';
  const tiposSesgo = exercises?.tiposSesgo || [];

  const parseResponse = useCallback(() => {
    if (!response) return { biases: [] };
    try {
      const parsed = JSON.parse(response);
      return { biases: parsed.biases || [] };
    } catch {
      return { biases: [] };
    }
  }, [response]);

  const [biases, setBiases] = useState([]);

  useEffect(() => {
    setBiases(parseResponse().biases);
  }, [parseResponse]);

  const emitChange = useCallback((nextBiases) => {
    onResponseChange(JSON.stringify({ biases: nextBiases }));
  }, [onResponseChange]);

  const toggleBias = (index) => {
    const exists = biases.find((b) => b.index === index);
    let next;
    if (exists) {
      next = biases.filter((b) => b.index !== index);
    } else {
      next = [...biases, { index, justification: '', pipeline: '', severity: null }];
    }
    setBiases(next);
    emitChange(next);
  };

  const updateBiasField = (index, field, value) => {
    const next = biases.map((b) => (b.index === index ? { ...b, [field]: value } : b));
    setBiases(next);
    emitChange(next);
  };

  const assignSeverity = (index, severity) => {
    const next = biases.map((b) => {
      if (b.index === index) return { ...b, severity: b.severity === severity ? null : severity };
      if (b.severity === severity) return { ...b, severity: null };
      return b;
    });
    setBiases(next);
    emitChange(next);
  };

  const selectedCount = biases.length;
  const showSeverity = selectedCount >= 2;
  const severity1Assigned = biases.some((b) => b.severity === 1);
  const severity2Assigned = biases.some((b) => b.severity === 2);

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={1} completedSteps={{}} t={t} steps={M5_STEPS} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-search" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t('ialab.challenge.m5.step1.title')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('ialab.challenge.m5.step1.subtitle')}
            </p>
          </div>
        </div>
      </motion.div>

      <ResearchContextBanner topic={topic || casoEtico?.substring(0, 80)} stepNumber={1} locale={locale} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {t('ialab.challenge.m5.step1_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {t('ialab.challenge.m5.step1_howto_desc')}
        </p>
        <ExampleToggle example={t('ialab.challenge.m5.step1_example_bias')} />
        <div className="mt-1">
          <ExampleToggle example={t('ialab.challenge.m5.step1_example_pipeline')} />
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
            <Icon name="fa-exclamation-triangle" className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
              {t('ialab.challenge.m5.step1.case_title')}
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
              {casoEtico}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="space-y-6"
      >
        <motion.div className="space-y-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="fa-list-check" className="text-petroleum dark:text-corporate-dark" />
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {t('ialab.challenge.m5.step1.bias_title')}
              </h4>
              {selectedCount > 0 && <Icon name="fa-check-circle" className="text-emerald-500 text-sm" />}
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('ialab.challenge.m5.step1.bias_hint')}
          </p>

          {tiposSesgo.map((sesgo, index) => {
            const biasEntry = biases.find((b) => b.index === index);
            const isSelected = !!biasEntry;
            return (
              <div key={index} className="space-y-3">
                <button
                  onClick={() => toggleBias(index)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-petroleum/5 dark:bg-corporate-dark/10 border-petroleum/30 dark:border-corporate-dark/30'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-petroleum/20 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                      isSelected
                        ? 'bg-petroleum dark:bg-corporate-dark border-petroleum dark:border-corporate-dark'
                        : 'border-slate-300 dark:border-slate-500'
                    }`}
                  >
                    {isSelected && <Icon name="fa-check" className="text-white text-xs" />}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? 'text-petroleum dark:text-corporate-dark'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {getNombre(sesgo)}
                    </span>
                    {getDescripcion(sesgo) && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {getDescripcion(sesgo)}
                      </p>
                    )}
                  </div>
                  {biasEntry?.severity && (
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        biasEntry.severity === 1 ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                    >
                      {biasEntry.severity}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-8 space-y-3"
                    >
                      <div>
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                          {t('ialab.challenge.m5.step1.justification_label')}
                        </label>
                        <AutoGrowTextarea
                          value={biasEntry.justification}
                          onChange={(v) => updateBiasField(index, 'justification', v)}
                          placeholder={t('ialab.challenge.m5.step1.justification_placeholder')}
                          maxLength={150}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                          {t('ialab.challenge.m5.step1.pipeline_per_bias')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {PIPELINE_STAGES.map((stage) => (
                            <button
                              key={stage.id}
                              onClick={() => updateBiasField(index, 'pipeline', stage.id)}
                              className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-all ${
                                biasEntry.pipeline === stage.id
                                  ? 'bg-petroleum/5 dark:bg-corporate-dark/10 border-petroleum/30 dark:border-corporate-dark/30 text-petroleum dark:text-corporate-dark'
                                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {t(stage.labelKey)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {showSeverity && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Icon name="fa-sort-amount-down" className="text-red-500" />
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {t('ialab.challenge.m5.step1.severity_title')}
                </h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('ialab.challenge.m5.step1.severity_hint')}
              </p>
              <div className="space-y-2">
                {biases.map((b) => {
                  const sesgo = tiposSesgo[b.index];
                  return (
                    <div
                      key={b.index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                    >
                      <span className="text-sm flex-1 text-slate-700 dark:text-slate-300">
                        {getNombre(sesgo)}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2].map((num) => (
                          <button
                            key={num}
                            onClick={() => assignSeverity(b.index, num)}
                            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                              b.severity === num
                                ? num === 1
                                  ? 'bg-red-500 text-white shadow-md shadow-red-200'
                                  : 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-500'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {biases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              className="flex flex-wrap gap-1.5 items-center"
            >
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {t('ialab.challenge.m5.step1.selected_biases')}:
              </span>
              {biases.map((b) => {
                const sesgo = tiposSesgo[b.index];
                return (
                  <span
                    key={b.index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-petroleum/10 dark:bg-corporate-dark/20 text-petroleum dark:text-corporate-dark text-xs rounded-full"
                  >
                    {getNombre(sesgo)}
                    {b.severity && (
                      <span
                        className={`ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                          b.severity === 1 ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                      >
                        {b.severity}
                      </span>
                    )}
                    <button
                      onClick={() => toggleBias(b.index)}
                      className="ml-0.5 w-3.5 h-3.5 rounded-full hover:bg-petroleum/20 dark:hover:bg-corporate-dark/30 flex items-center justify-center"
                    >
                      <Icon name="fa-times" className="w-2 h-2" />
                    </button>
                  </span>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <StepFeedback
        completed={
          selectedCount > 0
            ? (severity1Assigned && severity2Assigned ? 3 : selectedCount)
            : 0
        }
        total={3}
        hints={[t('ialab.challenge.m5.step1_howto_desc')]}
        t={t}
      />
    </div>
  );
};

export default EthicsStep1;
