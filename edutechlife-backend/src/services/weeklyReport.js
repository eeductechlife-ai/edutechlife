/**
 * Weekly Parent Report
 * Turns a child's SmartBoard data blob into a parent-facing summary + email.
 * Pure functions (no I/O) so they are easy to test and reuse.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const SUBJECT_LABELS = {
  matematicas: 'Matemáticas',
  lenguaje: 'Lenguaje',
  ciencias_naturales: 'Ciencias Naturales',
  ciencias_sociales: 'Ciencias Sociales',
  ingles: 'Inglés',
  tecnologia: 'Tecnología',
};

/**
 * Extract subject key from a competency_id like "co_matematicas_01".
 * @param {string} id
 * @returns {string|null}
 */
function subjectFromId(id) {
  if (!id || typeof id !== 'string') return null;
  const parts = id.split('_');
  // Pattern: co_<subject>_<number> — subject may have underscores (ciencias_naturales)
  return parts.length >= 3 ? parts.slice(1, -1).join('_') : null;
}

/**
 * Aggregate raw mastery rows into a parent-friendly summary.
 * Same aggregation logic as useSkillPassport.js on the frontend.
 *
 * @param {Array} rows - From student_competency_mastery table
 * @returns {{ overall: number, bySubject: Array, strongest: Array, weakest: Array }}
 */
function aggregateMasterySummary(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const bySubject = {};
  let totalScore = 0;
  let totalCount = 0;

  for (const row of rows) {
    const subj = subjectFromId(row.competency_id);
    if (!subj) continue;
    const score = Number(row.mastery_level) || 0;
    if (!bySubject[subj]) bySubject[subj] = { sum: 0, count: 0 };
    bySubject[subj].sum += score;
    bySubject[subj].count++;
    totalScore += score;
    totalCount++;
  }

  const subjects = Object.entries(bySubject)
    .map(([key, { sum, count }]) => ({
      subject: key,
      label: SUBJECT_LABELS[key] || key,
      mastery: Math.round((sum / count) * 100),
    }))
    .sort((a, b) => b.mastery - a.mastery);

  const overall = totalCount > 0 ? Math.round((totalScore / totalCount) * 100) : 0;
  const strongest = subjects.slice(0, 3);
  const weakest = subjects.length > 3
    ? subjects.slice(-3).reverse()
    : [];

  return { overall, bySubject: subjects, strongest, weakest };
}

/**
 * Build the weekly summary object from the kid data blob.
 * Defensive about shape: the blob is a free-form JSON that has evolved over time.
 *
 * @param {Object} kidData - The `data` field from smartboard_kids_data
 * @param {Object} [opts]
 * @param {Date}   [opts.now] - Reference "now" (for deterministic tests)
 * @returns {Object} summary
 */
