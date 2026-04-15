import { createClient } from '@supabase/supabase-js';

// Usar valores de entorno o valores por defecto para producción
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn';

// Solo mostrar logs en desarrollo
if (import.meta.env.DEV) {
  console.log('🔌 Supabase URL:', supabaseUrl);
  console.log('🔑 Supabase ANON Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NO CONFIGURADA');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '⚠️ Supabase credentials not configured. ' +
      'Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
    );
  }
}

// Validar que las credenciales estén presentes
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are required. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
});

// Hacer disponible globalmente para debugging y acceso directo
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export default supabase;
