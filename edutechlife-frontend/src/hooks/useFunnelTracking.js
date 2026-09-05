import { useEffect, useCallback, useRef } from "react";
import { track } from "../lib/analytics";
import { EVENTS } from "../lib/analyticsEvents";

const LS_FUNNEL_STATE = "edutechlife_funnel_state";
const LS_FIRST_SESSION = "edutechlife_first_session_date";
const LS_FIRST_ACTIVITY = "edutechlife_first_activity_tracked";

function daysBetween(dateStr, now) {
  const d = new Date(dateStr);
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Funnel tracking hook for activation/retention metrics.
 *
 * - Tracks retention_day_1 and retention_day_7 based on first session date.
 * - Provides trackFirstActivity() to fire first_activity_completed once.
 * - Provides trackFeatureAdoption(featureName) — once per feature per session.
 */
export default function useFunnelTracking() {
  const adoptedRef = useRef(new Set());

  useEffect(() => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;

    const now = new Date();

    // Ensure first session date is recorded
    let firstSession;
    try {
      firstSession = localStorage.getItem(LS_FIRST_SESSION);
      if (!firstSession) {
        firstSession = now.toISOString();
        localStorage.setItem(LS_FIRST_SESSION, firstSession);
      }
    } catch {
      return;
    }

    // Load funnel state
    let state = {};
    try {
      const raw = localStorage.getItem(LS_FUNNEL_STATE);
      if (raw) state = JSON.parse(raw);
    } catch {
      state = {};
    }

    const days = daysBetween(firstSession, now);

    // Retention day 1
    if (days >= 1 && !state.retention_d1) {
      track(EVENTS.RETENTION_DAY_1, { days_since_first: days });
      state.retention_d1 = true;
    }

    // Retention day 7
    if (days >= 7 && !state.retention_d7) {
      track(EVENTS.RETENTION_DAY_7, { days_since_first: days });
      state.retention_d7 = true;
    }

    try {
      localStorage.setItem(LS_FUNNEL_STATE, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, []);

  const trackFirstActivity = useCallback(() => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    try {
      if (localStorage.getItem(LS_FIRST_ACTIVITY)) return;
      track(EVENTS.FIRST_ACTIVITY_COMPLETED, {});
      localStorage.setItem(LS_FIRST_ACTIVITY, "1");
    } catch {
      /* quota */
    }
  }, []);

  const trackFeatureAdoption = useCallback((featureName) => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    if (adoptedRef.current.has(featureName)) return;
    adoptedRef.current.add(featureName);
    track(EVENTS.FEATURE_ADOPTED, { feature: featureName });
  }, []);

  return { trackFirstActivity, trackFeatureAdoption };
}
