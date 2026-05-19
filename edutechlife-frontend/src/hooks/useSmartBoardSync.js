import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, useAuth } from '@clerk/react';
import { createClerkSupabaseClient } from '../lib/supabase';
import {
  loadFromSupabase,
  saveToSupabase,
  mergeWithLocal,
  setupConnectionListener,
} from '../services/smartboardSync';

export const useSmartBoardSync = () => {
  const { session, isLoaded: sessionLoaded } = useSession();
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastSavedRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const initClient = async () => {
      if (!sessionLoaded) return;

      setIsLoading(true);
      try {
        if (session) {
          const token = await getToken({ template: 'supabase' });
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const uid = payload.sub;
            setUserId(uid);

            try {
              const client = createClerkSupabaseClient(token);
              setSupabase(client);
            } catch {
              const client = createClerkSupabaseClient();
              setSupabase(client);
            }
          } else {
            const client = createClerkSupabaseClient();
            setSupabase(client);
          }
        } else {
          setSupabase(null);
          setUserId(null);
        }
      } catch (err) {
        setError(err.message);
        const client = createClerkSupabaseClient();
        setSupabase(client);
      } finally {
        setIsLoading(false);
      }
    };

    initClient();
  }, [session, sessionLoaded, getToken]);

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
    [supabase, userId]
  );

  useEffect(() => {
    if (!supabase || !userId) return;

    const cleanup = setupConnectionListener(supabase, userId, () => lastSavedRef.current);
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
