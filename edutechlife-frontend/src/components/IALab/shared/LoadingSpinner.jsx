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
      <div className="spinner-premium w-9 h-9 mb-4">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{loadingText}</p>
      {showTimeout && onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-xs font-semibold text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)] border border-[var(--theme-emphasis)]/30 dark:border-[var(--theme-primary)]/30 rounded-xl hover:bg-[var(--theme-emphasis)]/5 dark:hover:bg-[var(--theme-primary)]/5 transition-colors"
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

export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12" role="status" aria-label="Loading">
      <div className="spinner-premium w-8 h-8">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
    </div>
  );
}
