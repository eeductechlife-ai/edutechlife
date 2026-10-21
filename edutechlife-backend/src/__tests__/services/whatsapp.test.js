/**
 * Cliente de WhatsApp Business (services/whatsapp.js): solo envía plantillas
 * cuando está configurado, arma la petición como la espera Meta, no lanza
 * excepciones y no escribe el número completo en los logs.
 */
const loggerPath = require.resolve('../../utils/logger');
const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
require.cache[loggerPath] = { id: loggerPath, filename: loggerPath, loaded: true, exports: mockLogger };

const {
  whatsappConfigurado,
  enviarPlantilla,
  plantillas,
  limpiarParametro,
  numeroParaLog,
} = require('../../services/whatsapp');

const ENTORNO = ['WHATSAPP_ACTIVO', 'WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_API_VERSION'];
const TELEFONO = '+573001234567';

function configurar() {
  process.env.WHATSAPP_ACTIVO = 'true';
  process.env.WHATSAPP_TOKEN = 'token-de-prueba';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
}

describe('whatsapp: configuración', () => {
  const previo = {};
  beforeEach(() => {
    ENTORNO.forEach((k) => {
      previo[k] = process.env[k];
      delete process.env[k];
    });
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });
  afterEach(() => ENTORNO.forEach((k) => (previo[k] === undefined ? delete process.env[k] : (process.env[k] = previo[k]))));

  it('sin variables no está configurado y no llama a Meta', async () => {
    expect(whatsappConfigurado()).toBe(false);
    const r = await enviarPlantilla({ para: TELEFONO, plantilla: 'p', parametros: ['a'] });
    expect(r).toEqual({ ok: false, error: 'no_configurado' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('con token y número pero sin WHATSAPP_ACTIVO=true sigue apagado', () => {
    process.env.WHATSAPP_TOKEN = 't';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1';
    expect(whatsappConfigurado()).toBe(false);
  });

  it('con todo configurado queda activo', () => {
    configurar();
    expect(whatsappConfigurado()).toBe(true);
  });

  it('las plantillas tienen nombre por defecto y se pueden cambiar', () => {
    expect(plantillas()).toEqual({
      conexion: 'aviso_conexion_hijo',
      semanal: 'informe_semanal_hijo',
      verificacion: 'verificacion_padre',
    });
    process.env.WHATSAPP_TEMPLATE_CONEXION = 'otro_nombre';
    expect(plantillas().conexion).toBe('otro_nombre');
    delete process.env.WHATSAPP_TEMPLATE_CONEXION;
  });
});

describe('whatsapp: enviarPlantilla', () => {
  beforeEach(() => {
    configurar();
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ messages: [{ id: 'wamid.ABC' }] }),
    });
  });
  afterEach(() => ENTORNO.forEach((k) => delete process.env[k]));

  it('arma la petición como la espera Meta y devuelve el id del mensaje', async () => {
    const r = await enviarPlantilla({ para: TELEFONO, plantilla: 'aviso_conexion_hijo', parametros: ['Mateo', '15:04'] });
    expect(r).toEqual({ ok: true, id: 'wamid.ABC' });

    const [url, opciones] = global.fetch.mock.calls[0];
    expect(url).toBe('https://graph.facebook.com/v21.0/1234567890/messages');
    expect(opciones.method).toBe('POST');
    expect(opciones.headers.Authorization).toBe('Bearer token-de-prueba');
    expect(JSON.parse(opciones.body)).toEqual({
      messaging_product: 'whatsapp',
      to: '573001234567',
      type: 'template',
      template: {
        name: 'aviso_conexion_hijo',
        language: { code: 'es' },
        components: [{ type: 'body', parameters: [{ type: 'text', text: 'Mateo' }, { type: 'text', text: '15:04' }] }],
      },
    });
  });

  it('las plantillas de autenticación llevan también el botón con el código', async () => {
    await enviarPlantilla({ para: TELEFONO, plantilla: 'verificacion_padre', parametros: ['123456'], parametroBoton: '123456' });
    const cuerpo = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(cuerpo.template.components[1]).toEqual({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [{ type: 'text', text: '123456' }],
    });
  });

  it('rechaza un teléfono que no está en formato internacional sin llamar a Meta', async () => {
    for (const malo of ['3001234567', '573001234567', '+0123', '', null]) {
      expect(await enviarPlantilla({ para: malo, plantilla: 'p', parametros: [] })).toEqual({
        ok: false,
        error: 'telefono_invalido',
      });
    }
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('si Meta rechaza el mensaje devuelve el error y no escribe el número completo en los logs', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { code: 131026, message: 'no se pudo entregar' } }),
    });
    const r = await enviarPlantilla({ para: TELEFONO, plantilla: 'p', parametros: ['a'] });
    expect(r).toEqual({ ok: false, error: 'http_400_131026' });
    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    const registro = JSON.stringify(mockLogger.warn.mock.calls[0]);
    expect(registro).not.toContain(TELEFONO);
    expect(registro).not.toContain('3001234567');
    expect(registro).toContain('***4567');
  });

  it('un fallo de red no lanza excepción', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('ECONNRESET'));
    expect(await enviarPlantilla({ para: TELEFONO, plantilla: 'p', parametros: ['a'] })).toEqual({ ok: false, error: 'red' });
  });

  it('si Meta tarda demasiado se corta y devuelve tiempo_agotado', async () => {
    global.fetch = vi.fn().mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    expect(await enviarPlantilla({ para: TELEFONO, plantilla: 'p', parametros: ['a'] })).toEqual({
      ok: false,
      error: 'tiempo_agotado',
    });
  });
});

describe('whatsapp: parámetros y registro', () => {
  it('limpiarParametro quita saltos de línea, espacios repetidos y recorta', () => {
    expect(limpiarParametro('a\nb\t c   d')).toBe('a b c d');
    expect(limpiarParametro('x'.repeat(200))).toHaveLength(60);
  });

  it('un parámetro vacío se reemplaza por un guion (Meta no admite vacíos)', () => {
    expect(limpiarParametro('')).toBe('-');
    expect(limpiarParametro(null)).toBe('-');
    expect(limpiarParametro('   ')).toBe('-');
  });

  it('numeroParaLog solo deja los últimos 4 dígitos', () => {
    expect(numeroParaLog('+573001234567')).toBe('***4567');
    expect(numeroParaLog('')).toBe('***');
  });
});
