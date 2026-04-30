import React from 'react';
import { UserButton } from '@clerk/react';
import { cn } from '../../forum/forumDesignSystem';
import { 
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  Star,
  Award
} from 'lucide-react';

const SidebarUserSection = ({ 
  user = {},
  onSignOut,
  onSettings,
  className = ''
}) => {
  const userStats = {
    streak: 7,
    level: 'Avanzado',
    points: 1245,
    badges: 3,
    completedCourses: 2,
    enrolledCourses: 5
  };

  const userOptions = [
    { id: 'profile', label: 'Mi Perfil', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-3.5 h-3.5" /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-3.5 h-3.5" /> },
    { id: 'security', label: 'Seguridad', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'billing', label: 'Facturación', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'help', label: 'Ayuda', icon: <HelpCircle className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header de sección */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 text-[#004B63]">
          <User className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[#004B63]">
          Mi Cuenta
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/10 to-transparent" />
      </div>

      {/* User Card premium */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />
        <div className="p-3 pt-4">
          <div className="flex items-center gap-3">
            {/* Avatar con Clerk */}
            <div className="relative">
              <div className="transform scale-110 hover:scale-125 transition-transform duration-200">
                <UserButton 
                  appearance={{
                    elements: {
                      rootBox: "w-12 h-12",
                      avatarBox: "w-12 h-12 border-2 border-white shadow-sm hover:shadow transition-all duration-200",
                      userButtonAvatarImage: "rounded-full"
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>

              {/* Badge de nivel */}
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white text-[10px] font-bold border-2 border-white shadow-sm">
                {userStats.level.charAt(0)}
              </div>
            </div>

            {/* Información del usuario */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800 truncate">
                {user.name || 'Usuario'}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {user.email || 'usuario@edutechlife.com'}
              </p>

              {/* Badges rápidos */}
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center gap-0.5">
                  <div className="p-0.5 rounded bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10">
                    <Star className="w-3 h-3 text-[#004B63]" />
                  </div>
                  <span className="text-[10px] text-[#004B63] font-medium">
                    {userStats.points} pts
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-0.5">
                  <div className="p-0.5 rounded bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10">
                    <Award className="w-3 h-3 text-[#004B63]" />
                  </div>
                  <span className="text-[10px] text-[#004B63] font-medium">
                    {userStats.badges} badges
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Streak y estadísticas */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/60">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">
                {userStats.streak}
              </div>
              <div className="text-[10px] text-slate-500">
                Días racha
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">
                {userStats.completedCourses}
              </div>
              <div className="text-[10px] text-slate-500">
                Completados
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">
                {userStats.enrolledCourses}
              </div>
              <div className="text-[10px] text-slate-500">
                Inscritos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opciones de usuario */}
      <div className="space-y-1">
        {userOptions.map(option => (
          <button
            key={option.id}
            onClick={() => {
              if (option.id === 'settings') onSettings?.();
              if (option.id === 'profile') {
                console.log('Navigate to profile');
              }
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 text-[#004B63] group-hover:from-[#004B63]/20 group-hover:to-[#00BCD4]/20 transition-all duration-300">
                {option.icon}
              </div>
              <span className="text-sm text-slate-700 font-medium group-hover:text-slate-800">
                {option.label}
              </span>
            </div>

            {option.id === 'notifications' && (
              <div className="px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-medium">
                3
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Botón de cerrar sesión */}
      <button
        onClick={onSignOut}
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200/60 border-l-4 border-l-rose-400 shadow-sm hover:shadow hover:border-l-rose-500 hover:bg-rose-50/50 transition-all duration-300 group"
      >
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-400/10 to-rose-500/10 text-rose-500 group-hover:from-rose-400/20 group-hover:to-rose-500/20 transition-all duration-300">
          <LogOut className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-rose-600 group-hover:text-rose-700 transition-colors duration-300">Cerrar sesión</span>
      </button>

      {/* Footer con información de cuenta */}
      <div className="pt-2 mt-2 border-t border-slate-200/60">
        <p className="text-[10px] text-slate-500 text-center">
          Último acceso: Hoy, 14:30
        </p>
        <p className="text-[10px] text-slate-400 text-center mt-0.5">
          Plan: Premium • Renovación: 15/05/2024
        </p>
      </div>
    </div>
  );
};

export default SidebarUserSection;
