import { supabase } from './supabase';

/**
 * SERVICIO PARA EL FORO DE EDUTECHLIFE - "Muro de Insights"
 * Versión para esquema "ForumCommunity" en Supabase
 * Maneja todas las operaciones CRUD para posts, comentarios y votos
 * Integración completa con Supabase y Realtime
 */

// ==================== CONSTANTES Y CONFIGURACIÓN ====================

const SCHEMA = 'ForumCommunity';

const TABLES = {
  POSTS: `${SCHEMA}.forum_posts`,
  COMMENTS: `${SCHEMA}.forum_comments`,
  VOTES: `${SCHEMA}.forum_votes`,
  PROFILES: 'public.profiles'  // profiles sigue en public
};

const VALIDATION = {
  MIN_POST_LENGTH: 10,
  MAX_POST_LENGTH: 500,
  MIN_COMMENT_LENGTH: 1,
  MAX_COMMENT_LENGTH: 300,
  MAX_TAGS: 3
};

// ==================== SERVICIO DE POSTS ====================

/**
 * Obtiene posts del foro con paginación y filtros
 * @param {Object} options - Opciones de consulta
 * @param {number} options.page - Página actual (default: 1)
 * @param {number} options.limit - Límite por página (default: 10)
 * @param {string} options.sortBy - Campo para ordenar (created_at, upvotes)
 * @param {string} options.sortOrder - Orden (asc, desc)
 * @param {string} options.tag - Filtrar por tag específico
 * @param {boolean} options.verifiedOnly - Solo posts verificados
 * @returns {Promise<Array>} Lista de posts con información de usuario
 */
export const getPosts = async ({
  page = 1,
  limit = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
  tag = null,
  verifiedOnly = false
} = {}) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Primero obtener los posts básicos
    let postsQuery = supabase
      .from(TABLES.POSTS)
      .select('*')
      .range(from, to);

    // Aplicar filtros
    if (tag) {
      postsQuery = postsQuery.contains('tags', [tag]);
    }

    if (verifiedOnly) {
      postsQuery = postsQuery.eq('is_verified', true);
    }

    // Aplicar ordenamiento
    postsQuery = postsQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data: posts, error: postsError } = await postsQuery;
    if (postsError) throw postsError;

    if (!posts || posts.length === 0) {
      return {
        success: true,
        data: { posts: [], total: 0 },
        page,
        limit,
        hasMore: false
      };
    }

    // Obtener IDs de usuarios para enriquecer datos
    const userIds = [...new Set(posts.map(post => post.user_id))];
    
    // Obtener información de usuarios
    const { data: profiles, error: profilesError } = await supabase
      .from(TABLES.PROFILES)
      .select('id, display_name, avatar_url, role')
      .in('id', userIds);

    if (profilesError) {
      console.warn('Error obteniendo perfiles:', profilesError);
    }

    // Crear mapa de usuarios para acceso rápido
    const userMap = {};
    if (profiles) {
      profiles.forEach(profile => {
        userMap[profile.id] = profile;
      });
    }

    // Obtener contadores de comentarios para cada post
    const postIds = posts.map(post => post.id);
    const { data: commentCounts, error: commentsError } = await supabase
      .from(TABLES.COMMENTS)
      .select('post_id')
      .in('post_id', postIds);

    if (commentsError) {
      console.warn('Error obteniendo contadores de comentarios:', commentsError);
    }

    // Crear mapa de contadores de comentarios
    const commentCountMap = {};
    if (commentCounts) {
      commentCounts.forEach(item => {
        commentCountMap[item.post_id] = (commentCountMap[item.post_id] || 0) + 1;
      });
    }

    // Enriquecer posts con información de usuario y contadores
    const enrichedPosts = posts.map(post => {
      const userInfo = userMap[post.user_id] || {};
      const commentCount = commentCountMap[post.id] || 0;
      
      return {
        ...post,
        display_name: userInfo.display_name || 'Usuario',
        avatar_url: userInfo.avatar_url || null,
        user_role: userInfo.role || 'member',
        comment_count: commentCount,
        // Campos compatibles
        full_name: userInfo.display_name || 'Usuario',
        username: userInfo.display_name ? userInfo.display_name.split(' ')[0] : 'Usuario',
        user_reputation: 0,
        has_voted: false
      };
    });

    // Obtener total de posts para paginación
    let countQuery = supabase
      .from(TABLES.POSTS)
      .select('*', { count: 'exact', head: true });

    if (tag) {
      countQuery = countQuery.contains('tags', [tag]);
    }

    if (verifiedOnly) {
      countQuery = countQuery.eq('is_verified', true);
    }

    const { count, error: countError } = await countQuery;
    if (countError) {
      console.warn('Error obteniendo total de posts:', countError);
    }

    return {
      success: true,
      data: {
        posts: enrichedPosts,
        total: count || enrichedPosts.length
      },
      page,
      limit,
      hasMore: enrichedPosts.length === limit
    };
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return {
      success: false,
      error: error.message,
      data: { posts: [], total: 0 }
    };
  }
};

