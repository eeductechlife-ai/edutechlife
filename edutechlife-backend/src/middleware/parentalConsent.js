const supabase = require('../db/supabase');

// Edad a partir de la cual no se exige registro de consentimiento parental.
// Cubre COPPA (<13) y Ley 1581 (<18) en una sola regla.
const MINOR_MAX_AGE = 18;

/**
 * Decisión de producto (2026-09): SmartBoard ya no bloquea a un estudiante
 * a la espera de que su padre/madre apruebe en vivo. El consentimiento
 * parental verificado (Ley 1581/2012, COPPA) sigue siendo el mecanismo legal
 * y se solicita una sola vez por email (ver POST /parental-consent/request);
 * mientras se verifica, el estudiante puede seguir trabajando con normalidad
 * y el padre recibe notificación de cada sesión en tiempo real desde el
 * frontend (ParentalConsentBlocker).
 *
 * Este middleware ya no responde 403/503: solo registra en logs cuando un
 * menor no tiene consentimiento verificado, para trazabilidad y auditoría,
 * y siempre continúa la petición.
 */
async function requireVerifiedParentalConsent(req, res, next) {
  try {
    const { data: consent, error: consentError } = await supabase
      .from('parent_consents')
      .select('verification_status, student_age')
      .eq('student_id', req.userId)
      .order('consent_timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (consentError) throw consentError;

    const age = consent?.student_age ?? null;

    if (
      age !== null &&
      Number(age) < MINOR_MAX_AGE &&
      consent?.verification_status !== 'verified'
    ) {
      console.warn(
        `Estudiante ${req.userId} sin consentimiento parental verificado (acceso permitido, no bloqueante).`,
      );
    }
  } catch (e) {
    console.warn('No se pudo verificar consentimiento parental (no bloqueante):', e.message);
  }

  next();
}

module.exports = { requireVerifiedParentalConsent, MINOR_MAX_AGE };
