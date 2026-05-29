import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useFocusTrap from '../../hooks/useFocusTrap';
import { useStudyNotesSync } from '../../hooks/IALab/useStudyNotesSync';
import { useActivityCalendar } from '../../hooks/useActivityCalendar';

const DAY_NOTES_KEY = 'ialab_day_notes';

const loadDayNotes = () => {
  try { return JSON.parse(localStorage.getItem(DAY_NOTES_KEY)) || {}; } catch { return {}; }
};
const saveDayNotes = (dayNotes) => localStorage.setItem(DAY_NOTES_KEY, JSON.stringify(dayNotes));

const formatDate = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const buildCalendar = (months) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = today.getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return { year, month, days, todayDate, label: `${months[month]} ${year}` };
};

const StudyPlannerModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const streak = useIALabStore(s => s.streak);
  const getWeeklyXP = useIALabStore(s => s.getWeeklyXP);
  const DAYS = useMemo(() => [
    t('ialab.study_planner.day_dom'), t('ialab.study_planner.day_lun'), t('ialab.study_planner.day_mar'),
    t('ialab.study_planner.day_mie'), t('ialab.study_planner.day_jue'), t('ialab.study_planner.day_vie'),
    t('ialab.study_planner.day_sab')
  ], [t]);
  const MONTHS = useMemo(() => [
    t('ialab.study_planner.month_enero'), t('ialab.study_planner.month_febrero'), t('ialab.study_planner.month_marzo'),
    t('ialab.study_planner.month_abril'), t('ialab.study_planner.month_mayo'), t('ialab.study_planner.month_junio'),
    t('ialab.study_planner.month_julio'), t('ialab.study_planner.month_agosto'), t('ialab.study_planner.month_septiembre'),
    t('ialab.study_planner.month_octubre'), t('ialab.study_planner.month_noviembre'), t('ialab.study_planner.month_diciembre')
  ], [t]);
  const [dayNotes, setDayNotes] = useState(loadDayNotes);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayText, setDayText] = useState('');
  const dayTextareaRef = useRef(null);
  const calendar = buildCalendar(MONTHS);
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
  const { syncDayNote, isConnected } = useStudyNotesSync();

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setDayNotes(loadDayNotes());
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4" ref={focusTrapRef}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={t('ialab.study_planner.dialog_aria')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Icon name="fa-calendar" className="text-petroleum text-sm" />
            <h2 className="text-sm font-bold text-petroleum">{t('ialab.study_planner.title')}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={t('ialab.study_planner.close_aria')}>
              <Icon name="fa-times" className="text-slate-600 dark:text-slate-400 text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex flex-col gap-5">
            {/* Calendar */}
            <div>
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
                  <span>{t('ialab.study_planner.active_days', { count: monthlyCalendar.totalActive })}</span>
                  <span>{t('ialab.study_planner.sessions', { count: monthlyCalendar.totalSessions })}</span>
                  <span className="text-amber-500 font-semibold">🔥 {streak}d</span>
                </div>
              </div>

              {selectedDay && (
                <div className="mt-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[10px] font-bold text-petroleum flex items-center gap-1">
                      <Icon name="fa-pen" className="text-[9px]" />
                      {t('ialab.study_planner.day_note_label', { date: selectedDay.split('-').reverse().slice(0,2).join('/') })}
                    </h4>
                    <button
                      onClick={handleClearDayNote}
                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label={t('ialab.study_planner.delete_note_aria')}
                    >
                      <Icon name="fa-trash" className="text-[9px] text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                  <textarea
                    ref={dayTextareaRef}
                    value={dayText}
                    onChange={(e) => handleDayNoteChange(e.target.value)}
                    placeholder={t('ialab.study_planner.note_placeholder')}
                    className="w-full h-16 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50 transition-all duration-200"
                    aria-label={t('ialab.study_planner.note_aria')}
                  />
                </div>
              )}

              {/* Study tips */}
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-petroleum/5 to-corporate/5 border border-petroleum/10">
                <h4 className="text-[10px] font-bold text-petroleum mb-1.5 flex items-center gap-1">
                  <Icon name="fa-lightbulb" className="text-[9px]" />
                  {t('ialab.study_planner.daily_tip')}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {streak >= 7
                    ? t('ialab.study_planner.tip_streak_7', { weekly: getWeeklyXP().weekly, target: getWeeklyXP().weeklyTarget })
                    : streak >= 3
                    ? t('ialab.study_planner.tip_streak_3', { streak, avg: getWeeklyXP().dailyAvg })
                    : t('ialab.study_planner.tip_default', { weekly: getWeeklyXP().weekly, target: getWeeklyXP().weeklyTarget })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-3">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            <Icon name="fa-check" className="text-[9px] mr-1 text-emerald-500" />
            {t('ialab.study_planner.auto_save')}
          </p>
          {isConnected && (
            <span className="text-[9px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {t('ialab.study_planner.cloud')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlannerModal;
