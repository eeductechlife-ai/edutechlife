import { useEffect } from 'react';
import PropTypes from 'prop-types';

const toastShape = PropTypes.shape({
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
});

const ToastNotification = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onDismiss?.(), 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg border text-sm font-medium ialab-animate-fade-in max-w-md ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
          toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
          'bg-blue-50 border-blue-200 text-blue-700'
        }`}
        role="status"
        aria-live="polite"
      >
        <span className="flex-1">{toast.message}</span>
        <button onClick={onDismiss} className="ml-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors" aria-label="Dismiss">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
  );
};

ToastNotification.propTypes = {
  toast: toastShape,
  onDismiss: PropTypes.func,
};

ToastNotification.displayName = 'ToastNotification';

export default ToastNotification;
export { ToastNotification };
