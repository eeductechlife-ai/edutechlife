import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import PostCard from './PostCard';
import ForumInput from './ForumInput';
import VirtualizedPostList from './VirtualizedPostList';
import { forumService } from '../../lib/forumService';
import { useAuth } from '../../context/AuthContext';
import useInfiniteScroll from './useInfiniteScroll';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn } from './forumDesignSystem';

// Logger para desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';
const logger = {
  error: (message, error) => isDevelopment && console.error(`[ForumCommunity] ${message}:`, error),
  warn: (message, data) => isDevelopment && console.warn(`[ForumCommunity] ${message}:`, data),
  info: (message, data) => isDevelopment && console.info(`[ForumCommunity] ${message}:`, data)
};

const ForumCommunity = ({ 
  initialPosts = [],
  showHeader = true,
  showInput = true,
  limit = 10,
  compact = false,
  filterByTag = null,
  showStats = true
}) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    sortBy: 'recent',
    tag: filterByTag
  });
  const [stats, setStats] = useState(null);
  const [popularTags, setPopularTags] = useState([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  // Hook de paginación infinita
  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    totalPosts,
    lastPostRef,
    refreshPosts,
    updatePost,
    addNewPost,
    removePost,
    resetWithFilters,
    isEmpty,
    showLoadMore
  } = useInfiniteScroll({
    initialLimit: limit,
    sortBy: filters.sortBy,
    tagFilter: filters.tag,
    enabled: !!user
  });

  const loadInitialData = useCallback(async () => {
    if (!user) return;
    
    try {
      // Cargar stats y tags en paralelo
      const [statsResult, tagsResult] = await Promise.allSettled([
        forumService.getForumStats(),
        forumService.getPopularTags(10)
      ]);
      
      // Procesar stats
      if (statsResult.status === 'fulfilled' && statsResult.value.success) {
        setStats(statsResult.value.data);
      } else {
        logger.warn('Error cargando stats:', statsResult.reason);
        setStats(null);
      }
      
      // Procesar tags
      if (tagsResult.status === 'fulfilled') {
        setPopularTags(Array.isArray(tagsResult.value) ? tagsResult.value : []);
      } else {
        logger.warn('Error cargando tags populares:', tagsResult.reason);
        setPopularTags([]);
      }
      
      return true;
    } catch (error) {
      logger.error('Error cargando datos iniciales', error);
      return false;
    }
  }, [user]);

  const setupRealtime = useCallback(() => {
    if (!user) {
      logger.info('Usuario no autenticado, saltando suscripción realtime');
      return () => {}; // Retornar función vacía para cleanup
    }

    logger.info('Configurando suscripción realtime para usuario:', user.id);
    
    let subscription = null;
    let lastUpdateTime = 0;
    const UPDATE_THROTTLE_MS = 1000; // 1 segundo entre updates
    
    try {
      subscription = forumService.subscribeToForumUpdates(
        (update) => {
          const now = Date.now();
          
          // Throttling: ignorar updates muy frecuentes
          if (now - lastUpdateTime < UPDATE_THROTTLE_MS) {
            logger.info('Update throttled (demasiado rápido):', update.type);
            return;
          }
          
          lastUpdateTime = now;
          logger.info('Update recibido:', update.type);
          
          // Solo mantener los últimos 3 updates en UI
          setRealtimeUpdates(prev => [...prev.slice(-2), update]);
          
          // Procesar update según tipo
          switch (update.type) {
            case 'forum_posts_INSERT':
              logger.info('Nuevo post:', update.data.id);
              addNewPost(update.data);
              break;
              
            case 'forum_posts_UPDATE':
              logger.info('Post actualizado:', update.data.id);
              updatePost(update.data.id, update.data);
              break;
              
            case 'forum_posts_DELETE':
              logger.info('Post eliminado:', update.oldData?.id);
              removePost(update.oldData?.id);
              break;
              
            case 'forum_comments_INSERT':
              logger.info('Nuevo comentario en post:', update.data.post_id);
              // Actualizar contador de comentarios
              updatePost(update.data.post_id, {
                comment_count: (posts.find(p => p.id === update.data.post_id)?.comment_count || 0) + 1
              });
              break;
              
            case 'forum_votes_INSERT':
              logger.info('Nuevo voto en post:', update.data.post_id);
              // Actualizar contador de votos
              updatePost(update.data.post_id, {
                upvote_count: (posts.find(p => p.id === update.data.post_id)?.upvote_count || 0) + 1
              });
              break;
              
            case 'forum_votes_DELETE':
              logger.info('Voto eliminado en post:', update.oldData?.post_id);
              // Actualizar contador de votos
              updatePost(update.oldData?.post_id, {
                upvote_count: Math.max((posts.find(p => p.id === update.oldData?.post_id)?.upvote_count || 0) - 1, 0)
              });
              break;
              
            default:
              logger.info('Update no procesado:', update.type);
          }
        },
        (error) => {
          logger.error('Error en suscripción realtime:', error);
        }
      );
      
      return subscription?.unsubscribe || (() => {});
      
    } catch (error) {
      logger.error('Error configurando suscripción:', error);
      return () => {}; // Retornar función vacía para cleanup
    }
  }, [user, addNewPost, updatePost, removePost, posts]);

  useEffect(() => {
    let unsubscribe = () => {};
    let mounted = true;
    
    const init = async () => {
      if (!mounted || !user) return;
      
      try {
        // Usar la función consolidada para cargar datos iniciales
        const success = await loadInitialData();
        
        if (mounted && success) {
          unsubscribe = setupRealtime();
        }
      } catch (error) {
        logger.error('Error inicializando foro', error);
      }
    };
    
    init();
    
    return () => {
      mounted = false;
      try {
        unsubscribe();
      } catch (error) {
        logger.warn('Error en cleanup', error);
      }
    };
  }, [loadInitialData, setupRealtime]);

  const handlePostCreated = useCallback((newPost) => {
    addNewPost(newPost);
    if (user) {
      // Actualizar stats y tags después de crear un post
      loadInitialData();
    }
  }, [addNewPost, user, loadInitialData]);

  const handleVoteChange = useCallback((postId, voteDelta) => {
    updatePost(postId, { 
      upvote_count: (posts.find(p => p.id === postId)?.upvote_count || 0) + voteDelta 
    });
  }, [updatePost, posts]);

  const handleCommentAdded = useCallback((postId, newComment) => {
    updatePost(postId, { 
      comment_count: (posts.find(p => p.id === postId)?.comment_count || 0) + 1,
      latest_comment: newComment
    });
  }, [updatePost, posts]);

  const handleSortChange = useCallback((sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
    resetWithFilters({ sortBy });
  }, [resetWithFilters]);

  const handleTagFilter = useCallback((tag) => {
    const newTag = tag === filters.tag ? null : tag;
    setFilters(prev => ({ ...prev, tag: newTag }));
    resetWithFilters({ tag: newTag });
  }, [filters.tag, resetWithFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters({ sortBy: 'recent', tag: null });
    resetWithFilters({ sortBy: 'recent', tag: null });
  }, [resetWithFilters]);

  const formatNumber = useCallback((num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  }, []);

  if (!user) {
    return (
      <div className={cn(
        FORUM_COMPONENTS.CARD_GLASS,
        "text-center py-12"
      )}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#004B63]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className={cn(
          FORUM_TYPOGRAPHY.DISPLAY.SM,
          "text-[#004B63] mb-3"
        )}>
          Inicia sesión para participar
        </h3>
        <p className={cn(
          FORUM_TYPOGRAPHY.BODY.MD,
          "text-[#004B63]/70 max-w-md mx-auto"
        )}>
          El Muro de Insights es exclusivo para miembros de la comunidad Edutechlife
        </p>
      </div>
    );
  }

  return (
    <div className={cn(compact ? '' : 'space-y-6')}>
      {/* Header premium con gradiente corporativo */}
      {showHeader && !compact && (
        <div className={cn(
          "rounded-2xl p-6 mb-6",
          GRADIENTS.PRIMARY,
          FORUM_EFFECTS.SHADOW_LG
        )}>
          <h3 className={cn(
            FORUM_TYPOGRAPHY.DISPLAY.LG,
            "text-white mb-3"
          )}>
            Muro de Insights: The Prompt Collective
          </h3>
          <p className={cn(
            FORUM_TYPOGRAPHY.BODY.LG,
            "text-white/90 max-w-2xl"
          )}>
            Co-crea, debate y descubre los prompts que están redefiniendo la industria.
          </p>
        </div>
      )}

      {/* Stats Bar - Diseño corporativo */}
      {showStats && !compact && stats && (
        <div className={cn(
          FORUM_COMPONENTS.CARD_ACCENT,
          "mb-6 p-4"
        )}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={cn(
                  FORUM_TYPOGRAPHY.DISPLAY.MD,
                  "text-[#004B63]"
                )}>
                  {formatNumber(stats?.total_posts)}
                </div>
                <div className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#004B63]/70 uppercase tracking-wider"
                )}>
                  Posts
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  FORUM_TYPOGRAPHY.DISPLAY.MD,
                  "text-[#00BCD4]"
                )}>
                  {formatNumber(stats?.total_comments)}
                </div>
                <div className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#00BCD4]/70 uppercase tracking-wider"
                )}>
                  Comentarios
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  FORUM_TYPOGRAPHY.DISPLAY.MD,
                  "text-[#004B63]"
                )}>
                  {formatNumber(stats?.total_votes)}
                </div>
                <div className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#004B63]/70 uppercase tracking-wider"
                )}>
                  Votos
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  FORUM_TYPOGRAPHY.DISPLAY.MD,
                  "text-[#00BCD4]"
                )}>
                  {stats?.active_users || 0}
                </div>
                <div className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#00BCD4]/70 uppercase tracking-wider"
                )}>
                  Usuarios activos
                </div>
              </div>
            </div>

            {stats.user_stats && (
              <div className="text-right">
                <div className={cn(
                  FORUM_TYPOGRAPHY.BODY.SM,
                  FORUM_TYPOGRAPHY.MEDIUM,
                  "text-[#004B63]"
                )}>
                  Tu reputación: <span className="text-[#00BCD4]">{stats.user_stats.reputation}</span>
                </div>
                <div className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#004B63]/70"
                )}>
                  Nivel: <span className="font-medium text-[#004B63]">{stats.user_stats.level}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input - SIEMPRE en modo normal (no compacto) para mostrar textarea completo */}
      {showInput && (
        <ForumInput 
          onPostCreated={handlePostCreated}
          compact={false}
        />
      )}

      {/* Filtros - Diseño corporativo */}
      {!compact && (
        <div className={cn(
          "flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-4 mb-6 p-4",
          "bg-[#F8FAFC] rounded-xl border border-[#004B63]/10"
        )}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              FORUM_TYPOGRAPHY.BODY.SM,
              FORUM_TYPOGRAPHY.MEDIUM,
              "text-[#004B63]"
            )}>
              Ordenar por:
            </span>
            {['recent', 'popular', 'trending'].map((sortOption) => (
              <button
                key={sortOption}
                onClick={() => handleSortChange(sortOption)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full",
                  FORUM_EFFECTS.TRANSITION_ALL,
                  filters.sortBy === sortOption
                    ? 'bg-[#004B63] text-white hover:bg-[#00374A]'
                    : 'bg-white text-[#004B63] border border-[#004B63]/20 hover:bg-[#004B63]/10'
                )}
              >
                <span className="hidden sm:inline">
                  {sortOption === 'recent' && 'Más recientes'}
                  {sortOption === 'popular' && 'Más populares'}
                  {sortOption === 'trending' && 'Tendencia'}
                </span>
                <span className="sm:hidden">
                  {sortOption === 'recent' && 'Recientes'}
                  {sortOption === 'popular' && 'Populares'}
                  {sortOption === 'trending' && 'Trending'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              FORUM_TYPOGRAPHY.BODY.SM,
              FORUM_TYPOGRAPHY.MEDIUM,
              "text-[#004B63] hidden sm:inline"
            )}>
              Filtrar por tag:
            </span>
            <span className={cn(
              FORUM_TYPOGRAPHY.BODY.SM,
              FORUM_TYPOGRAPHY.MEDIUM,
              "text-[#004B63] sm:hidden"
            )}>
              Tags:
            </span>
            {Array.isArray(popularTags) && popularTags.slice(0, 3).map((tag) => (
              <button
                key={tag.name}
                onClick={() => handleTagFilter(tag.name)}
                className={cn(
                  "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm rounded-full",
                  FORUM_EFFECTS.TRANSITION_ALL,
                  filters.tag === tag.name
                    ? 'bg-[#00BCD4] text-white hover:bg-[#00A5C2]'
                    : 'bg-white text-[#004B63] border border-[#004B63]/20 hover:bg-[#004B63]/10'
                )}
              >
                #{tag.name} {tag.count && <span className="hidden sm:inline opacity-75">({tag.count})</span>}
              </button>
            ))}
            
            {filters.tag && (
              <button
                onClick={handleClearFilters}
                className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  FORUM_TYPOGRAPHY.MEDIUM,
                  "px-2 py-1 text-[#00BCD4] hover:text-[#004B63]",
                  FORUM_EFFECTS.TRANSITION_COLORS
                )}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State (initial) - Skeleton mejorado */}
      {loading && posts.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={cn(
              FORUM_COMPONENTS.CARD_GLASS,
              "p-4 animate-pulse"
            )}>
              {/* Header del skeleton */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className={`h-3 bg-gradient-to-r from-[#004B63]/10 to-[#004B63]/20 rounded ${i % 2 === 0 ? 'w-1/3' : 'w-1/4'}`}></div>
                  <div className="h-2 bg-[#004B63]/10 rounded w-1/6"></div>
                </div>
              </div>
              
              {/* Contenido del skeleton con variabilidad */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gradient-to-r from-[#004B63]/10 to-[#004B63]/20 rounded"></div>
                <div className={`h-3 bg-gradient-to-r from-[#004B63]/10 to-[#004B63]/20 rounded ${i === 1 ? 'w-4/5' : 'w-full'}`}></div>
                <div className={`h-3 bg-gradient-to-r from-[#004B63]/10 to-[#004B63]/20 rounded ${i === 2 ? 'w-2/3' : 'w-3/4'}`}></div>
              </div>
              
              {/* Tags del skeleton */}
              <div className="flex flex-wrap gap-1 mb-4">
                <div className="w-12 h-5 bg-[#004B63]/10 rounded-full"></div>
                <div className="w-16 h-5 bg-[#00BCD4]/10 rounded-full"></div>
                <div className="w-10 h-5 bg-[#004B63]/10 rounded-full"></div>
              </div>
              
              {/* Footer del skeleton */}
              <div className="flex items-center justify-between pt-3 border-t border-[#004B63]/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-[#004B63]/10 rounded"></div>
                    <div className="w-6 h-3 bg-[#004B63]/10 rounded"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-[#00BCD4]/10 rounded"></div>
                    <div className="w-8 h-3 bg-[#00BCD4]/10 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-[#004B63]/10 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={cn(
          FORUM_COMPONENTS.CARD_GLASS,
          "text-center py-12"
        )}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F44336]/10 to-[#F44336]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#F44336]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className={cn(
            FORUM_TYPOGRAPHY.DISPLAY.SM,
            "text-[#004B63] mb-3"
          )}>
            Error al cargar
          </h3>
          <p className={cn(
            FORUM_TYPOGRAPHY.BODY.MD,
            "text-[#004B63]/70 mb-6 max-w-md mx-auto"
          )}>
            {error}
          </p>
          <button
            onClick={refreshPosts}
            className={cn(
              FORUM_COMPONENTS.BUTTON_SECONDARY,
              "px-6 py-2"
            )}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Posts */}
      {!loading && !error && (
        <div className="space-y-4">
           {isEmpty ? (
            <div className={cn(
              FORUM_COMPONENTS.CARD_GLASS,
              "text-center py-12"
            )}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#004B63]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={cn(
                FORUM_TYPOGRAPHY.DISPLAY.SM,
                "text-[#004B63] mb-3"
              )}>
                {filters.tag ? `No hay posts con el tag #${filters.tag}` : 'No hay posts todavía'}
              </h3>
              <p className={cn(
                FORUM_TYPOGRAPHY.BODY.MD,
                "text-[#004B63]/70 max-w-md mx-auto"
              )}>
                {filters.tag 
                  ? 'Sé el primero en publicar sobre este tema'
                  : 'Sé el primero en compartir un insight con la comunidad'}
              </p>
            </div>
          ) : (
            <>
              {/* Lista virtualizada de posts */}
              <VirtualizedPostList
                posts={posts}
                onVoteChange={handleVoteChange}
                onCommentAdded={handleCommentAdded}
                compact={compact}
                loadingMore={loadingMore}
                lastPostRef={lastPostRef}
              />
              
              {/* Load More Button (fallback) */}
              {showLoadMore && !loadingMore && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => resetWithFilters({})}
                    className={cn(
                      FORUM_COMPONENTS.BUTTON_OUTLINE,
                      "px-6 py-2"
                    )}
                  >
                    Ver más posts ({totalPosts - posts.length} restantes)
                  </button>
                </div>
              )}
              
              {/* End of Content */}
               {!hasMore && posts.length > 0 && (
                <div className="text-center py-8">
                  <div className={cn(
                    "inline-flex items-center gap-3 px-4 py-3 rounded-xl",
                    "bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5",
                    "border border-[#004B63]/10"
                  )}>
                    <div className="w-5 h-5 rounded-full bg-[#00BCD4]/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#00BCD4]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className={cn(
                      FORUM_TYPOGRAPHY.BODY.SM,
                      "text-[#004B63]"
                    )}>
                      Has visto todos los posts
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Actividad reciente - Diseño corporativo */}
      {realtimeUpdates.length > 0 && !compact && (
        <div className="mt-8 pt-6 border-t border-[#004B63]/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#00BCD4] rounded-full animate-pulse"></div>
            <span className={cn(
              FORUM_TYPOGRAPHY.BODY.SM,
              FORUM_TYPOGRAPHY.MEDIUM,
              "text-[#004B63]"
            )}>
              Actividad reciente
            </span>
          </div>
          <div className="space-y-2">
            {realtimeUpdates.slice().reverse().map((update, index) => (
              <div 
                key={index} 
                className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#004B63]/70 bg-[#F8FAFC] p-3 rounded-xl animate-fade-in",
                  "border border-[#004B63]/5"
                )}
              >
                {update.type === 'post_created' && (
                  <span>
                    <span className="font-medium text-[#004B63]">{update.username}</span> publicó un nuevo post
                  </span>
                )}
                {update.type === 'comment_created' && (
                  <span>
                    <span className="font-medium text-[#004B63]">{update.username}</span> comentó en un post
                  </span>
                )}
                 {update.type === 'vote_created' && (
                   <span>
                     <span className="font-medium text-[#004B63]">{update.username}</span> votó un post
                   </span>
                 )}
                 <span className="ml-2 text-[10px] opacity-75">
                   {new Date(update.timestamp).toLocaleTimeString('es-ES', { 
                     hour: '2-digit', 
                     minute: '2-digit' 
                   })}
                 </span>
               </div>
             ))}
           </div>
         </div>
        )}
     </div>
   );
 };

ForumCommunity.propTypes = {
  initialPosts: PropTypes.array,
  showHeader: PropTypes.bool,
  showInput: PropTypes.bool,
  limit: PropTypes.number,
  compact: PropTypes.bool,
  filterByTag: PropTypes.string,
  showStats: PropTypes.bool
};

// Función de comparación para memoización
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.compact === nextProps.compact &&
    prevProps.showHeader === nextProps.showHeader &&
    prevProps.showInput === nextProps.showInput &&
    prevProps.showStats === nextProps.showStats &&
    prevProps.limit === nextProps.limit &&
    prevProps.filterByTag === nextProps.filterByTag &&
    JSON.stringify(prevProps.initialPosts) === JSON.stringify(nextProps.initialPosts)
  );
};

export default memo(ForumCommunity, arePropsEqual);