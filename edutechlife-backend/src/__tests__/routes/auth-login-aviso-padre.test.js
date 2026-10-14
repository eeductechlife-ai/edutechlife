/**
 * POST /api/auth/login dispara el aviso al padre sin bloquear el inicio de
 * sesión (services/avisoPadreLogin.js). Decisión del CEO 2026-10-13.
 */
const express = require('express');
const request = require('supertest');

const supabasePath = require.resolve('../../db/supabase');
const authServicePath = require.resolve('../../services/authService');
const avisoPath = require.resolve('../../services/avisoPadreLogin');

// Cadena de consulta que no encuentra nada: el bloque best-effort de
// "ensure student profile" del login termina sin efectos.
const consultaVacia = () => {
  const b = {
    select: () => b,
    eq: () => b,
    maybeSingle: () => b,
    insert: () => b,
    then: (res) => res({ data: null, error: null }),
  };
  return b;
};
require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: { from: () => consultaVacia() },
};

const mockAuth = { signIn: vi.fn() };
require.cache[authServicePath] = {
  id: authServicePath,
  filename: authServicePath,
  loaded: true,
  exports: mockAuth,
};

const mockAviso = { avisarInicioSesionMenor: vi.fn() };
require.cache[avisoPath] = {
  id: avisoPath,
  filename: avisoPath,
  loaded: true,
  exports: mockAviso,
};

const sessionRouter = require('../../routes/auth/session');

function crearApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', sessionRouter);
  return app;
}

describe('POST /api/auth/login y el aviso al padre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.signIn.mockResolvedValue({ token: 'tok', refreshToken: 'ref', user: { id: 'nino-1', email: 'nino@ejemplo.co' } });
  });

  test('llama al aviso con el id del usuario que inició sesión', async () => {
    mockAviso.avisarInicioSesionMenor.mockResolvedValue({ enviado: true, motivo: 'enviado' });
    const res = await request(crearApp()).post('/api/auth/login').send({ email: 'nino@ejemplo.co', password: 'x' });

    expect(res.status).toBe(200);
    expect(mockAviso.avisarInicioSesionMenor).toHaveBeenCalledWith('nino-1');
  });

  test('si el aviso falla o lanza, el login responde igual (200 con token)', async () => {
    mockAviso.avisarInicioSesionMenor.mockRejectedValue(new Error('Resend caído'));
    const res = await request(crearApp()).post('/api/auth/login').send({ email: 'nino@ejemplo.co', password: 'x' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('tok');
  });

  test('credenciales incorrectas no disparan el aviso', async () => {
    mockAuth.signIn.mockRejectedValue(new Error('Invalid login credentials'));
    const res = await request(crearApp()).post('/api/auth/login').send({ email: 'nino@ejemplo.co', password: 'mal' });

    expect(res.status).toBe(401);
    expect(mockAviso.avisarInicioSesionMenor).not.toHaveBeenCalled();
  });
});
