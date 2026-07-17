import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import XPProgressBar from '@/components/XPProgressBar';
import GlassCard from '@/components/GlassCard';
import { Download } from 'lucide-react';
import { useTranslation } from '@/i18n/I18nProvider';

const ProgressView = memo(({
  userXP,
  userLevel,
  streakDays,
  subjects,
  studentData,
  onGenerateReport
}) => {
  const { t } = useTranslation();

  const averageProgress = useMemo(() => {
    const activeSubjects = subjects.filter(s => !s.locked);
    if (activeSubjects.length === 0) return 0;
    return Math.round(activeSubjects.reduce((acc, s) => acc + s.progress, 0) / activeSubjects.length);
  }, [subjects]);

  return (
    <div className="space-y-6">
      <GlassCard animate>
        <XPProgressBar currentXP={userXP} level={userLevel} streak={streakDays} />
      </GlassCard>

      <GlassCard animate delay={0.1}>
        <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-6">{t('smartboard.learning_stats')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t('smartboard.total_time'), value: `${studentData.timeSpent || 0}min`, color: '#4DA8C4', bg: 'from-[#4DA8C4]/10 to-transparent' },
            { label: t('smartboard.interactions'), value: studentData.interactions, color: '#66CCCC', bg: 'from-[#66CCCC]/10 to-transparent' },
            { label: t('smartboard.average_progress'), value: `${averageProgress}%`, color: '#FFD166', bg: 'from-[#FFD166]/10 to-transparent' },
            { label: t('smartboard.streak_days_label'), value: streakDays, color: '#FF6B9D', bg: 'from-[#FF6B9D]/10 to-transparent' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`text-center p-6 rounded-xl bg-gradient-to-br ${stat.bg} border border-[#E2E8F0]`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-[#64748B] font-open-sans mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <motion.button
        onClick={onGenerateReport}
        className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Download className="w-5 h-5" />
        {t('smartboard.download_full_report')}
      </motion.button>
    </div>
  );
});

ProgressView.displayName = 'ProgressView';

export default ProgressView;
