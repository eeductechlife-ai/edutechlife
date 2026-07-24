// fix vercel activity uploader casing
import { useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
import DashboardErrorBoundary from "../DashboardErrorBoundary";
import HeroSection from "../HeroSection";
import { VAKDiagnosticEnhanced } from "../VAKDiagnosticEnhanced";
import PremiumGate from "../PremiumGate";
import MissionsView from "./MissionsView";
import SubjectsView from "./SubjectsView";
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

const CinematicContent = ({
  activeTab,
  onTabChange,
  darkMode,
  subscriptionTier,
}) => {
  const { t } = useTranslation();
  const isPremium = subscriptionTier === "premium";
  const {
    totalPoints,
    vakResult,
    addPoints,
    setVakResultAndRecommendations,
    streak,
    studentMoodHistory,
    academicTopics,
    conversationCount,
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

  const renderContent = () => {
    const sharedTransition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };
    switch (activeTab) {
      case "inicio":
        return (
          <DashboardErrorBoundary
            key="inicio"
            message={t("smartboard.error_load_home")}
            onTabChange={onTabChange}
          >
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
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <Suspense fallback={<SectionFallback tab="inicio" />}>
                  <PointsRewardsSystem />
                </Suspense>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Suspense fallback={<SectionFallback tab="noticias" />}>
                  <PremiumGate
                    icon="📰"
                    title={PREMIUM_FEATURES.noticias.title}
                    description={PREMIUM_FEATURES.noticias.description}
                    isPremium={isPremium}
                  >
                    <NewsTechFeed />
                  </PremiumGate>
                </Suspense>
              </motion.div>
            </motion.div>
          </DashboardErrorBoundary>
        );

      case "misiones":
        return (
          <DashboardErrorBoundary
            key="misiones"
            message={t("smartboard.error_load_missions")}
            onTabChange={onTabChange}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={sharedTransition}
            >
              <MissionsView
                missions={missions}
                onCompleteMission={completeMission}
              />
            </motion.div>
          </DashboardErrorBoundary>
        );

      case "materias":
        return (
          <DashboardErrorBoundary
            key="materias"
            message={t("smartboard.error_load_subjects")}
            onTabChange={onTabChange}
          >
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

      case "actividades":
        return (
          <DashboardErrorBoundary
            key="actividades"
            message={t("smartboard.error_load_activities")}
            onTabChange={onTabChange}
          >
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

      case "calendario":
        return (
          <DashboardErrorBoundary
            key="calendario"
            message={t("smartboard.error_load_calendar")}
            onTabChange={onTabChange}
          >
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

      case "puntos":
        return (
          <DashboardErrorBoundary
            key="puntos"
            message={t("smartboard.error_load_points")}
            onTabChange={onTabChange}
          >
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

      case "noticias":
        return (
          <DashboardErrorBoundary
            key="noticias"
            message={t("smartboard.error_load_news")}
            onTabChange={onTabChange}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={sharedTransition}
            >
              <Suspense fallback={<SectionFallback tab="noticias" />}>
                <PremiumGate
                  icon={PREMIUM_FEATURES.noticias.icon}
                  title={PREMIUM_FEATURES.noticias.title}
                  description={PREMIUM_FEATURES.noticias.description}
                  isPremium={isPremium}
                >
                  <NewsTechFeed />
                </PremiumGate>
              </Suspense>
            </motion.div>
          </DashboardErrorBoundary>
        );

      case "vak":
        return (
          <DashboardErrorBoundary
            key="vak"
            message={t("smartboard.error_load_vak")}
            onTabChange={onTabChange}
          >
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

      case "curriculo":
        return (
          <DashboardErrorBoundary
            key="curriculo"
            message="Error al cargar currículo"
            onTabChange={onTabChange}
          >
            <motion.div
              key="curriculo"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={sharedTransition}
              className="h-full"
            >
              <Suspense fallback={<SectionFallback tab="curriculo" />}>
                <CurriculumView />
              </Suspense>
            </motion.div>
          </DashboardErrorBoundary>
        );

      case "oral":
        return (
          <DashboardErrorBoundary
            key="oral"
            message="Error al cargar examen oral"
            onTabChange={onTabChange}
          >
            <motion.div
              key="oral"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={sharedTransition}
              className="h-full"
            >
              <Suspense fallback={<SectionFallback tab="oral" />}>
                <OralExamSimulator />
              </Suspense>
            </motion.div>
          </DashboardErrorBoundary>
        );

      case "examenes":
        return (
          <DashboardErrorBoundary
            key="examenes"
            message="Error al cargar exámenes"
            onTabChange={onTabChange}
          >
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

      case "flashcards":
        return (
          <DashboardErrorBoundary
            key="flashcards"
            message="Error al cargar flashcards"
            onTabChange={onTabChange}
          >
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

      case "libros":
        return (
          <DashboardErrorBoundary
            key="libros"
            message="Error al cargar libros"
            onTabChange={onTabChange}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={sharedTransition}
            >
              <Suspense fallback={<SectionFallback tab="libros" />}>
                <PremiumGate
                  icon={PREMIUM_FEATURES.libros.icon}
                  title={PREMIUM_FEATURES.libros.title}
                  description={PREMIUM_FEATURES.libros.description}
                  isPremium={isPremium}
                >
                  <SmartBookReader />
                </PremiumGate>
              </Suspense>
            </motion.div>
          </DashboardErrorBoundary>
        );

      case "escaner":
        return (
          <DashboardErrorBoundary
            key="escaner"
            message="Error al cargar escáner"
            onTabChange={onTabChange}
          >
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

      case "progreso":
        return (
          <DashboardErrorBoundary
            key="progreso"
            message="Error al cargar progreso"
            onTabChange={onTabChange}
          >
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

      case "podcast":
        return (
          <DashboardErrorBoundary
            key="podcast"
            message="Error al cargar podcast"
            onTabChange={onTabChange}
          >
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

      case "analitica":
        return (
          <DashboardErrorBoundary
            key="analitica"
            message="Error al cargar analytics"
            onTabChange={onTabChange}
          >
            <motion.div
              key="analitica"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={sharedTransition}
              className="h-full"
            >
              <PremiumGate
                icon={PREMIUM_FEATURES.analitica.icon}
                title={PREMIUM_FEATURES.analitica.title}
                description={PREMIUM_FEATURES.analitica.description}
                isPremium={isPremium}
              >
                <Suspense fallback={<SectionFallback tab="analitica" />}>
                  <SmartBoardAnalytics />
                </Suspense>
              </PremiumGate>
            </motion.div>
          </DashboardErrorBoundary>
        );

      case "padres":
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative p-4 md:p-6">
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </div>
  );
};

export default CinematicContent;
