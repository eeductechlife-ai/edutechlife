/**
 * Aviso por WhatsApp al padre en cada conexión del niño
 * (services/avisoWhatsappPadres.js). Decisión del CEO 2026-10-21.
 *
 * La base se simula en memoria con claves únicas, porque el anti-duplicado
 * depende de ellas; el cliente de WhatsApp es el real y solo se simula fetch.
 */
const { instalarSupabaseFalso } = require('../helpers/supabaseMemoriaAvisos');

const supabasePath = require.resolve('../../db/supabase');
const loggerPath = require.resolve('../../utils/logger');
const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

const estado = { tablas: {}, unicas: {}, fallos: {} };
instalarSupabaseFalso(supabasePath, estado);
require.cache[loggerPath] = { id: loggerPath, filename: loggerPath, loaded: true, exports: mockLogger };

const { avisarConexionWhatsApp, referenciaVentana } = require('../../services/avisoWhatsappPadres');
const { avisarInicioSesionMenor } = require('../../services/avisoPadreLogin');

const NIÑO = '11111111-1111-4111-8111-111111111111';
const PADRE = '22222222-2222-4222-8222-222222222222';
const PADRE_2 = '33333333-3333-4333-8333-333333333333';
const AHORA = new Date('2026-10-13T20:04:00.000Z'); // 15:04 en Bogotá
const MIN = 60_000;

const ENTORNO = ['WHATSAPP_ACTIVO', 'WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_VENTANA_CONEXION_MIN', 'RESEND_API_KEY'];

function sembrar({ consentimientos } = {}) {
  estado.tablas = {
    whatsapp_padres: consentimientos ?? [
      { parent_user_id: PADRE, telefono: '+573001112233', activo: true, aviso_conexion: true, informe_semanal: true },
    ],
    avisos_padres_envios: [],
    students: [{ auth_id: NIÑO, name: 'Mateo Pérez', age: 10 }],
    users: [
      { id: NIÑO, first_name: 'Mateo', email: 'nino@ejemplo.co' },
      { id: PADRE, email: 'padre@ejemplo.co' },
      { id: PADRE_2, email: 'madre@ejemplo.co' },
    ],
    parent_student_links: [{ parent_user_id: PADRE, student_user_id: NIÑO, is_active: true }],
    aviso_padre_login: [],
    push_subscriptions: [],
  };
  estado.unicas = {
    avisos_padres_envios: ['tipo', 'canal', 'parent_user_id', 'student_id', 'referencia'],
    aviso_padre_login: ['student_id'],
  };
  estado.fallos = {};
}

const respuestaOk = () => ({ ok: true, status: 200, json: async () => ({ messages: [{ id: 'wamid.1' }] }) });
const cuerpos = () => global.fetch.mock.calls.map(([, o]) => JSON.parse(o.body));

