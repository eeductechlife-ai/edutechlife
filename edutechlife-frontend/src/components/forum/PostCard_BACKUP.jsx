import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent, CardFooter } from '../../design-system/components/Card';
import Avatar from '../../design-system/components/Avatar';
import { forumService } from '../../lib/forumService';
import { useAuth } from '../../context/AuthContext';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn } from './forumDesignSystem';

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
      checkUserVote();
      loadComments();
    }
  }, [post?.id, user?.id]);

  const checkUserVote = async () => {
    if (!user?.id || !post?.id) return;
    
    try {
      const hasVoted = await forumService.checkUserVote(post.id);
      setUserVote(hasVoted ? 'upvote' : null);
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };

  const loadComments = async () => {
    if (!post?.id) return;
    
    setIsLoadingComments(true);
    try {
      const postComments = await forumService.getComments(post.id);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleVote = async () => {
    if (!user?.id || !post?.id || isVoting) return;
    
    setIsVoting(true);
    try {
      if (userVote === 'upvote') {
        await forumService.removeVote(post.id);
        setUserVote(null);
        if (onVoteChange) onVoteChange(post.id, -1);
      } else {
        await forumService.upvotePost(post.id);
        setUserVote('upvote');
        if (onVoteChange) onVoteChange(post.id, 1);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAddComment = async () => {
    if (!user?.id || !post?.id || !commentText.trim() || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    try {
      const newComment = await forumService.addComment(post.id, commentText.trim());
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      setShowCommentInput(false);
      
      if (onCommentAdded) onCommentAdded(post.id, newComment);
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

    if (diffMins < 60) {
      return `hace ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else {
      return postDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  const getUserLevel = (reputation) => {
    if (reputation >= 500) return { label: 'Prompt Master Elite', color: 'bg-gradient-to-r from-[#004B63] to-[#00BCD4]' };
    if (reputation >= 200) return { label: 'Prompt Master', color: 'bg-[#00BCD4]' };
    if (reputation >= 100) return { label: 'Prompt Expert', color: 'bg-[#004B63]' };
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
    <div className={cn(
      FORUM_COMPONENTS.CARD_GLASS,
      "mb-4",
      compact ? "p-4" : "p-5",
      FORUM_EFFECTS.TRANSITION_ALL,
      FORUM_EFFECTS.ANIMATION_FADE_IN,
      "hover:shadow-lg hover:shadow-[#004B63]/10"
    )}>
                {post.full_name || post.username || 'Usuario'}
              </h4>
              
              <span className={cn(
                "text-[10px] px-2 py-0.5 text-white rounded-full whitespace-nowrap",
                levelInfo.color
              )}>
                {levelInfo.label}
              </span>
              
              {post.is_verified && (
                <span className="text-[10px] px-2 py-0.5 bg-[#00BCD4]/20 text-[#00BCD4] rounded-full">
                  ✅ Verificado
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <p className={cn(
                FORUM_TYPOGRAPHY.BODY.XS,
                FORUM_TYPOGRAPHY.TEXT_SECONDARY
              )}>
                {formatTimeAgo(post.created_at)}
              </p>
              
              {post.comment_count > 0 && (
                <span className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  FORUM_TYPOGRAPHY.TEXT_SECONDARY
                )}>
                  • {post.comment_count} comentario{post.comment_count !== 1 ? 's' : ''}
                </span>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index} 
                      className={cn(
                        FORUM_TYPOGRAPHY.BODY.XS,
                        "px-2 py-0.5 bg-[#004B63]/10 text-[#004B63] rounded-full"
                      )}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido del post */}
        <div className="mb-4">
          <div className={cn(
            "p-4 rounded-xl",
            compact ? "bg-[#F8FAFC]" : "bg-[#E8F4F8]/50"
          )}>
            <p className={cn(
              "font-mono leading-relaxed whitespace-pre-wrap",
              compact ? "text-[12px]" : "text-sm",
              FORUM_TYPOGRAPHY.TEXT_PRIMARY
            )}>
              {post.content}
            </p>
          </div>
        </div>

        {/* Acciones - Diseño corporativo */}
        <div className="flex items-center justify-between pt-3 border-t border-[#004B63]/10">
          <div className="flex items-center gap-4">
            {/* Botón de voto */}
        <button
          onClick={handleUpvote}
          disabled={isVoting || !user}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            FORUM_EFFECTS.TRANSITION_ALL,
            FORUM_EFFECTS.HOVER_SCALE,
            userVote === 'upvote'
              ? "bg-gradient-to-r from-[#00BCD4]/20 to-[#004B63]/10 text-[#004B63] border border-[#00BCD4]/30 shadow-[#00BCD4]/20"
              : "bg-[#004B63]/5 text-[#004B63]/70 hover:bg-[#004B63]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            userVote === 'upvote' && "button-pulse"
          )}
        >
              <svg 
                className={cn(
                  "w-4 h-4",
                  userVote === 'upvote' ? 'fill-current' : ''
                )} 
                viewBox="0 0 20 20"
              >
                <path d="M10 3.22l-6.65 6.65a.75.75 0 001.06 1.06L10 5.34l5.59 5.59a.75.75 0 001.06-1.06L10 3.22z" />
              </svg>
              <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, FORUM_TYPOGRAPHY.MEDIUM)}>
                {post.upvotes || 0}
              </span>
            </button>

            {/* Botón de comentar */}
        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          disabled={!user}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            FORUM_EFFECTS.TRANSITION_ALL,
            FORUM_EFFECTS.HOVER_SCALE,
            showCommentInput
              ? "bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/5 text-[#004B63] border border-[#004B63]/20 shadow-[#004B63]/10"
              : "bg-[#004B63]/5 text-[#004B63]/70 hover:bg-[#004B63]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8a7.94 7.94 0 01-3.9-.99l-3.1.99.99-3.1A7.94 7.94 0 012 10c0-4.418 3.582-8 8-8s8 3.582 8 8zm-8-4a1 1 0 00-1 1v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className={cn(FORUM_TYPOGRAPHY.BODY.SM, FORUM_TYPOGRAPHY.MEDIUM)}>
                Comentar
              </span>
            </button>
          </div>

          {/* Contador de vistas */}
          {post.view_count > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-[#004B63]/60" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className={cn(FORUM_TYPOGRAPHY.BODY.XS, "text-[#004B63]/60")}>
                {post.view_count}
              </span>
            </div>
          )}
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
                disabled={!commentText.trim() || isSubmittingComment}
                className={cn(
                  FORUM_COMPONENTS.BUTTON_SECONDARY,
                  "self-end px-4 py-2",
                  FORUM_EFFECTS.HOVER_SCALE,
                  FORUM_EFFECTS.ACTIVE_SCALE
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
                    className={cn(
                      FORUM_TYPOGRAPHY.BODY.XS,
                      FORUM_TYPOGRAPHY.MEDIUM,
                      "text-[#00BCD4] hover:text-[#004B63]",
                      FORUM_EFFECTS.TRANSITION_COLORS
                    )}
                  >
                    {showAllComments 
                      ? 'Mostrar menos' 
                      : `Ver ${Math.min(2, comments.length - 1)} comentario${Math.min(2, comments.length - 1) !== 1 ? 's' : ''} más`}
                  </button>
                )}
              </div>

              {/* Lista de comentarios */}
              {isLoadingComments ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-[#00BCD4] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {displayedComments.map((comment, index) => (
                    <div 
                      key={comment.id} 
                      className={cn(
                        "flex gap-3 p-3 rounded-xl",
                        FORUM_EFFECTS.TRANSITION_ALL,
                        "bg-[#F8FAFC] hover:bg-[#E8F4F8]",
                        index === 0 && !showAllComments && "border border-[#00BCD4]/20"
                      )}
                    >
                      <Avatar
                        src={comment.avatar_url}
                        alt={comment.full_name || comment.username || 'Usuario'}
                        size="xs"
                        variant="circle"
                        className="border border-[#004B63]/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            FORUM_TYPOGRAPHY.BODY.SM,
                            FORUM_TYPOGRAPHY.MEDIUM,
                            FORUM_TYPOGRAPHY.TEXT_PRIMARY
                          )}>
                            {comment.full_name || comment.username || 'Usuario'}
                          </span>
                          <span className={cn(
                            FORUM_TYPOGRAPHY.BODY.XS,
                            FORUM_TYPOGRAPHY.TEXT_SECONDARY
                          )}>
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className={cn(
                          FORUM_TYPOGRAPHY.BODY.SM,
                          FORUM_TYPOGRAPHY.TEXT_PRIMARY,
                          "leading-relaxed"
                        )}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Footer con información de edición */}
      {!compact && post.updated_at !== post.created_at && (
        <CardFooter className="p-0 pt-3">
          <p className={cn(
            FORUM_TYPOGRAPHY.BODY.XS,
            "text-[#004B63]/60 italic"
          )}>
            Editado {formatTimeAgo(post.updated_at)}
          </p>
        </CardFooter>
      )}
    </Card>
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

export default PostCard;