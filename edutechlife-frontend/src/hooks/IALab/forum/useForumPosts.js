import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

const POSTS_PER_PAGE = 10;

export const POST_CATEGORIES = [
  { id: 'all', label: 'Todos', icon: 'fa-comments' },
  { id: 'question', label: 'Preguntas', icon: 'fa-question-circle' },
  { id: 'discussion', label: 'Discusiones', icon: 'fa-comment-dots' },
  { id: 'resource', label: 'Recursos', icon: 'fa-book' },
  { id: 'announcement', label: 'Anuncios', icon: 'fa-bullhorn' },
  { id: 'feedback', label: 'Feedback', icon: 'fa-lightbulb' },
];

export const useForumPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const loadPosts = useCallback(async (opts = {}) => {
    const {
      reset = false,
      cat = category,
      search = searchQuery,
      sort = sortBy,
      pageNum = reset ? 0 : page,
    } = opts;

    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('forum_posts')
        .select('*, profiles:forum_profiles(full_name, avatar_url, title, badges)', { count: 'exact' });

      if (cat && cat !== 'all') {
        query = query.eq('category', cat);
      }

      if (search.trim()) {
        query = query.or(`title.ilike.%${search.trim()}%,content.ilike.%${search.trim()}%`);
      }

      if (sort === 'popular') {
        query = query.order('upvotes', { ascending: false });
      } else if (sort === 'activity') {
        query = query.order('updated_at', { ascending: false, nullsLast: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const from = pageNum * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error: postsError, count } = await query;
      if (postsError) throw postsError;

      if (reset) {
        setPosts(data || []);
      } else {
        setPosts(prev => [...prev, ...(data || [])]);
      }
      setTotalCount(count || 0);
      setHasMore(data && data.length === POSTS_PER_PAGE);
      setPage(pageNum + (reset ? 1 : pageNum + 1));

      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, category, searchQuery, sortBy, page]);

  const createPost = useCallback(async ({ title, content, category: cat = 'discussion', tags = [] }) => {
    if (!user) return { success: false, error: 'No autenticado' };
    if (!title?.trim() || !content?.trim()) return { success: false, error: 'Título y contenido requeridos' };

    try {
      const { data: profile } = await supabase
        .from('forum_profiles')
        .select('full_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      const { data: post, error: insertError } = await supabase
        .from('forum_posts')
        .insert({
          title: title.trim(),
          content: content.trim(),
          category: cat,
          tags,
          user_id: user.id,
          user_name: profile?.full_name || user.fullName || user.email || 'Usuario',
          upvotes: 0,
          comment_count: 0,
        })
        .select('*, profiles:forum_profiles(full_name, avatar_url, title, badges)')
        .single();

      if (insertError) throw insertError;

      setPosts(prev => [post, ...prev]);
      setTotalCount(prev => prev + 1);
      return { success: true, post };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const deletePost = useCallback(async (postId) => {
    if (!user) return { success: false, error: 'No autenticado' };
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== postId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const updatePost = useCallback(async (postId, updates) => {
    if (!user) return { success: false, error: 'No autenticado' };
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', postId)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...data } : p));
      return { success: true, post: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  const refreshPosts = useCallback(() => {
    loadPosts({ reset: true, pageNum: 0 });
  }, [loadPosts]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadPosts({ pageNum: page });
    }
  }, [isLoading, hasMore, page, loadPosts]);

  useEffect(() => {
    if (user) {
      loadPosts({ reset: true, pageNum: 0 });
    }
  }, [user, category, searchQuery, sortBy]);

  return {
    posts,
    isLoading,
    error,
    totalCount,
    hasMore,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    createPost,
    deletePost,
    updatePost,
    refreshPosts,
    loadMore,
  };
};

export default useForumPosts;
