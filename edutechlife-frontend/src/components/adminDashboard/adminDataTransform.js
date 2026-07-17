// Datos de demostración — se usan solo cuando no hay diagnósticos reales en
// Supabase (tabla nueva/vacía o sin sesión de admin interno).
export const DEMO_STUDENTS = [
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

const EMPTY_STYLE_PERCENTS = { visual: 0, auditory: 0, kinesthetic: 0 };

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
    recentDiagnostics: total,
  };
}

export function computeDashboardKpis({ dataSource, aggregate, demoStudents }) {
  return dataSource === "real"
    ? computeRealKpis(aggregate)
    : computeDemoKpis(demoStudents || []);
}

export const mapDiagnosticToRow = (s, i) => ({
  id: `EST-${String(i + 1).padStart(3, "0")}`,
  name: s.name,
  vak: s.vak,
  module: s.age ? `${s.age} años` : "Diagnóstico VAK",
  xp: s.percentage,
  lastConnection: s.date ? new Date(s.date).toLocaleDateString("es-CO") : "—",
  status: "active",
});
