const MINOR_MAX_AGE = 18;

/**
 * El consentimiento parental ya no bloquea el acceso a las funciones del
 * dashboard. La notificación al padre se gestiona desde el frontend
 * (ParentalNoticeBar) de forma no bloqueante.
 *
 * Este middleware se mantiene como pass-through para no romper las rutas que
 * lo referencian; puede eliminarse en una futura limpieza.
 */
function requireVerifiedParentalConsent(_req, _res, next) {
  return next();
}

module.exports = { requireVerifiedParentalConsent, MINOR_MAX_AGE };
