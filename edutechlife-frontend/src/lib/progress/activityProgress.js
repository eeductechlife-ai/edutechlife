const getUserId = (userId) => {
  if (userId && typeof userId === "string") {
    return userId;
  }
  console.warn("\u26a0\ufe0f [PROGRESS] Invalid user ID:", userId);
  return null;
};

export const activityProgressFactory = (db) => ({
  saveActivitySubmission: async (moduleId, submission, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await db
        .from("user_activities")
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
      console.error("Error saving activity submission:", err);
      return { success: false, error: err.message };
    }
  },

  getActivitySubmission: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return null;

      const { data, error } = await db
        .from("user_activities")
        .select("*")
        .eq("user_id", actualUserId)
        .eq("module_id", moduleId)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return data;
    } catch (err) {
      console.error("Error getting activity submission:", err);
      return null;
    }
  },
});
