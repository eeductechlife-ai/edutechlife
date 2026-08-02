import { queueSyncOperation } from "./syncQueue.js";
import { transformProgressData } from "./transformer.js";

const PROGRESS_TABLE = "user_progress";

export const syncProgressToSupabase = async (
  supabase,
  userId,
  progressData,
) => {
  if (!supabase || !userId) {
    return { success: false, error: "Cliente Supabase o userId no disponible" };
  }

  if (!navigator.onLine) {
    queueSyncOperation({
      type: "full_sync",
      data: progressData,
    });
    return { success: false, error: "offline", offline: true };
  }

  try {
    const {
      completedVideos = [],
      completedModules = [],
      completedExams = {},
      completedInfographics = [],
      completedActivities = [],
      gamification,
    } = progressData;

    const recordsToUpsert = [];

    completedVideos.forEach((videoId) => {
      recordsToUpsert.push({
        user_id: userId,
        activity_type: "video",
        resource_id: videoId,
        is_completed: true,
        updated_at: new Date().toISOString(),
      });
    });

    completedModules.forEach((moduleId) => {
      recordsToUpsert.push({
        user_id: userId,
        module_id: parseInt(moduleId) || 0,
        activity_type: "module",
        resource_id: `module_${moduleId}`,
        is_completed: true,
        updated_at: new Date().toISOString(),
      });
    });

    Object.entries(completedExams).forEach(([moduleId, score]) => {
      const numericScore = typeof score === "number" ? score : score ? 100 : 0;
      if (numericScore > 0) {
        recordsToUpsert.push({
          user_id: userId,
          module_id: parseInt(moduleId) || 0,
          activity_type: "exam",
          resource_id: null,
          is_completed: true,
          score: numericScore,
          updated_at: new Date().toISOString(),
        });
      }
    });

    completedInfographics.forEach((infographicId) => {
      recordsToUpsert.push({
        user_id: userId,
        activity_type: "infographic",
        resource_id: infographicId,
        is_completed: true,
        updated_at: new Date().toISOString(),
      });
    });

    completedActivities.forEach((activityId) => {
      recordsToUpsert.push({
        user_id: userId,
        activity_type: "activity",
        resource_id: activityId,
        is_completed: true,
        updated_at: new Date().toISOString(),
      });
    });

    if (gamification) {
      recordsToUpsert.push({
        user_id: userId,
        module_id: 0,
        activity_type: "gamification",
        resource_id: "state",
        is_completed: true,
        gamification_data: gamification,
        updated_at: new Date().toISOString(),
      });
    }

    if (recordsToUpsert.length === 0) {
      return { success: true, data: [], error: null };
    }

    const seen = new Map();
    for (const record of recordsToUpsert) {
      const key = `${record.user_id}|${record.module_id ?? ""}|${record.activity_type}|${record.resource_id ?? ""}`;
      seen.set(key, record);
    }
    const uniqueRecords = Array.from(seen.values());

    const { data, error } = await supabase
      .from(PROGRESS_TABLE)
      .upsert(uniqueRecords, {
        onConflict: "user_id,module_id,activity_type,resource_id",
      })
      .select("*");

    if (error) {
      console.error(
        "❌ Error upsert en Supabase:",
        error.message,
        error.details,
      );

      if (
        error.status === 401 ||
        error.message.includes("JWT") ||
        error.message.includes("key")
      ) {
        queueSyncOperation({
          type: "full_sync",
          data: progressData,
        });
        return { success: false, error: error.message, data: null };
      }

      throw error;
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("❌ Error sincronizando progreso:", error.message);
    return { success: false, error: error.message, data: null };
  }
};

export const syncGamificationToSupabase = async (
  supabase,
  userId,
  gamificationData,
) => {
  if (!supabase || !userId) {
    return { success: false, error: "Cliente Supabase o userId no disponible" };
  }

  if (!navigator.onLine) {
    queueSyncOperation({
      type: "gamification_sync",
      data: gamificationData,
    });
    return { success: false, error: "offline", offline: true };
  }

  try {
    const { data, error } = await supabase
      .from(PROGRESS_TABLE)
      .upsert(
        {
          user_id: userId,
          module_id: 0,
          activity_type: "gamification",
          resource_id: "state",
          is_completed: true,
          gamification_data: gamificationData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,module_id,activity_type,resource_id" },
      )
      .select("*");

    if (error) {
      console.error("❌ Error sync gamification:", error.message);
      if (
        error.status === 401 ||
        error.message.includes("JWT") ||
        error.message.includes("key")
      ) {
        queueSyncOperation({
          type: "gamification_sync",
          data: gamificationData,
        });
        return { success: false, error: error.message, data: null };
      }
      throw error;
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("❌ Error sincronizando gamificación:", error.message);
    queueSyncOperation({
      type: "gamification_sync",
      data: gamificationData,
    });
    return { success: false, error: error.message, data: null };
  }
};

export const syncActivityToSupabase = async (
  supabase,
  userId,
  activityData,
) => {
  if (!supabase || !userId) {
    return { success: false, error: "Cliente Supabase o userId no disponible" };
  }

  if (!navigator.onLine) {
    queueSyncOperation({
      type: "activity_complete",
      data: activityData,
    });
    return { success: false, error: "offline", offline: true };
  }

  const {
    activityType,
    resourceId,
    moduleId,
    isCompleted = true,
  } = activityData;

  try {
    const { data, error } = await supabase
      .from(PROGRESS_TABLE)
      .upsert(
        {
          user_id: userId,
          module_id: moduleId ? parseInt(moduleId) : 0,
          activity_type: activityType,
          resource_id: resourceId,
          is_completed: isCompleted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,module_id,activity_type,resource_id" },
      )
      .select("*");

    if (error) {
      console.error("❌ Error sync actividad:", error.message);

      if (
        error.status === 401 ||
        error.message.includes("JWT") ||
        error.message.includes("key")
      ) {
        queueSyncOperation({
          type: "activity_complete",
          data: activityData,
        });
        return { success: false, error: error.message, data: null };
      }

      throw error;
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("❌ Error sincronizando actividad:", error.message);
    queueSyncOperation({
      type: "activity_complete",
      data: activityData,
    });
    return { success: false, error: error.message, data: null };
  }
};

export const loadProgressFromSupabase = async (supabase, userId) => {
  if (!supabase || !userId) {
    return {
      success: false,
      error: "Cliente Supabase o userId no disponible",
      data: null,
    };
  }

  if (!navigator.onLine) {
    return { success: false, error: "offline", offline: true, data: null };
  }

  try {
    const { data, error } = await supabase
      .from(PROGRESS_TABLE)
      .select("*")
      .eq("user_id", userId);

    if (error) {
      if (
        error.status === 401 ||
        error.message.includes("JWT") ||
        error.message.includes("key")
      ) {
        console.warn(
          "⚠️ Error de auth al cargar progreso, intentando fallback...",
        );

        const { data: allData, error: allError } = await supabase
          .from(PROGRESS_TABLE)
          .select("*");

        if (allError) {
          console.error(
            "❌ Error fallback al cargar progreso:",
            allError.message,
          );
          return { success: false, error: allError.message, data: null };
        }

        const userProgress =
          allData?.filter((row) => row.user_id === userId) || [];
        return transformProgressData(userProgress);
      }

      console.error("❌ Error cargando progreso:", error.message);
      return { success: false, error: error.message, data: null };
    }

    return transformProgressData(data);
  } catch (error) {
    console.error("❌ Error cargando progreso desde Supabase:", error.message);
    return { success: false, error: error.message, data: null };
  }
};
