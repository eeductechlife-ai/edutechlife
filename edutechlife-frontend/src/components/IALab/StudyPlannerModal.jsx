import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useFocusTrap from '../../hooks/useFocusTrap';

const NOTES_KEY = 'ialab_notes';
const DAY_NOTES_KEY = 'ialab_day_notes';
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const loadNotes = () => {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || {}; } catch { return {}; }
};
const saveNotes = (notes) => localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

const loadDayNotes = () => {
  try { return JSON.parse(localStorage.getItem(DAY_NOTES_KEY)) || {}; } catch { return {}; }
};
const saveDayNotes = (dayNotes) => localStorage.setItem(DAY_NOTES_KEY, JSON.stringify(dayNotes));

const formatDate = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const buildCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = today.getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return { year, month, days, todayDate, label: `${MONTHS[month]} ${year}` };
};

const StudyPlannerModal = ({ isOpen, onClose }) => {
  const { activeMod, modules } = useIALabContext();
  const { streak } = useIALabStore();
  const [notes, setNotes] = useState(loadNotes);
  const [text, setText] = useState('');
  const [selectedMod, setSelectedMod] = useState(activeMod);
  const [dayNotes, setDayNotes] = useState(loadDayNotes);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayText, setDayText] = useState('');
  const textareaRef = useRef(null);
  const dayTextareaRef = useRef(null);
  const calendar = buildCalendar();
  const focusTrapRef = useFocusTrap(isOpen);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setSelectedMod(activeMod);
      const all = loadNotes();
      setNotes(all);
      setText(all[activeMod] || '');
      setDayNotes(loadDayNotes());
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, [isOpen, activeMod]);

  const handleChange = (val) => {
    setText(val);
    const updated = { ...notes, [selectedMod]: val };
    setNotes(updated);
    saveNotes(updated);
  };

  const handleModChange = (modId) => {
    setSelectedMod(modId);
    const all = loadNotes();
    setNotes(all);
    setText(all[modId] || '');
  };

  const handleDaySelect = (day) => {
    if (!day) return;
    const dateKey = formatDate(calendar.year, calendar.month, day);
    setSelectedDay(dateKey);
    const all = loadDayNotes();
    setDayNotes(all);
    setDayText(all[dateKey] || '');
    setTimeout(() => dayTextareaRef.current?.focus(), 100);
  };

  const handleDayNoteChange = (val) => {
    if (!selectedDay) return;
    setDayText(val);
    const updated = { ...dayNotes };
    if (val) {
      updated[selectedDay] = val;
    } else {
      delete updated[selectedDay];
    }
    setDayNotes(updated);
    saveDayNotes(updated);
  };

  const handleClearDayNote = () => {
    if (!selectedDay) return;
    const updated = { ...dayNotes };
    delete updated[selectedDay];
    setDayNotes(updated);
    setDayText('');
    saveDayNotes(updated);
  };

  if (!isOpen) return null;

  const currentMod = modules?.find(m => m.id === selectedMod);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4" ref={focusTrapRef}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Plan de Estudio"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Icon name="fa-book" className="text-petroleum text-sm" />
              <Icon name="fa-calendar" className="text-petroleum text-sm" />
            </div>
            <h2 className="text-sm font-bold text-petroleum">Plan de Estudio</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Cerrar">
            <Icon name="fa-times" className="text-slate-600 dark:text-slate-400 text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Left: Notes */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                {(modules || []).map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => handleModChange(mod.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                      selectedMod === mod.id
                        ? 'bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-petroleum/10'
                    }`}
                  >
                    M{mod.id}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {currentMod?.title || `Módulo ${selectedMod}`}
                </p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">{text.length} caracteres</span>
              </div>

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Escribe tus notas, ideas o preguntas sobre este módulo..."
                className="w-full h-[6.8rem] sm:h-[120px] p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50 transition-all duration-200"
                aria-label="Notas del módulo"
              />
            </div>

            {/* Right: Calendar */}
            <div className="w-full sm:w-56 sm:min-w-[200px]">
              <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-petroleum dark:text-petroleum">{calendar.label}</span>
                  <span className="text-[10px] text-amber-500 font-semibold">🔥 {streak}d</span>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {DAYS.map(d => (
                    <div key={d} className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 py-1">{d}</div>
                  ))}
                  {calendar.days.map((d, i) => {
                    const dateKey = d ? formatDate(calendar.year, calendar.month, d) : null;
                    const hasNote = dateKey && dayNotes[dateKey];
                    const isSelected = dateKey === selectedDay;
                    return (
                      <div
                        key={i}
                        onClick={() => handleDaySelect(d)}
                        className={`relative text-[10px] py-1 rounded cursor-pointer transition-all duration-150 ${
                          d === null ? 'cursor-default' :
                          isSelected ? 'ring-2 ring-petroleum bg-petroleum/15 font-bold text-petroleum' :
                          d === calendar.todayDate ? 'bg-gradient-to-r from-petroleum to-corporate text-white font-bold shadow-sm' :
                          d < calendar.todayDate ? 'bg-petroleum/10 dark:bg-petroleum/20 text-slate-500 dark:text-slate-400 hover:bg-petroleum/20' :
                          'text-slate-600 dark:text-slate-400 hover:bg-petroleum/5'
                        }`}
                      >
                        {d || ''}
                        {hasNote && (
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-petroleum" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">Días pasados</span>
                  <span className="text-[9px] text-amber-500 font-semibold">{streak} días seguidos</span>
                </div>
              </div>

              {selectedDay && (
                <div className="mt-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[10px] font-bold text-petroleum flex items-center gap-1">
                      <Icon name="fa-pen" className="text-[9px]" />
                      Nota del {selectedDay.split('-').reverse().slice(0,2).join('/')}
                    </h4>
                    <button
                      onClick={handleClearDayNote}
                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Eliminar nota del día"
                    >
                      <Icon name="fa-trash" className="text-[9px] text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                  <textarea
                    ref={dayTextareaRef}
                    value={dayText}
                    onChange={(e) => handleDayNoteChange(e.target.value)}
                    placeholder="Escribe una nota para este día..."
                    className="w-full h-16 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50 transition-all duration-200"
                    aria-label="Nota del día"
                  />
                </div>
              )}

              {/* Study tips */}
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-petroleum/5 to-corporate/5 border border-petroleum/10">
                <h4 className="text-[10px] font-bold text-petroleum mb-1.5 flex items-center gap-1">
                  <Icon name="fa-lightbulb" className="text-[9px]" />
                  Consejo del día
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {streak >= 7
                    ? '¡Racha impresionante! Sigue así, la constancia es clave.'
                    : streak >= 3
                    ? 'Buena racha. Revisa tus notas para mantener el ritmo.'
                    : 'Establece una meta diaria. 20 minutos al día marcan la diferencia.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            <Icon name="fa-check" className="text-[9px] mr-1 text-emerald-500" />
            Las notas se guardan automáticamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyPlannerModal;
