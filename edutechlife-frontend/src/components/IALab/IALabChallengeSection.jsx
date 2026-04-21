import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import PlatformOptimizedCard from '../PlatformOptimizedCard';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';

/**
 * Componente premium reutilizable para mostrar desafíos del curso en IALab
 * Con diseño SaaS premium, optimizaciones por plataforma y estados dinámicos
 * Sistema de puntuación: 0-100% con aprobación al 70%
 * 
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 * @param {Object} props.style - Estilos inline adicionales
 */
const IALabChallengeSection = ({
    className = '',
    style = {},
    ...rest
}) => {
    const { 
        activeMod, 
        modules, 
        user,
        challengeScore,
        setChallengeScore,
        isChallengeCompleted,
        setIsChallengeCompleted,
        isStartingChallenge,
        setIsStartingChallenge,
        isButtonDisabled,
        setIsButtonDisabled,
        setShowPremiumEvaluationModal
    } = useIALabContext();

    const { saveProgress, PROGRESS_STATUS, isLoadingProgress } = useIALabProgress();

    // Sistema de clases de botones premium con colores corporativos
    const buttonClasses = {
        challenge: "bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(0,75,99,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-semibold flex items-center justify-center gap-3 focus:outline-none focus:ring-3 focus:ring-[#00BCD4]/50 focus:ring-offset-4 min-h-[60px] touch-manipulation text-base tracking-tight",
        
        secondary: "border-3 border-[#00BCD4] text-[#004B63] px-8 py-4 rounded-2xl hover:bg-[#00BCD4]/8 hover:border-[#00BCD4]/80 hover:shadow-[0_0_20px_rgba(0,188,212,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-semibold flex items-center justify-center gap-3 focus:outline-none focus:ring-3 focus:ring-[#00BCD4]/50 focus:ring-offset-4 min-h-[60px] touch-manipulation text-base tracking-tight",
        
        completed: "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out font-semibold flex items-center justify-center gap-3 focus:outline-none focus:ring-3 focus:ring-emerald-500/50 focus:ring-offset-4 min-h-[60px] touch-manipulation text-base tracking-tight"
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
            if (handler && !isButtonDisabled && !isStartingChallenge) {
                handler(e);
            }
        }
    };

    // Lógica de puntuación
    const isApproved = challengeScore >= 70;
    const scoreColor = isApproved ? 'text-emerald-600' : 'text-amber-600';
    const scoreBgColor = isApproved ? 'bg-emerald-100' : 'bg-amber-100';
    const scoreText = isApproved ? 'Aprobado' : 'Reprobado';

    // Datos del módulo actual
    const currentModule = modules.find(m => m.id === activeMod);
    const challengeText = currentModule?.challenge || 'Crea un prompt para resolver un problema complejo de tu industria.';
    const estimatedTime = "45 min";

    // Handlers específicos para IALab
    const handleStartChallenge = () => {
        setShowPremiumEvaluationModal(true);
    };

    const handleViewSolution = () => {
        // TODO: Implementar vista de solución experta
        alert('La funcionalidad de "Solución Experta" estará disponible próximamente.');
    };

    const handleReviewCompleted = () => {
        const isApproved = challengeScore >= 70;
        const message = `📊 **Resumen del Desafío Completado**\n\n` +
                       `• **Puntuación:** ${challengeScore}%\n` +
                       `• **Estado:** ${isApproved ? '✅ Aprobado' : '⚠️ Reprobado (necesitas 70%)'}\n` +
                       `• **Módulo:** ${currentModule?.title || 'Desafío del Curso'}\n` +
                       `• **Fecha de completado:** ${new Date().toLocaleDateString()}\n\n` +
                       `*La funcionalidad de "Mis Proyectos" estará disponible próximamente.*`;
        
        alert(message);
    };

    const handleRetryChallenge = async () => {
        if (confirm('¿Quieres realizar una versión avanzada de este desafío?\n\nTu puntuación anterior se conservará como referencia.')) {
            try {
                // Guardar historial del intento anterior
                if (user?.id && challengeScore > 0) {
                    const historyData = {
                        previous_score: challengeScore,
                        previous_completed_at: new Date().toISOString(),
                        retry_initiated_at: new Date().toISOString(),
                        is_advanced_version: true
                    };
                    
                    await saveProgress(
                        activeMod,
                        PROGRESS_STATUS.IN_PROGRESS,
                        historyData
                    );
                }
                
                // Reiniciar estados locales
                setIsChallengeCompleted(false);
                setIsButtonDisabled(false);
                setChallengeScore(0);
                
                console.log('Desafío avanzado iniciado - historial guardado');
                alert('🎯 Desafío avanzado iniciado. ¡Demuestra que puedes superar tu puntuación anterior!');
                
            } catch (error) {
                console.error('Error al iniciar desafío avanzado:', error);
                alert('⚠️ Error al iniciar el desafío avanzado. Intenta nuevamente.');
            }
        }
    };

    // Render skeleton loading premium
    const renderSkeleton = () => (
        <div className="animate-pulse space-y-8">
            {/* Header skeleton premium */}
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-2/3"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                </div>
            </div>
            
            {/* Challenge text skeleton premium */}
            <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-5/6"></div>
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-4/6"></div>
            </div>
            
            {/* Time skeleton premium */}
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/4"></div>
            </div>
            
            {/* Buttons skeleton premium */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6">
                <div className="h-[60px] bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl flex-1"></div>
                <div className="h-[60px] bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl flex-1"></div>
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
                     ${isChallengeCompleted 
                        ? 'bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-500 shadow-[0_8px_32px_rgba(16,185,129,0.25)]' 
                        : 'bg-gradient-to-br from-[#00BCD4]/20 via-[#00BCD4] to-[#00BCD4]/20 shadow-[0_8px_32px_rgba(0,188,212,0.25)]'
                    }
                `}>
                     <Icon 
                        name={isChallengeCompleted ? "fa-trophy" : "fa-bolt"} 
                        className="text-white text-xl" 
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-[#00374A] font-display">
                             {isChallengeCompleted ? '🎉 Desafío Completado' : 'Desafío del Curso'}
                         </h3>
                         {isChallengeCompleted && (
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 ${scoreBgColor} ${scoreColor} text-sm font-semibold rounded-full`}>
                                    {challengeScore}% - {scoreText}
                                </span>
                                {isApproved && (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                                        Éxito
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {isChallengeCompleted 
                            ? `¡Felicidades! Has completado el desafío con una puntuación de ${challengeScore}%${isApproved ? ' (Aprobado)' : ' (Necesitas al menos 70% para aprobar)'}.` 
                            : 'Aplica lo aprendido en un reto práctico'
                        }
                    </p>
                </div>
            </div>
            
             {/* CONTENEDOR DEL DESAFÍO PREMIUM - ESTÉTICA CORPORATIVA EDUTECHLIFE */}
               <div 
                className={`
                    rounded-2xl p-6 mb-6 
                    bg-white/80 backdrop-blur-md
                    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                    border border-[#00BCD4]/20
                    relative overflow-hidden
                `}
            >
                {/* Efecto de brillo sutil */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00BCD4]/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                
                {/* Contenido del desafío */}
                <div className="relative z-10">
                    {/* Badge de estado */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isChallengeCompleted ? 'bg-emerald-100' : 'bg-[#00BCD4]/20'}`}>
                             <Icon 
                                name={isChallengeCompleted ? "fa-check-circle" : "fa-hourglass-half"} 
                                className="text-[#00BCD4]" 
                            />
                            <span className="text-sm font-semibold text-[#00BCD4]">
                                {isChallengeCompleted ? 'Completado' : `⏱️ ${estimatedTime}`}
                            </span>
                        </div>
                        <div className="text-sm text-slate-600">
                            {isChallengeCompleted ? '✅ Verificado' : '🔄 En progreso'}
                        </div>
                    </div>
                    
                     {/* Texto del desafío con tipografía premium */}
                    <div className="mb-4">
                         <div className="text-xl font-bold text-[#004B63] mb-2">
                            {isChallengeCompleted ? 'Reto Superado' : 'Desafío del Módulo'}
                        </div>
                          <p className="text-base font-medium text-[#004B63]/90 italic leading-relaxed border-l-4 border-[#00BCD4] pl-4 py-2">
                             "{challengeText}"
                         </p>
                        
                        {/* Barra de progreso de puntuación (solo cuando completado) */}
                        {isChallengeCompleted && challengeScore > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">Puntuación del Desafío</span>
                                    <span className={`text-sm font-semibold ${scoreColor}`}>{challengeScore}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${isApproved ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'} transition-all duration-700 ease-out`}
                                        style={{ width: `${challengeScore}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-500">0%</span>
                                    <span className="text-xs font-medium text-[#00BCD4]">70% para aprobar</span>
                                    <span className="text-xs text-slate-500">100%</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Metadatos adicionales */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2">
                                <Icon name="fa-brain" className="text-[#00BCD4]" />
                                 <span className="text-sm text-slate-600">Aplicación Práctica</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="fa-chart-line" className="text-[#00BCD4]" />
                                 <span className="text-sm text-slate-600">Nivel {isChallengeCompleted ? 'Avanzado' : 'Intermedio'}</span>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-[#00BCD4]">
                            {isChallengeCompleted ? '💯 100% Completado' : '🎯 Objetivo Claro'}
                        </div>
                    </div>
                </div>
            </div>
            
             {/* BOTONES PREMIUM RESPONSIVOS */}
             <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6">
                {isChallengeCompleted ? (
                    <>
                        {/* BOTÓN PREMIUM PARA DESAFÍO COMPLETADO */}
                        <button 
                            className={`
                                ${buttonClasses.completed} flex-1
                                ${isButtonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(52,211,153,0.5)]'}
                                relative overflow-hidden group
                            `}
                            onClick={handleReviewCompleted}
                            onTouchStart={handleTouchOptimization}
                            disabled={isButtonDisabled}
                            aria-label="Revisar desafío completado con excelencia"
                            aria-busy={isStartingChallenge}
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, handleReviewCompleted)}
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
                                ${isButtonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(0,188,212,0.25)]'}
                                relative overflow-hidden group
                            `}
                            onClick={handleRetryChallenge}
                            onTouchStart={handleTouchOptimization}
                            disabled={isButtonDisabled}
                            aria-label="Intentar versión avanzada del desafío"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, handleRetryChallenge)}
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
                                ${isStartingChallenge || isButtonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(255,209,102,0.5)]'}
                                relative overflow-hidden group
                            `}
                            onClick={handleStartChallenge}
                            onTouchStart={handleTouchOptimization}
                            disabled={isStartingChallenge || isButtonDisabled}
                            aria-label={isStartingChallenge ? "Iniciando desafío premium..." : "Iniciar desafío práctico premium"}
                            aria-busy={isStartingChallenge}
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, handleStartChallenge)}
                        >
                            {/* Efecto de brillo en hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            
                            {isStartingChallenge ? (
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
                                ${isButtonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(0,188,212,0.25)]'}
                                relative overflow-hidden group
                            `}
                            onClick={handleViewSolution}
                            onTouchStart={handleTouchOptimization}
                            disabled={isButtonDisabled}
                            aria-label="Ver solución experta del desafío"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, handleViewSolution)}
                        >
                             <Icon name="fa-graduation-cap" className="text-lg" />
                            <span className="font-bold">Solución Experta</span>
                        </button>
                    </>
                )}
            </div>
            
             {/* FOOTER PREMIUM CON ESTADÍSTICAS */}
               <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
                             <span className="text-sm text-slate-600">Dificultad: {isChallengeCompleted ? 'Dominada' : 'Media-Alta'}</span>
                        </div>
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-[#00BCD4] rounded-full"></div>
                             <span className="text-sm text-slate-600">Impacto: Alto</span>
                        </div>
                    </div>
                    
                    {/* INDICADOR DE PLATAFORMA PREMIUM (solo desarrollo) */}
                    {process.env.NODE_ENV === 'development' && (
                         <div className="text-xs font-medium px-3 py-1.5 bg-[#004B63]/10 text-[#004B63] rounded-full">
                            <span className="flex items-center gap-2">
                                <Icon name="fa-desktop" />
                                IALab Challenge Premium
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
                bg-white
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
            {isLoadingProgress ? renderSkeleton() : renderContent()}
        </PlatformOptimizedCard>
    );
};

export default IALabChallengeSection;