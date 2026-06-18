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
import PremiumGate from './PremiumGate';

const KidsCalendar = lazy(() => import('./KidsCalendar'));
const PointsRewardsSystem = lazy(() => import('./PointsRewardsSystem'));
const NewsTechFeed = lazy(() => import('./NewsTechFeed'));
const ActivityUploader = lazy(() => import('./ActivityUploader'));
const SmartBoardProgress = lazy(() => import('./SmartBoardProgress'));
const PersonalizedPlan = lazy(() => import('./PersonalizedPlan'));
const ExamPrep = lazy(() => import('./ExamPrep'));
const FlashcardSystem = lazy(() => import('./FlashcardSystem'));
const SmartBookReader = lazy(() => import('./SmartBookReader'));
const ProblemScanner = lazy(() => import('./ProblemScanner'));
const CurriculumView = lazy(() => import('./CurriculumView'));
const StudyPodcast = lazy(() => import('./StudyPodcast'));
const OralExamSimulator = lazy(() => import('./OralExamSimulator'));
const SmartBoardAnalytics = lazy(() => import('./SmartBoardAnalytics'));

const CATEGORY_MAP = {
  inicio: 'home',
  materias: 'learn', curriculo: 'learn', libros: 'learn', podcast: 'learn',
  examenes: 'practice', flashcards: 'practice', oral: 'practice', escaner: 'practice',
  vak: 'progress', progreso: 'progress', analitica: 'progress', calendario: 'progress',
  misiones: 'explore', actividades: 'explore', noticias: 'explore',
};

const CATEGORIES = [
  { id: 'home',    icon: '🏠', label: 'Inicio',    color: '#4DA8C4', tabs: ['inicio'], premium: false },
  { id: 'learn',   icon: '📚', label: 'Aprender',  color: '#66CCCC', tabs: ['materias', 'curriculo', 'libros', 'podcast'], premium: false },
  { id: 'practice',icon: '✏️', label: 'Practicar', color: '#FF6B9D', tabs: ['examenes', 'flashcards', 'oral', 'escaner'], premium: false },
  { id: 'progress',icon: '📊', label: 'Progreso',  color: '#FFD166', tabs: ['vak', 'progreso', 'analitica', 'calendario'], premium: false },
  { id: 'explore', icon: '🎮', label: 'Explorar',  color: '#A855F7', tabs: ['misiones', 'actividades', 'noticias'], premium: false },
];

const CATEGORY_TAB_LABELS = {
  materias: 'Materias', curriculo: 'Currículo', libros: 'Libros', podcast: 'Podcast',
  examenes: 'Exámenes', flashcards: 'Flashcards', oral: 'Oral', escaner: 'Escáner',
  vak: 'VAK', progreso: 'Progreso', analitica: 'Analítica', calendario: 'Calendario',
  misiones: 'Misiones', actividades: 'Actividades', noticias: 'Noticias',
  inicio: 'Inicio',
};

const PREMIUM_TABS = ['libros', 'noticias', 'analitica'];

