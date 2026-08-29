/**
 * B.10 — Golden Data Flow: la cadena student → activity → mastery →
 * recommendation → plan → Dani → parent usa la MISMA fuente de verdad en cada
 * paso (mismas tablas/columnas entre escritor y lectores).
 *
 * Estático + contrato: verifica consistencia cross-archivo. El flujo vivo E2E
 * requiere entorno staging (FASE C/E) y no es ejecutable en unit tests.
 */
const fs = require('fs');
const path = require('path');

const BACKEND_ROOT = path.resolve(__dirname, '..', '..', '..');
const FRONTEND_ROOT = path.resolve(BACKEND_ROOT, '..', 'edutechlife-frontend');

const src = (rel) => fs.readFileSync(path.join(BACKEND_ROOT, rel), 'utf8');
const fe = (rel) => fs.readFileSync(path.join(FRONTEND_ROOT, rel), 'utf8');

describe('golden data flow — una sola fuente de verdad (B.10)', () => {
  test('MASTERY: escritor y lectores usan student_competency_mastery.mastery_level', () => {
    const writer = src('src/services/competencyMastery.js');
    const readers = [
      'src/services/daniOrchestrator.js',
      'src/services/parentInsights.js',
      'src/services/earlyWarning.js',
      'src/services/badgeEngine.js',
      'src/services/adaptiveLearning.js',
    ];
    expect(writer).toContain('from("student_competency_mastery")');
    expect(writer).toContain('mastery_level');
    for (const r of readers) {
      const file = src(r);
      expect(file, `${r} debe leer student_competency_mastery`).toContain('from("student_competency_mastery")');
      expect(file, `${r} debe leer mastery_level`).toContain('mastery_level');
    }
    // Las rutas delegan en el servicio (getStudentMastery), no en el cliente directo.
    expect(src('src/routes/smartboard.js')).toContain('getStudentMastery');
  });

  test('PLAN: escritor y lectores usan learning_plans.plan_json', () => {
    const writer = src('src/services/adaptiveLearning.js');
    const readers = ['src/services/daniOrchestrator.js', 'src/services/parentInsights.js'];
    expect(writer).toContain('from("learning_plans")');
    expect(writer).toContain('plan_json');
    for (const r of readers) {
      const file = src(r);
      expect(file, `${r} debe leer learning_plans`).toContain('from("learning_plans")');
      expect(file, `${r} debe leer plan_json`).toContain('plan_json');
    }
  });

  test('MEMORIA DANI: escritor frontend y lectores backend usan dani_memory tipada', () => {
    // Frontend escribe a columnas tipadas
    const feWriter = fe('src/hooks/useDaniMemory.js');
    expect(feWriter).toContain('dani_memory');
    expect(feWriter).toContain('communication_style');
    expect(feWriter).toContain('strengths');
    expect(feWriter).toContain('interests');
    // Backend lee las mismas columnas tipadas
    for (const r of ['src/services/daniOrchestrator.js', 'src/services/parentInsights.js']) {
      const file = src(r);
      expect(file).toContain('from("dani_memory")');
      expect(file).toContain('communication_style');
      expect(file).toContain('interests');
    }
  });

  test('SCHEDULE: Dani lee timetable_slots con day_of_week', () => {
    const dani = src('src/services/daniOrchestrator.js');
    expect(dani).toContain('from("timetable_slots")');
    expect(dani).toContain('day_of_week');
    expect(dani).not.toContain('schedule_slots');
  });

  test('RECOMMENDATION: engine lee learning_content y escribe recommendations', () => {
    const engine = src('src/services/adaptiveLearning.js');
    expect(engine).toContain('from("learning_content")');
    expect(engine).toContain('from("recommendations")');
  });

  test('SESSIONS: adaptive y parent insights leen la tabla sessions (no activity_sessions)', () => {
    expect(src('src/services/adaptiveLearning.js')).toContain('from("sessions")');
    expect(src('src/services/parentInsights.js')).toContain('from("sessions")');
  });

  test('AUTH: sin sb_auth_token en frontend crítico', () => {
    const files = [
      'src/hooks/useAdaptiveEngine.js',
      'src/hooks/useCompetencyTracking.js',
      'src/context/useSmartBoardActions.js',
      'src/context/SmartBoardKidsContext.jsx',
    ];
    for (const f of files) {
      expect(fe(f)).not.toContain('sb_auth_token');
    }
  });
});
