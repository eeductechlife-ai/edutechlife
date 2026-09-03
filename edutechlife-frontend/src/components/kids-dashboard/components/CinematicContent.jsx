import { memo, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import { useNavigate } from "react-router-dom";
import DashboardErrorBoundary from "../DashboardErrorBoundary";
import HeroSection from "../HeroSection";
import { VAKDiagnosticEnhanced } from "../VAKDiagnosticEnhanced";
import PremiumGate from "../PremiumGate";
import SubjectsView from "./SubjectsView";
import { SectionFallback } from "./SkeletonLoader";
import { PREMIUM_FEATURES } from "../kidsDashboardConfig";
import NextBestAction from "../NextBestAction";
import PerfilTab from "./PerfilTab";
import MateriasTab from "./MateriasTab";
import ExplorarTab from "./ExplorarTab";
import { isFeatureEnabled } from "../../../hooks/useFeatureFlag";

const PointsRewardsSystem = lazy(() => import("../PointsRewardsSystem"));
const SmartBoardProgress = lazy(() => import("../smartBoardProgress"));
const PersonalizedPlan = lazy(() => import("../PersonalizedPlan"));
const ExamPrep = lazy(() => import("../examPrep"));
const FlashcardSystem = lazy(() => import("../flashcardSystem"));
const OralExamSimulator = lazy(() => import("../OralExamSimulator"));
const ChallengeEngine = lazy(() => import("../challengeEngine"));
const FutureExplorer = lazy(() => import("../FutureExplorer"));

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
    darkMode,
    ageGroup,
  } = deps;

  const materiasProps = {
    subjects,
    onTabChange,
    ageGroup,
    vakResult,
  };

  const explorarProps = {
    missions,
    onCompleteMission: completeMission,
    ageGroup,
  };

  return {
    inicio: {
      component: () => (
        <>
          <HeroSection onTabChange={onTabChange} onDaniOpen={deps.onDaniOpen} />
          <NextBestAction onTabChange={onTabChange} />
        </>
      ),
      className: "space-y-5 md:space-y-6",
      errorKey: "inicio",
      errorMsg: t("smartboard.error_load_home"),
    },
    perfil: {
      component: () => (
        <PerfilTab
          onTabChange={onTabChange}
          handleVakComplete={handleVakComplete}
        />
      ),
      errorKey: "perfil",
      errorMsg: "Error al cargar el perfil",
      className: "space-y-6",
    },
    // Explorar: misiones + noticias united in ExplorarTab
    misiones: {
      component: () => (
        <ExplorarTab {...explorarProps} defaultView="misiones" />
      ),
      errorKey: "misiones",
      errorMsg: t("smartboard.error_load_missions"),
    },
    noticias: {
      // Backward-compat for URL ?tab=noticias — opens ExplorarTab on noticias view
      component: () => (
        <ExplorarTab {...explorarProps} defaultView="noticias" />
      ),
      errorKey: "noticias",
      errorMsg: "Error al cargar noticias",
    },
    // Aprender: materias + horario + calificaciones + plan united in MateriasTab
    materias: {
      component: () => (
        <MateriasTab {...materiasProps} defaultView="materias" />
      ),
      errorKey: "materias",
      errorMsg: t("smartboard.error_load_subjects"),
    },
    horario: {
      component: () => <MateriasTab {...materiasProps} defaultView="horario" />,
      errorKey: "horario",
      errorMsg: "Error al cargar el horario",
    },
    calificaciones: {
      component: () => (
        <MateriasTab {...materiasProps} defaultView="calificaciones" />
      ),
      errorKey: "calificaciones",
      errorMsg: "Error al cargar calificaciones",
    },
    plan: {
      component: () => <MateriasTab {...materiasProps} defaultView="plan" />,
      errorKey: "plan",
      errorMsg: "Error al cargar el plan de mejora",
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
          <FlashcardSystem onTabChange={onTabChange} darkMode={darkMode} />
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

    const ageGroup =
      studentAge <= 9 ? "early" : studentAge <= 12 ? "middle" : "senior";

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
          darkMode,
          ageGroup,
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
        darkMode,
        ageGroup,
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
