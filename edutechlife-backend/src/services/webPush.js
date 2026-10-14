/**
 * Notificaciones push web (RFC 8030) con autenticación VAPID (RFC 8292),
 * implementadas con node:crypto (sin dependencias nuevas).
 *
 * Decisión del CEO (2026-10-13): cuando un menor inicia sesión, el padre o
 * acudiente recibe una notificación en el celular de que su hijo/a está
 * activo. Solo eso. La push NO lleva contenido: el service worker muestra un
 * texto fijo, sin nombre ni datos adicionales.
 *
 * Reglas:
 *   - Sin VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT no se envía
 *     nada y se deja un aviso en logs. Nunca se imprimen las llaves.
 *   - Una suscripción que responde 404 o 410 (caducada o revocada) se borra.
 *   - Nada de esto lanza excepción: enviarPushPadre devuelve un resumen.
 */

const crypto = require('node:crypto');
const supabase = require('../db/supabase');
const logger = require('../utils/logger');

const TABLA = 'push_subscriptions';
const TTL_ENVIO_SEGUNDOS = 3600; // si el dispositivo está sin conexión, la push vale una hora
const VIDA_JWT_SEGUNDOS = 12 * 60 * 60; // VAPID admite hasta 24 h
const TIMEOUT_ENVIO_MS = 10000;

const claveCache = new Map();

/** Llaves VAPID del entorno, o null si falta alguna o es inválida. */
function configuracionVapid(env = process.env) {
  const publicKey = env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = env.VAPID_PRIVATE_KEY?.trim();
  const subject = env.VAPID_SUBJECT?.trim();
  if (!publicKey || !privateKey || !subject) return null;
  if (!/^mailto:|^https:/.test(subject)) {
    logger.warn('[push-padre] VAPID_SUBJECT debe empezar por mailto: o https:');
    return null;
  }
  return { publicKey, privateKey, subject };
}

/** Clave privada ECDSA P-256 a partir de las llaves VAPID base64url. */
function clavePrivada({ publicKey, privateKey }) {
  const cacheKey = `${publicKey}:${privateKey}`;
  if (claveCache.has(cacheKey)) return claveCache.get(cacheKey);

  const publica = Buffer.from(publicKey, 'base64url');
  const d = Buffer.from(privateKey, 'base64url');
  if (publica.length !== 65 || publica[0] !== 0x04 || d.length !== 32) {
    throw new Error('Formato de llaves VAPID inválido');
  }
  const key = crypto.createPrivateKey({
    format: 'jwk',
    key: {
      kty: 'EC',
      crv: 'P-256',
      x: publica.subarray(1, 33).toString('base64url'),
      y: publica.subarray(33, 65).toString('base64url'),
      d: d.toString('base64url'),
    },
  });
  claveCache.set(cacheKey, key);
  return key;
}

/** JWT ES256 que identifica al servidor ante el servicio push del navegador. */
function jwtVapid(endpoint, cfg, ahora = Date.now()) {
  const cabecera = Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'ES256' })).toString('base64url');
  const cuerpo = Buffer.from(
    JSON.stringify({
      aud: new URL(endpoint).origin,
      exp: Math.floor(ahora / 1000) + VIDA_JWT_SEGUNDOS,
      sub: cfg.subject,
    }),
  ).toString('base64url');
  const firma = crypto.sign('sha256', Buffer.from(`${cabecera}.${cuerpo}`), {
    key: clavePrivada(cfg),
    dsaEncoding: 'ieee-p1363',
  });
  return `${cabecera}.${cuerpo}.${firma.toString('base64url')}`;
}

/**
 * Envía una notificación vacía (sin payload, así no hay nada que cifrar) a
 * una suscripción. Devuelve 'enviada', 'caducada' (404/410) o 'fallida'.
 */
async function enviarASuscripcion(endpoint, cfg, { fetchImpl = fetch, ahora } = {}) {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    return { estado: 'fallida', status: 0 };
  }
  if (url.protocol !== 'https:') return { estado: 'fallida', status: 0 };

  const res = await fetchImpl(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `vapid t=${jwtVapid(endpoint, cfg, ahora)}, k=${cfg.publicKey}`,
      TTL: String(TTL_ENVIO_SEGUNDOS),
      Urgency: 'normal',
      'Content-Length': '0',
    },
    signal: AbortSignal.timeout(TIMEOUT_ENVIO_MS),
  });
  if (res.status === 201 || res.status === 200) return { estado: 'enviada', status: res.status };
  if (res.status === 404 || res.status === 410) return { estado: 'caducada', status: res.status };
  return { estado: 'fallida', status: res.status };
}

/**
 * Envía la push a todas las suscripciones del padre. Nunca lanza excepción.
 * Devuelve { enviadas, caducadas, fallidas, motivo }.
 */
async function enviarPushPadre(parentId, { fetchImpl = fetch, ahora } = {}) {
  const vacio = (motivo) => ({ enviadas: 0, caducadas: 0, fallidas: 0, motivo });
  try {
    if (!parentId) return vacio('sin_padre');

    const cfg = configuracionVapid();
    if (!cfg) {
      logger.warn('[push-padre] VAPID no configurado: no se envió la notificación push');
      return vacio('sin_llaves');
    }

    const { data: filas, error } = await supabase
      .from(TABLA)
      .select('id, subscription')
      .eq('user_id', parentId);
    if (error) throw error;
    if (!filas || filas.length === 0) return vacio('sin_suscripciones');

    const resultados = await Promise.all(
      filas.map(async (fila) => {
        const endpoint = fila.subscription?.endpoint;
        if (!endpoint) return { estado: 'fallida', id: fila.id };
        try {
          const r = await enviarASuscripcion(endpoint, cfg, { fetchImpl, ahora });
          return { ...r, id: fila.id };
        } catch (e) {
          logger.warn('[push-padre] error al enviar a una suscripción', { error: e.message });
          return { estado: 'fallida', id: fila.id };
        }
      }),
    );

    const caducadas = resultados.filter((r) => r.estado === 'caducada').map((r) => r.id);
    if (caducadas.length > 0) {
      const { error: errorBorrado } = await supabase.from(TABLA).delete().in('id', caducadas);
      if (errorBorrado) logger.warn('[push-padre] no se pudieron borrar suscripciones caducadas', { error: errorBorrado.message });
    }

    return {
      enviadas: resultados.filter((r) => r.estado === 'enviada').length,
      caducadas: caducadas.length,
      fallidas: resultados.filter((r) => r.estado === 'fallida').length,
      motivo: 'ok',
    };
  } catch (e) {
    logger.warn('[push-padre] error inesperado; el inicio de sesión no se ve afectado', { error: e.message });
    return vacio('error_inesperado');
  }
}

module.exports = {
  configuracionVapid,
  enviarPushPadre,
  enviarASuscripcion,
  jwtVapid,
  TABLA,
};
