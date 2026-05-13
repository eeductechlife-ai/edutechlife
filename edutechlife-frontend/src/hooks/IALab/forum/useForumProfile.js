import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

export const useForumProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [hoverProfile, setHoverProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) return null;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.warn('Error loading profile:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMyProfile = useCallback(async () => {
    if (!user) return null;
    const data = await loadProfile(user.id);
    setProfile(data);
    return data;
  }, [user, loadProfile]);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, error: 'No autenticado' };
    try {
      const { data, error } = await supabase
        .from('forum_profiles')
        .upsert({
          user_id: user.id,
          full_name: user.fullName || user.email || 'Usuario',
          avatar_url: user.imageUrl || null,
          ...updates,
          last_active: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, profile: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const showHoverProfile = useCallback(async (userId) => {
    if (!userId) return;
    const data = await loadProfile(userId);
    setHoverProfile(data);
  }, [loadProfile]);

  const hideHoverProfile = useCallback(() => {
    setHoverProfile(null);
  }, []);

  const getLevel = (reputation) => {
    if (!reputation) return { level: 1, title: 'Novato', color: '#94A3B8' };
    if (reputation < 10) return { level: 1, title: 'Novato', color: '#94A3B8' };
    if (reputation < 50) return { level: 2, title: 'Aprendiz', color: '#4DA8C4' };
    if (reputation < 100) return { level: 3, title: 'Contribuidor', color: '#00BCD4' };
    if (reputation < 250) return { level: 4, title: 'Experto', color: '#10B981' };
    if (reputation < 500) return { level: 5, title: 'Líder', color: '#8B5CF6' };
    return { level: 6, title: 'Maestro', color: '#FFD166' };
  };

  const getReputationBreakdown = (profile) => {
    if (!profile) return [];
    return [
      { label: 'Posts', value: profile.post_count || 0, icon: 'fa-comment' },
      { label: 'Comentarios', value: profile.comment_count || 0, icon: 'fa-reply' },
      { label: 'Likes recibidos', value: profile.likes_received || 0, icon: 'fa-heart' },
      { label: 'Respuestas', value: profile.answers_received || 0, icon: 'fa-check' },
    ];
  };

  return {
    profile,
    hoverProfile,
    isLoading,
    loadProfile,
    loadMyProfile,
    updateProfile,
    showHoverProfile,
    hideHoverProfile,
    getLevel,
    getReputationBreakdown,
  };
};

export default useForumProfile;
