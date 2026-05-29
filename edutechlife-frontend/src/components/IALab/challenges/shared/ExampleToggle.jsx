import React, { useState } from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../../i18n/I18nProvider';

const ExampleToggle = ({ example }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 text-xs text-corporate hover:text-petroleum transition-colors"
        aria-expanded={show}
      >
        <Icon name={show ? 'fa-eye-slash' : 'fa-eye'} className="text-xs" />
        {show ? t('ialab.challenge.m2.example_toggle_hide') : t('ialab.challenge.m2.example_toggle_show')}
      </button>
      {show && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="fa-lightbulb" className="text-amber-500" />
            <span className="font-semibold">{t('ialab.challenge.m2.example_toggle_label')}</span>
          </div>
          <p>{example}</p>
        </div>
      )}
    </div>
  );
};

export default ExampleToggle;
