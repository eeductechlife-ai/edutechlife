import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthIdentity } from "./useAuthIdentity";
import { supabase } from "../lib/supabase";
import { calcModuleScore } from "../utils/ialab";
import { WEIGHTS } from "../constants/ialab";

const ACTIVITY_LOG_KEY = "ialab_activity_log";
const RESOURCE_STATUS_KEY = "ialab_resource_status";

// Singleton: canal realtime compartido entre todas las instancias del hook
let realtimeChannel = null;
let realtimeSubscribed = false;

export const useActivityTracker = () => {
  // Identidad desde la sesion de Supabase (Clerk ya no autentica).
  const { userId } = useAuthIdentity();
  const [activities, setActivities] = useState([]);
  const [resourceStatus, setResourceStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);
  const realtimeInitRef = useRef(false);

  // Cargar actividades desde Supabase + localStorage
  const loadActivities = useCallback(async () => {
    if (!userId) {
      setActivities([]);
      setResourceStatus({});
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(200);

      if (error) {
        console.warn(
          "[ACTIVITY] Supabase error, loading from localStorage:",
          error.code,
        );
        const local = JSON.parse(
          localStorage.getItem(ACTIVITY_LOG_KEY) || "[]",
        );
        setActivities(local);
        buildResourceStatus(local);
        return;
      }

      const allActivities = data || [];
      setActivities(allActivities);
      buildResourceStatus(allActivities);

      localStorage.setItem(
        ACTIVITY_LOG_KEY,
        JSON.stringify(allActivities.slice(0, 200)),
      );
    } catch (err) {
      console.error("[ACTIVITY] Error loading:", err.message || err);
      const local = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || "[]");
      setActivities(local);
      buildResourceStatus(local);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Construir mapa de estado de recursos
  const buildResourceStatus = useCallback((acts) => {
    const statusMap = {};
    acts.forEach((a) => {
      if (a.resource_id) {
        statusMap[a.resource_id] = {
          status: a.score ? "scored" : "completed",
          score: a.score,
          completedAt: a.completed_at,
          title: a.title,
          moduleId: a.module_id,
          type: a.activity_type,
        };
      }
    });
    setResourceStatus(statusMap);
    localStorage.setItem(RESOURCE_STATUS_KEY, JSON.stringify(statusMap));
  }, []);

  // Actualizar estado de un recurso (usando ref para evitar dependencia en useEffect)
  const updateResourceStatusRef = useRef(null);
  updateResourceStatusRef.current = (resourceId, activity) => {
    if (!resourceId) return;
    setResourceStatus((prev) => {
      const updated = {
        ...prev,
        [resourceId]: {
          status: activity.score ? "scored" : "completed",
          score: activity.score,
          completedAt: activity.completed_at,
          title: activity.title,
          moduleId: activity.module_id,
          type: activity.activity_type,
        },
      };
      localStorage.setItem(RESOURCE_STATUS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Registrar una actividad
  const trackActivity = useCallback(
    async ({ moduleId, type, resourceId, title, score, metadata = {} }) => {
      if (!userId) return null;

      const activity = {
        user_id: userId,
        module_id: moduleId != null ? Number(moduleId) : 0,
        activity_type: type,
        resource_id: resourceId || null,
        title: title || "Actividad",
        score: score != null ? Math.round(Number(score)) : null,
        metadata:
          typeof metadata === "object" && metadata !== null ? metadata : {},
        completed_at: new Date().toISOString(),
      };

      try {
        const { data, error } = await supabase
          .from("activity_log")
          .insert(activity)
          .select("*")
          .single();

        if (error) {
          console.warn(
            "[ACTIVITY] Supabase insert error, using localStorage:",
            error.code,
            error.message,
          );
          const localActivity = { ...activity, id: `local_${Date.now()}` };
          const local = JSON.parse(
            localStorage.getItem(ACTIVITY_LOG_KEY) || "[]",
          );
          local.unshift(localActivity);
          localStorage.setItem(
            ACTIVITY_LOG_KEY,
            JSON.stringify(local.slice(0, 200)),
          );
          setActivities((prev) => [localActivity, ...prev]);
          if (updateResourceStatusRef.current)
            updateResourceStatusRef.current(resourceId, localActivity);
          return localActivity;
        }

        setActivities((prev) => [data, ...prev]);
        if (updateResourceStatusRef.current)
          updateResourceStatusRef.current(resourceId, data);

        const local = JSON.parse(
          localStorage.getItem(ACTIVITY_LOG_KEY) || "[]",
        );
        local.unshift(data);
        localStorage.setItem(
          ACTIVITY_LOG_KEY,
          JSON.stringify(local.slice(0, 200)),
        );

        return data;
      } catch (err) {
        console.error("[ACTIVITY] Error tracking:", err.message || err);
        return null;
      }
    },
    [userId],
  );

  // Marcar recurso como "en progreso"
  const markInProgress = useCallback((resourceId, moduleId, title, type) => {
    setResourceStatus((prev) => {
      if (
        prev[resourceId] &&
        (prev[resourceId].status === "completed" ||
          prev[resourceId].status === "scored")
      ) {
        return prev;
      }
      const updated = {
        ...prev,
        [resourceId]: {
          status: "in_progress",
          score: null,
          completedAt: null,
          title,
          moduleId,
          type,
        },
      };
      localStorage.setItem(RESOURCE_STATUS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getModuleActivities = useCallback(
    (moduleId) => {
      return activities.filter((a) => a.module_id === moduleId);
    },
    [activities],
  );

  const getModuleScore = useCallback(
    (moduleId) => {
      const modActivities = activities.filter((a) => a.module_id === moduleId);
      const exams = modActivities.filter((a) => a.activity_type === "exam");
      const challenges = modActivities.filter(
        (a) => a.activity_type === "challenge",
      );
      const resources = modActivities.filter((a) =>
        ["video", "infographic", "resource"].includes(a.activity_type),
      );
      const community = modActivities.filter(
        (a) => a.activity_type === "community",
      );

      const examScore =
        exams.length > 0 ? Math.max(...exams.map((e) => e.score || 0)) : 0;
      const challengeScore =
        challenges.length > 0
          ? Math.max(...challenges.map((c) => c.score || 0))
          : 0;
      const resourceCount = Math.min(resources.length, 5);

      return calcModuleScore({
        exam: examScore >= 80,
        examEarned: (examScore / 100) * WEIGHTS.exam,
        challenge: challengeScore >= 80,
        challengeEarned: (challengeScore / 100) * WEIGHTS.challenge,
        resourcesCompleted: resources.length >= 5,
        resourcesEarned: (resourceCount / 5) * WEIGHTS.resources,
        community: community.length > 0,
      });
    },
    [activities],
  );

  const getResourceStatus = useCallback(
    (resourceId) => {
      return (
        resourceStatus[resourceId] || {
          status: "pending",
          score: null,
          completedAt: null,
        }
      );
    },
    [resourceStatus],
  );

  const getAllActivities = useCallback(() => {
    return activities;
  }, [activities]);

  const getTimeTrackingStats = useCallback(() => {
    const now = new Date();
    const today = now.toDateString();
    const thisWeek = [];
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      thisWeek.push(d.toDateString());
    }
    const dayCount = {};
    const weekCount = {};
    activities.forEach((a) => {
      const key = new Date(a.completed_at).toDateString();
      dayCount[key] = (dayCount[key] || 0) + 1;
      if (thisWeek.includes(key)) weekCount[key] = (weekCount[key] || 0) + 1;
    });
    return {
      today: dayCount[today] || 0,
      weekTotal: Object.values(weekCount).reduce((a, b) => a + b, 0),
      weekDaily: thisWeek.map((d) => ({ day: d, count: weekCount[d] || 0 })),
      avgPerDay:
        Object.keys(dayCount).length > 0
          ? Math.round(activities.length / Object.keys(dayCount).length)
          : 0,
      totalDaysActive: Object.keys(dayCount).length,
    };
  }, [activities]);

  const getStudentStats = useCallback(() => {
    const totalActivities = activities.length;
    const completedModules = new Set(
      activities.filter((a) => a.score >= 80).map((a) => a.module_id),
    ).size;
    const avgScore =
      activities.filter((a) => a.score).length > 0
        ? Math.round(
            activities
              .filter((a) => a.score)
              .reduce((sum, a) => sum + a.score, 0) /
              activities.filter((a) => a.score).length,
          )
        : 0;

    const dates = [
      ...new Set(
        activities.map((a) => new Date(a.completed_at).toDateString()),
      ),
    ];
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (dates.includes(checkDate.toDateString())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalActivities,
      completedModules,
      avgScore,
      streak,
      lastActivity: activities.length > 0 ? activities[0].completed_at : null,
    };
  }, [activities]);

  // Cargar al montar (una sola vez)
  useEffect(() => {
    if (!userId || initializedRef.current) return;
    initializedRef.current = true;

    const localActivities = JSON.parse(
      localStorage.getItem(ACTIVITY_LOG_KEY) || "[]",
    );
    const localStatus = JSON.parse(
      localStorage.getItem(RESOURCE_STATUS_KEY) || "{}",
    );
    if (localActivities.length > 0) {
      setActivities(localActivities);
      setResourceStatus(localStatus);
    }
    setLoading(false);

    loadActivities();
  }, [userId, loadActivities]);

  // Supabase Realtime - singleton: solo se subscribe una vez
  useEffect(() => {
    if (!userId || realtimeInitRef.current) return;
    realtimeInitRef.current = true;

    realtimeChannel = supabase
      .channel(`activity-${userId}-${Date.now()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_log",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setActivities((prev) => [payload.new, ...prev]);
          if (updateResourceStatusRef.current)
            updateResourceStatusRef.current(
              payload.new.resource_id,
              payload.new,
            );
        },
      )
      .subscribe();

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
        realtimeSubscribed = false;
      }
    };
  }, [userId]);

  return {
    activities,
    resourceStatus,
    loading,
    trackActivity,
    markInProgress,
    getModuleActivities,
    getModuleScore,
    getResourceStatus,
    getAllActivities,
    getStudentStats,
    getTimeTrackingStats,
    refresh: loadActivities,
  };
};

export default useActivityTracker;
