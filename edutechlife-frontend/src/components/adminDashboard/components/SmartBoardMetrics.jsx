import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Activity,
  Zap,
  BarChart3,
  Clock,
} from "lucide-react";

/**
 * SmartBoardMetrics Component
 *
 * Displays team operational metrics:
 * - DAU/WAU/MAU (Daily/Weekly/Monthly Active Users)
 * - Feature adoption rates
 * - User engagement metrics
 * - Learning completion rates
 *
 * Data comes from PostHog via backend endpoint or localStorage cache
 */

const SmartBoardMetrics = ({ dataSource = "demo" }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState("up"); // up, down, neutral

  useEffect(() => {
    if (dataSource === "demo") {
      // Demo data for development/staging
      setMetrics(DEMO_METRICS);
      setLoading(false);
      return;
    }

    // Fetch real metrics from backend
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/admin/metrics/engagement?days=30");
        if (!response.ok) throw new Error("Failed to fetch metrics");

        const data = await response.json();
        setMetrics(data);

        // Calculate trend
        if (
          data.current_dau &&
          data.previous_dau &&
          data.current_dau > data.previous_dau
        ) {
          setTrend("up");
        } else if (
          data.current_dau &&
          data.previous_dau &&
          data.current_dau < data.previous_dau
        ) {
          setTrend("down");
        } else {
          setTrend("neutral");
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setMetrics(DEMO_METRICS);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dataSource]);

  if (loading) {
    return <MetricsLoadingSkeleton />;
  }

  if (!metrics) {
    return <div className="text-red-500">Error loading metrics</div>;
  }

  return (
    <div className="space-y-8">
      {/* Active Users Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#4DA8C4]" />
          Active Users (User Engagement)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            label="Daily Active Users (DAU)"
            value={metrics.dau?.toLocaleString("es-CO")}
            subtext={`Last 24 hours`}
            icon={Activity}
            color="#4DA8C4"
            bgColor="rgba(77, 168, 196, 0.15)"
            trend={trend}
            change={metrics.dau_change}
          />
          <MetricCard
            label="Weekly Active Users (WAU)"
            value={metrics.wau?.toLocaleString("es-CO")}
            subtext={`Last 7 days`}
            icon={TrendingUp}
            color="#66CCCC"
            bgColor="rgba(102, 204, 204, 0.15)"
            trend={metrics.wau > metrics.wau_prev ? "up" : "down"}
            change={metrics.wau_change}
          />
          <MetricCard
            label="Monthly Active Users (MAU)"
            value={metrics.mau?.toLocaleString("es-CO")}
            subtext={`Last 30 days`}
            icon={BarChart3}
            color="#FFD166"
            bgColor="rgba(255, 209, 102, 0.15)"
            trend={metrics.mau > metrics.mau_prev ? "up" : "down"}
            change={metrics.mau_change}
          />
        </div>
      </div>

      {/* Feature Adoption Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FF6B9D]" />
          Feature Adoption Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.features?.map((feature, idx) => (
            <FeatureAdoptionCard
              key={idx}
              name={feature.name}
              adoptionRate={feature.adoption_rate}
              activeUsers={feature.active_users}
              totalUsers={feature.total_users}
              trend={feature.trend}
              change={feature.change}
            />
          ))}
        </div>
      </div>

      {/* Learning Metrics Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#66CCCC]" />
          Learning Engagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            label="Lesson Completion Rate"
            value={`${metrics.completion_rate}%`}
            subtext={`Lessons completed / started`}
            icon={TrendingUp}
            color="#4DA8C4"
            bgColor="rgba(77, 168, 196, 0.15)"
            trend={
              metrics.completion_rate > metrics.completion_rate_prev
                ? "up"
                : "down"
            }
            change={metrics.completion_rate_change}
          />
          <MetricCard
            label="Avg Session Duration"
            value={`${metrics.avg_session_minutes}m`}
            subtext={`Average time per session`}
            icon={Clock}
            color="#FFD166"
            bgColor="rgba(255, 209, 102, 0.15)"
            trend={
              metrics.avg_session_minutes > metrics.avg_session_minutes_prev
                ? "up"
                : "down"
            }
            change={metrics.session_duration_change}
          />
          <MetricCard
            label="Parent Engagement"
            value={`${metrics.parent_engagement_rate}%`}
            subtext={`Parents viewing child progress`}
            icon={Users}
            color="#FF6B9D"
            bgColor="rgba(255, 107, 157, 0.15)"
            trend={
              metrics.parent_engagement_rate >
              metrics.parent_engagement_rate_prev
                ? "up"
                : "down"
            }
            change={metrics.parent_engagement_change}
          />
        </div>
      </div>

      {/* Product Breakdown Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Product Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductMetricsCard
            name="IALab (AI Literacy Training)"
            dau={metrics.ialabDAU}
            wau={metrics.ialabWAU}
            mau={metrics.ialabMAU}
            completionRate={metrics.ialabCompletion}
            color="#4DA8C4"
          />
          <ProductMetricsCard
            name="SmartBoard (Kids Learning)"
            dau={metrics.smartboardDAU}
            wau={metrics.smartboardWAU}
            mau={metrics.smartboardMAU}
            completionRate={metrics.smartboardCompletion}
            color="#66CCCC"
          />
        </div>
      </div>

      {/* Retention Metrics Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#FFD166]" />
          Retention Cohorts
        </h2>
        <div
          className="rounded-2xl p-6 border border-[#004B63]/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="space-y-4">
            <RetentionRow
              label="Day 1 Retention"
              percentage={metrics.retention_day1}
              target={90}
            />
            <RetentionRow
              label="Day 7 Retention"
              percentage={metrics.retention_day7}
              target={60}
            />
            <RetentionRow
              label="Day 30 Retention"
              percentage={metrics.retention_day30}
              target={40}
            />
          </div>
        </div>
      </div>

      {/* Metrics Legend */}
      <div className="text-xs text-[#B2D8E5] text-center pt-4">
        Last updated: {new Date().toLocaleTimeString("es-CO")} | Data refreshes
        every 5 minutes
      </div>
    </div>
  );
};

/**
 * MetricCard Component
 * Reusable card for displaying individual metrics
 */
const MetricCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  color,
  bgColor,
  trend,
  change,
}) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 border border-[#004B63]/30 hover:border-[#004B63]/60 transition-colors"
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{
          background: color,
          borderRadius: "0 0 0 100%",
        }}
      ></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: bgColor }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                trend === "up"
                  ? "bg-green-500/20 text-green-400"
                  : trend === "down"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}%
            </div>
          )}
        </div>

        <h3 className="text-sm text-[#B2D8E5] mb-1 font-open-sans">{label}</h3>
        <div className="text-3xl font-bold text-white font-montserrat mb-2">
          {value}
        </div>
        <div className="text-xs text-[#7A8FA3]">{subtext}</div>
      </div>
    </div>
  );
};

