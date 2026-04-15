/**
 * Configuración de Clerk para Vite/React SPA
 * Sistema híbrido: Clerk frontend + Supabase backend
 */

// Obtener la clave de Clerk desde variables de entorno
// IMPORTANTE: import.meta.env solo funciona en archivos procesados por Vite
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Validar que la clave esté presente
let clerkPublishableKey;
if (!PUBLISHABLE_KEY) {
  console.error('❌ ERROR: VITE_CLERK_PUBLISHABLE_KEY no está definida en .env');
  console.error('Por favor, asegúrate de que .env.local contiene:');
  console.error('VITE_CLERK_PUBLISHABLE_KEY=pk_test_c3RhYmxlLW1pbmstNzEuY2xlcmsuYWNjb3VudHMuZGV2JA');
  
  // Para desarrollo, podemos usar un valor por defecto pero mostrar advertencia
  const fallbackKey = 'pk_test_c3RhYmxlLW1pbmstNzEuY2xlcmsuYWNjb3VudHMuZGV2JA';
  console.warn(`⚠ Usando clave de desarrollo: ${fallbackKey.slice(0, 20)}...`);
  
  clerkPublishableKey = fallbackKey;
} else {
  console.log('✅ Clerk Publishable Key configurada correctamente');
  clerkPublishableKey = PUBLISHABLE_KEY;
}

export const clerkConfig = {
  // Configuración básica de Clerk - REQUERIDA
  publishableKey: clerkPublishableKey,
  
  // Para SPA (Single Page Application) - REQUERIDO
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/ialab',
  afterSignUpUrl: '/ialab',
  
  // Appearance personalizado para Edutechlife
  appearance: {
    variables: {
      colorPrimary: '#004B63', // Azul Petróleo
      colorTextOnPrimaryBackground: '#FFFFFF',
      colorText: '#00374A',
      colorBackground: '#FFFFFF',
      colorInputBackground: '#F8FAFC',
      colorInputText: '#00374A',
      borderRadius: '0.75rem',
    },
    elements: {
      card: 'shadow-lg rounded-2xl border border-slate-100',
      headerTitle: 'text-[#00374A] font-semibold',
      headerSubtitle: 'text-slate-500',
      socialButtonsBlockButton: 'border border-slate-200 hover:bg-cyan-50',
      formButtonPrimary: 'bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90',
      footerActionLink: 'text-[#00BCD4] hover:text-[#004B63]',
    }
  }
};

/**
 * Configuración para integración con Supabase
 */
export const supabaseIntegrationConfig = {
  // URLs para redirección después de autenticación
  redirectUrls: {
    signIn: '/ialab',
    signUp: '/ialab',
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
    ...clerkConfig,
    publishableKey: 'pk_test_demo_key_for_development',
    options: {
      ...clerkConfig.options,
      // Modo desarrollo
      isSatellite: false,
      domain: 'localhost',
    }
  };
};