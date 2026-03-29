import { useState, useCallback, useRef, useEffect } from 'react';

const APPOINTMENTS_STORAGE_KEY = 'edutechlife_appointments';

const useAppointmentScheduling = (options = {}) => {
  const {
    defaultDuration = 30,
    defaultModality = 'videollamada',
    reminderHours = 24,
    maxReschedules = 2
  } = options;

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading appointments:', e);
    }
    return [];
  });

  const [showScheduler, setShowScheduler] = useState(false);
  const [schedulerContext, setSchedulerContext] = useState(null);
  const [recentlyScheduled, setRecentlyScheduled] = useState(null);

  const appointmentsRef = useRef(appointments);

  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  // Guardar citas en localStorage
  const saveAppointments = useCallback((newAppointments) => {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(newAppointments));
    } catch (e) {
      console.error('Error saving appointments:', e);
    }
  }, []);

  // Crear nueva cita
  const scheduleAppointment = useCallback((appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      remindersSent: [],
      rescheduleCount: 0,
      lastUpdated: new Date().toISOString()
    };

    const updatedAppointments = [newAppointment, ...appointments];
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    
    // Guardar recientemente agendada para mostrar confirmación
    setRecentlyScheduled(newAppointment);
    
    // Ocultar scheduler después de agendar
    setTimeout(() => {
      setShowScheduler(false);
      setSchedulerContext(null);
    }, 3000);

    return newAppointment;
  }, [appointments, saveAppointments]);

  // Verificar disponibilidad de fecha/hora
  const checkAvailability = useCallback((date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Verificar si ya hay cita en ese horario
    const conflictingAppointment = appointments.find(appt => {
      const apptDate = new Date(appt.date).toISOString().split('T')[0];
      return apptDate === dateStr && appt.time === time && appt.status === 'scheduled';
    });

    return !conflictingAppointment;
  }, [appointments]);

  // Obtener próximas citas
  const getUpcomingAppointments = useCallback((limit = 5) => {
    const now = new Date();
    
    return appointments
      .filter(appt => {
        const apptDateTime = new Date(`${appt.date}T${appt.time}`);
        return apptDateTime > now && appt.status === 'scheduled';
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, limit);
  }, [appointments]);

  // Obtener citas de hoy
  const getTodayAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return appointments.filter(appt => 
      appt.date === today && 
      appt.status === 'scheduled'
    ).sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments]);

  // Cancelar cita
  const cancelAppointment = useCallback((appointmentId, reason = '') => {
    const updatedAppointments = appointments.map(appt => {
      if (appt.id === appointmentId) {
        return {
          ...appt,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
          lastUpdated: new Date().toISOString()
        };
      }
      return appt;
    });

    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    
    return true;
  }, [appointments, saveAppointments]);

  // Reagendar cita
  const rescheduleAppointment = useCallback((appointmentId, newDate, newTime) => {
    const appointment = appointments.find(appt => appt.id === appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.rescheduleCount >= maxReschedules) {
      throw new Error('Maximum reschedule limit reached');
    }

    // Verificar disponibilidad
    if (!checkAvailability(newDate, newTime)) {
      throw new Error('Time slot not available');
    }

    const updatedAppointments = appointments.map(appt => {
      if (appt.id === appointmentId) {
        return {
          ...appt,
          date: newDate.toISOString().split('T')[0],
          time: newTime,
          rescheduleCount: appt.rescheduleCount + 1,
          lastUpdated: new Date().toISOString(),
          previousDates: [...(appt.previousDates || []), {
            date: appt.date,
            time: appt.time,
            changedAt: new Date().toISOString()
          }]
        };
      }
      return appt;
    });

    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    
    return true;
  }, [appointments, checkAvailability, maxReschedules, saveAppointments]);

  // Completar cita
  const completeAppointment = useCallback((appointmentId, notes = '') => {
    const updatedAppointments = appointments.map(appt => {
      if (appt.id === appointmentId) {
        return {
          ...appt,
          status: 'completed',
          completedAt: new Date().toISOString(),
          completionNotes: notes,
          lastUpdated: new Date().toISOString()
        };
      }
      return appt;
    });

    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    
    return true;
  }, [appointments, saveAppointments]);

  // Verificar recordatorios pendientes
  const checkReminders = useCallback(() => {
    const now = new Date();
    const remindersToSend = [];
    
    appointments.forEach(appt => {
      if (appt.status !== 'scheduled') return;
      
      const apptDateTime = new Date(`${appt.date}T${appt.time}`);
      const hoursUntilAppointment = (apptDateTime - now) / (1000 * 60 * 60);
      
      // Verificar si necesita recordatorio de 24 horas
      if (hoursUntilAppointment <= reminderHours && hoursUntilAppointment > 0) {
        const reminderAlreadySent = appt.remindersSent?.some(
          reminder => reminder.type === '24h'
        );
        
        if (!reminderAlreadySent) {
          remindersToSend.push({
            appointmentId: appt.id,
            type: '24h',
            leadName: appt.leadName,
            leadPhone: appt.leadPhone,
            date: appt.date,
            time: appt.time,
            modality: appt.modality
          });
          
          // Marcar como enviado
          const updatedAppointments = appointments.map(a => {
            if (a.id === appt.id) {
              return {
                ...a,
                remindersSent: [
                  ...(a.remindersSent || []),
                  { type: '24h', sentAt: new Date().toISOString() }
                ]
              };
            }
            return a;
          });
          
          setAppointments(updatedAppointments);
          saveAppointments(updatedAppointments);
        }
      }
      
      // Verificar si necesita recordatorio de 1 hora
      if (hoursUntilAppointment <= 1 && hoursUntilAppointment > 0) {
        const reminderAlreadySent = appt.remindersSent?.some(
          reminder => reminder.type === '1h'
        );
        
        if (!reminderAlreadySent) {
          remindersToSend.push({
            appointmentId: appt.id,
            type: '1h',
            leadName: appt.leadName,
            leadPhone: appt.leadPhone,
            date: appt.date,
            time: appt.time,
            modality: appt.modality
          });
          
          // Marcar como enviado
          const updatedAppointments = appointments.map(a => {
            if (a.id === appt.id) {
              return {
                ...a,
                remindersSent: [
                  ...(a.remindersSent || []),
                  { type: '1h', sentAt: new Date().toISOString() }
                ]
              };
            }
            return a;
          });
          
          setAppointments(updatedAppointments);
          saveAppointments(updatedAppointments);
        }
      }
    });
    
    return remindersToSend;
  }, [appointments, reminderHours, saveAppointments]);

  // Estadísticas
  const getStats = useCallback(() => {
    const now = new Date();
    const pastMonth = new Date();
    pastMonth.setMonth(pastMonth.getMonth() - 1);
    
    const recentAppointments = appointments.filter(appt => 
      new Date(appt.createdAt) > pastMonth
    );
    
    const scheduled = appointments.filter(appt => appt.status === 'scheduled').length;
    const completed = appointments.filter(appt => appt.status === 'completed').length;
    const cancelled = appointments.filter(appt => appt.status === 'cancelled').length;
    
    const completionRate = recentAppointments.length > 0 
      ? (recentAppointments.filter(a => a.status === 'completed').length / recentAppointments.length) * 100
      : 0;
    
    const averageReschedules = recentAppointments.length > 0
      ? recentAppointments.reduce((sum, appt) => sum + (appt.rescheduleCount || 0), 0) / recentAppointments.length
      : 0;
    
    return {
      total: appointments.length,
      scheduled,
      completed,
      cancelled,
      completionRate: Math.round(completionRate),
      averageReschedules: averageReschedules.toFixed(1),
      upcomingCount: getUpcomingAppointments().length,
      todayCount: getTodayAppointments().length
    };
  }, [appointments, getUpcomingAppointments, getTodayAppointments]);

  // Mostrar scheduler
  const showSchedulerWithContext = useCallback((context) => {
    setSchedulerContext(context);
    setShowScheduler(true);
  }, []);

  // Ocultar scheduler
  const hideScheduler = useCallback(() => {
    setShowScheduler(false);
    setSchedulerContext(null);
  }, []);

  // Limpiar recientemente agendada
  const clearRecentlyScheduled = useCallback(() => {
    setRecentlyScheduled(null);
  }, []);

  // Exportar citas a CSV
  const exportAppointmentsToCSV = useCallback(() => {
    const headers = ['ID', 'Cliente', 'Teléfono', 'Email', 'Fecha', 'Hora', 'Duración', 'Modalidad', 'Estado', 'Creado', 'Última Actualización'];
    
    const rows = appointments.map(appt => [
      appt.id,
      appt.leadName || '',
      appt.leadPhone || '',
      appt.leadEmail || '',
      appt.date,
      appt.time,
      `${appt.duration || 30} min`,
      appt.modality === 'videollamada' ? 'Videollamada' : 'Llamada',
      appt.status === 'scheduled' ? 'Agendada' : 
      appt.status === 'completed' ? 'Completada' : 'Cancelada',
      new Date(appt.createdAt).toLocaleString('es-CO'),
      new Date(appt.lastUpdated).toLocaleString('es-CO')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `citas_edutechlife_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [appointments]);

  return {
    // Estado
    appointments,
    showScheduler,
    schedulerContext,
    recentlyScheduled,
    
    // Funciones principales
    scheduleAppointment,
    checkAvailability,
    getUpcomingAppointments,
    getTodayAppointments,
    cancelAppointment,
    rescheduleAppointment,
    completeAppointment,
    checkReminders,
    
    // Control de UI
    showSchedulerWithContext,
    hideScheduler,
    clearRecentlyScheduled,
    
    // Utilidades
    getStats,
    exportAppointmentsToCSV,
    
    // Configuración
    defaultDuration,
    defaultModality
  };
};

export default useAppointmentScheduling;