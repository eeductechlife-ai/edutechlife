import PropTypes from "prop-types";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Icon } from "../../utils/iconMapping.jsx";
import useCompetencyHistory from "../../hooks/IALab/useCompetencyHistory";
import useEvaluationHistory from "../../hooks/IALab/useEvaluationHistory";

const AXIS_KEYS = [
  "ialab.evaluation.results.axis_identify",
  "ialab.evaluation.results.axis_apply",
  "ialab.evaluation.results.axis_create",
  "ialab.evaluation.results.axis_synthesize",
];

/**
 * Evolución de la competencia (Fase C). Aditivo: lee el historial local y
 * dibuja una línea, más el promedio real por eje cuando existe.
 */
function CompetencyTrend({ t }) {
  const { trend } = useCompetencyHistory();
  const { averages, samples } = useEvaluationHistory();

  const hasTrend = trend && trend.length >= 2;
  const hasAxes = Array.isArray(samples) && samples.some((s) => s > 0);
  if (!hasTrend && !hasAxes) return null;

  return (
    <section
      data-testid="competency-trend"
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 space-y-2"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg theme-chip flex items-center justify-center">
          <Icon name="fa-chart-line" className="text-xs text-[var(--theme-emphasis)]" />
        </div>
        <h3 className="text-sm font-bold text-[var(--theme-emphasis)]">
          {t("ialab.competency.trend_title")}
        </h3>
      </div>

      {hasTrend && (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip formatter={(value) => [`${value}%`, ""]} labelStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="average"
                stroke="var(--theme-primary)"
                strokeWidth={2}
                dot={{ r: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasAxes && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] uppercase tracking-wider theme-text-muted">
            {t("ialab.competency.by_axis")}
          </p>
          {AXIS_KEYS.map((key, i) =>
            averages[i] === null || averages[i] === undefined ? null : (
              <div key={key} className="flex items-center gap-2 text-[11px]">
                <span className="w-24 truncate theme-text-muted">{t(key)}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--theme-primary)]"
                    style={{ width: `${averages[i]}%` }}
                  />
                </div>
                <span className="w-8 text-right font-semibold">{averages[i]}%</span>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}

CompetencyTrend.propTypes = {
  t: PropTypes.func.isRequired,
};

export default CompetencyTrend;