const TOP_BAR_LABELS = {
  inicio: 'Inicio',
  materias: 'Materias', curriculo: 'Currículo', libros: 'Libros Intel.', podcast: 'Podcast',
  examenes: 'Exámenes', flashcards: 'Flashcards', oral: 'Oral', escaner: 'Escáner',
  vak: 'Diagnóstico VAK', progreso: 'Progreso', analitica: 'Analítica', calendario: 'Calendario',
  misiones: 'Misiones', actividades: 'Actividades', noticias: 'Noticias',
};

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
  if (tab === 'examenes' || tab === 'flashcards' || tab === 'libros' || tab === 'oral') {
    return (
      <div className="space-y-4 p-4">
        <SkeletonBar className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBar className="h-32" />
          <SkeletonBar className="h-32" />
          <SkeletonBar className="h-32" />
          <SkeletonBar className="h-32" />
        </div>
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

const PremiumSidebar = ({ activeTab, onTabChange, totalPoints, vakCompleted, darkMode, streak, onNavigate, onLogout, subscriptionTier }) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === 'premium';
  const [expandedCat, setExpandedCat] = useState(() => {
    return localStorage.getItem('edutechlife_sidebar_cat') || 'home';
  });

  const activeCategory = CATEGORY_MAP[activeTab] || 'home';

  useEffect(() => {
    localStorage.setItem('edutechlife_sidebar_cat', activeCategory);
    setExpandedCat(activeCategory);
  }, [activeCategory]);

  const toggleCategory = (catId) => {
    setExpandedCat(prev => prev === catId ? null : catId);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`hidden md:flex w-56 flex-col h-full backdrop-blur-xl border-r relative z-20 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/80 border-[#334155]/50' : 'bg-white/80 border-[#E2E8F0]'
      }`}
    >
      {/* Logo + Stats */}
      <div className="p-4 border-b border-[#E2E8F0]/50">
        <motion.h2 initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="text-lg font-black bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent"
        >
          SmartBoard
        </motion.h2>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs">
            <span>🔥</span>
            <span className={`font-bold ${darkMode ? 'text-[#FFD166]' : 'text-[#FF8E53]'}`}>{streak?.current ?? 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>💎</span>
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>{totalPoints?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {CATEGORIES.map((cat) => {
          const isActiveCategory = expandedCat === cat.id;
          const hasActiveTab = activeCategory === cat.id;
          const anyPremiumInCategory = cat.tabs.some(t => PREMIUM_TABS.includes(t));
          const showChildren = isActiveCategory;

          return (
            <div key={cat.id}>
              <motion.button
                onClick={() => toggleCategory(cat.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                  hasActiveTab
                    ? 'text-white shadow-sm'
                    : darkMode
                      ? 'text-[#94A3B8] hover:bg-[#334155]/50'
                      : 'text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
                style={hasActiveTab ? { background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` } : {}}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="flex-1 text-left">{cat.label}</span>
                {anyPremiumInCategory && !isPremium && <span className="text-[9px]">🔒</span>}
                <motion.span
                  animate={{ rotate: showChildren ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] opacity-50"
                >▾</motion.span>
              </motion.button>

              <AnimatePresence initial={false}>
                {showChildren && (
                  <motion.div
                    key="sub"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 pl-2"
                      style={{ borderColor: `${cat.color}40` }}>
                      {cat.tabs.map((tabId) => {
                        if (cat.id === 'home') return null;
                        const isActive = activeTab === tabId;
                        const isPremiumTab = PREMIUM_TABS.includes(tabId);
                        return (
                          <motion.button
                            key={tabId}
                            onClick={() => onTabChange(tabId)}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isActive
                                ? darkMode ? 'bg-[#334155] text-white' : 'bg-[#F1F5F9] text-[#004B63]'
                                : darkMode ? 'text-[#94A3B8] hover:bg-[#334155]/30' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                            }`}
                            style={isActive ? { borderLeft: `3px solid ${cat.color}` } : {}}
                          >
                            <span className="flex-1 text-left">{CATEGORY_TAB_LABELS[tabId] || tabId}</span>
                            {isPremiumTab && !isPremium && <span className="text-[9px]">🔒</span>}
                            {isPremiumTab && isPremium && <span className="text-[9px]">⭐</span>}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Parents + Logout */}
      <div className="p-3 border-t border-[#E2E8F0]/50 space-y-1">
        <motion.button
          onClick={() => onNavigate?.('/smartboard/padres')}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            darkMode ? 'text-[#94A3B8] hover:bg-[#334155]/50' : 'text-[#64748B] hover:bg-[#F1F5F9]'
          }`}
        >
          <span className="text-lg">👨‍👩‍👧</span>
          <span>{t('smartboard.tab_parents')}</span>
        </motion.button>
        <motion.button
          onClick={onLogout}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
            darkMode ? 'text-[#64748B] hover:bg-[#334155]/30' : 'text-[#94A3B8] hover:bg-[#F1F5F9]'
          }`}
        >
          <span>🚪</span>
          <span>{t('smartboard.logout')}</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

// ==========================================
// Mobile Bottom Tab Bar
// ==========================================
const MobileBottomBar = ({ activeTab, onTabChange, darkMode, subscriptionTier }) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === 'premium';
  const activeCategory = CATEGORY_MAP[activeTab] || 'home';

  const getFirstTab = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.tabs[0] : 'inicio';
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-500 ${
        darkMode ? 'bg-[#1E293B]/90 border-[#334155]/50' : 'bg-white/90 border-[#E2E8F0]'
      }`}
    >
      <nav className="flex justify-around items-center py-1 px-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const anyPremiumInCategory = cat.tabs.some(t => PREMIUM_TABS.includes(t));
          const locked = anyPremiumInCategory && !isPremium;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onTabChange(activeCategory === cat.id ? activeTab : getFirstTab(cat.id))}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                isActive ? 'text-white shadow-sm' : darkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'
              }`}
              style={isActive ? { background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` } : {}}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[9px] font-semibold whitespace-nowrap">{cat.label}</span>
              {locked && <span className="text-[8px] absolute top-0 right-1">🔒</span>}
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
const PREMIUM_FEATURES = {
  libros: { icon: '📖', title: 'SmartBook Reader', description: 'Analiza textos con IA, extrae conceptos clave y organiza tu aprendizaje visualmente. Disponible solo en plan Premium.' },
  noticias: { icon: '📰', title: 'Noticias Tech', description: 'Mantente al día con noticias personalizadas de tecnología, ciencia e innovación. Disponible solo en plan Premium.' },
  padres: { icon: '👨‍👩‍👧', title: 'Panel para Padres', description: 'Seguimiento en tiempo real del progreso académico y emocional de tu hijo. Disponible solo en plan Premium.' },
  analitica: { icon: '📈', title: 'Analítica Avanzada', description: 'Métricas detalladas de rendimiento, predicciones y hábitos de estudio. Disponible solo en plan Premium.' },
};

const CinematicContent = ({ activeTab, onTabChange, darkMode, subscriptionTier }) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === 'premium';
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
                {isPremium ? <NewsTechFeed /> : (
                  <PremiumGate
                    icon="📰"
                    title={PREMIUM_FEATURES.noticias.title}
                    description={PREMIUM_FEATURES.noticias.description}
                  >
                    <NewsTechFeed />
                  </PremiumGate>
                )}
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
              {isPremium ? <NewsTechFeed /> : (
                <PremiumGate
                  icon={PREMIUM_FEATURES.noticias.icon}
                  title={PREMIUM_FEATURES.noticias.title}
                  description={PREMIUM_FEATURES.noticias.description}
                >
                  <NewsTechFeed />
                </PremiumGate>
              )}
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
          </DashboardErrorBoundary>
        );

      case 'curriculo':
        return (
          <DashboardErrorBoundary key="curriculo" message="Error al cargar currículo" onTabChange={onTabChange}>
          <motion.div key="curriculo" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={sharedTransition} className="h-full">
            <Suspense fallback={<SectionFallback tab="curriculo" />}>
              <CurriculumView />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'oral':
        return (
          <DashboardErrorBoundary key="oral" message="Error al cargar examen oral" onTabChange={onTabChange}>
          <motion.div key="oral" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={sharedTransition} className="h-full">
            <Suspense fallback={<SectionFallback tab="oral" />}>
              <OralExamSimulator />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'examenes':
        return (
          <DashboardErrorBoundary key="examenes" message="Error al cargar exámenes" onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="examenes" />}>
              <ExamPrep />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'flashcards':
        return (
          <DashboardErrorBoundary key="flashcards" message="Error al cargar flashcards" onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="flashcards" />}>
              <FlashcardSystem />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'libros':
        return (
          <DashboardErrorBoundary key="libros" message="Error al cargar libros" onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="libros" />}>
              {isPremium ? <SmartBookReader /> : (
                <PremiumGate
                  icon={PREMIUM_FEATURES.libros.icon}
                  title={PREMIUM_FEATURES.libros.title}
                  description={PREMIUM_FEATURES.libros.description}
                >
                  <SmartBookReader />
                </PremiumGate>
              )}
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'escaner':
        return (
          <DashboardErrorBoundary key="escaner" message="Error al cargar escáner" onTabChange={onTabChange}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
          >
            <Suspense fallback={<SectionFallback tab="escaner" />}>
              <ProblemScanner />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'progreso':
        return (
          <DashboardErrorBoundary key="progreso" message="Error al cargar progreso" onTabChange={onTabChange}>
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

      case 'podcast':
        return (
          <DashboardErrorBoundary key="podcast" message="Error al cargar podcast" onTabChange={onTabChange}>
          <motion.div
            key="podcast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={sharedTransition}
            className="h-full"
          >
            <Suspense fallback={<SectionFallback tab="podcast" />}>
              <StudyPodcast />
            </Suspense>
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'analitica':
        return (
          <DashboardErrorBoundary key="analitica" message="Error al cargar analytics" onTabChange={onTabChange}>
          <motion.div key="analitica" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={sharedTransition} className="h-full">
            {isPremium ? (
              <Suspense fallback={<SectionFallback tab="analitica" />}>
                <SmartBoardAnalytics />
              </Suspense>
            ) : (
              <PremiumGate
                icon={PREMIUM_FEATURES.analitica.icon}
                title={PREMIUM_FEATURES.analitica.title}
                description={PREMIUM_FEATURES.analitica.description}
              >
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
                  <span className="text-6xl mb-4">📈</span>
                  <p className="text-sm text-[#64748B]">Analítica Avanzada</p>
                </div>
              </PremiumGate>
            )}
          </motion.div>
          </DashboardErrorBoundary>
        );

      case 'padres':

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('inicio');
  useEffect(() => {
    try {
      localStorage.setItem('edutechlife_current_tab', activeTab);
      localStorage.setItem('edutechlife_last_activity', new Date().toISOString());
    } catch {}
  }, [activeTab]);
  const [isDaniOpen, setIsDaniOpen] = useState(false);
  const [showDaniReminder, setShowDaniReminder] = useState(false);
  const { totalPoints, vakResult, addPoints, setVakResultAndRecommendations, darkMode, avatarAnimado, fondoGalaxia, lastUnlockedReward, streak, missions, subjects, completeMission, subscriptionTier } = useSmartBoardKids();
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signOut } = useClerk();

  const handleLogout = useCallback(() => {
    signOut();
    navigate('/');
  }, [signOut, navigate]);

  // Proactive Dani reminder after inactivity
  useEffect(() => {
    const lastDani = parseInt(localStorage.getItem('edutechlife_last_dani_close') || '0', 10);
    const elapsed = Date.now() - lastDani;
    if (lastDani > 0 && elapsed > 300000 && elapsed < 3600000) {
      const timer = setTimeout(() => setShowDaniReminder(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDaniOpen]);

  useEffect(() => {
    if (isDaniOpen) {
      setShowDaniReminder(false);
      localStorage.removeItem('edutechlife_last_dani_close');
    } else {
      if (!localStorage.getItem('edutechlife_last_dani_close')) {
        localStorage.setItem('edutechlife_last_dani_close', Date.now().toString());
      }
    }
  }, [isDaniOpen]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['inicio', 'vak', 'misiones', 'materias', 'actividades', 'calendario', 'noticias', 'progreso', 'curriculo', 'oral', 'examenes', 'flashcards', 'libros', 'escaner', 'analitica', 'padres', 'podcast'].includes(tab)) {
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
            subscriptionTier={subscriptionTier}
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
              <span className="flex items-center gap-2">
                <span className="text-base">{CATEGORIES.find(c => c.tabs.includes(activeTab))?.icon}</span>
                <span>{TOP_BAR_LABELS[activeTab] || activeTab}</span>
              </span>
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
            subscriptionTier={subscriptionTier}
          />
        </div>
      </div>

      {/* Proactive Dani Reminder */}
      <AnimatePresence>
        {showDaniReminder && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={() => { setShowDaniReminder(false); setIsDaniOpen(true); }}
            className="fixed bottom-24 md:bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-2xl shadow-xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🤖
            </motion.span>
            <div className="text-left">
              <p className="text-xs font-bold">¿Necesitas ayuda?</p>
              <p className="text-[10px] text-white/80">Dani está aquí para ti</p>
            </div>
            <motion.button
              onClick={(e) => { e.stopPropagation(); setShowDaniReminder(false); }}
              className="text-white/50 hover:text-white text-sm ml-2"
            >
              ✕
            </motion.button>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} subscriptionTier={subscriptionTier} />

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
