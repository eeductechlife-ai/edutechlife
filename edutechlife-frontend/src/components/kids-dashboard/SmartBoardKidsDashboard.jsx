import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';
import ParticlesBackground from './ParticlesBackground';
import HeroSection from './HeroSection';
import DaniTutorChat from './DaniTutorChat';
import DaniAvatar3D from './DaniAvatar3D';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import { VAKDiagnosticEnhanced } from './VAKDiagnosticEnhanced';
import { useTranslation } from '../../i18n/I18nProvider';

const KidsCalendar = lazy(() => import('./KidsCalendar'));
const PointsRewardsSystem = lazy(() => import('./PointsRewardsSystem'));
const NewsTechFeed = lazy(() => import('./NewsTechFeed'));
const ActivityUploader = lazy(() => import('./ActivityUploader'));
const SmartBoardProgress = lazy(() => import('./SmartBoardProgress'));
const PersonalizedPlan = lazy(() => import('./PersonalizedPlan'));

const SkeletonBar = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-[#E2E8F0] via-[#CBD5E1] to-[#E2E8F0] rounded-lg ${className}`} />
);

const SectionFallback = ({ tab }) => {
  if (tab === 'inicio') {
    return (
      <div className="space-y-6 p-4">
        <SkeletonBar className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonBar className="h-32" />
          <SkeletonBar className="h-32" />
        </div>
        <SkeletonBar className="h-24 w-3/4" />
      </div>
    );
  }
  if (tab === 'calendario') {
    return (
      <div className="space-y-4 p-4">
        <SkeletonBar className="h-8 w-48" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonBar key={i} className="h-12" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <SkeletonBar key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }
  if (tab === 'progreso') {
    return (
      <div className="space-y-4 p-4">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBar key={i} className="h-24 flex-1" />
          ))}
        </div>
        <SkeletonBar className="h-8 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBar className="h-48" />
          <SkeletonBar className="h-48" />
        </div>
      </div>
    );
  }
  if (tab === 'actividades') {
    return (
      <div className="space-y-4 p-4">
        <SkeletonBar className="h-12 w-64" />
        <SkeletonBar className="h-40 w-full" />
        <SkeletonBar className="h-40 w-full" />
      </div>
    );
  }
  return (
    <div className="space-y-4 p-4">
      <SkeletonBar className="h-8 w-48" />
      <SkeletonBar className="h-32 w-full" />
      <SkeletonBar className="h-32 w-3/4" />
    </div>
  );
};

