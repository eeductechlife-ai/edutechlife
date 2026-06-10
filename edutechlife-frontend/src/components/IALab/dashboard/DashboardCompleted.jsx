import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIALabStore } from '../../../store/ialabStore';
import { useTranslation } from '../../../i18n/I18nProvider';
import { Icon } from '../../../utils/iconMapping.jsx';
import DashboardBgPattern from './DashboardBgPattern';
import DashboardTopBar from './DashboardTopBar';
import DashboardTabs from './DashboardTabs';
import DashboardModuleList from './DashboardModuleList';
import DashboardActivityView from './DashboardActivityView';

const MODULES = [1, 2, 3, 4, 5];

export default function DashboardCompleted() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const xp = useIALabStore(s => s.xp);
  const streak = useIALabStore(s => s.streak);
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const completedExams = useIALabStore(s => s.completedExams);
  const courseCompleted = useIALabStore(s => s.courseCompleted);

  const [activeTab, setActiveTab] = useState('modules');

  const stats = useMemo(() => {
    const completed = MODULES.filter(id => {
      const mod = moduleProgress[id];
      return mod?.exam && mod?.challenge && mod?.resourcesCompleted && (mod?.currentScore || 0) >= 80;
    }).length;
    const scores = MODULES.map(id => completedExams[id]).filter(Boolean);
    return {
      completed,
      avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    };
  }, [moduleProgress, completedExams]);

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6">
      <DashboardBgPattern />
      <DashboardTopBar />
      {(xp > 0 || stats.completed > 0) && (
        <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3">{t('route.continue_learning')}</p>
      )}
      <section className="relative overflow-hidden bg-gradient-to-br from-petroleum/[0.03] to-corporate/[0.03] rounded-2xl border border-petroleum/10 p-6 sm:p-8 text-center">
        <motion.div animate={{ y: [0, -4, 0], scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-corporate to-petroleum flex items-center justify-center mx-auto mb-3 shadow-lg shadow-corporate/30">
          <Icon name="fa-trophy" className="w-6 h-6 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-petroleum">{t('route.course_complete')}</h2>
        <p className="text-sm text-petroleum/70 mt-1">{t('dashboard.explore_courses')}</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
          onClick={() => navigate('/ialab/certificate')}
          className="mt-4 inline-flex items-center gap-2 bg-white text-petroleum font-semibold px-5 py-2.5 rounded-xl border border-petroleum/20 shadow-sm">
          <Icon name="fa-certificate" className="w-4 h-4" />
          {t('route.view_certificate')}
        </motion.button>
        <div className="grid grid-cols-3 gap-2.5 mt-6">
          <div className="bg-white/80 backdrop-blur rounded-[14px] py-3.5 px-2 text-center border border-petroleum/10 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-corporate/15 flex items-center justify-center mx-auto mb-1.5">
              <Icon name="fa-star" className="w-3.5 h-3.5 text-corporate" />
            </div>
            <p className="text-lg font-bold text-petroleum leading-tight">{xp?.toLocaleString() || '0'}</p>
            <p className="text-[9px] text-petroleum/50 uppercase tracking-wider">{t('dashboard.xp_earned')}</p>
            <p className="text-[7px] text-petroleum/30 mt-0.5">{t('dashboard.xp_sub')}</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-[14px] py-3.5 px-2 text-center border border-petroleum/10 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-petroleum/20 flex items-center justify-center mx-auto mb-1.5">
              <Icon name="fa-fire" className="w-3.5 h-3.5 text-petroleum" />
            </div>
            <p className="text-lg font-bold text-petroleum leading-tight">{streak || 0}</p>
            <p className="text-[9px] text-petroleum/50 uppercase tracking-wider">{t('dashboard.current_streak')}</p>
            <p className="text-[7px] text-petroleum/30 mt-0.5">{t('dashboard.days_consecutive')}</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-[14px] py-3.5 px-2 text-center border border-petroleum/10 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-1.5">
              <Icon name="fa-chart-line" className="w-3.5 h-3.5 text-petroleum" />
            </div>
            <p className="text-lg font-bold text-petroleum leading-tight">{stats.avgScore}%</p>
            <p className="text-[9px] text-petroleum/50 uppercase tracking-wider">{t('dashboard.avg_score')}</p>
            <p className="text-[7px] text-petroleum/30 mt-0.5">{t('dashboard.exams_completed')}</p>
          </div>
        </div>
      </section>

      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'modules' ? (
        <DashboardModuleList />
      ) : (
        <DashboardActivityView />
      )}
    </div>
  );
}
