export function getMetrics(timeRange = "today") {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "yesterday":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );
      break;
    case "week":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );
      break;
    case "month":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
      );
      break;
    case "all":
    default:
      startDate = new Date(0);
  }

  const filteredSessions = this.metrics.sessionHistory.filter(
    (session) => new Date(session.startTime) >= startDate,
  );

  const filteredLeads = this.metrics.leadHistory.filter(
    (lead) => new Date(lead.timestamp) >= startDate,
  );

  const filteredAppointments = this.metrics.appointmentHistory.filter(
    (appt) => new Date(appt.timestamp) >= startDate,
  );

  const totalSessions = filteredSessions.length;
  const totalLeads = filteredLeads.length;
  const totalAppointments = filteredAppointments.length;
  const completedAppointments = filteredAppointments.filter(
    (appt) => appt.status === "completed",
  ).length;

  return {
    conversations: {
      total: totalSessions,
      active: filteredSessions.filter((s) => !s.completed).length,
      avgDuration:
        filteredSessions.length > 0
          ? Math.round(
              filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0) /
                filteredSessions.length /
                1000,
            )
          : 0,
    },
    leads: {
      total: totalLeads,
      conversionRate: totalSessions > 0 ? totalLeads / totalSessions : 0,
      qualityScore:
        totalLeads > 0
          ? Math.min((totalLeads / (totalSessions || 1)) * 100, 100)
          : 0,
    },
    appointments: {
      total: totalAppointments,
      scheduled: filteredAppointments.filter(
        (appt) => appt.status === "scheduled",
      ).length,
      completed: completedAppointments,
      conversionRate: totalLeads > 0 ? totalAppointments / totalLeads : 0,
      completionRate:
        totalAppointments > 0 ? completedAppointments / totalAppointments : 0,
    },
    engagement: {
      rate: totalSessions > 0 ? Math.min(totalSessions / 100, 1) : 0,
      messagesPerSession:
        totalSessions > 0
          ? Math.round(
              filteredSessions.reduce((sum, s) => sum + (s.messages || 0), 0) /
                totalSessions,
            )
          : 0,
      retention: totalSessions > 0 ? Math.min(totalSessions / 50, 1) : 0,
    },
    trends: {
      conversations: this.generateHourlyTrends(filteredSessions, "startTime"),
      leads: this.generateHourlyTrends(filteredLeads, "timestamp"),
      appointments: this.generateHourlyTrends(
        filteredAppointments,
        "timestamp",
      ),
    },
    sources: this.getLeadSources(filteredLeads),
    realtime: {
      activeSessions: filteredSessions.filter((s) => !s.completed).length,
      leadsToday: filteredLeads.filter(
        (l) => new Date(l.timestamp).toDateString() === now.toDateString(),
      ).length,
      appointmentsToday: filteredAppointments.filter(
        (a) => new Date(a.timestamp).toDateString() === now.toDateString(),
      ).length,
      activity: this.getRecentActivity(),
    },
  };
}

export function getSummaryMetrics() {
  return {
    totalSessions: this.metrics.totalSessions,
    totalMessages: this.metrics.totalMessages,
    avgSessionDuration: Math.round(this.metrics.avgSessionDuration / 1000),
    avgMessagesPerSession:
      Math.round(this.metrics.avgMessagesPerSession * 10) / 10,

    totalLeads: this.metrics.totalLeads,
    leadConversionRate: Math.round(this.metrics.leadConversionRate * 10) / 10,
    totalAppointments: this.metrics.totalAppointments,
    appointmentConversionRate:
      Math.round(this.metrics.appointmentConversionRate * 10) / 10,
    completionRate: Math.round(this.metrics.completionRate * 10) / 10,

    avgResponseTime: Math.round(this.metrics.avgResponseTime),
    avgTimeToLead: Math.round(this.metrics.avgTimeToLead),

    topInterests: this.getTopInterests(3),

    lastUpdated: this.metrics.lastUpdated,
  };
}

