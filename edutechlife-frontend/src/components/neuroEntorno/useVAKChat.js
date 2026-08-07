import { useState, useCallback } from 'react';
import { callDeepseek } from '../../utils/api';

export function useVAKChat() {
    const [coachQ, setCoachQ] = useState('');
    const [coachMsg, setCoachMsg] = useState('');
    const [coachLoad, setCoachLoad] = useState(false);
    const [avatarState, setAvatarState] = useState('idle');

    const askCoach = useCallback(async () => {
        if (!coachQ.trim()) return;
        setCoachLoad(true);
        setAvatarState('thinking');

        try {
            const prompt = `Estudiante pregunta sobre Neuro-Entorno y aprendizaje VAK: ${coachQ}
Eres MAX, mentor educativo experto en neuroeducación y metodologías VAK de Edutechlife. Responde de forma empática, práctica y con ejemplos específicos.`;
            const r = await callDeepseek(prompt, 'Eres un mentor educativo cálido y experto.', false);
            setCoachMsg(r);
            setAvatarState('speaking');
            setTimeout(() => setAvatarState('idle'), 3000);
        } catch (e) {
            console.error('Error asking coach:', e);
        }

        setCoachLoad(false);
    }, [coachQ]);

    return {
        coachQ,
        setCoachQ,
        coachMsg,
        setCoachMsg,
        coachLoad,
        avatarState,
        askCoach,
    };
}
