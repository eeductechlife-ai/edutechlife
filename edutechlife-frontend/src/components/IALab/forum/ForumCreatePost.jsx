import { useState, useCallback } from 'react';
import { useTranslation } from '../../../i18n/I18nProvider';
import { Icon } from '../../../utils/iconMapping.jsx';

export const ForumCreatePost = ({ onCreatePost }) => {
  const { t } = useTranslation();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    setIsCreating(true);
    await onCreatePost(newPostTitle.trim(), newPostContent.trim());
    setNewPostTitle('');
    setNewPostContent('');
    setIsCreating(false);
  }, [newPostTitle, newPostContent, onCreatePost]);

  return (
    <div className="mb-8 bg-white rounded-2xl p-6 border border-corporate/20 shadow-[0_8px_32px_rgba(0,188,212,0.1)]">
      <h3 className="text-lg font-bold text-petroleum-darker mb-4">{t('ialab.forum.section.post_input_title')}</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder={t('ialab.forum.section.post_input_title_placeholder')}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-corporate focus:border-transparent text-petroleum-darker placeholder-slate-500"
          disabled={isCreating}
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value.slice(0, 500))}
          placeholder={t('ialab.forum.section.post_input_content_placeholder')}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-corporate focus:border-transparent text-petroleum-darker placeholder-slate-500 min-h-[120px] resize-none"
          disabled={isCreating}
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {t('ialab.forum.section.char_count', { count: newPostContent.length })}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isCreating || !newPostTitle.trim() || !newPostContent.trim()}
            className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('ialab.forum.section.publishing')}
              </>
            ) : (
              <>
                <Icon name="fa-paper-plane" />
                {t('ialab.forum.section.publish')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
