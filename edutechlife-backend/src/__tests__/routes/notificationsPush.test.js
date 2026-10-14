/**
 * Rutas de avisos push del padre (routes/notificationsPush.js).
 *   GET  /api/notifications/push/public-key  (público)
 *   POST /api/notifications/push/subscribe   (padre con hijo vinculado)
 * Una suscripción repetida no crea duplicados.
 */
const express = require('express');
const request = require('supertest');

const supabasePath = require.resolve('../../db/supabase');
const authPath = require.resolve('../../middleware/auth');
const loggerPath = require.resolve('../../utils/logger');

let links;
let filas;
let fallaUpsert;

function crearSupabaseFalso() {
  return {
    from(tabla) {
      const q = { filtros: [], op: 'select', set: null, opciones: null };
      const coincide = (f) => q.filtros.every(([col, val]) => f[col] === val);
      const ejecutar = async () => {
        if (tabla === 'parent_student_links') {
          return { data: links.filter(coincide).map((l) => ({ ...l })), error: null };
        }
        if (tabla === 'push_subscriptions' && q.op === 'upsert') {
          if (fallaUpsert) return { data: null, error: { message: 'relation does not exist' } };
          const clave = (f) => `${f.user_id}|${f.subscription?.endpoint}`;
          const existente = filas.find((f) => clave(f) === clave(q.set));
          if (existente) Object.assign(existente, q.set);
          else filas.push({ id: `id-${filas.length + 1}`, ...q.set });
          return { data: null, error: null };
        }
        return { data: [], error: null };
      };
      const b = {
        select: () => b,
        eq: (col, val) => (q.filtros.push([col, val]), b),
        limit: () => b,
        upsert: (fila, opciones) => ((q.op = 'upsert'), (q.set = fila), (q.opciones = opciones), b),
        then: (res, rej) => ejecutar().then(res, rej),
      };
      return b;
    },
  };
}

require.cache[supabasePath] = { id: supabasePath, filename: supabasePath, loaded: true, exports: crearSupabaseFalso() };

// Sesión simulada: la cabecera x-test-user identifica al usuario.
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    requireAuth: (req, res, next) => {
      const id = req.headers['x-test-user'];
      if (!id) return res.status(401).json({ error: 'No autorizado — token requerido' });
      req.userId = id;
      next();
    },
  },
};

const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
require.cache[loggerPath] = { id: loggerPath, filename: loggerPath, loaded: true, exports: mockLogger };

const router = require('../../routes/notificationsPush');

const PADRE = 'padre-1';
const NO_PADRE = 'usuario-sin-hijos';
const CLAVE_PUBLICA = 'BNcRdreALRFXTkOOUHK5NxBeCPbSa6JaxrJVEnJVYGcEOhsIbAWUhLQj60T2_cR6oVrO0ps9HVTzjqCJ-jCf20I';
const endpoint = (n) => `https://fcm.googleapis.com/fcm/send/dispositivo-${n}`;
const cuerpo = (n) => ({
  subscription: {
    endpoint: endpoint(n),
    keys: { p256dh: 'BPk3gY7sQf2L1rXa8Zc9vN0hT4wE6yU2iO8pA3sD5fG7hJ9kL1zX3cV5bN7mQ2wE', auth: 'aBcDeFgHiJkLmNoP1234' },
  },
});

function crearApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/notifications/push', router);
  return app;
}

const prevEnv = { ...process.env };

beforeEach(() => {
  vi.clearAllMocks();
  links = [{ parent_user_id: PADRE, student_user_id: 'nino-1', is_active: true }];
  filas = [];
  fallaUpsert = false;
  process.env.VAPID_PUBLIC_KEY = CLAVE_PUBLICA;
  process.env.VAPID_PRIVATE_KEY = 'llave-privada-de-prueba-no-real';
  process.env.VAPID_SUBJECT = 'mailto:avisos@edutechlife.co';
});

afterAll(() => {
  process.env = prevEnv;
});

