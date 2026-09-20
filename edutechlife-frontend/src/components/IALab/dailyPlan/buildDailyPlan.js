import { DAILY_CHALLENGES } from "../constants/dailyChallenges";

/**
 * Construye el plan del día como una lista ORDENADA de pasos. El CTA único
 * (opción C, "siguiente paso guiado") apunta al primer paso no completado.
 *
 * Es una función PURA (sin React ni store) para poder testearla.
 *
 * @param {{
 *   activeMod: number,
 *   moduleProgress?: Record<number, any>,
 *   recs?: { high?: any[], medium?: any[] },
 *   atRisk?: boolean,
 *   currentLessonTitle?: string|null,
 *   completedChallenges?: Record<string, boolean>,
 *   dailyChallenges?: any[],
 * }} input
 * @returns {{ steps: any[], currentIndex: number, current: any|null, total: number }}
 */
export function buildDailyPlan({
  activeMod,
  moduleProgress = {},
  recs = { high: [], medium: [] },
  atRisk = false,
  currentLessonTitle = null,
  completedChallenges = {},
  dailyChallenges = DAILY_CHALLENGES,
} = {}) {
  const steps = [];
  const mod = moduleProgress?.[activeMod] || {};
  const resourcesCompleted = !!mod.resourcesCompleted;
  const examDone = !!mod.exam;

  // 1. Racha en riesgo (prioridad máxima)
  if (atRisk) {
    steps.push({
      id: "streak",
      type: "streak",
      titleKey: "ialab.streak_risk_title",
      descriptionKey: "ialab.streak_risk_desc",
      actionLabelKey: "ialab.streak_risk_cta",
      completed: false,
    });
  }

  // 2. Recursos completados y examen pendiente
  if (resourcesCompleted && !examDone) {
    steps.push({
      id: `exam-${activeMod}`,
      type: "exam",
      titleKey: "ialab.exam_ready_title",
      descriptionKey: "ialab.exam_ready_desc",
      actionLabelKey: "ialab.exam_ready_cta",
      completed: false,
    });
  }

  // 3. Empezar el módulo (sin recursos completados)
  if (!resourcesCompleted) {
    steps.push({
      id: "start",
      type: "content",
      titleKey: "ialab.start_cta_label",
      descriptionKey: "ialab.start_cta_desc",
      actionLabelKey: "ialab.start_cta_btn",
      completed: false,
    });
  }

  // 4. Retos diarios pendientes
  const pendingChallenge = (dailyChallenges || []).find(
    (c) => !completedChallenges?.[c.id],
  );
  if (pendingChallenge) {
    steps.push({
      id: pendingChallenge.id,
      type: "challenge",
      titleKey: pendingChallenge.titleKey,
      descriptionKey: pendingChallenge.descriptionKey,
      xp: pendingChallenge.xp ?? 0,
      icon: pendingChallenge.icon,
      actionLabelKey: "ialab.daily_plan.done_btn",
      completed: false,
    });
  }

  // 5. Recomendaciones personalizadas (hasta 2, priorizando "high")
  const recommendations = [...(recs.high || []), ...(recs.medium || [])].slice(
    0,
    2,
  );
  recommendations.forEach((r, i) => {
    steps.push({
      id: r.id || `rec-${i}-${r.type || "x"}-${r.moduleId || "m"}`,
      type: "recommendation",
      title: r.title,
      description: r.description,
      actionLabel: r.action?.label,
      moduleId: r.moduleId,
      recType: r.type,
      completed: false,
    });
  });

  // 6. Continuar donde lo dejaste / explorar
  if (resourcesCompleted && examDone && recommendations.length === 0) {
    steps.push({
      id: "continue",
      type: "content",
      title: currentLessonTitle || null,
      titleKey: currentLessonTitle ? null : "ialab.daily_plan.complete_today",
      descriptionKey: "ialab.daily_plan.empty_desc",
      actionLabelKey: "ialab.daily_plan.continue",
      completed: false,
    });
  }

  const currentIndex = steps.findIndex((s) => !s.completed);

  return {
    steps,
    total: steps.length,
    currentIndex: currentIndex === -1 ? 0 : currentIndex,
    current: steps[currentIndex === -1 ? 0 : currentIndex] || null,
  };
}

export default buildDailyPlan;
