const supabase = require('../db/supabase');

// ¿A qué cuenta se le aplica un plan IngenIA que alguien está pagando?
// El plan es del niño: si paga su padre o acudiente, va al hijo vinculado en
// parent_student_links; si paga el propio niño, a él. La activación (evento de
// Wompi) usa el id que queda en la referencia firmada y escribe en
// students (auth_id), así que se decide aquí, antes de cobrar: nunca se cobra
// un plan que no tenga una fila de students donde aplicarse.

const ERROR_LECTURA = 'No se pudo verificar la cuenta del estudiante';

function errorBeneficiario(status, error) {
  return { error, status };
}

// Hijos vinculados que tienen cuenta de IngenIA (fila en students). Un hijo
// solo de IALab no cuenta: el plan no tendría dónde activarse.
async function hijosConIngenia(pagadorId) {
  const { data: vinculos, error } = await supabase
    .from('parent_student_links')
    .select('student_user_id')
    .eq('parent_user_id', pagadorId)
    .eq('is_active', true);
  if (error) throw error;

  const vinculados = [...new Set((vinculos || []).map((v) => v.student_user_id).filter(Boolean))];
  if (vinculados.length === 0) return { vinculados, conIngenia: [] };

  const { data: alumnos, error: errAlumnos } = await supabase
    .from('students')
    .select('auth_id')
    .in('auth_id', vinculados);
  if (errAlumnos) throw errAlumnos;

  const conCuenta = new Set((alumnos || []).map((a) => a.auth_id));
  return { vinculados, conIngenia: vinculados.filter((id) => conCuenta.has(id)) };
}

/**
 * Devuelve { beneficiarioId } o { error, status }. Nunca lanza.
 * `estudianteId` (opcional) es el hijo que eligió el padre cuando tiene varios.
 */
async function resolverBeneficiarioIngenia({ pagadorId, estudianteId } = {}) {
  if (!pagadorId) return errorBeneficiario(401, 'No autenticado');
  try {
    const { vinculados, conIngenia } = await hijosConIngenia(pagadorId);

    if (vinculados.length > 0) {
      if (estudianteId) {
        if (!vinculados.includes(estudianteId)) {
          return errorBeneficiario(403, 'Esa cuenta no está vinculada a la tuya');
        }
        if (!conIngenia.includes(estudianteId)) {
          return errorBeneficiario(400, 'Esa cuenta todavía no tiene IngenIA');
        }
        return { beneficiarioId: estudianteId };
      }
      if (conIngenia.length === 1) return { beneficiarioId: conIngenia[0] };
      if (conIngenia.length > 1) {
        return errorBeneficiario(400, 'Elige a cuál de tus hijos se le aplica el plan');
      }
      return errorBeneficiario(400, 'Tu hijo vinculado todavía no tiene cuenta de IngenIA');
    }

    if (estudianteId && estudianteId !== pagadorId) {
      return errorBeneficiario(403, 'Esa cuenta no está vinculada a la tuya');
    }

    const { data: alumno, error: errAlumno } = await supabase
      .from('students')
      .select('auth_id')
      .eq('auth_id', pagadorId)
      .maybeSingle();
    if (errAlumno) return errorBeneficiario(500, ERROR_LECTURA);
    if (!alumno) {
      return errorBeneficiario(400, 'Vincula primero la cuenta de tu hijo para aplicarle el plan');
    }
    return { beneficiarioId: pagadorId };
  } catch {
    return errorBeneficiario(500, ERROR_LECTURA);
  }
}

module.exports = { resolverBeneficiarioIngenia };
