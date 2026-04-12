import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagen con lazy loading usando IntersectionObserver
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = null,
  onError = null
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Si no hay src o ya está cargada, no hacer nada
    if (!src || isLoaded) return;

    const imgElement = imgRef.current;
    if (!imgElement) return;

    // Configurar IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Cuando la imagen es visible, cargarla
            const img = new Image();
            img.src = src;
            
            img.onload = () => {
              setIsLoaded(true);
              if (onLoad) onLoad();
              
              // Actualizar el src del elemento img real
              if (imgElement) {
                imgElement.src = src;
              }
            };
            
            img.onerror = () => {
              setHasError(true);
              if (onError) onError();
            };
            
            // Dejar de observar
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '100px', // Cargar 100px antes de que sea visible
        threshold: 0.01
      }
    );

    observer.observe(imgElement);
    observerRef.current = observer;

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, isLoaded, onLoad, onError]);

  // Si hay error, mostrar placeholder o nada
  if (hasError) {
    return placeholder ? (
      <div className={className}>{placeholder}</div>
    ) : null;
  }

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGMEYyRjQiLz48L3N2Zz4='}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading="lazy"
      decoding="async"
    />
  );
};

LazyImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.node,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default LazyImage;