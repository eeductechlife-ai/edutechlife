const { createFakeSupabase, installSupabaseSdkStub, freshRequire } = require('../helpers/fakeSupabase');

const stub = installSupabaseSdkStub();
const { checkAndUnlockBadges, getStudentBadges } = freshRequire('../../services/badgeEngine');

const badge = (id, key, criteria) => ({
  id,
  key,
  name: `Insignia ${key}`,
  icon: '🏅',
  criteria_json: criteria,
});

function setup({ catalog = [], mastery = [], streak = null, missions = [], unlocked = [], insertError = null } = {}) {
  return stub.use(
    createFakeSupabase({
      badges: { data: catalog, error: null },
      student_competency_mastery: { data: mastery, error: null },
      learning_streaks: { data: streak, error: null },
      student_missions: { data: missions, error: null },
      student_badges: (state) =>
        state.ops.some((o) => o[0] === 'insert')
          ? { data: null, error: insertError }
          : { data: unlocked, error: null },
    })
  );
}

describe('badgeEngine.checkAndUnlockBadges', () => {
  it('desbloquea la insignia de racha cuando la mejor racha alcanza el mínimo', async () => {
    const fake = setup({
      catalog: [badge('b1', 'racha_5', { streak_days: 5 })],
      streak: { current_streak: 1, best_streak: 6 },
    });
    const result = await checkAndUnlockBadges('stu-1');
    expect(result).toEqual([{ key: 'racha_5', name: 'Insignia racha_5', icon: '🏅' }]);
    const insert = fake.calls.find((c) => c.op === 'insert');
    expect(insert.table).toBe('student_badges');
    expect(insert.args[0]).toMatchObject({ student_id: 'stu-1', badge_id: 'b1' });
    expect(insert.args[0].evidence_json.checked_at).toBeTruthy();
  });

  it('no desbloquea si la racha no llega', async () => {
    setup({
      catalog: [badge('b1', 'racha_5', { streak_days: 5 })],
      streak: { current_streak: 2, best_streak: 4 },
    });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
  });

  it('sin datos de racha cuenta como 0', async () => {
    setup({ catalog: [badge('b1', 'racha_1', { streak_days: 1 })], streak: null });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
  });

  it('no repite una insignia que ya tiene', async () => {
    const fake = setup({
      catalog: [badge('b1', 'racha_5', { streak_days: 5 })],
      streak: { current_streak: 9, best_streak: 9 },
      unlocked: [{ badge_id: 'b1' }],
    });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
    expect(fake.calls.some((c) => c.op === 'insert')).toBe(false);
  });

  it('dominio por materia: promedia las competencias de esa materia', async () => {
    setup({
      catalog: [badge('b2', 'mate_experta', { subject: 'matematicas', min_mastery: 0.8 })],
      mastery: [
        { competency_id: 'co_matematicas_6_1', mastery_level: 0.9 },
        { competency_id: 'co_matematicas_6_2', mastery_level: 0.8 },
        { competency_id: 'co_lenguaje_6_1', mastery_level: 0.1 },
      ],
    });
    expect((await checkAndUnlockBadges('stu-1')).map((b) => b.key)).toEqual(['mate_experta']);
  });

  it('dominio por materia: sin competencias de esa materia no desbloquea', async () => {
    setup({
      catalog: [badge('b2', 'mate_experta', { subject: 'matematicas', min_mastery: 0.5 })],
      mastery: [{ competency_id: 'co_lenguaje_6_1', mastery_level: 1 }],
    });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
  });

  it('dominio por materia: promedio bajo no desbloquea', async () => {
    setup({
      catalog: [badge('b2', 'mate_experta', { subject: 'matematicas', min_mastery: 0.8 })],
      mastery: [{ competency_id: 'co_matematicas_6_1', mastery_level: 0.4 }],
    });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
  });

  it('actividad: cuenta las misiones completadas de ese tipo', async () => {
    const mission = (activity) => ({ completed: true, missions: { criteria_json: { activity } } });
    setup({
      catalog: [badge('b3', 'retos_3', { activity: 'reto', count: 3 })],
      missions: [mission('reto'), mission('reto'), mission('flashcards')],
    });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);

    setup({
      catalog: [badge('b3', 'retos_3', { activity: 'reto', count: 3 })],
      missions: [mission('reto'), mission('reto'), mission('reto')],
    });
    expect((await checkAndUnlockBadges('stu-1')).map((b) => b.key)).toEqual(['retos_3']);
  });

  it('actividades distintas: exige variedad', async () => {
    const mission = (activity) => ({ completed: true, missions: { criteria_json: { activity } } });
    setup({
      catalog: [badge('b4', 'explorador', { unique_activities: 3 })],
      missions: [mission('reto'), mission('reto'), mission('oral')],
    });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
    setup({
      catalog: [badge('b4', 'explorador', { unique_activities: 3 })],
      missions: [mission('reto'), mission('oral'), mission('flashcards')],
    });
    expect((await checkAndUnlockBadges('stu-1')).map((b) => b.key)).toEqual(['explorador']);
  });

  it('criterios vacíos o ausentes nunca desbloquean', async () => {
    setup({ catalog: [badge('b5', 'vacia', {}), { ...badge('b6', 'nula', null) }] });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
  });

  it('si el insert falla no se informa como desbloqueada', async () => {
    setup({
      catalog: [badge('b1', 'racha_5', { streak_days: 5 })],
      streak: { current_streak: 9, best_streak: 9 },
      insertError: { message: 'duplicate' },
    });
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
  });

  it('si fallan las lecturas del estudiante sigue con datos vacíos', async () => {
    stub.use(
      createFakeSupabase({
        badges: { data: [badge('b1', 'racha_5', { streak_days: 5 })], error: null },
        student_competency_mastery: new Error('db caída'),
        learning_streaks: new Error('db caída'),
        student_missions: new Error('db caída'),
        student_badges: new Error('db caída'),
      })
    );
    expect(await checkAndUnlockBadges('stu-1')).toEqual([]);
  });
});

describe('badgeEngine.getStudentBadges', () => {
  it('une el catálogo con lo desbloqueado y su fecha', async () => {
    stub.use(
      createFakeSupabase({
        badges: { data: [{ id: 'b1', key: 'a' }, { id: 'b2', key: 'b' }], error: null },
        student_badges: { data: [{ badge_id: 'b2', unlocked_at: '2026-10-01T10:00:00Z' }], error: null },
      })
    );
    const result = await getStudentBadges('stu-1');
    expect(result).toEqual([
      { id: 'b1', key: 'a', unlocked: false, unlockedAt: null },
      { id: 'b2', key: 'b', unlocked: true, unlockedAt: '2026-10-01T10:00:00Z' },
    ]);
  });

  it('si las consultas fallan devuelve una lista vacía', async () => {
    stub.use(createFakeSupabase({ badges: new Error('x'), student_badges: new Error('x') }));
    expect(await getStudentBadges('stu-1')).toEqual([]);
  });
});
