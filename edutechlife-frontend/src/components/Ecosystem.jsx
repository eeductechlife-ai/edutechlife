import { memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import { useTranslation } from '../i18n/I18nProvider';

const Ecosystem = memo(() => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  const pilares = [
    {
      id: 'neuroentorno', icon: 'fa-brain', title: 'NeuroEntornos Escolares', subtitle: 'Pilar 1',
      desc: 'Diagnóstico VAK, IA Lab con MAX, SmartBoard y herramientas neuropedagógicas.',
      stats: [{ num: '6,000+', label: 'Estudiantes' }, { num: '98%', label: 'Efectividad' }],
    },
    {
      id: 'ialab', icon: 'fa-robot', title: 'Laboratorio IA', subtitle: 'Certificación Profesional',
      desc: 'Aprende inteligencia artificial, crea prompts y obtén tu certificación.',
      stats: [{ num: '5', label: 'Módulos' }, { num: '100%', label: 'Online' }],
    },
    {
      id: 'consultoria', icon: 'fa-handshake', title: 'Consultoría B2B y Automatización', subtitle: 'Pilar 3',
      desc: 'Transformación digital, agentes IA personalizados y ROI garantizado.',
      stats: [{ num: '100+', label: 'Instituciones' }, { num: '3x', label: 'ROI Promedio' }],
    }
  ];

  const cards = [
    {
      bg: 'from-primary-light/20', border: 'border-primary-light/30',
      img: '/images/eco-neuro.webp', titleKey: 'ecosystem.card_1_title', descKey: 'ecosystem.card_1_desc',
      delay: 0.1,
    },
    {
      bg: 'from-mint/20', border: 'border-mint/30',
      img: '/images/eco-nacional.webp', titleKey: 'ecosystem.card_2_title', descKey: 'ecosystem.card_2_desc',
      delay: 0.2,
    },
    {
      bg: 'from-corporate/20', border: 'border-corporate/30',
      img: '/images/edutech-carrusel-6.webp', titleKey: 'ecosystem.card_3_title', descKey: 'ecosystem.card_3_desc',
      delay: 0.3,
    },
  ];

  return (
    <section id="ecosystem" ref={sectionRef} className="relative w-full overflow-hidden bg-white">
      <div id="conoce-smartboard" className="absolute -top-24" />
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-primary-light/5 blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-mint/5 blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '-4s' }} />

      <div className="absolute top-[15%] right-[20%] w-3 h-3 bg-primary-light/40 rounded-full animate-float-3d" />
      <div className="absolute top-[40%] left-[10%] w-2 h-2 bg-mint/50 rounded-full animate-float-3d" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-[20%] right-[15%] w-4 h-4 bg-corporate/30 rounded-full animate-float-3d" style={{ animationDelay: '-4s' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-petroleum tracking-tighter mb-4">
            {t('ecosystem.title_before')}{' '}
            <span className="text-gradient-accent">{t('ecosystem.title_highlight')}</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {t('ecosystem.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="group card-clay-white overflow-hidden relative"
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              whileHover={{ y: -6 }}
            >
              <div className="h-56 w-full overflow-hidden relative rounded-t-[20px]">
                <div className={`absolute inset-0 bg-gradient-to-t ${card.bg} to-transparent z-10`} />
                <img src={card.img} alt={t(card.titleKey)} loading="lazy" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name={pilares[i].icon} className="text-2xl text-primary-light" />
                  <h3 className="text-xl font-bold text-petroleum">
                    {t(card.titleKey)}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{t(card.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Ecosystem.displayName = 'Ecosystem';

export default Ecosystem;
