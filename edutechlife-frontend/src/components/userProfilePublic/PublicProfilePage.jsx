import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { supabase } from '../../lib/supabase';
import { useAuthIdentity } from '../../hooks/useAuthIdentity';
import { useProfileData } from '../userProfileSmartCard/useProfileData';
import { resolveAvatarUrl } from '../userProfileSmartCard/resolveAvatar';
import { shouldDisableSave } from '../userProfileSmartCard/profileSaveLogic';
import ProfileInfoSection from '../userProfileSmartCard/components/ProfileInfoSection';
import useForumProfile from '../../hooks/IALab/forum/useForumProfile';
import { useTranslation } from '../../i18n/I18nProvider';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const { userId: currentUserId } = useAuthIdentity();
  const isOwnProfile = currentUserId && userId === currentUserId;

  if (isOwnProfile) return <OwnProfileView />;
  return <OtherProfileView userId={userId} t={t} />;
};

const OwnProfileView = () => {
  const navigate = useNavigate();
  const {
    t,
    profileData,
    stats,
    isLoading,
    editingField,
    tempValue,
    isSaving,
    saveMessage,
    phoneError,
    nameInputRef,
    phoneInputRef,
    getUserInitials,
    getRoleLabel,
    getRoleBadgeColor,
    hasPendingChanges,
    formatDate,
    displayEmail,
    displayName,
    startEditing,
    handleTempChange,
    handleCancelEdit,
    handleSaveAll,
    handleOpenChangePassword,
  } = useProfileData({ isOpen: true, onClose: () => navigate(-1), onOpenChangeAvatar: null });

  const avatarUrl = resolveAvatarUrl(profileData);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 p-6 animate-pulse">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-20" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto p-4 pb-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#004B63] to-[#00BCD4] px-5 pt-6 pb-12">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label={t('common.back')}
          >
            <Icon name="fa-arrow-left" className="text-sm" />
          </button>
          <div className="flex flex-col items-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-3 border-white/30 shadow-lg mb-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-3 border-white/30 shadow-lg mb-2">
                <span className="text-white font-bold text-xl">{getUserInitials()}</span>
              </div>
            )}
            <h2 className="text-white font-bold text-sm text-center leading-tight">{displayName}</h2>
            <span className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${getRoleBadgeColor(profileData.role)}`}>
              {getRoleLabel(profileData.role)}
            </span>
          </div>
        </div>

        <div className="p-4 -mt-6">
          <div className="mb-4 p-3 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 border border-[#004B63]/10 rounded-xl">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-graduation-cap" className="text-[#004B63] text-xs" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{t('profile.enrolled_course')}</p>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug mt-0.5">{t('profile.course_name')}</p>
                {stats.enrollmentDate && (
                  <p className="text-[9px] text-slate-500 mt-0.5">{t('profile.enrolled_from', { date: formatDate(stats.enrollmentDate) })}</p>
                )}
              </div>
            </div>
          </div>

          <ProfileInfoSection
            t={t}
            profileData={profileData}
            editingField={editingField}
            tempValue={tempValue}
            phoneError={phoneError}
            isSaving={isSaving}
            displayEmail={displayEmail}
            displayName={displayName}
            nameInputRef={nameInputRef}
            phoneInputRef={phoneInputRef}
            startEditing={startEditing}
            handleTempChange={handleTempChange}
            handleCancelEdit={handleCancelEdit}
          />

          {hasPendingChanges() && (
            <div className="mb-4">
              <button
                onClick={handleSaveAll}
                disabled={shouldDisableSave({ isSaving })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Icon name="fa-spinner" className="animate-spin" />
                    {t('profile.saving')}
                  </>
                ) : (
                  <>
                    <Icon name="fa-save" />
                    {t('profile.save_button')}
                  </>
                )}
              </button>
            </div>
          )}

          {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg border ${saveMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <p className={`text-xs flex items-center gap-2 ${saveMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                <Icon name={saveMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} />
                {saveMessage.text}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Icon name="fa-cog" className="text-[#004B63] text-xs" />
              {t('profile.actions_title')}
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleOpenChangePassword}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-key" className="text-[#004B63] text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t('mobile_menu.change_password')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OtherProfileView = ({ userId, t }) => {
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
