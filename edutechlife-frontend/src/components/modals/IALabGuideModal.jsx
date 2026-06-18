import React, { useState, useEffect, useCallback, useRef } from 'react';
import { marked } from 'marked';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

const IALabGuideModal = ({ isOpen, onClose }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef(null);
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const file = locale === 'en' ? '/docs/guia-ialab.md' : '/docs/guia-ialab.md';
    fetch(file)
      .then(r => {
        if (!r.ok) {
          return fetch('/docs/guia-ialab.md');
        }
        return r;
      })
      .then(r => r.text())
      .then(md => {
        setHtml(marked.parse(md, { breaks: true, gfm: true }));
        setLoading(false);
      })
      .catch(() => {
        setHtml('<p class="text-red-500 text-sm">Error al cargar la guía. Intenta de nuevo más tarde.</p>');
        setLoading(false);
      });
  }, [isOpen, locale]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollEl = document.getElementById('ialab-guide-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
  }, [isOpen]);

  const handleDownloadPdf = useCallback(async () => {
    if (downloading || !contentRef.current) return;
    setDownloading(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `IALab-Guia-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[90vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="border-b border-slate-200/60 bg-gradient-to-r from-petroleum/10 to-corporate/10 pt-8 pb-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                <Icon name="fa-book" className="text-petroleum text-sm" />
              </div>
              <h3 className="text-slate-800 font-bold text-base">{t('modals.settings.guide_title')}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading || loading}
                className="p-2 text-slate-400 hover:bg-white/50 hover:text-petroleum rounded-full transition-all disabled:opacity-40"
                aria-label={t('modals.settings.guide_download')}
              >
                <Icon name={downloading ? 'fa-spinner' : 'fa-download'} className={`text-base ${downloading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-white/50 hover:text-slate-800 rounded-full transition-all"
                aria-label={t('modals.settings.close')}
              >
                <Icon name="fa-times" className="text-lg" />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 ml-12">{t('modals.settings.guide_desc')}</p>
        </div>

        {/* Content */}
        <div
          id="ialab-guide-scroll"
          ref={contentRef}
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 100px)' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin" />
              <p className="text-xs text-slate-400">{t('modals.settings.guide_loading')}</p>
            </div>
          ) : (
            <div
              className="ialab-guide-content prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>

      {/* Estilos para el contenido markdown */}
      <style>{`
        .ialab-guide-content h1 { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
        .ialab-guide-content h2 { font-size: 1.05rem; font-weight: 700; color: #004B63; margin: 1.5rem 0 0.5rem; }
        .ialab-guide-content h3 { font-size: 0.95rem; font-weight: 600; color: #334155; margin: 1.25rem 0 0.25rem; }
        .ialab-guide-content p { font-size: 0.8125rem; line-height: 1.65; color: #475569; margin: 0 0 0.75rem; }
        .ialab-guide-content ul, .ialab-guide-content ol { margin: 0.5rem 0 0.75rem; padding-left: 1.25rem; }
        .ialab-guide-content li { font-size: 0.8125rem; line-height: 1.65; color: #475569; margin-bottom: 0.25rem; }
        .ialab-guide-content strong { font-weight: 700; color: #1e293b; }
        .ialab-guide-content table { width: 100%; border-collapse: collapse; margin: 0.75rem 0 1rem; font-size: 0.75rem; }
        .ialab-guide-content th { background: #f1f5f9; color: #1e293b; font-weight: 700; text-align: left; padding: 0.5rem 0.625rem; border: 1px solid #e2e8f0; }
        .ialab-guide-content td { padding: 0.4rem 0.625rem; border: 1px solid #e2e8f0; color: #475569; }
        .ialab-guide-content tr:nth-child(even) { background: #f8fafc; }
        .ialab-guide-content hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; }
        .ialab-guide-content a { color: #004B63; text-decoration: underline; }
        .ialab-guide-content code { background: #f1f5f9; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.75rem; color: #1e293b; }
        .ialab-guide-content blockquote { border-left: 3px solid #004B63; padding-left: 0.75rem; margin: 0.75rem 0; color: #64748b; font-style: italic; }
      `}</style>
    </div>
  );
};

export default IALabGuideModal;
