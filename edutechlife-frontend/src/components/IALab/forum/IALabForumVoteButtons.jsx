import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useAuth } from '../../../context/AuthContext';

const getDownvoteKey = (postId) => `forum_downvote_${postId}`;

const IALabForumVoteButtons = ({ postId, upvotes, voteState, onVote, size }) => {
  const { user } = useAuth();
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    try { setDownvoted(localStorage.getItem(getDownvoteKey(postId)) === 'true'); } catch {}
  }, [postId]);

  const handleDownvote = (e) => {
    e.stopPropagation();
    if (!user) return;
    const next = !downvoted;
    setDownvoted(next);
    try { localStorage.setItem(getDownvoteKey(postId), next); } catch {}
  };

  const isUpvoted = voteState?.userVoted;
  const displayCount = Math.max(0, (upvotes || 0) - (downvoted ? 1 : 0));
  const iconSize = size === 'xs' ? 'text-[10px]' : 'text-xs';
  const btnClass = 'p-1.5 rounded-lg transition-all disabled:opacity-50';

  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => { e.stopPropagation(); onVote(); }}
        disabled={!user || voteState?.isLoading}
        className={`${btnClass} ${isUpvoted ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'}`}
        aria-label="Upvote"
      >
        <Icon name="fa-chevron-up" className={iconSize} />
      </motion.button>
      <span className={`font-bold min-w-[20px] text-center text-xs ${isUpvoted ? 'text-emerald-600' : downvoted ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
        {displayCount}
      </span>
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={handleDownvote}
        disabled={!user}
        className={`${btnClass} ${downvoted ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/10'}`}
        aria-label="Downvote"
      >
        <Icon name="fa-chevron-down" className={iconSize} />
      </motion.button>
    </div>
  );
};

IALabForumVoteButtons.propTypes = {
  postId: PropTypes.string,
  upvotes: PropTypes.number,
  voteState: PropTypes.object,
  onVote: PropTypes.func,
  size: PropTypes.string,
};

export default IALabForumVoteButtons;
