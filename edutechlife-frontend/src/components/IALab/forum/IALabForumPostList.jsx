import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import useForumPosts, { POST_CATEGORIES } from '../../../hooks/IALab/forum/useForumPosts';
import useForumVotes from '../../../hooks/IALab/forum/useForumVotes';
import useForumProfile from '../../../hooks/IALab/forum/useForumProfile';
import IALabForumPostCard from './IALabForumPostCard';

const IALabForumPostList = ({ onSelectPost, onAction }) => {
  const {
    posts, isLoading, error, totalCount, hasMore,
    category, setCategory,
    sortBy, setSortBy,
    refreshPosts, loadMore,
  } = useForumPosts();

  const { voteStates, loadVotes, toggleVote, formatCount } = useForumVotes();
  const { showHoverProfile, hideHoverProfile, hoverProfile } = useForumProfile();
  const loaderRef = useRef(null);

  useEffect(() => {
    if (posts.length > 0) {
      loadVotes(posts.map(p => p.id));
    }
  }, [posts, loadVotes]);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const activeCategory = POST_CATEGORIES.find(c => c.id === category);

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl">
          <Icon name="fa-exclamation-triangle" className="text-red-500 text-sm flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
          <button onClick={refreshPosts} className="text-xs text-red-600 hover:text-red-800 font-medium flex-shrink-0">
            Reintentar
          </button>
        </div>
      )}

      {isLoading && posts.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-16" />
                </div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-petroleum/10 to-corporate/10 border border-petroleum/10 flex items-center justify-center mb-4">
            <Icon name="fa-comment-dots" className="text-petroleum text-2xl" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            {category !== 'all'
              ? `No hay posts en "${activeCategory?.label}"`
              : 'Sé el primero en publicar'}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
            {category !== 'all'
              ? 'Intenta cambiar de categoría o crea un nuevo post.'
              : 'Comparte tu experiencia, haz preguntas o ayuda a otros estudiantes.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalCount} {totalCount === 1 ? 'discusión' : 'discusiones'}
            </p>
            <div className="flex items-center gap-1">
              {[
                { id: 'latest', label: 'Recientes' },
                { id: 'popular', label: 'Populares' },
                { id: 'activity', label: 'Actividad' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    sortBy === opt.id
                      ? 'bg-petroleum text-white dark:bg-petroleum dark:text-white'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {posts.map((post, index) => (
            <IALabForumPostCard
              key={post.id}
              post={post}
              voteState={voteStates[post.id]}
              onVote={() => toggleVote(post.id, post.upvotes)}
              onSelect={() => onSelectPost(post)}
              onShowProfile={() => showHoverProfile(post.user_id)}
              onHideProfile={hideHoverProfile}
              formatCount={formatCount}
              index={index}
            />
          ))}

          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-petroleum/20 border-t-petroleum rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IALabForumPostList;
