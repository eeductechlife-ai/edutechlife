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

/**
 * Cliente Supabase base (anónimo)
 * Para uso cuando no hay sesión Clerk disponible
 */
const baseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Info': 'edutechlife-supabase-base',
    },
  },
  db: {
    schema: 'public',
  },
});

/**
 * Crea un cliente Supabase con JWT de Clerk
 * @param {Object} session - Sesión de Clerk (de useSession)
 * @returns {Object} Cliente Supabase configurado con JWT de Clerk
 */
export const getSupabase = async (session) => {
  if (!session || !session.getToken) {
    console.log('🔓 Usando cliente Supabase base (sin sesión Clerk)');
    return baseClient;
  }
  
  try {
    // Obtener token JWT de Clerk usando template 'supabase'
    const token = await session.getToken({ template: 'supabase' });
    
    if (!token) {
      console.warn('⚠️ No se pudo obtener token JWT de Clerk, usando cliente base');
      return baseClient;
    }
    
    console.log('✅ Cliente Supabase con JWT de Clerk (token obtenido)');
    
    // Crear cliente con JWT de Clerk
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false, // Clerk maneja la sesión
        persistSession: false,   // No persistir en localStorage
        detectSessionInUrl: false,
        
        // Override storage para usar token de Clerk
        storageKey: 'clerk-supabase-token',
        storage: {
          getItem: async (key) => {
            if (key === 'clerk-supabase-token') {
              const freshToken = await session.getToken({ template: 'supabase' });
              return JSON.stringify({ access_token: freshToken });
            }
            return null;
          },
          setItem: () => {}, // No-op, Clerk maneja el token
          removeItem: () => {}, // No-op
        },
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Client-Info': 'edutechlife-clerk-jwt',
        },
      },
      db: {
        schema: 'public',
      },
    });
    
  } catch (error) {
    console.error('❌ Error creando cliente Supabase con JWT de Clerk:', error);
    console.log('🔓 Fallback a cliente base');
    return baseClient;
  }
};

/**
 * Cliente Supabase dinámico que intenta usar JWT de Clerk si está disponible
 * Mantiene compatibilidad con código existente
 */
export const supabase = {
  // Proxy para métodos del cliente base
  ...baseClient,
  
  // Override de auth para usar Clerk si está disponible
  auth: {
    // Copiar TODOS los métodos de auth del cliente base
    ...baseClient.auth,
    
    // Interceptar getSession para usar Clerk si está disponible
    getSession: async () => {
      try {
        // Verificar si Clerk está disponible globalmente
        if (typeof window !== 'undefined' && window.Clerk?.session) {
          const token = await window.Clerk.session.getToken({ template: 'supabase' });
          if (token) {
            return {
              data: { session: { access_token: token } },
              error: null,
            };
          }
        }
      } catch (error) {
        console.warn('No se pudo obtener sesión de Clerk:', error);
      }
      
      // Fallback a sesión nativa de Supabase
      return baseClient.auth.getSession();
    },
    
    // Asegurar que onAuthStateChange esté disponible (delegar al cliente base)
    onAuthStateChange: baseClient.auth.onAuthStateChange?.bind(baseClient.auth) || 
      (() => { 
        console.warn('onAuthStateChange no disponible en cliente base');
        return { data: { subscription: { unsubscribe: () => {} } } };
      }),
    
    // Asegurar que signOut esté disponible
    signOut: baseClient.auth.signOut?.bind(baseClient.auth) || 
      (() => { 
        console.warn('signOut no disponible en cliente base');
        return Promise.resolve({ error: null });
      }),
    
    // Asegurar que signInWithPassword esté disponible
    signInWithPassword: baseClient.auth.signInWithPassword?.bind(baseClient.auth) || 
      ((credentials) => { 
        console.warn('signInWithPassword no disponible en cliente base');
        return Promise.resolve({ error: new Error('Método no disponible') });
      }),
    
    // Asegurar que signUp esté disponible
    signUp: baseClient.auth.signUp?.bind(baseClient.auth) || 
      ((credentials) => { 
        console.warn('signUp no disponible en cliente base');
        return Promise.resolve({ error: new Error('Método no disponible') });
      }),
  },
  
  // Método helper para obtener cliente con sesión específica
  withSession: (session) => getSupabase(session),
};

// Hacer disponible globalmente para debugging y acceso directo
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export default supabase;
