import React from 'react';
import { cn } from '../../forum/forumDesignSystem';
import { CompactTypography } from '../GlassDesignSystem';
import { Target, TrendingUp, Award } from 'lucide-react';

/**
 * SidebarProgressCircle - Círculo de progreso premium compacto
 * Componente presentacional para mostrar progreso del curso con glassmorphism
 * 
 * @param {Object} props
 * @param {number} props.progress - Porcentaje de progreso (0-100)
 * @param {number} props.completedModules - Número de módulos completados
 * @param {number} props.totalModules - Total de módulos
 * @param {string} props.className - Clases CSS adicionales
 */
const SidebarProgressCircle = ({ 
  progress = 33, 
  completedModules = 1, 
  totalModules = 5,
  className = '' 
}) => {
  // Calcular radio y circunferencia para SVG
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn(
      "flex flex-col items-center",
      "p-4 rounded-2xl",
      "bg-white",
      "border border-slate-200/60",
      "shadow-sm",
      "transition-all duration-200",
      "hover:shadow",
      className
    )}>
      {/* Header compacto con icono */}
      <div className="flex items-center gap-2 mb-3 self-start">
        <div className={cn(
          "p-1.5 rounded-md",
          "bg-cyan-500/10",
          "text-cyan-600"
        )}>
          <Target className="w-4 h-4" />
        </div>
        <h3 className={cn(
          CompactTypography.SUBHEADING,
          "text-slate-800 font-semibold"
        )}>
          Progreso del Curso
        </h3>
      </div>

      {/* Círculo de progreso compacto */}
      <div className="relative w-20 h-20 mb-3">
        {/* Círculo de fondo */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="4"
            fill="none"
            className="stroke-slate-100"
          />
          {/* Círculo de progreso con gradiente */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="url(#progress-gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
          {/* Definición del gradiente */}
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00BCD4" stopOpacity="1" />
              <stop offset="100%" stopColor="#004B63" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Porcentaje central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={cn(
              CompactTypography.HEADING,
              "text-slate-800 font-bold"
            )}>
              {progress}%
            </div>
            <div className={cn(
              CompactTypography.MICRO,
              "text-slate-500 mt-0.5"
            )}>
              completado
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas compactas */}
      <div className="w-full space-y-2">
        {/* Módulos completados */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              "bg-emerald-500"
            )} />
            <span className={cn(
              CompactTypography.TINY,
              "text-slate-600"
            )}>
              Completados
            </span>
          </div>
          <span className={cn(
            CompactTypography.SUBHEADING,
            "text-slate-800 font-semibold"
          )}>
            {completedModules}/{totalModules}
          </span>
        </div>

        {/* Tiempo estimado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            <span className={cn(
              CompactTypography.TINY,
              "text-slate-600"
            )}>
              Tiempo restante
            </span>
          </div>
          <span className={cn(
            CompactTypography.SUBHEADING,
            "text-slate-800 font-semibold"
          )}>
            ~2h 30min
          </span>
        </div>

        {/* Badge de logro */}
        {progress >= 50 && (
          <div className={cn(
            "flex items-center gap-1.5 mt-2 pt-2",
            "border-t border-slate-100/50"
          )}>
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className={cn(
              CompactTypography.TINY,
              "text-amber-600 font-medium"
            )}>
              ¡Mitad del camino alcanzada!
            </span>
          </div>
        )}
      </div>

      {/* Tooltip de progreso (hover) */}
      <div className="mt-2">
        <div className={cn(
          "group relative inline-block",
          "text-center"
        )}>
          <div className={cn(
            CompactTypography.MICRO,
            "text-slate-500",
            "cursor-help"
          )}>
            {progress < 25 && "¡Recién comenzando!"}
            {progress >= 25 && progress < 50 && "¡Buen progreso!"}
            {progress >= 50 && progress < 75 && "¡Más de la mitad!"}
            {progress >= 75 && progress < 100 && "¡Casi terminado!"}
            {progress === 100 && "¡Curso completado!"}
          </div>
          
          {/* Tooltip */}
          <div className={cn(
            "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
            "px-2 py-1 rounded-lg",
            "bg-slate-800 text-white text-xs",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200",
            "pointer-events-none",
            "whitespace-nowrap",
            "z-50"
          )}>
            {progress}% completado • {completedModules} de {totalModules} módulos
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarProgressCircle;