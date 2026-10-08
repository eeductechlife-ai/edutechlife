const { createFakeSupabase } = require('../helpers/fakeSupabase');

// El servicio importa ../db/supabase al cargarse: se entrega un proxy estable y
// cada prueba fija el cliente falso que necesita.
const supabasePath = require.resolve('../../db/supabase');
let current = createFakeSupabase();
require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: { from: (...a) => current.from(...a) },
};
delete require.cache[require.resolve('../../services/mfaService')];
const mfa = require('../../services/mfaService');

// Vector de prueba de RFC 4226/6238: secreto ASCII «12345678901234567890».
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const RFC_CODE_STEP_1 = '287082'; // contador 1 (t = 30–59 s)

const use = (handlers) => {
  current = createFakeSupabase(handlers);
  return current;
};
const userRow = (over = {}) => ({
  data: { mfa_secret: null, mfa_enabled: false, user_type: 'admin', ...over },
  error: null,
});

afterEach(() => vi.useRealTimers());

describe('mfaService.requiresMfa', () => {
  it('exige MFA a administradores, padres y educadores', () => {
    for (const role of ['admin', 'parent', 'educator']) expect(mfa.requiresMfa(role)).toBe(true);
  });
  it('no se lo exige a estudiantes ni a roles desconocidos', () => {
    for (const role of ['student', 'smartboard', undefined, null]) expect(mfa.requiresMfa(role)).toBe(false);
  });
});

describe('mfaService.enroll', () => {
  it('rechaza roles sin MFA y no guarda nada', async () => {
    const fake = use({ users: userRow({ user_type: 'student' }) });
    await expect(mfa.enroll('u1', 'a@b.co')).rejects.toThrow(/solo está disponible/);
    expect(fake.calls.some((c) => c.op === 'update')).toBe(false);
  });

  it('genera un secreto base32 de 160 bits, el URI otpauth y el QR', async () => {
    const fake = use({ users: userRow() });
    const out = await mfa.enroll('u1', 'ana@correo.co');
    expect(out.secret).toMatch(/^[A-Z2-7]{32}$/);
    expect(out.otpauth.startsWith('otpauth://totp/EdutechLife%3Aana%40correo.co?secret=')).toBe(true);
    expect(out.otpauth).toContain(`secret=${out.secret}`);
    expect(out.otpauth).toContain('issuer=EdutechLife');
    expect(out.otpauth).toContain('digits=6');
    expect(out.otpauth).toContain('period=30');
    expect(out.qrDataUrl.startsWith('data:image/png;base64,')).toBe(true);
    const update = fake.calls.find((c) => c.op === 'update');
    expect(update.args[0]).toEqual({ mfa_secret: out.secret, mfa_enabled: false });
  });

  it('cada alta produce un secreto distinto', async () => {
    use({ users: userRow() });
    const a = await mfa.enroll('u1', 'a@b.co');
    const b = await mfa.enroll('u1', 'a@b.co');
    expect(a.secret).not.toBe(b.secret);
  });

  it('si no puede leer o guardar, falla con un mensaje claro', async () => {
    use({ users: { data: null, error: { message: 'boom' } } });
    await expect(mfa.enroll('u1', 'a@b.co')).rejects.toThrow('MFA state fetch failed: boom');

    use({
      users: (state) =>
        state.ops.some((o) => o[0] === 'update') ? { data: null, error: { message: 'sin permiso' } } : userRow(),
    });
    await expect(mfa.enroll('u1', 'a@b.co')).rejects.toThrow('MFA enroll failed: sin permiso');
  });
});

describe('mfaService.verifySetup (TOTP RFC 6238)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(59 * 1000)); // contador 1
  });

  it('acepta el código del vector RFC y activa MFA', async () => {
    const fake = use({ users: userRow({ mfa_secret: RFC_SECRET }) });
    await expect(mfa.verifySetup('u1', RFC_CODE_STEP_1)).resolves.toEqual({ ok: true });
    expect(fake.calls.find((c) => c.op === 'update').args[0]).toEqual({ mfa_enabled: true });
  });

  it('tolera un paso de reloj hacia atrás y hacia adelante, no más', async () => {
    use({ users: userRow({ mfa_secret: RFC_SECRET }) });
    vi.setSystemTime(new Date(89 * 1000)); // contador 2: el código del contador 1 aún sirve
    await expect(mfa.verifySetup('u1', RFC_CODE_STEP_1)).resolves.toEqual({ ok: true });
    vi.setSystemTime(new Date(121 * 1000)); // contador 4: fuera de la ventana
    await expect(mfa.verifySetup('u1', RFC_CODE_STEP_1)).rejects.toThrow(/Código incorrecto/);
  });

  it('rechaza un código erróneo sin activar nada', async () => {
    const fake = use({ users: userRow({ mfa_secret: RFC_SECRET }) });
    await expect(mfa.verifySetup('u1', '000000')).rejects.toThrow(/Código incorrecto/);
    expect(fake.calls.some((c) => c.op === 'update')).toBe(false);
  });

  it('sin configuración pendiente pide iniciar el proceso', async () => {
    use({ users: userRow({ mfa_secret: null }) });
    await expect(mfa.verifySetup('u1', RFC_CODE_STEP_1)).rejects.toThrow(/No hay configuración MFA pendiente/);
  });

  it('si no puede confirmar en la base, falla', async () => {
    use({
      users: (state) =>
        state.ops.some((o) => o[0] === 'update')
          ? { data: null, error: { message: 'x' } }
          : userRow({ mfa_secret: RFC_SECRET }),
    });
    await expect(mfa.verifySetup('u1', RFC_CODE_STEP_1)).rejects.toThrow('MFA confirm failed: x');
  });
});

