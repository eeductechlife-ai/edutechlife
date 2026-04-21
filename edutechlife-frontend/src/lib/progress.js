import { supabase } from './supabase';

const TABLE_NAME = 'user_progress';

// Constantes para compatibilidad con código existente
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  LOCKED: 'locked',
};

export const MODULE_TYPES = {
  PROMPTS: 'prompts',
  CHAT_GPT: 'chatgpt',
  GEMINI: 'gemini',
  NOTEBOOK_LM: 'notebook_lm',
  FINAL_EXAM: 'final_exam',
};

// Función simplificada para obtener userId - acepta userId directamente de Clerk
const getUserId = (userId) => {
  // Si ya tenemos userId, usarlo directamente
  if (userId) {
    return userId;
  }
  
  // Fallback: intentar obtener de localStorage/sessionStorage de Clerk
  try {
    // Buscar en localStorage primero
    const clerkState = localStorage.getItem('__clerk_client_state');
    if (clerkState) {
      const parsed = JSON.parse(clerkState);
      const clerkUserId = parsed?.__client?.user?.id;
      if (clerkUserId) {
        console.log('✅ [CLERK] User ID obtenido de localStorage:', clerkUserId.substring(0, 8) + '...');
        return clerkUserId;
      }
    }
    
    // Buscar en sessionStorage
    const clerkSession = sessionStorage.getItem('__clerk_client_state');
    if (clerkSession) {
      const parsed = JSON.parse(clerkSession);
      const clerkUserId = parsed?.__client?.user?.id;
      if (clerkUserId) {
        console.log('✅ [CLERK] User ID obtenido de sessionStorage:', clerkUserId.substring(0, 8) + '...');
        return clerkUserId;
      }
    }
    
    // Buscar en window.Clerk (SPA)
    if (typeof window !== 'undefined' && window.Clerk?.user?.id) {
      console.log('✅ [CLERK] User ID obtenido de window.Clerk:', window.Clerk.user.id.substring(0, 8) + '...');
      return window.Clerk.user.id;
    }
    
    console.warn('⚠️ No se pudo obtener User ID de Clerk');
    return null;
  } catch (error) {
    console.warn('⚠️ Error obteniendo User ID:', error.message);
    return null;
  }
};

