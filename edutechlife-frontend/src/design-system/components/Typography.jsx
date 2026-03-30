import React from 'react';
import PropTypes from 'prop-types';

const Typography = ({
  children,
  variant = 'body',
  component,
  color = 'default',
  align = 'left',
  weight = 'normal',
  className = '',
  gradient = false,
  glow = false,
  ...props
}) => {
  const variantMapping = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span',
  };
  
  const variantClasses = {
    h1: 'text-5xl md:text-6xl font-display font-black leading-tight',
    h2: 'text-4xl md:text-5xl font-display font-bold leading-tight',
    h3: 'text-3xl md:text-4xl font-display font-bold leading-snug',
    h4: 'text-2xl md:text-3xl font-display font-semibold leading-snug',
    h5: 'text-xl md:text-2xl font-display font-semibold leading-normal',
    h6: 'text-lg md:text-xl font-display font-semibold leading-normal',
    subtitle1: 'text-lg font-body font-medium leading-relaxed',
    subtitle2: 'text-base font-body font-medium leading-relaxed',
    body: 'text-base font-body font-normal leading-relaxed',
    body2: 'text-sm font-body font-normal leading-relaxed',
    caption: 'text-xs font-body font-normal leading-tight',
    overline: 'text-xs font-body font-medium uppercase tracking-wider leading-tight',
  };
  
  const colorClasses = {
    default: 'text-text-main',
    sub: 'text-text-sub',
    light: 'text-text-light',
    dark: 'text-text-dark',
    inverse: 'text-text-inverse',
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  };
  
  const gradientClass = gradient ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent' : '';
  const glowClass = glow ? 'animate-text-glow' : '';
  
  const typographyClasses = `
    ${variantClasses[variant]}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${weightClasses[weight]}
    ${gradientClass}
    ${glowClass}
    ${className}
  `.trim();
  
  const Component = component || variantMapping[variant];
  
  return (
    <Component className={typographyClasses} {...props}>
      {children}
    </Component>
  );
};

Typography.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body', 'body2', 'caption', 'overline']),
  component: PropTypes.elementType,
  color: PropTypes.oneOf(['default', 'sub', 'light', 'dark', 'inverse', 'primary', 'accent', 'success', 'warning', 'error', 'info']),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  weight: PropTypes.oneOf(['light', 'normal', 'medium', 'semibold', 'bold', 'black']),
  className: PropTypes.string,
  gradient: PropTypes.bool,
  glow: PropTypes.bool,
};

export default Typography;