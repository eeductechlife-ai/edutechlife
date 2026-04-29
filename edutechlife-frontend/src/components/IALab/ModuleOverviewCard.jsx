import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import TopicResourcesModal from './TopicResourcesModal';
import IALabForumOptimized from './IALabForumOptimized';
import ErrorBoundary from '../forum/ErrorBoundary';

/**
 * COMPONENTE: ModuleOverviewCard
 * 
 * Responsabilidad: Hero Card premium con Glassmorphism para overview del módulo
 * - Badge superior "OVA INTERACTIVO" y "1h 28min • MÓDULO 1"
 * - Título interno "Hoja de Ruta: Domina las Instrucciones"
 * - Descripción detallada del módulo
 * - 6 bullet points horizontales con temas del temario (AHORA CLICKEABLES)
 * - Grid inferior de 3 estadísticas (Contenido, Práctica, Tiempo Estimado)
 * - Estilo Glassmorphism premium con gradientes corporativos Edutechlife
 * - Integración con Modal Central Premium para visualizar recursos
 * 
 * @returns {JSX.Element} Componente Hero Card premium
 */

const ModuleOverviewCard = ({ onAction }) => {
  // Estado para el modal de recursos
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isForumOpen, setIsForumOpen] = useState(false);
  // Datos hardcodeados según especificaciones
  const moduleData = {
    badge: {
      duration: "1h 28min",
      module: "MÓDULO 1"
    },
    title: "Domina las Instrucciones",
    description: "Desarrolla la capacidad de dar instrucciones claras y efectivas a la IA para obtener resultados útiles y precisos en situaciones reales a través de 4 etapas prácticas.",
    topics: [
      "Introducción a la Inteligencia Artificial Generativa",
      "¿Qué es un Prompt?",
      "Estructura Básica de un Prompt Efectivo",
      "Técnicas de Refinamiento"
    ],
    stats: [
      { title: "Contenido", value: "4 Lecciones" },
      { title: "Práctica", value: "4 Labs & Retos" }
    ]
  };

    return (
      <React.Fragment>
        <motion.div
        whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-2xl border border-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.05)] p-5 md:p-8 overflow-hidden mb-8"
      >
          {/* Elementos decorativos de fondo */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#004B63]/6 to-[#00BCD4]/4 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#004B63]/4 to-[#00BCD4]/2 rounded-full blur-2xl"></div>
          
{/* Badge superior */}
            <div className="flex items-center justify-between mb-6">
              <div className="px-4 py-2 bg-white border border-[#004B63]/15 text-[#004B63] text-sm font-semibold rounded-full shadow-sm">
                {moduleData.badge.module}
              </div>
              <div className="px-4 py-2 bg-white border border-[#004B63]/15 text-[#004B63] text-sm font-semibold rounded-full shadow-sm">
                {moduleData.badge.duration}
              </div>
            </div>
           
           {/* Contenido principal con icono destacado */}
           <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Icono destacado - Izquierda */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004B63] to-[#0A3550] shadow-md shadow-[#004B63]/20 flex items-center justify-center text-white flex-shrink-0">
                <Icon name="fa-brain" className="text-2xl" />
              </div>
             
             {/* Texto principal */}
             <div className="flex-1">
               <h3 className="text-lg md:text-xl font-bold text-[#004B63] mb-3">
                 {moduleData.title}
               </h3>
               <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-5">
                 {moduleData.description}
               </p>
               
{/* Temas en grid 2x2 */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {moduleData.topics.map((tema, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      onClick={() => {
                        setSelectedTopic({
                          title: tema,
                          index: index + 1
                        });
                        setIsResourcesModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg hover:bg-[#004B63] hover:border-[#004B63] hover:shadow-md transition-all duration-300 cursor-pointer group"
                      aria-label={`Ver recursos del tema: ${tema}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#004B63] flex-shrink-0 group-hover:scale-125 group-hover:bg-white transition-all duration-300"></div>
                      <span className="text-sm text-slate-700 group-hover:text-white group-hover:font-semibold transition-colors duration-300 line-clamp-1 text-left">
                        {tema}
                      </span>
                    </motion.button>
                  ))}
                </div>
             </div>
           </div>
           
            {/* Grid inferior: 3 iconos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {/* Icono: Comunidad */}
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    onClick={() => setIsForumOpen(!isForumOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-0"
                    title="Comunidad IALab"
                  >
                    <Icon name="fa-comments" className="text-white w-7 h-7 md:w-8 md:h-8" />
                  </motion.button>
                  <span className="text-sm font-bold text-[#004B63] text-center">Comunidad IALab</span>
                </div>
                {/* Icono: Desafío */}
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    onClick={() => onAction('OPEN_CHALLENGE')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-0"
                    title="Desafío del Módulo"
                  >
                    <Icon name="fa-rocket" className="text-white w-7 h-7 md:w-8 md:h-8" />
                  </motion.button>
                  <span className="text-sm font-bold text-[#004B63] text-center">Desafío</span>
                </div>
                {/* Icono: Examen */}
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    onClick={() => onAction('OPEN_QUIZ')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-0"
                    title="Examen del Módulo"
                  >
                    <Icon name="fa-clipboard-check" className="text-white w-7 h-7 md:w-8 md:h-8" />
                  </motion.button>
                  <span className="text-sm font-bold text-[#004B63] text-center">Examen</span>
                </div>
             </div>

             {/* Foro expandible */}
             <AnimatePresence>
               {isForumOpen && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.3 }}
                   className="mt-6 overflow-hidden"
                 >
                   <ErrorBoundary>
                     <IALabForumOptimized compact={false} initialLimit={3} />
                   </ErrorBoundary>
                 </motion.div>
               )}
             </AnimatePresence>
           
            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />
         </motion.div>

         {/* Modal Central Premium para recursos del tema */}
         <TopicResourcesModal
           isOpen={isResourcesModalOpen}
           onClose={() => {
             setIsResourcesModalOpen(false);
             setSelectedTopic(null);
           }}
           topicData={selectedTopic}
         />
      </React.Fragment>
    );
  };

export default ModuleOverviewCard;
