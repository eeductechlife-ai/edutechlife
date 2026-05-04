import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

// ==========================================
// Calendar Constants
// ==========================================
const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const EVENT_TYPES = {
  tarea: { emoji: '📝', color: '#4DA8C4', label: 'Tarea' },
  examen: { emoji: '📋', color: '#FF6B9D', label: 'Examen' },
  tutoria: { emoji: '👨‍🏫', color: '#66CCCC', label: 'Tutoría' },
  vak: { emoji: '🧠', color: '#FFD166', label: 'VAK' },
  estudio: { emoji: '📚', color: '#004B63', label: 'Estudio' },
  recordatorio: { emoji: '⏰', color: '#B2D8E5', label: 'Recordatorio' },
};

// ==========================================
// Event Creation Modal
// ==========================================
const EventModal = memo(({ isOpen, onClose, onSave, selectedDate }) => {
  const [eventData, setEventData] = useState({
    title: '',
    type: 'tarea',
    time: '08:00',
    description: '',
  });

  const handleSave = () => {
    if (!eventData.title.trim()) return;
    onSave({
      ...eventData,
      date: selectedDate,
      id: Date.now(),
    });
    setEventData({ title: '', type: 'tarea', time: '08:00', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl border border-[#E2E8F0]/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#004B63] mb-4">
          Nueva Actividad - {selectedDate?.toLocaleDateString('es-ES')}
        </h3>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título de la actividad..."
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] text-[#004B63]"
          />
          
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(EVENT_TYPES).map(([key, type]) => (
              <button
                key={key}
                onClick={() => setEventData({ ...eventData, type: key })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  eventData.type === key
                    ? 'border-[#4DA8C4] bg-[#4DA8C4]/10'
                    : 'border-[#E2E8F0] hover:border-[#4DA8C4]/30'
                }`}
              >
                <span className="text-2xl block mb-1">{type.emoji}</span>
                <span className="text-xs text-[#004B63] font-medium">{type.label}</span>
              </button>
            ))}
          </div>
          
          <input
            type="time"
            value={eventData.time}
            onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] text-[#004B63]"
          />
          
          <textarea
            placeholder="Descripción (opcional)..."
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] text-[#004B63] h-24 resize-none"
          />
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#E2E8F0] text-[#64748B] rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

EventModal.displayName = 'EventModal';

// ==========================================
// Calendar Day Component
// ==========================================
const CalendarDay = memo(({ day, events, isToday, isSelected, isCurrentMonth, onClick }) => {
  const dayEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getDate() === day && 
           eventDate.getMonth() === selectedDate?.getMonth() &&
           eventDate.getFullYear() === selectedDate?.getFullYear();
  });

  return (
    <motion.button
      onClick={() => onClick(day)}
      className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
        !isCurrentMonth ? 'opacity-30' : ''
      } ${
        isSelected ? 'bg-[#4DA8C4] text-white font-bold shadow-lg' : 
        isToday ? 'bg-[#4DA8C4]/20 text-[#004B63] font-bold' : 
        'hover:bg-[#F8FAFC] text-[#004B63]'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-xs font-medium">{day}</span>
      {dayEvents.length > 0 && (
        <div className="absolute bottom-1 flex gap-0.5">
          {dayEvents.slice(0, 3).map((event, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: EVENT_TYPES[event.type]?.color || '#4DA8C4' }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
});

CalendarDay.displayName = 'CalendarDay';

// ==========================================
// Main Kids Calendar Component
// ==========================================
const KidsCalendar = memo(() => {
  const { calendarEvents, addCalendarEvent, vakResult } = useSmartBoardKids();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  }, [year, month]);

  const today = new Date();
  const isToday = (day) => 
    day === today.getDate() && 
    month === today.getMonth() && 
    year === today.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDay(new Date(year, month, day));
    setShowEventModal(true);
  };

  const handleSaveEvent = useCallback((event) => {
    addCalendarEvent(event);
  }, [addCalendarEvent]);

  const selectedDayEvents = selectedDay ? 
    calendarEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === selectedDay.getDate() &&
             eventDate.getMonth() === selectedDay.getMonth() &&
             eventDate.getFullYear() === selectedDay.getFullYear();
    }) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center hover:bg-[#4DA8C4]/10 transition-colors"
        >
          ←
        </button>
        <h3 className="text-xl font-bold text-[#004B63]">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={handleNextMonth}
          className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center hover:bg-[#4DA8C4]/10 transition-colors"
        >
          →
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center text-xs font-bold text-[#64748B] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayObj, index) => (
          <CalendarDay
            key={index}
            day={dayObj.day}
            events={calendarEvents}
            isToday={isToday(dayObj.day)}
            isSelected={selectedDay?.getDate() === dayObj.day}
            isCurrentMonth={dayObj.isCurrentMonth}
            onClick={() => dayObj.isCurrentMonth && handleDayClick(dayObj.day)}
            selectedDate={currentDate}
          />
        ))}
      </div>

      {/* VAK Recommendation */}
      {vakResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gradient-to-br from-[#4DA8C4]/10 to-[#66CCCC]/10 rounded-xl border border-[#4DA8C4]/20"
        >
          <p className="text-sm text-[#004B63]">
            <span className="font-bold">💡 Tip VAK ({vakResult.predominantStyle}):</span>{' '}
            {vakResult.predominantStyle === 'visual' && 'Usa colores y mapas para tus tareas este mes.'}
            {vakResult.predominantStyle === 'auditivo' && 'Graba tus notas y escúchalas mientras estudias.'}
            {vakResult.predominantStyle === 'kinestesico' && 'Haz pausas activas cada 30 minutos de estudio.'}
          </p>
        </motion.div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDay}
      />
    </motion.div>
  );
});

KidsCalendar.displayName = 'KidsCalendar';

export default KidsCalendar;
