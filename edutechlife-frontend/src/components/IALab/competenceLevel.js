export const COMPETENCE_LEVELS = {
  explorer: { threshold: 0, key: "explorer" },
  creator: { threshold: 60, key: "creator" },
  expert: { threshold: 80, key: "expert" },
};

export function getCompetenceLevel(score) {
  const value = Number.isFinite(score) ? score : 0;
  if (value >= COMPETENCE_LEVELS.expert.threshold)
    return COMPETENCE_LEVELS.expert;
  if (value >= COMPETENCE_LEVELS.creator.threshold)
    return COMPETENCE_LEVELS.creator;
  return COMPETENCE_LEVELS.explorer;
}

export function computeRadarScores(evaluation, axes = 4) {
  const scores = [];
  for (let i = 1; i <= axes; i += 1) {
    const nota = evaluation?.[`nota_ej${i}`];
    scores.push(Number.isFinite(nota) && nota !== null ? nota : null);
  }
  const present = scores.filter((s) => s !== null);
  return {
    scores,
    average: present.length
      ? present.reduce((a, b) => a + b, 0) / present.length
      : 0,
  };
}
