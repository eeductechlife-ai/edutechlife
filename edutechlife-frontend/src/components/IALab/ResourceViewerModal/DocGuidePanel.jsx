import { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getDocGuide } from "../../../data/ialabDocGuides";
import { scopedKey } from "../../../utils/userScopedStorage";
import { awardQuestionXp, QUESTION_XP } from "../quizQuestionXp";

// Una respuesta cuenta solo si tiene una reflexión real, no una palabra suelta.
const MIN_REFLECTION_CHARS = 20;
const REFLECTIONS_KEY = "ialab_doc_reflections";

const readReflections = () => {
  try {
    return JSON.parse(localStorage.getItem(scopedKey(REFLECTIONS_KEY)) || "{}");
  } catch {
    return {};
  }
};

const writeReflections = (value) => {
  try {
    localStorage.setItem(scopedKey(REFLECTIONS_KEY), JSON.stringify(value));
  } catch {
    /* borrador perdido si el almacenamiento falla; no bloquea la lectura */
  }
};

/**
 * Lectura activa para documentos/PDF: resumen ejecutivo, preguntas guía antes
 * de leer y una reflexión de transferencia después. Cada respuesta escrita
 * (mínimo 20 caracteres) suma XP una sola vez por pregunta y por cuenta.
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
  const [reflections, setReflections] = useState(() => readReflections());
  const [rewarded, setRewarded] = useState({});

  if (!guide) return null;

  const slotKey = (slot) => `${resourceId}:${slot}`;

  const updateReflection = (slot, text) => {
    setReflections((prev) => {
      const next = { ...prev, [slotKey(slot)]: text };
      writeReflections(next);
      return next;
    });
  };

  const commitReflection = (slot) => {
    const text = (reflections[slotKey(slot)] || "").trim();
    if (text.length < MIN_REFLECTION_CHARS) return;
    const granted = awardQuestionXp(`doc:${slotKey(slot)}`);
    if (granted > 0) setRewarded((prev) => ({ ...prev, [slot]: true }));
  };

  const alreadyRewarded = (slot) => {
    if (rewarded[slot]) return true;
    try {
      const awarded = JSON.parse(
        localStorage.getItem(scopedKey("ialab_question_xp_awarded")) || "{}",
      );
      return Boolean(awarded[`doc:${slotKey(slot)}`]);
    } catch {
      return false;
    }
  };

  const reflectionField = (slot, label) => {
    const value = reflections[slotKey(slot)] || "";
    const done = alreadyRewarded(slot);
    return (
      <div className="mt-1.5">
        <label className="sr-only" htmlFor={`reflect-${slotKey(slot)}`}>
          {label}
        </label>
        <textarea
          id={`reflect-${slotKey(slot)}`}
          rows={2}
          value={value}
          onChange={(e) => updateReflection(slot, e.target.value)}
          onBlur={() => commitReflection(slot)}
          placeholder={t("ialab.doc_guide.answer_placeholder")}
          className="w-full rounded-lg border theme-border bg-transparent px-2.5 py-1.5 text-xs theme-text leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/30"
        />
        <p className="mt-0.5 text-[11px] theme-text-muted">
          {done
            ? t("ialab.doc_guide.answer_saved", { xp: QUESTION_XP })
            : t("ialab.doc_guide.answer_hint", { min: MIN_REFLECTION_CHARS })}
        </p>
      </div>
    );
  };

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
            <ol className="space-y-2">
              {guide.before.map((q, i) => (
                <li key={i} className="text-xs theme-text leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{q}</span>
                  </div>
                  {reflectionField(`before-${i}`, q)}
                </li>
              ))}
            </ol>
          </div>
          {guide.after && (
            <div className="rounded-lg bg-[var(--theme-primary)]/5 border border-[var(--theme-primary)]/15 p-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--theme-primary)] mb-1">
                {t("ialab.doc_guide.after_title")}
              </p>
              <p className="text-xs theme-text leading-relaxed">
                {guide.after}
              </p>
              {reflectionField("after", guide.after)}
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
