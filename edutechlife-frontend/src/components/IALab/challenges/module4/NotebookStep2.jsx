import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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

const TABLE_ROWS = [
  { key: 'hallazgo', labelKey: 'ialab.challenge.m4.step2.table_hallazgo' },
  { key: 'implicacion', labelKey: 'ialab.challenge.m4.step2.table_implicacion' },
  { key: 'limitacion', labelKey: 'ialab.challenge.m4.step2.table_limitacion' },
];

const buildEmptyData = (count) => ({
  quotes: Array(count).fill(''),
  table: {
    hallazgo: Array(count).fill(''),
    implicacion: Array(count).fill(''),
    limitacion: Array(count).fill(''),
  },
  synthesis: '',
});

const defaultResponse = JSON.stringify(buildEmptyData(0));

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const NotebookStep2 = ({ exercise, response, onResponseChange, topic = '', docCount = 0, selectedDocs = [] }) => {
  const { t, locale } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const parseResponse = useCallback(() => {
    if (!response) return buildEmptyData(selectedDocs.length);
    try {
      const parsed = JSON.parse(response);
      const count = selectedDocs.length;
      const quotes = Array.isArray(parsed.quotes) && parsed.quotes.length === count
        ? parsed.quotes : Array(count).fill('');
      const table = {
        hallazgo: Array.isArray(parsed.table?.hallazgo) && parsed.table.hallazgo.length === count
          ? parsed.table.hallazgo : Array(count).fill(''),
        implicacion: Array.isArray(parsed.table?.implicacion) && parsed.table.implicacion.length === count
          ? parsed.table.implicacion : Array(count).fill(''),
        limitacion: Array.isArray(parsed.table?.limitacion) && parsed.table.limitacion.length === count
          ? parsed.table.limitacion : Array(count).fill(''),
      };
      return { quotes, table, synthesis: parsed.synthesis || '' };
    } catch {
      return buildEmptyData(selectedDocs.length);
    }
  }, [response, selectedDocs.length]);

  const [data, setData] = useState(parseResponse);

  useEffect(() => {
    setData(parseResponse());
  }, [parseResponse]);

  const sync = (next) => {
    setData(next);
    onResponseChange(JSON.stringify(next));
  };

  const updateQuote = (idx, value) => {
    const quotes = [...data.quotes];
    quotes[idx] = value;
    sync({ ...data, quotes });
  };

  const updateTable = (rowKey, colIdx, value) => {
    const table = { ...data.table };
    table[rowKey] = [...table[rowKey]];
    table[rowKey][colIdx] = value;
    sync({ ...data, table });
  };

  const updateSynthesis = (value) => {
    sync({ ...data, synthesis: value });
  };

  const quoteCount = data.quotes.filter(q => q.trim().length > 0).length;
  const synthesisDone = data.synthesis.trim().length > 0;

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={2} completedSteps={{ step1: true }} t={t} steps={M4_STEPS} />

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-compress" className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step2.title')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('ialab.challenge.m4.step2.subtitle')}</p>
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
            {t('ialab.challenge.m4.step2_howto_title')}
          </h4>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
          {t('ialab.challenge.m4.step2_howto_desc')}
        </p>
        <ExampleToggle example={t('ialab.challenge.m4.step2_example_answer')} />
      </motion.div>

      {selectedDocs.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 items-center"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t('ialab.challenge.m4.step2.doc_context_selected')}
          </span>
          {selectedDocs.map((d) => (
            <span
              key={d.index}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-corporate/10 dark:bg-corporate-dark/20 text-corporate dark:text-corporate-dark text-xs rounded-full"
            >
              <Icon name="fa-file" className="w-3 h-3" />
              <span className="max-w-[120px] truncate">{d.title}</span>
            </span>
          ))}
        </motion.div>
      )}

      {selectedDocs.length > 0 ? (
        <div className="space-y-8">
          <motion.div
            variants={shouldReduceMotion ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            className="space-y-4"
          >
            {selectedDocs.map((doc, idx) => (
              <motion.div
                key={doc.index}
                variants={shouldReduceMotion ? undefined : itemVariants}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate-dark/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="fa-quote-right" className="text-corporate dark:text-corporate-dark w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{doc.title}</p>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {t('ialab.challenge.m4.step2.quote_for_doc')} {idx + 1}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {(data.quotes[idx] || '').length}/200
                  </span>
                </div>
                <AutoGrowTextarea
                  value={data.quotes[idx] || ''}
                  onChange={(v) => updateQuote(idx, v)}
                  placeholder={t('ialab.challenge.m4.step2.quote_placeholder')}
                  maxLength={200}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate-dark/20 flex items-center justify-center">
                <Icon name="fa-table" className="text-corporate dark:text-corporate-dark w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step2.table_title')}</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-28"></th>
                    {selectedDocs.map((doc, idx) => (
                      <th key={doc.index} className="p-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[140px]">
                        <div className="truncate max-w-[140px]">{t('ialab.challenge.m4.step2.table_thead_doc')} {idx + 1}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.key}>
                      <td className="p-2 align-top">
                        <span className="inline-block px-2 py-1 bg-corporate/10 dark:bg-corporate-dark/20 text-corporate dark:text-corporate-dark text-xs font-medium rounded-lg">
                          {t(row.labelKey)}
                        </span>
                      </td>
                      {selectedDocs.map((doc, colIdx) => (
                        <td key={doc.index} className="p-1">
                          <AutoGrowTextarea
                            value={data.table[row.key][colIdx] || ''}
                            onChange={(v) => updateTable(row.key, colIdx, v)}
                            placeholder={`${t(row.labelKey)}`}
                            maxLength={150}
                            className="min-h-[60px]"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-petroleum/5 to-corporate/5 dark:from-petroleum-dark/10 dark:to-corporate-dark/5 rounded-xl border border-corporate/20 dark:border-corporate-dark/20 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-corporate/10 dark:bg-corporate-dark/20 flex items-center justify-center">
                <Icon name="fa-file-text" className="text-corporate dark:text-corporate-dark w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('ialab.challenge.m4.step2.synthesis_title')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('ialab.challenge.m4.step2.synthesis_desc')}</p>
              </div>
              {synthesisDone && (
                <Icon name="fa-check-circle" className="text-emerald-500 text-lg ml-auto" />
              )}
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {docCount > 0
                    ? `${t('ialab.challenge.m4.doc_context_label')}: ${docCount}`
                    : ''}
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {data.synthesis.length}/300
              </span>
            </div>
            <AutoGrowTextarea
              value={data.synthesis}
              onChange={(v) => updateSynthesis(v)}
              placeholder={t('ialab.challenge.m4.step2.synthesis_placeholder')}
              maxLength={300}
            />
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl"
        >
          <Icon name="fa-question-circle" className="text-slate-300 dark:text-slate-600 text-3xl mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">{t('ialab.challenge.m4.step2.no_questions')}</p>
        </motion.div>
      )}

      <StepFeedback
        completed={quoteCount + (synthesisDone ? 1 : 0)}
        total={selectedDocs.length + (selectedDocs.length > 0 ? 1 : 0)}
        hints={[t('ialab.challenge.m4.step2_howto_desc')]}
        t={t}
      />
    </div>
  );
};

export default NotebookStep2;
