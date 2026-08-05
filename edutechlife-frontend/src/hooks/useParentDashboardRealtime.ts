import { useEffect, useRef, useState } from "react";
import { createSupabaseClient } from "../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface StudentOnlineStatus {
  student_id: string;
  is_online: boolean;
  last_activity: string;
}

export interface LiveSession {
  id: string;
  student_id: string;
  subject: string;
  start_time: string;
  completion_percentage: number;
  points_earned: number;
  type: string;
}

export interface LivePointsEntry {
  id: string;
  student_id: string;
  points: number;
  reason: string;
  category: string;
  timestamp: string;
}

export const useParentDashboardRealtime = (
  parentId: string,
  authToken: string | null,
) => {
  const [studentStatus, setStudentStatus] = useState<StudentOnlineStatus[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [livePoints, setLivePoints] = useState<LivePointsEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const channelsRef = useRef<RealtimeChannel[]>([]);
  const supabaseRef = useRef<any>(null);

  useEffect(() => {
    if (!parentId || !authToken) {
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const setupRealtimeSubscriptions = async () => {
      try {
        // Initialize Supabase client with auth token
        const supabase = createSupabaseClient(authToken);
        supabaseRef.current = supabase;

        // Subscribe to student online status changes
        const statusChannel = supabase
          .channel(`parent-student-status-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "students",
              filter: `last_activity=gt.${new Date(Date.now() - 5 * 60 * 1000).toISOString()}`,
            },
            (payload: any) => {
              if (isMounted) {
                const student = payload.new || payload.old;
                setStudentStatus((prev) => {
                  const filtered = prev.filter(
                    (s) => s.student_id !== student.id,
                  );
                  return [
                    ...filtered,
                    {
                      student_id: student.id,
                      is_online:
                        new Date(student.last_activity).getTime() >
                        Date.now() - 5 * 60 * 1000,
                      last_activity: student.last_activity,
                    },
                  ];
                });
              }
            },
          )
          .subscribe((status) => {
            if (isMounted && status === "SUBSCRIBED") {
              setIsConnected(true);
            }
          });

        channelsRef.current.push(statusChannel);

        // Subscribe to live sessions
        const sessionsChannel = supabase
          .channel(`parent-live-sessions-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "sessions",
              filter: `end_time=is.null`,
            },
            (payload: any) => {
              if (isMounted) {
                const session = payload.new;
                setLiveSessions((prev) => {
                  const filtered = prev.filter((s) => s.id !== session.id);
                  return [
                    ...filtered,
                    {
                      id: session.id,
                      student_id: session.student_id,
                      subject: session.subject,
                      start_time: session.start_time,
                      completion_percentage: session.completion_percentage,
                      points_earned: session.points_earned,
                      type: session.type,
                    },
                  ];
                });
              }
            },
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "sessions",
            },
            (payload: any) => {
              if (isMounted) {
                const session = payload.new;
                setLiveSessions((prev) => {
                  const filtered = prev.filter((s) => s.id !== session.id);
                  // Only keep active sessions (end_time is null)
                  if (!session.end_time) {
                    return [
                      ...filtered,
                      {
                        id: session.id,
                        student_id: session.student_id,
                        subject: session.subject,
                        start_time: session.start_time,
                        completion_percentage: session.completion_percentage,
                        points_earned: session.points_earned,
                        type: session.type,
                      },
                    ];
                  }
                  return filtered;
                });
              }
            },
          )
          .subscribe();

        channelsRef.current.push(sessionsChannel);

        // Subscribe to live points
        const pointsChannel = supabase
          .channel(`parent-live-points-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "points_history",
            },
            (payload: any) => {
              if (isMounted) {
                const entry = payload.new;
                setLivePoints((prev) => {
                  const updated = [
                    {
                      id: entry.id,
                      student_id: entry.student_id,
                      points: entry.points,
                      reason: entry.reason,
                      category: entry.category,
                      timestamp: entry.timestamp,
                    },
                    ...prev,
                  ];
                  // Keep only last 50 entries for performance
                  return updated.slice(0, 50);
                });
              }
            },
          )
          .subscribe();

        channelsRef.current.push(pointsChannel);
      } catch (err) {
        console.warn("[ParentDashboardRealtime] Setup error:", err);
        setIsConnected(false);
      }
    };

    setupRealtimeSubscriptions();

    return () => {
      isMounted = false;
      // Cleanup subscriptions
      channelsRef.current.forEach((channel) => {
        if (supabaseRef.current) {
          supabaseRef.current.removeChannel(channel);
        }
      });
      channelsRef.current = [];
    };
  }, [parentId, authToken]);

  return {
    studentStatus,
    liveSessions,
    livePoints,
    isConnected,
  };
};
