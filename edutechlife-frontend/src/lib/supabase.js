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

// Cache de clientes Supabase por token para evitar múltiples instancias
const supabaseClientsCache = new Map();

// Contador para debugging
let clientCreationCount = 0;

// Singleton global para cliente base
let globalSupabaseClient = null;

/**
 * Crea un cliente Supabase con fetch personalizado para inyectar JWT de Clerk
 * Usa singleton pattern para evitar múltiples instancias del mismo cliente
 * @param {string} clerkToken - Token JWT de Clerk (opcional)
 * @returns {Object} Cliente Supabase configurado
 */
export const createClerkSupabaseClient = (clerkToken = null) => {
  // Usar cache para reutilizar clientes existentes
  const cacheKey = clerkToken ? `jwt_${clerkToken.substring(0, 20)}` : 'anonymous';
  
  if (supabaseClientsCache.has(cacheKey)) {
    if (import.meta.env.DEV) {
      console.log(`♻️ [Supabase-Cache] Reutilizando cliente: ${cacheKey}`);
      console.log(`   Cliente #${Array.from(supabaseClientsCache.keys()).indexOf(cacheKey) + 1} de ${supabaseClientsCache.size}`);
    }
    return supabaseClientsCache.get(cacheKey);
  }
  
  clientCreationCount++;
  if (import.meta.env.DEV) {
    console.log(`🆕 [Supabase-Cache] Creando cliente #${clientCreationCount}: ${cacheKey}`);
    console.log(`   Token presente: ${!!clerkToken}`);
    if (clerkToken) {
      console.log(`   Token inicio: ${clerkToken.substring(0, 10)}...`);
    }
  }
  
  const fetchWithClerkToken = async (url, options = {}) => {
    const headers = new Headers(options?.headers || {});
    
    // INCLUIR API KEY DE SUPABASE (CRÍTICO)
    // La API key es requerida para todas las peticiones a Supabase
    headers.set('apikey', supabaseAnonKey);
    headers.set('Authorization', `Bearer ${supabaseAnonKey}`);
    
    // Inyectar token JWT de Clerk si está disponible (sobrescribe Authorization)
    if (clerkToken) {
      headers.set('Authorization', `Bearer ${clerkToken}`);
      if (import.meta.env.DEV) {
        console.log('✅ [CLERK-JWT] Token inyectado en petición Supabase');
      }
    }
    
    // Log para desarrollo
    if (import.meta.env.DEV) {
      const method = options.method || 'GET';
      console.log(`🌐 [Supabase] ${method} ${url.replace(supabaseUrl, '')}`);
      
      // Mostrar headers (sin tokens por seguridad)
      const headersObj = {};
      headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'authorization' && lowerKey !== 'apikey') {
          headersObj[key] = value;
        } else if (lowerKey === 'apikey') {
          headersObj[key] = '***' + value.substring(value.length - 4); // Mostrar solo últimos 4 chars
        }
      });
      if (Object.keys(headersObj).length > 0) {
        console.log('   Headers:', headersObj);
      }
    }
    
    // Usar fetch nativo del navegador (sin interceptor global)
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Log de respuesta para desarrollo
    if (import.meta.env.DEV) {
      const status = response.status;
      const statusText = response.statusText;
      
      if (status === 401) {
        console.warn(`⚠️ [Supabase] 401 Unauthorized: ${method} ${url.replace(supabaseUrl, '')}`);
        console.warn('   Razón: RLS (Row Level Security) está bloqueando acceso anónimo');
        console.warn('   Solución: Configurar políticas RLS en Supabase Dashboard');
        console.warn('   Temporal: El sistema usará datos simulados');
      } else if (status >= 400) {
        console.warn(`⚠️ [Supabase] ${status} ${statusText}: ${method} ${url.replace(supabaseUrl, '')}`);
      } else if (status === 200 || status === 201) {
        console.log(`✅ [Supabase] ${status} OK: ${method} ${url.replace(supabaseUrl, '')}`);
      }
    }
    
    return response;
  };

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: !clerkToken, // Clerk maneja la sesión si hay token
      persistSession: !clerkToken,   // No persistir si Clerk maneja la sesión
      detectSessionInUrl: !clerkToken,
      storageKey: clerkToken ? `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token-jwt` : `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`,
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
  
  // Cachear cliente para reutilización
  supabaseClientsCache.set(cacheKey, client);
  
  if (import.meta.env.DEV) {
    console.log(`✅ [Supabase-Cache] Cliente creado: ${cacheKey}`);
    console.log(`   Total clientes en cache: ${supabaseClientsCache.size}`);
    console.log(`   Claves en cache: ${Array.from(supabaseClientsCache.keys()).join(', ')}`);
  }
  
  return client;
};

/**
 * Cliente Supabase base (anónimo) - sin token Clerk
 * Para uso cuando no hay sesión Clerk disponible
 * SINGLETON: Solo una instancia global para toda la app
 */
const getSupabaseSingleton = () => {
  if (!globalSupabaseClient) {
    globalSupabaseClient = createClerkSupabaseClient();
    if (import.meta.env.DEV) {
      console.log('🌍 [Supabase-Singleton] Cliente global creado');
    }
  }
  return globalSupabaseClient;
};

const supabase = getSupabaseSingleton();

/**
 * Crea un cliente Supabase con JWT de Clerk obtenido de una sesión
 * @param {Object} session - Sesión de Clerk (de useSession)
 * @returns {Object} Cliente Supabase configurado con JWT de Clerk
 * @deprecated Usar createClerkSupabaseClient() directamente con token
 */
export const getSupabaseWithClerkSession = async (session) => {
  console.warn('⚠️ getSupabaseWithClerkSession está deprecado, usar createClerkSupabaseClient()');
  
  if (!session || !session.getToken) {
    if (import.meta.env.DEV) {
      console.log('🔓 Usando cliente Supabase base (sin sesión Clerk)');
    }
    return supabase;
  }
  
  try {
    // Obtener token JWT de Clerk usando template 'supabase'
    const token = await session.getToken({ template: 'supabase' });
    
    if (!token) {
      console.warn('⚠️ No se pudo obtener token JWT de Clerk, usando cliente base');
      return supabase;
    }
    
    if (import.meta.env.DEV) {
      console.log('✅ Creando cliente Supabase con JWT de Clerk');
    }
    
    // Crear cliente con token JWT de Clerk
    return createClerkSupabaseClient(token);
    
  } catch (error) {
    console.error('❌ Error creando cliente Supabase con JWT de Clerk:', error);
    console.log('🔓 Fallback a cliente base');
    return supabase;
  }
};

/**
 * Helper para obtener sesión Clerk si está disponible
 * Compatible con código existente que usa supabase.auth.getSession()
 */
supabase.auth.getSessionWithClerk = async () => {
  try {
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
  return supabase.auth.getSession();
};

/**
 * Helper para verificar si Clerk está disponible
 */
supabase.hasClerkSession = () => {
  return typeof window !== 'undefined' && !!window.Clerk?.session;
};

// Hacer disponible globalmente para debugging (solo en desarrollo)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.supabase = supabase;
  window.supabaseDebug = {
    clientCount: clientCreationCount,
    cacheSize: supabaseClientsCache.size,
    cacheKeys: Array.from(supabaseClientsCache.keys()),
    getSingleton: getSupabaseSingleton,
    clearCache: () => {
      supabaseClientsCache.clear();
      globalSupabaseClient = null;
      clientCreationCount = 0;
      console.log('🧹 [Supabase-Debug] Cache limpiado');
    }
  };
}

export default supabase;
export { supabase };
