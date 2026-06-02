import { useState, useEffect } from 'react';

/**
 * @typedef {Object} DeviceInfo
 * @property {boolean} isMobile
 * @property {boolean} isTablet
 * @property {boolean} isDesktop
 */

/**
 * Hook que detecta el tipo de dispositivo vía matchMedia.
 * @returns {DeviceInfo}
 */
export function useDeviceType() {
  const [device, setDevice] = useState(() => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true };
    const w = window.innerWidth;
    return {
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isDesktop: w >= 1024,
    };
  });

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const mqTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const handler = () => {
      const w = window.innerWidth;
      setDevice({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isDesktop: w >= 1024,
      });
    };
    mqMobile.addEventListener('change', handler);
    mqTablet.addEventListener('change', handler);
    return () => {
      mqMobile.removeEventListener('change', handler);
      mqTablet.removeEventListener('change', handler);
    };
  }, []);

  return device;
}
