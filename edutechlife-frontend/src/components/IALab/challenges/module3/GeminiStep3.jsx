import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';
import VerdictSummaryBar from '../../challenges/shared/VerdictSummaryBar';

const VERDICTS = [
  { value: 'verified', labelKey: 'ialab.challenge.m3.step3_verified', icon: 'fa-check-circle', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 active:bg-emerald-200' },
  { value: 'questionable', labelKey: 'ialab.challenge.m3.step3_questionable', icon: 'fa-exclamation-triangle', color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100 active:bg-amber-200' },
  { value: 'unverifiable', labelKey: 'ialab.challenge.m3.step3_unverifiable', icon: 'fa-circle-question', color: 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100 active:bg-slate-200' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const GeminiStep3 = ({ exercise, response, onResponseChange, t: tProp, topic = '' }) => {
  const { t, locale } = useTranslation();
  const translate = tProp || t;
  const shouldReduceMotion = useReducedMotion();

  const afirmaciones = useMemo(() => exercise?.afirmaciones || [], [exercise]);

  const [claims, setClaims] = useState(() =>
    afirmaciones.map((_, i) => ({ claimIndex: i, verdict: null, reasoning: '' }))
  );

  useEffect(() => {
    if (response) {
      try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed.claims)) setClaims(parsed.claims);
      } catch {}
    }
  }, [response]);

  const updateClaim = (index, patch) => {
    const next = claims.map((c, i) => (i === index ? { ...c, ...patch } : c));
    setClaims(next);
    onResponseChange(JSON.stringify({ claims: next }));
  };

  const classifiedCount = claims.filter(c => c.verdict !== null).length;

  if (!afirmaciones.length) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500">
        <Icon name="fa-shield" className="mr-2" />
        {translate('ialab.challenge.m3.step3_no_claims')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-shield" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{translate('ialab.challenge.m3.step3_title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{translate('ialab.challenge.m3.step3_subtitle')}</p>
          </div>
        </div>
      </motion.div>

      <ResearchContextBanner topic={topic} stepNumber={3} locale={locale} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <VerdictSummaryBar claims={claims} t={translate} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {translate('ialab.challenge.m3.step3_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {translate('ialab.challenge.m3.step3_howto_desc')}
        </p>
        <ExampleToggle example={translate('ialab.challenge.m3.step3_example_reasoning')} />
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="grid grid-cols-1 gap-4"
      >
        {afirmaciones.map((afirmacion, i) => {
          const claim = claims[i] || { claimIndex: i, verdict: null, reasoning: '' };

          return (
            <motion.div
              key={i}
              variants={shouldReduceMotion ? undefined : itemVariants}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md dark:shadow-slate-900/30 transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed pt-1">{afirmacion.texto}</p>
                </div>

                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Claim ${i + 1} verdict`}>
                  {VERDICTS.map((v) => {
                    const selected = claim.verdict === v.value;
                    const [txtColor, bgColor, borderColor] = v.color.split(' ');
                    return (
                      <motion.button
                        key={v.value}
                        onClick={() => updateClaim(i, { verdict: selected ? null : v.value })}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          selected
                            ? `${txtColor} ${bgColor} ${borderColor} ring-2 ring-offset-1 ${txtColor.replace('text-', 'ring-')}/30 dark:ring-offset-slate-800`
                            : 'text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                        aria-pressed={selected}
                        aria-label={`${translate(v.labelKey)}${selected ? ' (selected)' : ''}`}
                        role="radio"
                      >
                        <Icon name={v.icon} />
                        {translate(v.labelKey)}
                        {selected && <Icon name="fa-check" className="ml-1" />}
                      </motion.button>
                    );
                  })}
                </div>

                {claim.verdict && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700"
                  >
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      {translate('ialab.challenge.m3.step3_reason_label')}
                    </label>
                    <AutoGrowTextarea
                      value={claim.reasoning}
                      onChange={(v) => updateClaim(i, { reasoning: v })}
                      placeholder={translate('ialab.challenge.m3.step3_reason_placeholder')}
                      maxLength={500}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <StepFeedback
        completed={classifiedCount}
        total={claims.length}
        hints={[translate('ialab.challenge.m3.step3_howto_desc')]}
        t={translate}
      />
    </div>
  );
};

export default GeminiStep3;
