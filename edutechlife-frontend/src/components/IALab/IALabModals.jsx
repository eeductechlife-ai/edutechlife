import React, { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useIALabStore } from '../../store/ialabStore';
import SectionErrorBoundary from './SectionErrorBoundary';

const IALabEvaluationModal = lazy(() => import('./IALabEvaluationModal'));
const IALabQuizModal = lazy(() => import('./IALabQuizModal'));
const IALabValerioPanel = lazy(() => import('./IALabValerioPanel'));
const IALabEvaluationModalPremium = lazy(() => import('./IALabEvaluationModalPremium'));
const CertificatesModal = lazy(() => import('../modals/CertificatesModal'));
const BadgeGalleryModal = lazy(() => import('./BadgeGalleryModal'));
const LeaderboardModal = lazy(() => import('./LeaderboardModal'));
const ExamResultViewer = lazy(() => import('./ExamResultViewer'));
const ActivityHistory = lazy(() => import('../ActivityHistory'));
const ChallengeResultViewer = lazy(() => import('./ChallengeResultViewer'));
const SettingsSupportModal = lazy(() => import('../modals/SettingsSupportModal'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin" />
  </div>
);

const ModalsSection = ({
  showExamModal, handleGlobalAction,
  showQuizModal,
  showValerioPanel,
  showPremiumEvaluationModal, setShowPremiumEvaluationModal,
  showCertificateModal, setShowCertificateModal,
  showBadgeGallery, setShowBadgeGallery,
  showLeaderboard, setShowLeaderboard,
  showExamResult, activeMod, completedExams,
  showHistoryModal, setShowHistoryModal,
  showHelpModal, setShowHelpModal,
  showChallengeResult, setShowChallengeResult,
}) => {
  return (
    <>
      {showExamModal && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <IALabEvaluationModal
              isOpen={showExamModal}
              onClose={() => handleGlobalAction('CLOSE_EVALUATION')}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}

      {showQuizModal && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <IALabQuizModal
              isOpen={showQuizModal}
              onClose={() => handleGlobalAction('CLOSE_QUIZ')}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}

      {showValerioPanel && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <IALabValerioPanel
              isOpen={showValerioPanel}
              onClose={() => handleGlobalAction('CLOSE_VALERIO')}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}

      {showPremiumEvaluationModal && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <IALabEvaluationModalPremium
              isOpen={showPremiumEvaluationModal}
              onClose={() => setShowPremiumEvaluationModal(false)}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}

      <SectionErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <CertificatesModal
            isOpen={showCertificateModal}
            onClose={() => setShowCertificateModal(false)}
            initialTab="certificate"
          />
        </Suspense>
      </SectionErrorBoundary>

      <SectionErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <BadgeGalleryModal
            isOpen={showBadgeGallery}
            onClose={() => setShowBadgeGallery(false)}
          />
        </Suspense>
      </SectionErrorBoundary>

      <SectionErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <LeaderboardModal
            isOpen={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
          />
        </Suspense>
      </SectionErrorBoundary>

      {showExamResult && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <ExamResultViewer
              moduleId={activeMod}
              score={completedExams[activeMod]}
              onClose={() => setShowExamResult(false)}
              onRetry={() => {
                setShowExamResult(false);
                handleGlobalAction('OPEN_QUIZ');
              }}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}

      <AnimatePresence>
        {showHistoryModal && (
          <SectionErrorBoundary>
            <ActivityHistory
              isOpen={showHistoryModal}
              onClose={() => setShowHistoryModal(false)}
            />
          </SectionErrorBoundary>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelpModal && (
          <SectionErrorBoundary>
            <SettingsSupportModal
              isOpen={showHelpModal}
              onClose={() => setShowHelpModal(false)}
            />
          </SectionErrorBoundary>
        )}
      </AnimatePresence>

      {showChallengeResult && (
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
      )}
    </>
  );
};

export default React.memo(ModalsSection);
