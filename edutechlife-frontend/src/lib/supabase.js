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

    // El token puede refrescarse (supabase-js autoRefreshToken) sin recrear el
    // cliente: useSupabaseAuth actualiza sessionStorage.auth_token al renovar y
    // App re-eleva el cliente, pero hasta entonces el cierre guardaba el JWT
    // inicial. Leer el token vigente evita adjuntar siempre el viejo y que
    // pasada ~1h el foro respondiera "JWT expired".
    let activeToken = clerkToken;
    try {
      const liveToken = sessionStorage.getItem("auth_token");
      if (liveToken) activeToken = liveToken;
    } catch {
      /* sessionStorage no disponible: usar el token inicial */
    }

    // Authorization: token de sesión si está disponible, si no la anon key
    if (activeToken) {
      headers.set("Authorization", `Bearer ${activeToken}`);
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
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  // Cachear cliente para reutilización
  supabaseClientsCache.set(cacheKey, client);

  if (import.meta.env.DEV) {
  }

  return client;
};

// Inicializar cliente anónimo por defecto. Se guarda una referencia al cliente
// base (persiste la sesión y tiene autoRefreshToken) para poder renovar el JWT
// aunque el proxy ya delegue en un cliente elevado con token.
const baseClient = createSupabaseClient();
_currentClient = baseClient;

/**
 * Renueva la sesión de Supabase con el refresh token persistido en el cliente
 * base y sincroniza el nuevo access token con el resto de la app. Pensado para
 * llamarse justo antes de que expire el JWT (evita el "JWT expired" del foro).
 * @returns {Promise<string|null>} el nuevo access token, o null si no se pudo.
 */
export const refreshAuthSession = async () => {
  try {
    const { data, error } = await baseClient.auth.refreshSession();
    if (!error && data?.session?.access_token) {
      sessionStorage.setItem("auth_token", data.session.access_token);
      localStorage.setItem("refresh_token", data.session.refresh_token);
      window.dispatchEvent(new CustomEvent("supabase.auth.token-refreshed"));
      return data.session.access_token;
    }
  } catch {
    /* sin sesión persistida: no hay nada que renovar */
  }
  return null;
};

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
