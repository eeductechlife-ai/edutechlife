import { useState, useCallback } from "react";
import { track } from "../lib/analytics";
import { EVENTS } from "../lib/analyticsEvents";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function getToken() {
  try {
    return sessionStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

/**
 * Fetches early warnings for a student from the backend.
 * All calls non-blocking.
 */
export function useEarlyWarnings() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWarnings = useCallback(async (studentId) => {
    if (!studentId) return;
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(
        `${API_BASE_URL}/api/smartboard/adaptive/warnings?studentId=${studentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        const list = data.warnings || [];
        setWarnings(list);
        if (list.length > 0) {
          track(EVENTS.ALERT_GENERATED, {
            count: list.length,
            top_risk: list[0]?.risk_level ?? null,
          });
        }
      }
    } catch {
      // Non-blocking
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveWarning = useCallback(async (warningId) => {
    const token = getToken();
    try {
      await fetch(
        `${API_BASE_URL}/api/smartboard/adaptive/warnings/${warningId}/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      setWarnings((prev) => prev.filter((w) => w.id !== warningId));
    } catch {
      // Non-blocking
    }
  }, []);

  return { warnings, loading, fetchWarnings, resolveWarning };
}
