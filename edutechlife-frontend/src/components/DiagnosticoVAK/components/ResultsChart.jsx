import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function ResultsChart({ radarData, t, chartRef }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <h3 className="text-lg font-bold text-[#004B63] mb-4">
        {t("vak.ui.vak_profile")}
      </h3>
      <div
        className="w-full aspect-square max-w-[300px] mx-auto"
        ref={chartRef}
        role="img"
        aria-label={`${t("vak.ui.vak_profile")}: ${radarData
          .map((d) => `${d.subject} ${d.A}/${d.fullMark}`)
          .join(", ")}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "#94A3B8", fontSize: 10 }}
            />
            <Radar
              name={t("vak.ui.scores")}
              dataKey="A"
              stroke="#4DA8C4"
              fill="#4DA8C4"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
