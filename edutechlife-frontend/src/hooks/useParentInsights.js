import { useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function getToken() {
  try {
    return sessionStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

/**
 * Fetches parent intelligence insights and learning graph from the backend.
 * All calls are non-blocking.
 */
export function useParentInsights() {
  const [insights, setInsights] = useState([]);
  const [learningGraph, setLearningGraph] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = useCallback(async (studentId) => {
    if (!studentId) return;
    setLoading(true);
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const [insightsRes, graphRes] = await Promise.allSettled([
        fetch(
          `${API_BASE_URL}/api/smartboard/parent/insights?studentId=${studentId}`,
          { headers },
        ),
        fetch(
          `${API_BASE_URL}/api/smartboard/parent/learning-graph?studentId=${studentId}`,
          { headers },
        ),
      ]);

      if (insightsRes.status === "fulfilled" && insightsRes.value.ok) {
        const data = await insightsRes.value.json();
        setInsights(data.insights || []);
      }
      if (graphRes.status === "fulfilled" && graphRes.value.ok) {
        const data = await graphRes.value.json();
        setLearningGraph(data.summary || []);
      }
    } catch {
      // Non-blocking
    } finally {
      setLoading(false);
    }
  }, []);

  return { insights, learningGraph, loading, fetchInsights };
}
