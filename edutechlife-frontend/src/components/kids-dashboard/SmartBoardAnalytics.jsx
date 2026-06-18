import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, CartesianGrid, Cell } from 'recharts';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

const dc = (dm, l, d) => dm ? d : l;
const COLORS = ['#4DA8C4', '#66CCCC', '#FF6B9D', '#FFD166', '#A855F7', '#22C55E'];

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const subjects = ['Mat', 'Len', 'Cie', 'Soc', 'Ing'];

const MetricCard = memo(({ icon, title, children, darkMode, color = '#4DA8C4' }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    className={`rounded-2xl border overflow-hidden ${dc(darkMode, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0] shadow-sm')}`}
  >
    <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: darkMode ? '#334155' : '#E2E8F0' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${color}20` }}>
        {icon}
      </div>
      <h3 className={`text-sm font-bold ${dc(darkMode, 'text-white', 'text-[#004B63]')}`}>{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </motion.div>
));

const SmartBoardAnalytics = memo(() => {
  const { darkMode: dm, totalPoints, streak, missions } = useSmartBoardKids();

  const subjectData = useMemo(() => [
    { name: 'Matemáticas', value: 78, color: '#4DA8C4' },
    { name: 'Lenguaje', value: 92, color: '#FF6B9D' },
    { name: 'Ciencias', value: 65, color: '#66CCCC' },
    { name: 'Sociales', value: 88, color: '#FFD166' },
    { name: 'Inglés', value: 72, color: '#A855F7' },
  ], []);

  const weeklyData = useMemo(() =>
    weekDays.map((day, i) => ({ name: day, value: Math.floor(Math.random() * 120) + 30 })), []);

  const predictionData = useMemo(() =>
    ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Proy.'].map((name, i) => ({
      name, value: i < 4 ? Math.floor(Math.random() * 40) + 50 : 75,
    })), []);

  const scatterData = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: Math.floor(Math.random() * 60) + 10,
      y: Math.floor(Math.random() * 40) + 40,
      name: `Sesión ${i + 1}`,
    })), []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#22C55E] flex items-center justify-center text-lg shadow-md">📈</div>
        <div>
          <h3 className={`text-lg font-bold ${dc(dm, 'text-[#E2F0FF]', 'text-[#004B63]')}`}>Analítica Avanzada</h3>
          <p className={`text-xs ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Rendimiento, predicciones y hábitos de estudio</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard icon="🚀" title="Velocidad de Aprendizaje" darkMode={dm} color="#4DA8C4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.value > 80 ? '#22C55E' : entry.value > 50 ? '#4DA8C4' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className={`text-xs text-center mt-2 ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Minutos de estudio por día</p>
        </MetricCard>

        <MetricCard icon="🔥" title="Heatmap de Materias" darkMode={dm} color="#FF6B9D">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-1 min-w-[250px]">
              <div className="text-[10px] text-[#64748B] font-medium"></div>
              {weekDays.slice(0, 5).map(d => (
                <div key={d} className="text-[10px] text-[#64748B] font-medium text-center">{d}</div>
              ))}
              {subjects.map(subj => (
                <>
                  <div className="text-[10px] text-[#64748B] font-medium py-2">{subj}</div>
                  {weekDays.slice(0, 5).map(day => {
                    const val = Math.floor(Math.random() * 100);
                    const intensity = val > 80 ? 'bg-green-400' : val > 60 ? 'bg-[#4DA8C4]' : val > 40 ? 'bg-[#66CCCC]' : val > 20 ? 'bg-[#FFD166]' : 'bg-gray-200';
                    return (
                      <div key={`${subj}-${day}`}
                        className={`w-full aspect-square rounded ${intensity} flex items-center justify-center`}
                        title={`${subj} ${day}: ${val}%`}
                      >
                        <span className="text-[8px] text-white font-bold">{val > 30 ? `${val}` : ''}</span>
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </MetricCard>

        <MetricCard icon="🎯" title="Predicción de Rendimiento" darkMode={dm} color="#A855F7">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={predictionData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#A855F7" strokeWidth={2} dot={{ fill: '#A855F7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className={`text-xs text-center mt-2 ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>
            Proyección: {predictionData[predictionData.length - 1]?.value || 0}% estimado
          </p>
        </MetricCard>

        <MetricCard icon="⏱️" title="Tiempo vs Resultados" darkMode={dm} color="#22C55E">
          <ResponsiveContainer width="100%" height={180}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#334155' : '#E2E8F0'} />
              <XAxis dataKey="x" name="minutos" tick={{ fontSize: 10 }} label={{ value: 'Minutos', position: 'bottom', fontSize: 10 }} />
              <YAxis dataKey="y" name="nota" tick={{ fontSize: 10 }} label={{ value: 'Nota', angle: -90, position: 'insideLeft', fontSize: 10 }} />
              <Tooltip formatter={(v) => [`${v}`, 'Valor']} />
              <Scatter data={scatterData} fill="#4DA8C4" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className={`text-xs text-center mt-2 ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Correlación: más tiempo = mejores resultados</p>
        </MetricCard>

        <MetricCard icon="💪" title="Racha por Materia" darkMode={dm} color="#FFD166" className="md:col-span-2">
          <div className="space-y-3">
            {subjectData.map((subj, i) => (
              <div key={subj.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: subj.color }} />
                <span className={`text-xs font-semibold w-20 ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{subj.name}</span>
                <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${subj.value}%` }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${subj.color}, ${subj.color}dd)` }}
                  />
                </div>
                <span className={`text-xs font-bold w-10 text-right ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}>{subj.value}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: dm ? '#334155' : '#E2E8F0' }}>
            <div className="text-center">
              <p className={`text-lg font-black ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{streak || 0}</p>
              <p className={`text-[10px] ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Racha actual</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-black ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{totalPoints || 0}</p>
              <p className={`text-[10px] ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Puntos totales</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-black ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{missions?.filter(m => m.completed).length || 0}</p>
              <p className={`text-[10px] ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Misiones</p>
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
});

SmartBoardAnalytics.displayName = 'SmartBoardAnalytics';
export { SmartBoardAnalytics };
export default SmartBoardAnalytics;
