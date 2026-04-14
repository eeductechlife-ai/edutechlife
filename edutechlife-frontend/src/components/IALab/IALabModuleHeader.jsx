import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabQuiz } from '../../hooks/IALab/useIALabQuiz';

/**
 * COMPONENTE: IALabModuleHeader
 * 
 * Responsabilidad: Header del módulo actual con botón de evaluación
 * - Título y descripción del módulo
 * - Botón "Tomar Evaluación" con estados dinámicos:
 *   • "Evaluación Bloqueada" (módulo anterior no completado)
 *   • "Volver a Intentar" (si ya hizo intento previo)
 *   • "Tomar Evaluación" (por defecto)
 * - Badge de porcentaje del último intento
 * - Lista de "Lo que aprenderás"
 * - Desafío del módulo
 */

const IALabModuleHeader = () => {
  const {
    activeMod,
    modules,
    isEvaluationLocked,
    showEvaluationTooltip,
    setShowEvaluationTooltip
  } = useIALabContext();
  
  const {
    getLatestQuizAttempt,
    openEvaluation
  } = useIALabQuiz();
  
  const curr = modules.find(m => m.id === activeMod) || modules[0];
  const latestAttempt = getLatestQuizAttempt();
  
  // Clases de botones (extraídas del original para consistencia)
  const buttonClasses = {
    primary: "bg-white text-[#00374A] shadow-sm px-6 py-3 rounded-xl hover:bg-slate-50 transition-all duration-300 ease-in-out transform active:scale-95 font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00BCD4] focus:ring-offset-2 min-h-[52px] touch-manipulation",
    loading: "opacity-70 cursor-not-allowed"
  };
  
  // Determinar texto del botón según estado
  const getButtonText = () => {
    if (isEvaluationLocked(activeMod)) {
      return (
        <>
          <Icon name="fa-lock" className="text-xs text-[#00374A]" />
          Evaluación Bloqueada
        </>
      );
    } else if (latestAttempt) {
      return 'Volver a Intentar';
    } else {
      return 'Tomar Evaluación';
    }
  };
  
  // Manejar clic en botón de evaluación
  const handleEvaluationClick = () => {
    if (isEvaluationLocked(activeMod)) {
      setShowEvaluationTooltip(true);
      setTimeout(() => setShowEvaluationTooltip(false), 3000);
    } else {
      openEvaluation();
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-white via-white/95 to-[#F8FAFC] border border-[#E2E8F0]/50 shadow-[0_8px_40px_rgba(0,75,99,0.08)] rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#004B63] via-[#00BCD4] to-[#4DA8C4] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon name={curr.icon} className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{curr.title}</h2>
              <p className="text-white text-sm">{curr.desc}</p>
            </div>
          </div>
           <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                   <button 
                     className={`${buttonClasses.primary} ${isEvaluationLocked(activeMod) ? 'opacity-70 cursor-not-allowed' : ''}`}
                     disabled={isEvaluationLocked(activeMod)}
                     onClick={handleEvaluationClick}
                     aria-label={isEvaluationLocked(activeMod) ? "Evaluación bloqueada - Completa módulos anteriores" : "Tomar evaluación del módulo actual"}
                   >
                     <Icon name="fa-clipboard-check" className={`${isEvaluationLocked(activeMod) ? 'text-slate-400' : 'text-[#00374A]'}`} />
                     {getButtonText()}
                   </button>
                  
                  {/* Badge de porcentaje del último intento */}
                  {!isEvaluationLocked(activeMod) && latestAttempt && (
                     <div className="relative group">
                       <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-white text-[#00374A] border-2 border-[#00BCD4]"
                         title={`Último intento: ${latestAttempt.score}%`}>
                         {latestAttempt.score}%
                       </div>
                       
                       {/* Tooltip */}
                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block z-50">
                         <div className="bg-[#00374A] text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                           Último intento: {latestAttempt.score}%
                         </div>
                       </div>
                    </div>
                  )}
                </div>
           </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#00374A] mb-3">Lo que aprenderás</h3>
          <div className="grid grid-cols-2 gap-3">
            {curr.topics.map((topic, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Icon name="fa-check" className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700">{topic}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#00BCD4]/10 border-l-4 border-[#00BCD4] p-4 rounded-r-xl">
          <div className="flex items-start gap-3">
            <Icon name="fa-lightbulb" className="text-[#00BCD4] flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[#00374A] mb-1">Desafío del Módulo</h4>
              <p className="text-sm text-[#00374A]">{curr.challenge}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tooltip de evaluación bloqueada */}
      {showEvaluationTooltip && (
        <div className="absolute top-20 right-10 bg-[#00374A] text-white text-xs rounded py-2 px-3 animate-fadeIn z-50">
          <div className="flex items-center gap-2">
            <Icon name="fa-lock" className="text-xs" />
            <span>Completa el módulo anterior para desbloquear esta evaluación</span>
          </div>
          <div className="absolute -top-1 right-4 w-2 h-2 bg-[#00374A] transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default IALabModuleHeader;