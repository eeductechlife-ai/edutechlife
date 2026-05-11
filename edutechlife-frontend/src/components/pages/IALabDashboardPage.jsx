import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { useIALabStore } from '../../store/ialabStore';
import { Icon } from '../../utils/iconMapping';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50 p-4 md:p-6">
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-48" />
      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-64 mt-2" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-700 rounded-2xl" />)}
      </div>
      <div className="h-72 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
        <div className="h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
      </div>
    </div>
  </div>
);

const IALabDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const store = useIALabStore();

  const isDataReady = isLoaded && store != null;

  const {
    xp,
    streak,
    completedModules,
    courseProgress,
    calculateModuleScore,
    getLevel,
    getLevelProgress,
    getTotalPoints,
    getUserBadges,
    getBadgesSummary,
    getDaysSinceStart,
    modules,
    completedExams,
    challengeScores,
  } = store;

  const level = getLevel();
  const levelProgress = getLevelProgress();
  const totalPoints = getTotalPoints();
  const badges = getUserBadges();
  const badgesSummary = getBadgesSummary();
  const daysSinceStart = getDaysSinceStart();

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const getStreakMessage = () => {
    if (streak >= 30) return '🔥 Legendario!';
    if (streak >= 7) return '🔥 Imparable!';
    if (streak >= 3) return 'Buena racha!';
    return 'Sigue practicando';
  };

  const getPointsMessage = () => {
    if (totalPoints >= 1000) return 'Puntuación máxima alcanzada!';
    return `${1000 - totalPoints} pts para la máxima puntuación`;
  };

  const moduleChartData = useMemo(() =>
    modules.map(mod => ({
      name: `M${mod.id}`,
      fullName: mod.title,
      score: Math.round(calculateModuleScore(mod.id)),
      exam: completedExams?.[mod.id] || 0,
      challenge: challengeScores?.[mod.id] || 0,
    })),
    [modules, calculateModuleScore, completedExams, challengeScores]
  );

  if (!isDataReady) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/ialab')}
              className="text-[#4DA8C4] hover:text-[#66CCCC] flex items-center gap-2 transition-colors mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 rounded"
            >
              <Icon name="fa-arrow-left" className="w-4 h-4" />
              Volver a IA Lab
            </button>
            <h1 className="text-3xl font-bold text-petroleum dark:text-[#4DA8C4] font-montserrat">Dashboard IA Lab</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {user?.fullName ? `Bienvenido, ${user.fullName}` : 'Tu progreso en el curso'}
              {daysSinceStart > 1 && <span className="ml-2 text-xs">· {daysSinceStart} días en la plataforma</span>}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-petroleum to-petroleum-dark flex items-center justify-center text-white text-lg font-bold shadow-md">
              {initials}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-premium-lg transition-shadow group relative"
               title="Los puntos de experiencia se ganan completando lecciones, exámenes y desafíos. Cada 100 XP subes de nivel.">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-petroleum dark:text-[#4DA8C4]">XP Total</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                  <Icon name="fa-award" className="text-corporate text-lg" />
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-petroleum dark:text-white">{xp.toLocaleString()}</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Nivel {level}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-premium-lg transition-shadow group relative"
               title="Tu racha de días consecutivos estudiando. 3 días = bonus de XP, 7 días = bonus mayor, 30 días = bonus legendario.">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-petroleum dark:text-[#4DA8C4]">Racha Actual</h3>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                streak >= 3 ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 'bg-slate-50 dark:bg-slate-700/50'
              }`}>
                <Icon name="fa-fire" className={`text-lg ${streak >= 3 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-petroleum dark:text-white">{streak} días</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{getStreakMessage()}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-premium-lg transition-shadow group relative"
               title="Módulos del curso que has completado con nota mayor o igual a 80%. Se requiere aprobar los 5 módulos para obtener el certificado.">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-petroleum dark:text-[#4DA8C4]">Módulos</h3>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                <Icon name="fa-book-open" className="text-emerald-500 text-lg" />
              </div>
            </div>
            <div className="text-3xl font-bold text-petroleum dark:text-white">{completedModules.length}/5</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Completados</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-premium-lg transition-shadow group relative"
               title="Progreso general del curso. Se calcula como el promedio de los puntajes de los 5 módulos. Necesitas al menos 80% para obtener tu certificado.">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-petroleum dark:text-[#4DA8C4]">Progreso</h3>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                <Icon name="fa-bullseye" className="text-corporate text-lg" />
              </div>
            </div>
            <div className="text-3xl font-bold text-petroleum dark:text-white">{Math.round(courseProgress)}%</div>
            <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
                   style={{ width: `${courseProgress}%` }} />
            </div>
          </div>
        </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="fa-chart-bar" className="text-corporate text-lg" />
            <h3 className="text-lg font-semibold text-petroleum dark:text-[#4DA8C4]">Progreso por Módulo</h3>
          </div>
          {moduleChartData.every(d => d.score === 0) ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                <Icon name="fa-chart-bar" className="text-slate-300 text-2xl" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Aún no hay datos de progreso</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Completa actividades en los módulos para ver tu avance</p>
            </div>
          ) : (
            <>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} role="img" aria-label="Gráfico de barras del progreso por módulo">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value) => [`${value}%`, 'Puntaje']}
                      labelFormatter={(label) => {
                        const mod = moduleChartData.find(d => d.name === label);
                        return mod?.fullName || label;
                      }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {moduleChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.score >= 80 ? '#10B981' : '#4DA8C4'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#4DA8C4]" />
                  <span>En progreso</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Aprobado (mayor o igual a 80%)</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
               title="Cada nivel requiere más XP que el anterior: Nivel 2 = 100 XP, Nivel 3 = 300 XP, Nivel 4 = 600 XP, etc.">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="fa-graduation-cap" className="text-corporate text-lg" />
              <h3 className="text-lg font-semibold text-petroleum dark:text-[#4DA8C4]">Nivel {level}</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-petroleum dark:text-white">{xp} XP</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">/ {level * level * 100} XP</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
                   style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{Math.round(levelProgress)}% hacia el siguiente nivel</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
               title="Los puntos de módulo se calculan segun tu rendimiento en cada modulo. Maximo 200 pts por modulo (1000 pts totales = 5 modulos x 200 pts).">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="fa-trophy" className="text-corporate text-lg" />
              <h3 className="text-lg font-semibold text-petroleum dark:text-[#4DA8C4]">Puntos de Módulo</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-petroleum dark:text-white">{totalPoints}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">/ 1000 pts</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
                   style={{ width: `${(totalPoints / 1000) * 100}%` }} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{getPointsMessage()}</p>
          </div>
        </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon name="fa-star" className="text-corporate text-lg" />
              <h3 className="text-lg font-semibold text-petroleum dark:text-[#4DA8C4]">Insignias</h3>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{badgesSummary.earned}/{badgesSummary.total} obtenidas</span>
          </div>
          {badges.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                <Icon name="fa-star" className="text-slate-300 text-2xl" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">Completa lecciones para ganar insignias</p>
            </div>
          ) : (
            <>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-700"
                     style={{ width: `${(badgesSummary.earned / badgesSummary.total) * 100}%` }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map(badge => (
                  <div key={badge.id}
                    className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-petroleum/5 to-corporate/5 border border-petroleum/10 hover:shadow-md transition-all duration-200 group cursor-default">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                         style={{ backgroundColor: `${badge.color}20` }}>
                      <Icon name={badge.icon} className="text-xl" style={{ color: badge.color }} />
                    </div>
                    <span className="text-sm font-semibold text-petroleum dark:text-[#4DA8C4] text-center">{badge.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">{badge.desc}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Icon name="fa-robot" className="text-corporate text-lg" />
              <h3 className="text-lg font-semibold text-petroleum dark:text-[#4DA8C4]">Detalle por Módulo</h3>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500" title="El puntaje se compone de: Examen 35% + Desafio 30% + Recursos 30% + Comunidad 5%">
              <Icon name="fa-circle-question" className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </span>
          </div>
          <div className="space-y-3">
            {modules.map(mod => {
              const score = Math.round(calculateModuleScore(mod.id));
              const isApproved = score >= 80;
              const examScore = completedExams?.[mod.id];
              const chalScore = challengeScores?.[mod.id];
              return (
                <button
                  key={mod.id}
                  onClick={() => { navigate('/ialab'); useIALabStore.getState().setActiveMod(mod.id); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-sm dark:hover:shadow-premium-lg transition-all duration-200 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    isApproved ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-petroleum to-corporate'
                  }`}>
                    {mod.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-petroleum dark:text-[#4DA8C4] truncate group-hover:text-corporate transition-colors">{mod.title}</span>
                      {isApproved && <Icon name="fa-check-circle" className="text-emerald-500 text-sm flex-shrink-0" />}
                      <Icon name="fa-arrow-right" className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      {examScore && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600" title="Examen">
                          Ex: {examScore}%
                        </span>
                      )}
                      {chalScore && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-600" title="Desafio">
                          Des: {chalScore}%
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{mod.duration}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">·</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{mod.level}</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${
                        isApproved ? 'bg-emerald-500' : 'bg-gradient-to-r from-petroleum to-corporate'
                      }`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-bold ${isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-petroleum dark:text-[#4DA8C4]'}`}>
                      {score}%
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">Puntaje</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IALabDashboardPage;
