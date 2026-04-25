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
import QueEsPrompt_OVA_Original from './QueEsPrompt_OVA_Original';

/**
 * Componente principal OVAThumbnail
 */
const OVAThumbnail = ({ 
  title = "Laboratorio: Ética en la I.A.",
  description = "OVA completo sobre anatomía de prompts con simulador interactivo",
  estimatedTime = "15 minutos",
  difficulty = "Intermedio",
  interactiveElements = 5,
  onOpenOVA = null
}) => {
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
        className="group relative w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
        aria-label={`Abrir ${title}`}
        title="Haz clic para abrir el OVA interactivo"
      >
        {/* Indicador de interactividad */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1.5 rounded-full shadow-md">
            <Icon name="fa-play" className="w-3 h-3" />
            <span className="text-xs font-bold text-slate-500">Contenido Interactivo</span>
          </div>
        </div>

        {/* Imagen de previsualización premium */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-b border-purple-200">
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
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 shadow-2xl flex items-center justify-center">
                <Icon name="fa-brain" className="text-white text-5xl" />
              </div>
              
              {/* Circuitos alrededor */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-400 shadow-lg flex items-center justify-center">
                <Icon name="fa-puzzle-piece" className="text-white text-lg" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 shadow-lg flex items-center justify-center">
                <Icon name="fa-gamepad" className="text-white text-lg" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 shadow-lg flex items-center justify-center">
                <Icon name="fa-chart-network" className="text-white text-lg" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-400 shadow-lg flex items-center justify-center">
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
              <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              <div className="absolute top-1/4 left-1/2 w-2 h-2 rounded-full bg-amber-400 animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-ping" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-rose-400 animate-ping" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>

          {/* Badge interactivo */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1 rounded-full shadow-md flex items-center gap-2">
            <Icon name="fa-play" className="w-3 h-3" />
            <span className="text-xs font-bold">HACER CLIC PARA EXPLORAR</span>
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
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Icon name="fa-clock" className="text-purple-600 w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Duración</div>
                  <div className="text-sm font-medium text-slate-700">{estimatedTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Icon name="fa-signal" className="text-pink-600 w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Dificultad</div>
                  <div className="text-sm font-medium text-slate-700">{difficulty}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Icon name="fa-mouse-pointer" className="text-cyan-600 w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Interactividades</div>
                  <div className="text-sm font-medium text-slate-700">{interactiveElements}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Icon name="fa-graduation-cap" className="text-amber-600 w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Certificación</div>
                  <div className="text-sm font-medium text-slate-700">Incluida</div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de acción */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="fa-hand-pointer" className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-slate-600 font-medium">
                  Haz clic para explorar
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-purple-500 font-bold">EXPLORAR</span>
                <Icon name="fa-arrow-right" className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Borde animado en hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-300 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
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