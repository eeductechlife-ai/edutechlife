/**
 * Ownership — verifica que req.userId (auth uid) tiene derecho sobre un
 * studentId (students.id). Resuelve:
 *   - estudiante  → su propia fila (students.auth_id === req.userId)
 *   - padre       → vínculo activo en parent_student_links
 *   - cualquier otro → 403
 *
 * Lee studentId de: req.query.studentId, req.body.studentId, req.params.studentId,
 * o de un resolvedor custom (p. ej. warnings/:id/resolve).
 *
 * Los rechazos se registran con requestId, userId, resource y reason
 * (sin exponer secrets ni datos sensibles).
 */
const supabase = require('../db/supabase');

const deny = (req, res, reason, resource) => {
  (req.log || console).warn('[access-denied]', {
    requestId: req.id,
    userId: req.userId,
    resource,
    reason,
  });
  return res.status(403).json({ error: 'No autorizado para este estudiante' });
};

async function assertStudentAccess(req, studentId) {
  const { data: student, error } = await supabase
    .from('students')
    .select('id, auth_id')
    .eq('id', studentId)
    .maybeSingle();
  if (error || !student) return { ok: false, status: 404, reason: 'student_not_found' };

  if (student.auth_id === req.userId) {
    return { ok: true, studentId: student.id, ownerRole: 'student' };
  }

  const { data: link } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('parent_user_id', req.userId)
    .eq('student_user_id', student.auth_id)
    .eq('is_active', true)
    .maybeSingle();
  if (link) return { ok: true, studentId: student.id, ownerRole: 'parent' };

  return { ok: false, status: 403, reason: 'ownership' };
}

async function requireStudentAccess(req, res, next) {
  const studentId = req.query?.studentId || req.body?.studentId || req.params?.studentId;
  if (!studentId) {
    return res.status(400).json({ error: 'studentId requerido' });
  }
  try {
    const result = await assertStudentAccess(req, studentId);
    if (!result.ok) {
      if (result.status === 404) return res.status(404).json({ error: 'Estudiante no encontrado' });
      return deny(req, res, result.reason, `student:${studentId}`);
    }
    req.studentId = result.studentId;
    req.ownerRole = result.ownerRole;
    next();
  } catch (e) {
    (req.log || console).error('[ownership-error]', { requestId: req.id, userId: req.userId, error: e.message });
    return res.status(500).json({ error: 'Error verificando acceso' });
  }
}

async function assertAuthIdAccess(req, targetAuthId) {
  if (req.userId === targetAuthId) {
    return { ok: true, ownerRole: 'student' };
  }

  const { data: link } = await supabase
    .from('parent_student_links')
    .select('parent_user_id')
    .eq('parent_user_id', req.userId)
    .eq('student_user_id', targetAuthId)
    .eq('is_active', true)
    .maybeSingle();

  if (link) return { ok: true, ownerRole: 'parent' };
  return { ok: false, reason: 'ownership' };
}

module.exports = { requireStudentAccess, assertStudentAccess, assertAuthIdAccess };
