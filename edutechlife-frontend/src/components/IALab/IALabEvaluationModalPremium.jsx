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
    const { user, activeMod, setIsChallengeCompleted, setChallengeScore, markActivityComplete, markExamComplete, markChallengeComplete, updateModuleActivity, refreshProgress, recordLastTopic, modules } = useIALabContext();
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
            // Guardar desafío en user_progress (ruta IALab) - esto ya actualiza updateModuleActivity internamente
            const challengeResult = await trackChallengeResult(activeMod, score);
            
            // trackChallengeResult ya llama a updateModuleActivity, no es necesario llamarla de nuevo
            
            // Marcar como actividad completada en ProgressContext (ruta global)
            await markActivityComplete(`challenge-${activeMod}`);
            
            // Sincronizar con localStorage si el desafio fue aprobado
            if (markChallengeComplete && score >= 80) {
                await markChallengeComplete(activeMod, score);
            }
            
            // Registrar ultimo tema visto (desafio/examen del modulo)
            const moduleName = modules?.find(m => m.id === activeMod)?.title || `Modulo ${activeMod}`;
            if (recordLastTopic) {
              recordLastTopic(activeMod, moduleName, 'exam', `Desafio - ${moduleName}`, `exam_${activeMod}`);
            }
            
            // Actualizar estado UI
            setIsChallengeCompleted(true);
            setChallengeScore(score);
            
            // Recargar progreso global desde la DB para asegurar consistencia
            try {
                if (refreshProgress) await refreshProgress();
            } catch (e) {
                console.warn('⚠️ Error al refrescar progreso:', e);
            }
            
            const passed = score >= 80;
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