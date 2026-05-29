import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useAuth } from '../../../context/AuthContext';
import { POST_CATEGORIES } from '../../../hooks/IALab/forum/useForumPosts';
import IALabForumCreatePost from './IALabForumCreatePost';
import IALabForumFilterBar from './IALabForumFilterBar';
import IALabForumSearchBar from './IALabForumSearchBar';
import IALabForumPostList from './IALabForumPostList';
import IALabForumPostDetail from './IALabForumPostDetail';
import IALabForumNotifications from './IALabForumNotifications';
import { useTranslation } from '../../../i18n/I18nProvider';

const IALabCommunityHub = ({ onAction }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setShowCreatePost(false);
    setRefreshKey(k => k + 1);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative"
    >
      <div className="absolute -top-6 -right-6 w-48 h-48 bg-gradient-to-br from-petroleum/5 to-corporate/3 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-gradient-to-tr from-petroleum/3 to-corporate/2 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        {selectedPost ? (
          <IALabForumPostDetail
            post={selectedPost}
            onBack={handleBackToList}
            onAction={onAction}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center shadow-sm">
                  <Icon name="fa-comments" className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-petroleum">{t('ialab.forum.hub.title')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('ialab.forum.hub.subtitle')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IALabForumNotifications />
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCreatePost(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-medium hover:shadow-lg hover:shadow-petroleum/20 transition-all duration-200 flex items-center gap-2"
                  >
                    <Icon name="fa-plus" className="text-xs" />
                    <span className="hidden sm:inline">{t('ialab.forum.hub.new_post')}</span>
                  </motion.button>
                )}
              </div>
            </div>

            <IALabForumSearchBar />
            <IALabForumFilterBar />

            <IALabForumPostList
              key={refreshKey}
              onSelectPost={(post) => setSelectedPost(post)}
              onAction={onAction}
            />
          </>
        )}
      </div>

      <AnimatePresence>
        {showCreatePost && (
          <IALabForumCreatePost
            onClose={() => setShowCreatePost(false)}
            onCreated={handlePostCreated}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IALabCommunityHub;
