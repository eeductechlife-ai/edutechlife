/**
 * Cliente Supabase Premium con integración Clerk JWT
 * 
 * Este cliente permite:
 * 1. Autenticación transparente con tokens JWT de Clerk
 * 2. Sincronización automática de sesiones
 * 3. RLS (Row Level Security) con auth.uid() funcionando
 * 4. Fallback a cliente anónimo si Clerk no está disponible
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar configuración
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Variables de entorno de Supabase no configuradas');
  console.error('Por favor, verifica que .env.local contenga:');
  console.error('VITE_SUPABASE_URL=https://...');
  console.error('VITE_SUPABASE_ANON_KEY=eyJ...');
}

// Cliente base (sin auth - para queries públicas)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Crea un cliente Supabase premium autenticado con Clerk JWT
 * @param {Object} clerkClient - Instancia del cliente Clerk (window.Clerk)
 * @returns {Object} Cliente Supabase autenticado
 */
export const createPremiumClient = (clerkClient) => {
  if (!clerkClient) {
    console.warn('⚠️ Clerk client no proporcionado, usando cliente anónimo');
    return supabase;
  }
  
  console.log('🔐 Creando cliente Supabase premium con Clerk JWT');
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false, // Clerk maneja la sesión
      persistSession: false,   // No persistir en localStorage
      detectSessionInUrl: false,
      
      // Override storage para usar token JWT de Clerk
      storageKey: 'clerk-supabase-token',
      storage: {
        getItem: async (key) => {
          if (key === 'clerk-supabase-token' && clerkClient.session) {
            try {
              // Obtener token JWT del template específico
              const token = await clerkClient.session.getToken({
                template: '5d74d508-85ee-4a7c-9d50-87005f9b8a90' // ID del template
              });
              
              if (token) {
                console.log('✅ Token JWT obtenido de Clerk');
                return token;
              } else {
                console.warn('⚠️ No se pudo obtener token JWT de Clerk');
              }
            } catch (error) {
              console.error('❌ Error obteniendo token JWT:', error);
            }
          }
          return null;
        },
        setItem: (key, value) => {
          // No hacer nada - Clerk maneja la sesión
        },
        removeItem: (key) => {
          // No hacer nada - Clerk maneja la sesión
        }
      }
    },
    
    // Configuración global
    global: {
      headers: {
        'X-Client': 'edutechlife-ialab-premium',
        'X-Client-Version': '1.0.0'
      }
    }
  });
};

/**
 * Hook para usar Supabase premium en componentes React
 * @returns {Object} { supabase, isPremium, userId, isLoading }
 */
export const usePremiumSupabase = () => {
  // Nota: Este hook debe usarse dentro de ClerkProvider
  // En un componente real, usaríamos useClerk() de @clerk/react
  
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    return {
      supabase,
      isPremium: false,
      userId: null,
      isLoading: false,
      error: 'Solo disponible en cliente'
    };
  }
  
  // Verificar si Clerk está disponible
  const clerkAvailable = !!window.Clerk;
  const clerkLoaded = clerkAvailable && window.Clerk.loaded;
  const clerkSession = clerkAvailable ? window.Clerk.session : null;
  const clerkUser = clerkAvailable ? window.Clerk.user : null;
  
  if (!clerkAvailable) {
    console.warn('⚠️ Clerk no disponible en window, usando cliente anónimo');
    return {
      supabase,
      isPremium: false,
      userId: null,
      isLoading: false,
      error: 'Clerk no disponible'
    };
  }
  
  if (!clerkLoaded) {
    return {
      supabase,
      isPremium: false,
      userId: null,
      isLoading: true,
      error: 'Clerk cargando...'
    };
  }
  
  if (!clerkSession || !clerkUser) {
    return {
      supabase,
      isPremium: false,
      userId: null,
      isLoading: false,
      error: 'No autenticado con Clerk'
    };
  }
  
  // Crear cliente premium
  const premiumSupabase = createPremiumClient(window.Clerk);
  
  return {
    supabase: premiumSupabase,
    isPremium: true,
    userId: clerkUser.id,
    isLoading: false,
    error: null,
    clerkUser: clerkUser
  };
};

/**
 * Verifica la integración Clerk-Supabase
 * @returns {Promise<Object>} Resultado de la verificación
 */
