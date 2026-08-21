import { useCallback, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNotification } from "../context/NotificationContext";
import { useSmartBoardKids } from "../context/SmartBoardKidsContext";

// Reminder windows (minutes before exam). Order matters: farthest first.
const REMINDER_WINDOWS = [
  { key: "24h", minutesBefore: 24 * 60, label: "en 24 horas" },
  { key: "3h", minutesBefore: 3 * 60, label: "en 3 horas" },
  { key: "30m", minutesBefore: 30, label: "en 30 minutos" },
];

// Wake window for "did we miss the sweet spot": ± 30 min around the target.
const MATCH_WINDOW_MIN = 30;

const NIGHT_START = 22; // 22:00
const NIGHT_END = 7; //  7:00 — respect student sleep

const isDuringSleep = () => {
  const h = new Date().getHours();
  return h >= NIGHT_START || h < NIGHT_END;
};

const parseExamDateTime = (exam) => {
  const time = exam.exam_time || "08:00";
  const iso = `${exam.exam_date}T${time.length === 5 ? `${time}:00` : time}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

const emojiFor = (win) =>
  win.key === "30m" ? "⏰" : win.key === "3h" ? "🔔" : "📅";

/**
 * useExamReminders — background hook that turns upcoming exams into in-app
 * notifications at 24h, 3h and 30min before the exam. Persists which
 * windows have already fired inside `student_exams.reminded_at` so we
 * never notify twice, even across sessions or devices.
 *
 * Silences during sleep hours (22:00–07:00) to avoid pinging a child at night.
 *
 * Note: Requires SmartBoardKidsProvider to be present in the component tree.
 */
export const useExamReminders = () => {
  const { upcomingExams, reloadTimetable } = useSmartBoardKids();
  const { createNotification } = useNotification();
  const timerRef = useRef(null);
  const checkRef = useRef(null);
  const inFlightRef = useRef(new Set());

  const persistFired = useCallback(async (examId, prevFired, windowKey) => {
    const nextFired = Array.from(new Set([...prevFired, windowKey]));
    const { error } = await supabase
      .from("student_exams")
      .update({ reminded_at: nextFired })
      .eq("id", examId);
    if (error) throw error;
  }, []);

  const check = useCallback(async () => {
    if (isDuringSleep()) return;
    if (!upcomingExams?.length) return;

    const now = Date.now();

    for (const exam of upcomingExams) {
      const when = parseExamDateTime(exam);
      if (!when) continue;
      const minutesUntil = (when.getTime() - now) / 60000;
      if (minutesUntil < -MATCH_WINDOW_MIN) continue; // already past

      const alreadyFired = Array.isArray(exam.reminded_at)
        ? exam.reminded_at
        : [];

      for (const win of REMINDER_WINDOWS) {
        if (alreadyFired.includes(win.key)) continue;
        const diff = Math.abs(minutesUntil - win.minutesBefore);
        if (diff > MATCH_WINDOW_MIN) continue;

        const inflightKey = `${exam.id}:${win.key}`;
        if (inFlightRef.current.has(inflightKey)) continue;
        inFlightRef.current.add(inflightKey);

        try {
          await createNotification({
            type: "exam_reminder",
            title: `${emojiFor(win)} Examen ${win.label}`,
            message: `${exam.subject}${
              exam.exam_name ? ` — ${exam.exam_name}` : ""
            }. ${
              win.key === "30m"
                ? "¡Última repasada!"
                : "Abre Exámenes para practicar."
            }`,
            metadata: {
              examId: exam.id,
              subject: exam.subject,
              window: win.key,
              openTab: "examenes",
            },
          });
          await persistFired(exam.id, alreadyFired, win.key);
        } catch (e) {
          console.warn("[exam-reminders] failed:", e?.message);
        } finally {
          inFlightRef.current.delete(inflightKey);
        }
        break; // one reminder per exam per tick
      }
    }
  }, [upcomingExams, createNotification, persistFired]);

  // Store the latest check function in a ref so the interval can always
  // call the most up-to-date version without recreating itself.
  useEffect(() => {
    checkRef.current = check;
  }, [check]);

  useEffect(() => {
    // First check happens shortly after mount so a freshly-opened app
    // catches an imminent exam. Then every 5 minutes.
    const boot = setTimeout(() => checkRef.current?.(), 4000);

    // Create interval once on first mount; it persists and calls checkRef.current
    if (!timerRef.current) {
      timerRef.current = setInterval(() => checkRef.current?.(), 5 * 60 * 1000);
    }

    return () => {
      clearTimeout(boot);
    };
  }, []);

  // Expose reloadTimetable so the caller (dashboard) can force-refresh after adding exams.
  return { refresh: reloadTimetable };
};

export default useExamReminders;
