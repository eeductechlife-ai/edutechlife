import { useState, useEffect, useCallback, useRef } from "react";
import { useSupabase } from "./useSupabase";
import {
  loadFromSupabase,
  saveToSupabase,
  mergeWithLocal,
  setupConnectionListener,
} from "../services/smartboardSync";

export const useSmartBoardSync = () => {
  // Cliente y userId desde la sesion de Supabase (antes token de Clerk).
  const { supabase, userId, isLoading } = useSupabase();
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const lastSavedRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const loadData = useCallback(async () => {
    if (!supabase || !userId) return null;

    const result = await loadFromSupabase(supabase, userId);
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  }, [supabase, userId]);

  const saveData = useCallback(
    async (kidsData) => {
      if (!supabase || !userId) return { success: false };

      lastSavedRef.current = kidsData;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      return new Promise((resolve) => {
        saveTimeoutRef.current = setTimeout(async () => {
          const result = await saveToSupabase(supabase, userId, kidsData);
          resolve(result);
        }, 500);
      });
    },
    [supabase, userId],
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!supabase || !userId) return;

    const cleanup = setupConnectionListener(
      supabase,
      userId,
      () => lastSavedRef.current,
    );
    return cleanup;
  }, [supabase, userId]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    loadData,
    saveData,
    mergeWithLocal,
    userId,
    // sessionLoaded era el flag asincrono de Clerk; useSupabase ya resuelve la
    // sesion y expone isLoading.
    isLoading,
    error,
    isConnected: isOnline && !!supabase,
  };
};

export default useSmartBoardSync;
