import {
  getAppointmentConfirmationTemplate,
  getAppointmentReminder24hTemplate,
  getAppointmentReminder1hTemplate,
  getLeadWelcomeTemplate,
} from "./templates.js";

class EmailService {
  constructor() {
    this.sentEmails = [];
    this.templates = null;
  }

  initializeTemplates() {
    if (!this.templates) {
      this.templates = {
        appointmentConfirmation: getAppointmentConfirmationTemplate(),
        appointmentReminder24h: getAppointmentReminder24hTemplate(),
        appointmentReminder1h: getAppointmentReminder1hTemplate(),
        leadWelcome: getLeadWelcomeTemplate(),
      };
    }
    return this.templates;
  }

  getTemplate(templateName) {
    const templates = this.initializeTemplates();
    return templates[templateName];
  }

  async sendEmail(to, subject, templateName, data) {
    try {
      const template = this.getTemplate(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} no encontrado`);
      }

      const htmlContent = template(data);

      const emailRecord = {
        id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        to,
        subject,
        template: templateName,
        data,
        htmlContent,
        sentAt: new Date().toISOString(),
        status: "simulated",
        simulated: true,
      };

      this.sentEmails.push(emailRecord);

      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        emailId: emailRecord.id,
        message: "Email simulado enviado exitosamente",
        record: emailRecord,
      };
    } catch (error) {
      console.error("❌ Error enviando email:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendAppointmentConfirmation(appointment) {
    const { leadEmail, leadName, date, time, duration, modality, topic } =
      appointment;

    if (!leadEmail) {
      console.warn("⚠️ No hay email para enviar confirmación de cita");
      return { success: false, error: "No email provided" };
    }

    return this.sendEmail(
      leadEmail,
      `✅ Confirmación de cita - EdutechLife`,
      "appointmentConfirmation",
      {
        leadName,
        date,
        time,
        duration,
        modality,
        topic,
      },
    );
  }

  async send24hReminder(appointment) {
    const { leadEmail, leadName, date, time, duration, modality } = appointment;

    if (!leadEmail) {
      console.warn("⚠️ No hay email para enviar recordatorio 24h");
      return { success: false, error: "No email provided" };
    }

    return this.sendEmail(
      leadEmail,
      `⏰ Recordatorio: Tu cita es mañana - EdutechLife`,
      "appointmentReminder24h",
      {
        leadName,
        date,
        time,
        duration,
        modality,
      },
    );
  }

  async send1hReminder(appointment) {
    const {
      leadEmail,
      leadName,
      date,
      time,
      duration,
      modality,
      appointmentId,
    } = appointment;

    if (!leadEmail) {
      console.warn("⚠️ No hay email para enviar recordatorio 1h");
      return { success: false, error: "No email provided" };
    }

    return this.sendEmail(
      leadEmail,
      `🎯 ¡Tu cita es en 1 hora! - EdutechLife`,
      "appointmentReminder1h",
      {
        leadName,
        date,
        time,
        duration,
        modality,
        appointmentId,
      },
    );
  }

  async sendLeadWelcome(lead) {
    const { email, nombre, interes } = lead;

    if (!email) {
      console.warn("⚠️ No hay email para enviar bienvenida");
      return { success: false, error: "No email provided" };
    }

    return this.sendEmail(
      email,
      `🎓 Bienvenido a EdutechLife - ${nombre}`,
      "leadWelcome",
      {
        nombre,
        interes,
      },
    );
  }

  async checkAndSendReminders(appointments) {
    const now = new Date();
    const sentEmails = [];

    for (const appointment of appointments) {
      if (appointment.status !== "scheduled") continue;

      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}`,
      );
      const hoursUntilAppointment =
        (appointmentDateTime - now) / (1000 * 60 * 60);

      if (hoursUntilAppointment <= 24 && hoursUntilAppointment > 23.5) {
        const alreadySent = appointment.remindersSent?.some(
          (r) => r.type === "24h_email",
        );

        if (!alreadySent) {
          const result = await this.send24hReminder(appointment);
          if (result.success) {
            sentEmails.push({
              appointmentId: appointment.id,
              type: "24h_email",
              emailId: result.emailId,
              sentAt: new Date().toISOString(),
            });
          }
        }
      }

      if (hoursUntilAppointment <= 1 && hoursUntilAppointment > 0.9) {
        const alreadySent = appointment.remindersSent?.some(
          (r) => r.type === "1h_email",
        );

        if (!alreadySent) {
          const result = await this.send1hReminder(appointment);
          if (result.success) {
            sentEmails.push({
              appointmentId: appointment.id,
              type: "1h_email",
              emailId: result.emailId,
              sentAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    return sentEmails;
  }

  getSentEmails(filter = "all") {
    let filtered = [...this.sentEmails];

    if (filter !== "all") {
      filtered = filtered.filter((email) => email.template === filter);
    }

    return filtered.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  }

  getStats() {
    const total = this.sentEmails.length;
    const byTemplate = {};

    this.sentEmails.forEach((email) => {
      byTemplate[email.template] = (byTemplate[email.template] || 0) + 1;
    });

    return {
      total,
      byTemplate,
      lastSent: this.sentEmails.length > 0 ? this.sentEmails[0].sentAt : null,
    };
  }

  clearSentEmails() {
    this.sentEmails = [];
  }
}

export { EmailService };