function buildWeeklySummary(kidData = {}, opts = {}) {
  const now = opts.now instanceof Date ? opts.now : new Date();
  const weekAgo = new Date(now.getTime() - 7 * MS_PER_DAY);

  const pointsHistory = Array.isArray(kidData.pointsHistory)
    ? kidData.pointsHistory
    : [];
  const sessions = Array.isArray(kidData.sessions) ? kidData.sessions : [];

  // Points earned in the last 7 days (falls back to total if no timestamps)
  const weekEntries = pointsHistory.filter((e) => {
    const ts = e && (e.timestamp || e.date || e.created_at);
    if (!ts) return false;
    const t = new Date(ts).getTime();
    return !Number.isNaN(t) && t >= weekAgo.getTime() && t <= now.getTime();
  });

  const pointsThisWeek = weekEntries.reduce(
    (sum, e) => sum + (Number(e.points) || 0),
    0,
  );

  // Distinct active days in the last 7 days (from points + sessions timestamps)
  const activeDaySet = new Set();
  const collectDay = (ts) => {
    if (!ts) return;
    const t = new Date(ts).getTime();
    if (Number.isNaN(t) || t < weekAgo.getTime() || t > now.getTime()) return;
    activeDaySet.add(new Date(t).toISOString().slice(0, 10));
  };
  weekEntries.forEach((e) => collectDay(e.timestamp || e.date || e.created_at));
  sessions.forEach((s) => collectDay(s.start_time || s.startTime || s.date));

  // Top subjects by progress
  const subjectProgress =
    kidData.subjectProgress && typeof kidData.subjectProgress === "object"
      ? kidData.subjectProgress
      : {};
  const topSubjects = Object.entries(subjectProgress)
    .map(([name, progress]) => ({ name, progress: Number(progress) || 0 }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  const completedMissions = Array.isArray(kidData.completedMissions)
    ? kidData.completedMissions.length
    : 0;

  // streak can be a number or an object { current, longest }
  const streakCurrent =
    typeof kidData.streak === "number"
      ? kidData.streak
      : Number(kidData.streak?.current) || 0;

  const vak = kidData.vakResult || null;
  const predominantStyle =
    vak && (vak.predominantStyle || vak.primary_style || vak.primaryStyle);

  return {
    pointsThisWeek,
    totalPoints: Number(kidData.totalPoints) || 0,
    activeDays: activeDaySet.size,
    streakCurrent,
    completedMissions,
    totalActiveMinutes: Number(kidData.totalActiveMinutes) || 0,
    topSubjects,
    predominantStyle: predominantStyle || null,
    hasActivity: pointsThisWeek > 0 || activeDaySet.size > 0,
  };
}

/**
 * Render the parent email (HTML + text) from a summary.
 * Copy is aimed at the PARENT: what their child did and why it matters.
 *
 * @param {Object} summary - Output of buildWeeklySummary
 * @param {Object} [opts]
 * @param {string} [opts.studentName]
 * @param {string} [opts.dashboardUrl]
 * @returns {{ subject: string, html: string, text: string }}
 */
function renderWeeklyEmail(summary, opts = {}) {
  const name = opts.studentName || "tu hijo";
  const dashboardUrl = opts.dashboardUrl || "https://edutechlife.co/smartboard";

  const subject = summary.hasActivity
    ? `📚 El progreso de ${name} esta semana en SmartBoard`
    : `👋 ${name} te espera esta semana en SmartBoard`;

  const styleLine = summary.predominantStyle
    ? `Aprende mejor de forma <strong>${summary.predominantStyle}</strong>, y SmartBoard adapta las actividades a ese estilo.`
    : `Cuando complete su diagnóstico VAK, SmartBoard adaptará las actividades a su forma de aprender.`;

  const subjectsHtml =
    summary.topSubjects.length > 0
      ? summary.topSubjects
          .map(
            (s) =>
              `<li style="margin:4px 0"><strong>${escapeHtml(s.name)}</strong>: ${s.progress}%</li>`,
          )
          .join("")
      : `<li style="margin:4px 0;color:#64748B">Aún sin materias con progreso esta semana.</li>`;

  // Mastery section (optional — only rendered when adaptive data exists)
  const mastery = opts.mastery || null;
  let masteryHtml = '';
  if (mastery && mastery.bySubject && mastery.bySubject.length > 0) {
    const strongHtml = (mastery.strongest || [])
      .map((s) => `<li style="margin:4px 0"><strong>${escapeHtml(s.label)}</strong>: ${s.mastery}%</li>`)
      .join('');
    const weakHtml = (mastery.weakest || [])
      .map((s) => `<li style="margin:4px 0"><strong>${escapeHtml(s.label)}</strong>: ${s.mastery}%</li>`)
      .join('');

    masteryHtml = `
    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:16px;margin-bottom:16px">
      <h2 style="margin:0 0 8px;font-size:15px;color:#004B63">🎯 Dominio de competencias: ${mastery.overall}%</h2>
      ${strongHtml ? `<p style="margin:8px 0 4px;font-size:13px;font-weight:600;color:#166534">Fortalezas</p><ul style="margin:0;padding-left:18px;font-size:14px">${strongHtml}</ul>` : ''}
      ${weakHtml ? `<p style="margin:8px 0 4px;font-size:13px;font-weight:600;color:#9A3412">Oportunidades de mejora</p><ul style="margin:0;padding-left:18px;font-size:14px">${weakHtml}</ul>` : ''}
    </div>`;
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#F8FAFC;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0F172A">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:linear-gradient(135deg,#004B63,#4DA8C4);border-radius:16px;padding:24px;color:#fff">
      <h1 style="margin:0;font-size:20px">Resumen semanal de ${escapeHtml(name)}</h1>
      <p style="margin:8px 0 0;opacity:.9;font-size:14px">Así avanzó esta semana en SmartBoard</p>
    </div>

    <div style="display:flex;gap:12px;margin:16px 0">
      <div style="flex:1;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center">
        <div style="font-size:28px;font-weight:800;color:#004B63">${summary.pointsThisWeek}</div>
        <div style="font-size:12px;color:#64748B">Puntos esta semana</div>
      </div>
      <div style="flex:1;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center">
        <div style="font-size:28px;font-weight:800;color:#004B63">${summary.activeDays}/7</div>
        <div style="font-size:12px;color:#64748B">Días activos</div>
      </div>
      <div style="flex:1;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center">
        <div style="font-size:28px;font-weight:800;color:#004B63">${summary.streakCurrent}🔥</div>
        <div style="font-size:12px;color:#64748B">Racha</div>
      </div>
    </div>

    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:16px;margin-bottom:16px">
      <h2 style="margin:0 0 8px;font-size:15px;color:#004B63">Materias con más avance</h2>
      <ul style="margin:0;padding-left:18px;font-size:14px">${subjectsHtml}</ul>
    </div>

    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:16px;margin-bottom:16px;font-size:14px">
      🧠 ${styleLine}
    </div>

    ${masteryHtml}

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px;margin-bottom:16px;font-size:13px;color:#166534">
      🛡️ La IA de SmartBoard acompaña a ${escapeHtml(name)} y cuida su bienestar mientras aprende. Si detecta que necesita ayuda, te avisamos.
    </div>

    <div style="text-align:center;margin:24px 0">
      <a href="${dashboardUrl}" style="display:inline-block;background:#FB8500;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:999px;font-size:14px">Ver el progreso completo</a>
    </div>

    <p style="text-align:center;font-size:11px;color:#94A3B8;margin-top:24px">
      EdutechLife · SmartBoard · Aprendizaje personalizado con IA
    </p>
  </div>
</body>
</html>`;

  const masteryLines = [];
  if (mastery && mastery.bySubject && mastery.bySubject.length > 0) {
    masteryLines.push('', `Dominio de competencias: ${mastery.overall}%`);
    if (mastery.strongest.length) {
      masteryLines.push(`Fortalezas: ${mastery.strongest.map((s) => `${s.label} (${s.mastery}%)`).join(', ')}`);
    }
    if (mastery.weakest.length) {
      masteryLines.push(`Oportunidades de mejora: ${mastery.weakest.map((s) => `${s.label} (${s.mastery}%)`).join(', ')}`);
    }
  }

  const text = [
    `Resumen semanal de ${name} en SmartBoard`,
    ``,
    `Puntos esta semana: ${summary.pointsThisWeek}`,
    `Días activos: ${summary.activeDays}/7`,
    `Racha actual: ${summary.streakCurrent}`,
    `Misiones completadas: ${summary.completedMissions}`,
    summary.topSubjects.length
      ? `Materias con más avance: ${summary.topSubjects.map((s) => `${s.name} (${s.progress}%)`).join(", ")}`
      : `Aún sin materias con progreso esta semana.`,
    ...masteryLines,
    ``,
    `Ver progreso completo: ${dashboardUrl}`,
  ].join("\n");

  return { subject, html, text };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { buildWeeklySummary, renderWeeklyEmail, aggregateMasterySummary };
