import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Brain,
  GraduationCap,
  Activity,
  Search,
  Filter,
  Download,
  ChevronDown,
  Eye,
  Ear,
  Hand,
  MessageSquare,
  Send,
  Shield,
  LogOut,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Zap,
  FolderOpen,
} from "lucide-react";
import { callDeepseek } from "../utils/api";
import LeadsManager from "./LeadsManager";
import { useSupabase } from "../hooks/useSupabase";
import {
  fetchVakDiagnostics,
  aggregateDiagnostics,
} from "../services/institutionalAnalytics";

// Datos de demostración — se usan solo cuando no hay diagnósticos reales en
// Supabase (tabla nueva/vacía o sin sesión de admin interno).
const DEMO_STUDENTS = [
  {
    id: "EST-001",
    name: "María García López",
    vak: "Visual",
    module: "Módulo 3 - Fundamentos IA",
    xp: 4850,
    affinity: 82,
    lastConnection: "Hace 5 min",
    status: "active",
  },
  {
    id: "EST-002",
    name: "Carlos Martínez Ruiz",
    vak: "Auditivo",
    module: "Módulo 2 - Prompt Engineering",
    xp: 3200,
    affinity: 76,
    lastConnection: "Hace 12 min",
    status: "active",
  },
  {
    id: "EST-003",
    name: "Ana Rodríguez Torres",
    vak: "Kinestésico",
    module: "Módulo 4 - Proyectos IA",
    xp: 5600,
    affinity: 88,
    lastConnection: "Hace 1 hora",
    status: "away",
  },
  {
    id: "EST-004",
    name: "Diego Sánchez Vela",
    vak: "Visual",
    module: "Módulo 1 - Intro a IA",
    xp: 2100,
    affinity: 70,
    lastConnection: "Hace 2 horas",
    status: "inactive",
  },
  {
    id: "EST-005",
    name: "Laura Jiménez Castro",
    vak: "Auditivo",
    module: "Módulo 5 - Certificación",
    xp: 6200,
    affinity: 91,
    lastConnection: "Hace 30 min",
    status: "active",
  },
  {
    id: "EST-006",
    name: "Pedro López Mendoza",
    vak: "Kinestésico",
    module: "Módulo 3 - Fundamentos IA",
    xp: 4100,
    affinity: 68,
    lastConnection: "Hace 3 horas",
    status: "inactive",
  },
  {
    id: "EST-007",
    name: "Sofia Hernández Gil",
    vak: "Visual",
    module: "Módulo 4 - Proyectos IA",
    xp: 5300,
    affinity: 85,
    lastConnection: "Hace 45 min",
    status: "active",
  },
  {
    id: "EST-008",
    name: "Andrés Fernández Díaz",
    vak: "Auditivo",
    module: "Módulo 2 - Prompt Engineering",
    xp: 2800,
    affinity: 79,
    lastConnection: "Hace 20 min",
    status: "active",
  },
  {
    id: "EST-009",
    name: "Valentina Cruz Ortiz",
    vak: "Kinestésico",
    module: "Módulo 5 - Certificación",
    xp: 5900,
    affinity: 93,
    lastConnection: "Hace 1 hora",
    status: "away",
  },
  {
    id: "EST-010",
    name: "Manuel Reyes Peña",
    vak: "Visual",
    module: "Módulo 1 - Intro a IA",
    xp: 1500,
    affinity: 64,
    lastConnection: "Hace 4 horas",
    status: "inactive",
  },
];

// --- Derivación pura de KPIs (testeable sin montar el componente) ---------

const EMPTY_STYLE_PERCENTS = { visual: 0, auditory: 0, kinesthetic: 0 };

// KPIs a partir de datos reales agregados por aggregateDiagnostics().
function computeRealKpis(aggregate) {
  if (!aggregate) {
    return {
      total: 0,
      stylePercents: EMPTY_STYLE_PERCENTS,
      avgAffinity: 0,
      recentDiagnostics: 0,
    };
  }
  const { total, stylePercents, avgPercentage, timeline } = aggregate;
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentDiagnostics = (timeline || []).reduce((sum, entry) => {
    const t = new Date(entry.day).getTime();
    return Number.isFinite(t) && t >= cutoff ? sum + entry.count : sum;
  }, 0);
  return {
    total,
    stylePercents: {
      visual: stylePercents?.visual || 0,
      auditory: stylePercents?.auditivo || 0,
      kinesthetic: stylePercents?.kinestesico || 0,
    },
    avgAffinity: avgPercentage || 0,
    recentDiagnostics,
  };
}

