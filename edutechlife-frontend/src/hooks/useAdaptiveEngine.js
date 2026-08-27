import { useState, useCallback } from "react";
import { useSmartBoardKids } from "../context/SmartBoardKidsContext";
import { track } from "../lib/analytics";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function getToken() {
  try {
    return localStorage.getItem("sb_auth_token") || "";
  } catch {
    return "";
  }
}

async function apiFetch(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

/**
 * Consumes the Adaptive Learning Engine endpoints.
 * All calls are non-blocking — errors are swallowed to never break UI.
 *
 * Returns:
 *   - nextAction   : the single best next action for the student
 *   - recommendations : list of up to 4 prioritised actions
 *   - dailyPlan    : today's plan (cached per availableMinutes)
 *   - weeklyPlan   : this week's plan
 *   - loading      : true while any fetch is in flight
 *   - fetchNextAction(studentId)
 *   - fetchDailyPlan(studentId, availableMinutes)
 *   - fetchWeeklyPlan(studentId)
 */
export function useAdaptiveEngine() {
  const { supabaseQueries } = useSmartBoardKids();
  const studentDbId = supabaseQueries?.studentData?.data?.id ?? null;

  const [nextAction, setNextAction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNextAction = useCallback(
    async (studentId) => {
      const sid = studentId ?? studentDbId;
      if (!sid) return;
      setLoading(true);
      try {
        const data = await apiFetch(
          `/api/smartboard/adaptive/next-action?studentId=${sid}`,
        );
        setNextAction(data.action ?? null);
        setRecommendations(data.recommendations ?? []);
      } catch {
        // Non-blocking
      } finally {
        setLoading(false);
      }
    },
    [studentDbId],
  );

  const fetchDailyPlan = useCallback(
    async (studentId, availableMinutes = 20) => {
      const sid = studentId ?? studentDbId;
      if (!sid) return;
      setLoading(true);
      try {
        const data = await apiFetch("/api/smartboard/adaptive/daily-plan", {
          method: "POST",
          body: JSON.stringify({ studentId: sid, availableMinutes }),
        });
        setDailyPlan(data.plan ?? null);
        track("plan_generated", { type: "daily", minutes: availableMinutes });
      } catch {
        // Non-blocking
      } finally {
        setLoading(false);
      }
    },
    [studentDbId],
  );

  const fetchWeeklyPlan = useCallback(
    async (studentId) => {
      const sid = studentId ?? studentDbId;
      if (!sid) return;
      setLoading(true);
      try {
        const data = await apiFetch("/api/smartboard/adaptive/weekly-plan", {
          method: "POST",
          body: JSON.stringify({ studentId: sid }),
        });
        setWeeklyPlan(data.plan ?? null);
        track("plan_generated", { type: "weekly" });
      } catch {
        // Non-blocking
      } finally {
        setLoading(false);
      }
    },
    [studentDbId],
  );

  return {
    nextAction,
    recommendations,
    dailyPlan,
    weeklyPlan,
    loading,
    fetchNextAction,
    fetchDailyPlan,
    fetchWeeklyPlan,
    studentDbId,
  };
}
