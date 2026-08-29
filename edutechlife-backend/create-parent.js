// One-time script to create a test parent account
// Run from edutechlife-backend directory
require('dotenv').config();
const supabase = require('./src/db/supabase');

const STUDENT_EMAIL = 'eeductechlife2@gmail.com';
const PARENT_PASSWORD = 'edi646108';

async function createTestParent() {
  const normalizedStudentEmail = STUDENT_EMAIL.toLowerCase().trim();
  const [local, domain] = normalizedStudentEmail.split('@');
  const parentAuthEmail = `${local}+padre@${domain}`;

  console.log('Parent email will be:', parentAuthEmail);

  // Find the student
  const { data: studentProfile, error: studentError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', normalizedStudentEmail)
    .maybeSingle();

  if (!studentProfile?.id) {
    console.error('No student found with email:', normalizedStudentEmail, studentError);
    process.exit(1);
  }
  console.log('Found student:', studentProfile.id);

  // Check if parent already exists
  const { data: existingAuth } = await supabase.auth.admin.listUsers();
  const existingParent = existingAuth?.users?.find(u => u.email === parentAuthEmail);
  if (existingParent) {
    console.log('Parent auth user already exists:', existingParent.id);
    console.log('Try logging in with:', parentAuthEmail, '/', PARENT_PASSWORD);
    // Try to update password
    const { error: updateErr } = await supabase.auth.admin.updateUserById(existingParent.id, {
      password: PARENT_PASSWORD,
    });
    if (updateErr) console.error('Failed to update password:', updateErr.message);
    else console.log('Password updated successfully');
    process.exit(0);
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: parentAuthEmail,
    password: PARENT_PASSWORD,
    email_confirm: true,
    user_metadata: {
      role: 'parent',
      student_email: normalizedStudentEmail,
      student_id: studentProfile.id,
      first_name: 'Padre',
      last_name: 'Test',
    },
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    process.exit(1);
  }

  const userId = authData.user?.id;
  console.log('Created parent auth user:', userId);

  // Create users profile
  const { error: profileError } = await supabase
    .from('users')
    .insert([{
      id: userId,
      email: parentAuthEmail,
      first_name: 'Padre',
      last_name: 'Test',
      username: `padre_${local}`,
      user_type: 'parent',
      clerk_id: userId,
      platform: 'smartboard',
    }])
    .select()
    .maybeSingle();

  if (profileError) {
    console.warn('Profile insert warning:', profileError.message);
  }

  // Link parent to student
  const { error: linkError } = await supabase
    .from('parent_student_links')
    .upsert({
      parent_user_id: userId,
      student_user_id: studentProfile.id,
      is_active: true,
    }, { onConflict: 'parent_user_id,student_user_id' });

  if (linkError) {
    console.warn('Link warning:', linkError.message);
  }

  console.log('Parent account created successfully!');
  console.log('Login with student email:', STUDENT_EMAIL);
  console.log('Parent password:', PARENT_PASSWORD);
}

createTestParent().catch(console.error);
