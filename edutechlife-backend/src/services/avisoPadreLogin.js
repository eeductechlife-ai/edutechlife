/**
 * Aviso al padre/acudiente cuando un menor inicia sesión en IngenIA.
 *
 * Decisión del CEO (2026-10-13): NO se suspende el acceso del niño. Solo se
 * avisa al padre o acudiente vinculado, máximo un correo por niño cada 24 h.
 *
 * Reglas:
 *   - Solo menores de 18 años (students.age) con vínculo activo en
 *     parent_student_links (padre -> hijo; ver docs del PR).
 *   - El correo no contiene contenido de conversaciones, notas, emociones ni
 *     datos adicionales. El asunto no contiene el nombre del niño.
 *   - La reserva anti-spam vive en smartboard.aviso_padre_login (migración 103).
 *   - Nada de esto puede bloquear el inicio de sesión: avisarInicioSesionMenor
 *     nunca lanza excepción; devuelve { enviado, motivo } para pruebas y logs.
 */

const supabase = require('../db/supabase');
const { sendEmail } = require('./emailService');
const logger = require('../utils/logger');
const { configuracionVapid, enviarPushPadre } = require('./webPush');

const TABLA_REGISTRO = 'aviso_padre_login';
const MAYORIA_DE_EDAD = 18; // Ley 1581 de 2012: menor de 18 años
const VENTANA_MS = 24 * 60 * 60 * 1000;
const ZONA_HORARIA = 'America/Bogota';
const PANEL_PADRES_URL = 'https://edutechlife.co/ingenia/padres';
const PRIVACIDAD_URL = 'https://edutechlife.co/privacy';

const resultado = (enviado, motivo) => ({ enviado, motivo });

