import { supabase } from './supabase';

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

const getUserId = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
};

export const getProgress = async (moduleId) => {
  try {
    const userId = await getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error getting progress:', err);
    return null;
  }
};

export const getAllProgress = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', user.id)
      .order('module_id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error getting all progress:', err);
    return [];
  }
};

export const saveProgress = async (moduleId, status, metadata = {}) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const progressData = {
      user_id: userId,
      module_id: moduleId,
      status,
      metadata,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(progressData, {
        onConflict: 'user_id,module_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error saving progress:', err);
    return { success: false, error: err.message };
  }
};

export const markModuleStarted = async (moduleId) => {
  return saveProgress(moduleId, PROGRESS_STATUS.IN_PROGRESS);
};

export const markModuleCompleted = async (moduleId, score = null) => {
  return saveProgress(moduleId, PROGRESS_STATUS.COMPLETED, { score });
};

export const resetModuleProgress = async (moduleId) => {
  return saveProgress(moduleId, PROGRESS_STATUS.NOT_STARTED);
};

export const unlockNextModule = async (currentModuleId) => {
  const nextModuleId = currentModuleId + 1;
  return saveProgress(nextModuleId, PROGRESS_STATUS.NOT_STARTED);
};

export const getCompletedModules = async () => {
  try {
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('module_id')
      .eq('user_id', userId)
      .eq('status', PROGRESS_STATUS.COMPLETED);

    if (error) throw error;
    return data.map((item) => item.module_id);
  } catch (err) {
    console.error('Error getting completed modules:', err);
    return [];
  }
};

export const getModuleScore = async (moduleId) => {
  try {
    const progress = await getProgress(moduleId);
    return progress?.metadata?.score || null;
  } catch (err) {
    console.error('Error getting module score:', err);
    return null;
  }
};

export const saveLastLesson = async (moduleId, lessonId) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(
        {
          user_id: userId,
          module_id: moduleId,
          last_lesson_id: lessonId,
          status: PROGRESS_STATUS.IN_PROGRESS,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,module_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error saving last lesson:', err);
    return { success: false, error: err.message };
  }
};

export const getLastLesson = async (moduleId) => {
  try {
    const userId = await getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('last_lesson_id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data?.last_lesson_id || null;
  } catch (err) {
    console.error('Error getting last lesson:', err);
    return null;
  }
};

export const getUserLastProgress = async () => {
  try {
    const userId = await getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
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
};

export const saveVideoProgress = async (moduleId, videoId, completed = false) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tableName = 'user_video_progress';
    
    const { data, error } = await supabase
      .from(tableName)
      .upsert(
        {
          user_id: userId,
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
};

export const getVideoProgress = async (moduleId) => {
  try {
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_video_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error getting video progress:', err);
    return [];
  }
};

export const saveInfographicProgress = async (moduleId, infographicId, completed = false) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_infographic_progress')
      .upsert(
        {
          user_id: userId,
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

export const saveActivitySubmission = async (moduleId, submission) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_activities')
      .insert([
        {
          user_id: userId,
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

export const getActivitySubmission = async (moduleId) => {
  try {
    const userId = await getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
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

export const saveExamResult = async (moduleId, score, maxScore, answers) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const passed = score >= maxScore * 0.7;

    const { data, error } = await supabase
      .from('user_exams')
      .insert([
        {
          user_id: userId,
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
      await markModuleCompleted(moduleId, score);
    }

    return { success: true, data, passed };
  } catch (err) {
    console.error('Error saving exam result:', err);
    return { success: false, error: err.message };
  }
};

export const getExamResults = async (moduleId) => {
  try {
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_exams')
      .select('*')
      .eq('user_id', userId)
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
