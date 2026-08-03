/**
 * Diagnostica y arregla problemas de RLS en Supabase
 * Se ejecuta una sola vez para verificar que las policies están correctamente configuradas
 */

const RLS_FIX_DONE_KEY = "rls_fix_done_v1";

function serializeError(error) {
  if (!error) return "unknown";
  return {
    message: error.message || String(error),
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
  };
}

async function checkAndFixRLS(supabaseClient, userId) {
  if (!supabaseClient || !userId) return;

  // Solo ejecutar el diagnóstico en desarrollo. En producción no tiene sentido
  // insertar/borrar registros de prueba en cada sesión.
  if (!import.meta.env.DEV) {
    return;
  }

  // Ya se ejecutó esta sesión (marcar SIEMPRE, incluso en error, para evitar
  // spam de logs cuando la policy falla).
  try {
    if (sessionStorage.getItem(RLS_FIX_DONE_KEY)) {
      return;
    }
    sessionStorage.setItem(RLS_FIX_DONE_KEY, "true");
  } catch {
    return;
  }

  try {
    const testData = {
      user_id: userId,
      module_id: 999,
      activity_type: "rls_test",
      resource_id: null,
      is_completed: false,
      score: 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseClient
      .from("user_progress")
      .insert([testData])
      .select("*");

    if (error) {
      console.warn("[RLS FIX] Diagnostic write failed:", serializeError(error));
      if (error.status === 403 || error.code === "PGRST120") {
        console.warn(
          "[RLS FIX] RLS is blocking writes. Configure policies in Supabase console for authenticated users on user_progress.",
        );
      }
      return;
    }

    if (data && data.length > 0) {
      console.info("[RLS FIX] ✓ RLS test passed");
      await supabaseClient
        .from("user_progress")
        .delete()
        .eq("module_id", 999)
        .eq("activity_type", "rls_test")
        .eq("user_id", userId);
    }
  } catch (err) {
    console.warn("[RLS FIX] Diagnostic exception:", serializeError(err));
  }
}

export { checkAndFixRLS };
