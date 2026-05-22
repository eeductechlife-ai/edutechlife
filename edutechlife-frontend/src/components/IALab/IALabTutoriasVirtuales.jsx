import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Clock } from 'lucide-react';

const MEETING_URL = 'https://meet.google.com/ywc-jumh-wnh';
const TUTORIA_HOUR = 16; // 4 PM
const TUTORIA_END_HOUR = 18; // 6 PM
const TUTORIA_DAY = 0; // Sunday

/**
 * Obtiene la hora actual en Bogotá (UTC-5)
 */
const getBogotaNow = () => {
  const now = new Date();
  const bogotaStr = now.toLocaleString('en-US', { timeZone: 'America/Bogota' });
  return new Date(bogotaStr);
};

/**
 * Calcula el tiempo restante hasta el próximo domingo a las 4:00 PM Bogotá
 */
const getTimeUntilNextTutoria = () => {
  const now = getBogotaNow();
  const daysUntilSunday = (TUTORIA_DAY - now.getDay() + 7) % 7 || 7;
  
  const nextTutoria = new Date(now);
  nextTutoria.setDate(now.getDate() + daysUntilSunday);
  nextTutoria.setHours(TUTORIA_HOUR, 0, 0, 0);
  
  // Si ya pasaron las 4 PM de hoy (domingo), ir al siguiente domingo
  if (now.getDay() === TUTORIA_DAY && now.getHours() >= TUTORIA_END_HOUR) {
    nextTutoria.setDate(now.getDate() + 7);
  }
  
  const diff = nextTutoria - now;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

/**
 * Verifica si la tutoría está activa (domingo 4-6 PM Bogotá)
 */
const isTutoriaActive = () => {
  const now = getBogotaNow();
  return (
    now.getDay() === TUTORIA_DAY &&
    now.getHours() >= TUTORIA_HOUR &&
    now.getHours() < TUTORIA_END_HOUR
  );
};

const IALabTutoriasVirtuales = () => {
  const [active, setActive] = useState(isTutoriaActive());
  const [countdown, setCountdown] = useState(getTimeUntilNextTutoria());

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(isTutoriaActive());
      if (!isTutoriaActive()) {
        setCountdown(getTimeUntilNextTutoria());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = () => {
    const parts = [];
    if (countdown.days > 0) parts.push(`${countdown.days}d`);
    if (countdown.hours > 0) parts.push(`${countdown.hours}h`);
    parts.push(`${countdown.minutes}m`);
    parts.push(`${countdown.seconds}s`);
    return parts.join(' ');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
      transition={{ duration: 0.2 }}
      className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 md:p-8 overflow-hidden"
    >
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-petroleum/6 to-corporate/4 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-petroleum/4 to-corporate/4 rounded-full blur-2xl pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center flex-shrink-0">
            <Video className="text-white text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg md:text-xl font-bold text-petroleum">
                Tutorías Virtuales en Vivo
              </h3>
              {active && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  EN VIVO
                </span>
              )}
            </div>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed mt-2">
              ¿Tienes alguna dificultad durante el curso? Te acompañamos en tu proceso.
              Únete a nuestras tutorías virtuales todos los domingos a las 4:00 PM
              para resolver tus dudas en directo.
            </p>
            {!active && (
              <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>
                  Próxima tutoría en <span className="font-semibold text-petroleum font-mono">{formatCountdown()}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {active ? (
          <motion.a
            href={MEETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300"
          >
            <Video className="w-4 h-4" />
            Unirse a la Sala
          </motion.a>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-not-allowed select-none"
          >
            <Video className="w-4 h-4" />
            Disponible en vivo
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default IALabTutoriasVirtuales;
