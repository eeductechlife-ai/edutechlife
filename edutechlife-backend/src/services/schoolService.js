const crypto = require('crypto');
const supabase = require('../db/supabase');

// Piloto de colegios (migración 105): el padre liga a su hijo con un código
// de colegio y el niño queda en Premium mientras el colegio esté activo; el
// rector ve un resumen agregado de sus grupos, sin datos de cada niño.

const CODE_RE = /^[A-Z0-9]{6,20}$/;
// Sin 0/O ni 1/I/L para que el código se pueda dictar sin errores.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const ACTIVE_DAYS = 7;
// students.vak_style se guarda en inglés (visual, auditory, kinesthetic).
const VAK_STYLES = {
  visual: 'visual',
  auditory: 'auditivo',
  auditivo: 'auditivo',
  kinesthetic: 'kinestesico',
  kinestesico: 'kinestesico',
};

function normalizeCode(code) {
  return String(code || '').replace(/[\s-]/g, '').toUpperCase();
}

function isValidCode(code) {
  return CODE_RE.test(code);
}

function generateCode(length = 8) {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i += 1) out += CODE_ALPHABET.charAt(bytes.readUInt8(i) % CODE_ALPHABET.length);
  return out;
}

/**
 * Liga un estudiante a un colegio con un código. Gasta un uso del código y
 * deja al niño en Premium sin fecha de vencimiento.
 * Devuelve { institution, grupo } o { status, error }.
 */
async function joinSchoolWithCode({ studentId, code }) {
  const normalized = normalizeCode(code);
  if (!isValidCode(normalized)) return { status: 400, error: 'Código no válido' };

  const { data: student, error: sErr } = await supabase
    .from('students')
    .select('id, institution_id')
    .eq('id', studentId)
    .maybeSingle();
  if (sErr || !student) return { status: 404, error: 'Estudiante no encontrado' };
  if (student.institution_id) return { status: 409, error: 'El estudiante ya está ligado a un colegio' };

  const { data: redeemed, error: rErr } = await supabase.rpc('redeem_institution_code', { p_code: normalized });
  if (rErr) return { status: 500, error: 'No se pudo validar el código' };
  const match = Array.isArray(redeemed) ? redeemed[0] : redeemed;
  if (!match?.institution_id) return { status: 400, error: 'Código no válido, vencido o sin cupos' };

  const { error: uErr } = await supabase
    .from('students')
    .update({
      institution_id: match.institution_id,
      grupo: match.grupo || null,
      subscription_tier: 'premium',
      premium_until: null,
    })
    .eq('id', student.id);
  if (uErr) return { status: 500, error: 'No se pudo ligar al colegio' };

  const { data: institution } = await supabase
    .from('institutions')
    .select('id, name')
    .eq('id', match.institution_id)
    .maybeSingle();

  return { institution: institution || { id: match.institution_id }, grupo: match.grupo || null };
}

/** Membresía de rector o docente del usuario, o null. */
async function getMembership(userId) {
  const { data } = await supabase
    .from('institution_members')
    .select('institution_id, rol')
    .eq('user_id', userId)
    .limit(1);
  return Array.isArray(data) && data.length ? data[0] : null;
}

/**
 * Resume los estudiantes por grupo: total, activos en los últimos 7 días y
 * estilos VAK. Solo cifras agregadas: el rector no recibe nombres de niños.
 */
function summarizeStudents(students, now = new Date()) {
  const since = now.getTime() - ACTIVE_DAYS * 24 * 60 * 60 * 1000;
  const groups = new Map();
  const vak = new Map();
  for (const s of students || []) {
    const key = s.grupo || 'Sin grupo';
    if (!groups.has(key)) groups.set(key, { grupo: key, estudiantes: 0, activos7d: 0 });
    const g = groups.get(key);
    g.estudiantes += 1;
    if (s.last_activity && Date.parse(s.last_activity) >= since) g.activos7d += 1;
    const style = VAK_STYLES[String(s.vak_style || '').toLowerCase()] || 'sin_diagnostico';
    vak.set(style, (vak.get(style) || 0) + 1);
  }
  const grupos = [...groups.values()].sort((a, b) => a.grupo.localeCompare(b.grupo, 'es'));
  const total = grupos.reduce((n, g) => n + g.estudiantes, 0);
  const activos7d = grupos.reduce((n, g) => n + g.activos7d, 0);
  return { total, activos7d, grupos, vak: Object.fromEntries(vak) };
}

async function getSchoolOverview(userId) {
  const membership = await getMembership(userId);
  if (!membership) return { status: 403, error: 'No eres rector ni docente de un colegio' };

  const { data: institution, error: iErr } = await supabase
    .from('institutions')
    .select('id, name, is_active')
    .eq('id', membership.institution_id)
    .maybeSingle();
  if (iErr || !institution) return { status: 404, error: 'Colegio no encontrado' };

  const { data: students, error: sErr } = await supabase
    .from('students')
    .select('grupo, vak_style, last_activity')
    .eq('institution_id', institution.id);
  if (sErr) return { status: 500, error: 'No se pudo leer el resumen' };

  return { institution, rol: membership.rol, ...summarizeStudents(students) };
}

module.exports = {
  normalizeCode,
  isValidCode,
  generateCode,
  joinSchoolWithCode,
  getMembership,
  summarizeStudents,
  getSchoolOverview,
};
