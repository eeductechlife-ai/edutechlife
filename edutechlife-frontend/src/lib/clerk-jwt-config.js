/**
 * Configuración para integración JWT Clerk-Supabase
 * Template name: 'supabase' (configurado en Clerk Dashboard)
 * IMPORTANTE: El template en Clerk debe llamarse 'supabase'
 */

/**
 * Configuración del JWT Template de Clerk para Supabase
 */
export const clerkSupabaseJWTConfig = {
  // Nombre del template JWT configurado en Clerk (debe ser 'supabase')
  templateName: 'supabase',
  
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
 * @param {Object} session - Sesión de Clerk (de useSession)
 * @returns {Promise<string|null>} Token JWT o null si no disponible
 */
export const getClerkJWTForSupabase = async (session) => {
  if (!session || !session.getToken) {
    console.warn('Sesión de Clerk no disponible');
    return null;
  }
  
  try {
    // Usar template name 'supabase' (configurado en Clerk Dashboard)
    const token = await session.getToken({ template: 'supabase' });
    
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
 * @param {Object} session - Sesión de Clerk (de useSession)
 * @returns {Promise<Object|null>} Cliente Supabase configurado o null si error
 */
export const createSupabaseClientWithClerkJWT = async (session) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL o Anon Key no configurados');
    return null;
  }
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false, // Clerk maneja la sesión
        persistSession: false,   // No persistir en localStorage
        detectSessionInUrl: false,
        
        // Override storage para usar token de Clerk
        storageKey: 'clerk-supabase-token',
        storage: {
          getItem: async (key) => {
            if (key === 'clerk-supabase-token' && session?.getToken) {
              const token = await session.getToken({ template: 'supabase' });
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
          'X-Client-Info': 'edutechlife-clerk-jwt',
        },
      },
      db: {
        schema: 'public',
      },
    });
  } catch (error) {
    console.error('Error creando cliente Supabase con Clerk JWT:', error);
    return null;
  }
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
export const debugClerkJWT = async (session) => {
  if (!session || !session.getToken) {
    console.log('❌ Sesión de Clerk no disponible');
    return;
  }
  
  try {
    const token = await session.getToken({ template: 'supabase' });
    
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
    console.log('  - Template name:', 'supabase');
    console.log('  - User ID:', payload.sub);
    console.log('  - Expira:', new Date(payload.exp * 1000).toISOString());
    console.log('  - Claims Supabase:', payload['https://supabase.com/jwt/claims']);
    
    return payload;
  } catch (error) {
    console.error('Error debuggeando JWT:', error);
  }
};

export default clerkSupabaseJWTConfig;