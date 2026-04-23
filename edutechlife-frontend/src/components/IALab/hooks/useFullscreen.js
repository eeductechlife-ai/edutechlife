/**
 * HOOK: useFullscreen
 * 
 * Hook personalizado para manejar pantalla completa de elementos DOM
 * Compatible con todos los navegadores modernos
 * 
 * Características:
 * - Soporte para múltiples APIs de pantalla completa
 * - Detección automática de compatibilidad
 * - Event listeners para cambios de estado
 * - Cleanup automático
 */

import { useState, useEffect, useCallback } from 'react';

const useFullscreen = (elementRef) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Verificar si el navegador soporta Fullscreen API
  const isFullscreenSupported = () => {
    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  };

  // Obtener el elemento actual en pantalla completa
  const getFullscreenElement = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  // Solicitar pantalla completa
  const requestFullscreen = useCallback(() => {
    const element = elementRef?.current;
    if (!element || !isFullscreenSupported()) return false;

    try {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else {
        console.warn('Fullscreen API no soportada en este navegador');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error al solicitar pantalla completa:', error);
      return false;
    }
  }, [elementRef]);

  // Salir de pantalla completa
  const exitFullscreen = useCallback(() => {
    if (!isFullscreenSupported()) return false;

    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else {
        console.warn('Fullscreen API no soportada en este navegador');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error al salir de pantalla completa:', error);
      return false;
    }
  }, []);

  // Alternar entre pantalla completa y normal
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  }, [isFullscreen, requestFullscreen, exitFullscreen]);

  // Manejar cambios en el estado de pantalla completa
  const handleFullscreenChange = useCallback(() => {
    const fullscreenElement = getFullscreenElement();
    setIsFullscreen(!!fullscreenElement);
  }, []);

  // Configurar event listeners
  useEffect(() => {
    if (!isFullscreenSupported()) {
      console.warn('Fullscreen no soportado en este navegador');
      return;
    }

    // Agregar listeners para todos los prefijos de navegador
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [handleFullscreenChange]);

  return {
    isFullscreen,
    isSupported: isFullscreenSupported(),
    requestFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};

export default useFullscreen;