/**
 * Crea un nuevo post en el foro
 * @param {string} userId - ID del usuario
 * @param {string} content - Contenido del post (10-500 caracteres)
 * @param {Array<string>} tags - Etiquetas del post (máx 3)
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createPost = async (userId, content, tags = []) => {
  try {
    // Validaciones
    if (!content || content.trim().length < VALIDATION.MIN_POST_LENGTH) {
      throw new Error(`El contenido debe tener al menos ${VALIDATION.MIN_POST_LENGTH} caracteres`);
    }

    if (content.length > VALIDATION.MAX_POST_LENGTH) {
      throw new Error(`El contenido no puede exceder ${VALIDATION.MAX_POST_LENGTH} caracteres`);
    }

    if (tags.length > VALIDATION.MAX_TAGS) {
      throw new Error(`Máximo ${VALIDATION.MAX_TAGS} etiquetas permitidas`);
    }

    // Crear post
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .insert({
        user_id: userId,
        content: content.trim(),
        tags: tags.map(tag => tag.trim().toLowerCase()),
        upvotes: 0,
        is_verified: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: 'Post creado exitosamente'
    };
  } catch (error) {
    console.error('Error al crear post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Actualiza un post existente
 * @param {string} postId - ID del post
 * @param {string} userId - ID del usuario (para verificación)
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updatePost = async (postId, userId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .eq('user_id', userId) // Solo el dueño puede actualizar
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: 'Post actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Elimina un post
 * @param {string} postId - ID del post
 * @param {string} userId - ID del usuario (para verificación)
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deletePost = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from(TABLES.POSTS)
      .delete()
      .eq('id', postId)
      .eq('user_id', userId); // Solo el dueño puede eliminar

    if (error) throw error;

    return {
      success: true,
      message: 'Post eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== SERVICIO DE VOTOS ====================

/**
 * Vota positivamente un post (función RPC atómica)
 * @param {string} postId - ID del post
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const upvotePost = async (postId, userId) => {
  try {
    // Usar función RPC del esquema ForumCommunity
    const { data, error } = await supabase.rpc(
      `${SCHEMA}.increment_post_upvote`,
      { post_id: postId, user_id: userId }
    );

    if (error) throw error;

    return {
      success: true,
      data: { upvotes: data },
      message: 'Voto registrado exitosamente'
    };
  } catch (error) {
    console.error('Error al votar post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Remueve el voto de un post (función RPC atómica)
 * @param {string} postId - ID del post
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const removeVote = async (postId, userId) => {
  try {
    // Usar función RPC del esquema ForumCommunity
    const { data, error } = await supabase.rpc(
      `${SCHEMA}.decrement_post_upvote`,
      { post_id: postId, user_id: userId }
    );

    if (error) throw error;

    return {
      success: true,
      data: { upvotes: data },
      message: 'Voto removido exitosamente'
    };
  } catch (error) {
    console.error('Error al remover voto:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verifica si un usuario ya votó un post
 * @param {string} postId - ID del post
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Resultado de la verificación
 */
