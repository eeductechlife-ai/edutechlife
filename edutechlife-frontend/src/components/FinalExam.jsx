import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import { CheckCircle, Clock, AlertCircle, Award, FileText, Brain, Terminal, Search, Mic, Trophy } from 'lucide-react';

const FinalExam = ({ onExamComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120 * 60); // 120 minutos en segundos
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Iniciar timer cuando se carga el componente
  useEffect(() => {
    setIsTimerRunning(true);
    
    const timer = setInterval(() => {
      if (isTimerRunning && timeRemaining > 0) {
        setTimeRemaining(prev => prev - 1);
      } else if (timeRemaining === 0) {
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeRemaining]);

  const handleAutoSubmit = () => {
    if (!showResults) {
      alert('¡Tiempo agotado! Tu examen será enviado automáticamente.');
      handleSubmit();
    }
  };

  // Preguntas del examen final (integrando todos los módulos)
  const examSections = [
    {
      id: 1,
      title: 'Ingeniería de Prompts',
      icon: Brain,
      color: '#4DA8C4',
      questions: [
        {
          id: 'q1_1',
          question: '¿Cuál es la principal diferencia entre Zero-Shot y Few-Shot prompting?',
          type: 'multiple-choice',
          options: [
            'Zero-Shot no usa ejemplos, Few-Shot usa algunos ejemplos',
            'Zero-Shot es para texto, Few-Shot para imágenes',
            'Zero-Shot es más rápido, Few-Shot es más preciso',
            'Zero-Shot usa un solo prompt, Few-Shot usa múltiples prompts'
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          id: 'q1_2',
          question: 'Describe cómo implementarías Chain-of-Thought prompting para resolver un problema complejo de lógica.',
          type: 'text',
          maxLength: 500,
          points: 15
        },
        {
          id: 'q1_3',
          question: '¿Qué elementos debe incluir un prompt efectivo según el Mastery Framework?',
          type: 'multiple-select',
          options: [
            'Contexto claro y específico',
            'Instrucciones paso a paso',
            'Ejemplos de entrada/salida',
            'Restricciones y parámetros',
            'Tono y estilo deseado'
          ],
          correctAnswers: [0, 1, 3, 4],
          points: 20
        }
      ]
    },
    {
      id: 2,
      title: 'Potencia ChatGPT',
      icon: Terminal,
      color: '#66CCCC',
      questions: [
        {
          id: 'q2_1',
          question: 'Explica cómo funcionan los GPTs personalizados y cuándo son más efectivos que ChatGPT estándar.',
          type: 'text',
          maxLength: 400,
          points: 15
        },
        {
          id: 'q2_2',
          question: '¿Qué es Function Calling y cómo se integra con APIs externas?',
          type: 'multiple-choice',
          options: [
            'Una forma de llamar funciones de programación dentro del prompt',
            'Un método para que ChatGPT ejecute código en tiempo real',
            'Una técnica para conectar ChatGPT con servicios web externos',
            'Un sistema para optimizar el rendimiento del modelo'
          ],
          correctAnswer: 2,
          points: 10
        },
        {
          id: 'q2_3',
          question: 'Diseña un system prompt para un asistente de análisis de datos que incluya: contexto, capacidades y limitaciones.',
          type: 'text',
          maxLength: 300,
          points: 15
        }
      ]
    },
    {
      id: 3,
      title: 'Gemini Deep Research',
      icon: Search,
      color: '#B2D8E5',
      questions: [
        {
          id: 'q3_1',
          question: '¿Cómo aprovecha Gemini su arquitectura multimodal para investigación profunda?',
          type: 'text',
          maxLength: 350,
          points: 12
        },
        {
          id: 'q3_2',
          question: 'Describe un proceso de fact-checking utilizando Gemini con al menos 3 pasos específicos.',
          type: 'text',
          maxLength: 400,
          points: 18
        },
        {
          id: 'q3_3',
          question: '¿Qué técnicas usarías para validar la credibilidad de fuentes en una investigación con Gemini?',
          type: 'multiple-select',
          options: [
            'Verificar fecha de publicación',
            'Analizar reputación del autor/institución',
            'Comparar con múltiples fuentes',
            'Evaluar sesgo potencial',
            'Revisar metodología utilizada'
          ],
          correctAnswers: [0, 1, 2, 3, 4],
          points: 20
        }
      ]
    },
    {
      id: 4,
      title: 'Notebook LM Mastery',
      icon: Mic,
      color: '#004B63',
      questions: [
        {
          id: 'q4_1',
          question: 'Explica el proceso de curaduría de fuentes en Notebook LM y su importancia para la síntesis de conocimiento.',
          type: 'text',
          maxLength: 300,
          points: 12
        },
        {
          id: 'q4_2',
          question: '¿Cómo generarías un audio overview efectivo a partir de documentos técnicos complejos?',
          type: 'multiple-choice',
          options: [
            'Resumiendo cada sección por separado',
            'Identificando puntos clave y creando un guión narrativo',
            'Usando transcripción automática sin edición',
            'Copiando fragmentos importantes textualmente'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          id: 'q4_3',
          question: 'Describe un flujo de trabajo completo en Notebook LM para transformar 5 papers académicos en conocimiento accionable.',
          type: 'text',
          maxLength: 500,
          points: 20
        }
      ]
    },
    {
      id: 5,
      title: 'Proyecto Integrador',
      icon: Trophy,
      color: '#FFD166',
      questions: [
        {
          id: 'q5_1',
          question: 'Diseña un proyecto que integre al menos 3 de las herramientas aprendidas. Incluye: objetivo, herramientas específicas, flujo de trabajo y métricas de éxito.',
          type: 'text',
          maxLength: 600,
          points: 25
        },
        {
          id: 'q5_2',
          question: '¿Cómo evaluarías la efectividad de tu proyecto integrador y qué ajustes harías basado en los resultados?',
          type: 'text',
          maxLength: 400,
          points: 20
        }
      ]
    }
  ];

  const totalQuestions = examSections.reduce((acc, section) => acc + section.questions.length, 0);
  const maxScore = examSections.reduce((acc, section) => 
    acc + section.questions.reduce((sum, q) => sum + q.points, 0), 0);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    
    examSections.forEach(section => {
      section.questions.forEach(question => {
        const answer = answers[question.id];
        
        if (answer !== undefined) {
          if (question.type === 'multiple-choice') {
            if (answer === question.correctAnswer) {
              totalScore += question.points;
            }
          } else if (question.type === 'multiple-select') {
            // Para selección múltiple, dar puntos parciales
            const correctCount = question.correctAnswers.length;
            const userCorrect = Array.isArray(answer) 
              ? answer.filter(val => question.correctAnswers.includes(val)).length
              : 0;
            
            if (correctCount > 0) {
              totalScore += Math.round((userCorrect / correctCount) * question.points);
            }
          } else if (question.type === 'text') {
            // Para respuestas de texto, dar puntos por completitud
            if (typeof answer === 'string' && answer.trim().length > 50) {
              totalScore += Math.min(question.points, Math.floor(answer.length / 20));
            }
          }
        }
      });
    });
    
    return totalScore;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsTimerRunning(false);
    
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      setShowResults(true);
      
      // Guardar resultados
      const examResults = {
        score: calculatedScore,
        maxScore: maxScore,
        percentage: Math.round((calculatedScore / maxScore) * 100),
        answers: answers,
        submittedAt: new Date().toISOString(),
        timeSpent: 120 * 60 - timeRemaining
      };
      
      localStorage.setItem('ialab_final_exam_results', JSON.stringify(examResults));
      
      // Notificar completitud
      if (onExamComplete && calculatedScore >= maxScore * 0.7) {
        onExamComplete();
      }
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Hubo un error al enviar tu examen. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionProgress = (sectionId) => {
    const section = examSections.find(s => s.id === sectionId);
    if (!section) return 0;
    
    const answered = section.questions.filter(q => answers[q.id] !== undefined).length;
    return Math.round((answered / section.questions.length) * 100);
  };

  const getOverallProgress = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / totalQuestions) * 100);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#10B981', label: 'Excelente' };
    if (percentage >= 80) return { grade: 'A', color: '#4DA8C4', label: 'Muy Bueno' };
    if (percentage >= 70) return { grade: 'B+', color: '#66CCCC', label: 'Bueno' };
    if (percentage >= 60) return { grade: 'B', color: '#FFD166', label: 'Satisfactorio' };
    if (percentage >= 50) return { grade: 'C', color: '#FF8E53', label: 'Aprobado' };
    return { grade: 'F', color: '#FF6B9D', label: 'Reprobado' };
  };

  const currentSectionData = examSections[currentSection];

  return (
    <div className="space-y-6">
      {/* Header del Examen */}
      <div className="bg-gradient-to-br from-[#004B63] to-[#0A3550] rounded-[2rem] p-6 text-white border border-white/10 shadow-[0_8px_32px_rgba(0,75,99,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-[#FFD166]" />
            </div>
            <div>
              <h2 className="text-2xl font-normal text-white font-montserrat">Examen Final Integrador</h2>
              <p className="text-white/70">Demuestra tu dominio completo de las herramientas de IA</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#FFD166]" />
              <span className="text-lg font-mono font-normal">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-sm text-white/60">
              {totalQuestions} preguntas • {maxScore} puntos máx.
            </div>
          </div>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Barra de Progreso y Navegación */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-normal text-[#64748B]">Progreso General</span>
                  <span className="text-sm font-normal text-[#004B63]">{getOverallProgress()}%</span>
                </div>
                <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getOverallProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                  disabled={currentSection === 0}
                  className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-xl hover:bg-[#4DA8C4] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentSection(prev => Math.min(examSections.length - 1, prev + 1))}
                  disabled={currentSection === examSections.length - 1}
                  className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-xl hover:bg-[#4DA8C4] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>

            {/* Navegación por Secciones */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {examSections.map((section, index) => {
                const SectionIcon = section.icon;
                const progress = getSectionProgress(section.id);
                const isCurrent = currentSection === index;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isCurrent
                        ? `border-[${section.color}] bg-[${section.color}]/10`
                        : 'border-[#E2E8F0] hover:border-[#4DA8C4]'
                    }`}
                    style={isCurrent ? { borderColor: section.color, backgroundColor: `${section.color}10` } : {}}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrent ? 'bg-white/20' : `bg-[${section.color}]/20`
                      }`} style={!isCurrent ? { backgroundColor: `${section.color}20` } : {}}>
                        <SectionIcon className={`w-4 h-4 ${isCurrent ? 'text-white' : ''}`} 
                          style={!isCurrent ? { color: section.color } : {}} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs font-normal text-[#004B63] truncate">{section.title}</p>
                        <p className="text-xs text-[#64748B]">{progress}% completado</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sección Actual de Preguntas */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
            <div 
              className="px-6 py-4"
              style={{ background: `linear-gradient(90deg, ${currentSectionData.color}, ${currentSectionData.color}80)` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <currentSectionData.icon className="text-white" />
                </div>
                <div>
                  <h3 className="font-normal text-white">{currentSectionData.title}</h3>
                  <p className="text-white/70 text-xs">
                    Sección {currentSection + 1} de {examSections.length} • {currentSectionData.questions.length} preguntas
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {currentSectionData.questions.map((q, qIndex) => (
                <div key={q.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#4DA8C4]/10 rounded-lg flex items-center justify-center text-[#4DA8C4] font-normal text-sm flex-shrink-0">
                      {qIndex + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-normal text-[#334155] mb-2">{q.question}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#FFD166]/10 text-[#FF8E53] text-xs rounded-full">
                          {q.points} puntos
                        </span>
                        <span className="px-2 py-1 bg-[#66CCCC]/10 text-[#004B63] text-xs rounded-full">
                          {q.type === 'text' ? 'Respuesta extensa' : 
                           q.type === 'multiple-choice' ? 'Selección única' : 
                           q.type === 'multiple-select' ? 'Selección múltiple' : 'Otro'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Campo de respuesta según tipo */}
                  {q.type === 'text' && (
                    <div className="ml-11">
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] resize-none"
                        rows={4}
                        maxLength={q.maxLength}
                      />
                      <div className="flex justify-between mt-2 text-sm text-[#64748B]">
                        <span>Mínimo recomendado: 50 caracteres</span>
                        <span>{answers[q.id]?.length || 0}/{q.maxLength} caracteres</span>
                      </div>
                    </div>
                  )}

                  {q.type === 'multiple-choice' && (
                    <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerChange(q.id, oIndex)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            answers[q.id] === oIndex
                              ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63]'
                              : 'border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              answers[q.id] === oIndex ? 'border-[#4DA8C4] bg-[#4DA8C4]' : 'border-[#E2E8F0]'
                            }`}>
                              {answers[q.id] === oIndex && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'multiple-select' && (
                    <div className="ml-11 space-y-2">
                      {q.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:border-[#4DA8C4] transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Array.isArray(answers[q.id]) ? answers[q.id].includes(oIndex) : false}
                            onChange={(e) => {
                              const current = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                              const newValue = e.target.checked
                                ? [...current, oIndex]
                                : current.filter(idx => idx !== oIndex);
                              handleAnswerChange(q.id, newValue);
                            }}
                            className="w-5 h-5 rounded border-[#E2E8F0] text-[#4DA8C4] focus:ring-[#4DA8C4]"
                          />
                          <span className="text-[#64748B]">{option}</span>
                        </label>
                      ))}
                      <p className="text-sm text-[#64748B] mt-2">
                        Selecciona todas las opciones que consideres correctas.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botón de Envío */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length < totalQuestions * 0.5}
              className="px-8 py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-normal hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                  Procesando Examen...
                </>
              ) : (
                <>
                  <Icon name="fa-paper-plane" className="mr-2" />
                  Enviar Examen Final
                </>
              )}
            </button>
            <p className="text-sm text-[#64748B] mt-3">
              {Object.keys(answers).length}/{totalQuestions} preguntas respondidas
              {Object.keys(answers).length < totalQuestions * 0.5 && 
                ' • Debes responder al menos el 50% para enviar'}
            </p>
          </div>
        </>
      ) : (
        /* Resultados del Examen */
        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
          <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] px-6 py-8 text-center">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-[#FFD166]" />
            </div>
            <h2 className="text-3xl font-normal text-white font-montserrat mb-2">¡Examen Completado!</h2>
            <p className="text-white/70">Has finalizado el examen final integrador</p>
          </div>

          <div className="p-8">
            {/* Puntuación Principal */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="w-48 h-48 rounded-full border-8 border-[#E2E8F0] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-black text-[#004B63] font-montserrat">
                      {Math.round((score / maxScore) * 100)}%
                    </div>
                    <div className="text-lg font-normal text-[#64748B]">
                      {score}/{maxScore} puntos
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  {(() => {
                    const grade = getGrade(Math.round((score / maxScore) * 100));
                    return (
                      <div 
                        className="px-4 py-2 rounded-full text-white font-normal"
                        style={{ backgroundColor: grade.color }}
                      >
                        {grade.grade} - {grade.label}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Desglose por Sección */}
            <div className="mb-8">
              <h3 className="text-xl font-normal text-[#004B63] mb-4 text-center">Desglose por Sección</h3>
              <div className="space-y-4">
                {examSections.map(section => {
                  const sectionScore = section.questions.reduce((sum, q) => {
                    const answer = answers[q.id];
                    if (answer === undefined) return sum;
                    
                    if (q.type === 'multiple-choice') {
                      return sum + (answer === q.correctAnswer ? q.points : 0);
                    } else if (q.type === 'multiple-select') {
                      const correctCount = q.correctAnswers.length;
                      const userCorrect = Array.isArray(answer) 
                        ? answer.filter(val => q.correctAnswers.includes(val)).length
                        : 0;
                      return sum + Math.round((userCorrect / correctCount) * q.points);
                    } else if (q.type === 'text') {
                      return sum + (typeof answer === 'string' && answer.trim().length > 50 
                        ? Math.min(q.points, Math.floor(answer.length / 20)) 
                        : 0);
                    }
                    return sum;
                  }, 0);
                  
                  const sectionMax = section.questions.reduce((sum, q) => sum + q.points, 0);
                  const percentage = sectionMax > 0 ? Math.round((sectionScore / sectionMax) * 100) : 0;
                  
                  return (
                    <div key={section.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${section.color}20` }}>
                            <section.icon className="w-5 h-5" style={{ color: section.color }} />
                          </div>
                          <div>
                            <h4 className="font-normal text-[#004B63]">{section.title}</h4>
                            <p className="text-sm text-[#64748B]">{section.questions.length} preguntas</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-normal text-[#004B63]">{sectionScore}/{sectionMax}</div>
                          <div className="text-sm text-[#64748B]">{percentage}%</div>
                        </div>
                      </div>
                      <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: section.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
                <div className="text-2xl font-normal text-[#004B63]">{Object.keys(answers).length}</div>
                <div className="text-sm text-[#64748B]">Preguntas respondidas</div>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
                <div className="text-2xl font-normal text-[#004B63]">{formatTime(120 * 60 - timeRemaining)}</div>
                <div className="text-sm text-[#64748B]">Tiempo utilizado</div>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
                <div className="text-2xl font-normal text-[#004B63]">
                  {Math.round((Object.keys(answers).length / totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-[#64748B]">Tasa de completitud</div>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
                <div className="text-2xl font-normal text-[#004B63]">
                  {(() => {
                    const percentage = Math.round((score / maxScore) * 100);
                    return percentage >= 70 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
                  })()}
                </div>
                <div className="text-sm text-[#64748B]">Estado final</div>
              </div>
            </div>

            {/* Mensaje Final */}
            <div className={`p-6 rounded-2xl text-center ${
              Math.round((score / maxScore) * 100) >= 70
                ? 'bg-green-50 border border-green-200'
                : Math.round((score / maxScore) * 100) >= 50
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {Math.round((score / maxScore) * 100) >= 70 ? (
                <>
                  <Award className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-normal text-green-800 mb-2">¡Felicidades!</h3>
                  <p className="text-green-700">
                    Has demostrado un dominio excelente de las herramientas de IA. Estás listo para aplicar estos conocimientos en proyectos reales.
                  </p>
                </>
              ) : Math.round((score / maxScore) * 100) >= 50 ? (
                <>
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-xl font-normal text-yellow-800 mb-2">Buen trabajo</h3>
                  <p className="text-yellow-700">
                    Tienes una base sólida. Te recomendamos repasar los módulos donde obtuviste menor puntuación para fortalecer tus habilidades.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h3 className="text-xl font-normal text-red-800 mb-2">Necesitas reforzar</h3>
                  <p className="text-red-700">
                    Te recomendamos revisar completamente el curso y practicar más antes de intentar nuevamente.
                  </p>
                </>
              )}
            </div>

            {/* Acciones */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                onClick={() => {
                  // Reiniciar examen
                  setAnswers({});
                  setShowResults(false);
                  setCurrentSection(0);
                  setTimeRemaining(120 * 60);
                  setIsTimerRunning(true);
                }}
                className="flex-1 py-3 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-xl font-normal hover:bg-[#E2E8F0] transition-all"
              >
                <Icon name="fa-rotate-right" className="mr-2" />
                Reintentar Examen
              </button>
              <button
                onClick={() => {
                  // Descargar certificado o resultados
                  alert('Generando certificado de finalización...');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-normal hover:shadow-lg transition-all"
              >
                <Icon name="fa-download" className="mr-2" />
                Descargar Certificado
              </button>
              <button
                onClick={() => {
                  // Ver respuestas detalladas
                  alert('Mostrando respuestas detalladas y feedback...');
                }}
                className="flex-1 py-3 bg-[#66CCCC] text-white rounded-xl font-normal hover:bg-[#4DA8C4] transition-all"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Ver Respuestas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalExam;