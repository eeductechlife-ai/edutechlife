import { motion } from 'framer-motion';
import { Icon } from '../../../utils/iconMapping.jsx';

const HeroContent = ({ heroInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={heroInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center gap-3 md:gap-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none text-center"
      >
        <span className="text-white">I.Alab </span>
        <motion.span
          className="bg-gradient-to-r from-primary-light to-mint bg-clip-text text-transparent"
          animate={{ textShadow: [
            '0 0 20px rgba(77,168,196,0.2)',
            '0 0 40px rgba(77,168,196,0.5)',
            '0 0 20px rgba(77,168,196,0.2)'
          ]}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Academic
        </motion.span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
      >
        <Icon name="fa-flask" className="w-4 h-4 text-primary-dark" />
        <span className="text-sm font-semibold text-white tracking-wide">Laboratorio de Innovación Educativa</span>
      </motion.div>

    </motion.div>
  );
};

export default HeroContent;
