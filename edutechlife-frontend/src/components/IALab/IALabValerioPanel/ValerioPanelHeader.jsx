import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import ValerioAvatar from '../../ValerioAvatar';
import { stopSpeech } from '../../../utils/speech';
import { useTranslation } from '../../../i18n/I18nProvider';

const ValerioPanelHeader = ({ valerioState, setValerioState, currentModule, userLevel, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="sticky top-0 bg-gradient-to-r from-petroleum to-corporate text-white p-6 rounded-t-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <ValerioAvatar
            state={valerioState}
            size={48}
            onStateChange={setValerioState}
          />
          <div>
            <h2 className="text-xl font-bold">{t('ialab.valerio.title')}</h2>
            <p className="text-sm opacity-90">
              {t('ialab.valerio.module_label', { title: currentModule?.title })}
            </p>
          </div>
        </div>

        <button
          onClick={() => { stopSpeech(); onClose(); }}
          className="text-white hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label={t('ialab.valerio.close_aria')}
        >
          <Icon name="fa-xmark" className="text-xl" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            valerioState === 'idle' ? 'bg-emerald-400' :
            valerioState === 'thinking' ? 'bg-purple-400' :
            valerioState === 'speaking' ? 'bg-cyan-400' :
            'bg-blue-400'
          }`} />
          <span>
            {valerioState === 'idle' ? t('ialab.valerio.status_idle') :
             valerioState === 'thinking' ? t('ialab.valerio.status_thinking') :
             valerioState === 'speaking' ? t('ialab.valerio.status_speaking') :
             t('ialab.valerio.status_listening')}
          </span>
        </div>
        <div className="h-4 w-px bg-white/30" />
        <div className="flex items-center gap-2">
          <Icon name="fa-layer-group" className="text-xs" />
          <span>{t('ialab.valerio.level_label', { level: userLevel < 3 ? t('ialab.valerio.level_beginner') : userLevel < 6 ? t('ialab.valerio.level_intermediate') : t('ialab.valerio.level_advanced') })}</span>
        </div>
      </div>
    </div>
  );
};

export default ValerioPanelHeader;
