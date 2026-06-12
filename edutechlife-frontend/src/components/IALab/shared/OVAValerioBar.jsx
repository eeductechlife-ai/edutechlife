import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { speakTextConversational, stopSpeech } from '../../../utils/speech';
import { useTranslation } from '../../../i18n/I18nProvider';
import { cn } from '../../forum/forumDesignSystem';

/**
 * @param {Object} props
 * @param {string} props.text
 * @param {boolean} [props.autoPlay]
 */
const OVAValerioBar = ({ text, autoPlay = false }) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (autoPlay && text && !isPlaying) {
      speakTextConversational(text, 'valerio', () => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (prevTextRef.current !== text && isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    }
    prevTextRef.current = text;
  }, [text]);

  useEffect(() => {
    return () => { stopSpeech(); };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };

  if (!text) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={isMinimized ? { y: 80 } : { y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl border transition-all',
          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          isPlaying ? 'shadow-corporate/20' : 'shadow-black/10'
        )}>
          <button
            onClick={togglePlay}
            className={cn(
              'min-w-[44px] min-h-[44px] flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
              isPlaying
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100'
                : 'bg-cyan-50 dark:bg-cyan-900/20 text-corporate hover:bg-cyan-100'
            )}
          >
            <Icon
              name={isPlaying ? 'fa-stop-circle' : 'fa-volume-up'}
              className="text-sm sm:text-base"
            />
            <span className="hidden sm:inline">
              {isPlaying
                ? t('ialab.voice_reader.stop')
                : t('ialab.voice_reader.listen')}
            </span>
          </button>

          {isPlaying && (
            <div className="flex items-center gap-0.5 h-4">
              {[1,2,3,4,5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.5, 1.2, 0.3][i-1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + i * 0.1,
                    delay: i * 0.08,
                    ease: 'easeInOut'
                  }}
                  className="w-0.5 bg-corporate rounded-full origin-bottom"
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="min-w-[44px] min-h-[44px] p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon
              name={isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'}
              className="text-xs"
            />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};


OVAValerioBar.propTypes = {
  text: PropTypes.string,
  autoPlay: PropTypes.bool,
};

export default OVAValerioBar;
