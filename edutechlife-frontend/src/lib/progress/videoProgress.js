const getUserId = (userId) => {
  if (userId && typeof userId === "string") {
    return userId;
  }
  console.warn("\u26a0\ufe0f [PROGRESS] Invalid user ID:", userId);
  return null;
};

export const videoProgressFactory = (db) => ({
  saveVideoProgress: async (moduleId, videoId, completed = false, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await db
        .from("user_video_progress")
        .upsert(
          {
            user_id: actualUserId,
            module_id: moduleId,
            video_id: videoId,
            completed,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,module_id,video_id",
            ignoreDuplicates: false,
          },
        )
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error("Error saving video progress:", err);
      return { success: false, error: err.message };
    }
  },

  getVideoProgress: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return [];

      const { data, error } = await db
        .from("user_video_progress")
        .select("*")
        .eq("user_id", actualUserId)
        .eq("module_id", moduleId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error getting video progress:", err);
      return [];
    }
  },

  saveInfographicProgress: async (
    moduleId,
    infographicId,
    completed = false,
    userId,
  ) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await db
        .from("user_infographic_progress")
        .upsert(
          {
            user_id: actualUserId,
            module_id: moduleId,
            infographic_id: infographicId,
            completed,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,module_id,infographic_id",
            ignoreDuplicates: false,
          },
        )
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error("Error saving infographic progress:", err);
      return { success: false, error: err.message };
    }
  },
});
