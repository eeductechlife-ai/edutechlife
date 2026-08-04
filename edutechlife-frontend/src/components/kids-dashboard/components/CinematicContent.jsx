import { memo, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useNavigate } from "react-router-dom";
import DashboardErrorBoundary from "../DashboardErrorBoundary";
import HeroSection from "../HeroSection";
import { VAKDiagnosticEnhanced } from "../VAKDiagnosticEnhanced";
import PremiumGate from "../PremiumGate";
import MissionsView from "./MissionsView";
import SubjectsView from "./SubjectsView";
import MisionDelDia from "./MisionDelDia";
import { SectionFallback } from "./SkeletonLoader";
import { PREMIUM_FEATURES } from "../kidsDashboardConfig";

const KidsCalendar = lazy(() => import("../KidsCalendar"));
const PointsRewardsSystem = lazy(() => import("../PointsRewardsSystem"));
const NewsTechFeed = lazy(() => import("../NewsTechFeed"));
const ActivityUploader = lazy(() => import("../activityUploader"));
const SmartBoardProgress = lazy(() => import("../smartBoardProgress"));
const PersonalizedPlan = lazy(() => import("../PersonalizedPlan"));
const ExamPrep = lazy(() => import("../examPrep"));
const FlashcardSystem = lazy(() => import("../flashcardSystem"));
const SmartBookReader = lazy(() => import("../smartBookReader"));
const ProblemScanner = lazy(() => import("../ProblemScanner"));
const CurriculumView = lazy(() => import("../CurriculumView"));
const StudyPodcast = lazy(() => import("../StudyPodcast"));
const OralExamSimulator = lazy(() => import("../OralExamSimulator"));
const SmartBoardAnalytics = lazy(() => import("../SmartBoardAnalytics"));

const sharedTransition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };

const AnimationWrapper = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={sharedTransition}
    className={className}
  >
    {children}
  </motion.div>
);

const LazyLoad = ({ fallback, children }) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);

const InViewSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

