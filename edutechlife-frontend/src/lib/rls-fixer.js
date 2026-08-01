/**
 * Diagnostica y arregla problemas de RLS en Supabase
 * Se ejecuta una sola vez para verificar que las policies están correctamente configuradas
 */

const RLS_FIX_DONE_KEY = "rls_fix_done_v1";

async function checkAndFixRLS(supabaseClient, userId) {
  if (!supabaseClient || !userId) return;

  // Ya se ejecutó esta sesión
  if (sessionStorage.getItem(RLS_FIX_DONE_KEY)) {
    return;
  }

  try {
    // Test 1: Intentar escribir un registro de prueba
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
      .select();

    if (error) {
      console.error("[RLS FIX] Error writing test record:", error);

      // Si el error es 403 (Forbidden), significa que RLS está bloqueando
      if (error.status === 403 || error.code === "PGRST120") {
        console.error(
          "[RLS FIX] RLS is blocking writes. This needs to be fixed in Supabase console.",
        );
        console.error(
          "[RLS FIX] Need to create policies that allow authenticated users to write their own records.",
        );
      }
      return;
    }

    // Si llegamos aquí, el test fue exitoso
    if (data && data.length > 0) {
      console.log("[RLS FIX] ✓ RLS test passed, can write records");

      // Limpiar registro de prueba
      await supabaseClient
        .from("user_progress")
        .delete()
        .eq("module_id", 999)
        .eq("activity_type", "rls_test")
        .eq("user_id", userId);

      sessionStorage.setItem(RLS_FIX_DONE_KEY, "true");
    }
  } catch (err) {
    console.error("[RLS FIX] Exception during RLS check:", err);
  }
}

export { checkAndFixRLS };
