import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import ProgressStepper from '../../challenges/shared/ProgressStepper';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';

const AFFECTED_GROUPS = [
  { id: 'candidates', labelKey: 'ialab.challenge.m5.step2.affected_candidates', impactLabelKey: 'ialab.challenge.m5.step2.impact_candidates', placeholderKey: 'ialab.challenge.m5.step2.impact_candidates_placeholder' },
  { id: 'company', labelKey: 'ialab.challenge.m5.step2.affected_company', impactLabelKey: 'ialab.challenge.m5.step2.impact_company', placeholderKey: 'ialab.challenge.m5.step2.impact_company_placeholder' },
  { id: 'society', labelKey: 'ialab.challenge.m5.step2.affected_society', impactLabelKey: 'ialab.challenge.m5.step2.impact_society', placeholderKey: 'ialab.challenge.m5.step2.impact_society_placeholder' },
];

const ROOT_CAUSE_OPTIONS = [
  { id: 'technical', labelKey: 'ialab.challenge.m5.step2.cause_technical' },
  { id: 'data', labelKey: 'ialab.challenge.m5.step2.cause_data' },
  { id: 'human', labelKey: 'ialab.challenge.m5.step2.cause_human' },
  { id: 'process', labelKey: 'ialab.challenge.m5.step2.cause_process' },
];

const SEVERITY_LEVELS = ['low', 'medium', 'high'];
const NEXT_SEVERITY = { low: 'medium', medium: 'high', high: null, null: 'low' };

const M5_STEPS = [
  { key: 'step1', icon: 'fa-search', labelKey: 'ialab.challenge.m5.step1_title' },
  { key: 'step2', icon: 'fa-chart-line', labelKey: 'ialab.challenge.m5.step2_title' },
  { key: 'step3', icon: 'fa-shield-alt', labelKey: 'ialab.challenge.m5.step3_title' },
];

