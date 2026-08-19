const supabase = require('../db/supabase');

// Edad a partir de la cual no se exige consentimiento parental verificado.
// Coincide con el resto del flujo SmartBoard (parental-consent acepta 5-18 y
// SmartBoardHabeasDataModal trata como menor a <18). Cubre COPPA (<13) y
// Ley 1581 (<18) en una sola regla.
const MINOR_MAX_AGE = 18;

/**
 * Bloquea las rutas de datos/funcionalidades del menor cuando:
 *   - la edad (la confirmada por el padre en parent_consents, o la del perfil
 *     si aún no existe consentimiento) es menor de 18, y
 *   - no existe un consentimiento parental con verification_status='verified'.
 *
 * La edad registrada en parent_consents es la fuente de confianza: el padre la
 * confirmó al solicitarlo, mientras que students.age es editable por el propio
 * menor vía el backend y no debe poder usarse para auto-eximirse.
 *
 * Si la edad no se puede determinar, se permite el acceso (adulto por
 * defecto) para no bloquear cuentas con datos incompletos; la puerta de
 * entrada del frontend cubre el caso UX.
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

    let age = consent?.student_age ?? null;

    if (age === null) {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('age')
        .eq('auth_id', req.userId)
        .maybeSingle();

      if (studentError) throw studentError;
      age = student?.age ?? null;
    }

    if (age === null || Number(age) >= MINOR_MAX_AGE) {
      return next();
    }

    if (consent?.verification_status !== 'verified') {
      return res.status(403).json({
        error: {
          code: 'PARENTAL_CONSENT_REQUIRED',
          message: 'Se requiere consentimiento parental verificado para usar esta función.',
        },
      });
    }

    next();
  } catch (e) {
    // Fail-open: si no se puede determinar el estado de consentimiento —tabla
    // ausente (PGRST205 en despliegues sin la migración) o cualquier error de
    // infraestructura— NO bloqueamos al usuario. Coincide con la filosofía
    // documentada arriba ("adulto por defecto") y con el flujo del frontend,
    // que entra directo al dashboard. La puerta de entrada UX cubre el consent.
    console.warn(
      'Consentimiento parental no verificable, permitiendo acceso (fail-open):',
      e.message,
    );
    return next();
  }
}

module.exports = { requireVerifiedParentalConsent, MINOR_MAX_AGE };
