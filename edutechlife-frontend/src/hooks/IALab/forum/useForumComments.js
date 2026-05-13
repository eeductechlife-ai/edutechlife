import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

export const useForumComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = useCallback(async (postId) => {
    if (!user || !postId) return [];
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select('*, profiles:forum_profiles(full_name, avatar_url, title, badges)')
        .eq('post_id', postId)
        .eq('is_hidden', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const tree = buildCommentTree(data || []);
      setComments(prev => ({ ...prev, [postId]: tree }));
      return tree;
    } catch (err) {
      console.error('Error loading comments:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addComment = useCallback(async ({ postId, content, parentId = null }) => {
    if (!user) return { success: false, error: 'No autenticado' };
    if (!content?.trim()) return { success: false, error: 'Contenido requerido' };

    try {
      const { data: comment, error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          parent_id: parentId,
          user_id: user.id,
          content: content.trim(),
        })
        .select('*, profiles:forum_profiles(full_name, avatar_url, title, badges)')
        .single();

      if (error) throw error;

      await supabase.rpc('increment_forum_comment_count', { post_id: postId });

      setComments(prev => {
        const current = prev[postId] || [];
        const inserted = insertCommentInTree(current, comment);
        return { ...prev, [postId]: inserted };
      });

      return { success: true, comment };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const deleteComment = useCallback(async (commentId, postId) => {
    if (!user) return { success: false, error: 'No autenticado' };
    try {
      const { error } = await supabase
        .from('forum_comments')
        .update({ is_hidden: true })
        .eq('id', commentId)
        .eq('user_id', user.id);
      if (error) throw error;
      setComments(prev => ({
        ...prev,
        [postId]: removeCommentFromTree(prev[postId] || [], commentId),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  return {
    comments,
    isLoading,
    loadComments,
    addComment,
    deleteComment,
  };
};

function buildCommentTree(flatComments) {
  const map = {};
  const roots = [];

  flatComments.forEach(c => {
    map[c.id] = { ...c, children: [] };
  });

  flatComments.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}

function insertCommentInTree(tree, newComment) {
  if (!newComment.parent_id) {
    return [...tree, { ...newComment, children: [] }];
  }

  return tree.map(node => {
    if (node.id === newComment.parent_id) {
      return { ...node, children: [...(node.children || []), { ...newComment, children: [] }] };
    }
    if (node.children?.length) {
      return { ...node, children: insertCommentInTree(node.children, newComment) };
    }
    return node;
  });
}

function removeCommentFromTree(tree, commentId) {
  return tree
    .filter(node => node.id !== commentId)
    .map(node => ({
      ...node,
      children: node.children?.length ? removeCommentFromTree(node.children, commentId) : [],
    }));
}

export default useForumComments;