function createTabRenderer(deps) {
  const {
    isPremium,
    handleVakComplete,
    missions,
    completeMission,
    subjects,
    vakResult,
    t,
    navigate,
    onTabChange,
  } = deps;

  return {
    inicio: {
      component: () => (
        <>
          <MisionDelDia onTabChange={onTabChange} />
          <HeroSection />
          <InViewSection>
            <LazyLoad fallback={<SectionFallback tab="inicio" />}>
              <PointsRewardsSystem />
            </LazyLoad>
          </InViewSection>
          <InViewSection delay={0.2}>
            <LazyLoad fallback={<SectionFallback tab="noticias" />}>
              <PremiumGate
                icon="📰"
                title={PREMIUM_FEATURES.noticias.title}
                description={PREMIUM_FEATURES.noticias.description}
                isPremium={isPremium}
              >
                <NewsTechFeed />
              </PremiumGate>
            </LazyLoad>
          </InViewSection>
        </>
      ),
      errorKey: "inicio",
      errorMsg: t("smartboard.error_load_home"),
    },
    misiones: {
      component: () => (
        <MissionsView missions={missions} onCompleteMission={completeMission} />
      ),
      errorKey: "misiones",
      errorMsg: t("smartboard.error_load_missions"),
    },
    materias: {
      component: () => <SubjectsView subjects={subjects} />,
      errorKey: "materias",
      errorMsg: t("smartboard.error_load_subjects"),
    },
    actividades: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="actividades" />}>
          <ActivityUploader />
        </LazyLoad>
      ),
      errorKey: "actividades",
      errorMsg: t("smartboard.error_load_activities"),
    },
    calendario: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="calendario" />}>
          <KidsCalendar />
        </LazyLoad>
      ),
      errorKey: "calendario",
      errorMsg: t("smartboard.error_load_calendar"),
    },
    puntos: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="puntos" />}>
          <PointsRewardsSystem />
        </LazyLoad>
      ),
      errorKey: "puntos",
      errorMsg: t("smartboard.error_load_points"),
    },
    noticias: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="noticias" />}>
          <PremiumGate
            icon={PREMIUM_FEATURES.noticias.icon}
            title={PREMIUM_FEATURES.noticias.title}
            description={PREMIUM_FEATURES.noticias.description}
            isPremium={isPremium}
          >
            <NewsTechFeed />
          </PremiumGate>
        </LazyLoad>
      ),
      errorKey: "noticias",
      errorMsg: t("smartboard.error_load_news"),
    },
    vak: {
      component: () => (
        <>
          <VAKDiagnosticEnhanced onComplete={handleVakComplete} />
          {vakResult && (
            <LazyLoad fallback={<SectionFallback tab="vak" />}>
              <PersonalizedPlan />
            </LazyLoad>
          )}
        </>
      ),
      errorKey: "vak",
      errorMsg: t("smartboard.error_load_vak"),
      className: "space-y-6",
    },
    curriculo: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="curriculo" />}>
          <CurriculumView />
        </LazyLoad>
      ),
      errorKey: "curriculo",
      errorMsg: "Error al cargar currículo",
      className: "h-full",
    },
    oral: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="oral" />}>
          <OralExamSimulator />
        </LazyLoad>
      ),
      errorKey: "oral",
      errorMsg: "Error al cargar examen oral",
      className: "h-full",
    },
    examenes: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="examenes" />}>
          <ExamPrep />
        </LazyLoad>
      ),
      errorKey: "examenes",
      errorMsg: "Error al cargar exámenes",
    },
    flashcards: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="flashcards" />}>
          <FlashcardSystem />
        </LazyLoad>
      ),
      errorKey: "flashcards",
      errorMsg: "Error al cargar flashcards",
    },
    libros: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="libros" />}>
          <PremiumGate
            icon={PREMIUM_FEATURES.libros.icon}
            title={PREMIUM_FEATURES.libros.title}
            description={PREMIUM_FEATURES.libros.description}
            isPremium={isPremium}
          >
            <SmartBookReader />
          </PremiumGate>
        </LazyLoad>
      ),
      errorKey: "libros",
      errorMsg: "Error al cargar libros",
    },
    escaner: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="escaner" />}>
          <ProblemScanner />
        </LazyLoad>
      ),
      errorKey: "escaner",
      errorMsg: "Error al cargar escáner",
    },
    progreso: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="progreso" />}>
          <SmartBoardProgress />
        </LazyLoad>
      ),
      errorKey: "progreso",
      errorMsg: "Error al cargar progreso",
      className: "h-full",
    },
    podcast: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="podcast" />}>
          <StudyPodcast />
        </LazyLoad>
      ),
      errorKey: "podcast",
      errorMsg: "Error al cargar podcast",
      className: "h-full",
    },
    analitica: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="analitica" />}>
          <PremiumGate
            icon={PREMIUM_FEATURES.analitica.icon}
            title={PREMIUM_FEATURES.analitica.title}
            description={PREMIUM_FEATURES.analitica.description}
            isPremium={isPremium}
          >
            <SmartBoardAnalytics />
          </PremiumGate>
        </LazyLoad>
      ),
      errorKey: "analitica",
      errorMsg: "Error al cargar analytics",
      className: "h-full",
    },
  };
}

const CinematicContent = memo(
  ({ activeTab, onTabChange, darkMode, subscriptionTier }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isPremium = subscriptionTier === "premium";
    const {
      vakResult,
      setVakResultAndRecommendations,
      missions,
      subjects,
      completeMission,
    } = useSmartBoardKids();

    const handleVakComplete = useCallback(
      (result) => {
        setVakResultAndRecommendations(result);
      },
      [setVakResultAndRecommendations],
    );

    if (activeTab === "padres") {
      navigate("/smartboard/padres");
      return null;
    }

    const tabRenderer = useMemo(
      () =>
        createTabRenderer({
          isPremium,
          handleVakComplete,
          missions,
          completeMission,
          subjects,
          vakResult,
          t,
          navigate,
          onTabChange,
        }),
      [
        isPremium,
        handleVakComplete,
        missions,
        completeMission,
        subjects,
        vakResult,
        t,
        navigate,
        onTabChange,
      ],
    );

    const tab = tabRenderer[activeTab];
    if (!tab) return null;

    return (
      <div className="flex-1 overflow-y-auto relative p-4 md:p-6">
        <AnimatePresence mode="wait">
          <DashboardErrorBoundary
            key={activeTab}
            message={tab.errorMsg}
            onTabChange={onTabChange}
          >
            <AnimationWrapper className={tab.className}>
              {tab.component()}
            </AnimationWrapper>
          </DashboardErrorBoundary>
        </AnimatePresence>
      </div>
    );
  },
);

CinematicContent.displayName = "CinematicContent";

export default CinematicContent;