/**
 * FeatureAdoptionCard Component
 * Shows adoption rate for specific features
 */
const FeatureAdoptionCard = ({
  name,
  adoptionRate,
  activeUsers,
  totalUsers,
  trend,
  change,
}) => {
  return (
    <div
      className="rounded-2xl p-6 border border-[#004B63]/30"
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <div
          className={`text-sm font-bold ${
            adoptionRate > 50 ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {adoptionRate}%
        </div>
      </div>

      <div className="mb-3">
        <div className="h-3 rounded-full bg-[#0B0F19] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
            style={{ width: `${adoptionRate}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#B2D8E5]">
        <div>
          {activeUsers?.toLocaleString("es-CO")} of{" "}
          {totalUsers?.toLocaleString("es-CO")} users
        </div>
        <div
          className={`font-semibold ${
            trend === "up"
              ? "text-green-400"
              : trend === "down"
                ? "text-red-400"
                : "text-gray-400"
          }`}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}%
        </div>
      </div>
    </div>
  );
};

/**
 * ProductMetricsCard Component
 * Shows metrics breakdown by product (IALab vs SmartBoard)
 */
const ProductMetricsCard = ({ name, dau, wau, mau, completionRate, color }) => {
  return (
    <div
      className="rounded-2xl p-6 border border-[#004B63]/30"
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <h3 className="text-lg font-bold text-white mb-4">{name}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#B2D8E5]">DAU</span>
          <span className="text-lg font-semibold text-white">
            {dau?.toLocaleString("es-CO")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#B2D8E5]">WAU</span>
          <span className="text-lg font-semibold text-white">
            {wau?.toLocaleString("es-CO")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#B2D8E5]">MAU</span>
          <span className="text-lg font-semibold text-white">
            {mau?.toLocaleString("es-CO")}
          </span>
        </div>
        <div className="border-t border-[#004B63]/30 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#B2D8E5]">Completion Rate</span>
            <span className="text-lg font-semibold" style={{ color }}>
              {completionRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * RetentionRow Component
 * Shows retention percentage with progress bar
 */
const RetentionRow = ({ label, percentage, target }) => {
  const isAboveTarget = percentage >= target;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#B2D8E5]">{label}</span>
        <span
          className={`font-semibold ${isAboveTarget ? "text-green-400" : "text-yellow-400"}`}
        >
          {percentage}% (Target: {target}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
        <div
          className={`h-full ${isAboveTarget ? "bg-green-500/50" : "bg-yellow-500/50"}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

/**
 * MetricsLoadingSkeleton Component
 * Shows loading state while metrics are being fetched
 */
const MetricsLoadingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 rounded-2xl bg-gradient-to-r from-[#004B63]/30 to-transparent"
        />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-40 rounded-2xl bg-gradient-to-r from-[#004B63]/30 to-transparent"
        />
      ))}
    </div>
  </div>
);

/**
 * Demo Metrics Data
 * Used when dataSource is "demo" or API fails
 */
export const DEMO_METRICS = {
  // Active users
  dau: 1250,
  dau_change: 15,
  wau: 4200,
  wau_change: 12,
  wau_prev: 3750,
  mau: 8500,
  mau_change: 8,
  mau_prev: 7850,

  // Learning engagement
  completion_rate: 76,
  completion_rate_prev: 72,
  completion_rate_change: 4,
  avg_session_minutes: 18,
  avg_session_minutes_prev: 16,
  session_duration_change: 12,
  parent_engagement_rate: 68,
  parent_engagement_rate_prev: 62,
  parent_engagement_change: 6,

  // Product breakdown
  ialabDAU: 800,
  ialabWAU: 2800,
  ialabMAU: 5200,
  ialabCompletion: 79,

  smartboardDAU: 450,
  smartboardWAU: 1400,
  smartboardMAU: 3300,
  smartboardCompletion: 72,

  // Retention cohorts
  retention_day1: 85,
  retention_day7: 52,
  retention_day30: 32,

  // Feature adoption
  features: [
    {
      name: "Crisis Alert Notifications",
      adoption_rate: 92,
      active_users: 780,
      total_users: 850,
      trend: "up",
      change: 8,
    },
    {
      name: "Valerio Voice Assistant",
      adoption_rate: 68,
      active_users: 578,
      total_users: 850,
      trend: "up",
      change: 12,
    },
    {
      name: "Parent Dashboard",
      adoption_rate: 74,
      active_users: 629,
      total_users: 850,
      trend: "up",
      change: 5,
    },
    {
      name: "VAK Diagnostics",
      adoption_rate: 55,
      active_users: 468,
      total_users: 850,
      trend: "down",
      change: -2,
    },
  ],
};

export default SmartBoardMetrics;
