import { useIALabStore } from "../../../store/ialabStore";
import { scopedKey } from "../../../utils/userScopedStorage";
import { awardQuestionXp } from "../quizQuestionXp";

/**
 * Efectos posteriores al envío del examen: registro adaptativo de errores,
 * XP por respuesta correcta, persistencia del puntaje, sincronización del
 * examen completado y notificación del resultado.
 */
export function applyQuizSubmitResult({
  submitResult,
  practiceMode,
  quizQuestions,
  quizAnswers,
  activeMod,
  markExamComplete,
  createNotification,
  t,
}) {
  // Registro silencioso de conceptos fallados en el sistema adaptativo (aditivo)
  // Usa el topic de cada pregunta para agrupar errores por concepto pedagógico
  try {
    const stAdaptive = useIALabStore.getState();
    if (
      typeof stAdaptive.recordError === "function" &&
      Array.isArray(quizQuestions)
    ) {
      quizQuestions.forEach((q) => {
        const answered = quizAnswers?.[q.id];
        if (answered && q.correctAnswer && answered !== q.correctAnswer) {
          const concept = q.topic || `module-${activeMod}-q${q.id}`;
          stAdaptive.recordError(concept, q.question?.slice(0, 120) || "");
        }
      });
    }
  } catch (e) {
    /* silent — no debe interrumpir flujo del quiz */
  }

  // XP por cada respuesta correcta (una vez por pregunta y cuenta).
  if (!practiceMode && Array.isArray(quizQuestions)) {
    quizQuestions.forEach((q) => {
      const answered = quizAnswers?.[q.id];
      if (answered && answered === q.correctAnswer) {
        awardQuestionXp(`exam:${activeMod}:${q.id}`);
      }
    });
  }

  if (!practiceMode && submitResult?.result) {
    const { score, passed } = submitResult.result;
    const st = useIALabStore.getState();
    st.updateModuleActivity(activeMod, "exam", passed, score);
    try {
      // Clave POR CUENTA (antes sin scope).
      const key = scopedKey("ialab_completed_exams");
      const current = JSON.parse(
        localStorage.getItem(key) ||
          localStorage.getItem("ialab_completed_exams") ||
          "{}",
      );
      current[activeMod] = score;
      localStorage.setItem(key, JSON.stringify(current));
    } catch (e) {
      /* ignore */
    }

    if (markExamComplete) {
      markExamComplete(activeMod, score).catch((err) => {
        if (import.meta.env.DEV)
          console.error("Error al sincronizar examen completado:", err);
        createNotification({
          type: "error",
          title: t("ialab.quiz.sync_error_title"),
          message: t("ialab.quiz.sync_error_msg"),
          metadata: { moduleId: activeMod, score },
        });
      });
    }

    if (passed) {
      const addXp = useIALabStore.getState().addXp;
      if (addXp) addXp(score >= 90 ? 100 : 75);
    }

    window.dispatchEvent(
      new CustomEvent("ialab:examCompleted", {
        detail: { moduleId: activeMod, score, passed },
      }),
    );
  }

  if (!practiceMode && submitResult?.success && submitResult?.result) {
    createNotification({
      type: submitResult.result.passed ? "success" : "warning",
      title: submitResult.result.passed
        ? t("ialab.quiz.exam_passed_notif_title")
        : t("ialab.quiz.exam_failed_notif_title"),
      message: t("ialab.quiz.exam_notif_message", {
        module: activeMod,
        score: submitResult.result.score,
        result: submitResult.result.passed
          ? t("ialab.quiz.exam_passed_result")
          : t("ialab.quiz.exam_failed_result"),
      }),
      metadata: {
        moduleId: activeMod,
        score: submitResult.result.score,
        type: "exam",
      },
    });
  }
}
