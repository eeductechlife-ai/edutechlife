/**
 * IALab — Componente principal del laboratorio IALab
 */
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useRef,
  useLayoutEffect,
  memo,
} from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  IALabProvider,
  useIALabProgressContext,
  useIALabUIContext,
} from "../../context/IALabContext";
import { getAllLessons } from "../../data/ialab";
import { useIALabStore } from "../../store/ialabStore";
import { usePullToRefresh } from "../../hooks/IALab/usePullToRefresh";
import { useSwipeNavigation } from "../../hooks/IALab/useSwipeNavigation";
import { useCelebrationEffects } from "../../hooks/IALab/useCelebrationEffects";
import "./IALab.css";
import MobileMenuOverlay from "./shared/MobileMenuOverlay";
import TabPills from "./shared/TabPills";
import AnimatedSection from "./shared/AnimatedSection";
import SkipLink from "./shared/SkipLink";
import A11yProvider from "./A11yProvider";
import IALabHeader from "./IALabHeader";
import IALabSidebar from "./IALabSidebar";
import IALabModals from "./IALabModals";
import IALabModuleHeader from "./IALabModuleHeader";
import ModuleInfoSection from "./ModuleInfoSection";
import Breadcrumbs from "./Breadcrumbs";
import handleGlobalAction from "./handleGlobalAction";
import { createSlideVariants } from "./IALabAnimations";

const preloadForum = () => import("./IALabForumOptimized");
const IALabForumOptimized = lazy(preloadForum);
const ModuleOverviewCard = lazy(() => import("./ModuleOverviewCard"));
const DailyPlan = lazy(() => import("./DailyPlan"));
const ModuleActions = lazy(() => import("./ModuleActions"));
const ModulePractice = lazy(() => import("./ModulePractice"));
const IALabTour = lazy(() => import("./IALabTour"));
const AchievementToast = lazy(() => import("./AchievementToast"));

import OfflineBanner from "./OfflineBanner";
import GlobalSearchBar from "./GlobalSearchBar";
import {
  RouteSkeleton,
  ModuleInfoSkeleton,
  ModuleOverviewSkeleton,
  ModuleActionsSkeleton,
  ToolsSkeleton,
} from "./IALabSkeleton";
import useIALabKeyboardShortcuts from "../../hooks/IALab/useIALabKeyboardShortcuts";
import SectionErrorBoundary from "./SectionErrorBoundary";
import {
  SPRING_STIFFNESS,
  SPRING_DAMPING,
  MOBILE_MENU_WIDTH,
  LOADING_TIMEOUT,
  TOAST_DURATION,
  MODAL_DELAY,
  SCROLL_DELAY,
  SWIPE_THRESHOLD,
  PULL_REFRESH_THRESHOLD,
  CONFETTI_PARTICLE_COUNT,
  CONFETTI_SPREAD,
  CELEBRATION_DURATION,
  CERTIFICATE_DELAY,
} from "./constants/IALabConfig";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../i18n/I18nProvider";
import ValerioFloatingButton from "./ValerioFloatingButton";
import { useSessionTracker } from "../../hooks/useSessionTracker";
import { useAchievementNotifications } from "../../hooks/useAchievementNotifications";
const IALabValerioPanel = lazy(() => import("./IALabValerioPanel"));
const BookmarksTab = lazy(() => import("./BookmarksTab"));
import MobileHeader from "./shared/MobileHeader";
import MobileInfoBar from "./shared/MobileInfoBar";
import ToastNotification from "./shared/ToastNotification";
import XPToast from "./XPToast";

const createTABS = (t) => [
  { id: null, label: t("ialab.tab_all") },
  { id: "objetivos", label: t("ialab.tab_objectives") },
  { id: "contenido", label: t("ialab.tab_content") },
  { id: "actividades", label: t("ialab.tab_activities") },
  { id: "practica", label: t("ialab.tab_practice") },
  { id: "guardados", label: t("ialab.tab_bookmarks"), icon: "fa-bookmark" },
];

