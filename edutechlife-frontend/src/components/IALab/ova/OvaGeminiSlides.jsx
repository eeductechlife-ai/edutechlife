import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { SLIDE_ICONS } from './ovaData';

export default function OvaGeminiSlides({ currentSlide, slideContent, slideDescs, slideTitles }) {
  return (
    <div key={`slide-${currentSlide}`}>
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-petroleum/20 dark:from-cyan-400/10 dark:to-petroleum/10 flex items-center justify-center">
          <Icon name={SLIDE_ICONS[currentSlide]} className="text-cyan-600 dark:text-cyan-400 text-lg sm:text-xl" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-montserrat">
            {slideContent[currentSlide].title}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {slideDescs[currentSlide]}
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {slideContent[currentSlide].paragraphs.map((p, i) => (
          <motion.p
            key={`p-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            {p}
          </motion.p>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {slideContent[currentSlide].highlights.map((h, i) => (
          <motion.div
            key={`h-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800"
          >
            <Icon name="fa-check-circle" className="text-cyan-500 text-sm sm:text-base flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">{h}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
