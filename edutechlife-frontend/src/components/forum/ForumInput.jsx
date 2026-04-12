import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../design-system/components/Avatar';
import { forumService } from '../../lib/forumService';
import { useAuth } from '../../context/AuthContext';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn } from './forumDesignSystem';

const ForumInput = ({ 
  onPostCreated, 
  placeholder = "¿Qué prompt descubriste hoy? Compártelo con la comunidad...",
  compact = false,
  autoFocus = false
}) => {
  const { user, profile } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [popularTags, setPopularTags] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const availableTags = [
    'educación', 'tecnología', 'IA', 'prompting', 'aprendizaje',
    'herramientas', 'tutorial', 'productividad', 'investigación',
    'innovación', 'metodología', 'evaluación', 'diseño', 'sistemas'
  ];

  useEffect(() => {
    loadPopularTags();
  }, []);

  const loadPopularTags = async () => {
    try {
      const tags = await forumService.getPopularTags(8);
      setPopularTags(tags);
    } catch (error) {
      console.error('Error loading popular tags:', error);
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Debes iniciar sesión para publicar');
      return;
    }

    if (postContent.length < forumService.VALIDATION.MIN_POST_LENGTH) {
      setError(`El post debe tener al menos ${forumService.VALIDATION.MIN_POST_LENGTH} caracteres`);
      return;
    }
    
    if (postContent.length > forumService.VALIDATION.MAX_POST_LENGTH) {
      setError(`El post no puede exceder ${forumService.VALIDATION.MAX_POST_LENGTH} caracteres`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newPost = await forumService.createPost(
        postContent.trim(),
        selectedTags
      );

      setPostContent('');
      setSelectedTags([]);
      setShowTagSelector(false);

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Error al crear el post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const characterCount = postContent.length;
  const isOverLimit = characterCount > forumService.VALIDATION.MAX_POST_LENGTH;
  const isUnderMin = characterCount > 0 && characterCount < forumService.VALIDATION.MIN_POST_LENGTH;

  if (compact) {
    return (
      <div 
        onClick={() => !user && setError('Debes iniciar sesión para publicar')}
        className={cn(
          FORUM_COMPONENTS.CARD_GLASS,
          "p-3 cursor-pointer",
          FORUM_EFFECTS.TRANSITION_ALL,
          "hover:bg-gradient-to-r hover:from-[#004B63]/5 hover:to-[#00BCD4]/5",
          "hover:border-[#004B63]/30",
          "flex items-center gap-3",
          !user && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-[#004B63] to-[#00BCD4]",
          FORUM_EFFECTS.SHADOW_SM
        )}>
          <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <span className={cn(
          FORUM_TYPOGRAPHY.BODY.SM,
          "text-[#004B63]/70"
        )}>
          {placeholder}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      FORUM_COMPONENTS.CARD_GLASS,
      "mb-6 p-4 sm:p-5",
      FORUM_EFFECTS.SHADOW_MD
    )}>
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        <div className={cn(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-[#004B63] to-[#00BCD4]",
          FORUM_EFFECTS.SHADOW_SM
        )}>
          {profile?.avatar_url ? (
            <Avatar
              src={profile.avatar_url}
              alt={profile?.full_name || user?.email || 'Usuario'}
              size="sm"
              variant="circle"
              border={true}
              borderColor="glass"
              className="border-white/30"
            />
          ) : (
            <span className={cn(
              FORUM_TYPOGRAPHY.BODY.SM,
              "text-white"
            )}>
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={postContent}
                onChange={(e) => {
                  setPostContent(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                  FORUM_COMPONENTS.TEXTAREA_BASE,
                  "w-full",
                  FORUM_EFFECTS.TRANSITION_ALL,
                  "focus:ring-2 focus:ring-[#00BCD4]/30 focus:border-[#00BCD4]"
                )}
                rows="3"
                maxLength={forumService.VALIDATION.MAX_POST_LENGTH}
                disabled={!user || isSubmitting}
                autoFocus={autoFocus}
              />
                
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isOverLimit ? 'bg-[#F44336]' : 
                      isUnderMin ? 'bg-[#FFB74D]' : 
                      characterCount === 0 ? 'bg-[#004B63]/20' : 'bg-[#00BCD4]',
                      FORUM_EFFECTS.TRANSITION_ALL
                    )} />
                    <span className={cn(
                      FORUM_TYPOGRAPHY.BODY.XS,
                      FORUM_TYPOGRAPHY.MEDIUM,
                      isOverLimit ? 'text-[#F44336]' : 
                      isUnderMin ? 'text-[#FFB74D]' : 
                      'text-[#004B63]/70'
                    )}>
                      {characterCount}/{forumService.VALIDATION.MAX_POST_LENGTH}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowTagSelector(!showTagSelector)}
                    className={cn(
                      FORUM_TYPOGRAPHY.BODY.XS,
                      FORUM_TYPOGRAPHY.MEDIUM,
                      "text-[#00BCD4] hover:text-[#004B63]",
                      FORUM_EFFECTS.TRANSITION_COLORS,
                      "flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5",
                      "bg-[#004B63]/5 hover:bg-[#004B63]/10 rounded-lg",
                      selectedTags.length > 0 && "bg-[#00BCD4]/10 text-[#004B63]"
                    )}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">
                      {selectedTags.length > 0 ? `${selectedTags.length}/3 tags` : 'Añadir tags'}
                    </span>
                    <span className="sm:hidden">
                      {selectedTags.length > 0 ? `${selectedTags.length}/3` : 'Tags'}
                    </span>
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!user || isSubmitting || isOverLimit || isUnderMin || characterCount === 0}
                  className={cn(
                    FORUM_COMPONENTS.BUTTON_PRIMARY,
                    "px-4 py-2 sm:px-6 sm:py-2.5",
                    "bg-gradient-to-r from-[#004B63] to-[#00BCD4]",
                    "hover:from-[#00374A] hover:to-[#00A5C2]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:from-[#004B63]/50 disabled:to-[#00BCD4]/50",
                    FORUM_EFFECTS.SHADOW_SM,
                    "hover:shadow-md"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Publicando...</span>
                      <span className="sm:hidden">...</span>
                    </span>
                  ) : 'Publicar'}
                </button>
              </div>
            </div>

            {error && (
              <div className={cn(
                "mb-4 p-3 bg-gradient-to-r from-[#F44336]/10 to-[#FF5252]/5",
                "border border-[#F44336]/20 rounded-xl",
                FORUM_EFFECTS.TRANSITION_ALL,
                FORUM_EFFECTS.SHADOW_SM
              )}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#F44336]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className={cn(
                    FORUM_TYPOGRAPHY.BODY.SM,
                    "text-[#F44336]"
                  )}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Selector de tags - Diseño corporativo premium */}
            {showTagSelector && (
              <div className={cn(
                "mb-4 p-5 border border-[#004B63]/20 rounded-xl",
                "bg-gradient-to-br from-white to-[#E8F4F8]",
                FORUM_EFFECTS.SHADOW_SM,
                FORUM_EFFECTS.TRANSITION_ALL
              )}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      "bg-gradient-to-r from-[#004B63] to-[#00BCD4]"
                    )} />
                    <p className={cn(
                      FORUM_TYPOGRAPHY.BODY.SM,
                      FORUM_TYPOGRAPHY.SEMIBOLD,
                      "text-[#004B63]"
                    )}>
                      Etiquetas populares
                    </p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full",
                    "bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10",
                    FORUM_EFFECTS.SHADOW_XS
                  )}>
                    <p className={cn(
                      FORUM_TYPOGRAPHY.BODY.XS,
                      FORUM_TYPOGRAPHY.MEDIUM,
                      "text-[#004B63]"
                    )}>
                      {selectedTags.length}/3 seleccionadas
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full",
                        FORUM_EFFECTS.TRANSITION_ALL,
                        FORUM_EFFECTS.SHADOW_XS,
                        selectedTags.includes(tag.name)
                          ? 'bg-gradient-to-r from-[#00BCD4] to-[#00A5C2] text-white hover:shadow-md'
                          : 'bg-white text-[#004B63] border border-[#004B63]/20 hover:bg-gradient-to-r hover:from-[#004B63]/5 hover:to-[#00BCD4]/5'
                      )}
                    >
                      #{tag.name} {tag.count && <span className="opacity-90">({tag.count})</span>}
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-[#004B63]/10 pt-3">
                  <p className={cn(
                    FORUM_TYPOGRAPHY.BODY.XS,
                    FORUM_TYPOGRAPHY.MEDIUM,
                    "text-[#004B63]/70 mb-2"
                  )}>
                    Todas las etiquetas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full",
                          FORUM_EFFECTS.TRANSITION_ALL,
                          selectedTags.includes(tag)
                            ? 'bg-gradient-to-r from-[#004B63] to-[#00374A] text-white hover:shadow-md'
                            : 'bg-white text-[#004B63] border border-[#004B63]/20 hover:bg-gradient-to-r hover:from-[#004B63]/5 hover:to-[#00BCD4]/5'
                        )}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Selected Tags Preview */}
            {selectedTags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5",
                        "bg-gradient-to-r from-[#00BCD4]/10 to-[#004B63]/10",
                        "border border-[#00BCD4]/20 rounded-full",
                        FORUM_EFFECTS.SHADOW_XS,
                        FORUM_EFFECTS.TRANSITION_ALL
                      )}
                    >
                      <span className={cn(
                        FORUM_TYPOGRAPHY.BODY.XS,
                        FORUM_TYPOGRAPHY.MEDIUM,
                        "text-[#004B63]"
                      )}>
                        #{tag}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center",
                          "bg-[#004B63]/20 hover:bg-[#004B63]/30",
                          FORUM_EFFECTS.TRANSITION_ALL
                        )}
                        aria-label={`Quitar etiqueta ${tag}`}
                      >
                        <svg className="w-2 h-2 text-[#004B63]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className={cn(
              "p-3 border border-[#004B63]/10 rounded-xl",
              "bg-gradient-to-br from-[#F8FAFC] to-white",
              FORUM_EFFECTS.SHADOW_XS
            )}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#00BCD4]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  FORUM_TYPOGRAPHY.SEMIBOLD,
                  "text-[#004B63]"
                )}>
                  Consejos para publicar
                </p>
              </div>
              <div className="space-y-1.5">
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#004B63]/70 flex items-start gap-1.5"
                )}>
                  <span className="text-[#00BCD4]">•</span>
                  Comparte prompts útiles, preguntas o insights sobre IA y educación
                </p>
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#004B63]/70 flex items-start gap-1.5"
                )}>
                  <span className="text-[#00BCD4]">•</span>
                  Usa etiquetas para categorizar tu contenido (máximo 3)
                </p>
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.XS,
                  "text-[#004B63]/70 flex items-start gap-1.5"
                )}>
                  <span className="text-[#00BCD4]">•</span>
                  Presiona <kbd className={cn(
                    "px-1.5 py-0.5 mx-1",
                    "bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10",
                    "border border-[#004B63]/20 rounded",
                    FORUM_TYPOGRAPHY.BODY.XS,
                    FORUM_TYPOGRAPHY.MEDIUM,
                    "text-[#004B63]"
                  )}>Ctrl + Enter</kbd> para publicar rápidamente
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ForumInput.propTypes = {
  onPostCreated: PropTypes.func,
  placeholder: PropTypes.string,
  compact: PropTypes.bool,
  autoFocus: PropTypes.bool
};

// Función de comparación para memoización
const areForumInputPropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.compact === nextProps.compact &&
    prevProps.autoFocus === nextProps.autoFocus &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.onPostCreated === nextProps.onPostCreated
  );
};

export default memo(ForumInput, areForumInputPropsEqual);