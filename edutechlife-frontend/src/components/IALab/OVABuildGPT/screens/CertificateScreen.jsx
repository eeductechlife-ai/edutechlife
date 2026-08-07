import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { GraduationCap, Settings, CheckCircle2 } from 'lucide-react';
import { Button } from '../shared';


CertificateScreen.propTypes = {
  xp: PropTypes.number,
  onReset: PropTypes.func,
  onMarkComplete: PropTypes.func,
};

export default function CertificateScreen({ xp, onReset, onMarkComplete }) {
  const { t } = useTranslation();
  const autoCompletedRef = useRef(false);

  useEffect(() => {
    if (!autoCompletedRef.current) {
      autoCompletedRef.current = true;
      onMarkComplete?.();
    }
  }, [onMarkComplete]);

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards] text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white dark:border-slate-700">
        <CheckCircle2 className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl font-extrabold text-petroleum mb-4">{t('ova.buildgpt.cert_title')}</h2>
      <p className="text-lg text-gray-600 dark:text-slate-300 mb-10">{t('ova.buildgpt.cert_desc')}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={onReset} variant="outline" icon={Settings}>{t('ova.buildgpt.cert_reset')}</Button>
        <Button onClick={() => alert('¡Sigue aprendiendo con Edutechlife y MAX!')} icon={GraduationCap}>{t('ova.buildgpt.cert_explore')}</Button>
      </div>
    </div>
  );
}
