import { useQuery } from "@tanstack/react-query";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

async function fetchEducatorStudents() {
  const res = await fetch(`${BACKEND_URL}/api/admin/educator/students`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Hook for Educator Dashboard real-time student data.
 * Queries sessions + academic_context + streaks + crisis_alerts per student.
 */
export function useEducatorDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["educator", "students"],
    queryFn: fetchEducatorStudents,
    staleTime: 60_000, // refresh every 60s
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    students: data?.students || [],
    summary: data?.summary || {
      totalStudents: 0,
      activeStudents: 0,
      averageProgress: 0,
      needingAttention: 0,
    },
    isLoading,
    isError,
    error,
    refetch,
  };
}
