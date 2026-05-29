import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';

const VerdictSummaryBar = ({ claims, t }) => {
  const total = claims.length;
  if (!total) return null;
  const verified = claims.filter(c => c.verdict === 'verified').length;
  const questionable = claims.filter(c => c.verdict === 'questionable').length;
  const unverifiable = claims.filter(c => c.verdict === 'unverifiable').length;
  const unclassified = total - verified - questionable - unverifiable;
  const classified = total - unclassified;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t('ialab.challenge.m3.verdict_summary_title')}
        </h4>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {classified}/{total} {t('ialab.challenge.m3.verdict_progress_label')}
        </span>
      </div>

      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
        {verified > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(verified / total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-emerald-500"
            title={`Verified: ${verified}`}
          />
        )}
        {questionable > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(questionable / total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="h-full bg-amber-500"
            title={`Questionable: ${questionable}`}
          />
        )}
        {unverifiable > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unverifiable / total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="h-full bg-slate-400 dark:bg-slate-500"
            title={`Unverifiable: ${unverifiable}`}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-400">
            {t('ialab.challenge.m3.step3_verified')} ({verified})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-400">
            {t('ialab.challenge.m3.step3_questionable')} ({questionable})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="text-slate-600 dark:text-slate-400">
            {t('ialab.challenge.m3.step3_unverifiable')} ({unverifiable})
          </span>
        </div>
      </div>

      {classified === total && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400"
        >
          <Icon name="fa-check-circle" />
          <span className="font-medium">{t('ialab.challenge.m3.verdict_all_classified')}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VerdictSummaryBar;
