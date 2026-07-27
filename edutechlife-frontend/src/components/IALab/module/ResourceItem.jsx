import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";

const getResourceIcon = (type) => {
  if (type === "video") return "fa-video";
  if (type === "pdf" || type === "document") return "fa-file-lines";
  if (type === "ova" || type === "ova_interactive") return "fa-brain";
  if (type === "image") return "fa-image";
  return "fa-file";
};

const getResourceMeta = (res, t) => {
  if (res.type === "video") return res.duration || "";
  if (res.pages) return t("ialab.resource_pages", { pages: res.pages });
  if (res.estimatedTime) return res.estimatedTime;
  if (res.format) return res.format;
  if (res.size) return res.size;
  return "";
};

const ResourceItem = ({
  resource,
  isResourceCompleted,
  resourceLocked,
  justCompletedId,
  bookmarkedIds,
  toggleBookmark,
  onClick,
  prefersReducedMotion,
  t,
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -8 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 24,
        },
      },
    }}
  >
    <motion.button
      data-testid={`resource-btn-${resource.id}`}
      whileHover={prefersReducedMotion || resourceLocked ? {} : { x: 3 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      onClick={resourceLocked ? undefined : onClick}
      className={`group/res relative overflow-hidden rounded-xl border transition-all duration-300 text-left w-full ${
        isResourceCompleted
          ? "bg-emerald-50/40 border-emerald-200/40 cursor-pointer"
          : resourceLocked
            ? "bg-slate-50/50 border-slate-200/40 cursor-not-allowed opacity-60 dark:bg-slate-800/40 dark:border-slate-700/30"
            : "bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/50 hover:border-corporate/40 hover:shadow-lg hover:shadow-corporate/5 cursor-pointer"
      } ${justCompletedId === resource.id ? "ialab-animate-shimmer-pulse" : ""}`}
    >
      {!isResourceCompleted && !resourceLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-corporate/[0.03] to-transparent opacity-0 group-hover/res:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative flex items-center gap-3 p-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            resourceLocked
              ? "bg-slate-100 dark:bg-slate-700"
              : isResourceCompleted
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : "bg-gradient-to-br from-petroleum/10 to-corporate/10 group-hover/res:from-petroleum/15 group-hover/res:to-corporate/15 dark:from-petroleum/20 dark:to-corporate/20"
          }`}
        >
          <Icon
            name={resourceLocked ? "fa-lock" : getResourceIcon(resource.type)}
            className={`w-4 h-4 ${
              resourceLocked
                ? "text-slate-300 dark:text-slate-500"
                : isResourceCompleted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-petroleum"
            }`}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p
            className={`text-sm font-medium truncate transition-colors ${
              isResourceCompleted
                ? "text-emerald-700 dark:text-emerald-400"
                : resourceLocked
                  ? "text-slate-400"
                  : "text-slate-700 group-hover/res:text-petroleum dark:text-slate-200 dark:group-hover/res:text-petroleum"
            }`}
          >
            {resource.title}
          </p>
          {getResourceMeta(resource, t) && (
            <p
              className={`text-xs mt-0.5 ${resourceLocked ? "text-slate-300" : "text-slate-600 dark:text-slate-400"}`}
            >
              {getResourceMeta(resource, t)}
            </p>
          )}
        </div>
        <span
          className={`text-[10px] font-semibold px-3 py-1 rounded-full transition-all flex-shrink-0 ${
            isResourceCompleted
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              : resourceLocked
                ? "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                : "bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm"
          }`}
        >
          {isResourceCompleted
            ? t("ialab.status.viewed")
            : resourceLocked
              ? t("ialab.status.locked")
              : t("ialab.status.start_here")}
        </span>
        <div
          onClick={(e) => toggleBookmark(resource.id, e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleBookmark(resource.id, e);
            }
          }}
          role="button"
          tabIndex={0}
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 cursor-pointer"
          aria-label={
            bookmarkedIds.includes(resource.id)
              ? t("ialab.bookmark.remove")
              : t("ialab.bookmark.save")
          }
        >
          <Icon
            name="fa-bookmark"
            className={`text-sm transition-all duration-300 ${
              bookmarkedIds.includes(resource.id)
                ? "text-amber-500 drop-shadow-sm"
                : "text-slate-300 group-hover/res:text-amber-400 dark:text-slate-600"
            }`}
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.button>
  </motion.div>
);

ResourceItem.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    duration: PropTypes.string,
    pages: PropTypes.number,
    estimatedTime: PropTypes.string,
    format: PropTypes.string,
    size: PropTypes.string,
  }),
  isResourceCompleted: PropTypes.bool,
  resourceLocked: PropTypes.bool,
  justCompletedId: PropTypes.string,
  bookmarkedIds: PropTypes.arrayOf(PropTypes.string),
  toggleBookmark: PropTypes.func,
  onClick: PropTypes.func,
  prefersReducedMotion: PropTypes.bool,
  t: PropTypes.func,
};

export default ResourceItem;
