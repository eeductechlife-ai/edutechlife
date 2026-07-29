import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../../utils/iconMapping';
import { useTranslation } from '../../../../i18n/I18nProvider';

export function SubmitConfirmDialog({ isOpen, unansweredCount, onConfirm, onCancel }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog" aria-modal="true" aria-label={t('ialab.quiz.confirm_title')}
          className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
          >
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                <Icon name="fa-clock" className="text-amber-500 text-2xl" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('ialab.quiz.confirm_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('ialab.quiz.confirm_msg', { count: unansweredCount })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 min-h-[44px] border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium"
              >
                {t('ialab.quiz.confirm_review')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 min-h-[44px] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-sm font-medium"
              >
                {t('ialab.quiz.confirm_submit')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
