import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const PDFThumbnailViewer = ({ resource, onAutoComplete }) => {
  const { t } = useTranslation();
  const openFullScreen = () => window.open(resource.url, '_blank');
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
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
          <Icon name="fa-expand" className="w-3.5 h-3.5" />
          {t('ialab.viewer_modal.open_fullscreen')}
          <Icon name="fa-arrow-up-right-from-square" className="w-3 h-3" />
        </button>
        {!completedRef.current && !hasScrolledEnough && (
          <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-medium flex-shrink-0">
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
        <iframe
          src={resource.url}
          title={resource.title}
          className="w-full rounded-lg border-0"
          style={{ minHeight: '2000px' }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default PDFThumbnailViewer;
