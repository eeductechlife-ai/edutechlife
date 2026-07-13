import { describe, it, expect } from "vitest";
import { computeDashboardKpis } from "../AdminDashboard";

describe("computeDashboardKpis", () => {
  it("deriva KPIs demo a partir de una lista de estudiantes de demostración", () => {
    const demoStudents = [
      { vak: "Visual", affinity: 80 },
      { vak: "Auditivo", affinity: 60 },
      { vak: "Kinestésico", affinity: 100 },
      { vak: "Visual", affinity: 40 },
    ];

    const result = computeDashboardKpis({
      dataSource: "demo",
      aggregate: null,
      demoStudents,
    });

    expect(result.total).toBe(4);
    expect(result.stylePercents).toEqual({
      visual: 50,
      auditory: 25,
      kinesthetic: 25,
    });
    expect(result.avgAffinity).toBe(70); // (80+60+100+40)/4
    expect(result.recentDiagnostics).toBe(4);
  });

  it("nunca inventa un total: usa demoStudents.length, no una cifra hardcodeada", () => {
    const demoStudents = Array.from({ length: 3 }, () => ({
      vak: "Visual",
      affinity: 50,
    }));

    const result = computeDashboardKpis({
      dataSource: "demo",
      aggregate: null,
      demoStudents,
    });

    expect(result.total).toBe(3);
    expect(result.total).not.toBe(20000);
  });

  it("deriva KPIs reales desde el agregado de aggregateDiagnostics", () => {
    const today = new Date();
    const oldDay = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const recentDay = today.toISOString().slice(0, 10);

    const aggregate = {
      total: 25,
      stylePercents: { visual: 40, auditivo: 35, kinestesico: 25 },
      avgPercentage: 77,
      timeline: [
        { day: oldDay, count: 5 },
        { day: recentDay, count: 3 },
      ],
    };

    const result = computeDashboardKpis({
      dataSource: "real",
      aggregate,
      demoStudents: [],
    });

    expect(result.total).toBe(25);
    expect(result.stylePercents).toEqual({
      visual: 40,
      auditory: 35,
      kinesthetic: 25,
    });
    expect(result.avgAffinity).toBe(77);
    // Solo cuenta el diagnóstico dentro de los últimos 30 días.
    expect(result.recentDiagnostics).toBe(3);
  });

  it("devuelve KPIs en cero cuando no hay agregado real disponible", () => {
    const result = computeDashboardKpis({
      dataSource: "real",
      aggregate: null,
      demoStudents: [],
    });

    expect(result.total).toBe(0);
    expect(result.avgAffinity).toBe(0);
    expect(result.recentDiagnostics).toBe(0);
    expect(result.stylePercents).toEqual({
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
    });
  });
});
