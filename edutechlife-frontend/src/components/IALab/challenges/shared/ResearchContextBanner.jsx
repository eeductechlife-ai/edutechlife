import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';

const ResearchContextBanner = ({ topic, stepNumber, locale = 'es' }) => {
  if (!topic) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-petroleum/5 to-corporate/5 dark:from-petroleum-dark/20 dark:to-corporate-dark/10 rounded-xl border border-corporate/20 dark:border-corporate-dark/20 mb-6"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
        <Icon name="fa-flask" className="text-white text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-corporate dark:text-corporate-dark uppercase tracking-wider">
          {locale === 'en' ? 'Researching' : 'Investigando'}
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{topic}</p>
      </div>
      <div className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
        {locale === 'en' ? `Step ${stepNumber}` : `Paso ${stepNumber}`}
      </div>
    </motion.div>
  );
};

export default ResearchContextBanner;
