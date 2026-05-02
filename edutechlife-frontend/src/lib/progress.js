import { supabase as fallbackSupabase } from './supabase';

const TABLE_NAME = 'user_progress';

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

const getUserId = (userId) => {
  if (userId && typeof userId === 'string') {
    return userId;
  }
  console.warn('⚠️ [PROGRESS] Invalid user ID:', userId);
  return null;
};

const ensureProgressRow = async (db, userId, moduleId) => {
  try {
    const { data: existing, error: fetchError } = await db
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();

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

      const { data: newRow, error: insertError } = await db
        .from(TABLE_NAME)
        .insert(defaultData)
        .select()
        .maybeSingle();

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

/**
 * Factory: crea un servicio de progreso vinculado a un cliente Supabase específico
 * @param {Object} db - Cliente Supabase (con JWT de Clerk)
 * @returns {Object} Servicio de progreso
 */
export const createProgressService = (db) => {
  if (!db) {
    console.error('[PROGRESS] No se proporcionó cliente Supabase');
    throw new Error('Supabase client is required');
  }

  return {
    getProgress: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return null;

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          console.error('moduleId debe ser un número:', moduleId);
          return null;
        }

        const { data, error } = await db
          .from(TABLE_NAME)
          .select('*')
          .eq('user_id', actualUserId)
          .eq('module_id', numericModuleId)
          .maybeSingle();

        if (error) {
          if (error.code === 'PGRST116') {
            return await ensureProgressRow(db, actualUserId, numericModuleId);
          }
          throw error;
        }

        return data;
      } catch (err) {
        console.error('Error getting progress:', err);
        return null;
      }
    },

    getAllProgress: async (userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          console.warn('⚠️ Usuario no autenticado, retornando progreso vacío');
          return [];
        }

        const { data, error } = await db
          .from(TABLE_NAME)
          .select('*')
          .eq('user_id', actualUserId)
          .order('module_id', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error getting all progress:', err);
        return [];
      }
    },

    saveProgress: async (moduleId, status, metadata = {}, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          console.warn('⚠️ [RESILIENCE] Usuario no autenticado, guardando progreso localmente');
          return { 
            success: false, 
            error: 'User not authenticated', 
            data: null,
            localFallback: true
          };
        }

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          throw new Error('moduleId debe ser un número');
        }

        const is_completed = status === PROGRESS_STATUS.COMPLETED;
        const score = metadata?.score || metadata?.evaluationScore || 0;

        const progressData = {
          user_id: actualUserId,
          module_id: numericModuleId,
          activity_type: null,
          resource_id: null,
          is_completed,
          score,
          completed_lessons: metadata || {},
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await db
          .from(TABLE_NAME)
          .upsert(progressData, {
            onConflict: 'user_id,module_id,activity_type,resource_id',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.error('Error saving progress:', err);
        return { success: false, error: err.message };
      }
    },

    markModuleStarted: async (moduleId, userId) => {
      return createProgressService(db).saveProgress(moduleId, PROGRESS_STATUS.IN_PROGRESS, {}, userId);
    },

    markModuleCompleted: async (moduleId, score = null, userId) => {
      return createProgressService(db).saveProgress(moduleId, PROGRESS_STATUS.COMPLETED, { score }, userId);
    },

    resetModuleProgress: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) throw new Error('User not authenticated');

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) throw new Error('moduleId debe ser un número');

        const { data, error } = await db
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
          .maybeSingle();

        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.error('Error resetting module progress:', err);
        return { success: false, error: err.message };
      }
    },

    unlockNextModule: async (currentModuleId, userId) => {
      const nextModuleId = Number(currentModuleId) + 1;
      return createProgressService(db).saveProgress(nextModuleId, PROGRESS_STATUS.NOT_STARTED, {}, userId);
    },

    getCompletedModules: async (userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return [];

        const { data, error } = await db
          .from(TABLE_NAME)
          .select('module_id, is_completed, module_score')
          .eq('user_id', actualUserId)
          .is('activity_type', null)
          .is('resource_id', null);

        if (error) throw error;
        
        const completedModuleIds = data
          .filter(p => p.is_completed || (p.module_score && p.module_score >= 80))
          .map(p => p.module_id);
        
        return [...new Set(completedModuleIds)];
      } catch (err) {
        console.error('Error getting completed modules:', err);
        return [];
      }
    },

    getModuleScore: async (moduleId, userId) => {
      try {
        const progress = await createProgressService(db).getProgress(moduleId, userId);
        return progress?.score || null;
      } catch (err) {
        console.error('Error getting module score:', err);
        return null;
      }
    },

    getTotalProgress: async (userId) => {
      try {
        const completedModules = await createProgressService(db).getCompletedModules(userId);
        const totalModules = 5;
        const progressPerModule = 20;
        
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
    },

    saveLastLesson: async (moduleId, lessonId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          throw new Error('User not authenticated');
        }

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) throw new Error('moduleId debe ser un número');

        await ensureProgressRow(db, actualUserId, numericModuleId);

        const { data, error } = await db
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
    },

    getLastLesson: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return null;

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          console.error('moduleId debe ser un número:', moduleId);
          return null;
        }

        const { data, error } = await db
          .from(TABLE_NAME)
          .select('last_lesson_id')
          .eq('user_id', actualUserId)
          .eq('module_id', numericModuleId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            await ensureProgressRow(db, actualUserId, numericModuleId);
            return null;
          }
          throw error;
        }

        return data?.last_lesson_id || null;
      } catch (err) {
        console.error('Error getting last lesson:', err);
        return null;
      }
    },

    getUserLastProgress: async (userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return null;

        const { data, error } = await db
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
      } catch (err) {
        console.error('Error getting user last progress:', err);
        return null;
      }
    },

    saveVideoProgress: async (moduleId, videoId, completed = false, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await db
          .from('user_video_progress')
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
      } catch (err) {
        console.error('Error saving video progress:', err);
        return { success: false, error: err.message };
      }
    },

    getVideoProgress: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return [];

        const { data, error } = await db
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
    },

    saveInfographicProgress: async (moduleId, infographicId, completed = false, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await db
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
    },

    saveActivitySubmission: async (moduleId, submission, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await db
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
    },

    getActivitySubmission: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return null;

        const { data, error } = await db
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
    },

    saveExamResult: async (moduleId, score, maxScore, answers, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          throw new Error('User not authenticated');
        }

        const passed = score >= maxScore * 0.7;

        const { data, error } = await db
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
          await createProgressService(db).markModuleCompleted(moduleId, score, actualUserId);
        }

        return { success: true, data, passed };
      } catch (err) {
        console.error('Error saving exam result:', err);
        return { success: false, error: err.message };
      }
    },

    getExamResults: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return [];

        const { data, error } = await db
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
    },

    countModuleResources: _countModuleResources,

    saveResourceViewed: async (moduleId, resourceId, resourceType, totalResources, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          return { success: false, error: 'User not authenticated' };
        }

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          throw new Error('moduleId debe ser un número');
        }

        const { data, error } = await db
          .from(TABLE_NAME)
          .upsert({
            user_id: actualUserId,
            module_id: numericModuleId,
            activity_type: resourceType,
            resource_id: resourceId,
            is_completed: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,module_id,activity_type,resource_id',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (error) throw error;

        await db
          .from(TABLE_NAME)
          .upsert({
            user_id: actualUserId,
            module_id: numericModuleId,
            activity_type: null,
            resource_id: null,
            resources_viewed: 0,
            total_resources: totalResources || _countModuleResources(numericModuleId),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,module_id,activity_type,resource_id',
            ignoreDuplicates: false,
          });

        const { count } = await db
          .from(TABLE_NAME)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', actualUserId)
          .eq('module_id', numericModuleId)
          .not('resource_id', 'is', null);

        const totalRes = totalResources || _countModuleResources(numericModuleId);
        await db
          .from(TABLE_NAME)
          .update({
            resources_viewed: count || 0,
            total_resources: totalRes,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', actualUserId)
          .eq('module_id', numericModuleId)
          .is('resource_id', null)
          .is('activity_type', null);

        console.log(`[Progreso] Recurso visto: ${resourceId} en módulo ${moduleId} (${count}/${totalRes})`);
        return { success: true, data, viewedCount: count, totalResources: totalRes };
      } catch (err) {
        console.error('Error saving resource viewed:', err);
        return { success: false, error: err.message };
      }
    },

    saveExamProgress: async (moduleId, score, passed, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          return { success: false, error: 'User not authenticated' };
        }

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          throw new Error('moduleId debe ser un número');
        }

        const { data, error } = await db
          .from(TABLE_NAME)
          .upsert({
            user_id: actualUserId,
            module_id: numericModuleId,
            activity_type: 'exam',
            resource_id: null,
            score: score,
            is_completed: passed,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,module_id,activity_type,resource_id',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (error) throw error;

        console.log(`[Progreso] Examen módulo ${moduleId}: ${score}% ${passed ? '(Aprobado)' : '(Reprobado)'}`);
        return { success: true, data, passed };
      } catch (err) {
        console.error('Error saving exam progress:', err);
        return { success: false, error: err.message };
      }
    },

    saveChallengeProgress: async (moduleId, score, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          return { success: false, error: 'User not authenticated' };
        }

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          throw new Error('moduleId debe ser un número');
        }

        const { data, error } = await db
          .from(TABLE_NAME)
          .upsert({
            user_id: actualUserId,
            module_id: numericModuleId,
            activity_type: 'challenge',
            resource_id: null,
            score: score,
            is_completed: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,module_id,activity_type,resource_id',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        console.log(`[Progreso] Desafío módulo ${moduleId}: ${score}%`);
        return { success: true, data };
      } catch (err) {
        console.error('Error saving challenge progress:', err);
        return { success: false, error: err.message };
      }
    },

    saveCommunityProgress: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) {
          return { success: false, error: 'User not authenticated' };
        }

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          throw new Error('moduleId debe ser un número');
        }

        const { data, error } = await db
          .from(TABLE_NAME)
          .upsert({
            user_id: actualUserId,
            module_id: numericModuleId,
            activity_type: 'community_comment',
            resource_id: null,
            community_comment: true,
            is_completed: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,module_id,activity_type,resource_id',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        console.log(`[Progreso] Comunidad módulo ${moduleId}: comentario registrado`);
        return { success: true, data };
      } catch (err) {
        console.error('Error saving community progress:', err);
        return { success: false, error: err.message };
      }
    },

    getModuleBreakdown: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return null;

        const numericModuleId = Number(moduleId);
        if (isNaN(numericModuleId)) {
          console.error('[PROGRESS] moduleId inválido:', moduleId);
          return null;
        }

        const { data: progressData, error } = await db
          .from(TABLE_NAME)
          .select('*')
          .eq('user_id', actualUserId)
          .eq('module_id', numericModuleId);

        if (error) throw error;

        const summary = progressData?.find(p => p.activity_type === null && p.resource_id === null) || {};
        const resourcesViewed = summary.resources_viewed || 0;
        const totalResources = summary.total_resources || _countModuleResources(numericModuleId);

        const examProgress = progressData?.find(p => p.activity_type === 'exam');
        const challengeProgress = progressData?.find(p => p.activity_type === 'challenge');
        const communityProgress = progressData?.find(p => p.activity_type === 'community_comment');

        const examPassed = examProgress?.is_completed || false;
        const examScore = examProgress?.score || 0;
        const challengeScore = challengeProgress?.score || 0;

        const resourcesPct = totalResources > 0 ? Math.round((resourcesViewed / totalResources) * 30 * 10) / 10 : 0;
        const earned = (examPassed ? 35 : 0) + 
                       Math.round((challengeScore / 100) * 30 * 10) / 10 + 
                       resourcesPct + 
                       (communityProgress?.community_comment ? 5 : 0);

        console.log(`[PROGRESS] Módulo ${moduleId}: exam=${examPassed?35:0}, challenge=${challengeScore}, resources=${resourcesViewed}/${totalResources}=${resourcesPct}, community=${communityProgress?.community_comment?5:0}, total=${Math.min(100, Math.round(earned))}`);

        return {
          moduleId: numericModuleId,
          exam: { passed: examPassed, score: examScore, weight: 35, earned: examPassed ? 35 : 0 },
          challenge: { score: challengeScore, weight: 30, earned: Math.round((challengeScore / 100) * 30 * 10) / 10 },
          resources: { viewed: resourcesViewed, total: totalResources, weight: 30, earned: resourcesPct },
          community: { commented: !!communityProgress?.community_comment, weight: 5, earned: communityProgress?.community_comment ? 5 : 0 },
          moduleScore: Math.min(100, Math.round(earned)),
          moduleProgressPct: Math.min(20, Math.round((earned / 100) * 20 * 10) / 10)
        };
      } catch (err) {
        console.error('Error getting module breakdown:', err);
        return null;
      }
    },

    calculateGlobalProgressFromDB: async (userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return 0;

        let totalProgress = 0;
        const moduleResults = [];
        for (let mod = 1; mod <= 5; mod++) {
          const breakdown = await createProgressService(db).getModuleBreakdown(mod, actualUserId);
          if (breakdown) {
            totalProgress += breakdown.moduleProgressPct || 0;
            moduleResults.push(`M${mod}=${breakdown.moduleProgressPct}%`);
          }
        }

        const result = Math.min(100, Math.round(totalProgress));
        console.log(`[PROGRESS] Global: ${result}% (${moduleResults.join(', ')})`);
        return result;
      } catch (err) {
        const msg = err?.message || err?.toString() || 'Unknown error';
        console.error('Error calculating global progress:', msg);
        return 0;
      }
    },

    getViewedResources: async (moduleId, userId) => {
      try {
        const actualUserId = getUserId(userId);
        if (!actualUserId) return [];

        const { data, error } = await db
          .from(TABLE_NAME)
          .select('resource_id, activity_type, updated_at')
          .eq('user_id', actualUserId)
          .eq('module_id', moduleId)
          .not('resource_id', 'is', null);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error getting viewed resources:', err);
        return [];
      }
    },
  };
};

