import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import TopicResourcesModal from './TopicResourcesModal';

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
        <div className="relative z-10 bg-white rounded-2xl border border-[#004B63]/8 shadow-sm p-5 md:p-8 overflow-hidden mb-8">
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
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedTopic({
                          title: tema,
                          index: index + 1
                        });
                        setIsResourcesModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:border-[#004B63]/25 hover:shadow-sm transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] group"
                      aria-label={`Ver recursos del tema: ${tema}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#004B63] flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="text-sm text-slate-700 group-hover:text-[#004B63] group-hover:font-semibold transition-colors duration-300 line-clamp-1 text-left">
                        {tema}
                      </span>
                    </button>
                  ))}
                </div>
             </div>
           </div>
           
            {/* Grid inferior: Stats + Botón examen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {moduleData.stats.map((stat, index) => (
                 <div 
                   key={index}
                   className="bg-white rounded-xl p-4 border border-[#004B63]/6 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-[#004B63]/20 transition-all duration-300"
                 >
                   <div className="text-xl font-bold text-[#004B63] mb-1">
                     {stat.value}
                   </div>
                   <div className="text-sm text-slate-500 font-medium">
                     {stat.title}
                   </div>
                   <div className="w-10 h-0.5 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full mt-3"></div>
                 </div>
               ))}
              {/* Botón: Examen del Módulo */}
              <button
                onClick={() => onAction('OPEN_QUIZ')}
                className="bg-gradient-to-r from-[#00BCD4] to-[#4DD0E1] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:shadow-lg hover:shadow-[#00BCD4]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="fa-clipboard-check" className="text-white text-lg" />
                  <div className="text-lg font-bold text-white">Examen</div>
                </div>
                <div className="text-sm text-white/80 font-medium">del Módulo</div>
                <div className="w-10 h-0.5 bg-white/40 rounded-full mt-3 group-hover:w-16 transition-all duration-300"></div>
              </button>
            </div>
           
            {/* Elemento decorativo de borde superior */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />
         </div>

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
