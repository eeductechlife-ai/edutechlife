import { createSupabaseClient } from "../../../lib/supabase";
import { readAuthIdentity } from "../../../hooks/useAuthIdentity";
import { retryAsync } from "../../../utils/retryAsync";

// Cliente Supabase AUTENTICADO con el token de la sesión (antes se usaba
// `window.Clerk`, que ya no existe → quedaba anónimo y RLS bloqueaba el guardado
// de la nota del desafío).
export async function getAuthDb() {
  try {
    const { token } = readAuthIdentity();
    if (token) return createSupabaseClient(token);
  } catch {
    /* fallback anónimo */
  }
  return createSupabaseClient();
}

export async function saveGradeToSupabase({
  user,
  moduleId,
  getAuthDb,
  evaluation,
  activityType = "challenge",
}) {
  // `user` puede ser null (hook basado en Clerk); se usa la identidad real de
  // la sesión Supabase como respaldo.
  const userId = user?.id || readAuthIdentity().userId;
  if (!userId) {
    return { success: false, error: "Usuario no autenticado" };
  }

  try {
    const numericModuleId = Number(moduleId) || 1;
    const db = await getAuthDb();
    const { data, error } = await retryAsync(() =>
      db
        .from("user_progress")
        .upsert(
          {
            user_id: userId,
            module_id: numericModuleId,
            activity_type: activityType,
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
        .maybeSingle(),
    );

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error guardando nota en Supabase:", error);
    return { success: false, error: error.message };
  }
}