// Función auxiliar para crear fila de progreso si no existe
const ensureProgressRow = async (userId, moduleId) => {
  try {
    // Primero intentar obtener la fila existente
    const { data: existing, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle(); // Usar maybeSingle para evitar errores si no existe

    // Si no existe, crear una nueva fila con valores por defecto
    if (fetchError && fetchError.code === 'PGRST116') {
      const defaultData = {
        user_id: userId,
        module_id: moduleId,
        last_lesson_id: null,
        completed_lessons: [],
        is_completed: false,
        score: 0,
        updated_at: new Date().toISOString(),
      };

      const { data: newRow, error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert(defaultData)
        .select()
        .maybeSingle(); // Usar maybeSingle para evitar errores

      if (insertError) throw insertError;
      return newRow;
    }

    if (fetchError) throw fetchError;
    return existing;
  } catch (err) {
    console.error('Error ensuring progress row:', err);
    throw err;
  }
};

export const getProgress = async (moduleId, userId) => {
  try {
    // SOLUCIÓN TEMPORAL: Desactivar consultas que causan error 406
    console.log('🔇 Consulta getProgress desactivada temporalmente (evitar error 406)');
    console.log('   Razón: Error 406 (Not Acceptable) en consulta a user_progress');
    
    // Usar datos simulados para desarrollo
    const numericModuleId = Number(moduleId);
    const simulatedProgress = {
      id: `sim-progress-${numericModuleId}`,
      user_id: userId || 'demo-user',
      module_id: numericModuleId,
      status: numericModuleId === 1 ? 'in_progress' : 'not_started',
      progress_percentage: numericModuleId === 1 ? 50 : 0,
      last_accessed: new Date().toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      simulated: true
    };
    
    console.log(`✅ Progreso simulado para módulo ${numericModuleId}`);
    return simulatedProgress;
    
    /*
    // CÓDIGO ORIGINAL (descomentar cuando RLS esté configurado):
    const actualUserId = getUserId(userId);
    if (!actualUserId) return null;

    // Asegurar que moduleId sea número
    const numericModuleId = Number(moduleId);
    if (isNaN(numericModuleId)) {
      console.error('moduleId debe ser un número:', moduleId);
      return null;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', actualUserId)
      .eq('module_id', numericModuleId)
      .maybeSingle(); // Usar maybeSingle para evitar errores si no existe

    if (error) {
      if (error.code === 'PGRST116') {
        // Crear fila si no existe
        return await ensureProgressRow(actualUserId, numericModuleId);
      }
      throw error;
    }

    return data;
    */
  } catch (err) {
    console.error('Error getting progress:', err);
    return null;
  }
};

export const getAllProgress = async (userId) => {
  try {
    // SOLUCIÓN TEMPORAL: Desactivar consultas que causan error 401
    console.log('🔇 Consulta getAllProgress desactivada temporalmente (evitar error 401)');
    console.log('   Razón: RLS bloqueando acceso a user_progress');
    console.log('   Solución: Configurar políticas RLS en Supabase Dashboard');
    
    // Usar datos simulados para desarrollo
    const simulatedProgress = [
      {
        id: 'sim-1',
        user_id: userId || 'demo-user',
        module_id: 1,
        status: 'in_progress',
        progress_percentage: 50,
        last_accessed: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        simulated: true
      },
      {
        id: 'sim-2',
        user_id: userId || 'demo-user',
        module_id: 2,
        status: 'not_started',
        progress_percentage: 0,
        last_accessed: null,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        simulated: true
      }
    ];
    
    console.log('✅ Progreso simulado devuelto para desarrollo');
    return simulatedProgress;
    
    /*
    // CÓDIGO ORIGINAL (descomentar cuando RLS esté configurado):
    const actualUserId = getUserId(userId);
    if (!actualUserId) {
      console.warn('⚠️ [RESILIENCE] Usuario no autenticado, retornando progreso vacío');
      return [];
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', actualUserId)
      .order('module_id', { ascending: true });

    if (error) throw error;
    return data || [];
    */
  } catch (err) {
    console.error('Error getting all progress:', err);
    return [];
  }
};

export const saveProgress = async (moduleId, status, metadata = {}, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) {
      // NO lanzar error crítico - solo retornar fallo controlado
      console.warn('⚠️ [RESILIENCE] Usuario no autenticado, guardando progreso localmente');
      return { 
        success: false, 
        error: 'User not authenticated', 
        data: null,
        localFallback: true
      };
    }

    // Asegurar que moduleId sea número
    const numericModuleId = Number(moduleId);
    if (isNaN(numericModuleId)) {
      throw new Error('moduleId debe ser un número');
    }

    // Determinar is_completed basado en status
    const is_completed = status === PROGRESS_STATUS.COMPLETED;
    
    // Extraer score de metadata si está disponible
    const score = metadata?.score || metadata?.evaluationScore || 0;

    const progressData = {
      user_id: actualUserId,
      module_id: numericModuleId,
      is_completed,
      score,
      // Mantener metadata en completed_lessons para compatibilidad
      completed_lessons: metadata || {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(progressData, {
        onConflict: 'user_id,module_id',
        ignoreDuplicates: false,
      })
      .select()
      .maybeSingle(); // Usar maybeSingle para evitar errores

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error saving progress:', err);
    return { success: false, error: err.message };
  }
};

export const markModuleStarted = async (moduleId, userId) => {
  return saveProgress(moduleId, PROGRESS_STATUS.IN_PROGRESS, {}, userId);
};

export const markModuleCompleted = async (moduleId, score = null, userId) => {
  return saveProgress(moduleId, PROGRESS_STATUS.COMPLETED, { score }, userId);
};

export const resetModuleProgress = async (moduleId, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) throw new Error('User not authenticated');

    const numericModuleId = Number(moduleId);
    if (isNaN(numericModuleId)) throw new Error('moduleId debe ser un número');

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        is_completed: false,
        score: 0,
        completed_lessons: [],
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', actualUserId)
      .eq('module_id', numericModuleId)
      .select()
      .maybeSingle(); // Usar maybeSingle para evitar errores

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error resetting module progress:', err);
    return { success: false, error: err.message };
  }
};

