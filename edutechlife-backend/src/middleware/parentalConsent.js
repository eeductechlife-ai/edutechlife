const { estaActivo } = require('../services/adultoObligatorio');
const activacion = require('../services/activacionAdulto');

// Edad a partir de la cual no se exige adulto responsable (Ley 1581).
const MINOR_MAX_AGE = 18;

const MENSAJE_PENDIENTE =
  'Pídele a tu mamá, papá o acudiente que active tu cuenta para usar esta herramienta.';

/**
 * Modo restringido de IngenIA hasta que un adulto active la cuenta del niño
 * (decisión del CEO, 2026-10-15). Solo con ADULTO_OBLIGATORIO=true; apagada,
 * deja pasar sin consultar nada.
 *
 * Va en las herramientas que procesan datos nuevos del niño con IA: chat de
 * Dani (y su memoria/estado emocional), fotos, escáner e historial de Dani.
 * Misiones, lecciones, progreso, rutas de padres y delete-user-data NO lo usan.
 *
 * - Activado (app_metadata, llega con requireAuth): pasa sin consultas.
 * - Admin / content_creator: pasa.
 * - Si no, se calcula el estado (padres, IALab y mayores de edad exentos;
 *   vínculo o consentimiento existente = activado).
 * - Pendiente: 403 { code: 'ADULTO_PENDIENTE' }.
 * - Cualquier fallo de consulta deja pasar: un niño activado nunca puede
 *   quedar bloqueado por un error pasajero.
 */
async function requireAdultoActivado(req, res, next) {
  if (!estaActivo()) return next();
  if (req.userRole === 'admin' || req.userRole === 'content_creator') return next();
  if (activacion.activadoEnSesion(req.userAppMetadata)) return next();

  let estado;
  try {
    estado = await activacion.estadoActivacion(req.userId);
  } catch (e) {
    console.warn('[adulto-activado] no se pudo verificar la activación (se deja pasar):', e.message);
    return next();
  }

  if (estado.requiereAdulto) {
    return res.status(403).json({ code: 'ADULTO_PENDIENTE', error: MENSAJE_PENDIENTE });
  }
  return next();
}

module.exports = {
  requireAdultoActivado,
  // Nombre anterior: lo siguen importando chat.js, scan.js y daniPhoto.js.
  requireVerifiedParentalConsent: requireAdultoActivado,
  MINOR_MAX_AGE,
};
