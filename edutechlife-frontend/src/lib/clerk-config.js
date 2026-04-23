/**
 * Configuración de Clerk para Vite/React SPA
 * CON MANEJO DE ERRORES Y FALLBACKS
 * Sistema híbrido: Clerk frontend + Supabase backend
 */

// Obtener la clave de Clerk desde variables de entorno
// IMPORTANTE: import.meta.env solo funciona en archivos procesados por Vite
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Validar que la clave esté presente
let clerkPublishableKey;
let clerkDomain = 'clerk.accounts.dev'; // Dominio por defecto

if (!PUBLISHABLE_KEY) {
  console.error('❌ ERROR: VITE_CLERK_PUBLISHABLE_KEY no está definida en .env');
  console.error('Por favor, asegúrate de que .env.local contiene:');
  console.error('VITE_CLERK_PUBLISHABLE_KEY=pk_test_...');
  
  // Para desarrollo, podemos usar un valor por defecto pero mostrar advertencia
  const fallbackKey = 'pk_test_demo_key_for_development';
  console.warn(`⚠ Usando clave de desarrollo: ${fallbackKey}`);
  
  clerkPublishableKey = fallbackKey;
  clerkDomain = 'localhost'; // Usar localhost para desarrollo
} else {
  console.log('✅ Clerk Publishable Key configurada correctamente');
  clerkPublishableKey = PUBLISHABLE_KEY;
  
  // Extraer el dominio de la clave si es posible
  try {
    // La clave Clerk tiene formato: pk_test_[subdomain].clerk.accounts.dev
    const keyParts = PUBLISHABLE_KEY.split('_');
    if (keyParts.length >= 3) {
      const subdomain = keyParts[2]?.split('.')[0];
      if (subdomain && subdomain !== 'live' && subdomain !== 'test') {
        clerkDomain = `${subdomain}.clerk.accounts.dev`;
      }
    }
  } catch (error) {
    console.warn('No se pudo extraer dominio de la clave Clerk:', error);
  }
}

// Verificar si estamos en desarrollo local
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.includes('local');

// Configuración base
const baseConfig = {
  // Configuración básica de Clerk - REQUERIDA
  publishableKey: clerkPublishableKey,
  
  // Para SPA (Single Page Application) - REQUERIDO
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/ialab',  // FLUJO DIRECTO: Login → IA Lab Dashboard
  afterSignUpUrl: '/ialab',  // FLUJO DIRECTO: Registro → IA Lab Dashboard
  
  // Appearance minimalista - Clerk maneja sus propios estilos
  appearance: {
    variables: {
      colorPrimary: '#004B63',
      colorPrimaryHover: '#0A3550',
    }
  }
};

// Configuración de opciones avanzadas para mejorar tolerancia a fallos
const advancedOptions = {
  // Configuración para desarrollo local
  ...(isLocalDevelopment && {
    isSatellite: false,
    domain: 'localhost',
    // Usar CDN alternativo si el principal falla
    clerkJSUrl: `https://${clerkDomain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`,
    // Fallback a CDN genérico de Clerk
    clerkJSSecondaryUrl: 'https://cdn.clerk.com/clerk-js@6/dist/clerk.browser.js',
  }),
  
  // Configuración común
  loadClerkJsScriptOptions: {
    crossOrigin: 'anonymous',
    // Timeout más corto para desarrollo
    timeout: isLocalDevelopment ? 15000 : 30000,
    // Reintentos
    retry: {
      count: 3,
      delay: 2000
    },
    // Preload para mejorar performance
    preload: true,
  },
  
  // Cache de Clerk JS
  clerkJSVariant: 'headless', // Usar versión headless para mejor performance
  
  // Telemetry reducida para desarrollo
  telemetry: isLocalDevelopment ? false : undefined,
};

export const clerkConfig = {
  ...baseConfig,
  options: advancedOptions
};

/**
 * Configuración para integración con Supabase
 */
export const supabaseIntegrationConfig = {
  // URLs para redirección después de autenticación
  redirectUrls: {
    signIn: '/ialab',  // FLUJO DIRECTO: Login → IA Lab Dashboard
    signUp: '/ialab',  // FLUJO DIRECTO: Registro → IA Lab Dashboard
    signOut: '/',
  },
  
  // Mapeo de campos entre Clerk y Supabase
  fieldMapping: {
    clerkToSupabase: {
      'id': 'id',
      'email': 'email',
      'firstName': 'first_name',
      'lastName': 'last_name',
      'fullName': 'full_name',
      'imageUrl': 'avatar_url',
    }
  }
};

/**
 * Verifica si Clerk está configurado correctamente
 */
export const isClerkConfigured = () => {
  return PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_');
};

/**
 * Obtiene la configuración segura para desarrollo
 */
export const getSafeConfig = () => {
  if (isClerkConfigured()) {
    return clerkConfig;
  }
  
  // Configuración de desarrollo sin keys reales
  return {
    ...baseConfig,
    publishableKey: 'pk_test_demo_key_for_development',
    options: {
      ...advancedOptions,
      // Modo desarrollo
      isSatellite: false,
      domain: 'localhost',
      // Deshabilitar carga de Clerk JS para desarrollo offline
      loadClerkJsScript: false,
    }
  };
};

/**
 * Función para verificar la conectividad con Clerk
 */
export const checkClerkConnectivity = async () => {
  try {
    const testUrl = `https://${clerkDomain}/health`;
    const response = await fetch(testUrl, { 
      method: 'HEAD',
      mode: 'no-cors', // Solo verificar si el dominio responde
      cache: 'no-cache'
    });
    
    // Si no hay error, asumimos que hay conectividad
    return true;
  } catch (error) {
    console.warn('No hay conectividad con Clerk:', error);
    return false;
  }
};

/**
 * Obtener configuración con fallback para offline
 */
export const getConfigWithFallback = async () => {
  const hasConnectivity = await checkClerkConnectivity();
  
  if (!hasConnectivity) {
    console.warn('⚠️ Sin conectividad a Clerk, usando modo offline');
    return getSafeConfig();
  }
  
  return clerkConfig;
};