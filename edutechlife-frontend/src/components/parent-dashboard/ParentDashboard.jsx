import { memo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Flame,
  Award,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { NotificationPreferences } from "../parent-settings/NotificationPreferences";
import { NotificationHistory } from "./NotificationHistory";
import { track } from "../../lib/analytics";
import { EVENTS } from "../../lib/analyticsEvents";

const API_BASE = import.meta.env.VITE_API_URL || "";

// ── Helpers ───────────────────────────────────────────────────────────────────

function authToken() {
  try {
    return sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

function studentId() {
  try {
    return localStorage.getItem("student_id") || "";
  } catch {
    return "";
  }
}

function studentName() {
  try {
    return localStorage.getItem("student_email")?.split("@")[0] || "tu hijo(a)";
  } catch {
    return "tu hijo(a)";
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm"
    whileHover={{ y: -3 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend != null && (
          <p className={`text-xs font-semibold mt-1 ${trend > 0 ? "text-green-600" : "text-red-500"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% esta semana
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </motion.div>
);

const SEVERITY_STYLES = {
  success: { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", icon: CheckCircle, iconColor: "text-green-600 dark:text-green-400", titleColor: "text-green-900 dark:text-green-100", textColor: "text-green-700 dark:text-green-300" },
  warning: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", icon: AlertCircle, iconColor: "text-amber-600 dark:text-amber-400", titleColor: "text-amber-900 dark:text-amber-100", textColor: "text-amber-700 dark:text-amber-300" },
  info: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", icon: TrendingUp, iconColor: "text-blue-600 dark:text-blue-400", titleColor: "text-blue-900 dark:text-blue-100", textColor: "text-blue-700 dark:text-blue-300" },
  alert: { bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", icon: AlertCircle, iconColor: "text-red-600 dark:text-red-400", titleColor: "text-red-900 dark:text-red-100", textColor: "text-red-700 dark:text-red-300" },
};

const InsightCard = ({ insight }) => {
  const s = SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.info;
  const IconComp = s.icon;
  return (
    <div className={`p-4 rounded-xl border ${s.bg} ${s.border}`}>
      <div className="flex gap-3 items-start">
        <IconComp className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${s.titleColor}`}>{insight.title}</p>
          {insight.what && (
            <p className={`text-sm mt-1 ${s.textColor}`}>{insight.what}</p>
          )}
          {insight.action && (
            <p className={`text-xs mt-2 font-medium ${s.iconColor}`}>
              → {insight.action}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MasteryBar = ({ subject, percent, trend }) => {
  const color = percent >= 60 ? "bg-green-500" : percent >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {percent}%{" "}
          {trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️"}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const ParentDashboard = memo(() => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("overview");
  const [insights, setInsights] = useState([]);
  const [mastery, setMastery] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [loadingMastery, setLoadingMastery] = useState(true);
  const name = studentName();
  const sid = studentId();
  const token = authToken();

  const fetchInsights = useCallback(async () => {
    if (!sid || !token) { setLoadingInsights(false); return; }
    try {
      const res = await fetch(
        `${API_BASE}/api/smartboard/parent/insights?studentId=${sid}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return;
      const data = await res.json();
      setInsights(data.insights || []);
      track(EVENTS.PARENT_INSIGHT_VIEWED, { studentId: sid, count: (data.insights || []).length });
    } catch {
      // best-effort
    } finally {
      setLoadingInsights(false);
    }
  }, [sid, token]);

  const fetchMastery = useCallback(async () => {
    if (!sid || !token) { setLoadingMastery(false); return; }
    try {
      const res = await fetch(
        `${API_BASE}/api/smartboard/parent/learning-graph?studentId=${sid}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return;
      const data = await res.json();
      setMastery(data.summary || []);
    } catch {
      // best-effort
    } finally {
      setLoadingMastery(false);
    }
  }, [sid, token]);

  useEffect(() => {
    fetchInsights();
    fetchMastery();
  }, [fetchInsights, fetchMastery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Panel de Padres</h1>
          <p className="text-blue-100 text-sm">
            Seguimiento académico de <strong>{name}</strong>
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {[
            { id: "overview", label: "Resumen" },
            { id: "insights", label: "Perspectivas IA" },
            { id: "mastery", label: "Dominio por Materia" },
            { id: "history", label: "Historial de Alertas" },
            { id: "preferences", label: "Preferencias" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeSection === tab.id
                  ? "border-[#4DA8C4] text-[#004B63] dark:text-[#4DA8C4]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {activeSection === "history" && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <NotificationHistory />
        </div>
      )}

      {/* Preferences */}
      {activeSection === "preferences" && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <NotificationPreferences />
        </div>
      )}

      {/* Insights tab */}
      {activeSection === "insights" && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Perspectivas generadas por IA
          </h2>
          {loadingInsights ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : insights.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Aún no hay perspectivas disponibles. Se generan una vez que el estudiante complete actividades.
            </p>
          ) : (
            <div className="space-y-4">
              {insights.map((ins, i) => (
                <InsightCard key={i} insight={ins} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mastery tab */}
      {activeSection === "mastery" && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Dominio por materia
          </h2>
          {loadingMastery ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : mastery.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Sin datos de dominio aún. Disponibles tras completar el diagnóstico.
            </p>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              {mastery.map((m) => (
                <MasteryBar key={m.subject} subject={m.subject} percent={m.masteryPercent} trend={m.trend} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overview */}
      {activeSection === "overview" && (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Flame} label="Racha" value={`${insights.find(i => i.type === "activity")?.evidence?.match(/\d+/) ? "—" : "—"} días`} color="bg-orange-500" />
            <StatCard icon={Award} label="Puntos" value="—" color="bg-blue-500" />
            <StatCard icon={BookOpen} label="Actividades" value="—" color="bg-green-500" />
            <StatCard icon={Target} label="Promedio" value="—" color="bg-purple-500" />
          </div>

          {/* AI Insights preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#4DA8C4]" />
                Perspectivas recientes
              </h2>
              <button
                onClick={() => setActiveSection("insights")}
                className="text-sm text-[#4DA8C4] font-medium flex items-center gap-1 hover:underline"
              >
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {loadingInsights ? (
                <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
              ) : insights.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Las perspectivas aparecerán cuando el estudiante complete actividades.
                </p>
              ) : (
                insights.slice(0, 2).map((ins, i) => <InsightCard key={i} insight={ins} />)
              )}
            </div>
          </div>

          {/* Mastery preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#4DA8C4]" />
                Dominio académico
              </h2>
              <button
                onClick={() => setActiveSection("mastery")}
                className="text-sm text-[#4DA8C4] font-medium flex items-center gap-1 hover:underline"
              >
                Ver detalle <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              {loadingMastery ? (
                <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              ) : mastery.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sin datos de dominio todavía.
                </p>
              ) : (
                mastery.slice(0, 3).map((m) => (
                  <MasteryBar key={m.subject} subject={m.subject} percent={m.masteryPercent} trend={m.trend} />
                ))
              )}
            </div>
          </div>

          {/* Support CTA */}
          <motion.div
            className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] rounded-xl p-6 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold mb-1">¿Preguntas sobre el progreso?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Nuestro equipo está disponible para ayudarte
            </p>
            <a
              href="https://wa.me/573238365517"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#004B63] font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all text-sm"
            >
              Contactar Soporte
            </a>
          </motion.div>
        </div>
      )}
    </div>
  );
});

ParentDashboard.displayName = "ParentDashboard";

export default ParentDashboard;
