/**
 * Preferencias de WhatsApp del padre (services/whatsappPadresPrefs.js): nada se
 * activa sin aceptación, número y código de verificación que llegue a ese
 * WhatsApp. El número completo y el código nunca salen del servidor.
 */
const { instalarSupabaseFalso } = require('../helpers/supabaseMemoriaAvisos');

const supabasePath = require.resolve('../../db/supabase');
const loggerPath = require.resolve('../../utils/logger');
const mockLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
const estado = { tablas: {}, unicas: {}, fallos: {} };
instalarSupabaseFalso(supabasePath, estado);
require.cache[loggerPath] = { id: loggerPath, filename: loggerPath, loaded: true, exports: mockLogger };

const prefs = require('../../services/whatsappPadresPrefs');

const PADRE = '22222222-2222-4222-8222-222222222222';
const NIÑO = '11111111-1111-4111-8111-111111111111';
const AHORA = new Date('2026-10-21T15:00:00.000Z');
const MIN = 60_000;
const NUMERO = '3001112233';
const E164 = '+573001112233';
const ENTORNO = ['WHATSAPP_ACTIVO', 'WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'];

function sembrar({ esPadre = true } = {}) {
  estado.tablas = {
    parent_student_links: esPadre ? [{ parent_user_id: PADRE, student_user_id: NIÑO, is_active: true }] : [],
    users: [{ id: PADRE, user_type: 'student' }],
    whatsapp_padres: [],
  };
  estado.unicas = { whatsapp_padres: ['parent_user_id'] };
  estado.fallos = {};
}

const fila = () => estado.tablas.whatsapp_padres[0];
const respuestaOk = () => ({ ok: true, status: 200, json: async () => ({ messages: [{ id: 'wamid.9' }] }) });
/** El código que se envió por WhatsApp, leído de lo que recibió Meta. */
const codigoEnviado = () => {
  const cuerpo = JSON.parse(global.fetch.mock.calls.at(-1)[1].body);
  return cuerpo.template.components[0].parameters[0].text;
};
const pedir = (extra = {}, ahora = AHORA) =>
  prefs.solicitarCodigo(PADRE, { telefono: NUMERO, acepta: true, version: prefs.VERSION_TEXTO, ...extra }, { ahora });
const error = async (promesa) => promesa.then(() => null, (e) => e);

describe('normalizarTelefono', () => {
  it.each([
    ['3001112233', '+573001112233'],
    ['+57 300 111 2233', '+573001112233'],
    ['(300) 111-2233', '+573001112233'],
    ['573001112233', '+573001112233'],
    ['+573001112233', '+573001112233'],
    ['+1 415 555 2671', '+14155552671'],
  ])('%s -> %s', (entrada, esperado) => {
    expect(prefs.normalizarTelefono(entrada)).toBe(esperado);
  });

  it.each(['12345', 'abc', '', null, undefined, '+0123456789', '30011122', '2001112233', '+57'])(
    'rechaza %j',
    (entrada) => {
      expect(prefs.normalizarTelefono(entrada)).toBeNull();
    },
  );
});

