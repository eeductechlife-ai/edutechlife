/**
 * Configuración de Clerk para Vite/React SPA
 * Sistema híbrido: Clerk frontend + Supabase backend
 */

export const clerkConfig = {
  // Configuración básica de Clerk
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  
  // Configuración para SPA (Single Page Application)
  options: {
    // Para SPA, necesitamos configurar las URLs de sign-in/sign-up
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
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return publishableKey && publishableKey.startsWith('pk_');
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