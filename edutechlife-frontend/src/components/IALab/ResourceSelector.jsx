/**
 * COMPONENTE: ResourceSelector
 * 
 * Selector horizontal de pestañas para navegar entre recursos de un tema
 * Diseño premium con indicadores visuales y contadores
 * 
 * Características:
 * - Pestañas horizontales con scroll suave
 * - Indicador visual del recurso activo
 * - Contadores de recursos por tipo
 * - Diseño responsive con colores corporativos
 * - Estados hover y focus accesibles
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { getResourceIcon, getResourceColor } from './constants/moduleResources';

/**
 * Componente para mostrar el contador de recursos
 */
const ResourceCounter = ({ count, type, isActive }) => {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium",
      isActive 
        ? "bg-white/20 text-white" 
        : "bg-slate-100 text-slate-600"
    )}>
      <span>{getResourceIcon(type)}</span>
      <span>{count}</span>
    </div>
  );
};

/**
 * Componente principal ResourceSelector
 */
const ResourceSelector = ({ 
  resources = [], 
  activeResourceIndex = 0, 
  onResourceSelect,
  className = ''
}) => {
  // Agrupar recursos por tipo para mostrar en pestañas
  const resourceTypes = React.useMemo(() => {
    const types = {};
    resources.forEach((resource, index) => {
      if (!types[resource.type]) {
        types[resource.type] = {
          count: 0,
          indices: [],
          icon: getResourceIcon(resource.type),
          color: getResourceColor(resource.type)
        };
      }
      types[resource.type].count++;
      types[resource.type].indices.push(index);
    });
    return types;
  }, [resources]);

  // Encontrar el tipo del recurso activo
  const activeResourceType = resources[activeResourceIndex]?.type;

  // Manejar clic en una pestaña (selecciona el primer recurso de ese tipo)
  const handleTabClick = (type) => {
    const firstIndex = resourceTypes[type]?.indices[0];
    if (firstIndex !== undefined && onResourceSelect) {
      onResourceSelect(firstIndex);
    }
  };

  // Si no hay recursos, mostrar estado vacío
  if (!resources.length) {
    return (
      <div className={cn(
        "flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100",
        className
      )}>
        <div className="text-center">
          <Icon name="fa-folder-open" className="text-slate-400 text-3xl mb-3" />
          <p className="text-slate-500 font-medium">No hay recursos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full bg-white rounded-xl border border-slate-100 shadow-sm",
      "overflow-hidden",
      className
    )}>
      {/* Header del selector */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="fa-layer-group" className="text-[#00BCD4] w-5 h-5" />
            <h3 className="font-semibold text-slate-800">Recursos del Tema</h3>
          </div>
          <div className="text-sm text-slate-500">
            {resources.length} recurso{resources.length !== 1 ? 's' : ''} disponible{resources.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Pestañas horizontales */}
      <div className="relative">
        {/* Scroll container */}
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
          {Object.entries(resourceTypes).map(([type, data]) => {
            const isActive = type === activeResourceType;
            
            return (
              <motion.button
                key={type}
                onClick={() => handleTabClick(type)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg",
                  "transition-all duration-200",
                  "flex-shrink-0",
                  "min-w-[140px]",
                  isActive
                    ? "bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={isActive}
                aria-label={`Ver recursos de tipo ${type} (${data.count} disponible${data.count !== 1 ? 's' : ''})`}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isActive ? "bg-white/20" : "bg-slate-100"
                )}>
                  <Icon
                    name={getResourceIcon(type)}
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : "text-slate-500"
                    )}
                  />
                </div>

                {/* Información del tipo */}
                <div className="text-left">
                  <div className="font-medium capitalize">
                    {type === 'document' ? 'Documentos' : 
                     type === 'interactive' ? 'Interactivos' : 
                     type === 'image' ? 'Imágenes' : 
                     type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                  <div className={cn(
                    "text-sm",
                    isActive ? "text-white/80" : "text-slate-500"
                  )}>
                    {data.count} recurso{data.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Indicador de scroll (solo visible cuando hay overflow) */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Lista de recursos del tipo activo */}
      {activeResourceType && resourceTypes[activeResourceType] && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/30">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium text-slate-700">
              {activeResourceType === 'document' ? 'Documentos disponibles' : 
               activeResourceType === 'interactive' ? 'Recursos interactivos' : 
               activeResourceType === 'image' ? 'Imágenes e infografías' : 
               'Videos disponibles'}
            </h4>
            <span className="text-sm text-slate-500">
              {resourceTypes[activeResourceType].count} elemento{resourceTypes[activeResourceType].count !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Lista de recursos específicos */}
          <div className="flex flex-wrap gap-2">
            {resourceTypes[activeResourceType].indices.map((resourceIndex) => {
              const resource = resources[resourceIndex];
              const isCurrentActive = resourceIndex === activeResourceIndex;
              
              return (
                <motion.button
                  key={resource.id}
                  onClick={() => onResourceSelect && onResourceSelect(resourceIndex)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg",
                    "transition-all duration-150",
                    "text-sm",
                    isCurrentActive
                      ? "bg-cyan-50 border border-cyan-200 text-[#004B63] font-medium"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-[#00BCD4]/30 hover:shadow-sm"
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  aria-current={isCurrentActive ? 'page' : undefined}
                >
                  <Icon
                    name={getResourceIcon(resource.type)}
                    className={cn(
                      "w-4 h-4",
                      isCurrentActive ? "text-[#004B63]" : "text-slate-500"
                    )}
                  />
                  <span className="truncate max-w-[180px]">{resource.title}</span>
                  {isCurrentActive && (
                    <Icon name="fa-check" className="w-3 h-3 ml-1" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Indicador visual del recurso activo */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00BCD4] animate-pulse"></div>
            <span className="text-slate-600">Recurso activo:</span>
            <span className="font-medium text-slate-800">
              {resources[activeResourceIndex]?.title || 'Ninguno'}
            </span>
          </div>
          <div className="text-slate-500">
            {activeResourceIndex + 1} de {resources.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSelector;