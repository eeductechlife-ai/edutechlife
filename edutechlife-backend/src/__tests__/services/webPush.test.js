/**
 * Envío de push web con VAPID (services/webPush.js). Decisión del CEO
 * 2026-10-13: el padre recibe en su celular el aviso de que su hijo/a está
 * activo. La push nunca bloquea nada y nunca imprime las llaves.
 *
 * La base se simula en memoria (tabla push_subscriptions). El envío HTTP se
 * simula con un fetch falso que se inyecta en la función.
 */
const crypto = require('node:crypto');

const supabasePath = require.resolve('../../db/supabase');
const loggerPath = require.resolve('../../utils/logger');

const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
require.cache[loggerPath] = { id: loggerPath, filename: loggerPath, loaded: true, exports: mockLogger };

let filas;
let fallaConsulta;

function crearSupabaseFalso() {
  return {
    from(tabla) {
      const q = { op: 'select', filtros: [], set: null };
      const coincide = (f) =>
        q.filtros.every(([col, cmp, val]) => (cmp === 'in' ? val.includes(f[col]) : f[col] === val));
      const ejecutar = async () => {
        if (fallaConsulta) return { data: null, error: { message: 'boom' } };
        if (tabla !== 'push_subscriptions') return { data: [], error: null };
        if (q.op === 'select') return { data: filas.filter(coincide).map((f) => ({ ...f })), error: null };
        if (q.op === 'delete') {
          filas = filas.filter((f) => !coincide(f));
          return { data: null, error: null };
        }
        if (q.op === 'upsert') {
          const clave = (f) => `${f.user_id}|${f.subscription?.endpoint}`;
          const existente = filas.find((f) => clave(f) === clave(q.set));
          if (existente) Object.assign(existente, q.set);
          else filas.push({ id: `id-${filas.length + 1}`, ...q.set });
          return { data: null, error: null };
        }
        return { data: null, error: null };
      };
      const b = {
        select: () => b,
        eq: (col, val) => (q.filtros.push([col, 'eq', val]), b),
        in: (col, val) => (q.filtros.push([col, 'in', val]), b),
        delete: () => ((q.op = 'delete'), b),
        upsert: (fila) => ((q.op = 'upsert'), (q.set = fila), b),
        then: (res, rej) => ejecutar().then(res, rej),
      };
      return b;
    },
  };
}

require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: crearSupabaseFalso(),
};

const { enviarPushPadre, configuracionVapid, jwtVapid } = require('../../services/webPush');

// Par de llaves VAPID real (P-256) generado en cada ejecución.
const par = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' });
const jwkPriv = par.privateKey.export({ format: 'jwk' });
const PUBLIC_KEY = Buffer.concat([Buffer.from([0x04]), Buffer.from(jwkPriv.x, 'base64url'), Buffer.from(jwkPriv.y, 'base64url')]).toString('base64url');
const PRIVATE_KEY = Buffer.from(jwkPriv.d, 'base64url').toString('base64url');
const SUBJECT = 'mailto:avisos@edutechlife.co';

const PADRE = 'padre-1';
const suscripcion = (n) => ({
  endpoint: `https://fcm.googleapis.com/fcm/send/dispositivo-${n}`,
  keys: { p256dh: 'BPk3gY7sQf2L1rXa8Zc9vN0hT4wE6yU2iO8pA3sD5fG7hJ9kL1zX3cV5bN7mQ2wE', auth: 'aBcDeFgHiJkLmNoP1234' },
});

function respuesta(status) {
  return { status, ok: status >= 200 && status < 300 };
}

const prevEnv = { ...process.env };

beforeEach(() => {
  vi.clearAllMocks();
  filas = [];
  fallaConsulta = false;
  process.env.VAPID_PUBLIC_KEY = PUBLIC_KEY;
  process.env.VAPID_PRIVATE_KEY = PRIVATE_KEY;
  process.env.VAPID_SUBJECT = SUBJECT;
});

afterAll(() => {
  process.env = prevEnv;
});

