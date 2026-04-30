import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import ResourceSelector from './ResourceSelector';
import ResourceViewerModal from './ResourceViewerModal';
import QueEsPrompt_OVA_Original from './QueEsPrompt_OVA_Original';
import { getResourcesForTopic } from './constants/moduleResources';

const TopicResourcesModal = ({
  isOpen = false,
  onClose,
  topicData = null,
  className = ''
}) => {
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [ovaModalOpen, setOvaModalOpen] = useState(false);
  const [immersivePdfModalOpen, setImmersivePdfModalOpen] = useState(false);
  const [immersivePdfResource, setImmersivePdfResource] = useState(null);

  const topicResources = topicData ? getResourcesForTopic(topicData.title) : null;
  const resources = topicResources?.resources || [];

  useEffect(() => {
    if (topicData && resources.length > 0) {
      setActiveResourceIndex(0);
      setViewerModalOpen(false);
      setSelectedResource(null);
      setOvaModalOpen(false);
      setImmersivePdfModalOpen(false);
    }
  }, [topicData, resources.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
    setViewerModalOpen(false);
    setOvaModalOpen(false);
    setImmersivePdfModalOpen(false);
    setSelectedResource(null);
    setImmersivePdfResource(null);
  };

  const handleMarkAsViewed = (resourceId) => {
    console.log(`Recurso ${resourceId} marcado como visto`);
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
            className="fixed inset-0 z-[100] backdrop-blur-md bg-black/40"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-xl",
                "pointer-events-auto overflow-hidden flex flex-col",
                "h-[90vh] max-h-[90vh] mx-2 sm:mx-4",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-[#004B63] to-[#00BCD4]">
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
                  onClick={onClose}
                  className={cn(
                    "mt-3 sm:mt-0 ml-0 sm:ml-4 p-2 sm:p-2.5 rounded-lg sm:rounded-xl",
                    "bg-white text-[#004B63] hover:bg-slate-100 transition-colors duration-200",
                    "flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2"
                  )}
                  aria-label="Cerrar modal"
                >
                  <Icon name="fa-xmark" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:hidden">Cerrar</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 px-4 sm:px-6 py-3 bg-white border-b border-slate-200/60">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                    <Icon name="fa-clock" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#004B63]" />
                  </div>
                  <span>{topicResources.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                    <Icon name="fa-chart-line" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#004B63]" />
                  </div>
                  <span className="px-1.5 sm:px-2 py-0.5 bg-slate-100 rounded-full text-slate-700 font-medium text-xs sm:text-sm">
                    {topicResources.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                    <Icon name="fa-layer-group" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#004B63]" />
                  </div>
                  <span>{resources.length} recurso{resources.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-slate-200/60">
                {topicResources.learningObjectives && topicResources.learningObjectives.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#004B63] mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                        <Icon name="fa-bullseye" className="text-[#004B63] w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      Objetivo de aprendizaje
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed ml-7">
                      {topicResources.learningObjectives[0]}
                    </p>
                  </div>
                )}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {topicResources.description}
                </p>
              </div>

              <div className="overflow-hidden">
                <div className="px-6 pt-4 pb-4 border-b border-slate-200/60">
                  <ResourceSelector
                    resources={resources}
                    activeResourceIndex={activeResourceIndex}
                    onResourceSelect={(index) => {
                      setActiveResourceIndex(index);
                      handleOpenViewerModal(index);
                    }}
                  />
                </div>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200/60 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    "bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 text-[#004B63] text-sm sm:text-lg"
                  )}>
                    {resources[activeResourceIndex]?.type === 'video' ? <Icon name="fa-video" className="text-[#004B63] w-4 h-4 sm:w-5 sm:h-5" /> :
                     (resources[activeResourceIndex]?.type === 'document' || resources[activeResourceIndex]?.type === 'documento' || resources[activeResourceIndex]?.type === 'pdf' || resources[activeResourceIndex]?.type === 'pdf-thumbnail') ? <Icon name="fa-file-lines" className="text-[#004B63] w-4 h-4 sm:w-5 sm:h-5" /> :
                     (resources[activeResourceIndex]?.type === 'image' || resources[activeResourceIndex]?.type === 'imagen') ? <Icon name="fa-image" className="text-[#004B63] w-4 h-4 sm:w-5 sm:h-5" /> :
                     (resources[activeResourceIndex]?.type === 'ova' || resources[activeResourceIndex]?.type === 'ova-thumbnail') ? <Icon name="fa-brain" className="text-[#004B63] w-4 h-4 sm:w-5 sm:h-5" /> :
                     (resources[activeResourceIndex]?.type === 'interactive' || resources[activeResourceIndex]?.type === 'interactivo') ? <Icon name="fa-puzzle-piece" className="text-[#004B63] w-4 h-4 sm:w-5 sm:h-5" /> : <Icon name="fa-file" className="text-[#004B63] w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                      {resources[activeResourceIndex]?.title || "Selecciona un recurso"}
                    </h4>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-slate-500">
                      {resources[activeResourceIndex]?.type === 'video' && resources[activeResourceIndex]?.duration && (
                        <span>{resources[activeResourceIndex]?.duration}</span>
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
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-slate-200/60 border-l-4 border-l-[#004B63] transition-all duration-200 flex items-center justify-center bg-white shadow-sm",
                      activeResourceIndex <= 0 ? "text-slate-400 cursor-not-allowed opacity-40" : "text-[#004B63] hover:bg-slate-50 hover:border-l-[#00BCD4] hover:shadow"
                    )}
                    aria-label="Recurso anterior"
                  >
                    <Icon name="fa-chevron-left" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="px-3 py-1 bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 text-[#004B63] rounded-full text-sm font-medium">
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
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-slate-200/60 border-l-4 border-l-[#004B63] transition-all duration-200 flex items-center justify-center bg-white shadow-sm",
                      activeResourceIndex >= resources.length - 1 ? "text-slate-400 cursor-not-allowed opacity-40" : "text-[#004B63] hover:bg-slate-50 hover:border-l-[#00BCD4] hover:shadow"
                    )}
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
          />

          {ovaModalOpen && selectedResource && (
            <QueEsPrompt_OVA_Original onClose={handleCloseViewerModals} />
          )}

          {immersivePdfModalOpen && immersivePdfResource && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="relative w-full h-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200/10 bg-gradient-to-r from-[#004B63] to-[#00BCD4]">
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
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default TopicResourcesModal;
