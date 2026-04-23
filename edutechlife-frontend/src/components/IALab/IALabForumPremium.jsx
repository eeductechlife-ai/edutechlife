import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useAuth } from '../../context/AuthContext';
import useIALabForum from '../../hooks/IALab/useIALabForum';
import { cn } from '../forum/forumDesignSystem';
import { 
  GlassPanel, 
  CompactTypography,
  MicroSpacing,
  ShadowSystem,
  cyanGradientBg,
  EvolvedInputs,
  EvolvedButtons,
  LEDIndicators
} from './GlassDesignSystem';
import LEDIndicator from './LEDIndicator';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  MoreVertical,
  Clock,
  User,
  TrendingUp,
  Users,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ThumbsUp,
  Award,
  Zap
} from 'lucide-react';

/**
 * IALabForumPremium - Foro optimizado con diseño burbuja premium
 * 
 * Características:
 * - Burbujas de chat con glassmorphism
 * - Scroll interno compacto (altura reducida 40%)
 * - Avatares con gradientes personalizados
 * - Indicadores LED de actividad en vivo
 * - Estadísticas en tiempo real
 * - Input flotante premium
 * - 50% más compacto que versión original
 */

const IALabForumPremium = ({
  compact = false,
  initialLimit = 4,
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

  // Estados optimizados
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLiveIndicator, setShowLiveIndicator] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all, popular, recent
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Cargar posts iniciales
  useEffect(() => {
    loadForumPosts();
  }, [loadForumPosts]);

  // Actualizar posts visibles
  useEffect(() => {
    if (forumPosts && forumPosts.length > 0) {
      const limit = showAll ? forumPosts.length : Math.min(initialLimit, forumPosts.length);
      setVisiblePosts(forumPosts.slice(0, limit));
    }
  }, [forumPosts, showAll, initialLimit]);

  // Auto-scroll al último mensaje
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!isLoading && visiblePosts.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [visiblePosts, isLoading, scrollToBottom]);

  // Manejar envío de mensaje
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost(newMessage);
      setNewMessage('');
      // Recargar posts después de enviar
      setTimeout(() => {
        loadForumPosts();
        setShowLiveIndicator(true);
        setTimeout(() => setShowLiveIndicator(false), 2000);
      }, 500);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generar gradiente único para avatar
  const generateAvatarGradient = (userId) => {
    const gradients = [
      'from-cyan-500 to-cyan-400',
      'from-blue-500 to-blue-400',
      'from-purple-500 to-purple-400',
      'from-pink-500 to-pink-400',
      'from-amber-500 to-amber-400',
      'from-emerald-500 to-emerald-400'
    ];
    const index = (userId?.length || 0) % gradients.length;
    return gradients[index];
  };

  // Formatear timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // Renderizar burbuja de mensaje premium
  const renderMessageBubble = (post) => {
    const isCurrentUser = user?.id === post.userId;
    const avatarGradient = generateAvatarGradient(post.userId);
    const likes = likeStates[post.id]?.count || post.likes || 0;
    const isLiked = likeStates[post.id]?.liked || false;
    const isPopular = likes >= 5;

    return (
      <div
        key={post.id}
        className={cn(
          "flex gap-3",
          isCurrentUser ? "flex-row-reverse" : "flex-row",
          "animate-fade-in"
        )}
      >
        {/* Avatar */}
        {!isCurrentUser && (
          <div className="flex-shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full",
              `bg-gradient-to-br ${avatarGradient}`,
              "flex items-center justify-center text-white text-xs font-bold",
              "shadow-sm"
            )}>
              {post.userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        )}

           {/* Burbuja de mensaje - Tarjeta blanca interna */}
           <div className={cn(
             "max-w-[85%]",
             "flex flex-col",
             isCurrentUser ? "items-end" : "items-start"
           )}>
          {/* Información del usuario */}
          {!isCurrentUser && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className={cn(
                CompactTypography.TINY,
                "text-slate-700 font-semibold"
              )}>
                {post.userName || 'Usuario'}
              </span>
              {isPopular && (
                <div className={cn(
                  "px-1.5 py-0.5 rounded-md",
                  "bg-amber-500/10",
                  "text-amber-600 text-xs font-medium",
                  "flex items-center gap-0.5"
                )}>
                  <Award className="w-3 h-3" />
                  Popular
                </div>
              )}
            </div>
          )}

           {/* Contenido del mensaje - Burbuja blanca premium */}
           <div className={cn(
             "px-4 py-3 rounded-2xl",
             "transition-all duration-150",
             isCurrentUser
               ? cn(
                   "bg-gradient-to-r from-[#004B63] to-[#00BCD4]",
                   "text-white",
                   "shadow-lg"
                 )
               : cn(
                   "bg-white",
                   "border border-slate-100",
                   "text-slate-800",
                   "shadow-[0_4px_15px_rgba(0,75,99,0.04)]"
                 ),
             isPopular && !isCurrentUser && "border-amber-200 bg-amber-50"
           )}>
             <p className={cn(
               "text-sm leading-relaxed whitespace-pre-wrap break-words",
               isCurrentUser ? "text-white" : "text-slate-700"
             )}>
              {post.content}
            </p>

            {/* Metadata del mensaje */}
             <div className={cn(
               "flex items-center justify-between",
               "mt-3 pt-3",
               isCurrentUser
                 ? "border-t border-white/30"
                 : "border-t border-slate-100"
             )}>
              <div className="flex items-center gap-3">
                {/* Timestamp */}
                 <div className={cn(
                   "flex items-center gap-1.5",
                   "text-xs",
                   isCurrentUser ? "text-white/90" : "text-slate-500"
                 )}>
                  <Clock className="w-3 h-3" />
                  {formatTime(post.createdAt)}
                </div>

                {/* Botón de like */}
                <button
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1",
                    "transition-all duration-150",
                    isLiked
                      ? "text-rose-500 hover:text-rose-600"
                      : isCurrentUser
                      ? "text-white/80 hover:text-white"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Heart className={cn(
                    "w-3.5 h-3.5",
                    isLiked && "fill-current"
                  )} />
                   <span className={cn("text-xs font-medium")}>
                    {formatLikeCount(likes)}
                  </span>
                </button>
              </div>

              {/* Indicador de usuario actual */}
              {isCurrentUser && (
                 <div className={cn(
                   "px-2 py-1 rounded-lg",
                   "bg-white/30",
                   "text-white text-sm font-medium"
                 )}>
                  Tú
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Avatar del usuario actual (derecha) */}
        {isCurrentUser && (
          <div className="flex-shrink-0">
             <div className={cn(
               "w-10 h-10 rounded-full",
               "bg-gradient-to-br from-[#004B63] to-[#00BCD4]",
               "flex items-center justify-center text-white text-sm font-bold",
               "shadow-md"
             )}>
              {user?.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Estadísticas del foro
  const forumStats = getForumStats();

  return (
    <div className={cn(
      "bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,75,99,0.06)] border border-slate-100/50",
      "flex flex-col",
      compact ? "h-[400px]" : "h-[500px]",
      "overflow-hidden",
      "hover:shadow-[0_12px_40px_rgba(0,75,99,0.1)] hover:border-slate-200/60",
      "transition-all duration-200",
      className
    )}>
      {/* Header premium compacto */}
      <div className={cn(
        "flex items-center justify-between",
        "px-6 py-4",
        "border-b border-slate-100/50",
        "bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5"
      )}>
        <div className="flex items-center gap-2.5">
           <div className={cn(
             "p-2.5 rounded-2xl",
             "bg-gradient-to-br from-[#004B63] to-[#00BCD4]",
             "text-white",
             "shadow-lg"
           )}>
             <MessageSquare className="w-6 h-6" />
           </div>
           <div>
             <h3 className={cn("text-lg font-bold text-[#004B63] font-montserrat mb-1")}>
               Comunidad IALab
             </h3>
             <div className="flex items-center gap-2">
               <LEDIndicator type="live" size="sm" />
               <span className={cn("text-sm text-slate-500")}>
                 {forumStats.totalPosts} mensajes • {forumStats.activeUsers} activos
               </span>
             </div>
           </div>
        </div>

        {/* Filtros y acciones */}
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1">
             {['all', 'popular', 'recent'].map(filter => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={cn(
                   "px-3 py-1.5 rounded-xl",
                   "text-sm font-medium",
                   "transition-all duration-150",
                   activeFilter === filter
                     ? "bg-[#00BCD4]/10 text-[#00BCD4] border border-[#00BCD4]/20"
                     : "text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
                 )}
               >
                 {filter === 'all' ? 'Todos' : 
                  filter === 'popular' ? 'Populares' : 'Recientes'}
               </button>
             ))}
           </div>

           <button
             onClick={loadForumPosts}
             disabled={isLoading}
             className={cn(
               "p-2 rounded-xl",
               "bg-slate-50",
               "border border-slate-100",
               "text-slate-600",
               "hover:bg-slate-100 hover:border-slate-200",
               "transition-all duration-150",
               isLoading && "opacity-50 cursor-not-allowed"
             )}
           >
             <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
           </button>
        </div>
      </div>

      {/* Área de mensajes con scroll interno */}
      <div
        ref={messagesContainerRef}
        className={cn(
          "flex-1 overflow-y-auto",
          "px-6 py-4",
          "space-y-4"
        )}
      >
        {isLoading ? (
          // Skeleton loading
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                <div className="flex-1">
                  <div className="w-24 h-3 bg-slate-200 rounded mb-2 animate-pulse" />
                  <div className="w-full h-16 bg-slate-100 rounded-2xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center h-full">
               <div className={cn(
                 "p-4 rounded-2xl",
                 "bg-red-50",
                 "border border-red-100"
               )}>
                 <p className={cn("text-sm text-red-600")}>
                   Error al cargar mensajes: {error}
                 </p>
               </div>
            <button
              onClick={loadForumPosts}
              className={cn(
                EvolvedButtons.GLASS_SECONDARY,
                "mt-3"
              )}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Reintentar
            </button>
          </div>
        ) : visiblePosts.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full">
               <div className={cn(
                 "p-6 rounded-2xl",
                 "bg-slate-50",
                 "border border-slate-100",
                 "text-center"
               )}>
                 <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                 <h4 className={cn("text-base font-semibold text-slate-700 mb-2")}>
                   ¡Sé el primero en comentar!
                 </h4>
                 <p className={cn("text-sm text-slate-500")}>
                   Comparte tus ideas, preguntas o experiencias con la comunidad.
                 </p>
               </div>
          </div>
        ) : (
          // Lista de mensajes
          <>
            {visiblePosts.map(post => renderMessageBubble(post))}
            <div ref={messagesEndRef} />
            
            {/* Load more indicator */}
            {!showAll && forumPosts.length > initialLimit && (
              <div className="flex justify-center pt-2">
                 <button
                   onClick={() => setShowAll(true)}
                   className={cn(
                     "flex items-center gap-2",
                     "px-4 py-2 rounded-xl",
                     "text-[#00BCD4] text-sm font-medium",
                     "bg-[#00BCD4]/10 hover:bg-[#00BCD4]/15",
                     "border border-[#00BCD4]/20",
                     "transition-all duration-150"
                   )}
                 >
                   <ChevronDown className="w-4 h-4" />
                   Ver {forumPosts.length - initialLimit} mensajes más
                 </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input de mensaje flotante premium */}
      <div className={cn(
        "px-6 py-4",
        "border-t border-slate-100",
        "bg-slate-50"
      )}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2">
            {/* Avatar del usuario */}
             <div className={cn(
               "w-10 h-10 rounded-full",
               "bg-gradient-to-br from-[#004B63] to-[#00BCD4]",
               "flex items-center justify-center text-white text-sm font-bold",
               "flex-shrink-0",
               "shadow-md"
             )}>
              {user?.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>

            {/* Input de texto */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
               className={cn(
                 "bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400",
                 "rounded-xl px-4 py-3 text-sm",
                 "flex-1 pr-12",
                 "focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/30 focus:border-[#00BCD4]",
                 "transition-all duration-150"
               )}
              maxLength={500}
              disabled={isSubmitting}
            />

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={!newMessage.trim() || isSubmitting}
               className={cn(
                 "absolute right-2",
                 "p-2 rounded-xl",
                 "transition-all duration-200",
                 isSubmitting
                   ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                   : newMessage.trim()
                   ? "bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white shadow-lg hover:shadow-xl"
                   : "bg-slate-100 text-slate-400"
               )}
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Contador y estado */}
           <div className="flex items-center justify-between mt-3">
             <div className={cn("text-xs text-slate-500")}>
               {newMessage.length}/500 caracteres
             </div>
             
             {showLiveIndicator && (
               <div className="flex items-center gap-1.5">
                 <LEDIndicator type="live" size="sm" />
                 <span className={cn("text-xs text-[#00BCD4] font-medium")}>
                   Actividad en vivo
                 </span>
               </div>
             )}
           </div>
        </form>
      </div>

      {/* Footer con estadísticas */}
      <div className={cn(
        "flex items-center justify-between",
        "px-6 py-3",
        "border-t border-slate-100",
        "bg-slate-50"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
             <span className={cn("text-xs text-slate-600")}>
               {forumStats.activeUsers} en línea
             </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
             <span className={cn("text-xs text-slate-600")}>
               {forumStats.todayPosts} hoy
             </span>
          </div>
        </div>
        
         <div className={cn("text-xs text-slate-500")}>
           Última actualización: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </div>
    </div>
  );
};

export default IALabForumPremium;