// ==========================================
// Premium Sidebar - Glassmorphism
// ==========================================
const PremiumSidebar = ({ activeTab, onTabChange, totalPoints, vakCompleted, darkMode, streak, onNavigate, onLogout }) => {
  const { t } = useTranslation();
  const tabs = [
    { id: 'inicio', icon: '🏠', label: t('smartboard.tab_home'), color: '#4DA8C4' },
    { id: 'vak', icon: '🧠', label: t('smartboard.tab_vak'), color: '#66CCCC' },
    { id: 'misiones', icon: '🎯', label: t('smartboard.tab_missions'), color: '#FF6B9D' },
    { id: 'materias', icon: '📚', label: t('smartboard.tab_subjects'), color: '#4DA8C4' },
    { id: 'actividades', icon: '📝', label: t('smartboard.tab_activities'), color: '#FFD166' },
    { id: 'calendario', icon: '📅', label: t('smartboard.tab_calendar'), color: '#FF6B9D' },
    { id: 'progreso', icon: '📊', label: t('smartboard.tab_progress'), color: '#66CCCC' },
    { id: 'padres', icon: '👨‍👩‍👧', label: t('smartboard.tab_parents'), color: '#4DA8C4' },
    { id: 'noticias', icon: '📰', label: t('smartboard.tab_news'), color: '#004B63' },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`hidden md:flex w-64 flex-col h-full backdrop-blur-xl border-r relative z-20 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]'
      }`}
    >
      {/* Logo Area */}
      <div className="p-6 border-b border-[#E2E8F0]/50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 400, delay: 0.3 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent">
            SmartBoard
          </h2>
        </motion.div>
        <p className={`text-xs mt-1 transition-colors duration-500 ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{t('smartboard.sb_subtitle')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label={t('smartboard.nav_label')}>
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            onClick={() => tab.id === 'padres' ? onNavigate?.('/smartboard/padres') : onTabChange(tab.id)}
            aria-label={tab.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
              activeTab === tab.id
                ? 'text-white shadow-lg'
                : darkMode
                  ? 'text-[#94A3B8] hover:bg-[#334155]/50'
                  : 'text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] rounded-xl -z-10"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            
            <span className="relative z-10 text-xl">{tab.icon}</span>
            <span className="relative z-10 font-semibold text-sm">{tab.label}</span>
            
            {/* Plan active badge on VAK tab */}
            {tab.id === 'vak' && vakCompleted && (
              <span className="ml-auto relative z-10 text-[10px] px-1.5 py-0.5 bg-green-400 text-white rounded-full font-bold">
                Plan
              </span>
            )}
            

          </motion.button>
        ))}
      </nav>

      {/* User Level */}
      <div className={`p-4 border-t transition-colors duration-500 ${darkMode ? 'border-[#334155]/50' : 'border-[#E2E8F0]/50'}`}>
        <div className={`px-4 py-3 rounded-xl border transition-colors duration-500 ${
          darkMode
            ? 'bg-gradient-to-br from-[#334155] to-[#1E293B] border-[#475569]/50'
            : 'bg-gradient-to-br from-[#F8FAFC] to-white border-[#E2E8F0]/50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs transition-colors duration-500 ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{t('smartboard.sidebar_level')}</span>
            <span className="text-xs font-bold text-[#4DA8C4]">
              {totalPoints >= 5000 ? '🏆 Maestro' : totalPoints >= 2500 ? '⭐ Experto' : totalPoints >= 1000 ? '📚 Avanzado' : totalPoints >= 500 ? '🌟 Intermedio' : '🌱 Principiante'}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs">🔥</span>
            <span className={`text-xs ${darkMode ? 'text-[#FFD166]' : 'text-[#FF8E53]'}`}>
              {t('smartboard.sidebar_streak', { count: streak.current })}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalPoints % 500) / 5, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={t('smartboard.sidebar_logout')}
          className={`w-full mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            darkMode
              ? 'bg-[#334155] text-red-400 hover:bg-[#475569] hover:text-red-300'
              : 'bg-[#F8FAFC] text-red-500 hover:bg-red-50'
          }`}
        >
          🚪 {t('smartboard.sidebar_logout')}
        </motion.button>
      </div>
    </motion.aside>
  );
};

