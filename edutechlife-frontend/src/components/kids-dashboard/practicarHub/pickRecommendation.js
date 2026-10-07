import { PASSING_GRADE } from "../kidsDashboardConfig";

export function pickRecommendation(subjects) {
  const retoable = subjects.filter((s) => s.retoAvailable);
  if (!retoable.length) return null;

  // Highest priority: declining + low grade
  const declining = retoable.find(
    (s) => s.trend?.dir === "down" && s.score != null && s.score < 3.5,
  );
  if (declining) {
    // Una nota de 3.1 aprueba: no es una emergencia. Solo se habla de refuerzo
    // "urgente" cuando está por debajo de la nota para aprobar.
    const failing = declining.score < PASSING_GRADE;
    const nota = declining.score.toFixed(1);
    return {
      subject: declining,
      why: failing
        ? `Tu nota está en ${nota}. Un reto corto hoy te ayuda a subirla.`
        : `Tu nota bajó un poco (${nota}). Un reto de 10 minutos ayuda a subirla.`,
      urgent: failing,
    };
  }

  const weak = retoable.find((s) => s.weak);
  if (weak)
    return {
      subject: weak,
      why: `${weak.label} necesita refuerzo`,
      urgent: false,
    };
  const tried = retoable
    .filter((s) => s.lastReto)
    .sort((a, b) => a.lastReto.score - b.lastReto.score);
  if (tried[0]?.lastReto.score < 70) {
    return {
      subject: tried[0],
      why: `En tu último reto sacaste ${tried[0].lastReto.score}%`,
      urgent: false,
    };
  }
  const untried = retoable.find((s) => !s.lastReto);
  if (untried)
    return {
      subject: untried,
      why: "Aún no has hecho un reto de esta materia",
      urgent: false,
    };
  const oldest = [...tried].sort((a, b) =>
    a.lastReto.at.localeCompare(b.lastReto.at),
  )[0];
  return { subject: oldest, why: "Hace rato no la practicas", urgent: false };
}
