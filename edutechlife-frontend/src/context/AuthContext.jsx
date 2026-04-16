import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession, useClerk } from '@clerk/react';
import { useSupabase } from '../hooks/useSupabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Generador de contraseña: EDL + conteo_usuarios + - + MMYY + *
const generateEDLPassword = async () => {
  const now = new Date();
  const mmYY = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  const password = `EDL${randomNum}-${mmYY}*`;
  console.log('🔐 Contraseña generada:', password);
  return { password, userCount: randomNum };
};

// Generador de contraseña alternativo (backup)
const generatePassword = async (supabase) => {
  try {
    // Obtener conteo de usuarios
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    console.log('Contando usuarios en profiles, count:', count, 'error:', countError);

    if (countError) throw countError;

    const userCount = (count || 0) + 1;
    const now = new Date();
    const mmYY = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
    
    // Generar: EDL + [conteo] + - + [MMYY] + *
    const password = `EDL${userCount}-${mmYY}*`;
    console.log('Contraseña generada:', password);
    
    return { password, userCount };
  } catch (error) {
    console.error('Error generando contraseña:', error);
    // Fallback si falla el conteo
    return generateEDLPassword();
  }
};

// Helper para procesar formularios pendientes
const processPendingForms = () => {
  // Esta función procesa formularios pendientes cuando el usuario se autentica
  // Mantener compatibilidad con código existente
  if (typeof window !== 'undefined' && window.processPendingForms) {
    window.processPendingForms();
  }
};

// Helper para obtener conteo de usuarios
const getUserCount = async (supabase) => {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  } catch {
    return 0;
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

  const fetchProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email, role, avatar_url, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log(`ℹ️ No se encontró perfil para usuario ${userId.substring(0, 8)}`);
        } else {
          console.error('Error fetching profile:', profileError);
          setError(profileError.message);
        }
        setProfile(null);
      } else {
        setProfile(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Efecto para sincronizar usuario cuando cambia la sesión de Clerk
  useEffect(() => {
    if (!clerkLoaded) return;

    if (session) {
      // Usuario autenticado con Clerk
      const clerkUser = {
        id: session.user.id,
        email: session.user.primaryEmailAddress?.emailAddress,
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
      // El efecto useEffect se encargará de actualizar el estado cuando la sesión cambie
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
      
      // No devolvemos usuario inmediatamente porque Clerk maneja el flujo
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
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('id, full_name, phone, email, role, avatar_url, created_at, updated_at')
        .single();

      if (updateError) throw updateError;
      
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
    
    // Métodos de autenticación (usando Clerk)
    signIn,
    signUp,
    signOut,
    createUser,
    updateProfile,
    
    // Helpers
    generatePassword: () => supabase ? generatePassword(supabase) : generateEDLPassword(),
    getUserCount: () => supabase ? getUserCount(supabase) : Promise.resolve(0),
    
    // Flags
    isAuthenticated: !!session,
    hasClerkSession: !!session,
    hasSupabaseClient: !!supabase,
    
    // Para compatibilidad con código existente
    supabase, // Cliente Supabase con JWT de Clerk si hay sesión
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;