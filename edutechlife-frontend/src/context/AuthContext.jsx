import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { useSupabase } from '../hooks/useSupabase';

const AuthContext = createContext();

// Helper para procesar formularios pendientes
const processPendingForms = () => {
  if (typeof window !== 'undefined' && window.processPendingForms) {
    window.processPendingForms();
  }
};

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser();
  const { signOut: clerkSignOut, openSignIn, openSignUp } = useClerk();
  const { supabase, isLoading: supabaseLoading } = useSupabase();
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener perfil del usuario
  const fetchProfile = useCallback(async (userId) => {
    if (!clerkUser || !userId) return;

    try {
      setLoading(true);
      
      const clerkUserData = {
        id: clerkUser.id,
        full_name: clerkUser.fullName || 'Usuario',
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        role: 'student'
      };
      
      setProfile(clerkUserData);
      setError(null);
      
    } catch (err) {
      console.warn('⚠️ Error en fetchProfile:', err.message);
      const clerkFullName = clerkUser?.fullName || 'Usuario Edutechlife';
      const clerkEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || '';
      
      setProfile({
        id: userId,
        full_name: clerkFullName,
        email: clerkEmail,
        role: 'student'
      });
    } finally {
      setLoading(false);
    }
  }, [clerkUser]);

  // Sincronizar usuario cuando cambia la sesión de Clerk
  useEffect(() => {
    if (!clerkIsLoaded) return;

    if (clerkUser) {
      const localUser = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress,
        fullName: clerkUser.fullName,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        createdAt: clerkUser.createdAt,
      };
      
      setUser(localUser);
      fetchProfile(clerkUser.id);
      setTimeout(() => processPendingForms(), 1000);

      const syncProfileToSupabase = async () => {
        if (!supabase) return;
        
        try {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', clerkUser.id)
            .single();

          if (!existing) {
            const { error } = await supabase
              .from('profiles')
              .insert({
                id: clerkUser.id,
                full_name: clerkUser.fullName || 'Usuario',
                email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
                role: 'student',
              });

            if (error) {
              console.warn('Profile sync warning:', error.message);
            } else {
              console.log('Profile synced to Supabase:', clerkUser.id);
            }
          }
        } catch (err) {
          console.warn('Profile sync failed:', err.message);
        }
      };

      syncProfileToSupabase();
    } else {
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, [clerkUser, clerkIsLoaded, fetchProfile, supabase]);

  // Sign in con Clerk (abre modal de login de Clerk)
  const signIn = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      // Clerk maneja el login automáticamente
      openSignIn();
      
      // No devolvemos usuario inmediatamente porque Clerk maneja el flujo
      return { success: true, user: null };
    } catch (err) {
      console.error('Error en signIn:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [openSignIn]);

  // Sign up con Clerk (abre modal de registro de Clerk)
  const signUp = useCallback(async (email, password, metadata = {}) => {
    setError(null);
    setLoading(true);

    try {
      // Clerk maneja el registro automáticamente
      openSignUp();
      
      return { success: true, user: null };
    } catch (err) {
      console.error('Error en signUp:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [openSignUp]);

  // Sign out con Clerk
  const signOut = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      await clerkSignOut();
      setUser(null);
      setProfile(null);
      setError(null);
      
      // Limpiar localStorage de progreso (los datos permanecen en Supabase)
      const progressKeys = [
        'ialab_completed_videos',
        'ialab_completed_modules',
        'ialab_completed_exams',
        'ialab_completed_infographics',
        'ialab_completed_activities',
        'ialab_overall_progress',
        'ialab_sync_queue'
      ];
      progressKeys.forEach(key => localStorage.removeItem(key));
      console.log('🧹 Progreso local limpiado al cerrar sesión');
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clerkSignOut]);

  // Crear usuario (alias para signUp para compatibilidad)
  const createUser = useCallback(async (email, password, metadata = {}) => {
    return signUp(email, password, metadata);
  }, [signUp]);

  // Actualizar perfil en Supabase
  const updateProfile = useCallback(async (updates) => {
    if (!supabase || !user?.id) {
      throw new Error('No hay usuario autenticado o cliente Supabase');
    }

    try {
      // Actualización real con Supabase
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Actualizar perfil local
      setProfile(data);
      return { error: null, data };
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      return { error: err, data: null };
    }
  }, [supabase, user]);

  const value = {
    // Estado
    user,
    profile,
    isLoaded: clerkIsLoaded,
    loading: loading || !clerkIsLoaded || supabaseLoading,
    error,
    
    // Acciones
    signIn,
    signUp,
    signOut,
    createUser,
    updateProfile,
    
    // Helpers
    isAuthenticated: !!user,
    hasProfile: !!profile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;