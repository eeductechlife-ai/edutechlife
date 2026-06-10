import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../../i18n/I18nProvider';
import { BrainCircuit, Star, Award, AlertTriangle, Rocket, ArrowLeftRight } from 'lucide-react';
import { stopSpeech, speakTextConversational } from '../../../utils/speech';

const FinalChallenge = () => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    if (!audioPlayed) {
      speakTextConversational(t('ova.introprompt.challenge_instructions'), 'valerio', () => {});
      setAudioPlayed(true);
    }
    return () => stopSpeech();
  }, [audioPlayed, t]);

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-5">
      <div className="flex flex-col items-center text-center mb-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-lg mb-4 mt-2">
          <BrainCircuit className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-petroleum uppercase tracking-tighter mb-3">Desafío 1</h3>
        <div className="bg-gradient-to-br from-petroleum/[0.04] to-corporate/[0.04] rounded-2xl p-5 border border-petroleum/10 max-w-lg w-full mb-3">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            {t('ova.introprompt.challenge_instructions')}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-xs w-full mt-4">
          <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-3 text-center border border-petroleum/10">
            <BrainCircuit className="w-4 h-4 text-corporate mx-auto mb-1" />
            <p className="text-[9px] font-semibold text-petroleum uppercase tracking-wider">{t('ova.introprompt.challenge_badge_apply') || 'Aplicar'}</p>
          </div>
          <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-3 text-center border border-petroleum/10">
            <Star className="w-4 h-4 text-amber-500 mx-auto mb-1 fill-amber-500" />
            <p className="text-[9px] font-semibold text-petroleum uppercase tracking-wider">{t('ova.introprompt.challenge_badge_practice') || 'Practicar'}</p>
          </div>
          <div className="bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl p-3 text-center border border-petroleum/10">
            <Award className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-[9px] font-semibold text-petroleum uppercase tracking-wider">{t('ova.introprompt.challenge_badge_challenge') || 'Desafiar'}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700 pt-5">
        <p className="text-sm text-slate-500 dark:text-slate-300 font-bold mb-3">{t('ova.introprompt.challenge_desc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">{t('ova.introprompt.challenge_before_title')}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-mono italic">{t('ova.introprompt.challenge_before')}</p>
          </div>
          {revealed && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl animate-[fadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-green-600" />
                <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">{t('ova.introprompt.challenge_after_title')}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{t('ova.introprompt.challenge_after')}</p>
            </div>
          )}
        </div>
        {!revealed && (
          <button onClick={() => setRevealed(true)}
            className="w-full py-4 bg-gradient-to-r from-petroleum to-corporate text-white font-black rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-lg mt-3">
            <ArrowLeftRight className="w-5 h-5" /> {t('ova.introprompt.challenge_reveal')}
          </button>
        )}
        {revealed && (
          <div className="p-4 bg-petroleum text-white rounded-xl text-center mt-3">
            <Rocket className="w-8 h-8 mx-auto mb-2 text-corporate" />
            <p className="font-bold text-sm text-white leading-relaxed">{t('ova.introprompt.challenge_complete')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

FinalChallenge.propTypes = {};

export default FinalChallenge;
