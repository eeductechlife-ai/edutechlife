import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useFocusTrap from '@/hooks/useFocusTrap';
import { Download } from 'lucide-react';
import { useTranslation } from '@/i18n/I18nProvider';

const ReportModal = memo(({
  show,
  reportData,
  subjects,
  studentName,
  onClose,
  onDownload
}) => {
  const { t } = useTranslation();
  const focusTrapRef = useFocusTrap(show && !!reportData);

  return (
  <AnimatePresence>
    {show && reportData && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('smartboard.report_title')}
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#004B63]">{t('smartboard.report_title')}</h3>
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-[#004B63] text-xl"
              aria-label={t('smartboard.close_report')}
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t('smartboard.report_level'), value: reportData.nivelActual, color: '#4DA8C4' },
                { label: t('smartboard.report_xp'), value: reportData.xpActual, color: '#66CCCC' },
                { label: t('smartboard.report_streak'), value: t('smartboard.report_days', { days: reportData.diasRacha }), color: '#FFD166' },
                { label: t('smartboard.report_time'), value: t('smartboard.report_min', { min: reportData.tiempoSesion }), color: '#FF6B9D' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${stat.color}10` }}
                >
                  <p className="text-sm text-[#64748B]">{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl">
              <p className="text-sm text-[#64748B] mb-2">{t('smartboard.interactions_with')}</p>
              <p className="text-lg font-bold text-[#004B63]">{t('smartboard.questions_asked', { count: reportData.questionsAsked })}</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={onDownload}
                className="flex-1 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                {t('smartboard.download_report')}
              </motion.button>
              <motion.button
                onClick={onClose}
                className="px-6 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('smartboard.close')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
});

ReportModal.displayName = 'ReportModal';

export default ReportModal;