export const checkUserVote = async (postId, userId) => {
  try {
    // Usar función RPC del esquema ForumCommunity
    const { data, error } = await supabase.rpc(
      `${SCHEMA}.has_user_voted`,
      { post_id: postId, user_id: userId }
    );

    if (error) throw error;

    return {
      success: true,
      data: { has_voted: data }
    };
  } catch (error) {
    console.error('Error al verificar voto:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== SERVICIO DE COMENTARIOS ====================

/**
 * Obtiene comentarios de un post
 * @param {string} postId - ID del post
 * @returns {Promise<Object>} Lista de comentarios
 */
export const getComments = async (postId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Enriquecer comentarios con información de usuario
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(comment => comment.user_id))];
      const { data: profiles } = await supabase
        .from(TABLES.PROFILES)
        .select('id, display_name, avatar_url')
        .in('id', userIds);

      const userMap = {};
      if (profiles) {
        profiles.forEach(profile => {
          userMap[profile.id] = profile;
        });
      }

      const enrichedComments = data.map(comment => {
        const userInfo = userMap[comment.user_id] || {};
        return {
          ...comment,
          display_name: userInfo.display_name || 'Usuario',
          avatar_url: userInfo.avatar_url || null,
          full_name: userInfo.display_name || 'Usuario',
          username: userInfo.display_name ? userInfo.display_name.split(' ')[0] : 'Usuario'
        };
      });

      return {
        success: true,
        data: enrichedComments
      };
    }

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Agrega un comentario a un post
 * @param {string} postId - ID del post
 * @param {string} userId - ID del usuario
 * @param {string} content - Contenido del comentario (1-300 caracteres)
 * @returns {Promise<Object>} Resultado de la operación
 */
export const addComment = async (postId, userId, content) => {
  try {
    // Validaciones
    if (!content || content.trim().length < VALIDATION.MIN_COMMENT_LENGTH) {
      throw new Error(`El comentario debe tener al menos ${VALIDATION.MIN_COMMENT_LENGTH} caracteres`);
    }

    if (content.length > VALIDATION.MAX_COMMENT_LENGTH) {
      throw new Error(`El comentario no puede exceder ${VALIDATION.MAX_COMMENT_LENGTH} caracteres`);
    }

    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert({
        post_id: postId,
        user_id: userId,
        content: content.trim()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: 'Comentario agregado exitosamente'
    };
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== SERVICIO DE ESTADÍSTICAS ====================

/**
 * Obtiene estadísticas del foro
 * @returns {Promise<Object>} Estadísticas generales
 */
export const getForumStats = async () => {
  try {
    // Obtener conteos en paralelo
    const [
      { count: totalPosts },
      { count: totalComments },
      { count: totalVotes },
      { data: topPostsRaw }
    ] = await Promise.all([
      supabase.from(TABLES.POSTS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.COMMENTS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.VOTES).select('*', { count: 'exact', head: true }),
      supabase
        .from(TABLES.POSTS)
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(5)
    ]);

    // Enriquecer top posts con información de usuario
    let topPosts = [];
    if (topPostsRaw && topPostsRaw.length > 0) {
      const userIds = [...new Set(topPostsRaw.map(post => post.user_id))];
      const { data: profiles } = await supabase
        .from(TABLES.PROFILES)
        .select('id, display_name, avatar_url')
        .in('id', userIds);

      const userMap = {};
      if (profiles) {
        profiles.forEach(profile => {
          userMap[profile.id] = profile;
        });
      }

      topPosts = topPostsRaw.map(post => {
        const userInfo = userMap[post.user_id] || {};
        return {
          ...post,
          display_name: userInfo.display_name || 'Usuario',
          avatar_url: userInfo.avatar_url || null,
          full_name: userInfo.display_name || 'Usuario'
        };
      });
    }

    return {
      success: true,
      data: {
        totalPosts: totalPosts || 0,
        totalComments: totalComments || 0,
        totalVotes: totalVotes || 0,
        topPosts: topPosts || []
      }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtiene estadísticas de un usuario específico
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Estadísticas del usuario
 */
export const getUserStats = async (userId) => {
  try {
    const [
      { count: userPosts },
      { count: userComments },
      { data: userVotes }
    ] = await Promise.all([
      supabase.from(TABLES.POSTS).select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from(TABLES.COMMENTS).select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from(TABLES.VOTES).select('post_id').eq('user_id', userId)
    ]);

    // Calcular reputación
    const reputation = (userPosts || 0) * 5 + (userComments || 0) * 1 + (userVotes?.length || 0) * 2;

    // Determinar nivel
    let level = 'Nuevo';
    if (reputation >= 200) level = 'Prompt Master Elite';
    else if (reputation >= 100) level = 'Prompt Master';
    else if (reputation >= 50) level = 'Prompt Expert';
    else if (reputation >= 10) level = 'Prompt Creator';
    else if (reputation >= 1) level = 'Prompt Learner';

    return {
      success: true,
      data: {
        postCount: userPosts || 0,
        commentCount: userComments || 0,
        voteCount: userVotes?.length || 0,
        reputation,
        level
      }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de usuario:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== SERVICIO DE TAGS ====================

/**
 * Obtiene tags más populares del foro
 * @param {number} limit - Límite de tags a retornar
 * @returns {Promise<Object>} Lista de tags populares
 */
export const getPopularTags = async (limit = 10) => {
  try {
    // Obtener todos los posts para extraer tags
    const { data: posts, error } = await supabase
      .from(TABLES.POSTS)
      .select('tags');

    if (error) throw error;

    // Contar frecuencia de tags
    const tagCounts = {};
    posts?.forEach(post => {
      post.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Ordenar por frecuencia y limitar
    const popularTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    return {
      success: true,
      data: popularTags
    };
  } catch (error) {
    console.error('Error al obtener tags populares:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// ==================== SERVICIO DE NOTIFICACIONES EN TIEMPO REAL ====================

/**
 * Suscribe a cambios en tiempo real del foro
 * @param {Function} onUpdate - Función a ejecutar cuando hay cambios
 * @param {Function} onError - Función a ejecutar cuando hay errores (opcional)
 * @returns {Object} Objeto con funciones para manejar la suscripción
 */
export const subscribeToForumUpdates = (onUpdate, onError) => {
  try {
    // Usar un solo canal para todas las tablas (mejor performance)
    const channel = supabase.channel('forum-updates');
    
    // Configurar listeners para cada tabla del esquema ForumCommunity
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: SCHEMA.toLowerCase(), // 'forumcommunity'
          table: 'forum_posts'
        },
        (payload) => {
          const update = {
            type: `${payload.table}_${payload.eventType}`,
            data: payload.new || payload.old,
            oldData: payload.old,
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString()
          };
          onUpdate(update);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: SCHEMA.toLowerCase(),
          table: 'forum_comments'
        },
        (payload) => {
          const update = {
            type: `${payload.table}_${payload.eventType}`,
            data: payload.new || payload.old,
            oldData: payload.old,
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString()
          };
          onUpdate(update);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: SCHEMA.toLowerCase(),
          table: 'forum_votes'
        },
        (payload) => {
          const update = {
            type: `${payload.table}_${payload.eventType}`,
            data: payload.new || payload.old,
            oldData: payload.old,
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString()
          };
          onUpdate(update);
        }
      );

    // Suscribirse al canal
    const subscription = channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Suscrito a updates del foro (esquema ${SCHEMA})`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Error en canal del foro');
        if (onError) onError(new Error('Channel error'));
      } else if (status === 'TIMED_OUT') {
        console.warn('⚠️ Timeout en canal del foro');
        if (onError) onError(new Error('Channel timeout'));
      }
    });

    return {
      unsubscribe: () => {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn('Error al desuscribirse:', err);
        }
      },
      channel,
      subscription
    };
  } catch (error) {
    console.error('Error al suscribirse a updates:', error);
    if (onError) onError(error);
    
    return {
      unsubscribe: () => {},
      error: error.message
    };
  }
};

// ==================== EXPORTACIÓN DEL SERVICIO COMPLETO ====================

export const forumService = {
  // Posts
  getPosts,
  createPost,
  updatePost,
  deletePost,
  
  // Votos
  upvotePost,
  removeVote,
  checkUserVote,
  
  // Comentarios
  getComments,
  addComment,
  
  // Estadísticas
  getForumStats,
  getUserStats,
  
  // Tags
  getPopularTags,
  
  // Realtime
  subscribeToForumUpdates,
  
  // Constantes
  VALIDATION,
  TABLES,
  SCHEMA
};

export default forumService;