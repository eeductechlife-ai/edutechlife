/**
 * COMPONENTE: ResourceViewer
 * 
 * Miniatura inteligente que detecta automáticamente el tipo de recurso
 * y muestra una vista previa clickeable que abre el modal de visualización
 * 
 * Características:
 * - Detección automática de tipo de recurso
 * - Miniatura clickeable que abre modal pop-up
 * - Estados de carga y error
 * - Diseño responsive premium
 * - Delegación a ResourceViewerModal para visualización completa
 */

import React, { useState, lazy, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import PDFThumbnail from './PDFThumbnail';
import OVAThumbnail from './OVAThumbnail';
import { useIALabStore } from '../../store/ialabStore';
import { useTranslation } from '../../i18n/I18nProvider';

const OVAChatGPTTools = lazy(() => import('./OVAChatGPTTools.jsx'));
const OVAEcosystemGuide = lazy(() => import('./OVAEcosystemGuide.jsx'));
const OVANotebookLab = lazy(() => import('./OVANotebookLab.jsx'));
const OVANotebookSimulator = lazy(() => import('./OVANotebookSimulator.jsx'));
const OVANotebookPodcastGuide = lazy(() => import('./OVANotebookPodcastGuide.jsx'));
const OVABiasLab = lazy(() => import('./OVABiasLab.jsx'));
const OVARiskSimulator = lazy(() => import('./OVARiskSimulator.jsx'));

/**
 * Componente principal ResourceViewer
 * Ahora muestra miniaturas clickeables que abren el modal de visualización
 */
const ResourceViewer = ({ 
  resource, 
  className = '',
  onOpenViewerModal,
  onOpenImmersiveView,
  onOpenOVA
}) => {
  const { t } = useTranslation();
  const [viewerError, setViewerError] = useState(null);

  const handleOVAComplete = useCallback(() => {
    if (resource?.id) {
      const store = useIALabStore.getState();
      const moduleId = store.activeMod;
      store.addViewedResource(resource.id);
      if (moduleId && store.markResourceAsViewed) {
        store.markResourceAsViewed(moduleId, resource.id);
      }
    }
  }, [resource?.id]);

  // Renderizar la miniatura apropiada según el tipo de recurso
  const renderThumbnail = () => {
    if (!resource) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-file-circle-question" className="text-slate-600 text-4xl mb-4" />
            <p className="text-slate-500 font-medium">{t('ialab.resource_viewer.no_resource')}</p>
          </div>
        </div>
      );
    }

    try {
      switch (resource.type) {
        case 'video':
          return (
            <div 
              onClick={() => onOpenViewerModal && onOpenViewerModal()}
              className="group relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="flex-1 p-6 flex flex-col items-center justify-center">
                <div className={cn(
                  "w-24 h-24 rounded-2xl flex items-center justify-center mb-6",
                  "bg-gradient-to-br from-petroleum to-corporate"
                )}>
                  <Icon name="fa-video" className="text-white text-3xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg text-center mb-3">
                  {resource.title}
                </h4>
                <p className="text-slate-600 text-center mb-6">
                  {resource.description || t('ialab.resource_viewer.click_to_view')}
                </p>
                <div className="flex items-center gap-2 text-sm text-corporate font-medium">
                  <Icon name="fa-expand" className="w-4 h-4" />
                  <span>{t('ialab.resource_viewer.click_to_open')}</span>
                </div>
              </div>
            </div>
          );
        
        case 'documento':
        case 'document':
          return (
            <div 
              onClick={() => onOpenViewerModal && onOpenViewerModal()}
              className="group relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="flex-1 p-6 flex flex-col items-center justify-center">
                <div className={cn(
                  "w-24 h-24 rounded-2xl flex items-center justify-center mb-6",
                  "bg-gradient-to-br from-petroleum to-corporate"
                )}>
                  <Icon name="fa-file-lines" className="text-white text-3xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg text-center mb-3">
                  {resource.title}
                </h4>
                <p className="text-slate-600 text-center mb-6">
                  {resource.description || t('ialab.resource_viewer.click_to_view')}
                </p>
                <div className="flex items-center gap-2 text-sm text-corporate font-medium">
                  <Icon name="fa-expand" className="w-4 h-4" />
                  <span>{t('ialab.resource_viewer.click_to_open')}</span>
                </div>
              </div>
            </div>
          );
        
        case 'imagen':
        case 'image':
          return (
            <div 
              onClick={() => onOpenViewerModal && onOpenViewerModal()}
              className="group relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="flex-1 p-6 flex flex-col items-center justify-center">
                <div className={cn(
                  "w-24 h-24 rounded-2xl flex items-center justify-center mb-6",
                  "bg-gradient-to-br from-petroleum to-corporate"
                )}>
                  <Icon name="fa-image" className="text-white text-3xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg text-center mb-3">
                  {resource.title}
                </h4>
                <p className="text-slate-600 text-center mb-6">
                  {resource.description || t('ialab.resource_viewer.click_to_view')}
                </p>
                <div className="flex items-center gap-2 text-sm text-corporate font-medium">
                  <Icon name="fa-expand" className="w-4 h-4" />
                  <span>{t('ialab.resource_viewer.click_to_open')}</span>
                </div>
              </div>
            </div>
          );
        
        case 'interactivo':
        case 'interactive':
          return (
            <div 
              onClick={() => onOpenViewerModal && onOpenViewerModal()}
              className="group relative w-full h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="flex-1 p-6 flex flex-col items-center justify-center">
                <div className={cn(
                  "w-24 h-24 rounded-2xl flex items-center justify-center mb-6",
                  "bg-gradient-to-br from-petroleum to-corporate"
                )}>
                  <Icon name="fa-puzzle-piece" className="text-white text-3xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg text-center mb-3">
                  {resource.title}
                </h4>
                <p className="text-slate-600 text-center mb-6">
                  {resource.description || t('ialab.resource_viewer.click_to_view')}
                </p>
                <div className="flex items-center gap-2 text-sm text-corporate font-medium">
                  <Icon name="fa-expand" className="w-4 h-4" />
                  <span>{t('ialab.resource_viewer.click_to_open')}</span>
                </div>
              </div>
            </div>
          );
        
        case 'pdf':
        case 'pdf-thumbnail':
          return <PDFThumbnail 
            title={resource.title}
            pdfUrl={resource.url}
            description={resource.description}
            size={resource.size}
            pages={resource.pages}
            onOpenImmersiveView={() => onOpenImmersiveView && onOpenImmersiveView(resource)}
          />;
        
        case 'ova':
        case 'ova-thumbnail':
          return <OVAThumbnail 
            title={resource.title}
            description={resource.description}
            estimatedTime={resource.estimatedTime}
            difficulty={resource.difficulty}
            interactiveElements={resource.interactiveElements}
            onOpenOVA={() => onOpenOVA && onOpenOVA(resource)}
          />;
        
        case 'ova_interactive':
          return (
            <Suspense fallback={
              <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-petroleum border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-slate-500 font-medium">{t('ialab.resource_viewer.loading_interactive')}</p>
                </div>
              </div>
            }>
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                {resource.id === 'chatgpt-ova-ecosystem' ? <OVAEcosystemGuide onComplete={handleOVAComplete} /> : resource.id === 'notebooklm-ova-1' ? <OVANotebookLab onComplete={handleOVAComplete} /> : resource.id === 'notebook-summary-ova-1' ? <OVANotebookSimulator onComplete={handleOVAComplete} /> : resource.id === 'notebook-audio-guide-1' ? <OVANotebookPodcastGuide onComplete={handleOVAComplete} /> : resource.id === 'bias-ova-1' ? <OVABiasLab onComplete={handleOVAComplete} /> : resource.id === 'privacy-ova-1' ? <OVARiskSimulator onComplete={handleOVAComplete} /> : <OVAChatGPTTools onComplete={handleOVAComplete} />}
              </div>
            </Suspense>
          );
        
        default:
          return (
            <div className="w-full h-full flex items-center justify-center bg-amber-50 rounded-2xl">
              <div className="text-center">
                <Icon name="fa-triangle-exclamation" className="text-amber-500 text-4xl mb-4" />
                <p className="text-amber-700 font-medium">{t('ialab.resource_viewer.type_unsupported', { type: resource.type })}</p>
              </div>
            </div>
          );
      }
    } catch (error) {
      setViewerError(error.message);
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-circle-xmark" className="text-red-500 text-4xl mb-4" />
            <p className="text-red-700 font-medium">{t('ialab.resource_viewer.load_error')}</p>
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full h-full min-h-[400px]",
        className
      )}
    >
      {viewerError ? (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-circle-xmark" className="text-red-500 text-4xl mb-4" />
            <p className="text-red-700 font-medium">{t('ialab.resource_viewer.viewer_error')}</p>
            <p className="text-red-600 text-sm mt-2">{viewerError}</p>
          </div>
        </div>
      ) : (
        renderThumbnail()
      )}
    </motion.div>
  );
};

export default ResourceViewer;