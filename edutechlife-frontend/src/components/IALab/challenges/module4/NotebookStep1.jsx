import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import AutoGrowTextarea from '../../challenges/shared/AutoGrowTextarea';
import StepFeedback from '../../challenges/shared/StepFeedback';
import ExampleToggle from '../../challenges/shared/ExampleToggle';
import ResearchContextBanner from '../../challenges/shared/ResearchContextBanner';
import ProgressStepper from '../../challenges/shared/ProgressStepper';

const tipoIconMap = {
  articulo: 'fa-file-text',
  pdf: 'fa-file-pdf',
  enlace: 'fa-external-link',
  nota: 'fa-bookmark',
  video: 'fa-video',
};

const CATEGORIES = [
  { key: 'cientifica', labelKey: 'ialab.challenge.m4.step1.category_cientifica' },
  { key: 'practico', labelKey: 'ialab.challenge.m4.step1.category_practico' },
  { key: 'teorico', labelKey: 'ialab.challenge.m4.step1.category_teorico' },
  { key: 'complementario', labelKey: 'ialab.challenge.m4.step1.category_complementario' },
];

const M4_STEPS = [
  { key: 'step1', icon: 'fa-bookmark', labelKey: 'ialab.challenge.m4.step1_title' },
  { key: 'step2', icon: 'fa-compress', labelKey: 'ialab.challenge.m4.step2_title' },
  { key: 'step3', icon: 'fa-microphone', labelKey: 'ialab.challenge.m4.step3_title' },
];

