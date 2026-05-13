import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

export const useForumNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read).length);
    } catch (err) {
      console.warn('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!user) return;
    try {
      await supabase
        .from('forum_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Error marking notification as read:', err);
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      await supabase
        .from('forum_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Error marking all as read:', err);
    }
  }, [user]);

  const subscribeRealtime = useCallback(() => {
    if (!user) return () => {};

    const subscription = supabase
      .channel('forum-notifications')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user]);

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
