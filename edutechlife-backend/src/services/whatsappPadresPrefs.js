/**
 * Preferencias de WhatsApp del padre: número verificado, consentimiento y qué
 * avisos recibe (cada conexión del niño, informe semanal).
 *
 * Nada se activa sin tres cosas: el padre acepta, dice su número y lo VERIFICA
 * con un código que llega a ese WhatsApp. Sin verificar, un número mal escrito
 * o ajeno recibiría el nombre de un menor y la hora a la que se conecta.
 *
 * Los errores llevan un `motivo` estable para que la pantalla muestre el texto
 * correcto sin depender del mensaje.
 */
const crypto = require('crypto');
const supabase = require('../db/supabase');
const logger = require('../utils/logger');
const { whatsappConfigurado, enviarPlantilla, plantillas, numeroParaLog } = require('./whatsapp');

const TABLA = 'whatsapp_padres';
/** Versión del texto de consentimiento que ve el padre. Si cambia el texto, cambia esta versión y la de la pantalla. */
const VERSION_TEXTO = 'whatsapp-padres-v1-2026-10-21';
const VIGENCIA_CODIGO_MS = 10 * 60 * 1000;
const ESPERA_ENTRE_CODIGOS_MS = 60 * 1000;
const MAX_INTENTOS = 5;

class ErrorPreferencias extends Error {
  constructor(status, motivo, mensaje) {
    super(mensaje);
    this.status = status;
    this.motivo = motivo;
  }
}

/**
 * Número a formato internacional (E.164). Acepta +57..., 57..., y el móvil
 * colombiano de 10 dígitos que empieza por 3. Devuelve null si no es válido.
 */
function normalizarTelefono(valor) {
  const limpio = String(valor ?? '').replace(/[\s().-]/g, '');
  if (/^\+[1-9]\d{7,14}$/.test(limpio)) return limpio;
  if (/^3\d{9}$/.test(limpio)) return `+57${limpio}`;
  if (/^57\d{10}$/.test(limpio)) return `+${limpio}`;
  return null;
}

const hashCodigo = (parentId, codigo) =>
  crypto.createHash('sha256').update(`${parentId}:${codigo}`).digest('hex');

const generarCodigo = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');

