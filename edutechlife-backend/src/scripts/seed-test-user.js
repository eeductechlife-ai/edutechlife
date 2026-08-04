/**
 * Seed script: Create test user for SmartBoard
 * Usage: node src/scripts/seed-test-user.js
 */

const supabase = require('../db/supabase');
const crypto = require('crypto');

async function seedTestUser() {
  const testEmail = 'smartboard@test.co';
  const testPassword = 'SmartBoard@2026';
  const testUsername = 'smartboardtest';

  try {
    console.log('Creating test user for SmartBoard...');

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        username: testUsername,
      },
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log(`✓ User ${testEmail} already exists`);
        return { email: testEmail, password: testPassword };
      }
      throw new Error(`Auth creation failed: ${authError.message}`);
    }

    const userId = authData.user.id;
    console.log(`✓ Auth user created: ${userId}`);

    // 2. Create profile row
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          clerk_id: userId,
          email: testEmail,
          username: testUsername,
          first_name: 'Test',
          last_name: 'SmartBoard',
          user_type: 'student',
          platform: 'smartboard',
          age_range: '13-17',
          registration_source: 'seed_test',
        },
      ])
      .select()
      .single();

    if (profileError) {
      if (profileError.message.includes('duplicate key')) {
        console.log(`✓ Profile for ${testEmail} already exists`);
        return { email: testEmail, password: testPassword };
      }
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    console.log(`✓ Profile created for user: ${profileData.username}`);
    console.log('\n✅ Test user ready to use:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   Username: ${testUsername}`);

    return { email: testEmail, password: testPassword };
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedTestUser().then(() => {
  console.log('\n✓ Seed script completed');
  process.exit(0);
});
