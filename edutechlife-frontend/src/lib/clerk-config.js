/**
 * Configuración de Clerk para Edutechlife
 * Corregido para despliegue en Vercel
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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
  // ESTA LÍNEA ES LA QUE REPARA EL ERROR DE LAS 3 BARRAS
  clerkJSUrl: 'https://cdn.clerk.com/clerk-js@latest/dist/clerk.browser.js',
  domain: 'https://stable-mink-71.clerk.accounts.dev',
  isSatellite: false,
};

export const isClerkConfigured = () => {
  return !!PUBLISHABLE_KEY;
};

// Actualización final 2026
