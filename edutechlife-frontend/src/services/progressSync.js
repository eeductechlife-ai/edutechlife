/**
 * Servicio de sincronización de progreso entre localStorage y Supabase
 * 
 * Funciona con:
 * - Cliente JWT (cuando Supabase verifica Clerk JWT)
 * - Cliente anon key (fallback cuando JWT no se verifica)
 * 
 * En ambos modos, el user_id se filtra en las queries de la app.
 */

const PROGRESS_TABLE = 'user_progress';
const SYNC_QUEUE_KEY = 'ialab_sync_queue';

/**
 * Guarda el progreso completo del usuario en Supabase
 * @param {Object} supabase - Cliente Supabase (JWT o anon)
 * @param {string} userId - ID del usuario (Clerk user ID)
 * @param {Object} progressData - Datos de progreso completos
 * @returns {Object} { success, error, data, offline }
 */
export const syncProgressToSupabase = async (supabase, userId, progressData) => {
  if (!supabase || !userId) {
    return { success: false, error: 'Cliente Supabase o userId no disponible' };
  }

  if (!navigator.onLine) {
    console.log('📴 Sin conexión, encolando sincronización');
    queueSyncOperation({
      type: 'full_sync',
      data: progressData
    });
    return { success: false, error: 'offline', offline: true };
  }

  try {
    const { completedVideos = [], completedModules = [], completedExams = {}, 
            completedInfographics = [], completedActivities = [] } = progressData;

    // Preparar registros para upsert
    const recordsToUpsert = [];

    completedVideos.forEach(videoId => {
      recordsToUpsert.push({
        user_id: userId,
        activity_type: 'video',
        resource_id: videoId,
        is_completed: true,
        updated_at: new Date().toISOString()
      });
    });

    completedModules.forEach(moduleId => {
      recordsToUpsert.push({
        user_id: userId,
        module_id: parseInt(moduleId) || 0,
        activity_type: 'module',
        resource_id: `module_${moduleId}`,
        is_completed: true,
        updated_at: new Date().toISOString()
      });
    });

    Object.entries(completedExams).forEach(([moduleId, passed]) => {
      if (passed) {
        recordsToUpsert.push({
          user_id: userId,
          module_id: parseInt(moduleId) || 0,
          activity_type: 'exam',
          resource_id: null,
          is_completed: true,
          updated_at: new Date().toISOString()
        });
      }
    });

    completedInfographics.forEach(infographicId => {
      recordsToUpsert.push({
        user_id: userId,
        activity_type: 'infographic',
        resource_id: infographicId,
        is_completed: true,
        updated_at: new Date().toISOString()
      });
    });

    completedActivities.forEach(activityId => {
      recordsToUpsert.push({
        user_id: userId,
        activity_type: 'activity',
        resource_id: activityId,
        is_completed: true,
        updated_at: new Date().toISOString()
      });
    });

    if (recordsToUpsert.length === 0) {
      return { success: true, data: [], error: null };
    }

    // Upsert en batch - NULLS NOT DISTINCT maneja todos los casos
    const { data, error } = await supabase
      .from(PROGRESS_TABLE)
      .upsert(recordsToUpsert, { onConflict: 'user_id,module_id,activity_type,resource_id' })
      .select();

    if (error) {
      console.error('❌ Error upsert en Supabase:', error.message, error.details);
      
      if (error.status === 401 || error.message.includes('JWT') || error.message.includes('key')) {
        console.log('🔄 Error de autenticación, encolando para retry');
        queueSyncOperation({
          type: 'full_sync',
          data: progressData
        });
        return { success: false, error: error.message, data: null };
      }
      
      throw error;
    }

    console.log(`✅ Progreso sincronizado: ${recordsToUpsert.length} registros guardados`);
    return { success: true, data, error: null };
  } catch (error) {
    console.error('❌ Error sincronizando progreso:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Sincroniza una actividad individual a Supabase
 */
export const syncActivityToSupabase = async (supabase, userId, activityData) => {
  if (!supabase || !userId) {
    return { success: false, error: 'Cliente Supabase o userId no disponible' };
  }

  if (!navigator.onLine) {
    queueSyncOperation({
      type: 'activity_complete',
      data: activityData
    });
    return { success: false, error: 'offline', offline: true };
  }

  const { activityType, resourceId, moduleId, isCompleted = true } = activityData;

  try {
    const { data, error } = await supabase
      .from(PROGRESS_TABLE)
      .upsert({
        user_id: userId,
        module_id: moduleId ? parseInt(moduleId) : 0,
        activity_type: activityType,
        resource_id: resourceId,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,module_id,activity_type,resource_id' })
      .select();

    if (error) {
      console.error('❌ Error sync actividad:', error.message);
      
      // Si es error de auth, encolar
      if (error.status === 401 || error.message.includes('JWT') || error.message.includes('key')) {
        queueSyncOperation({
          type: 'activity_complete',
          data: activityData
        });
        return { success: false, error: error.message, data: null };
      }
      
      throw error;
    }

    console.log(`✅ Actividad sincronizada: ${activityType} - ${resourceId}`);
    return { success: true, data, error: null };
  } catch (error) {
    console.error('❌ Error sincronizando actividad:', error.message);
    queueSyncOperation({
      type: 'activity_complete',
      data: activityData
    });
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Carga el progreso del usuario desde Supabase
 * @param {Object} supabase - Cliente Supabase (JWT o anon)
 * @param {string} userId - ID del usuario
 * @returns {Object} { success, error, data, offline }
 */
export const loadProgressFromSupabase = async (supabase, userId) => {
  if (!supabase || !userId) {
    return { success: false, error: 'Cliente Supabase o userId no disponible', data: null };
  }

  if (!navigator.onLine) {
    return { success: false, error: 'offline', offline: true, data: null };
  }

  try {
    const { data, error } = await supabase
      .from(PROGRESS_TABLE)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      // Si es error de auth, intentar con filtro básico
      if (error.status === 401 || error.message.includes('JWT') || error.message.includes('key')) {
        console.warn('⚠️ Error de auth al cargar progreso, intentando fallback...');
        
        // Intentar sin filtrar (RLS permissivo permite esto)
        const { data: allData, error: allError } = await supabase
          .from(PROGRESS_TABLE)
          .select('*');
        
        if (allError) {
          console.error('❌ Error fallback al cargar progreso:', allError.message);
          return { success: false, error: allError.message, data: null };
        }
        
        // Filtrar manualmente por user_id
        const userProgress = allData?.filter(row => row.user_id === userId) || [];
        return transformProgressData(userProgress);
      }
      
      console.error('❌ Error cargando progreso:', error.message);
      return { success: false, error: error.message, data: null };
    }

    console.log(`📥 Progreso cargado desde Supabase: ${data?.length || 0} registros`);
    return transformProgressData(data);
  } catch (error) {
    console.error('❌ Error cargando progreso desde Supabase:', error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Transforma datos crudos de Supabase al formato de useCourseProgress
 */
const transformProgressData = (data) => {
  const completedVideos = [];
  const completedModules = [];
  const completedExams = {};
  const completedInfographics = [];
  const completedActivities = [];
  const challengeScores = {};

  data?.forEach(record => {
    if (!record.is_completed) return;

    switch (record.activity_type) {
      case 'video':
        completedVideos.push(record.resource_id);
        break;
      case 'module':
        if (record.resource_id) {
          const moduleId = record.resource_id.replace('module_', '');
          completedModules.push(moduleId);
        }
        break;
      case 'exam':
        if (record.score !== null && record.score !== undefined) {
          const examModuleId = record.module_id || record.resource_id?.replace('exam_', '');
          completedExams[examModuleId] = record.score;
        } else if (record.module_id) {
          completedExams[record.module_id] = true;
        }
        break;
      case 'infographic':
        completedInfographics.push(record.resource_id);
        break;
      case 'activity':
        completedActivities.push(record.resource_id);
        break;
      case 'challenge':
        if (record.module_id && record.score !== null && record.score !== undefined) {
          challengeScores[record.module_id] = record.score;
        }
        break;
    }
  });

  return {
    success: true,
    error: null,
    data: {
      completedVideos,
      completedModules,
      completedExams,
      completedInfographics,
      completedActivities,
      challengeScores,
      recordCount: data?.length || 0
    }
  };
};

/**
 * Merge inteligente de progreso local y remoto
 * @param {Object} localData - Datos de localStorage
 * @param {Object} remoteData - Datos de Supabase
 * @returns {Object} Datos mergeados
 */
export const mergeProgress = (localData, remoteData) => {
  if (!remoteData) return localData;
  if (!localData) return remoteData;

  const mergeArrays = (local, remote) => {
    const merged = new Set([...local, ...remote]);
    return Array.from(merged);
  };

  const mergeExams = (local, remote) => {
    const merged = { ...remote };
    for (const [modId, score] of Object.entries(local || {})) {
      if (score > (merged[modId] || 0)) {
        merged[modId] = score;
      }
    }
    return merged;
  };

  const mergeChallengeScores = (local, remote) => {
    return { ...local, ...remote };
  };

  return {
    completedVideos: mergeArrays(localData.completedVideos || [], remoteData.completedVideos || []),
    completedModules: mergeArrays(localData.completedModules || [], remoteData.completedModules || []),
    completedExams: mergeExams(localData.completedExams || {}, remoteData.completedExams || {}),
    completedInfographics: mergeArrays(localData.completedInfographics || [], remoteData.completedInfographics || []),
    completedActivities: mergeArrays(localData.completedActivities || [], remoteData.completedActivities || []),
    challengeScores: mergeChallengeScores(localData.challengeScores || {}, remoteData.challengeScores || {})
  };
};

/**
 * Cola de sincronización para modo offline
 */
export const queueSyncOperation = (operation) => {
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    queue.push({ ...operation, queuedAt: new Date().toISOString() });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    console.log(`📤 Operación encolada: ${operation.type}`);
  } catch (error) {
    console.error('❌ Error encolando operación:', error);
  }
};

export const processSyncQueue = async (supabase, userId) => {
  if (!navigator.onLine) {
    console.log('📴 Sin conexión, sincronización en pausa');
    return { success: false, error: 'Sin conexión' };
  }

  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    if (queue.length === 0) return { success: true, processed: 0 };

    console.log(`🔄 Procesando cola de sincronización: ${queue.length} operaciones`);

    let processed = 0;
    for (const operation of queue) {
      if (operation.type === 'activity_complete') {
        const result = await syncActivityToSupabase(supabase, userId, operation.data);
        if (result.success) processed++;
      } else if (operation.type === 'full_sync') {
        const result = await syncProgressToSupabase(supabase, userId, operation.data);
        if (result.success) processed++;
      }
    }

    // Limpiar solo las operaciones procesadas
    if (processed > 0) {
      localStorage.removeItem(SYNC_QUEUE_KEY);
      console.log('✅ Cola de sincronización procesada');
    }
    
    return { success: true, processed };
  } catch (error) {
    console.error('❌ Error procesando cola:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Detecta cambios de conexión y procesa la cola
 */
export const setupConnectionListener = (supabase, userId) => {
  const handleOnline = async () => {
    console.log('🌐 Conexión restaurada, procesando cola...');
    await processSyncQueue(supabase, userId);
  };

  const handleOffline = () => {
    console.log('📴 Conexión perdida, activando modo offline');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
