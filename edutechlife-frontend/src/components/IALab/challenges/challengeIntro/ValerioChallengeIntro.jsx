import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';
import VoiceReader from '../../VoiceReader';
import { speakTextConversational, stopSpeech } from '../../../../utils/speech';

const ValerioChallengeIntro = ({ moduleId, onStart, t, locale: localeProp }) => {
  const { locale: ctxLocale } = useTranslation();
  const locale = localeProp || ctxLocale || 'es';
  const text = t(`ialab.challenge.intro_${moduleId}`, '');
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (text) {
      speakTextConversational(text, 'valerio', () => setAudioPlaying(false));
      setAudioPlaying(true);
    }
    return () => stopSpeech();
  }, [text]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-12">
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center shadow-lg shadow-[var(--theme-primary)]/20">
            <Icon name="fa-robot" className="text-white text-4xl" />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-emerald-400 border-4 border-white flex items-center justify-center">
          <Icon name="fa-check" className="text-white text-sm" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
        {t('ialab.challenge.valerio_intro_title')}
      </h2>
      <p className="text-sm font-medium text-[var(--theme-primary)] mb-6 text-center">
        {t('ialab.challenge.valerio_intro_subtitle')}
      </p>

      <div className="max-w-2xl w-full bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-slate-100 dark:border-navy-700 p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="fa-quote-left" className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{text}"
            </p>
          </div>
        </div>

        {text && (
          <div className="mt-4 flex justify-end">
            <VoiceReader text={text} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-lg w-full mb-8">
        <div className="bg-gradient-to-br from-[var(--theme-emphasis)]/5 to-[var(--theme-primary)]/5 rounded-xl p-4 text-center border border-[var(--theme-emphasis)]/10">
          <Icon name="fa-brain" className="text-[var(--theme-primary)] text-xl mb-2 mx-auto" />
          <p className="text-[10px] font-semibold text-[var(--theme-emphasis)] dark:text-slate-300 uppercase tracking-wider">
            {t('ialab.challenge.valerio_label_apply')}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[var(--theme-emphasis)]/5 to-[var(--theme-primary)]/5 rounded-xl p-4 text-center border border-[var(--theme-emphasis)]/10">
          <Icon name="fa-star" className="text-amber-500 text-xl mb-2 mx-auto" />
          <p className="text-[10px] font-semibold text-[var(--theme-emphasis)] dark:text-slate-300 uppercase tracking-wider">
            {t('ialab.challenge.valerio_label_practice')}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[var(--theme-emphasis)]/5 to-[var(--theme-primary)]/5 rounded-xl p-4 text-center border border-[var(--theme-emphasis)]/10">
          <Icon name="fa-trophy" className="text-amber-500 text-xl mb-2 mx-auto" />
          <p className="text-[10px] font-semibold text-[var(--theme-emphasis)] dark:text-slate-300 uppercase tracking-wider">
            {t('ialab.challenge.valerio_label_challenge')}
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-10 py-4 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-[var(--theme-primary)]/25 transition-all duration-300 active:scale-[0.98] flex items-center gap-3"
      >
        <Icon name="fa-play-circle" className="text-xl" />
        {t('ialab.challenge.valerio_start')}
      </button>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 text-center">
        {t('ialab.challenge.valerio_estimated_time')}
      </p>
    </div>
  );
};


ValerioChallengeIntro.propTypes = {
  moduleId: PropTypes.number,
  onStart: PropTypes.func,
  t: PropTypes.func,
  locale: PropTypes.string,
};

export default ValerioChallengeIntro;
