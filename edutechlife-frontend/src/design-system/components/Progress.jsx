import React from 'react';
import PropTypes from 'prop-types';

const Progress = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  label,
  animated = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max(value, 0), max);
  const progressPercentage = (percentage / max) * 100;
  
  const baseClasses = 'overflow-hidden rounded-full';
  
  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    gradient: 'bg-gradient-to-r from-primary to-accent',
  };
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };
  
  const trackClasses = 'w-full bg-bg-glass rounded-full overflow-hidden';
  const progressClasses = `
    h-full rounded-full transition-all duration-500 ease-out
    ${variants[variant]}
    ${animated ? 'animate-pulse-slow' : ''}
  `.trim();
  
  const containerClasses = `
    ${className}
  `.trim();
  
  return (
    <div className={containerClasses} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-text-main">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-text-sub">
              {percentage}%
            </span>
          )}
        </div>
      )}
      
      <div className={`${trackClasses} ${sizes[size]}`}>
        <div
          className={progressClasses}
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'gradient']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  showValue: PropTypes.bool,
  label: PropTypes.string,
  animated: PropTypes.bool,
  className: PropTypes.string,
};

export default Progress;