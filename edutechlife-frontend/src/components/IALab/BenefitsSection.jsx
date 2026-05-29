import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { fadeInUp, staggerContainer } from './constants/landingAnimations';
import { benefits as benefitsData } from './data/landingPageData';
import { useTranslation } from '../../i18n/I18nProvider';

const BenefitsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-[#F0F7FA] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #004B63 1px, transparent 1px), radial-gradient(circle at 75% 75%, #00BCD4 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-petroleum mb-4">
            {t('ialab.benefits.title')}
          </h2>
          <p className="font-body text-lg text-slate-600 max-w-2xl mx-auto">
            {t('ialab.benefits.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 bg-white border border-petroleum/5 rounded-xl hover:border-primary-light/30 hover:shadow-[0_0_30px_rgba(0,75,99,0.08)] transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute top-0 left-0 w-1 h-[25%] bg-gradient-to-b from-petroleum to-corporate group-hover:h-full transition-all duration-500"
              />
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-petroleum to-primary-light rounded-xl flex items-center justify-center mb-4"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Icon name={benefit.icon} className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="font-display text-lg font-bold text-petroleum mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
