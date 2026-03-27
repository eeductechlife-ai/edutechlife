import React from 'react';
import { Icon } from '../utils/iconMapping.jsx';

const tools = [
  {
    id: 'diagnostico-vak',
    name: 'Diagnóstico VAK',
    subtitle: 'MÉTRICA V1',
    icon: 'fa-brain',
    color: '#4DA8C4',
    description: 'Evaluación neuro-cognitiva para identificar tu estilo de aprendizaje predominante (Visual, Auditivo, Kinestésico).',
    gradient: 'from-[#4DA8C4]/10 to-white'
  },
  {
    id: 'ia-lab-pro',
    name: 'IA Lab Pro',
    subtitle: 'ENTRENAMIENTO',
    icon: 'fa-rocket',
    color: '#4DA8C4',
    description: 'Certificación en ingeniería de prompts, análisis predictivo y desarrollo de soluciones con IA de élite.',
    gradient: 'from-[#4DA8C4]/10 to-white'
  },
  {
    id: 'automatizacion',
    name: 'Automatización',
    subtitle: 'B2B ANALYTICS',
    icon: 'fa-chart-bar',
    color: '#4DA8C4',
    description: 'Arquitectura de automatización educativa con análisis de datos, dashboards y optimización de procesos.',
    gradient: 'from-[#4DA8C4]/10 to-white'
  },
  {
    id: 'smartboard',
    name: 'SmartBoard',
    subtitle: 'PIZARRA LIVE',
    icon: 'fa-chalkboard',
    color: '#4DA8C4',
    description: 'Laboratorio de investigación inteligente con análisis de documentos y recomendaciones VAK personalizadas.',
    gradient: 'from-[#4DA8C4]/10 to-white'
  }
];

function AIToolsSection({ onToolClick = () => {} }) {
  const handleToolClick = (toolId) => {
    onToolClick(toolId);
  };

  return (
    <section id="herramientas" className="py-12 px-4 md:px-6 bg-gradient-to-b from-white to-[#F8FAFC] relative overflow-hidden">
      {/* Background Glow Effects - Compact */}
      <div className="absolute top-0 right-[-5%] w-[250px] h-[250px] rounded-full bg-[#4DA8C4]/10 blur-[80px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-[-5%] w-[250px] h-[250px] rounded-full bg-[#66CCCC]/10 blur-[80px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004B63] font-montserrat mb-4">
            Potencia tu Ecosistema con nuestras <span className="text-[#4DA8C4]">Herramientas I.A.</span>
          </h2>
          
          <p className="text-base md:text-lg text-[#64748B] max-w-2xl mx-auto">
            Herramientas de Inteligencia Artificial diseñadas por el equipo de Edutechlife para revolucionar tu aprendizaje.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[1.5rem] blur-xl"
                   style={{ background: `linear-gradient(135deg, ${tool.color}20, transparent)` }}
              ></div>
              
              <div className="relative bg-white backdrop-blur-lg border border-[#E2E8F0] rounded-[1.5rem] p-7 min-h-[280px] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_4px_20px_rgba(0,75,99,0.06)] group-hover:border-[#4DA8C4]/30">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 group-hover:border-[#4DA8C4]/30">
                  <Icon name={tool.icon} className="text-xl" style={{ color: tool.color }} />
                </div>

                {/* Tool Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-[#4DA8C4] uppercase tracking-wider bg-[#4DA8C4]/10 px-2 py-1 rounded-full">
                      {tool.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#004B63] font-montserrat mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-base leading-relaxed line-clamp-3">{tool.description}</p>
                </div>

                {/* Action Button */}
                <button className="w-full py-2.5 px-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white text-sm rounded-lg font-semibold hover:shadow-md hover:shadow-[#4DA8C4]/20 transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-[#4DA8C4] group-hover:to-[#66CCCC]">
                  <span>Explorar</span>
                  <Icon name="fa-arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#4DA8C4]/20"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#64748B]">
            Cada herramienta integrada con nuestro ecosistema educativo para maximizar tu experiencia de aprendizaje.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AIToolsSection;
