import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import PostCard from './PostCard';

/**
 * Componente de lista virtualizada para posts del foro
 * Solo renderiza los posts visibles en el viewport
 */
const VirtualizedPostList = ({ 
  posts, 
  onVoteChange, 
  onCommentAdded,
  compact = false,
  loadingMore = false,
  lastPostRef = null
}) => {
  const containerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [containerHeight, setContainerHeight] = useState(0);
  const postHeight = compact ? 120 : 200; // Altura estimada por post
  const buffer = 5; // Posts adicionales a renderizar fuera del viewport

  // Calcular qué posts son visibles
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    
    const start = Math.max(0, Math.floor(scrollTop / postHeight) - buffer);
    const end = Math.min(
      posts.length,
      Math.ceil((scrollTop + clientHeight) / postHeight) + buffer
    );
    
    setVisibleRange({ start, end });
    setContainerHeight(container.scrollHeight);
  }, [posts.length, postHeight, buffer]);

  // Configurar observer de scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    calculateVisibleRange();
    
    const handleScroll = () => {
      requestAnimationFrame(calculateVisibleRange);
    };
    
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateVisibleRange);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateVisibleRange);
    };
  }, [calculateVisibleRange]);

  // Recalcular cuando cambian los posts
  useEffect(() => {
    calculateVisibleRange();
  }, [posts.length, calculateVisibleRange]);

  // Posts visibles
  const visiblePosts = posts.slice(visibleRange.start, visibleRange.end);
  
  // Altura del spacer superior
  const topSpacerHeight = visibleRange.start * postHeight;
  
  // Altura del spacer inferior
  const bottomSpacerHeight = Math.max(0, (posts.length - visibleRange.end) * postHeight);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto"
      style={{ 
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Spacer superior para mantener scroll position */}
      <div style={{ height: `${topSpacerHeight}px` }} />
      
      {/* Posts visibles */}
      <div className="space-y-4">
        {visiblePosts.map((post, index) => {
          const actualIndex = visibleRange.start + index;
          const isLastPost = actualIndex === posts.length - 1;
          
          return (
            <div 
              key={post.id} 
              ref={isLastPost ? lastPostRef : null}
            >
              <PostCard
                post={post}
                onVoteChange={onVoteChange}
                onCommentAdded={onCommentAdded}
                compact={compact}
                showComments={!compact}
              />
            </div>
          );
        })}
      </div>
      
      {/* Loading indicator */}
      {loadingMore && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#00BCD4] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-[#004B63]">
              Cargando más posts...
            </span>
          </div>
        </div>
      )}
      
      {/* Spacer inferior para mantener scroll position */}
      <div style={{ height: `${bottomSpacerHeight}px` }} />
      
      {/* Altura total del contenedor (para scrollbar) */}
      <div style={{ height: `${containerHeight}px`, opacity: 0 }} />
    </div>
  );
};

VirtualizedPostList.propTypes = {
  posts: PropTypes.array.isRequired,
  onVoteChange: PropTypes.func,
  onCommentAdded: PropTypes.func,
  compact: PropTypes.bool,
  loadingMore: PropTypes.bool,
  lastPostRef: PropTypes.object
};

export default VirtualizedPostList;