import React from 'react';
import { cn } from '../forum/forumDesignSystem';
import { LEDIndicators } from './GlassDesignSystem';

/**
 * LEDIndicator - Micro-indicador de estado visual
 * Sistema de puntos LED para mostrar actividad, estados y procesos
 * 
 * @param {Object} props
 * @param {'idle'|'live'|'processing'|'success'|'warning'|'error'} props.type - Tipo de estado
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.label - Etiqueta opcional para accesibilidad
 * @param {boolean} props.showLabel - Mostrar etiqueta como tooltip
 * @param {'sm'|'md'|'lg'} props.size - Tamaño del indicador
 */
const LEDIndicator = ({ 
  type = 'idle', 
  className = '',
  label = '',
  showLabel = false,
  size = 'md',
  ...rest 
}) => {
  const config = LEDIndicators.CONFIG[type] || LEDIndicators.CONFIG.idle;
  
  // Mapeo de tamaños
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };
  
  // Texto descriptivo para accesibilidad
  const statusLabels = {
    idle: 'Inactivo',
    live: 'En vivo',
    processing: 'Procesando',
    success: 'Completado',
    warning: 'Advertencia',
    error: 'Error'
  };
  
  const statusText = label || statusLabels[type];
  
  return (
    <div 
      className={cn(
        "relative inline-flex items-center",
        showLabel && "group"
      )}
      role="status"
      aria-label={statusText}
      {...rest}
    >
      {/* Indicador LED principal */}
      <div className="relative">
        {/* Anillo de ping (solo para processing) */}
        {config.ping && (
          <div className={cn(
            "absolute inset-0 rounded-full",
            config.bg,
            "opacity-30",
            LEDIndicators.PING
          )} />
        )}
        
        {/* LED principal */}
        <div className={cn(
          LEDIndicators.BASE,
          sizeClasses[size],
          config.bg,
          config.pulse && LEDIndicators.PULSE,
          "relative z-10",
          "transition-colors duration-300"
        )} />
      </div>
      
      {/* Tooltip con etiqueta (opcional) */}
      {showLabel && (
        <div className={cn(
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          "px-2 py-1 rounded-lg",
          "bg-slate-800 text-white text-xs font-medium",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200",
          "pointer-events-none",
          "whitespace-nowrap",
          "z-50"
        )}>
          {statusText}
          {/* Flecha del tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        </div>
      )}
      
      {/* Texto inline (alternativa a tooltip) */}
      {!showLabel && label && (
        <span className={cn(
          "ml-1.5 text-xs font-medium",
          type === 'idle' && "text-slate-500",
          type === 'live' && "text-emerald-600",
          type === 'processing' && "text-cyan-600",
          type === 'success' && "text-emerald-600",
          type === 'warning' && "text-amber-600",
          type === 'error' && "text-rose-600"
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * LEDIndicatorGroup - Grupo de indicadores para mostrar múltiples estados
 */
export const LEDIndicatorGroup = ({ indicators, className = '' }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {indicators.map((indicator, index) => (
        <LEDIndicator key={index} {...indicator} />
      ))}
    </div>
  );
};

export default LEDIndicator;