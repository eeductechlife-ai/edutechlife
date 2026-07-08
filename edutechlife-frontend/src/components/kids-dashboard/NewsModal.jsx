import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../data/newsData';

const getIconForDataPoint = (iconName) => {
  const map = {
    'zap': 'fa-bolt',
    'eye': 'fa-eye',
    'clock': 'fa-clock',
    'brain': 'fa-brain',
    'search': 'fa-search',
    'users': 'fa-users',
    'coffee': 'fa-coffee',
    'star': 'fa-star',
    'trending-up': 'fa-chart-line',
    'shield': 'fa-shield-alt',
    'book-open': 'fa-book-open',
    'heart': 'fa-heart',
    'globe': 'fa-globe',
    'database': 'fa-database',
    'weight': 'fa-weight-hanging',
    'file-text': 'fa-file-text',
    'graduation-cap': 'fa-graduation-cap',
    'layout-template': 'fa-layer-group',
    'history': 'fa-history',
    'target': 'fa-target',
  };
  return map[iconName] || 'fa-circle-info';
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } },
};

const dataPointVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  show: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 260 - i * 20, damping: 20, delay: 0.2 + i * 0.04 },
  }),
};

export default function NewsModal({ article, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 100) onClose();
  };

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 sm:items-center sm:p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          style={{ perspective: '1200px' }}
        >
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 60, scale: 0.92, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.94, rotateX: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            style={{ transformOrigin: 'center top', transformStyle: 'preserve-3d' }}
          >
            {/* Drag handle for mobile */}
            <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-20 w-10 h-1 rounded-full bg-[#CBD5E1]" />

            {/* Hero Image */}
            <div className="relative aspect-video bg-gradient-to-br from-[#004B63]/10 to-[#4DA8C4]/10 overflow-hidden">
              <motion.img
                src={article.imageUrl}
                alt={article.imageAlt}
                initial={{ scale: 1.15, filter: 'blur(4px)' }}
                animate={imgLoaded ? { scale: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full h-full object-cover"
                onLoad={() => setImgLoaded(true)}
              />

              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Category Badge */}
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.18 }}
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
                style={{ backgroundColor: CATEGORY_COLORS[article.category] }}
              >
                {CATEGORY_LABELS[article.category]}
              </motion.span>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.25 }}
                whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(0,0,0,0.6)' }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors z-10"
                style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
                aria-label="Cerrar"
              >
                <Icon name="fa-xmark" className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              ref={contentRef}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="p-6"
            >
              {/* Title */}
              <motion.h2 variants={staggerItem} className="text-xl font-black text-[#004B63] mb-4 leading-tight">
                {article.title}
              </motion.h2>

              {/* Data Points Grid */}
              {article.dataPoints && article.dataPoints.length > 0 && (
                <motion.div variants={staggerItem} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {article.dataPoints.map((dp, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={dataPointVariants}
                      initial="hidden"
                      animate="show"
                      whileHover={{ y: -2, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-default"
                      style={{ backgroundColor: `${CATEGORY_COLORS[article.category]}0a` }}
                    >
                      <motion.div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${CATEGORY_COLORS[article.category]}15` }}
                        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon
                          name={getIconForDataPoint(dp.icon)}
                          className="w-5 h-5"
                          style={{ color: CATEGORY_COLORS[article.category] }}
                        />
                      </motion.div>
                      <div className="min-w-0">
                        <p className="text-lg font-black text-[#004B63] leading-tight">
                          {dp.value}
                        </p>
                        <p className="text-[11px] text-[#64748B] truncate">
                          {dp.label}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Full Content */}
              <motion.div variants={staggerItem} className="text-sm text-[#475569] leading-relaxed space-y-3">
                {article.content.split('\n').map((paragraph, i) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  const isNumbered = /^\d+\./.test(trimmed);
                  const isSubList = /^- /.test(trimmed);
                  const isHeading = trimmed.endsWith(':') && trimmed.length < 40;

                  if (isHeading) {
                    return (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.015, type: 'spring', stiffness: 200, damping: 20 }}
                        className="font-bold text-[#004B63]"
                      >
                        {trimmed}
                      </motion.p>
                    );
                  }
                  if (isNumbered) {
                    return (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + i * 0.015, type: 'spring', stiffness: 200, damping: 20 }}
                        className="text-[#334155]"
                      >
                        {trimmed}
                      </motion.p>
                    );
                  }
                  if (isSubList) {
                    return (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.015, type: 'spring', stiffness: 200, damping: 20 }}
                        className="text-[#475569] pl-4"
                      >
                        {trimmed}
                      </motion.p>
                    );
                  }
                  return (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.015, type: 'spring', stiffness: 200, damping: 20 }}
                      className="text-[#475569]"
                    >
                      {trimmed}
                    </motion.p>
                  );
                })}
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                className="flex items-center justify-between mt-6 pt-4 border-t border-[#E2E8F0]"
              >
                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Icon name="fa-clock" className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8]">
                  {new Date(article.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
