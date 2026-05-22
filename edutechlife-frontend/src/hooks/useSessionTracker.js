import { useEffect, useRef } from 'react';
import { useUser, useSession } from '@clerk/react';
import { createClerkSupabaseClient } from '../lib/supabase';
import { useIALabStore } from '../store/ialabStore';

const SESSION_LOG_KEY = 'ialab_session_log';
const MIN_SESSION_SECONDS = 30;

export const useSessionTracker = () => {
  const { user } = useUser();
  const { session } = useSession();
  const sessionStartRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    sessionStartRef.current = Date.now();

    const endSession = async () => {
      const start = sessionStartRef.current;
      if (!start) return;
      const duration = Math.round((Date.now() - start) / 1000);
      if (duration < MIN_SESSION_SECONDS) return;

      const activity = {
        user_id: user.id,
        module_id: 0,
        activity_type: 'session',
        resource_id: `session_${Date.now()}`,
        title: 'Sesión de estudio',
        score: null,
        duration_seconds: duration,
        completed_at: new Date().toISOString(),
      };

      try {
        const token = session ? await session.getToken({ template: 'supabase' }) : null;
        const client = createClerkSupabaseClient(token);
        const { error } = await client.from('activity_log').insert(activity).select().single();
        if (error) throw error;
      } catch {
        // Fallback: error is logged, session saved locally below
      }

      // Siempre guardar en localStorage para que getSessionStats() funcione
      const local = JSON.parse(localStorage.getItem(SESSION_LOG_KEY) || '[]');
      local.push(activity);
      localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(local.slice(-200)));

      // Actualizar lastActivityDate y streak en cada sesión
      useIALabStore.getState().recordActivity();
    };

    window.addEventListener('beforeunload', endSession);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        endSession();
      }
    });

    return () => {
      endSession();
      window.removeEventListener('beforeunload', endSession);
      document.removeEventListener('visibilitychange', endSession);
    };
  }, [user?.id, session]);
};

export const getSessionStats = (sessions) => {
  try {
    const list = sessions || JSON.parse(localStorage.getItem(SESSION_LOG_KEY) || '[]');
    const today = new Date().toDateString();
    const todaySessions = list.filter(s => new Date(s.completed_at).toDateString() === today);
    const todayMinutes = todaySessions.reduce((sum, s) => sum + Math.min(s.duration_seconds || 0, 21600), 0) / 60;
    const allMinutes = list.reduce((sum, s) => sum + Math.min(s.duration_seconds || 0, 21600), 0) / 60;
    const daysActive = new Set(list.map(s => new Date(s.completed_at).toDateString())).size;
    return { todayMinutes, allMinutes, sessionCount: list.length, daysActive };
  } catch {
    return { todayMinutes: 0, allMinutes: 0, sessionCount: 0, daysActive: 0 };
  }
};

export const loadSessionsFromSupabase = async (supabase, userId) => {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_type', 'session')
      .order('completed_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
};

export const mergeSessions = (localSessions, remoteSessions) => {
  const seen = new Set();
  const result = [];
  const add = (s) => {
    const key = s.resource_id || `session_${s.completed_at}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push(s);
  };
  const normalizedRemote = (remoteSessions || []).map(s => ({
    user_id: s.user_id,
    module_id: s.module_id || 0,
    activity_type: 'session',
    resource_id: s.resource_id || `session_${s.completed_at}`,
    title: s.title || 'Sesión de estudio',
    score: null,
    duration_seconds: s.duration_seconds || 0,
    completed_at: s.completed_at,
  }));
  normalizedRemote.forEach(add);
  (localSessions || []).forEach(add);
  return result;
};

export const getUnifiedSessionStats = async (supabase, userId) => {
  const local = JSON.parse(localStorage.getItem(SESSION_LOG_KEY) || '[]');
  const remote = await loadSessionsFromSupabase(supabase, userId);
  const merged = mergeSessions(local, remote);
  return { stats: getSessionStats(merged), remoteCount: remote.length, localCount: local.length, mergedCount: merged.length };
};

export default useSessionTracker;
