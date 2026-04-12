import { useState, useEffect } from 'react';

/**
 * Hook para detectar la plataforma del usuario y aplicar optimizaciones específicas
 * @returns {Object} Objeto con flags de plataforma y funciones de optimización
 */
export const usePlatformDetection = () => {
    const [platform, setPlatform] = useState({
        isIOS: false,
        isAndroid: false,
        isTouchDevice: false,
        isHiDPI: false,
        isSafari: false,
        isChrome: false,
        isFirefox: false,
        isDesktop: false,
        isMobile: false,
        isTablet: false
    });

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Detección de plataforma
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isAndroid = /Android/.test(userAgent);
        const isHiDPI = window.devicePixelRatio >= 2;
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
        const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
        const isFirefox = /Firefox/.test(userAgent);
        
        // Detección de tipo de dispositivo
        const isMobile = /Mobi|Android/i.test(userAgent);
        const isTablet = /Tablet|iPad/i.test(userAgent);
        const isDesktop = !isMobile && !isTablet;

        setPlatform({
            isIOS,
            isAndroid,
            isTouchDevice: isTouch,
            isHiDPI,
            isSafari,
            isChrome,
            isFirefox,
            isDesktop,
            isMobile,
            isTablet
        });

        // Aplicar optimizaciones globales
        applyGlobalOptimizations(isIOS, isAndroid, isHiDPI, isSafari);
    }, []);

    return platform;
};

/**
 * Aplica optimizaciones globales específicas por plataforma
 */
const applyGlobalOptimizations = (isIOS, isAndroid, isHiDPI, isSafari) => {
    // Optimizaciones para iOS Safari
    if (isIOS) {
        document.documentElement.style.setProperty('--tap-highlight-color', 'rgba(0, 188, 212, 0.1)');
        document.documentElement.style.setProperty('--ios-scroll-behavior', 'smooth');
        
        // Mejorar rendimiento de animaciones en Safari
        if (isSafari) {
            document.documentElement.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        }
    }

    // Optimizaciones para Android Chrome
    if (isAndroid) {
        document.documentElement.style.setProperty('--scroll-behavior', 'smooth');
        
        // Prevenir zoom automático en inputs (solo en Android)
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            const content = metaViewport.getAttribute('content');
            if (!content.includes('maximum-scale')) {
                metaViewport.setAttribute('content', `${content}, maximum-scale=1.0, user-scalable=no`);
            }
        }
    }

    // Optimizaciones para pantallas HiDPI (Retina, 4K, etc.)
    if (isHiDPI) {
        document.documentElement.style.setProperty('--image-rendering', 'crisp-edges');
    }

    // Optimizaciones para navegadores WebKit (Safari, Chrome iOS)
    if (isIOS || isSafari) {
        document.documentElement.style.setProperty('--webkit-font-smoothing', 'subpixel-antialiased');
    }
};

/**
 * Hook para obtener estilos optimizados por plataforma
 * @returns {Object} Estilos inline optimizados para la plataforma actual
 */
export const usePlatformStyles = () => {
    const platform = usePlatformDetection();

    const getOptimizedStyles = (baseStyles = {}) => {
        const optimized = { ...baseStyles };

        // Optimizaciones para iOS
        if (platform.isIOS) {
            optimized.WebkitTapHighlightColor = 'rgba(0, 188, 212, 0.1)';
            optimized.WebkitOverflowScrolling = 'touch';
            
            // Sombras más suaves para iOS (mejor rendimiento)
            if (optimized.boxShadow) {
                optimized.WebkitBoxShadow = optimized.boxShadow.replace('0.05', '0.03');
            }
        }

        // Optimizaciones para Android
        if (platform.isAndroid) {
            optimized.touchAction = 'manipulation';
            
            // Prevenir selección de texto en botones (mejor UX táctil)
            optimized.WebkitUserSelect = 'none';
            optimized.MozUserSelect = 'none';
            optimized.msUserSelect = 'none';
            optimized.userSelect = 'none';
        }

        // Optimizaciones para dispositivos táctiles
        if (platform.isTouchDevice) {
            optimized.cursor = 'pointer';
            
            // Aumentar área táctil para elementos interactivos
            if (!optimized.minHeight) {
                optimized.minHeight = '44px'; // WCAG mínimo
            }
        }

        // Optimizaciones para HiDPI
        if (platform.isHiDPI) {
            optimized.imageRendering = 'crisp-edges';
        }

        return optimized;
    };

    return { getOptimizedStyles, platform };
};

/**
 * Hook para aplicar clases CSS optimizadas por plataforma
 * @returns {Function} Función que genera clases Tailwind optimizadas
 */
export const usePlatformClasses = () => {
    const platform = usePlatformDetection();

    const getOptimizedClasses = (baseClasses = '') => {
        let classes = baseClasses;

        // Clases específicas por plataforma
        if (platform.isIOS) {
            classes += ' ios-optimized';
        }
        if (platform.isAndroid) {
            classes += ' android-optimized';
        }
        if (platform.isTouchDevice) {
            classes += ' touch-optimized';
        }
        if (platform.isHiDPI) {
            classes += ' hidpi-optimized';
        }
        if (platform.isDesktop) {
            classes += ' desktop-optimized';
        }
        if (platform.isMobile) {
            classes += ' mobile-optimized';
        }
        if (platform.isTablet) {
            classes += ' tablet-optimized';
        }

        return classes.trim();
    };

    return { getOptimizedClasses, platform };
};