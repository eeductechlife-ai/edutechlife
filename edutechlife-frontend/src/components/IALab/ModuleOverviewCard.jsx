import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { getResourcesForTopic } from './constants/moduleResources';
import TopicResourcesModal from './TopicResourcesModal';
import IALabForumOptimized from './IALabForumOptimized';
import ErrorBoundary from '../forum/ErrorBoundary';

/**
 * COMPONENTE: ModuleOverviewCard
 * 
 * Responsabilidad: Hero Card premium con Glassmorphism para overview del módulo
 * - Módulo 1: Datos hardcodeados originales (intactos)
 * - Módulos 2-5: Datos dinámicos desde moduleContent
 * - Badge superior con duración y nivel
 * - Temas clickeables con modal de recursos
 * - Grid inferior de estadísticas
 * - Estilo Glassmorphism premium
 * - Integración con Foro y Desafío
 * 
 * @returns {JSX.Element} Componente Hero Card premium
 */

const ModuleOverviewCard = ({ onAction }) => {
  const { activeMod, modules, moduleContent, completedExams, challengeScores, moduleProgress } = useIALabContext();
  
  // Estado para el modal de recursos
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isForumOpen, setIsForumOpen] = useState(false);
  const [viewedIds, setViewedIds] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('ialab_viewed_resources');
    if (stored) {
      try { setViewedIds(JSON.parse(stored)); } catch {}
    }
  }, [isResourcesModalOpen]);
  
  // Módulo 1: Datos hardcodeados originales (INTACTOS)
  const module1Data = {
    badge: {
      duration: "2h",
      module: "5 MÓDULOS"
    },
    title: "Domina las Instrucciones",
    description: "En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.",
    mission: "Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!",
    missionIcon: "fa-rocket",
    icon: "fa-brain",
    topics: [
      { title: "Introducción a la Inteligencia Artificial Generativa", icon: "fa-brain", resources: 2, duration: "20 min" },
      { title: "¿Qué es un Prompt?", icon: "fa-comments", resources: 3, duration: "20 min" },
      { title: "Estructura Básica de un Prompt Efectivo", icon: "fa-sitemap", resources: 3, duration: "20 min" }
    ],
    stats: [
      { title: "Contenido", value: "3 Lecciones" },
      { title: "Práctica", value: "3 Labs & Retos" }
    ]
  };
  
  // Datos dinámicos según módulo activo
  const isModule1 = activeMod === 1;
  const currentModule = modules.find(m => m.id === activeMod) || modules[0];
  const dynamicContent = moduleContent[activeMod];
  
  const moduleData = isModule1 ? module1Data : {
    badge: {
      duration: currentModule?.duration || "10h",
      module: `${currentModule?.level || 'AVANZADO'}`
    },
    title: dynamicContent?.overviewData?.title || currentModule?.title || "Módulo",
    description: dynamicContent?.overviewData?.description || currentModule?.desc || "",
    mission: dynamicContent?.overviewData?.mission || "",
    missionIcon: "fa-bolt",
    icon: currentModule?.icon || "fa-graduation-cap",
    topics: dynamicContent?.overviewData?.topics || [],
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
        className="relative z-10 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 md:p-8 overflow-hidden mb-4"
      >
        
{/* Badge superior */}
            <div className="flex items-center justify-between mb-4">
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
                <Icon name={moduleData.icon} className="text-2xl" />
              </div>
             
              {/* Texto principal */}
             <div className="flex-1 max-w-3xl">
               <h3 className="text-xl md:text-2xl font-bold text-[#004B63] mb-3 leading-tight">
                 {moduleData.title}
               </h3>
               
               {/* Introducción */}
                <p className="text-slate-600 text-[15px] md:text-base leading-relaxed mb-3 text-justify">
                 En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.
               </p>
               
                {/* Tu Misión - Subtítulo destacado */}
                <div className="flex items-start gap-3 mb-5">
                   <Icon name={moduleData.missionIcon} className="text-[#00BCD4] text-sm flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-[#004B63] mb-1">Tu misión:</h4>
                    <p className="text-slate-600 text-[15px] md:text-base leading-relaxed text-justify">
                      {moduleData.mission}
                    </p>
                  </div>
                </div>
               
                {/* Temas en columna única - Tarjetas premium */}
                <div className="flex flex-col gap-3 mt-4">
                  {moduleData.topics.map((tema, index) => {
                    const topicResources = getResourcesForTopic(tema.title);
                    const topicResourceIds = topicResources?.resources?.map(r => r.id) || [];
                    const isTopicCompleted = topicResourceIds.length > 0 && topicResourceIds.every(id => viewedIds.includes(id));

                    const calculateTopicDuration = (topicTitle) => {
                      const topicData = getResourcesForTopic(topicTitle);
                      if (!topicData?.resources) return "20 min";
                      
                      let totalSeconds = 0;
                      topicData.resources.forEach(resource => {
                        if (resource.type === 'video' && resource.duration) {
                          const parts = resource.duration.split(':').map(Number);
                          if (parts.length === 2) {
                            totalSeconds += parts[0] * 60 + parts[1];
                          } else if (parts.length === 3) {
                            totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                          }
                        } else if (resource.estimatedTime) {
                          const match = resource.estimatedTime.match(/(\d+)/);
                          if (match) totalSeconds += parseInt(match[1]) * 60;
                        } else if (resource.pages) {
                          totalSeconds += Math.max(5, Math.ceil(resource.pages / 2)) * 60;
                        }
                      });
                      
                      const hours = Math.floor(totalSeconds / 3600);
                      const minutes = Math.floor((totalSeconds % 3600) / 60);
                      if (hours > 0) return `${hours}h ${minutes}min`;
                      return `${minutes} min`;
                    };
                    return (
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
                      className={`group flex items-center gap-4 w-full px-5 py-4 bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all duration-300 cursor-pointer text-left ${
                        isTopicCompleted
                          ? 'border-l-4 border-l-emerald-500'
                          : 'border-l-4 border-l-[#004B63] hover:border-l-[#00BCD4]'
                      }`}
                      aria-label={`Ver recursos del tema: ${tema.title}`}
                    >
                      {/* Icono temático */}
                      <Icon name={tema.icon} className={`text-xl flex-shrink-0 ${isTopicCompleted ? 'text-emerald-600' : 'text-[#004B63]'}`} />
                      
                      {/* Título y metadatos */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-semibold truncate transition-colors duration-300 flex items-center gap-2 ${
                          isTopicCompleted ? 'text-emerald-700' : 'text-slate-800 group-hover:text-[#004B63]'
                        }`}>
                          {tema.title}
                          {isTopicCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md flex-shrink-0">Completado</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-[#004B63]">
                             <Icon name="fa-file" className="w-3 h-3" />
                             {tema.resources} recursos
                           </span>
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-[#00BCD4] bg-[#00BCD4]/10">
                             <Icon name="fa-clock" className="w-3 h-3" />
                              {calculateTopicDuration(tema.title)}
                           </span>
                         </div>
                      </div>
                      
                      {/* Indicador de completado o chevron */}
                      {isTopicCompleted ? (
                        <Icon name="fa-check-circle" className="text-emerald-500 text-base flex-shrink-0" />
                      ) : (
                        <Icon name="fa-chevron-right" className="text-sm text-slate-400 flex-shrink-0 group-hover:translate-x-0.5 transition-all duration-300" />
                      )}
                    </motion.button>
                  )})}
                </div>
              
              {/* Es hora de la acción */}
              <div className="flex items-start gap-3 mt-6">
                  <Icon name="fa-bolt" className="text-[#004B63] text-sm flex-shrink-0 mt-0.5" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {/* Icono: Comunidad */}
                <div className="flex flex-col items-center gap-3">
                  {moduleProgress?.[activeMod]?.community ? (
                    <div className="flex flex-col items-center gap-2">
                      <motion.button
                        onClick={() => setIsForumOpen(!isForumOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative"
                        title="Ver comunidad"
                      >
                        <Icon name="fa-comments" className="text-white w-9 h-9 md:w-10 md:h-10" />
                        <div className="absolute -top-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                          <Icon name="fa-check" className="text-emerald-500 text-[10px]" />
                        </div>
                      </motion.button>
                      <span className="text-base font-semibold text-emerald-600 tracking-wide text-center">Comunidad</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <motion.button
                        onClick={() => setIsForumOpen(!isForumOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:bg-[#00BCD4]/90 hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                        title="Comunidad IALab"
                      >
                        <Icon name="fa-comments" className="text-white w-9 h-9 md:w-10 md:h-10" />
                      </motion.button>
                      <span className="text-base font-semibold text-[#004B63] tracking-wide text-center">Comunidad IALab</span>
                    </div>
                  )}
                </div>
                {/* Icono: Desafío */}
                <div className="flex flex-col items-center gap-3">
                  {challengeScores?.[activeMod] ? (
                    <div className="flex flex-col items-center gap-2">
                      <motion.button
                        onClick={() => onAction('SHOW_CHALLENGE_RESULT')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative"
                        title="Ver resultado del desafío"
                      >
                        <Icon name="fa-rocket" className="text-white w-9 h-9 md:w-10 md:h-10" />
                        <div className="absolute -top-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                          <span className="text-emerald-500 font-black text-[9px]">{score}</span>
                        </div>
                      </div>
                    </motion.button>
                    <span className="text-sm md:text-base font-semibold text-slate-700 tracking-wide text-center">Evaluaciones</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <motion.button
                      onClick={() => handleGlobalAction('start_exam')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative"
                      title={examLabel}
                    >
                      <Icon name="fa-pen-clip" className="text-white w-9 h-9 md:w-10 md:h-10" />
                      {score !== undefined && score >= 0 && (
                        <div className="absolute -top-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                          <span className="text-[10px] font-bold text-emerald-600">{completedExams[activeMod]}%</span>
                        </div>
                      </motion.button>
                      <span className="text-base font-semibold text-emerald-600 tracking-wide text-center">Examen: {completedExams[activeMod]}%</span>
                    </div>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => onAction('OPEN_QUIZ')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center shadow-lg hover:bg-[#00BCD4]/90 hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                        title="Examen del Módulo"
                      >
                        <Icon name="fa-clipboard-check" className="text-white w-9 h-9 md:w-10 md:h-10" />
                      </motion.button>
                      <span className="text-base font-semibold text-[#004B63] tracking-wide text-center">Examen</span>
                    </>
                  )}
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
