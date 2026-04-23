import React from 'react';
import { ClerkProvider } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { clerkConfig } from '../lib/clerk-config';

/**
 * ClerkProviderWrapper - Envuelve la aplicación con ClerkProvider
 * 
 * IMPORTANTE: NO bloquea el renderizado con ClerkLoading/ClerkLoaded.
 * La Landing Page (ruta /) debe ser pública y cargar instantáneamente.
 * Clerk se inicializa en segundo plano mientras el usuario ve la Landing.
 * 
 * El bloqueo "Cargando..." SOLO aparece cuando el usuario navega a una ruta
 * protegida y auth aún no ha cargado (manejado en RoleProtectedRoute y AuthContext).
 */
const ClerkProviderWrapper = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={clerkConfig.publishableKey}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
      appearance={clerkConfig.appearance}
      localization={esES}
      clerkJSUrl="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@6/dist/clerk.browser.js"
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;