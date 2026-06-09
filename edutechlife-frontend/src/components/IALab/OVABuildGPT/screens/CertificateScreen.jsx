import PropTypes from 'prop-types';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { GraduationCap, Settings, CheckCircle2 } from 'lucide-react';
import { Button } from '../shared';


CertificateScreen.propTypes = {
  xp: PropTypes.any,
  onReset: PropTypes.any,
  showMarkButton: PropTypes.any,
  onMarkComplete: PropTypes.any,
};

export default function CertificateScreen({ xp, onReset, showMarkButton, onMarkComplete }) {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards] text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white dark:border-slate-700">
        <CheckCircle2 className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl font-extrabold text-petroleum mb-4">{t('ova.buildgpt.cert_title')}</h2>
      <p className="text-lg text-gray-600 dark:text-slate-300 mb-10">{t('ova.buildgpt.cert_desc')}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {showMarkButton && (
          <button onClick={onMarkComplete}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            {t('ova.buildgpt.cert_mark')}
          </button>
        )}
        <Button onClick={onReset} variant="outline" icon={Settings}>{t('ova.buildgpt.cert_reset')}</Button>
        <Button onClick={() => alert('¡Sigue aprendiendo con Edutechlife y Valerio!')} icon={GraduationCap}>{t('ova.buildgpt.cert_explore')}</Button>
      </div>
    </div>
  );
}
