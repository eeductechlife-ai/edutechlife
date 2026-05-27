/**
 * IALab — Componente principal del laboratorio IALab
 *
 * Responsabilidad: Layout shell que renderiza el header, sidebar, contenido
 * principal, y modales lazy-loaded. Maneja autenticación, navegación por URL,
 * y carga de progreso.
 *
 * Subcomponentes directos:
 * - IALabProvider (context wrapper)
 * - IALabHeader + IALabSidebar + IALabMobileMenu
 * - TuRutaDeHoy + RecommendationsPanel
 * - IALabModals (all lazy-loaded modals)
 * - ResourceViewerModal (lazy) + OVAs (lazy)
 */
import React, { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { IALabProvider, useIALabProgressContext, useIALabUIContext } from '../../context/IALabContext';
import { ALL_LESSONS } from '../../data/ialab';
import { useIALabStore } from '../../store/ialabStore';
const fireConfetti = (opts) => import('canvas-confetti').then(m => m.default(opts));

import { speakTextConversational } from '../../utils/speech';
import IALabHeader from './IALabHeader';
import IALabSidebar from './IALabSidebar';
import IALabMobileMenu from './IALabMobileMenu';
import IALabModals from './IALabModals';
import IALabModuleHeader from './IALabModuleHeader';
import ModuleOverviewCard from './ModuleOverviewCard';
import ModuleInfoSection from './ModuleInfoSection';
import ToolTutorAccordion from './ToolTutorAccordion';
import TuRutaDeHoy from './TuRutaDeHoy';
import RecommendationsPanel from './RecommendationsPanel';
import ModuleActions from './ModuleActions';
import IALabTour from './IALabTour';
import Breadcrumbs from './Breadcrumbs';

const preloadForum = () => import('./IALabForumOptimized');
const IALabForumOptimized = lazy(preloadForum);
import OfflineBanner from './OfflineBanner';
import GlobalSearchBar from './GlobalSearchBar';
import { RouteSkeleton, ModuleInfoSkeleton, ModuleOverviewSkeleton, ModuleActionsSkeleton, ToolsSkeleton } from './IALabSkeleton';
import useIALabKeyboardShortcuts from '../../hooks/IALab/useIALabKeyboardShortcuts';
import SectionErrorBoundary from './SectionErrorBoundary';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/I18nProvider';
import SettingsSupportModal from '../modals/SettingsSupportModal';
import { useSessionTracker } from '../../hooks/useSessionTracker';
import AchievementToast from './AchievementToast';
import { useAchievementNotifications } from '../../hooks/useAchievementNotifications';


const Forum = lazy(preloadForum);

const LoadingSpinner = React.memo(({ onRetry, loadingText = 'Cargando...', retryText = 'Reintentar' }) => {
  const [showTimeout, setShowTimeout] = useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShowTimeout(true), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-500 font-medium">{loadingText}</p>
      {showTimeout && onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-xs font-semibold text-petroleum border border-petroleum/30 rounded-xl hover:bg-petroleum/5 transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  );
});
LoadingSpinner.displayName = 'LoadingSpinner';

const SuspenseWrapper = React.memo(({ children, onRetry, loadingText, retryText }) => {
  const [retryKey, setRetryKey] = useState(0);
  const handleRetry = onRetry ? onRetry : () => setRetryKey(k => k + 1);
  return (
    <Suspense fallback={<LoadingSpinner onRetry={handleRetry} loadingText={loadingText} retryText={retryText} />}>
      <div key={retryKey}>{children}</div>
    </Suspense>
  );
});
SuspenseWrapper.displayName = 'SuspenseWrapper';

/**
 * Componente principal wrapper para IALab - Arquitectura modular premium
 * Integra todos los componentes modulares manteniendo 100% la estructura visual original
 * Elimina componentes redundantes (cuadro "¿Listo para avanzar?" y quiz evaluación inline)
 * 
 * @returns {JSX.Element} Componente IALab completo
 */
const IALabContent = () => {
    const { t } = useTranslation();
    const TABS = [
      { id: null, label: t('ialab.tab_all') },
      { id: 'objetivos', label: t('ialab.tab_objectives') },
      { id: 'contenido', label: t('ialab.tab_content') },
      { id: 'actividades', label: t('ialab.tab_activities') },
      { id: 'herramientas', label: t('ialab.tab_tools') },
    ];
    const showPremiumEvaluationModal = useIALabStore(s => s.showPremiumEvaluationModal);
    const setShowPremiumEvaluationModal = useIALabStore(s => s.setShowPremiumEvaluationModal);
    const { user, showCertificateModal, setShowCertificateModal } = useIALabUIContext();
    const showBadgeGallery = useIALabStore(s => s.showBadgeGallery);
    const setShowBadgeGallery = useIALabStore(s => s.setShowBadgeGallery);
    const showLeaderboard = useIALabStore(s => s.showLeaderboard);
    const setShowLeaderboard = useIALabStore(s => s.setShowLeaderboard);
    const { toasts: achievementToasts, removeToast: removeAchievementToast } = useAchievementNotifications(useIALabStore);
    const { completedModules, courseProgress, activeMod, setActiveMod, completedExams, challengeScores, moduleProgress, modules } = useIALabProgressContext();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [showExamModal, setShowExamModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showValerioPanel, setShowValerioPanel] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
    const closeMobileMenu = () => {
      if (mobileMenuClosing) return;
      setMobileMenuClosing(true);
      setTimeout(() => {
        setShowMobileMenu(false);
        setMobileMenuClosing(false);
      }, 250);
    };
    const [showExamResult, setShowExamResult] = useState(false);
    const [showChallengeResult, setShowChallengeResult] = useState(false);
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const [viewSection, setViewSection] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [examRefreshKey, setExamRefreshKey] = useState(0);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const { openUserProfile } = useClerk();

    useSessionTracker();

    // === Deep Linking UNIFICADO: URL como fuente de verdad ===
    const { moduleId: urlMod } = useParams();
    const navigate = useNavigate();
    const prevModRef = useRef(activeMod);
    const directionRef = useRef(0);
    const prevActiveRef = useRef(activeMod);
    const shouldReduceMotion = useReducedMotion();

    // Dirección de animación derivada de cambios en activeMod
    useEffect(() => {
      if (prevActiveRef.current !== activeMod) {
        directionRef.current = activeMod > prevActiveRef.current ? 1 : -1;
        prevActiveRef.current = activeMod;
      }
    }, [activeMod]);

    const slideVariants = {
      enter: (dir) => ({
        x: shouldReduceMotion ? 0 : dir > 0 ? 320 : -320,
        opacity: shouldReduceMotion ? 1 : 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (dir) => ({
        x: shouldReduceMotion ? 0 : dir > 0 ? -320 : 320,
        opacity: shouldReduceMotion ? 1 : 0,
      }),
    };

    // Sincronización URL ↔ Store (único punto de side-effect)
    useEffect(() => {
      if (urlMod) {
        const id = parseInt(urlMod, 10);
        if (!isNaN(id) && id >= 1 && id <= 5 && id !== activeMod) {
          setActiveMod(id);
          prevModRef.current = id;
        }
      } else {
        navigate(`/ialab/${activeMod}`, { replace: true });
      }
    }, [urlMod]);
    // === Fin Deep Linking ===

    const handleOpenProfile = () => {
      closeMobileMenu();
      openUserProfile();
    };
    const handleOpenHistory = () => {
      closeMobileMenu();
      setTimeout(() => setShowHistoryModal(true), 350);
    };
    const handleOpenHelp = () => {
      closeMobileMenu();
      setTimeout(() => setShowHelpModal(true), 350);
    };

    // Escuchar eventos de examen completado para forzar refresco UI
    useEffect(() => {
        const handler = () => setExamRefreshKey(k => k + 1);
        window.addEventListener('ialab:examCompleted', handler);
        return () => window.removeEventListener('ialab:examCompleted', handler);
    }, []);

    React.useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    // Reset scroll al inicio al cargar el dashboard
    React.useEffect(() => {
        const forceScrollToTop = () => {
            const mainEl = document.querySelector('main');
            if (mainEl) {
                mainEl.scrollTop = 0;
                requestAnimationFrame(() => {
                    mainEl.scrollTop = 0;
                });
            }
        };
        forceScrollToTop();
        window.addEventListener('popstate', forceScrollToTop);
        return () => window.removeEventListener('popstate', forceScrollToTop);
    }, []);

    // Escucha evento para abrir la comunidad desde TuRutaDeHoy
    React.useEffect(() => {
        const handleSwitchTab = (e) => {
            if (e.detail === 'comunidad') {
                setIsForumOpen(true);
                setTimeout(() => {
                    document.getElementById('forum-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 350);
            }
        };
        window.addEventListener('ialab:switchTab', handleSwitchTab);
        return () => window.removeEventListener('ialab:switchTab', handleSwitchTab);
    }, []);

    // Tour: no mostrar si ya empezó el curso
    const isLoadingProgress = useIALabStore(s => s.isLoadingProgress);
    const hasStartedCourse = useIALabStore(s => s.hasStartedCourse());
    const lastVisitedLesson = useIALabStore(s => s.lastVisitedLesson);
    const currentLessonTitle = lastVisitedLesson && lastVisitedLesson.moduleId === activeMod
      ? ALL_LESSONS?.[activeMod]?.find(l => l.id === lastVisitedLesson.lessonId)?.title
      : null;

    // Celebración al aprobar módulo completamente (exam + challenge + resources + score >= 80)
    const prevFullyApproved = React.useRef(false);
    const fullyApproved = useIALabStore(s => s.isModuleFullyApproved(activeMod));
    React.useEffect(() => {
        if (fullyApproved && !prevFullyApproved.current) {
            fireConfetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#004B63', '#00BCD4', '#FFD166', '#10B981']
            });
            speakTextConversational(t('ialab.speech.module_passed'), 'valerio');
        }
        prevFullyApproved.current = fullyApproved;
    }, [fullyApproved]);

    // Celebración al completar el curso completo
    const prevCourseCompleted = React.useRef(false);
    const courseCompleted = useIALabStore(s => s.isCourseCompleted());
    React.useEffect(() => {
        if (courseCompleted && !prevCourseCompleted.current) {
            const duration = 4000;
            const end = Date.now() + duration;
            const frame = () => {
                fireConfetti({ particleCount: 80, spread: 100, origin: { y: 0.5 },
                    colors: ['#004B63', '#00BCD4', '#FFD166', '#10B981', '#EF4444'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
            speakTextConversational(t('ialab.speech.course_completed'), 'valerio');
            setTimeout(() => handleGlobalAction('OPEN_CERTIFICATE'), 2000);
        }
        prevCourseCompleted.current = courseCompleted;
    }, [courseCompleted]);

    // Handler para acciones globales
    const handleGlobalAction = useCallback((action, data) => {
        switch (action) {
            case 'OPEN_EVALUATION':
                setShowExamModal(true);
                break;
            case 'OPEN_QUIZ':
                setShowQuizModal(true);
                break;
            case 'OPEN_CHALLENGE':
                setShowPremiumEvaluationModal(true);
                break;
            case 'SHOW_EXAM_RESULT':
                setShowExamResult(true);
                break;
            case 'SHOW_CHALLENGE_RESULT':
                setShowChallengeResult(true);
                break;
            case 'OPEN_VALERIO':
                setShowValerioPanel(true);
                break;
            case 'CLOSE_EVALUATION':
                setShowExamModal(false);
                break;
            case 'CLOSE_QUIZ':
                setShowQuizModal(false);
                break;
            case 'CLOSE_VALERIO':
                setShowValerioPanel(false);
                break;
            case 'OPEN_CERTIFICATE':
            case 'SHOW_CERTIFICATE':
                setShowCertificateModal(true);
                break;
            case 'OPEN_COMMUNITY':
                window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'comunidad' }));
                break;
            default:
                console.warn('Acción global no manejada:', action, data);
        }
    }, []);

    useIALabKeyboardShortcuts(handleGlobalAction);

    return (
        <div className="flex flex-col h-dvh bg-bg-light dark:bg-slate-900">
                {/* Mobile Header - solo en móviles */}
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 landscape:h-12 bg-white dark:bg-slate-800 z-50 flex items-center justify-between px-4 landscape:px-3 border-b border-slate-200 dark:border-slate-700 safe-area-top">
                  <h1 className="text-2xl font-bold text-petroleum dark:text-petroleum tracking-tight">{t('ialab.title')}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowMobileSearch(true)}
                      className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50"
                       aria-label={t('ialab.search_aria')}
                    >
                      <Icon name="fa-search" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowMobileMenu(true)}
                      className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50"
                       aria-label={t('ialab.menu_aria')}
                   >
                     <svg className="w-6 h-6 text-petroleum dark:text-corporate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                     </svg>
                    </button>
                  </div>
                </div>

                {showMobileSearch && (
                  <GlobalSearchBar mobile onClose={() => setShowMobileSearch(false)} />
                )}

                {/* Header principal - oculto en móviles */}
                <div className="hidden md:block">
                  <IALabHeader onAction={handleGlobalAction} />
                </div>
                
                {/* Layout principal - Flexbox estricto para evitar overlap */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - oculto en móviles, visible desde lg (tablet landscape) */}
                    <div className="hidden lg:flex" data-tour="tour-sidebar">
                      <IALabSidebar />
                    </div>

                   {(showMobileMenu || mobileMenuClosing) && (
                     <div className="fixed inset-0 z-[1001] lg:hidden" role="dialog" aria-modal="true" aria-label={t('ialab.nav_menu_aria')}>
                        <div className={`absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity duration-250 ${mobileMenuClosing ? 'opacity-0' : 'opacity-100'}`} onClick={closeMobileMenu} />
                        <motion.div
                          initial={false}
                          animate={{ x: mobileMenuClosing ? -288 : 0 }}
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={{ left: 0.4, right: 0 }}
                          onDragEnd={(_, info) => { if (info.offset.x < -80) closeMobileMenu(); }}
                          className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-xl overflow-y-auto"
                          style={{ willChange: 'transform' }}>
                          <IALabMobileMenu
                            closeMobileMenu={closeMobileMenu}
                            toggleDarkMode={toggleDarkMode}
                            isDarkMode={isDarkMode}
                            onOpenProfile={handleOpenProfile}
                            onOpenHistory={handleOpenHistory}
                            onOpenHelp={handleOpenHelp}
                          />
                        </motion.div>
                      </div>
                    )}
                    
                      {/* Skip link para accesibilidad */}
                      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-petroleum focus:text-white focus:rounded-lg focus:text-sm focus:font-bold">
                        {t('ialab.skip_link')}
                      </a>

                      {/* Área de Contenido Principal - scroll propio */}
                       <main id="main-content"                         className="flex-1 overflow-y-auto px-4 pt-16 landscape:pt-12 pb-2 md:px-8 md:pt-4 lg:px-10 lg:pt-5 lg:pb-8 xl:px-12 2xl:px-16">
                        <AnimatePresence mode="wait" custom={directionRef.current}>
                          <motion.div
                            key={`content-${activeMod}`}
                            custom={directionRef.current}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                              x: { type: 'spring', stiffness: 300, damping: 30 },
                              opacity: { duration: shouldReduceMotion ? 0 : 0.2 },
                            }}
                            className="space-y-5 w-full max-w-7xl pb-8"
                          >
                            {/* Info bar móvil - solo visible en móvil */}
                            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-petroleum/8 dark:border-petroleum/20 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center text-white text-xs font-bold">
                                  {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user?.full_name || t('ialab.user_fallback')}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('ialab.module_progress', { current: activeMod, total: 5 })}</p>
                                </div>
                              </div>
                              <div className="px-3 py-1.5 bg-petroleum/8 dark:bg-petroleum/20 border border-petroleum/15 text-petroleum dark:text-petroleum rounded-lg font-semibold text-xs">
                                {t('ialab.completed_pct', { pct: Math.round(courseProgress) })}
                              </div>
                            </div>

                            {isLoadingProgress ? (
                              <motion.div key={`skeleton-ruta-${activeMod}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                <RouteSkeleton />
                              </motion.div>
                            ) : (
                              <motion.div key={`content-ruta-${activeMod}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="space-y-4">
                                <SectionErrorBoundary name="RecommendationsPanel" title={t('ialab.recommendations_unavailable')}>
                                  <RecommendationsPanel onAction={handleGlobalAction} isLoading={isLoadingProgress} />
                                </SectionErrorBoundary>
                                <div data-tour="tour-ruta">
                                  <SectionErrorBoundary name="TuRutaDeHoy" title={t('ialab.route_unavailable')}>
                                    <TuRutaDeHoy onAction={handleGlobalAction} />
                                  </SectionErrorBoundary>
                                </div>
                              </motion.div>
                            )}

                            {/* TAB PILLS - Navegación entre secciones */}
                            <div data-tour="tour-tabs" className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin-ialab">
                              {TABS.map((tab) => (
                                <button
                                  key={tab.id ?? 'all'}
                                  onClick={() => setViewSection(tab.id)}
                                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] md:px-3.5 md:py-2 md:text-xs font-semibold transition-all duration-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 border rounded-lg md:rounded-xl ${
                                    viewSection === tab.id
                                      ? 'bg-gradient-to-r from-petroleum to-corporate text-white border-petroleum/30 shadow-md shadow-petroleum/10 ring-1 ring-white/20'
                                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:border-petroleum/30 hover:text-petroleum dark:hover:text-petroleum hover:shadow-sm'
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                              <button
                                onClick={toggleDarkMode}
                                className="w-9 h-9 p-1 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center transition-all duration-300 hover:shadow-md hover:shadow-petroleum/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30 ml-2 flex-shrink-0"
                                aria-label={isDarkMode ? t('ialab.theme_light') : t('ialab.theme_dark')}
                              >
                                <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-sm transition-all duration-300 ${isDarkMode ? 'text-amber-300' : 'text-white'}`} />
                              </button>
                            </div>

                          <div>
                            <Breadcrumbs
                              segments={[
                                { label: t('ialab.breadcrumb_home'), icon: 'fa-house', onClick: () => setViewSection(null) },
                                { label: modules?.find(m => m.id === activeMod)?.title || t('ialab.breadcrumb_module', { id: activeMod }), onClick: () => setViewSection(null) },
                                ...(viewSection ? [{ label: TABS.find(t => t.id === viewSection)?.label || viewSection }] : []),
                                ...(viewSection === null && currentLessonTitle ? [{ label: currentLessonTitle }] : []),
                              ]}
                              size="text-[10px] md:text-xs"
                            />

                            {/* 1. TÍTULO PRINCIPAL */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null) && (
                              <motion.div key={`title-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                {isLoadingProgress ? (
                                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
                                    <div className="space-y-2 flex-1">
                                      <div className="h-5 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                      <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                    </div>
                                  </div>
                                ) : (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                                    <SectionErrorBoundary name="IALabModuleHeader" title={t('ialab.header_unavailable')}>
                                      <IALabModuleHeader onAction={handleGlobalAction} />
                                    </SectionErrorBoundary>
                                  </motion.div>
                                )}
                              </motion.div>
                            )}
                            </AnimatePresence>

                            {/* 2. SECCIÓN INFORMATIVA DEL MÓDULO */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'objetivos') && (
                              <motion.div key={`info-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="mt-4" data-tour="tour-objetivos">
                                {isLoadingProgress ? <ModuleInfoSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                                  <SectionErrorBoundary name="ModuleInfoSection" title={t('ialab.info_unavailable')}>
                                    <ModuleInfoSection />
                                  </SectionErrorBoundary>
                                </motion.div>}
                              </motion.div>
                            )}
                            </AnimatePresence>

                            {/* 3. TEMAS DEL MÓDULO - ACORDEÓN */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'contenido') && (
                              <motion.div key={`temas-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} data-tour="tour-temas">
                              <SectionErrorBoundary>
                                {isLoadingProgress ? <ModuleOverviewSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}><ModuleOverviewCard onAction={handleGlobalAction} onToggleForum={setIsForumOpen} /></motion.div>}
                              </SectionErrorBoundary>
                              </motion.div>
                            )}
                            </AnimatePresence>

                            {/* 4. ACTIVIDADES DEL MÓDULO */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'actividades') && (
                              <motion.div key={`actividades-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} data-tour="tour-actividades">
                              <SectionErrorBoundary>
                              {isLoadingProgress ? <ModuleActionsSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}><ModuleActions
                                onAction={handleGlobalAction}
                                activeMod={activeMod}
                                challengeScores={challengeScores}
                                completedExams={completedExams}
                                moduleProgress={moduleProgress}
                                isForumOpen={isForumOpen}
                                onToggleForum={() => setIsForumOpen(prev => !prev)}
                              /></motion.div>}
                              </SectionErrorBoundary>
                              </motion.div>
                            )}
                            </AnimatePresence>

                          </div>

                            {/* 5. FORO DEL MÓDULO */}
                            {(viewSection === null || viewSection === 'actividades') && isForumOpen && (
                              <div id="forum-section">
                                <SectionErrorBoundary>
                                  <Suspense fallback={<div className="h-20 bg-white/50 rounded-xl animate-pulse" />}>
                                    <IALabForumOptimized compact={false} initialLimit={3} />
                                  </Suspense>
                                </SectionErrorBoundary>
                              </div>
                            )}

                            {/* Herramientas + Tutorías */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'herramientas') && (
                              <motion.div key={`tools-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="mt-5" data-tour="tour-herramientas">
                                {isLoadingProgress ? <ToolsSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                                  <SectionErrorBoundary name="ToolTutorAccordion" title={t('ialab.tools_unavailable')}>
                                    <ToolTutorAccordion onAction={handleGlobalAction} />
                                  </SectionErrorBoundary>
                                </motion.div>}
                              </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                <IALabModals
                  showExamModal={showExamModal}
                  handleGlobalAction={handleGlobalAction}
                  showQuizModal={showQuizModal}
                  showValerioPanel={showValerioPanel}
                  showPremiumEvaluationModal={showPremiumEvaluationModal}
                  setShowPremiumEvaluationModal={setShowPremiumEvaluationModal}
                  showCertificateModal={showCertificateModal}
                  setShowCertificateModal={setShowCertificateModal}
                  showBadgeGallery={showBadgeGallery}
                  setShowBadgeGallery={setShowBadgeGallery}
                  showLeaderboard={showLeaderboard}
                  setShowLeaderboard={setShowLeaderboard}
                  showExamResult={showExamResult}
                  activeMod={activeMod}
                  completedExams={completedExams}
                  showHistoryModal={showHistoryModal}
                  setShowHistoryModal={setShowHistoryModal}
                  showHelpModal={showHelpModal}
                  setShowHelpModal={setShowHelpModal}
                  showChallengeResult={showChallengeResult}
                  setShowChallengeResult={setShowChallengeResult}
                />

                {/* FAB de Valerio - posicionado relativo al viewport */}
                 <button 
                       className="fixed bottom-4 right-4 landscape:bottom-2 landscape:right-2 lg:bottom-8 lg:right-8 w-12 h-12 landscape:w-10 landscape:h-10 lg:w-16 lg:h-16 bg-gradient-to-br from-petroleum to-corporate rounded-xl lg:rounded-2xl shadow-lg dark:shadow-premium-lg hover:shadow-xl dark:hover:shadow-premium hover:scale-105 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 safe-area-bottom"
                       onClick={() => handleGlobalAction('OPEN_VALERIO')}
                       aria-label={t('ialab.valerio_aria')}
                       data-tour="tour-valerio"
                   >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 landscape:w-6 landscape:h-6 group-hover:scale-110 transition-transform duration-300">
                        <path d="M12 3C8.5 3 6 5.5 6 9C6 10.5 6.5 12 7.5 13C8.5 14 9.5 15 10 16C10.5 17 11 18 12 18C13 18 13.5 17 14 16C14.5 15 15.5 14 16.5 13C17.5 12 18 10.5 18 9C18 5.5 15.5 3 12 3Z" fill="white" />
                        <path d="M9 7C8.5 7 8 7.5 8 8C8 8.5 8.5 9 9 9C9.5 9 10 8.5 10 8C10 7.5 9.5 7 9 7Z" fill="var(--color-petroleum-dark)" />
                        <path d="M15 7C14.5 7 14 7.5 14 8C14 8.5 14.5 9 15 9C15.5 9 16 8.5 16 8C16 7.5 15.5 7 15 7Z" fill="var(--color-petroleum-dark)" />
                        <path d="M12 5C11.5 5 11 5.5 11 6C11 6.5 11.5 7 12 7C12.5 7 13 6.5 13 6C13 5.5 12.5 5 12 5Z" fill="white" />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                </button>
                


                {/* Banner de conectividad */}
                <OfflineBanner />

                {/* Tour interactivo contextual */}
                <IALabTour hasStartedCourse={hasStartedCourse} />

                {/* Toast notification */}
                {toast && (
                    <div
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-in max-w-md ${
                            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                        role="alert"
                        aria-live="polite"
                    >
                        {toast.message}
                    </div>
                )}

                <AchievementToast toasts={achievementToasts} removeToast={removeAchievementToast} />

        </div>
    );
};

/**
 * Componente principal wrapper que provee el contexto
 */
const IALab = () => {
    return (
        <IALabProvider>
            <SectionErrorBoundary>
                <IALabContent />
            </SectionErrorBoundary>
        </IALabProvider>
    );
};

export default IALab;