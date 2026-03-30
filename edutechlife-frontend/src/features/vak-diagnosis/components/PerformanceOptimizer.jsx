import React, { Suspense, lazy } from 'react';

// Componente de loading optimizado
export const OptimizedLoading = ({ message = 'Cargando experiencia premium...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-bg-dark to-navy flex items-center justify-center p-4">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin" />
          <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-accent border-l-primary animate-spin" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-8 rounded-full border-4 border-transparent border-t-primary border-b-accent animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{message}</h3>
        <p className="text-text-sub text-sm">
          Preparando tu diagnóstico personalizado...
        </p>
      </div>
      
      <div className="w-64 h-1 bg-bg-glass-dark rounded-full overflow-hidden mx-auto">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-progress"
          style={{ width: '65%' }}
        />
      </div>
    </div>
  </div>
);

// Higher Order Component para lazy loading con retry
export const withLazyLoading = (importFunc, loadingComponent = null) => {
  const LazyComponent = lazy(() => 
    importFunc().catch(error => {
      console.error('Error loading component:', error);
      // Retry logic
      return importFunc();
    })
  );

  return (props) => (
    <Suspense fallback={loadingComponent || <OptimizedLoading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Hook para optimizar renders
export const useRenderOptimization = (dependencies = []) => {
  const renderCount = React.useRef(0);
  
  React.useEffect(() => {
    renderCount.current += 1;
    if (renderCount.current > 10) {
      console.warn('Component re-rendered too many times:', renderCount.current);
    }
  }, dependencies);
  
  return renderCount.current;
};

// Componente para imágenes optimizadas
export const OptimizedImage = ({ src, alt, className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-bg-glass animate-pulse" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};

// Hook para debounce
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttle
export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Componente para virtualización de listas (para muchas opciones)
export const VirtualizedList = ({ items, renderItem, itemHeight = 60, overscan = 5 }) => {
  const containerRef = React.useRef(null);
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 10 });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(
        items.length,
        start + Math.ceil(container.clientHeight / itemHeight) + overscan
      );

      setVisibleRange({ start, end });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length, itemHeight, overscan]);

  const totalHeight = items.length * itemHeight;
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: '400px' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.start + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                width: '100%',
                height: itemHeight
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Hook para memoización de funciones costosas
export const useMemoizedCallback = (callback, dependencies) => {
  const callbackRef = React.useRef(callback);
  
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return React.useCallback((...args) => {
    return callbackRef.current(...args);
  }, dependencies);
};

// Componente para carga progresiva
export const ProgressiveLoader = ({ children, fallback = null, delay = 200 }) => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isReady && fallback) {
    return fallback;
  }

  return isReady ? children : null;
};