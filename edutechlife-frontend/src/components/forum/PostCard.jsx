import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent, CardFooter } from '../../design-system/components/Card';
import Avatar from '../../design-system/components/Avatar';
import { forumService } from '../../lib/forumService';
import { useAuth } from '../../context/AuthContext';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn } from './forumDesignSystem';
import LazyImage from './LazyImage';

const PostCard = ({ 
  post, 
  onVoteChange, 
  onCommentAdded,
  compact = false,
  showComments = true 
}) => {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (post?.id) {
      loadPostDetails();
    }
  }, [post?.id, user?.id]);

  const loadPostDetails = async () => {
    if (!post?.id) return;
    
    setIsLoadingComments(true);
    try {
      const { comments, userVote, hasError } = await forumService.getPostDetails(post.id);
      setComments(comments);
      setUserVote(userVote);
      
      if (hasError) {
        console.warn('Algunas consultas fallaron al cargar detalles del post');
      }
    } catch (error) {
      console.error('Error loading post details:', error);
      // Establecer valores por defecto en caso de error
      setComments([]);
      setUserVote(null);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleUpvote = async () => {
    if (!user || !post?.id || isVoting) return;
    
    setIsVoting(true);
    try {
      const newVoteStatus = await forumService.toggleVote(post.id);
      setUserVote(newVoteStatus ? 'upvote' : null);
      
      if (onVoteChange) {
        onVoteChange(post.id, newVoteStatus);
      }
    } catch (error) {
      console.error('Error toggling vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !post?.id || !commentText.trim() || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    try {
      const newComment = await forumService.addComment(
        post.id,
        commentText.trim()
      );
      
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      setShowCommentInput(false);
      
      if (onCommentAdded) {
        onCommentAdded(post.id, newComment);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    
    return postDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getUserLevel = (reputation) => {
    if (reputation >= 100) return { label: 'Prompt Master', color: 'bg-gradient-to-r from-[#004B63] to-[#00BCD4]' };
    if (reputation >= 50) return { label: 'Prompt Creator', color: 'bg-[#004B63]/80' };
    if (reputation >= 10) return { label: 'Prompt Learner', color: 'bg-[#004B63]/60' };
    return { label: 'Nuevo', color: 'bg-[#004B63]/40' };
  };

  const levelInfo = getUserLevel(post?.user_reputation || 0);

  if (!post) return null;

  // Sistema de comentarios: mostrar solo el último inicialmente, luego 2 más al expandir
  const displayedComments = showAllComments 
    ? comments.slice(0, 3) // Mostrar máximo 3 comentarios al expandir
    : comments.length > 0 
      ? [comments[0]] // Solo el último comentario
      : [];

   return (
     <div 
       className={cn(
         FORUM_COMPONENTS.CARD_GLASS,
         "mb-4",
         compact ? "p-3 sm:p-4" : "p-4 sm:p-5",
         FORUM_EFFECTS.TRANSITION_ALL,
         FORUM_EFFECTS.ANIMATION_FADE_IN,
         "hover:shadow-lg hover:shadow-[#004B63]/10"
       )}
       role="article"
       aria-label={`Post de ${post.full_name || post.username || 'Usuario'}: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`}
     >
      {/* Header del post - Diseño corporativo */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-start gap-2 sm:gap-3">
           <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden",
            "bg-gradient-to-br from-[#004B63] to-[#00BCD4]",
            FORUM_EFFECTS.SHADOW_SM
          )}>
            {post.avatar_url ? (
              <LazyImage
                src={post.avatar_url}
                alt={`Avatar de ${post.full_name || post.username || 'Usuario'}`}
                className="w-full h-full object-cover"
                placeholder={
                  <span className={cn(
                    FORUM_TYPOGRAPHY.BODY.XS,
                    "text-white"
                  )}>
                    {(post.full_name || post.username || 'U').charAt(0)}
                  </span>
                }
              />
            ) : (
              <span className={cn(
                FORUM_TYPOGRAPHY.BODY.XS,
                "text-white"
              )}>
                {(post.full_name || post.username || 'U').charAt(0)}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
               <h4 
                 className={cn(
                   FORUM_TYPOGRAPHY.BODY.XS,
                   FORUM_TYPOGRAPHY.SEMIBOLD,
                   FORUM_TYPOGRAPHY.TEXT_PRIMARY,
                   "truncate"
                 )}
                 title={post.full_name || post.username || 'Usuario'}
               >
                 {post.full_name || post.username || 'Usuario'}
               </h4>
              
               <span className={cn(
                 "text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-white rounded-full whitespace-nowrap",
                 levelInfo.color
               )}>
                {levelInfo.label}
              </span>
              
              {post.is_verified && (
                 <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-[#00BCD4]/20 text-[#00BCD4] rounded-full">
                  ✅
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <p className={cn(
                FORUM_TYPOGRAPHY.BODY.XS,
                "text-[10px] sm:text-xs",
                FORUM_TYPOGRAPHY.TEXT_SECONDARY
              )}>
                {formatTimeAgo(post.created_at)}
              </p>
              
              {post.comment_count > 0 && (
                <span className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[10px] sm:text-xs",
                  FORUM_TYPOGRAPHY.TEXT_SECONDARY
                )}>
                  • {post.comment_count} com.
                </span>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag, index) => (
                     <span
                       key={tag}
                       className={cn(
                         FORUM_TYPOGRAPHY.BODY.XS,
                         "text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-[#004B63]/10 text-[#004B63] rounded-full"
                       )}
                       title={`#${tag}`}
                     >
                       #{tag.length > 8 ? `${tag.substring(0, 8)}...` : tag}
                     </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Contenido del post */}
        <div className="mb-3 sm:mb-4">
          <div className={cn(
            "p-3 sm:p-4 rounded-xl",
            compact ? "bg-[#F8FAFC]" : "bg-[#E8F4F8]/50"
          )}>
            <p className={cn(
              "font-mono leading-relaxed whitespace-pre-wrap",
              compact ? "text-[11px] sm:text-[12px]" : "text-sm",
              FORUM_TYPOGRAPHY.TEXT_PRIMARY
            )}>
              {post.content}
            </p>
          </div>
        </div>

        {/* Acciones - Diseño corporativo */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#004B63]/10">
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Botón de voto */}
             <button
               onClick={handleUpvote}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault();
                   handleUpvote();
                 }
               }}
               disabled={isVoting || !user}
               aria-label={userVote === 'upvote' ? 'Quitar voto positivo' : 'Votar positivamente'}
               aria-pressed={userVote === 'upvote'}
               className={cn(
                 "flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg",
                 FORUM_EFFECTS.TRANSITION_ALL,
                 FORUM_EFFECTS.HOVER_SCALE,
                 userVote === 'upvote'
                   ? "bg-gradient-to-r from-[#00BCD4]/20 to-[#004B63]/10 text-[#004B63] border border-[#00BCD4]/30 shadow-[#00BCD4]/20"
                   : "bg-[#004B63]/5 text-[#004B63]/70 hover:bg-[#004B63]/10",
                 "disabled:opacity-50 disabled:cursor-not-allowed",
                 userVote === 'upvote' && "button-pulse",
                 "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:ring-offset-2"
               )}
               tabIndex={user ? 0 : -1}
             >
              <svg 
                className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4",
                  userVote === 'upvote' ? 'fill-current' : ''
                )} 
                viewBox="0 0 20 20"
              >
                <path d="M10 3.22l-6.65 6.65a.75.75 0 001.06 1.06L10 5.34l5.59 5.59a.75.75 0 001.06-1.06L10 3.22z" />
              </svg>
              <span className={cn(
                "text-xs sm:text-sm",
                FORUM_TYPOGRAPHY.MEDIUM
              )}>
                {post.upvotes || 0}
              </span>
            </button>

             {/* Botón de comentar */}
             <button
               onClick={() => setShowCommentInput(!showCommentInput)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault();
                   setShowCommentInput(!showCommentInput);
                 }
               }}
               disabled={!user}
               aria-label={showCommentInput ? 'Ocultar campo de comentario' : 'Mostrar campo de comentario'}
               aria-expanded={showCommentInput}
               className={cn(
                 "flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg",
                 FORUM_EFFECTS.TRANSITION_ALL,
                 FORUM_EFFECTS.HOVER_SCALE,
                 showCommentInput
                   ? "bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/5 text-[#004B63] border border-[#004B63]/20 shadow-[#004B63]/10"
                   : "bg-[#004B63]/5 text-[#004B63]/70 hover:bg-[#004B63]/10",
                 "disabled:opacity-50 disabled:cursor-not-allowed",
                 "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:ring-offset-2"
               )}
               tabIndex={user ? 0 : -1}
             >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span className={cn(
                "text-xs sm:text-sm",
                FORUM_TYPOGRAPHY.MEDIUM,
                "hidden sm:inline"
              )}>
                Comentar
              </span>
            </button>
          </div>
        </div>

      {/* Input para comentarios */}
      {showCommentInput && user && (
        <div className={cn(
          "mt-4 pt-4 border-t border-[#004B63]/10",
          FORUM_EFFECTS.ANIMATION_SLIDE_UP
        )}>
          <div className="flex gap-2">
             <textarea
               value={commentText}
               onChange={(e) => setCommentText(e.target.value)}
               placeholder="Escribe tu comentario..."
               aria-label="Campo para escribir comentario"
               className={cn(
                 FORUM_COMPONENTS.TEXTAREA_BASE,
                 "flex-1",
                 FORUM_EFFECTS.TRANSITION_ALL,
                 "focus:ring-2 focus:ring-[#00BCD4]/30 focus:border-[#00BCD4]"
               )}
               rows="2"
               maxLength={forumService.VALIDATION.MAX_COMMENT_LENGTH}
               autoFocus
             />
             <button
               onClick={handleAddComment}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault();
                   handleAddComment();
                 }
               }}
               disabled={!commentText.trim() || isSubmittingComment}
               aria-label="Enviar comentario"
               className={cn(
                 FORUM_COMPONENTS.BUTTON_SECONDARY,
                 "self-end px-4 py-2",
                 FORUM_EFFECTS.HOVER_SCALE,
                 FORUM_EFFECTS.ACTIVE_SCALE,
                 "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
               )}
             >
              {isSubmittingComment ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : 'Enviar'}
            </button>
          </div>
          <p className={cn(FORUM_TYPOGRAPHY.BODY.XS, "text-[#004B63]/60 mt-1")}>
            {commentText.length}/{forumService.VALIDATION.MAX_COMMENT_LENGTH} caracteres
          </p>
        </div>
      )}

      {/* Sistema de comentarios mejorado */}
      {showComments && comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#004B63]/10">
          <div className="space-y-3">
            {/* Título de comentarios */}
            <div className="flex items-center justify-between">
              <h5 className={cn(
                FORUM_TYPOGRAPHY.BODY.SM,
                FORUM_TYPOGRAPHY.SEMIBOLD,
                FORUM_TYPOGRAPHY.TEXT_PRIMARY
              )}>
                Comentarios ({comments.length})
              </h5>
              
               {/* Botón para expandir/contraer comentarios */}
               {comments.length > 1 && (
                 <button
                   onClick={() => setShowAllComments(!showAllComments)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                       e.preventDefault();
                       setShowAllComments(!showAllComments);
                     }
                   }}
                   aria-label={showAllComments ? 'Mostrar menos comentarios' : `Ver ${Math.min(2, comments.length - 1)} comentario${Math.min(2, comments.length - 1) !== 1 ? 's' : ''} más`}
                   aria-expanded={showAllComments}
                   className={cn(
                     FORUM_TYPOGRAPHY.BODY.XS,
                     FORUM_TYPOGRAPHY.MEDIUM,
                     "text-[#00BCD4] hover:text-[#004B63]",
                     FORUM_EFFECTS.TRANSITION_COLORS,
                     FORUM_EFFECTS.HOVER_SCALE,
                     "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/30 focus:ring-offset-1 rounded"
                   )}
                 >
                  {showAllComments 
                    ? 'Mostrar menos' 
                    : `Ver ${Math.min(2, comments.length - 1)} comentario${Math.min(2, comments.length - 1) !== 1 ? 's' : ''} más`}
                </button>
              )}
            </div>
            
            {/* Lista de comentarios */}
            {displayedComments.map((comment) => (
              <div 
                key={comment.id} 
                className={cn(
                  "p-3 rounded-xl",
                  "bg-gradient-to-br from-white to-[#F8FAFC]",
                  "border border-[#004B63]/10",
                  FORUM_EFFECTS.TRANSITION_ALL,
                  FORUM_EFFECTS.ANIMATION_FADE_IN
                )}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br from-[#004B63]/20 to-[#00BCD4]/20",
                    FORUM_EFFECTS.SHADOW_XS
                  )}>
                    <span className={cn(
                      FORUM_TYPOGRAPHY.BODY.XS,
                      "text-[#004B63]"
                    )}>
                      {(comment.username || 'U').charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span 
                         className={cn(
                           FORUM_TYPOGRAPHY.BODY.XS,
                           FORUM_TYPOGRAPHY.MEDIUM,
                           "text-[#004B63]"
                         )}
                         title={comment.username || 'Usuario'}
                       >
                         {comment.username || 'Usuario'}
                       </span>
                      <span className={cn(
                        FORUM_TYPOGRAPHY.BODY.XS,
                        "text-[#004B63]/60"
                      )}>
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className={cn(
                      FORUM_TYPOGRAPHY.BODY.SM,
                      "text-[#004B63]/80"
                    )}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicador de más comentarios */}
            {!showAllComments && comments.length > 1 && (
              <div className="text-center">
                <div className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5",
                  "bg-[#004B63]/5 text-[#004B63]/70 rounded-lg",
                  FORUM_TYPOGRAPHY.BODY.XS
                )}>
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {comments.length - 1} comentario{comments.length - 1 !== 1 ? 's' : ''} más
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading state para comentarios */}
      {isLoadingComments && (
        <div className="mt-4 pt-4 border-t border-[#004B63]/10">
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="w-3 h-3 bg-[#00BCD4] rounded-full animate-pulse"></div>
            <p className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-[#004B63]/70")}>
              Cargando comentarios...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string,
    upvotes: PropTypes.number,
    comment_count: PropTypes.number,
    view_count: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    user_id: PropTypes.string,
    username: PropTypes.string,
    full_name: PropTypes.string,
    avatar_url: PropTypes.string,
    user_reputation: PropTypes.number,
    is_verified: PropTypes.bool
  }).isRequired,
  onVoteChange: PropTypes.func,
  onCommentAdded: PropTypes.func,
  compact: PropTypes.bool,
  showComments: PropTypes.bool
};

// Función de comparación personalizada para memoización
const arePostCardPropsEqual = (prevProps, nextProps) => {
  // Comparar post por ID y campos críticos que afectan render
  if (prevProps.post?.id !== nextProps.post?.id) return false;
  if (prevProps.compact !== nextProps.compact) return false;
  if (prevProps.showComments !== nextProps.showComments) return false;
  
  // Comparar campos específicos del post que afectan UI
  if (prevProps.post?.upvote_count !== nextProps.post?.upvote_count) return false;
  if (prevProps.post?.comment_count !== nextProps.post?.comment_count) return false;
  if (prevProps.post?.content !== nextProps.post?.content) return false;
  
  // Las funciones onVoteChange y onCommentAdded deben ser estables (useCallback)
  // Si cambian, necesitamos re-render
  if (prevProps.onVoteChange !== nextProps.onVoteChange) return false;
  if (prevProps.onCommentAdded !== nextProps.onCommentAdded) return false;
  
  return true;
};

export default memo(PostCard, arePostCardPropsEqual);