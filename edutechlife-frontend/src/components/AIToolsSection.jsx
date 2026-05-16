import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';

const tools = [
  {
    id: 'ai-lab-academic',
    name: 'AI Lab Academic',
    subtitle: 'ACADEMIC',
    path: '/ialab-academic',
    icon: 'fa-rocket',
    description: 'Entrenamiento de élite con agentes de IA para potenciar tu productividad y aprendizaje cognitivo.',
    badges: ['ACADEMIC', 'CERTIFIED'],
    buttonText: 'Comenzar Curso',
    variant: 'main-dark',
  },
  {
    id: 'automation',
    name: 'Automatización',
    subtitle: 'IA EMPRESARIAL',
    path: '/automation',
    icon: 'fa-robot',
    description: 'Centro de Automatización Empresarial con IA. Diagnóstico, ROI y arquitectura alineados con estándares internacionales.',
    features: ['Arquitectura de IA empresarial', 'Calculadora ROI interactiva', 'Estándares ISO/IEC 42001 y NIST AI RMF'],
    buttonText: 'Comenzar',
    variant: 'white-card',
  },
  {
    id: 'vak',
    name: 'Diagnóstico VAK',
    subtitle: 'NEURO-COGNITIVO',
    path: '/vak',
    icon: 'fa-brain',
    description: 'Identificamos tu estilo de aprendizaje único mediante algoritmos de visión cognitiva y procesamiento de lenguaje natural.',
    buttonText: 'Comenzar Diagnóstico',
    variant: 'white-card-vak',
  },
  {
    id: 'smartboard',
    name: 'SmartBoard',
    subtitle: 'Dashboard 8-16 Años',
    path: '/smartboard',
    icon: 'fa-chalkboard',
    description: 'Plataforma de acompañamiento académico y emocional con Valerio AI.',
    buttonText: 'Prueba el Dashboard',
    variant: 'horizontal',
  },
];

function AIToolsSection() {
  const navigate = useNavigate();

  return (
    <section id="herramientas" className="py-20 px-4 md:px-6 bg-white relative overflow-hidden">
      <FloatingParticles count={8} className="z-0 opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-left mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#004B63] font-montserrat tracking-tighter mb-3">
              Herramientas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DA8C4] to-[#004B63]">Élite.</span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl font-medium">
              Ecosistema de soluciones cognitivas diseñadas para potenciar el aprendizaje mediante IA y Neuro-ciencia.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: AI Lab Academic (Main Dark) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            whileHover={{ y: -6 }}
            className="col-span-1 md:col-span-2 bg-[#004B63] text-white rounded-[2rem] p-8 flex flex-col group hover:shadow-2xl hover:shadow-[#004B63]/20 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#4DA8C4]/20 flex items-center justify-center flex-shrink-0">
                <Icon name={tools[0].icon} className="text-xl text-[#4DA8C4]" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#4DA8C4]">{tools[0].name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tools[0].badges.map((badge) => (
                    <span key={badge} className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white font-bold uppercase tracking-wider border border-white/15">{badge}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-white/80 max-w-xl text-base md:text-lg leading-relaxed">{tools[0].description}</p>
            <div className="mt-auto pt-6">
              <a
                href={tools[0].path}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(tools[0].path); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4DA8C4] text-white text-sm font-semibold hover:bg-[#66CCCC] transition-colors"
              >
                {tools[0].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Automatización */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="col-span-1 bg-white shadow-sm border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-between group hover:shadow-lg hover:border-slate-200 transition-all duration-500"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center mb-5">
                <Icon name={tools[1].icon} className="text-xl text-[#4DA8C4]" />
              </div>
              <h3 className="text-xl font-black text-[#004B63] mb-2">{tools[1].name}</h3>
              <p className="text-slate-500 text-sm mb-4">{tools[1].description}</p>
              <div className="space-y-2">
                {tools[1].features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="fa-check-circle" className="text-[#4DA8C4] text-xs flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <a
                href={tools[1].path}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(tools[1].path); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-300 hover:text-slate-800 transition-colors"
              >
                {tools[1].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 3: Diagnóstico VAK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="col-span-1 bg-white shadow-sm border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-between group hover:shadow-lg hover:border-slate-200 transition-all duration-500"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#4DA8C4]/10 flex items-center justify-center mb-5">
                <Icon name={tools[2].icon} className="text-xl text-[#4DA8C4]" />
              </div>
              <h3 className="text-xl font-black text-[#004B63] mb-1">{tools[2].name}</h3>
              <p className="text-xs text-[#4DA8C4] font-semibold uppercase tracking-wider mb-3">{tools[2].subtitle}</p>
              <p className="text-slate-500 text-sm">{tools[2].description}</p>
            </div>
            <div className="mt-6">
              <a
                href={tools[2].path}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(tools[2].path); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#004B63] text-white text-sm font-semibold hover:bg-[#4DA8C4] transition-colors"
              >
                {tools[2].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 4: SmartBoard (Horizontal) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="col-span-1 md:col-span-2 bg-[#4DA8C4] text-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 group hover:shadow-2xl hover:shadow-[#4DA8C4]/30 transition-all duration-500"
          >
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon name={tools[3].icon} className="text-3xl text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl md:text-3xl font-black text-white">{tools[3].name}</h3>
                <p className="text-sm text-white/70 font-semibold uppercase tracking-wider">{tools[3].subtitle}</p>
                <p className="text-white/80 text-base mt-1.5">{tools[3].description}</p>
              </div>
            </div>
            <a
              href={tools[3].path}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(tools[3].path); }}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/25 text-white text-sm font-semibold hover:bg-white/35 transition-colors border border-white/20"
            >
              {tools[3].buttonText}
              <Icon name="fa-arrow-right" className="text-xs" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default AIToolsSection;
