import { supabase } from './supabase';

/**
 * SERVICIO PARA EL FORO DE EDUTECHLIFE - "Muro de Insights"
 * Maneja todas las operaciones CRUD para posts, comentarios y votos
 * Integración completa con Supabase y Realtime
 */

// ==================== UTILIDADES DE LOGGING ====================
const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  error: (message, error) => {
    if (isDevelopment) {
      console.error(`[ForumService] ${message}:`, error);
    }
    // En producción, podrías enviar a un servicio de logging como Sentry
  },
  
  warn: (message, data) => {
    if (isDevelopment) {
      console.warn(`[ForumService] ${message}:`, data);
    }
  },
  
  info: (message, data) => {
    if (isDevelopment) {
      console.info(`[ForumService] ${message}:`, data);
    }
  }
};

// ==================== CONSTANTES Y CONFIGURACIÓN ====================

const TABLES = {
  POSTS: 'forum_posts',
  COMMENTS: 'forum_comments',
  VOTES: 'forum_votes',
  PROFILES: 'profiles'
};

const VALIDATION = {
  MIN_POST_LENGTH: 10,
  MAX_POST_LENGTH: 500,
  MIN_COMMENT_LENGTH: 1,
  MAX_COMMENT_LENGTH: 300,
  MAX_TAGS: 3
};

// ==================== SISTEMA DE CACHÉ ====================

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos en milisegundos
const userProfileCache = new Map();

/**
 * Obtiene perfiles de usuario desde caché o base de datos
 * @param {string[]} userIds - Array de IDs de usuario
 * @returns {Promise<Array>} Array de perfiles (puede incluir null para IDs no encontrados)
 */
const getCachedUserProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) return [];
  
  const now = Date.now();
  const uncachedIds = [];
  const cachedProfiles = [];
  
  // Separar IDs en caché y no caché
  userIds.forEach(id => {
    const cached = userProfileCache.get(id);
    if (cached && (now - cached.timestamp) <= CACHE_TTL) {
      cachedProfiles.push(cached.profile);
    } else {
      uncachedIds.push(id);
    }
  });
  
  // Si todos están en caché, retornar inmediatamente
  if (uncachedIds.length === 0) {
    return cachedProfiles;
  }
  
  // Obtener perfiles no cacheados de la base de datos
  try {
    const { data: profiles, error } = await supabase
      .from(TABLES.PROFILES)
      .select('id, display_name, avatar_url, role')
      .in('id', uncachedIds);
    
    if (error) {
      logger.error('Error obteniendo perfiles para caché', error);
      // Retornar lo que tengamos en caché + null para los faltantes
      return userIds.map(id => {
        const cached = userProfileCache.get(id);
        return cached ? cached.profile : null;
      });
    }
    
    // Actualizar caché con nuevos perfiles
    profiles?.forEach(profile => {
      userProfileCache.set(profile.id, {
        profile,
        timestamp: now
      });
    });
    
    // Crear mapa para búsqueda rápida
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    // Combinar perfiles cacheados y nuevos en el orden original
    return userIds.map(id => {
      const cached = userProfileCache.get(id);
      return cached ? cached.profile : profileMap.get(id) || null;
    });
    
  } catch (error) {
    logger.error('Error en getCachedUserProfiles', error);
    return userIds.map(id => {
      const cached = userProfileCache.get(id);
      return cached ? cached.profile : null;
    });
  }
};

/**
 * Limpia el caché de perfiles (útil para testing o cuando se actualizan perfiles)
 */
export const clearProfileCache = () => {
  userProfileCache.clear();
  logger.info('Caché de perfiles limpiado');
};

