/**
 * Rutas de los avisos por WhatsApp del padre (routes/ingenia/whatsappPadres.js),
 * de punta a punta: ruta -> servicio -> base simulada. Solo se simulan la
 * autenticación, el limitador de peticiones y la llamada a Meta.
 */
const request = require('supertest');
const express = require('express');
const { instalarSupabaseFalso } = require('../helpers/supabaseMemoriaAvisos');

const supabasePath = require.resolve('../../db/supabase');
const authPath = require.resolve('../../middleware/auth');
const limiterPath = require.resolve('../../middleware/rateLimiter');
const loggerPath = require.resolve('../../utils/logger');

const estado = { tablas: {}, unicas: {}, fallos: {} };
instalarSupabaseFalso(supabasePath, estado);
// La sesión se simula con una cabecera: sin ella, 401.
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    requireAuth: (req, res, next) => {
      if (!req.headers['x-usuario']) return res.status(401).json({ error: 'No autenticado' });
      req.userId = req.headers['x-usuario'];
      next();
    },
  },
};
require.cache[limiterPath] = {
  id: limiterPath,
  filename: limiterPath,
  loaded: true,
  exports: { whatsappCodigoLimiter: (req, res, next) => next() },
};
require.cache[loggerPath] = {
  id: loggerPath,
  filename: loggerPath,
  loaded: true,
  exports: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
};

const router = require('../../routes/ingenia/whatsappPadres');
const { VERSION_TEXTO } = require('../../services/whatsappPadresPrefs');

const app = express();
app.use(express.json());
app.use('/api/ingenia', router);

const PADRE = '22222222-2222-4222-8222-222222222222';
const NIÑO = '11111111-1111-4111-8111-111111111111';
const ENTORNO = ['WHATSAPP_ACTIVO', 'WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'];
const como = (r) => r.set('x-usuario', PADRE);
const codigoEnviado = () => JSON.parse(global.fetch.mock.calls.at(-1)[1].body).template.components[0].parameters[0].text;
const solicitud = (extra = {}) => ({ telefono: '3001112233', acepta: true, version: VERSION_TEXTO, ...extra });

