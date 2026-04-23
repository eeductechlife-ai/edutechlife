import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useSession, useClerk } from '@clerk/react';
import { useSupabase } from '../hooks/useSupabase';

const AuthContext = createContext();

// Helper para procesar formularios pendientes
const processPendingForms = () => {
  if (typeof window !== 'undefined' && window.processPendingForms) {
    window.processPendingForms();
  }
};

export const AuthProvider = ({ children }) => {
  const { session, isLoaded: clerkLoaded } = useSession();
  const { signOut: clerkSignOut, openSignIn, openSignUp } = useClerk();
  const { supabase, isLoading: supabaseLoading } = useSupabase();
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener perfil del usuario
  const fetchProfile = useCallback(async (userId) => {
    if (!session || !userId) return;

    try {
      setLoading(true);
      
      // Usar datos reales de Clerk
      const clerkUser = {
        id: session.user.id,
        full_name: session.user.fullName || 'Usuario',
        email: session.user.emailAddresses?.[0]?.emailAddress || '',
        role: 'student'
      };
      
      setProfile(clerkUser);
      setError(null);
      
    } catch (err) {
      console.warn('⚠️ Error en fetchProfile:', err.message);
      // Crear perfil local mínimo usando datos de session
      const clerkFullName = session?.user?.fullName || 'Usuario Edutechlife';
      const clerkEmail = session?.user?.emailAddresses?.[0]?.emailAddress || '';
      
      setProfile({
        id: userId,
        full_name: clerkFullName,
        email: clerkEmail,
        role: 'student'
      });
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Sincronizar usuario cuando cambia la sesión de Clerk
  useEffect(() => {
    if (!clerkLoaded) return;

    if (session?.user) {
      // Usuario autenticado
      const clerkUser = {
        id: session.user.id,
        email: session.user.emailAddresses?.[0]?.emailAddress,
        fullName: session.user.fullName,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        imageUrl: session.user.imageUrl,
        createdAt: session.user.createdAt,
      };
      
      setUser(clerkUser);
      fetchProfile(session.user.id);
      setTimeout(() => processPendingForms(), 1000);
    } else {
      // Usuario no autenticado
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, [session, clerkLoaded, fetchProfile]);

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
    loading: loading || !clerkLoaded || supabaseLoading,
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