/**
 * Informe semanal al padre sobre la actividad de su hijo en IngenIA.
 *
 * Decisión del CEO (2026-10-21): un informe cada semana. Sale los lunes desde
 * las 8:00 (hora de Colombia) y cubre la semana anterior, de lunes a domingo.
 * Por WhatsApp si el padre aceptó recibirlo (tabla whatsapp_padres); si no, por
 * correo, para que todo padre vinculado reciba uno.
 *
 * Solo lleva cifras (días conectado y puntos de la semana, racha actual y
 * misiones completadas en total): nada del contenido de las conversaciones ni
 * de las actividades del niño. Las cifras salen de buildWeeklySummary, la misma
 * función del informe que el padre puede pedir a mano desde su panel, para que
 * todo el producto cuente «una semana» igual.
 *
 * Es idempotente: la tabla avisos_padres_envios tiene una fila por padre,
 * niño, canal y semana, así que correr el proceso varias veces el mismo lunes,
 * o dos instancias a la vez, nunca envía dos veces. Si un envío falla se libera
 * la fila y la siguiente corrida lo reintenta.
 *
 * Apagado por defecto: INFORME_SEMANAL_PADRES=true lo enciende.
 */
const supabase = require('../db/supabase');
const logger = require('../utils/logger');
const { sendEmail } = require('./emailService');
const { whatsappConfigurado, enviarPlantilla, plantillas } = require('./whatsapp');
const { buildWeeklySummary } = require('./weeklyReport');
const {
  reservarEnvio,
  cerrarEnvio,
  padresConConsentimiento,
  primerNombre,
} = require('./avisoWhatsappPadres');

const ZONA_HORARIA = 'America/Bogota';
// Colombia no tiene horario de verano: siempre UTC-5.
const DESFASE_MS = 5 * 60 * 60 * 1000;
const DIA_MS = 24 * 60 * 60 * 1000;
const HORA_DE_ENVIO = 8;
const INTERVALO_MS = 60 * 60 * 1000;
const PANEL_PADRES_URL = 'https://edutechlife.co/ingenia/padres';

/** Fecha y hora «de pared» de Colombia, leídas con los métodos UTC. */
const enBogota = (fecha) => new Date(fecha.getTime() - DESFASE_MS);
const fechaISO = (fechaBogota) => fechaBogota.toISOString().slice(0, 10);

/**
 * Semana anterior completa, de lunes 00:00 a lunes 00:00 (hora de Colombia).
 * `clave` es el lunes de esa semana (AAAA-MM-DD).
 */
function semanaAnterior(ahora) {
  const local = enBogota(ahora);
  const diasDesdeLunes = (local.getUTCDay() + 6) % 7;
  const lunesActualLocal = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate() - diasDesdeLunes,
  );
  const hasta = new Date(lunesActualLocal + DESFASE_MS);
  const desde = new Date(hasta.getTime() - 7 * DIA_MS);
  return { desde, hasta, clave: fechaISO(enBogota(desde)) };
}

/** Lunes desde las 8:00 en Colombia. */
function esMomentoDeEnviar(ahora) {
  const local = enBogota(ahora);
  return local.getUTCDay() === 1 && local.getUTCHours() >= HORA_DE_ENVIO;
}

function formatearDia(fecha) {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONA_HORARIA,
    day: 'numeric',
    month: 'long',
  }).format(fecha);
}

/**
 * Cifras de la semana de un estudiante (id de autenticación), con la misma
 * fuente y la misma función que el informe manual del panel. `hasta` es el
 * fin de la semana; buildWeeklySummary mira los 7 días anteriores a ese
 * instante, que es exactamente la semana de lunes a domingo.
 * Devuelve null si el niño no tiene datos guardados.
 */
async function resumenSemana(authId, hasta) {
  const [datos, usuario] = await Promise.all([
    supabase.from('smartboard_kids_data').select('data').eq('user_id', authId).maybeSingle(),
    supabase.from('users').select('first_name').eq('id', authId).maybeSingle(),
  ]);
  if (datos.error) throw datos.error;
  if (usuario.error) throw usuario.error;
  if (!datos.data) return null;

  const resumen = buildWeeklySummary(datos.data.data || {}, { now: hasta });
  // Las misiones completadas son el total acumulado, así que no cuentan como actividad de la semana.
  return {
    nombre: primerNombre(usuario.data?.first_name) || 'Tu hijo/a',
    diasActivos: resumen.activeDays,
    puntos: Math.round(resumen.pointsThisWeek),
    racha: resumen.streakCurrent,
    misiones: resumen.completedMissions,
    hayActividad: resumen.activeDays > 0 || resumen.pointsThisWeek > 0,
  };
}

const escapar = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function textoSemana(semana) {
  return {
    desde: formatearDia(semana.desde),
    hasta: formatearDia(new Date(semana.hasta.getTime() - DIA_MS)),
  };
}

function construirCorreo(resumen, semana) {
  const { desde, hasta } = textoSemana(semana);
  const linea = `Esta semana (${desde} al ${hasta}) ${resumen.nombre} se conectó ${resumen.diasActivos} ${
    resumen.diasActivos === 1 ? 'día' : 'días'
  } y ganó ${resumen.puntos} puntos. Racha actual: ${resumen.racha} ${
    resumen.racha === 1 ? 'día' : 'días'
  }. En total lleva ${resumen.misiones} ${resumen.misiones === 1 ? 'misión completada' : 'misiones completadas'}.`;
  const aviso = 'Este es un informe automático. No incluye el contenido de sus actividades.';
  return {
    subject: 'IngenIA: informe semanal de tu hijo/a',
    html:
      '<div style="font-family:Arial,sans-serif;font-size:15px;color:#004B63">' +
      `<p>${escapar(linea)}</p>` +
      `<p>Puedes ver el detalle en tu <a href="${PANEL_PADRES_URL}">panel de padres</a>.</p>` +
      `<p style="color:#6B7280;font-size:12px">${escapar(aviso)}</p>` +
      '</div>',
    text: `${linea}\n\nDetalle en tu panel de padres: ${PANEL_PADRES_URL}\n\n${aviso}`,
  };
}

