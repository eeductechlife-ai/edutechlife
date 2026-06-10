import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types';;
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const PDFThumbnailViewer = ({ resource, onAutoComplete }) => {
  const { t } = useTranslation();
  const openFullScreen = () => window.open(resource.url, '_blank');
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
      <div className="flex justify-between items-center mb-2 px-1 gap-3">
        <button
          onClick={openFullScreen}
          className="text-sm font-medium text-petroleum bg-petroleum/10 hover:bg-petroleum/12 py-1.5 px-3 rounded-md transition-colors flex items-center gap-2"
        >
          <Icon name="fa-external-link-alt" className="w-3.5 h-3.5" />
          {t('ialab.viewer_modal.open_new_tab')}
          <Icon name="fa-arrow-up-right-from-square" className="w-3 h-3" />
        </button>
        {!completedRef.current && !hasScrolledEnough && (
          <span className="text-xs text-corporate bg-corporate/10 px-3 py-1 rounded-full font-medium flex-shrink-0">
            {t('ialab.viewer_modal.scroll_to_end')}
          </span>
        )}
      </div>
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
            <div className="flex gap-3">
              <a href={resource.url} download className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-lg hover:from-corporate-deep hover:to-corporate-darker transition-colors flex items-center gap-2 font-medium">
                <Icon name="fa-download" className="w-4 h-4" />
                {t('ialab.viewer_modal.download')}
              </a>
              <button onClick={() => window.open(resource.url, '_blank')} className="px-6 py-3 border-2 border-petroleum/20 text-petroleum rounded-lg hover:bg-petroleum/5 transition-colors flex items-center gap-2 font-medium">
                <Icon name="fa-external-link-alt" className="w-4 h-4" />
                {t('ialab.viewer_modal.open_new_tab')}
              </button>
            </div>
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
