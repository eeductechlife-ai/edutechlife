import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, BellOff, CheckCircle, X, Video, Phone, User, RefreshCw, Download } from 'lucide-react';
import notificationService from '../../utils/notifications';

const COLORS = {
  NAVY: '#0A1628',
  PETROLEUM: '#004B63',
  CORPORATE: '#4DA8C4',
  MINT: '#66CCCC',
  SOFT_BLUE: '#B2D8E5'
};

const AppointmentReminders = ({ 
  appointments = [],
  onRefresh,
  onExport,
  onTestNotification
}) => {
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, today, all
  const [isChecking, setIsChecking] = useState(false);

  // Inicializar servicio de notificaciones
  useEffect(() => {
    const initNotifications = async () => {
      const initialized = await notificationService.initialize();
      if (initialized) {
        setNotificationStatus(notificationService.getStatus());
        setRemindersEnabled(notificationService.hasPermission());
      }
    };
    
    initNotifications();
  }, []);

  // Filtrar citas según el filtro seleccionado
  const filteredAppointments = appointments.filter(appt => {
    if (appt.status !== 'scheduled') return false;
    
    const now = new Date();
    const apptDate = new Date(`${appt.date}T${appt.time}`);
    
    switch (filter) {
      case 'today':
        const today = now.toISOString().split('T')[0];
        return appt.date === today;
      
      case 'upcoming':
        return apptDate > now;
      
      case 'past':
        return apptDate < now;
      
      default:
        return true;
    }
  }).sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  // Solicitar permiso de notificaciones
  const requestNotificationPermission = async () => {
    try {
      setIsChecking(true);
      const initialized = await notificationService.initialize();
      
      if (initialized) {
        const newStatus = notificationService.getStatus();
        setNotificationStatus(newStatus);
        setRemindersEnabled(newStatus.permission === 'granted');
        
        if (newStatus.permission === 'granted') {
          // Enviar notificación de prueba
          notificationService.sendNotification('🔔 Notificaciones activadas', {
            body: 'Ahora recibirás recordatorios de tus citas',
            icon: '/favicon.ico'
          });
        }
      }
    } catch (error) {
      console.error('Error solicitando permiso:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Enviar recordatorio de prueba
  const sendTestReminder = () => {
    if (!notificationService.hasPermission()) {
      alert('Por favor activa las notificaciones primero');
      return;
    }

    const testAppointment = {
      id: 'test_appointment',
      leadName: 'Cliente de Prueba',
      date: new Date().toISOString().split('T')[0],
      time: '15:00',
      modality: 'videollamada',
      duration: 30
    };

    notificationService.sendAppointmentReminder(testAppointment);
    
    if (onTestNotification) {
      onTestNotification();
    }
  };

  // Calcular tiempo hasta la cita
  const getTimeUntilAppointment = (appointment) => {
    const now = new Date();
    const apptDate = new Date(`${appointment.date}T${appointment.time}`);
    const diffMs = apptDate - now;
    
    if (diffMs <= 0) return 'En curso o pasada';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `En ${days} día${days !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `En ${diffHours}h ${diffMinutes}m`;
    } else {
      return `En ${diffMinutes} minutos`;
    }
  };

  // Formatear fecha
  const formatAppointmentDate = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar recordatorios pendientes
  const checkPendingReminders = async () => {
    if (!notificationService.hasPermission()) return;
    
    setIsChecking(true);
    try {
      const sent = await notificationService.checkAndSendReminders(appointments);
      console.log('📨 Recordatorios enviados:', sent.length);
      
      if (sent.length > 0 && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error verificando recordatorios:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border-2" style={{ 
      backgroundColor: COLORS.SOFT_BLUE,
      borderColor: COLORS.CORPORATE 
    }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: COLORS.NAVY }}>
          <Bell className="inline-block w-5 h-5 mr-2" />
          Recordatorios y Agenda
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={checkPendingReminders}
            disabled={isChecking}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
            title="Verificar recordatorios"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} style={{ color: COLORS.NAVY }} />
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              title="Exportar agenda"
            >
              <Download className="w-4 h-4" style={{ color: COLORS.NAVY }} />
            </button>
          )}
        </div>
      </div>

      {/* Estado de notificaciones */}
      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: COLORS.NAVY }}>
              Notificaciones del navegador
            </p>
            <p className="text-sm" style={{ color: COLORS.PETROLEUM }}>
              {notificationStatus?.permission === 'granted' 
                ? '✅ Activadas - Recibirás recordatorios' 
                : notificationStatus?.permission === 'denied'
                ? '❌ Bloqueadas - Actívalas en configuración del navegador'
                : '⚠️ Pendientes - Haz clic para activar'}
            </p>
          </div>
          <button
            onClick={requestNotificationPermission}
            disabled={isChecking || notificationStatus?.permission === 'denied'}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              notificationStatus?.permission === 'granted' 
                ? 'opacity-50 cursor-default' 
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: notificationStatus?.permission === 'granted' 
                ? COLORS.MINT 
                : COLORS.PETROLEUM,
              color: 'white'
            }}
          >
            {isChecking ? 'Verificando...' : 
             notificationStatus?.permission === 'granted' ? 'Activadas' : 
             notificationStatus?.permission === 'denied' ? 'Bloqueadas' : 'Activar'}
          </button>
        </div>
        
        {notificationStatus?.permission === 'granted' && (
          <div className="mt-2 pt-2 border-t" style={{ borderColor: COLORS.SOFT_BLUE }}>
            <button
              onClick={sendTestReminder}
              className="text-sm flex items-center hover:opacity-80 transition-opacity"
              style={{ color: COLORS.CORPORATE }}
            >
              <Bell className="w-3 h-3 mr-1" />
              Enviar recordatorio de prueba
            </button>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['upcoming', 'today', 'past'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === filterType ? 'font-medium' : 'opacity-70'
              }`}
              style={{
                backgroundColor: filter === filterType ? COLORS.CORPORATE : 'white',
                color: filter === filterType ? 'white' : COLORS.NAVY
              }}
            >
              {filterType === 'upcoming' && 'Próximas'}
              {filterType === 'today' && 'Hoy'}
              {filterType === 'past' && 'Pasadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" style={{ color: COLORS.NAVY }} />
            <p style={{ color: COLORS.PETROLEUM }}>
              {filter === 'today' 
                ? 'No hay citas programadas para hoy' 
                : filter === 'upcoming'
                ? 'No hay citas próximas'
                : 'No hay citas'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-3 rounded-lg border transition-all hover:shadow-sm"
              style={{
                backgroundColor: 'white',
                borderColor: COLORS.SOFT_BLUE
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {appointment.modality === 'videollamada' ? (
                    <Video className="w-4 h-4 mr-2" style={{ color: COLORS.CORPORATE }} />
                  ) : (
                    <Phone className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                  )}
                  <div>
                    <p className="font-medium" style={{ color: COLORS.NAVY }}>
                      {appointment.leadName || 'Cliente'}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.PETROLEUM }}>
                      {formatAppointmentDate(appointment.date, appointment.time)}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ 
                  backgroundColor: COLORS.MINT + '20',
                  color: COLORS.PETROLEUM
                }}>
                  {getTimeUntilAppointment(appointment)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <span style={{ color: COLORS.NAVY }}>
                    {appointment.modality === 'videollamada' ? 'Videollamada' : 'Llamada'}
                  </span>
                  <span style={{ color: COLORS.PETROLEUM }}>
                    {appointment.duration || 30} min
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {appointment.remindersSent?.some(r => r.type.includes('browser')) && (
                    <Bell className="w-3 h-3" style={{ color: COLORS.MINT }} title="Recordatorio enviado" />
                  )}
                  {appointment.topic && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                      backgroundColor: COLORS.CORPORATE + '20',
                      color: COLORS.CORPORATE
                    }}>
                      {appointment.topic}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estadísticas */}
      {appointments.length > 0 && (
        <div className="mt-4 pt-3 border-t" style={{ borderColor: COLORS.SOFT_BLUE }}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold" style={{ color: COLORS.NAVY }}>
                {appointments.filter(a => a.status === 'scheduled').length}
              </p>
              <p className="text-xs" style={{ color: COLORS.PETROLEUM }}>Agendadas</p>
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: COLORS.NAVY }}>
                {appointments.filter(a => a.status === 'completed').length}
              </p>
              <p className="text-xs" style={{ color: COLORS.PETROLEUM }}>Completadas</p>
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: COLORS.NAVY }}>
                {filteredAppointments.length}
              </p>
              <p className="text-xs" style={{ color: COLORS.PETROLEUM }}>
                {filter === 'today' ? 'Hoy' : filter === 'upcoming' ? 'Próximas' : 'Filtradas'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información */}
      <div className="mt-4 text-xs space-y-1" style={{ color: COLORS.PETROLEUM }}>
        <p>• Las notificaciones funcionan incluso con la pestaña cerrada</p>
        <p>• Los recordatorios se envían 24h y 1h antes de cada cita</p>
        <p>• Haz clic en "Verificar recordatorios" para enviar manualmente</p>
      </div>
    </div>
  );
};

export default AppointmentReminders;