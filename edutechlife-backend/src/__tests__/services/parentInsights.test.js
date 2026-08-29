/**
 * B.14 (parcial) — Parent Insights: agregación por materia desde mastery_level
 * y helpers de sesión. La ruta /parent/insights requiere DB (staging).
 */
const {
  subjectFromCompetencyId,
  aggregateMasteryBySubject,
  daysSince,
} = require('../../services/parentInsights');

describe('parentInsights helpers (B.14)', () => {
  describe('subjectFromCompetencyId', () => {
    it('extrae la materia de co_matematicas_6-7_0', () => {
      expect(subjectFromCompetencyId('co_matematicas_6-7_0')).toBe('matematicas');
    });

    it('maneja materias compuestas (ciencias_naturales)', () => {
      expect(subjectFromCompetencyId('co_ciencias_naturales_8-9_1')).toBe('ciencias_naturales');
    });
  });

  describe('aggregateMasteryBySubject', () => {
    it('promedia mastery_level por materia (no mastery_score)', () => {
      const rows = [
        { competency_id: 'co_matematicas_6-7_0', mastery_level: 0.3 },
        { competency_id: 'co_matematicas_6-7_1', mastery_level: 0.5 },
        { competency_id: 'co_lenguaje_6-7_0', mastery_level: 0.8 },
      ];
      const result = aggregateMasteryBySubject(rows);
      expect(result.matematicas).toBeCloseTo(0.4, 5);
      expect(result.lenguaje).toBeCloseTo(0.8, 5);
    });

    it('devuelve objeto vacío si no hay filas', () => {
      expect(aggregateMasteryBySubject([])).toEqual({});
    });
  });

  describe('daysSince', () => {
    it('calcula días desde una fecha', () => {
      const days = daysSince(new Date(Date.now() - 2 * 86400000).toISOString());
      expect(days).toBe(2);
    });

    it('devuelve null sin fecha', () => {
      expect(daysSince(null)).toBeNull();
    });
  });
});
