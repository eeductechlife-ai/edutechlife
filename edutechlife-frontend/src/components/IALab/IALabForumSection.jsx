import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import PlatformOptimizedCard from '../PlatformOptimizedCard';
import { useIALabContext } from '../../context/IALabContext';
import useIALabForum from '../../hooks/IALab/useIALabForum';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente premium para foro de IALab con sistema de likes visibles mejorado
 * Integra diseño corporativo Edutechlife con feedback visual mejorado
 * 
 * @param {Object} props
 * @param {boolean} props.compact - Modo compacto (default: false)
 * @param {boolean} props.showHeader - Mostrar header (default: true)
 * @param {boolean} props.showInput - Mostrar input para crear posts (default: true)
 * @param {boolean} props.showStats - Mostrar estadísticas (default: true)
 * @param {number} props.limit - Límite de posts (default: 10)
 * @param {string} props.className - Clases CSS adicionales
 */
const IALabForumSection = ({
    compact = false,
    showHeader = true,
    showInput = true,
    showStats = true,
    limit = 10,
    className = '',
    ...rest
}) => {
    const { user } = useAuth();
    const { insightsExpanded, setInsightsExpanded } = useIALabContext();
    const {
        forumPosts,
        isLoading,
        error,
        likeStates,
        loadForumPosts,
        toggleLike,
        createPost,
        getForumStats,
        formatLikeCount,
        getLikeButtonProps
    } = useIALabForum();

    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [forumStats, setForumStats] = useState(null);
    const [activeFilter, setActiveFilter] = useState('recent'); // 'recent', 'popular', 'following'

    // Cargar estadísticas del foro
    useEffect(() => {
        const loadStats = async () => {
            if (user && showStats) {
                const stats = await getForumStats();
                if (stats?.success) {
                    setForumStats(stats.data);
                }
            }
        };
        loadStats();
    }, [user, showStats, getForumStats]);

    // Handler para crear nuevo post
    const handleCreatePost = async () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            alert('Por favor, ingresa un título y contenido para tu post');
            return;
        }

        setIsCreatingPost(true);
        const result = await createPost(newPostTitle, newPostContent);
        
        if (result.success) {
            setNewPostTitle('');
            setNewPostContent('');
            alert('🎉 ¡Post creado exitosamente!');
        } else {
            alert(`❌ Error al crear post: ${result.error}`);
        }
        
        setIsCreatingPost(false);
    };

    // Handler para dar/quitar like
    const handleLikeToggle = async (postId, currentLikeCount) => {
        const result = await toggleLike(postId, currentLikeCount);
        if (!result.success) {
            console.error('Error al actualizar like:', result.error);
        }
    };

    // Render skeleton loading premium
    const renderSkeleton = () => (
        <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            {showHeader && (
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-3">
                        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-32"></div>
                </div>
            )}

            {/* Posts skeleton */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
                                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-5/6"></div>
                            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-4/6"></div>
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-24"></div>
                            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-20"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Render header premium
    const renderHeader = () => (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-[#00374A] font-display">
                    Comunidad IALab
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                    Comparte insights, preguntas y aprende con la comunidad
                </p>
            </div>
            
            {showStats && forumStats && (
                <div className="flex items-center gap-4">
                    <div className="text-center px-4 py-2 bg-[#004B63]/5 rounded-xl">
                        <div className="text-lg font-bold text-[#004B63]">{forumStats.total_posts || 0}</div>
                        <div className="text-xs text-slate-600">Posts</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-[#00BCD4]/5 rounded-xl">
                        <div className="text-lg font-bold text-[#00BCD4]">{forumStats.total_likes || 0}</div>
                        <div className="text-xs text-slate-600">Likes</div>
                    </div>
                </div>
            )}
        </div>
    );

    // Render filtros
    const renderFilters = () => (
        <div className="flex items-center gap-2 mb-6">
            <button
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === 'recent'
                        ? 'bg-[#004B63] text-white'
                        : 'bg-[#004B63]/5 text-[#004B63] hover:bg-[#004B63]/10'
                }`}
            >
                <Icon name="fa-clock" className="mr-2" />
                Recientes
            </button>
            <button
                onClick={() => setActiveFilter('popular')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === 'popular'
                        ? 'bg-[#004B63] text-white'
                        : 'bg-[#004B63]/5 text-[#004B63] hover:bg-[#004B63]/10'
                }`}
            >
                <Icon name="fa-fire" className="mr-2" />
                Populares
            </button>
        </div>
    );

    // Render input para crear post
    const renderPostInput = () => (
        <div className="mb-8 bg-white rounded-2xl p-6 border border-[#00BCD4]/20 shadow-[0_8px_32px_rgba(0,188,212,0.1)]">
            <h3 className="text-lg font-bold text-[#00374A] mb-4">Comparte tu insight</h3>
            
            <div className="space-y-4">
                <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Título de tu post..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent text-[#00374A] placeholder-slate-400"
                    disabled={isCreatingPost}
                />
                
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="¿Qué quieres compartir con la comunidad?..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent text-[#00374A] placeholder-slate-400 min-h-[120px] resize-none"
                    disabled={isCreatingPost}
                />
                
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        {newPostContent.length}/500 caracteres
                    </div>
                    
                    <button
                        onClick={handleCreatePost}
                        disabled={isCreatingPost || !newPostTitle.trim() || !newPostContent.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isCreatingPost ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Publicando...
                            </>
                        ) : (
                            <>
                                <Icon name="fa-paper-plane" />
                                Publicar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    // Render post individual premium
    const renderPost = (post) => {
        const likeProps = getLikeButtonProps(post.id);
        const formattedDate = new Date(post.created_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <div 
                key={post.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-[#00BCD4]/30 hover:shadow-[0_8px_32px_rgba(0,188,212,0.1)] transition-all duration-300"
            >
                {/* Header del post */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] flex items-center justify-center text-white font-bold">
                            {post.forum_users?.full_name?.charAt(0) || 'U'}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-[#00374A] truncate">
                                    {post.forum_users?.full_name || 'Usuario'}
                                </h4>
                                <p className="text-xs text-slate-500">{formattedDate}</p>
                            </div>
                            
                            {post.title && (
                                <div className="px-3 py-1 bg-[#004B63]/10 text-[#004B63] text-xs font-medium rounded-full">
                                    {post.title}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contenido del post */}
                <div className="mb-6">
                    <p className="text-[#00374A] leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Acciones del post - SISTEMA DE LIKES MEJORADO */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        {/* Botón de LIKE MEJORADO - VISIBLE */}
                        <button
                            onClick={() => handleLikeToggle(post.id, likeProps.likeCount)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleLikeToggle(post.id, likeProps.likeCount);
                                }
                            }}
                            disabled={!user || likeProps.isLoading}
                            aria-label={likeProps.ariaLabel}
                            aria-pressed={likeProps.userLiked}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-xl
                                transition-all duration-300 hover:scale-105 active:scale-95
                                ${likeProps.buttonClass}
                                disabled:opacity-50 disabled:cursor-not-allowed
                                focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:ring-offset-2
                                ${likeProps.userLiked ? 'shadow-[0_0_15px_rgba(0,188,212,0.3)]' : ''}
                            `}
                            tabIndex={user ? 0 : -1}
                        >
                            <Icon 
                                name={likeProps.likeIcon}
                                className={`w-4 h-4 ${likeProps.isLoading ? 'animate-spin' : ''}`}
                                style={{ color: likeProps.likeColor }}
                            />
                            <span className="font-bold text-sm">
                                {formatLikeCount(likeProps.likeCount)}
                            </span>
                            
                            {/* Indicador visual de like activo */}
                            {likeProps.userLiked && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00BCD4] rounded-full animate-ping"></div>
                            )}
                        </button>

                        {/* Botón de comentar */}
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all duration-300"
                            disabled={!user}
                        >
                            <Icon name="fa-comment" className="w-4 h-4" />
                            <span className="font-medium text-sm">
                                {post.comment_count || 0}
                            </span>
                        </button>
                    </div>

                    {/* Acciones adicionales */}
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 text-slate-400 hover:text-[#00BCD4] transition-colors duration-300"
                            aria-label="Compartir post"
                        >
                            <Icon name="fa-share" className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-[#00BCD4] transition-colors duration-300"
                            aria-label="Guardar post"
                        >
                            <Icon name="fa-bookmark" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Indicador visual de popularidad */}
                {likeProps.likeCount >= 10 && (
                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Icon name="fa-fire" className="text-amber-500" />
                            <span className="text-xs font-medium text-amber-600">
                                ¡Post popular!
                            </span>
                        </div>
                        <div className="h-1 flex-1 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent rounded-full"></div>
                    </div>
                )}
            </div>
        );
    };

    // Render contenido principal
    const renderContent = () => (
        <>
            {showHeader && renderHeader()}
            {!compact && renderFilters()}
            {showInput && user && renderPostInput()}

            {/* Lista de posts */}
            <div className="space-y-6">
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <Icon name="fa-exclamation-triangle" className="text-red-500 text-2xl mb-3" />
                        <p className="text-red-700 font-medium">Error al cargar los posts</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                        <button
                            onClick={() => loadForumPosts(limit)}
                            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : forumPosts.length === 0 ? (
                    <div className="bg-gradient-to-br from-[#004B63]/5 to-[#00BCD4]/5 rounded-2xl p-8 text-center">
                        <Icon name="fa-comments" className="text-[#00BCD4] text-3xl mb-4" />
                        <h3 className="text-xl font-bold text-[#00374A] mb-2">
                            ¡Sé el primero en compartir!
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Comparte tus insights y preguntas con la comunidad IALab
                        </p>
                        {user && showInput && (
                            <button
                                onClick={() => document.querySelector('textarea')?.focus()}
                                className="px-6 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
                            >
                                <Icon name="fa-plus" className="mr-2" />
                                Crear primer post
                            </button>
                        )}
                    </div>
                ) : (
                    forumPosts.map(renderPost)
                )}
            </div>

            {/* Botón de carga más (si hay más posts) */}
            {!compact && forumPosts.length >= limit && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => loadForumPosts(limit + 10)}
                        className="px-6 py-3 border-2 border-[#00BCD4] text-[#00BCD4] rounded-xl hover:bg-[#00BCD4]/5 transition-all duration-300 font-medium"
                    >
                        <Icon name="fa-sync" className="mr-2" />
                        Cargar más posts
                    </button>
                </div>
            )}

            {/* Botón de expansión/contracción */}
            {!compact && (
                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => setInsightsExpanded(!insightsExpanded)}
                        className="text-[#00BCD4] hover:text-[#00374A] font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mx-auto group focus:outline-none focus:ring-1 focus:ring-[#00BCD4] rounded px-2 py-1"
                        aria-label={insightsExpanded ? "Contraer muro de insights" : "Expandir para ver toda la conversación"}
                    >
                        {insightsExpanded ? (
                            <>
                                <span>Contraer muro</span>
                                <Icon name="fa-chevron-up" className="text-xs group-hover:-translate-y-1 transition-transform duration-300" />
                            </>
                        ) : (
                            <>
                                <span>Explorar toda la conversación</span>
                                <Icon name="fa-chevron-down" className="text-xs group-hover:translate-y-1 transition-transform duration-300" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </>
    );

    return (
        <PlatformOptimizedCard
            className={`
                ${compact ? 'h-[400px]' : 'min-h-[500px]'} 
                flex flex-col overflow-hidden
                bg-white
                rounded-[28px]
                p-6
                ${className}
            `.trim()}
            withShadow={true}
            shadowIntensity="medium"
            withTouchOptimization={true}
            {...rest}
        >
            {isLoading ? renderSkeleton() : renderContent()}
        </PlatformOptimizedCard>
    );
};

export default IALabForumSection;