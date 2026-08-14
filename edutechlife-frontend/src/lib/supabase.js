import { createClient } from "@supabase/supabase-js";

// No lanzar al cargar el módulo: si faltan las env vars (p. ej. un deploy de
// preview de Vercel sin las variables configuradas para ese entorno), lanzar
// aquí crashea TODA la app a pantalla en blanco, porque supabase se importa de
// forma estática y eager. En su lugar se avisa y se usan placeholders: las
// páginas públicas (landing) renderizan, y las llamadas reales a Supabase
// fallan de forma controlada (atrapadas por los error boundaries) hasta que
// las variables estén configuradas.
if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.error(
    "[supabase] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el entorno. " +
      "Configúralas en Vercel (Production, Preview y Development). " +
      "La app carga, pero las funciones que usan Supabase no operarán.",
  );
}

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Nombre de la clave de storage que supabase-js usa para persistir la sesión.
// Se exporta para que los flujos de login puedan pre-sembrar la sesión antes
// de navegar (RoleProtectedRoute lee esta clave en su getSession()).
export const supabaseStorageKey = `sb-${supabaseUrl.split("//")[1].split(".")[0]}-auth-token`;

// Cache de clientes Supabase por token para evitar múltiples instancias
const supabaseClientsCache = new Map();

// Contador para debugging
let clientCreationCount = 0;

// Almacén mutable — el proxy delega en esta variable
let _currentClient = null;

/**
 * Crea un cliente Supabase que autentica con el JWT de la sesión.
 * Usa singleton pattern para evitar múltiples instancias del mismo cliente.
 * @param {string} accessToken - JWT de la sesión de Supabase (opcional)
 * @returns {Object} Cliente Supabase configurado
 */
export const createSupabaseClient = (accessToken = null) => {
  const clerkToken = accessToken;
  // Usar cache para reutilizar clientes existentes
  const cacheKey = clerkToken
    ? `jwt_${clerkToken.substring(0, 20)}`
    : "anonymous";

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

  const fetchWithAuthToken = async (url, options = {}) => {
    const headers = new Headers(options?.headers || {});
    const method = options.method || "GET";

    // CRÍTICO: apikey siempre debe estar presente (forzar sin condicional)
    headers.set("apikey", supabaseAnonKey);

    // Authorization: token de sesión si está disponible, si no la anon key
    if (clerkToken) {
      headers.set("Authorization", `Bearer ${clerkToken}`);
    } else if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${supabaseAnonKey}`);
    }

    // Log para desarrollo
    if (import.meta.env.DEV) {
      // Mostrar headers (sin tokens por seguridad)
      const headersObj = {};
      headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== "authorization" && lowerKey !== "apikey") {
          headersObj[key] = value;
        } else if (lowerKey === "apikey") {
          headersObj[key] = "***" + value.substring(value.length - 4);
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
        console.warn(
          `⚠️ [Supabase] 401 Unauthorized: ${method} ${url.replace(supabaseUrl, "")}`,
        );
        console.warn(
          "   Razón: RLS (Row Level Security) está bloqueando acceso",
        );
      } else if (status === 404) {
        // Silently ignore 404 — table may not exist yet
      } else if (status >= 400) {
        console.warn(
          `⚠️ [Supabase] ${status} ${statusText}: ${method} ${url.replace(supabaseUrl, "")}`,
        );
      }
    }

    return response;
  };

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: !clerkToken,
      persistSession: !clerkToken,
      detectSessionInUrl: !clerkToken,
      storageKey: clerkToken
        ? `sb-${supabaseUrl.split("//")[1].split(".")[0]}-auth-token-jwt`
        : `sb-${supabaseUrl.split("//")[1].split(".")[0]}-auth-token`,
    },
    global: {
      fetch: fetchWithAuthToken,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apikey: supabaseAnonKey,
        "X-Client-Info": clerkToken
          ? "edutechlife-supabase-jwt"
          : "edutechlife-supabase-base",
      },
    },
    db: {
      schema: "public",
    },
  });

  // Cachear cliente para reutilización
  supabaseClientsCache.set(cacheKey, client);

  if (import.meta.env.DEV) {
  }

  return client;
};

// Inicializar cliente anónimo por defecto
_currentClient = createSupabaseClient();

/**
 * Eleva el cliente base con el JWT de la sesión.
 * @param {string|null} clerkToken - JWT de sesión, o null para mantener anónimo
 */
export const initSupabaseClient = (clerkToken) => {
  if (clerkToken) {
    _currentClient = createSupabaseClient(clerkToken);
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
      return typeof value === "function" ? value.bind(target) : value;
    }
    // Delegar al cliente actual
    const client = _currentClient;
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
});

// Hacer disponible globalmente para debugging (solo en desarrollo)
if (typeof window !== "undefined" && import.meta.env.DEV) {
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
