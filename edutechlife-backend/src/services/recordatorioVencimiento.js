/**
 * Recordatorio de vencimiento de planes pagados.
 *
 * Wompi cobra por periodo único y el plan no se renueva solo. Este job avisa
 * al titular 7 días y 1 día antes de paidUntil (columnas de la migración 104).
 *
 * Reglas:
 *   - Un correo por tipo ('7d' o '1d') y por periodo. La marca vive en
 *     public.recordatorios_plan (migración 109), con clave única
 *     (titular, producto, tipo, periodo_hasta). Un periodo renovado tiene otro
 *     paidUntil y, por tanto, sus propios avisos.
 *   - Destinatario: si el titular es menor (students.age < 18), solo se avisa a
 *     su padre o acudiente activo; sin adulto vinculado no se envía nada (ni a
 *     la cuenta del menor). Si el titular es adulto, va a su propio correo.
 *   - Si el envío falla para todos los destinatarios, la marca se libera para
 *     reintentar en el siguiente pase. Un fallo nunca lanza excepción.
 *   - Sin la tabla de marcas no se envía nada: sin registro no hay anti-spam.
 *   - Sin RESEND_API_KEY no se consulta ni se reserva nada.
 *   - Se apaga con RECORDATORIOS_PLAN=false.
 */

const supabase = require('../db/supabase');
const { sendEmail } = require('./emailService');
const logger = require('../utils/logger');
const { getPlanById } = require('../data/plans');
const { construirRecordatorio, nombrePila } = require('./recordatorioVencimientoEmail');

const TABLA = 'recordatorios_plan';
const HORA_MS = 60 * 60 * 1000;
const DIA_MS = 24 * HORA_MS;
const VENTANA_MS = 7 * DIA_MS;
const INTERVALO_MS = 6 * HORA_MS;
const MAYORIA_DE_EDAD = 18; // Ley 1581 de 2012: menor de 18 años
const NOMBRE_PLAN_INGENIA = 'IngenIA Premium'; // students no guarda el id del plan, solo el nivel

/** '7d' si quedan entre 1 y 7 días; '1d' si queda 1 día o menos; null si no toca aviso. */
function tipoRecordatorio(restanteMs) {
  if (restanteMs <= 0 || restanteMs > VENTANA_MS) return null;
  return restanteMs <= DIA_MS ? '1d' : '7d';
}

function nombreIALab(planId) {
  const plan = getPlanById(planId);
  return plan?.name ? `IALab ${plan.name}` : 'IALab';
}

/** Titulares con un periodo que vence dentro de los próximos 7 días. */
async function cargarCandidatos(ahora) {
  const desde = ahora.toISOString();
  const hasta = new Date(ahora.getTime() + VENTANA_MS).toISOString();

  const { data: alumnos, error: errAlumnos } = await supabase
    .from('students')
    .select('auth_id, premium_until')
    .eq('subscription_tier', 'premium')
    .gt('premium_until', desde)
    .lte('premium_until', hasta);
  if (errAlumnos) throw errAlumnos;

  const { data: cuentas, error: errCuentas } = await supabase
    .from('users')
    .select('id, plan, plan_paid_until')
    .neq('plan', 'free')
    .gt('plan_paid_until', desde)
    .lte('plan_paid_until', hasta);
  if (errCuentas) throw errCuentas;

  return [
    ...(alumnos || []).map((a) => ({
      producto: 'ingenia',
      titularId: a.auth_id,
      paidUntil: a.premium_until,
      plan: NOMBRE_PLAN_INGENIA,
    })),
    ...(cuentas || []).map((c) => ({
      producto: 'ialab',
      titularId: c.id,
      paidUntil: c.plan_paid_until,
      plan: nombreIALab(c.plan),
    })),
  ];
}

async function cargarPerfilAlumno(titularId) {
  const { data, error } = await supabase
    .from('students')
    .select('name, age, email, language')
    .eq('auth_id', titularId)
    .maybeSingle();
  if (error) throw error;
  return data; // null si el titular no es alumno de IngenIA
}

async function cargarCorreo(userId) {
  const { data, error } = await supabase.from('users').select('email').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data?.email?.trim().toLowerCase() || null;
}

async function cargarPadres(alumnoId) {
  const { data: vinculos, error } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('student_user_id', alumnoId)
    .eq('is_active', true);
  if (error) throw error;

  const correos = [];
  for (const id of new Set((vinculos || []).map((v) => v.parent_user_id).filter(Boolean))) {
    const correo = await cargarCorreo(id);
    if (correo && !correos.includes(correo)) correos.push(correo);
  }
  return correos;
}

/**
 * Menor: solo su padre o acudiente activo (nunca la cuenta del menor). Sin
 * adulto vinculado no se envía nada. Adulto: su propio correo.
 */
