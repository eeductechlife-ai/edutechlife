import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping.jsx';

const M2_STEPS = [
  { key: 'step1', icon: 'fa-search', labelKey: 'ialab.challenge.m2.step1_title' },
  { key: 'step2', icon: 'fa-cog', labelKey: 'ialab.challenge.m2.step2_title' },
  { key: 'step3', icon: 'fa-plug', labelKey: 'ialab.challenge.m2.step3_title' },
];

const ProgressStepper = ({ currentStep, completedSteps = {}, t, steps }) => {
  const STEPS = steps || M2_STEPS;
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = currentStep === stepNum;
        const isCompleted = completedSteps[step.key];

        return (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: isActive ? 1 : 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400'
                    : isActive
                    ? 'bg-corporate/5 border-corporate text-corporate dark:bg-corporate/10 dark:border-mint dark:text-mint'
                    : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-500'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-corporate text-white'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                }`}>
                  {isCompleted ? (
                    <Icon name="fa-check" className="text-xs" />
                  ) : (
                    <span className="text-xs font-bold">{stepNum}</span>
                  )}
                </div>
                <span className="text-xs font-semibold hidden sm:inline whitespace-nowrap">
                  {t(step.labelKey)}
                </span>
              </motion.div>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full ${
                isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
