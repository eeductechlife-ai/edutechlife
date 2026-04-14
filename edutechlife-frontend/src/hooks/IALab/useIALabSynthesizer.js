import { useState, useCallback } from 'react';
import { useIALabContext } from '../../context/IALabContext';
import { analyzePromptQuality, getQualityLevel, identifyPromptType, extractKeywords } from '../../utils/promptAnalyzer.js';
import { selectAppropriateTechnique, applyTechnique, getAvailableTechniques, explainTechniqueSelection } from '../../utils/promptOptimizer.js';
import { generateEducationalFeedback, generateComparisonMetrics, generateExecutiveSummary } from '../../utils/promptEvaluator.js';

/**
 * Hook especializado para sintetizador de prompts educativo
 * Enseña prompt engineering aplicando técnicas reales con feedback educativo
 * 
 * @returns {Object} Funciones y estados para sintetizador de prompts
 */
export const useIALabSynthesizer = () => {
    const { 
        activeMod, 
        modules, 
        completedModules 
    } = useIALabContext();

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadMsg, setLoadMsg] = useState('');
    const [genData, setGenData] = useState(null);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

    // Obtener contexto dinámico basado en módulo activo
    const getDynamicContext = useCallback(() => {
        const currentModule = modules.find(m => m.id === activeMod);
        const userLevel = completedModules.length;
        
        let context = {
            module: currentModule?.title || 'Módulo general',
            topics: currentModule?.topics || ['Ingeniería de prompts', 'Comunicación con IA'],
            userLevel: userLevel < 3 ? 'Principiante' : userLevel < 6 ? 'Intermedio' : 'Avanzado',
            challenge: currentModule?.challenge || 'Crear prompts efectivos',
            techniques: getAvailableTechniques().map(t => t.name)
        };

        return context;
    }, [activeMod, modules, completedModules]);

    // Optimizar prompt con análisis real y técnicas aplicadas
    const optimizePrompt = useCallback(async (userPrompt) => {
        if (!userPrompt.trim()) {
            setError('Por favor, ingresa un prompt para optimizar');
            return null;
        }

        if (userPrompt.trim().length < 10) {
            setError('El prompt debe tener al menos 10 caracteres');
            return null;
        }

        if (userPrompt.trim().length > 1000) {
            setError('El prompt no debe exceder 1000 caracteres');
            return null;
        }

        setLoading(true);
        setLoadMsg('Analizando calidad del prompt...');
        setError(null);

        try {
            // 1. ANÁLISIS DE CALIDAD (< 50ms)
            setLoadMsg('Evaluando claridad, especificidad, contexto y estructura...');
            const analysis = analyzePromptQuality(userPrompt);
            
            // 2. IDENTIFICACIÓN DE TÉCNICA APROPIADA (< 10ms)
            setLoadMsg('Seleccionando técnica de optimización...');
            const technique = selectAppropriateTechnique(userPrompt, analysis);
            
            // 3. APLICACIÓN DE TÉCNICA (< 20ms)
            setLoadMsg(`Aplicando ${technique.name}...`);
            const optimizedPrompt = applyTechnique(userPrompt, technique, analysis);
            
            // 4. GENERACIÓN DE FEEDBACK EDUCATIVO (< 20ms)
            setLoadMsg('Generando retroalimentación educativa...');
            const feedback = generateEducationalFeedback(userPrompt, optimizedPrompt, technique, analysis);
            
            // 5. GENERACIÓN DE MÉTRICAS DE COMPARACIÓN (< 10ms)
            const comparisonMetrics = generateComparisonMetrics(userPrompt, optimizedPrompt);
            
            // 6. GENERACIÓN DE RESUMEN EJECUTIVO (< 10ms)
            const executiveSummary = generateExecutiveSummary(feedback);
            
            // TOTAL: < 120ms (vs 1500ms de simulación anterior)

            const result = {
                // Datos originales
                originalPrompt: userPrompt,
                timestamp: new Date().toISOString(),
                
                // Análisis
                analysis: {
                    score: analysis.score,
                    clarity: analysis.clarity,
                    specificity: analysis.specificity,
                    context: analysis.context,
                    structure: analysis.structure,
                    commonProblems: analysis.commonProblems,
                    suggestions: analysis.suggestions,
                    wordCount: analysis.wordCount,
                    charCount: analysis.charCount
                },
                
                // Optimización
                optimizedPrompt: optimizedPrompt,
                techniqueApplied: {
                    name: technique.name,
                    description: technique.description,
                    icon: technique.icon,
                    color: technique.color,
                    explanation: explainTechniqueSelection(userPrompt, technique, analysis)
                },
                
                // Feedback educativo
                feedback: feedback,
                
                // Métricas
                comparisonMetrics: comparisonMetrics,
                executiveSummary: executiveSummary,
                
                // Contexto
                context: getDynamicContext()
            };

            setGenData(result);
            
            // Agregar a historial (mantener solo últimos 10)
            setHistory(prev => [{
                input: userPrompt,
                output: result,
                timestamp: new Date().toISOString()
            }, ...prev.slice(0, 9)]);

            setLoadMsg('');
            return result;

        } catch (err) {
            console.error('Error optimizing prompt:', err);
            setError('Error al optimizar el prompt. Por favor, intenta nuevamente.');
            return null;
        } finally {
            setLoading(false);
        }
    }, [getDynamicContext]);

    // Copiar texto al portapapeles
    const copyToClipboard = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Error copying to clipboard:', err);
            return false;
        }
    }, []);

    // Limpiar historial
    const clearHistory = useCallback(() => {
        setHistory([]);
        setGenData(null);
        setInput('');
    }, []);

    // Cargar prompt del historial
    const loadFromHistory = useCallback((index) => {
        if (history[index]) {
            setInput(history[index].input);
            setGenData(history[index].output);
        }
    }, [history]);

    // Obtener estadísticas de uso
    const getUsageStats = useCallback(() => {
        if (history.length === 0) {
            return {
                totalOptimizations: 0,
                lastOptimization: null,
                favoriteTechnique: 'Ninguna',
                averageScore: 0,
                improvementTrend: 0
            };
        }

        // Calcular técnica favorita
        const techniqueCount = {};
        history.forEach(item => {
            const tech = item.output.techniqueApplied.name;
            techniqueCount[tech] = (techniqueCount[tech] || 0) + 1;
        });
        
        const favoriteTechnique = Object.entries(techniqueCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Ninguna';

        // Calcular score promedio
        const averageScore = Math.round(
            history.reduce((sum, item) => sum + item.output.analysis.score, 0) / history.length
        );

        // Calcular tendencia de mejora (comparar primeros vs últimos)
        let improvementTrend = 0;
        if (history.length >= 3) {
            const firstScores = history.slice(-3).map(item => item.output.analysis.score);
            const lastScores = history.slice(0, 3).map(item => item.output.analysis.score);
            const firstAvg = firstScores.reduce((a, b) => a + b, 0) / firstScores.length;
            const lastAvg = lastScores.reduce((a, b) => a + b, 0) / lastScores.length;
            improvementTrend = Math.round(lastAvg - firstAvg);
        }

        return {
            totalOptimizations: history.length,
            lastOptimization: history[0]?.timestamp || null,
            favoriteTechnique,
            averageScore,
            improvementTrend,
            averageLength: Math.round(
                history.reduce((sum, item) => sum + item.input.length, 0) / history.length
            )
        };
    }, [history]);

    // Generar sugerencias contextuales inteligentes
    const getSuggestions = useCallback(() => {
        const context = getDynamicContext();
        const currentInput = input.toLowerCase();
        
        // Si hay input, sugerir basado en él
        if (input.trim().length > 0) {
            const analysis = analyzePromptQuality(input);
            const promptType = identifyPromptType(input);
            const keywords = extractKeywords(input);
            
            return [
                `Optimiza este prompt aplicando ${promptType.technique}`,
                `Mejora la claridad de: "${input.substring(0, 40)}..."`,
                `Añade más contexto sobre ${keywords[0] || 'el tema'}`,
                `Estructura mejor este prompt para ${promptType.type.toLowerCase()}`
            ];
        }
        
        // Sugerencias generales basadas en contexto
        return [
            `Como ${context.userLevel.toLowerCase()}, crea un prompt para ${context.challenge.toLowerCase()}`,
            `Genera un prompt que use ${context.techniques[0]} para resolver un problema real`,
            `Optimiza este prompt básico: "Explica cómo funciona..."`,
            `Crea un prompt educativo sobre ${context.topics[0]?.toLowerCase() || 'IA'}`
        ];
    }, [getDynamicContext, input]);

    // Validación de input
    const isValidInput = useCallback((text) => {
        return text.trim().length >= 10 && text.trim().length <= 1000;
    }, []);

    // Obtener técnicas disponibles para mostrar
    const getTechniquesForDisplay = useCallback(() => {
        return getAvailableTechniques();
    }, []);

    // Obtener análisis rápido (para preview en tiempo real)
    const getQuickAnalysis = useCallback((text) => {
        if (!text || text.trim().length < 5) return null;
        
        try {
            const analysis = analyzePromptQuality(text);
            const promptType = identifyPromptType(text);
            const qualityLevel = getQualityLevel(analysis.score);
            
            return {
                score: analysis.score,
                level: qualityLevel.level,
                color: qualityLevel.color,
                emoji: qualityLevel.emoji,
                type: promptType.type,
                technique: promptType.technique,
                icon: promptType.icon,
                wordCount: text.split(/\s+/).length,
                suggestions: analysis.suggestions.slice(0, 2)
            };
        } catch (err) {
            console.error('Error in quick analysis:', err);
            return null;
        }
    }, []);

    return {
        // Estados
        input,
        setInput,
        loading,
        loadMsg,
        genData,
        error,
        history,
        
        // Funciones principales
        optimizePrompt,
        copyToClipboard,
        clearHistory,
        loadFromHistory,
        getUsageStats,
        
        // Utilidades
        getDynamicContext,
        getSuggestions,
        getTechniquesForDisplay,
        getQuickAnalysis,
        
        // Validaciones
        isValidInput,
        
        // Constantes útiles
        MAX_INPUT_LENGTH: 1000,
        MIN_INPUT_LENGTH: 10
    };
};

export default useIALabSynthesizer;