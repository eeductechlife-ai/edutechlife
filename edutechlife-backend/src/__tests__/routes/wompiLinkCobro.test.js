/**
 * POST /api/payments/wompi/link-cobro (solo admin)
 * Genera el enlace de Wompi para un usuario registrado y lo envía por correo.
 * Usa el requireAdmin real (con auth.getUser simulado) y mockea db/supabase y el correo.
 */

const express = require('express');
const request = require('supertest');
const { parseReference } = require('../../services/wompi');

const supabasePath = require.resolve('../../db/supabase');
const USUARIO_ID = '6f1c2a3b-1111-4222-8333-944455556666';
const USUARIOS = [{ id: USUARIO_ID, email: 'familia@ejemplo.co', app_metadata: {} }];
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    admin: {
      listUsers: vi.fn(async ({ filter }) => ({
        data: { users: USUARIOS.filter((u) => u.email === filter) },
        error: null,
      })),
    },
  },
};
delete require.cache[supabasePath];
require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: mockSupabase };

const emailPath = require.resolve('../../services/emailService');
const mockEmail = { sendEmail: vi.fn() };
delete require.cache[emailPath];
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true, exports: mockEmail };

const wompiRoutes = require('../../routes/wompi');
const { cobroLinkLimiter } = require('../../middleware/rateLimiter');

const app = express();
app.use(express.json());
app.use('/api/payments/wompi', wompiRoutes);

const ENDPOINT = '/api/payments/wompi/link-cobro';
const CLAVES = {
  WOMPI_PUBLIC_KEY: 'pub_test_abc',
  WOMPI_INTEGRITY_SECRET: 'test_integrity_x',
  WOMPI_EVENTS_SECRET: 'test_events_y',
};
const TOKEN_ADMIN = 'tok-admin';
const TOKEN_NO_ADMIN = 'tok-usuario';
const enviar = (body, token = TOKEN_ADMIN) =>
  request(app).post(ENDPOINT).set('Authorization', `Bearer ${token}`).send(body);

const todosLosLogs = (spies) => spies.flatMap((s) => s.mock.calls).flat().map(String).join('\n');

beforeAll(() => {
  Object.assign(process.env, CLAVES);
});

