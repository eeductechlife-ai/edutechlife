export {
  supabase,
  createSupabaseClient,
  initSupabaseClient,
  queueSyncOperation,
  processSyncQueue,
  setupConnectionListener,
  transformProgressData,
  mergeProgress,
  syncProgressToSupabase,
  syncGamificationToSupabase,
  syncActivityToSupabase,
  loadProgressFromSupabase,
} from "./progressSync/index.js";
