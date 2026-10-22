// Vitest globals (describe/it/expect/vi/beforeEach) — vitest.config usa globals: true
// Activación única de la cuenta del niño por su adulto (decisión del CEO 2026-10-15).

const { createFakeSupabase, hasOp } = require('../helpers/fakeSupabase');

const supabasePath = require.resolve('../../db/supabase');
let fake;
const updateUserById = vi.fn().mockResolvedValue({ data: {}, error: null });
const mockSupabase = {
  from: (...a) => fake.from(...a),
  auth: { admin: { updateUserById } },
};
delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };

const { requireAdultoActivado, requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');

const NINO = 'a0000000-0000-4000-8000-000000000001';
const PADRE = 'b0000000-0000-4000-8000-000000000002';

/** Tablas por defecto: niño de IngenIA de 10 años, sin adulto. */
function base(sobre = {}) {
  return {
    activaciones_adulto_menor: { data: null, error: null },
    users: { data: { user_type: 'student', account_type: 'smartboard' }, error: null },
    students: { data: { age: 10 }, error: null },
    parent_student_links: { data: [], error: null },
    parent_consents: { data: [], error: null },
    ...sobre,
  };
}

async function correr(req = {}) {
  const r = { userId: NINO, userAppMetadata: {}, ...req };
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
  const next = vi.fn();
  await requireAdultoActivado(r, res, next);
  return { res, next };
}

function bloqueado({ res, next }) {
  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json.mock.calls[0][0]).toMatchObject({ code: 'ADULTO_PENDIENTE' });
}

beforeEach(() => {
  updateUserById.mockClear();
  fake = createFakeSupabase(base());
  process.env.ADULTO_OBLIGATORIO = 'true';
});

afterAll(() => {
  delete process.env.ADULTO_OBLIGATORIO;
});

