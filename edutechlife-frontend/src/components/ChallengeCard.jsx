import React from 'react';
import { Icon } from '../utils/iconMapping.jsx';
import PlatformOptimizedCard from './PlatformOptimizedCard';
import { usePlatformDetection } from '../hooks/usePlatformDetection';

/**
 * Componente premium reutilizable para mostrar desafíos del curso
 * Con diseño SaaS premium, optimizaciones por plataforma y estados dinámicos
 * Soporta modo dark/light automático usando sistema de colores de tailwind.config.js
 * Sistema de puntuación: 0-100% con aprobación al 70%
 * 
 * @param {Object} props
 * @param {string} props.title - Título del desafío (default: "Desafío del Curso")
 * @param {string} props.description - Descripción breve (default: "Aplica lo aprendido en un reto práctico")
 * @param {string} props.challengeText - Texto del desafío (puede incluir HTML/markdown simple)
 * @param {string} props.estimatedTime - Tiempo estimado (default: "45 min")
 * @param {number} props.score - Puntuación del desafío (0-100%)
 * @param {boolean} props.isLoading - Estado de carga (muestra skeleton)
 * @param {boolean} props.isCompleted - Si el desafío ya fue completado
 * @param {boolean} props.isStarting - Si el desafío está iniciándose (muestra spinner)
 * @param {boolean} props.isDisabled - Si los botones están deshabilitados
 * @param {Function} props.onStartChallenge - Handler para iniciar desafío
 * @param {Function} props.onViewSolution - Handler para ver solución
 * @param {Function} props.onReviewCompleted - Handler para revisar desafío completado
 * @param {Function} props.onRetryChallenge - Handler para reintentar desafío
 * @param {string} props.className - Clases CSS adicionales
 * @param {Object} props.style - Estilos inline adicionales
 */
