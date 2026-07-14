export {
  supabase,
  createClerkSupabaseClient,
  initSupabaseClient,
} from "./supabaseClient.js";
export {
  queueSyncOperation,
  processSyncQueue,
  setupConnectionListener,
} from "./syncQueue.js";
export { transformProgressData, mergeProgress } from "./transformer.js";
export {
  syncProgressToSupabase,
  syncGamificationToSupabase,
  syncActivityToSupabase,
  loadProgressFromSupabase,
} from "./syncActivity.js";
