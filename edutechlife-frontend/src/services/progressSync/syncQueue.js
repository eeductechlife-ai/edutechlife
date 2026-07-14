const SYNC_QUEUE_KEY = "ialab_sync_queue";

export const queueSyncOperation = (operation) => {
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || "[]");
    queue.push({ ...operation, queuedAt: new Date().toISOString() });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("❌ Error encolando operación:", error);
  }
};

import {
  syncActivityToSupabase,
  syncProgressToSupabase,
  syncGamificationToSupabase,
} from "./syncActivity.js";

export const processSyncQueue = async (supabase, userId) => {
  if (!navigator.onLine) {
    return { success: false, error: "Sin conexión" };
  }

  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || "[]");
    if (queue.length === 0) return { success: true, processed: 0 };

    let processed = 0;
    for (const operation of queue) {
      if (operation.type === "activity_complete") {
        const result = await syncActivityToSupabase(
          supabase,
          userId,
          operation.data,
        );
        if (result.success) processed++;
      } else if (operation.type === "full_sync") {
        const result = await syncProgressToSupabase(
          supabase,
          userId,
          operation.data,
        );
        if (result.success) processed++;
      } else if (operation.type === "gamification_sync") {
        const result = await syncGamificationToSupabase(
          supabase,
          userId,
          operation.data,
        );
        if (result.success) processed++;
      }
    }

    if (processed > 0) {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    }

    return { success: true, processed };
  } catch (error) {
    console.error("❌ Error procesando cola:", error);
    return { success: false, error: error.message };
  }
};

export const setupConnectionListener = (supabase, userId) => {
  const handleOnline = async () => {
    await processSyncQueue(supabase, userId);
  };

  const handleOffline = () => {};

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};
