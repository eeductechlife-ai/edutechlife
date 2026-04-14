import React, { useState, useEffect } from 'react';
import { getSafeConfig } from '../lib/clerk-config';
import { syncUserWithSupabase, setupAutoSync } from '../services/clerk-supabase-sync';

// Importaciones dinámicas para Clerk con ES modules
let ClerkProvider, useClerk, useUser;
let isClerkInstalled = false;
let clerkModule = null;

// Función para cargar script desde CDN
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

// Función para cargar Clerk dinámicamente
const loadClerk = async () => {
  try {
    // Primero intentar cargar desde CDN oficial si no está disponible
    if (!window.Clerk) {
      try {
        console.log('📦 Cargando Clerk desde CDN oficial...');
        await loadScript('https://cdn.jsdelivr.net/npm/@clerk/clerk-js@6/dist/clerk.browser.js');
        console.log('✅ Clerk cargado desde CDN');
      } catch (cdnError) {
        console.warn('⚠ No se pudo cargar Clerk desde CDN:', cdnError.message);
      }
    }
    
    // Intentar importar Clerk como ES module
    clerkModule = await import('@clerk/react');
    ClerkProvider = clerkModule.ClerkProvider;
    useClerk = clerkModule.useClerk;
    useUser = clerkModule.useUser;
    isClerkInstalled = true;
    console.log('✅ Clerk está instalado y listo (ES module)');
    return true;
  } catch (error) {
    console.warn('⚠ Clerk no está disponible, usando modo simulación:', error.message);
    return false;
  }
};

// Componentes de simulación para desarrollo
const MockClerkProvider = ({ children, ...props }) => {
  console.log('ClerkProvider (simulación) renderizado');
  return <>{children}</>;
};

const mockUseClerk = () => {
  console.log('useClerk (simulación) llamado');
  return {
    addListener: () => console.log('addListener (simulación) llamado'),
    signOut: async () => {
      console.log('signOut (simulación) llamado');
      return Promise.resolve();
    },
    openUserProfile: () => {
      console.log('openUserProfile (simulación) llamado');
      window.alert('Perfil de usuario - Funcionalidad en desarrollo con Clerk');
    },
  };
};

const mockUseUser = () => {
  console.log('useUser (simulación) llamado');
  return { 
    user: null, 
    isLoaded: true, 
    isSignedIn: false 
  };
};

// Inicializar con valores por defecto
ClerkProvider = MockClerkProvider;
useClerk = mockUseClerk;
useUser = mockUseUser;

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
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  
  // Cargar Clerk dinámicamente al montar el componente
  useEffect(() => {
    const initializeClerk = async () => {
      const loaded = await loadClerk();
      setIsClerkLoaded(loaded);
    };
    
    initializeClerk();
  }, []);
  
  // Si Clerk no está cargado, usar modo simulación
  if (!isClerkLoaded) {
    console.log('Usando modo simulación de Clerk');
  }
  
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