const IALabContent = memo(function () {
  const { t, locale } = useTranslation();
  const TABS = useMemo(() => createTABS(t), [t]);
  const _bookmarkVersion = useIALabStore((s) => s._bookmarkVersion);
  const bookmarkBadge = useMemo(
    () => useIALabStore.getState().getBookmarkedResources().length,
    [_bookmarkVersion],
  );
  const { user } = useIALabUIContext();
  const { toasts: achievementToasts, removeToast: removeAchievementToast } =
    useAchievementNotifications(useIALabStore);
  const {
    completedModules,
    courseProgress,
    activeMod,
    setActiveMod,
    completedExams,
    challengeScores,
    moduleProgress,
    modules,
  } = useIALabProgressContext();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showValerioPanel, setShowValerioPanel] = useState(false);
  const showValerioDrawer = useIALabStore((s) => s.showValerioDrawer);
  const setShowValerioDrawer = useIALabStore((s) => s.setShowValerioDrawer);
  const valerioInitialMessage = useIALabStore((s) => s.valerioInitialMessage);
  const setValerioInitialMessage = useIALabStore((s) => s.setValerioInitialMessage);
  useEffect(() => {
    if (showValerioDrawer) {
      setShowValerioPanel(true);
      setShowValerioDrawer(false);
    }
  }, [showValerioDrawer, setShowValerioDrawer]);
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
  const [isForumOpen, setIsForumOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const viewSection = searchParams.get("tab") || null;
  const setViewSection = useCallback(
    (tabId) => {
      setSearchParams(tabId ? { tab: tabId } : {}, { replace: true });
    },
    [setSearchParams],
  );
  const [examRefreshKey, setExamRefreshKey] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModuleTransitioning, setIsModuleTransitioning] = useState(false);
  const prevActiveModRef = useRef(activeMod);

  useEffect(() => {
    if (prevActiveModRef.current !== activeMod) {
      setIsModuleTransitioning(true);
      prevActiveModRef.current = activeMod;
      const timer = setTimeout(() => setIsModuleTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeMod]);
  const isScrollingRef = useRef(false);
  const {
    containerRef,
    pullDistance,
    isRefreshing,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePullToRefresh({
    onRefresh: async () => {
      setRefreshKey((k) => k + 1);
      window.dispatchEvent(new CustomEvent("ialab:refresh"));
    },
    threshold: PULL_REFRESH_THRESHOLD,
  });

  useSessionTracker();

  // === Deep Linking UNIFICADO: URL como fuente de verdad ===
  const { moduleId: urlMod } = useParams();
  const navigate = useNavigate();
  const directionRef = useRef(0);
  const prevActiveRef = useRef(activeMod);
  const shouldReduceMotion = useReducedMotion();
  const mainRef = useRef(null);

  // Dirección de animación derivada de cambios en activeMod
  useEffect(() => {
    if (prevActiveRef.current !== activeMod) {
      directionRef.current = activeMod > prevActiveRef.current ? 1 : -1;
      prevActiveRef.current = activeMod;
      mainRef.current?.focus();
    }
  }, [activeMod]);

  const slideVariants = createSlideVariants(shouldReduceMotion);

  // Sincronización URL ↔ Store (useLayoutEffect para evitar flash)
  useLayoutEffect(() => {
    if (urlMod) {
      const id = parseInt(urlMod, 10);
      if (!isNaN(id) && id >= 1 && id <= 5) {
        useIALabStore.getState().setActiveMod(id);
      }
    } else {
      navigate(`/ialab/${useIALabStore.getState().activeMod}`, {
        replace: true,
      });
    }
  }, [urlMod]);
  // === Fin Deep Linking ===

  const handleOpenProfile = () => {
    closeMobileMenu();
    // Antes abria el modal de perfil de Clerk, que sin sesion de Clerk no
    // abria nada. Lleva al perfil propio de la plataforma.
    const id = useIALabStore.getState().userId;
    navigate(id ? `/profile/${id}` : "/profile");
  };

  const handleOpenHistory = () => {
    closeMobileMenu();
    useIALabStore.getState().setShowHistoryModal(true);
  };

  const handleOpenHelp = () => {
    closeMobileMenu();
    useIALabStore.getState().setShowHelpModal(true);
  };

  // Escuchar eventos de examen completado para forzar refresco UI
  useEffect(() => {
    const handler = () => setExamRefreshKey((k) => k + 1);
    window.addEventListener("ialab:examCompleted", handler);
    return () => window.removeEventListener("ialab:examCompleted", handler);
  }, []);

  useEffect(() => {
    let rafId;
    const forceScrollToTop = () => {
      rafId = requestAnimationFrame(() => {
        const mainEl = document.querySelector("main");
        if (mainEl) mainEl.scrollTop = 0;
      });
    };
    forceScrollToTop();
    window.addEventListener("popstate", forceScrollToTop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("popstate", forceScrollToTop);
    };
  }, []);

  // Escucha evento para abrir la comunidad
  useEffect(() => {
    const handleSwitchTab = (e) => {
      if (e.detail === "comunidad") {
        setIsForumOpen(true);
        setTimeout(() => {
          document
            .getElementById("forum-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, SCROLL_DELAY);
      }
    };
    window.addEventListener("ialab:switchTab", handleSwitchTab);
    return () => window.removeEventListener("ialab:switchTab", handleSwitchTab);
  }, []);

  // Auto-cerrar MAX cuando se abre un modal inmersivo (video/OVA)
  const immersiveModalOpen = useIALabStore((s) => s.immersiveModalOpen);
  useEffect(() => {
    if (immersiveModalOpen) setShowValerioPanel(false);
  }, [immersiveModalOpen]);

  // Tour: no mostrar si ya empezó el curso
  const isLoadingProgress = useIALabStore((s) => s.isLoadingProgress);
  const hasStartedCourse = useIALabStore((s) => s.hasStartedCourse());
  const lastVisitedLesson = useIALabStore((s) => s.lastVisitedLesson);
  const currentLessonTitle =
    lastVisitedLesson && lastVisitedLesson.moduleId === activeMod
      ? getAllLessons(locale)?.[activeMod]?.find(
          (l) => l.id === lastVisitedLesson.lessonId,
        )?.title
      : null;


  // Handler para acciones globales
  const handleAction = useCallback((action, data) => {
    if (action === "OPEN_VALERIO") {
      setShowValerioPanel(true);
      return;
    }
    if (action === "CLOSE_VALERIO") {
      setShowValerioPanel(false);
      return;
    }
    if (action === "OPEN_SEARCH") {
      setIsSearchOpen(true);
      return;
    }
    if (action === "OPEN_PRACTICE") {
      useIALabStore.getState().setPracticeTool('tutoring');
      return;
    }
    const s = useIALabStore.getState();
    handleGlobalAction(action, data, s);
  }, []);

  useCelebrationEffects(activeMod, handleAction);

  useIALabKeyboardShortcuts(handleAction);

  const setActiveModStore = useIALabStore((s) => s.setActiveMod);
  const setMainRef = useCallback((el) => {
    mainRef.current = el;
    containerRef.current = el;
  }, []);
  const resetViewSection = useCallback(() => setViewSection(null), []);
  const {
    handleTouchStart: swipeStart,
    handleTouchMove: swipeMove,
    handleTouchEnd: swipeEnd,
  } = useSwipeNavigation({
    onSwipeLeft: () => activeMod < 5 && setActiveModStore(activeMod + 1),
    onSwipeRight: () => activeMod > 1 && setActiveModStore(activeMod - 1),
    threshold: SWIPE_THRESHOLD,
    isScrollingRef,
  });

  return (
    <div
      data-testid="ialab-container"
      className={`flex flex-col h-dvh bg-bg-light touch-manipulation${isDarkMode ? " dark" : ""}`}
      onTouchStart={swipeStart}
      onTouchMove={swipeMove}
      onTouchEnd={swipeEnd}
    >
      <MobileHeader
        onOpenMobileMenu={() => setShowMobileMenu(true)}
        setIsSearchOpen={setIsSearchOpen}
        isSearchOpen={isSearchOpen}
      />

      {isSearchOpen && (
        <GlobalSearchBar mobile onClose={() => setIsSearchOpen(false)} />
      )}

      <header role="banner" className="hidden md:block">
        <IALabHeader onAction={handleAction} />
      </header>

      {/* Layout principal - Flexbox estricto para evitar overlap */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - oculto en móviles, visible desde md (tablet) */}
        <div className="hidden md:flex" data-tour="tour-sidebar">
          <IALabSidebar />
        </div>

        <MobileMenuOverlay
          showMobileMenu={showMobileMenu}
          mobileMenuClosing={mobileMenuClosing}
          closeMobileMenu={closeMobileMenu}
          MOBILE_MENU_WIDTH={MOBILE_MENU_WIDTH}
          SPRING_DAMPING={SPRING_DAMPING}
          SPRING_STIFFNESS={SPRING_STIFFNESS}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          handleOpenProfile={handleOpenProfile}
          handleOpenHistory={handleOpenHistory}
          handleOpenHelp={handleOpenHelp}
        />

        <SkipLink />

        {/* Área de Contenido Principal - scroll propio */}
        <main
          data-testid="ialab-main-content"
          role="main"
          ref={setMainRef}
          id="main-content"
          tabIndex={-1}
          className="flex-1 outline-none overflow-y-auto px-4 pt-16 landscape:pt-12 pb-2 safe-area-bottom md:px-5 md:pt-0 lg:px-8 lg:pt-0 lg:pb-8 xl:px-12 2xl:px-16"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {pullDistance > 0 && (
            <div
              className="flex items-center justify-center transition-all duration-100"
              style={{
                height: Math.min(pullDistance, 60),
                opacity: Math.min(pullDistance / 60, 1),
              }}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-petroleum ${isRefreshing ? "animate-spin border-t-transparent" : ""}`}
                style={{ transform: `rotate(${pullDistance * 3}deg)` }}
              />
            </div>
          )}
          <AnimatePresence mode="wait" custom={directionRef.current}>
            <motion.div
              key={`content-${activeMod}`}
              custom={directionRef.current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: SPRING_STIFFNESS, damping: 30 },
                opacity: { duration: shouldReduceMotion ? 0 : 0.2 },
              }}
              aria-live="polite"
              aria-atomic="true"
              className="flex flex-col gap-5 w-full max-w-7xl pb-8"
            >
              <MobileInfoBar
                user={user}
                activeMod={activeMod}
                courseProgress={courseProgress}
              />

              {/* Banner: Continuar donde lo dejaste */}
              {!isLoadingProgress && currentLessonTitle && viewSection === null && (
                <motion.div
                  key={`continue-banner-${activeMod}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-petroleum/10 to-corporate/8 border border-petroleum/20 rounded-xl"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white text-sm">▶</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-petroleum uppercase tracking-wide">{t("ialab.continue_banner_lesson")}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{currentLessonTitle}</p>
                  </div>
                  <button
                    onClick={() => setViewSection("contenido")}
                    className="flex-shrink-0 px-3 py-1.5 bg-petroleum text-white text-xs font-bold rounded-lg hover:bg-petroleum-dark transition-colors shadow-sm"
                  >
                    {t("ialab.continue_banner_cta")}
                  </button>
                </motion.div>
              )}

              {isLoadingProgress ? (
                <motion.div
                  key={`skeleton-ruta-${activeMod}`}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <RouteSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key={`content-ruta-${activeMod}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <Suspense fallback={<RouteSkeleton />}>
                    <SectionErrorBoundary name="DailyPlan">
                      <div data-tour="tour-ruta">
                        <DailyPlan
                          onAction={handleAction}
                          isLoading={isLoadingProgress}
                        />
                      </div>
                    </SectionErrorBoundary>
                  </Suspense>
                </motion.div>
              )}

              {/* TAB PILLS - Navegación entre secciones */}
              <div
                data-tour="tour-tabs"
                data-testid="ialab-tabs"
                role="tablist"
                className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin-ialab"
              >
                <TabPills
                  TABS={TABS}
                  viewSection={viewSection}
                  setViewSection={setViewSection}
                  badges={{ guardados: bookmarkBadge }}
                />
              </div>

              <div className="flex flex-col gap-5">
                <Breadcrumbs
                  segments={[
                    {
                      label: t("ialab.breadcrumb_home"),
                      icon: "fa-house",
                      onClick: resetViewSection,
                    },
                    {
                      label:
                        modules?.find((m) => m.id === activeMod)?.title ||
                        t("ialab.breadcrumb_module", { id: activeMod }),
                      onClick: resetViewSection,
                    },
                    ...(viewSection
                      ? [
                          {
                            label:
                              TABS.find((t) => t.id === viewSection)?.label ||
                              viewSection,
                          },
                        ]
                      : []),
                    ...(viewSection === null && currentLessonTitle
                      ? [{ label: currentLessonTitle }]
                      : []),
                  ]}
                  size="text-[10px] md:text-xs"
                />

                {/* 1. TÍTULO PRINCIPAL */}
                <AnimatedSection
                  show={viewSection === null}
                  loading={isLoadingProgress || isModuleTransitioning}
                  skeleton={
                    <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      </div>
                    </div>
                  }
                >
                  <SectionErrorBoundary
                    name="IALabModuleHeader"
                    title={t("ialab.header_unavailable")}
                  >
                    <IALabModuleHeader onAction={handleAction} />
                  </SectionErrorBoundary>
                </AnimatedSection>

                {/* 2. SECCIÓN INFORMATIVA DEL MÓDULO */}
                <AnimatedSection
                  show={viewSection === null || viewSection === "objetivos"}
                  loading={isLoadingProgress || isModuleTransitioning}
                  skeleton={<ModuleInfoSkeleton />}
                >
                  <div
                    id="panel-objetivos"
                    role="tabpanel"
                    aria-labelledby="tab-objetivos"
                    data-tour="tour-objetivos"
                  >
                    <SectionErrorBoundary
                      name="ModuleInfoSection"
                      title={t("ialab.info_unavailable")}
                    >
                      <ModuleInfoSection />
                    </SectionErrorBoundary>
                  </div>
                </AnimatedSection>

                {/* 3. TEMAS DEL MÓDULO - ACORDEÓN */}
                <AnimatedSection
                  show={viewSection === null || viewSection === "contenido"}
                  loading={isLoadingProgress || isModuleTransitioning}
                  skeleton={<ModuleOverviewSkeleton />}
                >
                  <div
                    id="panel-contenido"
                    role="tabpanel"
                    aria-labelledby="tab-contenido"
                    data-tour="tour-temas"
                  >
                    <Suspense fallback={<ModuleOverviewSkeleton />}>
                      <SectionErrorBoundary name="ModuleOverviewCard">
                        <ModuleOverviewCard
                          onAction={handleAction}
                          onToggleForum={setIsForumOpen}
                        />
                      </SectionErrorBoundary>
                    </Suspense>
                  </div>
                </AnimatedSection>

                {/* 4. ACTIVIDADES DEL MÓDULO */}
                <AnimatedSection
                  show={viewSection === null || viewSection === "actividades"}
                  loading={isLoadingProgress || isModuleTransitioning}
                  skeleton={<ModuleActionsSkeleton />}
                >
                  <div
                    id="panel-actividades"
                    role="tabpanel"
                    aria-labelledby="tab-actividades"
                    data-tour="tour-actividades"
                  >
                    <Suspense fallback={<ModuleActionsSkeleton />}>
                      <SectionErrorBoundary name="ModuleActions">
                        <ModuleActions
                          onAction={handleAction}
                          activeMod={activeMod}
                          challengeScores={challengeScores}
                          completedExams={completedExams}
                          moduleProgress={moduleProgress}
                          isForumOpen={isForumOpen}
                          onToggleForum={() => setIsForumOpen((prev) => !prev)}
                        />
                      </SectionErrorBoundary>
                    </Suspense>
                  </div>
                </AnimatedSection>
              </div>

              {/* 5. PRÁCTICA DEL MÓDULO */}
              <AnimatedSection
                show={viewSection === null || viewSection === "practica"}
                loading={isLoadingProgress || isModuleTransitioning}
                skeleton={<ModuleActionsSkeleton />}
              >
                <div
                  id="panel-practica"
                  role="tabpanel"
                  aria-labelledby="tab-practica"
                  data-tour="tour-herramientas"
                >
                  <Suspense fallback={null}>
                    <SectionErrorBoundary name="ModulePractice">
                      <ModulePractice
                        onAction={handleAction}
                        activeMod={activeMod}
                      />
                    </SectionErrorBoundary>
                  </Suspense>
                </div>
              </AnimatedSection>

              {/* 7. MIS GUARDADOS */}
              <AnimatedSection
                show={viewSection === "guardados"}
                loading={false}
                skeleton={<ModuleActionsSkeleton />}
              >
                <div id="panel-guardados" role="tabpanel" aria-labelledby="tab-guardados">
                  <Suspense fallback={<ModuleActionsSkeleton />}>
                    <SectionErrorBoundary name="BookmarksTab">
                      <BookmarksTab />
                    </SectionErrorBoundary>
                  </Suspense>
                </div>
              </AnimatedSection>

              {/* 6. FORO DEL MÓDULO */}
              {(viewSection === null || viewSection === "actividades") &&
                isForumOpen && (
                  <div id="forum-section">
                    <SectionErrorBoundary name="Forum">
                      <Suspense
                        fallback={
                          <div className="h-20 bg-white/50 rounded-xl animate-pulse" />
                        }
                      >
                        <IALabForumOptimized compact={false} initialLimit={3} />
                      </Suspense>
                    </SectionErrorBoundary>
                  </div>
                )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <IALabModals
        handleGlobalAction={handleAction}
        activeMod={activeMod}
        completedExams={completedExams}
      />

      <ValerioFloatingButton
        onClick={() => handleAction("OPEN_VALERIO")}
        t={t}
      />

      <Suspense
        fallback={<div className="h-20 bg-white/50 rounded-xl animate-pulse" />}
      >
        {showValerioPanel && (
          <IALabValerioPanel
            isOpen={showValerioPanel}
            onClose={() => { setShowValerioPanel(false); setValerioInitialMessage(''); }}
            initialMessage={valerioInitialMessage}
          />
        )}
      </Suspense>

      {/* Banner de conectividad */}
      <OfflineBanner />

      {/* Tour interactivo contextual */}
      <Suspense
        fallback={<div className="h-20 bg-white/50 rounded-xl animate-pulse" />}
      >
        <IALabTour hasStartedCourse={hasStartedCourse} />
      </Suspense>

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

      <XPToast />

      <Suspense fallback={null}>
        <AchievementToast
          toasts={achievementToasts}
          removeToast={removeAchievementToast}
        />
      </Suspense>
    </div>
  );
});

/**
 * Componente principal wrapper que provee el contexto
 */
const IALab = () => {
  return (
    <IALabProvider>
      <A11yProvider>
        <SectionErrorBoundary name="IALabContent">
          <IALabContent />
        </SectionErrorBoundary>
      </A11yProvider>
    </IALabProvider>
  );
};

export default IALab;
