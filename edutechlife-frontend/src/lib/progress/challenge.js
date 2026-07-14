import { TABLE_NAME } from "./constants";

const getUserId = (userId) => {
  if (userId && typeof userId === "string") {
    return userId;
  }
  console.warn("\u26a0\ufe0f [PROGRESS] Invalid user ID:", userId);
  return null;
};

export const challengeFactory = (db) => ({
  saveChallengeProgress: async (moduleId, score, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        return { success: false, error: "User not authenticated" };
      }

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId)) {
        throw new Error("moduleId debe ser un n\u00famero");
      }

      const { data, error } = await db
        .from(TABLE_NAME)
        .upsert(
          {
            user_id: actualUserId,
            module_id: numericModuleId,
            activity_type: "challenge",
            resource_id: null,
            score: score,
            is_completed: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,module_id,activity_type,resource_id",
            ignoreDuplicates: false,
          },
        )
        .select()
        .maybeSingle();

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      console.error("Error saving challenge progress:", err);
      return { success: false, error: err.message };
    }
  },

  saveCommunityProgress: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        return { success: false, error: "User not authenticated" };
      }

      const numericModuleId = Number(moduleId);
      if (isNaN(numericModuleId)) {
        throw new Error("moduleId debe ser un n\u00famero");
      }

      const { data, error } = await db
        .from(TABLE_NAME)
        .upsert(
          {
            user_id: actualUserId,
            module_id: numericModuleId,
            activity_type: "community_comment",
            resource_id: null,
            community_comment: true,
            is_completed: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,module_id,activity_type,resource_id",
            ignoreDuplicates: false,
          },
        )
        .select()
        .maybeSingle();

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      console.error("Error saving community progress:", err);
      return { success: false, error: err.message };
    }
  },
});