function iguales(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Solo los padres (con un hijo vinculado o de tipo «parent») pueden configurar avisos. */
async function esPadre(userId) {
  const { data: vinculo, error } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('parent_user_id', userId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (vinculo) return true;
  const { data: usuario, error: errorUsuario } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', userId)
    .maybeSingle();
  if (errorUsuario) throw errorUsuario;
  return usuario?.user_type === 'parent';
}

async function leerFila(userId) {
  const { data, error } = await supabase.from(TABLA).select('*').eq('parent_user_id', userId).maybeSingle();
  if (error) throw error;
  return data || null;
}

/** Lo que ve la pantalla. Nunca devuelve el número completo ni el código. */
function vista(fila, ahora = new Date()) {
  if (!fila) {
    return { activo: false, telefonoVisible: null, avisoConexion: true, informeSemanal: true, verificacionPendiente: false };
  }
  return {
    activo: Boolean(fila.activo),
    telefonoVisible: fila.telefono ? `•••• ${fila.telefono.slice(-4)}` : null,
    avisoConexion: fila.aviso_conexion !== false,
    informeSemanal: fila.informe_semanal !== false,
    verificacionPendiente: Boolean(
      fila.telefono_pendiente && fila.codigo_expira_at && Date.parse(fila.codigo_expira_at) > ahora.getTime(),
    ),
  };
}

async function obtenerPreferencias(userId, { ahora = new Date() } = {}) {
  return {
    disponible: whatsappConfigurado(),
    versionTexto: VERSION_TEXTO,
    preferencias: vista(await leerFila(userId), ahora),
  };
}

/** Paso 1: el padre acepta y da su número; se le envía un código por WhatsApp. */
async function solicitarCodigo(userId, { telefono, acepta, version } = {}, { ahora = new Date() } = {}) {
  if (!whatsappConfigurado()) {
    throw new ErrorPreferencias(503, 'no_disponible', 'Los avisos por WhatsApp aún no están disponibles');
  }
  if (acepta !== true) {
    throw new ErrorPreferencias(400, 'falta_aceptacion', 'Debes aceptar recibir los avisos por WhatsApp');
  }
  if (version !== VERSION_TEXTO) {
    throw new ErrorPreferencias(400, 'version_invalida', 'El texto de autorización cambió; recarga la página');
  }
  const numero = normalizarTelefono(telefono);
  if (!numero) {
    throw new ErrorPreferencias(400, 'telefono_invalido', 'Escribe un número de WhatsApp válido, con indicativo');
  }
  if (!(await esPadre(userId))) {
    throw new ErrorPreferencias(403, 'no_es_padre', 'Solo un padre, madre o acudiente vinculado puede activar los avisos');
  }

  const fila = await leerFila(userId);
  if (fila?.codigo_enviado_at && ahora.getTime() - Date.parse(fila.codigo_enviado_at) < ESPERA_ENTRE_CODIGOS_MS) {
    throw new ErrorPreferencias(429, 'espera', 'Espera un minuto antes de pedir otro código');
  }

  const codigo = generarCodigo();
  const { error } = await supabase.from(TABLA).upsert(
    {
      parent_user_id: userId,
      telefono_pendiente: numero,
      codigo_hash: hashCodigo(userId, codigo),
      codigo_expira_at: new Date(ahora.getTime() + VIGENCIA_CODIGO_MS).toISOString(),
      codigo_enviado_at: ahora.toISOString(),
      codigo_intentos: 0,
      updated_at: ahora.toISOString(),
    },
    { onConflict: 'parent_user_id' },
  );
  if (error) throw error;

  const envio = await enviarPlantilla({
    para: numero,
    plantilla: plantillas().verificacion,
    parametros: [codigo],
    parametroBoton: codigo,
  });
  if (!envio.ok) {
    await supabase
      .from(TABLA)
      .update({ telefono_pendiente: null, codigo_hash: null, codigo_expira_at: null, codigo_enviado_at: null })
      .eq('parent_user_id', userId);
    logger.warn('[whatsapp-prefs] no se pudo enviar el código', { motivo: envio.error, para: numeroParaLog(numero) });
    throw new ErrorPreferencias(502, 'no_se_pudo_enviar', 'No pudimos enviar el código a ese número. Revísalo e intenta de nuevo');
  }
  return { enviado: true, expiraEnMinutos: VIGENCIA_CODIGO_MS / 60_000 };
}

/** Paso 2: el padre escribe el código; si es correcto, los avisos quedan activos. */
async function confirmarCodigo(userId, { codigo } = {}, { ahora = new Date() } = {}) {
  const fila = await leerFila(userId);
  if (!fila?.codigo_hash || !fila.telefono_pendiente) {
    throw new ErrorPreferencias(400, 'sin_solicitud', 'Primero pide un código');
  }
  if (!fila.codigo_expira_at || Date.parse(fila.codigo_expira_at) <= ahora.getTime()) {
    throw new ErrorPreferencias(400, 'codigo_vencido', 'El código venció; pide uno nuevo');
  }
  if ((fila.codigo_intentos ?? 0) >= MAX_INTENTOS) {
    throw new ErrorPreferencias(429, 'demasiados_intentos', 'Demasiados intentos; pide un código nuevo');
  }

  if (!iguales(hashCodigo(userId, String(codigo ?? '').trim()), fila.codigo_hash)) {
    const { error } = await supabase
      .from(TABLA)
      .update({ codigo_intentos: (fila.codigo_intentos ?? 0) + 1 })
      .eq('parent_user_id', userId);
    if (error) throw error;
    throw new ErrorPreferencias(400, 'codigo_incorrecto', 'El código no es correcto');
  }

  const marca = ahora.toISOString();
  const { data, error } = await supabase
    .from(TABLA)
    .update({
      telefono: fila.telefono_pendiente,
      verificado_at: marca,
      opt_in_at: marca,
      opt_in_version: VERSION_TEXTO,
      activo: true,
      opt_out_at: null,
      telefono_pendiente: null,
      codigo_hash: null,
      codigo_expira_at: null,
      codigo_enviado_at: null,
      codigo_intentos: 0,
      updated_at: marca,
    })
    .eq('parent_user_id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return vista(data, ahora);
}

/** Cambia qué avisos recibe (solo con los avisos ya activos). */
async function cambiarAvisos(userId, { avisoConexion, informeSemanal } = {}, { ahora = new Date() } = {}) {
  const fila = await leerFila(userId);
  if (!fila?.activo) {
    throw new ErrorPreferencias(409, 'no_activo', 'Primero activa los avisos por WhatsApp');
  }
  for (const valor of [avisoConexion, informeSemanal]) {
    if (valor !== undefined && typeof valor !== 'boolean') {
      throw new ErrorPreferencias(400, 'valor_invalido', 'Indica sí o no para cada aviso');
    }
  }
  const cambios = {
    updated_at: ahora.toISOString(),
    ...(avisoConexion !== undefined && { aviso_conexion: avisoConexion }),
    ...(informeSemanal !== undefined && { informe_semanal: informeSemanal }),
  };
  const { data, error } = await supabase
    .from(TABLA)
    .update(cambios)
    .eq('parent_user_id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return vista(data, ahora);
}

/** El padre se da de baja. Conserva la evidencia del consentimiento anterior. */
async function darDeBaja(userId, { ahora = new Date() } = {}) {
  const fila = await leerFila(userId);
  if (!fila) return vista(null, ahora);
  const { data, error } = await supabase
    .from(TABLA)
    .update({
      activo: false,
      opt_out_at: ahora.toISOString(),
      telefono_pendiente: null,
      codigo_hash: null,
      codigo_expira_at: null,
      codigo_enviado_at: null,
      updated_at: ahora.toISOString(),
    })
    .eq('parent_user_id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return vista(data, ahora);
}

module.exports = {
  VERSION_TEXTO,
  ErrorPreferencias,
  normalizarTelefono,
  obtenerPreferencias,
  solicitarCodigo,
  confirmarCodigo,
  cambiarAvisos,
  darDeBaja,
};
