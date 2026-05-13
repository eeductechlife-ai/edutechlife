import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

export const useForumVotes = () => {
  const { user } = useAuth();
  const [voteStates, setVoteStates] = useState({});

  const loadVotes = useCallback(async (postIds) => {
    if (!user || !postIds.length) return;
    try {
      const { data: votes } = await supabase
        .from('forum_votes')
        .select('post_id, vote_type')
        .in('post_id', postIds)
        .eq('user_id', user.id);

      const states = {};
      (votes || []).forEach(v => {
        states[v.post_id] = { userVoted: true, voteType: v.vote_type, isLoading: false };
      });
      postIds.forEach(id => {
        if (!states[id]) states[id] = { userVoted: false, voteType: null, isLoading: false };
      });
      setVoteStates(prev => ({ ...prev, ...states }));
    } catch (err) {
      console.warn('Error loading votes:', err);
    }
  }, [user]);

  const toggleVote = useCallback(async (postId, currentUpvotes) => {
    if (!user) return { success: false, error: 'No autenticado' };

    const current = voteStates[postId] || { userVoted: false, voteType: null };
    const isRemovingVote = current.userVoted;

    setVoteStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], isLoading: true },
    }));

    try {
      let newCount = currentUpvotes || 0;

      if (isRemovingVote) {
        newCount = Math.max(0, newCount - 1);
        const { error: deleteError } = await supabase
          .from('forum_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        if (deleteError) throw deleteError;
      } else {
        newCount = newCount + 1;
        const { error: insertError } = await supabase
          .from('forum_votes')
          .insert({ post_id: postId, user_id: user.id, vote_type: 'upvote' });
        if (insertError) throw insertError;
      }

      await supabase
        .from('forum_posts')
        .update({ upvotes: newCount })
        .eq('id', postId);

      setVoteStates(prev => ({
        ...prev,
        [postId]: { userVoted: !isRemovingVote, voteType: isRemovingVote ? null : 'upvote', isLoading: false },
      }));

      return { success: true, newCount, userVoted: !isRemovingVote };
    } catch (err) {
      setVoteStates(prev => ({
        ...prev,
        [postId]: { ...prev[postId], isLoading: false },
      }));
      return { success: false, error: err.message };
    }
  }, [user, voteStates]);

  const formatCount = (count) => {
    if (!count) return '0';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return { voteStates, loadVotes, toggleVote, formatCount };
};

export default useForumVotes;
