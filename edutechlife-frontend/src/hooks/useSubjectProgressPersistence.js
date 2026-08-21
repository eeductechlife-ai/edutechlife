import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

const SUBJECT_TIME_STORAGE_KEY = "edutechlife_subject_time";
const SESSIONS_STORAGE_KEY = "edutechlife_sessions";

/**
 * useSubjectProgressPersistence
 * Syncs subject study time and sessions with localStorage and backend.
 * Provides load/save for progress persistence across sessions.
 */
export const useSubjectProgressPersistence = () => {
  const [subjectTime, setSubjectTime] = useState({});
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load progress from localStorage + backend
  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try localStorage first
      const storedTime = localStorage.getItem(SUBJECT_TIME_STORAGE_KEY);
      const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);

      if (storedTime) {
        try {
          setSubjectTime(JSON.parse(storedTime));
        } catch (_) {}
      }
      if (storedSessions) {
        try {
          setSessions(JSON.parse(storedSessions));
        } catch (_) {}
      }

      // 2. Backend fallback (with timeout)
      const token = sessionStorage.getItem("auth_token");
      if (token) {
        try {
          const resp = await fetch(
            `${API_BASE_URL}/api/smartboard/student-progress`,
            {
              headers: { Authorization: `Bearer ${token}` },
              signal: AbortSignal.timeout(5000),
            },
          );
          if (resp.ok) {
            const { subjectTime: backendTime, sessions: backendSessions } =
              await resp.json();
            if (backendTime) {
              setSubjectTime(backendTime);
              localStorage.setItem(
                SUBJECT_TIME_STORAGE_KEY,
                JSON.stringify(backendTime),
              );
            }
            if (backendSessions) {
              setSessions(backendSessions);
              localStorage.setItem(
                SESSIONS_STORAGE_KEY,
                JSON.stringify(backendSessions),
              );
            }
          }
        } catch (_) {
          // network error — use localStorage
        }
      }

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save progress to localStorage + backend (async)
  const saveProgress = useCallback((newSubjectTime, newSessions) => {
    if (newSubjectTime) {
      setSubjectTime(newSubjectTime);
      localStorage.setItem(
        SUBJECT_TIME_STORAGE_KEY,
        JSON.stringify(newSubjectTime),
      );
    }
    if (newSessions) {
      setSessions(newSessions);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
    }

    // Async: sync to backend (fire-and-forget)
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      fetch(`${API_BASE_URL}/api/smartboard/student-progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subjectTime: newSubjectTime,
          sessions: newSessions,
        }),
        signal: AbortSignal.timeout(3000),
      }).catch(() => {
        // Failed to sync, but localStorage saved
      });
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadProgress();
  }, []);

  return {
    subjectTime,
    sessions,
    loading,
    saveProgress,
    loadProgress,
    setSubjectTime,
    setSessions,
  };
};
