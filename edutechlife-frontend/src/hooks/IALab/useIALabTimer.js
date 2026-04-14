import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook especializado para timer de evaluación en IALab
 * Sistema de tiempo con advertencias y control de progreso
 * 
 * @returns {Object} Funciones y estados para gestión de timer
 */
export const useIALabTimer = () => {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0); // en segundos
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const timerRef = useRef(null);

    // Configuración del timer
    const SUGGESTED_TIME_MINUTES = 20;
    const suggestedTime = SUGGESTED_TIME_MINUTES * 60; // en segundos
    const WARNING_THRESHOLD = 15 * 60; // 15 minutos en segundos

    // Iniciar timer
    const startTimer = useCallback(() => {
        if (!isTimerRunning) {
            setIsTimerRunning(true);
            timerRef.current = setInterval(() => {
                setTimeElapsed(prev => {
                    const newTime = prev + 1;
                    
                    // Mostrar advertencia después de 15 minutos
                    if (newTime >= WARNING_THRESHOLD && !showTimeWarning) {
                        setShowTimeWarning(true);
                    }
                    
                    return newTime;
                });
            }, 1000);
        }
    }, [isTimerRunning, showTimeWarning]);

    // Pausar timer
    const pauseTimer = useCallback(() => {
        if (isTimerRunning && timerRef.current) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
        }
    }, [isTimerRunning]);

    // Reiniciar timer
    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setIsTimerRunning(false);
        setTimeElapsed(0);
        setShowTimeWarning(false);
    }, []);

    // Formatear tiempo (segundos a MM:SS)
    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, []);

    // Obtener tiempo restante
    const getRemainingTime = useCallback(() => {
        return Math.max(suggestedTime - timeElapsed, 0);
    }, [suggestedTime, timeElapsed]);

    // Obtener porcentaje de tiempo transcurrido
    const getTimePercentage = useCallback(() => {
        return Math.min((timeElapsed / suggestedTime) * 100, 100);
    }, [suggestedTime, timeElapsed]);

    // Verificar si el tiempo se está agotando
    const isTimeRunningOut = useCallback(() => {
        return getRemainingTime() <= 300; // 5 minutos restantes
    }, [getRemainingTime]);

    // Obtener estado del tiempo
    const getTimeStatus = useCallback(() => {
        if (timeElapsed === 0) return 'not_started';
        if (timeElapsed < WARNING_THRESHOLD) return 'good';
        if (timeElapsed < suggestedTime) return 'warning';
        return 'critical';
    }, [timeElapsed, suggestedTime, WARNING_THRESHOLD]);

    // Obtener color según estado del tiempo
    const getTimeColor = useCallback(() => {
        const status = getTimeStatus();
        switch (status) {
            case 'good': return '#10B981'; // verde
            case 'warning': return '#F59E0B'; // ámbar
            case 'critical': return '#EF4444'; // rojo
            default: return '#6B7280'; // gris
        }
    }, [getTimeStatus]);

    // Obtener icono según estado del tiempo
    const getTimeIcon = useCallback(() => {
        const status = getTimeStatus();
        switch (status) {
            case 'good': return 'fa-clock';
            case 'warning': return 'fa-exclamation-triangle';
            case 'critical': return 'fa-hourglass-end';
            default: return 'fa-clock';
        }
    }, [getTimeStatus]);

    // Limpiar timer al desmontar
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return {
        // Estados
        isTimerRunning,
        timeElapsed,
        showTimeWarning,
        
        // Constantes
        SUGGESTED_TIME_MINUTES,
        suggestedTime,
        WARNING_THRESHOLD,
        
        // Funciones de control
        startTimer,
        pauseTimer,
        resetTimer,
        
        // Utilidades
        formatTime,
        getRemainingTime,
        getTimePercentage,
        isTimeRunningOut,
        getTimeStatus,
        getTimeColor,
        getTimeIcon,
        
        // Métodos adicionales
        setCustomTime: (minutes) => {
            resetTimer();
            // En una implementación real, esto establecería un tiempo personalizado
            console.log(`Timer personalizado establecido a ${minutes} minutos`);
        },
        
        addTime: (seconds) => {
            setTimeElapsed(prev => prev + seconds);
        },
        
        subtractTime: (seconds) => {
            setTimeElapsed(prev => Math.max(prev - seconds, 0));
        },
        
        // Estadísticas
        getTimeStats: () => ({
            elapsed: timeElapsed,
            remaining: getRemainingTime(),
            percentage: getTimePercentage(),
            status: getTimeStatus(),
            isRunning: isTimerRunning,
            suggestedTotal: suggestedTime
        })
    };
};

export default useIALabTimer;