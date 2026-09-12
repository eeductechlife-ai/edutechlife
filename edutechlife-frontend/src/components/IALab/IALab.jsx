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
import { useToolChrome } from "../../hooks/IALab/useToolChrome";
import { useCelebrationEffects } from "../../hooks/IALab/useCelebrationEffects";
import "./IALab.css";
import "./themes/themes.css";
import ThemeProvider from "./themes/ThemeProvider";
import { mapModuleToTheme } from "./themes/themeMap";
import ToolWorkspace from "./workspace/ToolWorkspace";
import DefaultModuleWelcome from "./workspace/DefaultModuleWelcome";
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
import { Icon } from "../../utils/iconMapping.jsx";

const preloadForum = () => import("./IALabForumOptimized");
const IALabForumOptimized = lazy(preloadForum);
const ModuleOverviewCard = lazy(() => import("./ModuleOverviewCard"));
const TopicChatThread = lazy(() => import("./workspace/TopicChatThread"));
const DailyPlan = lazy(() => import("./DailyPlan"));
const ModuleActions = lazy(() => import("./ModuleActions"));
const ModulePractice = lazy(() => import("./ModulePractice"));
const IALabTour = lazy(() => import("./IALabTour"));
const AchievementToast = lazy(() => import("./AchievementToast"));
const GlobalSearchBar = lazy(() => import("./GlobalSearchBar"));

