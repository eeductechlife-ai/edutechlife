/**
 * E5 — SMARTBOARD PRIORITY: separa LEARNING NEED de ENGAGEMENT NEED y decide
 * la prioridad final. Casos:
 *   Student A (equations 0.35, alta actividad)  → learning (práctica).
 *   Student B (math 0.9, actividad 0)           → engagement (motivación).
 */
const { computeSmartboardPriority, getNextBestAction } = require('../../services/adaptiveLearning');

const stateA = {
  studentId: 'A',
  masteryRows: [
    { competency_id: 'co_matematicas_6-7_0', mastery_level: 0.45, practice_count: 4 },
    { competency_id: 'co_matematicas_6-7_1', mastery_level: 0.35, practice_count: 2 },
    { competency_id: 'co_ciencias_naturales_6-7_0', mastery_level: 0.8, practice_count: 5 },
  ],
  masteryBySubject: { matematicas: 0.425, ciencias_naturales: 0.8 },
  strengths: ['ciencias_naturales'],
  weaknesses: [],
  behavior: { activeDaysLast14: 14, streak: 5 },
};

const stateB = {
  studentId: 'B',
  masteryRows: [
    { competency_id: 'co_matematicas_6-7_0', mastery_level: 0.85, practice_count: 6 },
    { competency_id: 'co_matematicas_6-7_1', mastery_level: 0.9, practice_count: 6 },
    { competency_id: 'co_ciencias_naturales_6-7_0', mastery_level: 0.5, practice_count: 2 },
  ],
  masteryBySubject: { matematicas: 0.875, ciencias_naturales: 0.5 },
  strengths: ['matematicas'],
  weaknesses: [],
  behavior: { activeDaysLast14: 0, streak: 0 },
};

describe('E5 — SMARTBOARD PRIORITY', () => {
  test('Student A: déficit real (0.35) → ganador LEARNING a pesar de alta actividad', () => {
    const p = computeSmartboardPriority(stateA);
    expect(p.winning).toBe('learning');
    expect(p.minMastery).toBeCloseTo(0.35, 5);
    expect(p.weakestSubject).toBe('matematicas');
    expect(p.goal).toBe('practice');
    expect(p.learningNeed).toBeGreaterThan(p.engagementNeed);
  });

  test('Student B: sin déficit real (min 0.5) + actividad 0 → ganador ENGAGEMENT', () => {
    const p = computeSmartboardPriority(stateB);
    expect(p.winning).toBe('engagement');
    expect(p.engagementNeed).toBeCloseTo(1, 5);
  });

  test('getNextBestAction(A) → práctica en matemáticas', () => {
    const a = getNextBestAction(stateA);
    expect(a.action).toBe('practice');
    expect(a.subject).toBe('matematicas');
    expect(a.priority).toBe('high');
    expect(a.difficulty).toBe('easy');
  });

  test('getNextBestAction(B) → quick motivacional (no práctica en déficit inexistente)', () => {
    const b = getNextBestAction(stateB);
    expect(b.action).toBe('quick');
    expect(b.priority).toBe('medium');
  });

  test('Student A vs B: next action y prioridad DIFERENTES', () => {
    const a = getNextBestAction(stateA);
    const b = getNextBestAction(stateB);
    expect(a.action).not.toBe(b.action);
    expect(a.smartboardPriority.winning).toBe('learning');
    expect(b.smartboardPriority.winning).toBe('engagement');
  });
});
