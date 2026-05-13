import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import useForumComments from '../../../hooks/IALab/forum/useForumComments';
import IALabForumCommentThread from './IALabForumCommentThread';
import IALabForumRichEditor from './IALabForumRichEditor';

const IALabForumPostDetail = ({ post, onBack, onAction }) => {
  const { comments, isLoading, loadComments, addComment } = useForumComments();

  useEffect(() => {
    if (post?.id) loadComments(post.id);
  }, [post?.id, loadComments]);

  const handleAddComment = async (content) => {
    if (!content?.trim()) return;
    await addComment({ postId: post.id, content: content.trim() });
  };

  const handleAddReply = async (parentId, content) => {
    if (!content?.trim()) return;
    await addComment({ postId: post.id, content: content.trim(), parentId });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-petroleum dark:hover:text-[#4DA8C4] transition-colors mb-3"
        >
          <Icon name="fa-arrow-left" className="text-[10px]" />
          Volver a la comunidad
        </button>

        <div className="flex items-center gap-2 mb-2">
          {post.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-petroleum/5 text-petroleum dark:text-[#4DA8C4] text-[10px] font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{post.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon name="fa-heart" />
            <span>{post.upvotes || 0} likes</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon name="fa-comment" />
            <span>{post.comment_count || 0} comentarios</span>
          </div>
          <span className="text-xs text-slate-400">
            {new Date(post.created_at).toLocaleDateString('es-ES', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Icon name="fa-comments" className="text-corporate text-xs" />
          Comentarios ({post.comment_count || 0})
        </h4>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-petroleum/20 border-t-petroleum rounded-full animate-spin" />
          </div>
        ) : (
          <IALabForumCommentThread
            comments={comments[post.id] || []}
            onReply={handleAddReply}
            depth={0}
          />
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <IALabForumRichEditor
            placeholder="Escribe un comentario..."
            onSubmit={handleAddComment}
            buttonLabel="Comentar"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default IALabForumPostDetail;