import OfflineBanner from "./OfflineBanner";
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
import MobileBottomNav from "./shared/MobileBottomNav";
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
  const { user } = useIALabUIContext() ?? {};
  const { toasts: achievementToasts, removeToast: removeAchievementToast } =
    useAchievementNotifications(useIALabStore);
  const {
    completedModules = [],
    courseProgress = 0,
    activeMod = 1,
    setActiveMod = () => {},
    completedExams = {},
    challengeScores = {},
    moduleProgress = {},
    modules = [],
    updateModuleActivity = () => {},
  } = useIALabProgressContext() ?? {};
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showValerioPanel, setShowValerioPanel] = useState(false);
  const showValerioDrawer = useIALabStore((s) => s.showValerioDrawer);
  const setShowValerioDrawer = useIALabStore((s) => s.setShowValerioDrawer);
  const valerioInitialMessage = useIALabStore((s) => s.valerioInitialMessage);
  const setValerioInitialMessage = useIALabStore(
    (s) => s.setValerioInitialMessage,
  );
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

  // selectedTopicIndex vive en la URL (?topic=N) para que el botón atrás y
  // los enlaces directos (/ialab/3?tab=contenido&topic=2) funcionen.
  const selectedTopicIndex = useMemo(() => {
    const n = parseInt(searchParams.get("topic") ?? "", 10);
    return isNaN(n) || n < 0 ? 0 : n;
  }, [searchParams]);

  // setViewSection: fusiona params para no borrar ?topic al cambiar de tab.
  const setViewSection = useCallback(
    (tabId) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (tabId) { next.set("tab", tabId); } else { next.delete("tab"); }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // openTopic: selecciona tema Y abre la sección de contenido en UNA sola
  // actualización de URL. Llamar a setSelectedTopicIndex + setViewSection por
  // separado pierde `topic`, porque cada setSearchParams parte del mismo
  // location.search y la segunda sobrescribe a la primera.
  const openTopic = useCallback(
    (i) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("topic", String(i));
          next.set("tab", "contenido");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );
  const [examRefreshKey, setExamRefreshKey] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModuleTransitioning, setIsModuleTransitioning] = useState(false);
  const prevActiveModRef = useRef(activeMod);
  const autoTabRef = useRef(null);

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

  // Store → URL: cuando el módulo cambia por swipe / "siguiente módulo" /
  // plan de estudio (que mutan el store sin tocar la ruta), reflejar la ruta
  // para que la posición sobreviva a un refresh.
  // IMPORTANTE: leer del store Zustand directamente (no del contexto) para
  // evitar el flicker: el useLayoutEffect ya actualizó el store antes de que
  // este effect corra, pero el contexto React todavía tiene el valor anterior.
  useEffect(() => {
    const numeric = urlMod ? parseInt(urlMod, 10) : NaN;
    const storeActiveMod = useIALabStore.getState().activeMod;
    if (
      storeActiveMod >= 1 &&
      storeActiveMod <= 5 &&
      (isNaN(numeric) || numeric !== storeActiveMod)
    ) {
      navigate(`/ialab/${storeActiveMod}`, { replace: true });
    }
  }, [activeMod, urlMod, navigate]);

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

  // Escuchar eventos de examen completado para forzar refresco UI y guardar progreso
  useEffect(() => {
    const handler = (e) => {
      setExamRefreshKey((k) => k + 1);
      const { score, moduleId } = e.detail ?? {};
      if (typeof score === "number" && moduleId) {
        updateModuleActivity(moduleId, "exam", score >= 80, score);
      }
    };
    window.addEventListener("ialab:examCompleted", handler);
    return () => window.removeEventListener("ialab:examCompleted", handler);
  }, [updateModuleActivity]);

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
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  useEffect(() => {
    if (!isLoadingProgress) {
      setLoadingTimedOut(false);
      return;
    }
    const tid = setTimeout(() => setLoadingTimedOut(true), 8000);
    return () => clearTimeout(tid);
  }, [isLoadingProgress]);
  const hasStartedCourse = useIALabStore((s) => s.hasStartedCourse());
  const lastVisitedLesson = useIALabStore((s) => s.lastVisitedLesson);
  const currentLessonTitle =
    lastVisitedLesson && lastVisitedLesson.moduleId === activeMod
      ? getAllLessons(locale)?.[activeMod]?.find(
          (l) => l.id === lastVisitedLesson.lessonId,
        )?.title
      : null;

  const tabStatuses = useMemo(() => {
    const mod = moduleProgress[activeMod];
    return {
      contenido: mod?.resourcesCompleted ? "done" : null,
      actividades: mod?.exam
        ? "done"
        : mod?.resourcesCompleted
          ? "ready"
          : null,
    };
  }, [moduleProgress, activeMod]);


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
      useIALabStore.getState().setPracticeTool("tutoring");
      return;
    }
    if (action === "CONTENT_COMPLETED") {
      setToast({
        message:
          t("ialab.content_completed_toast") ||
          "¡Contenido completado! Ahora haz el examen para avanzar.",
        cta: t("ialab.tab_activities") || "Actividades",
        onCta: () => {
          setViewSection("actividades");
          setToast(null);
        },
      });
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
  // "Inicio": quita la sección activa para mostrar la bienvenida del módulo
  // (intro + accesos) y sube al tope para que se vea desde el principio.
  const resetViewSection = useCallback(() => {
    setViewSection(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [setViewSection]);
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

  const toolChrome = useToolChrome(mapModuleToTheme(activeMod));
  const chromeActive = toolChrome.enabled;

  // Tab inteligente: redirige a actividades solo cuando el contenido ya está
  // completo y el examen sigue pendiente (el estudiante sabe el camino y el
  // siguiente paso lógico es el examen).  Los módulos chrome (M2/M3/M4) abren
  // siempre en el intro para que el estudiante vea la pantalla de bienvenida.
  useEffect(() => {
    if (isLoadingProgress || viewSection !== null) return;
    if (autoTabRef.current === activeMod) return;
    autoTabRef.current = activeMod;
    const mod = moduleProgress[activeMod];
    if (mod?.resourcesCompleted && !mod?.exam) {
      setViewSection("actividades");
    }
  }, [activeMod, isLoadingProgress, moduleProgress, viewSection, setViewSection]);

  /* 2–6. Secciones del módulo: paneles informativo, temas, actividades,
     práctica, guardados y foro. Se envuelven en ToolWorkspace cuando el
     chrome inmersivo está activo; si no, se montan sin wrapper. */
  const moduleSections = (
    <>
      {/* Banner de timeout global — visible cuando progress no carga tras 8 s */}
      {isLoadingProgress && loadingTimedOut && (
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl">
          <svg
            className="w-4 h-4 text-amber-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <span className="text-sm text-amber-800 dark:text-amber-200 flex-1">
            {t("ialab.loading_timeout_desc") ||
              "Verifica tu conexión e inténtalo de nuevo"}
          </span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 hover:opacity-80 transition-opacity"
          >
            {t("ialab.loading_timeout_retry") || "Reintentar"}
          </button>
        </div>
      )}

      {/* 2. SECCIÓN INFORMATIVA DEL MÓDULO */}
      <AnimatedSection
        show={viewSection === "objetivos"}
        loading={
          (isLoadingProgress && !loadingTimedOut) || isModuleTransitioning
        }
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

      {/* 3. TEMA SELECCIONADO — hilo estilo ChatGPT */}
      <AnimatedSection
        show={viewSection === "contenido"}
        loading={
          (isLoadingProgress && !loadingTimedOut) || isModuleTransitioning
        }
        skeleton={<ModuleOverviewSkeleton />}
      >
        <div
          id="panel-contenido"
          role="tabpanel"
          aria-labelledby="tab-contenido"
          data-tour="tour-temas"
        >
          <Suspense fallback={<ModuleOverviewSkeleton />}>
            <SectionErrorBoundary name="TopicChatThread">
              {chromeActive ? (
                <TopicChatThread
                  topicIndex={selectedTopicIndex}
                  activeMod={activeMod}
                  onAdvanceTopic={openTopic}
                  onGoToActivities={() => setViewSection("actividades")}
                />
              ) : (
                <ModuleOverviewCard
                  onAction={handleAction}
                  onToggleForum={setIsForumOpen}
                />
              )}
            </SectionErrorBoundary>
          </Suspense>
        </div>
      </AnimatedSection>

      {/* 4. ACTIVIDADES DEL MÓDULO */}
      <AnimatedSection
        show={viewSection === "actividades"}
        loading={
          (isLoadingProgress && !loadingTimedOut) || isModuleTransitioning
        }
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

      {/* 5. PRÁCTICA DEL MÓDULO */}
      <AnimatedSection
        show={viewSection === "practica"}
        loading={
          (isLoadingProgress && !loadingTimedOut) || isModuleTransitioning
        }
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
              <ModulePractice onAction={handleAction} activeMod={activeMod} />
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
        <div
          id="panel-guardados"
          role="tabpanel"
          aria-labelledby="tab-guardados"
        >
          <Suspense fallback={<ModuleActionsSkeleton />}>
            <SectionErrorBoundary name="BookmarksTab">
              <BookmarksTab />
            </SectionErrorBoundary>
          </Suspense>
        </div>
      </AnimatedSection>

      {/* 6. FORO DEL MÓDULO */}
      {viewSection === "actividades" && isForumOpen && (
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
    </>
  );

  return (
    <ThemeProvider moduleId={activeMod}>
      <div
        data-testid="ialab-container"
        data-theme={mapModuleToTheme(activeMod)}
        data-chrome={chromeActive ? "on" : "off"}
        className={`flex flex-col h-screen h-dvh touch-manipulation${isDarkMode ? " dark" : ""}`}
        style={{
          background: "var(--theme-bg)",
          fontFamily: "var(--theme-font)",
        }}
        onTouchStart={swipeStart}
        onTouchMove={swipeMove}
        onTouchEnd={swipeEnd}
      >
        <MobileHeader
          setIsSearchOpen={setIsSearchOpen}
          isSearchOpen={isSearchOpen}
        />

        {isSearchOpen && (
          <Suspense fallback={null}>
            <GlobalSearchBar mobile onClose={() => setIsSearchOpen(false)} />
          </Suspense>
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
            className="flex-1 outline-none overflow-y-auto px-4 pt-16 landscape:pt-12 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-2 safe-area-bottom md:px-5 md:pt-0 lg:px-8 lg:pt-0 lg:pb-8 xl:px-12 2xl:px-16"
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
                  className={`w-6 h-6 rounded-full border-2 border-[var(--theme-emphasis)] ${isRefreshing ? "animate-spin border-t-transparent" : ""}`}
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
                  x: {
                    type: "spring",
                    stiffness: SPRING_STIFFNESS,
                    damping: 30,
                  },
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

                {/* CTA: Sin progreso — invita a empezar (se suprime cuando DefaultModuleWelcome ya lo hace) */}
                {!isLoadingProgress &&
                  !currentLessonTitle &&
                  viewSection === null &&
                  !moduleProgress[activeMod]?.resourcesCompleted &&
                  chromeActive && (
                    <motion.div
                      key={`start-cta-${activeMod}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={activeMod === 4 ? "flex items-center gap-3 px-4 py-3 rounded-xl border bg-white" : "flex items-center gap-3 px-4 py-3 theme-surface theme-border border rounded-xl"}
                      style={activeMod === 4 ? { borderColor: "#c5d0f0" } : undefined}
                    >
                      <div className={activeMod === 4 ? "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" : "w-9 h-9 rounded-xl theme-chip flex items-center justify-center flex-shrink-0"}
                        style={activeMod === 4 ? { background: "#e8f0fe" } : undefined}
                      >
                        <Icon name="fa-play"
                          className={activeMod === 4 ? "w-3.5 h-3.5 ml-0.5" : "w-3.5 h-3.5 text-[var(--theme-emphasis)] ml-0.5"}
                          style={activeMod === 4 ? { color: "#1a73e8" } : undefined}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={activeMod === 4 ? "text-[11px] font-semibold uppercase tracking-wide" : "text-[11px] font-semibold text-[var(--theme-emphasis)] uppercase tracking-wide"}
                          style={activeMod === 4 ? { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", color: "#1a73e8" } : undefined}>
                          {t("ialab.start_cta_label") || "¡Empieza aquí!"}
                        </p>
                        <p className={activeMod === 4 ? "truncate" : "text-[15px] font-medium theme-text truncate"}
                          style={activeMod === 4 ? { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", fontSize: 15, fontWeight: 500, color: "#202124" } : undefined}>
                          {t("ialab.start_cta_desc") || "Comienza con el primer video de este módulo"}
                        </p>
                      </div>
                      <button
                        onClick={() => setViewSection("contenido")}
                        className={activeMod === 4 ? "flex-shrink-0 px-3 py-1.5 text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity" : "flex-shrink-0 px-3 py-1.5 theme-bg-emphasis text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity"}
                        style={activeMod === 4 ? { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", background: "#1a73e8", color: "#fff" } : undefined}
                      >
                        {t("ialab.start_cta_btn") || "Ver contenido →"}
                      </button>
                    </motion.div>
                  )}

                {/* Banner: Continuar donde lo dejaste */}
                {!isLoadingProgress &&
                  currentLessonTitle &&
                  viewSection === null && (
                    <motion.div
                      key={`continue-banner-${activeMod}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={activeMod === 4 ? "flex items-center gap-3 px-4 py-3 rounded-xl border bg-white" : "flex items-center gap-3 px-4 py-3 theme-surface theme-border border rounded-xl"}
                      style={activeMod === 4 ? { borderColor: "#c5d0f0" } : undefined}
                    >
                      <div className={activeMod === 4 ? "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" : "w-9 h-9 rounded-xl theme-chip flex items-center justify-center flex-shrink-0"}
                        style={activeMod === 4 ? { background: "#e8f0fe" } : undefined}>
                        <span className={activeMod === 4 ? "text-sm ml-0.5" : "text-[var(--theme-emphasis)] text-sm"} style={activeMod === 4 ? { color: "#1a73e8" } : undefined}>▶</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={activeMod === 4 ? "text-[11px] font-semibold uppercase tracking-wide" : "text-[11px] font-semibold text-[var(--theme-emphasis)] uppercase tracking-wide"}
                          style={activeMod === 4 ? { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", color: "#1a73e8" } : undefined}>
                          {t("ialab.continue_banner_lesson")}
                        </p>
                        <p className={activeMod === 4 ? "truncate" : "text-[15px] font-medium theme-text truncate"}
                          style={activeMod === 4 ? { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", fontSize: 15, fontWeight: 500, color: "#202124" } : undefined}>
                          {currentLessonTitle}
                        </p>
                      </div>
                      <button
                        onClick={() => setViewSection("contenido")}
                        className={activeMod === 4 ? "flex-shrink-0 px-3 py-1.5 text-[13px] font-medium rounded-lg hover:opacity-90 transition-colors" : "flex-shrink-0 px-3 py-1.5 theme-bg-emphasis text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-colors"}
                        style={activeMod === 4 ? { fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif", background: "#1a73e8", color: "#fff" } : undefined}
                      >
                        {t("ialab.continue_banner_cta")}
                      </button>
                    </motion.div>
                  )}

                {/* Banner: Contenido completo → ir al examen */}
                {!isLoadingProgress &&
                  moduleProgress[activeMod]?.resourcesCompleted &&
                  !moduleProgress[activeMod]?.exam &&
                  viewSection === null && (
                    <motion.div
                      key={`exam-ready-banner-${activeMod}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 px-4 py-3 theme-surface border border-amber-200/60 dark:border-amber-700/30 rounded-xl"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-star" className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                          {t("ialab.exam_ready_title") ||
                            "¡Contenido completado!"}
                        </p>
                        <p className="text-[15px] font-medium theme-text truncate">
                          {t("ialab.exam_ready_desc") ||
                            "Ya puedes tomar tu examen del módulo"}
                        </p>
                      </div>
                      <button
                        onClick={() => setViewSection("actividades")}
                        className="flex-shrink-0 px-3 py-1.5 bg-amber-500 text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-colors"
                      >
                        {t("ialab.exam_ready_cta") || "Ir al examen →"}
                      </button>
                    </motion.div>
                  )}

                {isLoadingProgress ? (
                  <motion.div
                    key={`skeleton-ruta-${activeMod}`}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {loadingTimedOut ? (
                      <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.75"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {t("ialab.loading_timeout_title") ||
                              "No se pudo cargar el módulo"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {t("ialab.loading_timeout_desc") ||
                              "Verifica tu conexión e inténtalo de nuevo"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--theme-primary)] text-white hover:opacity-90 transition-opacity"
                        >
                          {t("ialab.loading_timeout_retry") || "Reintentar"}
                        </button>
                      </div>
                    ) : (
                      <RouteSkeleton />
                    )}
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
                            activeMod={activeMod}
                          />
                        </div>
                      </SectionErrorBoundary>
                    </Suspense>
                  </motion.div>
                )}

                {/* 1. TÍTULO PRINCIPAL (siempre full-width) */}
                <div className="flex flex-col gap-5">
                  {viewSection !== null && !chromeActive && (
                    <Breadcrumbs
                      segments={[
                        {
                          label: t("ialab.breadcrumb_home"),
                          icon: "fa-house",
                          onClick: () => navigate("/ialab"),
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
                                  TABS.find((t) => t.id === viewSection)
                                    ?.label || viewSection,
                              },
                            ]
                          : []),
                        ...(viewSection !== null && currentLessonTitle
                          ? [{ label: currentLessonTitle }]
                          : []),
                      ]}
                      size="text-[10px] md:text-xs"
                    />
                  )}

                  <AnimatedSection
                    show={viewSection === null}
                    loading={
                      (isLoadingProgress && !loadingTimedOut) ||
                      isModuleTransitioning
                    }
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
                </div>

                {/* 2–6. Secciones — layout según modo */}
                {chromeActive ? (
                  <ToolWorkspace
                    theme={mapModuleToTheme(activeMod)}
                    activeMod={activeMod}
                    viewSection={viewSection}
                    selectedTopicIndex={selectedTopicIndex}
                    onNewChat={resetViewSection}
                    onSelectTopic={(i) => {
                      openTopic(i);
                    }}
                    onSelectSection={setViewSection}
                  >
                    {moduleSections}
                  </ToolWorkspace>
                ) : (
                  /* M1/M5: sidebar vertical (desktop) + contenido */
                  <div className="flex flex-col gap-4 w-full">
                    {/* Tabs móvil: encima del contenido, solo en pantallas pequeñas */}
                    <div
                      data-tour="tour-tabs"
                      data-testid="ialab-tabs"
                      role="tablist"
                      className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin-ialab md:hidden"
                    >
                      <TabPills
                        TABS={TABS}
                        viewSection={viewSection}
                        setViewSection={setViewSection}
                        badges={{ guardados: bookmarkBadge }}
                        statuses={tabStatuses}
                      />
                    </div>

                    {/* Desktop: 2 columnas */}
                    <div className="flex w-full gap-5">
                      {/* Sidebar izquierdo: tabs verticales */}
                      <aside
                        aria-label={t("ialab.workspace.rail_label") || "Navegación del módulo"}
                        className="md:sticky md:top-8 hidden max-h-[calc(100dvh-11rem)] w-52 flex-shrink-0 self-start md:flex md:flex-col md:gap-1.5"
                        data-testid="ialab-tabs-desktop"
                        role="tablist"
                      >
                        <TabPills
                          TABS={TABS}
                          viewSection={viewSection}
                          setViewSection={setViewSection}
                          badges={{ guardados: bookmarkBadge }}
                          statuses={tabStatuses}
                        />
                      </aside>

                      {/* Contenido principal */}
                      <div className="flex min-w-0 flex-1 flex-col gap-5">
                        {viewSection === null &&
                          (activeMod === 1 || activeMod === 5) && (
                            <DefaultModuleWelcome
                              activeMod={activeMod}
                              onSelectSection={setViewSection}
                            />
                          )}
                        {moduleSections}
                      </div>
                    </div>
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
          hasStartedCourse={hasStartedCourse}
        />

        <Suspense
          fallback={
            <div className="h-20 bg-white/50 rounded-xl animate-pulse" />
          }
        >
          {showValerioPanel && (
            <IALabValerioPanel
              isOpen={showValerioPanel}
              onClose={() => {
                setShowValerioPanel(false);
                setValerioInitialMessage("");
              }}
              initialMessage={valerioInitialMessage}
            />
          )}
        </Suspense>

        {/* Banner de conectividad */}
        <OfflineBanner />

        {/* Bottom navigation bar — solo móvil */}
        <MobileBottomNav
          viewSection={viewSection}
          onSelectSection={setViewSection}
          onOpenMenu={() => setShowMobileMenu(true)}
          badgeCount={bookmarkBadge}
        />

        {/* Tour interactivo contextual */}
        <Suspense
          fallback={
            <div className="h-20 bg-white/50 rounded-xl animate-pulse" />
          }
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
    </ThemeProvider>
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
