/**
 * Utilidades para integración Clerk en Vite/React SPA
 * Con soporte para JWT Template con Supabase
 */

import { clerkConfig } from '../lib/clerk-config';
import { getClerkJWTForSupabase } from '../lib/clerk-jwt-config';

/**
 * Hook personalizado para usar Clerk en componentes
 * Con soporte para JWT Template con Supabase
 */
export const useClerkAuth = () => {
  // Intentar usar Clerk real si está disponible
  try {
    // Verificar si Clerk está disponible globalmente
    if (typeof window !== 'undefined' && window.Clerk) {
      const { useUser, useClerk } = window.Clerk;
      const { user, isLoaded, isSignedIn } = useUser();
      const clerk = useClerk();
      
      return {
        isLoaded,
        isSignedIn,
        user,
        clerk, // Exponer el cliente Clerk completo
        signOut: async () => {
          if (clerk && clerk.signOut) {
            return await clerk.signOut();
          }
          console.log('Clerk signOut no disponible');
          return { success: true };
        },
        openUserProfile: () => {
          if (clerk && clerk.openUserProfile) {
            return clerk.openUserProfile();
          }
          console.log('Clerk openUserProfile no disponible');
          window.alert('Perfil de usuario - Abre modal de perfil personalizado');
        },
        redirectToSignIn: () => {
          if (clerk && clerk.redirectToSignIn) {
            return clerk.redirectToSignIn();
          }
          console.log('Clerk redirectToSignIn no disponible');
          window.location.href = '/sign-in';
        },
        redirectToSignUp: () => {
          if (clerk && clerk.redirectToSignUp) {
            return clerk.redirectToSignUp();
          }
          console.log('Clerk redirectToSignUp no disponible');
          window.location.href = '/sign-up';
        },
        // Nuevo método para obtener JWT para Supabase
        getJWTForSupabase: async () => {
          if (clerk && clerk.session) {
            try {
              return await getClerkJWTForSupabase(clerk);
            } catch (error) {
              console.error('Error obteniendo JWT para Supabase:', error);
              return null;
            }
          }
          return null;
        },
        // Verificar si Clerk está configurado con JWT template
        isJWTConfigured: () => {
          return !!window.Clerk && !!clerk?.session;
        },
      };
    }
  } catch (error) {
    console.warn('Error al usar Clerk hooks:', error.message);
  }
  
  // Fallback a modo simulación
  const mockClerkState = {
    isLoaded: true,
    isSignedIn: false,
    user: null,
    clerk: null,
    signOut: async () => {
      console.log('Mock signOut called');
      return { success: true };
    },
    openUserProfile: () => {
      console.log('Mock openUserProfile called');
      window.alert('Perfil de usuario - Funcionalidad en desarrollo con Clerk');
    },
    redirectToSignIn: () => {
      console.log('Mock redirectToSignIn called');
      window.location.href = '/sign-in';
    },
    redirectToSignUp: () => {
      console.log('Mock redirectToSignUp called');
      window.location.href = '/sign-up';
    },
    getJWTForSupabase: async () => {
      console.log('Mock getJWTForSupabase called');
      return 'mock-jwt-token-for-development';
    },
    isJWTConfigured: () => false,
  };

  return mockClerkState;
};

/**
 * Verifica si Clerk está disponible
 */
export const isClerkAvailable = () => {
  try {
    // Intentar importar Clerk dinámicamente
    return typeof window !== 'undefined' && window.Clerk !== undefined;
  } catch (error) {
    return false;
  }
};

/**
 * Obtiene información del usuario desde Clerk
 */
