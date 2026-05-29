import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useAuth } from '../../../context/AuthContext';
import useForumProfile from '../../../hooks/IALab/forum/useForumProfile';
import { useTranslation } from '../../../i18n/I18nProvider';

const BOOKMARKS_KEY = 'ialab_forum_bookmarks';

const getBookmarks = () => {
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]'); } catch { return []; }
};
const toggleBookmark = (postId) => {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(postId);
  if (idx >= 0) bookmarks.splice(idx, 1); else bookmarks.push(postId);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return idx < 0;
};

const CATEGORY_STYLES = {
  question: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', icon: 'fa-question-circle' },
  discussion: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: 'fa-comment-dots' },
  resource: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', icon: 'fa-book' },
  announcement: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', icon: 'fa-bullhorn' },
  feedback: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400', icon: 'fa-lightbulb' },
};

const getAvatarGradient = (name) => {
  if (!name) return 'from-petroleum to-petroleum-dark';
  const colors = [
    'from-petroleum to-petroleum-dark',
    'from-petroleum-dark to-corporate',
    'from-petroleum to-corporate',
    'from-petroleum-dark to-corporate',
    'from-petroleum to-petroleum-dark',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
};

const formatRelativeTime = (dateString, t, locale) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('ialab.forum.post_card.now');
  if (diffMins < 60) return t('ialab.forum.post_card.min_ago', { mins: diffMins });
  if (diffHours < 24) return t('ialab.forum.post_card.hour_ago', { hours: diffHours });
  if (diffDays < 7) return t('ialab.forum.post_card.day_ago', { days: diffDays });
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short' });
};

const IALabForumPostCard = ({
  post,
  voteState,
  onVote,
  onSelect,
  onShowProfile,
  onHideProfile,
  formatCount,
  index,
}) => {
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const categoryStyle = CATEGORY_STYLES[post.category] || CATEGORY_STYLES.discussion;

  useEffect(() => {
    setIsBookmarked(getBookmarks().includes(post.id));
  }, [post.id]);

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/ialab/forum/${post.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, text: post.content?.slice(0, 100), url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 2000);
      } catch {}
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    const now = toggleBookmark(post.id);
    setIsBookmarked(now);
  };

  const profile = post.profiles || post.forum_profiles || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:border-petroleum/20 dark:hover:border-petroleum/40 hover:shadow-md transition-all duration-200 cursor-pointer group relative"
      onClick={onSelect}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-petroleum/0 via-petroleum/20 to-corporate/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="relative flex-shrink-0"
            onMouseEnter={() => { setShowProfileCard(true); onShowProfile(); }}
            onMouseLeave={() => { setShowProfileCard(false); onHideProfile(); }}
          >
            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarGradient(profile.full_name)} flex items-center justify-center shadow-sm`}>
              <span className="text-xs font-bold text-white">{getInitials(profile.full_name)}</span>
            </div>
            {profile.badges?.length > 0 && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                <Icon name="fa-star" className="text-[6px] text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {profile.full_name || post.user_name || t('ialab.forum.post_card.user_fallback')}
              </span>
              {profile.title && !['Estudiante', 'Student'].includes(profile.title) && (
                <span className="px-1.5 py-0.5 bg-petroleum/5 text-petroleum text-[9px] font-medium rounded-full flex-shrink-0">
                  {profile.title}
                </span>
              )}
              <span className="text-[10px] text-slate-600 dark:text-slate-500 flex-shrink-0">
                {formatRelativeTime(post.created_at, t, locale)}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}>
                <Icon name={categoryStyle.icon} className="mr-0.5" />
                {getCategoryLabel(post.category, t)}
              </span>
              {post.tags?.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[9px] text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
              {post.tags?.length > 2 && (
                <span className="text-[9px] text-slate-600">+{post.tags.length - 2}</span>
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 leading-snug group-hover:text-petroleum transition-colors">
              {post.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-snug">
              {post.content}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); onVote(); }}
              disabled={!user || voteState?.isLoading}
              className={`flex items-center gap-1 text-xs font-medium transition-all ${
                voteState?.userVoted
                  ? 'text-red-500'
                  : 'text-slate-600 hover:text-red-400'
              } disabled:opacity-50`}
            >
              {voteState?.isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-petroleum/20 border-t-petroleum rounded-full animate-spin" />
              ) : (
                <Icon name={voteState?.userVoted ? 'fa-heart' : 'fa-heart'} />
              )}
              <span>{formatCount(voteState?.userVoted ? (post.upvotes || 0) : (post.upvotes || 0))}</span>
            </button>

            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Icon name="fa-comment" />
              <span>{post.comment_count || 0}</span>
            </div>

            {post.updated_at && new Date(post.updated_at) > new Date(post.created_at) && (
              <span className="text-[9px] text-slate-600">{t('ialab.forum.post_card.edited_label')}</span>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleShare} className="text-xs text-slate-600 hover:text-petroleum transition-colors relative">
              <Icon name={shareFeedback ? 'fa-check' : 'fa-share'} />
              {shareFeedback && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-medium text-emerald-600 whitespace-nowrap">{t('ialab.forum.post_card.copied_tooltip')}</span>
              )}
            </button>
            <button onClick={handleBookmark} className={`text-xs transition-colors ${isBookmarked ? 'text-amber-500' : 'text-slate-600 hover:text-amber-500'}`}>
              <Icon name={isBookmarked ? 'fa-bookmark' : 'fa-bookmark'} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getCategoryLabel = (category, t) => {
  const labels = {
    question: t('ialab.forum.post_card.category_question'),
    discussion: t('ialab.forum.post_card.category_discussion'),
    resource: t('ialab.forum.post_card.category_resource'),
    announcement: t('ialab.forum.post_card.category_announcement'),
    feedback: t('ialab.forum.post_card.category_feedback'),
  };
  return labels[category] || labels.discussion;
};

export default IALabForumPostCard;
