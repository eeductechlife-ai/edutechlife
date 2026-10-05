import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import ModalPortal from "../ui/ModalPortal";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";
import useEscapeKey from "../../hooks/useEscapeKey";
import useFocusTrap from "../../hooks/useFocusTrap";
import { getGlossary } from "../../data/ialabGlossary";

/**
 * Glosario puente: metáfora del curso ↔ término técnico real.
 * Buscable, accesible (role=dialog, focus trap, Esc).
 */
export default function GlossaryModal({ isOpen, onClose }) {
  const { t, locale } = useTranslation();
  const focusTrapRef = useFocusTrap(isOpen);
  useEscapeKey(isOpen, onClose);
  const [query, setQuery] = useState("");

  const terms = useMemo(() => getGlossary(locale), [locale]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        item.tech.toLowerCase().includes(q) ||
        item.def.toLowerCase().includes(q),
    );
  }, [terms, query]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-modal-title"
        className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700 max-h-[90dvh] flex flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b theme-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center flex-shrink-0">
                <Icon name="fa-book" className="text-white" />
              </div>
              <div className="min-w-0">
                <h2
                  id="glossary-modal-title"
                  className="text-base font-bold theme-text leading-tight"
                >
                  {t("ialab.glossary.title")}
                </h2>
                <p className="text-xs theme-text-muted">
                  {t("ialab.glossary.subtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("ialab.glossary.close")}
              className="w-9 h-9 rounded-lg flex items-center justify-center theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-700 flex-shrink-0"
            >
              <Icon name="fa-times" />
            </button>
          </div>

          <div className="px-5 py-3">
            <div className="relative">
              <Icon
                name="fa-search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs theme-text-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("ialab.glossary.search")}
                aria-label={t("ialab.glossary.search")}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border theme-border bg-white dark:bg-slate-900 theme-text text-sm focus:outline-none focus:border-[var(--theme-primary)]"
              />
            </div>
          </div>

          <div className="px-5 pb-5 overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="text-sm theme-text-muted text-center py-8">
                {t("ialab.glossary.empty")}
              </p>
            ) : (
              <ul className="space-y-2.5">
                {filtered.map((item, i) => (
                  <li
                    key={`${item.tech}-${i}`}
                    className="rounded-xl border theme-border p-3.5 theme-surface-2"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-sm font-bold theme-text">
                        {item.term}
                      </span>
                      <Icon
                        name="fa-arrow-right"
                        className="text-[9px] theme-text-muted"
                      />
                      <span className="text-sm font-semibold text-[var(--theme-primary)]">
                        {item.tech}
                      </span>
                    </div>
                    <p className="text-xs theme-text-muted leading-relaxed">
                      {item.def}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

GlossaryModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