export const verifyIntegration = async () => {
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    return {
      success: false,
      error: 'Solo disponible en cliente',
      checks: {}
    };
  }
  
  const checks = {
    clerkAvailable: !!window.Clerk,
    clerkLoaded: !!window.Clerk?.loaded,
    clerkSession: !!window.Clerk?.session,
    clerkUser: !!window.Clerk?.user,
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey
  };
  
  console.log('🧪 Verificando integración Clerk-Supabase:', checks);
  
  // Si Clerk no está disponible, retornar early
  if (!checks.clerkAvailable || !checks.clerkSession) {
    return {
      success: false,
      error: 'Clerk no disponible o no autenticado',
      checks
    };
  }
  
  try {
    // Crear cliente premium
    const premiumSupabase = createPremiumClient(window.Clerk);
    
    // Test 1: Obtener token JWT
    const token = await window.Clerk.session.getToken({
      template: '5d74d508-85ee-4a7c-9d50-87005f9b8a90'
    });
    
    checks.jwtToken = !!token;
    checks.jwtTokenLength = token?.length || 0;
    
    // Test 2: Query simple con RLS
    const { data: profile, error: profileError } = await premiumSupabase
      .from('profiles')
      .select('id, email, full_name')
      .maybeSingle();
    
    checks.profileQuery = !profileError;
    checks.profileFound = !!profile;
    
    // Test 3: Verificar que auth.uid() funciona
    if (profile) {
      const { data: userProgress, error: progressError } = await premiumSupabase
        .from('course_progress')
        .select('id')
        .limit(1);
      
      checks.rlsWorking = !progressError || progressError.code !== '42501'; // 42501 = permission denied
    }
    
    const allChecksPassed = Object.values(checks).every(check => 
      typeof check === 'boolean' ? check : true
    );
    
    return {
      success: allChecksPassed,
      checks,
      profile,
      tokenPreview: token ? token.substring(0, 50) + '...' : null
    };
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
    return {
      success: false,
      error: error.message,
      checks,
      stack: error.stack
    };
  }
};

/**
 * Helper para operaciones comunes del curso
 */
export const courseOperations = {
  /**
   * Guardar progreso de lección
   */
  saveLessonProgress: async (premiumSupabase, userId, moduleId, lessonId, data = {}) => {
    const { content_type = 'activity', score = null, is_completed = true } = data;
    
    return await premiumSupabase
      .from('course_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        content_type,
        is_completed,
        score,
        completed_at: is_completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id,lesson_id,content_type'
      });
  },
  
  /**
   * Obtener progreso del usuario
   */
  getUserProgress: async (premiumSupabase, userId) => {
    const { data, error } = await premiumSupabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .order('module_id', { ascending: true })
      .order('lesson_id', { ascending: true });
    
    if (error) throw error;
    
    // Calcular estadísticas
    const completedLessons = data.filter(item => item.is_completed).length;
    const totalLessons = 24; // Total de lecciones del curso
    
    return {
      data,
      stats: {
        completedLessons,
        totalLessons,
        percentage: Math.round((completedLessons / totalLessons) * 100),
        completedModules: [...new Set(data.filter(item => item.is_completed).map(item => item.module_id))].length
      }
    };
  },
  
  /**
   * Registrar intento de quiz
   */
  saveQuizAttempt: async (premiumSupabase, userId, moduleId, score, answers, securityData = {}) => {
    const { violated_security = false, security_details = null } = securityData;
    
    return await premiumSupabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        module_id: moduleId,
        score,
        answers,
        violated_security,
        security_details,
        created_at: new Date().toISOString()
      });
  },
  
  /**
   * Verificar intentos diarios
   */
  checkDailyAttempts: async (premiumSupabase, userId, moduleId) => {
    const { data, error } = await premiumSupabase
      .rpc('check_daily_attempts', {
        p_user_id: userId,
        p_module_id: moduleId
      });
    
    if (error) {
      console.warn('⚠️ Función check_daily_attempts no disponible, usando fallback');
      
      // Fallback: contar manualmente
      const today = new Date().toISOString().split('T')[0];
      const { data: attempts, error: countError } = await premiumSupabase
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .gte('created_at', today + 'T00:00:00')
        .lte('created_at', today + 'T23:59:59');
      
      if (countError) throw countError;
      
      return {
        attempts_today: attempts.length,
        can_attempt: attempts.length < 2,
        max_attempts: 2,
        security_blocked: false
      };
    }
    
    return data[0] || {
      attempts_today: 0,
      can_attempt: true,
      max_attempts: 2,
      security_blocked: false
    };
  },
  
  /**
   * Obtener certificado del usuario
   */
  getUserCertificate: async (premiumSupabase, userId) => {
    const { data, error } = await premiumSupabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Actualizar sesión activa
   */
  updateActiveSession: async (premiumSupabase, userId, moduleId, lessonId) => {
    // Esta operación se maneja automáticamente por el trigger
    // Pero podemos forzar una actualización si es necesario
    return await premiumSupabase
      .from('student_sessions')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        last_active: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
  }
};

/**
 * Inicializar integración Clerk-Supabase
 * Debe llamarse después de que Clerk esté cargado
 */
export const initializePremiumIntegration = async () => {
  console.log('🚀 Inicializando integración premium Clerk-Supabase...');
  
  const result = await verifyIntegration();
  
  if (result.success) {
    console.log('✅ Integración premium verificada exitosamente');
    console.log('📊 Checks:', result.checks);
    
    // Emitir evento para que otros componentes sepan
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('premium-integration-ready', {
        detail: result
      }));
    }
  } else {
    console.warn('⚠️ Integración premium tiene problemas:', result.error);
    console.warn('📊 Checks:', result.checks);
  }
  
  return result;
};

// Auto-inicializar cuando Clerk esté listo
if (typeof window !== 'undefined') {
  if (window.Clerk && window.Clerk.loaded) {
    setTimeout(() => initializePremiumIntegration(), 1000);
  } else {
    window.addEventListener('clerk-loaded', () => {
      setTimeout(() => initializePremiumIntegration(), 1000);
    });
  }
}

export default {
  supabase,
  createPremiumClient,
  usePremiumSupabase,
  verifyIntegration,
  courseOperations,
  initializePremiumIntegration
};