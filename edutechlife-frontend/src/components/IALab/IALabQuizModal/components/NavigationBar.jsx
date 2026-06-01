import { Icon } from '../../../../utils/iconMapping';
import { useTranslation } from '../../../../i18n/I18nProvider';

export function NavigationBar({ currentQuestion, totalQuestions, hasAnsweredCurrent, isSubmitting, answeredCount, onPrev, onNext, onSubmit }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={currentQuestion === 0}
        className="px-5 py-2.5 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Icon name="fa-arrow-left" className="text-sm" aria-hidden="true" />
        <span className="hidden sm:inline text-sm font-medium">{t('ialab.quiz.previous')}</span>
      </button>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {t('ialab.quiz.answered_count', { count: answeredCount, total: totalQuestions })}
        </span>
      </div>

      {currentQuestion < totalQuestions - 1 ? (
        <button
          onClick={onNext}
          disabled={!hasAnsweredCurrent}
          className="px-5 py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className="text-sm font-medium">{t('ialab.quiz.next')}</span>
          <Icon name="fa-arrow-right" className="text-sm hidden sm:inline" aria-hidden="true" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">{t('ialab.quiz.submitting')}</span>
            </>
          ) : (
            <>
              <Icon name="fa-paper-plane" className="text-sm" aria-hidden="true" />
              <span className="text-sm font-medium">{t('ialab.quiz.submit')}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