describe('GET /api/notifications/push/public-key', () => {
  test('devuelve la clave pública sin pedir sesión y nunca la privada', async () => {
    const res = await request(crearApp()).get('/api/notifications/push/public-key');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ publicKey: CLAVE_PUBLICA });
    expect(JSON.stringify(res.body)).not.toContain('llave-privada');
  });

  test('sin llaves VAPID responde 503 con un mensaje legible', async () => {
    delete process.env.VAPID_PUBLIC_KEY;
    const res = await request(crearApp()).get('/api/notifications/push/public-key');
    expect(res.status).toBe(503);
    expect(res.body.error).toMatch(/no están configurados/);
  });
});

describe('POST /api/notifications/push/subscribe', () => {
  test('sin sesión responde 401 y no guarda nada', async () => {
    const res = await request(crearApp()).post('/api/notifications/push/subscribe').send(cuerpo(1));
    expect(res.status).toBe(401);
    expect(filas).toHaveLength(0);
  });

  test('un usuario sin hijos vinculados recibe 403', async () => {
    const res = await request(crearApp())
      .post('/api/notifications/push/subscribe')
      .set('x-test-user', NO_PADRE)
      .send(cuerpo(1));
    expect(res.status).toBe(403);
    expect(filas).toHaveLength(0);
  });

  test('un vínculo inactivo no cuenta como padre', async () => {
    links = [{ parent_user_id: PADRE, student_user_id: 'nino-1', is_active: false }];
    const res = await request(crearApp())
      .post('/api/notifications/push/subscribe')
      .set('x-test-user', PADRE)
      .send(cuerpo(1));
    expect(res.status).toBe(403);
  });

  test('guarda la suscripción del padre con endpoint y llaves', async () => {
    const res = await request(crearApp())
      .post('/api/notifications/push/subscribe')
      .set('x-test-user', PADRE)
      .set('user-agent', 'Mozilla/5.0 de prueba')
      .send(cuerpo(1));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(filas).toHaveLength(1);
    expect(filas[0].user_id).toBe(PADRE);
    expect(filas[0].subscription.endpoint).toBe(endpoint(1));
    expect(filas[0].subscription.keys.auth).toBe('aBcDeFgHiJkLmNoP1234');
    expect(filas[0].user_agent).toBe('Mozilla/5.0 de prueba');
  });

  test('la misma suscripción enviada dos veces no crea duplicados', async () => {
    const app = crearApp();
    await request(app).post('/api/notifications/push/subscribe').set('x-test-user', PADRE).send(cuerpo(1));
    const res = await request(app).post('/api/notifications/push/subscribe').set('x-test-user', PADRE).send(cuerpo(1));

    expect(res.status).toBe(200);
    expect(filas).toHaveLength(1);
  });

  test('un padre con dos dispositivos guarda dos suscripciones', async () => {
    const app = crearApp();
    await request(app).post('/api/notifications/push/subscribe').set('x-test-user', PADRE).send(cuerpo(1));
    await request(app).post('/api/notifications/push/subscribe').set('x-test-user', PADRE).send(cuerpo(2));
    expect(filas.map((f) => f.subscription.endpoint)).toEqual([endpoint(1), endpoint(2)]);
  });

  test('rechaza endpoints que no son https', async () => {
    const malo = cuerpo(1);
    malo.subscription.endpoint = 'http://ejemplo.co/push';
    const res = await request(crearApp()).post('/api/notifications/push/subscribe').set('x-test-user', PADRE).send(malo);
    expect(res.status).toBe(400);
    expect(filas).toHaveLength(0);
  });

  test('rechaza llaves que no tienen formato base64url', async () => {
    const malo = cuerpo(1);
    malo.subscription.keys.p256dh = 'no válida con espacios!';
    const res = await request(crearApp()).post('/api/notifications/push/subscribe').set('x-test-user', PADRE).send(malo);
    expect(res.status).toBe(400);
  });

  test('si la base de datos falla responde 500 con un mensaje claro', async () => {
    fallaUpsert = true;
    const res = await request(crearApp())
      .post('/api/notifications/push/subscribe')
      .set('x-test-user', PADRE)
      .send(cuerpo(1));
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Intenta de nuevo/);
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
