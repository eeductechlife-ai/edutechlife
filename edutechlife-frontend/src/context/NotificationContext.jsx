import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/react';
import { supabase } from '../lib/supabase';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        if (error.code === '42P01') {
          console.warn('[NOTIFICATIONS] Table does not exist, using empty state');
          setNotifications([]);
          return;
        }
        throw error;
      }
      setNotifications(data || []);
    } catch (err) {
      const msg = err?.message || err?.toString() || 'Unknown error';
      console.error('[NOTIFICATIONS] Error fetching:', msg);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    // Supabase Realtime
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new : n))
          );
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('[NOTIFICATIONS] Realtime subscription error');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        if (error.code !== '42P01') throw error;
        return;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      const msg = err?.message || err?.toString() || 'Unknown error';
      console.error('[NOTIFICATIONS] Error marking as read:', msg);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        if (error.code !== '42P01') throw error;
        return;
      }

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      const msg = err?.message || err?.toString() || 'Unknown error';
      console.error('[NOTIFICATIONS] Error marking all as read:', msg);
    }
  };

  const dismissNotification = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        if (error.code !== '42P01') throw error;
        return;
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      const msg = err?.message || err?.toString() || 'Unknown error';
      console.error('[NOTIFICATIONS] Error dismissing:', msg);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        if (error.code !== '42P01') throw error;
        return;
      }

      setNotifications([]);
    } catch (err) {
      const msg = err?.message || err?.toString() || 'Unknown error';
      console.error('[NOTIFICATIONS] Error clearing:', msg);
    }
  };

  const createNotification = async ({ type, title, message, metadata = {} }) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type,
          title,
          message,
          metadata,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '42P01') {
          console.warn('[NOTIFICATIONS] Table does not exist, cannot create notification');
          return null;
        }
        throw error;
      }
      return data;
    } catch (err) {
      const msg = err?.message || err?.toString() || 'Unknown error';
      console.error('[NOTIFICATIONS] Error creating:', msg);
      return null;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
