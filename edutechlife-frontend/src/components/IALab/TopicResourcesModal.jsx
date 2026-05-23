import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { useIALabProgressContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';
import { useYouTubeDuration } from '../../hooks/useYouTubeDuration';
import ResourceSelector from './ResourceSelector';
import ResourceViewerModal from './ResourceViewerModal';
import QueEsPrompt_OVA_Original from './QueEsPrompt_OVA_Original';
import { getResourcesForTopic, RESOURCE_TYPE_CONFIG } from './constants/moduleResources';
import { stopSpeech } from '../../utils/speech';
import useFullscreen from './hooks/useFullscreen';

const TopicResourcesModal = ({
  isOpen = false,
  onClose,
  topicData = null,
  className = ''
}) => {
  const { activeMod, markResourceAsViewed: markResourceInContext } = useIALabProgressContext();
  const { trackResourceViewed } = useIALabProgress();
  
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [ovaModalOpen, setOvaModalOpen] = useState(false);
  const [immersivePdfModalOpen, setImmersivePdfModalOpen] = useState(false);
  const [immersivePdfResource, setImmersivePdfResource] = useState(null);
  const [viewedIds, setViewedIds] = useState([]);
  const modalRef = useRef(null);
  const { isFullscreen: isModalFullscreen, toggleFullscreen: toggleModalFullscreen } = useFullscreen(modalRef);

  useEffect(() => {
    if (!isOpen) return;
    setViewedIds(useIALabStore.getState().getViewedResources());
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        stopSpeech();
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const topicResources = topicData ? getResourcesForTopic(topicData.title) : null;
  const resources = topicResources?.resources || [];

  const currentResource = resources[activeResourceIndex];
  const currentVideoUrl = currentResource?.type === 'video' ? currentResource?.url : null;
  const { duration: youtubeDuration, loading: durationLoading } = useYouTubeDuration(currentVideoUrl);

  useEffect(() => {
    if (topicData && resources.length > 0) {
      setActiveResourceIndex(0);
      setViewerModalOpen(false);
      setSelectedResource(null);
      setViewedIds([]);
      setOvaModalOpen(false);
      setImmersivePdfModalOpen(false);
    }
  }, [topicData, resources.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      stopSpeech();
    }
    return () => {
      document.body.style.overflow = 'unset';
      stopSpeech();
    };
  }, [isOpen]);

  const handleOpenViewerModal = (resourceIndex) => {
    const resource = resources[resourceIndex];
    if (!resource) return;
    setSelectedResource(resource);
    setSelectedResourceType(resource.type);
    setViewerModalOpen(true);
    setActiveResourceIndex(resourceIndex);
  };

  const handleOpenOVA = (resource) => {
    setSelectedResource(resource);
    setOvaModalOpen(true);
  };

  const handleOpenImmersivePdf = (resource) => {
    setImmersivePdfResource(resource);
    setImmersivePdfModalOpen(true);
  };

  const handleCloseViewerModals = () => {
    stopSpeech();
    setViewerModalOpen(false);
    setOvaModalOpen(false);
    setImmersivePdfModalOpen(false);
    setSelectedResource(null);
    setImmersivePdfResource(null);
  };

  const handleMarkAsViewed = async (resourceId) => {
    if (viewedIds.includes(resourceId)) return;
    if (resourceId && activeMod) {
      markResourceInContext(activeMod, resourceId);
      const resource = resources.find(r => r.id === resourceId);
      const resourceType = resource?.type || 'document';
      await trackResourceViewed(activeMod, resourceId, resourceType);
      useIALabStore.getState().addViewedResource(resourceId);
      setViewedIds([...viewedIds, resourceId]);
    }
  };

  const handlePreviousResource = () => {
    if (activeResourceIndex > 0) {
      const newIndex = activeResourceIndex - 1;
      setActiveResourceIndex(newIndex);
      setSelectedResource(resources[newIndex]);
      setSelectedResourceType(resources[newIndex].type);
    }
  };

  const handleNextResource = () => {
    if (activeResourceIndex < resources.length - 1) {
      const newIndex = activeResourceIndex + 1;
      setActiveResourceIndex(newIndex);
      setSelectedResource(resources[newIndex]);
      setSelectedResourceType(resources[newIndex].type);
    }
  };

  if (!topicData || !topicResources) {
    return null;
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-hidden="true" className="fixed inset-0 z-[100] backdrop-blur-md bg-black/40"
            onClick={() => { stopSpeech(); onClose(); }}
          />

          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog" aria-modal="true"
              className={cn(
                "w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl",
                "pointer-events-auto overflow-hidden flex flex-col",
                "h-[90dvh] max-h-[90dvh] mx-2 sm:mx-4",
                className
              )}
              style={{
                boxShadow: '0 20px 25px -5px rgba(0,75,99,0.18), 0 8px 10px -6px rgba(0,75,99,0.12)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-petroleum to-corporate backdrop-blur-sm">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="fa-book-open" className="text-white text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                      {topicData.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={toggleModalFullscreen}
                  className={cn(
                    "mt-3 sm:mt-0 ml-0 sm:ml-4 p-2 sm:p-2.5 rounded-lg sm:rounded-xl",
                    "bg-white/20 text-white hover:bg-white/30 transition-colors duration-200",
                    "flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2"
                  )}
                  aria-label={isModalFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  <Icon name={isModalFullscreen ? "fa-compress" : "fa-expand"} className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:hidden">{isModalFullscreen ? "Salir" : "Fullscreen"}</span>
                </button>
                <button
                  onClick={() => { stopSpeech(); onClose(); }}
                  className={cn(
                    "mt-3 sm:mt-0 ml-0 sm:ml-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl",
                    "bg-white text-petroleum hover:bg-petroleum/10 transition-colors duration-200",
                    "flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2"
                  )}
                  aria-label="Cerrar modal"
                >
                  <Icon name="fa-xmark" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:hidden">Cerrar</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-petroleum/70 px-4 sm:px-6 py-3 bg-white border-b border-petroleum/25">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                    <Icon name="fa-clock" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-petroleum" />
                  </div>
                  <span>{topicResources.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                    <Icon name="fa-chart-line" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-petroleum" />
                  </div>
                  <span className="px-1.5 sm:px-2 py-0.5 bg-petroleum/10 rounded-full text-petroleum/80 font-medium text-xs sm:text-sm">
                    {topicResources.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                    <Icon name="fa-layer-group" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-petroleum" />
                  </div>
                  <span>{resources.length} recurso{resources.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-petroleum/25">
                {topicResources.learningObjectives && topicResources.learningObjectives.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-petroleum mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                        <Icon name="fa-bullseye" className="text-petroleum w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      Objetivo de aprendizaje
                    </h4>
                    <p className="text-sm sm:text-base text-petroleum/70 leading-relaxed ml-7">
                      {topicResources.learningObjectives[0]}
                    </p>
                  </div>
                )}
                <p className="text-sm sm:text-base text-petroleum/70 leading-relaxed">
                  {topicResources.description}
                </p>
              </div>

              {resources.length > 0 && (() => {
                const typeCounts = {};
                resources.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
                const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
                return (
                  <div className="px-6 py-3 border-b border-petroleum/25 flex flex-wrap items-center gap-2">
                    {sortedTypes.map(([type, count]) => {
                      const cfg = RESOURCE_TYPE_CONFIG[type] || { label: type, color: "#64748B", bg: "bg-slate-100" };
                      return (
                        <span key={type} className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          cfg.bg
                        )} style={{ color: cfg.color }}>
                          <Icon name={cfg.icon || "fa-file"} className="w-3 h-3" />
                          {cfg.label}
                          <span className="font-bold">{count}</span>
                        </span>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="overflow-hidden">
                <div className="px-6 pt-4 pb-4 border-b border-petroleum/25">
                  <ResourceSelector
                    resources={resources}
                    activeResourceIndex={activeResourceIndex}
                    completedIds={viewedIds}
                    onResourceSelect={(index) => {
                      setActiveResourceIndex(index);
                      handleOpenViewerModal(index);
                    }}
                  />
                </div>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-petroleum/25 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    "bg-gradient-to-br from-petroleum/10 to-corporate/10 text-petroleum text-sm sm:text-lg"
                  )}>
                    {resources[activeResourceIndex]?.type === 'video' ? <Icon name="fa-video" className="text-petroleum w-4 h-4 sm:w-5 sm:h-5" /> :
                     (resources[activeResourceIndex]?.type === 'document' || resources[activeResourceIndex]?.type === 'documento' || resources[activeResourceIndex]?.type === 'pdf' || resources[activeResourceIndex]?.type === 'pdf-thumbnail') ? <Icon name="fa-file-lines" className="text-petroleum w-4 h-4 sm:w-5 sm:h-5" /> :
                     (resources[activeResourceIndex]?.type === 'image' || resources[activeResourceIndex]?.type === 'imagen') ? <Icon name="fa-image" className="text-petroleum w-4 h-4 sm:w-5 sm:h-5" /> :
                      (resources[activeResourceIndex]?.type === 'ova' || resources[activeResourceIndex]?.type === 'ova-thumbnail' || resources[activeResourceIndex]?.type === 'ova_interactive') ? <Icon name="fa-brain" className="text-petroleum w-4 h-4 sm:w-5 sm:h-5" /> :
                     (resources[activeResourceIndex]?.type === 'interactive' || resources[activeResourceIndex]?.type === 'interactivo') ? <Icon name="fa-puzzle-piece" className="text-petroleum w-4 h-4 sm:w-5 sm:h-5" /> : <Icon name="fa-file" className="text-petroleum w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-petroleum text-xs sm:text-sm truncate">
                      {resources[activeResourceIndex]?.title || "Selecciona un recurso"}
                    </h4>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-petroleum/60">
                      {resources[activeResourceIndex]?.type === 'video' && (
                        <span>
                          {durationLoading ? 'Cargando...' : (youtubeDuration || resources[activeResourceIndex]?.duration)}
                        </span>
                      )}
                      {resources[activeResourceIndex]?.format && (
                        <span>{resources[activeResourceIndex]?.format}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      if (activeResourceIndex > 0) {
                        const newIndex = activeResourceIndex - 1;
                        setActiveResourceIndex(newIndex);
                        handleOpenViewerModal(newIndex);
                      }
                    }}
                    disabled={activeResourceIndex <= 0}
                    className={cn(
                      "w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-petroleum/25 border-l-4 border-l-petroleum transition-all duration-200 flex items-center justify-center bg-white",
                      activeResourceIndex <= 0 ? "text-petroleum/50 cursor-not-allowed opacity-40" : "text-petroleum hover:bg-petroleum/5 hover:border-l-corporate hover:shadow"
                    )}
                    style={{ boxShadow: '0 1px 3px 0 rgba(0,75,99,0.15), 0 1px 2px -1px rgba(0,75,99,0.12)' }}
                    aria-label="Recurso anterior"
                  >
                    <Icon name="fa-chevron-left" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="px-3 py-1 bg-gradient-to-br from-petroleum/10 to-corporate/10 text-petroleum rounded-full text-sm font-medium">
                    {activeResourceIndex + 1} / {resources.length}
                  </div>
                  <button
                    onClick={() => {
                      if (activeResourceIndex < resources.length - 1) {
                        const newIndex = activeResourceIndex + 1;
                        setActiveResourceIndex(newIndex);
                        handleOpenViewerModal(newIndex);
                      }
                    }}
                    disabled={activeResourceIndex >= resources.length - 1}
                    className={cn(
                      "w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-petroleum/25 border-l-4 border-l-petroleum transition-all duration-200 flex items-center justify-center bg-white",
                      activeResourceIndex >= resources.length - 1 ? "text-petroleum/50 cursor-not-allowed opacity-40" : "text-petroleum hover:bg-petroleum/5 hover:border-l-corporate hover:shadow"
                    )}
                    style={{ boxShadow: '0 1px 3px 0 rgba(0,75,99,0.15), 0 1px 2px -1px rgba(0,75,99,0.12)' }}
                    aria-label="Siguiente recurso"
                  >
                    <Icon name="fa-chevron-right" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>

          <ResourceViewerModal
            isOpen={viewerModalOpen}
            onClose={handleCloseViewerModals}
            resource={selectedResource}
            resourceType={selectedResourceType}
            onMarkAsViewed={handleMarkAsViewed}
            onPreviousResource={handlePreviousResource}
            onNextResource={handleNextResource}
            currentIndex={activeResourceIndex}
            totalResources={resources.length}
            onOpenImmersiveView={handleOpenImmersivePdf}
            onOpenOVA={handleOpenOVA}
            youtubeDuration={youtubeDuration}
            durationLoading={durationLoading}
          />

          {ovaModalOpen && selectedResource && (
            <QueEsPrompt_OVA_Original onClose={handleCloseViewerModals} />
          )}

          {immersivePdfModalOpen && immersivePdfResource && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="relative w-full h-full max-w-6xl bg-white rounded-3xl overflow-hidden flex flex-col" style={{ boxShadow: '0 25px 50px -12px rgba(0,75,99,0.25)' }}>
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-petroleum to-corporate backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <Icon name="fa-file-pdf" className="text-[#06B6D4] text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{immersivePdfResource.title}</h2>
                      <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                        <span>Vista inmersiva</span>
                        <span>•</span>
                        <span>Pantalla completa</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { document.documentElement.requestFullscreen?.(); }}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium border-none"
                  >
                    <Icon name="fa-expand" className="w-5 h-5 text-white" />
                    Pantalla completa
                  </button>
                  <button
                    onClick={handleCloseViewerModals}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium border-none"
                  >
                    <Icon name="fa-times" className="w-5 h-5 text-white" />
                    Cerrar
                  </button>
                </div>
                <div className="flex-1 relative">
                  <iframe
                    src={`${immersivePdfResource.url}#view=FitH&toolbar=0&navpanes=0&scrollbar=1`}
                    title={`${immersivePdfResource.title} - Vista inmersiva`}
                    id="immersive-pdf-iframe" className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default TopicResourcesModal;
