import React from 'react';
import { usePlatformStyles } from '../hooks/usePlatformDetection';

/**
 * Componente wrapper que aplica optimizaciones específicas por plataforma
 * Ideal para tarjetas, contenedores y elementos interactivos que necesitan
 * comportamientos diferentes en iOS, Android, Desktop, etc.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del componente
 * @param {string} props.className - Clases CSS adicionales
 * @param {Object} props.style - Estilos inline adicionales
 * @param {boolean} props.withShadow - Si debe aplicar sombras optimizadas
 * @param {boolean} props.withTouchOptimization - Si debe optimizar para touch
 * @param {boolean} props.withHiDPIOptimization - Si debe optimizar para HiDPI
 * @param {string} props.shadowIntensity - Intensidad de sombra (light, medium, heavy)
 * @param {Function} props.onClick - Handler de click/touch
 * @param {Object} props.rest - Props adicionales
 */
const PlatformOptimizedCard = ({
    children,
    className = '',
    style = {},
    withShadow = true,
    withTouchOptimization = true,
    withHiDPIOptimization = true,
    shadowIntensity = 'medium',
    onClick,
    ...rest
}) => {
    const { getOptimizedStyles, platform } = usePlatformStyles();

    // Determinar sombra basada en plataforma e intensidad
    const getPlatformShadow = () => {
        if (!withShadow) return {};
        
        const shadows = {
            light: {
                ios: '0 20px 40px rgba(0, 0, 0, 0.03)',
                android: '0 20px 40px rgba(0, 0, 0, 0.05)',
                desktop: '0 20px 40px rgba(0, 0, 0, 0.06)'
            },
            medium: {
                ios: '0 30px 60px rgba(0, 0, 0, 0.03)',
                android: '0 30px 60px rgba(0, 0, 0, 0.05)',
                desktop: '0 30px 60px rgba(0, 0, 0, 0.08)'
            },
            heavy: {
                ios: '0 40px 80px rgba(0, 0, 0, 0.04)',
                android: '0 40px 80px rgba(0, 0, 0, 0.06)',
                desktop: '0 40px 80px rgba(0, 0, 0, 0.12)'
            }
        };

        const shadowConfig = shadows[shadowIntensity] || shadows.medium;
        
        if (platform.isIOS) {
            return {
                WebkitBoxShadow: shadowConfig.ios,
                boxShadow: shadowConfig.ios
            };
        } else if (platform.isAndroid) {
            return { boxShadow: shadowConfig.android };
        } else {
            return { boxShadow: shadowConfig.desktop };
        }
    };

    // Estilos base del componente
    const baseStyles = {
        transition: 'all 0.3s ease-out',
        ...getPlatformShadow(),
        ...style
    };

    // Aplicar optimizaciones por plataforma
    const optimizedStyles = getOptimizedStyles(baseStyles);

    // Clases base optimizadas
    const baseClasses = `
        relative
        bg-gradient-to-br from-white to-[#F8FAFC]
        border border-slate-50
        rounded-[28px]
        overflow-hidden
        ${withTouchOptimization ? 'touch-manipulation' : ''}
        ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // Handler de click con optimizaciones para touch
    const handleClick = (e) => {
        if (!onClick) return;
        
        // Optimización para dispositivos táctiles
        if (platform.isTouchDevice) {
            // Prevenir double-tap zoom en iOS
            e.preventDefault();
            
            // Feedback táctil
            const element = e.currentTarget;
            element.classList.add('active:scale-[0.97]');
            
            setTimeout(() => {
                element.classList.remove('active:scale-[0.97]');
            }, 150);
        }
        
        onClick(e);
    };

    return (
        <div
            className={baseClasses}
            style={optimizedStyles}
            onClick={handleClick}
            role={onClick ? 'button' : 'region'}
            tabIndex={onClick ? 0 : -1}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick(e);
                }
            }}
            aria-label={rest['aria-label'] || (onClick ? 'Elemento interactivo optimizado' : 'Contenedor optimizado')}
            {...rest}
        >
            {/* Overlay para HiDPI optimization */}
            {withHiDPIOptimization && platform.isHiDPI && (
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom right, transparent 50%, rgba(255, 255, 255, 0.02) 100%)',
                        mixBlendMode: 'overlay'
                    }}
                />
            )}
            
            {/* Contenido */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Efecto de borde para dispositivos táctiles */}
            {withTouchOptimization && platform.isTouchDevice && (
                <div 
                    className="absolute inset-0 pointer-events-none border-2 border-transparent rounded-[28px]"
                    style={{
                        borderColor: 'rgba(0, 188, 212, 0.1)',
                        transition: 'border-color 0.2s ease'
                    }}
                />
            )}
        </div>
    );
};

/**
 * Variante premium del PlatformOptimizedCard con gradiente corporativo
 */
export const PremiumPlatformCard = ({ children, ...props }) => {
    return (
        <PlatformOptimizedCard
            {...props}
            className={`
                bg-gradient-to-br from-[#00374A]/5 via-white to-[#00BCD4]/5
                border border-[#00BCD4]/20
                ${props.className || ''}
            `.trim()}
            shadowIntensity="heavy"
            withHiDPIOptimization={true}
        >
            {children}
        </PlatformOptimizedCard>
    );
};

/**
 * Variante para elementos interactivos (botones, cards clickeables)
 */
export const InteractivePlatformCard = ({ children, ...props }) => {
    return (
        <PlatformOptimizedCard
            {...props}
            withTouchOptimization={true}
            className={`
                hover:shadow-xl
                active:shadow-lg
                transition-all duration-300
                ${props.className || ''}
            `.trim()}
        >
            {children}
        </PlatformOptimizedCard>
    );
};

/**
 * Variante minimalista para contenido estático
 */
export const MinimalPlatformCard = ({ children, ...props }) => {
    return (
        <PlatformOptimizedCard
            {...props}
            withShadow={false}
            withTouchOptimization={false}
            className={`
                bg-white
                border border-slate-100
                rounded-2xl
                ${props.className || ''}
            `.trim()}
        >
            {children}
        </PlatformOptimizedCard>
    );
};

export default PlatformOptimizedCard;