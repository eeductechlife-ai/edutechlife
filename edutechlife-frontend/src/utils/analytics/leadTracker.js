export function recordLead(leadData, source = "nico_chat", timeToLead = null) {
  this.metrics.totalLeads++;
  this.metrics.leadsBySource[source] =
    (this.metrics.leadsBySource[source] || 0) + 1;

  if (this.metrics.totalSessions > 0) {
    this.metrics.leadConversionRate =
      (this.metrics.totalLeads / this.metrics.totalSessions) * 100;
  }

  if (timeToLead) {
    const leadHistory = this.metrics.leadHistory.filter((l) => l.timeToLead);
    const totalTime = leadHistory.reduce(
      (sum, l) => sum + l.timeToLead,
      timeToLead,
    );
    this.metrics.avgTimeToLead = totalTime / (leadHistory.length + 1);
  }

  const interest = leadData.interesPrincipal || "general";
  if (this.metrics.engagementByInterest[interest]) {
    this.metrics.engagementByInterest[interest].leads++;
  }

  const session = this.metrics.sessionHistory.find(
    (s) => s.id === this.currentSessionId,
  );
  if (session) {
    session.leads = (session.leads || 0) + 1;
    if (interest && !session.interests.includes(interest)) {
      session.interests.push(interest);
    }
  }

  const leadRecord = {
    id: leadData.id || `lead_${Date.now()}`,
    sessionId: this.currentSessionId,
    source,
    interest,
    timestamp: new Date().toISOString(),
    timeToLead,
    data: {
      nombre: leadData.nombreCompleto?.substring(0, 50),
      hasEmail: !!leadData.email,
      hasPhone: !!leadData.telefono,
    },
  };

  this.metrics.leadHistory.unshift(leadRecord);

  if (this.metrics.leadHistory.length > 200) {
    this.metrics.leadHistory = this.metrics.leadHistory.slice(0, 200);
  }

  if (!this.metrics.firstInteraction) {
    this.metrics.firstInteraction = new Date().toISOString();
  }
  this.metrics.lastInteraction = new Date().toISOString();

  this.saveMetrics();
}