describe('enviarPushPadre', () => {
  test('envía a todas las suscripciones del padre y firma con VAPID válido', async () => {
    filas = [
      { id: 'a', user_id: PADRE, subscription: suscripcion(1) },
      { id: 'b', user_id: PADRE, subscription: suscripcion(2) },
    ];
    const fetchFalso = vi.fn(async () => respuesta(201));

    const r = await enviarPushPadre(PADRE, { fetchImpl: fetchFalso });

    expect(r).toEqual({ enviadas: 2, caducadas: 0, fallidas: 0, motivo: 'ok' });
    expect(fetchFalso).toHaveBeenCalledTimes(2);
    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toBe(suscripcion(1).endpoint);
    expect(opciones.method).toBe('POST');
    expect(opciones.body).toBeUndefined(); // sin payload: no hay contenido que cifrar
    const cabecera = opciones.headers.Authorization;
    expect(cabecera.startsWith('vapid t=')).toBe(true);
    expect(cabecera).toContain(`k=${PUBLIC_KEY}`);

    // La firma ES256 debe verificar con la llave pública y el aud debe ser el origen del servicio push.
    const token = cabecera.match(/t=([^,]+)/)[1];
    const [h, p, s] = token.split('.');
    const clavePub = crypto.createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: jwkPriv.x, y: jwkPriv.y }, format: 'jwk' });
    const valida = crypto.verify('sha256', Buffer.from(`${h}.${p}`), { key: clavePub, dsaEncoding: 'ieee-p1363' }, Buffer.from(s, 'base64url'));
    expect(valida).toBe(true);
    const cuerpo = JSON.parse(Buffer.from(p, 'base64url').toString());
    expect(cuerpo.aud).toBe('https://fcm.googleapis.com');
    expect(cuerpo.sub).toBe(SUBJECT);
    expect(cuerpo.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('una suscripción inválida (410) se elimina y las demás siguen', async () => {
    filas = [
      { id: 'viva', user_id: PADRE, subscription: suscripcion(1) },
      { id: 'muerta', user_id: PADRE, subscription: suscripcion(2) },
    ];
    const fetchFalso = vi.fn(async (url) => respuesta(url.endsWith('2') ? 410 : 201));

    const r = await enviarPushPadre(PADRE, { fetchImpl: fetchFalso });

    expect(r).toEqual({ enviadas: 1, caducadas: 1, fallidas: 0, motivo: 'ok' });
    expect(filas.map((f) => f.id)).toEqual(['viva']);
  });

  test('404 también cuenta como suscripción caducada', async () => {
    filas = [{ id: 'x', user_id: PADRE, subscription: suscripcion(3) }];
    const r = await enviarPushPadre(PADRE, { fetchImpl: async () => respuesta(404) });
    expect(r.caducadas).toBe(1);
    expect(filas).toHaveLength(0);
  });

  test('un error 500 no borra la suscripción', async () => {
    filas = [{ id: 'x', user_id: PADRE, subscription: suscripcion(1) }];
    const r = await enviarPushPadre(PADRE, { fetchImpl: async () => respuesta(500) });
    expect(r).toEqual({ enviadas: 0, caducadas: 0, fallidas: 1, motivo: 'ok' });
    expect(filas).toHaveLength(1);
  });

  test('sin suscripciones no falla y no llama al servicio push', async () => {
    const fetchFalso = vi.fn();
    const r = await enviarPushPadre(PADRE, { fetchImpl: fetchFalso });
    expect(r).toEqual({ enviadas: 0, caducadas: 0, fallidas: 0, motivo: 'sin_suscripciones' });
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  test('sin llaves VAPID no falla, no envía y deja un aviso en logs sin imprimir valores', async () => {
    delete process.env.VAPID_PRIVATE_KEY;
    filas = [{ id: 'x', user_id: PADRE, subscription: suscripcion(1) }];
    const fetchFalso = vi.fn();

    const r = await enviarPushPadre(PADRE, { fetchImpl: fetchFalso });

    expect(r.motivo).toBe('sin_llaves');
    expect(fetchFalso).not.toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('VAPID no configurado'));
    const todoLog = JSON.stringify(mockLogger.warn.mock.calls);
    expect(todoLog).not.toContain(PUBLIC_KEY);
    expect(todoLog).not.toContain(PRIVATE_KEY);
  });

  test('VAPID_SUBJECT inválido se trata como sin llaves', () => {
    process.env.VAPID_SUBJECT = 'mi-correo@ejemplo.co';
    expect(configuracionVapid()).toBeNull();
  });

  test('un error de base de datos devuelve error_inesperado sin lanzar', async () => {
    fallaConsulta = true;
    await expect(enviarPushPadre(PADRE, { fetchImpl: vi.fn() })).resolves.toEqual({
      enviadas: 0,
      caducadas: 0,
      fallidas: 0,
      motivo: 'error_inesperado',
    });
  });

  test('un fallo de red en una suscripción no impide enviar a las demás', async () => {
    filas = [
      { id: 'rota', user_id: PADRE, subscription: suscripcion(1) },
      { id: 'ok', user_id: PADRE, subscription: suscripcion(2) },
    ];
    const fetchFalso = vi.fn(async (url) => {
      if (url.endsWith('1')) throw new Error('ECONNRESET');
      return respuesta(201);
    });
    const r = await enviarPushPadre(PADRE, { fetchImpl: fetchFalso });
    expect(r).toEqual({ enviadas: 1, caducadas: 0, fallidas: 1, motivo: 'ok' });
  });

  test('no envía a endpoints que no son https', async () => {
    filas = [{ id: 'x', user_id: PADRE, subscription: { endpoint: 'http://ejemplo.co/push', keys: {} } }];
    const fetchFalso = vi.fn();
    const r = await enviarPushPadre(PADRE, { fetchImpl: fetchFalso });
    expect(fetchFalso).not.toHaveBeenCalled();
    expect(r.fallidas).toBe(1);
  });

  test('jwtVapid rechaza llaves con formato incorrecto', () => {
    expect(() => jwtVapid(suscripcion(1).endpoint, { publicKey: 'x', privateKey: 'y', subject: SUBJECT })).toThrow();
  });
});
