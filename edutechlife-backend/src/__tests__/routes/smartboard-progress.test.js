const express = require('express');
const request = require('supertest');
const { createFakeSupabase } = require('../helpers/fakeSupabase');

const authPath = require.resolve('../../middleware/auth');
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    requireAuth: (req, _res, next) => {
      if (req.headers['x-anon']) return next(); // sin userId: el handler decide
      req.userId = 'auth-1';
      next();
    },
  },
};
const dbPath = require.resolve('../../db/supabase');
let current = createFakeSupabase();
require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: { from: (...a) => current.from(...a) },
};
delete require.cache[require.resolve('../../routes/smartboard/progress')];
const router = require('../../routes/smartboard/progress');

const app = express();
app.use(express.json());
app.use('/api/ingenia', router);

const use = (handlers) => (current = createFakeSupabase(handlers));
const writes = (fake, op) => fake.calls.filter((c) => c.op === op);

beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => vi.restoreAllMocks());

describe('GET /student-progress', () => {
  it('devuelve el tiempo por materia y las sesiones guardadas', async () => {
    use({
      students: {
        data: { id: 's1', progress_json: { subjectTime: { matematicas: 120 }, sessions: [{ id: 1 }] } },
        error: null,
      },
    });
    const res = await request(app).get('/api/ingenia/student-progress');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ subjectTime: { matematicas: 120 }, sessions: [{ id: 1 }] });
  });

  it('sin progreso guardado devuelve estructuras vacías', async () => {
    use({ students: { data: { id: 's1', progress_json: null }, error: null } });
    const res = await request(app).get('/api/ingenia/student-progress');
    expect(res.body).toEqual({ subjectTime: {}, sessions: [] });
  });

  it('si el estudiante no existe lo crea con el nombre del perfil de usuario', async () => {
    const fake = use({
      students: { data: null, error: null },
      users: { data: { first_name: 'Ana', last_name: 'Pérez', email: 'ana@correo.co' }, error: null },
    });
    const res = await request(app).get('/api/ingenia/student-progress');
    expect(res.body).toEqual({ subjectTime: {}, sessions: [] });
    expect(writes(fake, 'insert')[0].args[0]).toEqual([
      { auth_id: 'auth-1', name: 'Ana Pérez', age: 12, email: 'ana@correo.co' },
    ]);
  });

  it('sin nombre usa el usuario, el correo o «Estudiante»', async () => {
    let fake = use({ students: { data: null, error: null }, users: { data: { username: 'ana_p', email: 'a@b.co' }, error: null } });
    await request(app).get('/api/ingenia/student-progress');
    expect(writes(fake, 'insert')[0].args[0][0].name).toBe('ana_p');

    fake = use({ students: { data: null, error: null }, users: { data: { email: 'ana@correo.co' }, error: null } });
    await request(app).get('/api/ingenia/student-progress');
    expect(writes(fake, 'insert')[0].args[0][0].name).toBe('ana');

    fake = use({ students: { data: null, error: null }, users: { data: null, error: null } });
    await request(app).get('/api/ingenia/student-progress');
    expect(writes(fake, 'insert')[0].args[0][0].name).toBe('Estudiante');
  });

  it('sin sesión responde 401 y ante un fallo interno 500', async () => {
    use({});
    expect((await request(app).get('/api/ingenia/student-progress').set('x-anon', '1')).status).toBe(401);
    use({ students: new Error('db caída') });
    const res = await request(app).get('/api/ingenia/student-progress');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error interno' });
  });
});

// El guardado actualiza directamente por auth_id (una sola escritura); solo si no había
// fila la crea ya con el dato. Estas respuestas simulan ambos casos.
const updateOnly = (rows) => (state) =>
  state.ops.some((o) => o[0] === 'update')
    ? { data: rows, error: null }
    : { data: null, error: null };
const updateThenCreate = (created) => (state) => {
  if (state.ops.some((o) => o[0] === 'update')) return { data: [], error: null };
  if (state.ops.some((o) => o[0] === 'insert')) return created;
  return { data: null, error: null };
};

