import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedSection({ show, children, skeleton, loading }) {
  return (
    <AnimatePresence mode="wait">
      {(show || show === undefined) && (
        <motion.div key={loading ? 'skeleton' : 'content'} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {loading ? (skeleton || <div className="animate-pulse h-20 bg-slate-100 rounded-xl" />) : (
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