const EthicsStep2 = ({ exercise, response, onResponseChange, topic = '', exercises, biases = [] }) => {
  const { t, locale } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const casoEtico = exercises?.casoEtico || exercise || '';

  const parseResponse = useCallback(() => {
    if (!response) return { impact: { candidates: '', company: '', society: '' }, rootCauses: {}, severityMatrix: {} };
    try {
      const parsed = JSON.parse(response);
      return {
        impact: { candidates: parsed.impact?.candidates || '', company: parsed.impact?.company || '', society: parsed.impact?.society || '' },
        rootCauses: parsed.rootCauses || {},
        severityMatrix: parsed.severityMatrix || {},
      };
    } catch {
      return { impact: { candidates: '', company: '', society: '' }, rootCauses: {}, severityMatrix: {} };
    }
  }, [response]);

  const [form, setForm] = useState({ impact: { candidates: '', company: '', society: '' }, rootCauses: {}, severityMatrix: {} });

  useEffect(() => {
    setForm(parseResponse());
  }, [parseResponse]);

  const emitChange = useCallback((next) => {
    onResponseChange(JSON.stringify(next));
  }, [onResponseChange]);

  const updateImpact = (group, value) => {
    const next = { ...form, impact: { ...form.impact, [group]: value } };
    setForm(next);
    emitChange(next);
  };

  const toggleRootCause = (id) => {
    const next = { ...form, rootCauses: { ...form.rootCauses } };
    if (next.rootCauses[id]) {
      delete next.rootCauses[id];
    } else {
      next.rootCauses[id] = { justification: '', biasIndexes: [] };
    }
    setForm(next);
    emitChange(next);
  };

  const updateRootCauseJustification = (id, value) => {
    const next = { ...form, rootCauses: { ...form.rootCauses, [id]: { ...form.rootCauses[id], justification: value } } };
    setForm(next);
    emitChange(next);
  };

  const toggleBiasConnection = (causeId, biasIndex) => {
    const current = form.rootCauses[causeId];
    if (!current) return;
    const indexes = current.biasIndexes || [];
    const nextIndexes = indexes.includes(biasIndex)
      ? indexes.filter((i) => i !== biasIndex)
      : [...indexes, biasIndex];
    const next = { ...form, rootCauses: { ...form.rootCauses, [causeId]: { ...current, biasIndexes: nextIndexes } } };
    setForm(next);
    emitChange(next);
  };

  const cycleSeverity = (group, cause) => {
    const key = `${group}-${cause}`;
    const current = form.severityMatrix[key] || null;
    const nextVal = NEXT_SEVERITY[current];
    const next = { ...form, severityMatrix: { ...form.severityMatrix } };
    if (nextVal) {
      next.severityMatrix[key] = nextVal;
    } else {
      delete next.severityMatrix[key];
    }
    setForm(next);
    emitChange(next);
  };

  const impactFilled = Object.values(form.impact).filter((v) => v.trim().length > 20).length;
  const causesFilled = ROOT_CAUSE_OPTIONS.filter(
    (opt) => form.rootCauses[opt.id]?.justification?.trim().length > 20
  ).length;
  const matrixFilled = Object.keys(form.severityMatrix).length;

  const severityColors = { low: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700', medium: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700', high: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700' };

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={2} completedSteps={{ step1: true }} t={t} steps={M5_STEPS} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-chart-line" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t('ialab.challenge.m5.step2.title')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('ialab.challenge.m5.step2.subtitle')}
            </p>
          </div>
        </div>
      </motion.div>

      <ResearchContextBanner topic={topic || casoEtico?.substring(0, 80)} stepNumber={2} locale={locale} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {t('ialab.challenge.m5.step2_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {t('ialab.challenge.m5.step2_howto_desc')}
        </p>
        <ExampleToggle example={t('ialab.challenge.m5.step2_example_impact')} />
        <div className="mt-1">
          <ExampleToggle example={t('ialab.challenge.m5.step2_example_cause')} />
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
      >
        <div className="flex items-start gap-3">
          <Icon name="fa-scroll" className="text-petroleum dark:text-corporate-dark mt-1 flex-shrink-0" />
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {casoEtico?.substring(0, 300)}{casoEtico?.length > 300 ? '...' : ''}
          </p>
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
              <div className="w-8 h-8 rounded-lg bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                <Icon name="fa-users" className="text-red-500" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {t('ialab.challenge.m5.step2.impact_title')}
              </h4>
              {impactFilled === 3 && <Icon name="fa-check-circle" className="text-emerald-500 text-sm" />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AFFECTED_GROUPS.map((group) => (
              <div key={group.id} className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t(group.impactLabelKey)}
                </label>
                <AutoGrowTextarea
                  value={form.impact[group.id]}
                  onChange={(v) => updateImpact(group.id, v)}
                  placeholder={t(group.placeholderKey)}
                  maxLength={150}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="space-y-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
              <Icon name="fa-sitemap" className="text-amber-500" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t('ialab.challenge.m5.step2.causes_title')}
            </h4>
          </div>

          <div className="space-y-3">
            {ROOT_CAUSE_OPTIONS.map((opt) => {
              const cause = form.rootCauses[opt.id];
              const isSelected = !!cause;
              const justVal = cause?.justification || '';
              const justOk = justVal.trim().length > 20;
              const connectedBiases = cause?.biasIndexes || [];
              return (
                <div
                  key={opt.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10'
                      : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleRootCause(opt.id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                    aria-pressed={isSelected}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-amber-500 border-amber-500' : 'border-slate-300 dark:border-slate-500'
                      }`}
                    >
                      {isSelected && <Icon name="fa-check" className="text-white text-xs" />}
                    </div>
                    <span
                      className={`text-sm font-medium flex-1 ${
                        isSelected
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t(opt.labelKey)}
                    </span>
                    {justOk && <Icon name="fa-check-circle" className="text-emerald-500 text-sm flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 space-y-3"
                      >
                        <div>
                          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                            {t('ialab.challenge.m5.step2.cause_placeholder')}
                          </label>
                          <AutoGrowTextarea
                            value={justVal}
                            onChange={(v) => updateRootCauseJustification(opt.id, v)}
                            placeholder={t('ialab.challenge.m5.step2.cause_placeholder')}
                            maxLength={300}
                          />
                        </div>

                        {biases.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                              {t('ialab.challenge.m5.step2.connect_biases')}
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {biases.map((b) => {
                                const isConnected = connectedBiases.includes(b.index);
                                return (
                                  <button
                                    key={b.index}
                                    onClick={() => toggleBiasConnection(opt.id, b.index)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                      isConnected
                                        ? 'bg-amber-500 text-white border-amber-500'
                                        : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-amber-300'
                                    }`}
                                  >
                                    {b.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div className="space-y-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Icon name="fa-th" className="text-blue-500" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t('ialab.challenge.m5.step2.severity_matrix')}
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs text-slate-500 dark:text-slate-400 pb-2 pr-3 font-medium">
                    {t('ialab.challenge.m5.step2.impact_title')}
                  </th>
                  {ROOT_CAUSE_OPTIONS.map((cause) => (
                    <th key={cause.id} className="text-center text-xs text-slate-500 dark:text-slate-400 pb-2 px-2 font-medium">
                      {t(cause.labelKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AFFECTED_GROUPS.map((group) => (
                  <tr key={group.id}>
                    <td className="text-xs font-medium text-slate-600 dark:text-slate-300 pr-3 py-1.5 whitespace-nowrap">
                      {t(group.impactLabelKey)}
                    </td>
                    {ROOT_CAUSE_OPTIONS.map((cause) => {
                      const key = `${group.id}-${cause.id}`;
                      const val = form.severityMatrix[key] || null;
                      return (
                        <td key={cause.id} className="px-1 py-1">
                          <button
                            onClick={() => cycleSeverity(group.id, cause.id)}
                            className={`w-full px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              val ? severityColors[val] : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {val ? t(`ialab.challenge.m5.step2.matrix_${val}`) : '—'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <StepFeedback
        completed={impactFilled + causesFilled + (matrixFilled > 0 ? 1 : 0)}
        total={3 + ROOT_CAUSE_OPTIONS.length}
        hints={[t('ialab.challenge.m5.step2_howto_desc')]}
        t={t}
      />
    </div>
  );
};

export default EthicsStep2;
