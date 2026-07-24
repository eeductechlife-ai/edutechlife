import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Icon } from '../../../utils/iconMapping.jsx';
import { cn } from '../../forum/forumDesignSystem';
import { useTranslation } from '../../../i18n/I18nProvider';

const ImageViewer = ({ resource, onAutoComplete }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasViewed, setHasViewed] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (completedRef.current) return;
    if (!isLoading && !hasViewed) {
      setHasViewed(true);
      const timer = setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onAutoComplete?.();
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasViewed, onAutoComplete]);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-auto">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-petroleum to-corporate shadow-sm flex items-center justify-center">
            <Icon name="fa-image" className="text-white w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            {resource.interactive && (
              <span className="text-sm text-petroleum font-medium">{t('ialab.viewer_modal.interactive_label')}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
          <a
            href={resource.url}
            download
            className="px-4 py-2 bg-gradient-to-r from-petroleum to-corporate text-white rounded-lg hover:from-corporate-deep hover:to-corporate-darker transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Icon name="fa-download" className="w-4 h-4" />
            {t('ialab.viewer_modal.download')}
          </a>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 relative bg-transparent">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-petroleum/20 border-t-petroleum rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={resource.url}
          alt={resource.title}
          className={cn(
            "w-full object-contain",
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>

      {resource.description && (
        <div className="p-4 bg-petroleum/5">
          <p className="text-sm text-petroleum/80">{resource.description}</p>
        </div>
      )}
    </div>
  );
};


ImageViewer.propTypes = {
  resource: PropTypes.object,
  onAutoComplete: PropTypes.func,
};

export default ImageViewer;
