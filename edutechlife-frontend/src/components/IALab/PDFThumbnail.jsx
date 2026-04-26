/**
 * COMPONENTE: PDFThumbnail
 * 
 * Miniatura premium para visualización de documentos PDF con doble clic
 * para apertura inmersiva a pantalla completa
 * 
 * Características:
 * - Miniatura con diseño premium Edutechlife
 * - Evento onDoubleClick para visualización inmersiva
 * - Indicador visual de documento PDF
 * - Integración perfecta con cuadrícula de recursos
 * - Botón de cierre para regresar al dashboard
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import pdfDoc from '../../assets/docs/guia-anatomia-prompt.pdf';;

/**
 * Componente principal PDFThumbnail
 */
const PDFThumbnail = ({ 
  title = "Guía: Anatomía de un Prompt",
  pdfUrl = pdfDoc,
  description = "Documento PDF con estructura detallada de prompts efectivos",
  size = "4.0 MB",
  pages = 12,
  onOpenImmersiveView = null
}) => {
  // Estado para controlar la visualización inmersiva
  const [isImmersiveViewOpen, setIsImmersiveViewOpen] = useState(false);
  const iframeRef = useRef(null);

  // Manejar clic simple para abrir PDF en nueva pestaña
  const handleClick = () => {
    window.open(pdfUrl, '_blank');
  };

  // Manejar doble clic para abrir visualización inmersiva
  const handleDoubleClick = () => {
    if (onOpenImmersiveView) {
      onOpenImmersiveView();
    } else {
      setIsImmersiveViewOpen(true);
      // Bloquear scroll del body cuando se abre el visor inmersivo
      document.body.style.overflow = 'hidden';
    }
  };

  // Cerrar visualización inmersiva
  const handleCloseImmersiveView = () => {
    setIsImmersiveViewOpen(false);
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  };

  // Manejar clic en el overlay (fuera del visor)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseImmersiveView();
    }
  };

  return (
    <>
      {/* MINIATURA PDF - Tarjeta clickeable */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className="group relative w-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
        aria-label={`Abrir ${title} (clic para nueva pestaña, doble clic para vista inmersiva)`}
        title="Clic para abrir en nueva pestaña | Doble clic para vista inmersiva"
      >
        {/* Indicador de interactividad */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-[#004B63]/10 backdrop-blur-sm px-2 py-1 rounded-full">
            <Icon 
              name="fa-expand" 
              className="w-3 h-3 text-[#004B63] opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            />
            <span className="text-xs font-medium text-[#004B63] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Doble clic
            </span>
          </div>
        </div>

        {/* Contenido de la miniatura */}
        <div className="p-5">
        {/* Imagen de previsualización premium */}
        <div className="mb-4 relative">
          <div className="w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-400/20 border border-blue-200 flex items-center justify-center">
            {/* Imagen SVG de previsualización */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl flex items-center justify-center">
                  <Icon name="fa-file-pdf" className="text-white text-3xl" />
                </div>
                
                {/* Efectos visuales */}
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon name="fa-expand" className="text-white w-4 h-4" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon name="fa-book" className="text-white w-3 h-3" />
                </div>
              </div>
            </div>
            
            {/* Indicador de páginas */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Icon name="fa-file" className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-bold text-blue-700">{pages} páginas</span>
            </div>
          </div>
        </div>

          {/* Información del documento */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-lg leading-tight">
              {title}
            </h4>
            
            <p className="text-slate-600 text-sm leading-relaxed">
              {description}
            </p>

            {/* Metadatos del documento */}
            <div className="flex items-center gap-4 pt-2 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Icon name="fa-file" className="w-3 h-3" />
                <span>{pages} páginas</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="fa-weight-hanging" className="w-3 h-3" />
                <span>{size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="fa-pdf" className="w-3 h-3 text-red-500" />
                <span>PDF</span>
              </div>
            </div>
          </div>

          {/* Indicador de acción */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Icon name="fa-mouse-pointer" className="w-3 h-3 text-[#004B63]" />
                  <span className="text-xs text-slate-600 font-medium">Clic: Abrir PDF</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="fa-expand" className="w-3 h-3 text-[#00BCD4]" />
                  <span className="text-xs text-slate-600 font-medium">Doble clic: Vista inmersiva</span>
                </div>
              </div>
              <Icon 
                name="fa-arrow-up-right-from-square" 
                className="w-4 h-4 text-[#00BCD4] opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
              />
            </div>
          </div>
        </div>

        {/* Efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#004B63]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </motion.div>

      {/* VISUALIZACIÓN INMERSIVA - Modal a pantalla completa */}
      <AnimatePresence>
        {isImmersiveViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={handleOverlayClick}
          >
            {/* Contenedor principal del visor */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del visor inmersivo */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-[#004B63] to-[#006D8F]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Icon name="fa-file-pdf" className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                      <span>{size}</span>
                      <span>•</span>
                      <span>{pages} páginas</span>
                      <span>•</span>
                      <span>Vista inmersiva</span>
                    </div>
                  </div>
                </div>

                {/* Botones de control */}
                <div className="flex items-center gap-3">
                  {/* Botón de descarga */}
                  <a
                    href={pdfUrl}
                    download
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium backdrop-blur-sm"
                  >
                    <Icon name="fa-download" className="w-4 h-4" />
                    Descargar
                  </a>

                  {/* Botón de cerrar */}
                  <button
                    onClick={handleCloseImmersiveView}
                    className="px-4 py-2 bg-white text-[#004B63] hover:bg-slate-100 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium shadow-sm"
                    aria-label="Cerrar visor y volver al dashboard"
                  >
                    <Icon name="fa-times" className="w-4 h-4" />
                    Cerrar Visor
                  </button>
                </div>
              </div>

              {/* Contenedor del PDF */}
              <div className="relative w-full h-[calc(100%-5rem)]">
                <iframe
                  ref={iframeRef}
                  src={`${pdfUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=1`}
                  title={`${title} - Vista inmersiva`}
                  className="w-full h-full border-0"
                  allowFullScreen
                />

                {/* Overlay de instrucciones */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-200 shadow-lg flex items-center gap-3">
                    <Icon name="fa-mouse-pointer" className="w-4 h-4 text-[#004B63]" />
                    <span className="text-sm text-slate-700 font-medium">
                      Usa la rueda del mouse para hacer zoom • Arrastra para desplazarte
                    </span>
                    <button
                      onClick={() => iframeRef.current?.requestFullscreen?.()}
                      className="px-3 py-1.5 bg-[#00BCD4] text-white rounded-lg hover:bg-[#00BCD4]/90 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                    >
                      <Icon name="fa-expand" className="w-3 h-3" />
                      Pantalla completa
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer con controles de navegación */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="fa-lightbulb" className="w-4 h-4 text-amber-500" />
                    <span>Presiona ESC o haz clic fuera para salir de la vista inmersiva</span>
                  </div>
                  
                  <button
                    onClick={handleCloseImmersiveView}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <Icon name="fa-arrow-left" className="w-3 h-3" />
                    Volver al Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PDFThumbnail;