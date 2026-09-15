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

/**
 * Evolución de la competencia (Fase C). Aditivo: lee el historial local y
 * dibuja una línea. Si aún no hay suficientes puntos, no renderiza nada.
 */
function CompetencyTrend({ t }) {
  const { trend } = useCompetencyHistory();

  if (!trend || trend.length < 2) return null;

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
    </section>
  );
}

CompetencyTrend.propTypes = {
  t: PropTypes.func.isRequired,
};

export default CompetencyTrend;
