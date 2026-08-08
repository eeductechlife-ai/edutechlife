import PropTypes from "prop-types";
import { Icon } from "@/utils/iconMapping.jsx";
import { getInitials, getAvatarGradient } from "@/utils/forumHelpers";
import { cn } from "@/components/forum/forumDesignSystem";
import { useTranslation } from "../../../i18n/I18nProvider";

const formatRelativeTime = (dateString, t, locale) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return t("ialab.forum.post_card.now");
  if (diffMins < 60)
    return t("ialab.forum.post_card.min_ago", { mins: diffMins });
  if (diffHours < 24)
    return t("ialab.forum.post_card.hour_ago", { hours: diffHours });
  if (diffDays < 7)
    return t("ialab.forum.post_card.day_ago", { days: diffDays });
  return date.toLocaleDateString(
    { en: "en-US", pt: "pt-BR", es: "es-ES" }[locale] || "es-ES",
    { day: "numeric", month: "short" },
  );
};

const ForumOptimizedPostCard = ({
  post,
  isLiked,
  likeCount,
  isLoadingLike,
  onToggleLike,
  user,
  formatLikeCount,
  index,
}) => {
  const { t, locale } = useTranslation();
  return (
    <div
      role="article"
      aria-label={`${t("ialab.forum.optimized.post_aria")} ${post.profiles?.full_name || t("ialab.forum.optimized.user_fallback")}`}
      className={cn(
        "bg-white border border-slate-100 rounded-xl p-4",
        "message-bubble",
        "ialab-animate-in fade-in-up",
        index === 0
          ? "animation-delay-100"
          : index === 1
            ? "animation-delay-200"
            : index === 2
              ? "animation-delay-300"
              : "",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-full",
              "bg-gradient-to-tr",
              getAvatarGradient(post.profiles?.full_name),
              "flex items-center justify-center",
              "shadow-sm",
            )}
          >
            <span className="text-xs font-bold text-white">
              {getInitials(post.profiles?.full_name)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {post.profiles?.full_name ||
                  t("ialab.forum.optimized.user_fallback")}
              </span>
              {post.tags?.includes("Mentor") && (
                <span className="px-1.5 py-0.5 bg-petroleum/5 text-petroleum text-[10px] font-medium rounded-full">
                  {t("ialab.forum.optimized.mentor_badge")}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-600">
              {formatRelativeTime(post.created_at, t, locale)}
            </span>
          </div>
        </div>

        <button
          onClick={() => onToggleLike(post.id)}
          disabled={isLoadingLike || !user}
          aria-label={
            isLiked
              ? t("ialab.forum.optimized.unlike_aria")
              : t("ialab.forum.optimized.like_aria")
          }
          aria-pressed={isLiked}
          className={cn(
            "flex items-center gap-1",
            "text-xs font-medium",
            isLiked ? "text-red-500" : "text-slate-500",
            "hover:text-red-500",
            "transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {isLoadingLike ? (
            <div className="w-3 h-3 border border-petroleum/20 border-t-[#004B63] rounded-full animate-spin" />
          ) : (
            <Icon name="fa-heart" className={isLiked ? "fill-current" : ""} />
          )}
          <span>{formatLikeCount(likeCount)}</span>
        </button>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-semibold text-slate-800 mb-1">
          {post.title}
        </h4>
        <p className="text-sm text-slate-600 leading-snug">{post.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {post.tags?.slice(0, 2).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-0.5 bg-petroleum/5 text-petroleum text-[10px] font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
          {post.tags && post.tags.length > 2 && (
            <span className="text-[10px] text-slate-600">
              +{post.tags.length - 2}
            </span>
          )}
        </div>

        {post.comment_count > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-slate-600">
            <Icon name="fa-comment" />
            <span>{post.comment_count}</span>
          </div>
        )}
      </div>
    </div>
  );
};

ForumOptimizedPostCard.propTypes = {
  post: PropTypes.object,
  isLiked: PropTypes.bool,
  likeCount: PropTypes.number,
  isLoadingLike: PropTypes.bool,
  onToggleLike: PropTypes.func,
  user: PropTypes.object,
  formatLikeCount: PropTypes.func,
  index: PropTypes.number,
};

export default ForumOptimizedPostCard;
