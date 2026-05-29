/**
 * COMPONENTE: OVAThumbnail
 * 
 * Miniatura premium para Objetos Virtuales de Aprendizaje (OVA)
 * con apertura a pantalla completa al hacer clic
 * 
 * Características:
 * - Miniatura con imagen de previsualización de alta calidad
 * - Evento onClick para abrir OVA a pantalla completa
 * - Indicador visual de contenido interactivo
 * - Diseño premium Edutechlife
 * - Integración con cuadrícula de recursos
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';
import QueEsPrompt_OVA_Original from './QueEsPrompt_OVA_Original';

/**
 * Componente principal OVAThumbnail
 */
const OVAThumbnail = ({ 
  title: titleProp,
  description: descProp,
  estimatedTime: timeProp,
  difficulty: diffProp,
  interactiveElements = 5,
  onOpenOVA = null
}) => {
  const { t } = useTranslation();
  const title = titleProp ?? t('ialab.ova_thumbnail.title');
  const description = descProp ?? t('ialab.ova_thumbnail.description');
  const estimatedTime = timeProp ?? t('ialab.ova_thumbnail.estimated_time');
  const difficulty = diffProp ?? t('ialab.ova_thumbnail.difficulty');
  // Estado para controlar la visualización del OVA
  const [isOVAOpen, setIsOVAOpen] = useState(false);

  // Manejar clic para abrir OVA
  const handleClick = () => {
    if (onOpenOVA) {
      onOpenOVA();
    } else {
      setIsOVAOpen(true);
      // Bloquear scroll del body cuando se abre el OVA
      document.body.style.overflow = 'hidden';
    }
  };

  // Cerrar OVA
  const handleCloseOVA = () => {
    setIsOVAOpen(false);
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {/* MINIATURA OVA - Tarjeta clickeable */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        className="group relative w-full bg-white rounded-2xl border border-slate-200/60 border-l-4 border-l-petroleum shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
        aria-label={t('ialab.ova_thumbnail.aria_open', { title: title || t('ialab.ova_thumbnail.title') })}
        title={t('ialab.ova_thumbnail.title_click')}
      >
        {/* Indicador de interactividad */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-br from-petroleum/10 to-corporate/10 px-2 py-1 rounded-full">
            <Icon name="fa-play" className="w-3 h-3 text-petroleum" />
            <span className="text-xs font-bold text-petroleum">{t('ialab.ova_thumbnail.interactive_label')}</span>
          </div>
        </div>

        {/* Imagen de previsualización premium */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-petroleum/10 to-corporate/10 border-b border-slate-200/60">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-white"></div>
          </div>
          
          {/* Cerebro central interactivo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Cerebro principal */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-petroleum to-corporate shadow-2xl flex items-center justify-center">
                <Icon name="fa-brain" className="text-white text-5xl" />
              </div>
              
              {/* Circuitos alrededor */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-petroleum/80 to-petroleum-dark shadow-lg flex items-center justify-center">
                <Icon name="fa-puzzle-piece" className="text-white text-lg" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-corporate/80 to-petroleum shadow-lg flex items-center justify-center">
                <Icon name="fa-gamepad" className="text-white text-lg" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-petroleum-dark to-corporate/80 shadow-lg flex items-center justify-center">
                <Icon name="fa-chart-network" className="text-white text-lg" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-corporate to-petroleum shadow-lg flex items-center justify-center">
                <Icon name="fa-lightbulb" className="text-white text-lg" />
              </div>
              
              {/* Líneas de conexión */}
              <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
                <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
                <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
                <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
                <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
              </svg>
              
              {/* Puntos animados */}
              <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-corporate animate-ping"></div>
              <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-petroleum animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-petroleum-dark animate-ping" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-corporate animate-ping" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>

          {/* Badge interactivo */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-petroleum to-corporate text-white px-3 py-1 rounded-full shadow-md flex items-center gap-2">
            <Icon name="fa-play" className="w-3 h-3" />
            <span className="text-xs font-bold">{t('ialab.ova_thumbnail.click_to_explore_badge')}</span>
          </div>
        </div>

        {/* Contenido de la miniatura */}
        <div className="p-5">
          {/* Información del OVA */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-lg leading-tight">
              {title}
            </h4>
            
            <p className="text-slate-600 text-sm leading-relaxed">
              {description}
            </p>

            {/* Metadatos del OVA */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                  <Icon name="fa-clock" className="text-petroleum w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">{t('ialab.ova_thumbnail.duration')}</div>
                  <div className="text-sm font-medium text-slate-700">{estimatedTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                  <Icon name="fa-signal" className="text-petroleum w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">{t('ialab.ova_thumbnail.difficulty_label')}</div>
                  <div className="text-sm font-medium text-slate-700">{difficulty}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                  <Icon name="fa-mouse-pointer" className="text-petroleum w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">{t('ialab.ova_thumbnail.interactivities')}</div>
                  <div className="text-sm font-medium text-slate-700">{interactiveElements}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                  <Icon name="fa-graduation-cap" className="text-petroleum w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">{t('ialab.ova_thumbnail.certification')}</div>
                  <div className="text-sm font-medium text-slate-700">{t('ialab.ova_thumbnail.included')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de acción */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="fa-hand-pointer" className="w-4 h-4 text-petroleum" />
                <span className="text-sm text-slate-600 font-medium">
                  {t('ialab.ova_thumbnail.click_to_explore')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-petroleum font-bold">{t('ialab.ova_thumbnail.explore')}</span>
                <Icon name="fa-arrow-right" className="w-4 h-4 text-petroleum" />
              </div>
            </div>
          </div>

        {/* Efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-petroleum/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Borde animado en hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-corporate rounded-2xl transition-colors duration-300 pointer-events-none"></div>
      </motion.div>

      {/* OVA A PANTALLA COMPLETA */}
      <AnimatePresence>
        {isOVAOpen && (
          <QueEsPrompt_OVA_Original onClose={handleCloseOVA} />
        )}
      </AnimatePresence>
    </>
  );
};

export default OVAThumbnail;