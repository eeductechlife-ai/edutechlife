import { useQuery } from "@tanstack/react-query";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

async function fetchSmartboardAnalytics(days = 30) {
  const res = await fetch(
    `${BACKEND_URL}/api/admin/analytics/smartboard?days=${days}`,
    {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function useAdminAnalytics(days = 30) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "analytics", "smartboard", days],
    queryFn: () => fetchSmartboardAnalytics(days),
    staleTime: 5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    overview: data?.overview ?? {
      totalSessions: 0,
      activeLast7Days: 0,
      avgSessionMinutes: 0,
      atRiskCount: 0,
      totalMinutes: 0,
    },
    subjectPerformance: data?.subjectPerformance ?? [],
    dailySessions: data?.dailySessions ?? [],
    streakDistribution: data?.streakDistribution ?? {
      noStreak: 0,
      short: 0,
      medium: 0,
      long: 0,
    },
    achievementRate: data?.achievementRate ?? {
      totalEarned: 0,
      uniqueStudents: 0,
      avgPerActiveStudent: 0,
    },
    meta: data?.meta ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
