const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Prefer SERVICE_KEY for backend admin operations (createUser, updateUserById)
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('WARNING: SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) must be configured in .env');
  console.warn('  Database features will not work until configured.');
} else if (!process.env.SUPABASE_SERVICE_KEY) {
  console.warn('WARNING: Using SUPABASE_ANON_KEY - admin operations (OAuth user creation) will fail.');
  console.warn('  Set SUPABASE_SERVICE_KEY for full functionality.');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase;
