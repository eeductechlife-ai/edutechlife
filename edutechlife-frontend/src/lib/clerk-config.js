/**
 * Configuración de Clerk para Edutechlife
 * Corregido para despliegue en Vercel
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Verificación simple para evitar bloqueos
if (!PUBLISHABLE_KEY) {
  console.warn('⚠ VITE_CLERK_PUBLISHABLE_KEY no detectada. Verifica las Environment Variables en Vercel.');
}

export const clerkConfig = {
  publishableKey: PUBLISHABLE_KEY || 'pk_test_placeholder',
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/ialab',
  afterSignUpUrl: '/ialab',
  appearance: {
    variables: {
      colorPrimary: '#004B63',
      colorPrimaryHover: '#0A3550',
    }
  },
  domain: 'https://stable-mink-71.clerk.accounts.dev',
  isSatellite: false,
};

export const isClerkConfigured = () => {
  return !!PUBLISHABLE_KEY;
};
