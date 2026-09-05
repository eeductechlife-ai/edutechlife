/**
 * seed-staging.js — Crea test users sintéticos + golden data en Supabase STAGING.
 *
 * USO (SOLO en staging, NUNCA en producción):
 *   STAGING_SUPABASE_URL=https://<ref>.supabase.co \
 *   STAGING_SUPABASE_SERVICE_ROLE_KEY=<service-role-de-staging> \
 *   node src/scripts/seed-staging.js
 *
 * Crea (idempotente):
 *   - 4 auth users sintéticos (emails .test): STUDENT_A/B, PARENT_A/B
 *   - filas en students (A: 12, grado 7; B: 12, grado 7)
 *   - parent_student_links (PARENT_A<->A, PARENT_B<->B)
 *   - golden mastery en student_competency_mastery (A: math 45/ecua 35/ciencias 80;
 *     B: math 85/ecua 90/ciencias 50)
 *
 * NO contiene datos personales reales ni credenciales de producción.
 * Imprime las contraseñas generadas UNA vez (para login de prueba).
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.STAGING_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Requiere STAGING_SUPABASE_URL y STAGING_SUPABASE_SERVICE_ROLE_KEY');
  console.error('   (o SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY apuntando al proyecto STAGING).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const genPassword = (n = 16) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  let out = '';
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const USERS = [
  { email: 'student.a.staging@edutechlife.test', role: 'student', name: 'Estudiante A' },
  { email: 'student.b.staging@edutechlife.test', role: 'student', name: 'Estudiante B' },
  { email: 'parent.a.staging@edutechlife.test', role: 'parent', name: 'Padre de A' },
  { email: 'parent.b.staging@edutechlife.test', role: 'parent', name: 'Padre de B' },
];

const GOLDEN = {
  A: [
    ['co_matematicas_6-7_0', 0.45],
    ['co_matematicas_6-7_1', 0.35], // ecuaciones — débil
    ['co_matematicas_6-7_2', 0.5],
    ['co_matematicas_6-7_3', 0.4],
    ['co_ciencias_naturales_6-7_0', 0.8],
    ['co_ciencias_naturales_6-7_1', 0.8],
    ['co_ciencias_naturales_6-7_2', 0.8],
    ['co_ciencias_naturales_6-7_3', 0.8],
    ['co_lenguaje_6-7_0', 0.6],
    ['co_lenguaje_6-7_1', 0.6],
    ['co_lenguaje_6-7_2', 0.6],
  ],
  B: [
    ['co_matematicas_6-7_0', 0.85],
    ['co_matematicas_6-7_1', 0.9], // ecuaciones — fuerte
    ['co_matematicas_6-7_2', 0.85],
    ['co_matematicas_6-7_3', 0.8],
    ['co_ciencias_naturales_6-7_0', 0.5],
    ['co_ciencias_naturales_6-7_1', 0.5],
    ['co_ciencias_naturales_6-7_2', 0.5],
    ['co_ciencias_naturales_6-7_3', 0.5],
    ['co_lenguaje_6-7_0', 0.65],
    ['co_lenguaje_6-7_1', 0.65],
    ['co_lenguaje_6-7_2', 0.65],
  ],
};

async function findOrCreateUser(u) {
  const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10, filter: u.email });
  const existing = (list?.users || []).find((x) => x.email === u.email);
  if (existing) {
    console.log(`✓ usuario ya existe: ${u.email} (${existing.id})`);
    return { id: existing.id, created: false, password: null };
  }
  const password = genPassword();
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password,
    email_confirm: true,
    user_metadata: { role: u.role, staging: true },
  });
  if (error) throw error;
  console.log(`+ creado: ${u.email} (${data.user.id})`);
  return { id: data.user.id, created: true, password };
}

async function upsertStudent(authId, name, age, gradeLevel) {
  const { error } = await supabase.from('students').upsert(
    {
      auth_id: authId,
      name,
      age,
      grade: String(gradeLevel),
      grade_level: gradeLevel,
      country_code: 'CO',
      school: 'Staging School',
      language: 'es',
    },
    { onConflict: 'auth_id' },
  );
  if (error) throw error;
  const { data } = await supabase.from('students').select('id').eq('auth_id', authId).maybeSingle();
  return data?.id;
}

async function upsertParentLink(parentAuthId, studentAuthId) {
  const { error } = await supabase.from('parent_student_links').upsert(
    { parent_user_id: parentAuthId, student_user_id: studentAuthId, is_active: true },
    { onConflict: 'parent_user_id,student_user_id' },
  );
  if (error) throw error;
  console.log(`✓ parent link: ${parentAuthId} -> ${studentAuthId}`);
}

async function upsertMastery(studentId, competencyId, masteryLevel) {
  const { error } = await supabase.from('student_competency_mastery').upsert(
    {
      student_id: studentId,
      competency_id: competencyId,
      mastery_level: masteryLevel,
      practice_count: 3,
      last_score: masteryLevel,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,competency_id' },
  );
  if (error) throw error;
}

async function main() {
  const passwords = {};
  const ids = {};

  for (const u of USERS) {
    const res = await findOrCreateUser(u);
    ids[u.email] = res.id;
    if (res.password) passwords[u.email] = res.password;
  }

  const studentAId = await upsertStudent(ids['student.a.staging@edutechlife.test'], 'Estudiante A', 12, 7);
  const studentBId = await upsertStudent(ids['student.b.staging@edutechlife.test'], 'Estudiante B', 12, 7);
  console.log(`✓ students: A=${studentAId} B=${studentBId}`);

  await upsertParentLink(ids['parent.a.staging@edutechlife.test'], ids['student.a.staging@edutechlife.test']);
  await upsertParentLink(ids['parent.b.staging@edutechlife.test'], ids['student.b.staging@edutechlife.test']);

  for (const [competencyId, level] of GOLDEN.A) await upsertMastery(studentAId, competencyId, level);
  for (const [competencyId, level] of GOLDEN.B) await upsertMastery(studentBId, competencyId, level);
  console.log('✓ golden data: 22 filas de mastery insertadas');

  console.log('\n=== PASSWORDS (mostradas una sola vez — guardar para pruebas) ===');
  for (const [email, pw] of Object.entries(passwords)) {
    console.log(`  ${email} -> ${pw}`);
  }
  console.log('\nSeed staging completado.');
}

main().catch((e) => {
  console.error('❌ Error en seed:', e.message);
  process.exit(1);
});
