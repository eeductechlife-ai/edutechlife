import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createClerkSupabaseClient } from '../../lib/supabase';

/**
 * useIALabEvaluation — Evaluación inmersiva con DeepSeek API + Supabase persist
 *
 * Responsabilidad: Genera 3 ejercicios de prompt-engineering vía DeepSeek,
 * evalúa respuestas con scoring pedagógico (generoso), guarda notas en Supabase.
 * Incluye fallback local cuando la API no está disponible.
 *
 * Store access: NINGUNO — todo el estado es local (useState).
 * Solo depende de useAuth() para user.id.
 *
 * Nota: Es el hook más independiente del módulo. Candidato a extraerse
 * como servicio reutilizable.
 */
const useIALabEvaluation = () => {
    const { user } = useAuth();
    const abortRef = useRef(null);

    useEffect(() => {
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);
    const [state, setState] = useState({
        step: 1, // 1, 2, 3, 'loading', 'results'
        exercises: null,
        responses: { ej1: '', ej2: '', ej3: '' },
        evaluation: null,
        loading: false,
        error: null
    });

    // Generar ejercicios con DeepSeek API
    const generateExercises = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    isJson: true,
                    messages: [{
                        role: 'system',
                        content: 'Eres un experto en diseño de prompts y evaluación educativa. Genera 3 ejercicios de nivel medio para evaluación de prompts. Devuelve SOLO JSON.'
                    }, {
                        role: 'user',
                        content: `Genera un JSON con 3 ejercicios de nivel medio para evaluación de prompts:
                        1. ejercicio1: Un párrafo con un escenario detallado donde el usuario debe identificar (Rol, Contexto, Tarea). Ejemplo: "Eres un experto en marketing digital trabajando para una startup de e-commerce que quiere aumentar sus ventas en un 30% en el próximo trimestre. Tu tarea es crear una campaña de email marketing segmentada para clientes recurrentes."
                        2. ejercicio2: Un prompt mal redactado que el usuario debe optimizar. Ejemplo: "haz algo para mejorar las ventas con email"
                        3. ejercicio3: Un caso de uso complejo donde el usuario debe crear un prompt desde cero. Ejemplo: "Crea un prompt para generar un plan de contenido de 30 días para una marca de ropa sostenible que quiere posicionarse en TikTok"

                        Formato JSON exacto: { "ejercicio1": "texto", "ejercicio2": "texto", "ejercicio3": "texto" }`
                    }],
                    temperature: 0.7,
                    max_tokens: 1000
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`);
            }

            const data = await response.json();
            const content = data.result;
            
            // Extraer JSON del contenido (soporta markdown y JSON plano)
            const jsonMatch = content.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\n?\s*```/) 
                || content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la respuesta');
            }

            const exercises = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            
            // Validar estructura con defaults por campo
            if (!exercises.ejercicio1 || typeof exercises.ejercicio1 !== 'string') exercises.ejercicio1 = '';
            if (!exercises.ejercicio2 || typeof exercises.ejercicio2 !== 'string') exercises.ejercicio2 = '';
            if (!exercises.ejercicio3 || typeof exercises.ejercicio3 !== 'string') exercises.ejercicio3 = '';
            if (!exercises.ejercicio1 && !exercises.ejercicio2 && !exercises.ejercicio3) {
                throw new Error('Estructura de ejercicios inválida');
            }

            setState(prev => ({ 
                ...prev, 
                exercises,
                loading: false,
                step: 1
            }));

        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Error generando ejercicios:', error);
            
            // Fallback a ejercicios predefinidos
            const fallbackExercises = {
                ejercicio1: "Eres un experto en marketing digital trabajando para una startup de e-commerce que quiere aumentar sus ventas en un 30% en el próximo trimestre. Tu tarea es crear una campaña de email marketing segmentada para clientes recurrentes que no han comprado en los últimos 60 días.",
                ejercicio2: "haz algo para mejorar las ventas con email marketing para una tienda online",
                ejercicio3: "Crea un prompt para generar un plan de contenido de 30 días para una marca de ropa sostenible que quiere posicionarse en TikTok. La marca tiene valores de sostenibilidad, moda ética y quiere conectar con jóvenes de 18-25 años."
            };

            setState(prev => ({ 
                ...prev, 
                exercises: fallbackExercises,
                loading: false,
                step: 1,
                error: 'Usando ejercicios predefinidos (API temporalmente no disponible)'
            }));
        }
    }, []);

    // Evaluar respuestas con DeepSeek API
    const evaluateAnswers = useCallback(async (responses) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    isJson: true,
                    messages: [{
                        role: 'system',
                        content: `Eres un evaluador EXPERTO de prompts educativos con enfoque pedagógico y BENÉVOLO. El estudiante está APRENDIENDO, no es un experto. Sé generoso en la calificación. Evalúa CADA ejercicio por separado. Devuelve SOLO JSON.

IMPORTANTE: El objetivo es que el estudiante ENTIENDA la estructura de un prompt (Rol + Contexto + Tarea + Formato). NO seas exigente con la perfección. Valora el INTENTO y la COMPRENSIÓN del concepto.

CRITERIOS DE CALIFICACIÓN - EJERCICIO 1 (Identificar Rol/Contexto/Tarea - drag & drop):
Este ejercicio tiene 3 elementos que arrastrar a 3 columnas. Cada elemento correcto equivale a ~33%.
- Si NO respondió en ninguna categoría (todo vacío): 0%
- Si respondió en 1 de 3 categorías: 33%
- Si respondió en 2 de 3 categorías: 70%
- Si respondió en las 3 categorías (todas llenas): 100%
NOTA: Solo importa que haya completado las columnas, NO que estén perfectamente clasificadas. El estudiante está aprendiendo.

CRITERIOS DE CALIFICACIÓN - EJERCICIO 2 (Optimizar prompt):
- Si escribió ALGO relacionado (aunque sea corto o básico): 50%
- Si el prompt tiene al menos 2 elementos de estructura (rol, contexto, tarea o formato): 70%
- Si el prompt tiene estructura completa Y es coherente (aunque no sea perfecto): 80%
- Si el prompt es excelente y detallado: 90-100%
NOTA: No penalices por falta de métricas o ejemplos. Lo importante es que entienda la estructura.

CRITERIOS DE CALIFICACIÓN - EJERCICIO 3 (Crear prompt desde cero):
- Si escribió ALGO relacionado al desafío (aunque sea breve): 50%
- Si incluyó al menos rol + tarea (elementos básicos): 70%
- Si incluyó rol + contexto + tarea + algún detalle adicional: 80%
- Si el prompt es completo, coherente y bien estructurado: 90-100%
NOTA: Valora que el estudiante intentó crear un prompt con estructura. No exijas perfección.

NOTA GLOBAL = (nota_ej1 + nota_ej2 + nota_ej3) / 3, redondeada a 1 decimal.

CADA feedback debe incluir:
1. Refuerzo positivo (qué hizo bien, aunque sea pequeño)
2. Sugerencia amable de mejora (no crítica dura)
3. Un ejemplo breve de cómo mejorar
4. Tip práctico para recordar la estructura: Rol + Contexto + Tarea + Formato

Formato JSON EXACTO:
{
  "nota_ej1": <number 0-100>,
  "nota_ej2": <number 0-100>,
  "nota_ej3": <number 0-100>,
  "notaGlobal": <number 0-100>,
  "feedback_ej1": "<string>",
  "feedback_ej2": "<string>",
  "feedback_ej3": "<string>"
}`
                    }, {
                        role: 'user',
                        content: `Evalúa estas respuestas de un estudiante que está APRENDIENDO. Sé BENÉVOLO y generoso con la calificación. El objetivo es que entienda la estructura de un prompt.

ESCENARIO ORIGINAL del Ejercicio 1:
${state.exercises?.ejercicio1 || 'N/A'}

RESPUESTA del estudiante - Ejercicio 1 (Identificar Rol/Contexto/Tarea):
${responses.ej1}

PROMPT ORIGINAL a optimizar en Ejercicio 2:
${state.exercises?.ejercicio2 || 'N/A'}

RESPUESTA del estudiante - Ejercicio 2 (Prompt optimizado):
${responses.ej2}

CASO DE USO del Ejercicio 3:
${state.exercises?.ejercicio3 || 'N/A'}

RESPUESTA del estudiante - Ejercicio 3 (Prompt creado desde cero):
${responses.ej3}

Recuerda: El estudiante está aprendiendo. Valora el intento y la comprensión básica de la estructura. Devuelve SOLO JSON válido.`
                    }],
                    temperature: 0.3,
                    max_tokens: 2000
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`);
            }

            const data = await response.json();
            const content = data.result;
            
            // Extraer JSON del contenido (soporta markdown y JSON plano)
            const jsonMatch = content.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\n?\s*```/) 
                || content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer JSON de la evaluación');
            }

            const evaluation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            
            // Validar estructura con defaults por campo faltante
            const notas = ['nota_ej1', 'nota_ej2', 'nota_ej3'];
            for (const key of notas) {
                if (typeof evaluation[key] !== 'number') evaluation[key] = 0;
            }
            if (typeof evaluation.notaGlobal !== 'number') {
                evaluation.notaGlobal = Math.round(
                    ((evaluation.nota_ej1 || 0) + (evaluation.nota_ej2 || 0) + (evaluation.nota_ej3 || 0)) / 3 * 10
                ) / 10;
            }
            for (const key of ['feedback_ej1', 'feedback_ej2', 'feedback_ej3']) {
                if (!evaluation[key] || typeof evaluation[key] !== 'string') {
                    evaluation[key] = 'Sigue practicando, vas por buen camino. Recuerda la estructura: Rol + Contexto + Tarea + Formato.';
                }
            }

            setState(prev => ({ 
                ...prev, 
                evaluation,
                loading: false
            }));

            return evaluation;

        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Error evaluando respuestas:', error);
            
            // Fallback con calificación por ejercicio y feedback detallado
            // Criterios BENÉVOLOS: el estudiante está aprendiendo
            const ej1Length = responses.ej1?.length || 0;
            const ej2Length = responses.ej2?.length || 0;
            const ej3Length = responses.ej3?.length || 0;

            let nota_ej1 = 0;
            let feedback_ej1 = '';
            
            try {
                const parsed = JSON.parse(responses.ej1);
                const hasRol = parsed.rol && parsed.rol.trim().length > 0;
                const hasContexto = parsed.contexto && parsed.contexto.trim().length > 0;
                const hasTarea = parsed.tarea && parsed.tarea.trim().length > 0;
                const filledCount = (hasRol ? 1 : 0) + (hasContexto ? 1 : 0) + (hasTarea ? 1 : 0);
                
                if (filledCount === 0) {
                    nota_ej1 = 0;
                    feedback_ej1 = 'No completaste ninguna categoría. Este ejercicio requiere identificar y arrastrar elementos a las 3 columnas: Rol, Contexto y Tarea. ¡Inténtalo!';
                } else if (filledCount === 1) {
                    nota_ej1 = 33;
                    feedback_ej1 = `✅ Completaste 1 de 3 categorías (${hasRol ? 'Rol' : hasContexto ? 'Contexto' : 'Tarea'}). Buen inicio, entendiste la idea básica.\n\n🔍 Para mejorar: Completa las otras 2 columnas. Busca en el escenario:\n• "Eres un..." o "Como..." → va en Rol\n• "Trabajando para..." o "En..." → va en Contexto\n• "Debes..." o "Crear..." → va en Tarea\n\n💡 Recuerda: Rol + Contexto + Tarea = Estructura básica de un prompt.`;
                } else if (filledCount === 2) {
                    nota_ej1 = 70;
                    feedback_ej1 = `✅ ¡Muy bien! Completaste 2 de 3 categorías. Demuestras que entiendes la estructura de un prompt.\n\n🔍 Para completar: Revisa qué columna quedó vacía y busca en el escenario la frase correspondiente.\n\n💡 Tip: La estructura Rol + Contexto + Tarea es la base de todo buen prompt. ¡Ya la estás aprendiendo!`;
                } else {
                    nota_ej1 = 100;
                    feedback_ej1 = `🎉 ¡Excelente! Completaste las 3 categorías. Demuestras que entiendes la estructura fundamental de un prompt: Rol, Contexto y Tarea.\n\n💡 Este es el conocimiento clave: Todo buen prompt comienza definiendo QUIÉN es la IA (Rol), DÓNDE está (Contexto) y QUÉ debe hacer (Tarea). ¡Ya dominas lo más importante!`;
                }
            } catch {
                nota_ej1 = 0;
                feedback_ej1 = 'No se detectó tu respuesta. Asegúrate de arrastrar al menos un elemento a cada columna.';
            }

            let nota_ej2 = 50;
            let feedback_ej2 = '';
            
            if (ej2Length < 20) {
                nota_ej2 = 50;
                feedback_ej2 = 'Escribiste una respuesta corta, pero es un buen inicio. Para optimizar un prompt, necesitas agregar más estructura.\n\n🔍 Intenta incluir al menos:\n• Un Rol: "Eres un experto en..."\n• Contexto: "Trabajando para..."\n• Tarea: "Necesitas crear..."\n\n💡 Recuerda: Rol + Contexto + Tarea + Formato = Prompt completo.';
            } else if (ej2Length < 100) {
                nota_ej2 = 60;
                feedback_ej2 = '✅ Tu respuesta tiene contenido y mejoró el prompt original. Vas por buen camino.\n\n🔍 Para mejorar: Organiza tu respuesta en secciones claras. Usa "## Rol", "## Contexto", "## Objetivo", "## Formato".\n\n💡 Tip: No necesitas ser perfecto. Lo importante es que el prompt tenga las 4 partes básicas.';
            } else if (ej2Length < 250) {
                nota_ej2 = 80;
                feedback_ej2 = '✅ ¡Buen trabajo! Tu prompt optimizado tiene estructura y detalles. Demuestras comprensión de cómo mejorar un prompt.\n\n🔍 Para pulirlo: Verifica que cada sección tenga información relevante al caso específico.\n\n💡 Tip avanzado: Agrega restricciones como "Mantén la respuesta bajo 200 palabras" para guiar mejor a la IA.';
            } else {
                nota_ej2 = 90;
                feedback_ej2 = '🎉 ¡Excelente prompt optimizado! Tiene estructura completa, detalles y es coherente. Demuestras un gran entendimiento.\n\n✅ Lo mejor: Tu prompt incluye múltiples secciones y es específico.\n\n💡 Tip: Ya dominas la estructura. Practica aplicándola a diferentes casos para perfeccionarte.';
            }

            let nota_ej3 = 50;
            let feedback_ej3 = '';
            
            if (ej3Length < 30) {
                nota_ej3 = 50;
                feedback_ej3 = 'Escribiste algo relacionado al caso, es un buen primer paso. Un prompt efectivo necesita más desarrollo.\n\n🔍 Estructura recomendada:\n## Rol: [Quién es la IA]\n## Contexto: [Situación]\n## Tarea: [Qué debe hacer]\n## Formato: [Cómo presentar la respuesta]\n\n💡 No te preocupes si no es perfecto. Lo importante es practicar la estructura.';
            } else if (ej3Length < 150) {
                nota_ej3 = 60;
                feedback_ej3 = '✅ Tu prompt aborda el tema del desafío. Vas entendiendo la idea.\n\n🔍 Para mejorar: Asegúrate de incluir al menos un Rol claro ("Eres un experto en...") y una Tarea específica ("Debes crear...").\n\n💡 Tip: Piensa en qué información le darías a un colega experto para resolver este problema. Esa misma información dásela a la IA.';
            } else if (ej3Length < 350) {
                nota_ej3 = 80;
                feedback_ej3 = '✅ ¡Buen prompt! Tiene estructura y elementos clave. Demuestras que entiendes cómo construir un prompt desde cero.\n\n🔍 Para mejorar: Haz cada sección más específica al caso. En lugar de texto genérico, usa detalles del escenario.\n\n💡 Tip: Un prompt específico produce mejores resultados. Agrega detalles como públicos objetivo, plazos o restricciones.';
            } else {
                nota_ej3 = 90;
                feedback_ej3 = '🎉 ¡Prompt muy completo y coherente! Demuestras un excelente entendimiento de la estructura de prompts.\n\n✅ Lo mejor: Tu prompt tiene todas las secciones y es relevante al desafío.\n\n💡 Ya dominas la creación de prompts. Sigue practicando con diferentes casos para consolidar tu habilidad.';
            }

            const notaGlobal = Math.round(((nota_ej1 + nota_ej2 + nota_ej3) / 3) * 10) / 10;

            const fallbackEvaluation = {
                nota_ej1,
                nota_ej2,
                nota_ej3,
                notaGlobal,
                feedback_ej1,
                feedback_ej2,
                feedback_ej3
            };

            setState(prev => ({ 
                ...prev, 
                evaluation: fallbackEvaluation,
                loading: false,
                error: 'Usando evaluación local (API temporalmente no disponible)'
            }));

            return fallbackEvaluation;
        }
    }, [state.exercises]);

    // Obtener cliente Supabase con JWT de Clerk para RLS
    const getAuthDb = useCallback(async () => {
        if (typeof window !== 'undefined' && window.Clerk?.session) {
            try {
                const token = await window.Clerk.session.getToken({ template: 'supabase' });
                if (token) return createClerkSupabaseClient(token);
            } catch (e) {}
        }
        // Fallback a cliente anónimo
        return createClerkSupabaseClient();
    }, []);

    // Guardar nota en Supabase (usa user_progress, no student_grades)
    const saveGradeToSupabase = useCallback(async (evaluation, moduleId = 1) => {
        if (!user?.id) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            const numericModuleId = Number(moduleId) || 1;
            const db = await getAuthDb();
            const { data, error } = await db
                .from('user_progress')
                .upsert({
                    user_id: user.id,
                    module_id: numericModuleId,
                    activity_type: 'challenge',
                    resource_id: null,
                    score: Math.round(Number(evaluation.notaGlobal)),
                    completed_lessons: {
                        nota_ej1: evaluation.nota_ej1,
                        nota_ej2: evaluation.nota_ej2,
                        nota_ej3: evaluation.nota_ej3,
                        feedback_ej1: evaluation.feedback_ej1,
                        feedback_ej2: evaluation.feedback_ej2,
                        feedback_ej3: evaluation.feedback_ej3
                    },
                    is_completed: true,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,module_id,activity_type,resource_id',
                    ignoreDuplicates: false,
                })
                .select()
                .maybeSingle();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error('Error guardando nota en Supabase:', error);
            return { success: false, error: error.message };
        }
    }, [user, getAuthDb]);

    // Cambiar paso
    const setStep = useCallback((step) => {
        setState(prev => ({ ...prev, step }));
    }, []);

    // Actualizar respuesta
    const setResponse = useCallback((exerciseKey, response) => {
        setState(prev => ({
            ...prev,
            responses: { ...prev.responses, [exerciseKey]: response }
        }));
    }, []);

    // Reiniciar evaluación
    const resetEvaluation = useCallback(() => {
        setState({
            step: 1,
            exercises: null,
            responses: { ej1: '', ej2: '', ej3: '' },
            evaluation: null,
            loading: false,
            error: null
        });
    }, []);

    return {
        state,
        generateExercises,
        evaluateAnswers,
        saveGradeToSupabase,
        setStep,
        setResponse,
        resetEvaluation
    };
};

export default useIALabEvaluation;