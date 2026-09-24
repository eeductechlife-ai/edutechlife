import { useMemo, useState, useEffect } from "react";
import { track } from "../../../lib/analytics";

// Kid-facing practice history. Server-side history lives in points/feedback/
// competency tables; this log only powers the "Tu semana" view in Practicar.
const MAX_ENTRIES = 300;
const EVENT = "practicar:logged";

function storageKey() {
  let owner = "anon";
  try {
    owner = localStorage.getItem("user_email") || owner;
  } catch {
    // storage unavailable
  }
  return `practicar_log::${owner}`;
}

export function readPracticeLog() {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey()) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

/**
 * @param {{type: "reto"|"educards"|"material"|"escaneo", subject?: string,
 *          challengeId?: string, score?: number}} entry
 */
export function logPractice(entry) {
  const record = { ...entry, at: new Date().toISOString() };
  try {
    const next = [...readPracticeLog(), record].slice(-MAX_ENTRIES);
    localStorage.setItem(storageKey(), JSON.stringify(next));
  } catch {
    // storage unavailable; analytics still records it
  }
  track("practicar_activity", record);
  window.dispatchEvent(new CustomEvent(EVENT));
}

function startOfWeek(d) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday = 0
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}

export function usePracticeLog() {
  const [log, setLog] = useState(readPracticeLog);

  useEffect(() => {
    const refresh = () => setLog(readPracticeLog());
    window.addEventListener(EVENT, refresh);
    return () => window.removeEventListener(EVENT, refresh);
  }, []);

  return useMemo(() => {
    const weekStart = startOfWeek(new Date());
    const week = log.filter((e) => new Date(e.at) >= weekStart);
    const days = Array.from({ length: 7 }, (_, i) =>
      week.some((e) => (new Date(e.at).getDay() + 6) % 7 === i),
    );
    const retos = week.filter((e) => e.type === "reto" && e.score != null);
    const avgScore = retos.length
      ? Math.round(retos.reduce((s, e) => s + e.score, 0) / retos.length)
      : null;

    const lastRetoByChallenge = {};
    for (const e of log) {
      if (e.type === "reto" && e.challengeId)
        lastRetoByChallenge[e.challengeId] = e;
    }

    return {
      days,
      daysPracticed: days.filter(Boolean).length,
      weekCount: week.length,
      retosThisWeek: retos.length,
      avgScore,
      lastRetoByChallenge,
      total: log.length,
    };
  }, [log]);
}
