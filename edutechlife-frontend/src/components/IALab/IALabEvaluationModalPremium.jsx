import React, { useEffect, useState } from 'react';
import IALabEvaluationModal from './IALabEvaluationModal';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';

/**
 * Wrapper para el modal de evaluación premium
 * Mantiene compatibilidad con la interfaz existente
 * SEPARACIÓN DE CONCERNS: La lógica de guardado se ejecuta aquí
 */
const IALabEvaluationModalPremium = ({ isOpen, onClose }) => {
    const { user, activeMod, setIsChallengeCompleted, setChallengeScore, markActivityComplete, markExamComplete, markModuleComplete, refreshProgress } = useIALabContext();
    const { saveProgress, PROGRESS_STATUS, trackChallengeResult } = useIALabProgress();
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Efecto para guardar progreso cuando el modal se monta
    useEffect(() => {
        if (isOpen && user?.id) {
            const saveInitialProgress = async () => {
                try {
                    await saveProgress(
                        activeMod,
                        PROGRESS_STATUS.IN_PROGRESS,
                        { 
                            challenge_started_at: new Date().toISOString(),
                            challenge_type: 'premium_evaluation'
                        }
                    );
                    console.log('📝 Progreso de desafío premium guardado');
                } catch (error) {
                    console.warn('⚠️ Error no crítico al guardar progreso:', error);
                }
            };
            
            saveInitialProgress();
        }
    }, [isOpen, user?.id, activeMod, saveProgress, PROGRESS_STATUS]);
    
    const handleComplete = async (score) => {
        if (!score || !activeMod || isProcessing) return;
        setIsProcessing(true);
        
        try {
            // Guardar desafío en user_progress (ruta IALab)
            await trackChallengeResult(activeMod, score);
            
            // Marcar examen como completado en ProgressContext (esto también marca el módulo)
            await markExamComplete(activeMod);
            
            // Marcar como actividad completada en ProgressContext (ruta global)
            await markActivityComplete(activeMod);
            
            // Recargar progreso global desde la DB para asegurar consistencia
            setTimeout(() => {
                refreshProgress?.();
            }, 1000);
            
            console.log(`✅ Desafío completado: módulo ${activeMod}, nota ${score}%`);
        } catch (error) {
            console.error('❌ Error procesando resultado del desafío:', error);
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <IALabEvaluationModal 
            isOpen={isOpen}
            onClose={onClose}
            isPremium={true}
            moduleId={activeMod}
            onComplete={handleComplete}
        />
    );
};

export default IALabEvaluationModalPremium;