async function correoDelPadre(parentId) {
  const { data, error } = await supabase.from('users').select('email').eq('id', parentId).maybeSingle();
  if (error) throw error;
  return data?.email?.trim().toLowerCase() || null;
}

async function enviarPorWhatsApp(telefono, resumen, semana) {
  const { desde, hasta } = textoSemana(semana);
  return enviarPlantilla({
    para: telefono,
    plantilla: plantillas().semanal,
    parametros: [
      resumen.nombre,
      desde,
      hasta,
      resumen.diasActivos,
      resumen.puntos,
      resumen.misiones,
      resumen.racha,
    ],
  });
}

async function enviarPorCorreo(parentId, resumen, semana) {
  const correo = await correoDelPadre(parentId);
  if (!correo) return { ok: false, error: 'sin_correo' };
  const mensaje = construirCorreo(resumen, semana);
  const envio = await sendEmail(correo, mensaje.subject, mensaje.html, mensaje.text);
  return envio?.success === true ? { ok: true, id: envio.messageId } : { ok: false, error: 'correo' };
}

/**
 * Envía los informes de la semana anterior que aún no salieron.
 * @param {{ ahora?: Date, forzar?: boolean }} [opciones]
 *   `forzar` ignora la regla «lunes desde las 8:00» (pruebas y envíos manuales).
 * @returns {Promise<{ enviados: number, omitidos: number, fallos: number }>}
 */
async function enviarInformesSemanales({ ahora = new Date(), forzar = false } = {}) {
  const resumen = { enviados: 0, omitidos: 0, fallos: 0 };
  try {
    if (!forzar && !esMomentoDeEnviar(ahora)) return resumen;

    const semana = semanaAnterior(ahora);
    const { data: vinculos, error } = await supabase
      .from('parent_student_links')
      .select('parent_user_id, student_user_id')
      .eq('is_active', true);
    if (error) throw error;
    if (!vinculos || vinculos.length === 0) return resumen;

    const padreIds = [...new Set(vinculos.map((v) => v.parent_user_id).filter(Boolean))];
    const destinosWhatsApp = whatsappConfigurado()
      ? await padresConConsentimiento(padreIds, 'informe_semanal')
      : [];
    const telefonos = new Map(destinosWhatsApp.map((d) => [d.parent_user_id, d.telefono]));
    const correoActivo = Boolean(process.env.RESEND_API_KEY);
    const cacheResumen = new Map();

    for (const v of vinculos) {
      const parentId = v.parent_user_id;
      const studentId = v.student_user_id;
      if (!parentId || !studentId) continue;

      const canal = telefonos.has(parentId) ? 'whatsapp' : 'correo';
      if (canal === 'correo' && !correoActivo) {
        resumen.omitidos++;
        continue;
      }
      const clave = { tipo: 'semanal', canal, parentId, studentId, referencia: semana.clave };
      try {
        // Sin actividad en la semana no hay informe: un correo con ceros no le sirve al padre.
        // Se decide antes de reservar, para no dejar filas de envíos que nunca salieron.
        if (!cacheResumen.has(studentId)) {
          cacheResumen.set(studentId, await resumenSemana(studentId, semana.hasta));
        }
        const datos = cacheResumen.get(studentId);
        if (!datos || !datos.hayActividad) {
          resumen.omitidos++;
          continue;
        }
        if (!(await reservarEnvio(clave))) {
          resumen.omitidos++;
          continue;
        }
        const envio =
          canal === 'whatsapp'
            ? await enviarPorWhatsApp(telefonos.get(parentId), datos, semana)
            : await enviarPorCorreo(parentId, datos, semana);
        await cerrarEnvio(clave, envio);
        if (envio.ok) resumen.enviados++;
        else resumen.fallos++;
      } catch (e) {
        resumen.fallos++;
        try {
          await cerrarEnvio(clave, { ok: false });
        } catch {
          // la siguiente corrida reintenta; la clave única evita duplicados
        }
        logger.error('[informe-semanal] error con un padre; el resto sigue', { error: e.message });
      }
    }
    logger.info('[informe-semanal] corrida terminada', { semana: semana.clave, ...resumen });
  } catch (e) {
    logger.error('[informe-semanal] no se pudo preparar el informe', { error: e.message });
  }
  return resumen;
}

/** Revisa cada hora; solo actúa los lunes desde las 8:00. Apagado salvo INFORME_SEMANAL_PADRES=true. */
function startInformesSemanalesPadres() {
  if (process.env.INFORME_SEMANAL_PADRES !== 'true') return null;
  enviarInformesSemanales();
  const timer = setInterval(() => enviarInformesSemanales(), INTERVALO_MS);
  timer.unref();
  return timer;
}

module.exports = {
  semanaAnterior,
  esMomentoDeEnviar,
  resumenSemana,
  construirCorreo,
  enviarInformesSemanales,
  startInformesSemanalesPadres,
};
