const { createFakeSupabase, installSupabaseSdkStub, freshRequire } = require('../helpers/fakeSupabase');

const stub = installSupabaseSdkStub();
const { runAllDetectors, resolveWarning } = freshRequire('../../services/earlyWarning');

const NOW = new Date('2026-10-08T12:00:00Z');
const daysAgo = (n) => new Date(NOW.getTime() - n * 86400000).toISOString();

/** Responde cada tabla; las que no se pasan devuelven vacío. */
function setup({ streak = null, mastery = [], sessions = [], active = [], sessionsError = null } = {}) {
  return stub.use(
    createFakeSupabase({
      learning_streaks: { data: streak, error: null },
      student_competency_mastery: { data: mastery, error: null },
      sessions: { data: sessionsError ? null : sessions, error: sessionsError },
      early_warnings: (state) => (state.ops.some((o) => ['insert', 'update'].includes(o[0])) ? { data: null, error: null } : { data: active, error: null }),
    })
  );
}
const inserted = (fake) => fake.calls.filter((c) => c.op === 'insert').map((c) => c.args[0]);
const byType = (fake, type) => inserted(fake).find((w) => w.type === type);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => vi.useRealTimers());

describe('earlyWarning: inactividad', () => {
  it('avisa con severidad media entre 3 y 6 días y alta desde 7', async () => {
    let fake = setup({ streak: { last_activity_date: daysAgo(4), current_streak: 1 } });
    await runAllDetectors('s1');
    expect(byType(fake, 'inactivity')).toMatchObject({ severity: 'medium', student_id: 's1' });
    expect(byType(fake, 'inactivity').evidence_json.days_inactive).toBe(4);

    fake = setup({ streak: { last_activity_date: daysAgo(9), current_streak: 0 } });
    await runAllDetectors('s1');
    expect(byType(fake, 'inactivity').severity).toBe('high');
  });

  it('no avisa con actividad reciente, sin fecha o sin registro', async () => {
    for (const streak of [{ last_activity_date: daysAgo(1) }, { last_activity_date: null }, null]) {
      const fake = setup({ streak });
      await runAllDetectors('s1');
      expect(byType(fake, 'inactivity')).toBeUndefined();
    }
  });
});

describe('earlyWarning: caída de rendimiento', () => {
  const row = (level, ago) => ({ competency_id: 'co_matematicas_6_1', mastery_level: level, updated_at: daysAgo(ago), practice_count: 1 });

  it('compara esta semana con la anterior y marca alta si cae 35 puntos o más', async () => {
    const fake = setup({ mastery: [row(0.3, 1), row(0.3, 2), row(0.9, 10), row(0.8, 12)] });
    await runAllDetectors('s1');
    const warning = byType(fake, 'performance_drop');
    expect(warning.severity).toBe('high');
    expect(warning.evidence_json).toEqual({ avg_this_week: 30, avg_last_week: 85, drop_percent: 55 });
  });

  it('una caída de 20 a 34 puntos es media', async () => {
    const fake = setup({ mastery: [row(0.55, 1), row(0.8, 10)] });
    await runAllDetectors('s1');
    expect(byType(fake, 'performance_drop').severity).toBe('medium');
  });

  it('no avisa con una caída pequeña ni sin datos de las dos semanas', async () => {
    let fake = setup({ mastery: [row(0.7, 1), row(0.8, 10)] });
    await runAllDetectors('s1');
    expect(byType(fake, 'performance_drop')).toBeUndefined();

    fake = setup({ mastery: [row(0.1, 1), row(0.2, 2)] });
    await runAllDetectors('s1');
    expect(byType(fake, 'performance_drop')).toBeUndefined();

    fake = setup({ mastery: [] });
    await runAllDetectors('s1');
    expect(inserted(fake)).toEqual([]);
  });
});

describe('earlyWarning: errores repetidos', () => {
  const stuck = (id, level = 0.1, count = 4) => ({ competency_id: id, mastery_level: level, practice_count: count, updated_at: daysAgo(1) });

  it('detecta competencias bloqueadas y nombra las materias', async () => {
    const fake = setup({
      mastery: [stuck('co_matematicas_6_1'), stuck('co_matematicas_6_2'), stuck('co_lenguaje_6_1'), stuck('co_ciencias_6_1')],
    });
    await runAllDetectors('s1');
    const warning = byType(fake, 'repeated_errors');
    expect(warning.severity).toBe('high');
    expect(warning.evidence_json.stuck_competencies).toBe(4);
    expect(warning.evidence_json.subjects).toEqual(['matematicas', 'lenguaje', 'ciencias']);
    expect(warning.recommendation).toContain('4 competencias');
  });

  it('con una o dos es media; con pocos intentos o buen dominio no avisa', async () => {
    let fake = setup({ mastery: [stuck('co_matematicas_6_1')] });
    await runAllDetectors('s1');
    expect(byType(fake, 'repeated_errors').severity).toBe('medium');

    fake = setup({ mastery: [stuck('co_matematicas_6_1', 0.1, 2), stuck('co_lenguaje_6_1', 0.6, 9)] });
    await runAllDetectors('s1');
    expect(byType(fake, 'repeated_errors')).toBeUndefined();
  });
});

