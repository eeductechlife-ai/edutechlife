import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import FloatingParticles from './FloatingParticles';
import { useTranslation } from '../i18n/I18nProvider';

function AIToolsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tools = [
    {
      id: 'ai-lab-academic',
      name: t('ai_tools.card_1_name'),
      subtitle: 'ACADEMIC',
      path: '/ialab-academic',
      icon: 'fa-rocket',
      description: t('ai_tools.card_1_desc'),
      badges: ['ACADEMIC', 'CERTIFIED'],
      buttonText: t('ai_tools.card_1_button'),
      variant: 'main-dark',
    },
    {
      id: 'automation',
      name: t('ai_tools.card_2_name'),
      subtitle: t('ai_tools.card_2_subtitle'),
      path: '/automation',
      icon: 'fa-robot',
      description: t('ai_tools.card_2_desc'),
      features: [t('ai_tools.card_2_feature_1'), t('ai_tools.card_2_feature_2'), t('ai_tools.card_2_feature_3')],
      buttonText: t('ai_tools.card_2_button'),
      variant: 'white-card',
    },
    {
      id: 'vak',
      name: t('ai_tools.card_3_name'),
      subtitle: t('ai_tools.card_3_subtitle'),
      path: '/vak',
      icon: 'fa-brain',
      description: t('ai_tools.card_3_desc'),
      buttonText: t('ai_tools.card_3_button'),
      variant: 'white-card-vak',
    },
    {
      id: 'smartboard',
      name: t('ai_tools.card_4_name'),
      subtitle: t('ai_tools.card_4_subtitle'),
      path: '/conoce-smartboard',
      icon: 'fa-chalkboard',
      description: t('ai_tools.card_4_desc'),
      buttonText: t('ai_tools.card_4_button'),
      variant: 'horizontal',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-petroleum tracking-tighter mb-3">
              {t('ai_tools.title_before')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-petroleum pr-1">{t('ai_tools.title_highlight')}</span>
            </h2>
            <p className="text-base text-slate-500 max-w-2xl font-medium">
              {t('ai_tools.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Card 1: AI Lab Academic (Main Dark) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 card-clay-dark text-white p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary-light/15 flex items-center justify-center flex-shrink-0">
                <Icon name={tools[0].icon} className="text-2xl text-primary-light" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-primary-light">{tools[0].name}</h3>
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-light text-white text-sm font-semibold hover:bg-mint transition-colors"
              >
                {tools[0].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Automatización */}
          <motion.div variants={itemVariants} className="col-span-1 card-clay-white p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary-light/10 flex items-center justify-center mb-5">
                <Icon name={tools[1].icon} className="text-2xl text-primary-light" />
              </div>
              <h3 className="text-xl font-black text-petroleum mb-2">{tools[1].name}</h3>
              <p className="text-slate-500 text-sm mb-4">{tools[1].description}</p>
              <div className="space-y-2">
                {tools[1].features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="fa-check-circle" className="text-primary-light text-xs flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <a
                href={tools[1].path}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(tools[1].path); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:border-primary-light hover:text-primary-light hover:bg-primary-light/5 transition-all"
              >
                {tools[1].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 3: Diagnóstico VAK */}
          <motion.div variants={itemVariants} className="col-span-1 card-clay-white p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary-light/10 flex items-center justify-center mb-5">
                <Icon name={tools[2].icon} className="text-2xl text-primary-light" />
              </div>
              <h3 className="text-xl font-black text-petroleum mb-1">{tools[2].name}</h3>
              <p className="text-xs text-primary-light font-semibold uppercase tracking-wider mb-3">{tools[2].subtitle}</p>
              <p className="text-slate-500 text-sm">{tools[2].description}</p>
            </div>
            <div className="mt-6">
              <a
                href={tools[2].path}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(tools[2].path); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-petroleum text-white text-sm font-semibold hover:bg-primary-light transition-all"
              >
                {tools[2].buttonText}
                <Icon name="fa-arrow-right" className="text-xs" />
              </a>
            </div>
          </motion.div>

          {/* Card 4: SmartBoard (Horizontal) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 card-clay bg-primary-light/5 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-xl bg-primary-light/15 flex items-center justify-center flex-shrink-0">
                <Icon name={tools[3].icon} className="text-3xl text-primary-light" />
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl md:text-3xl font-black text-petroleum">{tools[3].name}</h3>
                <p className="text-xs text-primary-light font-semibold uppercase tracking-wider">{tools[3].subtitle}</p>
                <p className="text-petroleum/70 text-base mt-1.5">{tools[3].description}</p>
              </div>
            </div>
            <a
              href={tools[3].path}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(tools[3].path); }}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-light text-white text-sm font-semibold hover:bg-petroleum transition-all border border-primary-light/20"
            >
              {tools[3].buttonText}
              <Icon name="fa-arrow-right" className="text-xs" />
            </a>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default AIToolsSection;
