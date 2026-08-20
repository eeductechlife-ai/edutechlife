import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";

const DocumentViewer = ({ resource, onAutoComplete }) => {
  const { t } = useTranslation();
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const completedRef = useRef(false);
  const MIN_SECONDS = 20;

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] shadow-sm flex items-center justify-center shrink-0">
            <Icon name="fa-file-pdf" className="text-white w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-[var(--theme-emphasis)] truncate">
              {resource.title}
            </h4>
            <div className="flex items-center gap-3 text-sm text-[var(--theme-emphasis)]/70">
              <span>{resource.format}</span>
              {resource.size && <span>• {resource.size}</span>}
              {resource.pages && (
                <span>
                  • {t("ialab.viewer_modal.pages", { pages: resource.pages })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!completedRef.current && !hasScrolledEnough && (
            <span className="text-xs text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 px-3 py-1 rounded-full font-medium">
              {t("ialab.viewer_modal.scroll_to_end")}
            </span>
          )}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <a
              href={resource.url}
              download
              className="px-4 py-2 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white rounded-lg hover:from-[var(--theme-primary)]-deep hover:to-[var(--theme-primary)]-darker transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <Icon name="fa-download" className="w-4 h-4" />
              {t("ialab.viewer_modal.download")}
            </a>
          </motion.div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {loadError ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Icon
              name="fa-file-pdf"
              className="text-[var(--theme-emphasis)]/30 w-16 h-16 mb-4"
            />
            <p className="text-[var(--theme-emphasis)] font-semibold mb-2">
              {t("ialab.viewer_modal.cannot_load")}
            </p>
            <p className="text-[var(--theme-emphasis)]/60 text-sm mb-6">
              {t("ialab.viewer_modal.try_download")}
            </p>
            <a
              href={resource.url}
              download
              className="px-6 py-3 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white rounded-lg hover:from-[var(--theme-primary)]-deep hover:to-[var(--theme-primary)]-darker transition-colors flex items-center gap-2 font-medium"
            >
              <Icon name="fa-download" className="w-4 h-4" />
              {t("ialab.viewer_modal.download")}
            </a>
          </div>
        ) : (
          <iframe
            src={`${resource.url}#view=FitH`}
            title={resource.title}
            className="w-full border-0"
            style={{ minHeight: "2000px" }}
            loading="lazy"
            onError={() => setLoadError(true)}
          />
        )}
      </div>
    </div>
  );
};

DocumentViewer.propTypes = {
  resource: PropTypes.object,
  onAutoComplete: PropTypes.func,
};

export default DocumentViewer;
