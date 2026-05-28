import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const DocumentViewer = ({ resource, onAutoComplete }) => {
  const { t } = useTranslation();
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const completedRef = useRef(false);
  const MIN_SECONDS = 20;

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (completedRef.current) return;
    if (hasScrolledEnough && elapsedTime >= MIN_SECONDS) {
      completedRef.current = true;
      onAutoComplete?.();
    }
  }, [hasScrolledEnough, elapsedTime, onAutoComplete]);

  useEffect(() => {
    if (elapsedTime >= 90 && !completedRef.current) {
      completedRef.current = true;
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
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
            <Icon name="fa-file-pdf" className="text-petroleum w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            <div className="flex items-center gap-3 text-sm text-petroleum/70">
              <span>{resource.format}</span>
              {resource.size && <span>• {resource.size}</span>}
              {resource.pages && <span>• {t('ialab.viewer_modal.pages', { pages: resource.pages })}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!completedRef.current && !hasScrolledEnough && (
            <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-medium">{t('ialab.viewer_modal.scroll_to_end')}</span>
          )}
          <a
            href={resource.url}
            download
            className="px-4 py-2 bg-gradient-to-r from-petroleum to-corporate text-white rounded-lg hover:from-corporate-deep hover:to-corporate-darker transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Icon name="fa-download" className="w-4 h-4" />
            {t('ialab.viewer_modal.download')}
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        <iframe
          src={`${resource.url}#view=FitH`}
          title={resource.title}
          className="w-full border-0"
          style={{ minHeight: '2000px' }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default DocumentViewer;
