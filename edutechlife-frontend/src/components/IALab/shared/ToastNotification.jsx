import { useEffect } from 'react';

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
      {toast.message}
    </div>
  );
};

ToastNotification.displayName = 'ToastNotification';

export default ToastNotification;
export { ToastNotification };