describe('POST /student-progress', () => {
  it('guarda el progreso con una sola escritura cuando el estudiante existe', async () => {
    const fake = use({ students: updateOnly([{ id: 's1' }]) });
    const res = await request(app)
      .post('/api/ingenia/student-progress')
      .send({ subjectTime: { lenguaje: 30 }, sessions: [{ id: 2 }] });
    expect(res.body).toEqual({ success: true });
    const update = writes(fake, 'update')[0];
    expect(update.args[0]).toEqual({ progress_json: { subjectTime: { lenguaje: 30 }, sessions: [{ id: 2 }] } });
    expect(writes(fake, 'insert')).toHaveLength(0);
    expect(fake.calls).toHaveLength(1); // antes: consulta + (inserción) + actualización
  });

  it('crea al estudiante con el progreso ya incluido si no existía', async () => {
    const fake = use({ students: updateThenCreate({ data: { id: 'nuevo' }, error: null }) });
    const res = await request(app)
      .post('/api/ingenia/student-progress')
      .send({ subjectTime: { a: 1 }, sessions: [] });
    expect(res.status).toBe(200);
    expect(writes(fake, 'insert')[0].args[0]).toEqual([
      { auth_id: 'auth-1', name: 'Estudiante', age: 12, progress_json: { subjectTime: { a: 1 }, sessions: [] } },
    ]);
  });

  it('si no puede crear el perfil responde 500', async () => {
    use({ students: updateThenCreate({ data: null, error: { message: 'x' } }) });
    const res = await request(app).post('/api/ingenia/student-progress').send({});
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Could not create student profile');
  });

  it('si falla la escritura devuelve el mensaje; sin sesión, 401; si lanza, 500 genérico', async () => {
    use({ students: (state) => (state.ops.some((o) => o[0] === 'update') ? { data: null, error: { message: 'RLS' } } : { data: null, error: null }) });
    const res = await request(app).post('/api/ingenia/student-progress').send({});
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('RLS');
    expect((await request(app).post('/api/ingenia/student-progress').set('x-anon', '1').send({})).status).toBe(401);

    use({ students: new Error('db caída') });
    const boom = await request(app).post('/api/ingenia/student-progress').send({});
    expect(boom.status).toBe(500);
    expect(boom.body).toEqual({ error: 'Error interno' });
  });
});

describe('GET/POST /student-grades', () => {
  it('lee las notas guardadas', async () => {
    use({ students: { data: { id: 's1', grades_json: [{ subject: 'matematicas', p1: 4 }] }, error: null } });
    const res = await request(app).get('/api/ingenia/student-grades');
    expect(res.body).toEqual({ grades: [{ subject: 'matematicas', p1: 4 }] });
  });

  it('sin notas guardadas devuelve una lista vacía', async () => {
    use({ students: { data: { id: 's1', grades_json: null }, error: null } });
    expect((await request(app).get('/api/ingenia/student-grades')).body).toEqual({ grades: [] });
  });

  it('si el estudiante no existe lo crea y devuelve sus notas vacías', async () => {
    const fake = use({
      students: (state) =>
        state.ops.some((o) => o[0] === 'insert') ? { data: { id: 'n', grades_json: null }, error: null } : { data: null, error: null },
      users: { data: { first_name: 'Luis', email: 'l@x.co' }, error: null },
    });
    const res = await request(app).get('/api/ingenia/student-grades');
    expect(res.body).toEqual({ grades: [] });
    expect(writes(fake, 'insert')[0].args[0][0]).toMatchObject({ name: 'Luis', age: 12 });
  });

  it('si la creación falla (que no sea duplicado) responde 500; un duplicado se tolera', async () => {
    use({
      students: (state) => (state.ops.some((o) => o[0] === 'insert') ? { data: null, error: { message: 'permiso denegado' } } : { data: null, error: null }),
      users: { data: null, error: null },
    });
    expect((await request(app).get('/api/ingenia/student-grades')).status).toBe(500);

    use({
      students: (state) =>
        state.ops.some((o) => o[0] === 'insert')
          ? { data: null, error: { message: 'duplicate key' } }
          : { data: null, error: null },
      users: { data: null, error: null },
    });
    expect((await request(app).get('/api/ingenia/student-grades')).status).toBe(200);
  });

  it('POST guarda la lista con una sola escritura, rechaza lo que no es una lista y exige sesión', async () => {
    const fake = use({ students: updateOnly([{ id: 's1' }]) });
    const grades = [{ subject: 'ingles', p1: 3.5 }];
    const ok = await request(app).post('/api/ingenia/student-grades').send({ grades });
    expect(ok.body).toEqual({ success: true, grades });
    expect(writes(fake, 'update')[0].args[0]).toEqual({ grades_json: grades });
    expect(fake.calls).toHaveLength(1);

    expect((await request(app).post('/api/ingenia/student-grades').send({ grades: 'x' })).status).toBe(400);
    expect((await request(app).post('/api/ingenia/student-grades').set('x-anon', '1').send({ grades })).status).toBe(401);
  });

  it('POST crea al estudiante con las notas incluidas si no existía', async () => {
    const fake = use({ students: updateThenCreate({ data: { id: 'n' }, error: null }) });
    const grades = [{ subject: 'arte', p1: 4 }];
    const res = await request(app).post('/api/ingenia/student-grades').send({ grades });
    expect(res.status).toBe(200);
    expect(writes(fake, 'insert')[0].args[0][0]).toMatchObject({ auth_id: 'auth-1', grades_json: grades });
  });

  it('POST: si falla la escritura devuelve 500 con el motivo', async () => {
    use({ students: (state) => (state.ops.some((o) => o[0] === 'update') ? { data: null, error: { message: 'x' } } : { data: null, error: null }) });
    const res = await request(app).post('/api/ingenia/student-grades').send({ grades: [] });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('x');
  });
});

