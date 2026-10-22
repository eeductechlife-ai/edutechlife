/**
 * Adulto obligatorio para menores de 18 años (Ley 1581 de 2012).
 * Decisión del CEO (2026-10-14): reemplaza CONSENTIMIENTO_PADRES.
 *
 * Reglas:
 * - Detrás de ADULTO_OBLIGATORIO=true (apagada por defecto). Apagada no se
 *   valida, no se invita y no cambia ningún registro.
 * - Alta de menor: exige correo de adulto válido y distinto del del menor,
 *   nombre del adulto y la casilla "soy mayor de 18 años y padre, madre o
 *   acudiente". Sin eso no se crea la cuenta y no se envía ningún correo.
 * - Invitación al adulto: token aleatorio, guardado como hash SHA-256,
 *   caduca en 72 h y sirve una sola vez.
 * - Confirmación: el adulto autenticado con el correo invitado crea el vínculo
 *   activo en parent_student_links.
 */
const crypto = require('crypto');
const supabase = require('../db/supabase');
const { sendEmail } = require('./emailService');

const MAYORIA_DE_EDAD = 18;
const TOKEN_TTL_MS = 72 * 60 * 60 * 1000;
const TABLA = 'invitaciones_adulto_menor';
const RANGO_MENOR = 'menor_18';
const RANGO_ADULTO = '18+';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function estaActivo() {
  return process.env.ADULTO_OBLIGATORIO === 'true';
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function errorValidacion(mensaje) {
  const e = new Error(mensaje);
  e.status = 400;
  return e;
}

/**
 * true = menor de 18, false = adulto, null = no se puede saber (se pide la edad).
 * rangoEdad (IALab) tiene prioridad; edad (IngenIA) es el número de años.
 */
function esMenor({ edad, rangoEdad } = {}) {
  if (rangoEdad === RANGO_MENOR) return true;
  if (rangoEdad === RANGO_ADULTO) return false;
  if (edad === undefined || edad === null || edad === '') return null;
  const anios = Number(edad);
  if (!Number.isInteger(anios) || anios < 0 || anios > 120) return null;
  return anios < MAYORIA_DE_EDAD;
}

/**
 * Valida el bloque de adulto del alta. Devuelve { correo, nombre } para
 * menores y null para mayores. Lanza error 400 si falta algo.
 */
function validarAdulto({ menor, correoEstudiante, adulto }) {
  if (!menor) return null;

  const correo = String(adulto?.email || '').trim().toLowerCase();
  const nombre = String(adulto?.nombre || '').trim();

  if (!EMAIL_RE.test(correo)) {
    throw errorValidacion('Indica un correo válido del padre, madre o acudiente');
  }
  if (correo === String(correoEstudiante || '').trim().toLowerCase()) {
    throw errorValidacion('El correo del padre, madre o acudiente debe ser distinto al del menor');
  }
  if (nombre.length < 3) {
    throw errorValidacion('Indica el nombre del padre, madre o acudiente');
  }
  if (adulto?.confirmaMayorDeEdad !== true) {
    throw errorValidacion(
      'Debes confirmar que eres mayor de 18 años y padre, madre o acudiente de este menor',
    );
  }
  return { correo, nombre };
}

/** Marca la cuenta del menor (solo registros nuevos). */
async function marcarMenorConAdulto(userId) {
  const { error } = await supabase
    .from('users')
    .update({ adulto_obligatorio: true })
    .eq('id', userId);
  if (error) throw error;
}

/**
 * Crea la invitación y envía el correo al adulto. Una invitación pendiente
 * anterior queda revocada (el índice único solo admite una pendiente).
 */
async function crearInvitacion({ estudianteId, correo, nombre }) {
  const { error: revocarError } = await supabase
    .from(TABLA)
    .update({ estado: 'revocada' })
    .eq('estudiante_id', estudianteId)
    .eq('estado', 'pendiente');
  if (revocarError) throw revocarError;

  const token = crypto.randomBytes(32).toString('base64url');
  const { error } = await supabase.from(TABLA).insert([
    {
      estudiante_id: estudianteId,
      adulto_email: correo,
      adulto_nombre: nombre,
      token_hash: hashToken(token),
      estado: 'pendiente',
      expira_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    },
  ]);
  if (error) throw error;

  const frontendUrl = process.env.FRONTEND_URL || 'https://edutechlife.co';
  const url = `${frontendUrl}/adulto-menor/confirmar?token=${token}`;
  const html = `
    <p>Un menor de edad quiere crear una cuenta en Edutechlife y te registró como su padre, madre o acudiente.</p>
    <p>Para continuar debes confirmar tu vínculo. Este enlace caduca en 72 horas y solo sirve una vez.</p>
    <p><a href="${url}">Confirmar vínculo</a></p>
    <p>Si no reconoces esta solicitud, ignora este correo.</p>
  `;
  try {
    await sendEmail(
      correo,
      'Confirma tu vínculo como padre, madre o acudiente en Edutechlife',
      html,
      `Confirma tu vínculo en: ${url}`,
    );
  } catch (e) {
    console.error('[adulto-obligatorio] no se pudo enviar la invitación:', e.message);
  }
  return { estado: 'pendiente' };
}

/**
 * El adulto autenticado confirma la invitación. El consumo es atómico: solo
 * una de dos confirmaciones simultáneas gana. El correo de la cuenta debe ser
 * el invitado.
 */
async function confirmarInvitacion({ token, adultoId, adultoEmail }) {
  if (typeof token !== 'string' || token.length < 32) {
    return { valida: false, motivo: 'invalido' };
  }

  const { data, error } = await supabase
    .from(TABLA)
    .select('id, estudiante_id, adulto_email, estado, expira_at')
    .eq('token_hash', hashToken(token))
    .maybeSingle();
  if (error) throw error;
  if (!data) return { valida: false, motivo: 'invalido' };
  if (data.estado === 'confirmada') return { valida: false, motivo: 'usada' };
  if (data.estado !== 'pendiente') return { valida: false, motivo: 'invalido' };
  if (new Date(data.expira_at).getTime() <= Date.now()) {
    return { valida: false, motivo: 'vencida' };
  }
  if (String(adultoEmail || '').trim().toLowerCase() !== data.adulto_email) {
    return { valida: false, motivo: 'correo_no_coincide' };
  }

  const { data: consumida, error: consumoError } = await supabase
    .from(TABLA)
    .update({
      estado: 'confirmada',
      adulto_id: adultoId,
      confirmada_at: new Date().toISOString(),
    })
    .eq('id', data.id)
    .eq('estado', 'pendiente')
    .gt('expira_at', new Date().toISOString())
    .select('id')
    .maybeSingle();
  if (consumoError) throw consumoError;
  if (!consumida) return { valida: false, motivo: 'usada' };

  const { error: vinculoError } = await supabase
    .from('parent_student_links')
    .upsert(
      {
        parent_user_id: adultoId,
        student_user_id: data.estudiante_id,
        is_active: true,
      },
      { onConflict: 'parent_user_id,student_user_id' },
    );
  if (vinculoError) throw vinculoError;

  return { valida: true, estudianteId: data.estudiante_id, invitacionId: data.id, adultoEmail: data.adulto_email };
}

const EDAD_INGENIA_MIN = 6;
const EDAD_INGENIA_MAX = 16;

/**
 * Edad de un estudiante de IngenIA: entero entre 6 y 16 (mismo rango que el
 * CHECK de students.age). Lanza error 400 si no es válida.
 */
function validarEdadIngenia(edad) {
  const mensaje = 'Indica tu edad: IngenIA es para estudiantes de 6 a 16 años';
  if (edad === undefined || edad === null || edad === '') throw errorValidacion(mensaje);
  const anios = Number(edad);
  if (!Number.isInteger(anios) || anios < EDAD_INGENIA_MIN || anios > EDAD_INGENIA_MAX) {
    throw errorValidacion(mensaje);
  }
  return anios;
}

/** Guarda la edad real confirmada por el estudiante (reemplaza valores antiguos). */
async function actualizarEdadEstudiante(userId, edad) {
  const { error } = await supabase
    .from('students')
    .update({ age: edad })
    .eq('auth_id', userId);
  if (error) throw error;
}

/** Edad registrada en IngenIA (students.age), o null si no hay registro. */
async function edadDelEstudiante(userId) {
  const { data, error } = await supabase
    .from('students')
    .select('age')
    .eq('auth_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.age ?? null;
}

async function tieneVinculoActivo(userId) {
  const { data, error } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('student_user_id', userId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/**
 * true si el estudiante es menor de 18, no tiene adulto vinculado y la regla
 * está encendida. Solo lee: nunca bloquea el acceso ni envía correos.
 */
async function avisoPendiente(userId) {
  if (!estaActivo()) return false;
  const edad = await edadDelEstudiante(userId);
  if (esMenor({ edad }) !== true) return false;
  return !(await tieneVinculoActivo(userId));
}

module.exports = {
  TOKEN_TTL_MS,
  MAYORIA_DE_EDAD,
  estaActivo,
  hashToken,
  esMenor,
  validarAdulto,
  marcarMenorConAdulto,
  crearInvitacion,
  confirmarInvitacion,
  avisoPendiente,
  validarEdadIngenia,
  actualizarEdadEstudiante,
};
