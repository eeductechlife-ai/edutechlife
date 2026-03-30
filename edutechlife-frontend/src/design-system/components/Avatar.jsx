import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
  src,
  alt,
  size = 'md',
  variant = 'circle',
  border = false,
  borderColor = 'glass',
  online = false,
  className = '',
  children,
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };
  
  const variants = {
    circle: 'rounded-full',
    rounded: 'rounded-premium',
    square: 'rounded-none',
  };
  
  const borderColors = {
    glass: 'border border-border-glass',
    primary: 'border-2 border-primary',
    accent: 'border-2 border-accent',
    light: 'border-2 border-border-light',
    dark: 'border-2 border-border-dark',
  };
  
  const baseClasses = 'inline-flex items-center justify-center bg-bg-glass text-text-main font-medium overflow-hidden relative';
  
  const avatarClasses = `
    ${baseClasses}
    ${sizes[size]}
    ${variants[variant]}
    ${border ? borderColors[borderColor] : ''}
    ${className}
  `.trim();
  
  const onlineIndicatorClasses = `
    absolute bottom-0 right-0
    ${size === 'xs' || size === 'sm' ? 'w-1.5 h-1.5' : 'w-3 h-3'}
    rounded-full border-2 border-white
    ${online ? 'bg-success' : 'bg-error'}
  `;
  
  const renderContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
        />
      );
    }
    
    if (children) {
      return children;
    }
    
    // Fallback to initials if no src or children
    const initials = alt ? alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    return <span>{initials}</span>;
  };
  
  return (
    <div className={avatarClasses} {...props}>
      {renderContent()}
      {online !== null && (
        <span className={onlineIndicatorClasses} />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  variant: PropTypes.oneOf(['circle', 'rounded', 'square']),
  border: PropTypes.bool,
  borderColor: PropTypes.oneOf(['glass', 'primary', 'accent', 'light', 'dark']),
  online: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Avatar;