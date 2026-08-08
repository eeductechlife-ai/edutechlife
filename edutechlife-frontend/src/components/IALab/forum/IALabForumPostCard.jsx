import PropTypes from "prop-types";
import { Icon } from "../../utils/iconMapping.jsx";

const IALabForumPostCard = ({
  post,
  onLikeToggle,
  formatLikeCount,
  getLikeButtonProps,
  t,
  locale,
  user,
}) => {
  const likeProps = getLikeButtonProps(post.id);
  const formattedDate = new Date(post.created_at).toLocaleDateString(
    { en: "en-US", pt: "pt-BR", es: "es-ES" }[locale] || "es-ES",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const simulatedData = {
    role:
      post.profiles?.role || (Math.random() > 0.5 ? "Mentor" : "Estudiante"),
    tags: post.tags || [
      t("ialab.forum.post_card.tag_module5"),
      t("ialab.forum.post_card.tag_rtf"),
      t("ialab.forum.post_card.tag_help"),
    ],
    views: post.view_count || Math.floor(Math.random() * 150) + 10,
    lastResponder: {
      name:
        post.last_responder || t("ialab.forum.post_card.last_responder_name"),
      avatar: post.last_responder_avatar || null,
      time: t("ialab.forum.section.last_reply_time"),
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-corporate/20 hover:bg-slate-50 hover:shadow-[0_8px_32px_rgba(0,188,212,0.08)] transition-all duration-300 cursor-pointer">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center text-white font-bold text-lg mb-2">
            {post.profiles?.full_name?.charAt(0) ||
              t("ialab.forum.section.initial_fallback")}
          </div>
          <div
            className={`text-xs font-medium px-2 py-1 rounded-full text-center ${
              simulatedData.role === "Mentor"
                ? "bg-corporate/10 text-corporate border border-corporate/20"
                : "bg-petroleum/10 text-petroleum border border-petroleum/20"
            }`}
          >
            {simulatedData.role === "Mentor"
              ? t("ialab.forum.section.role_mentor")
              : t("ialab.forum.section.role_student")}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h4 className="font-bold text-petroleum-darker text-lg mb-1">
              {post.title || t("ialab.forum.section.title_fallback")}
            </h4>
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {post.content || t("ialab.forum.section.content_fallback")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {simulatedData.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 hover:bg-slate-200 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-petroleum">
              {post.profiles?.full_name ||
                t("ialab.forum.post_card.author_name")}
            </span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex-shrink-0 w-32">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Icon
                    name="fa-comment"
                    className="w-3.5 h-3.5 text-slate-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {post.comment_count || 8}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {t("ialab.forum.section.replies_label")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Icon name="fa-eye" className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {simulatedData.views}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {t("ialab.forum.section.views_label")}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-corporate/20 to-petroleum/20 flex items-center justify-center text-xs font-medium text-petroleum">
                  {simulatedData.lastResponder.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600 truncate">
                    {simulatedData.lastResponder.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {simulatedData.lastResponder.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLikeToggle(post.id, likeProps.likeCount)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onLikeToggle(post.id, likeProps.likeCount);
              }
            }}
            disabled={!user || likeProps.isLoading}
            aria-label={likeProps.ariaLabel}
            aria-pressed={likeProps.userLiked}
            className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg
                            transition-all duration-200 hover:scale-105 active:scale-95
                            ${likeProps.buttonClass}
                            disabled:opacity-50 disabled:cursor-not-allowed
                            focus:outline-none focus:ring-1 focus:ring-corporate/30
                            ${likeProps.userLiked ? "shadow-[0_0_8px_rgba(0,188,212,0.2)]" : ""}
                        `}
            tabIndex={user ? 0 : -1}
          >
            <Icon
              name={likeProps.likeIcon}
              className={`w-3.5 h-3.5 ${likeProps.isLoading ? "animate-spin" : ""}`}
              style={{ color: likeProps.likeColor }}
            />
            <span className="text-sm font-medium">
              {formatLikeCount(likeProps.likeCount)}
            </span>
          </button>

          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all duration-200"
            disabled={!user}
          >
            <Icon name="fa-reply" className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">
              {t("ialab.forum.section.reply_btn")}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 text-slate-600 hover:text-corporate transition-colors duration-200 rounded-md hover:bg-slate-50"
            aria-label={t("ialab.forum.section.save_aria")}
          >
            <Icon name="fa-bookmark" className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-slate-600 hover:text-corporate transition-colors duration-200 rounded-md hover:bg-slate-50"
            aria-label={t("ialab.forum.section.share_aria")}
          >
            <Icon name="fa-share" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {likeProps.likeCount >= 5 && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-amber-600">
              {t("ialab.forum.section.active_discussion")}
            </span>
          </div>
        )}
        {post.comment_count >= 3 && (
          <div className="text-xs text-slate-500">
            {t("ialab.forum.section.replies_info", {
              count: post.comment_count,
              time: simulatedData.lastResponder.time,
            })}
          </div>
        )}
      </div>
    </div>
  );
};

IALabForumPostCard.propTypes = {
  post: PropTypes.object,
  onLikeToggle: PropTypes.func,
  formatLikeCount: PropTypes.func,
  getLikeButtonProps: PropTypes.func,
  t: PropTypes.func,
  locale: PropTypes.string,
  user: PropTypes.object,
};

export default IALabForumPostCard;
