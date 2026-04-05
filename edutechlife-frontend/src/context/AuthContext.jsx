import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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
const generatePassword = async () => {
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

// Función helper para obtener el conteo de usuarios
export const getUserCount = async () => {
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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    setError(null);
    setLoading(true);
    console.log('=== INICIO signUp ===');
    console.log('Email:', email);
    console.log('UserData:', userData);

    try {
      console.log('Llamando a supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role || 'student',
            phone: userData.phone || '',
          },
        },
      });

      console.log('Respuesta de signUp - data:', data, 'error:', error);

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      if (data.user) {
        console.log('Usuario creado en auth.users, userId:', data.user.id);
        
        console.log('=== REGISTRO EXITOSO ===');
        return { 
          success: true, 
          user: data.user,
          message: 'Registro exitoso' 
        };
      }

      console.log('=== REGISTRO COMPLETADO (sin user) ===');
      return { success: true, user: null };
    } catch (err) {
      console.error('Error en signUp:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      console.log('=== FIN signUp ===');
      setLoading(false);
    }
  };

  const createProfile = async (userId, userData) => {
    try {
      console.log('Creando perfil para usuario:', userId, 'con datos:', userData);
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role || 'student',
            avatar_url: null,
            phone: userData.phone || '',
            plain_password: userData.plain_password || null,
            user_count: userData.user_count || null,
          },
        ])
        .select()
        .single();

      console.log('Resultado de createProfile - data:', data, 'error:', error);

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error creating profile:', err);
      throw err;
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { success: true, user: data.user };
    } catch (err) {
      console.error('Error en signIn:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const isTeacher = () => profile?.role === 'teacher';
  const isStudent = () => profile?.role === 'student';

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    isTeacher,
    isStudent,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
