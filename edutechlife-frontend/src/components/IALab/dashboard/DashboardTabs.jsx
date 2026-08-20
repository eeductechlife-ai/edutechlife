import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-1 bg-slate-200/70 rounded-xl p-1 w-fit max-md:w-full" role="tablist" aria-label="Dashboard tabs">
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 14 }}
        onClick={() => setActiveTab('modules')}
        role="tab" aria-selected={activeTab === 'modules'} aria-controls="tabpanel-modules"
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 max-md:justify-center ${
          activeTab === 'modules'
            ? 'bg-white text-[var(--theme-emphasis)] shadow-sm' : 'text-[var(--theme-emphasis)]/50 hover:text-[var(--theme-emphasis)]/70'}`}>
        <Icon name="fa-layer-group" className="w-3.5 h-3.5" />
        {t('dashboard.your_progress')}
      </motion.button>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 14 }}
        onClick={() => setActiveTab('activity')}
        role="tab" aria-selected={activeTab === 'activity'} aria-controls="tabpanel-activity"
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 max-md:justify-center ${
          activeTab === 'activity'
            ? 'bg-white text-[var(--theme-emphasis)] shadow-sm' : 'text-[var(--theme-emphasis)]/50 hover:text-[var(--theme-emphasis)]/70'}`}>
        <Icon name="fa-chart-line" className="w-3.5 h-3.5" />
        {t('dashboard.activity_trends')}
      </motion.button>
    </div>
  );
}
