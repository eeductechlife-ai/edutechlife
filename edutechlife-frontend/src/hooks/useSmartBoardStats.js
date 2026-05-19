import { useState, useEffect, useCallback } from 'react';

const PREFIX = 'edutechlife';
const DEFAULT_USER_ID = 'student';
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getInt = (key) => {
  try {
    return parseInt(localStorage.getItem(key) || '0', 10);
  } catch {
    return 0;
  }
};

const getLevel = (points) => {
  if (points >= 5000) return 10;
  if (points >= 4000) return 9;
  if (points >= 3000) return 8;
  if (points >= 2000) return 7;
  if (points >= 1500) return 6;
  if (points >= 1000) return 5;
  if (points >= 600) return 4;
  if (points >= 300) return 3;
  if (points >= 100) return 2;
  return 1;
};

const loadFromStorage = () => {
  const uid = DEFAULT_USER_ID;

  const missions = getItem(`${PREFIX}_missions_${uid}`) || [];
  const subjects = getItem(`${PREFIX}_subjects_${uid}`) || [];
  const totalPoints = getInt(`${PREFIX}_points_${uid}`);
  const totalActiveMinutes = getInt(`${PREFIX}_minutes_${uid}`);

  // parse dates properly after JSON serialization
  const sessions = (getItem(`${PREFIX}_sessions_${uid}`) || []).map(s => ({
    ...s,
    start: s.start ? new Date(s.start) : null,
    end: s.end ? new Date(s.end) : null,
  }));
  const streak = getItem(`${PREFIX}_streak_${uid}`) || { current: 0, longest: 0, lastActive: null };
  const streakLog = getItem(`${PREFIX}_streak_log_${uid}`) || [];
  const vakResult = getItem(`${PREFIX}_vak_${uid}`) || null;

  // Progreso General
  const progresoGeneral = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progress || 0), 0) / subjects.length)
    : 0;

  // Misiones
  const misionesC = missions.filter(m => m.completed).length;
  const misionesT = missions.length;

  // Tiempo
  const horas = Math.floor(totalActiveMinutes / 60);
  const minutos = totalActiveMinutes % 60;

  // Puntuación 0-10
  const ms = misionesT > 0 ? (misionesC / misionesT) * 4 : 0;
  const ss = (progresoGeneral / 100) * 3;
  const st = Math.min(streak.current / 14, 1) * 2;
  const ts = Math.min(totalActiveMinutes / 6000, 1) * 1;
  const puntuacion = Math.round(Math.min(ms + ss + st + ts, 10) * 10) / 10;

  const nivel = getLevel(totalPoints);

  // Materias
  const materias = subjects.map(s => ({
    nombre: s.name,
    progreso: s.progress || 0,
    color: s.color || '#4DA8C4',
  }));

  // Actividad Semanal
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  const byDay = {};
  weekDates.forEach(d => { byDay[d] = 0; });

  sessions.forEach(s => {
    const sd = s.date || (s.start ? s.start.toISOString().split('T')[0] : null);
    if (sd && byDay[sd] !== undefined) {
      byDay[sd] += s.duration || 5;
    }
  });

  streakLog.forEach(entry => {
    if (entry.date && byDay[entry.date] !== undefined && byDay[entry.date] === 0) {
      byDay[entry.date] = Math.max(byDay[entry.date], 15);
    }
  });

  const maxVal = Math.max(...Object.values(byDay), 1);
  const actividadSemanal = weekDates.map((date, i) => ({
    dia: DAYS[i],
    minutos: byDay[date] || 0,
    altura: Math.max(Math.round((byDay[date] / maxVal) * 100), 5),
  }));

  // Logros dinámicos basados en datos reales
  const completedMissions = missions.filter(m => m.completed);
  const logros = [];

  if (completedMissions.length >= misionesT && misionesT > 0)
    logros.push({ icon: 'Trophy', title: 'Estrella del Mes', desc: 'Completaste todas las misiones' });
  if (completedMissions.length >= 5)
    logros.push({ icon: 'Rocket', title: 'Rápido Aprendiz', desc: `${completedMissions.length} misiones completadas` });
  if (totalPoints >= 500)
    logros.push({ icon: 'Gem', title: 'Acumulador', desc: `${totalPoints} puntos acumulados` });
  if (streak.current >= 7)
    logros.push({ icon: 'Clock', title: 'Consistente', desc: `${streak.current} días seguidos activo` });
  if (streak.current >= 3 && streak.current < 7)
    logros.push({ icon: 'Flame', title: 'Racha Activa', desc: `${streak.current} días de racha` });
  if (vakResult)
    logros.push({ icon: 'Brain', title: 'Conoces tu Estilo', desc: `Perfil ${vakResult.predominantStyle}` });
  if (totalActiveMinutes >= 600)
    logros.push({ icon: 'Timer', title: 'Dedicado', desc: `Más de ${horas}h de estudio` });
  if (nivel >= 5)
    logros.push({ icon: 'Star', title: 'Nivel Avanzado', desc: `Nivel ${nivel} alcanzado` });
  if (totalPoints >= 1000)
    logros.push({ icon: 'Target', title: 'Preciso', desc: 'Más de 1000 puntos acumulados' });

  if (logros.length === 0) {
    logros.push({ icon: 'Compass', title: 'Explorador', desc: 'Comienza tu viaje de aprendizaje' });
  }

  return {
    progresoGeneral,
    misiones: { completadas: misionesC, total: misionesT },
    tiempoEstudio: { horas, minutos, totalMinutos: totalActiveMinutes },
    puntuacion: { valor: puntuacion, max: 10 },
    nivel,
    puntos: totalPoints,
    materias,
    actividadSemanal,
    logros,
    racha: streak,
  };
};

export const useSmartBoardStats = () => {
  const [stats, setStats] = useState(loadFromStorage);
  const [isLive, setIsLive] = useState(false);

  const refresh = useCallback(() => {
    setStats(loadFromStorage());
    setIsLive(true);
    const t = setTimeout(() => setIsLive(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key.startsWith(PREFIX)) refresh();
    };
    window.addEventListener('storage', onStorage);
    const interval = setInterval(refresh, 10000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, [refresh]);

  return { ...stats, isLive };
};
