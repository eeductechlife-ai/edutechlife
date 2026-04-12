import { useState, useEffect, useCallback, useRef } from 'react';
import { forumService } from '../../lib/forumService';

// Logger para desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';
const logger = {
  info: (message, data) => isDevelopment && console.info(`[useInfiniteScroll] ${message}:`, data),
  warn: (message, data) => isDevelopment && console.warn(`[useInfiniteScroll] ${message}:`, data),
  error: (message, data) => isDevelopment && console.error(`[useInfiniteScroll] ${message}:`, data)
};

/**
 * Hook para paginación infinita en el foro
 * Optimiza rendimiento cargando posts por lotes con debouncing y prefetching
 */
const useInfiniteScroll = ({
  initialLimit = 10,
  sortBy = 'recent',
  tagFilter = null,
  enabled = true,
  debounceDelay = 300 // ms de delay para debouncing
} = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  
  const observerRef = useRef();
  const lastPostRef = useRef();
  const isInitialMount = useRef(true);
  const debounceTimeoutRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastLoadTimeRef = useRef(0);

  /**
   * Carga posts iniciales o resetea con nuevos filtros
   */
  const loadPosts = useCallback(async (reset = false) => {
    if (!enabled) return;
    
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }
      
      setError('');
      
      const currentPage = reset ? 1 : page;
      const options = {
        page: currentPage,
        limit: initialLimit,
        sortBy,
        tag: tagFilter
      };
      
      const result = await forumService.getPostsOptimized(options);
      
      if (result.success) {
        const newPosts = result.data.posts || [];
        const total = result.data.total || 0;
        
        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts(prev => {
            // Evitar duplicados
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
            return [...prev, ...uniqueNewPosts];
          });
        }
        
        setTotalPosts(total);
        setHasMore(newPosts.length === initialLimit);
        
        if (!reset) {
          setPage(prev => prev + 1);
        }
      } else {
        setError(result.error || 'Error al cargar posts');
      }
    } catch (err) {
      console.error('Error en loadPosts:', err);
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [enabled, page, initialLimit, sortBy, tagFilter]);

  /**
   * Carga más posts cuando se llega al final
   */
  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore && enabled) {
      loadPosts(false);
    }
  }, [loading, loadingMore, hasMore, enabled, loadPosts]);

  /**
   * Prefetch de la siguiente página (carga en segundo plano)
   */
  const prefetchNextPage = useCallback(async () => {
    if (!hasMore || loadingMore || !enabled) return;
    
    try {
      const nextPage = page + 1;
      const options = {
        page: nextPage,
        limit: initialLimit,
        sortBy,
        tag: tagFilter
      };
      
      // Cargar en segundo plano sin actualizar estado
      await forumService.getPostsOptimized(options);
      // Los datos se almacenan en caché de Supabase automáticamente
      logger.info(`Prefetch completado para página ${nextPage}`);
      
    } catch (error) {
      // Silenciar errores de prefetch
      logger.warn('Error en prefetch', error);
    }
  }, [hasMore, loadingMore, enabled, page, initialLimit, sortBy, tagFilter]);

  /**
   * Versión optimizada con requestAnimationFrame, throttling y prefetching
   */
  const debouncedLoadMore = useCallback(() => {
    const now = Date.now();
    const MIN_TIME_BETWEEN_LOADS = 200; // ms mínimo entre cargas
    
    // Throttling: evitar cargas demasiado frecuentes
    if (now - lastLoadTimeRef.current < MIN_TIME_BETWEEN_LOADS) {
      return;
    }
    
    // Cancelar RAF anterior si existe
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Usar requestAnimationFrame para mejor performance
    rafIdRef.current = requestAnimationFrame(() => {
      // Limpiar timeout anterior
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Configurar timeout con delay reducido
      debounceTimeoutRef.current = setTimeout(() => {
        loadMore();
        lastLoadTimeRef.current = Date.now();
        
        // Intentar prefetch después de cargar
        setTimeout(() => {
          prefetchNextPage();
        }, 500);
      }, Math.max(debounceDelay, 100)); // Mínimo 100ms
    });
  }, [loadMore, debounceDelay, prefetchNextPage]);

  /**
   * Observador de intersección para carga infinita con debouncing
   */
  const setupObserver = useCallback(() => {
    if (!lastPostRef.current || !hasMore || loadingMore) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          debouncedLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Cargar antes de llegar al final
        threshold: 0.05 // Más sensible para mejor UX
      }
    );
    
    observerRef.current.observe(lastPostRef.current);
  }, [hasMore, loadingMore, debouncedLoadMore]);

  /**
   * Refrescar posts (para updates en tiempo real)
   */
  const refreshPosts = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      const result = await forumService.getPosts({
        page: 1,
        limit: initialLimit,
        sortBy,
        tag: tagFilter
      });
      
      if (result.success) {
        setPosts(result.data.posts || []);
        setTotalPosts(result.data.total || 0);
        setPage(2); // Resetear página para siguiente carga
        setHasMore((result.data.posts?.length || 0) === initialLimit);
      }
    } catch (err) {
      console.error('Error refrescando posts:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled, initialLimit, sortBy, tagFilter]);

  /**
   * Actualizar un post específico (para votos/comentarios)
   */
  const updatePost = useCallback((postId, updates) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  }, []);

  /**
   * Añadir un nuevo post (desde creación en tiempo real)
   */
  const addNewPost = useCallback((newPost) => {
    setPosts(prev => {
      // Evitar duplicados
      if (prev.some(p => p.id === newPost.id)) {
        return prev;
      }
      return [newPost, ...prev];
    });
  }, []);

  /**
   * Eliminar un post
   */
  const removePost = useCallback((postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  /**
   * Resetear con nuevos filtros
   */
  const resetWithFilters = useCallback((newFilters) => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError('');
    // loadPosts se llamará automáticamente en el efecto
  }, []);

  // Efecto para carga inicial
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadPosts(true);
    }
  }, [loadPosts]);

  // Efecto para resetear cuando cambian filtros
  useEffect(() => {
    if (!isInitialMount.current) {
      resetWithFilters();
      loadPosts(true);
    }
  }, [sortBy, tagFilter, resetWithFilters, loadPosts]);

  // Efecto para configurar observer
  useEffect(() => {
    if (posts.length > 0 && hasMore) {
      setupObserver();
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Limpiar timeout de debouncing
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      // Limpiar RAF
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [posts.length, hasMore, setupObserver]);

  return {
    // Estado
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    totalPosts,
    
    // Referencias
    lastPostRef,
    
    // Acciones
    loadMore,
    refreshPosts,
    updatePost,
    addNewPost,
    removePost,
    resetWithFilters,
    
    // Utilidades
    isEmpty: posts.length === 0 && !loading,
    showLoadMore: hasMore && !loading && posts.length > 0
  };
};

export default useInfiniteScroll;