import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../../i18n/I18nProvider';
import { Bug, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

const DetectAndFix = () => {
  const { t } = useTranslation();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFix, setShowFix] = useState(false);
  const [correct, setCorrect] = useState(false);
  const R = [
    { prompt: t('ova.introprompt.detect_r1_prompt') || '"Explícame la fotosíntesis"', errors: ['context', 'format', 'task'], correctIdx: 0 },
    { prompt: t('ova.introprompt.detect_r2_prompt') || '"Eres tutor de matemáticas. Explica fracciones a un niño de 10 años."', errors: ['context', 'format', 'task'], correctIdx: 1 },
    { prompt: t('ova.introprompt.detect_r3_prompt') || '"Eres experto. Dame lección del sistema solar con tabla, 5 preguntas y resumen."', errors: ['context', 'format', 'task'], correctIdx: 2 },
  ];
  const opts = [
    t('ova.introprompt.detect_opt_context'),
    t('ova.introprompt.detect_opt_format'),
    t('ova.introprompt.detect_opt_task'),
  ];
  const fixes = [
    t('ova.introprompt.detect_fix_1'),
    t('ova.introprompt.detect_fix_2'),
    t('ova.introprompt.detect_fix_3'),
  ];
  const handleSelect = (idx) => {
    if (showFix) return;
    setSelected(idx);
    const isCorrect = idx === R[round].correctIdx;
    setCorrect(isCorrect);
    if (isCorrect) setShowFix(true);
  };
  const nextRound = () => {
    if (round < 2) { setRound(round + 1); setSelected(null); setShowFix(false); setCorrect(false); }
  };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">{t('ova.introprompt.detect_desc')}</p>
      <div className="flex items-center gap-2 mb-2">
        <Bug className="w-4 h-4 text-corporate" />
        <span className="text-[10px] font-black text-petroleum uppercase tracking-wider">{t('ova.introprompt.detect_round')} {round + 1} {t('ova.introprompt.detect_of')} 3</span>
      </div>
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-xl">
        <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider mb-2">{t('ova.introprompt.detect_prompt_label')}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200 font-mono font-medium">{R[round].prompt}</p>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{t('ova.introprompt.detect_whats_wrong')}</p>
        {opts.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = showFix && i === R[round].correctIdx;
          const isWrong = isSelected && !correct;
          return (
            <button key={i} onClick={() => handleSelect(i)} aria-pressed={isSelected}
              className={`w-full p-3 rounded-xl border-2 text-left text-xs font-medium transition-all flex items-center justify-between gap-2 ${isCorrectOpt ? 'bg-green-50 border-green-500 text-green-700' : isWrong ? 'bg-red-50 border-red-500 text-red-700' : isSelected ? 'border-corporate bg-blue-50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200'}`}>
              <span>{opt}</span>
              {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
              {isWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
            </button>
          );
        })}
      </div>
      {showFix && (
        <div role="alert" className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-black text-green-700 dark:text-green-300 uppercase tracking-wider">{t('ova.introprompt.detect_fix_label')}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{fixes[round]}</p>
          {round < 2 && (
            <button onClick={nextRound} className="mt-3 px-4 py-2 bg-petroleum text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              {t('ova.introprompt.next')} <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {round === 2 && (
            <p className="mt-3 text-xs font-bold text-green-700 dark:text-green-300">{t('ova.introprompt.detect_complete')}</p>
          )}
        </div>
      )}
    </div>
  );
};

DetectAndFix.propTypes = {};

export default DetectAndFix;
