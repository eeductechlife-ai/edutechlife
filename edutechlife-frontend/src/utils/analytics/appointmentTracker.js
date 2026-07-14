export function recordAppointment(appointmentData, source = "nico_chat") {
  this.metrics.totalAppointments++;
  this.metrics.appointmentsScheduled++;

  if (this.metrics.totalLeads > 0) {
    this.metrics.appointmentConversionRate =
      (this.metrics.totalAppointments / this.metrics.totalLeads) * 100;
  }

  const interest = appointmentData.topic || "general";
  if (this.metrics.engagementByInterest[interest]) {
    this.metrics.engagementByInterest[interest].appointments++;
  }

  const session = this.metrics.sessionHistory.find(
    (s) => s.id === this.currentSessionId,
  );
  if (session) {
    session.appointments = (session.appointments || 0) + 1;
  }

  const appointmentRecord = {
    id: appointmentData.id,
    sessionId: this.currentSessionId,
    source,
    interest,
    status: "scheduled",
    timestamp: new Date().toISOString(),
    scheduledFor: appointmentData.date,
    data: {
      modality: appointmentData.modality,
      duration: appointmentData.duration,
      leadName: appointmentData.leadName?.substring(0, 50),
    },
  };

  this.metrics.appointmentHistory.unshift(appointmentRecord);

  if (this.metrics.appointmentHistory.length > 100) {
    this.metrics.appointmentHistory = this.metrics.appointmentHistory.slice(
      0,
      100,
    );
  }

  this.saveMetrics();
}

export function updateAppointmentStatus(appointmentId, newStatus, notes = "") {
  const appointment = this.metrics.appointmentHistory.find(
    (a) => a.id === appointmentId,
  );
  if (appointment) {
    appointment.status = newStatus;
    appointment.updatedAt = new Date().toISOString();
    appointment.notes = notes;

    if (newStatus === "completed") {
      this.metrics.appointmentsCompleted++;
      this.metrics.appointmentsScheduled--;
    } else if (newStatus === "cancelled") {
      this.metrics.appointmentsCancelled++;
      this.metrics.appointmentsScheduled--;
    }

    if (this.metrics.totalAppointments > 0) {
      this.metrics.completionRate =
        (this.metrics.appointmentsCompleted / this.metrics.totalAppointments) *
        100;
    }

    this.saveMetrics();
  }
}
