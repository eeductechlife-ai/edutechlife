import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ialabEvaluationService, ialabTemplatesService } from '../services/ialabService';

const RealTimePromptEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [autoSave, setAutoSave] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [activeSuggestions, setActiveSuggestions] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [userTemplates, setUserTemplates] = useState([]);
  
  const editorRef = useRef(null);
  const evaluationTimeoutRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Cargar templates del usuario al iniciar
  useEffect(() => {
    loadUserTemplates();
  }, []);

  // Evaluar prompt en tiempo real con debounce
  useEffect(() => {
    if (evaluationTimeoutRef.current) {
      clearTimeout(evaluationTimeoutRef.current);
    }

    if (prompt.length > 10) {
      evaluationTimeoutRef.current = setTimeout(() => {
        evaluatePrompt();
      }, 1000);
    }

    // Actualizar métricas básicas
    setCharacterCount(prompt.length);
    setWordCount(prompt.trim() === '' ? 0 : prompt.trim().split(/\s+/).length);
    
    // Calcular puntuación de legibilidad simple
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = prompt.trim().split(/\s+/);
    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
    
    let readability = 100;
    if (avgSentenceLength > 20) readability -= 20;
    if (avgSentenceLength > 30) readability -= 20;
    if (words.length > 200) readability -= 10;
    
    setReadabilityScore(Math.max(0, Math.min(100, Math.round(readability))));

    return () => {
      if (evaluationTimeoutRef.current) {
        clearTimeout(evaluationTimeoutRef.current);
      }
    };
  }, [prompt]);

  // Auto-guardar con debounce
  useEffect(() => {
    if (autoSave && prompt.length > 0) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        autoSavePrompt();
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [prompt, autoSave]);

  const loadUserTemplates = async () => {
    try {
      // En un sistema real, obtendríamos el userId del servicio
      const userId = 'demo_user_123';
      const response = await ialabTemplatesService.getUserTemplates(userId);
      if (response.success) {
        setUserTemplates(response.templates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const evaluatePrompt = async () => {
    if (prompt.length < 20) {
      setEvaluation(null);
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await ialabEvaluationService.evaluatePromptWithIALabCriteria(prompt);
      
      if (response.success) {
        setEvaluation(response.evaluation);
        
        // Generar sugerencias basadas en la evaluación
        const newSuggestions = [
          ...response.evaluation.feedback.map(fb => ({
            type: 'feedback',
            text: fb,
            priority: 'medium'
          })),
          ...response.evaluation.suggestions.map(sug => ({
            type: 'suggestion',
            text: sug,
            priority: 'low'
          }))
        ];
        
        setSuggestions(newSuggestions);
        
        // Sugerencias activas basadas en puntajes bajos
        const active = [];
        if (response.evaluation.scores.clarity < 7) {
          active.push({
            type: 'clarity',
            text: 'Considera hacer el prompt más específico. Ejemplo: En lugar de "analiza esto", usa "analiza las tendencias de mercado en educación digital para 2024"',
            action: () => applySuggestion('clarity')
          });
        }
        
        if (response.evaluation.scores.structure < 7) {
          active.push({
            type: 'structure',
            text: 'Organiza el prompt en secciones claras: Rol → Contexto → Tarea → Restricciones → Formato',
            action: () => applySuggestion('structure')
          });
        }
        
        setActiveSuggestions(active);
      }
    } catch (error) {
      console.error('Error evaluating prompt:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const autoSavePrompt = async () => {
    if (prompt.length === 0) return;

    setSaveStatus('saving');
    try {
      // Simular guardado (en un sistema real, llamaríamos al backend)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem('ialab_draft_prompt', prompt);
      localStorage.setItem('ialab_draft_timestamp', new Date().toISOString());
      
      setSaveStatus('saved');
      
      // Resetear estado después de 2 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error auto-saving prompt:', error);
      setSaveStatus('error');
    }
  };

  const applySuggestion = (type) => {
    let updatedPrompt = prompt;
    
    switch (type) {
      case 'clarity':
        if (!prompt.includes('Eres')) {
          updatedPrompt = `Eres un experto en [tu especialidad].\n\n${prompt}`;
        }
        break;
        
      case 'structure':
        const sections = [
          'Rol: Especifica el rol del asistente de IA',
          'Contexto: Proporciona el contexto necesario',
          'Tarea: Define claramente la tarea principal',
          'Restricciones: Establece límites y restricciones',
          'Formato: Especifica el formato de respuesta deseado'
        ];
        
        updatedPrompt = sections.join('\n\n') + '\n\n' + prompt;
        break;
        
      case 'examples':
        if (!prompt.includes('Ejemplo')) {
          updatedPrompt = prompt + '\n\nEjemplo: [proporciona un ejemplo concreto]';
        }
        break;
    }
    
    setPrompt(updatedPrompt);
    
    // Remover la sugerencia aplicada
    setActiveSuggestions(prev => prev.filter(s => s.type !== type));
  };

  const loadTemplate = (template) => {
    if (template.data && template.data.blocks) {
      const templatePrompt = template.data.blocks
        .map(block => `${block.type.toUpperCase()}: ${block.content}`)
        .join('\n\n');
      setPrompt(templatePrompt);
      setShowTemplates(false);
    }
  };

  const handleKeyDown = (e) => {
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          autoSavePrompt();
          break;
        case 'e':
          e.preventDefault();
          evaluatePrompt();
          break;
        case 't':
          e.preventDefault();
          setShowTemplates(!showTemplates);
          break;
      }
    }
  };

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving': return 'text-yellow-500';
      case 'saved': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving': return 'Guardando...';
      case 'saved': return 'Guardado';
      case 'error': return 'Error al guardar';
      default: return 'Listo';
    }
  };

  const getReadabilityColor = () => {
    if (readabilityScore >= 80) return 'text-green-500';
    if (readabilityScore >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getReadabilityLabel = () => {
    if (readabilityScore >= 80) return 'Excelente';
    if (readabilityScore >= 60) return 'Buena';
    if (readabilityScore >= 40) return 'Regular';
    return 'Difícil';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E2E8F0] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#004B63] font-montserrat mb-3">
            Editor de Prompts en Tiempo Real
          </h1>
          <p className="text-lg text-slate-600">
            Escribe, evalúa y mejora tus prompts con feedback instantáneo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
              {/* Editor Header */}
              <div className="p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-[#F0F9FF]">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-[#004B63] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                        <span className="text-white font-bold">✏️</span>
                      </div>
                      Editor de Prompt
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Escribe tu prompt aquí. Recibirás feedback en tiempo real.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`text-sm ${getSaveStatusColor()}`}>
                      <span className="font-bold">Estado:</span> {getSaveStatusText()}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="w-4 h-4 text-[#4DA8C4] rounded focus:ring-[#4DA8C4]"
                      />
                      <span className="text-sm text-slate-600">Auto-guardar</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Editor Area */}
              <div className="p-6">
                <div className="relative">
                  <textarea
                    ref={editorRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Comienza a escribir tu prompt aquí...
                    
Ejemplo de estructura:
Rol: Eres un experto en [especialidad]
Contexto: El usuario necesita [descripción del problema]
Tarea: Tu objetivo es [acción específica]
Restricciones: Evita [comportamiento no deseado]
Formato: Responde en [formato específico]"
                    className="w-full h-96 p-6 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 resize-none font-mono text-sm"
                    spellCheck="false"
                  />
                  
                  {/* Contador de caracteres */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-4">
                    <div className="text-xs text-slate-400">
                      {characterCount} caracteres
                    </div>
                    <div className="text-xs text-slate-400">
                      {wordCount} palabras
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={evaluatePrompt}
                    disabled={isEvaluating || prompt.length < 20}
                    className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        Evaluando...
                      </>
                    ) : (
                      <>
                        <span>⚡</span>
                        Evaluar Prompt (Ctrl+E)
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 rounded-lg hover:bg-[#F1F5F9] transition-colors flex items-center gap-2"
                  >
                    <span>📁</span>
                    Cargar Template (Ctrl+T)
                  </button>
                  
                  <button
                    onClick={autoSavePrompt}
                    className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 rounded-lg hover:bg-[#F1F5F9] transition-colors flex items-center gap-2"
                  >
                    <span>💾</span>
                    Guardar (Ctrl+S)
                  </button>
                  
                  <button
                    onClick={() => setPrompt('')}
                    className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <span>🗑️</span>
                    Limpiar
                  </button>
                </div>

                {/* Atajos de teclado */}
                <div className="mt-4 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div className="text-xs text-slate-500 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-white border border-[#E2E8F0] rounded text-xs">Ctrl</kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-white border border-[#E2E8F0] rounded text-xs">S</kbd>
                      <span className="ml-2">Guardar</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-white border border-[#E2E8F0] rounded text-xs">Ctrl</kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-white border border-[#E2E8F0] rounded text-xs">E</kbd>
                      <span className="ml-2">Evaluar</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-white border border-[#E2E8F0] rounded text-xs">Ctrl</kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-white border border-[#E2E8F0] rounded text-xs">T</kbd>
                      <span className="ml-2">Templates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Suggestions */}
            <AnimatePresence>
              {activeSuggestions.length > 0 && (
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-gradient-to-r from-[#FFD166] to-[#FF8E53] rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-[#004B63] mb-4 flex items-center gap-2">
                      <span>💡</span>
                      Sugerencias Activas
                    </h3>
                    
                    <div className="space-y-3">
                      {activeSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-[#004B63] mb-1">
                                {suggestion.type === 'clarity' && 'Mejorar Claridad'}
                                {suggestion.type === 'structure' && 'Mejorar Estructura'}
                                {suggestion.type === 'examples' && 'Agregar Ejemplos'}
                              </div>
                              <p className="text-slate-600 text-sm">{suggestion.text}</p>
                            </div>
                            <button
                              onClick={suggestion.action}
                              className="px-3 py-1 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all text-sm"
                            >
                              Aplicar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Metrics and Evaluation */}
          <div className="lg:col-span-1">
            {/* Metrics Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#004B63] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FFD166] to-[#FF8E53] flex items-center justify-center">
                  <span className="text-white font-bold">📊</span>
                </div>
                Métricas
              </h2>
              
              <div className="space-y-6">
                {/* Readability */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Legibilidad</span>
                    <span className={`text-sm font-bold ${getReadabilityColor()}`}>
                      {getReadabilityLabel()}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${readabilityScore >= 80 ? 'bg-green-500' : readabilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${readabilityScore}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {readabilityScore}/100 - Basado en longitud de oraciones y complejidad
                  </div>
                </div>
                
                {/* Character Count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[#F0F9FF] rounded-xl">
                    <div className="text-3xl font-bold text-[#4DA8C4]">{characterCount}</div>
                    <div className="text-sm text-slate-600 mt-1">Caracteres</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {characterCount < 100 ? 'Muy corto' : characterCount < 500 ? 'Óptimo' : 'Largo'}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-[#F0F9FF] rounded-xl">
                    <div className="text-3xl font-bold text-[#66CCCC]">{wordCount}</div>
                    <div className="text-sm text-slate-600 mt-1">Palabras</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {wordCount < 50 ? 'Breve' : wordCount < 200 ? 'Balanceado' : 'Detallado'}
                    </div>
                  </div>
                </div>
                
                {/* Prompt Health */}
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-3">Salud del Prompt</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Tiene rol definido</span>
                      <span className={`text-sm font-bold ${prompt.includes('Eres') ? 'text-green-500' : 'text-red-500'}`}>
                        {prompt.includes('Eres') ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Tiene tarea clara</span>
                      <span className={`text-sm font-bold ${prompt.includes('tarea') || prompt.includes('task') ? 'text-green-500' : 'text-red-500'}`}>
                        {prompt.includes('tarea') || prompt.includes('task') ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Incluye ejemplos</span>
                      <span className={`text-sm font-bold ${prompt.includes('ejemplo') || prompt.includes('example') ? 'text-green-500' : 'text-red-500'}`}>
                        {prompt.includes('ejemplo') || prompt.includes('example') ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Results */}
            {evaluation && (
              <motion.div 
                className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-[#004B63] mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6B9D] to-[#9D4EDD] flex items-center justify-center">
                    <span className="text-white font-bold">⭐</span>
                  </div>
                  Evaluación
                </h2>
                
                {/* Overall Score */}
                <div className="text-center mb-6">
                  <div className="text-5xl font-black text-[#004B63] mb-2">
                    {evaluation.totalScore}/10
                  </div>
                  <div className={`text-lg font-bold ${
                    evaluation.totalScore >= 8 ? 'text-green-500' :
                    evaluation.totalScore >= 6 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {evaluation.grade}
                  </div>
                </div>
                
                {/* Detailed Scores */}
                <div className="space-y-4">
                  {Object.entries(evaluation.scores).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {category}
                        </span>
                        <span className="text-sm font-bold text-[#004B63]">{score}/10</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            score >= 8 ? 'bg-green-500' :
                            score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Feedback */}
                {evaluation.feedback && evaluation.feedback.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                    <h3 className="font-bold text-[#004B63] mb-3">Feedback</h3>
                    <ul className="space-y-2">
                      {evaluation.feedback.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[#4DA8C4] mt-1">•</span>
                          <span className="text-sm text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Templates Modal */}
        <AnimatePresence>
          {showTemplates && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="p-6 border-b border-[#E2E8F0]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#004B63]">
                      Templates Disponibles
                    </h2>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="text-2xl text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {userTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userTemplates.map(template => (
                        <button
                          key={template.id}
                          onClick={() => loadTemplate(template)}
                          className="text-left p-4 border border-[#E2E8F0] rounded-xl hover:border-[#4DA8C4] hover:shadow-md transition-all"
                        >
                          <div className="font-bold text-[#004B63] mb-2">{template.name}</div>
                          <div className="text-sm text-slate-500 mb-3">{template.description}</div>
                          <div className="text-xs text-slate-400">
                            {template.blocks?.length || 0} bloques • {template.category}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F0F9FF] flex items-center justify-center">
                        <span className="text-2xl text-[#4DA8C4]">📁</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#004B63] mb-2">
                        No hay templates guardados
                      </h3>
                      <p className="text-slate-500">
                        Crea templates en el Prompt Builder para verlos aquí
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RealTimePromptEditor;