export const getClerkUserInfo = (clerkUser) => {
  if (!clerkUser) {
    return {
      initials: 'U',
      displayName: 'Usuario',
      displayEmail: 'usuario@edutechlife.com',
      avatarUrl: null,
    };
  }

  // Obtener iniciales
  const getInitials = () => {
    if (clerkUser.fullName) {
      const names = clerkUser.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (clerkUser.primaryEmailAddress?.emailAddress) {
      return clerkUser.primaryEmailAddress.emailAddress[0].toUpperCase();
    }
    return 'U';
  };

  // Obtener nombre para mostrar
  const getDisplayName = () => {
    if (clerkUser.fullName) {
      return clerkUser.fullName;
    }
    if (clerkUser.primaryEmailAddress?.emailAddress) {
      return clerkUser.primaryEmailAddress.emailAddress.split('@')[0];
    }
    return 'Usuario';
  };

  // Obtener email para mostrar
  const getDisplayEmail = () => {
    if (clerkUser.primaryEmailAddress?.emailAddress) {
      return clerkUser.primaryEmailAddress.emailAddress;
    }
    return 'usuario@edutechlife.com';
  };

  return {
    initials: getInitials(),
    displayName: getDisplayName(),
    displayEmail: getDisplayEmail(),
    avatarUrl: clerkUser.imageUrl,
    userId: clerkUser.id,
  };
};

/**
 * Configuración para componentes Clerk personalizados
 */
export const getClerkComponentsConfig = () => ({
  // Configuración para UserButton (dropdown de usuario)
  userButton: {
    appearance: {
      variables: {
        colorPrimary: '#004B63',
        colorText: '#00374A',
        colorBackground: '#FFFFFF',
        borderRadius: '0.75rem',
      },
      elements: {
        userButtonBox: 'shadow-lg border border-slate-100',
        userButtonTrigger: 'hover:bg-cyan-50',
        userButtonPopoverCard: 'shadow-xl rounded-xl',
        userButtonPopoverActionButton: 'hover:bg-cyan-50 text-[#00374A]',
        userButtonPopoverActionButtonText: 'text-sm',
        userButtonPopoverFooter: 'hidden', // Ocultar footer por defecto
      }
    }
  },

  // Configuración para SignIn/SignUp components
  signIn: {
    appearance: {
      variables: {
        colorPrimary: '#004B63',
        colorTextOnPrimaryBackground: '#FFFFFF',
      },
      elements: {
        card: 'shadow-lg rounded-2xl max-w-md',
        headerTitle: 'text-2xl font-bold text-[#00374A]',
        formButtonPrimary: 'bg-gradient-to-r from-[#004B63] to-[#00BCD4]',
      }
    }
  },

  // Configuración para UserProfile
  userProfile: {
    appearance: {
      variables: {
        colorPrimary: '#004B63',
        colorText: '#00374A',
      },
      elements: {
        card: 'shadow-xl rounded-2xl max-w-2xl',
        navbarButton: 'text-[#00BCD4] hover:text-[#004B63]',
        formButtonPrimary: 'bg-[#004B63] hover:bg-[#00374A]',
      }
    }
  },
});

/**
 * Crea URLs para redirección en SPA
 */
export const createSPAUrls = (basePath = '') => ({
  signIn: `${basePath}/sign-in`,
  signUp: `${basePath}/sign-up`,
  signOut: `${basePath}/`,
  userProfile: `${basePath}/profile`,
  home: `${basePath}/dashboard`,
});

/**
 * Maneja errores de Clerk
 */
export const handleClerkError = (error) => {
  console.error('Clerk error:', error);
  
  // Mapeo de errores comunes
  const errorMessages = {
    'user_not_found': 'Usuario no encontrado. Por favor, regístrate primero.',
    'invalid_credentials': 'Credenciales inválidas. Verifica tu email y contraseña.',
    'rate_limit_exceeded': 'Demasiados intentos. Por favor, espera unos minutos.',
    'network_error': 'Error de conexión. Verifica tu internet e intenta nuevamente.',
    'default': 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
  };

  const errorCode = error?.errors?.[0]?.code || error?.code || 'default';
  return errorMessages[errorCode] || errorMessages.default;
};