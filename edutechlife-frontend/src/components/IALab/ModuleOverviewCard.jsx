import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense, memo, Fragment } from 'react'
import PropTypes from 'prop-types';;
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabProgressContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';
import { getResourcesForTopic } from './constants/moduleResources';
import { useTranslation } from '../../i18n/I18nProvider';
import ModuleHeaderSection from './module/ModuleHeaderSection';
import ModuleBookmarkFilter from './module/ModuleBookmarkFilter';
import ModuleTopicAccordion from './module/ModuleTopicAccordion';

const ResourceViewerModal = lazy(() => import('./ResourceViewerModal'));

const ModuleOverviewCard = ({ onAction, onToggleForum }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const { activeMod, modules, moduleContent, completedExams, challengeScores, moduleProgress, markResourceAsViewed: markResourceInContext } = useIALabProgressContext();
  const { trackResourceViewed } = useIALabProgress();
  const lessonProgress = useIALabStore(s => s.lessonProgress);
  
  // Estado para el acordeón de temas
  const [expandedTopic, setExpandedTopic] = useState(0);
  const [viewedIds, setViewedIds] = useState([]);
  
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [justCompletedId, setJustCompletedId] = useState(null);
  const storeToggleBookmark = useIALabStore(s => s.toggleBookmark);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ialab_bookmarked_resources') || '[]'); }
    catch { return []; }
  });
  const [showBookmarked, setShowBookmarked] = useState(false);

  const toggleBookmark = useCallback((resourceId, e) => {
    e.stopPropagation();
    storeToggleBookmark(resourceId);
    setBookmarkedIds((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  }, [storeToggleBookmark]);

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

  // Lista plana de todos los recursos en orden (para bloqueo secuencial)
  const allResourcesOrdered = useMemo(() => {
    const result = [];
    moduleData.topics.forEach((topic, tIdx) => {
      const tr = getResourcesForTopic(topic.title);
      (tr?.resources || []).forEach((res, rIdx) => {
        result.push({ ...res, topicTitle: topic.title, topicIndex: tIdx, resourceIndex: rIdx });
      });
    });
    return result;
  }, [moduleData.topics]);

  // Índice del primer recurso no visto (el siguiente que debe ver)
  const nextResourceGlobalIndex = useMemo(() => {
    return allResourcesOrdered.findIndex(r => !viewedIds.includes(r.id));
  }, [allResourcesOrdered, viewedIds]);

  // Función: ¿este recurso está bloqueado?
  const isResourceLocked = (topicIdx, resIdx, resourceId) => {
    if (viewedIds.includes(resourceId)) return false;
    const flatIdx = allResourcesOrdered.findIndex(
      r => r.topicIndex === topicIdx && r.resourceIndex === resIdx
    );
    if (flatIdx === -1) return false;
    return flatIdx > nextResourceGlobalIndex;
  };
  
  // Admin bypass: el usuario johnbeltran22 (dev) puede ver todos los recursos sin restricciones
  const isAdmin = useIALabStore(s => s.userRole === 'admin');

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
      if (resource.estimatedTime) {
        const match = resource.estimatedTime.match(/(\d+)\s*(minutos|minutes|min|mins)/i);
        if (match) totalSeconds += parseInt(match[1]) * 60;
      }
      if (resource.type === 'pdf' && resource.pages) {
        totalSeconds += resource.pages * 2 * 60;
      }
    });
    if (totalSeconds === 0) return "20 min";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${Math.max(minutes, 1)} min`;
  }, [resourcesByTopic]);

  const handleMarkAsViewed = useCallback(async (resourceId) => {
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
  }, [activeMod, markResourceInContext, trackResourceViewed]);

  const handlePreviousResource = useCallback(() => {
    if (activeResourceIndex > 0) {
      const newIndex = activeResourceIndex - 1;
      setActiveResourceIndex(newIndex);
      const prev = currentTopicResources[newIndex];
      setSelectedResource(prev);
      setSelectedResourceType(prev.type);
    }
  }, [activeResourceIndex, currentTopicResources]);

  const handleNextResource = useCallback(() => {
    if (activeResourceIndex < currentTopicResources.length - 1) {
      const newIndex = activeResourceIndex + 1;
      setActiveResourceIndex(newIndex);
      const next = currentTopicResources[newIndex];
      setSelectedResource(next);
      setSelectedResourceType(next.type);
    }
  }, [activeResourceIndex, currentTopicResources]);

  useEffect(() => {
    const updateViewed = () => setViewedIds(useIALabStore.getState().getViewedResources());
    updateViewed();
    const unsub = useIALabStore.subscribe(
      (s) => s._viewedResourcesVersion,
      updateViewed
    );
    return unsub;
  }, []);

  // Los recursos ya vistos SIEMPRE se pueden reabrir haciendo clic en ellos.
  // Auto-avance: al completar un tema, abrir el siguiente para mantener el flujo
  useEffect(() => {
    if (expandedTopic === null || expandedTopic >= moduleData.topics.length - 1) return;
    const currentTopic = moduleData.topics[expandedTopic];
    const tr = getResourcesForTopic(currentTopic.title);
    const ids = tr?.resources?.map(r => r.id) || [];
    const allDone = ids.length > 0 && ids.every(id => viewedIds.includes(id));
    if (allDone) {
      const timer = setTimeout(() => {
        setExpandedTopic(prev => (prev !== null ? prev + 1 : null));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [viewedIds, expandedTopic, moduleData.topics]);

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
      <Fragment>
        <motion.div
        whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 md:p-8 overflow-hidden dark:bg-slate-800 dark:border-slate-700/60"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-petroleum/6 to-corporate/4 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-petroleum/4 to-corporate/4 rounded-full blur-2xl pointer-events-none"></div>

          
{/* Contenido principal con icono destacado */}
           <div className="flex flex-col md:flex-row gap-3 items-start">
              {/* Icono destacado - Izquierda */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-petroleum to-petroleum-dark shadow-sm flex items-center justify-center text-white flex-shrink-0">
                <Icon name={moduleData.icon} className="text-xl" aria-hidden="true" />
              </div>
              
              {/* Texto principal */}
              <div className="flex-1">
                <ModuleHeaderSection
                  moduleData={moduleData}
                  activeMod={activeMod}
                  isDescriptionExpanded={isDescriptionExpanded}
                  setIsDescriptionExpanded={setIsDescriptionExpanded}
                  lessonProgress={lessonProgress}
                  t={t}
                />

                {allResourcesOrdered.length > 0 && (() => {
                  const total = allResourcesOrdered.length;
                  const viewed = allResourcesOrdered.filter(r => viewedIds.includes(r.id)).length;
                  const pct = Math.round((viewed / total) * 100);
                  return (
                    <div className="mt-4 mb-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Icon name="fa-chart-line" className="text-[10px] text-petroleum" />
                          {t('ialab.module.progress_title')}
                        </span>
                        <span className="text-[10px] font-bold text-petroleum">{viewed}/{total} &middot; {pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-petroleum to-corporate rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
                
                {/* Temas en columna única - Tarjetas premium */}
                <div className="flex flex-col gap-3 mt-4">
                  {bookmarkedResources.length > 0 && (
                    <ModuleBookmarkFilter
                      bookmarkedResources={bookmarkedResources}
                      showBookmarked={showBookmarked}
                      setShowBookmarked={setShowBookmarked}
                      toggleBookmark={toggleBookmark}
                      setSelectedResource={setSelectedResource}
                      setSelectedResourceType={setSelectedResourceType}
                      setViewerModalOpen={setViewerModalOpen}
                      t={t}
                    />
                  )}
                  <ModuleTopicAccordion
                    moduleData={moduleData}
                    expandedTopic={expandedTopic}
                    setExpandedTopic={setExpandedTopic}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    resourcesByTopic={resourcesByTopic}
                    viewedIds={viewedIds}
                    isAdmin={isAdmin}
                    isResourceLocked={isResourceLocked}
                    calculateTopicDuration={calculateTopicDuration}
                    toggleBookmark={toggleBookmark}
                    prefersReducedMotion={prefersReducedMotion}
                    activeMod={activeMod}
                    setSelectedResource={setSelectedResource}
                    setSelectedResourceType={setSelectedResourceType}
                    setCurrentTopicResources={setCurrentTopicResources}
                    setActiveResourceIndex={setActiveResourceIndex}
                    setViewerModalOpen={setViewerModalOpen}
                    justCompletedId={justCompletedId}
                    bookmarkedIds={bookmarkedIds}
                    t={t}
                  />
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
      </Fragment>
    );
  };


ModuleOverviewCard.propTypes = {
  onAction: PropTypes.any,
  onToggleForum: PropTypes.any,
};

export default memo(ModuleOverviewCard);
