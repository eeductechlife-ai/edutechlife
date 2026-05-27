import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabProgressContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useFocusTrap from '../../hooks/useFocusTrap';
import { useStudyNotesSync } from '../../hooks/IALab/useStudyNotesSync';
import { useActivityCalendar } from '../../hooks/useActivityCalendar';

// PDF helpers (jsPDF A4 portrait)
const PW = 210, PH = 297, ML = 14, MR = 14, MT = 22, MB = 14;
const CW = PW - ML - MR;
const CP = [0, 75, 99];
const CC = [0, 188, 212];
const CS = [100, 116, 139];
const CD = [30, 41, 59];

let cy = MT;

const pdfResetY = () => { cy = MT; };
const pdfCheckPage = (doc, need) => {
  if (cy + need > PH - MB - 12) {
    addFooter(doc);
    doc.addPage();
    pdfDrawHeader(doc);
  }
};
const addFooter = (doc) => {
  const n = doc.internal.getNumberOfPages();
  doc.setFontSize(7);
  doc.setTextColor(...CS);
  doc.text(`Página ${n}`, PW - MR, PH - MB + 5, { align: 'right' });
  doc.setDrawColor(200, 200, 200);
  doc.line(ML, PH - MB + 2, PW - MR, PH - MB + 2);
};
const pdfDrawHeader = (doc) => {
  doc.setFillColor(...CP);
  doc.rect(0, 0, PW, 17, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Plan de Estudio', ML, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Generado el ${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`, ML, 15);
  cy = MT;
};
const pdfSectionTitle = (doc, text) => {
  pdfCheckPage(doc, 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...CP);
  doc.text(text, ML, cy);
  doc.setFillColor(...CC);
  doc.rect(ML, cy + 1.5, 30, 1.2, 'F');
  cy += 7;
};
const pdfPara = (doc, lines, size = 8.5) => {
  if (!lines || lines.length === 0) return;
  const lineH = size * 0.3528 * 1.35;
  pdfCheckPage(doc, lines.length * lineH + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...CD);
  lines.forEach(l => {
    doc.text(l, ML, cy);
    cy += lineH;
  });
  cy += 2;
};

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
  const { activeMod, modules } = useIALabProgressContext();
  const streak = useIALabStore(s => s.streak);
  const getWeeklyXP = useIALabStore(s => s.getWeeklyXP);
  const [notes, setNotes] = useState(loadNotes);
  const [text, setText] = useState('');
  const [selectedMod, setSelectedMod] = useState(activeMod);
  const [dayNotes, setDayNotes] = useState(loadDayNotes);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayText, setDayText] = useState('');
  const textareaRef = useRef(null);
  const dayTextareaRef = useRef(null);
  const calendar = buildCalendar();
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const monthlyCalendar = useActivityCalendar(calYear, calMonth);

  const goToPrevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };
  const focusTrapRef = useFocusTrap(isOpen);
  const { syncModuleNote, syncDayNote, isConnected } = useStudyNotesSync();

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
    syncModuleNote(selectedMod, val);
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
    syncDayNote(selectedDay, val);
  };

  const handleClearDayNote = () => {
    if (!selectedDay) return;
    const updated = { ...dayNotes };
    delete updated[selectedDay];
    setDayNotes(updated);
    setDayText('');
    saveDayNotes(updated);
    syncDayNote(selectedDay, '');
  };

  const exportNotesPDF = useCallback(async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdfResetY();

    pdfDrawHeader(doc);

    // Sección 1: Notas por módulo
    pdfSectionTitle(doc, 'Notas por Módulo');
    const allNotes = loadNotes();
    const allDayNotes = loadDayNotes();
    const moduleIds = Object.keys(allNotes).filter(k => allNotes[k]?.trim());
    if (moduleIds.length > 0) {
      moduleIds.forEach(modId => {
        const mod = modules?.find(m => m.id === Number(modId));
        const title = mod?.title || `Módulo ${modId}`;
        pdfCheckPage(doc, 10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...CC);
        doc.text(`M${modId}: ${title}`, ML, cy);
        cy += 4;
        const content = allNotes[modId];
        const lines = doc.splitTextToSize ? doc.splitTextToSize(content, CW) : [content];
        pdfPara(doc, lines, 8);
      });
    } else {
      pdfPara(doc, ['No hay notas guardadas en ningún módulo.'], 8);
    }

    // Sección 2: Notas del calendario
    if (Object.keys(allDayNotes).length > 0) {
      pdfSectionTitle(doc, 'Notas del Calendario');
      const sortedDates = Object.keys(allDayNotes).sort();
      sortedDates.forEach(dateKey => {
        const [y, m, d] = dateKey.split('-');
        const label = `${d}/${m}/${y}`;
        pdfCheckPage(doc, 10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...CC);
        doc.text(`Día ${label}`, ML, cy);
        cy += 4;
        const content = allDayNotes[dateKey];
        const lines = doc.splitTextToSize ? doc.splitTextToSize(content, CW) : [content];
        pdfPara(doc, lines, 8);
      });
    }

    addFooter(doc);
    doc.save(`plan_estudio_${new Date().toISOString().slice(0, 10)}.pdf`);
  }, [modules]);

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
            <Icon name="fa-calendar" className="text-petroleum text-sm" />
            <h2 className="text-sm font-bold text-petroleum">Plan de Estudio</h2>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={exportNotesPDF} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Exportar PDF" title="Exportar a PDF">
              <Icon name="fa-file-pdf" className="text-slate-600 dark:text-slate-400 text-sm" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Cerrar">
              <Icon name="fa-times" className="text-slate-600 dark:text-slate-400 text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex flex-col gap-5">
            {/* Left: Notes */}
            <div className="">
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
                className="w-full h-[8.5rem] p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50 transition-all duration-200"
                aria-label="Notas del módulo"
              />
            </div>

            {/* Right: Calendar */}
            <div className="">
              <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <button onClick={goToPrevMonth} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 transition-all">‹</button>
                    <span className="text-xs font-bold text-petroleum dark:text-petroleum w-28 text-center">{calendar.label}</span>
                    <button onClick={goToNextMonth} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 transition-all">›</button>
                  </div>
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
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-500">
                  <span>{monthlyCalendar.totalActive} días activos</span>
                  <span>{monthlyCalendar.totalSessions} sesiones</span>
                  <span className="text-amber-500 font-semibold">🔥 {streak}d</span>
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
                    ? `¡Racha impresionante! Sigue así — ${getWeeklyXP().weekly}/${getWeeklyXP().weeklyTarget} XP esta semana.`
                    : streak >= 3
                    ? `Buena racha (${streak} días). ${getWeeklyXP().dailyAvg} XP/día de promedio esta semana.`
                    : `Meta: 20 min diarios. Esta semana llevas ${getWeeklyXP().weekly} de ${getWeeklyXP().weeklyTarget} XP.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-3">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            <Icon name="fa-check" className="text-[9px] mr-1 text-emerald-500" />
            Las notas se guardan automáticamente
          </p>
          {isConnected && (
            <span className="text-[9px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Cloud
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlannerModal;
