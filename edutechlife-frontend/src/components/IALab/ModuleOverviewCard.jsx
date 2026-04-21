import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

/**
 * COMPONENTE: ModuleOverviewCard
 * 
 * Responsabilidad: Hero Card premium con Glassmorphism para overview del módulo
 * - Badge superior "OVA INTERACTIVO" y "1h 28min • MÓDULO 1"
 * - Título interno "Hoja de Ruta: Domina las Instrucciones"
 * - Descripción detallada del módulo
 * - 6 bullet points horizontales con temas del temario
 * - Grid inferior de 3 estadísticas (Contenido, Práctica, Tiempo Estimado)
 * - Estilo Glassmorphism premium con gradientes corporativos Edutechlife
 * 
 * @returns {JSX.Element} Componente Hero Card premium
 */

const ModuleOverviewCard = () => {
  // Datos hardcodeados según especificaciones
  const moduleData = {
    badge: {
      type: "OVA INTERACTIVO",
      duration: "1h 28min • MÓDULO 1"
    },
    title: "Hoja de Ruta: Domina las Instrucciones",
    description: "Desarrolla la capacidad de dar instrucciones claras y efectivas a la IA para obtener resultados útiles y precisos en situaciones reales a través de 6 etapas prácticas.",
    topics: [
      "Introducción a la Inteligencia Artificial Generativa",
      "¿Qué es un Prompt?",
      "Estructura Básica de un Prompt Efectivo",
      "Técnicas de Refinamiento",
      "Práctica Asistida 1: Modificando Variables",
      "Actividad 1: Crea tu primer Prompt"
    ],
    stats: [
      { title: "Contenido", value: "6 Lecciones" },
      { title: "Práctica", value: "2 Labs & 1 Actividad" },
      { title: "Tiempo Estimado", value: "1h 28 min" }
    ]
  };

   return (
     <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-[2rem] border border-cyan-100 shadow-xl p-6 md:p-8 overflow-hidden bg-gradient-to-br from-white/90 to-cyan-50/50 mb-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-cyan-700/5 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-cyan-400/10 to-cyan-600/5 rounded-full blur-2xl"></div>
      
      {/* Badge superior */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="px-4 py-1.5 bg-gradient-to-r from-cyan-700 to-cyan-500 text-white text-sm font-semibold rounded-full shadow-md">
          {moduleData.badge.type}
        </div>
        <div className="px-4 py-1.5 bg-white/90 border border-cyan-100 text-cyan-700 text-sm font-semibold rounded-full shadow-sm">
          {moduleData.badge.duration}
        </div>
      </div>
      
      {/* Contenido principal con icono destacado */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Icono destacado - Izquierda */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-500 shadow-lg flex items-center justify-center text-white flex-shrink-0">
          <Icon name="fa-brain" className="text-2xl" />
        </div>
        
        {/* Texto principal */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            {moduleData.title}
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            {moduleData.description}
          </p>
          
          {/* Bullet Points - 6 temas horizontales con wrap */}
          <div className="flex flex-wrap gap-3 mt-4">
            {moduleData.topics.map((tema, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 px-3 py-2 bg-white/70 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                <span className="text-sm text-slate-700 whitespace-nowrap">
                  {tema}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Grid inferior de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {moduleData.stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white/70 rounded-2xl p-5 border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition-all duration-300"
          >
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600 font-medium">
              {stat.title}
            </div>
            {/* Elemento decorativo inferior */}
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full mt-3"></div>
          </div>
        ))}
      </div>
      
      {/* Elemento decorativo de borde superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 rounded-t-[2rem]"></div>
    </div>
  );
};

export default ModuleOverviewCard;