import React from 'react';
import { ClerkProvider } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { clerkConfig } from '../lib/clerk-config';

/**
 * ClerkProviderWrapper - Envuelve la aplicación con ClerkProvider
 * 
 * Este componente:
 * 1. Proporciona autenticación Clerk a toda la aplicación
 * 2. Configura la integración con Supabase via JWT
 * 3. Mantiene compatibilidad con código existente
 * 
 * IMPORTANTE: Clerk es nuestro ÚNICO proveedor de identidad.
 * No usamos Supabase Auth para login/signup.
 */
const ClerkProviderWrapper = ({ children }) => {
  return (
    <ClerkProvider 
      {...clerkConfig}
      localization={esES}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;