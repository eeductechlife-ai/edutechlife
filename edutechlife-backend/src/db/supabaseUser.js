const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

/**
 * Creates a Supabase client scoped to the authenticated user's JWT.
 * Unlike the service_role client, this client runs under RLS — the database
 * enforces row ownership via auth.uid(). Use it for all queries that touch
 * rows owned by the requesting user (reads, updates, deletes of their own data).
 * Keep service_role only for admin operations (user creation, cross-user queries).
 *
 * Usage in route handlers:
 *   const db = createUserClient(req.userToken);
 *   const { data } = await db.from('students').select('*');  // RLS filters to req user
 */
function createUserClient(accessToken) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = { createUserClient };
