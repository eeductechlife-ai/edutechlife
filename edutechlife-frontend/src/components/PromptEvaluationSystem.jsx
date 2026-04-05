import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ialabEvaluationService } from '../services/ialabService';
import { evaluateWithDeepseek, evaluateAndSave, EvaluationLevels } from '../services/aiEvaluationService';
import { saveProgress, PROGRESS_STATUS } from '../lib/progress';

const PromptEvaluationSystem = () => {
  const [promptToEvaluate, setPromptToEvaluate] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationHistory, setEvaluationHistory] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState('ialab');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonPrompts, setComparisonPrompts] = useState(['', '']);
  const [comparisonResults, setComparisonResults] = useState([]);
  
  // Estados para evaluación con IA de Deepseek
  const [aiEvaluationMode, setAiEvaluationMode] = useState(false);
  const [selectedModule, setSelectedModule] = useState(1);
  const [aiResult, setAiResult] = useState(null);
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  const evaluationCriteria = {
    ialab: {
      name: 'Criterios IALab',
      description: 'Evaluación especializada para prompts educativos de IA',
      criteria: {
        clarity: { weight: 0.2, description: 'Claridad y especificidad' },
        structure: { weight: 0.15, description: 'Estructura lógica' },
        completeness: { weight: 0.15, description: 'Completitud de información' },
        tone: { weight: 0.1, description: 'Tono apropiado para audiencia' },
        actionability: { weight: 0.2, description: 'Solicitudes accionables claras' },
        creativity: { weight: 0.1, description: 'Enfoque innovador' },
        reusability: { weight: 0.1, description: 'Potencial de reutilización' }
      }
    },
    technical: {
      name: 'Criterios Técnicos',
      description: 'Evaluación para prompts técnicos y de programación',
      criteria: {
        precision: { weight: 0.25, description: 'Precisión técnica' },
        specificity: { weight: 0.2, description: 'Especificidad de requerimientos' },
        examples: { weight: 0.15, description: 'Inclusión de ejemplos' },
        constraints: { weight: 0.2, description: 'Restricciones claras' },
        format: { weight: 0.1, description: 'Formato de respuesta' },
        testing: { weight: 0.1, description: 'Consideraciones de testing' }
      }
    },
    creative: {
      name: 'Criterios Creativos',
      description: 'Evaluación para prompts de contenido creativo',
      criteria: {
        originality: { weight: 0.25, description: 'Originalidad del enfoque' },
        emotional: { weight: 0.2, description: 'Impacto emocional' },
        narrative: { weight: 0.15, description: 'Estructura narrativa' },
        audience: { weight: 0.15, description: 'Alineación con audiencia' },
        style: { weight: 0.15, description: 'Estilo consistente' },
        engagement: { weight: 0.1, description: 'Potencial de engagement' }
      }
    }
  };

  // Cargar historial desde localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('ialab_evaluation_history');
    if (savedHistory) {
      try {
        setEvaluationHistory(JSON.parse(savedHistory).slice(0, 10)); // Últimas 10 evaluaciones
      } catch (error) {
        console.error('Error loading evaluation history:', error);
      }
    }
  }, []);

  const saveToHistory = (evaluation) => {
    const newHistory = [
      {
        id: Date.now(),
        prompt: promptToEvaluate.substring(0, 100) + '...',
        score: evaluation.totalScore,
        grade: evaluation.grade,
        timestamp: new Date().toISOString(),
        criteria: selectedCriteria
      },
      ...evaluationHistory
    ].slice(0, 10); // Mantener solo las 10 más recientes
    
    setEvaluationHistory(newHistory);
    localStorage.setItem('ialab_evaluation_history', JSON.stringify(newHistory));
  };

  const evaluatePrompt = async () => {
    if (promptToEvaluate.length < 20) {
      alert('El prompt debe tener al menos 20 caracteres para evaluación');
      return;
    }

    setIsEvaluating(true);
    try {
      let response;
      
      if (selectedCriteria === 'ialab') {
        response = await ialabEvaluationService.evaluatePromptWithIALabCriteria(promptToEvaluate);
      } else {
        response = await ialabEvaluationService.evaluatePrompt(
          promptToEvaluate, 
          evaluationCriteria[selectedCriteria].criteria
        );
      }

      if (response.success) {
        setEvaluationResult(response.evaluation);
        saveToHistory(response.evaluation);
      }
    } catch (error) {
      console.error('Error evaluating prompt:', error);
      alert('Error al evaluar el prompt. Por favor, intenta nuevamente.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Función para evaluar con Deepseek AI
  const evaluateWithAI = async () => {
    if (promptToEvaluate.length < 20) {
      alert('El prompt debe tener al menos 20 caracteres para evaluación');
      return;
    }

    setIsAiEvaluating(true);
    setAiStatusMessage('Analizando con IA de Deepseek...');
    setAiResult(null);

    try {
      // Mensajes de estado mientras procesa
      const statusMessages = [
        'Analizando estructura del prompt...',
        'Evaluando claridad y especificidad...',
        'Generando feedback personalizado...',
        'Creando versión optimizada del prompt...',
        'Finalizando evaluación...'
      ];

      let statusIndex = 0;
      const statusInterval = setInterval(() => {
        if (statusIndex < statusMessages.length - 1) {
          statusIndex++;
          setAiStatusMessage(statusMessages[statusIndex]);
        }
      }, 1500);

      // Llamar al servicio de evaluación
      const result = await evaluateWithDeepseek(promptToEvaluate, selectedModule);

      clearInterval(statusInterval);

      if (result.success) {
        setAiResult(result.data);
        setAiStatusMessage('¡Evaluación completada!');

        // Hacer que Valerio hable el feedback
        if (result.data.feedback && result.data.feedback.length > 0) {
          const feedbackText = result.data.feedback.join('. ');
          setTimeout(() => {
            if (window.valerioSpeak) {
              window.valerioSpeak(feedbackText);
            }
          }, 500);
        }

        // Guardar progreso en Supabase si está disponible
        try {
          await saveProgress(selectedModule, PROGRESS_STATUS.COMPLETED, {
            evaluationScore: result.data.score,
            evaluationLevel: result.data.level,
            evaluatedPrompt: promptToEvaluate,
            improvedPrompt: result.data.improvedPrompt,
            evaluatedAt: result.data.evaluatedAt,
          });
        } catch (progressError) {
          console.warn('Error guardando progreso en Supabase:', progressError);
        }
      } else {
        setAiStatusMessage('');
        alert(result.error || 'Error al evaluar el prompt con IA');
      }
    } catch (error) {
      console.error('Error en evaluación con IA:', error);
      setAiStatusMessage('');
      alert('Error al evaluar el prompt. Por favor, intenta nuevamente.');
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const evaluateComparison = async () => {
    if (comparisonPrompts.some(p => p.length < 20)) {
      alert('Todos los prompts deben tener al menos 20 caracteres');
      return;
    }

    setIsEvaluating(true);
    try {
      const evaluations = await Promise.all(
        comparisonPrompts.map(prompt => 
          ialabEvaluationService.evaluatePromptWithIALabCriteria(prompt)
        )
      );

      const results = evaluations.map((evalResult, index) => ({
        prompt: comparisonPrompts[index],
        evaluation: evalResult.success ? evalResult.evaluation : null,
        index
      }));

      setComparisonResults(results);
    } catch (error) {
      console.error('Error in comparison evaluation:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGradeBadge = (grade) => {
    const badges = {
      'Excelente': 'bg-green-100 text-green-800 border-green-200',
      'Bueno': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Necesita mejora': 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[grade] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const loadExamplePrompt = (type) => {
    const examples = {
      good: `Eres un experto en análisis de mercado educativo con 10 años de experiencia.

Contexto: Necesito analizar el mercado de plataformas de aprendizaje con IA para educación superior en Latinoamérica.

Tarea: Proporciona un análisis detallado que incluya:
1. Tendencias actuales del mercado
2. Principales competidores y sus ventajas competitivas
3. Oportunidades de crecimiento identificadas
4. Recomendaciones estratégicas para nuevos entrantes

Restricciones:
- Enfócate en el período 2023-2025
- Incluye datos cuantitativos cuando sea posible
- Evita recomendaciones genéricas

Formato: Responde en formato de reporte ejecutivo con secciones claras y bullet points.

Ejemplo de análisis esperado:
• Tasa de crecimiento anual: 15-20%
• Player principal: EdutechLife con 30% market share
• Oportunidad clave: Personalización con IA para universidades`,

      average: `Analiza el mercado de educación con IA.

Dime qué empresas hay y cómo está creciendo.

Incluye algunas recomendaciones.`,

      poor: `Hola, necesito información sobre educación y IA.

¿Qué puedes decirme sobre esto?

Gracias.`
    };

    setPromptToEvaluate(examples[type]);
  };

  const loadFromHistory = (historyItem) => {
    // En un sistema real, recuperaríamos el prompt completo
    setPromptToEvaluate(historyItem.prompt);
    setSelectedCriteria(historyItem.criteria);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E2E8F0] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#004B63] font-montserrat mb-3">
            Sistema de Evaluación Automática de Prompts
          </h1>
          <p className="text-lg text-slate-600">
            Evalúa la calidad de tus prompts con criterios especializados de IALab
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input and Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6">
              {/* Mode Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setComparisonMode(false)}
                  className={`px-4 py-2 rounded-lg transition-all ${!comparisonMode ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white' : 'bg-[#F8FAFC] text-slate-600'}`}
                >
                  Evaluación Individual
                </button>
                <button
                  onClick={() => setComparisonMode(true)}
                  className={`px-4 py-2 rounded-lg transition-all ${comparisonMode ? 'bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white' : 'bg-[#F8FAFC] text-slate-600'}`}
                >
                  Modo Comparación
                </button>
              </div>

              {/* AI Evaluation Toggle */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">🤖 Evaluación con IA Deepseek</h3>
                    <p className="text-white/70 text-sm">Evalúa tu prompt con Valerio, el tutor de Edutechlife</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={aiEvaluationMode}
                      onChange={(e) => setAiEvaluationMode(e.target.checked)}
                    />
                    <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#FFD166]"></div>
                  </label>
                </div>
                
                {aiEvaluationMode && (
                  <div className="mt-4">
                    <label className="block text-sm text-white/80 mb-2">Seleccionar Módulo:</label>
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white text-[#004B63] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                    >
                      <option value={1}>Módulo 1: Ingeniería de Prompts</option>
                      <option value={2}>Módulo 2: Potencia ChatGPT</option>
                      <option value={3}>Módulo 3: Gemini Deep Research</option>
                      <option value={4}>Módulo 4: Notebook LM Mastery</option>
                      <option value={5}>Módulo 5: Examen Final</option>
                    </select>
                  </div>
                )}
              </div>

              {!comparisonMode ? (
                /* Individual Evaluation */
                <>
                  {/* Criteria Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#004B63] mb-3">
                      📋 Criterios de Evaluación
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(evaluationCriteria).map(([key, criteria]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedCriteria(key)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${selectedCriteria === key ? 'border-[#4DA8C4] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#4DA8C4]'}`}
                        >
                          <div className="font-bold text-[#004B63] mb-1">{criteria.name}</div>
                          <div className="text-sm text-slate-500">{criteria.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#004B63] mb-3">
                      ✏️ Prompt a Evaluar
                    </label>
                    <textarea
                      value={promptToEvaluate}
                      onChange={(e) => setPromptToEvaluate(e.target.value)}
                      placeholder="Pega aquí el prompt que quieres evaluar..."
                      className="w-full h-64 p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 resize-none"
                    />
                    <div className="text-xs text-slate-400 mt-2">
                      {promptToEvaluate.length} caracteres • {promptToEvaluate.trim() === '' ? 0 : promptToEvaluate.trim().split(/\s+/).length} palabras
                    </div>
                  </div>

                  {/* Example Prompts */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#004B63] mb-3">
                      🎯 Ejemplos Rápidos
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => loadExamplePrompt('good')}
                        className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        Ejemplo Excelente
                      </button>
                      <button
                        onClick={() => loadExamplePrompt('average')}
                        className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        Ejemplo Promedio
                      </button>
                      <button
                        onClick={() => loadExamplePrompt('poor')}
                        className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Ejemplo a Mejorar
                      </button>
                    </div>
                  </div>

                  {/* Evaluate Button */}
                  {aiEvaluationMode ? (
                    <button
                      onClick={evaluateWithAI}
                      disabled={isAiEvaluating || promptToEvaluate.length < 20}
                      className="w-full py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isAiEvaluating ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          {aiStatusMessage || 'Analizando con IA...'}
                        </>
                      ) : (
                        <>
                          <span>🤖</span>
                          Evaluar con IA Deepseek
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={evaluatePrompt}
                      disabled={isEvaluating || promptToEvaluate.length < 20}
                      className="w-full py-4 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isEvaluating ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          Evaluando...
                        </>
                      ) : (
                        <>
                          <span>⚡</span>
                          Evaluar Prompt
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                /* Comparison Mode */
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#004B63] mb-4">
                      Comparar 2 Prompts
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[0, 1].map(index => (
                        <div key={index} className="border border-[#E2E8F0] rounded-xl p-4">
                          <label className="block text-sm font-medium text-[#004B63] mb-2">
                            Prompt {index + 1}
                          </label>
                          <textarea
                            value={comparisonPrompts[index]}
                            onChange={(e) => {
                              const newPrompts = [...comparisonPrompts];
                              newPrompts[index] = e.target.value;
                              setComparisonPrompts(newPrompts);
                            }}
                            placeholder={`Escribe el prompt ${index + 1} aquí...`}
                            className="w-full h-48 p-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 resize-none text-sm"
                          />
                          <div className="text-xs text-slate-400 mt-2">
                            {comparisonPrompts[index].length} caracteres
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={evaluateComparison}
                    disabled={isEvaluating || comparisonPrompts.some(p => p.length < 20)}
                    className="w-full py-4 bg-gradient-to-r from-[#FF8E53] to-[#FF6B9D] text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEvaluating ? 'Evaluando...' : 'Comparar Prompts'}
                  </button>
                </>
              )}
            </div>

            {/* Evaluation History */}
            {evaluationHistory.length > 0 && !comparisonMode && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6">
                <h3 className="text-xl font-bold text-[#004B63] mb-4 flex items-center gap-2">
                  <span>📜</span>
                  Historial de Evaluaciones
                </h3>
                
                <div className="space-y-3">
                  {evaluationHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-4 border border-[#E2E8F0] rounded-xl hover:border-[#4DA8C4] hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-[#004B63] truncate">
                          {item.prompt}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeBadge(item.grade)}`}>
                          {item.grade}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-500">
                        <div>
                          Score: <span className={`font-bold ${getScoreColor(item.score)}`}>{item.score}/10</span>
                        </div>
                        <div>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

            {/* AI Evaluation Results - Deepseek */}
            {aiEvaluationMode && aiResult && (
              <motion.div 
                className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#004B63] to-[#4DA8C4] flex items-center justify-center">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#004B63]">Evaluación de Valerio</h3>
                  <p className="text-sm text-slate-500">Con IA Deepseek</p>
                </div>

                {/* Score Circle */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={aiResult.score >= 80 ? "#4DA8C4" : aiResult.score >= 60 ? "#FFD166" : "#FF6B9D"}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${aiResult.score * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-black text-[#004B63]">{aiResult.score}</div>
                    <div className="text-xs text-slate-500">/100</div>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="text-center mb-6">
                  <span className={`px-4 py-2 rounded-full text-lg font-bold ${
                    aiResult.level === 'Maestro' ? 'bg-[#FFD166] text-[#004B63]' :
                    aiResult.level === 'Pro' ? 'bg-[#4DA8C4] text-white' :
                    'bg-[#66CCCC] text-[#004B63]'
                  }`}>
                    🏆 {aiResult.level}
                  </span>
                </div>

                {/* Feedback from AI */}
                {aiResult.feedback && aiResult.feedback.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                      <span>💡</span> Feedback de Valerio
                    </h4>
                    <ul className="space-y-2">
                      {aiResult.feedback.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-[#F8FAFC] rounded-lg">
                          <span className="mt-1 text-[#4DA8C4]">•</span>
                          <span className="text-sm text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improved Prompt */}
                {aiResult.improvedPrompt && (
                  <div className="mb-6">
                    <h4 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                      <span>✨</span> Prompt Mejorado
                    </h4>
                    <div className="p-4 bg-gradient-to-r from-[#F0F9FF] to-[#E8F4F8] rounded-xl border border-[#4DA8C4]/20">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{aiResult.improvedPrompt}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(aiResult.improvedPrompt)}
                        className="mt-3 text-xs text-[#4DA8C4] hover:underline"
                      >
                        📋 Copiar al portapapeles
                      </button>
                    </div>
                  </div>
                )}

                {/* Demo Mode Indicator */}
                {aiResult.demo && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-700">
                      ⚠️ Modo demo activo. Configura VITE_DEEPSEEK_API_KEY en .env para usar la API real.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Standard Results (when not in AI mode) */}
            {!comparisonMode && !aiEvaluationMode && evaluationResult && (
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Overall Score */}
                  <div className="text-center mb-6">
                    <div className="text-5xl font-black text-[#004B63] mb-2">
                      {evaluationResult.totalScore}/10
                    </div>
                    <div className={`text-lg font-bold mb-4 ${getScoreColor(evaluationResult.totalScore)}`}>
                      {evaluationResult.grade}
                    </div>
                    
                    {/* Score Circle */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="8"
                        />
                        {/* Score circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={evaluationResult.totalScore >= 8 ? "#4DA8C4" : evaluationResult.totalScore >= 6 ? "#FF8E53" : "#FF6B9D"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${evaluationResult.totalScore * 28.26} 282.6`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#004B63]">
                            {evaluationResult.totalScore}
                          </div>
                          <div className="text-xs text-slate-500">de 10</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-[#004B63]">Puntajes Detallados</h3>
                      <button
                        onClick={() => setShowDetailedView(!showDetailedView)}
                        className="text-sm text-[#4DA8C4] hover:underline"
                      >
                        {showDetailedView ? 'Ver menos' : 'Ver más'}
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(evaluationResult.scores).map(([category, score]) => (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700 capitalize">
                              {category}
                            </span>
                            <span className="text-sm font-bold text-[#004B63]">{score}/10</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getScoreBgColor(score)}`}
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                          {showDetailedView && (
                            <div className="text-xs text-slate-500 mt-1">
                              {evaluationCriteria[selectedCriteria]?.criteria[category]?.description || 'Sin descripción'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  {evaluationResult.metrics && (
                    <div className="mb-6 p-4 bg-[#F8FAFC] rounded-xl">
                      <h4 className="font-bold text-[#004B63] mb-3">📊 Métricas del Prompt</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#4DA8C4]">
                            {evaluationResult.metrics.wordCount}
                          </div>
                          <div className="text-xs text-slate-500">Palabras</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#66CCCC]">
                            {evaluationResult.metrics.length}
                          </div>
                          <div className="text-xs text-slate-500">Caracteres</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {evaluationResult.feedback && evaluationResult.feedback.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-[#004B63] mb-3">💡 Feedback</h4>
                      <ul className="space-y-2">
                        {evaluationResult.feedback.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className={`mt-1 ${getScoreColor(evaluationResult.totalScore)}`}>•</span>
                            <span className="text-sm text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {evaluationResult.suggestions && (
                    <div>
                      <h4 className="font-bold text-[#004B63] mb-3">🚀 Sugerencias de Mejora</h4>
                      <div className="space-y-2">
                        {evaluationResult.suggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 bg-[#F0F9FF] rounded-lg border border-[#4DA8C4]/20">
                            <div className="text-sm text-slate-600">{suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            )}

            {/* Empty State for Results */}
            {(!evaluationResult && !comparisonResults.length && !aiResult) && (
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-xl font-bold text-[#004B63] mb-6 text-center">
                    Resultados de Comparación
                  </h3>
                  
                  <div className="space-y-6">
                    {comparisonResults.map((result, index) => (
                      result.evaluation ? (
                        <div key={index} className="border border-[#E2E8F0] rounded-xl p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="font-bold text-[#004B63]">
                              Prompt {index + 1}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeBadge(result.evaluation.grade)}`}>
                              {result.evaluation.grade}
                            </div>
                          </div>
                          
                          <div className="text-center mb-4">
                            <div className="text-3xl font-black text-[#004B63]">
                              {result.evaluation.totalScore}/10
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {Object.entries(result.evaluation.scores).slice(0, 3).map(([category, score]) => (
                              <div key={category}>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="capitalize">{category}</span>
                                  <span className="font-bold">{score}/10</span>
                                </div>
                                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${getScoreBgColor(score)}`}
                                    style={{ width: `${score * 10}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 text-xs text-slate-500">
                            {result.evaluation.metrics.wordCount} palabras • {result.evaluation.metrics.length} caracteres
                          </div>
                        </div>
                      ) : null
                    ))}
                    
                    {/* Winner Comparison */}
                    {comparisonResults.length === 2 && 
                     comparisonResults[0].evaluation && 
                     comparisonResults[1].evaluation && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] rounded-xl">
                        <div className="text-center font-bold text-[#004B63] mb-2">
                          🏆 Prompt Ganador
                        </div>
                        <div className="text-center text-lg font-bold text-white">
                          Prompt {comparisonResults[0].evaluation.totalScore > comparisonResults[1].evaluation.totalScore ? '1' : '2'}
                        </div>
                        <div className="text-center text-sm text-white/80 mt-1">
                          Diferencia: {Math.abs(comparisonResults[0].evaluation.totalScore - comparisonResults[1].evaluation.totalScore).toFixed(1)} puntos
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            )}

            )}

            {/* Empty State for Results */}
            {!evaluationResult && !comparisonResults.length && !aiResult && (
              <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F0F9FF] flex items-center justify-center">
                  <span className="text-3xl text-[#4DA8C4]">⭐</span>
                </div>
                <h3 className="text-lg font-bold text-[#004B63] mb-2">
                  Esperando Evaluación
                </h3>
                <p className="text-slate-500 text-sm">
                  {comparisonMode 
                    ? 'Escribe dos prompts y haz clic en "Comparar Prompts"' 
                    : 'Escribe un prompt y haz clic en "Evaluar Prompt"'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Criteria Explanation */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-[#004B63] to-[#2D7A94] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">📚 Criterios de Evaluación Explicados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(evaluationCriteria[selectedCriteria].criteria).map(([key, criterion]) => (
                <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                    <h3 className="font-bold text-lg capitalize">{key}</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-3">{criterion.description}</p>
                  <div className="text-xs text-white/60">
                    Peso: {(criterion.weight * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white/80 text-sm">
                <span className="font-bold">Nota:</span> El sistema evalúa prompts basándose en mejores prácticas de ingeniería de prompts. 
                Los puntajes más altos indican prompts más efectivos para obtener resultados de IA de calidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEvaluationSystem;