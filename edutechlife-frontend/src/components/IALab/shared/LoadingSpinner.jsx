import { memo, useState, useEffect } from 'react';

/**
 * @param {Object} props
 * @param {() => void} [props.onRetry]
 * @param {string} [props.loadingText]
 * @param {string} [props.retryText]
 */
const LoadingSpinner = memo(({ onRetry, loadingText = 'Cargando...', retryText = 'Reintentar' }) => {
  const [showTimeout, setShowTimeout] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowTimeout(true), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-petroleum/30 border-t-petroleum dark:border-corporate/30 dark:border-t-corporate rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{loadingText}</p>
      {showTimeout && onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-xs font-semibold text-petroleum dark:text-corporate border border-petroleum/30 dark:border-corporate/30 rounded-xl hover:bg-petroleum/5 dark:hover:bg-corporate/5 transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  );
});
LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
export { LoadingSpinner };
