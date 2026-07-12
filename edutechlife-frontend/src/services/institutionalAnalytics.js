// Servicio de analítica institucional para el panel de Valeria (admin interno).
// Lee los diagnósticos VAK reales desde Supabase y los agrega para el dashboard.
// Tabla: public.vak_diagnostics (ver supabase_vak_diagnostics_schema.sql).

const STYLE_LABEL = {
  visual: "Visual",
  auditivo: "Auditivo",
  kinestesico: "Kinestésico",
};

/**
 * Persiste un diagnóstico VAP completo en Supabase.
 * Silencioso ante fallos (no debe romper el flujo del estudiante).
 * @param {object} client - Cliente Supabase (con JWT de Clerk)
 * @param {object} params - { userId, institutionId, diagnosis }
 */
export async function saveVakDiagnostic(
  client,
  { userId, institutionId, diagnosis },
) {
  if (!client || !userId || !diagnosis)
    return { ok: false, error: "missing args" };
  try {
    const counts = diagnosis.counts || {};
    const { error } = await client.from("vak_diagnostics").insert({
      user_id: userId,
      institution_id: institutionId || null,
      student_name: diagnosis.studentName || null,
      student_age: diagnosis.studentAge ? String(diagnosis.studentAge) : null,
      student_email: diagnosis.studentEmail || null,
      student_phone: diagnosis.studentPhone || null,
      student_mood: diagnosis.studentMood || null,
      parent_name: diagnosis.parentName || null,
      parent_phone: diagnosis.parentPhone || null,
      parent_email: diagnosis.parentEmail || null,
      predominant_style: diagnosis.predominantStyle || null,
      percentage: Number.isFinite(diagnosis.percentage)
        ? diagnosis.percentage
        : 0,
      score_visual: counts.visual || 0,
      score_auditivo: counts.auditivo || 0,
      score_kinestesico: counts.kinestesico || 0,
      time_spent_seconds: diagnosis.timeSpent || 0,
      result: diagnosis,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Trae los diagnósticos VAK desde Supabase (admin: todos; usuario: los suyos, por RLS).
 * @param {object} client - Cliente Supabase
 * @param {object} opts - { institutionId, limit }
 * @returns {Promise<Array>} filas de vak_diagnostics
 */
export async function fetchVakDiagnostics(client, opts = {}) {
  if (!client) return [];
  const { institutionId, limit = 1000 } = opts;
  let query = client
    .from("vak_diagnostics")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (institutionId) query = query.eq("institution_id", institutionId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Agrega las filas crudas en la forma que consume el dashboard: todos los datos
 * generados tras el diagnóstico.
 * @param {Array} rows - filas de vak_diagnostics
 */
export function aggregateDiagnostics(rows = []) {
  const total = rows.length;
  const byStyle = { visual: 0, auditivo: 0, kinestesico: 0 };
  let sumPct = 0;
  let sumTime = 0;

  const students = rows.map((r) => {
    if (byStyle[r.predominant_style] !== undefined)
      byStyle[r.predominant_style] += 1;
    sumPct += r.percentage || 0;
    sumTime += r.time_spent_seconds || 0;
    return {
      id: r.id,
      name: r.student_name || "Estudiante",
      age: r.student_age || "",
      vak: STYLE_LABEL[r.predominant_style] || "—",
      style: r.predominant_style,
      percentage: r.percentage || 0,
      scores: {
        visual: r.score_visual || 0,
        auditivo: r.score_auditivo || 0,
        kinestesico: r.score_kinestesico || 0,
      },
      mood: r.student_mood || null,
      email: r.student_email || null,
      institution: r.institution_id || null,
      date: r.diagnosed_at || r.created_at,
    };
  });

  return {
    total,
    byStyle,
    stylePercents: {
      visual: total ? Math.round((byStyle.visual / total) * 100) : 0,
      auditivo: total ? Math.round((byStyle.auditivo / total) * 100) : 0,
      kinestesico: total ? Math.round((byStyle.kinestesico / total) * 100) : 0,
    },
    avgPercentage: total ? Math.round(sumPct / total) : 0,
    avgTimeSeconds: total ? Math.round(sumTime / total) : 0,
    students,
    // Línea de tiempo: diagnósticos por día (últimos, para un sparkline)
    timeline: buildTimeline(rows),
  };
}

function buildTimeline(rows) {
  const byDay = {};
  rows.forEach((r) => {
    const day = (r.created_at || "").slice(0, 10);
    if (!day) return;
    byDay[day] = (byDay[day] || 0) + 1;
  });
  return Object.entries(byDay)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, count]) => ({ day, count }));
}
