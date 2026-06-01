import { Icon } from '../../../../utils/iconMapping';
import { useTranslation } from '../../../../i18n/I18nProvider';

export function EvaluationHeader({ step, totalSteps, securityWarning, onClose, loading, isSavingGrade }) {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-petroleum to-corporate border-b border-white/10 px-6 py-4 flex items-center justify-between z-50">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
        disabled={loading || isSavingGrade}
      >
        <Icon name="fa-arrow-left" className="text-sm" aria-hidden="true" />
        <span className="text-sm font-medium">{t('ialab.evaluation.modal.exit')}</span>
      </button>

      <div className="flex items-center gap-6">
        {typeof step === 'number' && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-white/80">
              {t('ialab.evaluation.modal.step_of', { step, total: totalSteps })}
            </div>
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-petroleum transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {securityWarning && (
          <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
            <span className="text-xs text-amber-200">{securityWarning}</span>
          </div>
        )}
      </div>
    </div>
  );
}