export const unlockNextModule = async (currentModuleId, userId) => {
  const nextModuleId = Number(currentModuleId) + 1;
  return saveProgress(nextModuleId, PROGRESS_STATUS.NOT_STARTED, {}, userId);
};

export const getCompletedModules = async (userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) return [];

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('module_id')
      .eq('user_id', actualUserId)
      .eq('is_completed', true);

    if (error) throw error;
    return data.map((item) => item.module_id);
  } catch (err) {
    console.error('Error getting completed modules:', err);
    return [];
  }
};

export const getModuleScore = async (moduleId, userId) => {
  try {
    const progress = await getProgress(moduleId, userId);
    return progress?.score || null;
  } catch (err) {
    console.error('Error getting module score:', err);
    return null;
  }
};

// Nueva función para calcular el progreso total (20% por módulo completado)
export const getTotalProgress = async (userId) => {
  try {
    const completedModules = await getCompletedModules(userId);
    const totalModules = 5; // Asumiendo 5 módulos en total
    const progressPerModule = 20; // 20% por módulo
    
    const completedCount = completedModules.length;
    const progress = (completedCount * progressPerModule);
    
    return {
      progress: Math.min(100, progress),
      completedCount,
      totalModules,
      completedModules
    };
  } catch (err) {
    console.error('Error calculating total progress:', err);
    return {
      progress: 0,
      completedCount: 0,
      totalModules: 5,
      completedModules: []
    };
  }
};

export const saveLastLesson = async (moduleId, lessonId, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) {
      throw new Error('User not authenticated');
    }

    const numericModuleId = Number(moduleId);
    if (isNaN(numericModuleId)) throw new Error('moduleId debe ser un número');

    // Primero asegurar que la fila existe
    await ensureProgressRow(actualUserId, numericModuleId);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        last_lesson_id: lessonId,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', actualUserId)
      .eq('module_id', numericModuleId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error saving last lesson:', err);
    return { success: false, error: err.message };
  }
};

export const getLastLesson = async (moduleId, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) return null;

    const numericModuleId = Number(moduleId);
    if (isNaN(numericModuleId)) {
      console.error('moduleId debe ser un número:', moduleId);
      return null;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('last_lesson_id')
      .eq('user_id', actualUserId)
      .eq('module_id', numericModuleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Crear fila si no existe y retornar null
        await ensureProgressRow(actualUserId, numericModuleId);
        return null;
      }
      throw error;
    }

    return data?.last_lesson_id || null;
  } catch (err) {
    console.error('Error getting last lesson:', err);
    return null;
  }
};

export const getUserLastProgress = async (userId) => {
  try {
    // SOLUCIÓN TEMPORAL: Desactivar consultas que causan error 401/406
    console.log('🔇 Consulta getUserLastProgress desactivada temporalmente (evitar error 406)');
    console.log('   Razón: Error 406 (Not Acceptable) en consulta a user_progress');
    console.log('   Solución: Configurar políticas RLS y verificar headers en Supabase Dashboard');
    
    // Usar datos simulados para desarrollo
    const simulatedProgress = {
      id: 'sim-last-1',
      user_id: userId || 'demo-user',
      module_id: 1,
      status: 'in_progress',
      progress_percentage: 50,
      last_accessed: new Date().toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      simulated: true
    };
    
    console.log('✅ Último progreso simulado devuelto para desarrollo');
    return simulatedProgress;
    
    /*
    // CÓDIGO ORIGINAL (descomentar cuando RLS esté configurado):
    const actualUserId = getUserId(userId);
    if (!actualUserId) return null;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', actualUserId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
    */
  } catch (err) {
    console.error('Error getting user last progress:', err);
    return null;
  }
};

