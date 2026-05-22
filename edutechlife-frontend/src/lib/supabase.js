import { createClient } from '@supabase/supabase-js';

// Usar valores de entorno o valores por defecto para producción
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_k08noZw4qI-0oytgCaUAhg_V3cEIkfn';

// Solo mostrar logs en desarrollo
if (import.meta.env.DEV) {


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

// Almacén mutable — el proxy delega en esta variable (inicializado después de createClerkSupabaseClient)
let _currentClient = null;

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


    }
    return supabaseClientsCache.get(cacheKey);
  }
  
  clientCreationCount++;
  if (import.meta.env.DEV) {


    if (clerkToken) {

    }
  }
  
  const fetchWithClerkToken = async (url, options = {}) => {
    const headers = new Headers(options?.headers || {});
    const method = options.method || 'GET';
    
    // CRÍTICO: apikey siempre debe estar presente (forzar sin condicional)
    headers.set('apikey', supabaseAnonKey);
    
    // Authorization: Clerk token si disponible, sino anon key
    if (clerkToken) {
      headers.set('Authorization', `Bearer ${clerkToken}`);
    } else if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${supabaseAnonKey}`);
    }
    
    // Log para desarrollo
    if (import.meta.env.DEV) {

      // Mostrar headers (sin tokens por seguridad)
      const headersObj = {};
      headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'authorization' && lowerKey !== 'apikey') {
          headersObj[key] = value;
        } else if (lowerKey === 'apikey') {
          headersObj[key] = '***' + value.substring(value.length - 4);
        }
      });
      if (Object.keys(headersObj).length > 0) {

      }
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (import.meta.env.DEV) {
      const status = response.status;
      const statusText = response.statusText;
      
      if (status === 401) {
        console.warn(`⚠️ [Supabase] 401 Unauthorized: ${method} ${url.replace(supabaseUrl, '')}`);
        console.warn('   Razón: RLS (Row Level Security) está bloqueando acceso');
      } else if (status >= 400) {
        console.warn(`⚠️ [Supabase] ${status} ${statusText}: ${method} ${url.replace(supabaseUrl, '')}`);
      } else if (status === 200 || status === 201) {

      }
    }
    
    return response;
  };

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: !clerkToken,
      persistSession: !clerkToken,
      detectSessionInUrl: !clerkToken,
      storageKey: clerkToken ? `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token-jwt` : `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`,
    },
    global: {
      fetch: fetchWithClerkToken,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'apikey': supabaseAnonKey,
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



  }
  
  return client;
};

// Inicializar cliente anónimo por defecto
_currentClient = createClerkSupabaseClient();

/**
 * Upgrade del cliente base con JWT de Clerk.
 * @param {string|null} clerkToken - Token JWT de Clerk o null para mantener anónimo
 */
export const initSupabaseClient = (clerkToken) => {
  if (clerkToken) {
    _currentClient = createClerkSupabaseClient(clerkToken);
  }
};

/**
 * Proxy transparente: siempre delega en _currentClient.
 * Los consumidores (useActivityTracker, etc.) importan { supabase }
 * y obtienen automáticamente el cliente más actualizado.
 */
const staticMethods = {};

export const supabase = new Proxy(staticMethods, {
  get(target, prop) {
    // Static helpers attachados al target
    if (prop in target) {
      const value = target[prop];
      return typeof value === 'function' ? value.bind(target) : value;
    }
    // Delegar al cliente actual
    const client = _currentClient;
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  }
});

// Helper: obtener sesión Clerk si está disponible
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
  return _currentClient.auth.getSession();
};

// Helper: verificar si Clerk está disponible
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
    getCurrentClient: () => _currentClient,
    initSupabaseClient,
  };
}

export default supabase;
