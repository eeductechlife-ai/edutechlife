/**
 * DEPRECADO (decisión del CEO, 2026-10-14): la regla de adulto obligatorio
 * reemplaza este flujo (migración 110, users.adulto_obligatorio). No se borra
 * todavía; no se usa para registros nuevos. Retirar cuando la regla nueva esté
 * en producción y los 16 menores existentes tengan aviso o adulto vinculado.
 *
 * Autorización previa de padre/madre para el tratamiento de datos de menores
 * (Ley 1581 de 2012). Detrás de CONSENTIMIENTO_PADRES (apagada por defecto).
 *
 * Reglas:
 * - Con la variable apagada no se lee ni escribe nada: el comportamiento es el actual.
 * - Solo se restringen cuentas con users.autorizacion_padres_requerida = true
 *   (registradas con la variable encendida). Las demás quedan grandfathered.
 * - El token del enlace es aleatorio, se guarda como hash SHA-256, caduca en
 *   72 h y sirve una sola vez.
 */
const crypto = require('crypto');
const supabase = require('../db/supabase');
const { sendParentAuthorizationEmail } = require('./emailService');

const POLITICA_VERSION = '2026-10';
const TOKEN_TTL_MS = 72 * 60 * 60 * 1000;
const TABLA = 'autorizaciones_padres';

function estaActivo() {
  return process.env.CONSENTIMIENTO_PADRES === 'true';
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

/** Adulto vinculado y activo (parent_student_links) con email, o null. */
async function vinculoPadre(estudianteId) {
  const { data: link, error } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('student_user_id', estudianteId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!link) return null;

  const { data: adulto, error: adultoError } = await supabase
    .from('users')
    .select('id, email')
    .eq('id', link.parent_user_id)
    .maybeSingle();
  if (adultoError) throw adultoError;
  return adulto?.email ? adulto : null;
}

/**
 * Estado de autorización de una cuenta.
 * restringido = true solo si la cuenta requiere autorización y la última
 * autorización no está en estado 'autorizada'.
 */
async function estadoAutorizacion(estudianteId) {
  if (!estaActivo()) {
    return { activo: false, requerida: false, restringido: false, estado: 'no_requerida' };
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from('users')
    .select('autorizacion_padres_requerida')
    .eq('id', estudianteId)
    .maybeSingle();
  if (usuarioError) throw usuarioError;

  if (!usuario?.autorizacion_padres_requerida) {
    return { activo: true, requerida: false, restringido: false, estado: 'no_requerida' };
  }

  const { data: ultima, error } = await supabase
    .from(TABLA)
    .select('estado')
    .eq('estudiante_id', estudianteId)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  const estado = ultima?.estado || 'sin_solicitud';
  return { activo: true, requerida: true, restringido: estado !== 'autorizada', estado };
}

/**
 * El estudiante pide que su padre/madre autorice. Envía un correo con un
 * enlace de un solo uso. Sin vínculo activo no crea nada y lo registra en logs.
 */
async function solicitarAutorizacion(estudianteId) {
  const estado = await estadoAutorizacion(estudianteId);
  if (!estado.requerida) return { estado: 'no_requerida' };
  if (estado.estado === 'autorizada') return { estado: 'autorizada' };

  const adulto = await vinculoPadre(estudianteId);
  if (!adulto) {
    console.warn(
      `[autorizacion-padres] estudiante ${estudianteId} sin vínculo de padre/madre activo: no puede activar el acceso`,
    );
    return { estado: 'sin_vinculo' };
  }

  // Una solicitud nueva invalida las pendientes anteriores.
  const { error: vencerError } = await supabase
    .from(TABLA)
    .update({ estado: 'vencida' })
    .eq('estudiante_id', estudianteId)
    .eq('estado', 'pendiente');
  if (vencerError) throw vencerError;

  const token = crypto.randomBytes(32).toString('base64url');
  const { error } = await supabase.from(TABLA).insert([
    {
      estudiante_id: estudianteId,
      adulto_id: adulto.id,
      estado: 'pendiente',
      token_hash: hashToken(token),
      token_expira_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    },
  ]);
  if (error) throw error;

  const frontendUrl = process.env.FRONTEND_URL || 'https://edutechlife.co';
  try {
    await sendParentAuthorizationEmail({
      parentEmail: adulto.email,
      url: `${frontendUrl}/autorizacion-padres?token=${token}`,
    });
  } catch (e) {
    console.error('[autorizacion-padres] no se pudo enviar el correo:', e.message);
  }
  return { estado: 'pendiente' };
}

/**
 * Valida un token sin consumirlo.
 * motivo: 'invalido' | 'vencido' | 'usado' | 'version' (en confirmar).
 */
async function buscarSolicitud(token) {
  if (typeof token !== 'string' || token.length < 32) {
    return { valida: false, motivo: 'invalido' };
  }

  const { data, error } = await supabase
    .from(TABLA)
    .select('id, estudiante_id, adulto_id, estado, token_expira_at')
    .eq('token_hash', hashToken(token))
    .maybeSingle();
  if (error) throw error;
  if (!data) return { valida: false, motivo: 'invalido' };

  if (data.estado === 'autorizada' || data.estado === 'revocada') {
    return { valida: false, motivo: 'usado' };
  }
  if (data.estado === 'vencida') return { valida: false, motivo: 'vencido' };
  if (data.estado !== 'pendiente') return { valida: false, motivo: 'invalido' };
  if (new Date(data.token_expira_at).getTime() <= Date.now()) {
    return { valida: false, motivo: 'vencido' };
  }
  return { valida: true, solicitud: data };
}

/**
 * El padre/madre confirma la autorización. El consumo es atómico: solo una
 * de dos confirmaciones simultáneas gana.
 */
async function confirmarAutorizacion({ token, versionPolitica, ip }) {
  if (versionPolitica !== POLITICA_VERSION) return { valida: false, motivo: 'version' };

  const busqueda = await buscarSolicitud(token);
  if (!busqueda.valida) return busqueda;

  const { data, error } = await supabase
    .from(TABLA)
    .update({
      estado: 'autorizada',
      autorizada_at: new Date().toISOString(),
      version_politica: POLITICA_VERSION,
      ip: ip || null,
    })
    .eq('id', busqueda.solicitud.id)
    .eq('estado', 'pendiente')
    .gt('token_expira_at', new Date().toISOString())
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) return { valida: false, motivo: 'usado' };

  return { valida: true, estado: 'autorizada' };
}

/** El padre/madre revoca desde su panel. Devuelve el número de autorizaciones revocadas. */
async function revocarAutorizacion({ adultoId, estudianteId }) {
  const { data, error } = await supabase
    .from(TABLA)
    .update({ estado: 'revocada', revocada_at: new Date().toISOString() })
    .eq('estudiante_id', estudianteId)
    .eq('adulto_id', adultoId)
    .eq('estado', 'autorizada')
    .select('id');
  if (error) throw error;
  return { revocadas: Array.isArray(data) ? data.length : 0 };
}

module.exports = {
  POLITICA_VERSION,
  TOKEN_TTL_MS,
  estaActivo,
  hashToken,
  estadoAutorizacion,
  solicitarAutorizacion,
  buscarSolicitud,
  confirmarAutorizacion,
  revocarAutorizacion,
};
