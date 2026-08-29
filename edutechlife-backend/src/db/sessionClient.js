const { createClient } = require('@supabase/supabase-js');

// Throwaway client for user-scoped auth operations (signInWithPassword, ...).
// signInWithPassword saves a session on the client it runs on; using the shared
// service client would pin that user's session and make every subsequent data
// query send Authorization: Bearer <user-jwt> (role=authenticated, RLS applies),
// breaking students/sessions/points queries with 42501 errors.
function createSessionClient() {
  return createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || 'placeholder-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

module.exports = { createSessionClient };
