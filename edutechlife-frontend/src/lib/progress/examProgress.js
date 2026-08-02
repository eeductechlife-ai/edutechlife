import { TABLE_NAME } from "./constants";
import { coreFactory } from "./core";

const getUserId = (userId) => {
  if (userId && typeof userId === "string") {
    return userId;
  }
  console.warn("\u26a0\ufe0f [PROGRESS] Invalid user ID:", userId);
  return null;
};

export const examProgressFactory = (db) => ({
  saveExamResult: async (moduleId, score, maxScore, answers, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) {
        throw new Error("User not authenticated");
      }

      const passed = score >= maxScore * 0.8;

      const { data, error } = await db
        .from("user_exams")
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
        .select("*")
        .single();

      if (error) throw error;

      if (passed) {
        const { markModuleCompleted } = coreFactory(db);
        await markModuleCompleted(moduleId, score, actualUserId);
      }

      return { success: true, data, passed };
    } catch (err) {
      console.error("Error saving exam result:", err);
      return { success: false, error: err.message };
    }
  },

  getExamResults: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return [];

      const { data, error } = await db
        .from("user_exams")
        .select("*")
        .eq("user_id", actualUserId)
        .eq("module_id", moduleId)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error getting exam results:", err);
      return [];
    }
  },

  saveExamProgress: async (moduleId, score, passed, userId) => {
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
            activity_type: "exam",
            resource_id: null,
            score: score,
            is_completed: passed,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,module_id,activity_type,resource_id",
            ignoreDuplicates: false,
          },
        )
        .select("*")
        .maybeSingle();

      if (error) throw error;

      return { success: true, data, passed };
    } catch (err) {
      console.error("Error saving exam progress:", err);
      return { success: false, error: err.message };
    }
  },
});