// Exportar función de caché para uso interno (no se exporta públicamente)
export { getCachedUserProfiles };

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
    
    // Obtener información de usuarios usando caché
    const userMap = {};
    
    try {
      // Usar el sistema de caché para obtener perfiles
      const profiles = await getCachedUserProfiles(userIds);
      
      // Crear mapa de usuarios
      profiles.forEach((profile, index) => {
        const userId = userIds[index];
        if (profile) {
          userMap[userId] = {
            id: profile.id,
            display_name: profile.display_name || profile.full_name || profile.username || profile.email?.split('@')[0] || 'Usuario',
            avatar_url: profile.avatar_url || null,
            role: profile.role || 'user'
          };
        } else {
          // Fallback si no se encontró el perfil
          userMap[userId] = {
            id: userId,
            display_name: 'Usuario',
            avatar_url: null,
            role: 'user'
          };
        }
      });
      
    } catch (error) {
      logger.warn('Error obteniendo perfiles desde caché', error);
      // Crear perfiles básicos como fallback
      userIds.forEach(userId => {
        userMap[userId] = {
          id: userId,
          display_name: 'Usuario',
          avatar_url: null,
          role: 'user'
        };
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
        // Campos compatibles con la vista original
        full_name: userInfo.display_name || 'Usuario',
        username: userInfo.display_name ? userInfo.display_name.split(' ')[0] : 'Usuario',
        user_reputation: 0, // Por ahora, se puede calcular después
        has_voted: false // Se calculará después si el usuario está autenticado
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
 * Obtiene posts del foro de forma optimizada usando vistas y joins
 * @param {Object} options - Opciones de consulta
 * @param {number} options.page - Página actual (default: 1)
 * @param {number} options.limit - Límite por página (default: 10)
 * @param {string} options.sortBy - Campo para ordenar (recent, popular, trending)
 * @param {string} options.tag - Filtrar por tag específico
 * @returns {Promise<Object>} Resultado optimizado con posts
 */
export const getPostsOptimized = async ({
  page = 1,
  limit = 10,
  sortBy = 'recent',
  tag = null
} = {}) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Usar la vista optimizada que ya incluye información de usuario
    // NOTA: La vista NO soporta relaciones embebidas (forum_comments(count), forum_votes(count))
    // Hacemos consulta básica primero, luego obtenemos counts por separado
    let query = supabase
      .from('forum_posts_with_users')
      .select('*')
      .range(from, to);
    
    // Aplicar filtros
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    // Aplicar ordenamiento según parámetro
    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('upvotes', { ascending: false });
    } else if (sortBy === 'trending') {
      // Trending: posts con más actividad reciente (upvotes + comentarios en las últimas 24h)
      query = query.order('created_at', { ascending: false });
      // Nota: Para trending real necesitaríamos una columna de "hotness_score"
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      logger.error('Error en getPostsOptimized', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return {
        success: true,
        data: { posts: [], total: 0 },
        page,
        limit,
        hasMore: false
      };
    }
    
    // Obtener IDs de posts para consultar counts por separado
    const postIds = data.map(post => post.id);
    
    // Obtener contadores de comentarios y votos en paralelo
    const [commentsResult, votesResult] = await Promise.allSettled([
      supabase
        .from('forum_comments')
        .select('post_id')
        .in('post_id', postIds),
      supabase
        .from('forum_votes')
        .select('post_id')
        .in('post_id', postIds)
    ]);
    
    // Procesar contadores de comentarios
    const commentCountMap = {};
    if (commentsResult.status === 'fulfilled' && commentsResult.value.data) {
      commentsResult.value.data.forEach(item => {
        commentCountMap[item.post_id] = (commentCountMap[item.post_id] || 0) + 1;
      });
    }
    
    // Procesar contadores de votos
    const voteCountMap = {};
    if (votesResult.status === 'fulfilled' && votesResult.value.data) {
      votesResult.value.data.forEach(item => {
        voteCountMap[item.post_id] = (voteCountMap[item.post_id] || 0) + 1;
      });
    }
    
    // Procesar los datos para el formato esperado
    const enrichedPosts = data.map(post => {
      const commentCount = commentCountMap[post.id] || 0;
      const voteCount = voteCountMap[post.id] || 0;
      
      return {
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        tags: post.tags || [],
        upvotes: post.upvotes || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        is_verified: post.is_verified || false,
        view_count: post.view_count || 0,
        
        // Información de usuario desde la vista
        display_name: post.display_name || 'Usuario',
        avatar_url: post.avatar_url || null,
        user_role: post.user_role || 'member',
        full_name: post.display_name || 'Usuario',
        username: post.display_name ? post.display_name.split(' ')[0] : 'Usuario',
        
        // Contadores
        comment_count: commentCount,
        upvote_count: voteCount,
        
        // Campos compatibles
        user_reputation: 0,
        has_voted: false
      };
    });

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
    logger.error('Error en getPostsOptimized', error);
    // Fallback a la función original si falla la optimizada
    logger.info('Fallback a getPosts original');
    return getPosts({ page, limit, sortBy: sortBy === 'recent' ? 'created_at' : 'upvotes', tag });
  }
};

/**
 * Crea un nuevo post en el foro
 * @param {string} content - Contenido del post (10-500 caracteres)
 * @param {Array<string>} tags - Etiquetas del post (máx 3)
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createPost = async (content, tags = []) => {
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

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Crear post
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .insert({
        user_id: user.id,
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
 * @param {string} postId - ID del post a actualizar
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updatePost = async (postId, updates) => {
  try {
    // Validar que el usuario sea el dueño del post
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data: post } = await supabase
      .from(TABLES.POSTS)
      .select('user_id')
      .eq('id', postId)
      .single();

    if (!post) {
      throw new Error('Post no encontrado');
    }

    if (post.user_id !== user.id) {
      throw new Error('No tienes permiso para editar este post');
    }

    // Validar contenido si se está actualizando
    if (updates.content) {
      if (updates.content.length < VALIDATION.MIN_POST_LENGTH) {
        throw new Error(`El contenido debe tener al menos ${VALIDATION.MIN_POST_LENGTH} caracteres`);
      }
      if (updates.content.length > VALIDATION.MAX_POST_LENGTH) {
        throw new Error(`El contenido no puede exceder ${VALIDATION.MAX_POST_LENGTH} caracteres`);
      }
      updates.content = updates.content.trim();
    }

    // Validar tags si se están actualizando
    if (updates.tags && updates.tags.length > VALIDATION.MAX_TAGS) {
      throw new Error(`Máximo ${VALIDATION.MAX_TAGS} etiquetas permitidas`);
    }

    // Actualizar post
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .update(updates)
      .eq('id', postId)
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
 * @param {string} postId - ID del post a eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deletePost = async (postId) => {
  try {
    // Validar que el usuario sea el dueño del post
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data: post } = await supabase
      .from(TABLES.POSTS)
      .select('user_id')
      .eq('id', postId)
      .single();

    if (!post) {
      throw new Error('Post no encontrado');
    }

    if (post.user_id !== user.id) {
      throw new Error('No tienes permiso para eliminar este post');
    }

    // Eliminar post (CASCADE eliminará votos y comentarios relacionados)
    const { error } = await supabase
      .from(TABLES.POSTS)
      .delete()
      .eq('id', postId);

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
 * Vota por un post (incrementa el contador)
 * @param {string} postId - ID del post a votar
 * @returns {Promise<Object>} Resultado con nuevo conteo de votos
 */
export const upvotePost = async (postId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Usar función RPC para votación atómica
    const { data: newUpvotes, error } = await supabase.rpc(
      'increment_post_upvote',
      { post_id: postId, user_id: user.id }
    );

    if (error) throw error;

    return {
      success: true,
      data: { upvotes: newUpvotes },
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
 * Remueve el voto de un post (decrementa el contador)
 * @param {string} postId - ID del post
 * @returns {Promise<Object>} Resultado con nuevo conteo de votos
 */
export const removeVote = async (postId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Usar función RPC para remover voto atómicamente
    const { data: newUpvotes, error } = await supabase.rpc(
      'decrement_post_upvote',
      { post_id: postId, user_id: user.id }
    );

    if (error) throw error;

    return {
      success: true,
      data: { upvotes: newUpvotes },
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
 * Verifica si el usuario actual ya votó un post
 * @param {string} postId - ID del post
 * @returns {Promise<Object>} Resultado con estado de voto
 */
export const checkUserVote = async (postId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: true, data: { hasVoted: false } };
    }

    const { data: hasVoted, error } = await supabase.rpc(
      'has_user_voted',
      { post_id: postId, user_id: user.id }
    );

    if (error) throw error;

    return {
      success: true,
      data: { hasVoted: hasVoted || false }
    };
  } catch (error) {
    console.error('Error al verificar voto:', error);
    return {
      success: false,
      error: error.message,
      data: { hasVoted: false }
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
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error al obtener comentarios', error);
    throw error;
  }
};

/**
 * Obtiene comentarios para múltiples posts en una sola consulta (batch loading)
 * @param {string[]} postIds - Array de IDs de posts
 * @returns {Promise<Object>} Mapa de postId -> array de comentarios
 */
export const getCommentsBatch = async (postIds) => {
  try {
    if (!postIds || postIds.length === 0) {
      return {};
    }
    
    // Limitar batch size para evitar consultas demasiado grandes
    const batchSize = 20;
    const batches = [];
    
    for (let i = 0; i < postIds.length; i += batchSize) {
      batches.push(postIds.slice(i, i + batchSize));
    }
    
    const results = {};
    
    // Procesar cada batch en paralelo
    await Promise.all(batches.map(async (batch) => {
      const { data, error } = await supabase
        .from(TABLES.COMMENTS)
        .select('*')
        .in('post_id', batch)
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.warn('Error obteniendo batch de comentarios', error);
        return;
      }
      
      // Organizar comentarios por post_id
      data?.forEach(comment => {
        if (!results[comment.post_id]) {
          results[comment.post_id] = [];
        }
        results[comment.post_id].push(comment);
      });
    }));
    
    return results;
    
  } catch (error) {
    logger.error('Error en getCommentsBatch', error);
    return {};
  }
};

/**
 * Obtiene detalles consolidados de un post (comentarios + estado de voto del usuario)
 * @param {string|string[]} postId - ID del post o array de IDs
 * @returns {Promise<Object|Object[]>} Objeto con { comments, userVote } o array de objetos
 */
export const getPostDetails = async (postId) => {
  try {
    // Obtener usuario actual para verificar voto
    const { data: { user } } = await supabase.auth.getUser();
    
    // Determinar si es single o batch
    const isBatch = Array.isArray(postId);
    const postIds = isBatch ? postId : [postId];
    
    // Ejecutar consultas en paralelo para todos los posts
    const [commentsBatchPromise, votesPromise] = await Promise.allSettled([
      // Obtener comentarios en batch
      getCommentsBatch(postIds),
      
      // Verificar votos del usuario (solo si está autenticado)
      user ? supabase
        .from(TABLES.VOTES)
        .select('post_id')
        .in('post_id', postIds)
        .eq('user_id', user.id) : Promise.resolve({ data: [], error: null })
    ]);

    // Procesar comentarios
    const commentsBatch = commentsBatchPromise.status === 'fulfilled' 
      ? commentsBatchPromise.value
      : {};
    
    // Procesar votos
    const userVotes = votesPromise.status === 'fulfilled' && votesPromise.value.data
      ? new Set(votesPromise.value.data.map(v => v.post_id))
      : new Set();

    // Crear resultado
    const results = postIds.map(id => {
      const comments = commentsBatch[id] || [];
      const userVote = userVotes.has(id) ? 'upvote' : null;
      
      return {
        comments,
        userVote,
        hasError: commentsBatchPromise.status === 'rejected' || votesPromise.status === 'rejected'
      };
    });

    return isBatch ? results : results[0];
    
  } catch (error) {
    console.error('Error fetching post details:', error);
    // Devolver valores por defecto en caso de error
    const defaultResult = {
      comments: [],
      userVote: null,
      hasError: true
    };
    
    return Array.isArray(postId) ? postId.map(() => defaultResult) : defaultResult;
  }
};

/**
 * Agrega un comentario a un post
 * @param {string} postId - ID del post
 * @param {string} content - Contenido del comentario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const addComment = async (postId, content) => {
  try {
    // Validaciones
    if (!content || content.trim().length < VALIDATION.MIN_COMMENT_LENGTH) {
      throw new Error('El comentario no puede estar vacío');
    }

    if (content.length > VALIDATION.MAX_COMMENT_LENGTH) {
      throw new Error(`El comentario no puede exceder ${VALIDATION.MAX_COMMENT_LENGTH} caracteres`);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Verificar que el post existe
    const { data: post } = await supabase
      .from(TABLES.POSTS)
      .select('id')
      .eq('id', postId)
      .single();

    if (!post) {
      throw new Error('Post no encontrado');
    }

    // Crear comentario
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim()
      })
      .select(`
        *,
        user:profiles(id, display_name, avatar_url, role)
      `)
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
    // Obtener conteos en paralelo con manejo de errores individual
    const [
      postsResult,
      commentsResult,
      votesResult,
      topPostsResult
    ] = await Promise.allSettled([
      supabase.from(TABLES.POSTS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.COMMENTS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.VOTES).select('*', { count: 'exact', head: true }),
      supabase
        .from(TABLES.POSTS)
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(5)
    ]);

    // Extraer datos con valores por defecto
    const totalPosts = postsResult.status === 'fulfilled' 
      ? (postsResult.value.count || 0)
      : 0;
    
    const totalComments = commentsResult.status === 'fulfilled'
      ? (commentsResult.value.count || 0)
      : 0;
    
    const totalVotes = votesResult.status === 'fulfilled'
      ? (votesResult.value.count || 0)
      : 0;
    
    const topPostsRaw = topPostsResult.status === 'fulfilled'
      ? (topPostsResult.value.data || [])
      : [];

    // Enriquecer top posts con información de usuario - con manejo robusto
    let topPosts = [];
    if (topPostsRaw && Array.isArray(topPostsRaw) && topPostsRaw.length > 0) {
      const userIds = [...new Set(topPostsRaw.map(post => post.user_id).filter(Boolean))];
      
      if (userIds.length > 0) {
        try {
          // Usar el sistema de caché para obtener perfiles
          const profiles = await getCachedUserProfiles(userIds);
          
          const userMap = {};
          profiles.forEach((profile, index) => {
            const userId = userIds[index];
            if (profile) {
              userMap[userId] = {
                display_name: profile.display_name || profile.full_name || profile.username || 
                             (profile.email ? profile.email.split('@')[0] : 'Usuario') || 'Usuario',
                avatar_url: profile.avatar_url || null
              };
            } else {
              userMap[userId] = {
                display_name: 'Usuario',
                avatar_url: null
              };
            }
          });

          topPosts = topPostsRaw.map(post => {
            if (!post) return null;
            const userInfo = post.user_id ? (userMap[post.user_id] || {}) : {};
            return {
              ...post,
              display_name: userInfo.display_name || 'Usuario',
              avatar_url: userInfo.avatar_url || null,
              full_name: userInfo.display_name || 'Usuario'
            };
          }).filter(Boolean); // Filtrar posts nulos
        } catch (error) {
          logger.warn('Error enriqueciendo top posts desde caché', error);
          // Fallback: posts sin información de usuario
          topPosts = topPostsRaw.map(post => ({
            ...post,
            display_name: 'Usuario',
            avatar_url: null,
            full_name: 'Usuario'
          })).filter(Boolean);
        }
      } else {
        // No hay user_ids válidos
        topPosts = topPostsRaw.map(post => ({
          ...post,
          display_name: 'Usuario',
          avatar_url: null,
          full_name: 'Usuario'
        })).filter(Boolean);
      }
    }

    return {
      success: true,
      data: {
        totalPosts,
        totalComments,
        totalVotes,
        topPosts: topPosts || []
      }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      error: error.message,
      data: {
        totalPosts: 0,
        totalComments: 0,
        totalVotes: 0,
        topPosts: []
      }
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
    const { data, error } = await supabase
      .from('user_forum_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    // Calcular nivel basado en actividad
    const stats = data || {
      post_count: 0,
      comment_count: 0,
      total_upvotes_received: 0,
      verified_posts_count: 0
    };

    const score = (stats.post_count * 10) + 
                  (stats.comment_count * 3) + 
                  stats.total_upvotes_received + 
                  (stats.verified_posts_count * 50);

    let level = 1;
    let title = 'Prompt Learner';

    if (score >= 1000) {
      level = 5;
      title = 'Prompt Master Elite';
    } else if (score >= 500) {
      level = 4;
      title = 'Prompt Master Avanzado';
    } else if (score >= 200) {
      level = 3;
      title = 'Prompt Master';
    } else if (score >= 50) {
      level = 2;
      title = 'Prompt Creator';
    }

    return {
      success: true,
      data: {
        ...stats,
        level,
        title,
        score
      }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de usuario:', error);
    return {
      success: false,
      error: error.message,
      data: {
        post_count: 0,
        comment_count: 0,
        total_upvotes_received: 0,
        verified_posts_count: 0,
        level: 1,
        title: 'Prompt Learner',
        score: 0
      }
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
    
    // Configurar listeners para cada tabla
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.POSTS
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
          schema: 'public',
          table: TABLES.COMMENTS
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
          schema: 'public',
          table: TABLES.VOTES
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
        console.log('✅ Suscrito a updates del foro');
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
  getPostsOptimized,
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
  getPostDetails,
  
  // Estadísticas
  getForumStats,
  getUserStats,
  
  // Tags
  getPopularTags,
  
  // Realtime
  subscribeToForumUpdates,
  
  // Constantes
  VALIDATION,
  TABLES
};

export default forumService;