export default function handleGlobalAction(action, data, store) {
  switch (action) {
    case 'OPEN_EVALUATION':
      store.setShowExamModal(true);
      break;
    case 'OPEN_QUIZ':
      store.setShowQuizModal(true);
      break;
    case 'OPEN_CHALLENGE':
      store.setShowPremiumEvaluationModal(true);
      break;
    case 'SHOW_EXAM_RESULT':
      store.setShowExamResult(true);
      break;
    case 'SHOW_CHALLENGE_RESULT':
      store.setShowChallengeResult(true);
      break;
    case 'CLOSE_EVALUATION':
      store.setShowExamModal(false);
      break;
    case 'CLOSE_QUIZ':
      store.setShowQuizModal(false);
      break;
    case 'OPEN_CERTIFICATE':
    case 'SHOW_CERTIFICATE':
      store.setShowCertificateModal(true);
      break;
    case 'OPEN_COMMUNITY':
      window.dispatchEvent(new CustomEvent('ialab:switchTab', { detail: 'comunidad' }));
      break;
    default:
      console.warn('Acción global no manejada:', action, data);
  }
}
