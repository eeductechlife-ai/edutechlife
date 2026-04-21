// Script para verificar integración Clerk JWT con Supabase
import { createClient } from '@supabase/supabase-js';

// Configuración directa (sin import.meta.env)
const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseKey = 'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn';

// Reimplementar createClerkSupabaseClient para testing
const createClerkSupabaseClient = (clerkToken = null) => {
  const fetchWithClerkToken = async (url, options = {}) => {
    const headers = new Headers(options?.headers || {});
    
    // Inyectar token JWT de Clerk si está disponible
    if (clerkToken) {
      headers.set('Authorization', `Bearer ${clerkToken}`);
      console.log('✅ [CLERK-JWT] Token inyectado en petición Supabase');
    }
    
    // Usar fetch nativo del navegador (sin interceptor global)
    return fetch(url, {
      ...options,
      headers,
    });
  };

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: !clerkToken,
      persistSession: !clerkToken,
      detectSessionInUrl: !clerkToken,
    },
    global: {
      fetch: fetchWithClerkToken,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Info': clerkToken ? 'edutechlife-clerk-jwt' : 'edutechlife-supabase-base',
      },
    },
    db: {
      schema: 'public',
    },
  });
};

// Simular un token JWT de Clerk (en realidad esto vendría de useAuth().getToken())
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

console.log('🔍 Probando integración Clerk JWT...');

try {
  // Crear cliente con token JWT simulado
  const supabaseWithToken = createClerkSupabaseClient(testToken);
  
  console.log('✅ Cliente Supabase con JWT creado');
  console.log('   Tipo:', typeof supabaseWithToken);
  console.log('   Tiene .from?', typeof supabaseWithToken.from);
  console.log('   Tiene .auth?', typeof supabaseWithToken.auth);
  
  // Probar una consulta con el cliente con token
  console.log('\\n📊 Probando consulta con token JWT...');
  
  const { data, error } = await supabaseWithToken
    .from('forum_posts')
    .select('count')
    .limit(1);
  
  if (error) {
    console.log('❌ Error en consulta:', error.message);
    console.log('   Código:', error.code);
    
    if (error.code === '42501') {
      console.log('   ⚠️  RLS todavía bloqueando (necesita políticas configuradas)');
    }
  } else {
    console.log('✅ Consulta exitosa con token JWT');
    console.log('   Resultado:', data);
  }
  
  // Probar también con cliente base (sin token)
  console.log('\\n📊 Probando cliente base (sin token)...');
  const supabaseBase = createClerkSupabaseClient();
  
  const { data: baseData, error: baseError } = await supabaseBase
    .from('forum_posts')
    .select('count')
    .limit(1);
  
  if (baseError) {
    console.log('❌ Error en cliente base:', baseError.message);
  } else {
    console.log('✅ Cliente base funciona');
  }
  
} catch (err) {
  console.error('❌ Error general:', err.message);
  console.error('Stack:', err.stack);
}

console.log('\\n🎉 Prueba de integración completada');