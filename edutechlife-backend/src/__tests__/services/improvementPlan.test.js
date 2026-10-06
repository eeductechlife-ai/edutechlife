/**
 * Mi Plan adaptativo — tests de la lógica determinista que decide las
 * competencias foco y arma las 4 semanas. No tocan la BD (función pura).
 *
 * Casos que cubren los bugs reales de producción:
 *  - estudiante sin datos → el plan igual trae 4 semanas con 3 actividades.
 *  - dominio + notas malas → la competencia más débil va primero y una nota
 *    baja (< 3.5) empuja su competencia hacia arriba.
 *  - subjects crudos del boletín ("MATEMÁTICAS", "QUÍMICA") deben normalizarse.
 */
const {
  normalizeSubject,
  rankWeakCompetencies,
  activitiesForTarget,
  assembleImprovementPlan,
} = require('../../services/adaptiveLearning');

const emptyState = {
  studentId: 's1',
  grade: null,
  countryCode: 'CO',
  masteryRows: [],
  masteryBySubject: {},
  grades: {},
  strengths: [],
  weaknesses: [],
  behavior: { activeDaysLast14: 0, streak: 0 },
};

describe('normalizeSubject', () => {
  test.each([
    ['MATEMÁTICAS', 'matematicas'],
    ['Química', 'ciencias_naturales'],
    ['CIENCIAS SOCIALES', 'ciencias_sociales'],
    ['Inglés', 'ingles'],
    ['LENGUA CASTELLANA', 'lenguaje'],
    ['Tecnología e Informática', 'tecnologia'],
    ['Materia inventada', null],
    ['', null],
  ])('%s → %s', (raw, expected) => {
    expect(normalizeSubject(raw)).toBe(expected);
  });
});

describe('rankWeakCompetencies', () => {
  test('sin datos no rompe (devuelve lista vacía)', () => {
    expect(rankWeakCompetencies(emptyState, 4)).toEqual([]);
  });

  test('ordena por déficit de dominio (el más débil primero)', () => {
    const state = {
      ...emptyState,
      masteryRows: [
        { competency_id: 'co_matematicas_6-7_0', mastery_level: 0.8 },
        { competency_id: 'co_matematicas_6-7_1', mastery_level: 0.35 },
        { competency_id: 'co_ciencias_naturales_6-7_0', mastery_level: 0.5 },
      ],
      masteryBySubject: { matematicas: 0.575, ciencias_naturales: 0.5 },
    };
    const ranked = rankWeakCompetencies(state, 4);
    expect(ranked[0].competencyId).toBe('co_matematicas_6-7_1');
    expect(ranked[0].mastery).toBeCloseTo(0.35, 5);
    expect(ranked[0].subject).toBe('matematicas');
  });

  test('una nota baja (< 3.5) empuja su competencia hacia arriba', () => {
    const state = {
      ...emptyState,
      grades: { matematicas: 2.5 },
      masteryRows: [
        { competency_id: 'co_matematicas_6-7_0', mastery_level: 0.45 }, // 0.55 + 0.2 = 0.75
        { competency_id: 'co_lenguaje_6-7_0', mastery_level: 0.35 }, // 0.65
      ],
      masteryBySubject: { matematicas: 0.45, lenguaje: 0.35 },
    };
    const ranked = rankWeakCompetencies(state, 4);
    expect(ranked[0].competencyId).toBe('co_matematicas_6-7_0');
  });

  test('nunca devuelve más de `limit` competencias', () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({
      competency_id: `co_matematicas_6-7_${i}`,
      mastery_level: 0.1 + i * 0.01,
    }));
    expect(rankWeakCompetencies({ ...emptyState, masteryRows: rows }, 4)).toHaveLength(4);
  });
});

describe('activitiesForTarget', () => {
  test('siempre 3 actividades, sin marcar, con competencyId', () => {
    const acts = activitiesForTarget(
      { competencyId: 'co_matematicas_6-7_1', mastery: 0.35, subject: 'matematicas', info: { subjectLabel: 'Matemáticas', topic: 'Ecuaciones' } },
      null,
    );
    expect(acts).toHaveLength(3);
    acts.forEach((a) => {
      expect(a.done).toBe(false);
      expect(a.competencyId).toBe('co_matematicas_6-7_1');
      expect(a.titulo).toBeTruthy();
    });
  });

  test('el estilo VAK dominante queda primero', () => {
    const acts = activitiesForTarget(
      { competencyId: 'x', mastery: 0.3, subject: 'matematicas', info: { subjectLabel: 'Matemáticas', topic: 'Tema' } },
      'auditivo',
    );
    expect(acts[0].tipo).toBe('auditivo');
  });
});

describe('assembleImprovementPlan', () => {
  test('estado vacío → 4 semanas, 3 actividades cada una (nunca vacío)', () => {
    const plan = assembleImprovementPlan(emptyState);
    expect(plan.weeks).toHaveLength(4);
    plan.weeks.forEach((w) => {
      expect(w.activities).toHaveLength(3);
      expect(w.activities.every((a) => a.done === false)).toBe(true);
    });
    expect(plan.needsDiagnostic).toBe(false);
    expect(plan.weakSubjects.length).toBeGreaterThan(0);
  });

  test('usa la competencia más débil como foco de la semana 1', () => {
    const state = {
      ...emptyState,
      grades: { matematicas: 2.8 },
      masteryRows: [
        { competency_id: 'co_matematicas_6-7_1', mastery_level: 0.3 },
        { competency_id: 'co_ciencias_naturales_6-7_0', mastery_level: 0.9 },
      ],
      masteryBySubject: { matematicas: 0.3, ciencias_naturales: 0.9 },
      weaknesses: ['matematicas'],
      strengths: ['ciencias_naturales'],
    };
    const plan = assembleImprovementPlan(state);
    expect(plan.weeks[0].competencyId).toBe('co_matematicas_6-7_1');
    expect(plan.currentFocus).toBe('co_matematicas_6-7_1');
  });
});
