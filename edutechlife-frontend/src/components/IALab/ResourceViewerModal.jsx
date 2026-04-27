/**
 * COMPONENTE: ResourceViewerModal
 * 
 * Modal Pop-up Central para visualización de recursos educativos
 * Se abre al hacer clic en cualquier recurso (PDF, OVA, Video, etc.)
 * 
 * Características:
 * - Modal central independiente (pop-up sobre dashboard)
 * - Ocupa 90% de pantalla (height: 90vh)
 * - Botón de cierre claro con "X"
 * - Diseño premium Edutechlife (#004B63, #00BCD4)
 * - Responsive en todos dispositivos
 * - Navegación entre recursos integrada
 * - Botón "Marcar como visto" en este modal
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import QueEsPrompt_OVA_Original from './QueEsPrompt_OVA_Original';
import useFullscreen from './hooks/useFullscreen';

/**
 * Componente para visualizar videos (YouTube/Vimeo)
 */
const VideoViewer = ({ resource }) => {
  const videoRef = useRef(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(videoRef);

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
      {/* Contenedor del video */}
      <div 
        ref={videoRef}
        className="relative w-full h-full flex items-center justify-center"
      >
        <iframe
          src={resource.url}
          title={resource.title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Overlay de controles */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3">
        {/* Botón de pantalla completa */}
        <button
          onClick={toggleFullscreen}
          className={cn(
            "px-4 py-2 rounded-xl flex items-center gap-2",
            "bg-white/90 backdrop-blur-sm border border-white/20",
            "text-slate-800 font-medium text-sm",
            "hover:bg-white hover:scale-105",
            "transition-all duration-200",
            "shadow-lg"
          )}
          aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          <Icon 
            name={isFullscreen ? "fa-compress" : "fa-expand"} 
            className="w-4 h-4" 
          />
          {isFullscreen ? "Salir" : "Pantalla completa"}
        </button>

        {/* Indicador de duración */}
        {resource.duration && (
          <div className="px-3 py-1.5 bg-black/70 text-white text-sm font-medium rounded-lg">
            {resource.duration}
          </div>
        )}
      </div>

      {/* Indicador de pantalla completa */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full">
          Pantalla completa activa
        </div>
      )}
    </div>
  );
};

/**
 * Componente para visualizar documentos PDF
 */
