import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

const COLORS = {
  NAVY: '#0A1628',
  PETROLEUM: '#004B63',
  CORPORATE: '#4DA8C4',
  MINT: '#66CCCC',
  SOFT_BLUE: '#B2D8E5'
};

// Horarios disponibles por defecto (en formato 24h)
const DEFAULT_AVAILABLE_SLOTS = [
  // Lunes a Viernes
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00',
  // Sábados
  '09:00', '10:00', '11:00', '14:00', '15:00'
];

// Días no disponibles (festivos, etc.)
const UNAVAILABLE_DATES = [
  '2026-01-01', // Año Nuevo
  '2026-12-25', // Navidad
];

const AppointmentScheduler = ({ 
  leadData = {},
  onSchedule,
  onCancel,
  autoFocus = true
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedModality, setSelectedModality] = useState('videollamada');
  const [selectedDuration, setSelectedDuration] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);

  // Inicializar con fecha de hoy o el próximo día hábil
  useEffect(() => {
    const today = new Date();
    const nextAvailable = getNextAvailableDate(today);
    setSelectedDate(nextAvailable);
    generateAvailableSlots(nextAvailable);
  }, []);

  // Generar slots disponibles para una fecha específica
  const generateAvailableSlots = (date) => {
    if (!date) return;
    
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const dateStr = date.toISOString().split('T')[0];
    
    // Verificar si es día no disponible
    if (UNAVAILABLE_DATES.includes(dateStr)) {
      setAvailableSlots([]);
      return;
    }

    // Filtrar slots según día de la semana
    let slots = [...DEFAULT_AVAILABLE_SLOTS];
    
    // Sábados (6) tienen horario reducido
    if (dayOfWeek === 6) {
      slots = slots.filter(slot => 
        ['09:00', '10:00', '11:00', '14:00', '15:00'].includes(slot)
      );
    }
    
    // Domingos (0) no hay disponibilidad
    if (dayOfWeek === 0) {
      slots = [];
    }

    // Simular slots ya reservados (en producción vendría de API)
    const reservedSlots = getReservedSlotsForDate(dateStr);
    const available = slots.filter(slot => !reservedSlots.includes(slot));
    
    setAvailableSlots(available);
    
    // Resetear tiempo seleccionado si no está disponible
    if (selectedTime && !available.includes(selectedTime)) {
      setSelectedTime('');
    }
  };

  // Obtener siguiente fecha disponible
  const getNextAvailableDate = (fromDate) => {
    let date = new Date(fromDate);
    let attempts = 0;
    
    while (attempts < 30) { // Buscar hasta 30 días adelante
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split('T')[0];
      
      // Verificar si es día hábil y no está en fechas no disponibles
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !UNAVAILABLE_DATES.includes(dateStr)) {
        return date;
      }
      
      date.setDate(date.getDate() + 1);
      attempts++;
    }
    
    return new Date(fromDate); // Fallback a fecha original
  };

  // Simular slots reservados (en producción vendría de API)
  const getReservedSlotsForDate = (dateStr) => {
    // Simulación: algunos slots aleatorios reservados
    const reserved = [];
    const hour = new Date().getHours();
    
    // Para hoy, marcar horas pasadas como no disponibles
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr === todayStr) {
      DEFAULT_AVAILABLE_SLOTS.forEach(slot => {
        const slotHour = parseInt(slot.split(':')[0]);
        if (slotHour < hour) {
          reserved.push(slot);
        }
      });
    }
    
    // Agregar algunos slots aleatorios reservados
    if (Math.random() > 0.7) {
      const randomSlot = DEFAULT_AVAILABLE_SLOTS[Math.floor(Math.random() * DEFAULT_AVAILABLE_SLOTS.length)];
      if (!reserved.includes(randomSlot)) {
        reserved.push(randomSlot);
      }
    }
    
    return reserved;
  };

  // Generar días del mes para el calendario
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Días del mes anterior (para completar primera semana)
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isAvailable: false
      });
    }
    
    // Días del mes actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      const isUnavailable = UNAVAILABLE_DATES.includes(dateStr) || dayOfWeek === 0 || dayOfWeek === 6;
      const isAvailable = !isPast && !isUnavailable;
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isPast,
        isUnavailable,
        isAvailable,
        isSelected: selectedDate && date.toDateString() === selectedDate.toDateString()
      });
    }
    
    // Días del próximo mes (para completar última semana)
    const totalCells = 42; // 6 semanas * 7 días
    const nextMonthDays = totalCells - days.length;
    
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isAvailable: false
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    if (!date.isAvailable) return;
    
    setSelectedDate(date.date);
    generateAvailableSlots(date.date);
    setSelectedTime('');
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora');
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear objeto de cita
      const appointment = {
        id: `appt_${Date.now()}`,
        leadId: leadData.id || `lead_${Date.now()}`,
        leadName: leadData.nombreCompleto || leadData.userName || 'Cliente',
        leadPhone: leadData.telefono || '',
        leadEmail: leadData.email || '',
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        modality: selectedModality,
        duration: parseInt(selectedDuration),
        topic: leadData.interesPrincipal || 'Consulta general',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        notes: `Agendado por Nico. Interés: ${leadData.interesPrincipal || 'No especificado'}`
      };

      // Llamar a función de agendamiento
      await onSchedule(appointment);
      
      // Mostrar éxito
      setIsSuccess(true);
      
      // Cerrar automáticamente después de 3 segundos
      setTimeout(() => {
        if (onSchedule) {
          // El padre manejará el cierre
        }
      }, 3000);

    } catch (error) {
      console.error('Error agendando cita:', error);
      alert('Error al agendar la cita. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-CO', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isSuccess) {
    return (
      <div className="animate-fadeIn p-6 rounded-xl" style={{ backgroundColor: COLORS.SOFT_BLUE }}>
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-16 h-16 mb-4" style={{ color: COLORS.PETROLEUM }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.NAVY }}>
            ¡Cita Agendada Exitosamente!
          </h3>
          <div className="bg-white/80 p-4 rounded-lg mb-4 w-full">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                <span style={{ color: COLORS.NAVY }}>
                  <strong>Fecha:</strong> {formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                <span style={{ color: COLORS.NAVY }}>
                  <strong>Hora:</strong> {formatTime(selectedTime)}
                </span>
              </div>
              <div className="flex items-center">
                {selectedModality === 'videollamada' ? (
                  <Video className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                ) : (
                  <Phone className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                )}
                <span style={{ color: COLORS.NAVY }}>
                  <strong>Modalidad:</strong> {selectedModality === 'videollamada' ? 'Videollamada' : 'Llamada telefónica'}
                </span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
                <span style={{ color: COLORS.NAVY }}>
                  <strong>Duración:</strong> {selectedDuration} minutos
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm space-y-2" style={{ color: COLORS.NAVY }}>
            <p>✅ Recibirás recordatorio 24 horas antes</p>
            <p>✅ Enlace de videollamada llegará a tu email</p>
            <p>✅ Puedes reagendar con 24h de anticipación</p>
          </div>
          <p className="text-sm italic mt-4" style={{ color: COLORS.PETROLEUM }}>
            ¡Nos vemos pronto!
          </p>
        </div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  return (
    <div className="animate-slideUp p-4 rounded-xl border-2" style={{ 
      backgroundColor: COLORS.SOFT_BLUE,
      borderColor: COLORS.CORPORATE 
    }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: COLORS.NAVY }}>
          <Calendar className="inline-block w-5 h-5 mr-2" />
          Agendar llamada con especialista
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Cerrar agendador"
          >
            <X className="w-5 h-5" style={{ color: COLORS.NAVY }} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del lead */}
        {leadData.nombreCompleto && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.CORPORATE + '20' }}>
            <p className="text-sm" style={{ color: COLORS.NAVY }}>
              <strong>Cliente:</strong> {leadData.nombreCompleto}
              {leadData.interesPrincipal && (
                <span> • Interés: {leadData.interesPrincipal}</span>
              )}
            </p>
          </div>
        )}

        {/* Calendario */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium" style={{ color: COLORS.NAVY }}>{monthName}</h4>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded hover:bg-white/20"
                style={{ color: COLORS.NAVY }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded hover:bg-white/20"
                style={{ color: COLORS.NAVY }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium py-1" style={{ color: COLORS.PETROLEUM }}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDateSelect(day)}
                disabled={!day.isAvailable}
                className={`
                  h-8 rounded text-sm transition-all
                  ${day.isSelected ? 'ring-2 ring-offset-1' : ''}
                  ${!day.isCurrentMonth ? 'opacity-30' : ''}
                  ${day.isToday ? 'font-bold' : ''}
                  ${day.isPast || day.isUnavailable ? 'cursor-not-allowed' : 'hover:opacity-80'}
                `}
                style={{
                  backgroundColor: day.isSelected ? COLORS.CORPORATE : 
                                  day.isToday ? COLORS.MINT + '40' : 
                                  day.isAvailable ? 'white' : '#f3f4f6',
                  color: day.isSelected ? 'white' : 
                        day.isAvailable ? COLORS.NAVY : '#9ca3af',
                  borderColor: day.isSelected ? COLORS.CORPORATE : 'transparent'
                }}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </div>

        {/* Fecha seleccionada */}
        {selectedDate && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" style={{ color: COLORS.PETROLEUM }} />
              <span style={{ color: COLORS.NAVY }}>
                <strong>Fecha seleccionada:</strong> {formatDate(selectedDate)}
              </span>
            </div>
          </div>
        )}

        {/* Horarios disponibles */}
        {selectedDate && availableSlots.length > 0 && (
          <div>
            <h4 className="font-medium mb-2" style={{ color: COLORS.NAVY }}>
              <Clock className="inline-block w-4 h-4 mr-1" />
              Horarios disponibles
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    selectedTime === slot ? 'ring-2 ring-offset-1' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: selectedTime === slot ? COLORS.CORPORATE : 'white',
                    color: selectedTime === slot ? 'white' : COLORS.NAVY,
                    borderColor: selectedTime === slot ? COLORS.CORPORATE : COLORS.SOFT_BLUE,
                    borderWidth: '1px'
                  }}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDate && availableSlots.length === 0 && (
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#fef2f2' }}>
            <p className="text-sm" style={{ color: '#ef4444' }}>
              No hay horarios disponibles para esta fecha. Por favor selecciona otra.
            </p>
          </div>
        )}

        {/* Configuración de la llamada */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
              Modalidad de la llamada
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="modality"
                  value="videollamada"
                  checked={selectedModality === 'videollamada'}
                  onChange={(e) => setSelectedModality(e.target.value)}
                  className="mr-2"
                />
                <Video className="w-4 h-4 mr-1 inline" />
                <span style={{ color: COLORS.NAVY }}>Videollamada</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="modality"
                  value="llamada"
                  checked={selectedModality === 'llamada'}
                  onChange={(e) => setSelectedModality(e.target.value)}
                  className="mr-2"
                />
                <Phone className="w-4 h-4 mr-1 inline" />
                <span style={{ color: COLORS.NAVY }}>Llamada telefónica</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
              Duración de la llamada
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                backgroundColor: 'white',
                borderColor: COLORS.CORPORATE,
                color: COLORS.NAVY,
                focusRingColor: COLORS.MINT
              }}
            >
              <option value="15">15 minutos (consulta rápida)</option>
              <option value="30">30 minutos (evaluación inicial)</option>
              <option value="45">45 minutos (sesión completa)</option>
              <option value="60">60 minutos (evaluación profunda)</option>
            </select>
          </div>
        </div>

        {/* Resumen */}
        {selectedDate && selectedTime && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.MINT + '20' }}>
            <p className="text-sm font-medium mb-1" style={{ color: COLORS.PETROLEUM }}>
              Resumen de tu cita:
            </p>
            <p className="text-sm" style={{ color: COLORS.NAVY }}>
              {formatDate(selectedDate)} a las {formatTime(selectedTime)}<br />
              {selectedModality === 'videollamada' ? 'Videollamada' : 'Llamada telefónica'} de {selectedDuration} minutos
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={!selectedDate || !selectedTime || isSubmitting}
            className="flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: COLORS.PETROLEUM,
              color: 'white',
              hoverBackgroundColor: COLORS.CORPORATE
            }}
          >
            {isSubmitting ? 'Agendando...' : '✅ Confirmar cita'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: COLORS.NAVY,
                border: `1px solid ${COLORS.NAVY}`,
                hoverBackgroundColor: `${COLORS.NAVY}10`
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Texto informativo */}
        <div className="text-xs space-y-1" style={{ color: COLORS.PETROLEUM }}>
          <p>• Recibirás confirmación por email y WhatsApp</p>
          <p>• Puedes reagendar con 24h de anticipación</p>
          <p>• La llamada es con un especialista de EdutechLife</p>
        </div>
      </form>
    </div>
  );
};

export default AppointmentScheduler;