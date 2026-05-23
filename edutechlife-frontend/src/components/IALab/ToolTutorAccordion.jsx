import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabProgressContext } from '../../context/IALabContext';
const ReactivePromptStation = lazy(() => import('./ReactivePromptStation'));
const OVAPodcastStudio = lazy(() => import('./OVAPodcastStudio'));
const IALabInteractionAdvisor = lazy(() => import('./IALabInteractionAdvisor'));
const EthicsExplorer = lazy(() => import('./EthicsExplorer'));
const IALabTutoriasVirtuales = lazy(() => import('./IALabTutoriasVirtuales'));

const previewVariants = {
  idle: { boxShadow: "0px 4px 16px rgba(17,17,26,0.05)" },
  hover: { boxShadow: "0px 8px 25px rgba(0,75,99,0.12)" }
};

const ToolTutorAccordion = ({ onAction }) => {
  const { activeMod } = useIALabProgressContext();
  const [expanded, setExpanded] = useState(null);

  const toggle = (section) => {
    setExpanded(prev => prev === section ? null : section);
  };

  const isToolMod2 = activeMod === 2;
  const isToolMod4 = activeMod === 4;
  const isToolMod5 = activeMod === 5;
  const toolConfig = isToolMod2
    ? { title: 'Asesor de Interacción ChatGPT', subtitle: 'Describe tu tarea y descubre qué herramienta de ChatGPT usar', icon: 'fa-wand-magic-sparkles', ctaIcon: 'fa-wand-magic-sparkles', ctaText: 'Abrir asesor' }
    : isToolMod4
    ? { title: 'Estudio de Podcast IA', subtitle: 'Crea podcasts IA desde tus documentos como en NotebookLM', icon: 'fa-microphone', ctaIcon: 'fa-microphone', ctaText: 'Abrir estudio' }
    : isToolMod5
    ? { title: 'Laboratorio de Ética IA', subtitle: 'Explora los 3 pilares de la IA responsable: sesgos, privacidad y regulación', icon: 'fa-balance-scale', ctaIcon: 'fa-balance-scale', ctaText: 'Abrir laboratorio' }
    : { title: 'Herramientas para Crear Prompts', subtitle: 'Mejora tus prompts con análisis y optimización IA', icon: 'fa-wand-magic-sparkles', ctaIcon: 'fa-hand-pointer', ctaText: 'Abrir herramienta' };

  const tutoringConfig = { title: 'Tutorías Virtuales', subtitle: 'Conecta en vivo todos los domingos 4PM Bogotá', icon: 'fa-video', ctaIcon: 'fa-video', ctaText: 'Ver disponibilidad' };

  const PreviewCard = ({ config, section }) => {
    const isActive = expanded === section;
    const shouldReduceMotion = useReducedMotion();
    return (
      <motion.div
        whileHover={shouldReduceMotion ? {} : "hover"}
        variants={previewVariants}
        transition={{ duration: 0.2 }}
        onClick={() => toggle(section)}
        className={`relative z-10 bg-white rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
          isActive
            ? 'border-corporate dark:border-mint shadow-md shadow-corporate/10 dark:shadow-mint/10 ring-1 ring-corporate/20 dark:ring-mint/20'
            : 'border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg hover:border-petroleum/40 dark:hover:border-petroleum/60'
        }`}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-petroleum/6 to-corporate/4 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-petroleum/4 to-corporate/4 rounded-full blur-2xl pointer-events-none" />

        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate'
            : 'bg-gradient-to-r from-petroleum/40 via-petroleum-dark/40 to-corporate/40'
        }`} />

        <div className={`p-5 transition-all duration-300 ${isActive ? 'bg-gradient-to-b from-corporate/5 to-transparent' : ''}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-br from-petroleum to-corporate shadow-md'
                : 'bg-gradient-to-br from-petroleum/15 to-corporate/15 border border-petroleum/10'
            }`}>
              <Icon name={config.icon} className={`w-6 h-6 ${isActive ? 'text-white' : 'text-petroleum'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-base md:text-lg font-bold transition-colors duration-300 ${
                isActive ? 'text-petroleum dark:text-slate-100' : 'text-slate-800 dark:text-slate-100 group-hover:text-petroleum'
              }`}>
                {config.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{config.subtitle}</p>
              {!isActive && (
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-petroleum to-corporate rounded-xl shadow-sm hover:from-petroleum-dark hover:to-corporate-dark hover:shadow group-hover:scale-105 transition-all duration-300">
                    <Icon name={config.ctaIcon} className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-bold text-white tracking-wide">{config.ctaText}</span>
                    <Icon name="fa-chevron-right" className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              )}
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isActive ? 'bg-petroleum/10 rotate-180 shadow-sm' : 'bg-corporate/15 group-hover:scale-110'
            }`}>
              <Icon name="fa-chevron-down" className={`w-4 h-4 transition-colors ${
                isActive ? 'text-petroleum' : 'text-corporate'
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
              <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />}>
                {expanded === 'tool' ? (
                  isToolMod2 ? <IALabInteractionAdvisor /> : isToolMod4 ? <OVAPodcastStudio /> : isToolMod5 ? <EthicsExplorer /> : <ReactivePromptStation />
                ) : (
                  <IALabTutoriasVirtuales />
                )}
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolTutorAccordion;