// KPIs a partir de DEMO_STUDENTS, calculados (nunca inventados/hardcodeados).
function computeDemoKpis(demoStudents) {
  const total = demoStudents.length;
  const counts = { visual: 0, auditory: 0, kinesthetic: 0 };
  let sumAffinity = 0;
  demoStudents.forEach((s) => {
    if (s.vak === "Visual") counts.visual += 1;
    else if (s.vak === "Auditivo") counts.auditory += 1;
    else if (s.vak === "Kinestésico") counts.kinesthetic += 1;
    sumAffinity += s.affinity || 0;
  });
  return {
    total,
    stylePercents: {
      visual: total ? Math.round((counts.visual / total) * 100) : 0,
      auditory: total ? Math.round((counts.auditory / total) * 100) : 0,
      kinesthetic: total ? Math.round((counts.kinesthetic / total) * 100) : 0,
    },
    avgAffinity: total ? Math.round(sumAffinity / total) : 0,
    // Sin fechas reales en los datos de demo: todo el set se cuenta como
    // "reciente" para no inventar una serie temporal que no existe.
    recentDiagnostics: total,
  };
}

/**
 * Deriva los KPIs del dashboard según la fuente de datos activa.
 * Pura: sin acceso a red/estado de React, fácil de testear.
 * @param {object} params - { dataSource, aggregate, demoStudents }
 */
export function computeDashboardKpis({ dataSource, aggregate, demoStudents }) {
  return dataSource === "real"
    ? computeRealKpis(aggregate)
    : computeDemoKpis(demoStudents || []);
}

// Mapea un estudiante agregado del diagnóstico a la forma que consume la tabla
const mapDiagnosticToRow = (s, i) => ({
  id: `EST-${String(i + 1).padStart(3, "0")}`,
  name: s.name,
  vak: s.vak,
  module: s.age ? `${s.age} años` : "Diagnóstico VAK",
  xp: s.percentage, // % de afinidad con el estilo predominante
  lastConnection: s.date ? new Date(s.date).toLocaleDateString("es-CO") : "—",
  status: "active",
});

