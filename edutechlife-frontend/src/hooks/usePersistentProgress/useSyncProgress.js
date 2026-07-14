import { useCallback, useRef, useEffect } from "react";
import {
  syncProgressToSupabase,
  syncGamificationToSupabase,
} from "../../services/progressSync";

const useSyncProgress = (userId, supabase, setSyncStatus, setGamification) => {
  const syncTimeoutRef = useRef(null);

  const syncToSupabase = useCallback(
    async (data, immediate = false) => {
      if (!userId || !supabase) return;

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      const doSync = async () => {
        setSyncStatus("syncing");
        const result = await syncProgressToSupabase(supabase, userId, data);

        if (result.success) {
          setSyncStatus("synced");
        } else if (result.offline) {
          setSyncStatus("offline");
        } else {
          setSyncStatus("error");
          console.warn(
            "⚠️ Error de sync, pero datos guardados en localStorage",
          );
        }
      };

      if (immediate) {
        await doSync();
      } else {
        syncTimeoutRef.current = setTimeout(doSync, 500);
      }
    },
    [userId, supabase, setSyncStatus],
  );

  const syncGamification = useCallback(
    async (gamificationData) => {
      if (!userId || !supabase) return;
      const result = await syncGamificationToSupabase(
        supabase,
        userId,
        gamificationData,
      );
      if (result.success) {
        setGamification(gamificationData);
      }
    },
    [userId, supabase, setGamification],
  );

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return { syncToSupabase, syncGamification };
};

export default useSyncProgress;
