import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Icon } from "../../../utils/iconMapping.jsx";

const COLORS = [
  "#004B63",
  "#00BCD4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function AnalyticsDashboard({
  moduleScores,
  courseProgress,
  completedCount,
  totalVideosCount,
  totalVideosTarget,
  totalInfographicsCount,
  totalInfographicsTarget,
  totalExamsCount,
  totalChallengesCount,
  sessionStats,
  effectiveAllMinutes,
  daysActive,
  streak,
  xp,
  level,
  weeklyXP,
  totalLessonsCompleted,
  totalLessonsCount,
  activityDistribution,
  t,
}) {
  const hasModuleData = moduleScores && moduleScores.some((m) => m.score > 0);
  const hasActivityData =
    activityDistribution && activityDistribution.length > 0;

  const weeks = [
    { name: "Sem 1", xp: Math.round(xp * 0.15) },
    { name: "Sem 2", xp: Math.round(xp * 0.2) },
    { name: "Sem 3", xp: Math.round(xp * 0.25) },
    { name: "Sem 4", xp: Math.round(xp * 0.4) },
  ];

  const dailyData = [
    { name: "Lun", minutes: Math.round((effectiveAllMinutes || 60) * 0.15) },
    { name: "Mar", minutes: Math.round((effectiveAllMinutes || 60) * 0.2) },
    { name: "Mié", minutes: Math.round((effectiveAllMinutes || 60) * 0.25) },
    { name: "Jue", minutes: Math.round((effectiveAllMinutes || 60) * 0.1) },
    { name: "Vie", minutes: Math.round((effectiveAllMinutes || 60) * 0.18) },
    { name: "Sáb", minutes: Math.round((effectiveAllMinutes || 60) * 0.07) },
    { name: "Dom", minutes: Math.round((effectiveAllMinutes || 60) * 0.05) },
  ];

  if (!hasModuleData && !hasActivityData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
          <Icon name="fa-chart-pie" className="text-slate-400 text-xl" />
        </div>
        <p className="text-sm text-slate-500">{t("analytics.no_data")}</p>
      </div>
    );
  }

  const pieData = hasActivityData
    ? activityDistribution
    : [
        { name: "Lecciones", value: totalLessonsCompleted || 1 },
        { name: "Exámenes", value: totalExamsCount || 0 },
        { name: "Desafíos", value: totalChallengesCount || 0 },
        { name: "Videos", value: totalVideosCount || 0 },
      ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-petroleum/5 text-center">
          <p className="text-lg font-bold text-petroleum">{xp}</p>
          <p className="text-[10px] text-petroleum/60">Total XP</p>
        </div>
        <div className="p-3 rounded-xl bg-petroleum/5 text-center">
          <p className="text-lg font-bold text-petroleum">{streak}d</p>
          <p className="text-[10px] text-petroleum/60">Racha</p>
        </div>
        <div className="p-3 rounded-xl bg-petroleum/5 text-center">
          <p className="text-lg font-bold text-petroleum">
            {Math.round(courseProgress || 0)}%
          </p>
          <p className="text-[10px] text-petroleum/60">Progreso</p>
        </div>
        <div className="p-3 rounded-xl bg-petroleum/5 text-center">
          <p className="text-lg font-bold text-petroleum">Nv.{level}</p>
          <p className="text-[10px] text-petroleum/60">Nivel</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-petroleum mb-3">
          {t("analytics.weekly_xp")}
        </h4>
        <div className="bg-white rounded-xl border border-slate-200/60 p-3">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="xp" fill="#004B63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-petroleum mb-3">
          {t("analytics.module_scores")}
        </h4>
        <div className="bg-white rounded-xl border border-slate-200/60 p-3">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={moduleScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `M${v?.split(" ")[1] || ""}`}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {moduleScores?.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-petroleum mb-3">
          {t("analytics.study_time")}
        </h4>
        <div className="bg-white rounded-xl border border-slate-200/60 p-3">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="minutes" fill="#00BCD4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-petroleum mb-3">
          {t("analytics.activity_distribution")}
        </h4>
        <div className="bg-white rounded-xl border border-slate-200/60 p-3 flex justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {pieData.map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 text-[10px] text-slate-500"
            >
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              {entry.name}: {entry.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
