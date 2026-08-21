import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

const GRADES_STORAGE_KEY = "edutechlife_student_grades";

/**
 * useStudentGradesPersistence
 * Syncs student grades with localStorage and backend (fallback if Supabase is unavailable).
 * Provides load/save operations for grade persistence across sessions.
 */
export const useStudentGradesPersistence = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load grades from localStorage (instant) + backend (fallback)
  const loadGrades = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try localStorage first (instant, no network)
      const stored = localStorage.getItem(GRADES_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setGrades(parsed);
          setLoading(false);
          return parsed;
        } catch (_) {
          // corrupted localStorage — fall through to backend
        }
      }

      // 2. Backend fallback: fetch from server (with 5s timeout)
      const token = sessionStorage.getItem("auth_token");
      if (token) {
        try {
          const resp = await fetch(
            `${API_BASE_URL}/api/smartboard/student-grades`,
            {
              headers: { Authorization: `Bearer ${token}` },
              signal: AbortSignal.timeout(5000),
            },
          );
          if (resp.ok) {
            const { grades: backendGrades } = await resp.json();
            setGrades(backendGrades || []);
            // Update localStorage for next time
            if (backendGrades?.length) {
              localStorage.setItem(
                GRADES_STORAGE_KEY,
                JSON.stringify(backendGrades),
              );
            }
            setLoading(false);
            return backendGrades || [];
          }
        } catch (_) {
          // network error — use empty state
        }
      }

      setGrades([]);
      setLoading(false);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Save grades to localStorage + backend (fire-and-forget)
  const saveGrades = useCallback((newGrades) => {
    setGrades(newGrades);
    // Always save to localStorage
    localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(newGrades));

    // Async: attempt backend save (fire-and-forget, no await)
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      fetch(`${API_BASE_URL}/api/smartboard/student-grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ grades: newGrades }),
        signal: AbortSignal.timeout(3000),
      }).catch(() => {
        // Failed to sync to backend, but localStorage saved so it's OK
      });
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadGrades();
  }, []);

  return { grades, setGrades, loading, saveGrades, loadGrades };
};
