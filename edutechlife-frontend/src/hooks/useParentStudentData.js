import { useState, useEffect, useCallback, useRef } from "react";
import { createSupabaseClient } from "../lib/supabase";

const POLL_MS = 30_000;

// ─── Fallback desde localStorage ─────────────────────────────────────────────
const fromLocalStorage = (id) => {
  if (!id) return DEFAULT;
  const sfx = `_${id}`;
  const j = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  return {
    points:    parseInt(localStorage.getItem(`edutechlife_points${sfx}`) || "0", 10),
    history:   j(`edutechlife_points_history${sfx}`) || [],
    vakResult: j(`edutechlife_vak${sfx}`),
    minutes:   parseInt(localStorage.getItem(`edutechlife_minutes${sfx}`) || "0", 10),
    missions:  j(`edutechlife_missions${sfx}`) || [],
    subjects:  j(`edutechlife_subjects${sfx}`) || [],
    events:    j(`edutechlife_calendar${sfx}`) || [],
    streak:    j(`edutechlife_streak${sfx}`) || { current: 0, longest: 0, lastActive: null },
    sessions:  j(`edutechlife_sessions${sfx}`) || [],
  };
};

const DEFAULT = {
  points: 0, history: [], vakResult: null, minutes: 0,
  missions: [], subjects: [], events: [],
  streak: { current: 0, longest: 0, lastActive: null }, sessions: [],
};

// ─── Mapear JSONB de smartboard_kids_data al formato del dashboard ────────────
const mapSmartboardData = (raw) => {
  if (!raw) return null;
  return {
    points:    raw.totalPoints || 0,
    history:   raw.pointsHistory || [],
    vakResult: raw.vakResult || null,
    minutes:   raw.totalActiveMinutes || 0,
    missions:  raw.missions || [],
    subjects:  (raw.subjects || []).map((s, i) => ({
      ...s,
      icon: s.icon || ["📐","🔬","📚","🌍","🎨"][i % 5],
      color: s.color || ["#4DA8C4","#66CCCC","#FFD166","#B2D8E5","#004B63"][i % 5],
    })),
    events:    raw.calendarEvents || [],
    streak:    raw.streak || { current: 0, longest: 0, lastActive: null },
    sessions:  raw.sessions || [],
  };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Lee datos reales del estudiante desde smartboard_kids_data en Supabase.
 * Requiere que el SQL de migration 023 haya sido aplicado (parent_student_links).
 *
 * Fallback: localStorage del mismo dispositivo.
 * source: "supabase" | "local"
 */
export const useParentStudentData = (studentId, authToken) => {
  const [data, setData] = useState(() => fromLocalStorage(studentId));
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("local");
  const timerRef = useRef(null);

  const refresh = useCallback(async () => {
    const local = fromLocalStorage(studentId);

    if (!studentId || !authToken) {
      setData(local);
      setSource("local");
      setLoading(false);
      return;
    }

    try {
      const sb = createSupabaseClient(authToken);

      // Lee el blob JSONB del estudiante
      const { data: row, error } = await sb
        .from("smartboard_kids_data")
        .select("data")
        .eq("user_id", studentId)
        .maybeSingle();

      if (error) throw error;

      const mapped = mapSmartboardData(row?.data);

      if (mapped && (mapped.points > 0 || mapped.history.length > 0 || mapped.sessions.length > 0)) {
        // Supabase devolvió datos reales — usarlos
        setData({
          ...mapped,
          // Siempre fusionar con localStorage por si hay datos locales más recientes
          missions: mapped.missions.length ? mapped.missions : local.missions,
          events:   mapped.events.length   ? mapped.events   : local.events,
        });
        setSource("supabase");
      } else {
        // Supabase sin datos → localStorage
        setData(local);
        setSource("local");
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.debug("[ParentData] Supabase error:", err.message);
      }
      setData(fromLocalStorage(studentId));
      setSource("local");
    } finally {
      setLoading(false);
    }
  }, [studentId, authToken]);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, POLL_MS);
    return () => clearInterval(timerRef.current);
  }, [refresh]);

  return { data, loading, source, refresh };
};
