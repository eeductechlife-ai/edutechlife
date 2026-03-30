import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  variant = 'default',
  className = '',
  overlayClassName = '',
  ...props
}) => {
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEsc, isOpen, onClose]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  const variants = {
    default: 'bg-bg-card border border-border-light shadow-glass',
    glass: 'bg-bg-glass backdrop-blur-glass border border-border-glass shadow-glass',
    dark: 'bg-bg-card-dark border border-border-dark shadow-glass',
    premium: 'bg-gradient-to-b from-bg-glass to-bg-glass-dark backdrop-blur-premium border border-border-glass shadow-premium',
  };
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${overlayClassName}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${sizes[size]} rounded-premium transform transition-all duration-300 ${variants[variant]} ${className}`}
          {...props}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h3 className="text-xl font-bold text-text-main">
                {title}
              </h3>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-bg-glass transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 text-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {!title && showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-bg-glass transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary z-10"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'glass', 'dark', 'premium']),
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
};

export const ModalHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

ModalHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const ModalBody = ({ children, className = '', ...props }) => (
  <div className={`mb-6 ${className}`} {...props}>
    {children}
  </div>
);

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const ModalFooter = ({ children, className = '', ...props }) => (
  <div className={`flex justify-end space-x-3 ${className}`} {...props}>
    {children}
  </div>
);

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Modal;