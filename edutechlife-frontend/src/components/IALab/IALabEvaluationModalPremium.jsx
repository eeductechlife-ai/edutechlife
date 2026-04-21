import React, { useEffect } from 'react';
import IALabEvaluationModal from './IALabEvaluationModal';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';

/**
 * Wrapper para el modal de evaluación premium
 * Mantiene compatibilidad con la interfaz existente
 * SEPARACIÓN DE CONCERNS: La lógica de guardado se ejecuta aquí
 */
const IALabEvaluationModalPremium = ({ isOpen, onClose }) => {
    const { user, activeMod } = useIALabContext();
    const { saveProgress, PROGRESS_STATUS } = useIALabProgress();
    
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
                    // Error NO crítico - solo registrar, no bloquear UI
                    console.warn('⚠️ Error no crítico al guardar progreso:', error);
                }
            };
            
            saveInitialProgress();
        }
    }, [isOpen, user?.id, activeMod, saveProgress, PROGRESS_STATUS]);
    
    return (
        <IALabEvaluationModal 
            isOpen={isOpen}
            onClose={onClose}
            isPremium={true}
        />
    );
};

export default IALabEvaluationModalPremium;