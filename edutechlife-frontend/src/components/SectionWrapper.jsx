import React from 'react';

/**
 * Componente wrapper premium para secciones con espaciado consistente
 * 
 * @param {Object} props
 * @param {string} props.id - ID para navegación
 * @param {string} props.className - Clases CSS adicionales
 * @param {React.ReactNode} props.children - Contenido de la sección
 * @param {string} props.spacing - Tamaño de espaciado: 'first', 'last', 'lg', 'md', 'sm', 'default'
 * @param {string} props.bg - Fondo: 'white', 'light', 'gradient', 'dark', 'none'
 * @param {boolean} props.divider - Mostrar divisor superior
 * @param {string} props.dividerType - Tipo de divisor: 'accent', 'light'
 * @param {string} props.minHeight - Altura mínima: 'screen', '75', '50', 'none'
 * @param {boolean} props.overflowHidden - Ocultar overflow
 * @param {string} props.align - Alineación: 'center', 'left', 'right'
 */
const SectionWrapper = ({
  id,
  className = '',
  children,
  spacing = 'default',
  bg = 'white',
  divider = false,
  dividerType = 'accent',
  minHeight = 'none',
  overflowHidden = false,
  align = 'left',
  ...props
}) => {
  // Clases de espaciado
  const spacingClasses = {
    first: 'section-first',
    last: 'section-last',
    lg: 'section-spacing-lg',
    md: 'section-spacing-md',
    sm: 'section-spacing-sm',
    default: 'section-spacing'
  };
  
  // Clases de fondo
  const bgClasses = {
    white: 'section-bg-white',
    light: 'section-bg-light',
    gradient: 'section-bg-gradient',
    dark: 'section-bg-dark',
    none: ''
  };
  
  // Clases de altura mínima
  const minHeightClasses = {
    screen: 'section-min-h-screen',
    '75': 'section-min-h-75',
    '50': 'section-min-h-50',
    none: ''
  };
  
  // Clases de alineación
  const alignClasses = {
    center: 'section-center',
    left: 'section-left',
    right: 'section-right'
  };
  
  // Clases de overflow
  const overflowClass = overflowHidden ? 'section-overflow-hidden' : 'section-overflow-visible';
  
  // Clases de divisor
  const dividerClass = divider ? `section-divider ${dividerType === 'light' ? 'section-divider-light' : ''}` : '';
  
  // Construir clases finales
  const sectionClasses = [
    spacingClasses[spacing],
    bgClasses[bg],
    minHeightClasses[minHeight],
    alignClasses[align],
    overflowClass,
    dividerClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <section 
      id={id}
      className={sectionClasses}
      {...props}
    >
      <div className="section-container section-inner">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;