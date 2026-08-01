import { TABLE_NAME, countModuleResources } from "./constants";

const getUserId = (userId) => {
  if (userId && typeof userId === "string") {
    return userId;
  }
  console.warn("\u26a0\ufe0f [PROGRESS] Invalid user ID:", userId);
  return null;
};

export const resourcesFactory = (db) => ({
  saveResourceViewed: async (
    moduleId,
    resourceId,
    resourceType,
    totalResources,
    userId,
  ) => {
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
            activity_type: resourceType,
            resource_id: resourceId,
            is_completed: true,
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

      await db.from(TABLE_NAME).upsert(
        {
          user_id: actualUserId,
          module_id: numericModuleId,
          activity_type: null,
          resource_id: null,
          resources_viewed: 0,
          total_resources:
            totalResources || countModuleResources(numericModuleId),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,module_id,activity_type,resource_id",
          ignoreDuplicates: false,
        },
      );

      const { count } = await db
        .from(TABLE_NAME)
        .select("*", { count: "exact", head: true })
        .eq("user_id", actualUserId)
        .eq("module_id", numericModuleId)
        .not("resource_id", "is", null);

      const totalRes = totalResources || countModuleResources(numericModuleId);
      await db
        .from(TABLE_NAME)
        .update({
          resources_viewed: count || 0,
          total_resources: totalRes,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", actualUserId)
        .eq("module_id", numericModuleId)
        .is("resource_id", null)
        .is("activity_type", null);

      return {
        success: true,
        data,
        viewedCount: count,
        totalResources: totalRes,
      };
    } catch (err) {
      console.error("Error saving resource viewed:", err);
      return { success: false, error: err.message };
    }
  },

  getViewedResources: async (moduleId, userId) => {
    try {
      const actualUserId = getUserId(userId);
      if (!actualUserId) return [];

      const { data, error } = await db
        .from(TABLE_NAME)
        .select("resource_id, activity_type, updated_at")
        .eq("user_id", actualUserId)
        .eq("module_id", moduleId)
        .not("resource_id", "is", null);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error getting viewed resources:", err);
      return [];
    }
  },
});
