import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';

const StepFeedback = ({ completed, total, hints = [], t }) => {
  if (completed === undefined) return null;
  const allDone = completed >= total;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 rounded-xl border"
      >
        {allDone ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Icon name="fa-check-circle" className="text-emerald-500 text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700">{t('ialab.challenge.m2.step_completed')}</p>
              <p className="text-xs text-emerald-600">{t('ialab.challenge.m2.step_completed_desc')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-corporate rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">{completed}/{total}</span>
            </div>
            {hints.length > 0 && completed < total && (
              <div className="text-xs text-slate-500">
                <p className="font-medium text-slate-600 mb-1">{t('ialab.challenge.m2.step_tips_label')}</p>
                <ul className="space-y-1">
                  {hints.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Icon name="fa-lightbulb" className="text-amber-400 text-xs mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StepFeedback;
