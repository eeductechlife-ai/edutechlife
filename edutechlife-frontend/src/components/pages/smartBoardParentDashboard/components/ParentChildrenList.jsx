import { motion } from 'framer-motion';
import { Activity, Calendar } from 'lucide-react';
import { useTranslation } from '../../../../i18n/I18nProvider';

const ParentChildrenList = ({ sessions, events }) => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Sessions Today */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
        <h3 className="text-sm font-bold text-[#004B63] mb-4">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#4DA8C4]" />
            Sesiones de hoy
          </span>
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sessions.filter(s => {
            const d = new Date(s.start || s.date || s.timestamp);
            return d.toDateString() === new Date().toDateString();
          }).length === 0 && (
            <p className="text-xs text-[#94A3B8] text-center py-4">No hay sesiones registradas hoy</p>
          )}
          {sessions.filter(s => {
            const d = new Date(s.start || s.date || s.timestamp);
            return d.toDateString() === new Date().toDateString();
          }).reverse().slice(0, 10).map((s, i) => {
            const start = new Date(s.start || s.date || s.timestamp);
            const duration = s.duration || (s.end ? Math.floor((new Date(s.end) - start) / 60000) : 0);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between py-2 border-b border-[#F8FAFC] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#66CCCC]" />
                  <span className="text-xs text-[#64748B]">
                    {start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#004B63]">
                  {duration > 0 ? `${duration} min` : 'En curso'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Calendar Events */}
      {events.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#FF6B9D]" />
            <h3 className="text-sm font-bold text-[#004B63]">{t('smartboard.upcoming_events', { count: events.length })}</h3>
          </div>
          <div className="space-y-2">
            {events.slice(-5).reverse().map((event, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-[#94A3B8]">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                <span className="font-medium text-[#004B63]">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentChildrenList;
