import React from 'react';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { clerkConfig } from '../lib/clerk-config';

/**
 * ClerkProviderWrapper - Envuelve la aplicación con ClerkProvider
 * 
 * Este componente:
 * 1. Proporciona autenticación Clerk a toda la aplicación
 * 2. Mantiene compatibilidad con código existente
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
      {/* Mostrar estado de carga */}
      <ClerkLoading>
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-700 font-medium">Cargando autenticación...</p>
            <p className="text-slate-500 text-sm mt-2">Conectando con Clerk</p>
          </div>
        </div>
      </ClerkLoading>

      {/* Cuando Clerk carga correctamente */}
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;