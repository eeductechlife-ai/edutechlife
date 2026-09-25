import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gradeColor, gradeEmoji, getAvgScore } from "./gradeUtils";
import { getSubjectEmoji } from "../../config/subjectMappings";

const GradeAnalysisPlan = memo(
  ({ plan, grades, setPlan, SUBJECTS, onTabChange, setDocumentForDani, t }) => (
    <AnimatePresence>
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Dani message card */}
          <div
            className="p-4 rounded-2xl text-white space-y-3"
            style={{
              background:
                "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="font-bold">{t("kid.grades.dani_says")}</span>
              </div>
              <button
                onClick={() => setPlan(null)}
                className="text-white/60 hover:text-white text-xs underline"
              >
                Nuevo análisis
              </button>
            </div>
            <p className="text-sm leading-relaxed">{plan.overall}</p>
            {plan.motivation && (
              <p className="text-sm font-bold text-[#FFD166]">
                💫 {plan.motivation}
              </p>
            )}
          </div>

          {/* Strengths */}
          {plan.strengths?.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="font-bold text-emerald-700 mb-2">
                {t("kid.grades.strengths")}
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.strengths.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Top actions */}
          {plan.topActions?.length > 0 && (
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
              <p className="font-bold text-orange-700 mb-2">
                ⚡ Lo que debes hacer YA
              </p>
              <div className="space-y-1.5">
                {plan.topActions.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-orange-800"
                  >
                    <span className="font-black text-orange-500 mt-0.5">
                      {i + 1}.
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* The weekly plan now lives in "Mi Plan", where it can be ticked off. */}
          {plan.studyPlan?.length > 0 && (
            <motion.button
              type="button"
              onClick={() => onTabChange?.("plan")}
              whileTap={{ scale: 0.98 }}
              className="w-full !flex items-center !justify-start gap-3 p-4 rounded-2xl text-left text-white shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
              }}
            >
              <span className="text-3xl" aria-hidden="true">
                📋
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-black text-base leading-tight">
                  Tu plan de {plan.studyPlan.length} semanas está listo
                </span>
                <span className="block text-xs text-white/90 mt-0.5">
                  Ábrelo y marca cada actividad que hagas ✅
                </span>
              </span>
              <span className="text-xl font-black" aria-hidden="true">
                →
              </span>
            </motion.button>
          )}

          {/* Why each subject is weak and how to improve it (collapsible) */}
          {plan.weaknesses?.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer flex items-center justify-between p-4 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] font-bold text-[#1E293B] text-sm select-none">
                <span>🔎 Cómo mejorar cada materia</span>
                <span className="text-[#64748B] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-2 space-y-3">
                {plan.weaknesses?.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-bold text-[#1E293B] px-1">
                      {t("kid.grades.to_improve")}
                    </p>
                    {plan.weaknesses.map((w, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-white border-2 border-orange-200 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#1E293B] flex items-center gap-1.5">
                            <span>{w.emoji || getSubjectEmoji(w.subject)}</span>
                            {w.subject}
                          </span>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: gradeColor(w.score) }}
                          >
                            {w.score}/5
                          </span>
                        </div>
                        <p className="text-sm text-[#374151]">{w.why}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                            <p className="text-xs font-bold text-purple-600 mb-1">
                              👁️ VAK
                            </p>
                            <p className="text-xs text-purple-700">
                              {w.vakTip}
                            </p>
                          </div>
                          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                            <p className="text-xs font-bold text-cyan-600 mb-1">
                              🔬 STEAM
                            </p>
                            <p className="text-xs text-cyan-700">
                              {w.steamLink}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {w.actions?.map((a, j) => (
                            <div
                              key={j}
                              className="flex items-start gap-2 text-xs text-[#374151]"
                            >
                              <span className="text-orange-400 mt-0.5">→</span>
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-xs text-[#64748B]">
            <span>👨‍👩‍👧</span>
            <span>
              El informe completo para tus padres está disponible en su panel de
              seguimiento.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <motion.button
              onClick={() => {
                setDocumentForDani?.({
                  title: t("kid.grades.doc_title"),
                  subject: t("kid.grades.doc_subject"),
                  summary:
                    `${plan.overall || ""} ${plan.motivation || ""}`.trim(),
                  strengths: plan.strengths || [],
                  improvements: (plan.weaknesses || []).map(
                    (w) => `${w.subject}: ${w.why || ""}`,
                  ),
                  score: Math.round(
                    (grades.reduce((s, g) => s + getAvgScore(g), 0) /
                      Math.max(grades.length, 1)) *
                      20,
                  ),
                  difficulty: "personalizado",
                  tutoringQuestions: (plan.weaknesses || [])
                    .slice(0, 4)
                    .map(
                      (w) =>
                        `¿Cómo te está yendo en ${w.subject}? ¿Qué te parece más difícil?`,
                    ),
                });
                window.dispatchEvent(new CustomEvent("smartboard:open-dani"));
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
              }}
            >
              {t("kid.grades.talk_about_plan")}
            </motion.button>
            <motion.button
              onClick={() => onTabChange?.("flashcards")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm shadow-md"
              style={{
                background: "linear-gradient(135deg, #EF476F 0%, #FF6B9D 100%)",
              }}
            >
              {t("kid.grades.go_flashcards")}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ),
);

GradeAnalysisPlan.displayName = "GradeAnalysisPlan";
export default GradeAnalysisPlan;
