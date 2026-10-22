/**
 * Auditoría S10: el registro de padres con alias «+padre» está retirado.
 * Las cuentas de padre existentes siguen pudiendo iniciar sesión.
 */
const express = require('express');
const request = require('supertest');
const authService = require('../../services/authService');
const sessionRouter = require('../../routes/auth/session');

const app = express();
app.use(express.json());
app.use('/api/auth', sessionRouter);

describe('POST /api/auth/parent-register (retirado, S10)', () => {
  beforeEach(() => {
    vi.spyOn(authService, 'signUpParent').mockResolvedValue({ ok: true });
  });
  afterEach(() => vi.restoreAllMocks());

  it('responde 410 con el motivo alias_retirado', async () => {
    const r = await request(app)
      .post('/api/auth/parent-register')
      .send({ studentEmail: 'nino@ejemplo.co', parentPassword: 'una-clave-larga', parentName: 'Ana', invitationToken: 'x' });
    expect(r.status).toBe(410);
    expect(r.body.motivo).toBe('alias_retirado');
    expect(r.body.error).toMatch(/invitación/i);
  });

  it('no crea ninguna cuenta de padre', async () => {
    await request(app)
      .post('/api/auth/parent-register')
      .send({ studentEmail: 'nino@ejemplo.co', parentPassword: 'una-clave-larga' });
    expect(authService.signUpParent).not.toHaveBeenCalled();
  });

  it('el inicio de sesión de padres existentes sigue disponible', async () => {
    vi.spyOn(authService, 'signInParent').mockResolvedValue({ token: 't' });
    const r = await request(app)
      .post('/api/auth/parent-login')
      .send({ studentEmail: 'nino@ejemplo.co', parentPassword: 'una-clave-larga' });
    expect(r.status).toBe(200);
    expect(authService.signInParent).toHaveBeenCalledTimes(1);
  });
});
