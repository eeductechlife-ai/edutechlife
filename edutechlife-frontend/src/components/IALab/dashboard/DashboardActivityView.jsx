import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import { useTranslation } from '../../../i18n/I18nProvider';
import useActivityTracker from '../../../hooks/useActivityTracker';
import { useIALabStore } from '../../../store/ialabStore';

const MODULES = [1, 2, 3, 4, 5];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.3 } }),
};

export default function DashboardActivityView() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const completedExams = useIALabStore(s => s.completedExams);
  const challengeScores = useIALabStore(s => s.challengeScores);
  const { getTimeTrackingStats } = useActivityTracker();
  const timeTracking = useMemo(() => getTimeTrackingStats(), [getTimeTrackingStats]);

  const modules = useMemo(() =>
    MODULES.map(id => {
      const mod = moduleProgress[id];
      return {
        id,
        score: mod?.currentScore || 0,
      };
    }),
    [moduleProgress, completedExams, challengeScores]
  );

  const vp = { once: true, margin: '-30px' };
  const noMotion = shouldReduceMotion;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: t('dashboard.today'), value: timeTracking?.today ?? 0 },
          { label: t('dashboard.this_week'), value: timeTracking?.weekTotal ?? 0 },
          { label: t('dashboard.avg_day'), value: timeTracking?.avgPerDay ?? 0 },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={noMotion ? false : 'hidden'}
            whileInView={noMotion ? undefined : 'visible'}
            viewport={vp} custom={i} variants={cardVariants}
            className="bg-white rounded-xl py-3.5 px-2 text-center shadow-sm border border-slate-100">
            <p className="text-lg font-bold text-petroleum">{s.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={noMotion ? false : 'hidden'} whileInView={noMotion ? undefined : 'visible'}
        viewport={vp} variants={sectionVariants}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">{t('dashboard.weekly_activity')}</p>
        <div className="flex items-end gap-1.5 h-20">
          {[t('dashboard.day_mon'),t('dashboard.day_tue'),t('dashboard.day_wed'),t('dashboard.day_thu'),t('dashboard.day_fri'),t('dashboard.day_sat'),t('dashboard.day_sun')].map((day, i) => {
            const count = timeTracking?.weekDaily?.[i]?.count || 0;
            const max = Math.max(...(timeTracking?.weekDaily?.map(d => d.count) || [1]), 1);
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-slate-400 font-medium">{count}</span>
                <div className="w-full rounded-md bg-corporate/5 relative overflow-hidden" style={{ height: 48 }}>
                  <div className="absolute bottom-0 w-full bg-corporate rounded-md transition-all duration-500"
                    style={{ height: `${(count / max) * 100}%` }} />
                </div>
                <span className="text-[9px] text-slate-400">{day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={noMotion ? false : 'hidden'} whileInView={noMotion ? undefined : 'visible'}
        viewport={vp} variants={sectionVariants}
        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">{t('dashboard.score_by_module')}</p>
        <div className="space-y-2">
          {modules.map(m => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-8">M{m.id}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-corporate transition-all duration-500"
                  style={{ width: `${Math.max(0, m.score)}%` }} />
              </div>
              <span className="text-xs font-bold text-petroleum w-10 text-right">{m.score || 0}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
