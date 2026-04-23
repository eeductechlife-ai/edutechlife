/**
 * Configuración de Clerk para Vite/React SPA
 * Sistema híbrido: Clerk frontend + Supabase backend
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

let clerkPublishableKey;

if (!PUBLISHABLE_KEY) {
  console.error('❌ ERROR: VITE_CLERK_PUBLISHABLE_KEY no está definida en .env');
  const fallbackKey = 'pk_test_demo_key_for_development';
  console.warn(`⚠ Usando clave de desarrollo: ${fallbackKey}`);
  clerkPublishableKey = fallbackKey;
} else {
  console.log('✅ Clerk Publishable Key configurada correctamente');
  clerkPublishableKey = PUBLISHABLE_KEY;
}

export const clerkConfig = {
  publishableKey: clerkPublishableKey,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/ialab',
  afterSignUpUrl: '/ialab',
  appearance: {
    variables: {
      colorPrimary: '#004B63',
      colorPrimaryHover: '#0A3550',
    }
  }
};

export const isClerkConfigured = () => {
  return PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_');
};