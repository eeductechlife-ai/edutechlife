import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import ProgressStepper from '../../challenges/shared/ProgressStepper';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';

const PRINCIPLES = [
  { id: 'transparency', labelKey: 'ialab.challenge.m5.step3.principle_transparency' },
  { id: 'fairness', labelKey: 'ialab.challenge.m5.step3.principle_fairness' },
  { id: 'privacy', labelKey: 'ialab.challenge.m5.step3.principle_privacy' },
  { id: 'accountability', labelKey: 'ialab.challenge.m5.step3.principle_accountability' },
];

const RELEVANCE_OPTIONS = [
  { id: 'protege_candidatos', labelKey: 'ialab.challenge.m5.step3.relevance_protege_candidatos' },
  { id: 'garantiza_equidad', labelKey: 'ialab.challenge.m5.step3.relevance_garantiza_equidad' },
  { id: 'cumple_regulacion', labelKey: 'ialab.challenge.m5.step3.relevance_cumple_regulacion' },
  { id: 'genera_confianza', labelKey: 'ialab.challenge.m5.step3.relevance_genera_confianza' },
];

const ACTION_TYPES = [
  { id: 'prevention', labelKey: 'ialab.challenge.m5.step3.action_prevention' },
  { id: 'mitigation', labelKey: 'ialab.challenge.m5.step3.action_mitigation' },
  { id: 'monitoring', labelKey: 'ialab.challenge.m5.step3.action_monitoring' },
];

const TIMELINE_OPTIONS = [
  { id: 'short', labelKey: 'ialab.challenge.m5.step3.timeline_short' },
  { id: 'medium', labelKey: 'ialab.challenge.m5.step3.timeline_medium' },
  { id: 'long', labelKey: 'ialab.challenge.m5.step3.timeline_long' },
];

const TIMELINE_COLORS = {
  short: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700',
  medium: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
  long: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
};

const M5_STEPS = [
  { key: 'step1', icon: 'fa-search', labelKey: 'ialab.challenge.m5.step1_title' },
  { key: 'step2', icon: 'fa-chart-line', labelKey: 'ialab.challenge.m5.step2_title' },
  { key: 'step3', icon: 'fa-shield-alt', labelKey: 'ialab.challenge.m5.step3_title' },
];

const PIPELINE_LABELS = {
  data: 'ialab.challenge.m5.step1.pipeline_data',
  training: 'ialab.challenge.m5.step1.pipeline_training',
  deployment: 'ialab.challenge.m5.step1.pipeline_deployment',
  monitoring: 'ialab.challenge.m5.step1.pipeline_monitoring',
};

