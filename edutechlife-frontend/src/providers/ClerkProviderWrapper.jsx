import React from 'react';
import { ClerkProvider } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { clerkConfig } from '../lib/clerk-config';

const ClerkProviderWrapper = ({ children }) => {
  // Extraemos la clave directamente para asegurar que Vite la encuentre
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || clerkConfig.publishableKey;

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
      appearance={clerkConfig.appearance}
      localization={esES}
      /* ESTA LÍNEA ES LA SOLUCIÓN DEFINITIVA: 
         Forzamos la URL del CDN para evitar que el sistema genere las "3 barras"
      */
      clerkJSUrl="https://cdn.clerk.com/clerk-js@latest/dist/clerk.browser.js"
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
