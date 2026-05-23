import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';
import { cn } from '../../forum/forumDesignSystem';
import { useIALabProgressContext } from '../../../context/IALabContext';
import Breadcrumbs from '../Breadcrumbs';
import { useIALabProgress } from '../../../hooks/IALab/useIALabProgress';
import useFullscreen from '../hooks/useFullscreen';
import { stopSpeech } from '../../../utils/speech';
import VideoViewer from './VideoViewer';
import DocumentViewer from './DocumentViewer';
import ImageViewer from './ImageViewer';
import InteractiveViewer from './InteractiveViewer';
import PDFThumbnailViewer from './PDFThumbnailViewer';
import OVAViewer from './OVAViewer';

const OVAChatGPTTools = lazy(() => import('../OVAChatGPTTools.jsx'));
const OVAEcosystemGuide = lazy(() => import('../OVAEcosystemGuide.jsx'));
const OVABuildGPT = lazy(() => import('../OVABuildGPT.jsx'));
const OVAEtica = lazy(() => import('../OVAEtica.jsx'));
const OVAIntroPrompt = lazy(() => import('../OVAIntroPrompt.jsx'));
const OVANotebookLab = lazy(() => import('../OVANotebookLab.jsx'));
const OVANotebookSimulator = lazy(() => import('../OVANotebookSimulator.jsx'));
const OVANotebookPodcastGuide = lazy(() => import('../OVANotebookPodcastGuide.jsx'));
const OVAPodcastStudio = lazy(() => import('../OVAPodcastStudio.jsx'));
const OVABiasLab = lazy(() => import('../OVABiasLab.jsx'));
const OVARiskSimulator = lazy(() => import('../OVARiskSimulator.jsx'));

