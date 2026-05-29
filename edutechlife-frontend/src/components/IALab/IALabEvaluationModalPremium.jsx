import React, { useEffect, useState } from 'react';
import IALabEvaluationModal from './IALabEvaluationModal';
import { useIALabProgressContext, useIALabUIContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from '../../i18n/I18nProvider';

/**
 * Wrapper para el modal de evaluación premium
 * Mantiene compatibilidad con la interfaz existente
 * SEPARACIÓN DE CONCERNS: La lógica de guardado se ejecuta aquí
 */
const IALabEvaluationModalPremium = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { activeMod, markActivityComplete, markExamComplete, markChallengeComplete, updateModuleActivity, refreshProgress, recordLastTopic, modules } = useIALabProgressContext();
    const setIsChallengeCompleted = useIALabStore(s => s.setIsChallengeCompleted);
    const setChallengeScore = useIALabStore(s => s.setChallengeScore);
    const { user } = useIALabUIContext();
    const { saveProgress, PROGRESS_STATUS, trackChallengeResult } = useIALabProgress();
    const { createNotification } = useNotification();
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
            
            // Registrar ultimo tema visto (desafio del modulo)
            const moduleName = modules?.find(m => m.id === activeMod)?.title || t('ialab.evaluation.modal_premium.module_name', { id: activeMod });
            if (recordLastTopic) {
              recordLastTopic(activeMod, moduleName, 'challenge', t('ialab.evaluation.modal_premium.challenge_label', { name: moduleName }), `challenge_${activeMod}`);
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

            createNotification({
                type: passed ? 'success' : 'warning',
                title: passed ? t('ialab.evaluation.modal_premium.challenge_passed') : t('ialab.evaluation.modal_premium.challenge_failed'),
                message: passed
                    ? t('ialab.evaluation.modal_premium.result_passed', { module: activeMod, score })
                    : t('ialab.evaluation.modal_premium.result_failed', { module: activeMod, score }),
                metadata: { moduleId: activeMod, score, type: 'challenge' }
            });
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