describe('plan de mejora /improvement-plan', () => {
  const plan = { weeks: [{ week: 1, activities: [] }], currentFocus: 'matematicas' };

  it('GET devuelve el plan activo y el foco', async () => {
    use({
      students: { data: { id: 's1' }, error: null },
      learning_plans: { data: { plan_json: plan }, error: null },
    });
    const res = await request(app).get('/api/ingenia/improvement-plan');
    expect(res.body).toEqual({ plan, needsDiagnostic: false, currentFocus: 'matematicas' });
  });

  it('GET sin plan pide el diagnóstico; sin estudiante también', async () => {
    use({ students: { data: { id: 's1' }, error: null }, learning_plans: { data: null, error: null } });
    expect((await request(app).get('/api/ingenia/improvement-plan')).body).toEqual({
      plan: null,
      needsDiagnostic: true,
      currentFocus: null,
    });
    use({ students: { data: null, error: null } });
    expect((await request(app).get('/api/ingenia/improvement-plan')).body.needsDiagnostic).toBe(true);
  });

  it('GET tolera que la tabla aún no exista y falla ante otros errores', async () => {
    use({ students: { data: { id: 's1' }, error: null }, learning_plans: { data: null, error: { code: '42P01', message: 'x' } } });
    expect((await request(app).get('/api/ingenia/improvement-plan')).status).toBe(200);
    use({ students: { data: { id: 's1' }, error: null }, learning_plans: { data: null, error: { code: '500', message: 'x' } } });
    expect((await request(app).get('/api/ingenia/improvement-plan')).status).toBe(500);
  });

  it('PUT desactiva los planes anteriores y guarda el nuevo como activo', async () => {
    const fake = use({ students: { data: { id: 's1' }, error: null }, learning_plans: { data: null, error: null } });
    const res = await request(app).put('/api/ingenia/improvement-plan').send({ plan });
    expect(res.body).toEqual({ ok: true });
    const order = fake.calls.filter((c) => c.table === 'learning_plans').map((c) => c.op);
    expect(order).toEqual(['update', 'insert']);
    expect(writes(fake, 'update')[0].args[0]).toEqual({ is_active: false });
    expect(writes(fake, 'insert')[0].args[0]).toEqual({ student_id: 's1', type: 'monthly', plan_json: plan, is_active: true });
  });

  it('PUT valida el plan, exige estudiante y avisa si falla guardar', async () => {
    use({ students: { data: { id: 's1' }, error: null } });
    expect((await request(app).put('/api/ingenia/improvement-plan').send({ plan: {} })).status).toBe(400);

    use({ students: { data: null, error: null } });
    expect((await request(app).put('/api/ingenia/improvement-plan').send({ plan })).status).toBe(404);

    use({
      students: { data: { id: 's1' }, error: null },
      learning_plans: (state) => (state.ops.some((o) => o[0] === 'insert') ? { data: null, error: { message: 'x' } } : { data: null, error: null }),
    });
    expect((await request(app).put('/api/ingenia/improvement-plan').send({ plan })).status).toBe(500);
  });
});
