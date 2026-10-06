import { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getDocGuide } from "../../../data/ialabDocGuides";

/**
 * Lectura activa para documentos/PDF: resumen ejecutivo + 3 preguntas guía
 * antes de leer y una reflexión de transferencia después. Reduce carga
 * cognitiva y convierte la lectura pasiva en práctica guiada.
 */
export default function DocGuidePanel({ resourceId }) {
  const { t, locale } = useTranslation();
  const guide = getDocGuide(resourceId, locale);
  // En pantallas pequeñas la guía abierta dejaba ~300px de lectura al PDF:
  // arranca colapsada ahí y abierta en tablet/escritorio.
  const [open, setOpen] = useState(() => {
    try {
      return !window.matchMedia("(max-width: 639px)").matches;
    } catch {
      return true;
    }
  });

  if (!guide) return null;

  return (
    <div className="mb-3 rounded-xl border theme-border bg-[var(--theme-surface)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-bold theme-text">
          <Icon name="fa-lightbulb" className="text-[var(--theme-accent)]" />
          {t("ialab.doc_guide.before_title")}
        </span>
        <Icon
          name="fa-chevron-down"
          className={`text-xs theme-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 space-y-3">
          <p className="text-xs theme-text-muted leading-relaxed">
            <span className="font-semibold theme-text">
              {t("ialab.doc_guide.summary_label")}:{" "}
            </span>
            {guide.summary}
          </p>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide theme-text-muted mb-1.5">
              {t("ialab.doc_guide.questions_label")}
            </p>
            <ul className="space-y-1">
              {guide.before.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs theme-text leading-relaxed"
                >
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
          {guide.after && (
            <div className="rounded-lg bg-[var(--theme-primary)]/5 border border-[var(--theme-primary)]/15 p-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--theme-primary)] mb-1">
                {t("ialab.doc_guide.after_title")}
              </p>
              <p className="text-xs theme-text leading-relaxed">
                {guide.after}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DocGuidePanel.propTypes = {
  resourceId: PropTypes.string,
};
