import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * Hook especializado para gestión de likes/foro en IALab
 * Sistema de likes visibles con contador y estados visuales mejorados
 * 
 * @returns {Object} Funciones y estados para gestión de foro
 */
export const useIALabForum = () => {
    const { user } = useAuth();
    const [forumPosts, setForumPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [likeStates, setLikeStates] = useState({}); // { postId: { userLiked: boolean, isLoading: boolean, likeCount: number } }

    /**
     * Cargar posts del foro con información de likes del usuario
     */
    const loadForumPosts = useCallback(async (limit = 10) => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            // Cargar posts del foro
            const { data: posts, error: postsError } = await supabase
                .from('forum_posts')
                .select(`
                    id,
                    title,
                    content,
                    created_at,
                    user_id,
                    upvote_count,
                    comment_count,
                    forum_users (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (postsError) throw postsError;

            // Cargar likes del usuario para cada post
            const postsWithLikes = await Promise.all(
                posts.map(async (post) => {
                    const { data: userLike } = await supabase
                        .from('forum_votes')
                        .select('id')
                        .eq('post_id', post.id)
                        .eq('user_id', user.id)
                        .single();

                    return {
                        ...post,
                        user_has_liked: !!userLike,
                        like_count: post.upvote_count || 0
                    };
                })
            );

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
     * @param {string} postId - ID del post
     * @param {number} currentLikeCount - Conteo actual de likes
     */
    const toggleLike = useCallback(async (postId, currentLikeCount) => {
        if (!user) {
            alert('Debes iniciar sesión para dar like');
            return;
        }

        // Actualizar estado local inmediatamente para feedback visual
        setLikeStates(prev => ({
            ...prev,
            [postId]: {
                ...prev[postId],
                isLoading: true
            }
        }));

        try {
            const currentLikeState = likeStates[postId];
            const userLiked = currentLikeState?.userLiked || false;
            const newLikeCount = userLiked ? currentLikeCount - 1 : currentLikeCount + 1;

            if (userLiked) {
                // Eliminar like
                const { error: deleteError } = await supabase
                    .from('forum_votes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.id);

                if (deleteError) throw deleteError;
            } else {
                // Agregar like
                const { error: insertError } = await supabase
                    .from('forum_votes')
                    .insert({
                        post_id: postId,
                        user_id: user.id,
                        vote_type: 'upvote'
                    });

                if (insertError) throw insertError;
            }

            // Actualizar contador en la tabla de posts
            const { error: updateError } = await supabase
                .from('forum_posts')
                .update({ upvote_count: newLikeCount })
                .eq('id', postId);

            if (updateError) throw updateError;

            // Actualizar estado local
            setLikeStates(prev => ({
                ...prev,
                [postId]: {
                    userLiked: !userLiked,
                    isLoading: false,
                    likeCount: newLikeCount,
                    likeColor: !userLiked ? '#00BCD4' : '#004B63'
                }
            }));

            // Actualizar posts
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
            
            // Revertir cambios en caso de error
            setLikeStates(prev => ({
                ...prev,
                [postId]: {
                    ...prev[postId],
                    isLoading: false
                }
            }));

            return { success: false, error: err.message };
        }
    }, [user, likeStates]);

    /**
     * Crear un nuevo post en el foro
     * @param {string} title - Título del post
     * @param {string} content - Contenido del post
     */
    const createPost = useCallback(async (title, content) => {
        if (!user) {
            alert('Debes iniciar sesión para crear un post');
            return { success: false, error: 'Usuario no autenticado' };
        }

        if (!title.trim() || !content.trim()) {
            return { success: false, error: 'Título y contenido son requeridos' };
        }

        try {
            const { data: post, error: insertError } = await supabase
                .from('forum_posts')
                .insert({
                    title: title.trim(),
                    content: content.trim(),
                    user_id: user.id,
                    upvote_count: 0,
                    comment_count: 0
                })
                .select(`
                    id,
                    title,
                    content,
                    created_at,
                    user_id,
                    upvote_count,
                    comment_count,
                    forum_users (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .single();

            if (insertError) throw insertError;

            // Agregar nuevo post al estado
            const newPost = {
                ...post,
                user_has_liked: false,
                like_count: 0
            };

            setForumPosts(prev => [newPost, ...prev]);

            // Agregar estado de like para el nuevo post
            setLikeStates(prev => ({
                ...prev,
                [post.id]: {
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
     * Obtener estadísticas del foro
     */
    const getForumStats = useCallback(async () => {
        if (!user) return null;

        try {
            const { data: stats, error: statsError } = await supabase
                .from('forum_stats')
                .select('*')
                .single();

            if (statsError) throw statsError;

            return { success: true, data: stats };
        } catch (err) {
            console.error('Error getting forum stats:', err);
            return { success: false, error: err.message };
        }
    }, [user]);

    /**
     * Suscribirse a actualizaciones en tiempo real de likes
     */
    const subscribeToRealtimeLikes = useCallback(() => {
        if (!user) return () => {};

        const subscription = supabase
            .channel('forum-likes-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'forum_votes'
                },
                (payload) => {
                    console.log('Realtime like update:', payload);
                    
                    // Actualizar contador de likes en tiempo real
                    if (payload.eventType === 'INSERT') {
                        const postId = payload.new.post_id;
                        setLikeStates(prev => ({
                            ...prev,
                            [postId]: {
                                ...prev[postId],
                                likeCount: (prev[postId]?.likeCount || 0) + 1
                            }
                        }));
                    } else if (payload.eventType === 'DELETE') {
                        const postId = payload.old.post_id;
                        setLikeStates(prev => ({
                            ...prev,
                            [postId]: {
                                ...prev[postId],
                                likeCount: Math.max((prev[postId]?.likeCount || 0) - 1, 0)
                            }
                        }));
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    // Cargar posts al montar el componente
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
        // Estados
        forumPosts,
        isLoading,
        error,
        likeStates,
        
        // Funciones
        loadForumPosts,
        toggleLike,
        createPost,
        getForumStats,
        
        // Utilidades
        formatLikeCount: (count) => {
            if (count >= 1000) {
                return `${(count / 1000).toFixed(1)}k`;
            }
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