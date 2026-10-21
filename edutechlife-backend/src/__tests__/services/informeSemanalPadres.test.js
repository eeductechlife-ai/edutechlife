/**
 * Informe semanal al padre (services/informeSemanalPadres.js). Decisión del CEO
 * 2026-10-21: un informe por semana, por WhatsApp si el padre aceptó y por
 * correo si no. Sale los lunes desde las 8:00 (hora de Colombia) y cubre la
 * semana anterior.
 */
const { instalarSupabaseFalso } = require('../helpers/supabaseMemoriaAvisos');

const supabasePath = require.resolve('../../db/supabase');
const emailPath = require.resolve('../../services/emailService');
const loggerPath = require.resolve('../../utils/logger');
const mockEmail = { sendEmail: vi.fn() };
const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

const estado = { tablas: {}, unicas: {}, fallos: {} };
instalarSupabaseFalso(supabasePath, estado);
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true, exports: mockEmail };
require.cache[loggerPath] = { id: loggerPath, filename: loggerPath, loaded: true, exports: mockLogger };

const {
  semanaAnterior,
  esMomentoDeEnviar,
  resumenSemana,
  enviarInformesSemanales,
  startInformesSemanalesPadres,
} = require('../../services/informeSemanalPadres');

const NIÑO = '11111111-1111-4111-8111-111111111111';
const PADRE = '22222222-2222-4222-8222-222222222222';
// Lunes 26 de octubre de 2026, 09:00 en Bogotá. La semana anterior es 19-25 oct.
const LUNES = new Date('2026-10-26T14:00:00.000Z');

const ENTORNO = [
  'WHATSAPP_ACTIVO', 'WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'RESEND_API_KEY', 'INFORME_SEMANAL_PADRES',
];

/**
 * Bloque de datos del niño (smartboard_kids_data), la misma fuente del informe
 * que el padre puede pedir a mano. La semana del informe es 19-25 de octubre.
 */
const BLOQUE = {
  pointsHistory: [
    { points: 50, timestamp: '2026-10-20T15:00:00.000Z' }, // dentro
    { points: 30, timestamp: '2026-10-22T15:00:00.000Z' }, // dentro
    { points: 100, timestamp: '2026-10-27T15:00:00.000Z' }, // después de la semana
    { points: 100, timestamp: '2026-10-18T15:00:00.000Z' }, // antes de la semana
  ],
  sessions: [
    { start_time: '2026-10-19T14:00:00.000Z' }, // día 19
    { start_time: '2026-10-21T15:00:00.000Z' }, // día 21
    { start_time: '2026-10-25T03:00:00.000Z' },
  ],
  streak: 4,
  completedMissions: ['m1', 'm2'],
};

function sembrar({ consentimiento = true, datos = true } = {}) {
  estado.tablas = {
    parent_student_links: [{ parent_user_id: PADRE, student_user_id: NIÑO, is_active: true }],
    users: [
      { id: NIÑO, first_name: 'Mateo', email: 'nino@ejemplo.co' },
      { id: PADRE, email: 'Padre@Ejemplo.co' },
    ],
    smartboard_kids_data: datos ? [{ user_id: NIÑO, data: JSON.parse(JSON.stringify(BLOQUE)) }] : [],
    whatsapp_padres: consentimiento
      ? [{ parent_user_id: PADRE, telefono: '+573001112233', activo: true, informe_semanal: true, aviso_conexion: true }]
      : [],
    avisos_padres_envios: [],
  };
  estado.unicas = { avisos_padres_envios: ['tipo', 'canal', 'parent_user_id', 'student_id', 'referencia'] };
  estado.fallos = {};
}

const respuestaOk = () => ({ ok: true, status: 200, json: async () => ({ messages: [{ id: 'wamid.7' }] }) });

describe('semanaAnterior / esMomentoDeEnviar (hora de Colombia)', () => {
  it('un lunes cubre de lunes 00:00 a lunes 00:00 de la semana anterior', () => {
    const s = semanaAnterior(LUNES);
    expect(s.desde.toISOString()).toBe('2026-10-19T05:00:00.000Z');
    expect(s.hasta.toISOString()).toBe('2026-10-26T05:00:00.000Z');
    expect(s.clave).toBe('2026-10-19');
  });

  it('el domingo por la noche (hora de Colombia) todavía pertenece a la semana en curso', () => {
    // dom 25 oct, 23:30 en Bogotá = lun 26 oct, 04:30 UTC
    const s = semanaAnterior(new Date('2026-10-26T04:30:00.000Z'));
    expect(s.clave).toBe('2026-10-12');
  });

  it('el mismo lunes, justo después de las 00:00 en Bogotá, ya cuenta como lunes', () => {
    expect(semanaAnterior(new Date('2026-10-26T05:00:00.000Z')).clave).toBe('2026-10-19');
  });

  it('solo es momento de enviar el lunes desde las 8:00 en Colombia', () => {
    expect(esMomentoDeEnviar(new Date('2026-10-26T12:59:00.000Z'))).toBe(false); // 07:59
    expect(esMomentoDeEnviar(new Date('2026-10-26T13:00:00.000Z'))).toBe(true); // 08:00
    expect(esMomentoDeEnviar(new Date('2026-10-26T23:00:00.000Z'))).toBe(true); // 18:00
    expect(esMomentoDeEnviar(new Date('2026-10-27T14:00:00.000Z'))).toBe(false); // martes
    expect(esMomentoDeEnviar(new Date('2026-10-25T14:00:00.000Z'))).toBe(false); // domingo
  });
});

