/**
 * Aviso por WhatsApp al padre cada vez que su hijo se conecta a IngenIA.
 *
 * Decisión del CEO (2026-10-21): un mensaje en cada conexión. Para no avisar
 * dos veces por un mismo inicio de sesión repetido (por ejemplo, la sesión que
 * se renueva), los inicios dentro de una ventana corta cuentan como uno. La
 * ventana es de 10 minutos y se ajusta con WHATSAPP_VENTANA_CONEXION_MIN
 * (0 = sin ventana: un mensaje por inicio de sesión).
 *
 * Solo recibe el padre que dio su número y aceptó desde su panel (tabla
 * whatsapp_padres). El mensaje lleva el nombre de pila del niño y la hora; no
 * incluye contenido de sus actividades. Es independiente del correo, que sigue
 * con su límite de una vez cada 24 h (services/avisoPadreLogin).
 *
 * Nunca lanza excepciones: un fallo aquí no puede afectar el inicio de sesión.
 */
const supabase = require('../db/supabase');
const logger = require('../utils/logger');
const { whatsappConfigurado, enviarPlantilla, plantillas } = require('./whatsapp');

const TABLA_ENVIOS = 'avisos_padres_envios';
const TABLA_CONSENTIMIENTO = 'whatsapp_padres';
const ZONA_HORARIA = 'America/Bogota';
const VENTANA_POR_DEFECTO_MIN = 10;

function ventanaConexionMs() {
  const minutos = Number(process.env.WHATSAPP_VENTANA_CONEXION_MIN);
  const valor = Number.isFinite(minutos) && minutos >= 0 ? minutos : VENTANA_POR_DEFECTO_MIN;
  return valor * 60_000;
}

/** Número de ventana al que pertenece este instante (clave anti-duplicado). */
function referenciaVentana(ahora) {
  const ventana = ventanaConexionMs();
  if (ventana === 0) return String(ahora.getTime());
  return String(Math.floor(ahora.getTime() / ventana));
}

function formatearHora(ahora) {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONA_HORARIA,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(ahora);
}

/** Primera palabra del nombre, solo letras. */
function primerNombre(valor) {
  const primera = String(valor ?? '').trim().split(/\s+/)[0] || '';
  return primera.replace(/[^\p{L}'-]/gu, '').slice(0, 30);
}

/**
 * Reserva un envío con la clave única de la tabla: dos procesos que coincidan
 * no envían dos veces. Devuelve false si ya estaba reservado.
 */
async function reservarEnvio({ tipo, canal, parentId, studentId, referencia }) {
  const { error } = await supabase.from(TABLA_ENVIOS).insert({
    tipo,
    canal,
    parent_user_id: parentId,
    student_id: studentId,
    referencia,
  });
  if (!error) return true;
  if (error.code === '23505') return false;
  throw error;
}

/**
 * Cierra la reserva: enviado, o la libera si falló para que el siguiente
 * intento pueda reintentar.
 */
async function cerrarEnvio({ tipo, canal, parentId, studentId, referencia }, resultado) {
  const filtro = (q) =>
    q
      .eq('tipo', tipo)
      .eq('canal', canal)
      .eq('parent_user_id', parentId)
      .eq('student_id', studentId)
      .eq('referencia', referencia);
  if (resultado.ok) {
    const { error } = await filtro(
      supabase.from(TABLA_ENVIOS).update({ estado: 'enviado', mensaje_id: resultado.id ?? null }),
    );
    if (error) throw error;
    return;
  }
  const { error } = await filtro(supabase.from(TABLA_ENVIOS).delete());
  if (error) throw error;
}

/** Padres con consentimiento activo para el aviso indicado. */
async function padresConConsentimiento(parentIds, campo) {
  if (!parentIds || parentIds.length === 0) return [];
  const { data, error } = await supabase
    .from(TABLA_CONSENTIMIENTO)
    .select('parent_user_id, telefono')
    .in('parent_user_id', parentIds)
    .eq('activo', true)
    .eq(campo, true);
  if (error) throw error;
  return data || [];
}

/**
 * @param {{ studentId: string, nombre: string, padreIds: string[], ahora?: Date }} datos
 * @returns {Promise<{ enviados: number, omitidos: number, fallos: number }>}
 */
async function avisarConexionWhatsApp({ studentId, nombre, padreIds, ahora = new Date() }) {
  const resumen = { enviados: 0, omitidos: 0, fallos: 0 };
  try {
    // Sin configuración no se consulta nada: el inicio de sesión no paga el costo.
    if (!whatsappConfigurado() || !studentId) return resumen;

    const destinos = await padresConConsentimiento(padreIds, 'aviso_conexion');
    if (destinos.length === 0) return resumen;

    const referencia = referenciaVentana(ahora);
    const parametros = [primerNombre(nombre) || 'Tu hijo/a', formatearHora(ahora)];

    for (const destino of destinos) {
      const clave = {
        tipo: 'conexion',
        canal: 'whatsapp',
        parentId: destino.parent_user_id,
        studentId,
        referencia,
      };
      try {
        if (!(await reservarEnvio(clave))) {
          resumen.omitidos++;
          continue;
        }
        const envio = await enviarPlantilla({
          para: destino.telefono,
          plantilla: plantillas().conexion,
          parametros,
        });
        await cerrarEnvio(clave, envio);
        if (envio.ok) resumen.enviados++;
        else resumen.fallos++;
      } catch (e) {
        resumen.fallos++;
        logger.error('[aviso-whatsapp] error con un padre; el resto sigue', { error: e.message });
      }
    }
  } catch (e) {
    logger.error('[aviso-whatsapp] error inesperado; el inicio de sesión no se ve afectado', {
      error: e.message,
    });
  }
  return resumen;
}

module.exports = {
  avisarConexionWhatsApp,
  reservarEnvio,
  cerrarEnvio,
  padresConConsentimiento,
  primerNombre,
  referenciaVentana,
  formatearHora,
};