const escapar = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Primera palabra del nombre, solo letras (sin HTML ni números). */
function nombrePila(valor) {
  const primera = String(valor ?? '').trim().split(/\s+/)[0] || '';
  return primera.replace(/[^\p{L}'-]/gu, '').slice(0, 30);
}

/** Contenido del aviso. Sin datos del niño fuera de su nombre de pila. */
function construirAviso({ nombre, ahora }) {
  const pila = nombrePila(nombre);
  const fecha = new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONA_HORARIA,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(ahora);
  const hora = new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONA_HORARIA,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(ahora);
  const frase = `Tu hijo/a${pila ? ` ${pila}` : ''} inició sesión en IngenIA el ${fecha} a las ${hora} (hora de Colombia).`;
  const aviso = 'Este es un aviso automático. No incluye el contenido de sus actividades.';

  return {
    subject: 'IngenIA: aviso de inicio de sesión de tu hijo/a',
    html:
      '<div style="font-family:Arial,sans-serif;font-size:15px;color:#004B63">' +
      `<p>${escapar(frase)}</p>` +
      `<p>Puedes ver su actividad en tu <a href="${PANEL_PADRES_URL}">panel de padres</a>.</p>` +
      `<p style="color:#6B7280;font-size:12px">${escapar(aviso)} ` +
      `Consulta nuestra <a href="${PRIVACIDAD_URL}">política de privacidad</a>.</p>` +
      '</div>',
    text:
      `${frase}\n\n` +
      `Puedes ver su actividad en tu panel de padres: ${PANEL_PADRES_URL}\n\n` +
      `${aviso}\nPolítica de privacidad: ${PRIVACIDAD_URL}`,
  };
}

/** Devuelve { nombre } si el estudiante es menor de 18 años; si no, null. */
async function cargarMenor(studentId) {
  const { data: estudiante, error } = await supabase
    .from('students')
    .select('name, age')
    .eq('auth_id', studentId)
    .maybeSingle();
  if (error) throw error;
  if (!estudiante || estudiante.age == null) return null;
  const edad = Number(estudiante.age);
  if (!Number.isInteger(edad) || edad >= MAYORIA_DE_EDAD) return null;

  const { data: usuario, error: errorUsuario } = await supabase
    .from('users')
    .select('first_name')
    .eq('id', studentId)
    .maybeSingle();
  if (errorUsuario) throw errorUsuario;
  return { nombre: usuario?.first_name || estudiante.name || '' };
}

/**
 * Padres/acudientes con vínculo activo (sin duplicados por correo).
 * Devuelve [{ id, email }]: el id sirve para la notificación push.
 */
async function cargarPadres(studentId) {
  const { data: vinculos, error } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('student_user_id', studentId)
    .eq('is_active', true);
  if (error) throw error;

  const ids = [...new Set((vinculos || []).map((v) => v.parent_user_id).filter(Boolean))];
  const padres = [];
  for (const id of ids) {
    const { data: padre, error: errorPadre } = await supabase
      .from('users')
      .select('email')
      .eq('id', id)
      .maybeSingle();
    if (errorPadre) throw errorPadre;
    const email = padre?.email?.trim().toLowerCase();
    if (email && !padres.some((p) => p.email === email)) padres.push({ id, email });
  }
  return padres;
}

/**
 * Reserva el envío de este niño para la ventana de 24 h. El cambio es
 * condicional (compara el valor anterior), así dos inicios simultáneos no
 * producen dos correos.
 */
async function reservarEnvio(studentId, ahora) {
  const { data: fila, error } = await supabase
    .from(TABLA_REGISTRO)
    .select('ultimo_aviso_at')
    .eq('student_id', studentId)
    .maybeSingle();
  if (error) throw error;

  if (fila) {
    const anterior = fila.ultimo_aviso_at;
    if (Date.parse(anterior) > ahora.getTime() - VENTANA_MS) {
      return { ok: false, motivo: 'ventana_24h' };
    }
    const { data: cambiados, error: errorUpdate } = await supabase
      .from(TABLA_REGISTRO)
      .update({ ultimo_aviso_at: ahora.toISOString() })
      .eq('student_id', studentId)
      .eq('ultimo_aviso_at', anterior)
      .select('student_id');
    if (errorUpdate) throw errorUpdate;
    if (!cambiados?.length) return { ok: false, motivo: 'ventana_24h' };
    return { ok: true, anterior };
  }

  const { error: errorInsert } = await supabase
    .from(TABLA_REGISTRO)
    .insert({ student_id: studentId, ultimo_aviso_at: ahora.toISOString() });
  if (errorInsert) {
    // 23505 = otro inicio de sesión ya reservó el envío.
    if (errorInsert.code === '23505') return { ok: false, motivo: 'ventana_24h' };
    throw errorInsert;
  }
  return { ok: true, anterior: null };
}

/** Deshace la reserva cuando ningún correo salió, para que el siguiente inicio pueda avisar. */
async function liberarReserva(studentId, reserva) {
  if (reserva.anterior) {
    const { error } = await supabase
      .from(TABLA_REGISTRO)
      .update({ ultimo_aviso_at: reserva.anterior })
      .eq('student_id', studentId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from(TABLA_REGISTRO).delete().eq('student_id', studentId);
    if (error) throw error;
  }
}

/** Envía a un padre. Nunca lanza: devuelve true solo si Resend aceptó el correo. */
async function enviarSeguro(to, mensaje) {
  try {
    const envio = await sendEmail(to, mensaje.subject, mensaje.html, mensaje.text);
    return envio?.success === true;
  } catch (e) {
    logger.warn('[aviso-padre] error al enviar el correo', { error: e.message });
    return false;
  }
}

/**
 * Punto de entrada. Llamar sin await desde el login: un fallo aquí no debe
 * afectar el inicio de sesión. Nunca lanza excepción.
 */
async function avisarInicioSesionMenor(studentId, { ahora = new Date() } = {}) {
  try {
    if (!studentId) return resultado(false, 'sin_estudiante');

    const menor = await cargarMenor(studentId);
    if (!menor) return resultado(false, 'no_menor');

    const padres = await cargarPadres(studentId);
    if (padres.length === 0) {
      logger.warn('[aviso-padre] menor sin padre o acudiente vinculado: no se envió aviso', { studentId });
      return resultado(false, 'sin_padre');
    }

    // Sin Resend, emailService imprime el HTML completo en consola: no se llama.
    const correoActivo = Boolean(process.env.RESEND_API_KEY);
    const pushActiva = configuracionVapid() !== null;
    if (!correoActivo && !pushActiva) {
      logger.warn('[aviso-padre] RESEND_API_KEY y VAPID no configurados: no se envió aviso', { studentId });
      return resultado(false, 'sin_resend');
    }
    if (!correoActivo) {
      logger.warn('[aviso-padre] RESEND_API_KEY no configurado: solo se envía push', { studentId });
    }

    const reserva = await reservarEnvio(studentId, ahora);
    if (!reserva.ok) return resultado(false, reserva.motivo);

    const mensaje = construirAviso({ nombre: menor.nombre, ahora });
    // El correo se conserva. La push va en paralelo y nunca lanza excepción.
    const [envios, push] = await Promise.all([
      correoActivo ? Promise.all(padres.map((p) => enviarSeguro(p.email, mensaje))) : [],
      Promise.all(padres.map((p) => enviarPushPadre(p.id))),
    ]);
    const correoEnviado = envios.some(Boolean);
    const pushEnviada = push.some((r) => r.enviadas > 0);
    if (!correoEnviado && !pushEnviada) {
      await liberarReserva(studentId, reserva);
      logger.warn('[aviso-padre] no se pudo enviar el aviso; se liberó la reserva', { studentId });
      return resultado(false, 'fallo_envio');
    }
    return resultado(true, 'enviado');
  } catch (e) {
    logger.error('[aviso-padre] error inesperado; el inicio de sesión no se ve afectado', {
      error: e.message,
    });
    return resultado(false, 'error_inesperado');
  }
}

module.exports = {
  avisarInicioSesionMenor,
  construirAviso,
  MAYORIA_DE_EDAD,
  VENTANA_MS,
};
