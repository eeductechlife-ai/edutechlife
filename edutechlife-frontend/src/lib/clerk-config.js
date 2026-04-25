/**
 * Configuración de Clerk para Edutechlife
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const clerkConfig = {
  publishableKey: PUBLISHABLE_KEY || 'pk_test_placeholder',
  signInUrl: '/login',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/ialab',
  afterSignUpUrl: '/ialab',
  appearance: {
    variables: {
      colorPrimary: '#004B63',
      colorPrimaryHover: '#0A3550',
    }
  },
};

export const isClerkConfigured = () => {
  return !!PUBLISHABLE_KEY;
};
