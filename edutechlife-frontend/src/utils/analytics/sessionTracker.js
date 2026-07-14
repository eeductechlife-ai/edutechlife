export function recordSessionStart() {
  this.metrics.totalSessions++;

  const sessionRecord = {
    id: this.currentSessionId,
    startTime: new Date().toISOString(),
    startTimestamp: Date.now(),
    messages: 0,
    leads: 0,
    appointments: 0,
    duration: 0,
    interests: [],
    completed: false,
  };

  this.metrics.sessionHistory.unshift(sessionRecord);

  if (this.metrics.sessionHistory.length > 100) {
    this.metrics.sessionHistory = this.metrics.sessionHistory.slice(0, 100);
  }

  this.saveMetrics();
}

export function recordSessionEnd() {
  if (!this.currentSessionId) return;

  const session = this.metrics.sessionHistory.find(
    (s) => s.id === this.currentSessionId,
  );
  if (session) {
    session.endTime = new Date().toISOString();
    session.duration = Date.now() - session.startTimestamp;
    session.completed = true;

    const completedSessions = this.metrics.sessionHistory.filter(
      (s) => s.completed,
    );
    if (completedSessions.length > 0) {
      const totalDuration = completedSessions.reduce(
        (sum, s) => sum + s.duration,
        0,
      );
      this.metrics.avgSessionDuration =
        totalDuration / completedSessions.length;
    }

    this.saveMetrics();
  }

  this.currentSessionId = null;
  this.sessionStartTime = null;
}

export function recordMessage(role, content, responseTime = null) {
  if (!this.currentSessionId) return;

  this.metrics.totalMessages++;

  const session = this.metrics.sessionHistory.find(
    (s) => s.id === this.currentSessionId,
  );
  if (session) {
    session.messages = (session.messages || 0) + 1;
  }

  const activeSessions = this.metrics.sessionHistory.filter(
    (s) => !s.completed,
  );
  if (activeSessions.length > 0) {
    const totalMessages = activeSessions.reduce(
      (sum, s) => sum + (s.messages || 0),
      0,
    );
    this.metrics.avgMessagesPerSession = totalMessages / activeSessions.length;
  }

  const messageRecord = {
    sessionId: this.currentSessionId,
    role,
    content: content.substring(0, 200),
    timestamp: new Date().toISOString(),
    responseTime,
  };

  this.metrics.messageHistory.unshift(messageRecord);

  if (this.metrics.messageHistory.length > 500) {
    this.metrics.messageHistory = this.metrics.messageHistory.slice(0, 500);
  }

  if (responseTime && role === "assistant") {
    const assistantMessages = this.metrics.messageHistory.filter(
      (m) => m.role === "assistant" && m.responseTime,
    );
    if (assistantMessages.length > 0) {
      const totalResponseTime = assistantMessages.reduce(
        (sum, m) => sum + m.responseTime,
        0,
      );
      this.metrics.avgResponseTime =
        totalResponseTime / assistantMessages.length;
    }
  }

  this.saveMetrics();
}
