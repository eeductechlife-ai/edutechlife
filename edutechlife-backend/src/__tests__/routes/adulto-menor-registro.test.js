// Vitest globals — el adulto sin cuenta termina con cuenta de PADRE (correo real)
// y el niño en modo restringido puede reenviar la invitación.

const request = require('supertest');
const express = require('express');
const { crearBaseEnMemoria } = require('../helpers/supabaseEnMemoria');

const db = crearBaseEnMemoria();
const updateUserById = vi.fn().mockResolvedValue({ data: {}, error: null });
const sendMock = vi.fn().mockResolvedValue({ success: true });
const signUpMock = vi.fn();
const signInMock = vi.fn();

function sustituir(ruta, exports) {
  const p = require.resolve(ruta);
  delete require.cache[p];
  require.cache[p] = { id: p, filename: p, loaded: true, exports };
}

sustituir('../../db/supabase', { from: (t) => db.from(t), auth: { admin: { updateUserById } } });
sustituir('../../services/emailService', { sendEmail: sendMock });
sustituir('../../services/authService', {
  signUp: signUpMock, signIn: signInMock, refreshSession: vi.fn(), signOut: vi.fn(),
  signUpParent: vi.fn(), signInParent: vi.fn(),
});
sustituir('../../services/avisoPadreLogin', { avisarInicioSesionMenor: vi.fn().mockResolvedValue() });

let usuarioActual = null;
sustituir('../../middleware/auth', {
  requireAuth: (req, res, next) => {
    if (!usuarioActual) return res.status(401).json({ error: 'no autenticado' });
    req.userId = usuarioActual.id;
    req.userEmail = usuarioActual.email;
    req.userAppMetadata = usuarioActual.appMetadata || {};
    return next();
  },
});

const servicio = require('../../services/adultoObligatorio');
const adultoMenorRouter = require('../../routes/auth/adultoMenor');
const sessionRouter = require('../../routes/auth/session');

const NINO = 'a0000000-0000-4000-8000-000000000001';
const PADRE = 'b0000000-0000-4000-8000-000000000002';
const CORREO_NINO = 'hijo@ejemplo.com';
const CORREO_PADRE = 'padre@ejemplo.com';
const VERSION = 'adulto-menor-v1-2026-10-20';

function app() {
  const a = express();
  a.use(express.json());
  a.use('/api/auth', adultoMenorRouter);
  a.use('/api/auth', sessionRouter);
  return a;
}

function tokenEnviado() {
  return sendMock.mock.calls.at(-1)?.[2]?.match(/confirmar\?token=([A-Za-z0-9_-]+)/)?.[1];
}

async function invitar() {
  await servicio.crearInvitacion({ estudianteId: NINO, correo: CORREO_PADRE, nombre: 'Marta Pérez' });
  return tokenEnviado();
}

function registro(token, extra = {}) {
  return {
    token, nombre: 'Marta Pérez', password: 'clave-segura-123',
    aceptaAutorizacion: true, versionAutorizacion: VERSION, ...extra,
  };
}

beforeEach(() => {
  db.limpiar();
  vi.clearAllMocks();
  usuarioActual = null;
  process.env.ADULTO_OBLIGATORIO = 'true';
  db.filasDe('users').push({ id: NINO, email: CORREO_NINO, user_type: 'student', account_type: 'smartboard' });
  db.filasDe('students').push({ auth_id: NINO, age: 10 });
  signUpMock.mockImplementation(async ({ email }) => {
    // El trigger handle_new_user crea la fila como 'student' antes que el backend.
    db.filasDe('users').push({ id: PADRE, email, user_type: 'student', account_type: 'smartboard' });
    return { user: { id: PADRE, email }, token: 'tok-padre', refreshToken: 'ref-padre' };
  });
});

afterAll(() => {
  delete process.env.ADULTO_OBLIGATORIO;
});

describe('GET /adulto-menor/invitacion', () => {
  it('invitación vigente → datos para el formulario del adulto, con el correo enmascarado', async () => {
    const token = await invitar();
    const res = await request(app()).get(`/api/auth/adulto-menor/invitacion?token=${token}`);
    expect(res.body).toEqual({ valida: true, correoAdulto: 'pa***@ejemplo.com', nombreAdulto: 'Marta Pérez' });
  });

  it('invitación vencida → motivo vencida', async () => {
    const token = await invitar();
    db.filasDe('invitaciones_adulto_menor')[0].expira_at = new Date(Date.now() - 1000).toISOString();
    const res = await request(app()).get(`/api/auth/adulto-menor/invitacion?token=${token}`);
    expect(res.body).toEqual({ valida: false, motivo: 'vencida' });
  });
});

