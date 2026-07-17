import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../../i18n/I18nProvider';

export const StatCard = ({ icon, label, value, color, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <span className="text-sm text-[#64748B]">{label}</span>
    </div>
    <p className="text-2xl font-black text-[#004B63]">{value}</p>
    {subtitle && <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>}
  </motion.div>
);

export const PointsChart = ({ history }) => {
  const { t } = useTranslation();
  const chartData = useMemo(() => {
    const daily = {};
    history.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('es-ES');
      daily[date] = (daily[date] || 0) + entry.points;
    });
    return Object.entries(daily).slice(-14).map(([date, points]) => ({ date, points }));
  }, [history]);

  if (chartData.length === 0) return null;

  const maxPoints = Math.max(...chartData.map(d => d.points), 1);

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <h3 className="text-sm font-bold text-[#004B63] mb-4">{t('smartboard.chart_last_14')}</h3>
      <div className="flex items-end gap-2 h-32">
        {chartData.map((day, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(day.points / maxPoints) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            className="flex-1 rounded-t-md relative group"
            style={{ backgroundColor: day.points > 0 ? '#4DA8C4' : '#E2E8F0', minHeight: day.points > 0 ? 4 : 2 }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#4DA8C4] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              +{day.points}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {chartData.filter((_, i) => i % 3 === 0 || i === chartData.length - 1).map((day, i) => (
          <span key={i} className="text-[9px] text-[#94A3B8]">{day.date.slice(0, 5)}</span>
        ))}
      </div>
    </div>
  );
};

export const SubjectProgress = ({ subjects }) => {
  const active = subjects.filter(s => s.progress > 0);
  if (active.length === 0) return null;
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
      <h3 className="text-sm font-bold text-[#004B63] mb-4">Progreso por materia</h3>
      <div className="space-y-3">
        {active.map(sub => (
          <div key={sub.id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#64748B]">{sub.icon} {sub.name}</span>
              <span className="font-bold text-[#004B63]">{sub.progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: sub.color || '#4DA8C4' }}
                initial={{ width: 0 }}
                animate={{ width: `${sub.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
