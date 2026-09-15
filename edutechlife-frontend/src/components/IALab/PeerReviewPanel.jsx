import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import { Icon } from "../../utils/iconMapping.jsx";
import usePeerReview from "../../hooks/IALab/usePeerReview";
import { DEFAULT_PEER_RUBRIC } from "../../utils/peerRubric";

/**
 * Peer Review (Fase B). Componente apagado por defecto mediante feature flag:
 * si PEER_REVIEW está deshabilitado, devuelve null y no altera la pantalla.
 */
function PeerReviewPanel({ userId, moduleId }) {
  const { t } = useTranslation();
  const { enabled, assignments, loading, submitReview } = usePeerReview({
    userId,
    moduleId,
  });
  const [activeId, setActiveId] = useState(null);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState(null);

  if (!enabled) return null;

  const reset = () => {
    setActiveId(null);
    setScores({});
    setFeedback("");
    setStatus(null);
  };

  const handleSubmit = async () => {
    setStatus("sending");
    const result = await submitReview(activeId, scores, feedback);
    if (result.success) {
      setStatus("done");
      reset();
    } else {
      setStatus(result.error === "incomplete" ? "incomplete" : "error");
    }
  };

  return (
    <section
      data-testid="peer-review-panel"
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg theme-chip flex items-center justify-center">
          <Icon name="fa-users" className="text-xs text-[var(--theme-emphasis)]" />
        </div>
        <h3 className="text-sm font-bold text-[var(--theme-emphasis)]">
          {t("peer_review.title")}
        </h3>
      </div>

      {status === "done" && (
        <p className="text-xs text-emerald-600">{t("peer_review.submitted")}</p>
      )}
      {status === "incomplete" && (
        <p className="text-xs text-amber-600">{t("peer_review.missing_error")}</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-600">{t("peer_review.error")}</p>
      )}

      {loading ? (
        <p className="text-xs theme-text-muted">{t("common.loading")}</p>
      ) : assignments.length === 0 ? (
        <p className="text-xs theme-text-muted">{t("peer_review.empty")}</p>
      ) : (
        <ul className="space-y-2">
          {assignments.map((a) => (
            <li key={a.id} className="border border-slate-100 rounded-lg p-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-700">
                  {t("peer_review.assignment", { module: a.module_id })}
                </span>
                {activeId === a.id ? (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-[11px] text-slate-500 hover:underline"
                  >
                    {t("common.cancel")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveId(a.id)}
                    className="text-[11px] font-semibold text-[var(--theme-primary)] hover:underline"
                  >
                    {t("peer_review.review")}
                  </button>
                )}
              </div>

              {activeId === a.id && (
                <div className="mt-3 space-y-3">
                  {DEFAULT_PEER_RUBRIC.map((c) => (
                    <div key={c.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-slate-600" htmlFor={`pr-${a.id}-${c.id}`}>
                          {c.label}
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {scores[c.id] ?? 0}/{c.max}
                        </span>
                      </div>
                      <input
                        id={`pr-${a.id}-${c.id}`}
                        type="range"
                        min={0}
                        max={c.max}
                        step={1}
                        value={scores[c.id] ?? 0}
                        onChange={(e) =>
                          setScores((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))
                        }
                        className="w-full"
                      />
                    </div>
                  ))}
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t("peer_review.feedback_placeholder")}
                    rows={3}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30"
                  />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "sending"}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--theme-emphasis)] text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {status === "sending" ? t("peer_review.submitting") : t("peer_review.submit")}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

PeerReviewPanel.propTypes = {
  userId: PropTypes.string,
  moduleId: PropTypes.number,
};

export default PeerReviewPanel;
