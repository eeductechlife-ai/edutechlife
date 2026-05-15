import { useEffect, useCallback, useState, useRef } from 'react';

const useScreenshotProtection = (isActive, { onViolation, onMaxViolations, maxViolations = 3 } = {}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const devToolsCheckRef = useRef(null);

  const handleViolation = useCallback((type) => {
    if (!isActive) return;
    setViolationCount((prev) => {
      const next = prev + 1;
      if (onViolation) onViolation(type, next);
      if (next >= maxViolations && onMaxViolations) onMaxViolations();
      return next;
    });
  }, [isActive, onViolation, onMaxViolations, maxViolations]);

  // Bloquear teclas de captura: PrintScreen, Cmd+Shift+3/4/5, Win+Shift+S
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        handleViolation('printscreen');
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 's'].includes(e.key)) {
        e.preventDefault();
        handleViolation('screenshot_shortcut');
        return;
      }
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        handleViolation('devtools_shortcut');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleViolation]);

  // Detectar pérdida de foco (blur) + mostrar overlay
  useEffect(() => {
    if (!isActive) return;
    const handleBlur = () => setShowOverlay(true);
    const handleFocus = () => setShowOverlay(false);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isActive, handleViolation]);

  // Detectar DevTools abiertos (detección por tamaño de ventana)
  useEffect(() => {
    if (!isActive) return;
    const checkDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > threshold || heightDiff > threshold) {
        handleViolation('devtools_open');
      }
    };
    devToolsCheckRef.current = setInterval(checkDevTools, 2000);
    return () => clearInterval(devToolsCheckRef.current);
  }, [isActive, handleViolation]);

  return { showOverlay, setShowOverlay, violationCount };
};

export default useScreenshotProtection;
