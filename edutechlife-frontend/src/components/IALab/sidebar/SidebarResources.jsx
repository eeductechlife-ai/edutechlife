import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';

const RESOURCE_ITEMS = [
  { idSuffix: '', label: 'Cheat Sheet RTF', icon: 'fa-file-alt', meta: '2 páginas' },
  { idSuffix: '_2', label: 'Ejemplos Prácticos', icon: 'fa-code', meta: '15 ejemplos' },
  { idSuffix: '_3', label: 'Plantillas Premium', icon: 'fa-clipboard', meta: '8 plantillas' },
  { idSuffix: '_4', label: 'Casos de Estudio', icon: 'fa-chart-line', meta: '5 casos' },
];

const SidebarResources = ({
  activeMod, sidebarDropdowns, toggleSidebarDropdown,
  isInfographicCompleted, fadeTransition, t,
}) => (
  <div className="px-1 w-full" aria-labelledby="sidebar-resources-heading">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon name="fa-cubes" className="text-white text-[10px]" aria-hidden="true" />
        </div>
        <h3 id="sidebar-resources-heading" className="text-xs font-bold tracking-[0.08em] uppercase text-petroleum">
          {t('sidebar.resources')}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 via-corporate/20 to-transparent"></div>
      </div>
      <Icon
        name={sidebarDropdowns.recursos ? "fa-chevron-up" : "fa-chevron-down"}
        className="text-petroleum text-xs transition-transform duration-300 cursor-pointer hover:text-petroleum-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30 rounded"
        onClick={() => toggleSidebarDropdown('recursos')}
        tabIndex={0}
        role="button"
        aria-label={sidebarDropdowns.recursos ? "Colapsar recursos" : "Expandir recursos"}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSidebarDropdown('recursos'); } }}
      />
    </div>

    <AnimatePresence>
      {sidebarDropdowns.recursos && (
        <motion.div
          key="recursos-content"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={fadeTransition}
          className="space-y-2"
        >
          {RESOURCE_ITEMS.map((item) => {
            const resourceId = 'i' + activeMod + item.idSuffix;
            const completed = isInfographicCompleted(resourceId);
            return (
              <div
                key={resourceId}
                className="flex items-center gap-2.5 p-2.5 hover:bg-petroleum/5 dark:hover:bg-petroleum/10 rounded-lg transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/30"
                onClick={() => window.dispatchEvent(new CustomEvent('ialab:openTopic'))}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new CustomEvent('ialab:openTopic')); } }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  completed ? 'bg-emerald-50' : 'bg-petroleum/8 dark:bg-petroleum/20 group-hover:bg-petroleum/15 dark:group-hover:bg-petroleum/30'
                }`}>
                  <Icon name={completed ? 'fa-check-circle' : item.icon} className={`text-xs ${completed ? 'text-emerald-500' : 'text-petroleum'}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{item.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {completed ? (
                      <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1">
                        <Icon name="fa-check" className="text-[9px]" aria-hidden="true" /> {t('sidebar.completed')}
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">{t('sidebar.pending')}</span>
                    )}
                    <span className="text-xs text-slate-500">{item.meta}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default React.memo(SidebarResources);
