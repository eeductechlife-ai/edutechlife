import React, { useState, useEffect } from "react";
import {
  Users,
  Brain,
  GraduationCap,
  Activity,
} from "lucide-react";
import LeadsManager from "../LeadsManager";
import { useSupabase } from "../../hooks/useSupabase";
import {
  fetchVakDiagnostics,
  aggregateDiagnostics,
} from "../../services/institutionalAnalytics";
import { fetchInstitutions } from "../../services/institutionService";
import {
  DEMO_STUDENTS,
  computeDashboardKpis,
  mapDiagnosticToRow,
} from "./adminDataTransform";
import AdminHeader from "./components/AdminHeader";
import AdminKPIs from "./components/AdminKPIs";
import AdminLeadsTable from "./components/AdminLeadsTable";

const AdminDashboard = ({ onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [realStudents, setRealStudents] = useState(null);
  const [aggregate, setAggregate] = useState(null);
  const [dataSource, setDataSource] = useState("loading");
  const [institutions, setInstitutions] = useState([]);
  const [institutionFilter, setInstitutionFilter] = useState("all");

  const { supabase, isLoading: supabaseLoading } = useSupabase();

  useEffect(() => {
    if (supabaseLoading || !supabase) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchInstitutions(supabase);
        if (!cancelled) setInstitutions(rows || []);
      } catch {
        if (!cancelled) setInstitutions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, supabaseLoading]);

  useEffect(() => {
    if (supabaseLoading) return;
    let cancelled = false;
    (async () => {
      try {
        if (!supabase) {
          if (!cancelled) setDataSource("demo");
          return;
        }
        const rows = await fetchVakDiagnostics(
          supabase,
          institutionFilter !== "all"
            ? { institutionId: institutionFilter }
            : {},
        );
        if (cancelled) return;
        if (rows.length > 0) {
          const agg = aggregateDiagnostics(rows);
          setAggregate(agg);
          setRealStudents(agg.students.map(mapDiagnosticToRow));
          setDataSource("real");
        } else if (institutionFilter !== "all") {
          setAggregate(aggregateDiagnostics([]));
          setRealStudents([]);
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
  }, [supabase, supabaseLoading, institutionFilter]);

  const students = realStudents ?? DEMO_STUDENTS;
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

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0B0F19 0%, #0D1321 50%, #0B0F19 100%)",
      }}
    >
      <AdminHeader
        onLogout={onLogout}
        onBack={onBack}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dataSource={dataSource}
      />

      <div className="container mx-auto px-6 py-8">
        <div className={activeTab === "leads" ? "hidden" : ""}>
          <AdminKPIs kpis={kpis} />

          <AdminLeadsTable
            students={students}
            institutions={institutions}
            institutionFilter={institutionFilter}
            setInstitutionFilter={setInstitutionFilter}
            dataSource={dataSource}
          />
        </div>
        {activeTab === "leads" && <LeadsManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
