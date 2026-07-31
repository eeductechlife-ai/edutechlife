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
    isLoading: isLoading || !sessionLoaded,
    error,
    isConnected: !!supabase && !!userId,
  };
};

export default useSmartBoardSync;