describe('mfaService.issueChallengeToken / verifyLoginChallenge', () => {
  it('emite un token aleatorio de 256 bits que vence en cinco minutos', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-08T12:00:00Z'));
    const fake = use({ users: { data: null, error: null } });
    const token = await mfa.issueChallengeToken('u1');
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    const update = fake.calls.find((c) => c.op === 'update').args[0];
    expect(update.mfa_challenge_token).toBe(token);
    expect(update.mfa_challenge_expires_at).toBe('2026-10-08T12:05:00.000Z');
  });

  it('si no puede guardar el token, falla', async () => {
    use({ users: { data: null, error: { message: 'x' } } });
    await expect(mfa.issueChallengeToken('u1')).rejects.toThrow('MFA challenge issue failed: x');
  });

  describe('verifyLoginChallenge', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(59 * 1000));
    });
    const row = (over = {}) => ({
      data: {
        id: 'u1',
        mfa_secret: RFC_SECRET,
        mfa_challenge_token: 'tok',
        mfa_challenge_expires_at: new Date(59 * 1000 + 60_000).toISOString(),
        ...over,
      },
      error: null,
    });

    it('con token y código válidos devuelve el usuario y gasta el token (un solo uso)', async () => {
      const fake = use({
        users: (state) => (state.ops.some((o) => o[0] === 'update') ? { data: null, error: null } : row()),
      });
      await expect(mfa.verifyLoginChallenge('tok', RFC_CODE_STEP_1)).resolves.toBe('u1');
      const cleared = fake.calls.find((c) => c.op === 'update').args[0];
      expect(cleared).toEqual({ mfa_challenge_token: null, mfa_challenge_expires_at: null });
    });

    it('token desconocido', async () => {
      use({ users: { data: null, error: null } });
      await expect(mfa.verifyLoginChallenge('nope', RFC_CODE_STEP_1)).rejects.toThrow(/inválido o expirado/);
    });

    it('token vencido: pide iniciar sesión de nuevo y no deja pasar', async () => {
      const fake = use({ users: row({ mfa_challenge_expires_at: new Date(59 * 1000 - 1000).toISOString() }) });
      await expect(mfa.verifyLoginChallenge('tok', RFC_CODE_STEP_1)).rejects.toThrow(/expiró/);
      expect(fake.calls.some((c) => c.op === 'update')).toBe(false);
    });

    it('código incorrecto: no gasta el token', async () => {
      const fake = use({ users: row() });
      await expect(mfa.verifyLoginChallenge('tok', '123456')).rejects.toThrow(/Código MFA incorrecto/);
      expect(fake.calls.some((c) => c.op === 'update')).toBe(false);
    });

    it('error de búsqueda', async () => {
      use({ users: { data: null, error: { message: 'caído' } } });
      await expect(mfa.verifyLoginChallenge('tok', RFC_CODE_STEP_1)).rejects.toThrow('MFA lookup failed: caído');
    });
  });
});

describe('mfaService.disable', () => {
  it('borra el secreto y cualquier desafío pendiente', async () => {
    const fake = use({ users: { data: null, error: null } });
    await expect(mfa.disable('u1')).resolves.toEqual({ ok: true });
    expect(fake.calls.find((c) => c.op === 'update').args[0]).toEqual({
      mfa_secret: null,
      mfa_enabled: false,
      mfa_challenge_token: null,
      mfa_challenge_expires_at: null,
    });
  });

  it('si falla, lo informa', async () => {
    use({ users: { data: null, error: { message: 'x' } } });
    await expect(mfa.disable('u1')).rejects.toThrow('MFA disable failed: x');
  });
});
