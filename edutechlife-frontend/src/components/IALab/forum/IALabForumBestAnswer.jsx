import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useAuth } from '../../../context/AuthContext';

const getBestKey = (postId) => `forum_best_answer_${postId}`;

const BestAnswerContext = createContext(null);
export const useBestAnswer = () => useContext(BestAnswerContext);

const IALabForumBestAnswer = ({ postId, postAuthorId, comments, children }) => {
  const { user } = useAuth();
  const [bestAnswerId, setBestAnswerId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getBestKey(postId));
      if (stored) setBestAnswerId(stored);
    } catch {}
  }, [postId]);

  const markAsBest = useCallback((commentId) => {
    try { localStorage.setItem(getBestKey(postId), commentId); } catch {}
    setBestAnswerId(commentId);
  }, [postId]);

  const unmarkBest = useCallback(() => {
    try { localStorage.removeItem(getBestKey(postId)); } catch {}
    setBestAnswerId(null);
  }, [postId]);

  const bestComment = bestAnswerId
    ? comments?.find(c => c.id === bestAnswerId || c.id?.toString() === bestAnswerId?.toString())
    : null;

  return (
    <BestAnswerContext.Provider value={{ bestAnswerId, markAsBest, unmarkBest, postAuthorId }}>
      {bestComment && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-600 bg-emerald-50/80 dark:bg-emerald-900/20"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="fa-check" className="text-emerald-500 text-xs" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Solución
            </span>
            {user?.id === postAuthorId && (
              <button
                onClick={unmarkBest}
                className="ml-auto text-[10px] text-slate-500 hover:text-red-500 transition-colors px-2 py-0.5 rounded"
              >
                <Icon name="fa-x" className="mr-0.5 text-[8px]" />
                Quitar
              </button>
            )}
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">
                {(bestComment.profiles?.full_name || '?').split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {bestComment.profiles?.full_name || 'Usuario'}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{bestComment.content}</p>
            </div>
          </div>
        </motion.div>
      )}
      {children}
    </BestAnswerContext.Provider>
  );
};

IALabForumBestAnswer.propTypes = {
  postId: PropTypes.string,
  postAuthorId: PropTypes.string,
  comments: PropTypes.array,
  children: PropTypes.node,
};

export default IALabForumBestAnswer;
