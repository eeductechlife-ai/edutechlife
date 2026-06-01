import { useTranslation } from '../../../../i18n/I18nProvider';
import { GraduationCap, Award, Settings, Check } from 'lucide-react';
import { Button } from '../shared';

export default function CertificateScreen({ xp, onReset, showMarkButton, onMarkComplete }) {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards] text-center">
      <h2 className="text-4xl font-extrabold text-petroleum mb-4">{t('ova.buildgpt.cert_title')}</h2>
      <p className="text-lg text-gray-600 dark:text-slate-300 mb-8">{t('ova.buildgpt.cert_desc')}</p>
      <div className="bg-gradient-to-br from-petroleum to-petroleum-dark p-1 rounded-3xl shadow-2xl mb-10 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500">
        <div className="bg-white dark:bg-slate-800 rounded-[22px] p-8 md:p-12 border-4 border-transparent bg-clip-padding relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 dark:bg-cyan-900/20 rounded-bl-full -z-10 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-100 dark:bg-slate-700/50 rounded-tr-full -z-10 opacity-50"></div>
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center shadow-sm text-white">
                <GraduationCap size={22} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                <span className="text-corporate">Edu</span><span className="text-petroleum">techlife</span>
              </span>
            </div>
          </div>
          <div className="text-sm font-bold tracking-widest text-corporate uppercase mb-2">{t('ova.buildgpt.cert_subtitle')}</div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">{t('ova.buildgpt.cert_course')}</h3>
          <div className="flex justify-center gap-8 text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-700 py-4 mb-6">
            <div>
              <div className="text-xs uppercase tracking-wider">{t('ova.buildgpt.cert_xp')}</div>
              <div className="text-xl font-bold text-petroleum">{xp} / 1000</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider">{t('ova.buildgpt.cert_coach')}</div>
              <div className="text-xl font-bold text-petroleum">Valerio</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider">{t('ova.buildgpt.cert_date')}</div>
              <div className="text-xl font-bold text-petroleum">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white shadow-lg border-4 border-white">
            <Award size={40} />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {showMarkButton && onMarkComplete && (
          <button onClick={onMarkComplete}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse">
            <Check size={20} />
            {t('ova.buildgpt.cert_mark')}
          </button>
        )}
        <Button onClick={onReset} variant="outline" icon={Settings}>{t('ova.buildgpt.cert_reset')}</Button>
        <Button onClick={() => alert('¡Sigue aprendiendo con Edutechlife y Valerio!')} icon={GraduationCap}>{t('ova.buildgpt.cert_explore')}</Button>
      </div>
    </div>
  );
}