describe('earlyWarning: baja finalización', () => {
  const sessions = (pcts) => pcts.map((p) => ({ completion_percentage: p }));

  it('promedio bajo 40 % avisa, y bajo 20 % es alto', async () => {
    let fake = setup({ sessions: sessions([30, 30, 30, 30]) });
    await runAllDetectors('s1');
    expect(byType(fake, 'low_completion')).toMatchObject({ severity: 'medium' });
    expect(byType(fake, 'low_completion').evidence_json).toEqual({ avg_completion: 30, sessions_checked: 4 });

    fake = setup({ sessions: sessions([10, 10, 10]) });
    await runAllDetectors('s1');
    expect(byType(fake, 'low_completion').severity).toBe('high');
  });

  it('no avisa con buen promedio, con menos de 3 sesiones o si la tabla no existe', async () => {
    let fake = setup({ sessions: sessions([80, 90, 70]) });
    await runAllDetectors('s1');
    expect(byType(fake, 'low_completion')).toBeUndefined();

    fake = setup({ sessions: sessions([5, 5]) });
    await runAllDetectors('s1');
    expect(byType(fake, 'low_completion')).toBeUndefined();

    fake = setup({ sessionsError: { code: '42P01', message: 'no existe' } });
    await runAllDetectors('s1');
    expect(byType(fake, 'low_completion')).toBeUndefined();
  });
});

describe('earlyWarning: racha rota', () => {
  it('avisa cuando hay historial y la racha actual es 0', async () => {
    const fake = setup({ streak: { last_activity_date: daysAgo(0), current_streak: 0, best_streak: 6, total_days_active: 12 } });
    await runAllDetectors('s1');
    const warning = byType(fake, 'streak_breaks');
    expect(warning).toMatchObject({ severity: 'low' });
    expect(warning.recommendation).toContain('retomar el ritmo');

    const fresh = setup({ streak: { last_activity_date: daysAgo(0), current_streak: 0, best_streak: 4, total_days_active: 6 } });
    await runAllDetectors('s1');
    expect(byType(fresh, 'streak_breaks').recommendation).toContain('empezar una nueva racha');
  });

  it('no avisa con poco historial o con la racha viva', async () => {
    for (const streak of [
      { last_activity_date: daysAgo(0), current_streak: 0, best_streak: 6, total_days_active: 3 },
      { last_activity_date: daysAgo(0), current_streak: 4, best_streak: 6, total_days_active: 12 },
    ]) {
      const fake = setup({ streak });
      await runAllDetectors('s1');
      expect(byType(fake, 'streak_breaks')).toBeUndefined();
    }
  });
});

describe('earlyWarning: persistencia', () => {
  it('antes de guardar una alerta cierra la anterior del mismo tipo (una activa por tipo)', async () => {
    const fake = setup({ streak: { last_activity_date: daysAgo(8), current_streak: 0 } });
    await runAllDetectors('s1');
    const resolve = fake.calls.find((c) => c.op === 'update');
    expect(resolve.table).toBe('early_warnings');
    expect(resolve.args[0].resolved_at).toBe(NOW.toISOString());
    const order = fake.calls.map((c) => c.op);
    expect(order.indexOf('update')).toBeLessThan(order.indexOf('insert'));
  });

  it('devuelve las alertas activas ya guardadas', async () => {
    const active = [{ id: 'w1', type: 'inactivity', severity: 'high' }];
    setup({ active });
    expect(await runAllDetectors('s1')).toEqual(active);
  });

  it('un detector que falla no impide los demás ni rompe la consulta', async () => {
    const fake = stub.use(
      createFakeSupabase({
        learning_streaks: new Error('caído'),
        student_competency_mastery: { data: [], error: null },
        sessions: { data: [{ completion_percentage: 5 }, { completion_percentage: 5 }, { completion_percentage: 5 }], error: null },
        early_warnings: { data: [], error: null },
      })
    );
    await runAllDetectors('s1');
    expect(byType(fake, 'low_completion')).toBeTruthy();
  });

  it('si el insert falla lo registra pero no lanza', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    stub.use(
      createFakeSupabase({
        learning_streaks: { data: { last_activity_date: daysAgo(8), current_streak: 0 }, error: null },
        student_competency_mastery: { data: [], error: null },
        sessions: { data: [], error: null },
        early_warnings: (state) =>
          state.ops.some((o) => o[0] === 'insert') ? { data: null, error: { message: 'duplicado' } } : { data: [], error: null },
      })
    );
    await expect(runAllDetectors('s1')).resolves.toEqual([]);
    expect(err).toHaveBeenCalledWith(expect.stringContaining('Insert failed for inactivity'), 'duplicado');
    err.mockRestore();
  });

  it('resolveWarning marca la alerta como resuelta ahora', async () => {
    const fake = setup();
    await resolveWarning('w9');
    const update = fake.calls.find((c) => c.op === 'update');
    expect(update.args[0]).toEqual({ resolved_at: NOW.toISOString() });
  });
});
