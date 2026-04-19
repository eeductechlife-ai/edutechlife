import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../LoadingScreen';

/**
 * Página de Dashboard de IA Lab
 * Ruta: /ialab/dashboard
 * Protegida: Requiere autenticación + rol 'ialab'
 * 
 * Muestra estadísticas, usuarios y datos de la plataforma IA Lab
 */
const IALabDashboardPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/ialab');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6">
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
              Volver a IA Lab
            </button>
            <h1 className="text-3xl font-bold text-[#004B63] font-montserrat">Dashboard IA Lab</h1>
            <p className="text-[#64748B] mt-2">
              Estadísticas, usuarios y datos de la plataforma de inteligencia artificial
            </p>
          </div>
        </div>

        {/* Contenido del Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Usuarios Activos */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#004B63]">Usuarios Activos</h3>
              <div className="w-10 h-10 bg-[#4DA8C4]/10 rounded-full flex items-center justify-center">
                <span className="text-[#4DA8C4] text-xl">👥</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#004B63] mb-2">1,247</div>
            <p className="text-[#64748B] text-sm">+12% este mes</p>
          </div>

          {/* Tarjeta de Cursos Completados */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#004B63]">Cursos Completados</h3>
              <div className="w-10 h-10 bg-[#66CCCC]/10 rounded-full flex items-center justify-center">
                <span className="text-[#66CCCC] text-xl">📚</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#004B63] mb-2">3,589</div>
            <p className="text-[#64748B] text-sm">+8% este mes</p>
          </div>

          {/* Tarjeta de Tiempo Promedio */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#004B63]">Tiempo Promedio</h3>
              <div className="w-10 h-10 bg-[#FF6B9D]/10 rounded-full flex items-center justify-center">
                <span className="text-[#FF6B9D] text-xl">⏱️</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#004B63] mb-2">42 min</div>
            <p className="text-[#64748B] text-sm">Por sesión</p>
          </div>

          {/* Gráfico de Actividad */}
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-semibold text-[#004B63] mb-6">Actividad de Usuarios (Últimos 7 días)</h3>
            <div className="h-64 flex items-end gap-2">
              {[65, 80, 75, 90, 85, 95, 88].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-[#4DA8C4] to-[#66CCCC] rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-[#64748B] mt-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Usuarios Recientes */}
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <h3 className="text-lg font-semibold text-[#004B63] mb-6">Usuarios Recientes</h3>
            <div className="space-y-4">
              {[
                { name: 'Ana García', email: 'ana@ejemplo.com', curso: 'IA Básico', tiempo: '45 min' },
                { name: 'Carlos López', email: 'carlos@ejemplo.com', curso: 'Machine Learning', tiempo: '1.5 h' },
                { name: 'María Rodríguez', email: 'maria@ejemplo.com', curso: 'Deep Learning', tiempo: '2 h' },
                { name: 'Juan Pérez', email: 'juan@ejemplo.com', curso: 'Python para IA', tiempo: '30 min' },
                { name: 'Laura Martínez', email: 'laura@ejemplo.com', curso: 'Chatbots', tiempo: '1 h' },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#4DA8C4]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#4DA8C4] font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-[#004B63]">{user.name}</div>
                      <div className="text-sm text-[#64748B]">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#004B63]">{user.curso}</div>
                    <div className="text-sm text-[#64748B]">{user.tiempo}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IALabDashboardPage;