describe('requireAdultoActivado', () => {
  it('con la bandera apagada no consulta nada y deja pasar', async () => {
    process.env.ADULTO_OBLIGATORIO = 'false';
    const { next, res } = await correr();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(fake.calls).toHaveLength(0);
  });

  it('niño de IngenIA sin activar → 403 ADULTO_PENDIENTE con mensaje para niños', async () => {
    const r = await correr();
    bloqueado(r);
    expect(r.res.json.mock.calls[0][0].error).toMatch(/mamá, papá o acudiente/);
  });

  it('niño sin edad registrada también queda en modo restringido', async () => {
    fake = createFakeSupabase(base({ students: { data: null, error: null } }));
    bloqueado(await correr());
  });

  it('niño activado en la sesión → pasa sin ninguna consulta extra', async () => {
    fake = createFakeSupabase({}); // cualquier consulta fallaría la prueba de abajo
    const from = vi.spyOn(fake, 'from');
    const { next } = await correr({ userAppMetadata: { ingenia_adulto_activado_at: '2026-10-20T10:00:00Z' } });
    expect(next).toHaveBeenCalled();
    expect(from).not.toHaveBeenCalled();
  });

  it('niño activado nunca se bloquea aunque la base falle', async () => {
    fake = createFakeSupabase({ users: new Error('ECONNRESET') });
    const { next } = await correr({ userAppMetadata: { ingenia_adulto_activado_at: '2026-10-20T10:00:00Z' } });
    expect(next).toHaveBeenCalled();
  });

  it('fila de activación sin marca en sesión → pasa y copia la marca a app_metadata', async () => {
    fake = createFakeSupabase(base({ activaciones_adulto_menor: { data: { estudiante_id: NINO }, error: null } }));
    const { next } = await correr();
    expect(next).toHaveBeenCalled();
    expect(updateUserById).toHaveBeenCalledWith(NINO, {
      app_metadata: { ingenia_adulto_activado_at: expect.any(String) },
    });
  });

  it('un fallo pasajero de la consulta no bloquea (deja pasar y registra)', async () => {
    fake = createFakeSupabase(base({ activaciones_adulto_menor: new Error('timeout') }));
    const { next, res } = await correr();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('estudiante existente con vínculo activo cuenta como activado y queda registrado', async () => {
    fake = createFakeSupabase(base({
      parent_student_links: (q) => (hasOp(q, 'eq', 'student_user_id', NINO)
        ? { data: [{ parent_user_id: PADRE }], error: null }
        : { data: [], error: null }),
    }));
    const { next } = await correr();
    expect(next).toHaveBeenCalled();
    const escritura = fake.calls.find((c) => c.table === 'activaciones_adulto_menor' && c.op === 'upsert');
    expect(escritura.args[0]).toMatchObject({ estudiante_id: NINO, adulto_id: PADRE, metodo: 'vinculo_existente' });
    expect(escritura.args[1]).toMatchObject({ onConflict: 'estudiante_id', ignoreDuplicates: true });
  });

  it('estudiante existente con consentimiento verificado cuenta como activado', async () => {
    fake = createFakeSupabase(base({
      parent_consents: { data: [{ parent_email: 'Mama@Ejemplo.com' }], error: null },
    }));
    const { next } = await correr();
    expect(next).toHaveBeenCalled();
    const escritura = fake.calls.find((c) => c.table === 'activaciones_adulto_menor');
    expect(escritura.args[0]).toMatchObject({ metodo: 'consentimiento_existente', adulto_email: 'mama@ejemplo.com' });
  });

  it('si no se puede guardar la activación de un vínculo existente, igual deja pasar', async () => {
    fake = createFakeSupabase(base({
      activaciones_adulto_menor: (q) => (q.ops.some((o) => o[0] === 'upsert')
        ? { data: null, error: { message: 'falla' } }
        : { data: null, error: null }),
      parent_student_links: (q) => (hasOp(q, 'eq', 'student_user_id', NINO)
        ? { data: [{ parent_user_id: PADRE }], error: null }
        : { data: [], error: null }),
    }));
    const { next } = await correr();
    expect(next).toHaveBeenCalled();
  });

  it('padre (user_type parent) está exento', async () => {
    fake = createFakeSupabase(base({ users: { data: { user_type: 'parent', account_type: 'smartboard' }, error: null } }));
    expect((await correr()).next).toHaveBeenCalled();
  });

  it('cuenta con hijo vinculado (padre de alias antiguo) está exenta', async () => {
    fake = createFakeSupabase(base({
      users: { data: { user_type: 'student', account_type: 'ialab' }, error: null },
      parent_student_links: (q) => (hasOp(q, 'eq', 'parent_user_id', NINO)
        ? { data: [{ student_user_id: 'otro' }], error: null }
        : { data: [], error: null }),
    }));
    expect((await correr()).next).toHaveBeenCalled();
  });

  it('cuenta de IALab está exenta aunque sea menor', async () => {
    fake = createFakeSupabase(base({ users: { data: { user_type: 'student', account_type: 'ialab' }, error: null } }));
    expect((await correr()).next).toHaveBeenCalled();
  });

  it('administrador está exento sin consultar', async () => {
    const from = vi.spyOn(fake, 'from');
    const { next } = await correr({ userRole: 'admin' });
    expect(next).toHaveBeenCalled();
    expect(from).not.toHaveBeenCalled();
  });

  it('estudiante de 18 años o más está exento', async () => {
    fake = createFakeSupabase(base({ students: { data: { age: 18 }, error: null } }));
    expect((await correr()).next).toHaveBeenCalled();
  });

  it('la tabla antigua parent_consents ausente no bloquea la decisión', async () => {
    fake = createFakeSupabase(base({ parent_consents: { data: null, error: { code: 'PGRST205' } } }));
    bloqueado(await correr());
  });

  it('el nombre antiguo requireVerifiedParentalConsent es el mismo middleware', () => {
    expect(requireVerifiedParentalConsent).toBe(requireAdultoActivado);
  });
});