describe('avisarConexionWhatsApp', () => {
  const previo = {};
  beforeEach(() => {
    ENTORNO.forEach((k) => {
      previo[k] = process.env[k];
      delete process.env[k];
    });
    process.env.WHATSAPP_ACTIVO = 'true';
    process.env.WHATSAPP_TOKEN = 't';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '999';
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue(respuestaOk());
    sembrar();
  });
  afterEach(() => ENTORNO.forEach((k) => (previo[k] === undefined ? delete process.env[k] : (process.env[k] = previo[k]))));

  const avisar = (ahora = AHORA, padreIds = [PADRE]) =>
    avisarConexionWhatsApp({ studentId: NIÑO, nombre: 'Mateo Pérez', padreIds, ahora });

  it('el padre con consentimiento recibe el nombre de pila del niño y la hora', async () => {
    const r = await avisar();
    expect(r).toEqual({ enviados: 1, omitidos: 0, fallos: 0 });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const cuerpo = cuerpos()[0];
    expect(cuerpo.to).toBe('573001112233');
    expect(cuerpo.template.name).toBe('aviso_conexion_hijo');
    expect(cuerpo.template.components[0].parameters.map((p) => p.text)).toEqual(['Mateo', '15:04']);
  });

  it('el mensaje no lleva el apellido ni nada más del niño', async () => {
    await avisar();
    const texto = JSON.stringify(cuerpos()[0]);
    expect(texto).not.toContain('Pérez');
    expect(texto).not.toContain('nino@ejemplo.co');
  });

  it('queda registrado como enviado', async () => {
    await avisar();
    expect(estado.tablas.avisos_padres_envios).toHaveLength(1);
    expect(estado.tablas.avisos_padres_envios[0]).toMatchObject({
      tipo: 'conexion',
      canal: 'whatsapp',
      parent_user_id: PADRE,
      student_id: NIÑO,
      estado: 'enviado',
      mensaje_id: 'wamid.1',
    });
  });

  it('un segundo inicio de sesión dentro de la ventana no repite el mensaje', async () => {
    await avisar(AHORA);
    const r = await avisar(new Date(AHORA.getTime() + 3 * MIN));
    expect(r).toEqual({ enviados: 0, omitidos: 1, fallos: 0 });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('pasada la ventana, una nueva conexión vuelve a avisar', async () => {
    await avisar(new Date('2026-10-13T20:00:00.000Z'));
    const r = await avisar(new Date('2026-10-13T20:11:00.000Z'));
    expect(r.enviados).toBe(1);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('dos inicios de sesión simultáneos envían un solo mensaje', async () => {
    const [a, b] = await Promise.all([avisar(), avisar()]);
    expect(a.enviados + b.enviados).toBe(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('con WHATSAPP_VENTANA_CONEXION_MIN=0 cada inicio de sesión envía un mensaje', async () => {
    process.env.WHATSAPP_VENTANA_CONEXION_MIN = '0';
    await avisar(new Date('2026-10-13T20:04:00.000Z'));
    await avisar(new Date('2026-10-13T20:04:00.001Z'));
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('si el envío falla, libera la reserva y el siguiente inicio de sesión reintenta', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: { code: 131047 } }) });
    expect((await avisar()).fallos).toBe(1);
    expect(estado.tablas.avisos_padres_envios).toHaveLength(0);

    global.fetch = vi.fn().mockResolvedValue(respuestaOk());
    expect((await avisar(new Date(AHORA.getTime() + MIN))).enviados).toBe(1);
  });

  it('un padre que falla no impide avisar al otro', async () => {
    sembrar({
      consentimientos: [
        { parent_user_id: PADRE, telefono: '+573001112233', activo: true, aviso_conexion: true },
        { parent_user_id: PADRE_2, telefono: '+573009998877', activo: true, aviso_conexion: true },
      ],
    });
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({}) })
      .mockResolvedValueOnce(respuestaOk());
    expect(await avisar(AHORA, [PADRE, PADRE_2])).toEqual({ enviados: 1, omitidos: 0, fallos: 1 });
  });

  it.each([
    ['sin consentimiento', []],
    ['dado de baja', [{ parent_user_id: PADRE, telefono: '+573001112233', activo: false, aviso_conexion: true }]],
    ['con el aviso de conexión apagado', [{ parent_user_id: PADRE, telefono: '+573001112233', activo: true, aviso_conexion: false }]],
  ])('el padre %s no recibe nada', async (_, consentimientos) => {
    sembrar({ consentimientos });
    expect(await avisar()).toEqual({ enviados: 0, omitidos: 0, fallos: 0 });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('un padre vinculado que no es el del consentimiento no recibe nada', async () => {
    expect((await avisar(AHORA, [PADRE_2])).enviados).toBe(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('apagado (sin configurar) no consulta la base ni llama a Meta', async () => {
    delete process.env.WHATSAPP_ACTIVO;
    estado.fallos.whatsapp_padres = true; // si consultara la base, fallaría
    expect(await avisar()).toEqual({ enviados: 0, omitidos: 0, fallos: 0 });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('un error de la base no lanza excepción y se registra', async () => {
    estado.fallos.whatsapp_padres = true;
    await expect(avisar()).resolves.toEqual({ enviados: 0, omitidos: 0, fallos: 0 });
    expect(mockLogger.error).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('referenciaVentana: mismo número dentro de la ventana y distinto fuera', () => {
    const a = referenciaVentana(new Date('2026-10-13T20:00:00.000Z'));
    expect(referenciaVentana(new Date('2026-10-13T20:09:59.000Z'))).toBe(a);
    expect(referenciaVentana(new Date('2026-10-13T20:10:00.000Z'))).not.toBe(a);
  });
});

describe('integración con el inicio de sesión (avisarInicioSesionMenor)', () => {
  beforeEach(() => {
    ENTORNO.forEach((k) => delete process.env[k]);
    process.env.WHATSAPP_ACTIVO = 'true';
    process.env.WHATSAPP_TOKEN = 't';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '999';
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue(respuestaOk());
    sembrar();
  });
  afterEach(() => ENTORNO.forEach((k) => delete process.env[k]));

  it('el WhatsApp sale aunque el correo no esté configurado', async () => {
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(r.motivo).toBe('sin_resend'); // el correo sigue sin configurar
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(cuerpos()[0].to).toBe('573001112233');
  });

  it('el WhatsApp sale en cada conexión aunque el correo ya salió en las últimas 24 h', async () => {
    process.env.RESEND_API_KEY = 're_test';
    estado.tablas.aviso_padre_login = [{ student_id: NIÑO, ultimo_aviso_at: new Date(AHORA.getTime() - 3600_000).toISOString() }];
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: new Date(AHORA.getTime() + 20 * MIN) });
    expect(r.motivo).toBe('ventana_24h'); // el correo no se repite
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1)); // el WhatsApp sí
  });

  it('sin padre vinculado no se envía nada', async () => {
    estado.tablas.parent_student_links = [];
    const r = await avisarInicioSesionMenor(NIÑO, { ahora: AHORA });
    expect(r.motivo).toBe('sin_padre');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
