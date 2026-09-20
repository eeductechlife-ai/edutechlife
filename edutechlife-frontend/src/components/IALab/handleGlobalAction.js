// Cierra todos los modales conocidos antes de abrir uno nuevo. Evita que un
// modal quede "pegado" (flag en true) y reaparezca al pulsar otra acción
// (p. ej. "Mi Progreso"/"Certificados" abriendo el Desafío/Ruleta).
function closeModals(store) {
  const off = [
    "setShowExamModal",
    "setShowQuizModal",
    "setShowPremiumEvaluationModal",
    "setShowExamResult",
    "setShowChallengeResult",
    "setShowCertificateModal",
    "setShowHistoryModal",
    "setShowHelpModal",
    "setShowBadgeGallery",
    "setShowLeaderboard",
    "setShowStudyPlannerModal",
  ];
  off.forEach((setter) => {
    if (typeof store?.[setter] === "function") store[setter](false);
  });
}

export default function handleGlobalAction(action, data, store) {
  switch (action) {
    case "OPEN_EVALUATION":
      closeModals(store);
      store.setShowExamModal(true);
      break;
    case "OPEN_QUIZ":
      closeModals(store);
      store.setShowQuizModal(true);
      break;
    case "OPEN_CHALLENGE":
      closeModals(store);
      store.setShowPremiumEvaluationModal(true);
      break;
    case "SHOW_EXAM_RESULT":
      closeModals(store);
      store.setShowExamResult(true);
      break;
    case "SHOW_CHALLENGE_RESULT":
      closeModals(store);
      store.setShowChallengeResult(true);
      break;
    case "CLOSE_EVALUATION":
      store.setShowExamModal(false);
      break;
    case "CLOSE_QUIZ":
      store.setShowQuizModal(false);
      break;
    case "OPEN_CERTIFICATE":
    case "SHOW_CERTIFICATE":
      closeModals(store);
      store.setShowCertificateModal(true);
      break;
    case "OPEN_COMMUNITY":
      window.dispatchEvent(
        new CustomEvent("ialab:switchTab", { detail: "comunidad" }),
      );
      break;
    case "OPEN_TOOL_PROMPTS":
      store.setPracticeTool("prompts");
      break;
    case "OPEN_FLASHCARDS":
      store.setPracticeTool("flashcards");
      break;
    case "OPEN_TUTORING":
      store.setPracticeTool("tutoring");
      break;
    case "OPEN_COT_TRAINER":
      store.setPracticeTool("cot");
      break;
    case "OPEN_MODEL_SELECTION_GUIDE":
      store.setPracticeTool("model-selection");
      break;
    default:
      console.warn("Acción global no manejada:", action, data);
  }
}