describe('rutas /api/ingenia/padre/whatsapp', () => {
  const previo = {};
  beforeEach(() => {
    ENTORNO.forEach((k) => {
      previo[k] = process.env[k];
      delete process.env[k];
    });
    process.env.WHATSAPP_ACTIVO = 'true';
    process.env.WHATSAPP_TOKEN = 't';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '999';
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ messages: [{ id: 'w1' }] }) });
    estado.tablas = {
      parent_student_links: [{ parent_user_id: PADRE, student_user_id: NIÑO, is_active: true }],
      users: [{ id: PADRE, user_type: 'parent' }],
      whatsapp_padres: [],
    };
    estado.unicas = { whatsapp_padres: ['parent_user_id'] };
    estado.fallos = {};
  });
  afterEach(() => ENTORNO.forEach((k) => (previo[k] === undefined ? delete process.env[k] : (process.env[k] = previo[k]))));

  it('todas las rutas exigen sesión (401)', async () => {
    const base = '/api/ingenia/padre/whatsapp';
    const respuestas = await Promise.all([
      request(app).get(base),
      request(app).post(`${base}/codigo`).send(solicitud()),
      request(app).post(`${base}/confirmar`).send({ codigo: '123456' }),
      request(app).put(base).send({ avisoConexion: false }),
      request(app).delete(base),
    ]);
    expect(respuestas.map((r) => r.status)).toEqual([401, 401, 401, 401, 401]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('GET informa si está disponible, el texto vigente y el estado del padre', async () => {
    const r = await como(request(app).get('/api/ingenia/padre/whatsapp'));
    expect(r.status).toBe(200);
    expect(r.body).toEqual({
      disponible: true,
      versionTexto: VERSION_TEXTO,
      preferencias: { activo: false, telefonoVisible: null, avisoConexion: true, informeSemanal: true, verificacionPendiente: false },
    });
  });

  it('flujo completo: pedir código, confirmar, cambiar un aviso y darse de baja', async () => {
    const base = '/api/ingenia/padre/whatsapp';

    const pedido = await como(request(app).post(`${base}/codigo`).send(solicitud()));
    expect(pedido.status).toBe(201);
    expect(pedido.body).toEqual({ enviado: true, expiraEnMinutos: 10 });
    expect(JSON.stringify(pedido.body)).not.toContain(codigoEnviado());

    const confirmado = await como(request(app).post(`${base}/confirmar`).send({ codigo: codigoEnviado() }));
    expect(confirmado.status).toBe(200);
    expect(confirmado.body.preferencias).toMatchObject({ activo: true, telefonoVisible: '•••• 2233' });

    const cambiado = await como(request(app).put(base).send({ avisoConexion: false }));
    expect(cambiado.status).toBe(200);
    expect(cambiado.body.preferencias).toMatchObject({ activo: true, avisoConexion: false, informeSemanal: true });

    const baja = await como(request(app).delete(base));
    expect(baja.status).toBe(200);
    expect(baja.body.preferencias.activo).toBe(false);
  });

  it('ninguna respuesta incluye el número completo', async () => {
    const base = '/api/ingenia/padre/whatsapp';
    await como(request(app).post(`${base}/codigo`).send(solicitud()));
    await como(request(app).post(`${base}/confirmar`).send({ codigo: codigoEnviado() }));
    const r = await como(request(app).get(base));
    expect(JSON.stringify(r.body)).not.toContain('3001112233');
  });

  it('los errores del servicio llegan con su estado y su motivo', async () => {
    const base = '/api/ingenia/padre/whatsapp';
    const sinAceptar = await como(request(app).post(`${base}/codigo`).send(solicitud({ acepta: false })));
    expect([sinAceptar.status, sinAceptar.body.motivo]).toEqual([400, 'falta_aceptacion']);

    const telefono = await como(request(app).post(`${base}/codigo`).send(solicitud({ telefono: '123' })));
    expect([telefono.status, telefono.body.motivo]).toEqual([400, 'telefono_invalido']);

    const incorrecto = await como(request(app).post(`${base}/codigo`).send(solicitud()));
    expect(incorrecto.status).toBe(201);
    const malo = await como(request(app).post(`${base}/confirmar`).send({ codigo: '000000' === codigoEnviado() ? '111111' : '000000' }));
    expect([malo.status, malo.body.motivo]).toEqual([400, 'codigo_incorrecto']);

    const sinActivar = await como(request(app).put(base).send({ avisoConexion: true }));
    expect([sinActivar.status, sinActivar.body.motivo]).toEqual([409, 'no_activo']);
  });

  it('quien no es padre recibe 403', async () => {
    estado.tablas.parent_student_links = [];
    estado.tablas.users = [{ id: PADRE, user_type: 'student' }];
    const r = await como(request(app).post('/api/ingenia/padre/whatsapp/codigo').send(solicitud()));
    expect([r.status, r.body.motivo]).toEqual([403, 'no_es_padre']);
  });

  it('sin WhatsApp configurado en el servidor, pedir el código responde 503', async () => {
    delete process.env.WHATSAPP_ACTIVO;
    const r = await como(request(app).post('/api/ingenia/padre/whatsapp/codigo').send(solicitud()));
    expect([r.status, r.body.motivo]).toEqual([503, 'no_disponible']);
  });

  it('un error inesperado de la base responde 500 sin detalles internos', async () => {
    estado.fallos.whatsapp_padres = true;
    const r = await como(request(app).get('/api/ingenia/padre/whatsapp'));
    expect(r.status).toBe(500);
    expect(JSON.stringify(r.body)).not.toContain('boom');
  });
});
