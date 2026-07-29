import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { supabase } from '../../lib/supabase';
import useForumProfile from '../../hooks/IALab/forum/useForumProfile';
import { useTranslation } from '../../i18n/I18nProvider';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const { loadProfile, getLevel, getReputationBreakdown } = useForumProfile();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    Promise.all([
      loadProfile(userId),
      supabase.from('forum_posts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
    ]).then(([profileData, { data: postsData }]) => {
      setProfile(profileData);
      setPosts(postsData || []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, [userId, loadProfile]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-20" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 p-8">
          <Icon name="fa-user" className="text-4xl text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{t('common.user_not_found')}</h3>
        </div>
      </div>
    );
  }

  const level = getLevel(profile.reputation);
  const stats = getReputationBreakdown(profile);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-petroleum to-corporate" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-petroleum-dark to-corporate flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-md">
              <span className="text-xl font-bold text-white">
                {(profile.full_name || '?').split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2)}
              </span>
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{profile.full_name}</h2>
              <span className="text-xs font-medium" style={{ color: level.color }}>
                <Icon name="fa-crown" className="mr-1" />
                {level.title} · Nivel {level.level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-petroleum/5 dark:bg-petroleum/10 border border-petroleum/10 text-center">
                <p className="text-lg font-bold text-petroleum">{s.value}</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>

          {posts.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Icon name="fa-file-text" className="text-corporate text-xs" />
                Posts recientes
              </h4>
              <div className="space-y-2">
                {posts.map(post => (
                  <div key={post.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{post.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PublicProfilePage;
