// Servicio de notificaciones del navegador para EdutechLife

class NotificationService {
  constructor() {
    this.permission = null;
    this.notificationSound = null;
    this.initialized = false;
  }

  // Inicializar servicio
  async initialize() {
    if (this.initialized) return true;

    try {
      // Verificar soporte de notificaciones
      if (!('Notification' in window)) {
        console.warn('⚠️ Este navegador no soporta notificaciones de escritorio');
        return false;
      }

      // Solicitar permiso si no está determinado
      if (Notification.permission === 'default') {
        this.permission = await Notification.requestPermission();
      } else {
        this.permission = Notification.permission;
      }

      // Cargar sonido de notificación
      this.notificationSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
      
      this.initialized = true;
      console.log('✅ Servicio de notificaciones inicializado');
      return true;

    } catch (error) {
      console.error('❌ Error inicializando notificaciones:', error);
      return false;
    }
  }

  // Verificar si tenemos permiso
  hasPermission() {
    return this.permission === 'granted';
  }

  // Enviar notificación
  sendNotification(title, options = {}) {
    if (!this.hasPermission()) {
      console.warn('⚠️ No hay permiso para enviar notificaciones');
      return null;
    }

    try {
      const defaultOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        silent: false,
        ...options
      };

      const notification = new Notification(title, defaultOptions);

      // Reproducir sonido si está disponible
      if (this.notificationSound && !defaultOptions.silent) {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch(e => console.warn('No se pudo reproducir sonido:', e));
      }

      // Manejar clic en notificación
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        if (options.onClick) {
          options.onClick();
        }
      };

      // Cerrar automáticamente después de 10 segundos
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;

    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
      return null;
    }
  }

  // Notificación de recordatorio de cita
  sendAppointmentReminder(appointment) {
    const { leadName, date, time, modality, duration } = appointment;
    
    const formattedDate = new Date(date).toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const title = `📅 Recordatorio: Cita con ${leadName}`;
    const body = `${formattedDate} a las ${time}\n${modality === 'videollamada' ? 'Videollamada' : 'Llamada'} de ${duration} minutos`;

    return this.sendNotification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `appointment_${appointment.id}`,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
      data: {
        type: 'appointment_reminder',
        appointmentId: appointment.id,
        timestamp: new Date().toISOString()
      },
      onClick: () => {
        // Enfocar la ventana y mostrar detalles de la cita
        window.focus();
        console.log('📅 Notificación de cita clickeada:', appointment.id);
      }
    });
  }

  // Notificación de confirmación de cita
  sendAppointmentConfirmation(appointment) {
    const { leadName, date, time } = appointment;
    
    const title = `✅ Cita confirmada con ${leadName}`;
    const body = `Tu cita está agendada para el ${new Date(date).toLocaleDateString('es-CO')} a las ${time}`;

    return this.sendNotification(title, {
      body,
      icon: '/favicon.ico',
      tag: `appointment_confirmation_${appointment.id}`,
      requireInteraction: false,
      data: {
        type: 'appointment_confirmation',
        appointmentId: appointment.id
      }
    });
  }

  // Notificación de nuevo lead
  sendNewLeadNotification(lead) {
    const { nombre, interes } = lead;
    
    const title = `👤 Nuevo lead: ${nombre || 'Cliente'}`;
    const body = `Interés: ${interes || 'No especificado'}\nHaz clic para ver detalles`;

    return this.sendNotification(title, {
      body,
      icon: '/favicon.ico',
      tag: `new_lead_${Date.now()}`,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: {
        type: 'new_lead',
        leadId: lead.id,
        timestamp: new Date().toISOString()
      },
      onClick: () => {
        window.focus();
        console.log('👤 Notificación de lead clickeada:', lead.id);
      }
    });
  }

  // Notificación de mensaje nuevo en chat
  sendNewMessageNotification(message, sender) {
    const title = `💬 Nuevo mensaje de ${sender}`;
    const body = message.length > 50 ? `${message.substring(0, 50)}...` : message;

    return this.sendNotification(title, {
      body,
      icon: '/favicon.ico',
      tag: `message_${Date.now()}`,
      requireInteraction: false,
      data: {
        type: 'new_message',
        sender,
        timestamp: new Date().toISOString()
      },
      onClick: () => {
        window.focus();
        console.log('💬 Notificación de mensaje clickeada');
      }
    });
  }

  // Notificación de error o alerta
  sendAlertNotification(title, message, isCritical = false) {
    return this.sendNotification(title, {
      body: message,
      icon: '/favicon.ico',
      tag: `alert_${Date.now()}`,
      requireInteraction: isCritical,
      vibrate: isCritical ? [500, 200, 500, 200, 500] : [200, 100, 200],
      data: {
        type: 'alert',
        isCritical,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Verificar y enviar recordatorios pendientes
  async checkAndSendReminders(appointments) {
    if (!this.hasPermission()) return [];

    const now = new Date();
    const sentReminders = [];

    appointments.forEach(appointment => {
      if (appointment.status !== 'scheduled') return;

      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);

      // Recordatorio de 24 horas
      if (hoursUntilAppointment <= 24 && hoursUntilAppointment > 23.5) {
        const alreadySent = appointment.remindersSent?.some(r => r.type === '24h_browser');
        
        if (!alreadySent) {
          this.sendAppointmentReminder(appointment);
          sentReminders.push({
            appointmentId: appointment.id,
            type: '24h_browser',
            sentAt: new Date().toISOString()
          });
        }
      }

      // Recordatorio de 1 hora
      if (hoursUntilAppointment <= 1 && hoursUntilAppointment > 0.9) {
        const alreadySent = appointment.remindersSent?.some(r => r.type === '1h_browser');
        
        if (!alreadySent) {
          this.sendAppointmentReminder({
            ...appointment,
            title: `⏰ Cita en 1 hora: ${appointment.leadName}`
          });
          sentReminders.push({
            appointmentId: appointment.id,
            type: '1h_browser',
            sentAt: new Date().toISOString()
          });
        }
      }

      // Recordatorio de 15 minutos
      if (hoursUntilAppointment <= 0.25 && hoursUntilAppointment > 0.2) {
        const alreadySent = appointment.remindersSent?.some(r => r.type === '15m_browser');
        
        if (!alreadySent) {
          this.sendNotification(`🎯 Cita en 15 minutos: ${appointment.leadName}`, {
            body: `Prepárate para la ${appointment.modality === 'videollamada' ? 'videollamada' : 'llamada'}`,
            requireInteraction: true,
            vibrate: [400, 200, 400]
          });
          sentReminders.push({
            appointmentId: appointment.id,
            type: '15m_browser',
            sentAt: new Date().toISOString()
          });
        }
      }
    });

    return sentReminders;
  }

  // Limpiar notificaciones antiguas
  clearOldNotifications() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'clearNotifications'
      });
    }
  }

  // Obtener estado del servicio
  getStatus() {
    return {
      initialized: this.initialized,
      permission: this.permission,
      supported: 'Notification' in window,
      soundAvailable: !!this.notificationSound
    };
  }
}

// Instancia singleton
const notificationService = new NotificationService();

export default notificationService;