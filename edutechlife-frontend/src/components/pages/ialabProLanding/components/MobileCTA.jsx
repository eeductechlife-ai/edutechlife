import { motion, AnimatePresence } from 'framer-motion';

const MobileCTA = ({ t, showMobileCTA }) => (
  <AnimatePresence>
    {showMobileCTA && (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#004B63]/10 p-4 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <span className="text-sm font-bold text-[#004B63]">AI Lab Academic</span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white text-sm font-bold rounded-lg shadow-lg"
          >
            {t('ialab.landing.hero_badge')}
          </motion.button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MobileCTA;
