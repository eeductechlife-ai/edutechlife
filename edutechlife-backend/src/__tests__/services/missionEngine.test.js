const { createFakeSupabase, hasOp, installSupabaseSdkStub, freshRequire } = require('../helpers/fakeSupabase');

const stub = installSupabaseSdkStub();
const { getStudentMissions, recordActivity } = freshRequire('../../services/missionEngine');

const row = (id, type, extra = {}) => ({
  id,
  progress: 0,
  target: 3,
  completed: false,
  expires_at: null,
  missions: {
    key: `m_${id}`,
    type,
    title: `Misión ${id}`,
    description: 'desc',
    icon: '🎯',
    xp_reward: 20,
    criteria_json: { activity: 'reto', count: 3 },
  },
  ...extra,
});

describe('missionEngine.getStudentMissions', () => {
  it('con dos o más misiones activas las devuelve formateadas sin sembrar nada', async () => {
    const fake = stub.use(
      createFakeSupabase({
        student_missions: { data: [row('1', 'daily'), row('2', 'weekly')], error: null },
      })
    );
    const missions = await getStudentMissions('stu-1');
    expect(missions).toHaveLength(2);
    expect(missions[0]).toEqual({
      id: '1',
      key: 'm_1',
      type: 'daily',
      title: 'Misión 1',
      description: 'desc',
      icon: '🎯',
      xpReward: 20,
      progress: 0,
      target: 3,
      completed: false,
      expiresAt: null,
    });
    expect(fake.calls.some((c) => c.op === 'upsert')).toBe(false);
  });

  it('con pocas misiones siembra del catálogo una diaria y una semanal', async () => {
    let seeded = false;
    const fake = stub.use(
      createFakeSupabase({
        student_missions: (state) => {
          if (state.ops.some((o) => o[0] === 'upsert')) {
            seeded = true;
            return { data: null, error: null };
          }
          return { data: seeded ? [row('1', 'daily'), row('2', 'weekly')] : [], error: null };
        },
        missions: (state) => {
          const type = state.ops.find((o) => o[0] === 'eq' && o[1] === 'type')[2];
          return { data: { id: `cat_${type}`, xp_reward: 10, criteria_json: { count: 4 } }, error: null };
        },
      })
    );
    const missions = await getStudentMissions('stu-1');
    const upserts = fake.calls.filter((c) => c.op === 'upsert');
    expect(upserts.map((u) => u.args[0].mission_id)).toEqual(['cat_daily', 'cat_weekly']);
    expect(upserts[0].args[0]).toMatchObject({ student_id: 'stu-1', progress: 0, target: 4, completed: false });
    expect(upserts[0].args[1]).toEqual({ onConflict: 'student_id,mission_id' });
    // La diaria vence a fin de día; la semanal, más adelante.
    expect(new Date(upserts[0].args[0].expires_at).getTime()).toBeLessThan(
      new Date(upserts[1].args[0].expires_at).getTime() + 1
    );
    expect(missions).toHaveLength(2);
  });

  it('con una diaria ya asignada siembra la semanal y una de exploración (sin vencimiento)', async () => {
    const fake = stub.use(
      createFakeSupabase({
        student_missions: { data: [row('1', 'daily')], error: null },
        missions: { data: { id: 'cat_x', xp_reward: 5, criteria_json: {} }, error: null },
      })
    );
    await getStudentMissions('stu-1');
    const upserts = fake.calls.filter((c) => c.op === 'upsert');
    expect(upserts).toHaveLength(2);
    expect(upserts[0].args[0].target).toBe(1); // sin criteria.count → 1
    expect(upserts[0].args[0].expires_at).toBeTruthy(); // semanal
    expect(upserts[1].args[0].expires_at).toBeNull(); // exploración
  });

  it('si el catálogo no tiene la misión no inventa filas', async () => {
    const fake = stub.use(
      createFakeSupabase({
        student_missions: { data: [], error: null },
        missions: { data: null, error: null },
      })
    );
    expect(await getStudentMissions('stu-1')).toEqual([]);
    expect(fake.calls.some((c) => c.op === 'upsert')).toBe(false);
  });

  it('tolera una respuesta vacía del servidor', async () => {
    stub.use(createFakeSupabase({ student_missions: { data: null, error: null } }));
    expect(await getStudentMissions('stu-1')).toEqual([]);
  });
});

describe('missionEngine.recordActivity', () => {
  const active = (id, activity, progress = 0, target = 2) => ({
    id,
    progress,
    target,
    missions: { type: 'daily', criteria_json: activity === undefined ? {} : { activity } },
  });

  it('avanza solo las misiones que coinciden con la actividad', async () => {
    const fake = stub.use(
      createFakeSupabase({
        student_missions: (state) =>
          state.ops.some((o) => o[0] === 'update')
            ? { data: null, error: null }
            : { data: [active('a', 'reto'), active('b', 'oral'), active('c', 'any'), active('d')], error: null },
      })
    );
    await recordActivity('stu-1', 'reto');
    const updates = fake.calls.filter((c) => c.op === 'update');
    // a (reto), c (any) y d (sin actividad definida) avanzan; b (oral) no.
    expect(updates).toHaveLength(3);
    for (const u of updates) expect(u.args[0].progress).toBe(1);
    expect(updates.every((u) => u.args[0].completed === false)).toBe(true);
  });

  it('al llegar al objetivo marca la misión como completada con su fecha', async () => {
    const fake = stub.use(
      createFakeSupabase({
        student_missions: (state) =>
          state.ops.some((o) => o[0] === 'update')
            ? { data: null, error: null }
            : { data: [active('a', 'reto', 1, 2)], error: null },
      })
    );
    await recordActivity('stu-1', 'reto');
    const update = fake.calls.find((c) => c.op === 'update');
    expect(update.args[0]).toMatchObject({ progress: 2, completed: true });
    expect(update.args[0].completed_at).toBeTruthy();
  });

  it('nunca pasa del objetivo', async () => {
    const fake = stub.use(
      createFakeSupabase({
        student_missions: (state) =>
          state.ops.some((o) => o[0] === 'update')
            ? { data: null, error: null }
            : { data: [active('a', 'reto', 2, 2)], error: null },
      })
    );
    await recordActivity('stu-1', 'reto');
    expect(fake.calls.find((c) => c.op === 'update').args[0].progress).toBe(2);
  });

  it('sin misiones activas no hace nada', async () => {
    const fake = stub.use(createFakeSupabase({ student_missions: { data: null, error: null } }));
    await expect(recordActivity('stu-1', 'reto')).resolves.toBeUndefined();
    expect(fake.calls).toEqual([]);
  });
});
