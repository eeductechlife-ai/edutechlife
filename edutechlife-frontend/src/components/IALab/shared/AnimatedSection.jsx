import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @param {Object} props
 * @param {boolean} [props.show]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.skeleton]
 * @param {boolean} [props.loading]
 */
export function AnimatedSection({ show, children, skeleton, loading }) {
  return (
    <AnimatePresence>
      {(show || show === undefined) && (
        <motion.div key={loading ? 'skeleton' : 'content'} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {loading ? (skeleton || (
            <div className="space-y-3 p-4">
              <div className="skeleton-shimmer bg-gray-200 dark:bg-slate-700 h-5 w-2/3 rounded-lg" />
              <div className="skeleton-shimmer bg-gray-200 dark:bg-slate-700 h-4 w-full rounded-lg" />
              <div className="skeleton-shimmer bg-gray-200 dark:bg-slate-700 h-4 w-4/5 rounded-lg" />
              <div className="skeleton-shimmer bg-gray-200 dark:bg-slate-700 h-20 w-full rounded-xl" />
            </div>
          )) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              {children}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(AnimatedSection);
