import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import IALabForumRichEditor from './IALabForumRichEditor';
import { useTranslation } from '../../../i18n/I18nProvider';

const getAvatarGradient = (name) => {
  if (!name) return 'from-petroleum to-petroleum-dark';
  const colors = [
    'from-petroleum to-petroleum-dark',
    'from-petroleum-dark to-corporate',
    'from-petroleum to-corporate',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
};

const formatRelativeTime = (dateString, t) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  if (diffMins < 1) return t('ialab.forum.comment.now');
  if (diffMins < 60) return t('ialab.forum.comment.min_ago', { count: diffMins });
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t('ialab.forum.comment.hour_ago', { count: diffHours });
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return t('ialab.forum.comment.day_ago', { count: diffDays });
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const IALabForumComment = ({ comment, onReply, depth, children }) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const profile = comment.profiles || {};
  const { t } = useTranslation();

  const handleSubmitReply = async (content) => {
    if (!content?.trim()) return;
    await onReply(comment.id, content.trim());
    setShowReplyEditor(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50 hover:border-petroleum/10 transition-colors"
    >
      <div className="flex items-start gap-2.5">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarGradient(profile.full_name)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className="text-[9px] font-bold text-white">{getInitials(profile.full_name)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {profile.full_name || t('ialab.forum.comment.user_fallback')}
            </span>
            {comment.is_edited && (
              <span className="text-[9px] text-slate-600">· {t('ialab.forum.comment.edited')}</span>
            )}
            <span className="text-[9px] text-slate-600 ml-auto">
              {formatRelativeTime(comment.created_at, t)}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-2 mt-1.5">
            <button
              onClick={() => setShowReplyEditor(!showReplyEditor)}
              className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-petroleum transition-colors"
            >
              <Icon name="fa-reply" className="text-[9px]" />
              {t('ialab.forum.comment.reply_btn')}
            </button>
          </div>

          {showReplyEditor && (
            <div className="mt-2">
              <IALabForumRichEditor
                placeholder={t('ialab.forum.comment.reply_placeholder')}
                onSubmit={handleSubmitReply}
                buttonLabel={t('ialab.forum.comment.reply_btn')}
                compact
                onCancel={() => setShowReplyEditor(false)}
              />
            </div>
          )}
        </div>
      </div>

      {children}
    </motion.div>
  );
};

export default IALabForumComment;
