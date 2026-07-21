import { syncActivityToSupabase, loadProgressFromSupabase } from "../../services/progressSync";

export async function syncActivity(supabase, userId, payload) {
  if (supabase && userId) {
    await syncActivityToSupabase(supabase, userId, payload);
  }
}

export async function loadRemoteProgress(supabase, userId) {
  if (!supabase || !userId || !navigator.onLine) return null;
  const result = await loadProgressFromSupabase(supabase, userId);
  return result.success ? result.data : null;
}
