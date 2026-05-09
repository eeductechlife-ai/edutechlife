import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { getResourcesForTopic } from './constants/moduleResources';
import ResourceViewerModal from './ResourceViewerModal';
import IALabForumOptimized from './IALabForumOptimized';
import ErrorBoundary from '../forum/ErrorBoundary';

/**
 * COMPONENTE: ModuleOverviewCard
 * 
 * Responsabilidad: Hero Card premium con Glassmorphism para overview del módulo
 * - Módulo 1: Datos hardcodeados originales (intactos)
 * - Módulos 2-5: Datos dinámicos desde moduleContent
 * - Badge superior con duración y nivel
 * - Temas clickeables con modal de recursos
 * - Grid inferior de estadísticas
 * - Estilo Glassmorphism premium
 * - Integración con Foro y Desafío
 * 
 * @returns {JSX.Element} Componente Hero Card premium
 */

const ModuleOverviewCard = ({ onAction }) => {
  const { activeMod, modules, moduleContent, completedExams, challengeScores, moduleProgress } = useIALabContext();
  
  // Estado para el acordeón de temas
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [isForumOpen, setIsForumOpen] = useState(false);
  const [viewedIds, setViewedIds] = useState([]);
  
  // Estado para el modal de recursos
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('ialab_viewed_resources');
    if (stored) {
      try { setViewedIds(JSON.parse(stored)); } catch {}
    }
  }, []);

  // Recargar viewedIds al cerrar el modal de recursos
  useEffect(() => {
    if (!viewerModalOpen) {
      const stored = localStorage.getItem('ialab_viewed_resources');
      if (stored) {
        try { setViewedIds(JSON.parse(stored)); } catch {}
      }
    }
  }, [viewerModalOpen]);

  const handleMarkAsViewed = (resourceId) => {
    if (!resourceId) return;
    const stored = localStorage.getItem('ialab_viewed_resources');
    let viewed = [];
    if (stored) {
      try { viewed = JSON.parse(stored); } catch {}
    }
    if (!viewed.includes(resourceId)) {
      viewed.push(resourceId);
      localStorage.setItem('ialab_viewed_resources', JSON.stringify(viewed));
      setViewedIds(viewed);
    }
  };
  
  // Módulo 1: Datos hardcodeados originales (INTACTOS)
  const module1Data = {
    badge: {
      duration: "2h",
      module: "5 MÓDULOS"
    },
    title: "Domina las Instrucciones",
    description: "En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.",
    mission: "Completa los recursos de cada tema (videos, guías y laboratorios) para desbloquear tu progreso. Cada recurso visto suma +20% hacia tu certificación global. ¡El dominio de los prompts empieza aquí!",
    missionIcon: "fa-rocket",
    icon: "fa-brain",
    topics: [
      { title: "Introducción a la Inteligencia Artificial Generativa", icon: "fa-brain", resources: 2, duration: "20 min" },
      { title: "¿Qué es un Prompt?", icon: "fa-comments", resources: 3, duration: "20 min" },
      { title: "Estructura Básica de un Prompt Efectivo", icon: "fa-sitemap", resources: 3, duration: "20 min" }
    ],
    stats: [
      { title: "Contenido", value: "3 Lecciones" },
      { title: "Práctica", value: "3 Labs & Retos" }
    ]
  };
  
  // Datos dinámicos según módulo activo
  const isModule1 = activeMod === 1;
  const currentModule = modules.find(m => m.id === activeMod) || modules[0];
  const dynamicContent = moduleContent[activeMod];
  
  const moduleData = isModule1 ? module1Data : {
    badge: {
      duration: currentModule?.duration || "10h",
      module: `${currentModule?.level || 'AVANZADO'}`
    },
    title: dynamicContent?.overviewData?.title || currentModule?.title || "Módulo",
    description: dynamicContent?.overviewData?.description || currentModule?.desc || "",
    mission: dynamicContent?.overviewData?.mission || "",
    missionIcon: "fa-bolt",
    icon: currentModule?.icon || "fa-graduation-cap",
    topics: dynamicContent?.overviewData?.topics || [],
    stats: [
      { title: "Contenido", value: "3 Lecciones" },
      { title: "Práctica", value: "3 Labs & Retos" }
    ]
  };

    return (
      <React.Fragment>
        <motion.div
        whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 md:p-8 overflow-hidden mb-4"
      >
          
{/* Badge superior */}
            <div className="flex items-center justify-between mb-4">
              <div className="px-4 py-2 bg-white border border-slate-200/60 text-[#004B63] text-sm font-semibold rounded-full shadow-sm">
                {moduleData.badge.module}
              </div>
              <div className="px-4 py-2 bg-white border border-slate-200/60 text-[#004B63] text-sm font-semibold rounded-full shadow-sm">
                {moduleData.badge.duration}
              </div>
            </div>
           
           {/* Contenido principal con icono destacado */}
           <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Icono destacado - Izquierda */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004B63] to-[#0A3550] shadow-sm flex items-center justify-center text-white flex-shrink-0">
                <Icon name={moduleData.icon} className="text-2xl" />
              </div>
             
              {/* Texto principal */}
             <div className="flex-1 max-w-3xl">
               <h3 className="text-xl md:text-2xl font-bold text-[#004B63] mb-3 leading-tight">
                 {moduleData.title}
               </h3>
               
                {/* Introducción */}
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-3">
                  Desde los fundamentos de la IA Generativa hasta la creación de instrucciones de alto impacto.
                </p>
               
                {/* Tu Misión - Subtítulo destacado */}
                <div className="flex items-start gap-3 mb-5">
                   <Icon name={moduleData.missionIcon} className="text-[#00BCD4] text-sm flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-[#004B63] mb-1">Tu misión:</h4>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {moduleData.mission}
                    </p>
                  </div>
                </div>
               
                {/* Temas en columna única - Tarjetas premium */}
                <div className="flex flex-col gap-3 mt-4">
                  {moduleData.topics.map((tema, index) => {
                    const topicResources = getResourcesForTopic(tema.title);
                    const topicResourceIds = topicResources?.resources?.map(r => r.id) || [];
                    const isTopicCompleted = topicResourceIds.length > 0 && topicResourceIds.every(id => viewedIds.includes(id));

                    const calculateTopicDuration = (topicTitle) => {
                      const topicData = getResourcesForTopic(topicTitle);
                      if (!topicData?.resources) return "20 min";
                      
                      let totalSeconds = 0;
                      topicData.resources.forEach(resource => {
                        if (resource.type === 'video' && resource.duration) {
                          const parts = resource.duration.split(':').map(Number);
                          if (parts.length === 2) {
                            totalSeconds += parts[0] * 60 + parts[1];
                          } else if (parts.length === 3) {
                            totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                          }
                        } else if (resource.estimatedTime) {
                          const match = resource.estimatedTime.match(/(\d+)/);
                          if (match) totalSeconds += parseInt(match[1]) * 60;
                        } else if (resource.pages) {
                          totalSeconds += Math.max(5, Math.ceil(resource.pages / 2)) * 60;
                        }
                      });
                      
                      const hours = Math.floor(totalSeconds / 3600);
                      const minutes = Math.floor((totalSeconds % 3600) / 60);
                      if (hours > 0) return `${hours}h ${minutes}min`;
                      return `${minutes} min`;
                    };
                    return (
                    <React.Fragment key={index}>
                    <motion.button
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={() => {
                        setExpandedTopic(prev => prev === index ? null : index);
                      }}
                      className={`group flex items-center gap-4 w-full px-5 py-4 bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left ${
                        isTopicCompleted
                          ? 'border-l-4 border-l-emerald-500'
                          : 'border-l-4 border-l-[#004B63] hover:border-l-[#00BCD4]'
                      }`}
                      aria-label={`Ver recursos del tema: ${tema.title}`}
                    >
                      {/* Icono temático */}
                      <div className="flex flex-col items-center gap-0.5">
                        <Icon name={tema.icon} className={`text-xl flex-shrink-0 ${isTopicCompleted ? 'text-emerald-600' : 'text-[#004B63]'}`} />
                      </div>
                      
                      {/* Título y metadatos */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-semibold truncate transition-colors duration-300 flex items-center gap-2 ${
                          isTopicCompleted ? 'text-emerald-700' : 'text-slate-800 group-hover:text-[#004B63]'
                        }`}>
                          {tema.title}
                          {isTopicCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md flex-shrink-0">Completado</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-[#004B63]">
                             <Icon name="fa-file" className="w-3 h-3" />
                             {tema.resources} recursos
                           </span>
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-[#00BCD4] bg-[#00BCD4]/10">
                             <Icon name="fa-clock" className="w-3 h-3" />
                              {calculateTopicDuration(tema.title)}
                           </span>
                         </div>
                      </div>
                      
                      {/* Indicador de expandido */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ml-2 ${
                        expandedTopic === index ? 'bg-[#004B63]/10 rotate-180' : 'bg-[#00BCD4]/15 group-hover:scale-110'
                      }`}>
                        <Icon name="fa-chevron-down" className={`w-3.5 h-3.5 transition-colors ${
                          expandedTopic === index ? 'text-[#004B63]' : 'text-[#00BCD4]'
                        }`} />
                      </div>
                    </motion.button>

                    {/* Acordeón de recursos */}
                    <AnimatePresence>
                    {expandedTopic === index && topicResources?.resources && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-14 pr-4 pb-2 space-y-1.5">
                          {topicResources.resources.map((resource, resIndex) => {
                            const getResourceIcon = (type) => {
                              if (type === 'video') return 'fa-video';
                              if (type === 'pdf' || type === 'document') return 'fa-file-lines';
                              if (type === 'ova' || type === 'ova_interactive') return 'fa-brain';
                              if (type === 'image') return 'fa-image';
                              return 'fa-file';
                            };
                            const getResourceMeta = (res) => {
                              if (res.type === 'video') return res.duration || '';
                              if (res.pages) return `${res.pages} págs`;
                              if (res.estimatedTime) return res.estimatedTime;
                              if (res.format) return res.format;
                              if (res.size) return res.size;
                              return '';
                            };
                            const isResourceCompleted = viewedIds.includes(resource.id);
                            return (
                              <motion.button
                                key={resource.id}
                                whileHover={{ x: 4 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedResource(resource);
                                  setSelectedResourceType(resource.type);
                                  setViewerModalOpen(true);
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left group/res ${
                                  isResourceCompleted
                                    ? 'bg-emerald-50/50 border-emerald-200/60'
                                    : 'bg-white border-slate-200/60 hover:border-[#004B63]/30 hover:bg-[#004B63]/3'
                                }`}
                              >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isResourceCompleted
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-[#004B63]/8 text-[#004B63] group-hover/res:bg-[#004B63]/15'
                                }`}>
                                  <Icon name={getResourceIcon(resource.type)} className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <p className={`text-sm font-medium truncate transition-colors ${
                                    isResourceCompleted ? 'text-emerald-700' : 'text-slate-700 group-hover/res:text-[#004B63]'
                                  }`}>
                                    {resource.title}
                                  </p>
                                  {getResourceMeta(resource) && (
                                    <p className="text-xs text-slate-400 mt-0.5">{getResourceMeta(resource)}</p>
                                  )}
                                </div>
                                <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                  isResourceCompleted
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {isResourceCompleted ? 'Visto' : 'Ver'}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                    </AnimatePresence>
                    </React.Fragment>
                  )})}
                </div>
              
              {/* Es hora de la acción */}
              <div className="flex items-start gap-3 mt-4">
                  <Icon name="fa-bolt" className="text-[#004B63] text-sm flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#004B63] mb-1">¡Es hora de la acción!</h4>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Supera el <span className="font-semibold text-[#00BCD4]">80%</span> en las actividades de este módulo y desbloquea el siguiente nivel.
                  </p>
                  <h5 className="text-base font-bold text-[#004B63] mt-3">¿Aceptas el reto?</h5>
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid inferior: 3 iconos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Icono: Comunidad */}
                <div className="flex flex-col items-center gap-2">
                  {moduleProgress?.[activeMod]?.community ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.button
                        onClick={() => setIsForumOpen(!isForumOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative"
                        title="Ver comunidad"
                      >
                        <Icon name="fa-comments" className="text-white w-5 h-5 md:w-6 md:h-6" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                          <Icon name="fa-check" className="text-emerald-500 text-[9px]" />
                        </div>
                      </motion.button>
                      <span className="text-sm md:text-base font-bold text-[#004B63] text-center">Comunidad</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <motion.button
                        onClick={() => setIsForumOpen(!isForumOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:bg-[#00BCD4]/90 hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                        title="Comunidad IALab"
                      >
                        <Icon name="fa-comments" className="text-white w-5 h-5 md:w-6 md:h-6" />
                      </motion.button>
                      <span className="text-sm md:text-base font-bold text-[#004B63] text-center">Comunidad IALab</span>
                    </div>
                  )}
                </div>
                {/* Icono: Desafío */}
                <div className="flex flex-col items-center gap-2">
                  {challengeScores?.[activeMod] ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.button
                        onClick={() => onAction('SHOW_CHALLENGE_RESULT')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative"
                        title="Ver resultado del desafío"
                      >
                        <Icon name="fa-rocket" className="text-white w-5 h-5 md:w-6 md:h-6" />
                        <div className="absolute -top-0.5 -right-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-[3px] border-emerald-500 flex items-center justify-center shadow-sm">
                          <span className="text-[9px] font-bold text-emerald-600">{challengeScores[activeMod]}%</span>
                        </div>
                      </motion.button>
                      <span className="text-sm md:text-base font-bold text-[#004B63] text-center">Desafío: {challengeScores[activeMod]}%</span>
                    </div>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => onAction('OPEN_CHALLENGE')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:bg-[#00BCD4]/90 hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                        title="Desafío del Módulo"
                      >
                        <Icon name="fa-rocket" className="text-white w-5 h-5 md:w-6 md:h-6" />
                      </motion.button>
                      <span className="text-sm md:text-base font-bold text-[#004B63] text-center">Desafío</span>
                    </>
                  )}
                </div>
                {/* Icono: Examen */}
                <div className="flex flex-col items-center gap-2">
                  {completedExams?.[activeMod] ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.button
                        onClick={() => onAction('SHOW_EXAM_RESULT')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative"
                        title="Ver resultado del examen"
                      >
                        <Icon name="fa-clipboard-check" className="text-white w-5 h-5 md:w-6 md:h-6" />
                        <div className="absolute -top-0.5 -right-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-[3px] border-emerald-500 flex items-center justify-center shadow-sm">
                          <span className="text-[9px] font-bold text-emerald-600">{completedExams[activeMod]}%</span>
                        </div>
                      </motion.button>
                      <span className="text-sm md:text-base font-bold text-[#004B63] text-center">Examen: {completedExams[activeMod]}%</span>
                    </div>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => onAction('OPEN_QUIZ')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:bg-[#00BCD4]/90 hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                        title="Examen del Módulo"
                      >
                        <Icon name="fa-clipboard-check" className="text-white w-5 h-5 md:w-6 md:h-6" />
                      </motion.button>
                      <span className="text-sm md:text-base font-bold text-[#004B63] text-center">Examen</span>
                    </>
                  )}
                </div>
             </div>

             {/* Foro expandible */}
             <AnimatePresence>
               {isForumOpen && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.3 }}
                   className="mt-6 overflow-hidden"
                 >
                   <ErrorBoundary>
                     <IALabForumOptimized compact={false} initialLimit={3} />
                   </ErrorBoundary>
                 </motion.div>
               )}
             </AnimatePresence>
           
            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />
         </motion.div>

          {/* Modal de Recursos */}
          <ResourceViewerModal
            isOpen={viewerModalOpen}
            onClose={() => {
              setViewerModalOpen(false);
              setSelectedResource(null);
              setSelectedResourceType(null);
            }}
            resource={selectedResource}
            resourceType={selectedResourceType}
            onMarkAsViewed={handleMarkAsViewed}
          />
      </React.Fragment>
    );
  };

export default ModuleOverviewCard;
