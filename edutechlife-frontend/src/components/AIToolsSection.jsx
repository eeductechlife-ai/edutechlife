import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';

const tools = [
  {
    id: 'diagnostico-vak',
    name: 'Diagnóstico VAK',
    subtitle: 'MÉTRICA V1',
    icon: 'fa-brain',
    badges: ['V1.0', 'AI', 'NEURO'],
    features: [
      'Evaluación neuro-cognitiva',
      'Identificación de estilos VAK',
      'Informe personalizado con IA'
    ],
    buttonText: 'Prueba Gratis'
  },
  {
    id: 'ia-lab-pro',
    name: 'IA Lab Pro',
    subtitle: 'ENTRENAMIENTO',
    icon: 'fa-rocket',
    badges: ['PRO', 'CERT', 'IA'],
    features: [
      'Certificación internacional',
      'Ingeniería de prompts',
      'Proyectos con IA de élite'
    ],
    buttonText: 'Comenzar Curso'
  },
  {
    id: 'automatizacion',
    name: 'Automatización',
    subtitle: 'B2B ANALYTICS',
    icon: 'fa-chart-bar',
    badges: ['B2B', 'AI', 'DATA'],
    features: [
      'Arquitectura de automatización',
      'Análisis de datos y dashboards',
      'Optimización de procesos'
    ],
    buttonText: 'Ver Demo'
  },
  {
    id: 'smartboard',
    name: 'SmartBoard',
    subtitle: 'DASHBOARD',
    icon: 'fa-chalkboard',
    badges: ['★ STAR', 'EMOCIONAL', '8-16 AÑOS'],
    isPremium: true,
    features: [
      'Plataforma para estudiantes de 8 a 16 años',
      'Acompañamiento académico y emocional',
      'Enseñanza de IA de forma segura'
    ],
    buttonText: 'Pruébalo Ahora'
  }
];

function AIToolsSection({ onToolClick = () => {} }) {
  const handleToolClick = (toolId) => {
    onToolClick(toolId);
  };

  return (
    <section id="herramientas" className="py-10 px-4 md:px-6 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F0F4F8] relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles count={20} className="z-0" />
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-[#4DA8C4]/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] rounded-full bg-[#66CCCC]/10 blur-[100px] pointer-events-none animate-[pulse-slow_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
      
      {/* Background Pattern - Tech Lines */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #4DA8C4 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#004B63] font-montserrat mb-3">
              Potencia tu Ecosistema con nuestras <span className="text-[#4DA8C4]">Herramientas I.A.</span>
            </h2>
            
            <p className="text-sm md:text-base text-[#64748B] max-w-2xl mx-auto">
              Herramientas de Inteligencia Artificial diseñadas por el equipo de Edutechlife para revolucionar tu aprendizaje.
            </p>
          </motion.div>
        </div>

        {/* Tools Grid - Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool, index) => {
            const isPremium = tool.isPremium;
            
            return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleToolClick(tool.id)}
              className={`group relative cursor-pointer ${isPremium ? 'md:-mt-2 md:mb-2' : ''}`}
            >
              <div className={`absolute inset-0 transition-opacity duration-500 rounded-[1.5rem] blur-xl ${isPremium ? 'bg-gradient-to-br from-[#004B63]/30 via-[#4DA8C4]/20 to-[#66CCCC]/15 opacity-100 group-hover:opacity-100' : 'bg-gradient-to-br from-[#4DA8C4]/20 via-transparent to-[#66CCCC]/10 opacity-0 group-hover:opacity-100'}`} />
              
              <div className={`relative backdrop-blur-xl rounded-[1.5rem] p-5 transition-all duration-500 group-hover:-translate-y-2 overflow-hidden ${isPremium ? 'bg-gradient-to-br from-[#004B63]/8 via-white to-[#4DA8C4]/5 shadow-[0_10px_40px_rgba(0,75,99,0.15)]' : 'bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'}`}>
                {isPremium ? (
                  <>
                    <div className="absolute inset-0 rounded-[1.5rem] border-2 border-[#004B63]/30" />
                    <div className="absolute inset-0 rounded-[1.5rem] border-2 border-[#4DA8C4]/50 group-hover:border-[#66CCCC] transition-all duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 rounded-[1.5rem] border-2 border-transparent group-hover:border-[#4DA8C4]/40 transition-all duration-500 animate-[border-glow_3s_ease-in-out_infinite]" />
                )}
                
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#4DA8C4] to-[#66CCCC] transition-opacity duration-300 ${isPremium ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                <div className="relative flex justify-center mb-4">
                  <div className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isPremium ? 'bg-gradient-to-br from-[#004B63]/20 to-[#4DA8C4]/10 border-[#004B63]/40 shadow-[0_8px_25px_rgba(0,75,99,0.25)] group-hover:border-[#4DA8C4] group-hover:shadow-[0_8px_30px_rgba(77,168,196,0.3)]' : 'bg-gradient-to-br from-[#4DA8C4]/20 to-[#004B63]/10 border-[#4DA8C4]/30 shadow-[0_8px_20px_rgba(77,168,196,0.2)] group-hover:border-[#4DA8C4]'}`}>
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_#4DA8C4]" />
                    <Icon 
                      name={tool.icon} 
                      className={`text-3xl transition-colors duration-300 relative z-10 ${isPremium ? 'text-[#004B63] group-hover:text-[#66CCCC]' : 'text-[#4DA8C4] group-hover:text-[#004B63]'}`} 
                    />
                    <div className="absolute -inset-2 rounded-full border border-[#4DA8C4]/20 group-hover:border-[#4DA8C4]/50 transition-colors duration-300" />
                  </div>
                </div>

                <div className="text-center mb-3">
                  <h3 className="text-base font-bold text-[#004B63] font-montserrat mb-1 group-hover:text-[#4DA8C4] transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium">
                    {tool.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {tool.badges.map((badge, badgeIndex) => {
                    const isStarBadge = badge.includes('★');
                    return (
                    <span 
                      key={badgeIndex}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${isStarBadge || isPremium ? 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white border border-[#004B63]/30' : 'bg-[#4DA8C4]/10 border border-[#4DA8C4]/20 text-[#004B63]'}`}
                    >
                      {badge}
                    </span>
                  )})}
                </div>

                <div className="mb-4 space-y-1.5">
                  {tool.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-start gap-2 text-sm text-[#64748B] group-hover:text-[#004B63] transition-colors duration-300"
                    >
                      <Icon name="fa-chevron-right" className="w-3 h-3 mt-0.5 text-[#4DA8C4] flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] ${isPremium ? 'bg-gradient-to-r from-[#004B63] via-[#4DA8C4] to-[#66CCCC] text-white shadow-[0_4px_15px_rgba(0,75,99,0.3)] hover:shadow-[0_8px_25px_rgba(0,75,99,0.4)]' : 'bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white hover:shadow-[0_8px_20px_rgba(77,168,196,0.3)] hover:from-[#4DA8C4] hover:to-[#66CCCC]'}`}>
                  <span>{tool.buttonText}</span>
                  <Icon name="fa-arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t transition-opacity duration-300 ${isPremium ? 'from-[#004B63]/10 to-transparent opacity-100' : 'from-[#4DA8C4]/5 to-transparent opacity-0 group-hover:opacity-100'}`} />
              </div>
            </motion.div>
          )})}
        </div>


      </div>
    </section>
  );
}

export default AIToolsSection;
