import React from 'react';
import useConnectivity from '../../hooks/useConnectivity';

const OfflineBanner = () => {
  const isOnline = useConnectivity();

  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg safe-area-top"
      role="alert"
      aria-live="assertive"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
      </svg>
      <span>Sin conexión. Los cambios se guardarán cuando tengas internet.</span>
    </div>
  );
};

export default OfflineBanner;
