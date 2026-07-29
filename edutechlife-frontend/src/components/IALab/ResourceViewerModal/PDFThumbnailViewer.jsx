import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const PDFThumbnailViewer = ({ resource, onAutoComplete }) => {
  const { t } = useTranslation();
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);
  const completedRef = useRef(false);
  const MIN_SECONDS = 30;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (completedRef.current) return;
    if (hasScrolledEnough && elapsedTime >= MIN_SECONDS) {
      completedRef.current = true;
      clearInterval(timerRef.current);
      onAutoComplete?.();
    }
  }, [hasScrolledEnough, elapsedTime, onAutoComplete]);

  useEffect(() => {
    if (elapsedTime >= 120 && !completedRef.current) {
      completedRef.current = true;
      clearInterval(timerRef.current);
      onAutoComplete?.();
    }
  }, [elapsedTime, onAutoComplete]);

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight * 0.85) {
      setHasScrolledEnough(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {!completedRef.current && !hasScrolledEnough && (
        <div className="mb-2 px-1">
          <span className="text-xs text-corporate bg-corporate/10 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
            {t('ialab.viewer_modal.scroll_to_end')}
          </span>
        </div>
      )}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 bg-transparent rounded-2xl overflow-y-auto"
        style={{ minHeight: '300px' }}
      >
        {loadError ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Icon name="fa-file-pdf" className="text-petroleum/30 w-16 h-16 mb-4" />
            <p className="text-petroleum font-semibold mb-2">{t('ialab.viewer_modal.cannot_load')}</p>
            <p className="text-petroleum/60 text-sm mb-6">{t('ialab.viewer_modal.try_download')}</p>
            <a href={resource.url} download className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-lg hover:from-corporate-deep hover:to-corporate-darker transition-colors flex items-center gap-2 font-medium">
              <Icon name="fa-download" className="w-4 h-4" />
              {t('ialab.viewer_modal.download')}
            </a>
          </div>
        ) : (
          <iframe
            src={resource.url}
            title={resource.title}
            className="w-full rounded-lg border-0"
            style={{ minHeight: '2000px' }}
            allowFullScreen
            loading="lazy"
            onError={() => setLoadError(true)}
          />
        )}
      </div>
    </div>
  );
};


PDFThumbnailViewer.propTypes = {
  resource: PropTypes.object,
  onAutoComplete: PropTypes.func,
};

export default PDFThumbnailViewer;
