import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

export default function SmartBoardVakBadge({ icon, label, gradient, shadowColor, style, delay = 0 }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      style={style}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, delay }}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateX: [0, 8, 0],
          rotateY: [0, -8, 0],
        }}
        transition={{
          duration: 4 + delay * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay * 0.3,
        }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} shadow-xl ${shadowColor} flex items-center justify-center ring-2 ring-white/50`}
        style={{ transformStyle: 'preserve-3d', perspective: 500 }}
      >
        <Icon name={icon} className="text-2xl text-white" />
      </motion.div>
      <div className="bg-white/70 backdrop-blur-xl px-2.5 py-0.5 rounded-full shadow-sm">
        <span className="text-[10px] font-bold text-petroleum">{label}</span>
      </div>
    </motion.div>
  );
}

SmartBoardVakBadge.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  gradient: PropTypes.string.isRequired,
  shadowColor: PropTypes.string,
  style: PropTypes.object,
  delay: PropTypes.number,
};
