import { useMemo } from 'react';
import { useIALabStore } from '../../../store/ialabStore';
import { Icon } from '../../../utils/iconMapping.jsx';

function StreakCalendar() {
  const lastActivityDate = useIALabStore(s => s.lastActivityDate);
  const streak = useIALabStore(s => s.streak);

  const days = useMemo(() => {
    const result = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const last = lastActivityDate ? new Date(lastActivityDate) : null;
    if (last) last.setHours(0, 0, 0, 0);

    for (let i = 27; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      let status = 'inactive';
      if (last) {
        const diff = Math.round((last - date) / 86400000);
        if (diff >= 0 && diff < streak) {
          status = 'active';
        }
      }
      if (date.toDateString() === now.toDateString()) {
        status = last && last.toDateString() === now.toDateString() ? 'today' : 'inactive';
      }
      result.push({ date, status });
    }
    return result;
  }, [lastActivityDate, streak]);

  const dotClass = (status) => {
    const base = 'w-3 h-3 rounded-full ';
    if (status === 'active') return base + 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]';
    if (status === 'today') return base + 'bg-corporate ring-2 ring-corporate/30 shadow-[0_0_6px_rgba(0,188,212,0.4)]';
    return base + 'bg-slate-200';
  };

  const dayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
          <Icon name="fa-fire" className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Racha</p>
          <p className="text-lg font-bold text-petroleum">{streak || 0} días</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((d, i) => (
          <span key={i} className="text-[8px] text-slate-400 text-center font-medium">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div
            key={i}
            className={dotClass(d.status)}
            aria-label={`${d.date.toLocaleDateString('es-ES')} - ${d.status === 'active' ? 'Activo' : d.status === 'today' ? 'Hoy' : 'Inactivo'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default StreakCalendar;
