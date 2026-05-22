import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';
import { getResourcesForTopic, getResourceTypesForTopic, countResourcesByType } from './constants/moduleResources';

const ResourceViewerModal = lazy(() => import('./ResourceViewerModal'));

const ModuleOverviewCard = ({ onAction, onToggleForum }) => {
  const prefersReducedMotion = useReducedMotion();
  const { activeMod, modules, moduleContent, completedExams, challengeScores, moduleProgress, markResourceAsViewed: markResourceInContext } = useIALabContext();
  const { trackResourceViewed } = useIALabProgress();
  
  // Estado para el acordeón de temas
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [viewedIds, setViewedIds] = useState([]);
  
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ialab_bookmarked_resources') || '[]'); }
    catch { return []; }
  });
  const [showBookmarked, setShowBookmarked] = useState(false);

  const toggleBookmark = (resourceId, e) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId];
      localStorage.setItem('ialab_bookmarked_resources', JSON.stringify(next));
      return next;
    });
  };

  // Estado para el modal de recursos
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [currentTopicResources, setCurrentTopicResources] = useState([]);
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);

  const onActionRef = useRef(onAction);
  useEffect(() => { onActionRef.current = onAction; }, [onAction]);
  const onToggleForumRef = useRef(onToggleForum);
  useEffect(() => { onToggleForumRef.current = onToggleForum; }, [onToggleForum]);

  const module1Data = {
    badge: {
      duration: "2h",
    },
    icon: "fa-terminal",
    title: "Domina las Instrucciones",
    description: "En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.",
    missionIcon: "fa-bullseye",
    mission: "Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!",
    topics: [
      { title: "Introducción a la Inteligencia Artificial Generativa", icon: "fa-brain", resources: 2, duration: "20 min" },
      { title: "¿Qué es un Prompt?", icon: "fa-comments", resources: 3, duration: "20 min" },
      { title: "Estructura Básica de un Prompt Efectivo", icon: "fa-sitemap", resources: 3, duration: "20 min" },
    ],
  };

  const isModule1 = activeMod === 1;
  const dynamicContent = moduleContent[activeMod]?.overviewData;

  const moduleData = useMemo(() => {
    if (isModule1) return module1Data;
    return {
      badge: {
        duration: modules[activeMod - 1]?.duration || '2h',
      },
      icon: modules[activeMod - 1]?.icon || 'fa-book',
      title: dynamicContent?.title || '',
      description: dynamicContent?.description || '',
      missionIcon: "fa-bullseye",
      mission: dynamicContent?.mission || '',
      topics: dynamicContent?.topics || [],
    };
  }, [isModule1, activeMod, modules, dynamicContent]);

  const bookmarkedResources = useMemo(() => {
    const result = [];
    moduleData.topics.forEach((topic) => {
      const tr = getResourcesForTopic(topic.title);
      if (!tr?.resources) return;
      tr.resources.forEach((r) => {
        if (bookmarkedIds.includes(r.id)) result.push(r);
      });
    });
    return result;
  }, [bookmarkedIds, moduleData.topics]);

  const resourcesByTopic = useMemo(() => {
    const map = {};
    moduleData.topics.forEach(t => { map[t.title] = getResourcesForTopic(t.title); });
    return map;
  }, [moduleData.topics]);

  const calculateTopicDuration = useCallback((topicTitle) => {
    const topicData = resourcesByTopic[topicTitle];
    if (!topicData?.resources) return "20 min";
    let totalSeconds = 0;
    topicData.resources.forEach(resource => {
      if (resource.type === 'video' && resource.duration) {
        const parts = resource.duration.split(':').map(Number);
        if (parts.length === 3) totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
        else if (parts.length === 2) totalSeconds += parts[0] * 60 + parts[1];
      }
    });
    if (totalSeconds === 0) return "20 min";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${Math.max(minutes, 1)} min`;
  }, [resourcesByTopic]);

  const handleMarkAsViewed = async (resourceId) => {
    if (resourceId && activeMod) {
      markResourceInContext(activeMod, resourceId);
      const resourceType = 'document';
      await trackResourceViewed(activeMod, resourceId, resourceType);
      setViewedIds((prev) => {
        if (!prev.includes(resourceId)) {
          useIALabStore.getState().addViewedResource(resourceId);
          setJustCompletedId(resourceId);
          setTimeout(() => setJustCompletedId(null), 1000);
          return [...prev, resourceId];
        }
        return prev;
      });
    }
  };

  const handlePreviousResource = () => {
    if (activeResourceIndex > 0) {
      const newIndex = activeResourceIndex - 1;
      setActiveResourceIndex(newIndex);
      const prev = currentTopicResources[newIndex];
      setSelectedResource(prev);
      setSelectedResourceType(prev.type);
    }
  };

  const handleNextResource = () => {
    if (activeResourceIndex < currentTopicResources.length - 1) {
      const newIndex = activeResourceIndex + 1;
      setActiveResourceIndex(newIndex);
      const next = currentTopicResources[newIndex];
      setSelectedResource(next);
      setSelectedResourceType(next.type);
    }
  };

  useEffect(() => {
    setViewedIds(useIALabStore.getState().getViewedResources());
  }, []);

  useEffect(() => {
    if (!viewerModalOpen) {
      setViewedIds(useIALabStore.getState().getViewedResources());
    }
  }, [viewerModalOpen]);

  // Escucha el evento desde TuRutaDeHoy: lleva al recurso o actividad pendiente
  useEffect(() => {
    const handleOpenTopic = () => {
      const viewed = useIALabStore.getState().getViewedResources();

      for (let tIdx = 0; tIdx < moduleData.topics.length; tIdx++) {
        const topic = moduleData.topics[tIdx];
        const tr = getResourcesForTopic(topic.title);
        const resources = tr?.resources || [];
        for (const resource of resources) {
          if (!viewed.includes(resource.id)) {
            setExpandedTopic(tIdx);
            setTimeout(() => {
              document.querySelector('[class*="flex flex-col gap-3 mt-4"]')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 350);
            return;
          }
        }
      }

      if (!moduleProgress?.[activeMod]?.community) {
        onToggleForumRef.current?.(true);
      } else if (!challengeScores?.[activeMod]) {
        onActionRef.current?.('OPEN_CHALLENGE');
      } else if (!completedExams?.[activeMod]) {
        onActionRef.current?.('OPEN_QUIZ');
      }
    };
    window.addEventListener('ialab:openTopic', handleOpenTopic);
    return () => window.removeEventListener('ialab:openTopic', handleOpenTopic);
  }, [moduleData, activeMod]);

    return (
      <React.Fragment>
        <motion.div
        whileHover={prefersReducedMotion ? {} : { boxShadow: "0px 8px 25px rgba(0,75,99,0.12)" }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 md:p-8 overflow-hidden mb-4 dark:bg-slate-800 dark:border-slate-700/60"
      >
        <style>{`
          @keyframes shimmer-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3); }
            50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
          }
          .animate-shimmer-pulse {
            animation: shimmer-pulse 1s ease-out forwards;
          }
        `}</style>
          
{/* Contenido principal con icono destacado */}
           <div className="flex flex-col md:flex-row gap-3 items-start">
              {/* Icono destacado - Izquierda */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-petroleum to-petroleum-dark shadow-sm flex items-center justify-center text-white flex-shrink-0">
                <Icon name={moduleData.icon} className="text-xl" />
              </div>
              
              {/* Texto principal */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-petroleum leading-tight dark:text-petroleum">
                    {moduleData.title}
                  </h3>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-petroleum dark:text-petroleum text-[10px] font-bold rounded-lg border border-slate-200/60 dark:border-slate-600">{moduleData.badge.duration}</span>
                  {(() => {
                    const prog = useIALabStore.getState().lessonProgress[activeMod] || {};
                    const total = (useIALabStore.getState().ALL_LESSONS[activeMod] || []).length;
                    const done = Object.values(prog).filter(s => s === 'completed').length;
                    if (!total) return null;
                    return (
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${done === total ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {done}/{total} lecciones
                      </span>
                    );
                  })()}
                </div>
               
                  {/* Introducción */}
<p className="text-slate-600 text-sm md:text-base leading-relaxed mb-3 dark:text-slate-300">
                    {isDescriptionExpanded ? moduleData.description : moduleData.description.split('. ').slice(0, 1).join('. ') + '.'}
                  </p>
                  {moduleData.description.split('. ').length > 1 && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-xs font-semibold text-corporate hover:text-petroleum transition-colors mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 rounded"
                    >
                      {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
               
                {/* Temas en columna única - Tarjetas premium */}
                <div className="flex flex-col gap-3 mt-4">
                  {/* Sección de recursos guardados */}
                  {bookmarkedResources.length > 0 && (
                    <>
                      <button
                        onClick={() => setShowBookmarked((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200/60 hover:bg-amber-100/50 transition-all duration-200 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40"
                        aria-expanded={showBookmarked}
                        aria-label={`Recursos guardados: ${bookmarkedResources.length}`}
                      >
                        <Icon name="fa-bookmark" className="text-amber-500 text-sm" />
                        <span className="text-xs font-semibold text-amber-700 flex-1">Guardados ({bookmarkedResources.length})</span>
                        <Icon name="fa-chevron-down" className={`text-amber-400 text-xs transition-transform duration-200 ${showBookmarked ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showBookmarked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 pr-2 pb-2 space-y-1.5">
                              {bookmarkedResources.map((res) => (
                                <button
                                  key={res.id}
                                  onClick={() => {
                                    setSelectedResource(res);
                                    setSelectedResourceType(res.type);
                                    setViewerModalOpen(true);
                                  }}
                                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-amber-200/40 bg-amber-50/30 hover:bg-amber-100/40 transition-all duration-200 text-left group/res"
                                >
                                  <Icon name="fa-file" className="text-amber-400 text-xs flex-shrink-0" />
                                  <span className="text-xs font-medium text-slate-700 truncate flex-1">{res.title}</span>
                                  <Icon
                                    name="fa-bookmark"
                                    className="text-amber-500 text-xs flex-shrink-0"
                                    onClick={(e) => toggleBookmark(res.id, e)}
                                  />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                  {moduleData.topics.map((tema, index) => {
                    const topicResources = resourcesByTopic[tema.title];
                    const topicResourceIds = topicResources?.resources?.map(r => r.id) || [];
                    const isTopicCompleted = topicResourceIds.length > 0 && topicResourceIds.every(id => viewedIds.includes(id));
                    const totalResources = topicResources?.resources?.length || 0;
                    const topicCompletedCount = topicResourceIds.filter(id => viewedIds.includes(id)).length;

                    const topicDuration = calculateTopicDuration(tema.title);
                    return (
                    <React.Fragment key={index}>
                    <motion.button
                      whileHover={prefersReducedMotion ? {} : { boxShadow: "0px 8px 25px rgba(0,75,99,0.08)" }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={() => {
                        setExpandedTopic(prev => prev === index ? null : index);
                      }}
                      className={`group flex items-center gap-4 w-full px-5 py-4 bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left dark:bg-slate-800 dark:border-slate-700/60 dark:hover:bg-slate-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
                        isTopicCompleted
                          ? 'border-l-4 border-l-emerald-500'
                          : 'border-l-4 border-l-petroleum hover:border-l-corporate'
                      }`}
                      aria-label={`Ver recursos del tema: ${tema.title}`}
                    >
                      {/* Icono temático */}
                      <div className="flex flex-col items-center gap-0.5">
                        <Icon name={tema.icon} className={`text-xl flex-shrink-0 ${isTopicCompleted ? 'text-emerald-600' : 'text-petroleum'}`} />
                      </div>
                      
                      {/* Título y metadatos */}
                      <div className="flex-1 min-w-0">
<h4 className={`text-base font-semibold truncate transition-colors duration-300 flex items-center gap-2 ${
                           isTopicCompleted ? 'text-emerald-700' : 'text-slate-800 group-hover:text-petroleum dark:text-slate-100'
                         }`}>
                          {tema.title}
                          {isTopicCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md flex-shrink-0">Completado</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-petroleum dark:text-petroleum">
                             <Icon name="fa-file" className="w-3 h-3" />
                             {tema.resources} recursos
                           </span>
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-corporate bg-corporate/10">
                             <Icon name="fa-clock" className="w-3 h-3" />
                               {topicDuration}
                           </span>
                         </div>
                      </div>
                      
                      {/* Indicador de expandido */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ml-2 ${
                        expandedTopic === index ? 'bg-petroleum/10 rotate-180' : 'bg-corporate/15 group-hover:scale-110'
                      }`}>
                        <Icon name="fa-chevron-down" className={`w-3.5 h-3.5 transition-colors ${
                          expandedTopic === index ? 'text-petroleum' : 'text-corporate'
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
                        {(() => {
                          const types = getResourceTypesForTopic(tema.title);
                          const counts = countResourcesByType(tema.title);
                          if (!types || types.length <= 1) return null;
                          const typeLabels = { video: 'Videos', pdf: 'PDFs', document: 'Documentos', ova: 'OVAs', ova_interactive: 'OVAs', image: 'Imágenes' };
                          return (
                            <div className="flex gap-1.5 pl-14 pr-4 pb-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setFilterType('all')}
                                className={`text-xs font-medium px-3 py-2 min-h-[36px] rounded-full transition-all ${filterType === 'all' ? 'bg-petroleum dark:bg-petroleum text-white dark:text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
                              >
                                Todo {topicResources?.resources?.length || 0}
                              </button>
                              {types.map(type => (
                                <button
                                  key={type}
                                  onClick={() => setFilterType(type)}
                                  className={`text-xs font-medium px-3 py-2 min-h-[36px] rounded-full transition-all ${filterType === type ? 'bg-petroleum dark:bg-petroleum text-white dark:text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}
                                >
                                  {typeLabels[type] || type} {counts[type] || 0}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                        <div className="pl-14 pr-4 pb-2 space-y-1.5">
                          {topicResources.resources.filter(res => filterType === 'all' || res.type === filterType).map((resource, resIndex) => {
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
                                whileHover={prefersReducedMotion ? {} : { x: 4 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const allResources = topicResources?.resources || [];
                                  const idx = allResources.findIndex(r => r.id === resource.id);
                                  setSelectedResource(resource);
                                  setSelectedResourceType(resource.type);
                                  setCurrentTopicResources(allResources);
                                  setActiveResourceIndex(idx >= 0 ? idx : 0);
                                  setViewerModalOpen(true);
                                }}
  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left group/res ${
                                     isResourceCompleted
                                       ? 'bg-emerald-50/50 border-emerald-200/60'
                                      : 'bg-white border-slate-200/60 hover:border-petroleum/30 hover:bg-petroleum/3 dark:bg-slate-800 dark:border-slate-700/60 dark:hover:border-petroleum/40'
                                   } ${justCompletedId === resource.id ? 'animate-shimmer-pulse' : ''}`}>
                                 <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                                   <Icon name={getResourceIcon(resource.type)} className="w-4 h-4" />
                                 </div>
                                 <div className="flex-1 min-w-0 text-left">
<p className={`text-sm font-medium truncate transition-colors ${
                                     isResourceCompleted ? 'text-emerald-700' : 'text-slate-700 group-hover/res:text-petroleum dark:text-slate-200 dark:group-hover/res:text-petroleum'
                                   }`}>
                                    {resource.title}
                                  </p>
                                  {getResourceMeta(resource) && (
                                    <p className="text-xs text-slate-600 mt-0.5">{getResourceMeta(resource)}</p>
                                  )}
                                </div>
                                <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                  isResourceCompleted
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {isResourceCompleted ? 'Visto' : 'Ver'}
                                </div>
                                <div
                                  onClick={(e) => toggleBookmark(resource.id, e)}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBookmark(resource.id, e); } }}
                                  role="button"
                                  tabIndex={0}
                                  className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-md hover:bg-amber-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 cursor-pointer"
                                  aria-label={bookmarkedIds.includes(resource.id) ? 'Quitar de guardados' : 'Guardar para después'}
                                >
                                  <Icon
                                    name="fa-bookmark"
                                    className={`text-xs transition-all duration-200 ${bookmarkedIds.includes(resource.id) ? 'text-amber-500 drop-shadow-sm' : 'text-slate-200 group-hover/res:text-amber-400'}`}
                                  />
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        {totalResources > 0 && (
                          <div className="pl-14 pr-4 pb-3 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round((topicCompletedCount / totalResources) * 100)} aria-valuemin="0" aria-valuemax="100" aria-label={`Progreso del tema: ${topicCompletedCount}/${totalResources}`}>
                                <div
                                  className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500"
                                  style={{ width: `${Math.round((topicCompletedCount / totalResources) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                {topicCompletedCount}/{totalResources} Completadas
                              </span>
                            </div>

                            {(() => {
                              const isLastTopic = index === moduleData.topics.length - 1;
                              const allDone = moduleData.topics.every(t => {
                                const tr = getResourcesForTopic(t.title);
                                const ids = tr?.resources?.map(r => r.id) || [];
                                return ids.length > 0 && ids.every(id => viewedIds.includes(id));
                              });

                              if (allDone && isLastTopic) {
                                return (
                                  <button
                                    disabled
                                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                                  >
                                    <Icon name="fa-check" className="w-4 h-4" />
                                    Completado
                                  </button>
                                );
                              }

                              if (isLastTopic && activeMod < 5) {
                                return (
                                  <motion.button
                                      whileHover={prefersReducedMotion ? {} : { boxShadow: "0px 8px 25px rgba(0,75,99,0.15)" }}
                                      whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                                      onClick={() => {
                                        useIALabStore.getState().setActiveMod(activeMod + 1);
                                        setExpandedTopic(0);
                                      }}
                                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                                    >
                                      Continuar lección
                                      <Icon name="fa-arrow-right" className="w-4 h-4" />
                                    </motion.button>
                                  );
                                }
                                if (isLastTopic) return null;
                                return (
                                  <motion.button
                                    whileHover={prefersReducedMotion ? {} : { boxShadow: "0px 8px 25px rgba(0,75,99,0.15)" }}
                                    whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                                  onClick={() => setExpandedTopic(index + 1)}
                                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-petroleum to-corporate text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                                >
                                  Continuar lección
                                  <Icon name="fa-arrow-right" className="w-4 h-4" />
                                </motion.button>
                              );
                            })()}
                          </div>
                        )}
                      </motion.div>
                    )}
                    </AnimatePresence>
                    </React.Fragment>
                  )})}
                </div>
              </div>
            </div>

            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate rounded-t-2xl" />
         </motion.div>

          {/* Modal de Recursos */}
          <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"><div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum rounded-full animate-spin" /></div>}>
            <ResourceViewerModal
              isOpen={viewerModalOpen}
              onClose={() => {
                setViewerModalOpen(false);
                setSelectedResource(null);
                setSelectedResourceType(null);
                setCurrentTopicResources([]);
                setActiveResourceIndex(0);
              }}
              resource={selectedResource}
              resourceType={selectedResourceType}
              onMarkAsViewed={handleMarkAsViewed}
              onPreviousResource={handlePreviousResource}
              onNextResource={handleNextResource}
              currentIndex={activeResourceIndex}
              totalResources={currentTopicResources.length}
            />
          </Suspense>
      </React.Fragment>
    );
  };

export default ModuleOverviewCard;