const AdminDashboard = ({ onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [consultantMessages, setConsultantMessages] = useState([]);
  const [consultantInput, setConsultantInput] = useState("");
  const [consultantLoading, setConsultantLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [vakFilter, setVakFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [realStudents, setRealStudents] = useState(null);
  const [aggregate, setAggregate] = useState(null);
  const [dataSource, setDataSource] = useState("loading"); // 'loading' | 'real' | 'demo'
  const consultantEndRef = useRef(null);

  const { supabase, isLoading: supabaseLoading } = useSupabase();

  // Cargar diagnósticos VAK reales desde Supabase para el panel institucional
  useEffect(() => {
    if (supabaseLoading) return;
    let cancelled = false;
    (async () => {
      try {
        if (!supabase) {
          if (!cancelled) setDataSource("demo");
          return;
        }
        const rows = await fetchVakDiagnostics(supabase);
        if (cancelled) return;
        if (rows.length > 0) {
          const agg = aggregateDiagnostics(rows);
          setAggregate(agg);
          setRealStudents(agg.students.map(mapDiagnosticToRow));
          setDataSource("real");
        } else {
          setDataSource("demo");
        }
      } catch {
        if (!cancelled) setDataSource("demo");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, supabaseLoading]);

  const scrollToBottom = () => {
    consultantEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [consultantMessages]);

  // Datos reales (diagnósticos VAK desde Supabase) con fallback a demo.
  // students = reales si existen; si la tabla está vacía o no hay sesión admin,
  // se usan DEMO_STUDENTS para que la UI nunca se vea vacía en desarrollo.
  const students = realStudents ?? DEMO_STUDENTS;

  // KPIs derivados: reales cuando dataSource === 'real', si no, calculados a
  // partir de DEMO_STUDENTS (nunca inventados) mientras carga o sin datos.
  const isDemo = dataSource !== "real";
  const dashboardKpis = computeDashboardKpis({
    dataSource,
    aggregate,
    demoStudents: DEMO_STUDENTS,
  });

  const kpis = [
    {
      label: "Total Estudiantes",
      value: dashboardKpis.total.toLocaleString("es-CO"),
      demo: isDemo,
      icon: Users,
      color: "#4DA8C4",
      bgColor: "rgba(77, 168, 196, 0.15)",
    },
    {
      label: "Estilo VAK Promedio",
      value: null,
      breakdown: dashboardKpis.stylePercents,
      demo: isDemo,
      icon: Brain,
      color: "#66CCCC",
      bgColor: "rgba(102, 204, 204, 0.15)",
    },
    {
      label: "% Afinidad Promedio",
      value: `${dashboardKpis.avgAffinity}%`,
      demo: isDemo,
      icon: GraduationCap,
      color: "#FFD166",
      bgColor: "rgba(255, 209, 102, 0.15)",
    },
    {
      label: "Diagnósticos (últimos 30 días)",
      value: dashboardKpis.recentDiagnostics.toLocaleString("es-CO"),
      demo: isDemo,
      icon: Activity,
      color: "#FF6B9D",
      bgColor: "rgba(255, 107, 157, 0.15)",
    },
  ];

  const modules = [
    "Módulo 1 - Intro a IA",
    "Módulo 2 - Prompt Engineering",
    "Módulo 3 - Fundamentos IA",
    "Módulo 4 - Proyectos IA",
    "Módulo 5 - Certificación",
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVak = vakFilter === "all" || student.vak === vakFilter;
    const matchesModule =
      moduleFilter === "all" || student.module === moduleFilter;
    return matchesSearch && matchesVak && matchesModule;
  });

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Nombre",
      "Estilo VAK",
      "Módulo Actual",
      "XP",
      "Última Conexión",
      "Estado",
    ];
    const rows = filteredStudents.map((s) => [
      s.id,
      s.name,
      s.vak,
      s.module,
      s.xp,
      s.lastConnection,
      s.status,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `edutechlife_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleConsultantSend = async () => {
    if (!consultantInput.trim()) return;

    const userQuestion = consultantInput;
    setConsultantInput("");
    setConsultantMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion },
    ]);
    setConsultantLoading(true);

    const studentDataSummary = filteredStudents
      .map(
        (s) =>
          `${s.name} (${s.id}): Estilo VAK ${s.vak}, ${s.module}, ${s.xp} XP`,
      )
      .join("\n");

    const systemPrompt = `Eres Valeria IA, la consultora de análisis educativo de Edutechlife para administradores. Tienes acceso a datos detallados de estudiantes y debes proporcionar insights accionables sobre dificultades de aprendizaje, patrones de rendimiento, y recomendaciones basadas en los estilos VAK. Sé específica, profesional y usa datos cuando sea posible.`;

    const sourceNote =
      dataSource === "real"
        ? "Estos son diagnósticos VAK reales de la plataforma."
        : "NOTA: son datos de demostración (aún no hay diagnósticos reales registrados).";
    const prompt = `Contexto: Somos el centro Edutechlife en Manizales. ${sourceNote}\nDatos de estudiantes:\n${studentDataSummary}\n\nPregunta del administrador: ${userQuestion}`;

    try {
      const response = await callDeepseek(prompt, systemPrompt, false);
      setConsultantMessages((prev) => [
        ...prev,
        { role: "assistant", text: response },
      ]);
    } catch (error) {
      setConsultantMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Lo siento, estoy experimentando dificultades técnicas. Por favor intenta de nuevo.",
        },
      ]);
    }
    setConsultantLoading(false);
  };

  const getVAKIcon = (vak) => {
    switch (vak) {
      case "Visual":
        return <Eye className="w-4 h-4" />;
      case "Auditivo":
        return <Ear className="w-4 h-4" />;
      case "Kinestésico":
        return <Hand className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getVAKColor = (vak) => {
    switch (vak) {
      case "Visual":
        return "text-[#4DA8C4] bg-[#4DA8C4]/20";
      case "Auditivo":
        return "text-[#66CCCC] bg-[#66CCCC]/20";
      case "Kinestésico":
        return "text-[#FF6B9D] bg-[#FF6B9D]/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "inactive":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0B0F19 0%, #0D1321 50%, #0B0F19 100%)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-[#004B63]/30"
        style={{ background: "rgba(11, 15, 25, 0.9)" }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#B2D8E5] hover:text-white transition-colors"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
              <span className="text-sm">Volver</span>
            </button>
            <div className="h-8 w-px bg-[#004B63]/50"></div>
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #004B63, #4DA8C4)",
                }}
              >
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-montserrat">
                  Command Center
                </h1>
                <p className="text-xs text-[#B2D8E5]">
                  Panel de Administración Edutechlife
                </p>
              </div>
              <div className="flex items-center gap-1 ml-6">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === "dashboard"
                      ? "bg-[#4DA8C4]/30 text-white border border-[#4DA8C4]/50"
                      : "text-[#66CCCC] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab("leads")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === "leads"
                      ? "bg-[#4DA8C4]/30 text-white border border-[#4DA8C4]/50"
                      : "text-[#66CCCC] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span className="text-sm">Leads</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {dataSource === "real" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                Datos reales
              </span>
            )}
            {dataSource === "demo" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFD166]/20 text-[#FFD166] border border-[#FFD166]/40">
                Datos de demostración
              </span>
            )}
            {dataSource === "loading" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#B2D8E5] border border-white/20">
                Cargando datos…
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#004B63]/30 text-[#66CCCC] border border-[#004B63]/50">
              ADMIN_MASTER
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B9D]/20 text-[#FF6B9D] hover:bg-[#FF6B9D]/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className={activeTab === "leads" ? "hidden" : ""}>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl p-6 border border-[#004B63]/30"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0, 75, 99, 0.4) 0%, rgba(11, 15, 25, 0.9) 100%)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-10"
                    style={{
                      background: kpi.color,
                      borderRadius: "0 0 0 100%",
                    }}
                  ></div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: kpi.bgColor }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: kpi.color }}
                        />
                      </div>
                      {kpi.demo && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-[#FFD166]/20 text-[#FFD166]">
                          DEMO
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm text-[#B2D8E5] mb-1 font-open-sans">
                      {kpi.label}
                    </h3>

                    {kpi.value ? (
                      <div className="text-3xl font-bold text-white font-montserrat">
                        {kpi.value}
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-white font-montserrat mb-3">
                          Distribución
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-[#4DA8C4]" />
                              <span className="text-sm text-[#B2D8E5]">
                                Visual
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                              {kpi.breakdown.visual}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                              style={{ width: `${kpi.breakdown.visual}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Ear className="w-4 h-4 text-[#66CCCC]" />
                              <span className="text-sm text-[#B2D8E5]">
                                Auditivo
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                              {kpi.breakdown.auditory}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#66CCCC] to-[#B2D8E5]"
                              style={{ width: `${kpi.breakdown.auditory}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Hand className="w-4 h-4 text-[#FF6B9D]" />
                              <span className="text-sm text-[#B2D8E5]">
                                Kinestésico
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                              {kpi.breakdown.kinesthetic}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#0B0F19] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#FF6B9D] to-[#FFD166]"
                              style={{ width: `${kpi.breakdown.kinesthetic}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Data Table */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl border border-[#004B63]/30 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0, 75, 99, 0.3) 0%, rgba(11, 15, 25, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Table Header */}
                <div className="p-6 border-b border-[#004B63]/30">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-[#4DA8C4]" />
                      <h2 className="text-lg font-bold text-white font-montserrat">
                        Gestión de Estudiantes
                      </h2>
                    </div>
                    <button
                      onClick={downloadCSV}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4DA8C4]/20 text-[#4DA8C4] hover:bg-[#4DA8C4]/30 transition-all border border-[#4DA8C4]/30"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        Descargar Reporte Global
                      </span>
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="mt-4 flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B2D8E5]/50" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] transition-colors"
                      />
                    </div>
                    <div className="flex gap-3">
                      <select
                        value={vakFilter}
                        onChange={(e) => setVakFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white focus:outline-none focus:border-[#4DA8C4] transition-colors cursor-pointer"
                      >
                        <option value="all">Todos los VAK</option>
                        <option value="Visual">Visual</option>
                        <option value="Auditivo">Auditivo</option>
                        <option value="Kinestésico">Kinestésico</option>
                      </select>
                      <select
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white focus:outline-none focus:border-[#4DA8C4] transition-colors cursor-pointer"
                      >
                        <option value="all">Todos los Módulos</option>
                        {modules.map((mod, i) => (
                          <option key={i} value={mod}>
                            Módulo {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#004B63]/30">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                          Estudiante
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                          Estilo VAK
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                          Módulo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                          XP
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                          Última Conexión
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#B2D8E5] uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#004B63]/20 hover:bg-[#004B63]/10 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center text-white text-xs font-bold">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {student.name}
                                </p>
                                <p className="text-xs text-[#B2D8E5]/70">
                                  {student.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getVAKColor(student.vak)}`}
                            >
                              {getVAKIcon(student.vak)}
                              {student.vak}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-[#B2D8E5]">
                              {student.module.split(" - ")[0]}
                            </p>
                            <p className="text-xs text-[#B2D8E5]/70">
                              - {student.module.split(" - ")[1]}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-[#FFD166]" />
                              <span className="text-sm font-semibold text-white">
                                {student.xp.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#B2D8E5]">
                              {student.lastConnection}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${getStatusColor(student.status)}`}
                              ></span>
                              <span className="text-xs text-[#B2D8E5] capitalize">
                                {student.status === "active"
                                  ? "Activo"
                                  : student.status === "away"
                                    ? "Ausente"
                                    : "Inactivo"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="px-6 py-4 border-t border-[#004B63]/30 bg-[#0B0F19]/50">
                  <p className="text-sm text-[#B2D8E5]">
                    Mostrando{" "}
                    <span className="font-semibold text-white">
                      {filteredStudents.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-white">
                      {students.length}
                    </span>{" "}
                    estudiantes
                  </p>
                </div>
              </div>
            </div>

            {/* Valeria Consultant Panel */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl border border-[#004B63]/30 overflow-hidden h-full flex flex-col"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0, 75, 99, 0.3) 0%, rgba(11, 15, 25, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Consultant Header */}
                <div className="p-6 border-b border-[#004B63]/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #004B63, #4DA8C4)",
                        }}
                      >
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#66CCCC] border-2 border-[#0B0F19]"></div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white font-montserrat">
                        Valeria IA
                      </h2>
                      <p className="text-xs text-[#66CCCC]">
                        Consultora de Análisis Educativo
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#66CCCC]/10 border border-[#66CCCC]/20">
                    <MessageSquare className="w-4 h-4 text-[#66CCCC]" />
                    <p className="text-xs text-[#B2D8E5]">
                      Modo Consultor activo. Pregunta sobre dificultades de
                      aprendizaje, patrones y recomendaciones.
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                  <div className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #004B63, #4DA8C4)",
                      }}
                    >
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#004B63]/30 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                      <p className="text-sm text-[#B2D8E5]">
                        ¡Hola! Soy Valeria, tu consultora de IA. Puedo analizar
                        los datos de tus estudiantes y proporcionarte insights
                        sobre dificultades de aprendizaje, patrones de
                        rendimiento y recomendaciones específicas basadas en los
                        estilos VAK. ¿Qué te gustaría saber?
                      </p>
                    </div>
                  </div>

                  {consultantMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #004B63, #4DA8C4)",
                          }}
                        >
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`${msg.role === "user" ? "bg-[#4DA8C4]/30 rounded-2xl rounded-tr-none" : "bg-[#004B63]/30 rounded-2xl rounded-tl-none"} p-4 max-w-[85%]`}
                      >
                        <p className="text-sm text-white">{msg.text}</p>
                      </div>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#4DA8C4]/30">
                          <Shield className="w-4 h-4 text-[#4DA8C4]" />
                        </div>
                      )}
                    </div>
                  ))}

                  {consultantLoading && (
                    <div className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #004B63, #4DA8C4)",
                        }}
                      >
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-[#004B63]/30 rounded-2xl rounded-tl-none p-4">
                        <div className="flex gap-1">
                          <span
                            className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-[#66CCCC] rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={consultantEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#004B63]/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej: ¿Cuál es la principal dificultad de aprendizaje del grupo?"
                      value={consultantInput}
                      onChange={(e) => setConsultantInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleConsultantSend()
                      }
                      className="flex-1 px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#004B63]/50 text-white placeholder-[#B2D8E5]/50 focus:outline-none focus:border-[#4DA8C4] transition-colors text-sm"
                    />
                    <button
                      onClick={handleConsultantSend}
                      disabled={!consultantInput.trim()}
                      className="px-4 py-3 rounded-xl bg-[#4DA8C4] text-white hover:bg-[#4DA8C4]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
              <p className="text-2xl font-bold text-white font-montserrat">
                1,247
              </p>
              <p className="text-xs text-[#B2D8E5]">Estudiantes Activos Hoy</p>
            </div>
            <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
              <p className="text-2xl font-bold text-white font-montserrat">
                342
              </p>
              <p className="text-xs text-[#B2D8E5]">Misiones Completadas</p>
            </div>
            <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
              <p className="text-2xl font-bold text-white font-montserrat">
                89%
              </p>
              <p className="text-xs text-[#B2D8E5]">Tasa de Retención</p>
            </div>
            <div className="p-4 rounded-xl bg-[#004B63]/20 border border-[#004B63]/30 text-center">
              <p className="text-2xl font-bold text-white font-montserrat">
                4.7/5
              </p>
              <p className="text-xs text-[#B2D8E5]">Satisfacción General</p>
            </div>
          </div>
        </div>
        {activeTab === "leads" && <LeadsManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
