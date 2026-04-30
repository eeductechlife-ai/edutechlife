import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { cn } from '../../forum/forumDesignSystem';
import { CompactTypography } from '../GlassDesignSystem';
import { 
  BookOpen, 
  Zap, 
  Target, 
  Sparkles, 
  BarChart3,
  Lock,
  CheckCircle,
  PlayCircle,
  Clock
} from 'lucide-react';

/**
 * SidebarModuleList - Lista de módulos premium compacta
 * Componente presentacional para navegación entre módulos con estados visuales
 * 
 * @param {Object} props
 * @param {Array} props.modules - Lista de módulos
 * @param {number} props.activeMod - ID del módulo activo
 * @param {Array} props.completedModules - IDs de módulos completados
 * @param {Function} props.onModuleSelect - Callback al seleccionar módulo
 * @param {Function} props.isModuleLocked - Función para verificar si módulo está bloqueado
 * @param {string} props.className - Clases CSS adicionales
 */
const SidebarModuleList = ({ 
  modules = [],
  activeMod = 1,
  completedModules = [],
  onModuleSelect,
  isModuleLocked,
  className = ''
}) => {
  // Mapeo de iconos por tipo de módulo
  const moduleIcons = {
    1: <BookOpen className="w-3.5 h-3.5" />,
    2: <Zap className="w-3.5 h-3.5" />,
    3: <Target className="w-3.5 h-3.5" />,
    4: <Sparkles className="w-3.5 h-3.5" />,
    5: <BarChart3 className="w-3.5 h-3.5" />
  };

  // Renderizar módulo individual
  const renderModule = (module) => {
    const isActive = activeMod === module.id;
    const isCompleted = completedModules.includes(module.id);
    const isLocked = isModuleLocked?.(module.id) ?? false;
    
    // Configuración por estado
    const stateConfig = {
      active: {
        bg: "bg-white",
        text: "text-[#004B63]",
        iconBg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10",
        iconColor: "text-[#004B63]",
        border: "border-l-4 border-l-[#004B63]",
        shadow: "shadow-sm"
      },
      completed: {
        bg: "bg-white",
        text: "text-slate-800",
        iconBg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10",
        iconColor: "text-[#004B63]",
        border: "border-l-4 border-l-emerald-500",
        shadow: "shadow-sm"
      },
      locked: {
        bg: "bg-slate-50/50",
        text: "text-slate-500",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-400",
        border: "border-l-4 border-l-slate-200",
        shadow: "",
        opacity: "opacity-70"
      },
      default: {
        bg: "bg-white",
        text: "text-slate-700",
        iconBg: "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10",
        iconColor: "text-[#004B63]",
        border: "border-l-4 border-l-[#004B63]",
        shadow: "shadow-sm",
        hover: "hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50"
      }
    };

    const config = isActive 
      ? stateConfig.active 
      : isLocked 
      ? stateConfig.locked 
      : isCompleted 
      ? stateConfig.completed 
      : stateConfig.default;

    return (
      <button
        key={module.id}
        onClick={() => !isLocked && onModuleSelect?.(module.id)}
        disabled={isLocked}
        className={cn(
          "w-full flex items-center gap-2.5",
          "p-3 rounded-xl",
          "border",
          "transition-all duration-150",
          "focus:outline-none focus:ring-1 focus:ring-cyan-300/50 focus:ring-offset-1",
          config.bg,
          config.text,
          config.border,
          config.shadow,
          config.opacity,
          config.hover,
          isLocked && "cursor-not-allowed"
        )}
        aria-label={`${isLocked ? 'Bloqueado: ' : ''}${module.title} - ${module.duration}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Número y icono */}
        <div className="flex items-center gap-2">
          {/* Número del módulo */}
          <div className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center",
            "text-xs font-bold",
            isActive ? "bg-gradient-to-br from-[#004B63]/20 to-[#00BCD4]/20 text-[#004B63]" :
            isCompleted ? "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 text-[#004B63]" :
            isLocked ? "bg-slate-100 text-slate-400" :
            "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 text-[#004B63]"
          )}>
            {module.id}
          </div>

          {/* Icono del módulo */}
          <div className={cn(
            "p-1.5 rounded-lg",
            config.iconBg,
            config.iconColor
          )}>
            {moduleIcons[module.id] || <BookOpen className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Contenido del módulo */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between">
            <h4 className={cn(
              CompactTypography.BODY,
              "font-medium truncate",
              isLocked && "text-slate-500"
            )}>
              {module.title}
            </h4>
            
            {/* Indicador de estado */}
            <div className="flex items-center gap-1">
              {isLocked && (
                <Lock className="w-3 h-3 text-slate-400" />
              )}
              {isCompleted && !isActive && (
                <CheckCircle className="w-3 h-3 text-emerald-500" />
              )}
              {isActive && (
                <PlayCircle className="w-3 h-3 text-[#004B63]" />
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className={cn(
                CompactTypography.MICRO,
                isActive ? "text-[#004B63]/70" : "text-slate-500"
              )}>
                {module.duration}
              </span>
            </div>

            {/* Badge de nivel */}
            {module.level && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs font-medium",
                module.level === 'Principiante' ? "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 text-emerald-600" :
                module.level === 'Intermedio' ? "bg-gradient-to-br from-amber-500/10 to-amber-600/5 text-amber-600" :
                module.level === 'Avanzado' ? "bg-gradient-to-br from-purple-500/10 to-purple-600/5 text-purple-600" :
                "bg-slate-100 text-slate-600"
              )}>
                {module.level}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header de sección */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "p-1.5 rounded-md",
          "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10",
          "text-[#004B63]"
        )}>
          <BookOpen className="w-4 h-4" />
        </div>
        <h3 className={cn(
          CompactTypography.SUBHEADING,
          "text-slate-800 font-semibold"
        )}>
          Módulos del Curso
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-[#004B63]/20 via-[#00BCD4]/10 to-transparent" />
      </div>

      {/* Lista de módulos */}
      <div className="space-y-1.5">
        {modules.map(module => renderModule(module))}
      </div>

      {/* Footer con estadísticas */}
      <div className={cn(
        "flex items-center justify-between",
        "pt-2 mt-2",
        "border-t border-slate-200/60"
      )}>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className={cn(CompactTypography.MICRO, "text-slate-600")}>
              Completados: {completedModules.length}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className={cn(CompactTypography.MICRO, "text-slate-600")}>
              Activo: {activeMod}
            </span>
          </div>
        </div>

        <div className={cn(
          CompactTypography.MICRO,
          "text-slate-500"
        )}>
          {modules.length} módulos total
        </div>
      </div>
    </div>
  );
};

export default SidebarModuleList;