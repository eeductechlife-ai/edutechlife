import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

/**
 * Página de Estadísticas de SmartBoard
 * Ruta: /smartboard/estadisticas
 * Protegida: Requiere autenticación + rol 'smartboard'
 * 
 * Muestra estadísticas de progreso, rendimiento y actividad en SmartBoard
 */
const SmartBoardStatsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/smartboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={handleBack}
              className="text-[#4DA8C4] hover:text-[#66CCCC] flex items-center gap-2 transition-colors mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a SmartBoard
            </button>
            <h1 className="text-3xl font-bold text-[#004B63] font-montserrat">Estadísticas SmartBoard</h1>
            <p className="text-[#64748B] mt-2">
              Progreso, rendimiento y actividad en la plataforma educativa
            </p>
          </div>
        </div>

        {/* Contenido del Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tarjeta de Progreso General */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#004B63]">Progreso General</h3>
              <div className="w-10 h-10 bg-[#4DA8C4]/10 rounded-full flex items-center justify-center">
                <span className="text-[#4DA8C4] text-xl">📈</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#004B63] mb-2">78%</div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-2">
              <div className="bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] h-2 rounded-full" style={{ width: '78%' }} />
            </div>
            <p className="text-[#64748B] text-sm mt-2">+5% este mes</p>
          </div>

          {/* Tarjeta de Misiones Completadas */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#004B63]">Misiones</h3>
              <div className="w-10 h-10 bg-[#66CCCC]/10 rounded-full flex items-center justify-center">
                <span className="text-[#66CCCC] text-xl">🎯</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#004B63] mb-2">24/30</div>
            <p className="text-[#64748B] text-sm">80% completadas</p>
          </div>

          {/* Tarjeta de Tiempo de Estudio */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#004B63]">Tiempo de Estudio</h3>
              <div className="w-10 h-10 bg-[#FF6B9D]/10 rounded-full flex items-center justify-center">
                <span className="text-[#FF6B9D] text-xl">⏱️</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#004B63] mb-2">42h</div>
            <p className="text-[#64748B] text-sm">Este mes</p>
          </div>

          {/* Tarjeta de Puntuación Promedio */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#004B63]">Puntuación</h3>
              <div className="w-10 h-10 bg-[#FFD166]/10 rounded-full flex items-center justify-center">
                <span className="text-[#FFD166] text-xl">⭐</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#004B63] mb-2">8.7</div>
            <p className="text-[#64748B] text-sm">/10 promedio</p>
          </div>
        </div>

        {/* Sección de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Progreso por Materia */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-semibold text-[#004B63] mb-6">Progreso por Materia</h3>
            <div className="space-y-4">
              {[
                { materia: 'Matemáticas', progreso: 85, color: '#4DA8C4' },
                { materia: 'Ciencias', progreso: 72, color: '#66CCCC' },
                { materia: 'Historia', progreso: 90, color: '#FF6B9D' },
                { materia: 'Idiomas', progreso: 68, color: '#FFD166' },
                { materia: 'Tecnología', progreso: 95, color: '#004B63' },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#004B63] font-medium">{item.materia}</span>
                    <span className="text-[#64748B]">{item.progreso}%</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${item.progreso}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Actividad Semanal */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-semibold text-[#004B63] mb-6">Actividad Semanal</h3>
            <div className="h-64 flex items-end gap-3">
              {[40, 65, 80, 75, 90, 85, 70].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-[#4DA8C4] to-[#66CCCC] rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-[#64748B] mt-2">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                  </div>
                  <div className="text-xs font-medium text-[#004B63] mt-1">{height}m</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logros y Reconocimientos */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="text-lg font-semibold text-[#004B63] mb-6">Logros y Reconocimientos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏆', title: 'Estrella del Mes', desc: 'Mejor rendimiento' },
              { icon: '🚀', title: 'Rápido Aprendiz', desc: 'Completó 5 misiones en 1 día' },
              { icon: '🧠', title: 'Pensador Crítico', desc: '10 respuestas excelentes' },
              { icon: '🤝', title: 'Colaborador', desc: 'Ayudó a 3 compañeros' },
              { icon: '📚', title: 'Voraz Lector', desc: '20 artículos leídos' },
              { icon: '💡', title: 'Innovador', desc: '3 proyectos creativos' },
              { icon: '🎯', title: 'Preciso', desc: '95% de aciertos' },
              { icon: '⏰', title: 'Consistente', desc: '7 días seguidos activo' },
            ].map((logro, index) => (
              <div key={index} className="text-center p-4 hover:bg-slate-50 rounded-lg">
                <div className="text-3xl mb-2">{logro.icon}</div>
                <div className="font-medium text-[#004B63]">{logro.title}</div>
                <div className="text-sm text-[#64748B]">{logro.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBoardStatsPage;