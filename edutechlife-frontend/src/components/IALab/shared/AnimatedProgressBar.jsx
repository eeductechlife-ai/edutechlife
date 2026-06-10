import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const AnimatedProgressBar = ({ value, className = '' }) => {
  const pct = Math.round(value * 100);
  return (
    <div
      className={`w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full w-full bg-gradient-to-r from-petroleum to-corporate rounded-full"
        style={{ transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: pct / 100 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};

AnimatedProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default AnimatedProgressBar;
