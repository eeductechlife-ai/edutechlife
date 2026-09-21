import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuthIdentity } from "../../hooks/useAuthIdentity";
import { supabase } from "../../lib/supabase";
import { Icon } from "../../utils/iconMapping.jsx";
import IALabEvaluationResults from "./IALabEvaluationResults";
import { useTranslation } from "../../i18n/I18nProvider";
import { MODULE_CONFIG } from "../../hooks/IALab/useIALabEvaluation/moduleConfig";

const ChallengeResultViewer = ({ moduleId, onClose, onRetry }) => {
  const { t } = useTranslation();
  // Identidad desde la sesión de Supabase (antes Clerk, que ya no autentica).
  const { userId } = useAuthIdentity();
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  // Un desafío solo tiene tantos ejercicios como pasos tenga el módulo (3 o 4).
  // Antes se armaba siempre con nota_ej1..nota_ej4, así que en un desafío de 3
  // pasos el resultado mostraba un "ejercicio 4" en 0%.
  const totalSteps = Math.min(
    Math.max(MODULE_CONFIG[moduleId]?.totalSteps || 3, 1),
    4,
  );

  const buildEvaluation = (lessons, { score, emptyText }) => {
    const base = { notaGlobal: score ?? 0 };
    for (let i = 1; i <= totalSteps; i++) {
      base[`nota_ej${i}`] =
        lessons && typeof lessons[`nota_ej${i}`] === "number"
          ? lessons[`nota_ej${i}`]
          : 0;
      base[`feedback_ej${i}`] =
        (lessons && lessons[`feedback_ej${i}`]) || emptyText;
    }
    return base;
  };

  useEffect(() => {
    if (!userId || !moduleId) return;

    const loadEvaluation = async () => {
      try {
        const { data, error } = await supabase
          .from("user_progress")
          .select("completed_lessons, score")
          .eq("user_id", userId)
          .eq("module_id", moduleId)
          .eq("activity_type", "challenge")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setEvaluation(
            buildEvaluation(data.completed_lessons || {}, {
              score: data.score,
              emptyText: t("ialab.challenge_result.no_feedback"),
            }),
          );
        } else {
          setEvaluation(
            buildEvaluation(null, {
              score: 0,
              emptyText: t("ialab.challenge_result.no_feedback_stored"),
            }),
          );
        }
      } catch (err) {
        if (import.meta.env.DEV)
          console.error("[CHALLENGE_RESULT] Error loading:", err);
        setEvaluation(
          buildEvaluation(null, {
            score: 0,
            emptyText: t("ialab.challenge_result.error_feedback"),
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [userId, moduleId]);

  if (loading) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("ialab.challenge_result.loading")}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-[var(--theme-emphasis)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-500">
            {t("ialab.challenge_result.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (evaluation) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("ialab.challenge_result.title", { module: moduleId })}
        className="fixed inset-0 z-[1000] flex items-start justify-center pt-10 pb-10 bg-black/40 backdrop-blur-sm overflow-y-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90dvh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200 mx-4">
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200/60 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="fa-trophy" className="text-emerald-500 text-lg" />
              <h3 className="text-sm font-bold text-slate-800 font-montserrat">
                {t("ialab.challenge_result.title", { module: moduleId })}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200"
            >
              <Icon name="fa-times" className="text-slate-500 text-sm" />
            </button>
          </div>
          <IALabEvaluationResults
            evaluation={evaluation}
            onClose={onClose}
            onRetry={onRetry}
          />
        </div>
      </div>
    );
  }

  return null;
};

ChallengeResultViewer.propTypes = {
  moduleId: PropTypes.number,
  onClose: PropTypes.func,
  onRetry: PropTypes.func,
};

export default ChallengeResultViewer;
