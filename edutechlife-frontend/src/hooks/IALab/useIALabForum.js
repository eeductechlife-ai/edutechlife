import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * Hook especializado para gestión de foro en IALab
 * Usa tablas forum_posts, forum_comments, forum_votes
 * con user_id TEXT (compatible con Clerk Auth)
 */
export const useIALabForum = () => {
    const { user } = useAuth();
    const [forumPosts, setForumPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [likeStates, setLikeStates] = useState({});
    const cancelledRef = useRef(false);

    useEffect(() => {
        return () => { cancelledRef.current = true; };
    }, []);

    /**
     * Cargar posts del foro
     */
    const loadForumPosts = useCallback(async (limit = 10) => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const { data: posts, error: postsError } = await supabase
                .from('forum_posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (postsError) throw postsError;
            if (cancelledRef.current) return [];

            if (!posts || posts.length === 0) {
                setForumPosts([]);
                setLikeStates({});
                return [];
            }

            // Cargar votos del usuario
            const postIds = posts.map(p => p.id);
            const { data: votes, error: votesError } = await supabase
                .from('forum_votes')
                .select('post_id')
                .in('post_id', postIds)
                .eq('user_id', user.id);

            if (votesError) console.warn('Error loading votes:', votesError.message);
            if (cancelledRef.current) return [];

            const votedPostIds = new Set(votes?.map(v => v.post_id) || []);

            // Combinar datos
            const postsWithLikes = posts.map(post => ({
                ...post,
                user_has_liked: votedPostIds.has(post.id),
                like_count: post.upvotes || 0,
                upvote_count: post.upvotes || 0,
                profiles: {
                    full_name: post.user_name || 'Usuario',
                    avatar_url: post.user_avatar || null
                }
            }));

            setForumPosts(postsWithLikes);

            // Inicializar estados de likes
            const initialLikeStates = {};
            postsWithLikes.forEach(post => {
                initialLikeStates[post.id] = {
                    userLiked: post.user_has_liked,
                    isLoading: false,
                    likeCount: post.like_count,
                    likeColor: post.user_has_liked ? '#00BCD4' : '#004B63'
                };
            });
            setLikeStates(initialLikeStates);

            return postsWithLikes;
        } catch (err) {
            console.error('Error loading forum posts:', err);
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    /**
     * Alternar like en un post
     */
    const toggleLike = useCallback(async (postId, currentLikeCount) => {
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        const currentLikeState = likeStates[postId];
        const likeCount = currentLikeCount ?? currentLikeState?.likeCount ?? 0;

        setLikeStates(prev => ({
            ...prev,
            [postId]: { ...prev[postId], isLoading: true }
        }));

        try {
            const userLiked = currentLikeState?.userLiked || false;
            const newLikeCount = userLiked ? likeCount - 1 : likeCount + 1;

            if (userLiked) {
                const { error: deleteError } = await supabase
                    .from('forum_votes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.id);

                if (deleteError) throw deleteError;
                if (cancelledRef.current) return { success: false, error: 'Cancelado' };
            } else {
                const { error: insertError } = await supabase
                    .from('forum_votes')
                    .insert({
                        post_id: postId,
                        user_id: user.id,
                        vote_type: 'upvote'
                    });

                if (insertError) throw insertError;
            }

            if (cancelledRef.current) return { success: false, error: 'Cancelado' };

            const { error: updateError } = await supabase
                .from('forum_posts')
                .update({ upvotes: newLikeCount })
                .eq('id', postId);

            if (updateError) throw updateError;

            setLikeStates(prev => ({
                ...prev,
                [postId]: {
                    userLiked: !userLiked,
                    isLoading: false,
                    likeCount: newLikeCount,
                    likeColor: !userLiked ? '#00BCD4' : '#004B63'
                }
            }));

            setForumPosts(prev =>
                prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            user_has_liked: !userLiked,
                            like_count: newLikeCount,
                            upvote_count: newLikeCount
                        }
                        : post
                )
            );

            return { success: true, newLikeCount, userLiked: !userLiked };
        } catch (err) {
            console.error('Error toggling like:', err);

            setLikeStates(prev => ({
                ...prev,
                [postId]: { ...prev[postId], isLoading: false }
            }));

            return { success: false, error: err.message };
        }
    }, [user, likeStates]);

    /**
     * Crear un nuevo post
     */
    const createPost = useCallback(async (titleOrObj, content) => {
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        // Soportar ambos formatos: createPost({title, content, tags}) y createPost(title, content)
        let title, postContent, tags;
        if (typeof titleOrObj === 'object') {
            title = titleOrObj.title;
            postContent = titleOrObj.content;
            tags = titleOrObj.tags || ['IALab'];
        } else {
            title = titleOrObj;
            postContent = content;
            tags = ['IALab'];
        }

        if (!title?.trim() || !postContent?.trim()) {
            return { success: false, error: 'Título y contenido son requeridos' };
        }

        try {
            const { data: post, error: insertError } = await supabase
                .from('forum_posts')
                .insert({
                    title: title.trim(),
                    content: postContent.trim(),
                    user_id: user.id,
                    upvotes: 0,
                    comment_count: 0,
                    tags: tags
                })
                .select()
                .single();

            if (insertError) throw insertError;
            if (cancelledRef.current) return { success: false, error: 'Cancelado' };

            const newPost = {
                ...post,
                user_has_liked: false,
                like_count: 0,
                upvote_count: 0,
                profiles: {
                    full_name: user.fullName || user.email || 'Usuario',
                    avatar_url: user.imageUrl || null
                }
            };

            setForumPosts(prev => [newPost, ...prev]);

            setLikeStates(prev => ({
                ...prev,
                [newPost.id]: {
                    userLiked: false,
                    isLoading: false,
                    likeCount: 0,
                    likeColor: '#004B63'
                }
            }));

            return { success: true, post: newPost };
        } catch (err) {
            console.error('Error creating post:', err);
            return { success: false, error: err.message };
        }
    }, [user]);

    /**
     * Estadísticas del foro (simplificado)
     */
    const getForumStats = useCallback(async () => {
        if (!user) return { totalPosts: 0, totalComments: 0, totalLikes: 0, activeUsers: 0 };

        try {
            const { count: postCount, error: postErr } = await supabase
                .from('forum_posts')
                .select('*', { count: 'exact', head: true });

            if (cancelledRef.current) return { success: false, data: {}, totalPosts: 0, totalComments: 0, totalLikes: 0, activeUsers: 0 };

            const { count: voteCount, error: voteErr } = await supabase
                .from('forum_votes')
                .select('*', { count: 'exact', head: true });

            if (postErr) console.warn('Error counting posts:', postErr.message);
            if (voteErr) console.warn('Error counting votes:', voteErr.message);

            return {
                success: true,
                data: {
                    total_posts: postCount || 0,
                    total_likes: voteCount || 0,
                    active_users: 0
                },
                totalPosts: postCount || 0,
                totalComments: 0,
                totalLikes: voteCount || 0,
                activeUsers: 0
            };
        } catch (err) {
            console.error('Error getting forum stats:', err);
            return { success: false, data: {}, totalPosts: 0, totalComments: 0, totalLikes: 0, activeUsers: 0 };
        }
    }, [user]);

    /**
     * Suscribirse a actualizaciones en tiempo real
     */
    const subscribeToRealtimeLikes = useCallback(() => {
        if (!user) return () => {};

        const subscription = supabase
            .channel('forum-likes-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'forum_votes' },
                (payload) => {
                    const postId = payload.new.post_id;
                    setLikeStates(prev => ({
                        ...prev,
                        [postId]: {
                            ...prev[postId],
                            likeCount: (prev[postId]?.likeCount || 0) + 1
                        }
                    }));
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'forum_votes' },
                (payload) => {
                    const postId = payload.old.post_id;
                    setLikeStates(prev => ({
                        ...prev,
                        [postId]: {
                            ...prev[postId],
                            likeCount: Math.max((prev[postId]?.likeCount || 1) - 1, 0)
                        }
                    }));
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    // Cargar posts al montar
    useEffect(() => {
        if (user) {
            loadForumPosts(10);
        }
    }, [user, loadForumPosts]);

    // Suscribirse a actualizaciones en tiempo real
    useEffect(() => {
        const unsubscribe = subscribeToRealtimeLikes();
        return unsubscribe;
    }, [subscribeToRealtimeLikes]);

    return {
        forumPosts,
        isLoading,
        error,
        likeStates,
        loadForumPosts,
        toggleLike,
        createPost,
        getForumStats,
        formatLikeCount: (count) => {
            if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
            return count.toString();
        },
        getLikeButtonProps: (postId) => {
            const state = likeStates[postId] || { userLiked: false, isLoading: false, likeCount: 0, likeColor: '#004B63' };
            return {
                userLiked: state.userLiked,
                isLoading: state.isLoading,
                likeCount: state.likeCount,
                likeColor: state.likeColor,
                likeIcon: state.userLiked ? 'fa-heart' : 'fa-heart',
                ariaLabel: state.userLiked ? 'Quitar me gusta' : 'Dar me gusta',
                buttonClass: state.userLiked
                    ? "bg-gradient-to-r from-[#00BCD4]/20 to-[#004B63]/10 text-[#00BCD4] border border-[#00BCD4]/30 shadow-[#00BCD4]/20"
                    : "bg-[#004B63]/5 text-[#004B63]/70 hover:bg-[#004B63]/10"
            };
        }
    };
};

export default useIALabForum;
