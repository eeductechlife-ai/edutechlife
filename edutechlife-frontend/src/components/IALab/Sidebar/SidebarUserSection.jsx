import React from 'react';
import { UserButton } from '@clerk/react';
import { cn } from '../../forum/forumDesignSystem';
import { CompactTypography } from '../GlassDesignSystem';
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

/**
 * SidebarUserSection - Sección premium de usuario con Clerk integration
 * Componente presentacional para gestión de cuenta y perfil
 * 
 * @param {Object} props
 * @param {Object} props.user - Datos del usuario actual
 * @param {Function} props.onSignOut - Callback para cerrar sesión
 * @param {Function} props.onSettings - Callback para abrir configuración
 * @param {string} props.className - Clases CSS adicionales
 */
const SidebarUserSection = ({ 
  user = {},
  onSignOut,
  onSettings,
  className = ''
}) => {
  // Datos de ejemplo para badges y estadísticas
  const userStats = {
    streak: 7,
    level: 'Avanzado',
    points: 1245,
    badges: 3,
    completedCourses: 2,
    enrolledCourses: 5
  };

  // Opciones de usuario
  const userOptions = [
    { id: 'profile', label: 'Mi Perfil', icon: <User className="w-3.5 h-3.5" />, color: 'text-cyan-600' },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-3.5 h-3.5" />, color: 'text-slate-600' },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-3.5 h-3.5" />, color: 'text-amber-600' },
    { id: 'security', label: 'Seguridad', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-emerald-600' },
    { id: 'billing', label: 'Facturación', icon: <CreditCard className="w-3.5 h-3.5" />, color: 'text-purple-600' },
    { id: 'help', label: 'Ayuda', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'text-blue-600' }
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header de sección */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-1.5 rounded-md",
          "bg-cyan-500/10",
          "text-cyan-600"
        )}>
          <User className="w-4 h-4" />
        </div>
        <h3 className={cn(
          CompactTypography.SUBHEADING,
          "text-slate-800 font-semibold"
        )}>
          Mi Cuenta
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-transparent" />
      </div>

      {/* User Card premium */}
      <div className={cn(
        "p-3 rounded-xl",
        "bg-gradient-to-br from-white/85 to-cyan-50/30",
        "border border-cyan-100/50",
        "shadow-[0_4px_20px_rgba(0,188,212,0.08)]"
      )}>
        <div className="flex items-center gap-3">
          {/* Avatar con Clerk */}
          <div className="relative">
            <div className={cn(
              "transform scale-110",
              "hover:scale-125",
              "transition-transform duration-200"
            )}>
              <UserButton 
                appearance={{
                  elements: {
                    rootBox: "w-12 h-12",
                    avatarBox: cn(
                      "w-12 h-12",
                      "border-2 border-white",
                      "shadow-[0_4px_15px_rgba(0,188,212,0.25)]",
                      "hover:shadow-[0_6px_20px_rgba(0,188,212,0.35)]",
                      "transition-all duration-200"
                    ),
                    userButtonAvatarImage: "rounded-full",
                    userButtonTrigger: cn(
                      "bg-gradient-to-r from-cyan-600 to-cyan-500",
                      "hover:from-cyan-700 hover:to-cyan-600",
                      "transition-all duration-300"
                    )
                  }
                }}
                afterSignOutUrl="/"
              />
            </div>

            {/* Badge de nivel */}
            <div className={cn(
              "absolute -bottom-1 -right-1",
              "px-1.5 py-0.5 rounded-full",
              "bg-gradient-to-r from-amber-500 to-amber-400",
              "text-white text-xs font-bold",
              "border border-white",
              "shadow-sm"
            )}>
              {userStats.level.charAt(0)}
            </div>
          </div>

          {/* Información del usuario */}
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              CompactTypography.SUBHEADING,
              "text-slate-800 font-bold truncate"
            )}>
              {user.name || 'Usuario'}
            </h4>
            <p className={cn(
              CompactTypography.TINY,
              "text-slate-500 truncate"
            )}>
              {user.email || 'usuario@edutechlife.com'}
            </p>

            {/* Badges rápidos */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-500" />
                <span className={cn(CompactTypography.MICRO, "text-amber-600 font-medium")}>
                  {userStats.points} pts
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-0.5">
                <Award className="w-3 h-3 text-purple-500" />
                <span className={cn(CompactTypography.MICRO, "text-purple-600 font-medium")}>
                  {userStats.badges} badges
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Streak y estadísticas */}
        <div className={cn(
          "grid grid-cols-3 gap-2",
          "mt-3 pt-3",
          "border-t border-cyan-100/50"
        )}>
          <div className="text-center">
            <div className={cn(
              CompactTypography.HEADING,
              "text-slate-800 font-bold"
            )}>
              {userStats.streak}
            </div>
            <div className={cn(
              CompactTypography.MICRO,
              "text-slate-500"
            )}>
              Días racha
            </div>
          </div>

          <div className="text-center">
            <div className={cn(
              CompactTypography.HEADING,
              "text-slate-800 font-bold"
            )}>
              {userStats.completedCourses}
            </div>
            <div className={cn(
              CompactTypography.MICRO,
              "text-slate-500"
            )}>
              Completados
            </div>
          </div>

          <div className="text-center">
            <div className={cn(
              CompactTypography.HEADING,
              "text-slate-800 font-bold"
            )}>
              {userStats.enrolledCourses}
            </div>
            <div className={cn(
              CompactTypography.MICRO,
              "text-slate-500"
            )}>
              Inscritos
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
                // Navegar a perfil
                console.log('Navigate to profile');
              }
            }}
            className={cn(
              "w-full flex items-center justify-between",
              "p-2.5 rounded-lg",
              "bg-white/50 backdrop-blur-sm",
              "border border-white/30",
              "hover:bg-white/70",
              "transition-all duration-150",
              "group"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "p-1.5 rounded-md",
                "bg-slate-100",
                option.color,
                "group-hover:bg-slate-200",
                "transition-colors duration-150"
              )}>
                {option.icon}
              </div>
              <span className={cn(
                CompactTypography.BODY,
                "text-slate-700 font-medium",
                "group-hover:text-slate-800"
              )}>
                {option.label}
              </span>
            </div>

            {/* Indicador (opcional) */}
            {option.id === 'notifications' && (
              <div className={cn(
                "px-1.5 py-0.5 rounded-full",
                "bg-rose-500/10",
                "text-rose-600 text-xs font-medium"
              )}>
                3
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Botón de cerrar sesión */}
      <button
        onClick={onSignOut}
        className={cn(
          "w-full flex items-center justify-center gap-2",
          "p-2.5 rounded-lg",
          "bg-white/60 backdrop-blur-sm",
          "border border-white/30",
          "text-slate-700 text-sm font-medium",
          "hover:bg-white/80 hover:text-slate-800",
          "transition-all duration-150",
          "group"
        )}
      >
        <LogOut className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
        <span>Cerrar sesión</span>
      </button>

      {/* Footer con información de cuenta */}
      <div className={cn(
        "pt-2 mt-2",
        "border-t border-slate-100/50"
      )}>
        <p className={cn(
          CompactTypography.MICRO,
          "text-slate-500 text-center"
        )}>
          Último acceso: Hoy, 14:30
        </p>
        <p className={cn(
          CompactTypography.MICRO,
          "text-slate-400 text-center mt-0.5"
        )}>
          Plan: Premium • Renovación: 15/05/2024
        </p>
      </div>
    </div>
  );
};

export default SidebarUserSection;