import React, { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useIALabStore } from "../../store/ialabStore";
import SectionErrorBoundary from "./SectionErrorBoundary";
import useFocusTrap from "../../hooks/useFocusTrap";
import { cn } from "../forum/forumDesignSystem";

const IALabEvaluationModal = lazy(() => import("./IALabEvaluationModal"));
const IALabQuizModal = lazy(() => import("./IALabQuizModal"));
const IALabEvaluationModalPremium = lazy(
  () => import("./IALabEvaluationModalPremium"),
);
const CertificatesModal = lazy(() => import("../modals/CertificatesModal"));
const BadgeGalleryModal = lazy(() => import("./BadgeGalleryModal"));
const LeaderboardModal = lazy(() => import("./LeaderboardModal"));
const ExamResultViewer = lazy(() => import("./ExamResultViewer"));
const ActivityHistory = lazy(() => import("../ActivityHistory"));
const ChallengeResultViewer = lazy(() => import("./ChallengeResultViewer"));
const SettingsSupportModal = lazy(
  () => import("../modals/SettingsSupportModal"),
);
const PracticeToolModal = lazy(() => import("./PracticeToolModal"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin" />
  </div>
);

function FocusTrapModal({ isOpen, children, className }) {
  const trapRef = useFocusTrap(isOpen);
  return (
    <div ref={trapRef} className={cn("outline-none", className)}>
      {children}
    </div>
  );
}

const ModalsSection = ({ handleGlobalAction, activeMod, completedExams }) => {
  const showExamModal = useIALabStore((s) => s.showExamModal);
  const showQuizModal = useIALabStore((s) => s.showQuizModal);
  const showPremiumEvaluationModal = useIALabStore(
    (s) => s.showPremiumEvaluationModal,
  );
  const showCertificateModal = useIALabStore((s) => s.showCertificateModal);
  const showBadgeGallery = useIALabStore((s) => s.showBadgeGallery);
  const showLeaderboard = useIALabStore((s) => s.showLeaderboard);
  const showExamResult = useIALabStore((s) => s.showExamResult);
  const showHistoryModal = useIALabStore((s) => s.showHistoryModal);
  const showHelpModal = useIALabStore((s) => s.showHelpModal);
  const showChallengeResult = useIALabStore((s) => s.showChallengeResult);
  const setShowPremiumEvaluationModal = useIALabStore(
    (s) => s.setShowPremiumEvaluationModal,
  );
  const setShowBadgeGallery = useIALabStore((s) => s.setShowBadgeGallery);
  const setShowLeaderboard = useIALabStore((s) => s.setShowLeaderboard);
  const setShowExamResult = useIALabStore((s) => s.setShowExamResult);
  const setShowChallengeResult = useIALabStore((s) => s.setShowChallengeResult);
  const setShowCertificateModal = useIALabStore(
    (s) => s.setShowCertificateModal,
  );
  const practiceToolOpen = useIALabStore((s) => s.practiceToolOpen);
  const activePracticeTool = useIALabStore((s) => s.activePracticeTool);
  const closePracticeTool = useIALabStore((s) => s.closePracticeTool);

  const modalItems = [
    {
      key: "showExamModal",
      isOpen: showExamModal,
      children: (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <IALabEvaluationModal
              isOpen={showExamModal}
              onClose={() => handleGlobalAction("CLOSE_EVALUATION")}
              moduleId={activeMod}
            />
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
    {
      key: "showQuizModal",
      isOpen: showQuizModal,
      children: (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <IALabQuizModal
              isOpen={showQuizModal}
              onClose={() => handleGlobalAction("CLOSE_QUIZ")}
            />
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
    {
      key: "showPremiumEvaluationModal",
      isOpen: showPremiumEvaluationModal,
      children: (
        <SectionErrorBoundary showDetails>
          <Suspense fallback={<LoadingFallback />}>
            <IALabEvaluationModalPremium
              isOpen={showPremiumEvaluationModal}
              onClose={() => setShowPremiumEvaluationModal(false)}
            />
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
    {
      key: "showCertificateModal",
      isOpen: showCertificateModal,
      children: (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <CertificatesModal
              isOpen={showCertificateModal}
              onClose={() => setShowCertificateModal(false)}
              initialTab="certificate"
            />
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
    {
      key: "showBadgeGallery",
      isOpen: showBadgeGallery,
      children: (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <BadgeGalleryModal
              isOpen={showBadgeGallery}
              onClose={() => setShowBadgeGallery(false)}
            />
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
    {
      key: "showLeaderboard",
      isOpen: showLeaderboard,
      children: (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <LeaderboardModal
              isOpen={showLeaderboard}
              onClose={() => setShowLeaderboard(false)}
            />
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
    {
      key: "showExamResult",
      isOpen: showExamResult,
      children: (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <ExamResultViewer
              moduleId={activeMod}
              score={completedExams[activeMod]}
              onClose={() => setShowExamResult(false)}
              onRetry={() => {
                setShowExamResult(false);
                handleGlobalAction("OPEN_QUIZ");
              }}
            />
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
    {
      key: "showHistoryModal",
      isOpen: showHistoryModal,
      children: (
        <AnimatePresence>
          {showHistoryModal && (
            <SectionErrorBoundary>
              <ActivityHistory
                isOpen={showHistoryModal}
                onClose={() =>
                  useIALabStore.getState().setShowHistoryModal(false)
                }
              />
            </SectionErrorBoundary>
          )}
        </AnimatePresence>
      ),
    },
    {
      key: "showHelpModal",
      isOpen: showHelpModal,
      children: (
        <AnimatePresence>
          {showHelpModal && (
            <SectionErrorBoundary>
              <SettingsSupportModal
                isOpen={showHelpModal}
                onClose={() => useIALabStore.getState().setShowHelpModal(false)}
              />
            </SectionErrorBoundary>
          )}
        </AnimatePresence>
      ),
    },
    {
      key: "showChallengeResult",
      isOpen: showChallengeResult,
      children: (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </SectionErrorBoundary>
      ),
    },
  ];

  return (
    <>
      {modalItems.map(({ key, isOpen, children }) => (
        <FocusTrapModal key={key} isOpen={isOpen}>
          {isOpen && children}
        </FocusTrapModal>
      ))}
      <Suspense fallback={<LoadingFallback />}>
        <PracticeToolModal
          isOpen={practiceToolOpen}
          toolType={activePracticeTool}
          onClose={closePracticeTool}
        />
      </Suspense>
    </>
  );
};

export default React.memo(ModalsSection);
