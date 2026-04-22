import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useAuth } from '../../context/AuthContext';
import useIALabForum from '../../hooks/IALab/useIALabForum';
import { cn } from '../forum/forumDesignSystem';

/**
 * Foro Optimizado IALab - Componente premium compacto y visualmente impactante
 * 
 * Características:
 * - Altura controlada con scroll elegante
 * - Burbujas de mensaje con glassmorphism
 * - Avatares con gradientes circulares
 * - Carga dinámica (últimos 5 mensajes + scroll para más)
 * - Animaciones de entrada suaves
 * - Input fijo en parte inferior
 * - Identidad visual Edutechlife completa
 * 
 * @param {Object} props
 * @param {boolean} props.compact - Modo compacto
 * @param {number} props.initialLimit - Límite inicial de mensajes (default: 5)
 * @param {string} props.className - Clases CSS adicionales
 */
const IALabForumOptimized = ({
    compact = false,
    initialLimit = 5,
    className = '',
    ...rest
}) => {
    const { user } = useAuth();
    const {
        forumPosts,
        isLoading,
        error,
        likeStates,
        loadForumPosts,
        toggleLike,
        createPost,
        getForumStats,
        formatLikeCount
    } = useIALabForum();

    // Estados para el foro optimizado
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLiveIndicator, setShowLiveIndicator] = useState(true);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Cargar posts iniciales
    useEffect(() => {
        loadForumPosts(showAll ? 20 : initialLimit);
    }, [loadForumPosts, showAll, initialLimit]);

    // Actualizar posts visibles
    useEffect(() => {
        if (forumPosts.length > 0) {
            const postsToShow = showAll ? forumPosts : forumPosts.slice(0, initialLimit);
            setVisiblePosts(postsToShow);
        }
    }, [forumPosts, showAll, initialLimit]);

    // Scroll automático al último mensaje
    useEffect(() => {
        if (messagesEndRef.current && !isLoading) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [visiblePosts, isLoading]);

    // Handler para enviar mensaje
    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        setIsSubmitting(true);
        try {
            await createPost({
                title: `Mensaje de ${user.full_name || user.email}`,
                content: newMessage.trim(),
                tags: ['Chat']
            });
            setNewMessage('');
            
            // Indicador de actividad en vivo
            setShowLiveIndicator(true);
            setTimeout(() => setShowLiveIndicator(false), 3000);
            
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler para cargar más mensajes
    const handleLoadMore = () => {
        setShowAll(true);
    };

    // Función para obtener iniciales del nombre
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Función para generar color de gradiente basado en nombre
    const getAvatarGradient = (name) => {
        if (!name) return 'from-cyan-600 to-cyan-400';
        
        const colors = [
            'from-cyan-600 to-cyan-400',
            'from-blue-600 to-cyan-400',
            'from-indigo-600 to-blue-400',
            'from-violet-600 to-indigo-400',
            'from-purple-600 to-violet-400'
        ];
        
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    // Formatear fecha relativa
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} h`;
        if (diffDays < 7) return `Hace ${diffDays} d`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    // Estadísticas del foro
    const forumStats = getForumStats();

    return (
        <div 
            className={cn(
                "bg-white/80 border border-cyan-100 rounded-3xl backdrop-blur-sm shadow-lg",
                "flex flex-col",
                compact ? "h-96" : "h-[500px]",
                className
            )}
            {...rest}
        >
            {/* Estilos para animaciones y efectos visuales */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes livePulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.05);
                    }
                }
                .animate-in {
                    animation-duration: 300ms;
                    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    animation-fill-mode: both;
                }
                .fade-in-up {
                    animation-name: fadeInUp;
                }
                .animation-delay-100 {
                    animation-delay: 100ms;
                }
                .animation-delay-200 {
                    animation-delay: 200ms;
                }
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                .live-pulse {
                    animation: livePulse 2s ease-in-out infinite;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 188, 212, 0.3);
                    border-radius: 20px;
                    transition: background-color 0.2s;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0, 188, 212, 0.5);
                }
                .message-bubble {
                    transition: all 0.3s ease;
                }
                .message-bubble:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 188, 212, 0.1);
                }
            `}</style>
            {/* Header del Foro */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-cyan-100/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Icon name="fa-comments" className="text-cyan-500 text-lg" />
                        {showLiveIndicator && (
                            <div className="absolute -top-1 -right-1 w-3 h-3">
                                <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-75" />
                                <div className="absolute inset-0 bg-cyan-500 rounded-full" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">
                            Comunidad IALab
                            {showLiveIndicator && (
                                <span className="ml-2 text-xs font-normal text-cyan-500 live-pulse">
                                    • En vivo
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {forumStats.totalPosts} debates • {forumStats.totalComments} respuestas
                        </p>
                    </div>
                </div>

                {/* Indicador de actividad */}
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {forumPosts.slice(0, 3).map((post, index) => (
                            <div 
                                key={post.id}
                                className={cn(
                                    "w-6 h-6 rounded-full border-2 border-white",
                                    "bg-gradient-to-tr",
                                    getAvatarGradient(post.profiles?.full_name)
                                )}
                                style={{ zIndex: 3 - index }}
                            >
                                <span className="flex items-center justify-center w-full h-full text-[10px] font-bold text-white">
                                    {getInitials(post.profiles?.full_name)}
                                </span>
                            </div>
                        ))}
                    </div>
                    {forumPosts.length > 3 && (
                        <span className="text-xs text-slate-500">
                            +{forumPosts.length - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Área de Mensajes con Scroll Elegante */}
            <div 
                ref={messagesContainerRef}
                className={cn(
                    "flex-1 overflow-y-auto",
                    "px-4 md:px-6 py-4",
                    "scrollbar-thin scrollbar-thumb-cyan-200/50 scrollbar-track-transparent",
                    "hover:scrollbar-thumb-cyan-300/60"
                )}
                style={{ maxHeight: '400px' }}
            >
                {isLoading ? (
                    // Estado de carga
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-slate-500">Cargando conversaciones...</p>
                        </div>
                    </div>
                ) : error ? (
                    // Estado de error
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-4">
                            <Icon name="fa-exclamation-triangle" className="text-amber-500 text-2xl mb-3" />
                            <p className="text-sm text-slate-600 mb-2">{error}</p>
                            <button
                                onClick={() => loadForumPosts(initialLimit)}
                                className="text-xs text-cyan-500 hover:text-cyan-600 font-medium"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                ) : visiblePosts.length === 0 ? (
                    // Estado vacío
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Icon name="fa-comment-dots" className="text-cyan-400 text-xl" />
                            </div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                ¡Sé el primero en comentar!
                            </h4>
                            <p className="text-xs text-slate-500 max-w-xs">
                                Inicia una conversación sobre IA educativa y prompt engineering
                            </p>
                        </div>
                    </div>
                ) : (
                    // Lista de mensajes
                    <div className="space-y-3">
                        {visiblePosts.map((post, index) => {
                            const isLiked = likeStates[post.id]?.userLiked || false;
                            const likeCount = likeStates[post.id]?.likeCount || post.upvote_count || 0;
                            const isLoadingLike = likeStates[post.id]?.isLoading || false;

                            return (
                                <div
                                    key={post.id}
                                    className={cn(
                                        "bg-white/40 backdrop-blur-sm border border-white/20",
                                        "rounded-2xl p-4",
                                        "shadow-sm",
                                        "message-bubble",
                                        "animate-in fade-in-up",
                                        index === 0 ? "animation-delay-100" :
                                        index === 1 ? "animation-delay-200" :
                                        index === 2 ? "animation-delay-300" : ""
                                    )}
                                >
                                    {/* Header del mensaje */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar con gradiente */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-full",
                                                "bg-gradient-to-tr",
                                                getAvatarGradient(post.profiles?.full_name),
                                                "flex items-center justify-center",
                                                "shadow-sm"
                                            )}>
                                                <span className="text-xs font-bold text-white">
                                                    {getInitials(post.profiles?.full_name)}
                                                </span>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-800">
                                                        {post.profiles?.full_name || 'Usuario'}
                                                    </span>
                                                    {post.tags?.includes('Mentor') && (
                                                        <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-700 text-[10px] font-medium rounded-full">
                                                            Mentor
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400">
                                                    {formatRelativeTime(post.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Acciones del mensaje */}
                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            disabled={isLoadingLike || !user}
                                            className={cn(
                                                "flex items-center gap-1",
                                                "text-xs font-medium",
                                                isLiked ? "text-cyan-500" : "text-slate-400",
                                                "hover:text-cyan-600",
                                                "transition-colors",
                                                "disabled:opacity-50 disabled:cursor-not-allowed"
                                            )}
                                        >
                                            {isLoadingLike ? (
                                                <div className="w-3 h-3 border border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
                                            ) : (
                                                <Icon name={isLiked ? "fa-heart" : "fa-heart"} />
                                            )}
                                            <span>{formatLikeCount(likeCount)}</span>
                                        </button>
                                    </div>

                                    {/* Contenido del mensaje */}
                                    <div className="mb-3">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-1">
                                            {post.title}
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-snug">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* Etiquetas y estadísticas */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags?.slice(0, 2).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {post.tags && post.tags.length > 2 && (
                                                <span className="text-[10px] text-slate-400">
                                                    +{post.tags.length - 2}
                                                </span>
                                            )}
                                        </div>

                                        {post.comment_count > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Icon name="fa-comment" />
                                                <span>{post.comment_count}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Botón para cargar más mensajes */}
                        {!showAll && forumPosts.length > initialLimit && (
                            <div className="text-center pt-2">
                                <button
                                    onClick={handleLoadMore}
                                    className="text-xs text-cyan-500 hover:text-cyan-600 font-medium"
                                >
                                    Ver {forumPosts.length - initialLimit} mensajes más ↓
                                </button>
                            </div>
                        )}

                        {/* Elemento para scroll automático */}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input para enviar mensajes (Fijo en parte inferior) */}
            <div className="border-t border-cyan-100/50 p-4 md:p-6">
                <form onSubmit={handleSubmitMessage} className="relative">
                    <div className="flex items-center gap-3">
                        {/* Avatar del usuario actual */}
                        {user && (
                            <div className={cn(
                                "w-8 h-8 rounded-full flex-shrink-0",
                                "bg-gradient-to-tr from-cyan-600 to-cyan-400",
                                "flex items-center justify-center",
                                "shadow-sm"
                            )}>
                                <span className="text-xs font-bold text-white">
                                    {getInitials(user.full_name || user.email)}
                                </span>
                            </div>
                        )}

                        {/* Input de texto */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe tu mensaje aquí..."
                                disabled={isSubmitting || !user}
                                className={cn(
                                    "w-full px-4 py-3 pr-12",
                                    "bg-white/95 border border-cyan-100 rounded-2xl",
                                    "text-sm text-slate-700 placeholder:text-slate-400/70",
                                    "focus:outline-none focus:ring-2 focus:ring-cyan-300/30 focus:border-cyan-300",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "transition-all duration-200",
                                    "shadow-sm focus:shadow-md"
                                )}
                                maxLength={500}
                            />

                            {/* Contador de caracteres */}
                            {newMessage.length > 0 && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className={cn(
                                        "text-[10px] font-medium",
                                        newMessage.length > 450 ? "text-amber-500" : "text-slate-400"
                                    )}>
                                        {newMessage.length}/500
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Botón de enviar con gradiente premium */}
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || isSubmitting || !user}
                            className={cn(
                                "px-4 py-3 rounded-2xl",
                                "bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600",
                                "text-white text-sm font-medium",
                                "hover:from-cyan-600 hover:via-cyan-500 hover:to-cyan-700",
                                "disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed",
                                "transition-all duration-200",
                                "flex items-center justify-center gap-2",
                                "shadow-sm hover:shadow-md",
                                "relative overflow-hidden group"
                            )}
                        >
                            {/* Efecto de brillo en hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="fa-paper-plane" />
                                    <span>Enviar</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Mensaje para usuarios no autenticados */}
                    {!user && (
                        <div className="mt-2 text-center">
                            <p className="text-xs text-slate-500">
                                <a href="/auth" className="text-cyan-500 hover:text-cyan-600 font-medium">
                                    Inicia sesión
                                </a> para participar en la conversación
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default IALabForumOptimized;