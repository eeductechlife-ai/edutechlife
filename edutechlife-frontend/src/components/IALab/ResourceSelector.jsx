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
import { RESOURCE_TYPE_CONFIG, getResourceDuration } from './constants/moduleResources';
import { useTranslation } from '../../i18n/I18nProvider';

const ResourceSelector = ({ 
  resources = [], 
  activeResourceIndex = 0, 
  completedIds = [],
  onResourceSelect,
  className = ''
}) => {
  const { t } = useTranslation();
  const [typeFilter, setTypeFilter] = React.useState(null);
  if (!resources.length) {
    return (
      <div className={cn(
        "flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200/60",
        className
      )}>
        <div className="text-center">
          <Icon name="fa-folder-open" className="text-slate-600 text-3xl mb-3" />
          <p className="text-slate-500 font-medium">{t('ialab.resource_selector.no_resources')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full bg-white rounded-xl border border-slate-200/60 shadow-sm",
      "overflow-hidden",
      className
    )}>
      <div className="px-4 py-3 border-b border-slate-200/60 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
              <Icon name="fa-layer-group" className="text-petroleum w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">{t('ialab.resource_selector.resources_title')}</h3>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>{t('ialab.resource_selector.viewed_count', { completed: (typeFilter ? completedIds.filter(id => resources.some(r => r.id === id && r.type === typeFilter)).length : completedIds.filter(id => resources.some(r => r.id === id)).length), total: (typeFilter ? resources.filter(r => r.type === typeFilter).length : resources.length) })}</span>
          </div>
        </div>
      </div>

      {(() => {
        const typeSet = new Set(resources.map(r => r.type));
        const types = Array.from(typeSet);
        if (types.length < 2) return null;
        return (
          <div className="px-3 py-2 border-b border-slate-200/60 bg-white flex flex-wrap gap-1.5">
            <button onClick={() => setTypeFilter(null)} className={cn(
              "px-2 py-1 rounded-md text-xs font-medium transition-colors",
              typeFilter === null ? "bg-petroleum text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}>{t('ialab.tab_all')}</button>
            {types.map(type => {
              const cfg = RESOURCE_TYPE_CONFIG[type] || { label: type, color: "#64748B", bg: "bg-slate-50" };
              return (
                <button key={type} onClick={() => setTypeFilter(typeFilter === type ? null : type)} className={cn(
                  "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  typeFilter === type ? "text-white" : cfg.bg + " hover:opacity-80"
                )} style={typeFilter === type ? { backgroundColor: cfg.color } : { color: cfg.color }}>
                  {cfg.label}
                </button>
              );
            })}
          </div>
        );
      })()}

      <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto">
        {resources.filter(r => !typeFilter || r.type === typeFilter).map((resource) => {
          const originalIndex = resources.indexOf(resource);
          const isActive = originalIndex === activeResourceIndex;
          const isCompleted = completedIds.includes(resource.id);
          const typeCfg = RESOURCE_TYPE_CONFIG[resource.type] || { icon: "fa-file", label: t('ialab.resource_selector.resource_label'), color: "#64748B", bg: "bg-slate-50" };
          const duration = getResourceDuration(resource);

          return (
            <motion.button
              key={resource.id}
              onClick={() => onResourceSelect && onResourceSelect(originalIndex)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left",
                isActive
                  ? "bg-white border border-slate-200/60 border-l-4 border-l-petroleum shadow-sm"
                  : isCompleted
                    ? "bg-emerald-50/40 border border-emerald-200/60 border-l-4 border-l-emerald-400 shadow-sm"
                    : "bg-white border border-slate-200/60 shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={t('ialab.resource_selector.open_resource', { title: resource.title })}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                isCompleted ? "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10" : typeCfg.bg
              )}>
                <Icon
                  name={isCompleted ? 'fa-check-circle' : typeCfg.icon}
                  className={cn("w-4 h-4", isCompleted ? "text-emerald-600" : "")}
                  style={!isCompleted ? { color: typeCfg.color } : undefined}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-semibold truncate transition-colors duration-300 flex items-center gap-2",
                  isActive ? "text-petroleum" : isCompleted ? "text-emerald-700" : "text-slate-800"
                )}>
                  {resource.title}
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md flex-shrink-0">{t('ialab.resource_selector.completed_badge')}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                    typeCfg.bg
                  )} style={{ color: typeCfg.color }}>
                    {typeCfg.label}
                  </span>
                  {duration && (
                    <span className="text-xs text-slate-600">{duration}</span>
                  )}
                </div>
              </div>

              {isActive && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center">
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
            <div className={`w-2 h-2 rounded-full ${completedIds.includes(resources[activeResourceIndex]?.id) ? 'bg-emerald-500' : 'bg-corporate animate-pulse'}`}></div>
            <span className="text-slate-600">{completedIds.includes(resources[activeResourceIndex]?.id) ? t('ialab.resource_selector.status_completed') : t('ialab.resource_selector.status_active')}</span>
            <span className={`font-medium truncate max-w-[200px] ${completedIds.includes(resources[activeResourceIndex]?.id) ? 'text-emerald-600' : 'text-petroleum'}`}>
              {resources[activeResourceIndex]?.title || t('ialab.resource_selector.none')}
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