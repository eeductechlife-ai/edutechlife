/**
 * Configuración para integración JWT Clerk-Supabase
 * Template ID: 5d74d508-85ee-4a7c-9d50-87005f9b8a90
 * Algoritmo: Legacy HS256 (Shared Secret)
 */

/**
 * Configuración del JWT Template de Clerk para Supabase
 */
export const clerkSupabaseJWTConfig = {
  // ID del template JWT configurado en Clerk
  templateId: '5d74d508-85ee-4a7c-9d50-87005f9b8a90',
  
  // Algoritmo de firma
  algorithm: 'HS256',
  
  // Claims personalizados para Supabase
  claims: {
    // Claims estándar de JWT
    iss: 'clerk', // Issuer
    sub: '{{user.id}}', // Subject (user ID)
    aud: 'supabase', // Audience
    
    // Claims personalizados para Supabase
    'https://supabase.com/jwt/claims': {
      // Role-based claims
      'x-hasura-default-role': 'authenticated',
      'x-hasura-allowed-roles': ['authenticated', 'anon'],
      'x-hasura-user-id': '{{user.id}}',
      
      // Custom claims para aplicación EdutechLife
      'app-metadata': {
        provider: 'clerk',
        sign_in_provider: 'email',
        role: '{{user.public_metadata.role}}' || 'student',
      },
      
      // User metadata
      user_metadata: {
        email: '{{user.primary_email_address}}',
        full_name: '{{user.first_name}} {{user.last_name}}',
        avatar_url: '{{user.image_url}}',
        phone: '{{user.private_metadata.phone}}' || '',
      }
    },
    
    // Expiración (1 hora por defecto)
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  },
  
  // Configuración para desarrollo
  development: {
    // Para desarrollo local, podemos usar un secret compartido
    sharedSecret: import.meta.env.VITE_CLERK_JWT_SECRET || 'dev-secret-for-testing',
    
    // URLs de desarrollo
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    clerkFrontendApi: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.replace('pk_', ''),
  }
};

/**
 * Obtiene el token JWT de Clerk para usar con Supabase
 */
export const getClerkJWTForSupabase = async (clerkClient) => {
  if (!clerkClient || !clerkClient.session) {
    console.warn('Clerk client o session no disponible');
    return null;
  }
  
  try {
    // Clerk SDK v4+ usa getToken() en la session
    const token = await clerkClient.session.getToken({
      template: clerkSupabaseJWTConfig.templateId,
    });
    
    if (!token) {
      console.warn('No se pudo obtener token JWT de Clerk');
      return null;
    }
    
    console.log('✅ Token JWT de Clerk obtenido para Supabase');
    return token;
  } catch (error) {
    console.error('Error obteniendo token JWT de Clerk:', error);
    return null;
  }
};

/**
 * Crea un cliente Supabase que usa JWT de Clerk
 */
export const createSupabaseClientWithClerkJWT = (clerkClient) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL o Anon Key no configurados');
    return null;
  }
  
  // Importar dinámicamente para evitar problemas de SSR
  const { createClient } = require('@supabase/supabase-js');
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false, // Clerk maneja la sesión
      persistSession: false,   // No persistir sesión en localStorage
      detectSessionInUrl: false,
      
      // Override para usar token de Clerk
      storageKey: 'clerk-supabase-token',
      storage: {
        getItem: async (key) => {
          if (key === 'clerk-supabase-token' && clerkClient?.session) {
            const token = await getClerkJWTForSupabase(clerkClient);
            return JSON.stringify({ access_token: token });
          }
          return null;
        },
        setItem: () => {}, // No-op, Clerk maneja el token
        removeItem: () => {}, // No-op
      },
    },
    global: {
      headers: {
        'X-Client-Info': 'edutechlife-clerk-integration',
      },
    },
  });
};

/**
 * Mapea usuario de Clerk a formato Supabase
 */
export const mapClerkUserToSupabase = (clerkUser) => {
  if (!clerkUser) return null;
  
  return {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    user_metadata: {
      full_name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
      avatar_url: clerkUser.imageUrl,
      provider: 'clerk',
    },
    app_metadata: {
      provider: 'clerk',
      role: clerkUser.publicMetadata?.role || 'student',
    },
    aud: 'authenticated',
    role: 'authenticated',
    email_confirmed_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : null,
    phone: clerkUser.privateMetadata?.phone || '',
    last_sign_in_at: new Date().toISOString(),
    created_at: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

/**
 * Verifica si el JWT de Clerk está configurado correctamente
 */
export const isClerkJWTConfigured = () => {
  return Boolean(
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
};

/**
 * Helper para debuggear el JWT
 */
export const debugClerkJWT = async (clerkClient) => {
  if (!clerkClient) {
    console.log('❌ Clerk client no disponible');
    return;
  }
  
  try {
    const token = await getClerkJWTForSupabase(clerkClient);
    
    if (!token) {
      console.log('❌ No se pudo obtener token');
      return;
    }
    
    // Decodificar el token (sin verificar firma)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Token JWT inválido');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('🔍 Debug JWT de Clerk:');
    console.log('  - Template ID:', clerkSupabaseJWTConfig.templateId);
    console.log('  - User ID:', payload.sub);
    console.log('  - Expira:', new Date(payload.exp * 1000).toISOString());
    console.log('  - Claims Supabase:', payload['https://supabase.com/jwt/claims']);
    
    return payload;
  } catch (error) {
    console.error('Error debuggeando JWT:', error);
  }
};

export default clerkSupabaseJWTConfig;