const ChallengeCard = ({
    title = "Desafío del Curso",
    description = "Aplica lo aprendido en un reto práctico",
    challengeText = "Crea un prompt para resolver un problema complejo de tu industria.",
    estimatedTime = "45 min",
    score = 0,
    isLoading = false,
    isCompleted = false,
    isStarting = false,
    isDisabled = false,
    onStartChallenge,
    onViewSolution,
    onReviewCompleted,
    onRetryChallenge,
    className = '',
    style = {},
    ...rest
}) => {
    const { isIOS } = usePlatformDetection();

    // Sistema de clases de botones premium con colores corporativos usando tokens de tailwind.config.js
    const buttonClasses = {
        // Botón Desafío Premium (Gradiente corporativo petroleum → corporate)
        challenge: "bg-gradient-to-r from-petroleum to-corporate text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(0,75,99,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-semibold flex items-center justify-center gap-3 focus:outline-none focus:ring-3 focus:ring-corporate/50 focus:ring-offset-4 min-h-[60px] touch-manipulation text-base tracking-tight",
        
        // Botón Secundario Premium (Borde corporativo turquesa usando tokens corporate)
        secondary: "border-3 border-corporate text-petroleum px-8 py-4 rounded-2xl hover:bg-corporate/8 hover:border-corporate/80 hover:shadow-[0_0_20px_rgba(0,188,212,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-semibold flex items-center justify-center gap-3 focus:outline-none focus:ring-3 focus:ring-corporate/50 focus:ring-offset-4 min-h-[60px] touch-manipulation text-base tracking-tight",
        
        // Botón Completado Premium (Gradiente éxito premium usando tokens success)
        completed: "bg-gradient-to-r from-success to-emerald-400 text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-semibold flex items-center justify-center gap-3 focus:outline-none focus:ring-3 focus:ring-success/50 focus:ring-offset-4 min-h-[60px] touch-manipulation text-base tracking-tight"
    };

    // Handler para touch optimizado
    const handleTouchOptimization = (e) => {
        e.currentTarget.classList.add('active:scale-[0.95]');
        setTimeout(() => {
            e.currentTarget.classList.remove('active:scale-[0.95]');
        }, 150);
    };

    // Handler para teclado (accesibilidad)
    const handleKeyDown = (e, handler) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (handler && !isDisabled && !isStarting) {
                handler(e);
            }
        }
    };

    // Lógica de puntuación
    const isApproved = score >= 70;
    const scoreColor = isApproved ? 'text-success' : 'text-warning';
    const scoreBgColor = isApproved ? 'bg-success/10' : 'bg-warning/10';
    const scoreText = isApproved ? 'Aprobado' : 'Reprobado';

    // Render skeleton loading premium
    const renderSkeleton = () => (
        <div className="animate-pulse space-y-8">
            {/* Header skeleton premium */}
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg w-2/3"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/2"></div>
                </div>
            </div>
            
            {/* Challenge text skeleton premium */}
            <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-full"></div>
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-5/6"></div>
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-4/6"></div>
            </div>
            
            {/* Time skeleton premium */}
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full"></div>
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/4"></div>
            </div>
            
            {/* Buttons skeleton premium */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6">
                <div className="h-[60px] bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex-1"></div>
                <div className="h-[60px] bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex-1"></div>
            </div>
        </div>
    );

    // Render contenido principal PREMIUM
    const renderContent = () => (
        <>
             {/* HEADER PREMIUM CON TIPOGRAFÍA JERÁRQUICA */}
             <div className="flex items-center gap-6 mb-6">
                <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                    shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                     ${isCompleted 
                        ? 'bg-gradient-to-br from-success via-emerald-400 to-success shadow-[0_8px_32px_rgba(16,185,129,0.25)]' 
                        : 'bg-gradient-to-br from-primary-light via-corporate to-primary-light shadow-[0_8px_32px_rgba(0,188,212,0.25)]'
                    }
                `}>
                     <Icon 
                        name={isCompleted ? "fa-trophy" : "fa-bolt"} 
                        className="text-white text-xl" 
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-primary dark:text-white font-display">
                             {isCompleted ? '🎉 Desafío Completado' : title}
                         </h3>
                         {isCompleted && (
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 ${scoreBgColor} ${scoreColor} text-sm font-semibold rounded-full`}>
                                    {score}% - {scoreText}
                                </span>
                                {isApproved && (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                                        Éxito
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                      <p className="text-sm text-text-sub dark:text-slate-300 font-medium leading-relaxed">
                        {isCompleted 
                            ? `¡Felicidades! Has completado el desafío con una puntuación de ${score}%${isApproved ? ' (Aprobado)' : ' (Necesitas al menos 70% para aprobar)'}.` 
                            : description
                        }
                    </p>
                </div>
            </div>
            
            {/* CONTENEDOR DEL DESAFÍO PREMIUM - GLASSMORPHISM */}
             <div 
                className={`
                    rounded-2xl p-6 mb-6 
                    backdrop-blur-sm
                    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                     dark:shadow-[0_20px_60px_rgba(0,188,212,0.12)]
                    border border-white/50 dark:border-slate-700/50
                      ${isCompleted 
                        ? 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/60 dark:from-emerald-900/30 dark:via-slate-800 dark:to-emerald-900/20' 
                        : 'bg-gradient-to-br from-soft-blue/20 via-white to-mint/20 dark:from-petroleum/10 dark:via-slate-800 dark:to-corporate/10'
                    }
                    relative overflow-hidden
                `}
                style={{
                    ...(isIOS && {
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        backdropFilter: 'blur(20px) saturate(180%)'
                    })
                }}
            >
                {/* Efecto de brillo sutil */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/30 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                
                {/* Contenido del desafío */}
                <div className="relative z-10">
                    {/* Badge de estado */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isCompleted ? 'bg-emerald-100' : 'bg-corporate/20'}`}>
                            <Icon 
                                name={isCompleted ? "fa-check-circle" : "fa-hourglass-half"} 
                                className={isCompleted ? "text-emerald-600" : "text-corporate"} 
                            />
                            <span className={`text-sm font-semibold ${isCompleted ? 'text-emerald-800' : 'text-corporate'}`}>
                                {isCompleted ? 'Completado' : `⏱️ ${estimatedTime}`}
                            </span>
                        </div>
                        <div className="text-sm text-text-light dark:text-slate-400">
                            {isCompleted ? '✅ Verificado' : '🔄 En progreso'}
                        </div>
                    </div>
                    
                     {/* Texto del desafío con tipografía premium */}
                    <div className="mb-4">
                        <div className="text-xs font-semibold text-corporate uppercase tracking-wider mb-2">
                            {isCompleted ? 'Reto Superado' : 'Desafío del Módulo'}
                        </div>
                         <p className="text-base font-medium text-text-dark dark:text-slate-200 leading-relaxed italic border-l-4 border-corporate pl-4 py-2">
                            "{challengeText}"
                        </p>
                        
                        {/* Barra de progreso de puntuación (solo cuando completado) */}
                        {isCompleted && score > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-text-sub">Puntuación del Desafío</span>
                                    <span className={`text-sm font-semibold ${scoreColor}`}>{score}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${isApproved ? 'bg-gradient-to-r from-success to-emerald-400' : 'bg-gradient-to-r from-warning to-orange-400'} transition-all duration-700 ease-out`}
                                        style={{ width: `${score}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-text-light">0%</span>
                                    <span className="text-xs font-medium text-corporate">70% para aprobar</span>
                                    <span className="text-xs text-text-light">100%</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Metadatos adicionales */}
                    <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Icon name="fa-brain" className="text-corporate" />
                                 <span className="text-sm text-text-sub dark:text-slate-300">Aplicación Práctica</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="fa-chart-line" className="text-corporate" />
                                 <span className="text-sm text-text-sub dark:text-slate-300">Nivel {isCompleted ? 'Avanzado' : 'Intermedio'}</span>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-corporate">
                            {isCompleted ? '💯 100% Completado' : '🎯 Objetivo Claro'}
                        </div>
                    </div>
                </div>
            </div>
            
             {/* BOTONES PREMIUM RESPONSIVOS */}
             <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6">
                {isCompleted ? (
                    <>
                        {/* BOTÓN PREMIUM PARA DESAFÍO COMPLETADO */}
                        <button 
                            className={`
                                ${buttonClasses.completed} flex-1
                                ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(52,211,153,0.5)]'}
                                relative overflow-hidden group
                            `}
                            onClick={onReviewCompleted || (() => alert('🎉 ¡Desafío completado con excelencia! Revisa tu solución en "Mis Proyectos Premium".'))}
                            onTouchStart={handleTouchOptimization}
                            disabled={isDisabled}
                            aria-label="Revisar desafío completado con excelencia"
                            aria-busy={isStarting}
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, onReviewCompleted)}
                        >
                            {/* Efecto de brillo en hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                             <Icon name="fa-trophy" className="text-lg" />
                            <span className="font-bold">Ver Resultado</span>
                        </button>
                        
                        {/* BOTÓN PREMIUM PARA REINTENTAR */}
                        <button 
                            className={`
                                ${buttonClasses.secondary} flex-1
                                ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(0,188,212,0.25)]'}
                                relative overflow-hidden group
                            `}
                            onClick={onRetryChallenge || (() => {
                                if (confirm('¿Deseas realizar una versión avanzada de este desafío? Tu progreso anterior se conservará como referencia.')) {
                                    console.log('Desafío avanzado iniciado');
                                }
                            })}
                            onTouchStart={handleTouchOptimization}
                            disabled={isDisabled}
                            aria-label="Intentar versión avanzada del desafío"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, onRetryChallenge)}
                        >
                             <Icon name="fa-rocket" className="text-lg" />
                            <span className="font-bold">Versión Avanzada</span>
                        </button>
                    </>
                ) : (
                    <>
                        {/* BOTÓN PRINCIPAL PREMIUM - INICIAR DESAFÍO */}
                        <button 
                            className={`
                                ${buttonClasses.challenge} flex-1
                                ${isStarting || isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(255,209,102,0.5)]'}
                                relative overflow-hidden group
                            `}
                            onClick={onStartChallenge}
                            onTouchStart={handleTouchOptimization}
                            disabled={isStarting || isDisabled}
                            aria-label={isStarting ? "Iniciando desafío premium..." : "Iniciar desafío práctico premium"}
                            aria-busy={isStarting}
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, onStartChallenge)}
                        >
                            {/* Efecto de brillo en hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            
                            {isStarting ? (
                                <>
                                    {/* SPINNER PREMIUM */}
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    <span className="font-bold">Preparando Entorno...</span>
                                </>
                            ) : (
                                <>
                                     <Icon name="fa-play-circle" className="text-xl" />
                                    <span className="font-bold">Iniciar Desafío Premium</span>
                                </>
                            )}
                        </button>
                        
                        {/* BOTÓN SECUNDARIO PREMIUM - VER SOLUCIÓN */}
                        <button 
                            className={`
                                ${buttonClasses.secondary} flex-1
                                ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(0,188,212,0.25)]'}
                                relative overflow-hidden group
                            `}
                            onClick={onViewSolution}
                            onTouchStart={handleTouchOptimization}
                            disabled={isDisabled}
                            aria-label="Ver solución experta del desafío"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, onViewSolution)}
                        >
                             <Icon name="fa-graduation-cap" className="text-lg" />
                            <span className="font-bold">Solución Experta</span>
                        </button>
                    </>
                )}
            </div>
            
             {/* FOOTER PREMIUM CON ESTADÍSTICAS */}
              <div className="mt-6 pt-6 border-t border-border-light dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-corporate rounded-full"></div>
                             <span className="text-sm text-text-sub dark:text-slate-300">Dificultad: {isCompleted ? 'Dominada' : 'Media-Alta'}</span>
                        </div>
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-corporate rounded-full"></div>
                             <span className="text-sm text-text-sub dark:text-slate-300">Impacto: Alto</span>
                        </div>
                    </div>
                    
                    {/* INDICADOR DE PLATAFORMA PREMIUM (solo desarrollo) */}
                    {process.env.NODE_ENV === 'development' && (
                         <div className="text-xs font-medium px-3 py-1.5 bg-petroleum/10 dark:bg-petroleum/20 text-petroleum dark:text-corporate rounded-full">
                            <span className="flex items-center gap-2">
                                <Icon name="fa-desktop" />
                                ChallengeCard Premium | {isIOS ? '📱 iOS Optimizado' : '💻 Desktop'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <PlatformOptimizedCard
            className={`
                h-full flex flex-col
                bg-white dark:bg-slate-800
                rounded-[28px]
                p-8 md:p-10
                ${className}
            `.trim()}
            style={style}
            withShadow={true}
            shadowIntensity="medium"
            withTouchOptimization={true}
            withHiDPIOptimization={true}
            {...rest}
        >
            {isLoading ? renderSkeleton() : renderContent()}
        </PlatformOptimizedCard>
    );
};

/**
 * Variante minimalista del ChallengeCard (para listas, dashboards)
 */
export const MinimalChallengeCard = ({ title, challengeText, isCompleted, onClick, ...props }) => {
    return (
        <div 
            className={`
                p-4 rounded-xl border transition-all duration-300 cursor-pointer
                hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                 ${isCompleted 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' 
                    : 'bg-gradient-to-r from-soft-blue/30 to-mint/30 dark:from-petroleum/10 dark:to-corporate/10 border-corporate/30 dark:border-corporate/40 hover:bg-gradient-to-r hover:from-soft-blue/40 hover:to-mint/40 dark:hover:from-petroleum/15 dark:hover:to-corporate/15'
                }
            `}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && onClick(e)}
            aria-label={`${title} - ${isCompleted ? 'Completado' : 'Pendiente'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-success' : 'bg-gradient-to-r from-petroleum to-corporate'}`}>
                    <Icon name={isCompleted ? "fa-check" : "fa-bolt"} className="text-white text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary dark:text-white text-sm truncate">{title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{challengeText}</p>
                </div>
                {isCompleted && (
                     <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-full">
                        Completado
                    </span>
                )}
            </div>
        </div>
    );
};

/**
 * Variante de estadísticas del ChallengeCard (para dashboards de progreso)
 */
export const ChallengeStatsCard = ({ 
    totalChallenges = 0, 
    completedChallenges = 0, 
    averageTime = "45 min",
    ...props 
}) => {
    const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
    
    return (
        <PlatformOptimizedCard
            className="p-6"
            withShadow={true}
            shadowIntensity="light"
            {...props}
        >
            <div className="flex items-center justify-between mb-4">
                 <div>
                     <h3 className="text-lg font-bold text-primary dark:text-white">Progreso de Desafíos</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Rendimiento en desafíos prácticos</p>
                </div>
                <div className="text-2xl font-bold text-[#00BCD4] dark:text-corporate">{completionRate}%</div>
            </div>
            
            <div className="space-y-4">
                {/* Barra de progreso */}
                 <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-petroleum to-corporate transition-all duration-700 ease-out"
                        style={{ width: `${completionRate}%` }}
                    ></div>
                </div>
                
                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                         <div className="text-2xl font-bold text-primary dark:text-white">{completedChallenges}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Completados</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                         <div className="text-2xl font-bold text-primary dark:text-white">{totalChallenges}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Totales</div>
                    </div>
                </div>
                
                {/* Tiempo promedio */}
                 <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                     <Icon name="fa-clock" className="text-corporate" />
                    <span>Tiempo promedio: {averageTime}</span>
                </div>
            </div>
        </PlatformOptimizedCard>
    );
};

export default ChallengeCard;