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
        // Procesar formularios pendientes cuando el usuario se autentica
        setTimeout(() => processPendingForms(), 1000);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
        // Procesar formularios pendientes cuando el usuario se autentica
        setTimeout(() => processPendingForms(), 1000);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      console.log('🔍 Buscando perfil para usuario ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error en consulta de perfil:', error);
        throw error;
      }
      
      console.log('✅ Perfil encontrado:', {
        id: data?.id,
        full_name: data?.full_name,
        email: data?.email,
        phone: data?.phone,
        role: data?.role
      });
      
      // Asegurar que data.full_name esté disponible
      const profileData = {
        id: data.id,
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || 'student'
      };
      
      setProfile(profileData);
    } catch (err) {
      console.error('❌ Error cargando perfil:', err);
      // Si no hay perfil, crear uno básico
      setProfile({
        id: userId,
        full_name: '',
        email: '',
        phone: '',
        role: 'student'
      });
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('Respuesta de signUp - data:', data, 'error:', error);

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      if (data.user) {
        console.log('Usuario creado en auth.users, userId:', data.user.id);
        
        // Guardar datos del formulario en form_submissions (si el usuario confirma email)
        // Nota: Esto se ejecutará después de que el usuario confirme su email
        // Para datos inmediatos, podríamos guardar en localStorage temporalmente
        const formData = {
          full_name: userData.full_name,
          email: email,
          phone: userData.phone || '',
          role: userData.role || 'student',
          registration_date: new Date().toISOString(),
          source: 'welcome_screen'
        };
        
        // Guardar en localStorage temporalmente hasta que el usuario confirme email
        localStorage.setItem('pending_registration_data', JSON.stringify({
          email: email,
          form_data: formData,
          timestamp: new Date().toISOString()
        }));
        
        console.log('Datos de formulario guardados temporalmente:', formData);
        
        console.log('=== REGISTRO EXITOSO ===');
        return { 
          success: true, 
          user: data.user,
          message: 'Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta.',
          requiresEmailConfirmation: true
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
      console.log('📝 Creando perfil para usuario:', userId, 'con datos:', userData);
      const { data, error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: userId,
            full_name: profileData.full_name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            role: profileData.role || 'student',
          },
        ])
        .select('id, full_name, email, phone, role')
        .single();

      console.log('📊 Resultado de createProfile:', {
        success: !error,
        data: data ? {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          role: data.role
        } : null,
        error: error?.message
      });

      if (error) throw error;
      
      // Asegurar estructura consistente
      const profileData = {
        id: data.id,
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || 'student'
      };
      
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('❌ Error creando perfil:', err);
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
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar datos de formulario en Supabase
  const saveFormData = async (formType, formData) => {
    try {
      console.log('Guardando datos de formulario:', { formType, formData });
      
      if (!user) {
        console.warn('Usuario no autenticado, guardando en localStorage temporalmente');
        const pendingForms = JSON.parse(localStorage.getItem('pending_forms') || '[]');
        pendingForms.push({
          formType,
          formData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pending_forms', JSON.stringify(pendingForms));
        return { success: true, storedLocally: true };
      }

      const { data, error } = await supabase
        .from('form_submissions')
        .insert([
          {
            user_id: user.id,
            form_type: formType,
            data: formData
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('Datos de formulario guardados en Supabase:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Error guardando datos de formulario:', err);
      return { success: false, error: err.message };
    }
  };

  // Función para procesar formularios pendientes cuando el usuario se autentica
  const processPendingForms = async () => {
    try {
      if (!user) return;

      const pendingForms = JSON.parse(localStorage.getItem('pending_forms') || '[]');
      const pendingRegistration = JSON.parse(localStorage.getItem('pending_registration_data') || 'null');
      
      console.log('Procesando formularios pendientes:', { pendingForms, pendingRegistration });

      // Procesar datos de registro pendiente
      if (pendingRegistration && pendingRegistration.email === user.email) {
        await saveFormData('initial', pendingRegistration.form_data);
        localStorage.removeItem('pending_registration_data');
        console.log('Datos de registro procesados');
      }

      // Procesar otros formularios pendientes
      for (const pendingForm of pendingForms) {
        await saveFormData(pendingForm.formType, pendingForm.formData);
      }

      if (pendingForms.length > 0) {
        localStorage.removeItem('pending_forms');
        console.log(`${pendingForms.length} formularios pendientes procesados`);
      }
    } catch (err) {
      console.error('Error procesando formularios pendientes:', err);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      console.log('📝 Actualizando perfil para usuario:', user.id, 'con updates:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select('id, full_name, email, phone, role')
        .single();

      if (error) throw error;
      
      // Asegurar estructura consistente
      const profileData = {
        id: data.id,
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || 'student'
      };
      
      setProfile(profileData);
      return { success: true, data: profileData };
    } catch (err) {
      console.error('❌ Error actualizando perfil:', err);
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
    createProfile,
    getUserCount,
    generatePassword,
    generateEDLPassword,
    saveFormData,
    processPendingForms,
    updateProfile,
    resetPassword,
    isTeacher,
    isStudent,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        createProfile,
        getUserCount,
        generatePassword,
        generateEDLPassword,
        saveFormData, // Nueva función para guardar datos de formulario
        processPendingForms, // Nueva función para procesar formularios pendientes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
