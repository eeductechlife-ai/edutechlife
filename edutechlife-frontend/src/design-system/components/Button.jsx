import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-premium';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-premium hover:shadow-premium-lg',
    secondary: 'bg-secondary text-white hover:bg-opacity-90 focus:ring-secondary shadow-glass hover:shadow-glass-lg',
    accent: 'bg-accent text-white hover:bg-opacity-90 focus:ring-accent shadow-glass-accent hover:shadow-glass-lg',
    outline: 'bg-transparent border border-border-glass text-text-main hover:bg-bg-glass focus:ring-primary',
    ghost: 'bg-transparent text-text-main hover:bg-bg-glass focus:ring-primary',
    glass: 'bg-bg-glass backdrop-blur-glass border border-border-glass text-text-main hover:bg-bg-glass-dark hover:backdrop-blur-glass-lg shadow-glass hover:shadow-glass-lg',
    premium: 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary-dark hover:to-accent-dark focus:ring-primary shadow-premium hover:shadow-premium-lg animate-premium-pulse',
  };
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = loading ? 'opacity-70 cursor-wait' : '';
  
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${widthClass}
    ${loadingClass}
    ${className}
  `.trim();
  
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = size === 'xs' || size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <span className={`${iconPosition === 'left' ? 'mr-2' : 'ml-2'} ${loading ? 'opacity-0' : ''}`}>
        {React.cloneElement(icon, { className: iconClasses })}
      </span>
    );
  };
  
  const renderLoading = () => {
    if (!loading) return null;
    
    return (
      <span className="absolute inset-0 flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    );
  };
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className={`relative ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>
      {iconPosition === 'right' && renderIcon()}
      {renderLoading()}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'ghost', 'glass', 'premium']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;