async function cargarDestinatarios(titularId) {
  const perfil = await cargarPerfilAlumno(titularId);
  const edad = Number(perfil?.age);
  const esMenor = Boolean(perfil) && Number.isInteger(edad) && edad < MAYORIA_DE_EDAD;
  const idioma = perfil?.language || 'es';

  if (esMenor) {
    const padres = await cargarPadres(titularId);
    if (!padres.length) logger.warn('[recordatorio-plan] menor sin adulto vinculado: no se envía', { titularId });
    return { idioma, pila: nombrePila(perfil.name), correos: padres };
  }

  const correo = (await cargarCorreo(titularId)) || perfil?.email?.trim().toLowerCase() || null;
  return { idioma, pila: '', correos: correo ? [correo] : [] };
}

/** Reserva la marca del tipo y periodo. false si ya existe; lanza si la tabla no está. */
async function reservar(c, tipo) {
  const { error } = await supabase.from(TABLA).insert({
    titular_id: c.titularId,
    producto: c.producto,
    tipo,
    periodo_hasta: c.paidUntil,
  });
  if (!error) return true;
  if (error.code === '23505') return false;
  throw error;
}

async function liberar(c, tipo) {
  const { error } = await supabase
    .from(TABLA)
    .delete()
    .eq('titular_id', c.titularId)
    .eq('producto', c.producto)
    .eq('tipo', tipo)
    .eq('periodo_hasta', c.paidUntil);
  if (error) logger.error('[recordatorio-plan] no se pudo liberar la marca', { error: error.message });
}

/** Envía a un destinatario. Nunca lanza: devuelve true solo si el proveedor aceptó el correo. */
async function enviarSeguro(to, mensaje) {
  try {
    const envio = await sendEmail(to, mensaje.subject, mensaje.html, mensaje.text);
    return envio?.success === true;
  } catch (e) {
    logger.warn('[recordatorio-plan] error al enviar el correo', { error: e.message });
    return false;
  }
}

async function procesarCandidato(c, ahora, resumen) {
  const tipo = tipoRecordatorio(Date.parse(c.paidUntil) - ahora.getTime());
  if (!tipo) {
    resumen.omitidos++;
    return;
  }

  const destino = await cargarDestinatarios(c.titularId);
  if (!destino.correos.length) {
    resumen.omitidos++;
    logger.warn('[recordatorio-plan] sin correo al que avisar', { titularId: c.titularId, producto: c.producto });
    return;
  }

  if (!(await reservar(c, tipo))) {
    resumen.omitidos++;
    return;
  }

  const mensaje = construirRecordatorio({
    tipo,
    idioma: destino.idioma,
    plan: c.plan,
    paidUntil: c.paidUntil,
    pila: destino.pila,
  });
  const resultados = await Promise.all(destino.correos.map((to) => enviarSeguro(to, mensaje)));
  const enviados = resultados.filter(Boolean).length;

  if (enviados === 0) {
    await liberar(c, tipo);
    resumen.fallos++;
    logger.warn('[recordatorio-plan] ningún correo salió; se liberó la marca para reintentar', { titularId: c.titularId });
    return;
  }
  resumen.enviados += enviados;
}

/**
 * Un pase del job. Nunca lanza excepción: un error con un titular no detiene
 * a los demás ni al vencimiento de planes (services/paidPlans.js).
 */
async function enviarRecordatoriosVencimiento({ ahora = new Date() } = {}) {
  const resumen = { candidatos: 0, enviados: 0, omitidos: 0, fallos: 0 };

  if (!process.env.RESEND_API_KEY) {
    logger.warn('[recordatorio-plan] RESEND_API_KEY no configurado: no se envió ningún recordatorio');
    return resumen;
  }

  try {
    const candidatos = await cargarCandidatos(ahora);
    resumen.candidatos = candidatos.length;
    for (const c of candidatos) {
      try {
        await procesarCandidato(c, ahora, resumen);
      } catch (e) {
        resumen.fallos++;
        logger.error('[recordatorio-plan] error con un titular; el resto sigue', { error: e.message });
      }
    }
  } catch (e) {
    logger.error('[recordatorio-plan] no se pudieron consultar los planes por vencer', { error: e.message });
  }
  return resumen;
}

/** Corre al arrancar y cada 6 h. Apagado con RECORDATORIOS_PLAN=false. */
function startRecordatoriosVencimiento() {
  if (process.env.RECORDATORIOS_PLAN === 'false') return null;
  enviarRecordatoriosVencimiento();
  const timer = setInterval(() => enviarRecordatoriosVencimiento(), INTERVALO_MS);
  timer.unref();
  return timer;
}

module.exports = {
  tipoRecordatorio,
  enviarRecordatoriosVencimiento,
  startRecordatoriosVencimiento,
};
