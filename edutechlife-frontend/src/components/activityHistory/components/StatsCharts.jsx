import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useTranslation } from "../../../i18n/I18nProvider";

export const StudyTimeChart = ({
  monthlyData,
  timeRange,
  studyHours,
  studyMins,
  t,
}) => (
  <div className="border-t border-slate-100 pt-4 mt-1">
    <div className="flex items-center justify-between mb-3">
      <div className="flex gap-1">
        {["7d", "30d", "all"].map((r) => (
          <button
            key={r}
            onClick={() => {}}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all duration-200 ${
              timeRange === r
                ? "bg-petroleum text-white shadow-sm"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {r === "7d"
              ? t("activity.stats.range_7d")
              : r === "30d"
                ? t("activity.stats.range_30d")
                : t("activity.stats.range_all")}
          </button>
        ))}
      </div>
      <span className="text-[9px] text-slate-400">
        {t("activity.hours_minutes", { hours: studyHours, minutes: studyMins })}{" "}
        {t("activity.stats.total_label").toLowerCase()}
      </span>
    </div>
    <div
      className="h-32 sm:h-40"
      role="img"
      aria-label={t("activity.stats.activity_aria", {
        days: monthlyData.filter((d) => d.mins > 0).length,
        total: t("activity.hours_minutes", {
          hours: studyHours,
          minutes: studyMins,
        }),
      })}
    >
      {monthlyData.length > 0 && monthlyData.some((d) => d.mins > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 8, fill: "#94A3B8" }}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={[0, "dataMax"]} />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [
                t("activity.minute_label", { min: value }),
                t("activity.stats.weekly_chart_label"),
              ]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="mins" radius={[3, 3, 0, 0]} maxBarSize={32}>
              {monthlyData.map((entry, idx) => (
                <Cell key={idx} fill={entry.mins > 0 ? "#004B63" : "#F1F5F9"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-xs text-slate-400">
            {t("activity.stats.no_time_data")}
          </p>
        </div>
      )}
    </div>
  </div>
);

export const ActivityDistributionChart = ({ activityDistribution, t }) => {
  if (activityDistribution.length <= 1) return null;
  return (
    <div className="mb-5">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        {t("activity.stats.by_type")}
      </h4>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div
          className="w-36 h-36 flex-shrink-0"
          role="img"
          aria-label={`${t("activity.stats.by_type")}: ${activityDistribution.map((a) => `${a.name} ${a.pct}%`).join(", ")}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={52}
                paddingAngle={2}
                dataKey="value"
              >
                {activityDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                }}
                formatter={(value, name, props) => [
                  `${value} (${props.payload.pct}%)`,
                  props.payload.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2 w-full">
          {activityDistribution.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-700 truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.pct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500">
                    {item.pct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
