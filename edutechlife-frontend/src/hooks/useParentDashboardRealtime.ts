import { useEffect, useRef, useState } from "react";
import { createSupabaseClient } from "../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface StudentOnlineStatus {
  auth_id: string;
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
  studentAuthId: string,
  authToken: string | null,
) => {
  const [studentStatus, setStudentStatus] = useState<StudentOnlineStatus[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [livePoints, setLivePoints] = useState<LivePointsEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const channelsRef = useRef<RealtimeChannel[]>([]);
  const supabaseRef = useRef<any>(null);

  useEffect(() => {
    if (!parentId || !studentAuthId || !authToken) {
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const setupRealtimeSubscriptions = async () => {
      try {
        const supabase = createSupabaseClient(authToken);
        supabaseRef.current = supabase;

        // SECURITY: Resolve the student's DB id from the auth id (students.id != auth.uid)
        // Must succeed — no filters mean data leakage to all students.
        let studentDbId: string | null = null;
        const { data: studentRow, error: studentError } = await supabase
          .from("students")
          .select("id")
          .eq("auth_id", studentAuthId)
          .maybeSingle();

        if (studentError || !studentRow?.id) {
          console.error(
            "[ParentDashboardRealtime] SECURITY: Could not resolve student DB id. Blocking realtime.",
            studentError,
          );
          setIsConnected(false);
          return;
        }

        studentDbId = String(studentRow.id);
        console.log(
          `[ParentDashboardRealtime] Resolved student DB id: ${studentDbId}`,
        );

        // Canal 1: Monitor del estudiante (auth_id filter)
        const statusChannel = supabase
          .channel(`parent-student-status-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "students",
              filter: `auth_id=eq.${studentAuthId}`, // SECURITY: Filter by auth_id
            },
            (payload: any) => {
              if (isMounted) {
                const student = payload.new || payload.old;
                setStudentStatus((prev) => {
                  const filtered = prev.filter(
                    (s) => s.auth_id !== student.auth_id,
                  );
                  return [
                    ...filtered,
                    {
                      auth_id: student.auth_id,
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
            if (isMounted && status === "SUBSCRIBED") setIsConnected(true);
          });

        channelsRef.current.push(statusChannel);

        // Canal 2: Sesiones en tiempo real (student_id filter - OBLIGATORIO)
        const sessionsChannel = supabase
          .channel(`parent-live-sessions-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "sessions",
              filter: `student_id=eq.${studentDbId}`, // SECURITY: Always filter by student_id
            },
            (payload: any) => {
              if (isMounted) {
                const session = payload.new;
                setLiveSessions((prev) => [
                  ...prev.filter((s) => s.id !== session.id),
                  {
                    id: session.id,
                    student_id: session.student_id,
                    subject: session.subject,
                    start_time: session.start_time,
                    completion_percentage: session.completion_percentage,
                    points_earned: session.points_earned,
                    type: session.type,
                  },
                ]);
              }
            },
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "sessions",
              filter: `student_id=eq.${studentDbId}`, // SECURITY: Always filter by student_id
            },
            (payload: any) => {
              if (isMounted) {
                const session = payload.new;
                setLiveSessions((prev) => {
                  const filtered = prev.filter((s) => s.id !== session.id);
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

        // Canal 3: Historial de puntos en tiempo real (student_id filter - OBLIGATORIO)
        const pointsChannel = supabase
          .channel(`parent-live-points-${parentId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "points_history",
              filter: `student_id=eq.${studentDbId}`, // SECURITY: Always filter by student_id
            },
            (payload: any) => {
              if (isMounted) {
                const entry = payload.new;
                setLivePoints((prev) =>
                  [
                    {
                      id: entry.id,
                      student_id: entry.student_id,
                      points: entry.points,
                      reason: entry.reason,
                      category: entry.category,
                      timestamp: entry.timestamp,
                    },
                    ...prev,
                  ].slice(0, 50),
                );
              }
            },
          )
          .subscribe();

        channelsRef.current.push(pointsChannel);
      } catch (err) {
        console.error(
          "[ParentDashboardRealtime] Setup error — blocking realtime:",
          err,
        );
        setIsConnected(false);
      }
    };

    setupRealtimeSubscriptions();

    return () => {
      isMounted = false;
      channelsRef.current.forEach((channel) => {
        if (supabaseRef.current) supabaseRef.current.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [parentId, studentAuthId, authToken]);

  return { studentStatus, liveSessions, livePoints, isConnected };
};
