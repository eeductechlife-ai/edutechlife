import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, useAuth } from '@clerk/react';
import { createClerkSupabaseClient } from '../../lib/supabase';

const NOTES_KEY = 'ialab_notes';
const DAY_NOTES_KEY = 'ialab_day_notes';

export const useStudyNotesSync = () => {
  const { session, isLoaded: sessionLoaded } = useSession();
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (!sessionLoaded) return;
      setIsLoading(true);
      try {
        if (session) {
          const token = await getToken({ template: 'supabase' });
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserId(payload.sub);
            setSupabase(createClerkSupabaseClient(token));
          } else {
            setSupabase(createClerkSupabaseClient());
          }
        } else {
          setSupabase(null);
          setUserId(null);
        }
      } catch {
        setSupabase(createClerkSupabaseClient());
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [session, sessionLoaded, getToken]);

  const upsertNote = useCallback(async (noteType, key, content) => {
    if (!supabase || !userId) return;
    try {
      const { error } = await supabase
        .from('study_notes')
        .upsert({
          user_id: userId,
          note_type: noteType,
          key,
          content,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,note_type,key' });
      if (error) throw error;
    } catch (e) {
      console.error('Error syncing note to Supabase:', e);
    }
  }, [supabase, userId]);

  const loadNotesFromSupabase = useCallback(async () => {
    if (!supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('study_notes')
        .select('note_type, key, content')
        .eq('user_id', userId);
      if (error) throw error;
      if (!data || data.length === 0) return null;
      const moduleNotes = {};
      const dayNotes = {};
      data.forEach(row => {
        if (row.note_type === 'module') moduleNotes[row.key] = row.content;
        else if (row.note_type === 'day') dayNotes[row.key] = row.content;
      });
      return { moduleNotes, dayNotes };
    } catch (e) {
      console.error('Error loading notes from Supabase:', e);
      return null;
    }
  }, [supabase, userId]);

  const mergeFromSupabase = useCallback(async () => {
    const remote = await loadNotesFromSupabase();
    if (!remote) return;
    try {
      const currentNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
      const mergedNotes = { ...currentNotes, ...remote.moduleNotes };
      localStorage.setItem(NOTES_KEY, JSON.stringify(mergedNotes));
    } catch (e) { /* ignore */ }
    try {
      const currentDayNotes = JSON.parse(localStorage.getItem(DAY_NOTES_KEY) || '{}');
      const mergedDayNotes = { ...currentDayNotes, ...remote.dayNotes };
      localStorage.setItem(DAY_NOTES_KEY, JSON.stringify(mergedDayNotes));
    } catch (e) { /* ignore */ }
  }, [loadNotesFromSupabase]);

  useEffect(() => {
    if (supabase && userId) {
      mergeFromSupabase();
    }
  }, [supabase, userId, mergeFromSupabase]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const syncModuleNote = useCallback((modId, content) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await upsertNote('module', String(modId), content || '');
      setLastSync(new Date());
    }, 2000);
  }, [upsertNote]);

  const syncDayNote = useCallback((dateKey, content) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await upsertNote('day', dateKey, content || '');
      setLastSync(new Date());
    }, 2000);
  }, [upsertNote]);

  const syncModuleNotes = useCallback(async (notes) => {
    const entries = Object.entries(notes).filter(([, v]) => v?.trim());
    for (const [modId, content] of entries) {
      await upsertNote('module', modId, content);
    }
    setLastSync(new Date());
  }, [upsertNote]);

  const syncDayNotes = useCallback(async (dayNotes) => {
    const entries = Object.entries(dayNotes).filter(([, v]) => v?.trim());
    for (const [dateKey, content] of entries) {
      await upsertNote('day', dateKey, content);
    }
    setLastSync(new Date());
  }, [upsertNote]);

  return {
    syncModuleNote,
    syncDayNote,
    syncModuleNotes,
    syncDayNotes,
    isLoading,
    lastSync,
    isConnected: !!supabase && !!userId,
  };
};

export default useStudyNotesSync;
