import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/I18nProvider';
import { Icon } from '../../utils/iconMapping.jsx';

const RESEARCH_TYPES = [
  { id: 'image', icon: 'fa-image', color: 'from-purple-500 to-purple-600', gradient: 'from-purple-50 to-purple-100/50' },
  { id: 'factcheck', icon: 'fa-check-double', color: 'from-emerald-500 to-emerald-600', gradient: 'from-emerald-50 to-emerald-100/50' },
  { id: 'deep', icon: 'fa-compass', color: 'from-blue-500 to-blue-600', gradient: 'from-blue-50 to-blue-100/50' },
];

const ANALYSIS_SAMPLES = {
  image: {
    titleKey: 'ialab.gemini_research.sample_image_title',
    findings: [
      { icon: 'fa-check-circle', color: 'text-emerald-600', key: 'ialab.gemini_research.find_image_1' },
      { icon: 'fa-check-circle', color: 'text-emerald-600', key: 'ialab.gemini_research.find_image_2' },
      { icon: 'fa-shield', color: 'text-amber-600', key: 'ialab.gemini_research.find_image_3' },
      { icon: 'fa-lightbulb', color: 'text-blue-600', key: 'ialab.gemini_research.find_image_4' },
    ],
  },
  factcheck: {
    titleKey: 'ialab.gemini_research.sample_factcheck_title',
    findings: [
      { icon: 'fa-check-circle', color: 'text-emerald-600', key: 'ialab.gemini_research.find_fact_1' },
      { icon: 'fa-check-circle', color: 'text-emerald-600', key: 'ialab.gemini_research.find_fact_2' },
      { icon: 'fa-circle-exclamation', color: 'text-red-600', key: 'ialab.gemini_research.find_fact_3' },
      { icon: 'fa-lightbulb', color: 'text-blue-600', key: 'ialab.gemini_research.find_fact_4' },
    ],
  },
  deep: {
    titleKey: 'ialab.gemini_research.sample_deep_title',
    findings: [
      { icon: 'fa-check-circle', color: 'text-emerald-600', key: 'ialab.gemini_research.find_deep_1' },
      { icon: 'fa-check-circle', color: 'text-emerald-600', key: 'ialab.gemini_research.find_deep_2' },
      { icon: 'fa-shield', color: 'text-amber-600', key: 'ialab.gemini_research.find_deep_3' },
      { icon: 'fa-chart-line', color: 'text-blue-600', key: 'ialab.gemini_research.find_deep_4' },
    ],
  },
};

const StepIndicator = ({ current, total }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: total }, (_, i) => (
      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-petroleum' : i < current ? 'w-2 bg-corporate' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
    ))}
  </div>
);

const OVAGeminiDeepResearch = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);

  const handleStart = () => setStep(1);
  const handleSelectType = (id) => {
    setSelectedType(id);
    setTimeout(() => setStep(2), 400);
  };
  const handleReset = () => {
    setStep(0);
    setSelectedType(null);
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <StepIndicator current={step} total={3} />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
              <Icon name="fa-search" className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-petroleum mb-2">{t('ialab.gemini_research.intro_title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              {t('ialab.gemini_research.intro_desc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
              {[
                { icon: 'fa-image', key: 'ialab.gemini_research.intro_point_1' },
                { icon: 'fa-check-double', key: 'ialab.gemini_research.intro_point_2' },
                { icon: 'fa-compass', key: 'ialab.gemini_research.intro_point_3' },
              ].map((p) => (
                <div key={p.key} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Icon name={p.icon} className="text-corporate w-4 h-4 flex-shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">{t(p.key)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-petroleum to-corporate text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {t('ialab.gemini_research.start_btn')}
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h3 className="text-lg font-bold text-petroleum text-center mb-2">{t('ialab.gemini_research.select_title')}</h3>
            <p className="text-sm text-slate-500 text-center mb-6">{t('ialab.gemini_research.select_desc')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RESEARCH_TYPES.map((rt) => (
                <motion.button
                  key={rt.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectType(rt.id)}
                  className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                    selectedType === rt.id
                      ? 'border-petroleum shadow-md shadow-petroleum/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-petroleum/40 hover:shadow-sm'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${rt.gradient} opacity-50 dark:opacity-20`} />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rt.color} flex items-center justify-center mb-3 shadow-sm`}>
                      <Icon name={rt.icon} className="text-white text-lg" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                      {t(`ialab.gemini_research.type_${rt.id}_title`)}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t(`ialab.gemini_research.type_${rt.id}_desc`)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && selectedType && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${RESEARCH_TYPES.find((t) => t.id === selectedType).color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <Icon name={RESEARCH_TYPES.find((t) => t.id === selectedType).icon} className="text-white text-base" />
              </div>
              <div>
                <h3 className="text-base font-bold text-petroleum">{t(ANALYSIS_SAMPLES[selectedType].titleKey)}</h3>
                <p className="text-xs text-slate-500">{t('ialab.gemini_research.results_subtitle')}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl p-5 mb-5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="fa-shield" className="text-petroleum w-4 h-4" />
                <span className="text-xs font-bold text-petroleum uppercase tracking-wider">{t('ialab.gemini_research.grounding_badge')}</span>
              </div>
              <div className="space-y-2">
                {ANALYSIS_SAMPLES[selectedType].findings.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                  >
                    <Icon name={f.icon} className={`${f.color} w-4 h-4 mt-0.5 flex-shrink-0`} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{t(f.key)}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="fa-file-lines" className="text-corporate w-4 h-4" />
                <span className="text-xs font-bold text-corporate uppercase tracking-wider">{t('ialab.gemini_research.report_badge')}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t('ialab.gemini_research.report_confidence')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${selectedType === 'image' ? 'w-[85%] bg-purple-500' : selectedType === 'factcheck' ? 'w-[72%] bg-emerald-500' : 'w-[91%] bg-blue-500'}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {selectedType === 'image' ? '85%' : selectedType === 'factcheck' ? '72%' : '91%'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t('ialab.gemini_research.report_sources')}</span>
                <span className="text-xs font-bold text-petroleum">
                  {selectedType === 'image' ? '4' : selectedType === 'factcheck' ? '7' : '12'} {t('ialab.gemini_research.report_sources_unit')}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Icon name="fa-rotate" className="mr-2" />
                {t('ialab.gemini_research.try_again')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OVAGeminiDeepResearch;
