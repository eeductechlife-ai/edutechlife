import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useAuth } from '../../context/AuthContext';
import useIALabForum from '../../hooks/IALab/useIALabForum';
import { cn } from '../forum/forumDesignSystem';

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

    const [visiblePosts, setVisiblePosts] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLiveIndicator, setShowLiveIndicator] = useState(true);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        loadForumPosts(showAll ? 20 : initialLimit);
    }, [loadForumPosts, showAll, initialLimit]);

    useEffect(() => {
        if (forumPosts.length > 0) {
            const postsToShow = showAll ? forumPosts : forumPosts.slice(0, initialLimit);
            setVisiblePosts(postsToShow);
        }
    }, [forumPosts, showAll, initialLimit]);

    useEffect(() => {
        if (messagesEndRef.current && !isLoading) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [visiblePosts, isLoading]);

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
            setShowLiveIndicator(true);
            setTimeout(() => setShowLiveIndicator(false), 3000);
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoadMore = () => {
        setShowAll(true);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getAvatarGradient = (name) => {
        if (!name) return 'from-[#004B63] to-[#0A3550]';

        const colors = [
            'from-[#004B63] to-[#0A3550]',
            'from-[#0A3550] to-[#00BCD4]',
            'from-indigo-600 to-blue-400',
            'from-violet-600 to-indigo-400',
            'from-purple-600 to-violet-400'
        ];

        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

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

    const forumStats = getForumStats();

    return (
        <div
            className={cn(
                "relative z-10 bg-white rounded-2xl shadow-sm border border-[#004B63]/8",
                "flex flex-col overflow-hidden",
                compact ? "h-96" : "h-fit",
                className
            )}
            {...rest}
        >
            {/* Elementos decorativos */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#004B63]/6 to-[#00BCD4]/4 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#004B63]/4 to-[#00BCD4]/2 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />

            {/* Estilos para animaciones */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes livePulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                .animate-in { animation-duration: 300ms; animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); animation-fill-mode: both; }
                .fade-in-up { animation-name: fadeInUp; }
                .animation-delay-100 { animation-delay: 100ms; }
                .animation-delay-200 { animation-delay: 200ms; }
                .animation-delay-300 { animation-delay: 300ms; }
                .live-pulse { animation: livePulse 2s ease-in-out infinite; }
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(0, 188, 212, 0.3); border-radius: 20px; }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 188, 212, 0.5); }
                .message-bubble { transition: all 0.3s ease; }
                .message-bubble:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(0, 75, 99, 0.08); }
            `}</style>

            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#004B63]/8">
                <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center flex-shrink-0">
                        <Icon name="fa-comments" className="text-white text-sm" />
                        {showLiveIndicator && (
                            <div className="absolute -top-1 -right-1 w-3 h-3">
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                <div className="absolute inset-0 bg-emerald-500 rounded-full" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-[#004B63]">
                                Comunidad IALab
                            </h3>
                            {showLiveIndicator && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full live-pulse" />
                                    En vivo
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">
                            {forumStats.totalPosts} debates &middot; {forumStats.totalComments} respuestas
                        </p>
                    </div>
                </div>

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

            {/* Área de Mensajes */}
            <div
                ref={messagesContainerRef}
                className={cn(
                    "flex-1 overflow-y-auto",
                    "px-4 md:px-6 py-4",
                    "scrollbar-thin"
                )}
                style={{ maxHeight: '400px' }}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-[#004B63]/20 border-t-[#004B63] rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-slate-500">Cargando conversaciones...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-4">
                            <Icon name="fa-exclamation-triangle" className="text-amber-500 text-2xl mb-3" />
                            <p className="text-sm text-slate-600 mb-2">{error}</p>
                            <button
                                onClick={() => loadForumPosts(initialLimit)}
                                className="text-xs text-[#004B63] hover:text-[#0A3550] font-medium"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    </div>
                ) : visiblePosts.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-4">
                            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 border border-[#004B63]/10 flex items-center justify-center mb-4">
                                <Icon name="fa-comment-dots" className="text-[#004B63] text-xl" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 mb-1">
                                Sé el primero en comentar
                            </h4>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Inicia una conversación sobre IA educativa y prompt engineering
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visiblePosts.map((post, index) => {
                            const isLiked = likeStates[post.id]?.userLiked || false;
                            const likeCount = likeStates[post.id]?.likeCount || post.upvote_count || 0;
                            const isLoadingLike = likeStates[post.id]?.isLoading || false;

                            return (
                                <div
                                    key={post.id}
                                    className={cn(
                                        "bg-white border border-[#004B63]/6 rounded-xl p-4",
                                        "message-bubble",
                                        "animate-in fade-in-up",
                                        index === 0 ? "animation-delay-100" :
                                        index === 1 ? "animation-delay-200" :
                                        index === 2 ? "animation-delay-300" : ""
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
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
                                                        <span className="px-1.5 py-0.5 bg-[#004B63]/5 text-[#004B63] text-[10px] font-medium rounded-full">
                                                            Mentor
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400">
                                                    {formatRelativeTime(post.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            disabled={isLoadingLike || !user}
                                            className={cn(
                                                "flex items-center gap-1",
                                                "text-xs font-medium",
                                                isLiked ? "text-red-500" : "text-slate-400",
                                                "hover:text-red-500",
                                                "transition-colors",
                                                "disabled:opacity-50 disabled:cursor-not-allowed"
                                            )}
                                        >
                                            {isLoadingLike ? (
                                                <div className="w-3 h-3 border border-[#004B63]/20 border-t-[#004B63] rounded-full animate-spin" />
                                            ) : (
                                                <Icon name={isLiked ? "fa-heart" : "fa-heart"} className={isLiked ? "fill-current" : ""} />
                                            )}
                                            <span>{formatLikeCount(likeCount)}</span>
                                        </button>
                                    </div>

                                    <div className="mb-3">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-1">
                                            {post.title}
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-snug">
                                            {post.content}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags?.slice(0, 2).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="px-2 py-0.5 bg-[#004B63]/5 text-[#004B63] text-[10px] font-medium rounded-full"
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

                        {!showAll && forumPosts.length > initialLimit && (
                            <div className="text-center pt-2">
                                <button
                                    onClick={handleLoadMore}
                                    className="text-xs text-[#004B63] hover:text-[#0A3550] font-medium"
                                >
                                    Ver {forumPosts.length - initialLimit} mensajes más ↓
                                </button>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-[#004B63]/8 p-4 md:p-6">
                <form onSubmit={handleSubmitMessage} className="relative">
                    <div className="flex items-center gap-3">
                        {user && (
                            <div className={cn(
                                "w-8 h-8 rounded-full flex-shrink-0",
                                "bg-gradient-to-tr from-[#004B63] to-[#0A3550]",
                                "flex items-center justify-center",
                                "shadow-sm"
                            )}>
                                <span className="text-xs font-bold text-white">
                                    {getInitials(user.full_name || user.email)}
                                </span>
                            </div>
                        )}

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe tu mensaje aquí..."
                                disabled={isSubmitting || !user}
                                className={cn(
                                    "w-full px-4 py-3 pr-12",
                                    "bg-white border border-slate-200 rounded-xl",
                                    "text-sm text-slate-700 placeholder:text-slate-400/70",
                                    "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20 focus:border-[#00BCD4]/30",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "transition-all duration-200",
                                    "shadow-sm focus:shadow-md"
                                )}
                                maxLength={500}
                            />

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

                        <button
                            type="submit"
                            disabled={!newMessage.trim() || isSubmitting || !user}
                            className={cn(
                                "px-4 py-3 rounded-xl",
                                "bg-gradient-to-r from-[#004B63] to-[#00BCD4]",
                                "text-white text-sm font-medium",
                                "hover:shadow-[0_0_15px_rgba(0,188,212,0.3)]",
                                "disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed",
                                "transition-all duration-200",
                                "flex items-center justify-center gap-2",
                                "shadow-sm",
                                "relative overflow-hidden group"
                            )}
                        >
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

                    {!user && (
                        <div className="mt-2 text-center">
                            <p className="text-xs text-slate-500">
                                <a href="/auth" className="text-[#004B63] hover:text-[#0A3550] font-medium">
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
