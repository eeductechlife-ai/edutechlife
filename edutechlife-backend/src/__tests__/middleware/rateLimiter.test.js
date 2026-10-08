const request = require('supertest');

const express = require('express');
const { apiLimiter, deepseekLimiter, authLimiter, userAwareKey } = require('../../middleware/rateLimiter');

describe('rate limiters', () => {
  it('apiLimiter exports a middleware function', () => {
    expect(apiLimiter).toBeDefined();
    expect(typeof apiLimiter).toBe('function');
  });

  it('deepseekLimiter exports a middleware function', () => {
    expect(deepseekLimiter).toBeDefined();
    expect(typeof deepseekLimiter).toBe('function');
  });

  it('authLimiter exports a middleware function', () => {
    expect(authLimiter).toBeDefined();
    expect(typeof authLimiter).toBe('function');
  });

  it('apiLimiter allows requests under the limit', async () => {
    const app = express();
    app.use('/api', apiLimiter);
    app.get('/api/test', (req, res) => res.json({ ok: true }));

    for (let i = 0; i < 5; i++) {
      const res = await request(app).get('/api/test');
      expect(res.status).toBe(200);
    }
  });

  it('apiLimiter nunca limita /api/health (health check de Render)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const app = express();
      app.use('/api', apiLimiter);
      app.get('/api/health', (req, res) => res.json({ ok: true }));
      app.get('/api/otro', (req, res) => res.json({ ok: true }));

      let health = 200;
      for (let i = 0; i < 110; i++) {
        health = (await request(app).get('/api/health')).status;
      }
      expect(health).toBe(200);
      // El resto de /api sigue limitado por IP (comparte contador entre pruebas).
      let otro = 200;
      for (let i = 0; i < 110; i++) {
        otro = (await request(app).get('/api/otro')).status;
      }
      expect(otro).toBe(429);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('deepseekLimiter sets rate limit headers', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const app = express();
      app.use('/api', deepseekLimiter);
      app.get('/api/test', (req, res) => res.json({ ok: true }));

      const res = await request(app).get('/api/test');
      expect(res.status).toBe(200);
      expect(res.headers['ratelimit-limit']).toBeDefined();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('deepseekLimiter rejects requests over the limit in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const app = express();
      app.use('/api', deepseekLimiter);
      app.get('/api/test', (req, res) => res.json({ ok: true }));

      let lastStatus = 200;
      for (let i = 0; i < 25; i++) {
        lastStatus = (await request(app).get('/api/test')).status;
      }
      expect(lastStatus).toBe(429);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe('userAwareKey (clave de los limitadores)', () => {
  const jwtFor = (sub) =>
    `x.${Buffer.from(JSON.stringify({ sub })).toString('base64url')}.y`;
  const req = (ip, sub, userId) => ({
    ip,
    userId,
    headers: sub ? { authorization: `Bearer ${jwtFor(sub)}` } : {},
  });

  it('alumnos distintos en la misma IP (aula) no comparten cupo', () => {
    const a = String(userAwareKey(req('190.1.1.1', 'alumno-a')));
    const b = String(userAwareKey(req('190.1.1.1', 'alumno-b')));
    expect(a).not.toBe(b);
  });

  it('el mismo alumno desde otra IP conserva su clave', () => {
    expect(userAwareKey(req('190.1.1.1', 'alumno-a'))).toBe(
      userAwareKey(req('181.2.2.2', 'alumno-a')),
    );
  });

  it('sin sesión se cuenta por IP y las IPs distintas no comparten cupo', () => {
    const a = String(userAwareKey(req('190.1.1.1')));
    const b = String(userAwareKey(req('181.2.2.2')));
    expect(a).not.toBe(b);
    expect(a).not.toContain('[object Object]');
  });

  it('prioriza req.userId (ya autenticado) sobre el token', () => {
    expect(userAwareKey(req('1.1.1.1', 'otro', 'uid-1'))).toBe('u:uid-1');
  });
});


describe('parentalInviteLimiter', () => {
  const { parentalInviteLimiter } = require('../../middleware/rateLimiter');

  const buildApp = () => {
    const app = express();
    app.post('/invite', (req, _res, next) => {
      req.userId = req.headers['x-test-user'] || 'u-1';
      next();
    }, parentalInviteLimiter, (_req, res) => res.json({ ok: true }));
    return app;
  };

  it('deja enviar cinco invitaciones por hora y bloquea la sexta (con mensaje claro)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const app = buildApp();
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/invite').set('x-test-user', 'estudiante-a');
        expect(res.status, `envío ${i + 1}`).toBe(200);
      }
      const sixth = await request(app).post('/invite').set('x-test-user', 'estudiante-a');
      expect(sixth.status).toBe(429);
      expect(sixth.body.error).toMatch(/una hora/);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('el tope es por estudiante: otro estudiante en la misma red no se ve afectado', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const app = buildApp();
      for (let i = 0; i < 6; i++) {
        await request(app).post('/invite').set('x-test-user', 'estudiante-b');
      }
      const other = await request(app).post('/invite').set('x-test-user', 'estudiante-c');
      expect(other.status).toBe(200);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('fuera de producción no limita (igual que los demás limitadores)', async () => {
    const app = buildApp();
    for (let i = 0; i < 8; i++) {
      const res = await request(app).post('/invite').set('x-test-user', 'estudiante-d');
      expect(res.status).toBe(200);
    }
  });
});
