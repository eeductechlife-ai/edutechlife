import { TABLE_NAME, PROGRESS_STATUS, SCORING } from "./constants";

const getUserId = (userId) => {
  if (userId && typeof userId === "string") {
    return userId;
  }
  console.warn("\u26a0\ufe0f [PROGRESS] Invalid user ID:", userId);
  return null;
};

const ensureProgressRow = async (db, userId, moduleId) => {
  try {
    const { data: existing, error: fetchError } = await db
      .from(TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .eq("module_id", moduleId)
      .maybeSingle();

    if (fetchError && fetchError.code === "PGRST116") {
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
        .select("*")
        .maybeSingle();

      if (insertError) throw insertError;
      return newRow;
    }

    if (fetchError) throw fetchError;
    return existing;
  } catch (err) {
    console.error("Error ensuring progress row:", err);
    throw err;
  }
};

export const coreFactory = (db) => ({
  getProgress: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return null;

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId)) {
        console.error("moduleId debe ser un n\u00famero:", moduleId);
        return null;
      }

      const { data, error } = await db
        .from(TABLE_NAME)
        .select("*")
        .eq("user_id", actualUserId)
        .eq("module_id", numericModuleId)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") {
          return await ensureProgressRow(db, actualUserId, numericModuleId);
        }
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Error getting progress:", err);
      return null;
    }
  },

  getAllProgress: async (userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        console.warn(
          "\u26a0\ufe0f Usuario no autenticado, retornando progreso vac\u00edo",
        );
        return [];
      }

      const { data, error } = await db
        .from(TABLE_NAME)
        .select("*")
        .eq("user_id", actualUserId)
        .order("module_id", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error getting all progress:", err);
      return [];
    }
  },

  saveProgress: async (moduleId, status, metadata = {}, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        console.warn(
          "\u26a0\ufe0f [RESILIENCE] Usuario no autenticado, guardando progreso localmente",
        );
        return {
          success: false,
          error: "User not authenticated",
          data: null,
          localFallback: true,
        };
      }

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId)) {
        throw new Error("moduleId debe ser un n\u00famero");
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
          onConflict: "user_id,module_id,activity_type,resource_id",
          ignoreDuplicates: false,
        })
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error("Error saving progress:", err);
      return { success: false, error: err.message };
    }
  },

  markModuleStarted: async (moduleId, userId) => {
    const svc = coreFactory(db);
    return svc.saveProgress(moduleId, PROGRESS_STATUS.IN_PROGRESS, {}, userId);
  },

  markModuleCompleted: async (moduleId, score = null, userId) => {
    const svc = coreFactory(db);
    return svc.saveProgress(
      moduleId,
      PROGRESS_STATUS.COMPLETED,
      { score },
      userId,
    );
  },

  resetModuleProgress: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) throw new Error("User not authenticated");

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId))
        throw new Error("moduleId debe ser un n\u00famero");

      const { data, error } = await db
        .from(TABLE_NAME)
        .update({
          is_completed: false,
          score: 0,
          completed_lessons: [],
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", actualUserId)
        .eq("module_id", numericModuleId)
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error("Error resetting module progress:", err);
      return { success: false, error: err.message };
    }
  },

  unlockNextModule: async (currentModuleId, userId) => {
    const nextModuleId = Number(currentModuleId) + 1;
    const svc = coreFactory(db);
    return svc.saveProgress(
      nextModuleId,
      PROGRESS_STATUS.NOT_STARTED,
      {},
      userId,
    );
  },

  getCompletedModules: async (userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return [];

      const { data, error } = await db
        .from(TABLE_NAME)
        .select("module_id, is_completed, module_score")
        .eq("user_id", actualUserId)
        .is("activity_type", null)
        .is("resource_id", null);

      if (error) throw error;

      const completedModuleIds = data
        .filter(
          (p) => p.is_completed || (p.module_score && p.module_score >= 80),
        )
        .map((p) => p.module_id);

      return [...new Set(completedModuleIds)];
    } catch (err) {
      console.error("Error getting completed modules:", err);
      return [];
    }
  },

  getModuleScore: async (moduleId, userId) => {
    try {
      const svc = coreFactory(db);
      const progress = await svc.getProgress(moduleId, userId);
      return progress?.score || null;
    } catch (err) {
      console.error("Error getting module score:", err);
      return null;
    }
  },

  getTotalProgress: async (userId) => {
    try {
      const svc = coreFactory(db);
      const completedModules = await svc.getCompletedModules(userId);
      const totalModules = SCORING.TOTAL_MODULES;
      const progressPerModule = SCORING.PROGRESS_PER_MODULE;

      const completedCount = completedModules.length;
      const progress = completedCount * progressPerModule;

      return {
        progress: Math.min(100, progress),
        completedCount,
        totalModules,
        completedModules,
      };
    } catch (err) {
      console.error("Error calculating total progress:", err);
      return {
        progress: 0,
        completedCount: 0,
        totalModules: 5,
        completedModules: [],
      };
    }
  },

  saveLastLesson: async (moduleId, lessonId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        throw new Error("User not authenticated");
      }

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId))
        throw new Error("moduleId debe ser un n\u00famero");

      await ensureProgressRow(db, actualUserId, numericModuleId);

      const { data, error } = await db
        .from(TABLE_NAME)
        .update({
          last_lesson_id: lessonId,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", actualUserId)
        .eq("module_id", numericModuleId)
        .select("*")
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error("Error saving last lesson:", err);
      return { success: false, error: err.message };
    }
  },

  getLastLesson: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return null;

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId)) {
        console.error("moduleId debe ser un n\u00famero:", moduleId);
        return null;
      }

      const { data, error } = await db
        .from(TABLE_NAME)
        .select("last_lesson_id")
        .eq("user_id", actualUserId)
        .eq("module_id", numericModuleId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          await ensureProgressRow(db, actualUserId, numericModuleId);
          return null;
        }
        throw error;
      }

      return data?.last_lesson_id || null;
    } catch (err) {
      console.error("Error getting last lesson:", err);
      return null;
    }
  },

  getUserLastProgress: async (userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return null;

      const { data, error } = await db
        .from(TABLE_NAME)
        .select("*")
        .eq("user_id", actualUserId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Error getting user last progress:", err);
      return null;
    }
  },
});
