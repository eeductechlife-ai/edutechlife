/**
 * Seed script: crea un usuario para IALab y otro para IngenIA en Supabase.
 * Las credenciales se leen de un JSON externo al repo (nunca se versionan).
 * Usage: node src/scripts/seed-ialab-ingenia-users.js /ruta/credenciales.json
 */

const fs = require('fs');
const supabase = require('../db/supabase');

async function seedUser(u) {
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { username: u.username, first_name: u.first_name, last_name: u.last_name },
  });

  let userId;
  if (authError) {
    if (!/already|registered|exists/i.test(authError.message)) {
      throw new Error(`Auth ${u.email}: ${authError.message}`);
    }
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users?.find((x) => x.email === u.email);
    if (!existing) throw new Error(`Auth ${u.email}: existe pero no se pudo localizar`);
    userId = existing.id;
    const { error: updErr } = await supabase.auth.admin.updateUserById(userId, { password: u.password });
    if (updErr) throw new Error(`Password ${u.email}: ${updErr.message}`);
  } else {
    userId = authData.user.id;
  }

  const { error: profileError } = await supabase.from('users').upsert(
    [{
      id: userId,
      clerk_id: userId,
      email: u.email,
      username: u.username,
      first_name: u.first_name,
      last_name: u.last_name,
      user_type: 'student',
      platform: u.platform,
      registration_source: 'seed_manual',
    }],
    { onConflict: 'id' }
  );
  if (profileError) throw new Error(`Perfil ${u.email}: ${profileError.message}`);

  console.log(`✓ ${u.plataforma}: ${u.email} (${userId})`);
}

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('Falta la ruta al JSON de credenciales');
  const users = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const u of users) await seedUser(u);
  console.log('\n✅ Usuarios listos');
}

main().then(() => process.exit(0)).catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
