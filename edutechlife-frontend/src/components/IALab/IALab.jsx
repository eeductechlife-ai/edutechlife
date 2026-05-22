import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { IALabProvider, useIALabContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
const fireConfetti = (opts) => import('canvas-confetti').then(m => m.default(opts));

import { speakTextConversational } from '../../utils/speech';
import IALabHeader from './IALabHeader';
import IALabSidebar from './IALabSidebar';
import IALabMobileMenu from './IALabMobileMenu';
import IALabModuleHeader from './IALabModuleHeader';
import ModuleOverviewCard from './ModuleOverviewCard';
import ModuleInfoSection from './ModuleInfoSection';
import ToolTutorAccordion from './ToolTutorAccordion';
import TuRutaDeHoy from './TuRutaDeHoy';
import ModuleActions from './ModuleActions';
import IALabTour from './IALabTour';

const preloadForum = () => import('./IALabForumOptimized');
const IALabForumOptimized = lazy(preloadForum);
import OfflineBanner from './OfflineBanner';
import GlobalSearchBar from './GlobalSearchBar';
import { RouteSkeleton, ModuleInfoSkeleton, ModuleOverviewSkeleton, ModuleActionsSkeleton, ToolsSkeleton } from './IALabSkeleton';
import useIALabKeyboardShortcuts from '../../hooks/IALab/useIALabKeyboardShortcuts';
import ErrorBoundary from '../forum/ErrorBoundary';
import { useTheme } from '../../context/ThemeContext';
import SettingsSupportModal from '../modals/SettingsSupportModal';
import { useSessionTracker } from '../../hooks/useSessionTracker';
import { useSidebarState } from '../../hooks/IALab/useSidebarState';

// Lazy-loaded modals (only loaded when opened)
const lazyImports = {
  IALabEvaluationModal: () => import('./IALabEvaluationModal'),
  IALabEvaluationModalPremium: () => import('./IALabEvaluationModalPremium'),
  IALabQuizModal: () => import('./IALabQuizModal'),
  IALabValerioPanel: () => import('./IALabValerioPanel'),
  ExamResultViewer: () => import('./ExamResultViewer'),
  ChallengeResultViewer: () => import('./ChallengeResultViewer'),
  CertificatesModal: () => import('../modals/CertificatesModal'),
  Forum: preloadForum,
  ActivityHistory: () => import('../ActivityHistory'),
};
const IALabEvaluationModal = lazy(lazyImports.IALabEvaluationModal);
const IALabEvaluationModalPremium = lazy(lazyImports.IALabEvaluationModalPremium);
const IALabQuizModal = lazy(lazyImports.IALabQuizModal);
const IALabValerioPanel = lazy(lazyImports.IALabValerioPanel);
const ExamResultViewer = lazy(lazyImports.ExamResultViewer);
const ChallengeResultViewer = lazy(lazyImports.ChallengeResultViewer);
const CertificatesModal = lazy(lazyImports.CertificatesModal);
const ActivityHistory = lazy(lazyImports.ActivityHistory);

const LoadingSpinner = ({ onRetry }) => {
  const [showTimeout, setShowTimeout] = useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShowTimeout(true), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-500 font-medium">Cargando...</p>
      {showTimeout && onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-xs font-semibold text-petroleum border border-petroleum/30 rounded-xl hover:bg-petroleum/5 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

const SuspenseWrapper = ({ children, onRetry }) => {
  const [retryKey, setRetryKey] = useState(0);
  const handleRetry = onRetry ? onRetry : () => setRetryKey(k => k + 1);
  return (
    <Suspense fallback={<LoadingSpinner onRetry={handleRetry} />}>
      <div key={retryKey}>{children}</div>
    </Suspense>
  );
};

/**
 * Componente principal wrapper para IALab - Arquitectura modular premium
 * Integra todos los componentes modulares manteniendo 100% la estructura visual original
 * Elimina componentes redundantes (cuadro "¿Listo para avanzar?" y quiz evaluación inline)
 * 
 * @returns {JSX.Element} Componente IALab completo
 */
const IALabContent = () => {
    const { showPremiumEvaluationModal, setShowPremiumEvaluationModal, user, completedModules, courseProgress, activeMod, setActiveMod, showCertificateModal, setShowCertificateModal, completedExams, challengeScores, moduleProgress, modules } = useIALabContext();
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
    const { isCollapsed } = useSidebarState();

    // === Deep Linking UNIFICADO: un solo flujo URL → Store ===
    const { moduleId: urlMod } = useParams();
    const navigate = useNavigate();
    const prevModRef = useRef(activeMod);
    const directionRef = useRef(0);
    const prevActiveRef = useRef(activeMod);
    if (prevActiveRef.current !== activeMod) {
      directionRef.current = activeMod > prevActiveRef.current ? 1 : -1;
      prevActiveRef.current = activeMod;
    }
    const shouldReduceMotion = useReducedMotion();

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

    // Sincronización EN RENDER: elimina el flash de deep link (/ialab/4 → módulo 4 directo)
    if (urlMod) {
      const id = parseInt(urlMod, 10);
      if (!isNaN(id) && id >= 1 && id <= 5 && id !== activeMod) {
        setActiveMod(id);
        prevModRef.current = id;
      }
    }

    // Efecto único: URL cambió (back/forward/navegación externa) → actualizar store
    useEffect(() => {
      if (urlMod) {
        const id = parseInt(urlMod, 10);
        if (!isNaN(id) && id >= 1 && id <= 5 && id !== activeMod) {
          setActiveMod(id);
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

    const TABS = [
      { id: null, label: 'Todo' },
      { id: 'objetivos', label: 'Objetivos' },
      { id: 'contenido', label: 'Contenido' },
      { id: 'actividades', label: 'Actividades' },
      { id: 'herramientas', label: 'Herramientas' },
    ];

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
    const ALL_LESSONS_STORE = useIALabStore(s => s.ALL_LESSONS);
    const currentLessonTitle = lastVisitedLesson && lastVisitedLesson.moduleId === activeMod
      ? ALL_LESSONS_STORE?.[activeMod]?.find(l => l.id === lastVisitedLesson.lessonId)?.title
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
            speakTextConversational('Felicitaciones, continúa así. Has aprobado este módulo.', 'valerio');
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
            speakTextConversational('Felicitaciones, has terminado el curso. Descarga tu certificado.', 'valerio');
            setTimeout(() => handleGlobalAction('OPEN_CERTIFICATE'), 2000);
        }
        prevCourseCompleted.current = courseCompleted;
    }, [courseCompleted]);

    // Handler para acciones globales
    const handleGlobalAction = (action, data) => {
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
    };

    useIALabKeyboardShortcuts(handleGlobalAction);

    useEffect(() => {
      Object.values(lazyImports).forEach(fn => fn());
    }, []);

    return (
        <div className="flex flex-col h-dvh bg-bg-light dark:bg-slate-900">
                {/* Mobile Header - solo en móviles */}
                <div className="md:hidden fixed top-0 left-0 right-0 h-16 landscape:h-12 bg-white dark:bg-slate-800 z-50 flex items-center justify-between px-4 landscape:px-3 border-b border-slate-200 dark:border-slate-700 safe-area-top">
                  <h1 className="text-2xl font-bold text-petroleum dark:text-petroleum tracking-tight">IA Lab</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowMobileSearch(true)}
                      className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50"
                      aria-label="Buscar"
                    >
                      <Icon name="fa-search" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowMobileMenu(true)}
                      className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50"
                      aria-label="Abrir menú"
                      data-tour="tour-undermenu-mobile"
                    >
                      <Icon name="fa-bars" className="w-5 h-5" />
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
                    <div className={`${isCollapsed ? 'flex' : 'hidden lg:flex'}`} data-tour="tour-sidebar">
                      <IALabSidebar />
                    </div>

                    {/* Drawer móvil con overlay + swipe to close */}
                    {(showMobileMenu || mobileMenuClosing) && (
                      <div className="fixed inset-0 z-[1001] lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
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
                        Saltar al contenido
                      </a>

                      {/* Área de Contenido Principal - scroll propio */}
                       <main id="main-content" className="flex-1 overflow-y-auto h-full px-4 pt-12 landscape:pt-2 pb-2 md:px-8 md:py-4 lg:px-10 lg:py-5 xl:px-12 2xl:px-16">
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
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user?.full_name || 'Usuario'}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Módulo {activeMod} de 5</p>
                                </div>
                              </div>
                              <div className="px-3 py-1.5 bg-petroleum/8 dark:bg-petroleum/20 border border-petroleum/15 text-petroleum dark:text-petroleum rounded-lg font-semibold text-xs">
                                {Math.round(courseProgress)}% Completado
                              </div>
                            </div>

                            {isLoadingProgress ? (
                              <motion.div key={`skeleton-ruta-${activeMod}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                <RouteSkeleton />
                              </motion.div>
                            ) : (
                              <motion.div key={`content-ruta-${activeMod}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                                <div data-tour="tour-ruta">
                                  <TuRutaDeHoy onAction={handleGlobalAction} />
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
                                aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
                              >
                                <Icon name={isDarkMode ? 'fa-sun' : 'fa-moon'} className={`text-sm transition-all duration-300 ${isDarkMode ? 'text-amber-300' : 'text-white'}`} />
                              </button>
                            </div>

                          <div>
                            {/* Breadcrumbs */}
                            <nav aria-label="Breadcrumb" className="mb-2">
                              <ol className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-600">
                                <li><button onClick={() => setViewSection(null)} className="font-medium text-slate-500 hover:text-petroleum transition-colors cursor-pointer">Inicio</button></li>
                                <li className="text-slate-300" aria-hidden="true">/</li>
                                <li><button onClick={() => setViewSection(null)} className="font-semibold text-petroleum hover:text-corporate transition-colors cursor-pointer truncate max-w-[120px] inline-block align-bottom">
                                  {modules?.find(m => m.id === activeMod)?.title || `Módulo ${activeMod}`}
                                </button></li>
                                {viewSection && (
                                  <>
                                    <li className="text-slate-300" aria-hidden="true">/</li>
                                    <li><span className="text-slate-500 capitalize">{TABS.find(t => t.id === viewSection)?.label || viewSection}</span></li>
                                  </>
                                )}
                                {viewSection === null && currentLessonTitle && (
                                  <>
                                    <li className="text-slate-300" aria-hidden="true">/</li>
                                    <li><span className="text-slate-500 truncate max-w-[120px] inline-block align-bottom">{currentLessonTitle}</span></li>
                                  </>
                                )}
                              </ol>
                            </nav>

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
                                    <IALabModuleHeader onAction={handleGlobalAction} />
                                  </motion.div>
                                )}
                              </motion.div>
                            )}
                            </AnimatePresence>

                            {/* 2. SECCIÓN INFORMATIVA DEL MÓDULO */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'objetivos') && (
                              <motion.div key={`info-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="mt-4" data-tour="tour-objetivos">
                                {isLoadingProgress ? <ModuleInfoSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}><ModuleInfoSection /></motion.div>}
                              </motion.div>
                            )}
                            </AnimatePresence>

                            {/* 3. TEMAS DEL MÓDULO - ACORDEÓN */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'contenido') && (
                              <motion.div key={`temas-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} data-tour="tour-temas">
                              <ErrorBoundary>
                                {isLoadingProgress ? <ModuleOverviewSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}><ModuleOverviewCard onAction={handleGlobalAction} onToggleForum={setIsForumOpen} /></motion.div>}
                              </ErrorBoundary>
                              </motion.div>
                            )}
                            </AnimatePresence>

                            {/* 4. ACTIVIDADES DEL MÓDULO */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'actividades') && (
                              <motion.div key={`actividades-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} data-tour="tour-actividades">
                              <ErrorBoundary>
                              {isLoadingProgress ? <ModuleActionsSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}><ModuleActions
                                onAction={handleGlobalAction}
                                activeMod={activeMod}
                                challengeScores={challengeScores}
                                completedExams={completedExams}
                                moduleProgress={moduleProgress}
                                isForumOpen={isForumOpen}
                                onToggleForum={() => setIsForumOpen(prev => !prev)}
                              /></motion.div>}
                              </ErrorBoundary>
                              </motion.div>
                            )}
                            </AnimatePresence>

                          </div>

                            {/* 5. FORO DEL MÓDULO */}
                            {(viewSection === null || viewSection === 'actividades') && isForumOpen && (
                              <div id="forum-section">
                                <ErrorBoundary>
                                  <Suspense fallback={<div className="h-20 bg-white/50 rounded-xl animate-pulse" />}>
                                    <IALabForumOptimized compact={false} initialLimit={3} />
                                  </Suspense>
                                </ErrorBoundary>
                              </div>
                            )}

                            {/* Herramientas + Tutorías */}
                            <AnimatePresence mode="wait">
                            {(viewSection === null || viewSection === 'herramientas') && (
                              <motion.div key={`tools-${activeMod}-${isLoadingProgress}`} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="mt-5" data-tour="tour-herramientas">
                                {isLoadingProgress ? <ToolsSkeleton /> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}><ToolTutorAccordion onAction={handleGlobalAction} /></motion.div>}
                              </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
                
                {/* Modal de Evaluación */}
                {showExamModal && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabEvaluationModal 
                                isOpen={showExamModal}
                                onClose={() => handleGlobalAction('CLOSE_EVALUATION')}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Modal de Examen (8 preguntas) */}
                {showQuizModal && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabQuizModal
                                isOpen={showQuizModal}
                                onClose={() => handleGlobalAction('CLOSE_QUIZ')}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Panel de Coach IA Valerio */}
                {showValerioPanel && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabValerioPanel 
                                isOpen={showValerioPanel}
                                onClose={() => handleGlobalAction('CLOSE_VALERIO')}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Modal de Evaluación Premium (Nuevo Desafío) */}
                {showPremiumEvaluationModal && (
                    <ErrorBoundary>
                        <SuspenseWrapper>
                            <IALabEvaluationModalPremium 
                                isOpen={showPremiumEvaluationModal}
                                onClose={() => setShowPremiumEvaluationModal(false)}
                            />
                        </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                {/* Modal de Certificado del Curso */}
                <ErrorBoundary>
                <SuspenseWrapper>
                    <CertificatesModal
                        isOpen={showCertificateModal}
                        onClose={() => setShowCertificateModal(false)}
                        initialTab="certificate"
                    />
                </SuspenseWrapper>
                </ErrorBoundary>

                {/* Modal de Resultado de Examen */}
                {showExamResult && (
                    <ErrorBoundary>
                    <SuspenseWrapper>
                        <ExamResultViewer
                            moduleId={activeMod}
                            score={useIALabStore.getState().completedExams[activeMod]}
                            onClose={() => setShowExamResult(false)}
                            onRetry={() => {
                                setShowExamResult(false);
                                handleGlobalAction('OPEN_QUIZ');
                            }}
                        />
                    </SuspenseWrapper>
                    </ErrorBoundary>
                )}

                {/* Modal de Historial de Aprendizaje */}
                <AnimatePresence>
                {showHistoryModal && (
                    <ErrorBoundary>
                        <ActivityHistory
                            isOpen={showHistoryModal}
                            onClose={() => setShowHistoryModal(false)}
                        />
                    </ErrorBoundary>
                )}
                </AnimatePresence>

                {/* Modal de Ayuda */}
                <AnimatePresence>
                {showHelpModal && (
                    <ErrorBoundary>
                        <SettingsSupportModal
                            isOpen={showHelpModal}
                            onClose={() => setShowHelpModal(false)}
                        />
                    </ErrorBoundary>
                )}
                </AnimatePresence>

                {/* Modal de Resultado de Desafío */}
                {showChallengeResult && (
                    <ErrorBoundary>
                    <SuspenseWrapper>
                        <ChallengeResultViewer
                            moduleId={activeMod}
                            onClose={() => setShowChallengeResult(false)}
                            onRetry={() => {
                                setShowChallengeResult(false);
                                useIALabStore.getState().setChallengeScore(0);
                                useIALabStore.getState().setIsChallengeCompleted(false);
                                setShowPremiumEvaluationModal(true);
                            }}
                        />
                    </SuspenseWrapper>
                    </ErrorBoundary>
                )}
                
                 {/* FAB de Valerio - posicionado relativo al viewport */}
                 <button 
                       className="fixed bottom-4 right-4 landscape:bottom-2 landscape:right-2 lg:bottom-8 lg:right-8 w-12 h-12 landscape:w-10 landscape:h-10 lg:w-16 lg:h-16 bg-gradient-to-br from-petroleum to-corporate rounded-xl lg:rounded-2xl shadow-lg dark:shadow-premium-lg hover:shadow-xl dark:hover:shadow-premium hover:scale-105 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 safe-area-bottom"
                       onClick={() => handleGlobalAction('OPEN_VALERIO')}
                       aria-label="Abrir panel de coach IA Valerio"
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
                
                {/* Scrollbar delgada visible en iOS */}
                <style>{`
                  .scrollbar-thin-ialab {
                    scrollbar-width: thin;
                    -webkit-overflow-scrolling: touch;
                  }
                  .scrollbar-thin-ialab::-webkit-scrollbar {
                    height: 4px;
                    width: 4px;
                  }
                  .scrollbar-thin-ialab::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .scrollbar-thin-ialab::-webkit-scrollbar-thumb {
                    background: color-mix(in srgb, var(--color-petroleum) 25%, transparent);
                    border-radius: 20px;
                  }
                  .scrollbar-thin-ialab::-webkit-scrollbar-thumb:hover {
                    background: color-mix(in srgb, var(--color-petroleum) 40%, transparent);
                  }
                `}</style>

                {/* Estilos de protección anti-impresión (para modal de evaluación) */}
                <style>
                    {`
                        @media print {
                            .exam-protection-modal,
                            .exam-protection-modal * {
                                display: none !important;
                                visibility: hidden !important;
                                opacity: 0 !important;
                            }
                            
                            body::before {
                                content: "IMPRESIÓN BLOQUEADA - Este examen está protegido por el protocolo de seguridad Edutechlife";
                                display: block !important;
                                font-size: 24px;
                                font-weight: bold;
                                text-align: center;
                                color: red;
                                padding: 40px;
                                background: white;
                            }
                        }
                        
                        /* Animación para mensajes temporales */
                        @keyframes fade-in {
                            from { opacity: 0; transform: translate(-50%, -10px); }
                            to { opacity: 1; transform: translate(-50%, 0); }
                        }
                        
                        .animate-fade-in {
                            animation: fade-in 0.3s ease-out;
                        }
                        
                        /* Efectos de botón premium */
                        .button-pulse {
                            animation: pulse 2s infinite;
                        }
                        
                        @keyframes pulse {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(0, 188, 212, 0.4); }
                            50% { box-shadow: 0 0 0 10px rgba(0, 188, 212, 0); }
                        }
                        
                        /* Scrollbar personalizada */
                        ::-webkit-scrollbar {
                            width: 8px;
                            height: 8px;
                        }
                        
                        ::-webkit-scrollbar-track {
                            background: var(--color-slate-100);
                            border-radius: 4px;
                        }
                        
                        ::-webkit-scrollbar-thumb {
                            background: linear-gradient(to bottom, var(--color-petroleum), var(--color-corporate));
                            border-radius: 4px;
                        }
                        
                        ::-webkit-scrollbar-thumb:hover {
                            background: linear-gradient(to bottom, var(--color-petroleum-darker), var(--color-corporate));
                        }
                    `}
                </style>

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


            </div>
    );
};

/**
 * Componente principal wrapper que provee el contexto
 */
const IALab = () => {
    return (
        <IALabProvider>
            <ErrorBoundary>
                <IALabContent />
            </ErrorBoundary>
        </IALabProvider>
    );
};

export default IALab;