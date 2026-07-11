import { memo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { COLORS } from "./chartColors";

const ChartRenderer = memo(({ chartData, darkMode }) => {
  if (!chartData?.data?.length) return null;

  if (chartData.type === "bar") {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 200 }}
        className={`rounded-xl border p-3 my-2 ${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
      >
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData.data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={
                darkMode
                  ? {
                      background: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      fontSize: 12,
                    }
                  : { borderRadius: 8, fontSize: 12 }
              }
            />
            <Bar dataKey="value" fill="#4DA8C4" radius={[4, 4, 0, 0]}>
              {chartData.data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  if (chartData.type === "pie") {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 200 }}
        className={`rounded-xl border p-3 my-2 ${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
      >
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  if (chartData.type === "line") {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 200 }}
        className={`rounded-xl border p-3 my-2 ${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
      >
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData.data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={
                darkMode
                  ? {
                      background: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      fontSize: 12,
                    }
                  : { borderRadius: 8, fontSize: 12 }
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4DA8C4"
              strokeWidth={2}
              dot={{ fill: "#4DA8C4", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  return null;
});
ChartRenderer.displayName = "ChartRenderer";

export default ChartRenderer;
