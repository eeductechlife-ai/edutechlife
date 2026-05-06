/**
 * COMPONENTE: ResourceSelector
 * 
 * Selector vertical de recursos en columna única
 * Diseño premium con tarjetas interactivas
 * 
 * Características:
 * - Lista vertical de recursos en una sola columna
 * - Indicador visual del recurso activo
 * - Diseño responsive con colores corporativos
 * - Estados hover y focus accesibles
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { getResourceIcon, getResourceColor } from './constants/moduleResources';

/**
 * Componente principal ResourceSelector
 */
const ResourceSelector = ({ 
  resources = [], 
  activeResourceIndex = 0, 
  completedIds = [],
  onResourceSelect,
  className = ''
}) => {
  // Si no hay recursos, mostrar estado vacío
  if (!resources.length) {
    return (
      <div className={cn(
        "flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200/60",
        className
      )}>
        <div className="text-center">
          <Icon name="fa-folder-open" className="text-slate-400 text-3xl mb-3" />
          <p className="text-slate-500 font-medium">No hay recursos disponibles</p>
        </div>
      </div>
    );
  }

  // Mapeo de etiquetas legibles para tipos
  const getTypeLabel = (type) => {
    const labels = {
      video: "Video",
      document: "Documento",
      documento: "Documento",
      pdf: "PDF",
      "pdf-thumbnail": "PDF",
      ova: "OVA",
      "ova-thumbnail": "OVA",
      image: "Imagen",
      imagen: "Imagen",
      interactive: "Interactivo",
      interactivo: "Interactivo"
    };
    return labels[type] || type;
  };

  // Mapeo de metadata por tipo
  const getResourceMetadata = (resource) => {
    const parts = [];
    if (resource.duration) parts.push(resource.duration);
    if (resource.format) parts.push(resource.format);
    if (resource.size) parts.push(resource.size);
    if (resource.pages) parts.push(`${resource.pages} págs`);
    if (resource.estimatedTime) parts.push(resource.estimatedTime);
    return parts.join(' • ') || getTypeLabel(resource.type);
  };

  return (
    <div className={cn(
      "w-full bg-white rounded-xl border border-slate-200/60 shadow-sm",
      "overflow-hidden",
      className
    )}>
      {/* Header del selector */}
      <div className="px-4 py-3 border-b border-slate-200/60 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-layer-group" className="text-[#004B63] w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">Recursos del Tema</h3>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>{completedIds.filter(id => resources.some(r => r.id === id)).length}/{resources.length} visto{resources.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Lista vertical de recursos */}
      <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto">
        {resources.map((resource, index) => {
          const isActive = index === activeResourceIndex;
          const isCompleted = completedIds.includes(resource.id);
          
          return (
            <motion.button
              key={resource.id}
              onClick={() => onResourceSelect && onResourceSelect(index)}
              className={cn(
                "w-full flex items-center gap-3",
                "p-3 rounded-xl",
                "transition-all duration-300",
                "text-left",
                isActive
                  ? "bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] shadow-sm"
                  : isCompleted
                    ? "bg-emerald-50/40 border border-emerald-200/60 border-l-4 border-l-emerald-400 shadow-sm"
                    : "bg-white border border-slate-200/60 shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Abrir ${resource.title}`}
            >
              {/* Icono con gradiente corporativo */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                "transition-all duration-300",
                isCompleted
                  ? "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10"
                  : "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10"
              )}>
                <Icon
                  name={isCompleted ? 'fa-check-circle' : getResourceIcon(resource.type)}
                  className={isCompleted ? "text-emerald-600 w-4 h-4" : "text-[#004B63] w-4 h-4"}
                />
              </div>

              {/* Información del recurso */}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-semibold truncate transition-colors duration-300 flex items-center gap-2",
                  isActive ? "text-[#004B63]" : isCompleted ? "text-emerald-700" : "text-slate-800"
                )}>
                  {resource.title}
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md flex-shrink-0">Completado</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {getResourceMetadata(resource)}
                </div>
              </div>

              {/* Indicador de activo */}
              {isActive && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center">
                    <Icon name="fa-check" className="text-white w-3 h-3" />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Indicador del recurso activo */}
      <div className="px-4 py-2 border-t border-slate-200/60 bg-white">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${completedIds.includes(resources[activeResourceIndex]?.id) ? 'bg-emerald-500' : 'bg-[#00BCD4] animate-pulse'}`}></div>
            <span className="text-slate-600">{completedIds.includes(resources[activeResourceIndex]?.id) ? 'Completado:' : 'Activo:'}</span>
            <span className={`font-medium truncate max-w-[200px] ${completedIds.includes(resources[activeResourceIndex]?.id) ? 'text-emerald-600' : 'text-[#004B63]'}`}>
              {resources[activeResourceIndex]?.title || 'Ninguno'}
            </span>
          </div>
          <div className="text-slate-500">
            {activeResourceIndex + 1} / {resources.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSelector;