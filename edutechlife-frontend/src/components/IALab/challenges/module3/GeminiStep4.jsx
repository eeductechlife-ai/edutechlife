import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Icon } from '../../../../utils/iconMapping.jsx';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';

const SECTION_ICONS = {
  'Introducción': 'fa-book-open',
  'Metodología': 'fa-flask',
  'Hallazgos': 'fa-search',
  'Verificación de fuentes': 'fa-shield-check',
  'Conclusiones': 'fa-flag',
};

const SECTION_COLORS = {
  'Introducción': 'from-blue-400 to-blue-600',
  'Metodología': 'from-violet-400 to-violet-600',
  'Hallazgos': 'from-emerald-400 to-emerald-600',
  'Verificación de fuentes': 'from-amber-400 to-amber-600',
  'Conclusiones': 'from-rose-400 to-rose-600',
};

const EXAMPLE_MAP = {
  'Introducción': 'ialab.challenge.m3.step4_example_intro',
  'Metodología': 'ialab.challenge.m3.step4_example_methodology',
  'Hallazgos': 'ialab.challenge.m3.step4_example_findings',
  'Verificación de fuentes': 'ialab.challenge.m3.step4_example_verification',
  'Conclusiones': 'ialab.challenge.m3.step4_example_conclusions',
};

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const GeminiStep4 = ({ exercise, response, onResponseChange, t: tProp, topic = '' }) => {
  const { t, locale } = useTranslation();
  const translate = tProp || t;
  const shouldReduceMotion = useReducedMotion();

  const secciones = useMemo(() => exercise?.informeTemplate?.secciones || [], [exercise]);

  const defaultSections = useMemo(() => {
    if (secciones.length) return secciones;
    return ['Introducción', 'Metodología', 'Hallazgos', 'Verificación de fuentes', 'Conclusiones'];
  }, [secciones]);

  const [expanded, setExpanded] = useState({});
  const [sections, setSections] = useState({});

  useEffect(() => {
    if (response) {
      try {
        const parsed = JSON.parse(response);
        if (parsed.sections) {
          setSections(parsed.sections);
          const expandedState = {};
          Object.keys(parsed.sections).forEach((key) => { expandedState[key] = true; });
          setExpanded(expandedState);
        }
      } catch {}
    } else {
      const initial = {};
      const expandedState = {};
      defaultSections.forEach((s) => {
        const key = typeof s === 'string' ? s : (s.titulo || s);
        initial[key] = '';
        expandedState[key] = key === defaultSections[0];
      });
      setSections(initial);
      setExpanded(expandedState);
    }
  }, [response]);

  const updateSection = (key, value) => {
    const next = { ...sections, [key]: value };
    setSections(next);
    onResponseChange(JSON.stringify({ sections: next }));
  };

  const toggleExpanded = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = defaultSections.filter((s) => {
    const key = typeof s === 'string' ? s : (s.titulo || s);
    return sections[key] && sections[key].trim().length > 0;
  }).length;

  if (!defaultSections.length) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500">
        <Icon name="fa-file-alt" className="mr-2" />
        {translate('ialab.challenge.m3.step4_no_sections')}
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
            <Icon name="fa-file-alt" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{translate('ialab.challenge.m3.step4_title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{translate('ialab.challenge.m3.step4_subtitle')}</p>
          </div>
        </div>
      </motion.div>

      <ResearchContextBanner topic={topic} stepNumber={4} locale={locale} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {translate('ialab.challenge.m3.step4_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          {translate('ialab.challenge.m3.step4_howto_desc')}
        </p>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="grid grid-cols-1 gap-3"
      >
        {defaultSections.map((section) => {
          const key = typeof section === 'string' ? section : (section.titulo || section);
          const iconName = SECTION_ICONS[key] || 'fa-file';
          const gradient = SECTION_COLORS[key] || 'from-petroleum to-corporate';
          const isExpanded = expanded[key];
          const content = sections[key] || '';

          return (
            <motion.div
              key={key}
              variants={shouldReduceMotion ? undefined : sectionVariants}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-shadow hover:shadow-md dark:shadow-slate-900/30"
            >
              <button
                onClick={() => toggleExpanded(key)}
                className="w-full flex items-center justify-between p-4 text-left"
                aria-expanded={isExpanded}
                aria-controls={`section-${key}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={iconName} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{key}</h4>
                    {!isExpanded && content ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{content}</p>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {content
                          ? translate('ialab.challenge.m3.step4_filled')
                          : translate('ialab.challenge.m3.step4_empty')}
                      </p>
                    )}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-2"
                >
                  <Icon name="fa-chevron-down" className="text-slate-400 dark:text-slate-500" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-100 dark:border-slate-700"
                    id={`section-${key}`}
                  >
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mt-3 mb-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {translate('ialab.challenge.m3.step4_placeholder', { section: key })}
                        </label>
                        <span className={`text-xs font-medium ${
                          content.length > 0 ? 'text-corporate dark:text-corporate-dark' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {content.length} {translate('ialab.challenge.m3.step4_char_label')}
                        </span>
                      </div>
                      <AutoGrowTextarea
                        value={content}
                        onChange={(v) => updateSection(key, v)}
                        placeholder={translate('ialab.challenge.m3.step4_placeholder', { section: key })}
                        maxLength={2000}
                      />
                      <ExampleToggle example={translate(EXAMPLE_MAP[key] || '')} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-br from-petroleum/5 to-corporate/5 dark:from-petroleum-dark/10 dark:to-corporate-dark/5 rounded-xl p-5 border border-petroleum/10 dark:border-petroleum-dark/20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon name="fa-lightbulb" className="text-amber-500" />
          <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{translate('ialab.challenge.m3.step4_tip_title')}</h4>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{translate('ialab.challenge.m3.step4_tip_desc')}</p>
      </motion.div>

      <StepFeedback
        completed={completedCount}
        total={defaultSections.length}
        hints={[translate('ialab.challenge.m3.step4_howto_desc')]}
        t={translate}
      />
    </div>
  );
};

export default GeminiStep4;
