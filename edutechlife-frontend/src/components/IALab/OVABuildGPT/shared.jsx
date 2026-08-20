import PropTypes from 'prop-types';
export const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon = null, disabled = false }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants = {
    primary: "bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-emphasis)] text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5",
    secondary: "bg-white dark:bg-slate-700 text-[var(--theme-emphasis)] dark:text-slate-200 border-2 border-cyan-100 dark:border-slate-600 hover:border-[var(--theme-primary)] hover:bg-cyan-50 dark:hover:bg-slate-600",
    outline: "bg-transparent text-[var(--theme-primary)] border-2 border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white"};
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={20} />}{children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/40 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

