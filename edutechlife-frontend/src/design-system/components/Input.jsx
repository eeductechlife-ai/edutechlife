import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-premium';
  
  const variants = {
    default: 'bg-white border border-border-light text-text-main placeholder:text-text-sub focus:border-primary focus:ring-primary',
    glass: 'bg-bg-glass backdrop-blur-glass border border-border-glass text-text-main placeholder:text-text-sub focus:border-primary focus:ring-primary shadow-glass',
    dark: 'bg-bg-card-dark border border-border-dark text-text-light placeholder:text-text-sub focus:border-primary focus:ring-primary',
    premium: 'bg-gradient-to-r from-bg-glass to-bg-glass-dark backdrop-blur-glass border border-border-glass text-text-main placeholder:text-text-sub focus:border-primary focus:ring-primary shadow-glass hover:shadow-glass-lg',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-error focus:border-error focus:ring-error' : '';
  
  const inputClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${widthClass}
    ${errorClass}
    ${className}
  `.trim();
  
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconSize = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    
    return (
      <span className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
        {React.cloneElement(icon, { 
          className: `${iconSize[size]} ${error ? 'text-error' : 'text-text-sub'}` 
        })}
      </span>
    );
  };
  
  const paddingClass = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  return (
    <div className={`${containerClassName} ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-text-main mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && renderIcon()}
        
        <input
          ref={ref}
          className={`${inputClasses} ${paddingClass}`}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {icon && iconPosition === 'right' && renderIcon()}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error' : 'text-text-sub'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'glass', 'dark', 'premium']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default Input;