const DocumentViewer = ({ resource }) => {
  const [page, setPage] = useState(1);
  const totalPages = resource.pages || 1;
  const iframeRef = useRef(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(iframeRef);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200">
      {/* Header del documento */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 p-2 rounded-lg">
            <Icon name="fa-file-pdf" className="text-[#06B6D4] w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{resource.title}</h4>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{resource.format}</span>
              {resource.size && <span>• {resource.size}</span>}
              {resource.pages && <span>• {resource.pages} páginas</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de pantalla completa */}
          <button
            onClick={toggleFullscreen}
            className={cn(
              "px-4 py-2 rounded-lg flex items-center gap-2",
              "bg-slate-100 text-slate-700 font-medium",
              "hover:bg-slate-200 hover:scale-105",
              "transition-all duration-200"
            )}
          >
            <Icon 
              name={isFullscreen ? "fa-compress" : "fa-expand"} 
              className="w-4 h-4" 
            />
            {isFullscreen ? "Salir" : "Pantalla completa"}
          </button>

          {/* Botón de descarga */}
          <a
            href={resource.url}
            download
            className="px-4 py-2 bg-[#00BCD4] text-white rounded-lg hover:bg-[#00BCD4]/90 transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Icon name="fa-download" className="w-4 h-4" />
            Descargar
          </a>
        </div>
      </div>

      {/* Visualizador del documento */}
      <div className="flex-1 relative" ref={iframeRef}>
        <iframe
          src={`${resource.url}#view=FitH`}
          title={resource.title}
          className="w-full h-full border-0"
          loading="lazy"
        />
        
        {/* Overlay de navegación para PDFs */}
        {resource.pages && resource.pages > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-lg">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className={cn(
                  "px-3 py-1 rounded-lg flex items-center gap-2",
                  page <= 1 
                    ? "text-slate-400 cursor-not-allowed" 
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon name="fa-chevron-left" className="w-4 h-4" />
                Anterior
              </button>
              
              <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium">
                Página {page} de {totalPages}
              </div>
              
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                className={cn(
                  "px-3 py-1 rounded-lg flex items-center gap-2",
                  page >= totalPages
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                Siguiente
                <Icon name="fa-chevron-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Componente para visualizar imágenes e infografías
 */
const ImageViewer = ({ resource }) => {
  const imageRef = useRef(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(imageRef);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200">
      {/* Header de la imagen */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 p-2 rounded-lg">
            <Icon name="fa-image" className="text-[#06B6D4] w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{resource.title}</h4>
            {resource.interactive && (
              <span className="text-sm text-purple-600 font-medium">Interactiva</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de pantalla completa */}
          <button
            onClick={toggleFullscreen}
            className={cn(
              "px-4 py-2 rounded-lg flex items-center gap-2",
              "bg-slate-100 text-slate-700 font-medium",
              "hover:bg-slate-200 hover:scale-105",
              "transition-all duration-200"
            )}
          >
            <Icon 
              name={isFullscreen ? "fa-compress" : "fa-expand"} 
              className="w-4 h-4" 
            />
            {isFullscreen ? "Salir" : "Pantalla completa"}
          </button>

          {/* Botón de descarga */}
          <a
            href={resource.url}
            download
            className="px-4 py-2 bg-[#00BCD4] text-white rounded-lg hover:bg-[#00BCD4]/90 transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Icon name="fa-download" className="w-4 h-4" />
            Descargar
          </a>
        </div>
      </div>

      {/* Contenedor de la imagen */}
      <div 
        ref={imageRef}
        className="flex-1 relative bg-slate-50 flex items-center justify-center p-4"
      >
        {/* Estado de carga */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00BCD4]/20 border-t-[#00BCD4] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Imagen principal */}
        <img
          src={resource.url}
          alt={resource.title}
          className={cn(
            "max-w-full max-h-full object-contain rounded-lg",
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Indicador de pantalla completa */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full">
            Pantalla completa activa
          </div>
        )}
      </div>

      {/* Descripción (si existe) */}
      {resource.description && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-sm text-slate-600">{resource.description}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente para recursos interactivos
 */
const InteractiveViewer = ({ resource }) => {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#004B63]/5 to-[#06B6D4]/5 rounded-2xl overflow-hidden border border-[#004B63]/10">
      <div className="flex items-center justify-between p-4 border-b border-[#004B63]/10">
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 p-2 rounded-lg">
            <Icon name="fa-puzzle-piece" className="text-[#06B6D4] w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{resource.title}</h4>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>Recurso interactivo</span>
              {resource.estimatedTime && <span>• {resource.estimatedTime}</span>}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-[#004B63]/10 text-[#004B63] rounded-lg font-medium text-sm">
          <Icon name="fa-bolt" className="w-4 h-4 inline mr-1" />
          Interactivo
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-[#004B63] to-[#06B6D4] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Icon name="fa-bolt" className="text-white text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            {resource.title}
          </h3>
          
          <p className="text-slate-600 mb-6">
            {resource.description || "Este recurso interactivo está diseñado para aprendizaje práctico."}
          </p>

          <div className="bg-white rounded-xl p-6 border border-[#004B63]/10 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">Simulación activa</span>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">En tiempo real</span>
            </div>
            
            <div className="h-32 bg-gradient-to-r from-[#004B63]/5 to-[#06B6D4]/5 rounded-lg border border-[#004B63]/10 flex items-center justify-center">
              <div className="text-center">
                <Icon name="fa-spinner" className="text-[#06B6D4] text-2xl mb-2 animate-spin" />
                <p className="text-sm text-slate-600">Cargando experiencia interactiva...</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            <p>Este es un recurso interactivo que requiere interacción del usuario.</p>
            <p>En producción, aquí se cargaría la herramienta interactiva real.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente para PDF Thumbnail (con doble clic para vista inmersiva)
 */
const PDFThumbnailViewer = ({ resource }) => {
  const openFullScreen = () => window.open(resource.url, '_blank');

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end items-center mb-2 px-1">
        <button
          onClick={openFullScreen}
          className="text-sm font-medium text-[#004B63] bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-md transition-colors flex items-center gap-2"
        >
          <Icon name="fa-expand" className="w-3.5 h-3.5" />
          Abrir en pantalla completa
          <Icon name="fa-arrow-up-right-from-square" className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-1 bg-slate-50 rounded-2xl overflow-hidden">
        <iframe
          src={resource.url}
          title={resource.title}
          className="w-full h-full min-h-[60vh] rounded-lg border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

/**
 * Componente para OVA Thumbnail
 */
const OVAThumbnailViewer = ({ resource, onOpenOVA }) => {
  // Manejar clic para abrir OVA
  const handleClick = () => {
    if (onOpenOVA) {
      onOpenOVA(resource);
    }
  };

  return (
    <div className="w-full h-full">
      <div 
        onClick={handleClick}
        className="group relative w-full h-full bg-gradient-to-br from-[#004B63]/5 to-[#06B6D4]/5 rounded-2xl border border-[#004B63]/10 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
        aria-label={`Abrir ${resource.title}`}
        title="Haz clic para abrir el OVA interactivo"
      >
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#004B63] to-[#0A3550] shadow-2xl flex items-center justify-center mb-6">
            <Icon name="fa-brain" className="text-white text-4xl" />
          </div>
          
          <h4 className="font-bold text-slate-800 text-xl text-center mb-3">
            {resource.title}
          </h4>
          
          <p className="text-slate-600 text-center mb-6">
            {resource.description}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/50 rounded-xl p-4 border border-[#004B63]/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="fa-clock" className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-sm font-medium text-slate-700">Tiempo estimado</span>
              </div>
              <p className="text-lg font-bold text-[#004B63]">{resource.estimatedTime || "15 minutos"}</p>
            </div>
            
            <div className="bg-white/50 rounded-xl p-4 border border-[#004B63]/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="fa-chart-line" className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-sm font-medium text-slate-700">Dificultad</span>
              </div>
              <p className="text-lg font-bold text-[#004B63]">{resource.difficulty || "Intermedio"}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#004B63]/10 bg-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="fa-hand-pointer" className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-sm text-slate-700 font-medium">
                Haz clic para explorar el laboratorio interactivo
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#004B63] font-bold">EXPLORAR</span>
              <Icon name="fa-arrow-right" className="w-5 h-5 text-[#004B63]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal ResourceViewerModal
 */
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
  onOpenOVA = null
}) => {
  // Estado para controlar si se marcó como visto
  const [isMarkedAsViewed, setIsMarkedAsViewed] = useState(false);

  // Manejar tecla ESC para cerrar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
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

  // Resetear estado de "marcado como visto" cuando cambia el recurso
  useEffect(() => {
    setIsMarkedAsViewed(false);
  }, [resource?.id]);

  // Si no está abierto, no renderizar nada
  if (!isOpen || !resource) {
    return null;
  }

  // Renderizar el visualizador apropiado según el tipo de recurso
  const renderViewer = () => {
    if (!resource) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-file-circle-question" className="text-slate-400 text-4xl mb-4" />
            <p className="text-slate-500 font-medium">No hay recurso seleccionado</p>
          </div>
        </div>
      );
    }

    try {
      switch (resourceType || resource.type) {
        case 'video':
          return <VideoViewer resource={resource} />;
        
        case 'document':
          return <DocumentViewer resource={resource} />;
        
        case 'image':
          return <ImageViewer resource={resource} />;
        
        case 'interactive':
          return <InteractiveViewer resource={resource} />;
        
        case 'pdf-thumbnail':
          return <PDFThumbnailViewer resource={resource} />;
        
        case 'ova-thumbnail':
          return <OVAThumbnailViewer 
            resource={resource} 
            onOpenOVA={onOpenOVA}
          />;
        
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

  // Animaciones
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

  // Manejar "Marcar como visto"
  const handleMarkAsViewed = () => {
    setIsMarkedAsViewed(true);
    if (onMarkAsViewed) {
      onMarkAsViewed(resource.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[200] backdrop-blur-md bg-black/40"
            onClick={onClose}
          />

              {/* Modal principal - 90% de pantalla */}
              <div className="fixed inset-0 z-[201] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl",
                    "pointer-events-auto overflow-hidden",
                    "flex flex-col",
                    "h-[90vh] max-h-[90vh]", // 90% de altura como solicitado
                    "mx-2 sm:mx-4" // Margenes responsive
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
              {/* Header del modal */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-slate-200/10 bg-[#004B63]">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                  <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
                    {resource.type === 'video' ? <Icon name="fa-video" className="text-[#06B6D4] w-5 h-5 sm:w-6 sm:h-6" /> :
                     resource.type === 'document' ? <Icon name="fa-file-lines" className="text-[#06B6D4] w-5 h-5 sm:w-6 sm:h-6" /> :
                     resource.type === 'image' ? <Icon name="fa-image" className="text-[#06B6D4] w-5 h-5 sm:w-6 sm:h-6" /> :
                     resource.type === 'interactive' ? <Icon name="fa-puzzle-piece" className="text-[#06B6D4] w-5 h-5 sm:w-6 sm:h-6" /> :
                     resource.type === 'pdf-thumbnail' ? <Icon name="fa-file-pdf" className="text-[#06B6D4] w-5 h-5 sm:w-6 sm:h-6" /> :
                     resource.type === 'ova-thumbnail' ? <Icon name="fa-brain" className="text-[#06B6D4] w-5 h-5 sm:w-6 sm:h-6" /> :
                     <Icon name="fa-file" className="text-[#06B6D4] w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                  
                  {/* Título y metadatos */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                      {resource.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-white/80 text-xs sm:text-sm mt-1">
                      {resource.type === 'video' && resource.duration && (
                        <>
                          <span>{resource.duration}</span>
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

                {/* Botón de cerrar */}
                <button
                  onClick={onClose}
                  className="mt-3 sm:mt-0 ml-0 sm:ml-4 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                  aria-label="Cerrar visor y volver al tema"
                >
                  <Icon name="fa-times" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-sm sm:text-base text-white">Cerrar</span>
                </button>
              </div>

              {/* Contenido principal del recurso */}
              <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
                <div className="w-full h-full min-h-[300px] sm:min-h-[400px]">
                  {renderViewer()}
                </div>
              </div>

              {/* Footer con navegación y acciones */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-white">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  {/* Navegación entre recursos */}
                  {totalResources > 1 && (
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                      <button
                        onClick={onPreviousResource}
                        disabled={currentIndex <= 0}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors duration-200 text-sm sm:text-base font-medium",
                          currentIndex <= 0
                            ? "text-slate-400 cursor-not-allowed"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#004B63]"
                        )}
                        aria-label="Recurso anterior"
                      >
                        <Icon name="fa-chevron-left" className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Anterior</span>
                      </button>
                      
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 rounded-lg text-slate-700 font-medium text-sm sm:text-base">
                        {currentIndex + 1} / {totalResources}
                      </div>
                      
                      <button
                        onClick={onNextResource}
                        disabled={currentIndex >= totalResources - 1}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors duration-200 text-sm sm:text-base font-medium",
                          currentIndex >= totalResources - 1
                            ? "text-slate-400 cursor-not-allowed"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#004B63]"
                        )}
                        aria-label="Siguiente recurso"
                      >
                        <span className="hidden sm:inline">Siguiente</span>
                        <Icon name="fa-chevron-right" className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}

                  {/* Botón "Marcar como visto" */}
                  <button
                    onClick={handleMarkAsViewed}
                    className={cn(
                      "px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base w-full sm:w-auto justify-center border-none",
                      isMarkedAsViewed
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gradient-to-r from-[#004B63] to-[#06B6D4] hover:from-[#003A4D] hover:to-[#08c5e6] text-white shadow-md hover:shadow-lg"
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
        </>
      )}
    </AnimatePresence>
  );
};

export default ResourceViewerModal;