describe('resumenSemana', () => {
  beforeEach(() => sembrar());
  const { hasta } = semanaAnterior(LUNES);

  it('suma solo lo de la semana y usa la misma función que el informe manual', async () => {
    expect(await resumenSemana(NIÑO, hasta)).toEqual({
      nombre: 'Mateo',
      diasActivos: 5, // días 19, 20, 21, 22 y 25: puntos y sesiones de la semana
      puntos: 80, // 50 + 30; los de fuera de la semana no cuentan
      racha: 4,
      misiones: 2,
    });
  });

  it('un niño sin actividad devuelve ceros, no un error', async () => {
    estado.tablas.smartboard_kids_data[0].data = {};
    expect(await resumenSemana(NIÑO, hasta)).toEqual({ nombre: 'Mateo', diasActivos: 0, puntos: 0, racha: 0, misiones: 0 });
  });

  it('sin datos guardados devuelve null', async () => {
    sembrar({ datos: false });
    expect(await resumenSemana(NIÑO, hasta)).toBeNull();
  });

  it('un error de la base se propaga para que el envío se reintente', async () => {
    estado.fallos.smartboard_kids_data = true;
    await expect(resumenSemana(NIÑO, hasta)).rejects.toBeTruthy();
  });
});

describe('enviarInformesSemanales', () => {
  const previo = {};
  beforeEach(() => {
    ENTORNO.forEach((k) => {
      previo[k] = process.env[k];
      delete process.env[k];
    });
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue(respuestaOk());
    mockEmail.sendEmail.mockResolvedValue({ success: true, messageId: 'm1' });
    sembrar();
  });
  afterEach(() => ENTORNO.forEach((k) => (previo[k] === undefined ? delete process.env[k] : (process.env[k] = previo[k]))));

  const conWhatsApp = () => {
    process.env.WHATSAPP_ACTIVO = 'true';
    process.env.WHATSAPP_TOKEN = 't';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '999';
  };
  const conCorreo = () => (process.env.RESEND_API_KEY = 're_test');

  it('el padre que aceptó WhatsApp recibe el informe por ahí, con las cifras de la semana', async () => {
    conWhatsApp();
    expect(await enviarInformesSemanales({ ahora: LUNES })).toEqual({ enviados: 1, omitidos: 0, fallos: 0 });
    const cuerpo = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(cuerpo.to).toBe('573001112233');
    expect(cuerpo.template.name).toBe('informe_semanal_hijo');
    expect(cuerpo.template.components[0].parameters.map((p) => p.text)).toEqual([
      'Mateo', '19 de octubre', '25 de octubre', '5', '80', '2', '4',
    ]);
    expect(mockEmail.sendEmail).not.toHaveBeenCalled();
  });

  it('el padre sin WhatsApp recibe el informe por correo', async () => {
    conWhatsApp();
    conCorreo();
    sembrar({ consentimiento: false });
    expect((await enviarInformesSemanales({ ahora: LUNES })).enviados).toBe(1);
    expect(global.fetch).not.toHaveBeenCalled();
    const [para, asunto, html, texto] = mockEmail.sendEmail.mock.calls[0];
    expect(para).toBe('padre@ejemplo.co');
    expect(asunto).toMatch(/informe semanal/i);
    expect(texto).toContain('5 días');
    expect(texto).toContain('80 puntos');
    expect(texto).toContain('Racha actual: 4 días');
    expect(texto).toContain('2 misiones completadas');
    expect(html).toContain('/ingenia/padres');
  });

  it('si WhatsApp no está configurado, el padre que lo aceptó recibe el correo', async () => {
    conCorreo();
    expect((await enviarInformesSemanales({ ahora: LUNES })).enviados).toBe(1);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockEmail.sendEmail).toHaveBeenCalledTimes(1);
  });

  it('sin WhatsApp ni correo configurados no envía nada y no deja reservas', async () => {
    sembrar({ consentimiento: false });
    expect(await enviarInformesSemanales({ ahora: LUNES })).toEqual({ enviados: 0, omitidos: 1, fallos: 0 });
    expect(estado.tablas.avisos_padres_envios).toHaveLength(0);
  });

  it('el informe no lleva nada fuera de las cifras', async () => {
    conCorreo();
    sembrar({ consentimiento: false });
    await enviarInformesSemanales({ ahora: LUNES });
    const todo = JSON.stringify(mockEmail.sendEmail.mock.calls[0]);
    expect(todo).not.toContain('Pérez');
    expect(todo).not.toContain('nino@ejemplo.co');
  });

  it('es idempotente: una segunda corrida el mismo lunes no repite el informe', async () => {
    conWhatsApp();
    await enviarInformesSemanales({ ahora: LUNES });
    const r = await enviarInformesSemanales({ ahora: new Date(LUNES.getTime() + 3600_000) });
    expect(r).toEqual({ enviados: 0, omitidos: 1, fallos: 0 });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('dos instancias a la vez envían un solo informe', async () => {
    conWhatsApp();
    const [a, b] = await Promise.all([enviarInformesSemanales({ ahora: LUNES }), enviarInformesSemanales({ ahora: LUNES })]);
    expect(a.enviados + b.enviados).toBe(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('la semana siguiente vuelve a enviar', async () => {
    conWhatsApp();
    await enviarInformesSemanales({ ahora: LUNES });
    const r = await enviarInformesSemanales({ ahora: new Date('2026-11-02T14:00:00.000Z') });
    expect(r.enviados).toBe(1);
  });

  it('fuera del lunes 8:00 no envía; con forzar sí', async () => {
    conWhatsApp();
    const martes = new Date('2026-10-27T14:00:00.000Z');
    expect(await enviarInformesSemanales({ ahora: martes })).toEqual({ enviados: 0, omitidos: 0, fallos: 0 });
    expect(global.fetch).not.toHaveBeenCalled();
    expect((await enviarInformesSemanales({ ahora: LUNES, forzar: true })).enviados).toBe(1);
  });

  it('si el envío falla libera la reserva y la siguiente corrida reintenta', async () => {
    conWhatsApp();
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    expect((await enviarInformesSemanales({ ahora: LUNES })).fallos).toBe(1);
    expect(estado.tablas.avisos_padres_envios).toHaveLength(0);
    global.fetch = vi.fn().mockResolvedValue(respuestaOk());
    expect((await enviarInformesSemanales({ ahora: new Date(LUNES.getTime() + 3600_000) })).enviados).toBe(1);
  });

  it('un niño sin datos guardados se omite y no deja reservas', async () => {
    conWhatsApp();
    sembrar({ datos: false });
    expect(await enviarInformesSemanales({ ahora: LUNES })).toEqual({ enviados: 0, omitidos: 1, fallos: 0 });
    expect(estado.tablas.avisos_padres_envios).toHaveLength(0);
  });

  it('un vínculo inactivo no recibe informe', async () => {
    conWhatsApp();
    estado.tablas.parent_student_links[0].is_active = false;
    expect(await enviarInformesSemanales({ ahora: LUNES })).toEqual({ enviados: 0, omitidos: 0, fallos: 0 });
  });

  it('un error de la base no lanza excepción', async () => {
    conWhatsApp();
    estado.fallos.parent_student_links = true;
    await expect(enviarInformesSemanales({ ahora: LUNES })).resolves.toEqual({ enviados: 0, omitidos: 0, fallos: 0 });
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('un padre con dos hijos recibe un informe por cada uno', async () => {
    conWhatsApp();
    const HERMANO = '44444444-4444-4444-8444-444444444444';
    estado.tablas.parent_student_links.push({ parent_user_id: PADRE, student_user_id: HERMANO, is_active: true });
    estado.tablas.smartboard_kids_data.push({ user_id: HERMANO, data: {} });
    estado.tablas.users.push({ id: HERMANO, first_name: 'Sara' });
    expect((await enviarInformesSemanales({ ahora: LUNES })).enviados).toBe(2);
  });
});

describe('startInformesSemanalesPadres', () => {
  afterEach(() => delete process.env.INFORME_SEMANAL_PADRES);

  it('está apagado por defecto', () => {
    delete process.env.INFORME_SEMANAL_PADRES;
    expect(startInformesSemanalesPadres()).toBeNull();
  });

  it('se enciende solo con INFORME_SEMANAL_PADRES=true', () => {
    process.env.INFORME_SEMANAL_PADRES = 'true';
    sembrar();
    const timer = startInformesSemanalesPadres();
    expect(timer).not.toBeNull();
    clearInterval(timer);
  });
});
