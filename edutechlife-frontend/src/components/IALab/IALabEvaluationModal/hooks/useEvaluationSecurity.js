import { useState, useEffect, useCallback } from 'react';

export function useEvaluationSecurity({ isOpen, isVisible, isActive, onMaxViolations }) {
  const [securityWarning, setSecurityWarning] = useState('');
  const [securityAlert, setSecurityAlert] = useState(null);
  const [printWarning, setPrintWarning] = useState(null);
  const [securityViolations, setSecurityViolations] = useState(0);
  const MAX_SECURITY_VIOLATIONS = 3;

  useEffect(() => {
    if (isOpen) {
      setSecurityViolations(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible || !isActive) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSecurityViolations(prev => {
          const newCount = prev + 1;
          if (newCount >= MAX_SECURITY_VIOLATIONS) {
            setSecurityAlert({
              message: 'Has cambiado de ventana demasiadas veces', level: 3,
              onClose: () => { setSecurityAlert(null); onMaxViolations?.(); },
            });
          } else {
            setSecurityWarning(`Advertencia ${newCount}/${MAX_SECURITY_VIOLATIONS}: No cambies de ventana`);
            setTimeout(() => setSecurityWarning(''), 3000);
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isVisible, isActive, onMaxViolations]);

  useEffect(() => {
    if (!isVisible || !isActive) return;
    const handleKeyDown = (e) => {
      if (e.shiftKey) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isActive]);

  useEffect(() => {
    if (!isVisible || !isActive) return;
    const handleBeforePrint = () => {
      setPrintWarning('No se permite imprimir durante la evaluación');
      setSecurityViolations(prev => prev + 1);
      setTimeout(() => setPrintWarning(null), 4000);
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, [isVisible, isActive]);

  const handleSecurityEvent = useCallback((e) => {
    e.preventDefault();
    setSecurityViolations(prev => {
      const newCount = prev + 1;
      if (newCount >= MAX_SECURITY_VIOLATIONS) {
        setSecurityAlert({
          message: 'Límite de infracciones alcanzado', level: 3,
          onClose: () => { setSecurityAlert(null); onMaxViolations?.(); },
        });
      } else {
        setSecurityWarning(`Infracción ${newCount}/${MAX_SECURITY_VIOLATIONS}: Escribe tu propia respuesta`);
        setTimeout(() => setSecurityWarning(''), 3000);
      }
      return newCount;
    });
  }, [onMaxViolations]);

  return {
    securityWarning, setSecurityWarning,
    securityAlert, setSecurityAlert,
    printWarning, setPrintWarning,
    securityViolations, setSecurityViolations,
    handleSecurityEvent,
  };
}
