import { useState } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { FileText, Mail, Bot, Star, MessageSquare, Database, CheckCircle, ArrowRight } from 'lucide-react';
import { Button, Card } from '../shared';


ActivityBuilder.propTypes = {
  onNext: PropTypes.func,
  addXp: PropTypes.func,
};

export default function ActivityBuilder({ onNext, addXp }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({ trigger: null, ai: null, dest: null });

  const handleSelect = (type, val) => {
    setSelections({ ...selections, [type]: val });
    setTimeout(() => {
      if (step < 3) setStep(step + 1);
      else addXp(200);
    }, 500);
  };

  const triggers = [
    { id: 'form', icon: FileText, text: t('ova.buildgpt.form') },
    { id: 'email', icon: Mail, text: t('ova.buildgpt.email') },
  ];
  const actions = [
    { id: 'summary', icon: Bot, text: t('ova.buildgpt.summary') },
    { id: 'sentiment', icon: Star, text: t('ova.buildgpt.sentiment') },
  ];
  const destinations = [
    { id: 'slack', icon: MessageSquare, text: t('ova.buildgpt.slack_dest') },
    { id: 'sheets', icon: Database, text: t('ova.buildgpt.sheets_dest') },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm mb-3">{t('ova.buildgpt.activity_badge')}</span>
        <h2 className="text-3xl font-bold text-[var(--theme-emphasis)]">{t('ova.buildgpt.activity_title')}</h2>
        <p className="text-gray-600 dark:text-slate-300 mt-2">{t('ova.buildgpt.activity_desc')}</p>
      </div>
      <Card className="mb-8">
        <div className="flex justify-between items-center mb-8 relative" role="group" aria-label={t('ova.buildgpt.activity_title')}>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700/50 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map(i => (
            <div key={i} aria-current={step === i ? 'step' : undefined} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= i ? 'bg-[var(--theme-primary)] text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
              {i}
            </div>
          ))}
        </div>
        {step === 1 && (
          <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
            <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-slate-300">{t('ova.buildgpt.activity_step1')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {triggers.map(t => (
                <button key={t.id} onClick={() => handleSelect('trigger', t.text)} aria-pressed={selections.trigger === t.text} className="p-6 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-[var(--theme-primary)] hover:bg-cyan-50 dark:hover:bg-cyan-900/20 flex flex-col items-center gap-3 transition-all">
                  <t.icon size={32} className="text-[var(--theme-emphasis)]" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
            <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-slate-300">{t('ova.buildgpt.activity_step2')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actions.map(a => (
                <button key={a.id} onClick={() => handleSelect('ai', a.text)} aria-pressed={selections.ai === a.text} className="p-6 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-[var(--theme-primary)] hover:bg-green-50 dark:hover:bg-green-900/20 flex flex-col items-center gap-3 transition-all">
                  <a.icon size={32} className="text-[var(--theme-primary)]" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{a.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && !selections.dest && (
          <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
            <h3 className="text-xl font-bold text-center mb-6 text-slate-700 dark:text-slate-300">{t('ova.buildgpt.activity_step3')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destinations.map(d => (
                <button key={d.id} onClick={() => handleSelect('dest', d.text)} aria-pressed={selections.dest === d.text} className="p-6 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex flex-col items-center gap-3 transition-all">
                  <d.icon size={32} className="text-purple-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{d.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {selections.dest && (
          <div className="text-center animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[var(--theme-emphasis)] mb-4">{t('ova.buildgpt.activity_done_title')}</h3>
            <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-xl border dark:border-slate-600 inline-flex flex-col md:flex-row items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
              <span>{selections.trigger}</span>
              <ArrowRight className="hidden md:block text-slate-300 dark:text-slate-600"/>
              <span className="text-[var(--theme-primary)]">{selections.ai}</span>
              <ArrowRight className="hidden md:block text-slate-300 dark:text-slate-600"/>
              <span>{selections.dest}</span>
            </div>
            <p className="mt-4 text-gray-500 dark:text-slate-400 text-sm">{t('ova.buildgpt.activity_done_desc')}</p>
            <div className="mt-8">
              <Button onClick={onNext} className="mx-auto text-lg px-8">{t('ova.buildgpt.activity_final_btn')}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