export function generateCSVReport(type = "summary") {
  let csv = "";

  switch (type) {
    case "sessions":
      csv = "ID,Fecha Inicio,Duración (ms),Mensajes,Leads,Citas,Intereses\n";
      this.metrics.sessionHistory.forEach((session) => {
        csv += `${session.id},${session.startTime},${session.duration},${session.messages},${session.leads},${session.appointments},"${session.interests.join(", ")}"\n`;
      });
      break;

    case "leads":
      csv = "ID,Sesión,Fuente,Interés,Fecha,Tiempo a Lead (ms)\n";
      this.metrics.leadHistory.forEach((lead) => {
        csv += `${lead.id},${lead.sessionId},${lead.source},${lead.interest},${lead.timestamp},${lead.timeToLead || ""}\n`;
      });
      break;

    case "appointments":
      csv =
        "ID,Sesión,Estado,Interés,Fecha Agendada,Fecha Creación,Modalidad,Duración\n";
      this.metrics.appointmentHistory.forEach((appt) => {
        csv += `${appt.id},${appt.sessionId},${appt.status},${appt.interest},${appt.scheduledFor},${appt.timestamp},${appt.data.modality},${appt.data.duration}\n`;
      });
      break;

    case "ab_tests":
      csv = "Nombre Test,Variante,Intentos,Éxitos,Tasa Éxito %,Peso %\n";
      Object.entries(this.abTests.variants).forEach(([testName, variants]) => {
        variants.forEach((variant) => {
          csv += `${testName},${variant.id},${variant.stats.attempts || 0},${variant.stats.successes || 0},${Math.round(variant.stats.rate || 0)},${Math.round(variant.weight * 100)}\n`;
        });
      });
      break;

    default: {
      // `summary` estaba declarado dentro de un bloque y se usaba fuera de el,
      // asi que el caso por defecto siempre lanzaba ReferenceError.
      const summary = this.getSummaryMetrics();
      csv = "Métrica,Valor\n";
      Object.entries(summary).forEach(([key, value]) => {
        if (typeof value !== "object") {
          csv += `${key},${value}\n`;
        }
      });
    }
  }

  return csv;
}

export function exportReport(type = "summary") {
  const csv = this.generateCSVReport(type);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `edutechlife_analytics_${type}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

export function exportData(format = "csv") {
  this.exportReport("summary");
}

export function generateHourlyTrends(data, dateField) {
  const hourlyData = Array(24)
    .fill(0)
    .map((_, hour) => ({
      hour,
      label: `${hour}:00`,
      value: 0,
    }));

  data.forEach((item) => {
    const date = new Date(item[dateField]);
    const hour = date.getHours();
    if (hourlyData[hour]) {
      hourlyData[hour].value++;
    }
  });

  return hourlyData;
}

export function getLeadSources(leads) {
  const sources = {};

  leads.forEach((lead) => {
    const source = lead.source || "nico_chat";
    sources[source] = (sources[source] || 0) + 1;
  });

  const total = Object.values(sources).reduce((sum, count) => sum + count, 0);

  return Object.entries(sources)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getRecentActivity() {
  const now = new Date();
  const activities = [];

  this.metrics.sessionHistory.slice(0, 5).forEach((session) => {
    const time = new Date(session.startTime);
    const minutesAgo = Math.round((now - time) / (1000 * 60));

    activities.push({
      time: `${minutesAgo} min`,
      type: "Sesión iniciada",
      details: `${session.messages || 0} mensajes`,
    });
  });

  this.metrics.leadHistory.slice(0, 5).forEach((lead) => {
    const time = new Date(lead.timestamp);
    const minutesAgo = Math.round((now - time) / (1000 * 60));

    activities.push({
      time: `${minutesAgo} min`,
      type: "Lead capturado",
      details: lead.nombreCompleto?.substring(0, 20) || "Nuevo lead",
    });
  });

  this.metrics.appointmentHistory.slice(0, 5).forEach((appt) => {
    const time = new Date(appt.timestamp);
    const minutesAgo = Math.round((now - time) / (1000 * 60));

    activities.push({
      time: `${minutesAgo} min`,
      type: "Cita agendada",
      details: appt.data?.leadName?.substring(0, 20) || "Nueva cita",
    });
  });

  return activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
}

export function getTopInterests(limit = 5) {
  const interests = Object.entries(this.metrics.engagementByInterest)
    .map(([interest, data]) => ({
      interest,
      leads: data.leads,
      appointments: data.appointments,
      messages: data.messages,
      totalScore: data.leads * 3 + data.appointments * 2 + data.messages,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);

  return interests;
}

export function getPeakHours() {
  const hourCounts = {};

  this.metrics.sessionHistory.forEach((session) => {
    if (session.startTime) {
      const hour = new Date(session.startTime).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  return Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count);
}

export function getPromptEffectiveness() {
  return this.metrics.promptEffectiveness;
}

export function getActiveTests() {
  const tests = [];

  Object.entries(this.abTests.variants).forEach(([testName, variants]) => {
    const totalAttempts = variants.reduce(
      (sum, v) => sum + (v.stats.attempts || 0),
      0,
    );

    if (totalAttempts > 0) {
      const bestVariant = [...variants].sort(
        (a, b) => (b.stats.rate || 0) - (a.stats.rate || 0),
      )[0];

      tests.push({
        name: testName,
        variants: variants.length,
        totalAttempts,
        bestVariant: bestVariant.id,
        bestRate: Math.round(bestVariant.stats.rate || 0),
        weights: variants.map((v) => ({
          id: v.id,
          weight: Math.round(v.weight * 100),
        })),
      });
    }
  });

  return tests;
}
