import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';
import DashboardBgPattern from './DashboardBgPattern';
import DashboardTopBar from './DashboardTopBar';

export default function DashboardNoProgress() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6">
      <DashboardBgPattern />
      <DashboardTopBar />
      <section className="relative overflow-hidden bg-gradient-to-br from-petroleum via-petroleum-dark to-[#003549] rounded-2xl p-8 text-center shadow-xl">
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
          <Icon name="fa-rocket" className="w-6 h-6 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-white mb-1">{t('dashboard.welcome_title')}</h2>
        <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">{t('dashboard.welcome_desc')}</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
          onClick={() => navigate('/ialab/1')}
          className="inline-flex items-center gap-2 bg-white text-petroleum font-bold px-7 py-3.5 rounded-xl shadow-lg">
          <Icon name="fa-play-circle" className="w-5 h-5" />
          {t('route.start')}
        </motion.button>
        <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2.5 mt-6">
          {[
            { icon: 'fa-star', label: t('dashboard.xp_earned'), sub: t('dashboard.xp_sub') },
            { icon: 'fa-fire', label: t('dashboard.current_streak'), sub: t('dashboard.days_consecutive') },
            { icon: 'fa-chart-line', label: t('dashboard.avg_score'), sub: t('dashboard.exams_completed') },
          ].map((s, i) => (
            <motion.div key={s.icon} initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-[14px] py-3.5 px-2 text-center border border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-corporate/15 flex items-center justify-center mx-auto mb-1.5">
                <Icon name={s.icon} className="w-3.5 h-3.5 text-corporate" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">0</p>
              <p className="text-[9px] text-white/50 uppercase tracking-wider">{s.label}</p>
              <p className="text-[7px] text-white/30 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
