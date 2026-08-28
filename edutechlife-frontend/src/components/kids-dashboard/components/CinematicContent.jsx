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
import RutaAprendizaje from "../RutaAprendizaje";
import { isFeatureEnabled } from "../../../hooks/useFeatureFlag";

const PointsRewardsSystem = lazy(() => import("../PointsRewardsSystem"));
const SmartBoardProgress = lazy(() => import("../smartBoardProgress"));
const PersonalizedPlan = lazy(() => import("../PersonalizedPlan"));
const ExamPrep = lazy(() => import("../examPrep"));
const FlashcardSystem = lazy(() => import("../flashcardSystem"));
const OralExamSimulator = lazy(() => import("../OralExamSimulator"));
const GradeScanner = lazy(() => import("../GradeScanner"));
const WeeklyScheduleView = lazy(() => import("../schedule"));
const ImprovementPlan = lazy(
  () => import("../improvementPlan/ImprovementPlan"),
);
const TechNewsFeed = lazy(() => import("../news/TechNewsFeed"));
const ChallengeEngine = lazy(() => import("../challengeEngine"));
const FutureExplorer = lazy(() => import("../FutureExplorer"));
const SmartProfile = lazy(() => import("../profile/SmartProfile"));

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
    onDaniOpen,
    studentAge,
  } = deps;

  return {
    inicio: {
      // UX hierarchy (brief §40): greeting + progress + NextBestAction (Hero) lead,
      // then the learning path, today's mission, exploration, and metrics last.
      component: () => (
        <>
          <HeroSection onTabChange={onTabChange} onDaniOpen={deps.onDaniOpen} />
          <RutaAprendizaje onTabChange={onTabChange} />
          <MisionDelDia onTabChange={onTabChange} />
          {studentAge >= 10 && isFeatureEnabled("future_explorer") && (
            <InViewSection delay={0.1}>
              <LazyLoad fallback={<SectionFallback tab="explorar" />}>
                <FutureExplorer />
              </LazyLoad>
            </InViewSection>
          )}
          <InViewSection>
            <LazyLoad fallback={<SectionFallback tab="inicio" />}>
              <PointsRewardsSystem />
            </LazyLoad>
          </InViewSection>
        </>
      ),
      className: "space-y-6 md:space-y-8",
      errorKey: "inicio",
      errorMsg: t("smartboard.error_load_home"),
    },
    perfil: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="perfil" />}>
          <SmartProfile onTabChange={onTabChange} />
        </LazyLoad>
      ),
      errorKey: "perfil",
      errorMsg: "Error al cargar el perfil",
      className: "space-y-4",
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
    horario: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="horario" />}>
          <WeeklyScheduleView />
        </LazyLoad>
      ),
      errorKey: "horario",
      errorMsg: "Error al cargar el horario",
      className: "space-y-4",
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
    // curriculo: TODO — placeholder implementation pending (was just showing SectionFallback)
    calificaciones: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="calificaciones" />}>
          <GradeScanner onTabChange={onTabChange} />
        </LazyLoad>
      ),
      errorKey: "calificaciones",
      errorMsg: "Error al cargar calificaciones",
      className: "space-y-4",
    },
    oral: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="oral" />}>
          <OralExamSimulator onTabChange={onTabChange} />
        </LazyLoad>
      ),
      errorKey: "oral",
      errorMsg: "Error al cargar Habla con Dani",
      className: "h-full",
    },
    examenes: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="examenes" />}>
          <ExamPrep onTabChange={onTabChange} />
        </LazyLoad>
      ),
      errorKey: "examenes",
      errorMsg: "Error al cargar exámenes",
    },
    flashcards: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="flashcards" />}>
          <FlashcardSystem onTabChange={onTabChange} />
        </LazyLoad>
      ),
      errorKey: "flashcards",
      errorMsg: "Error al cargar flashcards",
    },
    progreso: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="progreso" />}>
          <SmartBoardProgress onTabChange={onTabChange} />
        </LazyLoad>
      ),
      errorKey: "progreso",
      errorMsg: "Error al cargar progreso",
      className: "h-full",
    },
    plan: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="plan" />}>
          <ImprovementPlan />
        </LazyLoad>
      ),
      errorKey: "plan",
      errorMsg: "Error al cargar el plan de mejora",
      className: "space-y-4",
    },
    retos: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="retos" />}>
          <ChallengeEngine onTabChange={onTabChange} />
        </LazyLoad>
      ),
      errorKey: "retos",
      errorMsg: "Error al cargar retos",
      className: "space-y-4",
    },
    noticias: {
      component: () => (
        <LazyLoad fallback={<SectionFallback tab="noticias" />}>
          <TechNewsFeed />
        </LazyLoad>
      ),
      errorKey: "noticias",
      errorMsg: "Error al cargar noticias",
      className: "space-y-4",
    },
  };
}

const CinematicContent = memo(
  ({ activeTab, onTabChange, darkMode, subscriptionTier, onDaniOpen }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isPremium = subscriptionTier === "premium";
    const {
      vakResult,
      setVakResultAndRecommendations,
      missions,
      subjects,
      subjectsWithGrades,
      completeMission,
      studentAge,
    } = useSmartBoardKids();

    const handleVakComplete = useCallback(
      (result) => {
        setVakResultAndRecommendations(result);
      },
      [setVakResultAndRecommendations],
    );

    const tabRenderer = useMemo(
      () =>
        createTabRenderer({
          isPremium,
          handleVakComplete,
          missions,
          completeMission,
          subjects: subjectsWithGrades || subjects,
          vakResult,
          t,
          navigate,
          onTabChange,
          onDaniOpen,
          studentAge,
        }),
      [
        isPremium,
        handleVakComplete,
        missions,
        completeMission,
        subjectsWithGrades,
        subjects,
        vakResult,
        t,
        navigate,
        onTabChange,
        onDaniOpen,
        studentAge,
      ],
    );

    const tab = tabRenderer[activeTab];
    if (!tab) return null;

    return (
      <div className="flex-1 overflow-y-auto relative p-4 md:p-6 pb-24 md:pb-8">
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
