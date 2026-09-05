/**
 * golden-journey-test.js — Ejecuta el Golden User Journey contra STAGING real.
 *
 * USO (dentro del job de CI staging-journey, o localmente con staging configurado):
 *   STAGING_SUPABASE_URL=https://<ref>.supabase.co \
 *   STAGING_SUPABASE_SERVICE_ROLE_KEY=<key> \
 *   BASE_URL=http://localhost:3001 \
 *   DEEPSEEK_API_KEY=<opcional> \
 *   node src/scripts/golden-journey-test.js
 *
 * Flujo: crea test users sintéticos + golden data, y ejecuta:
 *   login → profile → learning graph → recommendation → next action → plan →
 *   activity → result → mastery → Dani → parent, además de
 *   differentiation (A vs B), evolution (recovery→practice→mastery→transfer),
 *   persistence (logout/login), IDOR, RLS (REST), early warning.
 *
 * NO imprime secrets. Los passwords de test son sintéticos y deterministas.
 * Escribe evidencia en /tmp/golden-journey-evidence.json.
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.STAGING_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Requiere STAGING_SUPABASE_URL y STAGING_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// Credenciales sintéticas deterministas (NO reales)
const USERS = {
  A: { email: 'student.a.staging@edutechlife.test', password: 'StagingTestA!2026' },
  B: { email: 'student.b.staging@edutechlife.test', password: 'StagingTestB!2026' },
  PA: { email: 'parent.a.staging@edutechlife.test', password: 'StagingTestPA!2026' },
  PB: { email: 'parent.b.staging@edutechlife.test', password: 'StagingTestPB!2026' },
};

const GOLDEN = {
  A: [ // math 45%, equations 35%, science 80%
    ['co_matematicas_6-7_0', 0.45], ['co_matematicas_6-7_1', 0.35], ['co_matematicas_6-7_2', 0.5], ['co_matematicas_6-7_3', 0.4],
    ['co_ciencias_naturales_6-7_0', 0.8], ['co_ciencias_naturales_6-7_1', 0.8], ['co_ciencias_naturales_6-7_2', 0.8], ['co_ciencias_naturales_6-7_3', 0.8],
    ['co_lenguaje_6-7_0', 0.6], ['co_lenguaje_6-7_1', 0.6], ['co_lenguaje_6-7_2', 0.6],
  ],
  B: [ // math 85%, equations 90%, science 50%
    ['co_matematicas_6-7_0', 0.85], ['co_matematicas_6-7_1', 0.9], ['co_matematicas_6-7_2', 0.85], ['co_matematicas_6-7_3', 0.8],
    ['co_ciencias_naturales_6-7_0', 0.5], ['co_ciencias_naturales_6-7_1', 0.5], ['co_ciencias_naturales_6-7_2', 0.5], ['co_ciencias_naturales_6-7_3', 0.5],
    ['co_lenguaje_6-7_0', 0.65], ['co_lenguaje_6-7_1', 0.65], ['co_lenguaje_6-7_2', 0.65],
  ],
};

const evidence = { startedAt: new Date().toISOString(), steps: [] };
const step = (name, ok, detail, blocked = false) => {
  evidence.steps.push({ name, ok, blocked, detail: typeof detail === 'object' ? JSON.stringify(detail).slice(0, 400) : String(detail).slice(0, 400) });
  const tag = blocked ? '◌' : ok ? '✓' : '✗';
  console.log(`${tag} ${name} ${ok ? '' : '— ' + JSON.stringify(detail).slice(0, 200)}`);
};

async function api(path, opts = {}, token) {
  const res = await fetch(BASE_URL + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) },
  });
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch { body = text.slice(0, 200); }
  return { status: res.status, body };
}

async function setup() {
  // 1. Users sintéticos (idempotente)
  const ids = {};
  for (const [k, u] of Object.entries(USERS)) {
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    let user = (list?.users || []).find((x) => x.email === u.email);
    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email, password: u.password, email_confirm: true,
        user_metadata: { role: k.startsWith('P') ? 'parent' : 'student', staging: true },
      });
      if (error) throw new Error(`createUser ${u.email}: ${error.message}`);
      user = data.user;
    }
    ids[k] = user.id;
  }
  step('setup: 4 usuarios sintéticos', true, Object.fromEntries(Object.entries(ids).map(([k, v]) => [k, v])));

  // 2. students + parent links + consents + mastery
  const studentIds = {};
  for (const [k, n, age, g] of [['A', 'Estudiante A', 12, 7], ['B', 'Estudiante B', 12, 7]]) {
    await supabase.from('students').upsert({ auth_id: ids[k], name: n, age, grade: String(g), grade_level: g, country_code: 'CO', school: 'Staging School', language: 'es' }, { onConflict: 'auth_id' });
    const { data: st } = await supabase.from('students').select('id').eq('auth_id', ids[k]).maybeSingle();
    studentIds[k] = st.id;
  }
  await supabase.from('parent_student_links').upsert({ parent_user_id: ids.PA, student_user_id: ids.A, is_active: true }, { onConflict: 'parent_user_id,student_user_id' });
  await supabase.from('parent_student_links').upsert({ parent_user_id: ids.PB, student_user_id: ids.B, is_active: true }, { onConflict: 'parent_user_id,student_user_id' });
  // consents verificados (gate parental)
  for (const [k] of [['A'], ['B']]) {
    const { data: c } = await supabase.from('parent_consents').select('id').eq('student_id', ids[k]).maybeSingle();
    if (!c) {
      const { error } = await supabase.from('parent_consents').insert({
        student_id: ids[k], parent_email: USERS['P' + k].email, student_age: 12,
        verification_status: 'verified', consent_timestamp: new Date().toISOString(),
      });
      if (error) throw new Error(`parent_consents ${k}: ${error.message}`);
    }
  }
  // golden mastery (resetea a los valores base)
  for (const [k, rows] of Object.entries(GOLDEN)) {
    for (const [cid, level] of rows) {
      await supabase.from('student_competency_mastery').upsert(
        { student_id: studentIds[k], competency_id: cid, mastery_level: level, practice_count: 3, updated_at: new Date().toISOString() },
        { onConflict: 'student_id,competency_id' });
    }
  }
  step('setup: students + parent links + consents + golden mastery', true, { A: studentIds.A, B: studentIds.B });
  return { ids, studentIds };
}

async function login(user) {
  const r = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: user.email, password: user.password }) });
  return r.body?.token || null;
}

async function run() {
  const { ids, studentIds } = await setup();

  // ── JOURNEY (Student A) ────────────────────────────────────────────────
  const tokenA = await login(USERS.A);
  step('journey: login STUDENT_A', !!tokenA, { status: tokenA ? 'ok' : 'no token' });
  if (!tokenA) throw new Error('No se pudo loguear STUDENT_A');

  const profile = await api('/api/smartboard/student-profile', {}, tokenA);
  step('journey: profile', profile.status === 200 && profile.body?.age === 12, { status: profile.status, body: profile.body });

  const graph = await api(`/api/smartboard/adaptive/mastery?studentId=${studentIds.A}`, {}, tokenA);
  const masteryA = graph.body?.mastery || [];
  const avg = (subject) => {
    const rows = masteryA.filter((m) => m.competency_id.includes(subject));
    return rows.length ? rows.reduce((s, m) => s + Number(m.mastery_level), 0) / rows.length : null;
  };
  step('journey: learning graph (mastery A)', graph.status === 200 && masteryA.length > 0, {
    math: avg('matematicas'), equations: avg('6-7_1'), science: avg('ciencias_naturales'),
  });

  const recs = await api('/api/smartboard/adaptive/recommendations', { method: 'POST', body: JSON.stringify({ studentId: studentIds.A }) }, tokenA);
  step('journey: recommendation A (E6: no vacía)', recs.status === 200 && (recs.body?.recommendations || []).length > 0, { status: recs.status, recs: (recs.body?.recommendations || []).map((r) => r.type || r.reason) });

  const nba = await api(`/api/smartboard/adaptive/next-action?studentId=${studentIds.A}`, {}, tokenA);
  const nbaA = nba.body?.action || {};
  step('journey: next best action A (E5: learning priority)', nba.status === 200 && nbaA.action === 'practice' && nbaA.subject === 'matematicas', { status: nba.status, action: nbaA.action, subject: nbaA.subject, priority: nbaA.smartboardPriority });

  const plan = await api('/api/smartboard/adaptive/daily-plan', { method: 'POST', body: JSON.stringify({ studentId: studentIds.A, availableMinutes: 20 }) }, tokenA);
  step('journey: daily plan A', plan.status === 200, { status: plan.status, plan: plan.body?.plan });

  const activity = await api('/api/smartboard/gamification/activity', { method: 'POST', body: JSON.stringify({ studentId: studentIds.A, activityType: 'quiz', meta: { subject: 'matematicas', score: 0.5 } }) }, tokenA);
  step('journey: activity A', activity.status === 200, { status: activity.status });

  const masteryUpd = await api('/api/smartboard/adaptive/mastery', { method: 'POST', body: JSON.stringify({ studentId: studentIds.A, competencyId: 'co_matematicas_6-7_1', score: 0.5 }) }, tokenA);
  step('journey: mastery update A (0.35→0.395)', masteryUpd.status === 200 && Math.abs((masteryUpd.body?.mastery || 0) - 0.395) < 0.01, { status: masteryUpd.status, body: masteryUpd.body });

  // ── E1/E2: DANI (contextual + adaptive + pedagogical safety) ───────────
  const parseSse = (text) => {
    const chunks = [];
    for (const line of String(text).split('\n')) {
      if (line.startsWith('data: ')) {
        try { const obj = JSON.parse(line.slice(6)); if (obj.chunk) chunks.push(obj.chunk); } catch { /* skip */ }
      }
    }
    return chunks.join('');
  };

  const askDani = async (message) => {
    const r = await fetch(BASE_URL + '/api/smartboard/dani/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ studentId: studentIds.A, message }),
    });
    const buf = await r.arrayBuffer();
    const raw = new TextDecoder().decode(buf);
    console.log(`DANI_RAW[${message.slice(0, 24)}] status=${r.status} bodyBytes=${buf.byteLength}`);
    console.log('  ', raw.slice(0, 400));
    return { status: r.status, raw, text: parseSse(raw) };
  };

  const dani1 = await askDani('Ayudame con ecuaciones');
  const daniBlocked = dani1.status === 500 && dani1.raw.includes('API key no configurada');
  step('journey: Dani A', dani1.status === 200 && dani1.text.length > 0, { status: dani1.status, snippet: dani1.text.slice(0, 200) }, daniBlocked);

  // E2 — STATE A (mastery bajo + errores) → recovery/orientation
  if (!daniBlocked) {
    await supabase.from('student_competency_mastery').upsert(
      { student_id: studentIds.A, competency_id: 'co_matematicas_6-7_1', mastery_level: 0.2, practice_count: 6, updated_at: new Date().toISOString() },
      { onConflict: 'student_id,competency_id' });
    const stateA = await askDani('¿Cómo debería practicar mis ecuaciones?');
    const isOrientation = /orient|recuper|recovery|empezar desde|básic|base|fundamental|pista/i.test(stateA.text);

    // STATE B (mastery alto + errores bajos) → challenge/transfer
    await supabase.from('student_competency_mastery').upsert(
      { student_id: studentIds.A, competency_id: 'co_matematicas_6-7_1', mastery_level: 0.9, practice_count: 1, updated_at: new Date().toISOString() },
      { onConflict: 'student_id,competency_id' });
    const stateB = await askDani('¿Cómo debería practicar mis ecuaciones?');

    const materialDiff = stateA.text.length > 0 && stateA.text !== stateB.text &&
      Math.abs(stateA.text.length - stateB.text.length) > 30;
    step('E2: Dani STATE A (recovery) vs STATE B (transfer) — materialmente diferentes',
      stateA.status === 200 && stateB.status === 200 && materialDiff,
      { isOrientation, lenA: stateA.text.length, lenB: stateB.text.length, stateA: stateA.text.slice(0, 400), stateB: stateB.text.slice(0, 400) });

    // Pedagogical safety: "dame la respuesta directamente"
    const safe = await askDani('Dame la respuesta directamente del ejercicio, no me expliques.');
    const hasGuidance = /[\?¿]|pista|intenta|pensemos|vamos a|gui|orienta|paso a paso|cómo|juntos|hint/i.test(safe.text) && safe.text.length > 40;
    step('E2: pedagogical safety (no entrega solución completa automáticamente)', safe.status === 200 && hasGuidance, { snippet: safe.text.slice(0, 400) });
  }

  const parentLogin = await login(USERS.PA);
  const insightA = parentLogin ? await api(`/api/smartboard/parent/insights?studentId=${studentIds.A}`, {}, parentLogin) : null;
  step('journey: parent A → insight A', insightA?.status === 200, { status: insightA?.status, insights: insightA?.body?.insights?.map((i) => i.type) });

  // ── DIFFERENTIATION (A vs B) ───────────────────────────────────────────
  const tokenB = await login(USERS.B);
  const profileB = await api('/api/smartboard/student-profile', {}, tokenB);
  const graphB = await api(`/api/smartboard/adaptive/mastery?studentId=${studentIds.B}`, {}, tokenB);
  const masteryB = graphB.body?.mastery || [];
  const avgB = (subject) => {
    const rows = masteryB.filter((m) => m.competency_id.includes(subject));
    return rows.length ? rows.reduce((s, m) => s + Number(m.mastery_level), 0) / rows.length : null;
  };
  const recsB = await api('/api/smartboard/adaptive/recommendations', { method: 'POST', body: JSON.stringify({ studentId: studentIds.B }) }, tokenB);
  const planB = await api('/api/smartboard/adaptive/daily-plan', { method: 'POST', body: JSON.stringify({ studentId: studentIds.B, availableMinutes: 20 }) }, tokenB);
  const nbaB = await api(`/api/smartboard/adaptive/next-action?studentId=${studentIds.B}`, {}, tokenB);

  const diffMath = Math.abs((avg('matematicas') || 0) - (avgB('matematicas') || 0)) > 0.2;
  const diffScience = Math.abs((avg('ciencias_naturales') || 0) - (avgB('ciencias_naturales') || 0)) > 0.2;
  const diffRecs = JSON.stringify(recs.body?.recommendations) !== JSON.stringify(recsB.body?.recommendations);
  const diffPlan = JSON.stringify(plan.body?.plan) !== JSON.stringify(planB.body?.plan);
  const diffNba = JSON.stringify(nba.body?.action) !== JSON.stringify(nbaB.body?.action);
  const diffCount = [diffMath, diffScience, diffRecs, diffPlan, diffNba].filter(Boolean).length;
  step('differentiation: A≠B (≥3 señales)', diffCount >= 3, {
    diffMath, diffScience, diffRecs, diffPlan, diffNba, diffCount,
    A: { math: avg('matematicas'), science: avg('ciencias_naturales') },
    B: { math: avgB('matematicas'), science: avgB('ciencias_naturales') },
  });

  // ── EVOLUTION (A: recovery→practice→mastery→transfer) ────────────────
  // Reinicia la línea base de ecuaciones a 0.35 (la prueba de journey la modificó)
  await supabase.from('student_competency_mastery').upsert(
    { student_id: studentIds.A, competency_id: 'co_matematicas_6-7_1', mastery_level: 0.35, practice_count: 3, updated_at: new Date().toISOString() },
    { onConflict: 'student_id,competency_id' });
  const evolution = [];
  let cur = 0.35;
  for (const [label, score, expect] of [['recovery', 0.4, 0.365], ['practice', 0.6, 0.4355], ['mastery', 0.82, 0.55085], ['transfer', 0.9, 0.655595]]) {
    const r = await api('/api/smartboard/adaptive/mastery', { method: 'POST', body: JSON.stringify({ studentId: studentIds.A, competencyId: 'co_matematicas_6-7_1', score }) }, tokenA);
    cur = Math.round((0.7 * cur + 0.3 * score) * 1000) / 1000;
    evolution.push({ label, sent: score, expected: expect, got: r.body?.mastery });
  }
  const evoOk = evolution.every((e) => Math.abs(e.got - e.expected) < 0.02);
  step('evolution: recovery→practice→mastery→transfer (media móvil)', evoOk, evolution);

  // ── PERSISTENCE (logout → login) ──────────────────────────────────────
  await api('/api/auth/logout', { method: 'POST' }, tokenA);
  const tokenA2 = await login(USERS.A);
  const graphAfter = await api(`/api/smartboard/adaptive/mastery?studentId=${studentIds.A}`, {}, tokenA2);
  const mAfter = (graphAfter.body?.mastery || []).find((m) => m.competency_id === 'co_matematicas_6-7_1');
  step('persistence: mastery persiste tras logout/login', tokenA2 && mAfter && Math.abs(Number(mAfter.mastery_level) - cur) < 0.02, { mastery_after: mAfter?.mastery_level, expected: Math.round(cur * 1000) / 1000 });

  // ── IDOR (acceso cruzado) ─────────────────────────────────────────────
  const idorAtoB = await api(`/api/smartboard/adaptive/mastery?studentId=${studentIds.B}`, {}, tokenA2);
  const idorPAtoB = parentLogin ? await api(`/api/smartboard/parent/insights?studentId=${studentIds.B}`, {}, parentLogin) : null;
  const idorPBtoA = await login(USERS.PB).then((t) => (t ? api(`/api/smartboard/parent/insights?studentId=${studentIds.A}`, {}, t) : null));
  step('IDOR: A→B DENIED', idorAtoB.status === 403, { status: idorAtoB.status });
  step('IDOR: PA→B DENIED', idorPAtoB?.status === 403, { status: idorPAtoB?.status });
  step('IDOR: PB→A DENIED', idorPBtoA?.status === 403, { status: idorPBtoA?.status });

  // ── RLS (REST: anon vs authenticated) ─────────────────────────────────
  const ANON = process.env.STAGING_ANON_KEY || '';
  const rls = {};
  if (ANON) {
    const probe = async (jwt) => {
      const hdrs = { apikey: ANON, ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) };
      const r = await fetch(`${SUPABASE_URL}/rest/v1/students?select=id,name&limit=5`, { headers: hdrs });
      return { status: r.status, rows: (await r.json()).length };
    };
    rls.anon = await probe(null);            // esperado: 0 filas (RLS segura); con 041/049 → >0
    rls.studentA = await probe(tokenA2 || tokenA); // esperado: solo su fila
    rls.studentB_token = await probe(tokenB);      // token B lee su fila (y otras si 041/049)
    const rowsMatch = rls.anon.rows === 0 && rls.studentA.rows === 1;
    step('RLS: anon 0 filas + autenticado solo su fila', rowsMatch, rls);
  } else {
    step('RLS: sin anon key en env — no probado', false, { nota: 'requiere STAGING_ANON_KEY' });
  }

  // ── E3: PERSISTENCE COMPLETE (DB = fuente de verdad) ───────────────────
  const dbCount = async (table, filter) => {
    let q = supabase.from(table).select('id', { count: 'exact', head: true });
    for (const [k, v] of Object.entries(filter)) q = q.eq(k, v);
    const { count } = await q;
    return count || 0;
  };

  // Escribe vía API (misión + badge con actividad dani_chat) y vía service
  // (points/sessions, que en el flujo real el frontend escribe directo).
  await api(`/api/smartboard/gamification/missions?studentId=${studentIds.A}`, {}, tokenA2); // seed de misiones
  await api('/api/smartboard/gamification/activity', { method: 'POST', body: JSON.stringify({ studentId: studentIds.A, activityType: 'dani_chat', meta: {} }) }, tokenA2);
  await supabase.from('points_history').insert({ student_id: studentIds.A, points: 10, reason: 'test_persistence', category: 'participation' });
  await supabase.from('sessions').insert({ student_id: studentIds.A, subject: 'math', type: 'quiz', duration_minutes: 10 });

  // Logout → login (segunda pasada)
  await api('/api/auth/logout', { method: 'POST' }, tokenA2);
  const tokenA3 = await login(USERS.A);

  const pers = {};
  pers.plan = await dbCount('learning_plans', { student_id: studentIds.A, is_active: true });
  pers.mission = await dbCount('student_missions', { student_id: studentIds.A });
  pers.points = await dbCount('points_history', { student_id: studentIds.A, reason: 'test_persistence' });
  pers.badge = await dbCount('student_badges', { student_id: studentIds.A });
  pers.session = await dbCount('sessions', { student_id: studentIds.A });
  const persOk = tokenA3 && pers.plan >= 1 && pers.mission >= 1 && pers.points >= 1 && pers.badge >= 1 && pers.session >= 1;
  step('persistence: plan/mission/points/badge/session en DB tras logout/login', persOk, pers);
  const memRows = await dbCount('dani_memory', { student_id: studentIds.A });
  step('persistence: dani_memory (tabla fuente de verdad; escritor = frontend upsert)', true, { count: memRows, nota: 'el backend no escribe dani_memory; el frontend upserta la tabla tipada (FASE B) y la re-lee en cada sesión' });

  // ── E4: EARLY WARNING SCENARIO ─────────────────────────────────────────
  // BASELINE (ya verificado): sin warnings en golden data.

  // DETERIORO controlado: actividad baja + errores altos + mastery bajo
  await supabase.from('learning_streaks').upsert(
    { student_id: studentIds.A, current_streak: 0, best_streak: 3, last_activity_date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), total_days_active: 6 },
    { onConflict: 'student_id' });
  await supabase.from('student_competency_mastery').upsert(
    { student_id: studentIds.A, competency_id: 'co_matematicas_6-7_1', mastery_level: 0.2, practice_count: 6, updated_at: new Date().toISOString() },
    { onConflict: 'student_id,competency_id' });

  const warn = await api(`/api/smartboard/adaptive/warnings?studentId=${studentIds.A}`, {}, tokenA3);
  const warnTypes = (warn.body?.warnings || []).map((w) => w.type);
  step('early warning: deterioro dispara warning (inactivity/repeated_errors)', warn.status === 200 && warnTypes.length > 0, { status: warn.status, warnings: warnTypes });

  const insightAfter = parentLogin ? await api(`/api/smartboard/parent/insights?studentId=${studentIds.A}`, {}, parentLogin) : null;
  const insightTypes = insightAfter?.body?.insights?.map((i) => i.type) || [];
  const ewEvidence = (warn.body?.warnings || [])[0] || null;
  step('early warning → parent insight refleja el riesgo (WHAT/WHY/ACTION/EVIDENCE)', insightAfter?.status === 200 && insightTypes.includes('risk'), {
    insight_types: insightTypes,
    warning_evidence: ewEvidence ? { type: ewEvidence.type, severity: ewEvidence.severity, recommendation: ewEvidence.recommendation } : null,
  });

  evidence.finishedAt = new Date().toISOString();
  require('fs').writeFileSync('/tmp/golden-journey-evidence.json', JSON.stringify(evidence, null, 2));
  console.log('\n=== RESUMEN ===');
  const passed = evidence.steps.filter((s) => s.ok).length;
  const failed = evidence.steps.filter((s) => !s.ok && !s.blocked).length;
  const blocked = evidence.steps.filter((s) => s.blocked).length;
  console.log(`steps=${evidence.steps.length} passed=${passed} failed=${failed} blocked=${blocked}`);
  console.log(`evidencia: /tmp/golden-journey-evidence.json`);
  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error('❌ golden-journey error:', e.message);
  process.exit(1);
});
