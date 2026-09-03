import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase"; // used in resolveStudentId fallbacks only
import { useAuthIdentity } from "./useAuthIdentity";
import { API_BASE_URL } from "../config/api";

// ISO day: Mon=1 … Sun=7 (matches migration 042 CHECK).
const isoDay = (date) => {
  const js = date.getDay(); // Sun=0 … Sat=6
  return js === 0 ? 7 : js;
};

const timeToMinutes = (hhmm) => {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

const orderSlots = (slots) =>
  [...slots].sort(
    (a, b) =>
      a.day_of_week - b.day_of_week ||
      timeToMinutes(a.start_time) - timeToMinutes(b.start_time),
  );

/**
 * useTimetable — single source of truth for the student's weekly school
 * schedule and upcoming exams. Persists to Supabase (see migration 042).
 *
 * Returns:
 *   { timetable, slots, exams, loading, error,
 *     saveTimetable, saveSlots, addExam, removeExam,
 *     currentClass, nextClass, todayClasses, upcomingExams }
 */
export const useTimetable = () => {
  const { userId, isSignedIn } = useAuthIdentity();

  const [studentId, setStudentId] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [slots, setSlots] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  // Re-derive currentClass / nextClass every minute without refetching.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const resolveStudentId = useCallback(async () => {
    if (!isSignedIn || !userId) return null;

    // 1. Try the direct Supabase query with a 5 s timeout.
    const timeout5s = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 5000),
    );
    try {
      const { data, error: e } = await Promise.race([
        supabase
          .from("students")
          .select("id")
          .eq("auth_id", userId)
          .maybeSingle(),
        timeout5s,
      ]);
      if (!e && data?.id) return data.id;
    } catch (_) {
      // timeout or RLS block — fall through to backend
    }

    // 2. Backend fallback: creates the students row if missing (service role).
    try {
      const token = sessionStorage.getItem("auth_token");
      const resp = await fetch(
        `${API_BASE_URL}/api/smartboard/student-profile`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: AbortSignal.timeout(8000),
        },
      );
      if (resp.ok) {
        const json = await resp.json();
        if (json.studentId) return json.studentId;
      }
    } catch (_) {
      // network error — fall through to direct upsert
    }

    // 3. Last resort: upsert directly from frontend (INSERT policy allows this).
    try {
      const { data } = await supabase
        .from("students")
        .upsert(
          { auth_id: userId, name: "Estudiante", age: 13 },
          { onConflict: "auth_id" },
        )
        .select("id")
        .single();
      if (data?.id) return data.id;
    } catch (_) {
      // RLS or network error
    }
    return null;
  }, [isSignedIn, userId]);

  // Helper: direct fetch to Supabase REST API (avoids supabase-js client hang in dev).
  const sbFetch = useCallback(async (path, opts = {}) => {
    const token = sessionStorage.getItem("auth_token");
    const base = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const resp = await fetch(`${base}/rest/v1/${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${token}`,
        ...(opts.headers || {}),
      },
      signal: opts.signal ?? AbortSignal.timeout(10000),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${resp.status}`);
    }
    if (resp.status === 204 || resp.headers.get("content-length") === "0") {
      return null;
    }
    return resp.json();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let sid = await resolveStudentId();
      if (!sid) {
        await new Promise((r) => setTimeout(r, 1500));
        sid = await resolveStudentId();
      }
      setStudentId(sid);
      if (!sid) {
        setTimetable(null);
        setSlots([]);
        setExams([]);
        return;
      }

      const [ttRows, exRows] = await Promise.all([
        sbFetch(
          `student_timetable?student_id=eq.${sid}&is_active=eq.true&select=*&limit=1`,
        ),
        sbFetch(
          `student_exams?student_id=eq.${sid}&completed=eq.false&select=*&order=exam_date.asc`,
        ),
      ]);

      const tt = Array.isArray(ttRows) ? (ttRows[0] ?? null) : null;
      setTimetable(tt);
      setExams(Array.isArray(exRows) ? exRows : []);

      if (tt?.id) {
        const slRows = await sbFetch(
          `timetable_slots?timetable_id=eq.${tt.id}&select=*`,
        );
        setSlots(orderSlots(Array.isArray(slRows) ? slRows : []));
      } else {
        setSlots([]);
      }
    } catch (e) {
      setError(e?.message || "Error loading timetable");
    } finally {
      setLoading(false);
    }
  }, [resolveStudentId, sbFetch]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Save the full timetable (header + slots) through the backend in one call.
   * Routes through the backend to use service-role and bypass RLS.
   * Returns { timetableId, slots }.
   */
  const saveTimetableWithSlots = useCallback(
    async ({ meta = {}, slots: newSlots = [] }) => {
      const token = sessionStorage.getItem("auth_token");
      const resp = await fetch(`${API_BASE_URL}/api/smartboard/timetable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ meta, slots: newSlots }),
        signal: AbortSignal.timeout(20000),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }
      const json = await resp.json();
      // Update local state so the view refreshes without a full reload
      const ordered = orderSlots(Array.isArray(json.slots) ? json.slots : []);
      setTimetable({ id: json.timetableId, is_active: true, ...meta });
      setSlots(ordered);
      return json;
    },
    [],
  );

  /**
   * @deprecated Use saveTimetableWithSlots instead.
   * Kept for backward-compatibility with any callers that use the two-step API.
   */
  const saveTimetable = useCallback(
    async (payload) => {
      let sid = studentId || (await resolveStudentId());
      if (!sid) {
        await new Promise((r) => setTimeout(r, 1500));
        sid = await resolveStudentId();
      }
      if (!sid)
        throw new Error(
          "No se pudo encontrar tu perfil de estudiante. Cierra sesión y vuelve a entrar.",
        );

      if (timetable?.id) {
        const rows = await sbFetch(`student_timetable?id=eq.${timetable.id}`, {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(payload),
        });
        const data = Array.isArray(rows) ? rows[0] : rows;
        setTimetable(data);
        return data;
      }

      const rows = await sbFetch("student_timetable", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ student_id: sid, is_active: true, ...payload }),
      });
      const data = Array.isArray(rows) ? rows[0] : rows;
      setTimetable(data);
      return data;
    },
    [studentId, timetable, resolveStudentId, sbFetch],
  );

  /**
   * @deprecated Use saveTimetableWithSlots instead.
   * Kept for backward-compatibility.
   */
  const saveSlots = useCallback(
    async (newSlots, overrideTimetableId) => {
      const ttId = overrideTimetableId ?? timetable?.id;
      if (!ttId) throw new Error("Create a timetable first");

      const oldSlots = [...slots];
      await sbFetch(`timetable_slots?timetable_id=eq.${ttId}`, {
        method: "DELETE",
      });

      if (!newSlots.length) {
        setSlots([]);
        return [];
      }

      const rows = newSlots.map((s) => ({
        timetable_id: ttId,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        subject: s.subject,
        subject_label: s.subject_label || s.subject,
        teacher: s.teacher || null,
        room: s.room || null,
        color: s.color || null,
        notes: s.notes || null,
      }));

      let data;
      try {
        data = await sbFetch("timetable_slots", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(rows),
        });
      } catch (insErr) {
        if (oldSlots.length) {
          await sbFetch("timetable_slots", {
            method: "POST",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify(oldSlots),
          }).catch(() => {});
          setSlots(oldSlots);
        }
        throw insErr;
      }

      const ordered = orderSlots(Array.isArray(data) ? data : []);
      setSlots(ordered);
      return ordered;
    },
    [timetable, slots, sbFetch],
  );

  const addExam = useCallback(
    async (exam) => {
      const sid = studentId || (await resolveStudentId());
      if (!sid) throw new Error("No student profile");

      const row = {
        student_id: sid,
        slot_id: exam.slot_id || null,
        subject: exam.subject,
        exam_name: exam.exam_name || null,
        exam_date: exam.exam_date,
        exam_time: exam.exam_time || null,
        topic: exam.topic || null,
        desired_grade: exam.desired_grade ?? null,
        source: exam.source || "manual",
        file_url: exam.file_url || null,
      };

      // Use direct fetch — the supabase-js client hangs on inserts in dev
      // due to an internal auth initialization race; raw fetch is reliable.
      const token = sessionStorage.getItem("auth_token");
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const resp = await fetch(`${supabaseUrl}/rest/v1/student_exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(row),
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      const rows = await resp.json();
      const data = Array.isArray(rows) ? rows[0] : rows;
      setExams((prev) =>
        [...prev, data].sort((a, b) => a.exam_date.localeCompare(b.exam_date)),
      );
      return data;
    },
    [studentId, resolveStudentId],
  );

  const removeExam = useCallback(
    async (id) => {
      await sbFetch(`student_exams?id=eq.${id}`, { method: "DELETE" });
      setExams((prev) => prev.filter((x) => x.id !== id));
    },
    [sbFetch],
  );

  // ── Derived state ─────────────────────────────────────────────────────
  const derived = useMemo(() => {
    // `tick` is read here so the memo re-runs each minute, keeping
    // currentClass / nextClass in sync with the real clock without refetching.
    void tick;
    const today = isoDay(new Date());
    const nowM = nowMinutes();

    const todayClasses = slots.filter((s) => s.day_of_week === today);

    const currentClass =
      todayClasses.find(
        (s) =>
          timeToMinutes(s.start_time) <= nowM &&
          timeToMinutes(s.end_time) > nowM,
      ) || null;

    let nextClass =
      todayClasses.find((s) => timeToMinutes(s.start_time) > nowM) || null;

    // If nothing left today, look ahead up to 7 days.
    if (!nextClass && slots.length) {
      for (let offset = 1; offset <= 7; offset++) {
        const d = ((today - 1 + offset) % 7) + 1;
        const match = slots.find((s) => s.day_of_week === d);
        if (match) {
          nextClass = match;
          break;
        }
      }
    }

    const todayISO = new Date().toISOString().slice(0, 10);
    const upcomingExams = exams
      .filter((x) => !x.completed && x.exam_date >= todayISO)
      .slice(0, 10);

    return { todayClasses, currentClass, nextClass, upcomingExams };
  }, [slots, exams, tick]);

  return {
    timetable,
    slots,
    exams,
    loading,
    error,
    reload: load,
    saveTimetableWithSlots,
    saveTimetable,
    saveSlots,
    addExam,
    removeExam,
    ...derived,
  };
};

export default useTimetable;