const defaultResponse = { documents: [] };

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const NotebookStep1 = ({ exercise, response, onResponseChange, topic = '' }) => {
  const { t, locale } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const documentos = exercise?.documentos || [];
  const insightRefs = useRef({});

  const parseResponse = useCallback(() => {
    if (!response) return { documents: [] };
    try {
      const parsed = JSON.parse(response);
      return { documents: parsed.documents || [] };
    } catch {
      return { documents: [] };
    }
  }, [response]);

  const [data, setData] = useState(parseResponse);

  useEffect(() => {
    setData(parseResponse());
  }, [parseResponse]);

  const sync = (next) => {
    setData(next);
    onResponseChange(JSON.stringify(next));
  };

  const isSelected = (index) => data.documents.some((d) => d.index === index);
  const selectedCount = data.documents.length;
  const maxReached = selectedCount >= 4;

  const toggleDocument = (index) => {
    if (isSelected(index)) {
      sync({ documents: data.documents.filter((d) => d.index !== index) });
    } else if (!maxReached) {
      sync({ documents: [...data.documents, { index, rank: 1, category: '', insight: '' }] });
      setTimeout(() => {
        const el = insightRefs.current[index];
        if (el) el.focus();
      }, 100);
    }
  };

  const updateDocField = (index, field, value) => {
    sync({
      documents: data.documents.map((d) =>
        d.index === index ? { ...d, [field]: value } : d
      ),
    });
  };

  const removeDoc = (index) => {
    sync({ documents: data.documents.filter((d) => d.index !== index) });
  };

  const docsWithAllFields = data.documents.filter(
    (d) => d.rank && d.category && d.insight.trim().length > 0
  ).length;
  const allDone = selectedCount > 0 && docsWithAllFields >= selectedCount;

  const [expandedContent, setExpandedContent] = useState({});
  const toggleContent = (index) => {
    setExpandedContent(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={1} completedSteps={{}} t={t} steps={M4_STEPS} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-bookmark" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step1.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('ialab.challenge.m4.step1.subtitle')}</p>
          </div>
        </div>
      </motion.div>

      <ResearchContextBanner topic={topic} stepNumber={1} locale={locale} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon name="fa-lightbulb" className="text-amber-500 dark:text-amber-400 text-sm" />
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            {t('ialab.challenge.m4.step1_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {t('ialab.challenge.m4.step1_howto_desc')}
        </p>
        <ExampleToggle example={t('ialab.challenge.m4.step1_example_insight')} />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step1.documents_title')}</h4>
        <span className={`text-sm font-medium ${maxReached ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {selectedCount}/4 {t('ialab.challenge.m4.step1.selected')}
        </span>
      </motion.div>

      <AnimatePresence>
        {maxReached && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl flex items-center gap-2"
          >
            <Icon name="fa-info-circle" className="text-amber-500 dark:text-amber-400 text-sm" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">{t('ialab.challenge.m4.step1.max_reached')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        className="grid grid-cols-1 gap-4 items-start"
      >
        {documentos.map((doc, index) => {
          const selected = isSelected(index);
          const entry = data.documents.find((d) => d.index === index);
          const insightOk = entry?.insight?.trim().length > 0;
          const hasCategory = entry?.category?.length > 0;
          return (
            <motion.div
              key={index}
              variants={shouldReduceMotion ? undefined : itemVariants}
              transition={{ duration: 0.3 }}
              className={`bg-white dark:bg-slate-800 rounded-xl border-2 transition-all duration-200 ${
                selected
                  ? 'border-corporate dark:border-corporate-dark shadow-md shadow-corporate/10 dark:shadow-corporate-dark/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <label className="relative flex items-center cursor-pointer mt-1" aria-label={`Select ${doc.titulo}`}>
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={!selected && maxReached}
                      onChange={() => toggleDocument(index)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selected
                          ? 'bg-corporate dark:bg-corporate-dark border-corporate dark:border-corporate-dark'
                          : 'border-slate-300 dark:border-slate-600'
                      } ${!selected && maxReached ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      {selected && <Icon name="fa-check" className="text-white w-3 h-3" />}
                    </div>
                  </label>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-corporate/10 dark:bg-corporate-dark/20 flex items-center justify-center flex-shrink-0">
                        <Icon
                          name={tipoIconMap[doc.tipo] || 'fa-file'}
                          className="text-corporate dark:text-corporate-dark w-4 h-4"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{doc.titulo}</p>
                        <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-full capitalize">
                          {doc.tipo === 'articulo' ? t('ialab.challenge.m4.step1.tipo_articulo') :
                           doc.tipo === 'pdf' ? t('ialab.challenge.m4.step1.tipo_pdf') :
                           doc.tipo === 'enlace' ? t('ialab.challenge.m4.step1.tipo_enlace') :
                           doc.tipo === 'nota' ? t('ialab.challenge.m4.step1.tipo_nota') :
                           doc.tipo === 'video' ? t('ialab.challenge.m4.step1.tipo_video') :
                           doc.tipo}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${expandedContent[index] ? '' : 'line-clamp-2'}`}>
                      {doc.contenido}
                    </p>
                    <button
                      onClick={() => toggleContent(index)}
                      className="text-xs font-medium text-corporate dark:text-corporate-dark hover:underline mt-1"
                    >
                      {expandedContent[index] ? t('ialab.challenge.m4.step1.hide_content') : t('ialab.challenge.m4.step1.show_content')}
                    </button>

                    {selected && entry && (
                      <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 ml-0 space-y-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                              {t('ialab.challenge.m4.step1.rank_label')}
                            </label>
                            <select
                              value={entry.rank || 1}
                              onChange={(e) => updateDocField(index, 'rank', parseInt(e.target.value))}
                              className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-corporate"
                            >
                              {[1, 2, 3, 4].map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                              {t('ialab.challenge.m4.step1.category_label')}
                            </label>
                            <select
                              value={entry.category || ''}
                              onChange={(e) => updateDocField(index, 'category', e.target.value)}
                              className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-corporate"
                            >
                              <option value="">---</option>
                              {CATEGORIES.map((cat) => (
                                <option key={cat.key} value={cat.key}>{t(cat.labelKey)}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {t('ialab.challenge.m4.step1.insight_label')}
                              </label>
                              {insightOk && hasCategory && (
                                <Icon name="fa-check-circle" className="text-emerald-500 text-sm" />
                              )}
                            </div>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {(entry?.insight || '').length}/150
                            </span>
                          </div>
                          <AutoGrowTextarea
                            ref={(el) => { insightRefs.current[index] = el; }}
                            value={entry?.insight || ''}
                            onChange={(v) => updateDocField(index, 'insight', v)}
                            placeholder={t('ialab.challenge.m4.step1.insight_placeholder')}
                            maxLength={150}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {documentos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl"
        >
          <Icon name="fa-file" className="text-slate-300 dark:text-slate-600 text-3xl mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">{t('ialab.challenge.m4.step1.no_documents')}</p>
        </motion.div>
      )}

      {selectedCount > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 items-center"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t('ialab.challenge.m4.step1.selected_docs')}:
          </span>
          {data.documents.map((d) => {
            const doc = documentos[d.index];
            if (!doc) return null;
            return (
              <span
                key={d.index}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-corporate/10 dark:bg-corporate-dark/20 text-corporate dark:text-corporate-dark text-xs rounded-full font-medium"
              >
                <Icon name="fa-file" className="w-3 h-3" />
                <span className="max-w-[120px] truncate">{doc.titulo}</span>
                <button
                  onClick={() => removeDoc(d.index)}
                  className="ml-0.5 w-4 h-4 rounded-full hover:bg-corporate/20 dark:hover:bg-corporate-dark/30 flex items-center justify-center transition-colors"
                  aria-label={`Remove ${doc.titulo}`}
                >
                  <Icon name="fa-times" className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </motion.div>
      )}

      <StepFeedback
        completed={selectedCount > 0 ? docsWithAllFields : 0}
        total={selectedCount || 1}
        hints={[t('ialab.challenge.m4.step1_howto_desc')]}
        t={t}
      />
    </div>
  );
};

export default NotebookStep1;
