import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-premium transition-all duration-300';
  
  const variants = {
    default: 'bg-bg-card border border-border-light shadow-glass',
    glass: 'bg-bg-glass backdrop-blur-glass border border-border-glass shadow-glass hover:shadow-glass-lg',
    dark: 'bg-bg-card-dark border border-border-dark shadow-glass',
    premium: 'bg-gradient-to-br from-bg-glass to-bg-glass-dark backdrop-blur-premium border border-border-glass shadow-premium',
    accent: 'bg-gradient-to-r from-primary/10 to-accent/10 border border-border-glass shadow-glass-accent',
  };
  
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const hoverClasses = hoverable ? 'hover:scale-[1.02] hover:shadow-glass-lg transition-transform duration-300' : '';
  
  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverClasses}
    ${className}
  `.trim();
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'glass', 'dark', 'premium', 'accent']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-bold text-text-main ${className}`} {...props}>
    {children}
  </h3>
);

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-text-sub mt-1 ${className}`} {...props}>
    {children}
  </p>
);

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-4 border-t border-border-light ${className}`} {...props}>
    {children}
  </div>
);

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;