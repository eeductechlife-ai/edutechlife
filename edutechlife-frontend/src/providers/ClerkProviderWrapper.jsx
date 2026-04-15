import React, { useState, useEffect } from 'react';
import { getSafeConfig } from '../lib/clerk-config';
import { syncUserWithSupabase, setupAutoSync } from '../services/clerk-supabase-sync';

// Importar Clerk directamente (ya está instalado como dependencia)
import { ClerkProvider, useClerk, useUser } from '@clerk/react';

let isClerkInstalled = true; // Asumir que está instalado ya que es una dependencia

/**
 * Provider wrapper que integra Clerk con el sistema existente de Supabase
 * 
 * Este componente:
 * 1. Proporciona Clerk para UI y autenticación frontend
 * 2. Mantiene compatibilidad con Supabase para datos de usuario
 * 3. Sincroniza sesiones entre Clerk y Supabase
 */
const ClerkProviderWrapper = ({ children }) => {
  const config = getSafeConfig();
  
  // Verificar críticamente que la publishableKey esté presente
  if (!config.publishableKey || !config.publishableKey.startsWith('pk_')) {
    console.error('❌ ERROR CRÍTICO: Clerk publishableKey no válida o faltante');
    console.error('Configuración recibida:', config);
    console.error('Por favor, verifica que:');
    console.error('1. El archivo .env.local existe en la raíz del proyecto');
    console.error('2. Contiene: VITE_CLERK_PUBLISHABLE_KEY=pk_test_c3RhYmxlLW1pbmstNzEuY2xlcmsuYWNjb3VudHMuZGV2JA');
    console.error('3. El servidor de desarrollo se reinició después de crear el archivo');
    
    // Mostrar un mensaje de error en UI para desarrollo
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
        <h2 className="text-red-800 font-bold">Error de Configuración Clerk</h2>
        <p className="text-red-700 text-sm mt-2">
          Falta la publishableKey de Clerk. Verifica el archivo .env.local y reinicia el servidor.
        </p>
        <pre className="mt-2 p-2 bg-red-100 text-xs overflow-auto">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    );
  }
  
  console.log('✅ Clerk configurado correctamente:', {
    hasPublishableKey: !!config.publishableKey,
    keyPreview: config.publishableKey.slice(0, 20) + '...'
  });

  return (
    <ClerkProvider {...config}>
      <ClerkSupabaseBridge>
        {children}
      </ClerkSupabaseBridge>
    </ClerkProvider>
  );
};

/**
 * Puente entre Clerk y Supabase
 * 
 * Este componente maneja:
 * 1. Sincronización de sesiones
 * 2. Migración de datos de usuario
 * 3. Redirecciones coordinadas
 */
const ClerkSupabaseBridge = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkInstance = useClerk();
  
  // Efecto para sincronizar sesiones cuando Clerk carga
  React.useEffect(() => {
    if (isLoaded) {
      console.log('Clerk loaded:', { 
        isClerkInstalled,
        isSignedIn, 
        userId: user?.id,
        hasUser: !!user 
      });
      
      // Solo configurar auto-sync si Clerk está instalado
      if (isClerkInstalled) {
        setupAutoSync(clerkInstance);
      } else {
        console.log('Modo simulación: omitiendo auto-sync');
      }
      
      // Sincronizar usuario si está autenticado (solo si Clerk está instalado)
      if (isClerkInstalled && isSignedIn && user) {
        console.log('Usuario autenticado en Clerk:', {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        });
        
        // Sincronizar con Supabase
        syncUserWithSupabase(user).catch(error => {
          console.error('Error sincronizando usuario con Supabase:', error);
        });
      }
    }
  }, [isLoaded, isSignedIn, user, clerkInstance]);
  
  // Efecto para manejar cambios en el usuario (solo si Clerk está instalado)
  React.useEffect(() => {
    if (isClerkInstalled && user) {
      console.log('Usuario Clerk actualizado:', user.id);
      
      // Sincronizar cuando cambian los datos del usuario
      const syncTimeout = setTimeout(() => {
        syncUserWithSupabase(user).catch(console.error);
      }, 1000); // Debounce de 1 segundo
      
      return () => clearTimeout(syncTimeout);
    }
  }, [user]);
  
  return <>{children}</>;
};

export default ClerkProviderWrapper;