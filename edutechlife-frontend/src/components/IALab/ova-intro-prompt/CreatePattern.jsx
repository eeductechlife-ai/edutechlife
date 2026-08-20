import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../../i18n/I18nProvider';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const CreatePattern = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const createSteps = [
    { letter: 'C', key: 'c', color: 'bg-[var(--theme-emphasis)]' },
    { letter: 'R', key: 'r', color: 'bg-[var(--theme-primary)]' },
    { letter: 'E', key: 'e', color: 'bg-[#4361EE]' },
    { letter: 'A', key: 'a', color: 'bg-[#4CC9F0]' },
    { letter: 'T', key: 't', color: 'bg-[#F72585]' },
    { letter: 'E', key: 'e2', color: 'bg-[#FF9F1C]' },
  ];
  const isLast = step >= createSteps.length;

  if (isLast) {
    return (
      <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
        <div className="p-5 bg-gradient-to-br from-emerald-50 to-white rounded-[2rem] border-2 border-emerald-200 dark:border-slate-700 shadow-md text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="text-[var(--theme-emphasis)] font-[900] text-lg tracking-tighter lowercase mb-2">{t('ova.introprompt.create_result_title')}</h4>
          <p className="text-xs text-slate-500 mb-4">{t('ova.introprompt.create_result_desc')}</p>
          <div className="bg-[var(--theme-emphasis)] text-white p-4 rounded-xl text-left text-xs leading-relaxed font-medium">
            {t('ova.introprompt.create_prompt_result')}
          </div>
        </div>
      </div>
    );
  }

  const cs = createSteps[step];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('ova.introprompt.create_step')} {step + 1} / 6</span>
        <div className="flex gap-1" role="group" aria-label={t('ova.introprompt.create_step')}>
          {createSteps.map((s, i) => (
            <div key={i} aria-hidden="true" className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-[var(--theme-emphasis)]' : i < step ? 'w-2 bg-[var(--theme-primary)]' : 'w-2 bg-slate-200 dark:bg-slate-600'}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${cs.color} text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0`}>
          <span className="text-2xl font-black">{cs.letter}</span>
        </div>
        <div>
          <h4 className="font-[900] text-[var(--theme-emphasis)] text-lg tracking-tighter lowercase">{t(`ova.introprompt.create_${cs.key}`)}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-medium">{t(`ova.introprompt.create_${cs.key}_desc`)}</p>
        </div>
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
        <p className="text-xs text-slate-500 dark:text-slate-300 font-bold mb-1 uppercase tracking-wider">Ejemplo</p>
        <p className="text-sm text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)] font-mono font-medium leading-relaxed">{t(`ova.introprompt.create_${cs.key}_example`)}</p>
      </div>
      <button onClick={() => setStep(step + 1)}
        aria-label={t('ova.introprompt.create_next')}
        className="w-full py-3 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white font-black rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
        {t('ova.introprompt.create_next')} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

CreatePattern.propTypes = {};

export default CreatePattern;