// ============================================================
// BACKWARD COMPATIBILITY: Exportar funciones que usan el cliente
// desde useIALabProgress (inyectado dinámicamente)
// ============================================================

let _supabaseClient = null;

export const setSupabaseClient = (client) => {
  _supabaseClient = client;
};

const getService = () => {
  const db = _supabaseClient || fallbackSupabase;
  return createProgressService(db);
};

export const getProgress = (...args) => getService().getProgress(...args);
export const getAllProgress = (...args) => getService().getAllProgress(...args);
export const saveProgress = (...args) => getService().saveProgress(...args);
export const markModuleStarted = (...args) => getService().markModuleStarted(...args);
export const markModuleCompleted = (...args) => getService().markModuleCompleted(...args);
export const resetModuleProgress = (...args) => getService().resetModuleProgress(...args);
export const unlockNextModule = (...args) => getService().unlockNextModule(...args);
export const getCompletedModules = (...args) => getService().getCompletedModules(...args);
export const getModuleScore = (...args) => getService().getModuleScore(...args);
export const getTotalProgress = (...args) => getService().getTotalProgress(...args);
export const saveVideoProgress = (...args) => getService().saveVideoProgress(...args);
export const getVideoProgress = (...args) => getService().getVideoProgress(...args);
export const saveInfographicProgress = (...args) => getService().saveInfographicProgress(...args);
export const saveActivitySubmission = (...args) => getService().saveActivitySubmission(...args);
export const getActivitySubmission = (...args) => getService().getActivitySubmission(...args);
export const saveExamResult = (...args) => getService().saveExamResult(...args);
export const getExamResults = (...args) => getService().getExamResults(...args);
export const saveLastLesson = (...args) => getService().saveLastLesson(...args);
export const getLastLesson = (...args) => getService().getLastLesson(...args);
export const getUserLastProgress = (...args) => getService().getUserLastProgress(...args);
export const saveResourceViewed = (...args) => getService().saveResourceViewed(...args);
export const saveExamProgress = (...args) => getService().saveExamProgress(...args);
export const saveChallengeProgress = (...args) => getService().saveChallengeProgress(...args);
export const saveCommunityProgress = (...args) => getService().saveCommunityProgress(...args);
export const getModuleBreakdown = (...args) => getService().getModuleBreakdown(...args);
export const calculateGlobalProgressFromDB = (...args) => getService().calculateGlobalProgressFromDB(...args);
export const getViewedResources = (...args) => getService().getViewedResources(...args);

// countModuleResources no necesita db, se puede llamar directamente
const _countModuleResources = (moduleId) => {
  const resourceCounts = { 1: 8, 2: 12, 3: 10, 4: 8, 5: 14 };
  return resourceCounts[moduleId] || 8;
};
export { _countModuleResources as countModuleResources };

export default {
  PROGRESS_STATUS,
  MODULE_TYPES,
  setSupabaseClient,
  createProgressService,
  getProgress,
  getAllProgress,
  saveProgress,
  markModuleStarted,
  markModuleCompleted,
  resetModuleProgress,
  unlockNextModule,
  getCompletedModules,
  getModuleScore,
  getTotalProgress,
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
  saveResourceViewed,
  saveExamProgress,
  saveChallengeProgress,
  saveCommunityProgress,
  getModuleBreakdown,
  calculateGlobalProgressFromDB,
  getViewedResources,
  countModuleResources: _countModuleResources,
};
