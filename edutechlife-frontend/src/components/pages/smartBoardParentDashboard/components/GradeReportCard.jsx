import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseClient } from "../../../../lib/supabase";
import { getSubjectEmoji } from "../../../../config/subjectMappings";

const gradeColor = (n) => {
  if (n >= 4.5) return "#22C55E";
  if (n >= 3.5) return "#EAB308";
  if (n >= 3.0) return "#F97316";
  return "#EF4444";
};

const gradeEmoji = (n) => {
  if (n >= 4.5) return "🌟";
  if (n >= 3.5) return "✅";
  if (n >= 3.0) return "⚠️";
  return "🔴";
};

export default function GradeReportCard({ authToken, studentId }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!authToken || !studentId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const sb = createSupabaseClient(authToken);
        const { data } = await sb
          .from("grade_analyses")
          .select("id, grades, avg_score, plan, created_at")
          .eq("student_user_id", studentId)
          .order("created_at", { ascending: false })
          .limit(5);
        if (data?.length) setAnalyses(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authToken, studentId]);

  if (loading)
    return (
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] animate-pulse h-32" />
    );

  if (!analyses.length)
    return (
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] text-center text-sm text-[#64748B]">
        <p className="text-2xl mb-2">📊</p>
        <p>
          Aún no hay análisis de notas. El estudiante debe escanear su boletín
          en SmartBoard.
        </p>
      </div>
    );

  const analysis = analyses[selected];
  const report = analysis?.plan?.parentReport;
  const grades = analysis?.grades || [];
  const plan = analysis?.plan || {};

  return (
    <div className="space-y-4">
      {/* Selector de análisis si hay varios */}
      {analyses.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {analyses.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selected === i
                  ? "bg-[#004B63] text-white"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
              }`}
            >
              {new Date(a.created_at).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "short",
              })}
              {i === 0 && " (último)"}
            </button>
          ))}
        </div>
      )}

      {/* Resumen de notas */}
      <div className="bg-gradient-to-br from-[#004B63] to-[#0077B6] rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-black text-lg">Boletín escolar</h4>
            <p className="text-white/60 text-xs">
              {new Date(analysis.created_at).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black">{analysis.avg_score}/5</p>
            <p className="text-white/60 text-xs">Promedio</p>
          </div>
        </div>

        {/* Grid de todas las notas */}
        {grades.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
            {grades.map((g, i) => (
              <div
                key={i}
                title={`${g.subject}: ${g.score}/5`}
                className="flex flex-col items-center gap-0.5 px-1.5 py-2 rounded-lg text-xs font-bold text-center bg-white/10"
              >
                <span className="text-base">{getSubjectEmoji(g.subject)}</span>
                <span
                  style={{
                    color:
                      gradeColor(g.score) === "#22C55E" ? "#86efac" : "#fcd34d",
                  }}
                >
                  {g.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informe de Dani para los padres */}
      {report ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9]">
          {/* Resumen académico */}
          {report.summary && (
            <div className="p-5">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">
                📋 Resumen académico
              </p>
              <p className="text-sm text-[#374151] leading-relaxed">
                {report.summary}
              </p>
            </div>
          )}

          {/* Áreas de atención */}
          {report.concerns?.length > 0 && (
            <div className="p-5">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2">
                ⚠️ Áreas de atención
              </p>
              <ul className="space-y-1.5">
                {report.concerns.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-[#374151] flex items-start gap-2"
                  >
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendaciones para el hogar */}
          {report.recommendations?.length > 0 && (
            <div className="p-5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">
                ✅ Recomendaciones para el hogar
              </p>
              <ul className="space-y-1.5">
                {report.recommendations.map((r, i) => (
                  <li
                    key={i}
                    className="text-sm text-[#374151] flex items-start gap-2"
                  >
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Seguimiento */}
          {report.followUp && (
            <div className="p-5">
              <div className="p-3 rounded-xl bg-[#004B63]/5 border border-[#004B63]/10">
                <p className="text-xs font-bold text-[#004B63] mb-1">
                  📅 Seguimiento sugerido
                </p>
                <p className="text-sm text-[#374151]">{report.followUp}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Si no hay parentReport (análisis anterior al feature), mostrar lo que hay */
        plan.weaknesses?.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
              Materias que necesitan atención
            </p>
            {plan.weaknesses.map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-[#F1F5F9] last:border-0"
              >
                <span className="text-xl">
                  {w.emoji || getSubjectEmoji(w.subject)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#004B63] truncate">
                    {w.subject}
                  </p>
                  {w.why && (
                    <p className="text-xs text-[#64748B] line-clamp-1">
                      {w.why}
                    </p>
                  )}
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: gradeColor(w.score) }}
                >
                  {w.score}/5
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Plan de estudio resumido */}
      {plan.studyPlan?.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-[#004B63] text-sm select-none">
            <span>📅 Plan de estudio ({plan.studyPlan.length} semanas)</span>
            <span className="text-[#64748B] group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>
          <div className="mt-2 space-y-2">
            {plan.studyPlan.map((week, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-[#E2E8F0]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#4DA8C4] text-white text-xs font-black flex items-center justify-center">
                    {week.week}
                  </span>
                  <span className="font-semibold text-[#004B63] text-sm">
                    Semana {week.week}: {week.focus}
                  </span>
                </div>
                <ul className="space-y-1">
                  {week.activities?.map((a, j) => (
                    <li
                      key={j}
                      className="text-xs text-[#374151] flex items-start gap-1.5"
                    >
                      <span className="text-[#4DA8C4]">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
                {week.daniTip && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-[#4DA8C4] bg-[#4DA8C4]/10 rounded-lg p-2">
                    <span>🤖</span>
                    <span>{week.daniTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