// ==========================================
// Mobile Bottom Tab Bar
// ==========================================
const MobileBottomBar = ({ activeTab, onTabChange, darkMode }) => {
  const mobileTabs = [
    { id: 'inicio', icon: '🏠' },
    { id: 'vak', icon: '🧠' },
    { id: 'misiones', icon: '🎯' },
    { id: 'materias', icon: '📚' },
    { id: 'actividades', icon: '📝' },
    { id: 'calendario', icon: '📅' },
    { id: 'progreso', icon: '📊' },
    { id: 'noticias', icon: '📰' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/90 border-[#334155]/50' : 'bg-white/90 border-[#E2E8F0]'
      }`}
    >
      <nav className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-1 px-2 gap-1" aria-label={t('smartboard.mobile_nav')}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mobileTabs.map((tab) => {
          const label = tab.id === 'inicio' ? t('smartboard.tab_home') : tab.id === 'vak' ? t('smartboard.tab_vak') : tab.id === 'misiones' ? t('smartboard.tab_missions') : tab.id === 'materias' ? t('smartboard.tab_subjects') : tab.id === 'actividades' ? t('smartboard.tab_activities') : tab.id === 'calendario' ? t('smartboard.tab_calendar') : tab.id === 'noticias' ? t('smartboard.tab_news') : t('smartboard.tab_progress');
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={label}
              className={`snap-start flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all flex-shrink-0 min-w-[56px] ${
                activeTab === tab.id
                  ? 'bg-[#4DA8C4]/10 text-[#004B63]'
                  : 'text-[#64748B]'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium whitespace-nowrap">
              {label}
            </span>
          </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

// ==========================================
// Missions View
// ==========================================
const MissionsView = memo(function MissionsView({ missions, onCompleteMission }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-[#004B63]">{t('smartboard.missions_view_title')}</h3>
        <span className="text-sm text-[#64748B]">{missions.filter(m => m.completed).length}/{missions.length}</span>
      </div>
      {missions.map((mission, index) => (
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            mission.completed
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-[#E2E8F0] hover:border-[#4DA8C4]/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              mission.completed ? 'bg-green-100' : 'bg-[#F8FAFC]'
            }`}>
              {mission.completed ? '✅' : mission.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold ${mission.completed ? 'text-green-600 line-through' : 'text-[#004B63]'}`}>
                {mission.title}
              </h4>
              <p className="text-sm text-[#64748B]">{mission.description}</p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold ${mission.completed ? 'text-green-500' : 'text-[#4DA8C4]'}`}>
                +{mission.xp} pts
              </span>
              {!mission.completed && (
                <motion.button
                  onClick={() => onCompleteMission(mission.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block mt-1 px-3 py-1 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-xs rounded-full font-semibold"
                >
                  {t('smartboard.complete_btn')}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

// ==========================================
// Subjects View
// ==========================================
const SubjectsView = memo(function SubjectsView({ subjects }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#004B63]">{t('smartboard.subjects_view_title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-5 rounded-xl border border-[#E2E8F0] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                {subject.icon}
              </div>
              <h4 className="font-semibold text-[#004B63]">{subject.name}</h4>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: subject.color }}
                initial={{ width: 0 }}
                animate={{ width: `${subject.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-[#64748B]">{t('smartboard.progress')}</span>
              <span className="text-xs font-bold" style={{ color: subject.color }}>{subject.progress}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// ==========================================
// Main Content Area with Cinematic Scroll
// ==========================================
const CinematicContent = ({ activeTab, onTabChange, darkMode }) => {
  const { t } = useTranslation();
  const { totalPoints, vakResult, addPoints, setVakResultAndRecommendations, streak, studentMoodHistory, academicTopics, conversationCount, missions, subjects, completeMission } = useSmartBoardKids();
  
  const handleVakComplete = useCallback((result) => {
    setVakResultAndRecommendations(result);
  }, [setVakResultAndRecommendations]);

  const renderContent = () => {
    const sharedTransition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };
    switch (activeTab) {
      case 'inicio':
        return (
          <DashboardErrorBoundary key="inicio" message={t('smartboard.error_load_home')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
            className="space-y-8"
          >
            <HeroSection />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <Suspense fallback={<SectionFallback tab="inicio" />}>
                <PointsRewardsSystem />
            </Suspense>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Suspense fallback={<SectionFallback tab="noticias" />}>
                <NewsTechFeed />
              </Suspense>
            </motion.div>
            </motion.div>
          </DashboardErrorBoundary>
        );
      
      case 'misiones':
        return (
          <DashboardErrorBoundary key="misiones" message={t('smartboard.error_load_missions')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <MissionsView missions={missions} onCompleteMission={completeMission} />
          </motion.div>
          </DashboardErrorBoundary>
        );
      
      case 'materias':
        return (
          <DashboardErrorBoundary key="materias" message={t('smartboard.error_load_subjects')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <SubjectsView subjects={subjects} />
          </motion.div>
          </DashboardErrorBoundary>
        );
      
      case 'actividades':
        return (
          <DashboardErrorBoundary key="actividades" message={t('smartboard.error_load_activities')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="actividades" />}>
              <ActivityUploader />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'calendario':
        return (
          <DashboardErrorBoundary key="calendario" message={t('smartboard.error_load_calendar')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="calendario" />}>
              <KidsCalendar />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );
      
      case 'puntos':
        return (
          <DashboardErrorBoundary key="puntos" message={t('smartboard.error_load_points')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="puntos" />}>
              <PointsRewardsSystem />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );
      
      case 'noticias':
        return (
          <DashboardErrorBoundary key="noticias" message={t('smartboard.error_load_news')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="noticias" />}>
              <NewsTechFeed />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );
      
      case 'vak':
        return (
          <DashboardErrorBoundary key="vak" message={t('smartboard.error_load_vak')} onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
            className="space-y-6"
          >
            <VAKDiagnosticEnhanced onComplete={handleVakComplete} />
            {vakResult && (
              <Suspense fallback={<SectionFallback tab="vak" />}>
                <PersonalizedPlan />
              </Suspense>
            )}
          </motion.div>
        );

      case 'progreso':
        return (
          <motion.div
            key="progreso"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
            className="h-full"
          >
            <Suspense fallback={<SectionFallback tab="progreso" />}>
              <SmartBoardProgress />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative p-4 md:p-6">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// Main SmartBoard Kids Dashboard Component
// ==========================================
const SmartBoardKidsDashboard = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isDaniOpen, setIsDaniOpen] = useState(false);
  const { totalPoints, vakResult, addPoints, setVakResultAndRecommendations, darkMode, avatarAnimado, fondoGalaxia, lastUnlockedReward, streak, missions, subjects, completeMission } = useSmartBoardKids();
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signOut } = useClerk();

  const handleLogout = useCallback(() => {
    signOut();
    navigate('/');
  }, [signOut, navigate]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['inicio', 'vak', 'misiones', 'materias', 'actividades', 'calendario', 'noticias', 'progreso', 'padres'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC]'
      } ${fondoGalaxia ? 'bg-[#0F172A]' : ''}`}
      style={fondoGalaxia ? {
        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(77,168,196,0.15) 1px, transparent 0px), radial-gradient(circle at 75px 75px, rgba(77,168,196,0.1) 1px, transparent 0px)',
        backgroundSize: '100px 100px',
      } : {}}
    >
      {/* Unlock Notification */}
      <AnimatePresence>
        {lastUnlockedReward && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 right-4 z-[100] bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold">{t('smartboard.unlock_reward')}</p>
              <p className="text-sm opacity-90">{lastUnlockedReward.icon} {lastUnlockedReward.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Particles */}
      <ParticlesBackground count={30} colors={['#4DA8C4', '#66CCCC', '#FFD166', '#FF6B9D']} />
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#66CCCC]/20 rounded-full blur-[150px] pointer-events-none z-0"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DA8C4]/20 rounded-full blur-[150px] pointer-events-none z-0"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Desktop Sidebar */}
          <PremiumSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalPoints={totalPoints}
            vakCompleted={!!vakResult}
            darkMode={darkMode}
            streak={streak}
            onNavigate={navigate}
            onLogout={handleLogout}
          />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Glassmorphism */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`backdrop-blur-xl border-b p-4 flex items-center justify-between z-20 transition-colors duration-500 ${
              darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]/50'
            }`}
          >
            <h1 className={`text-xl font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
              {activeTab === 'inicio' && t('smartboard.topbar_home')}
              {activeTab === 'vak' && t('smartboard.topbar_vak')}
              {activeTab === 'misiones' && t('smartboard.topbar_missions')}
              {activeTab === 'materias' && t('smartboard.topbar_subjects')}
              {activeTab === 'actividades' && t('smartboard.topbar_activities')}
              {activeTab === 'calendario' && t('smartboard.topbar_calendar')}
              {activeTab === 'noticias' && t('smartboard.topbar_news')}
              {activeTab === 'progreso' && t('smartboard.topbar_progress')}
            </h1>
            
            <div className="flex items-center gap-3">
              {/* Dani Quick Access */}
              <motion.button
                id="openDaniChat"
                type="button"
                onClick={() => setIsDaniOpen(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(77,168,196,0.4)' }}
                whileTap={{ scale: 0.92 }}
                aria-label={t('smartboard.talk_dani')}
                className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
              >
                <motion.span
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  🤖
                </motion.span>
                <span className="hidden md:block">{t('smartboard.talk_dani')}</span>
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-white/40"
                  initial={{ opacity: 0, scale: 1 }}
                  whileTap={{ opacity: 1, scale: 1.15 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              
              {/* Streak Display */}
              <motion.div
                className={`px-3 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-colors duration-500 ${
                  darkMode ? 'bg-[#334155]' : 'bg-[#F8FAFC]'
                }`}
                whileHover={{ scale: 1.02 }}
                title={t('smartboard.streak_title')}
              >
                <span className="text-sm">🔥</span>
                <span className={`text-xs font-bold ${darkMode ? 'text-[#FFD166]' : 'text-[#FF8E53]'}`}>
                  {streak.current}
                </span>
                <span className={`text-[10px] ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{t('smartboard.days')}</span>
              </motion.div>

              {/* Points Display */}
              <motion.div
                className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-500 ${
                  darkMode ? 'bg-[#334155]' : 'bg-[#F8FAFC]'
                }`}
                whileHover={{ scale: 1.02 }}
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="text-[#FFD166] font-bold text-lg">💎</span>
                <span className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>{totalPoints.toLocaleString()}</span>
                <span className={`text-[10px] ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{t('smartboard.points_display')}</span>
              </motion.div>
            </div>
          </motion.header>

          {/* Scrollable Content */}
          <CinematicContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />

      {/* Dani Chat Modal - Full Premium Experience */}
      <AnimatePresence>
        {isDaniOpen && (
          <DaniTutorChat isOpen={isDaniOpen} onClose={() => setIsDaniOpen(false)} activeTab={activeTab} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartBoardKidsDashboard;
