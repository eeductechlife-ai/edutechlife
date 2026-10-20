/**
 * Camino del adulto que llega desde el correo de invitación sin tener cuenta,
 * y reenvío de la invitación desde la cuenta del niño (modo restringido).
 *
 * El adulto termina con una cuenta de PADRE con su correo real (el de la
 * invitación: el token prueba que lo recibió), no con una cuenta de
 * estudiante de IALab ni con el alias antiguo "+padre".
 */
const supabase = require('../db/supabase');
const authService = require('./authService');
const adultoObligatorio = require('./adultoObligatorio');
const activacion = require('./activacionAdulto');

const TABLA = 'invitaciones_adulto_menor';
const ESPERA_REENVIO_MS = 2 * 60 * 1000;
const LARGO_MINIMO_CLAVE = 10;

function errorCodificado(status, code, mensaje, extra = {}) {
  const e = new Error(mensaje);
  e.status = status;
  e.code = code;
  Object.assign(e, extra);
  return e;
}

/** padre@ejemplo.com → pa***@ejemplo.com (para mostrar sin exponer el correo completo). */
function enmascararCorreo(correo) {
  const [local, dominio] = String(correo || '').split('@');
  if (!local || !dominio) return null;
  return `${local.slice(0, local.length > 2 ? 2 : 1)}***@${dominio}`;
}

function vigente(invitacion) {
  return invitacion?.estado === 'pendiente' && new Date(invitacion.expira_at).getTime() > Date.now();
}

/** Invitación por token sin consumirla. { valida, motivo?, invitacion? } */
async function leerInvitacion(token) {
  if (typeof token !== 'string' || token.length < 32) return { valida: false, motivo: 'invalido' };
  const { data, error } = await supabase
    .from(TABLA)
    .select('id, estudiante_id, adulto_email, adulto_nombre, estado, expira_at')
    .eq('token_hash', adultoObligatorio.hashToken(token))
    .maybeSingle();
  if (error) throw error;
  if (!data) return { valida: false, motivo: 'invalido' };
  if (data.estado === 'confirmada') return { valida: false, motivo: 'usada' };
  if (data.estado !== 'pendiente') return { valida: false, motivo: 'invalido' };
  if (!vigente(data)) return { valida: false, motivo: 'vencida' };
  return { valida: true, invitacion: data };
}

/** Invitación más reciente del estudiante (cualquier estado) o null. */
async function ultimaInvitacion(estudianteId) {
  const { data, error } = await supabase
    .from(TABLA)
    .select('id, adulto_email, adulto_nombre, estado, expira_at, created_at')
    .eq('estudiante_id', estudianteId)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

/** Datos del aviso del niño: a qué correo se envió y si sigue vigente. */
async function resumenInvitacion(estudianteId) {
  const ultima = await ultimaInvitacion(estudianteId);
  return {
    invitacionPendiente: vigente(ultima),
    correoAdulto: ultima ? enmascararCorreo(ultima.adulto_email) : null,
  };
}

/** Nueva invitación al mismo adulto de la última (la anterior queda revocada). */
async function reenviarInvitacion(estudianteId) {
  const ultima = await ultimaInvitacion(estudianteId);
  if (!ultima) {
    throw errorCodificado(404, 'SIN_INVITACION', 'Aún no has registrado a tu mamá, papá o acudiente');
  }
  if (Date.now() - new Date(ultima.created_at).getTime() < ESPERA_REENVIO_MS) {
    throw errorCodificado(429, 'ESPERA', 'Ya enviamos el correo hace un momento. Intenta de nuevo en unos minutos');
  }
  await adultoObligatorio.crearInvitacion({
    estudianteId,
    correo: ultima.adulto_email,
    nombre: ultima.adulto_nombre,
  });
  return { correoAdulto: enmascararCorreo(ultima.adulto_email) };
}

/**
 * El adulto sin cuenta crea su cuenta de padre desde la invitación, acepta la
 * autorización y queda vinculado; la cuenta del niño queda activada.
 */
async function registrarPadreDesdeInvitacion({ token, nombre, password, aceptaAutorizacion, versionAutorizacion }) {
  if (aceptaAutorizacion !== true || !activacion.versionValida(versionAutorizacion)) {
    throw errorCodificado(400, 'FALTA_AUTORIZACION',
      'Para activar la cuenta debes aceptar la autorización de tratamiento de datos del menor',
      { motivo: 'falta_autorizacion' });
  }
  const nombreLimpio = String(nombre || '').trim();
  if (nombreLimpio.length < 3) throw errorCodificado(400, 'DATOS', 'Escribe tu nombre completo');
  if (typeof password !== 'string' || password.length < LARGO_MINIMO_CLAVE) {
    throw errorCodificado(400, 'DATOS', `La contraseña debe tener al menos ${LARGO_MINIMO_CLAVE} caracteres`);
  }

  const lectura = await leerInvitacion(token);
  if (!lectura.valida) {
    throw errorCodificado(400, 'INVITACION', 'El enlace no es válido', { motivo: lectura.motivo });
  }
  const correo = lectura.invitacion.adulto_email;
  const [firstName, ...resto] = nombreLimpio.split(/\s+/);

  let cuenta;
  try {
    cuenta = await authService.signUp({
      email: correo,
      password,
      firstName,
      lastName: resto.join(' '),
      userType: 'parent',
      accountType: 'smartboard',
    });
  } catch (e) {
    if (/ya está registrado|already|exists/i.test(e.message || '')) {
      throw errorCodificado(409, 'CUENTA_EXISTE',
        'Ya tienes una cuenta con este correo. Inicia sesión para confirmar el vínculo');
    }
    throw e;
  }
  const adultoId = cuenta.user?.id;

  // El trigger handle_new_user crea la fila como 'student'; se corrige a padre.
  const { error: perfilError } = await supabase
    .from('users')
    .update({ user_type: 'parent', account_type: 'smartboard' })
    .eq('id', adultoId);
  if (perfilError) console.error('[registro-adulto] no se pudo marcar la cuenta como padre:', perfilError.message);

  const confirmacion = await adultoObligatorio.confirmarInvitacion({ token, adultoId, adultoEmail: correo });
  if (!confirmacion.valida) {
    throw errorCodificado(400, 'INVITACION', 'El enlace no es válido', { motivo: confirmacion.motivo });
  }

  let activado = true;
  try {
    await activacion.registrarActivacion({
      estudianteId: confirmacion.estudianteId,
      adultoId,
      adultoEmail: correo,
      metodo: 'invitacion',
      versionAutorizacion,
      invitacionId: confirmacion.invitacionId,
    });
  } catch (e) {
    activado = false;
    console.error('[registro-adulto] no se pudo registrar la activación:', e.message);
  }

  return {
    vinculado: true,
    activado,
    token: cuenta.token,
    refreshToken: cuenta.refreshToken,
    user: { ...cuenta.user, userType: 'parent' },
  };
}

module.exports = {
  enmascararCorreo,
  leerInvitacion,
  resumenInvitacion,
  reenviarInvitacion,
  registrarPadreDesdeInvitacion,
};
