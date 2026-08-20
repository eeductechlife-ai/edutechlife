import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";

const ModuleBookmarkFilter = ({
  bookmarkedResources,
  showBookmarked,
  setShowBookmarked,
  toggleBookmark,
  setSelectedResource,
  setSelectedResourceType,
  setViewerModalOpen,
  t,
}) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <>
      <button
        onClick={() => setShowBookmarked((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/30 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-all duration-200 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/40 group/bm"
        aria-expanded={showBookmarked}
        aria-label={t("ialab.bookmarked_aria", {
          count: bookmarkedResources.length,
        })}
      >
        <Icon
          name="fa-bookmark"
          className="text-amber-500 text-sm"
          aria-hidden="true"
        />
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex-1">
          {t("ialab.bookmarked", { count: bookmarkedResources.length })}
        </span>
        <Icon
          name="fa-chevron-down"
          className={`text-amber-400 text-xs transition-all duration-300 group-hover/bm:translate-y-0.5 ${showBookmarked ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {showBookmarked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="pl-6 pr-2 pb-2 space-y-1.5">
              {bookmarkedResources.map((res) => (
                <motion.button
                  key={res.id}
                  whileHover={prefersReducedMotion ? {} : { x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  onClick={() => {
                    setSelectedResource(res);
                    setSelectedResourceType(res.type);
                    setViewerModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-amber-200/40 dark:border-amber-700/20 bg-amber-50/30 dark:bg-amber-900/10 hover:bg-amber-100/40 dark:hover:bg-amber-900/20 transition-all duration-200 text-left group/res"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name="fa-file"
                      className="text-amber-500 text-xs"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate flex-1">
                    {res.title}
                  </span>
                  <div
                    onClick={(e) => toggleBookmark(res.id, e)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleBookmark(res.id, e);
                      }
                    }}
                  >
                    <Icon
                      name="fa-bookmark"
                      className="text-amber-500 text-sm"
                      aria-hidden="true"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

ModuleBookmarkFilter.propTypes = {
  bookmarkedResources: PropTypes.array,
  showBookmarked: PropTypes.bool,
  setShowBookmarked: PropTypes.func,
  toggleBookmark: PropTypes.func,
  setSelectedResource: PropTypes.func,
  setSelectedResourceType: PropTypes.func,
  setViewerModalOpen: PropTypes.func,
  t: PropTypes.func,
};

export default ModuleBookmarkFilter;