const EthicsStep3 = ({ exercise, response, onResponseChange, topic = '', exercises, biases = [] }) => {
  const { t, locale } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const protocoloPlantilla = exercises?.protocoloPlantilla || exercise || {};

  const parseResponse = useCallback(() => {
    if (!response) return { principles: [], actions: [] };
    try {
      const parsed = JSON.parse(response);
      return {
        principles: parsed.principles || [],
        actions: parsed.actions || [],
      };
    } catch {
      return { principles: [], actions: [] };
    }
  }, [response]);

  const [form, setForm] = useState({ principles: [], actions: [] });

  useEffect(() => {
    setForm(parseResponse());
  }, [parseResponse]);

  const emitChange = useCallback((next) => {
    onResponseChange(JSON.stringify(next));
  }, [onResponseChange]);

  const togglePrinciple = (id) => {
    const next = { ...form };
    const exists = form.principles.find((p) => p.id === id);
    if (exists) {
      next.principles = form.principles.filter((p) => p.id !== id);
    } else {
      next.principles = [...form.principles, { id, relevance: '' }];
    }
    setForm(next);
    emitChange(next);
  };

  const updatePrincipleRelevance = (id, relevance) => {
    const next = { ...form, principles: form.principles.map((p) => (p.id === id ? { ...p, relevance } : p)) };
    setForm(next);
    emitChange(next);
  };

  const updateAction = (biasIndex, field, value) => {
    let actions = [...form.actions];
    const idx = actions.findIndex((a) => a.biasIndex === biasIndex);
    if (idx >= 0) {
      actions[idx] = { ...actions[idx], [field]: value };
    } else {
      const defaults = { biasIndex, measure: '', type: '', timeline: '' };
      actions.push({ ...defaults, [field]: value });
    }
    const next = { ...form, actions };
    setForm(next);
    emitChange(next);
  };

  const principlesDone = form.principles.length > 0;
  const hasRelevance = form.principles.every((p) => p.relevance);
  const actionsWithMeasure = form.actions.filter((a) => a.measure?.trim().length > 20).length;
  const actionsWithTimeline = form.actions.filter((a) => a.timeline).length;
  const actionsWithType = form.actions.filter((a) => a.type).length;

  const groupedByTimeline = {
    short: form.actions.filter((a) => a.timeline === 'short' && a.measure?.trim().length > 0),
    medium: form.actions.filter((a) => a.timeline === 'medium' && a.measure?.trim().length > 0),
    long: form.actions.filter((a) => a.timeline === 'long' && a.measure?.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={3} completedSteps={{ step1: true, step2: true }} t={t} steps={M5_STEPS} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-shield-alt" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t('ialab.challenge.m5.step3.title')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('ialab.challenge.m5.step3.subtitle')}
            </p>
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
            {t('ialab.challenge.m5.step3_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {t('ialab.challenge.m5.step3_howto_desc')}
        </p>
        <ExampleToggle example={t('ialab.challenge.m5.step3_example_prevention')} />
        <div className="mt-1">
          <ExampleToggle example={t('ialab.challenge.m5.step3_example_mitigation')} />
        </div>
        <div className="mt-1">
          <ExampleToggle example={t('ialab.challenge.m5.step3_example_monitoring')} />
        </div>
      </motion.div>

      {protocoloPlantilla?.principios?.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden"
        >
          <details className="group">
            <summary className="cursor-pointer text-xs font-medium text-corporate dark:text-corporate-dark hover:underline px-4 py-2.5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/10 border border-indigo-200 dark:border-indigo-800 rounded-xl list-none flex items-center gap-1">
              <Icon name="fa-eye" className="w-3 h-3" />
              {t('ialab.challenge.m5.step3.view_template')}
            </summary>
            <div className="mt-2 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/10 border border-indigo-200 dark:border-indigo-800 rounded-xl">
              <div className="flex items-start gap-3">
                <Icon name="fa-scroll" className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {t('ialab.challenge.m5.step3.template_title')}
                  </h4>
                  <ul className="space-y-1">
                    {protocoloPlantilla.principios.map((p, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </details>
        </motion.div>
      )}

      <motion.div
        variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="space-y-6"
      >
        <motion.div className="space-y-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Icon name="fa-balance-scale" className="text-emerald-500" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {t('ialab.challenge.m5.step3.principles_title')}
              </h4>
              {principlesDone && hasRelevance && <Icon name="fa-check-circle" className="text-emerald-500 text-sm" />}
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('ialab.challenge.m5.step3.principles_hint')}
          </p>

          {PRINCIPLES.map((principle) => {
            const entry = form.principles.find((p) => p.id === principle.id);
            const isSelected = !!entry;
            return (
              <div key={principle.id} className="space-y-2">
                <button
                  onClick={() => togglePrinciple(principle.id)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-emerald-400/40 hover:bg-emerald-50/50 dark:hover:bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300 dark:border-slate-500'
                    }`}
                  >
                    {isSelected && <Icon name="fa-check" className="text-white text-xs" />}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {t(principle.labelKey)}
                  </span>
                </button>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-8"
                    >
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                        {t('ialab.challenge.m5.step3.relevance_label')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {RELEVANCE_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => updatePrincipleRelevance(principle.id, opt.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              entry.relevance === opt.id
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-emerald-300'
                            }`}
                          >
                            {t(opt.labelKey)}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {form.principles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {t('ialab.challenge.m5.step3.selected_principles')}:
              </span>
              {form.principles.map((entry) => {
                const p = PRINCIPLES.find((pr) => pr.id === entry.id);
                if (!p) return null;
                return (
                  <span
                    key={entry.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full"
                  >
                    {t(p.labelKey)}
                    <button
                      onClick={() => togglePrinciple(entry.id)}
                      className="ml-0.5 w-3.5 h-3.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800/40 flex items-center justify-center"
                    >
                      <Icon name="fa-times" className="w-2 h-2" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </motion.div>

        {biases.map((bias) => {
          const action = form.actions.find((a) => a.biasIndex === bias.index);
          if (!action) return null;
          return (
            <motion.div
              key={bias.index}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <Icon name="fa-tasks" className="text-purple-500" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {t('ialab.challenge.m5.step3.action_bias')}: {bias.label}
                  </h4>
                  {bias.pipeline && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Pipeline: {t(PIPELINE_LABELS[bias.pipeline] || '')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                  {t('ialab.challenge.m5.step3.action_measure')}
                </label>
                <AutoGrowTextarea
                  value={action.measure}
                  onChange={(v) => updateAction(bias.index, 'measure', v)}
                  placeholder={t('ialab.challenge.m5.step3.action_measure_placeholder')}
                  maxLength={200}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                    {t('ialab.challenge.m5.step3.action_type')}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ACTION_TYPES.map((at) => (
                      <button
                        key={at.id}
                        onClick={() => updateAction(bias.index, 'type', at.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          action.type === at.id
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-purple-300'
                        }`}
                      >
                        {t(at.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                    {t('ialab.challenge.m5.step3.timeline_label')}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIMELINE_OPTIONS.map((tl) => (
                      <button
                        key={tl.id}
                        onClick={() => updateAction(bias.index, 'timeline', tl.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          action.timeline === tl.id
                            ? 'bg-petroleum text-white border-petroleum'
                            : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-petroleum/40'
                        }`}
                      >
                        {t(tl.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {form.actions.filter((a) => a.measure?.trim().length > 0).length > 0 && (
          <motion.div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                <Icon name="fa-clock" className="text-indigo-500" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {t('ialab.challenge.m5.step3.timeline_label')}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIMELINE_OPTIONS.map((tl) => (
                <div key={tl.id} className="space-y-2">
                  <h5 className={`text-sm font-semibold px-3 py-1 rounded-lg inline-block ${TIMELINE_COLORS[tl.id]}`}>
                    {t(tl.labelKey)}
                  </h5>
                  {groupedByTimeline[tl.id].length > 0 ? (
                    <ul className="space-y-1.5">
                      {groupedByTimeline[tl.id].map((a) => {
                        const bias = biases.find((b) => b.index === a.biasIndex);
                        return (
                          <li key={a.biasIndex} className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                            <span className="font-medium text-petroleum dark:text-corporate-dark">
                              {bias?.label}:
                            </span>{' '}
                            {a.measure?.substring(0, 60)}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                      {t('ialab.challenge.m5.step3_howto_desc')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <StepFeedback
        completed={(principlesDone ? 1 : 0) + (hasRelevance ? 1 : 0) + actionsWithMeasure + (actionsWithTimeline > 0 ? 1 : 0)}
        total={2 + biases.length + 1}
        hints={[t('ialab.challenge.m5.step3_howto_desc')]}
        t={t}
      />
    </div>
  );
};

export default EthicsStep3;
