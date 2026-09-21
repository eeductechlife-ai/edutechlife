import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

// supabase realtime deduplica canales por topic: dos instancias del hook en la
// misma página compartirían el MISMO canal y el segundo .on() lanzaría
// "cannot add postgres_changes callbacks ... after subscribe()", tumbando el
// error boundary IALabContent. Cada instancia usa un topic único (patrón
// activity-${userId}-${Date.now()} de useActivityTracker).
let realtimeChannelSeq = 0;

export const useForumNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableExists, setTableExists] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("forum_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        const isTableMissing =
          error.code === "42P01" ||
          error.code === "22P02" ||
          error.code === "42501" ||
          error.code === "PGRST205" ||
          error.message?.includes("Could not find the table") ||
          error.message?.includes("does not exist") ||
          error.message?.includes("relation") ||
          error.status === 404;
        if (isTableMissing) {
          setTableExists(false);
          const local = JSON.parse(
            localStorage.getItem("ialab_forum_notifications") || "[]",
          );
          setNotifications(local);
          setUnreadCount(local.filter((n) => !n.is_read).length);
          return;
        }
        throw error;
      }
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n) => !n.is_read).length);
    } catch (err) {
      const isTableMissing =
        err?.code === "42P01" ||
        err?.code === "22P02" ||
        err?.code === "42501" ||
        err?.code === "PGRST205" ||
        err?.message?.includes("Could not find the table") ||
        err?.message?.includes("does not exist") ||
        err?.message?.includes("relation") ||
        err?.status === 404;
      if (isTableMissing) {
        setTableExists(false);
        const local = JSON.parse(
          localStorage.getItem("ialab_forum_notifications") || "[]",
        );
        setNotifications(local);
        setUnreadCount(local.filter((n) => !n.is_read).length);
        return;
      }
      const msg = err?.message || err?.toString() || "Unknown error";
      console.warn("[FORUM NOTIFICATIONS] Error loading:", msg);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!user) return;
      try {
        const local = JSON.parse(
          localStorage.getItem("ialab_forum_notifications") || "[]",
        );
        if (local.some((n) => n.id === notificationId)) {
          const updated = local.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n,
          );
          localStorage.setItem(
            "ialab_forum_notifications",
            JSON.stringify(updated),
          );
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, is_read: true } : n,
            ),
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
          return;
        }

        await supabase
          .from("forum_notifications")
          .update({ is_read: true })
          .eq("id", notificationId);

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        const isTableMissing =
          err?.code === "42P01" ||
          err?.code === "22P02" ||
          err?.code === "42501" ||
          err?.code === "PGRST205" ||
          err?.message?.includes("Could not find the table") ||
          err?.message?.includes("does not exist") ||
          err?.message?.includes("relation") ||
          err?.status === 404;
        if (isTableMissing) {
          const updated = JSON.parse(
            localStorage.getItem("ialab_forum_notifications") || "[]",
          ).map((n) => (n.id === notificationId ? { ...n, is_read: true } : n));
          localStorage.setItem(
            "ialab_forum_notifications",
            JSON.stringify(updated),
          );
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, is_read: true } : n,
            ),
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
          return;
        }
        const msg = err?.message || err?.toString() || "Unknown error";
        console.warn("[FORUM NOTIFICATIONS] Error marking as read:", msg);
      }
    },
    [user],
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      const local = JSON.parse(
        localStorage.getItem("ialab_forum_notifications") || "[]",
      );
      const updatedLocal = local.map((n) => ({ ...n, is_read: true }));
      localStorage.setItem(
        "ialab_forum_notifications",
        JSON.stringify(updatedLocal),
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      await supabase
        .from("forum_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
    } catch (err) {
      const isTableMissing =
        err?.code === "42P01" ||
        err?.code === "22P02" ||
        err?.code === "42501" ||
        err?.message?.includes("Could not find the table") ||
        err?.message?.includes("does not exist") ||
        err?.message?.includes("relation") ||
        err?.status === 404;
      if (isTableMissing) {
        const updatedLocal = JSON.parse(
          localStorage.getItem("ialab_forum_notifications") || "[]",
        ).map((n) => ({ ...n, is_read: true }));
        localStorage.setItem(
          "ialab_forum_notifications",
          JSON.stringify(updatedLocal),
        );
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
        return;
      }
      const msg = err?.message || err?.toString() || "Unknown error";
      console.warn("[FORUM NOTIFICATIONS] Error marking all as read:", msg);
    }
  }, [user]);

  const subscribeRealtime = useCallback(() => {
    if (!user || !tableExists) return () => {};

    const channelName = `forum-notifications-${user.id.slice(0, 8)}-${++realtimeChannelSeq}`;
    const subscription = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "forum_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((prev) => prev + 1);
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          setTableExists(false);
          subscription.unsubscribe();
        }
      });

    return () => subscription.unsubscribe();
  }, [user, tableExists]);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user, loadNotifications]);

  useEffect(() => {
    const unsub = subscribeRealtime();
    return unsub;
  }, [subscribeRealtime]);

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useForumNotifications;
