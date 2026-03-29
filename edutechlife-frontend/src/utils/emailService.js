// Servicio de simulación de emails para EdutechLife
// En producción, esto se conectaría a un servicio real de email como SendGrid, Mailgun, etc.

class EmailService {
  constructor() {
    this.sentEmails = [];
    this.templates = null; // Se inicializará de manera diferida
  }

  // Inicializar plantillas de manera diferida
  initializeTemplates() {
    if (!this.templates) {
      this.templates = {
        appointmentConfirmation: this.getAppointmentConfirmationTemplate(),
        appointmentReminder24h: this.getAppointmentReminder24hTemplate(),
        appointmentReminder1h: this.getAppointmentReminder1hTemplate(),
        leadWelcome: this.getLeadWelcomeTemplate(),
        appointmentCancelled: this.getAppointmentCancelledTemplate(),
        appointmentRescheduled: this.getAppointmentRescheduledTemplate()
      };
    }
    return this.templates;
  }

  // Obtener plantilla asegurando que estén inicializadas
  getTemplate(templateName) {
    const templates = this.initializeTemplates();
    return templates[templateName];
  }

  // Plantilla de confirmación de cita
  getAppointmentConfirmationTemplate() {
    return (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Cita - EdutechLife</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #004B63 0%, #4DA8C4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; border: 2px solid #B2D8E5; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .label { font-weight: bold; color: #004B63; }
          .button { display: inline-block; background: #66CCCC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Cita Confirmada</h1>
          <p>EdutechLife - Transformando educación</p>
        </div>
        
        <div class="content">
          <h2>Hola ${data.leadName},</h2>
          <p>Tu cita con nuestro especialista ha sido confirmada exitosamente.</p>
          
          <div class="appointment-details">
            <h3>📅 Detalles de tu cita:</h3>
            <div class="detail-item"><span class="label">Fecha:</span> ${new Date(data.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="detail-item"><span class="label">Hora:</span> ${data.time}</div>
            <div class="detail-item"><span class="label">Duración:</span> ${data.duration} minutos</div>
            <div class="detail-item"><span class="label">Modalidad:</span> ${data.modality === 'videollamada' ? 'Videollamada' : 'Llamada telefónica'}</div>
            <div class="detail-item"><span class="label">Especialista:</span> Equipo EdutechLife</div>
            <div class="detail-item"><span class="label">Tema:</span> ${data.topic || 'Consulta inicial'}</div>
          </div>
          
          ${data.modality === 'videollamada' ? `
          <p><strong>🔗 Enlace de videollamada:</strong> Se enviará 15 minutos antes de la cita.</p>
          ` : `
          <p><strong>📞 Llamada telefónica:</strong> Te llamaremos al número proporcionado.</p>
          `}
          
          <p><strong>📝 Preparación recomendada:</strong></p>
          <ul>
            <li>Ten a mano cualquier pregunta específica que tengas</li>
            <li>Prepara información relevante sobre tus necesidades</li>
            <li>Busca un lugar tranquilo para la ${data.modality === 'videollamada' ? 'videollamada' : 'llamada'}</li>
          </ul>
          
          <p><a href="#" class="button">📅 Agregar a mi calendario</a></p>
          
          <p>Si necesitas reagendar o cancelar, por favor contáctanos con al menos 24 horas de anticipación.</p>
          
          <div class="footer">
            <p>EdutechLife · Bogotá, Colombia · info@edutechlife.com · +57 XXX XXX XXXX</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla de recordatorio 24h antes
  getAppointmentReminder24hTemplate() {
    return (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Cita - EdutechLife</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4DA8C4 0%, #66CCCC 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reminder-box { background: #fff8e1; border: 2px solid #ffd54f; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .label { font-weight: bold; color: #004B63; }
          .button { display: inline-block; background: #4DA8C4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⏰ Recordatorio: Cita Mañana</h1>
          <p>EdutechLife - Tu cita está programada para mañana</p>
        </div>
        
        <div class="content">
          <h2>Hola ${data.leadName},</h2>
          <p>Este es un recordatorio amistoso de tu cita programada para <strong>mañana</strong>.</p>
          
          <div class="reminder-box">
            <h3>📅 Tu cita es mañana:</h3>
            <div class="detail-item"><span class="label">Fecha:</span> ${new Date(data.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="detail-item"><span class="label">Hora:</span> ${data.time}</div>
            <div class="detail-item"><span class="label">Duración:</span> ${data.duration} minutos</div>
            <div class="detail-item"><span class="label">Modalidad:</span> ${data.modality === 'videollamada' ? 'Videollamada' : 'Llamada telefónica'}</div>
          </div>
          
          <p><strong>🎯 Preparación:</strong></p>
          <ul>
            <li>Verifica tu conexión a internet si es videollamada</li>
            <li>Ten a mano tu identificación</li>
            <li>Prepara tus preguntas y objetivos</li>
          </ul>
          
          ${data.modality === 'videollamada' ? `
          <p><strong>🔗 El enlace de videollamada llegará 15 minutos antes de la cita.</strong></p>
          ` : `
          <p><strong>📞 Te llamaremos al número proporcionado 5 minutos antes.</strong></p>
          `}
          
          <p><a href="#" class="button">📅 Ver detalles completos</a></p>
          
          <p>¿Necesitas reagendar? <a href="#">Haz clic aquí</a> (con 24h de anticipación)</p>
          
          <div class="footer">
            <p>EdutechLife · Transformando educación, una conversación a la vez</p>
            <p>Este es un email automático de recordatorio.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla de recordatorio 1h antes
  getAppointmentReminder1hTemplate() {
    return (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Tu cita es en 1 hora! - EdutechLife</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #66CCCC 0%, #B2D8E5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .urgent-box { background: #e3f2fd; border: 2px solid #4DA8C4; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-item { margin: 10px 0; }
          .label { font-weight: bold; color: #004B63; }
          .button { display: inline-block; background: #66CCCC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 ¡Tu cita es en 1 hora!</h1>
          <p>EdutechLife - Prepárate para conectar</p>
        </div>
        
        <div class="content">
          <h2>Hola ${data.leadName},</h2>
          <p>Tu cita con nuestro especialista de EdutechLife comienza <strong>en 1 hora</strong>.</p>
          
          <div class="urgent-box">
            <h3>⏰ Comienza a las ${data.time}:</h3>
            <div class="detail-item"><span class="label">Hora de inicio:</span> ${data.time}</div>
            <div class="detail-item"><span class="label">Duración:</span> ${data.duration} minutos</div>
            <div class="detail-item"><span class="label">Modalidad:</span> ${data.modality === 'videollamada' ? 'Videollamada' : 'Llamada telefónica'}</div>
          </div>
          
          <p><strong>🚀 Últimos preparativos:</strong></p>
          <ul>
            <li>Busca un lugar tranquilo y sin distracciones</li>
            <li>Verifica tu equipo (micrófono, cámara, auriculares)</li>
            <li>Ten a mano lápiz y papel para notas</li>
            <li>Prepara tu identificación si es necesario</li>
          </ul>
          
          ${data.modality === 'videollamada' ? `
          <p><strong>🔗 Enlace de videollamada:</strong> https://meet.edutechlife.com/${data.appointmentId}</p>
          <p><a href="https://meet.edutechlife.com/${data.appointmentId}" class="button">🎥 Unirse a la videollamada</a></p>
          ` : `
          <p><strong>📞 Llamada entrante:</strong> Recibirás una llamada del número +57 XXX XXX XXXX</p>
          <p>Por favor mantén tu teléfono disponible y con señal.</p>
          `}
          
          <p>Si tienes problemas para conectarte, contáctanos inmediatamente por WhatsApp.</p>
          
          <div class="footer">
            <p>¡Estamos emocionados de conocerte! El equipo EdutechLife</p>
            <p>Este es un recordatorio automático enviado 1 hora antes de tu cita.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla de bienvenida para nuevo lead
  getLeadWelcomeTemplate() {
    return (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a EdutechLife</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0A1628 0%, #004B63 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .welcome-box { background: white; border: 2px solid #66CCCC; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .services { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .service-item { background: #f0f9ff; padding: 15px; border-radius: 5px; }
          .button { display: inline-block; background: #004B63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 Bienvenido a EdutechLife</h1>
          <p>Transformando educación con tecnología e innovación</p>
        </div>
        
        <div class="content">
          <h2>Hola ${data.nombre},</h2>
          <p>¡Gracias por tu interés en EdutechLife! Estamos emocionados de tenerte con nosotros.</p>
          
          <div class="welcome-box">
            <h3>📋 Hemos registrado tu interés en:</h3>
            <p><strong>${data.interes || 'Nuestros servicios educativos'}</strong></p>
            <p>Un asesor especializado se contactará contigo pronto para personalizar una solución para tus necesidades.</p>
          </div>
          
          <h3>🎯 Nuestros servicios:</h3>
          <div class="services">
            <div class="service-item">
              <strong>🧠 Diagnóstico VAK</strong>
              <p>Identifica tu estilo de aprendizaje preferido</p>
            </div>
            <div class="service-item">
              <strong>🤖 Programación STEM</strong>
              <p>Robótica, coding y ciencias para todas las edades</p>
            </div>
            <div class="service-item">
              <strong>📚 Tutoría académica</strong>
              <p>Refuerzo en matemáticas, ciencias e inglés</p>
            </div>
            <div class="service-item">
              <strong>💖 Bienestar emocional</strong>
              <p>Acompañamiento psicológico y desarrollo emocional</p>
            </div>
          </div>
          
          <p><strong>🚀 Próximos pasos:</strong></p>
          <ol>
            <li>Un asesor se contactará en las próximas 24 horas</li>
            <li>Coordinarán una clase gratuita de prueba</li>
            <li>Recibirás un plan personalizado basado en tus necesidades</li>
          </ol>
          
          <p><a href="https://edutechlife.com/mi-cuenta" class="button">👤 Acceder a mi cuenta</a></p>
          
          <p><strong>📞 Contacto inmediato:</strong><br>
          WhatsApp: +57 XXX XXX XXXX<br>
          Email: info@edutechlife.com<br>
          Sitio web: www.edutechlife.com</p>
          
          <div class="footer">
            <p>EdutechLife · Centro de Innovación Educativa · Bogotá, Colombia</p>
            <p>Este es un email automático de bienvenida.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Simular envío de email
  async sendEmail(to, subject, templateName, data) {
    try {
      // En producción, aquí se haría la llamada real a la API de email
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
        status: 'simulated', // En producción sería 'sent', 'delivered', etc.
        simulated: true
      };

      this.sentEmails.push(emailRecord);
      
      console.log(`📧 Email simulado enviado a ${to}:`, {
        subject,
        template: templateName,
        emailId: emailRecord.id
      });

      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        emailId: emailRecord.id,
        message: 'Email simulado enviado exitosamente',
        record: emailRecord
      };

    } catch (error) {
      console.error('❌ Error enviando email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar confirmación de cita
  async sendAppointmentConfirmation(appointment) {
    const { leadEmail, leadName, date, time, duration, modality, topic } = appointment;
    
    if (!leadEmail) {
      console.warn('⚠️ No hay email para enviar confirmación de cita');
      return { success: false, error: 'No email provided' };
    }

    return this.sendEmail(
      leadEmail,
      `✅ Confirmación de cita - EdutechLife`,
      'appointmentConfirmation',
      {
        leadName,
        date,
        time,
        duration,
        modality,
        topic
      }
    );
  }

  // Enviar recordatorio 24h antes
  async send24hReminder(appointment) {
    const { leadEmail, leadName, date, time, duration, modality } = appointment;
    
    if (!leadEmail) {
      console.warn('⚠️ No hay email para enviar recordatorio 24h');
      return { success: false, error: 'No email provided' };
    }

    return this.sendEmail(
      leadEmail,
      `⏰ Recordatorio: Tu cita es mañana - EdutechLife`,
      'appointmentReminder24h',
      {
        leadName,
        date,
        time,
        duration,
        modality
      }
    );
  }

  // Enviar recordatorio 1h antes
  async send1hReminder(appointment) {
    const { leadEmail, leadName, date, time, duration, modality, appointmentId } = appointment;
    
    if (!leadEmail) {
      console.warn('⚠️ No hay email para enviar recordatorio 1h');
      return { success: false, error: 'No email provided' };
    }

    return this.sendEmail(
      leadEmail,
      `🎯 ¡Tu cita es en 1 hora! - EdutechLife`,
      'appointmentReminder1h',
      {
        leadName,
        date,
        time,
        duration,
        modality,
        appointmentId
      }
    );
  }

  // Enviar email de bienvenida a nuevo lead
  async sendLeadWelcome(lead) {
    const { email, nombre, interes } = lead;
    
    if (!email) {
      console.warn('⚠️ No hay email para enviar bienvenida');
      return { success: false, error: 'No email provided' };
    }

    return this.sendEmail(
      email,
      `🎓 Bienvenido a EdutechLife - ${nombre}`,
      'leadWelcome',
      {
        nombre,
        interes
      }
    );
  }

  // Verificar y enviar recordatorios pendientes
  async checkAndSendReminders(appointments) {
    const now = new Date();
    const sentEmails = [];

    for (const appointment of appointments) {
      if (appointment.status !== 'scheduled') continue;

      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);

      // Recordatorio de 24 horas
      if (hoursUntilAppointment <= 24 && hoursUntilAppointment > 23.5) {
        const alreadySent = appointment.remindersSent?.some(r => r.type === '24h_email');
        
        if (!alreadySent) {
          const result = await this.send24hReminder(appointment);
          if (result.success) {
            sentEmails.push({
              appointmentId: appointment.id,
              type: '24h_email',
              emailId: result.emailId,
              sentAt: new Date().toISOString()
            });
          }
        }
      }

      // Recordatorio de 1 hora
      if (hoursUntilAppointment <= 1 && hoursUntilAppointment > 0.9) {
        const alreadySent = appointment.remindersSent?.some(r => r.type === '1h_email');
        
        if (!alreadySent) {
          const result = await this.send1hReminder(appointment);
          if (result.success) {
            sentEmails.push({
              appointmentId: appointment.id,
              type: '1h_email',
              emailId: result.emailId,
              sentAt: new Date().toISOString()
            });
          }
        }
      }
    }

    return sentEmails;
  }

  // Obtener emails enviados
  getSentEmails(filter = 'all') {
    let filtered = [...this.sentEmails];
    
    if (filter !== 'all') {
      filtered = filtered.filter(email => email.template === filter);
    }
    
    return filtered.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  }

  // Obtener estadísticas
  getStats() {
    const total = this.sentEmails.length;
    const byTemplate = {};
    
    this.sentEmails.forEach(email => {
      byTemplate[email.template] = (byTemplate[email.template] || 0) + 1;
    });
    
    return {
      total,
      byTemplate,
      lastSent: this.sentEmails.length > 0 ? this.sentEmails[0].sentAt : null
    };
  }

  // Limpiar emails simulados (para testing)
  clearSentEmails() {
    this.sentEmails = [];
    console.log('📧 Emails simulados limpiados');
  }
}

// Instancia singleton
const emailService = new EmailService();

export default emailService;