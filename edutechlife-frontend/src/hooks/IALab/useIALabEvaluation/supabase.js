import { createClerkSupabaseClient } from "../../../lib/supabase";

export async function getAuthDb() {
  if (typeof window !== "undefined" && window.Clerk?.session) {
    try {
      const token = await window.Clerk.session.getToken({
        template: "supabase",
      });
      if (token) return createClerkSupabaseClient(token);
    } catch (e) {}
  }
  return createClerkSupabaseClient();
}

export async function saveGradeToSupabase({
  user,
  moduleId,
  getAuthDb,
  evaluation,
}) {
  if (!user?.id) {
    return { success: false, error: "Usuario no autenticado" };
  }

  try {
    const numericModuleId = Number(moduleId) || 1;
    const db = await getAuthDb();
    const { data, error } = await db
      .from("user_progress")
      .upsert(
        {
          user_id: user.id,
          module_id: numericModuleId,
          activity_type: "challenge",
          resource_id: null,
          score: Math.round(Number(evaluation.notaGlobal)),
          completed_lessons: evaluation,
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
    return { success: true, data };
  } catch (error) {
    console.error("Error guardando nota en Supabase:", error);
    return { success: false, error: error.message };
  }
}
