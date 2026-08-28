import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuthIdentity } from "../hooks/useAuthIdentity";
import { supabase } from "../lib/supabase";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  // Identidad desde la sesion de Supabase (Clerk ya no autentica).
  const { userId } = useAuthIdentity();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Merge local_ notifications (localStorage fallback) with remote rows, newest first.
  const mergeLocalNotifications = (remote) => {
    let local = [];
    try {
      local = JSON.parse(
        localStorage.getItem("ialab_notifications") || "[]",
      ).filter((n) => n?.id?.startsWith("local_"));
    } catch {
      local = [];
    }
    if (!local.length) return remote;
    return [...local, ...remote].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  };

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications(mergeLocalNotifications([]));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        if (
          error.code === "42P01" ||
          error.code === "22P02" ||
          error.code === "42501" ||
          error.message?.includes("uuid") ||
          error.message?.includes("UUID")
        ) {
          console.warn(
            "[NOTIFICATIONS] Supabase fetch error, loading from localStorage:",
            error.code,
          );
          const local = JSON.parse(
            localStorage.getItem("ialab_notifications") || "[]",
          );
          setNotifications(local);
          return;
        }
        throw error;
      }
      // Merge locally-stored notifications (created via the localStorage fallback,
      // e.g. when Supabase is unreachable) so they aren't dropped by the remote fetch.
      setNotifications(mergeLocalNotifications(data || []));
    } catch (err) {
      const msg = err?.message || err?.toString() || "Unknown error";
      console.error("[NOTIFICATIONS] Error fetching:", msg);
      setNotifications(mergeLocalNotifications([]));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    let retryCount = 0;
    const MAX_RETRIES = 5;
    let retryTimer = null;
    let pollingTimer = null;
    let heartbeatTimer = null;
    let channel = null;
    let mounted = true;

    const setupChannel = () => {
      try {
        channel = supabase
          .channel("notification-changes")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              setNotifications((prev) => [payload.new, ...prev]);
            },
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === payload.new.id ? payload.new : n)),
              );
            },
          )
          .subscribe((status) => {
            if (!mounted) return;
            if (status === "CHANNEL_ERROR") {
              console.warn("[NOTIFICATIONS] Realtime subscription error");
              cleanup();
              if (retryCount < MAX_RETRIES) {
                retryCount++;
                const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
                retryTimer = setTimeout(setupChannel, delay);
              } else {
                console.warn(
                  "[NOTIFICATIONS] Max retries reached, falling back to polling",
                );
                pollingTimer = setInterval(fetchNotifications, 30000);
              }
            }
            if (status === "SUBSCRIBED") {
              retryCount = 0;
            }
          });
      } catch (err) {
        console.warn(
          "[NOTIFICATIONS] Realtime setup failed, using polling:",
          err?.message,
        );
        if (mounted) {
          pollingTimer = setInterval(fetchNotifications, 30000);
        }
      }
    };

    const cleanup = () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
    };

    setupChannel();

    heartbeatTimer = setInterval(async () => {
      if (!mounted) return;
      if (!channel) return;
      const { error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .limit(0)
        .eq("user_id", userId);
      if (error && error.code === "42P01") return;
      if (error && !mounted) return;
      if (error) {
        cleanup();
        setupChannel();
      }
    }, 60000);

    return () => {
      mounted = false;
      cleanup();
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    };
  }, [userId, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      if (id.startsWith("local_")) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n,
          ),
        );
        const local = JSON.parse(
          localStorage.getItem("ialab_notifications") || "[]",
        );
        const updated = local.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n,
        );
        localStorage.setItem("ialab_notifications", JSON.stringify(updated));
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        if (error.code !== "42P01") throw error;
        return;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n,
        ),
      );
    } catch (err) {
      const msg = err?.message || err?.toString() || "Unknown error";
      console.error("[NOTIFICATIONS] Error marking as read:", msg);
    }
  };

  const markAllAsRead = async () => {
    try {
      const local = JSON.parse(
        localStorage.getItem("ialab_notifications") || "[]",
      );
      const updatedLocal = local.map((n) => ({
        ...n,
        is_read: true,
        read_at: new Date().toISOString(),
      }));
      localStorage.setItem("ialab_notifications", JSON.stringify(updatedLocal));

      const supabaseIds = notifications
        .filter((n) => !n.id.startsWith("local_"))
        .map((n) => n.id);

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        })),
      );

      if (supabaseIds.length > 0) {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in("id", supabaseIds);

        if (error && error.code !== "42P01") {
          console.error(
            "[NOTIFICATIONS] Error updating Supabase:",
            error.message,
          );
        }
      }
    } catch (err) {
      const msg = err?.message || err?.toString() || "Unknown error";
      console.error("[NOTIFICATIONS] Error marking all as read:", msg);
    }
  };

  const dismissNotification = async (id) => {
    try {
      if (id.startsWith("local_")) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        const local = JSON.parse(
          localStorage.getItem("ialab_notifications") || "[]",
        );
        localStorage.setItem(
          "ialab_notifications",
          JSON.stringify(local.filter((n) => n.id !== id)),
        );
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        if (error.code !== "42P01") throw error;
        return;
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      const msg = err?.message || err?.toString() || "Unknown error";
      console.error("[NOTIFICATIONS] Error dismissing:", msg);
    }
  };

  const clearAllNotifications = async () => {
    try {
      localStorage.removeItem("ialab_notifications");
      setNotifications([]);

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId);

      if (error && error.code !== "42P01") {
        console.error(
          "[NOTIFICATIONS] Error clearing Supabase:",
          error.message,
        );
      }
    } catch (err) {
      const msg = err?.message || err?.toString() || "Unknown error";
      console.error("[NOTIFICATIONS] Error clearing:", msg);
    }
  };

  // localStorage fallback used when Supabase errors, is unreachable, or times out.
  const saveLocalNotification = ({ type, title, message, metadata }) => {
    const localNotif = {
      id: `local_${Date.now()}`,
      user_id: userId,
      type,
      title,
      message,
      metadata,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    try {
      const local = JSON.parse(
        localStorage.getItem("ialab_notifications") || "[]",
      );
      local.unshift(localNotif);
      localStorage.setItem(
        "ialab_notifications",
        JSON.stringify(local.slice(0, 50)),
      );
    } catch {
      /* quota — still surface in-memory below */
    }
    setNotifications((prev) => [localNotif, ...prev]);
    return localNotif;
  };

  const createNotification = async ({
    type,
    title,
    message,
    metadata = {},
  }) => {
    if (!userId) return;

    // Race the insert against a timeout so an unreachable/slow Supabase never
    // hangs the caller forever — fall back to localStorage instead.
    const TIMEOUT_MS = 5000;
    const insert = supabase
      .from("notifications")
      .insert({ user_id: userId, type, title, message, metadata })
      .select("*")
      .single();
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve({ __timedOut: true }), TIMEOUT_MS),
    );

    try {
      const result = await Promise.race([insert, timeout]);

      if (result?.__timedOut) {
        console.warn(
          "[NOTIFICATIONS] Supabase insert timed out, using localStorage fallback",
        );
        return saveLocalNotification({ type, title, message, metadata });
      }

      const { data, error } = result;
      if (error) {
        if (
          error.code === "42P01" ||
          error.code === "22P02" ||
          error.code === "23503" ||
          error.code === "42501" ||
          error.message?.includes("uuid") ||
          error.message?.includes("UUID")
        ) {
          console.warn(
            "[NOTIFICATIONS] Supabase error, using localStorage fallback:",
            error.code,
            error.message,
          );
          return saveLocalNotification({ type, title, message, metadata });
        }
        throw error;
      }
      return data;
    } catch (err) {
      const msg = err?.message || err?.toString() || "Unknown error";
      console.error("[NOTIFICATIONS] Error creating:", msg);
      // Last resort: never lose the notification on an unexpected failure.
      return saveLocalNotification({ type, title, message, metadata });
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const [preferences, setPrefs] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ialab_notif_prefs") ||
          '{"push":true,"reminders":true,"forum":true}',
      );
    } catch {
      return { push: true, reminders: true, forum: true };
    }
  });

  const updatePreferences = useCallback((p) => {
    setPrefs(p);
    localStorage.setItem("ialab_notif_prefs", JSON.stringify(p));
  }, []);

  const studyReminderRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    const checkReminder = () => {
      if (!preferences.reminders) return;
      const lastActivity = localStorage.getItem("ialab_last_activity_date");
      if (!lastActivity) return;
      const daysSince = Math.floor(
        (Date.now() - new Date(lastActivity).getTime()) / 86400000,
      );
      if (daysSince < 2) return;
      const lastReminder = localStorage.getItem("ialab_last_study_reminder");
      if (lastReminder === new Date().toDateString()) return;
      if (daysSince >= 7) {
        createNotification({
          type: "lesson_reminder",
          title: "📚 ¡Una semana sin estudiar!",
          message: "Han pasado 7+ días. Vuelve hoy para no perder tu progreso.",
          metadata: { moduleId: 1 },
        });
      } else if (daysSince >= 2) {
        createNotification({
          type: "lesson_reminder",
          title: "📚 Te esperamos en IALab",
          message: `${daysSince} días sin actividad. Una lección rápida mantiene tu racha.`,
          metadata: { moduleId: 1 },
        });
      }
      localStorage.setItem(
        "ialab_last_study_reminder",
        new Date().toDateString(),
      );
    };
    studyReminderRef.current = setInterval(checkReminder, 6 * 3600000);
    checkReminder();
    return () => {
      if (studyReminderRef.current) clearInterval(studyReminderRef.current);
    };
  }, [userId, createNotification, preferences.reminders]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAllNotifications,
        createNotification,
        refresh: fetchNotifications,
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
