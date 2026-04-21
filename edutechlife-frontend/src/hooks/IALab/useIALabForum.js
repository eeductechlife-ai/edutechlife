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
            // SOLUCIÓN TEMPORAL: Desactivar consultas reales que causan error 401
            // Las consultas a forum_posts y forum_votes causan error 401 por RLS no configurado
            console.log('🔇 Consultas a forum_posts desactivadas temporalmente (evitar error 401)');
            console.log('   Razón: RLS bloqueando acceso anónimo a forum_posts y forum_votes');
            console.log('   Solución: Ejecutar simple_rls_config.sql en Supabase SQL Editor');
            
            // Usar datos simulados para desarrollo
            const simulatedPosts = generateSimulatedForumPosts(limit);
            const postsWithLikes = simulatedPosts.map(post => ({
                ...post,
                user_has_liked: false,
                like_count: post.upvotes || 0,
                upvote_count: post.upvotes || 0  // Mantener compatibilidad
            }));
            
            /*
            // CÓDIGO ORIGINAL (descomentar cuando RLS esté configurado):
            // Cargar posts del foro - usando estructura real de la base de datos
            const { data: posts, error: postsError } = await supabase
                .from('forum_posts')
                .select(`
                    id,
                    title,
                    content,
                    created_at,
                    upvotes,
                    comment_count,
                    tags,
                    profiles (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            let postsWithLikes = [];
            
            if (postsError) {
                // Si hay error de RLS (42501) o permisos, usar datos simulados
                if (postsError.code === '42501' || postsError.code === 'PGRST301' || postsError.message.includes('permission')) {
                    console.warn('⚠️ RLS bloqueando acceso a forum_posts, usando datos simulados');
                    
                    // Datos simulados para desarrollo
                    const simulatedPosts = generateSimulatedForumPosts(limit);
                    postsWithLikes = simulatedPosts.map(post => ({
                        ...post,
                        user_has_liked: false,
                        like_count: post.upvotes || 0,
                        upvote_count: post.upvotes || 0  // Mantener compatibilidad
                    }));
                } else {
                    throw postsError;
                }
            } else if (posts && posts.length > 0) {
                // Cargar likes del usuario para cada post real
                postsWithLikes = await Promise.all(
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
                            like_count: post.upvotes || 0,
                            upvote_count: post.upvotes || 0  // Mantener compatibilidad
                        };
                    })
                );
            } else {
                // Tabla vacía, usar datos simulados
                console.log('📭 Tabla forum_posts vacía, usar datos simulados');
                const simulatedPosts = generateSimulatedForumPosts(limit);
                postsWithLikes = simulatedPosts.map(post => ({
                    ...post,
                    user_has_liked: false,
                    like_count: post.upvotes || 0,
                    upvote_count: post.upvotes || 0  // Mantener compatibilidad
                }));
            }
            */

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

            // Actualizar contador en la tabla de posts - usar upvotes (columna real)
            const { error: updateError } = await supabase
                .from('forum_posts')
                .update({ upvotes: newLikeCount })
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
                    upvotes: 0,
                    comment_count: 0,
                    tags: ['Módulo General']
                })
                .select(`
                    id,
                    title,
                    content,
                    created_at,
                    upvotes,
                    comment_count,
                    tags,
                    profiles (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .single();

            let newPost;
            
            if (insertError) {
                // Si es error de RLS, simular la creación
                if (insertError.code === '42501' || insertError.code === 'PGRST301' || insertError.message.includes('permission')) {
                    console.warn('⚠️ RLS bloqueando creación de post, simulando creación');
                    
            // Crear post simulado
            newPost = {
                id: `simulated-${Date.now()}`,
                title: title.trim(),
                content: content.trim(),
                created_at: new Date().toISOString(),
                upvotes: 0,
                upvote_count: 0,  // Compatibilidad
                comment_count: 0,
                tags: ['Módulo General'],
                profiles: {
                    id: user.id,
                    full_name: user.fullName || 'Usuario',
                    avatar_url: user.imageUrl || null
                },
                user_has_liked: false,
                like_count: 0
            };
                } else {
                    throw insertError;
                }
            } else {
                // Post creado exitosamente
                newPost = {
                    ...post,
                    user_has_liked: false,
                    like_count: 0
                };
            }

            // Agregar nuevo post al estado
            setForumPosts(prev => [newPost, ...prev]);

            // Agregar estado de like para el nuevo post
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
     * Obtener estadísticas del foro
     */
    const getForumStats = useCallback(async () => {
        if (!user) return null;

        try {
            // SOLUCIÓN TEMPORAL: Desactivar consultas que causan error 401
            console.log('🔇 Consulta getForumStats desactivada temporalmente (evitar error 401)');
            console.log('   Razón: RLS bloqueando acceso a forum_stats');
            console.log('   Solución: Configurar políticas RLS en Supabase Dashboard');
            
            // Usar estadísticas simuladas para desarrollo
            const simulatedStats = {
                total_posts: 125,
                total_comments: 543,
                total_votes: 892,
                active_users: 42,
                last_updated: new Date().toISOString(),
                simulated: true
            };
            
            console.log('✅ Estadísticas del foro simuladas para desarrollo');
            return { success: true, data: simulatedStats };
            
            /*
            // CÓDIGO ORIGINAL (descomentar cuando RLS esté configurado):
            const { data: stats, error: statsError } = await supabase
                .from('forum_stats')
                .select('*')
                .single();

            if (statsError) throw statsError;

            return { success: true, data: stats };
            */
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

        // SOLUCIÓN TEMPORAL: Desactivar suscripciones en tiempo real que causan error 401
        console.log('🔇 Suscripción en tiempo real desactivada temporalmente (evitar error 401)');
        console.log('   Razón: RLS bloqueando acceso a forum_votes');
        console.log('   Solución: Configurar políticas RLS en Supabase Dashboard');
        
        // Devolver función vacía (no hacer nada)
        return () => {};
        
        /*
        // CÓDIGO ORIGINAL (descomentar cuando RLS esté configurado):
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
                                likeCount: Math.max((prev[postId]?.likeCount || 1) - 1, 0)
                            }
                        }));
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
        */
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

/**
 * Genera posts de foro simulados para desarrollo cuando RLS bloquea el acceso
 * @param {number} limit - Número de posts a generar
 * @returns {Array} Array de posts simulados
 */
const generateSimulatedForumPosts = (limit = 10) => {
    const simulatedPosts = [];
    const authors = [
        { id: '1', full_name: 'Carlos López', avatar_url: null },
        { id: '2', full_name: 'Ana García', avatar_url: null },
        { id: '3', full_name: 'Miguel Torres', avatar_url: null },
        { id: '4', full_name: 'Laura Martínez', avatar_url: null },
        { id: '5', full_name: 'David Fernández', avatar_url: null }
    ];
    
    const topics = [
        'Cómo optimizar prompts para ChatGPT',
        'Gemini vs ChatGPT: comparativa práctica',
        'Errores comunes al usar NotebookLM',
        'Framework RTF paso a paso',
        'Evaluación de respuestas con DeepSeek',
        'Integración de IA en educación',
        'Mejores prácticas para prompts',
        'Casos de éxito en el laboratorio',
        'Recursos adicionales recomendados',
        'Preguntas frecuentes sobre IA'
    ];
    
    const contents = [
        'He descubierto que estructurar los prompts con contexto claro mejora significativamente los resultados...',
        'Después de probar ambas plataformas, encontré que Gemini es mejor para tareas de investigación...',
        'Muchos estudiantes cometen el error de no proporcionar suficiente contexto al usar NotebookLM...',
        'El framework RTF (Role-Task-Format) ha transformado completamente mi forma de interactuar con IA...',
        'La evaluación automática con DeepSeek me ha ahorrado horas de revisión manual...',
        'La integración de herramientas de IA en el aula requiere un enfoque pedagógico sólido...',
        'Los prompts efectivos siguen un patrón claro: contexto, instrucción, formato esperado...',
        'Varios estudiantes han logrado resultados excepcionales aplicando las técnicas aprendidas...',
        'Recomiendo estos recursos adicionales para profundizar en cada módulo...',
        'Aquí respondo las preguntas más comunes que recibo sobre el uso de IA educativa...'
    ];
    
    for (let i = 0; i < limit; i++) {
        const author = authors[i % authors.length];
        const daysAgo = Math.floor(Math.random() * 30);
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - daysAgo);
        
        simulatedPosts.push({
            id: `simulated-${i + 1}`,
            title: topics[i % topics.length],
            content: contents[i % contents.length],
            created_at: createdDate.toISOString(),
            upvotes: Math.floor(Math.random() * 50),
            upvote_count: Math.floor(Math.random() * 50),  // Compatibilidad
            comment_count: Math.floor(Math.random() * 20),
            tags: ['Módulo ' + ((i % 5) + 1), 'IA', 'Educación'],
            profiles: author
        });
    }
    
    // Ordenar por fecha (más reciente primero)
    simulatedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return simulatedPosts;
};

export default useIALabForum;