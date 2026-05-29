import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';

const SOURCE_TYPE_ICONS = {
  article: 'fa-file-text',
  tweet: 'fa-message',
  grafico: 'fa-chart-bar',
  paper: 'fa-book-open',
};

const SOURCE_TYPE_COLORS = {
  article: 'text-blue-500 bg-blue-50 border-blue-200',
  tweet: 'text-sky-500 bg-sky-50 border-sky-200',
  grafico: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  paper: 'text-violet-500 bg-violet-50 border-violet-200',
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const GeminiStep2 = ({ exercise, response, onResponseChange, t: tProp, topic = '' }) => {
  const { t, locale } = useTranslation();
  const translate = tProp || t;
  const shouldReduceMotion = useReducedMotion();

  const fuentes = useMemo(() => exercise?.fuentes || [], [exercise]);

  const [sources, setSources] = useState(() =>
    fuentes.map((_, i) => ({ index: i, isRelevant: false, keyData: '' }))
  );

  useEffect(() => {
    if (response) {
      try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed.sources)) setSources(parsed.sources);
      } catch {}
    }
  }, [response]);

  const updateSource = (index, patch) => {
    const next = sources.map((s, i) => (i === index ? { ...s, ...patch } : s));
    setSources(next);
    onResponseChange(JSON.stringify({ sources: next }));
  };

  const evaluatedCount = sources.filter(s =>
    s.isRelevant ? s.keyData.trim().length > 0 : true
  ).length;

  if (!fuentes.length) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500">
        <Icon name="fa-file-text" className="mr-2" />
        {translate('ialab.challenge.m3.step2_no_sources')}
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
            <Icon name="fa-file-text" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{translate('ialab.challenge.m3.step2_title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{translate('ialab.challenge.m3.step2_subtitle')}</p>
          </div>
        </div>
      </motion.div>

      <ResearchContextBanner topic={topic} stepNumber={2} locale={locale} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {translate('ialab.challenge.m3.step2_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {translate('ialab.challenge.m3.step2_howto_desc')}
        </p>
        <ExampleToggle example={translate('ialab.challenge.m3.step2_example_data')} />
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="grid grid-cols-1 gap-4"
      >
        {fuentes.map((fuente, i) => {
          const iconName = SOURCE_TYPE_ICONS[fuente.tipo] || 'fa-file';
          const colorClasses = SOURCE_TYPE_COLORS[fuente.tipo] || 'text-slate-500 bg-slate-50 border-slate-200';
          const [iconColor, bgColor, borderColor] = colorClasses.split(' ');
          const source = sources[i] || { index: i, isRelevant: false, keyData: '' };

          return (
            <motion.div
              key={i}
              variants={shouldReduceMotion ? undefined : itemVariants}
              transition={{ duration: 0.3 }}
              className={`rounded-xl border-2 transition-all duration-200 ${
                source.isRelevant
                  ? 'border-corporate/40 dark:border-corporate-dark/40 bg-corporate/[0.03] dark:bg-corporate-dark/5 shadow-md shadow-corporate/5 dark:shadow-corporate-dark/10'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${bgColor} dark:opacity-80 ${borderColor} dark:border-slate-600 border flex items-center justify-center flex-shrink-0`}>
                    <Icon name={iconName} className={iconColor} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">{fuente.titulo}</h4>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                          {fuente.tipo}
                        </span>
                      </div>

                      <label className={`relative inline-flex items-center cursor-pointer flex-shrink-0 ${
                        source.isRelevant ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`} aria-label={`Mark as ${source.isRelevant ? 'irrelevant' : 'relevant'}`}>
                        <input
                          type="checkbox"
                          checked={source.isRelevant}
                          onChange={(e) => updateSource(i, { isRelevant: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer transition-colors ${
                          source.isRelevant ? 'bg-corporate dark:bg-corporate-dark' : 'bg-slate-300 dark:bg-slate-600'
                        } peer-focus:ring-2 peer-focus:ring-corporate/30 dark:peer-focus:ring-corporate-dark/30`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                            source.isRelevant ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`} />
                        </div>
                        <span className="ml-2 text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-300">
                          {source.isRelevant
                            ? translate('ialab.challenge.m3.step2_relevant')
                            : translate('ialab.challenge.m3.step2_irrelevant')}
                        </span>
                      </label>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{fuente.contenido}</p>

                    {source.isRelevant && (
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                          {translate('ialab.challenge.m3.step2_keydata_label')}
                        </label>
                        <AutoGrowTextarea
                          value={source.keyData}
                          onChange={(v) => updateSource(i, { keyData: v })}
                          placeholder={translate('ialab.challenge.m3.step2_keydata_placeholder')}
                          maxLength={500}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <StepFeedback
        completed={evaluatedCount}
        total={sources.length}
        hints={[translate('ialab.challenge.m3.step2_howto_desc')]}
        t={translate}
      />
    </div>
  );
};

export default GeminiStep2;
