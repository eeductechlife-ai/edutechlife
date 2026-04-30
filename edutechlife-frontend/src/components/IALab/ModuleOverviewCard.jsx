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
    description: "En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.\n\nTu misión: Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!",
    topics: [
      { 
        title: "Introducción a la Inteligencia Artificial Generativa", 
        icon: "fa-brain", 
        resources: 2 
      },
      { 
        title: "¿Qué es un Prompt?", 
        icon: "fa-comments", 
        resources: 3 
      },
      { 
        title: "Estructura Básica de un Prompt Efectivo", 
        icon: "fa-sitemap", 
        resources: 3 
      }
    ],
    stats: [
      { title: "Contenido", value: "3 Lecciones" },
      { title: "Práctica", value: "3 Labs & Retos" }
    ]
  };

    return (
      <React.Fragment>
        <motion.div
        whileHover={{ scale: 1.02, y: -4, boxShadow: "0px 8px 25px rgba(17,17,26,0.1)" }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 md:p-8 overflow-hidden mb-8"
      >
          
{/* Badge superior */}
            <div className="flex items-center justify-between mb-6">
              <div className="px-4 py-2 bg-white border border-slate-200/60 text-[#004B63] text-sm font-semibold rounded-full shadow-sm">
                {moduleData.badge.module}
              </div>
              <div className="px-4 py-2 bg-white border border-slate-200/60 text-[#004B63] text-sm font-semibold rounded-full shadow-sm">
                {moduleData.badge.duration}
              </div>
            </div>
           
           {/* Contenido principal con icono destacado */}
           <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Icono destacado - Izquierda */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004B63] to-[#0A3550] shadow-sm flex items-center justify-center text-white flex-shrink-0">
                <Icon name="fa-brain" className="text-2xl" />
              </div>
             
              {/* Texto principal */}
             <div className="flex-1 max-w-3xl">
               <h3 className="text-xl md:text-2xl font-bold text-[#004B63] mb-3 leading-tight">
                 {moduleData.title}
               </h3>
               
               {/* Introducción */}
               <p className="text-slate-600 text-[15px] md:text-base leading-relaxed mb-4 text-justify">
                 En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.
               </p>
               
               {/* Tu Misión - Subtítulo destacado */}
               <div className="flex items-start gap-3 mb-5">
                 <div className="w-8 h-8 rounded-lg bg-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                   <Icon name="fa-rocket" className="text-[#00BCD4] text-sm" />
                 </div>
                 <div className="flex-1">
                   <h4 className="text-base font-bold text-[#004B63] mb-1">Tu misión:</h4>
                   <p className="text-slate-600 text-[15px] md:text-base leading-relaxed text-justify">
                     Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!
                   </p>
                 </div>
               </div>
               
                {/* Temas en columna única - Tarjetas premium */}
                <div className="flex flex-col gap-3 mt-4">
                  {moduleData.topics.map((tema, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      onClick={() => {
                        setSelectedTopic({
                          title: tema.title,
                          index: index + 1
                        });
                        setIsResourcesModalOpen(true);
                      }}
                      className="group flex items-center gap-4 w-full px-5 py-4 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-xl shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left"
                      aria-label={`Ver recursos del tema: ${tema.title}`}
                    >
                      {/* Icono temático */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#004B63]/20 group-hover:to-[#00BCD4]/20 transition-all duration-300">
                        <Icon name={tema.icon} className="text-xl text-[#004B63] group-hover:text-[#004B63] transition-colors duration-300" />
                      </div>
                      
                      {/* Título y metadatos */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-slate-800 group-hover:text-[#004B63] transition-colors duration-300 truncate">
                          {tema.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#004B63]/5 rounded-full text-xs font-medium text-[#004B63] group-hover:bg-[#004B63]/10 transition-colors duration-300">
                            <Icon name="fa-file" className="w-3 h-3" />
                            {tema.resources} recursos
                          </span>
                        </div>
                      </div>
                      
                      {/* Chevron de acción */}
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#004B63] group-hover:shadow-md transition-all duration-300">
                        <Icon name="fa-chevron-right" className="text-sm text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              
              {/* Es hora de la acción */}
              <div className="flex items-start gap-3 mt-6">
                <div className="w-8 h-8 rounded-lg bg-[#004B63]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="fa-bolt" className="text-[#004B63] text-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#004B63] mb-1">¡Es hora de la acción!</h4>
                  <p className="text-slate-600 text-[15px] md:text-base leading-relaxed text-justify">
                    La teoría terminó; ahora comienza la acción. Para desbloquear tu acceso al siguiente nivel, debes alcanzar un puntaje mínimo del <span className="font-semibold text-[#00BCD4]">80%</span> en las actividades de este módulo.
                  </p>
                  <p className="text-slate-600 text-[15px] md:text-base leading-relaxed mt-2 text-justify">
                    Tu participación en la comunidad, el examen y el desafío final son las llaves de tu progreso. Cada punto te acerca a la maestría en IA que las empresas buscan hoy.
                  </p>
                  <p className="text-[#004B63] font-semibold text-[15px] md:text-base leading-relaxed mt-2">
                    ¿Estás listo para el reto? Supera el 80% y avanza.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid inferior: 3 iconos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {/* Icono: Comunidad */}
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    onClick={() => setIsForumOpen(!isForumOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                    title="Comunidad IALab"
                  >
                    <Icon name="fa-comments" className="text-white w-9 h-9 md:w-10 md:h-10" />
                  </motion.button>
                  <span className="text-lg font-extrabold text-[#004B63] text-center">Comunidad IALab</span>
                </div>
                {/* Icono: Desafío */}
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    onClick={() => onAction('OPEN_CHALLENGE')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                    title="Desafío del Módulo"
                  >
                    <Icon name="fa-rocket" className="text-white w-9 h-9 md:w-10 md:h-10" />
                  </motion.button>
                  <span className="text-lg font-extrabold text-[#004B63] text-center">Desafío</span>
                </div>
                {/* Icono: Examen */}
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    onClick={() => onAction('OPEN_QUIZ')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                    title="Examen del Módulo"
                  >
                    <Icon name="fa-clipboard-check" className="text-white w-9 h-9 md:w-10 md:h-10" />
                  </motion.button>
                  <span className="text-lg font-extrabold text-[#004B63] text-center">Examen</span>
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
