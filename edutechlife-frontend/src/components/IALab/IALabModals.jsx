import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types';;
import { AnimatePresence } from 'framer-motion';
import { useIALabStore } from '../../store/ialabStore';
import SectionErrorBoundary from './SectionErrorBoundary';
import useFocusTrap from '../../hooks/useFocusTrap';
import { cn } from '../forum/forumDesignSystem';

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

function FocusTrapModal({ isOpen, children, className }) {
  const trapRef = useFocusTrap(isOpen);
  return (
    <div ref={trapRef} className={cn("outline-none", className)}>
      {children}
    </div>
  );
}

const ModalsSection = ({
  showExamModal, handleGlobalAction,
  showQuizModal,
  showValerioPanel,
  showPremiumEvaluationModal, setShowPremiumEvaluationModal,
  showCertificateModal, setShowCertificateModal,
  showBadgeGallery, setShowBadgeGallery,
  showLeaderboard, setShowLeaderboard,
    showExamResult, setShowExamResult, activeMod, completedExams,
  showHistoryModal, setShowHistoryModal,
  showHelpModal, setShowHelpModal,
  showChallengeResult, setShowChallengeResult,
}) => {
  return (
    <>
      <FocusTrapModal isOpen={showExamModal}>
      {showExamModal && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <IALabEvaluationModal
              isOpen={showExamModal}
              onClose={() => handleGlobalAction('CLOSE_EVALUATION')}
              moduleId={activeMod}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}
      </FocusTrapModal>

      <FocusTrapModal isOpen={showQuizModal}>
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
      </FocusTrapModal>

      <FocusTrapModal isOpen={showValerioPanel}>
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
      </FocusTrapModal>

      <FocusTrapModal isOpen={showPremiumEvaluationModal}>
      {showPremiumEvaluationModal && (
        <SectionErrorBoundary showDetails>
          <Suspense fallback={<LoadingFallback />}>
            <IALabEvaluationModalPremium
              isOpen={showPremiumEvaluationModal}
              onClose={() => setShowPremiumEvaluationModal(false)}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}
      </FocusTrapModal>

      <FocusTrapModal isOpen={showCertificateModal}>
      {showCertificateModal && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <CertificatesModal
              isOpen={showCertificateModal}
              onClose={() => setShowCertificateModal(false)}
              initialTab="certificate"
            />
          </Suspense>
        </SectionErrorBoundary>
      )}
      </FocusTrapModal>

      <FocusTrapModal isOpen={showBadgeGallery}>
      {showBadgeGallery && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <BadgeGalleryModal
              isOpen={showBadgeGallery}
              onClose={() => setShowBadgeGallery(false)}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}
      </FocusTrapModal>

      <FocusTrapModal isOpen={showLeaderboard}>
      {showLeaderboard && (
        <SectionErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <LeaderboardModal
              isOpen={showLeaderboard}
              onClose={() => setShowLeaderboard(false)}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}
      </FocusTrapModal>

      <FocusTrapModal isOpen={showExamResult}>
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
      </FocusTrapModal>

      <FocusTrapModal isOpen={showHistoryModal}>
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
      </FocusTrapModal>

      <FocusTrapModal isOpen={showHelpModal}>
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
      </FocusTrapModal>

      <FocusTrapModal isOpen={showChallengeResult}>
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
      </FocusTrapModal>
    </>
  );
};


ModalsSection.propTypes = {
  showExamModal: PropTypes.any,
  handleGlobalAction: PropTypes.any,
  showQuizModal: PropTypes.any,
  showValerioPanel: PropTypes.any,
  showPremiumEvaluationModal: PropTypes.any,
  setShowPremiumEvaluationModal: PropTypes.any,
  showCertificateModal: PropTypes.any,
  setShowCertificateModal: PropTypes.any,
  showBadgeGallery: PropTypes.any,
  setShowBadgeGallery: PropTypes.any,
  showLeaderboard: PropTypes.any,
  setShowLeaderboard: PropTypes.any,
  showExamResult: PropTypes.any,
  setShowExamResult: PropTypes.any,
  activeMod: PropTypes.any,
  completedExams: PropTypes.any,
  showHistoryModal: PropTypes.any,
  setShowHistoryModal: PropTypes.any,
  showHelpModal: PropTypes.any,
  setShowHelpModal: PropTypes.any,
  showChallengeResult: PropTypes.any,
  setShowChallengeResult: PropTypes.any,
};

export default React.memo(ModalsSection);
