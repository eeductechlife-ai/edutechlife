import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import ReactivePromptStation from './ReactivePromptStation';
import IALabInteractionAdvisor from './IALabInteractionAdvisor';
import IALabTutoriasVirtuales from './IALabTutoriasVirtuales';

const previewVariants = {
  idle: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2 }
};

const ToolTutorAccordion = ({ activeMod, onAction }) => {
  const [expanded, setExpanded] = useState(null);

  const toggle = (section) => {
    setExpanded(prev => prev === section ? null : section);
  };

  const isToolMod2 = activeMod === 2;
  const toolConfig = isToolMod2
    ? { title: 'Asesor de Interacción ChatGPT', subtitle: 'Describe tu tarea y descubre qué herramienta de ChatGPT usar', icon: 'fa-wand-magic-sparkles', ctaIcon: 'fa-wand-magic-sparkles', ctaText: 'Abrir asesor' }
    : { title: 'Herramientas para Crear Prompts', subtitle: 'Mejora tus prompts con análisis y optimización IA', icon: 'fa-wand-magic-sparkles', ctaIcon: 'fa-hand-pointer', ctaText: 'Abrir herramienta' };

  const tutoringConfig = { title: 'Tutorías Virtuales', subtitle: 'Conecta en vivo todos los domingos 4PM Bogotá', icon: 'fa-video', ctaIcon: 'fa-video', ctaText: 'Ver disponibilidad' };

  const PreviewCard = ({ config, section }) => {
    const isActive = expanded === section;
    return (
      <motion.div
        whileHover="hover"
        variants={previewVariants}
        transition={{ duration: 0.2 }}
        onClick={() => toggle(section)}
        className={`relative z-10 bg-white rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
          isActive
            ? 'border-[#00BCD4] shadow-md shadow-[#00BCD4]/10 ring-1 ring-[#00BCD4]/20'
            : 'border-slate-200/60 shadow-sm hover:shadow-lg hover:border-[#004B63]/40'
        }`}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#004B63]/6 to-[#00BCD4]/4 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-[#004B63]/4 to-[#00BCD4]/4 rounded-full blur-2xl pointer-events-none" />

        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4]'
            : 'bg-gradient-to-r from-[#004B63]/40 via-[#0A3550]/40 to-[#00BCD4]/40'
        }`} />

        <div className={`p-5 transition-all duration-300 ${isActive ? 'bg-gradient-to-b from-[#00BCD4]/5 to-transparent' : ''}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-br from-[#004B63] to-[#00BCD4] shadow-md'
                : 'bg-gradient-to-br from-[#004B63]/15 to-[#00BCD4]/15 border border-[#004B63]/10'
            }`}>
              <Icon name={config.icon} className={`w-6 h-6 ${isActive ? 'text-white' : 'text-[#004B63]'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-base md:text-lg font-bold transition-colors duration-300 ${
                isActive ? 'text-[#004B63]' : 'text-slate-800 group-hover:text-[#004B63]'
              }`}>
                {config.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 mt-1.5 leading-relaxed">{config.subtitle}</p>
              {!isActive && (
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-xl shadow-sm hover:from-[#0A3550] hover:to-[#0097A7] hover:shadow group-hover:scale-105 transition-all duration-300">
                    <Icon name={config.ctaIcon} className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-bold text-white tracking-wide">{config.ctaText}</span>
                    <Icon name="fa-chevron-right" className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              )}
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isActive ? 'bg-[#004B63]/10 rotate-180 shadow-sm' : 'bg-[#00BCD4]/15 group-hover:scale-110'
            }`}>
              <Icon name="fa-chevron-down" className={`w-4 h-4 transition-colors ${
                isActive ? 'text-[#004B63]' : 'text-[#00BCD4]'
              }`} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <PreviewCard config={toolConfig} section="tool" />
        <PreviewCard config={tutoringConfig} section="tutoring" />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key={expanded}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-1">
              {expanded === 'tool' ? (
                isToolMod2 ? <IALabInteractionAdvisor /> : <ReactivePromptStation />
              ) : (
                <IALabTutoriasVirtuales />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolTutorAccordion;