describe('POST /adulto-menor/registrar (adulto sin cuenta)', () => {
  it('crea una cuenta de PADRE con el correo invitado, vincula y activa al niño', async () => {
    const token = await invitar();
    const res = await request(app()).post('/api/auth/adulto-menor/registrar').send(registro(token));

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ vinculado: true, activado: true, token: 'tok-padre', refreshToken: 'ref-padre' });
    expect(signUpMock).toHaveBeenCalledWith(expect.objectContaining({
      email: CORREO_PADRE, userType: 'parent', accountType: 'smartboard', firstName: 'Marta', lastName: 'Pérez',
    }));
    expect(signUpMock.mock.calls[0][0].email).not.toMatch(/\+padre/);
    expect(db.filasDe('users').find((u) => u.id === PADRE).user_type).toBe('parent');
    expect(db.filasDe('parent_student_links')[0]).toMatchObject({ parent_user_id: PADRE, student_user_id: NINO, is_active: true });
    expect(db.filasDe('activaciones_adulto_menor')[0]).toMatchObject({
      estudiante_id: NINO, adulto_id: PADRE, metodo: 'invitacion', version_autorizacion: VERSION,
    });
    expect(db.filasDe('invitaciones_adulto_menor')[0].estado).toBe('confirmada');
  });

  it('sin aceptar la autorización no crea cuenta', async () => {
    const token = await invitar();
    const res = await request(app()).post('/api/auth/adulto-menor/registrar').send(registro(token, { aceptaAutorizacion: false }));
    expect(res.status).toBe(400);
    expect(res.body.motivo).toBe('falta_autorizacion');
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('contraseña corta o nombre vacío → 400 sin crear cuenta', async () => {
    const token = await invitar();
    for (const extra of [{ password: 'corta' }, { nombre: ' ' }]) {
      const res = await request(app()).post('/api/auth/adulto-menor/registrar').send(registro(token, extra));
      expect(res.status).toBe(400);
    }
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('enlace vencido → 400 vencida sin crear cuenta', async () => {
    const token = await invitar();
    db.filasDe('invitaciones_adulto_menor')[0].expira_at = new Date(Date.now() - 1000).toISOString();
    const res = await request(app()).post('/api/auth/adulto-menor/registrar').send(registro(token));
    expect(res.status).toBe(400);
    expect(res.body.motivo).toBe('vencida');
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('el correo ya tiene cuenta → 409 CUENTA_EXISTE y la invitación sigue pendiente', async () => {
    const token = await invitar();
    signUpMock.mockRejectedValueOnce(new Error('Este correo ya está registrado. Inicia sesión.'));
    const res = await request(app()).post('/api/auth/adulto-menor/registrar').send(registro(token));
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('CUENTA_EXISTE');
    expect(db.filasDe('invitaciones_adulto_menor')[0].estado).toBe('pendiente');
  });

  it('con la bandera apagada no existe', async () => {
    process.env.ADULTO_OBLIGATORIO = 'false';
    const res = await request(app()).post('/api/auth/adulto-menor/registrar').send(registro('x'.repeat(40)));
    expect(res.status).toBe(404);
  });
});

describe('estado y reenvío desde la cuenta del niño', () => {
  beforeEach(() => {
    usuarioActual = { id: NINO, email: CORREO_NINO };
  });

  it('estado: con invitación pendiente dice a qué correo (enmascarado) se envió', async () => {
    await invitar();
    const res = await request(app()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: true, invitacionPendiente: true, correoAdulto: 'pa***@ejemplo.com' });
  });

  it('estado: sin invitación previa pide registrar al adulto', async () => {
    const res = await request(app()).get('/api/auth/adulto-menor/estado');
    expect(res.body).toEqual({ mostrarAviso: true, invitacionPendiente: false, correoAdulto: null });
  });

  it('reenviar: invitación vencida → nueva invitación al mismo adulto y la anterior queda revocada', async () => {
    await invitar();
    const anterior = db.filasDe('invitaciones_adulto_menor')[0];
    anterior.expira_at = new Date(Date.now() - 1000).toISOString();
    anterior.created_at = new Date(Date.now() - 73 * 3600 * 1000).toISOString();
    sendMock.mockClear();

    const res = await request(app()).post('/api/auth/adulto-menor/reenviar');
    expect(res.status).toBe(201);
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0]).toBe(CORREO_PADRE);
    const invitaciones = db.filasDe('invitaciones_adulto_menor');
    expect(invitaciones).toHaveLength(2);
    expect(invitaciones.filter((i) => i.estado === 'pendiente')).toHaveLength(1);
    expect(invitaciones[0].estado).toBe('revocada');
  });

  it('reenviar: dos veces seguidas → 429 y no envía otro correo', async () => {
    await invitar();
    sendMock.mockClear();
    const res = await request(app()).post('/api/auth/adulto-menor/reenviar');
    expect(res.status).toBe(429);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('reenviar: sin invitación previa → 404 SIN_INVITACION', async () => {
    const res = await request(app()).post('/api/auth/adulto-menor/reenviar');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('SIN_INVITACION');
  });

  it('reenviar: un niño ya activado no reenvía (409)', async () => {
    await invitar();
    usuarioActual.appMetadata = { ingenia_adulto_activado_at: '2026-10-20T10:00:00Z' };
    const res = await request(app()).post('/api/auth/adulto-menor/reenviar');
    expect(res.status).toBe(409);
  });
});

describe('login de un padre en IngenIA', () => {
  it('no le crea una fila de estudiante (antes se creaba con edad 12)', async () => {
    db.filasDe('users').push({ id: PADRE, email: CORREO_PADRE, user_type: 'parent', account_type: 'smartboard' });
    signInMock.mockResolvedValue({ user: { id: PADRE, email: CORREO_PADRE }, token: 't' });
    const res = await request(app()).post('/api/auth/login').send({ email: CORREO_PADRE, password: 'clave-segura-123' });
    expect(res.status).toBe(200);
    await new Promise((r) => setTimeout(r, 20));
    expect(db.filasDe('students').find((s) => s.auth_id === PADRE)).toBeUndefined();
  });
});
