/**
 * security-live-test.js — Matriz de seguridad contra STAGING real (FASE D).
 *
 * USO (en CI, job staging-journey; las keys se resuelven en-runner):
 *   STAGING_SUPABASE_URL=... STAGING_SUPABASE_SERVICE_ROLE_KEY=... STAGING_ANON_KEY=...
 *   BASE_URL=http://localhost:3001 node src/scripts/security-live-test.js
 *
 * Matrices:
 *   - POSITIVE: A→A ALLOWED, PA→A ALLOWED, PB→B ALLOWED, admin→admin ALLOWED
 *   - IDOR (negativo): A→B, B→A, PA→B, PB→A → todos 403
 *   - RLS (REST): anon→0 filas, authenticated→1 fila (solo propia)
 *
 * NO imprime secrets. Escribe evidencia en /tmp/security-live-evidence.json.
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.STAGING_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON = process.env.STAGING_ANON_KEY || '';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Requiere STAGING_SUPABASE_URL y STAGING_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const USERS = {
  A: { email: 'student.a.staging@edutechlife.test', password: 'StagingTestA!2026' },
  B: { email: 'student.b.staging@edutechlife.test', password: 'StagingTestB!2026' },
  PA: { email: 'parent.a.staging@edutechlife.test', password: 'StagingTestPA!2026' },
  PB: { email: 'parent.b.staging@edutechlife.test', password: 'StagingTestPB!2026' },
  ADMIN: { email: 'admin.staging@edutechlife.test', password: 'StagingTestADM!2026' },
};

const evidence = { startedAt: new Date().toISOString(), results: [] };
const record = (name, expected, actual, ok) => {
  evidence.results.push({ name, expected, actual, ok });
  console.log(`${ok ? '✓' : '✗'} ${name} — esperado ${expected}, real ${actual}`);
};

async function api(path, opts = {}, token) {
  const res = await fetch(BASE_URL + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) },
  });
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch { body = text.slice(0, 150); }
  return { status: res.status, body };
}

async function login(user) {
  const r = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: user.email, password: user.password }) });
  return r.body?.token || null;
}

async function setup() {
  const ids = {};
  for (const [k, u] of Object.entries(USERS)) {
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    let user = (list?.users || []).find((x) => x.email === u.email);
    if (!user) {
      const opts = {
        email: u.email, password: u.password, email_confirm: true,
        user_metadata: { role: k.startsWith('P') ? 'parent' : k === 'ADMIN' ? undefined : 'student', staging: true },
      };
      if (k === 'ADMIN') opts.app_metadata = { role: 'admin' };
      const { data, error } = await supabase.auth.admin.createUser(opts);
      if (error) throw new Error(`createUser ${u.email}: ${error.message}`);
      user = data.user;
    }
    ids[k] = user.id;
  }
  const studentIds = {};
  for (const [k, n] of [['A', 'Estudiante A'], ['B', 'Estudiante B']]) {
    await supabase.from('students').upsert({ auth_id: ids[k], name: n, age: 12, grade: '7', grade_level: 7, country_code: 'CO', school: 'Staging School', language: 'es' }, { onConflict: 'auth_id' });
    const { data: st } = await supabase.from('students').select('id').eq('auth_id', ids[k]).maybeSingle();
    studentIds[k] = st.id;
  }
  await supabase.from('parent_student_links').upsert({ parent_user_id: ids.PA, student_user_id: ids.A, is_active: true }, { onConflict: 'parent_user_id,student_user_id' });
  await supabase.from('parent_student_links').upsert({ parent_user_id: ids.PB, student_user_id: ids.B, is_active: true }, { onConflict: 'parent_user_id,student_user_id' });
  return { ids, studentIds };
}

async function run() {
  const { studentIds } = await setup();
  const tA = await login(USERS.A);
  const tB = await login(USERS.B);
  const tPA = await login(USERS.PA);
  const tPB = await login(USERS.PB);
  const tADM = await login(USERS.ADMIN);

  record('auth: login STUDENT_A', 'token', tA ? 'ok' : 'no', !!tA);
  record('auth: login STUDENT_B', 'token', tB ? 'ok' : 'no', !!tB);
  record('auth: login PARENT_A', 'token', tPA ? 'ok' : 'no', !!tPA);
  record('auth: login PARENT_B', 'token', tPB ? 'ok' : 'no', !!tPB);
  record('auth: login ADMIN', 'token', tADM ? 'ok' : 'no', !!tADM);

  // ── POSITIVE ───────────────────────────────────────────────────────────
  const pOwn = await api(`/api/smartboard/adaptive/mastery?studentId=${studentIds.A}`, {}, tA);
  record('positive: A lee su mastery', '200', pOwn.status, pOwn.status === 200);

  const pInsA = await api(`/api/smartboard/parent/insights?studentId=${studentIds.A}`, {}, tPA);
  record('positive: PA ve A', '200', pInsA.status, pInsA.status === 200);

  const pInsB = await api(`/api/smartboard/parent/insights?studentId=${studentIds.B}`, {}, tPB);
  record('positive: PB ve B', '200', pInsB.status, pInsB.status === 200);

  const adminMe = tADM ? await api('/api/admin/auth/me', {}, tADM) : null;
  record('positive: ADMIN /admin/auth/me', '200', adminMe?.status, adminMe?.status === 200);

  // ── IDOR (negativo — esperar 403) ──────────────────────────────────────
  const iAtoB = await api(`/api/smartboard/adaptive/mastery?studentId=${studentIds.B}`, {}, tA);
  record('IDOR: A → B', '403', iAtoB.status, iAtoB.status === 403);

  const iBtoA = await api(`/api/smartboard/adaptive/mastery?studentId=${studentIds.A}`, {}, tB);
  record('IDOR: B → A', '403', iBtoA.status, iBtoA.status === 403);

  const iPAtoB = await api(`/api/smartboard/parent/insights?studentId=${studentIds.B}`, {}, tPA);
  record('IDOR: PA → B', '403', iPAtoB.status, iPAtoB.status === 403);

  const iPBtoA = await api(`/api/smartboard/parent/insights?studentId=${studentIds.A}`, {}, tPB);
  record('IDOR: PB → A', '403', iPBtoA.status, iPBtoA.status === 403);

  // Escritura cruzada (IDOR write)
  const wAtoB = await api('/api/smartboard/adaptive/mastery', { method: 'POST', body: JSON.stringify({ studentId: studentIds.B, competencyId: 'co_matematicas_6-7_1', score: 0.5 }) }, tA);
  record('IDOR write: A → B mastery', '403', wAtoB.status, wAtoB.status === 403);

  // ── RLS (REST) ─────────────────────────────────────────────────────────
  if (ANON) {
    const rAnon = await fetch(`${SUPABASE_URL}/rest/v1/students?select=id&limit=5`, { headers: { apikey: ANON } });
    const anonRows = (await rAnon.json()).length;
    record('RLS: anon lee students', '0 filas', anonRows, anonRows === 0);

    const rAuthA = await fetch(`${SUPABASE_URL}/rest/v1/students?select=id&limit=5`, { headers: { apikey: ANON, Authorization: `Bearer ${tA}` } });
    const authARows = (await rAuthA.json()).length;
    record('RLS: STUDENT_A lee students', '1 fila (propia)', authARows, authARows === 1);

    const rAuthB = await fetch(`${SUPABASE_URL}/rest/v1/students?select=id&limit=5`, { headers: { apikey: ANON, Authorization: `Bearer ${tB}` } });
    const authBRows = (await rAuthB.json()).length;
    record('RLS: STUDENT_B lee students', '1 fila (propia)', authBRows, authBRows === 1);
  } else {
    record('RLS: sin STAGING_ANON_KEY', 'n/a', 'n/a', false);
  }

  evidence.finishedAt = new Date().toISOString();
  require('fs').writeFileSync('/tmp/security-live-evidence.json', JSON.stringify(evidence, null, 2));
  const passed = evidence.results.filter((r) => r.ok).length;
  const failed = evidence.results.length - passed;
  console.log(`\n=== SECURITY LIVE === passed=${passed} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

run().catch((e) => { console.error('security-live error:', e.message); process.exit(1); });