afterAll(() => {
  Object.keys(CLAVES).forEach((k) => delete process.env[k]);
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-14T15:00:00-05:00'));
  Object.assign(process.env, CLAVES);
  mockSupabase.auth.getUser.mockReset();
  mockSupabase.auth.getUser.mockImplementation(async (token) => {
    if (token === TOKEN_ADMIN) {
      return { data: { user: { id: 'admin-1', email: 'admin@edutechlife.co', app_metadata: { role: 'admin' } } }, error: null };
    }
    if (token === TOKEN_NO_ADMIN) {
      return { data: { user: { id: 'u-9', email: 'otro@ejemplo.co', app_metadata: {} } }, error: null };
    }
    return { data: { user: null }, error: { message: 'invalid token' } };
  });
  mockEmail.sendEmail.mockReset();
  mockEmail.sendEmail.mockResolvedValue({ success: true, messageId: 'msg-1' });
  mockSupabase.auth.admin.listUsers.mockClear();
  cobroLinkLimiter.resetKey('admin:admin-1');
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('POST /api/payments/wompi/link-cobro: autorización', () => {
  it('responde 401 sin token', async () => {
    const res = await request(app).post(ENDPOINT).send({ email: 'familia@ejemplo.co', planId: 'base' });
    expect(res.status).toBe(401);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('responde 403 a un usuario que no es admin y no envía nada', async () => {
    const res = await enviar({ email: 'familia@ejemplo.co', planId: 'base' }, TOKEN_NO_ADMIN);
    expect(res.status).toBe(403);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });
});

describe('POST /api/payments/wompi/link-cobro: envío', () => {
  it('admin: genera el enlace con el id de Auth del usuario, lo devuelve y lo envía por correo', async () => {
    const res = await enviar({ email: 'familia@ejemplo.co', planId: 'smartboard_premium' });

    expect(res.status).toBe(200);
    expect(res.body.url.startsWith('https://checkout.wompi.co/p/?')).toBe(true);
    expect(new URL(res.body.url).searchParams.get('amount-in-cents')).toBe('4990000');
    expect(parseReference(new URL(res.body.url).searchParams.get('reference')).userId).toBe(USUARIO_ID);
    expect(res.body.emailEnviado).toBe(true);

    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(1);
    const [para, asunto, html, texto] = mockEmail.sendEmail.mock.calls[0];
    expect(para).toBe('familia@ejemplo.co');
    expect(asunto).toMatch(/valoración terminó/);
    expect(texto).toContain('Tu valoración terminó. Para activar tu plan, paga aquí:');
    expect(texto).toContain(res.body.url);
    expect(texto).toMatch(/Your assessment is complete/);
    expect(texto).toMatch(/Sua avaliação terminou/);
    expect(html).toContain('href="');
  });

  it('acepta los nombres cortos del equipo (fundador, acompanamiento, intensivo, base)', async () => {
    const fundador = await enviar({ email: 'familia@ejemplo.co', planId: 'fundador' });
    expect(fundador.status).toBe(200);
    expect(new URL(fundador.body.url).searchParams.get('amount-in-cents')).toBe('3990000');

    const intensivo = await enviar({ email: 'familia@ejemplo.co', planId: 'intensivo' });
    expect(intensivo.status).toBe(200);
    expect(new URL(intensivo.body.url).searchParams.get('amount-in-cents')).toBe('24900000');
  });

  it('responde 200 con el enlace aunque el correo falle, y lo dice', async () => {
    mockEmail.sendEmail.mockResolvedValueOnce({ success: false, error: 'Resend API error: 500' });
    const res = await enviar({ email: 'familia@ejemplo.co', planId: 'base' });
    expect(res.status).toBe(200);
    expect(res.body.url).toContain('checkout.wompi.co');
    expect(res.body.emailEnviado).toBe(false);
  });

  it('no escribe el enlace en logs', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockEmail.sendEmail.mockResolvedValueOnce({ success: false, error: 'x' });

    const res = await enviar({ email: 'familia@ejemplo.co', planId: 'base' });

    expect(res.status).toBe(200);
    expect(todosLosLogs([log, err, warn])).not.toContain('checkout.wompi.co');
    expect(todosLosLogs([log, err, warn])).not.toContain('signature:integrity');
  });
});

describe('POST /api/payments/wompi/link-cobro: validaciones', () => {
  it('400 si el plan es gratis, en dólares, personalizado o no existe', async () => {
    for (const planId of ['free', 'pro', 'enterprise', 'nada']) {
      const res = await enviar({ email: 'familia@ejemplo.co', planId });
      expect(res.status, planId).toBe(400);
    }
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('400 si falta el plan o el correo no es válido', async () => {
    expect((await enviar({ email: 'familia@ejemplo.co' })).status).toBe(400);
    expect((await enviar({ planId: 'base' })).status).toBe(400);
    expect((await enviar({ email: 'no-es-correo', planId: 'base' })).status).toBe(400);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('404 si no existe un usuario registrado con ese correo', async () => {
    const res = await enviar({ email: 'nadie@ejemplo.co', planId: 'base' });
    expect(res.status).toBe(404);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('400 si el Fundador ya venció y no envía nada', async () => {
    vi.setSystemTime(new Date('2026-11-04T12:00:00-05:00'));
    const res = await enviar({ email: 'familia@ejemplo.co', planId: 'fundador' });
    expect(res.status).toBe(400);
    expect(mockSupabase.auth.admin.listUsers).not.toHaveBeenCalled();
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('503 si Wompi no tiene llaves configuradas', async () => {
    Object.keys(CLAVES).forEach((k) => delete process.env[k]);
    const res = await enviar({ email: 'familia@ejemplo.co', planId: 'base' });
    expect(res.status).toBe(503);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });
});

describe('POST /api/payments/wompi/link-cobro: límite de envíos', () => {
  it('permite 5 envíos por hora por administrador y el sexto responde 429', async () => {
    for (let i = 0; i < 5; i += 1) {
      const ok = await enviar({ email: 'familia@ejemplo.co', planId: 'base' });
      expect(ok.status, `envío ${i + 1}`).toBe(200);
    }
    const bloqueado = await enviar({ email: 'familia@ejemplo.co', planId: 'base' });
    expect(bloqueado.status).toBe(429);
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(5);
  });
});
