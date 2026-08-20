import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthIdentity } from "./useAuthIdentity";

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
    const { data, error: e } = await supabase
      .from("students")
      .select("id")
      .eq("auth_id", userId)
      .maybeSingle();
    if (e) throw e;
    return data?.id || null;
  }, [isSignedIn, userId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sid = await resolveStudentId();
      setStudentId(sid);
      if (!sid) {
        setTimetable(null);
        setSlots([]);
        setExams([]);
        return;
      }

      const [{ data: tt }, { data: ex }] = await Promise.all([
        supabase
          .from("student_timetable")
          .select("*")
          .eq("student_id", sid)
          .eq("is_active", true)
          .maybeSingle(),
        supabase
          .from("student_exams")
          .select("*")
          .eq("student_id", sid)
          .eq("completed", false)
          .order("exam_date", { ascending: true }),
      ]);

      setTimetable(tt || null);
      setExams(ex || []);

      if (tt?.id) {
        const { data: sl } = await supabase
          .from("timetable_slots")
          .select("*")
          .eq("timetable_id", tt.id);
        setSlots(orderSlots(sl || []));
      } else {
        setSlots([]);
      }
    } catch (e) {
      setError(e?.message || "Error loading timetable");
    } finally {
      setLoading(false);
    }
  }, [resolveStudentId]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Create or update the active timetable header.
   * Payload: { school_name?, term_label?, term_start?, term_end?, timezone?, source? }
   */
  const saveTimetable = useCallback(
    async (payload) => {
      const sid = studentId || (await resolveStudentId());
      if (!sid) throw new Error("No student profile");

      if (timetable?.id) {
        const { data, error: e } = await supabase
          .from("student_timetable")
          .update(payload)
          .eq("id", timetable.id)
          .select()
          .single();
        if (e) throw e;
        setTimetable(data);
        return data;
      }

      const { data, error: e } = await supabase
        .from("student_timetable")
        .insert({ student_id: sid, is_active: true, ...payload })
        .select()
        .single();
      if (e) throw e;
      setTimetable(data);
      return data;
    },
    [studentId, timetable, resolveStudentId],
  );

  /**
   * Replace the full set of slots for the active timetable in one atomic-ish
   * operation (delete + insert). newSlots items:
   *   { day_of_week, start_time, end_time, subject, subject_label?,
   *     teacher?, room?, color?, notes? }
   */
  const saveSlots = useCallback(
    async (newSlots, overrideTimetableId) => {
      // overrideTimetableId is passed by callers that have the fresh return value
      // from saveTimetable before React re-renders (avoids stale closure).
      const ttId = overrideTimetableId ?? timetable?.id;
      if (!ttId) throw new Error("Create a timetable first");
      const { error: delErr } = await supabase
        .from("timetable_slots")
        .delete()
        .eq("timetable_id", ttId);
      if (delErr) throw delErr;

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

      const { data, error: insErr } = await supabase
        .from("timetable_slots")
        .insert(rows)
        .select();
      if (insErr) throw insErr;

      const ordered = orderSlots(data || []);
      setSlots(ordered);
      return ordered;
    },
    [timetable],
  );

  const addExam = useCallback(
    async (exam) => {
      const sid = studentId || (await resolveStudentId());
      if (!sid) throw new Error("No student profile");
      const { data, error: e } = await supabase
        .from("student_exams")
        .insert({
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
        })
        .select()
        .single();
      if (e) throw e;
      setExams((prev) =>
        [...prev, data].sort((a, b) =>
          a.exam_date.localeCompare(b.exam_date),
        ),
      );
      return data;
    },
    [studentId, resolveStudentId],
  );

  const removeExam = useCallback(async (id) => {
    const { error: e } = await supabase
      .from("student_exams")
      .delete()
      .eq("id", id);
    if (e) throw e;
    setExams((prev) => prev.filter((x) => x.id !== id));
  }, []);

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
    saveTimetable,
    saveSlots,
    addExam,
    removeExam,
    ...derived,
  };
};

export default useTimetable;