describe('preferencias de WhatsApp: verificación y consentimiento', () => {
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

  describe('obtenerPreferencias', () => {
    it('sin configuración previa: avisos disponibles, nada activo', async () => {
      expect(await prefs.obtenerPreferencias(PADRE)).toEqual({
        disponible: true,
        versionTexto: prefs.VERSION_TEXTO,
        preferencias: { activo: false, telefonoVisible: null, avisoConexion: true, informeSemanal: true, verificacionPendiente: false },
      });
    });

    it('sin WhatsApp configurado en el servidor, avisa que no está disponible', async () => {
      delete process.env.WHATSAPP_ACTIVO;
      expect((await prefs.obtenerPreferencias(PADRE)).disponible).toBe(false);
    });
  });

  describe('solicitarCodigo', () => {
    it('envía un código de 6 dígitos al número y guarda solo su hash', async () => {
      expect(await pedir()).toEqual({ enviado: true, expiraEnMinutos: 10 });
      const cuerpo = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(cuerpo.to).toBe('573001112233');
      expect(cuerpo.template.name).toBe('verificacion_padre');
      const codigo = codigoEnviado();
      expect(codigo).toMatch(/^\d{6}$/);
      expect(cuerpo.template.components[1].parameters[0].text).toBe(codigo); // el botón lleva el mismo código

      expect(fila().telefono_pendiente).toBe(E164);
      expect(fila().codigo_hash).toMatch(/^[0-9a-f]{64}$/);
      expect(JSON.stringify(fila())).not.toContain(codigo);
      expect(Date.parse(fila().codigo_expira_at)).toBe(AHORA.getTime() + 10 * MIN);
    });

    it('todavía no activa nada: el padre no recibe avisos hasta confirmar', async () => {
      await pedir();
      expect(fila().activo).toBeFalsy();
      expect(fila().telefono ?? null).toBeNull();
      expect((await prefs.obtenerPreferencias(PADRE, { ahora: AHORA })).preferencias).toMatchObject({
        activo: false,
        verificacionPendiente: true,
      });
    });

    it('sin WhatsApp configurado responde 503', async () => {
      delete process.env.WHATSAPP_ACTIVO;
      const e = await error(pedir());
      expect([e.status, e.motivo]).toEqual([503, 'no_disponible']);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('sin aceptar el consentimiento responde 400', async () => {
      for (const acepta of [false, undefined, 'true', 1]) {
        const e = await error(pedir({ acepta }));
        expect([e.status, e.motivo]).toEqual([400, 'falta_aceptacion']);
      }
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('con una versión del texto distinta responde 400', async () => {
      const e = await error(pedir({ version: 'otra-version' }));
      expect([e.status, e.motivo]).toEqual([400, 'version_invalida']);
    });

    it('con un número inválido responde 400 y no envía nada', async () => {
      const e = await error(pedir({ telefono: '12345' }));
      expect([e.status, e.motivo]).toEqual([400, 'telefono_invalido']);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('solo un padre vinculado puede pedirlo (403)', async () => {
      sembrar({ esPadre: false });
      const e = await error(pedir());
      expect([e.status, e.motivo]).toEqual([403, 'no_es_padre']);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('una cuenta de tipo «parent» sin hijos vinculados aún puede configurarlo', async () => {
      sembrar({ esPadre: false });
      estado.tablas.users[0].user_type = 'parent';
      expect(await pedir()).toMatchObject({ enviado: true });
    });

    it('no deja pedir otro código antes de un minuto (429)', async () => {
      await pedir();
      const e = await error(pedir({}, new Date(AHORA.getTime() + 30_000)));
      expect([e.status, e.motivo]).toEqual([429, 'espera']);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('pasado un minuto deja pedir otro, y el anterior deja de servir', async () => {
      await pedir();
      const anterior = codigoEnviado();
      await pedir({}, new Date(AHORA.getTime() + 2 * MIN));
      const nuevo = codigoEnviado();
      if (anterior !== nuevo) {
        const e = await error(prefs.confirmarCodigo(PADRE, { codigo: anterior }, { ahora: new Date(AHORA.getTime() + 3 * MIN) }));
        expect(e.motivo).toBe('codigo_incorrecto');
      }
      expect((await prefs.confirmarCodigo(PADRE, { codigo: nuevo }, { ahora: new Date(AHORA.getTime() + 3 * MIN) })).activo).toBe(true);
    });

    it('si Meta no puede entregar el código, responde 502 y no deja nada pendiente', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: { code: 131026 } }) });
      const e = await error(pedir());
      expect([e.status, e.motivo]).toEqual([502, 'no_se_pudo_enviar']);
      expect(fila().telefono_pendiente).toBeNull();
      expect(fila().codigo_hash).toBeNull();
      expect(JSON.stringify(mockLogger.warn.mock.calls)).not.toContain('3001112233');
    });
  });

  describe('confirmarCodigo', () => {
    it('con el código correcto activa los avisos con el número verificado', async () => {
      await pedir();
      const vista = await prefs.confirmarCodigo(PADRE, { codigo: codigoEnviado() }, { ahora: new Date(AHORA.getTime() + MIN) });
      expect(vista).toEqual({
        activo: true,
        telefonoVisible: '•••• 2233',
        avisoConexion: true,
        informeSemanal: true,
        verificacionPendiente: false,
      });
      expect(fila()).toMatchObject({
        telefono: E164,
        activo: true,
        opt_in_version: prefs.VERSION_TEXTO,
        telefono_pendiente: null,
        codigo_hash: null,
      });
      expect(fila().verificado_at).toBeTruthy();
      expect(fila().opt_in_at).toBeTruthy();
    });

    it('tolera espacios alrededor del código', async () => {
      await pedir();
      const vista = await prefs.confirmarCodigo(PADRE, { codigo: `  ${codigoEnviado()} ` }, { ahora: AHORA });
      expect(vista.activo).toBe(true);
    });

    it('con un código incorrecto no activa nada y cuenta el intento', async () => {
      await pedir();
      const bueno = codigoEnviado();
      const malo = bueno === '000000' ? '111111' : '000000';
      const e = await error(prefs.confirmarCodigo(PADRE, { codigo: malo }, { ahora: AHORA }));
      expect([e.status, e.motivo]).toEqual([400, 'codigo_incorrecto']);
      expect(fila().activo).toBeFalsy();
      expect(fila().codigo_intentos).toBe(1);
    });

    it('tras 5 intentos fallidos bloquea incluso el código correcto (429)', async () => {
      await pedir();
      const bueno = codigoEnviado();
      const malo = bueno === '000000' ? '111111' : '000000';
      for (let i = 0; i < 5; i++) await error(prefs.confirmarCodigo(PADRE, { codigo: malo }, { ahora: AHORA }));
      const e = await error(prefs.confirmarCodigo(PADRE, { codigo: bueno }, { ahora: AHORA }));
      expect([e.status, e.motivo]).toEqual([429, 'demasiados_intentos']);
      expect(fila().activo).toBeFalsy();
    });

    it('un código vencido no sirve (10 minutos)', async () => {
      await pedir();
      const e = await error(prefs.confirmarCodigo(PADRE, { codigo: codigoEnviado() }, { ahora: new Date(AHORA.getTime() + 10 * MIN) }));
      expect([e.status, e.motivo]).toEqual([400, 'codigo_vencido']);
      expect(fila().activo).toBeFalsy();
    });

    it('sin haber pedido un código responde 400', async () => {
      const e = await error(prefs.confirmarCodigo(PADRE, { codigo: '123456' }, { ahora: AHORA }));
      expect([e.status, e.motivo]).toEqual([400, 'sin_solicitud']);
    });

    it('un código solo sirve una vez', async () => {
      await pedir();
      const codigo = codigoEnviado();
      await prefs.confirmarCodigo(PADRE, { codigo }, { ahora: AHORA });
      const e = await error(prefs.confirmarCodigo(PADRE, { codigo }, { ahora: AHORA }));
      expect(e.motivo).toBe('sin_solicitud');
    });

    it('el código de un padre no sirve para otro', async () => {
      await pedir();
      const codigo = codigoEnviado();
      const OTRO = '99999999-9999-4999-8999-999999999999';
      estado.tablas.whatsapp_padres.push({
        parent_user_id: OTRO,
        telefono_pendiente: '+573009998877',
        codigo_hash: fila().codigo_hash,
        codigo_expira_at: new Date(AHORA.getTime() + 5 * MIN).toISOString(),
        codigo_intentos: 0,
      });
      const e = await error(prefs.confirmarCodigo(OTRO, { codigo }, { ahora: AHORA }));
      expect(e.motivo).toBe('codigo_incorrecto');
    });
  });

  describe('cambiar de número', () => {
    it('mientras no confirme el nuevo, sigue activo el anterior', async () => {
      await pedir();
      await prefs.confirmarCodigo(PADRE, { codigo: codigoEnviado() }, { ahora: AHORA });
      await pedir({ telefono: '3009998877' }, new Date(AHORA.getTime() + 5 * MIN));
      expect(fila()).toMatchObject({ telefono: E164, activo: true, telefono_pendiente: '+573009998877' });
    });
  });

  describe('cambiarAvisos', () => {
    const activar = async () => {
      await pedir();
      await prefs.confirmarCodigo(PADRE, { codigo: codigoEnviado() }, { ahora: AHORA });
    };

    it('exige tener los avisos activos (409)', async () => {
      const e = await error(prefs.cambiarAvisos(PADRE, { avisoConexion: false }));
      expect([e.status, e.motivo]).toEqual([409, 'no_activo']);
    });

    it('cambia cada aviso por separado', async () => {
      await activar();
      expect(await prefs.cambiarAvisos(PADRE, { avisoConexion: false })).toMatchObject({ avisoConexion: false, informeSemanal: true });
      expect(await prefs.cambiarAvisos(PADRE, { informeSemanal: false })).toMatchObject({ avisoConexion: false, informeSemanal: false });
      expect(await prefs.cambiarAvisos(PADRE, { avisoConexion: true })).toMatchObject({ avisoConexion: true, informeSemanal: false });
    });

    it('rechaza valores que no son sí/no (400)', async () => {
      await activar();
      const e = await error(prefs.cambiarAvisos(PADRE, { avisoConexion: 'no' }));
      expect([e.status, e.motivo]).toEqual([400, 'valor_invalido']);
    });
  });

  describe('darDeBaja', () => {
    it('desactiva los avisos y conserva la evidencia del consentimiento', async () => {
      await pedir();
      await prefs.confirmarCodigo(PADRE, { codigo: codigoEnviado() }, { ahora: AHORA });
      const vista = await prefs.darDeBaja(PADRE, { ahora: new Date(AHORA.getTime() + 1000 * MIN) });
      expect(vista.activo).toBe(false);
      expect(fila().opt_out_at).toBeTruthy();
      expect(fila().opt_in_at).toBeTruthy();
      expect(fila().opt_in_version).toBe(prefs.VERSION_TEXTO);
    });

    it('darse de baja sin tener nada configurado no falla', async () => {
      expect((await prefs.darDeBaja(PADRE)).activo).toBe(false);
    });

    it('tras darse de baja, volver a activar exige verificar de nuevo', async () => {
      await pedir();
      await prefs.confirmarCodigo(PADRE, { codigo: codigoEnviado() }, { ahora: AHORA });
      await prefs.darDeBaja(PADRE, { ahora: AHORA });
      const e = await error(prefs.cambiarAvisos(PADRE, { avisoConexion: true }));
      expect(e.motivo).toBe('no_activo');
    });
  });

  it('la vista nunca incluye el número completo ni el código', async () => {
    await pedir();
    const codigo = codigoEnviado();
    await prefs.confirmarCodigo(PADRE, { codigo }, { ahora: AHORA });
    const todo = JSON.stringify(await prefs.obtenerPreferencias(PADRE));
    expect(todo).not.toContain('3001112233');
    expect(todo).not.toContain(codigo);
    expect(todo).not.toContain('codigo_hash');
  });
});
