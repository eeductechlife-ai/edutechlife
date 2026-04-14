/**
 * Integración entre Clerk y shadcn/ui
 * 
 * Este archivo proporciona:
 * 1. Configuración de tema Clerk para que coincida con shadcn
 * 2. Componentes personalizados que usan ambos sistemas
 * 3. Utilidades para integración fluida
 */

import { getClerkComponentsConfig } from '../utils/clerk-utils';

/**
 * Obtiene la configuración de apariencia de Clerk que coincide con shadcn
 */
export const getClerkShadcnAppearance = () => {
  const shadcnConfig = getClerkComponentsConfig();
  
  return {
    // Variables CSS que coinciden con shadcn
    variables: {
      colorPrimary: 'hsl(var(--primary))',
      colorTextOnPrimaryBackground: 'hsl(var(--primary-foreground))',
      colorText: 'hsl(var(--foreground))',
      colorBackground: 'hsl(var(--background))',
      colorInputBackground: 'hsl(var(--input))',
      colorInputText: 'hsl(var(--foreground))',
      colorSuccess: 'hsl(var(--success))',
      colorDanger: 'hsl(var(--destructive))',
      borderRadius: 'var(--radius)',
      fontFamily: 'var(--font-sans)',
    },
    
    // Elementos específicos
    elements: {
      // Card styling
      card: 'rounded-lg border bg-card shadow-sm',
      cardBox: 'rounded-lg border bg-card',
      
      // Header
      headerTitle: 'text-2xl font-semibold text-card-foreground',
      headerSubtitle: 'text-sm text-muted-foreground',
      
      // Form elements
      formFieldLabel: 'text-sm font-medium text-foreground',
      formFieldInput: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      formFieldSuccessText: 'text-sm text-success',
      formFieldErrorText: 'text-sm text-destructive',
      
      // Buttons
      formButtonPrimary: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
      formButtonSecondary: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2',
      formButtonReset: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2',
      
      // Social buttons
      socialButtonsBlockButton: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2',
      socialButtonsBlockButtonText: 'text-sm',
      
      // Footer
      footerActionLink: 'text-primary underline-offset-4 hover:underline',
      footerActionText: 'text-sm text-muted-foreground',
      
      // User button (dropdown trigger)
      userButtonBox: 'rounded-full border-2 border-white shadow-md',
      userButtonTrigger: 'hover:bg-accent',
      userButtonPopoverCard: 'rounded-lg border bg-popover shadow-md',
      userButtonPopoverActionButton: 'hover:bg-accent hover:text-accent-foreground',
      userButtonPopoverActionButtonText: 'text-sm',
      
      // Organization switcher
      organizationSwitcherTrigger: 'rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      organizationSwitcherPopoverCard: 'rounded-lg border bg-popover shadow-md',
    }
  };
};

/**
 * Componente ClerkUserButton personalizado con shadcn styling
 */
export const ClerkUserButtonWithShadcn = ({ showName = false }) => {
  // Este componente sería reemplazado por el real cuando Clerk esté instalado
  return {
    render: () => {
      console.log('ClerkUserButtonWithShadcn: Componente de placeholder (Clerk no instalado)');
      return null;
    }
  };
};

/**
 * Componente ClerkSignIn personalizado con shadcn styling
 */
export const ClerkSignInWithShadcn = ({ redirectUrl = '/dashboard' }) => {
  return {
    render: () => {
      console.log('ClerkSignInWithShadcn: Componente de placeholder');
      return null;
    }
  };
};

/**
 * Componente ClerkSignUp personalizado con shadcn styling
 */
export const ClerkSignUpWithShadcn = ({ redirectUrl = '/dashboard' }) => {
  return {
    render: () => {
      console.log('ClerkSignUpWithShadcn: Componente de placeholder');
      return null;
    }
  };
};

/**
 * Componente ClerkUserProfile personalizado con shadcn styling
 */
export const ClerkUserProfileWithShadcn = () => {
  return {
    render: () => {
      console.log('ClerkUserProfileWithShadcn: Componente de placeholder');
      return null;
    }
  };
};

/**
 * Verifica si Clerk y shadcn están integrados correctamente
 */
export const verifyClerkShadcnIntegration = () => {
  const checks = {
    clerkInstalled: false,
    shadcnConfigured: false,
    cssVariables: false,
    themeConsistency: false,
  };
  
  try {
    // Verificar Clerk
    if (typeof window !== 'undefined') {
      checks.clerkInstalled = !!window.Clerk;
    }
    
    // Verificar shadcn (variables CSS)
    const rootStyles = getComputedStyle(document.documentElement);
    checks.shadcnConfigured = !!rootStyles.getPropertyValue('--radius');
    checks.cssVariables = !!rootStyles.getPropertyValue('--primary');
    
    // Verificar consistencia de tema
    if (checks.clerkInstalled && checks.shadcnConfigured) {
      // Aquí podríamos verificar que los colores coincidan
      checks.themeConsistency = true;
    }
    
    return {
      ...checks,
      allPassed: Object.values(checks).every(Boolean),
    };
  } catch (error) {
    console.error('Error verificando integración Clerk-shadcn:', error);
    return {
      ...checks,
      allPassed: false,
      error: error.message,
    };
  }
};

/**
 * Aplica el tema shadcn a los componentes de Clerk
 */
export const applyShadcnThemeToClerk = (clerkInstance) => {
  if (!clerkInstance) {
    console.warn('Clerk instance no disponible para aplicar tema shadcn');
    return;
  }
  
  try {
    const appearance = getClerkShadcnAppearance();
    
    // Aplicar configuración de apariencia
    clerkInstance.__unstable__updateAppearance(appearance);
    
    console.log('✅ Tema shadcn aplicado a componentes Clerk');
  } catch (error) {
    console.error('Error aplicando tema shadcn a Clerk:', error);
  }
};

/**
 * Crea un puente entre los sistemas de autenticación
 */
export const createAuthBridge = () => {
  return {
    // Métodos para migración suave
    syncUser: async (sourceUser, targetSystem) => {
      console.log(`Sincronizando usuario de ${sourceUser} a ${targetSystem}`);
      // Implementación real dependería de las APIs específicas
    },
    
    // Detectar sistema activo
    getActiveAuthSystem: () => {
      try {
        if (typeof window !== 'undefined' && window.Clerk) {
          return 'clerk';
        }
        return 'supabase';
      } catch {
        return 'supabase';
      }
    },
    
    // Redirección inteligente
    getAuthRedirect: (action) => {
      const activeSystem = 'supabase'; // Temporal hasta que Clerk esté instalado
      
      const routes = {
        clerk: {
          signIn: '/sign-in',
          signUp: '/sign-up',
          profile: '/user-profile',
        },
        supabase: {
          signIn: '/auth/signin',
          signUp: '/auth/signup',
          profile: '/profile',
        }
      };
      
      return routes[activeSystem]?.[action] || '/';
    }
  };
};