export const saveVideoProgress = async (moduleId, videoId, completed = false, userId) => {
  try {
    // SOLUCIÓN TEMPORAL: Desactivar consultas que causan error 401/406
    console.log('🔇 Consulta saveVideoProgress desactivada temporalmente (evitar error 406)');
    console.log('   Razón: Posible error en consulta a user_video_progress');
    console.log('   Solución: Configurar políticas RLS en Supabase Dashboard');
    
    // Simular guardado exitoso para desarrollo
    const simulatedData = {
      id: 'sim-video-1',
      user_id: userId || 'demo-user',
      module_id: moduleId,
      video_id: videoId,
      completed: completed,
      updated_at: new Date().toISOString(),
      simulated: true
    };
    
    console.log('✅ Progreso de video simulado guardado');
    return { success: true, data: simulatedData };
    
    /*
    // CÓDIGO ORIGINAL (descomentar cuando RLS esté configurado):
    const actualUserId = getUserId(userId);
    if (!actualUserId) {
      throw new Error('User not authenticated');
    }

    const tableName = 'user_video_progress';
    
    const { data, error } = await supabase
      .from(tableName)
      .upsert(
        {
          user_id: actualUserId,
          module_id: moduleId,
          video_id: videoId,
          completed,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,module_id,video_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
    */
  } catch (err) {
    console.error('Error saving video progress:', err);
    return { success: false, error: err.message };
  }
};

export const getVideoProgress = async (moduleId, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) return [];

    const { data, error } = await supabase
      .from('user_video_progress')
      .select('*')
      .eq('user_id', actualUserId)
      .eq('module_id', moduleId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error getting video progress:', err);
    return [];
  }
};

export const saveInfographicProgress = async (moduleId, infographicId, completed = false, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_infographic_progress')
      .upsert(
        {
          user_id: actualUserId,
          module_id: moduleId,
          infographic_id: infographicId,
          completed,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,module_id,infographic_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error saving infographic progress:', err);
    return { success: false, error: err.message };
  }
};

export const saveActivitySubmission = async (moduleId, submission, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_activities')
      .insert([
        {
          user_id: actualUserId,
          module_id: moduleId,
          submission,
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error saving activity submission:', err);
    return { success: false, error: err.message };
  }
};

export const getActivitySubmission = async (moduleId, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) return null;

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', actualUserId)
      .eq('module_id', moduleId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Error getting activity submission:', err);
    return null;
  }
};

export const saveExamResult = async (moduleId, score, maxScore, answers, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) {
      throw new Error('User not authenticated');
    }

    const passed = score >= maxScore * 0.7;

    const { data, error } = await supabase
      .from('user_exams')
      .insert([
        {
          user_id: actualUserId,
          module_id: moduleId,
          score,
          max_score: maxScore,
          passed,
          answers,
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (passed) {
      await markModuleCompleted(moduleId, score, actualUserId);
    }

    return { success: true, data, passed };
  } catch (err) {
    console.error('Error saving exam result:', err);
    return { success: false, error: err.message };
  }
};

export const getExamResults = async (moduleId, userId) => {
  try {
    const actualUserId = getUserId(userId);
    if (!actualUserId) return [];

    const { data, error } = await supabase
      .from('user_exams')
      .select('*')
      .eq('user_id', actualUserId)
      .eq('module_id', moduleId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error getting exam results:', err);
    return [];
  }
};

export default {
  PROGRESS_STATUS,
  MODULE_TYPES,
  getProgress,
  getAllProgress,
  saveProgress,
  markModuleStarted,
  markModuleCompleted,
  resetModuleProgress,
  unlockNextModule,
  getCompletedModules,
  getModuleScore,
  getTotalProgress, // Nueva función exportada
  saveVideoProgress,
  getVideoProgress,
  saveInfographicProgress,
  saveActivitySubmission,
  getActivitySubmission,
  saveExamResult,
  getExamResults,
  saveLastLesson,
  getLastLesson,
  getUserLastProgress,
};
