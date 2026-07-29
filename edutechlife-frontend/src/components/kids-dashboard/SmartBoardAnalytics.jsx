import { useMemo, memo, Fragment } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  LineChart as LineChartIcon,
  Gauge,
  Grid3x3,
  Target,
  Clock,
  Award,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const dc = (dm, l, d) => (dm ? d : l);

const getWeekDays = (t) => [
  t("analytics.week_mon"),
  t("analytics.week_tue"),
  t("analytics.week_wed"),
  t("analytics.week_thu"),
  t("analytics.week_fri"),
  t("analytics.week_sat"),
  t("analytics.week_sun"),
];

const MetricCard = memo(
  ({ Icon, title, children, darkMode, color = "#0096C7" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl border overflow-hidden ${dc(darkMode, "bg-[#151F32] border-[#2A3A54]", "bg-white border-[#E2E8F0] shadow-[0_10px_30px_-18px_rgba(0,48,63,0.35)]")}`}
    >
      <div
        className="flex items-center gap-3 p-4 border-b"
        style={{ borderColor: darkMode ? "#2A3A54" : "#E2E8F0" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
            boxShadow: `0 6px 16px -6px ${color}88`,
          }}
        >
          {Icon && <Icon className="w-[18px] h-[18px]" strokeWidth={2.4} />}
        </div>
        <h3
          className={`text-sm font-black tracking-tight ${dc(darkMode, "text-white", "text-[#00303F]")}`}
        >
          {title}
        </h3>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  ),
);

const SmartBoardAnalytics = memo(() => {
  const { t } = useTranslation();
  const {
    darkMode: dm,
    totalPoints,
    streak,
    missions,
    sessions,
    subjects,
    subjectTime,
    pointsHistory,
  } = useSmartBoardKids();
  const weekDays = getWeekDays(t);

  const subjectData = useMemo(
    () =>
      (subjects || []).map((s) => ({
        name: s.name,
        value: s.progress || 0,
        color: s.color || "#4DA8C4",
      })),
    [subjects],
  );

  const weeklyData = useMemo(() => {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dow + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const dayMinutes = weekDays.map(() => 0);

    (sessions || []).forEach((s) => {
      const sessionDate =
        s.date ||
        (s.start ? new Date(s.start).toISOString().split("T")[0] : null);
      if (!sessionDate) return;
      const dayIndex = weekDays.findIndex((_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d.toISOString().split("T")[0] === sessionDate;
      });
      if (dayIndex >= 0) {
        dayMinutes[dayIndex] += s.duration || 5;
      }
    });

    const maxVal = Math.max(...dayMinutes, 1);
    return weekDays.map((name, i) => ({
      name,
      value: dayMinutes[i],
      pct: Math.round((dayMinutes[i] / maxVal) * 100),
    }));
  }, [sessions, weekDays]);

  const predictionData = useMemo(() => {
    const history = pointsHistory || [];
    const weeks = [];
    const now = Date.now();
    for (let w = 0; w < 4; w++) {
      const weekStart = now - (3 - w) * 7 * 86400000;
      const weekEnd = weekStart + 7 * 86400000;
      const weekPoints = history
        .filter(
          (p) =>
            new Date(p.timestamp).getTime() >= weekStart &&
            new Date(p.timestamp).getTime() < weekEnd,
        )
        .reduce((sum, p) => sum + (p.points || 0), 0);
      weeks.push({ name: `Sem ${w + 1}`, value: Math.min(weekPoints, 100) });
    }
    const avg =
      weeks.length > 0
        ? weeks.reduce((s, w) => s + w.value, 0) / weeks.length
        : 0;
    weeks.push({ name: "Proy.", value: Math.round(Math.min(avg * 1.1, 100)) });
    return weeks;
  }, [pointsHistory]);

  const scatterData = useMemo(
    () =>
      (sessions || []).slice(-12).map((s, i) => ({
        x: s.duration || 5,
        y: Math.min((s.duration || 5) * 3 + 20, 100),
        name: `Sesión ${i + 1}`,
      })),
    [sessions],
  );

  const hasData = (sessions?.length || 0) > 0 || (totalPoints || 0) > 0;

  if (!hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4DA8C4] to-[#06D6A0] flex items-center justify-center text-white shadow-[0_16px_40px_-12px_rgba(77,168,196,0.5)]"
        >
          <Sparkles className="w-9 h-9" strokeWidth={2} />
        </motion.div>
        <div>
          <h3
            className={`text-xl font-black ${dc(dm, "text-white", "text-[#00303F]")}`}
          >
            {t("analytics.empty_title") || "¡Empieza a estudiar!"}
          </h3>
          <p
            className={`text-sm mt-1 max-w-sm ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
          >
            {t("analytics.empty_desc") ||
              "Completa misiones, estudia materias y gana puntos para ver tus estadísticas aquí."}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-[#4DA8C4]">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {t("analytics.empty_hint_study") || "Estudia"}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#4DA8C4]/30" />
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            {t("analytics.empty_hint_missions") || "Completa misiones"}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#4DA8C4]/30" />
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            {t("analytics.empty_hint_progress") || "Gana puntos"}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#9D4EDD] to-[#06D6A0] flex items-center justify-center text-white shadow-[0_10px_24px_-8px_rgba(157,78,221,0.6)]">
          <LineChartIcon className="w-5 h-5" strokeWidth={2.4} />
        </div>
        <div>
          <h3
            className={`text-lg font-black tracking-tight ${dc(dm, "text-[#E2F0FF]", "text-[#00303F]")}`}
          >
            {t("analytics.title")}
          </h3>
          <p
            className={`text-xs font-medium ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
          >
            {t("analytics.subtitle")}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          Icon={Gauge}
          title={t("analytics.metric_speed")}
          darkMode={dm}
          color="#0096C7"
        >
          {weeklyData.some((d) => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          (entry.pct || 0) > 70
                            ? "#22C55E"
                            : (entry.pct || 0) > 30
                              ? "#4DA8C4"
                              : "#EF4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p
                className={`text-xs text-center mt-2 ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
              >
                {t("analytics.metric_speed_desc")}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-center">
              <p
                className={`text-sm font-semibold ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
              >
                Sin datos esta semana
              </p>
              <p className="text-[10px] mt-1 text-[#94A3B8]">
                Estudia para ver tu progreso diario
              </p>
            </div>
          )}
        </MetricCard>

        <MetricCard
          Icon={Grid3x3}
          title={t("analytics.metric_heatmap")}
          darkMode={dm}
          color="#FF6B9D"
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-1 min-w-[250px]">
              <div className="text-[10px] text-[#64748B] font-medium"></div>
              {weekDays.slice(0, 5).map((d) => (
                <div
                  key={d}
                  className="text-[10px] text-[#64748B] font-medium text-center"
                >
                  {d}
                </div>
              ))}
              {(subjectData.length > 0
                ? subjectData
                : [{ name: "—", value: 0, color: "#ccc" }]
              ).map((subj) => (
                <Fragment key={subj.name}>
                  <div className="text-[10px] text-[#64748B] font-medium py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {subj.name}
                  </div>
                  {weekDays.slice(0, 5).map((day) => {
                    const val = subj.value;
                    const intensity =
                      val > 80
                        ? "bg-green-400"
                        : val > 60
                          ? "bg-[#4DA8C4]"
                          : val > 40
                            ? "bg-[#66CCCC]"
                            : val > 20
                              ? "bg-[#FFD166]"
                              : "bg-gray-200";
                    return (
                      <div
                        key={`${subj.name}-${day}`}
                        className={`w-full aspect-square rounded ${intensity} flex items-center justify-center`}
                        title={`${subj.name} ${day}: ${val}%`}
                      >
                        <span className="text-[8px] text-white font-bold">
                          {val > 20 ? `${val}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </MetricCard>

        <MetricCard
          Icon={Target}
          title={t("analytics.metric_prediction")}
          darkMode={dm}
          color="#9D4EDD"
        >
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={predictionData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#A855F7"
                strokeWidth={2}
                dot={{ fill: "#A855F7", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p
            className={`text-xs text-center mt-2 ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
          >
            Proyección: {predictionData[predictionData.length - 1]?.value || 0}%
            estimado
          </p>
        </MetricCard>

        <MetricCard
          Icon={Clock}
          title={t("analytics.metric_time")}
          darkMode={dm}
          color="#06D6A0"
        >
          <ResponsiveContainer width="100%" height={180}>
            <ScatterChart>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={dm ? "#334155" : "#E2E8F0"}
              />
              <XAxis
                dataKey="x"
                name="minutos"
                tick={{ fontSize: 10 }}
                label={{ value: "Minutos", position: "bottom", fontSize: 10 }}
              />
              <YAxis
                dataKey="y"
                name="nota"
                tick={{ fontSize: 10 }}
                label={{
                  value: "Nota",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 10,
                }}
              />
              <Tooltip formatter={(v) => [`${v}`, "Valor"]} />
              <Scatter data={scatterData} fill="#4DA8C4" />
            </ScatterChart>
          </ResponsiveContainer>
          <p
            className={`text-xs text-center mt-2 ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
          >
            Correlación: más tiempo = mejores resultados
          </p>
        </MetricCard>

        <MetricCard
          Icon={Award}
          title={t("analytics.metric_streak")}
          darkMode={dm}
          color="#FB8500"
          className="md:col-span-2"
        >
          <div className="space-y-3">
            {subjectData.map((subj, i) => (
              <div key={subj.name} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: subj.color }}
                />
                <span
                  className={`text-xs font-semibold w-20 ${dc(dm, "text-white", "text-[#004B63]")}`}
                >
                  {subj.name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subj.value}%` }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${subj.color}, ${subj.color}dd)`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-bold w-10 text-right ${dc(dm, "text-[#4DA8C4]", "text-[#004B63]")}`}
                >
                  {subj.value}%
                </span>
              </div>
            ))}
          </div>
          <div
            className="flex items-center justify-between mt-4 pt-3 border-t"
            style={{ borderColor: dm ? "#334155" : "#E2E8F0" }}
          >
            <div className="text-center">
              <p
                className={`text-lg font-black ${dc(dm, "text-white", "text-[#004B63]")}`}
              >
                {streak || 0}
              </p>
              <p
                className={`text-[10px] ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
              >
                Racha actual
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-lg font-black ${dc(dm, "text-white", "text-[#004B63]")}`}
              >
                {totalPoints || 0}
              </p>
              <p
                className={`text-[10px] ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
              >
                Puntos totales
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-lg font-black ${dc(dm, "text-white", "text-[#004B63]")}`}
              >
                {missions?.filter((m) => m.completed).length || 0}
              </p>
              <p
                className={`text-[10px] ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
              >
                Misiones
              </p>
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
});

SmartBoardAnalytics.displayName = "SmartBoardAnalytics";
export { SmartBoardAnalytics };
export default SmartBoardAnalytics;
