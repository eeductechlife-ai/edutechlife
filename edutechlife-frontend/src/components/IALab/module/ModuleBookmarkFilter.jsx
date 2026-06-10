import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';

const ModuleBookmarkFilter = ({ bookmarkedResources, showBookmarked, setShowBookmarked, toggleBookmark, setSelectedResource, setSelectedResourceType, setViewerModalOpen, t }) => {
  return (
    <>
      <button
        onClick={() => setShowBookmarked((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200/60 hover:bg-amber-100/50 transition-all duration-200 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
        aria-expanded={showBookmarked}
        aria-label={t('ialab.bookmarked_aria', { count: bookmarkedResources.length })}
      >
        <Icon name="fa-bookmark" className="text-amber-500 text-sm" aria-hidden="true" />
        <span className="text-xs font-semibold text-amber-700 flex-1">{t('ialab.bookmarked', { count: bookmarkedResources.length })}</span>
        <Icon name="fa-chevron-down" className={`text-amber-400 text-xs transition-transform duration-200 ${showBookmarked ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {showBookmarked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="pl-6 pr-2 pb-2 space-y-1.5">
              {bookmarkedResources.map((res) => (
                <button
                  key={res.id}
                  onClick={() => {
                    setSelectedResource(res);
                    setSelectedResourceType(res.type);
                    setViewerModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-amber-200/40 bg-amber-50/30 hover:bg-amber-100/40 transition-all duration-200 text-left group/res"
                >
                  <Icon name="fa-file" className="text-amber-400 text-xs flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium text-slate-700 truncate flex-1">{res.title}</span>
                    <Icon
                      name="fa-bookmark"
                      className="text-amber-500 text-xs flex-shrink-0"
                      onClick={(e) => toggleBookmark(res.id, e)}
                      aria-hidden="true"
                    />
                </button>
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