const ResourceViewerModal = ({ 
  isOpen = false,
  onClose,
  resource = null,
  resourceType = null,
  onMarkAsViewed,
  onPreviousResource,
  onNextResource,
  currentIndex = 0,
  totalResources = 0,
  onOpenImmersiveView = null,
  onOpenOVA = null,
  youtubeDuration = null,
  durationLoading = false
}) => {
  const { activeMod, modules, markResourceAsViewed: markResourceInContext, recordLastTopic } = useIALabProgressContext();
  const { trackResourceViewed } = useIALabProgress();
  
  const [isMarkedAsViewed, setIsMarkedAsViewed] = useState(false);

  const [isOvaFullscreen, setIsOvaFullscreen] = useState(false);
  
  const modalRef = useRef(null);
  const { isFullscreen: isModalFullscreen, toggleFullscreen: toggleModalFullscreen } = useFullscreen(modalRef);

  const handleClose = () => {
    stopSpeech();
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (isOvaFullscreen) {
          setIsOvaFullscreen(false);
        } else {
          handleClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isOvaFullscreen]);

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

  useEffect(() => {
    setIsMarkedAsViewed(false);
  }, [resource?.id]);

  if (!isOpen || !resource) {
    return null;
  }

const OVA_COMPONENTS = {
  'gpts-ova-1': OVABuildGPT,
  'chatgpt-ova-ecosystem': OVAEcosystemGuide,
  'intro-ova-1': OVAEtica,
  'prompt-ova-html-1': OVAIntroPrompt,
  'notebooklm-ova-1': OVANotebookLab,
  'notebook-summary-ova-1': OVANotebookSimulator,
  'notebook-audio-guide-1': OVANotebookPodcastGuide,
  'notebook-audio-ova-1': OVAPodcastStudio,
  'bias-ova-1': OVABiasLab,
  'privacy-ova-1': OVARiskSimulator,
};

const renderOVAById = (resourceId) => {
  const OVAComponent = OVA_COMPONENTS[resourceId];
  return OVAComponent ? <OVAComponent /> : <OVAChatGPTTools />;
};

  const renderViewer = () => {
    if (!resource) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-petroleum/5 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-file-circle-question" className="text-petroleum/50 text-4xl mb-4" />
            <p className="text-petroleum/80 font-medium">No hay recurso seleccionado</p>
          </div>
        </div>
      );
    }

    try {
      switch (resourceType || resource.type) {
        case 'video':
          return <VideoViewer resource={resource} youtubeDuration={youtubeDuration} durationLoading={durationLoading} onVideoEnded={handleAutoComplete} />;
        
        case 'documento':
        case 'document':
          return <DocumentViewer resource={resource} />;
        
        case 'imagen':
        case 'image':
          return <ImageViewer resource={resource} />;
        
        case 'interactivo':
        case 'interactive':
          return <InteractiveViewer resource={resource} />;
        
        case 'pdf':
        case 'pdf-thumbnail':
          return <PDFThumbnailViewer resource={resource} />;
        
        case 'ova':
        case 'ova-thumbnail':
          return <OVAViewer 
            resource={resource} 
            onClose={onClose}
          />;
        
        case 'ova_interactive':
          return (
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-petroleum/5">
                <div className="text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-petroleum border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-petroleum/80 font-bold">Cargando simulador interactivo...</p>
                </div>
              </div>
            }>
              {renderOVAById(resource.id)}
            </Suspense>
          );
        
        default:
          return (
            <div className="w-full h-full flex items-center justify-center bg-amber-50 rounded-2xl">
              <div className="text-center">
                <Icon name="fa-triangle-exclamation" className="text-amber-500 text-4xl mb-4" />
                <p className="text-amber-700 font-medium">Tipo de recurso no soportado: {resource.type}</p>
              </div>
            </div>
          );
      }
    } catch (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-circle-xmark" className="text-red-500 text-4xl mb-4" />
            <p className="text-red-700 font-medium">Error al cargar el recurso</p>
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          </div>
        </div>
      );
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleMarkAsViewed = async () => {
    setIsMarkedAsViewed(true);
    if (onMarkAsViewed) {
      onMarkAsViewed(resource.id);
    }
    if (resource?.id && activeMod) {
      markResourceInContext(activeMod, resource.id);
      const rt = resource.type || 'document';
      await trackResourceViewed(activeMod, resource.id, rt);

      if (recordLastTopic) {
        const typeLabels = {
          video: 'Video',
          infographic: 'Infografia',
          document: 'Documento',
          ova_interactive: 'OVA Interactivo',
          lab: 'Laboratorio',
          reading: 'Lectura',
        };
        recordLastTopic(
          activeMod,
          '',
          resourceType,
          resource.title || `${typeLabels[rt] || 'Recurso'}`,
          resource.id
        );
      }
    }
  };

  const handleAutoComplete = () => {
    if (!isMarkedAsViewed) {
      handleMarkAsViewed();
    }
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
            aria-hidden="true" className="fixed inset-0 z-[200] backdrop-blur-md bg-black/40"
            onClick={handleClose}
          />

              <div className="fixed inset-0 z-[201] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                <motion.div
                  ref={modalRef}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  role="dialog" aria-modal="true"
                  className={cn(
                    "w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl",
                    "pointer-events-auto overflow-hidden",
                    "flex flex-col",
                    "h-[90dvh] max-h-[900px]",
                    "mx-2 sm:mx-4",
                    "shadow-xl shadow-petroleum/20"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-petroleum to-corporate backdrop-blur-sm">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                  <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
                    {(resource.type === 'video') ? <Icon name="fa-video" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'document' || resource.type === 'documento') ? <Icon name="fa-file-lines" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'image' || resource.type === 'imagen') ? <Icon name="fa-image" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'interactive' || resource.type === 'interactivo') ? <Icon name="fa-puzzle-piece" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'pdf' || resource.type === 'pdf-thumbnail') ? <Icon name="fa-file-pdf" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                      (resource.type === 'ova' || resource.type === 'ova-thumbnail' || resource.type === 'ova_interactive') ? <Icon name="fa-brain" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     <Icon name="fa-file" className="text-white w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Breadcrumbs
                      segments={[
                        { label: 'Inicio' },
                        { label: modules?.find(m => m.id === activeMod)?.title || `Módulo ${activeMod}` },
                        { label: resource.type?.replace(/_/g, ' ')?.toUpperCase() },
                      ]}
                      size="text-xs"
                      className="mb-1 text-white/60"
                    />
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                      {resource.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-white/80 text-xs sm:text-sm mt-1">
                      {resource.type === 'video' && (
                        <>
                          <span>{durationLoading ? '...' : (youtubeDuration || resource.duration)}</span>
                          <span>•</span>
                        </>
                      )}
                      {resource.format && (
                        <>
                          <span>{resource.format}</span>
                          <span>•</span>
                        </>
                      )}
                      {resource.size && (
                        <>
                          <span>{resource.size}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Vista previa</span>
                    </div>
                  </div>
                </div>

                {resource.type !== 'video' && (
                  <button
                    onClick={toggleModalFullscreen}
                    className="mt-3 sm:mt-0 ml-0 sm:ml-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                    aria-label={isModalFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                  >
                    <Icon name={isModalFullscreen ? "fa-compress" : "fa-expand"} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-sm sm:text-base text-white">{isModalFullscreen ? "Salir" : "Pantalla completa"}</span>
                  </button>
                )}

                <button
                  onClick={handleClose}
                  className="mt-3 sm:mt-0 ml-0 sm:ml-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                  aria-label="Cerrar visor y volver al tema"
                >
                  <Icon name="fa-times" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-sm sm:text-base text-white">Cerrar</span>
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-white dark:bg-slate-800">
                {renderViewer()}
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-petroleum/25 dark:border-petroleum/40 bg-white dark:bg-slate-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  {totalResources > 1 && (
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                      <button
                        onClick={onPreviousResource}
                        disabled={currentIndex <= 0}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors duration-200 text-sm sm:text-base font-medium",
                          currentIndex <= 0
                            ? "text-petroleum/50 cursor-not-allowed"
                            : "bg-white dark:bg-slate-800 border border-petroleum/25 dark:border-petroleum/40 text-petroleum/80 dark:text-petroleum hover:bg-petroleum/5 hover:text-petroleum"
                        )}
                        aria-label="Recurso anterior"
                      >
                        <Icon name="fa-chevron-left" className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Anterior</span>
                      </button>
                      
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-petroleum/10 rounded-lg text-petroleum/80 font-medium text-sm sm:text-base">
                        {currentIndex + 1} / {totalResources}
                      </div>
                      
                      <button
                        onClick={onNextResource}
                        disabled={currentIndex >= totalResources - 1}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors duration-200 text-sm sm:text-base font-medium",
                          currentIndex >= totalResources - 1
                            ? "text-petroleum/50 cursor-not-allowed"
                            : "bg-white dark:bg-slate-800 border border-petroleum/25 dark:border-petroleum/40 text-petroleum/80 dark:text-petroleum hover:bg-petroleum/5 hover:text-petroleum"
                        )}
                        aria-label="Siguiente recurso"
                      >
                        <span className="hidden sm:inline">Siguiente</span>
                        <Icon name="fa-chevron-right" className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleMarkAsViewed}
                    aria-label={isMarkedAsViewed ? "Marcado como visto" : "Marcar como visto"}
                    className={cn(
                      "px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base w-full sm:w-auto justify-center border-none",
                      isMarkedAsViewed
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gradient-to-r from-petroleum to-corporate hover:from-corporate-deep hover:to-corporate-darker text-white shadow-md hover:shadow-lg"
                    )}
                  >
                    {isMarkedAsViewed ? (
                      <>
                        <Icon name="fa-check-circle" className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Marcado como visto</span>
                      </>
                    ) : (
                      <>
                        <Icon name="fa-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Marcar como visto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {isOvaFullscreen && (
            <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-900 flex flex-col">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate mr-4">
                  {resource?.title}
                </span>
                <button
                  onClick={() => setIsOvaFullscreen(false)}
                  className="px-5 py-2.5 bg-petroleum hover:bg-petroleum-dark text-white rounded-xl flex items-center gap-2 font-medium transition-colors shadow-md border-none flex-shrink-0"
                  aria-label="Salir de pantalla completa"
                >
                  <Icon name="fa-compress" className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-white dark:bg-slate-800">
                {renderViewer()}
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default ResourceViewerModal;
