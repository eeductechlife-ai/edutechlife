import { useEffect, useCallback } from 'react';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabQuiz } from './useIALabQuiz';

/**
 * HOOK: useIALabSecurity
 * 
 * Responsabilidad: Sistema de seguridad avanzado para evaluación
 * - Detección de cambios de ventana/pestaña
 * - Protección anti-capturas (PrintScreen, F12)
 * - Bloqueo de teclado (Ctrl+C, Ctrl+V, etc.)
 * - Menú contextual deshabilitado
 * - Timer de seguridad
 * - Overlay anti-capturas
 */

export const useIALabSecurity = () => {
  const {
    showExamModal,
    setShowExamModal,
    securityWarningCount,
    setSecurityWarningCount,
    screenshotProtectionActive,
    setScreenshotProtectionActive,
    keyboardLockActive,
    setKeyboardLockActive,
    showSecurityWarning,
    setShowSecurityWarning,
    showScoreResult,
    setShowScoreResult,
    loadMsg,
    setLoadMsg,
    timeElapsed,
    setTimeElapsed,
    isTimerRunning,
    setIsTimerRunning,
    attemptsPenalized,
    setAttemptsPenalized,
    securityViolations,
    setSecurityViolations
  } = useIALabContext();
  
  const {
    MAX_SECURITY_WARNINGS,
    SECURITY_WARNING_MESSAGES,
    SECURITY_VIOLATION_PENALTY,
    SCREENSHOT_OVERLAY_DURATION,
    SECURITY_MESSAGE_DURATION,
    SECURITY_LOG_PREFIX,
    penalizeAttempt,
    closeEvaluationModal,
    SECURITY_LOGGER,
    showSecurityMessageTemporary
  } = useIALabQuiz();
  
  // ==================== DETECCIÓN DE CAMBIOS DE VENTANA ====================
  
  const setupWindowChangeDetection = useCallback(() => {
    if (!showExamModal || showScoreResult) return () => {};
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Usuario cambió de pestaña/ventana
        setSecurityWarningCount(prev => {
          const newCount = prev + 1;
          setShowSecurityWarning(true);
          
          // Registrar violación de seguridad
          SECURITY_LOGGER.logViolation('WINDOW_CHANGE', {
            warningCount: newCount,
            maxWarnings: MAX_SECURITY_WARNINGS
          });
          
          if (newCount >= MAX_SECURITY_WARNINGS) {
            // Aplicar penalización por 3 infracciones
            setTimeout(() => {
              penalizeAttempt();
              closeEvaluationModal(true);
              setLoadMsg("Examen cerrado por 3 infracciones de seguridad. Has perdido 1 intento.");
              setTimeout(() => setLoadMsg(''), 3000);
            }, 1000);
          }
          
          return newCount;
        });
        
        // Pausar timer durante la advertencia
        setIsTimerRunning(false);
      }
    };
    
    const handleBlur = () => {
      // Solo activar si el usuario hizo clic fuera del navegador
      // (no cuando cambia entre pestañas del mismo navegador)
      setTimeout(() => {
        if (!document.hidden) {
          setSecurityWarningCount(prev => {
            const newCount = prev + 1;
            setShowSecurityWarning(true);
            
            // Registrar violación de seguridad
            SECURITY_LOGGER.logViolation('WINDOW_BLUR', {
              warningCount: newCount,
              maxWarnings: MAX_SECURITY_WARNINGS
            });
            
            return newCount;
          });
          setIsTimerRunning(false);
        }
      }, 100);
    };
    
    // Agregar event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    
    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [
    showExamModal, showScoreResult, setSecurityWarningCount, setShowSecurityWarning,
    setIsTimerRunning, penalizeAttempt, closeEvaluationModal, setLoadMsg,
    SECURITY_LOGGER, MAX_SECURITY_WARNINGS
  ]);
  
  // ==================== PROTECCIÓN ANTI-COPIAS (KEYBOARD LOCK) ====================
  
  const setupKeyboardProtection = useCallback(() => {
    if (!showExamModal || showScoreResult) return () => {};
    
    const handleKeyDown = (event) => {
      // Bloquear combinaciones de teclas peligrosas
      const blockedCombinations = [
        { key: 'c', ctrl: true }, // Ctrl+C (copiar)
        { key: 'v', ctrl: true }, // Ctrl+V (pegar)
        { key: 'p', ctrl: true }, // Ctrl+P (imprimir)
        { key: 'u', ctrl: true }, // Ctrl+U (ver código fuente)
        { key: 's', ctrl: true }, // Ctrl+S (guardar)
        { key: 'a', ctrl: true }, // Ctrl+A (seleccionar todo)
        { key: 'F12', ctrl: false }, // F12 (herramientas de desarrollo)
        { key: 'PrintScreen', ctrl: false }, // PrintScreen (captura)
        { key: 'F11', ctrl: false }, // F11 (pantalla completa)
        { key: 'Escape', ctrl: false } // Escape (podría intentar salir)
      ];
      
      const isBlocked = blockedCombinations.some(combo => {
        if (combo.ctrl) {
          return event.ctrlKey && event.key.toLowerCase() === combo.key.toLowerCase();
        } else {
          return event.key === combo.key;
        }
      });
      
      if (isBlocked) {
        event.preventDefault();
        event.stopPropagation();
        
        // Registrar violación
        SECURITY_LOGGER.logViolation('KEYBOARD_SHORTCUT_ATTEMPT', {
          key: event.key,
          ctrlKey: event.ctrlKey,
          altKey: event.altKey,
          shiftKey: event.shiftKey
        });
        
        // Mostrar mensaje
        showSecurityMessageTemporary(`Acción bloqueada: ${event.ctrlKey ? 'Ctrl+' : ''}${event.key}`);
        
        // Incrementar contador de advertencias si es PrintScreen o F12
        if (event.key === 'PrintScreen' || event.key === 'F12') {
          setSecurityWarningCount(prev => {
            const newCount = prev + 1;
            
            if (newCount >= MAX_SECURITY_WARNINGS) {
              setTimeout(() => {
                penalizeAttempt();
                closeEvaluationModal(true);
                setLoadMsg("Examen cerrado por intentos de captura/herramientas de desarrollo");
                setTimeout(() => setLoadMsg(''), 3000);
              }, 1000);
            }
            
            return newCount;
          });
        }
        
        return false;
      }
    };
    
    // Bloquear menú contextual (clic derecho)
    const handleContextMenu = (event) => {
      event.preventDefault();
      
      // Registrar violación
      SECURITY_LOGGER.logViolation('CONTEXT_MENU_ATTEMPT', {
        x: event.clientX,
        y: event.clientY
      });
      
      showSecurityMessageTemporary('Menú contextual deshabilitado durante el examen');
      
      // Incrementar contador de advertencias
      setSecurityWarningCount(prev => {
        const newCount = prev + 1;
        
        if (newCount >= MAX_SECURITY_WARNINGS) {
          setTimeout(() => {
            penalizeAttempt();
            closeEvaluationModal(true);
            setLoadMsg("Examen cerrado por intentos de acceso al menú contextual");
            setTimeout(() => setLoadMsg(''), 3000);
          }, 1000);
        }
        
        return newCount;
      });
    };
    
    // Agregar event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Activar bloqueo de teclado
    setKeyboardLockActive(true);
    
    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      setKeyboardLockActive(false);
    };
  }, [
    showExamModal, showScoreResult, setSecurityWarningCount, setKeyboardLockActive,
    penalizeAttempt, closeEvaluationModal, setLoadMsg, SECURITY_LOGGER,
    showSecurityMessageTemporary, MAX_SECURITY_WARNINGS
  ]);
  
  // ==================== DETECCIÓN DE CAPTURAS DE PANTALLA ====================
  
  const setupScreenshotProtection = useCallback(() => {
    if (!showExamModal || showScoreResult) return () => {};
    
    // Detectar intentos de captura mediante eventos de teclado (ya manejado en keyboard protection)
    // y mediante la API de captura de pantalla (si está disponible)
    
    const handleBeforeUnload = (event) => {
      // Prevenir cierre de ventana durante examen
      if (showExamModal && !showScoreResult) {
        event.preventDefault();
        event.returnValue = '¿Estás seguro de que quieres salir? Perderás todo el progreso del examen.';
        
        // Registrar violación
        SECURITY_LOGGER.logViolation('WINDOW_CLOSE_ATTEMPT', {
          timestamp: new Date().toISOString()
        });
        
        return event.returnValue;
      }
    };
    
    // Agregar event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showExamModal, showScoreResult, SECURITY_LOGGER]);
  
  // ==================== OVERLAY ANTI-CAPTURAS ====================
  
  const activateScreenshotOverlay = useCallback(() => {
    if (!showExamModal || showScoreResult) return;
    
    // Activar overlay
    setScreenshotProtectionActive(true);
    
    // Registrar violación
    SECURITY_LOGGER.logViolation('SCREENSHOT_OVERLAY_ACTIVATED', {
      timestamp: new Date().toISOString(),
      duration: SCREENSHOT_OVERLAY_DURATION
    });
    
    // Desactivar después de la duración configurada
    setTimeout(() => {
      setScreenshotProtectionActive(false);
    }, SCREENSHOT_OVERLAY_DURATION);
  }, [showExamModal, showScoreResult, setScreenshotProtectionActive, SECURITY_LOGGER, SCREENSHOT_OVERLAY_DURATION]);
  
  // ==================== TIMER DE SEGURIDAD ====================
  
  const setupSecurityTimer = useCallback(() => {
    if (!showExamModal || showScoreResult) return () => {};
    
    let interval;
    
    if (isTimerRunning && timeElapsed < (20 * 60)) { // 20 minutos máximo
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Mostrar advertencia a los 15 minutos
          if (newTime === 15 * 60) {
            showSecurityMessageTemporary('Llevas 15 minutos. Considera revisar tus respuestas.');
          }
          
          // Si se excede el tiempo (20 minutos + 5 de gracia)
          if (newTime >= (20 * 60 + 300)) {
            // Cerrar examen automáticamente
            closeEvaluationModal(true);
            showSecurityMessageTemporary('Tiempo agotado. El examen se ha cerrado automáticamente.');
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    showExamModal, showScoreResult, isTimerRunning, timeElapsed,
    setTimeElapsed, showSecurityMessageTemporary, closeEvaluationModal
  ]);
  
  // ==================== RESET DIARIO DE ADVERTENCIAS ====================
  
  const setupDailyWarningReset = useCallback(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('securityWarningsResetDate');
    
    if (lastReset !== today) {
      // Es un nuevo día, resetear contador
      setSecurityWarningCount(0);
      localStorage.setItem('securityWarningsResetDate', today);
    }
  }, [setSecurityWarningCount]);
  
  // ==================== CLEANUP DE LOGS ANTIGUOS ====================
  
  const cleanupOldSecurityLogs = useCallback(() => {
    SECURITY_LOGGER.clearOldLogs();
  }, [SECURITY_LOGGER]);
  
  // ==================== EFFECTS PRINCIPALES ====================
  
  // Configurar todas las protecciones cuando se abre el modal de examen
  useEffect(() => {
    if (!showExamModal || showScoreResult) return;
    
    // Configurar detección de cambios de ventana
    const cleanupWindowDetection = setupWindowChangeDetection();
    
    // Configurar protección de teclado
    const cleanupKeyboardProtection = setupKeyboardProtection();
    
    // Configurar protección anti-capturas
    const cleanupScreenshotProtection = setupScreenshotProtection();
    
    // Configurar timer de seguridad
    const cleanupSecurityTimer = setupSecurityTimer();
    
    // Resetear advertencias diarias
    setupDailyWarningReset();
    
    // Cleanup logs antiguos (solo una vez al montar)
    cleanupOldSecurityLogs();
    
    // Cleanup combinado
    return () => {
      cleanupWindowDetection();
      cleanupKeyboardProtection();
      cleanupScreenshotProtection();
      cleanupSecurityTimer();
    };
  }, [
    showExamModal, showScoreResult,
    setupWindowChangeDetection, setupKeyboardProtection,
    setupScreenshotProtection, setupSecurityTimer,
    setupDailyWarningReset, cleanupOldSecurityLogs
  ]);
  
  // ==================== FUNCIONES PÚBLICAS ====================
  
  // Obtener mensaje de advertencia actual
  const getCurrentWarningMessage = useCallback(() => {
    if (securityWarningCount === 0) return '';
    const index = Math.min(securityWarningCount - 1, MAX_SECURITY_WARNINGS - 1);
    return SECURITY_WARNING_MESSAGES[index];
  }, [securityWarningCount, MAX_SECURITY_WARNINGS, SECURITY_WARNING_MESSAGES]);
  
  // Verificar si se debe mostrar overlay anti-capturas
  const shouldShowScreenshotOverlay = useCallback(() => {
    return screenshotProtectionActive && showExamModal;
  }, [screenshotProtectionActive, showExamModal]);
  
  // Verificar si se debe mostrar advertencia de seguridad
  const shouldShowSecurityWarning = useCallback(() => {
    return showSecurityWarning && showExamModal && !showScoreResult;
  }, [showSecurityWarning, showExamModal, showScoreResult]);
  
  // Obtener estadísticas de seguridad
  const getSecurityStats = useCallback(() => {
    return {
      warningCount: securityWarningCount,
      maxWarnings: MAX_SECURITY_WARNINGS,
      violations: securityViolations,
      attemptsPenalized: attemptsPenalized,
      isProtected: keyboardLockActive,
      hasOverlay: screenshotProtectionActive
    };
  }, [
    securityWarningCount, MAX_SECURITY_WARNINGS, securityViolations,
    attemptsPenalized, keyboardLockActive, screenshotProtectionActive
  ]);
  
  // ==================== RETURN ====================
  
  return {
    // Estados (solo lectura)
    securityWarningCount,
    screenshotProtectionActive,
    keyboardLockActive,
    showSecurityWarning,
    securityViolations,
    attemptsPenalized,
    
    // Funciones de seguridad
    activateScreenshotOverlay,
    getCurrentWarningMessage,
    shouldShowScreenshotOverlay,
    shouldShowSecurityWarning,
    getSecurityStats,
    
    // Funciones del logger (para componentes que las necesiten)
    SECURITY_LOGGER,
    showSecurityMessageTemporary,
    
    // Constantes
    MAX_SECURITY_WARNINGS,
    SECURITY_WARNING_MESSAGES,
    SECURITY_VIOLATION_PENALTY,
    SCREENSHOT_OVERLAY_DURATION,
    SECURITY_MESSAGE_DURATION,
  };
};