import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import { CheckCircle, Upload, FileText, Clock, Award, Sparkles } from 'lucide-react';

const ActivitySystem = ({ moduleId, moduleTitle, challenge, onActivityComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Cargar estado de actividad desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ialab_completed_activities');
    if (saved) {
      const completedActivities = JSON.parse(saved);
      const activityKey = `a${moduleId}`;
      setIsCompleted(completedActivities.includes(activityKey));
    }
  }, [moduleId]);

  // Cargar submission guardada
  useEffect(() => {
    const savedSubmission = localStorage.getItem(`ialab_activity_submission_${moduleId}`);
    if (savedSubmission) {
      setSubmission(savedSubmission);
    }
  }, [moduleId]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmissionFile(file);
      
      // Leer el archivo como texto para previsualización
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSubmission(event.target.result);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!submission.trim() && !submissionFile) {
      alert('Por favor, escribe tu respuesta o sube un archivo.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Guardar submission
      localStorage.setItem(`ialab_activity_submission_${moduleId}`, submission);
      
      if (submissionFile) {
        // En un sistema real, aquí se subiría el archivo a un servidor
        console.log('Archivo subido:', submissionFile.name);
      }

      // Marcar como completada
      const activityKey = `a${moduleId}`;
      const saved = localStorage.getItem('ialab_completed_activities');
      const completedActivities = saved ? JSON.parse(saved) : [];
      
      if (!completedActivities.includes(activityKey)) {
        const updated = [...completedActivities, activityKey];
        localStorage.setItem('ialab_completed_activities', JSON.stringify(updated));
        setIsCompleted(true);
        
        // Notificar al componente padre
        if (onActivityComplete) {
          onActivityComplete(activityKey);
        }
      }

      // Generar feedback automático
      generateFeedback();

    } catch (error) {
      console.error('Error submitting activity:', error);
      alert('Hubo un error al enviar tu actividad. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateFeedback = () => {
    const feedbacks = [
      "¡Excelente trabajo! Tu solución demuestra una comprensión profunda del tema. Has aplicado correctamente los conceptos clave y presentado una solución bien estructurada.",
      "Muy buena respuesta. Has identificado los elementos principales del desafío y propuesto una solución viable. Considera profundizar en los detalles de implementación.",
      "Buena aproximación al problema. Tu respuesta muestra comprensión de los conceptos básicos. Para mejorar, podrías incluir más ejemplos prácticos y casos de uso específicos.",
      "Interesante enfoque. Has abordado el desafío desde una perspectiva válida. Te sugerimos revisar las mejores prácticas del módulo para optimizar tu solución."
    ];

    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    setFeedback(randomFeedback);
    setShowFeedback(true);
  };

  // Descripciones detalladas por módulo
  const getActivityDescription = () => {
    const descriptions = {
      1: "Esta actividad te desafía a crear un prompt efectivo que guíe a la IA en un debate complejo. Aplica las técnicas de ingeniería de prompts aprendidas: contexto dinámico, zero-shot prompting y chain-of-thought.",
      2: "Diseña un GPT personalizado para un caso de uso específico. Considera function calling, system prompts y optimización para resultados de élite.",
      3: "Realiza una investigación profunda utilizando Gemini. Evalúa fuentes, valida información y sintetiza hallazgos en un formato accionable.",
      4: "Transforma documentos complejos en conocimiento accionable usando Notebook LM. Crea audio overviews y síntesis que faciliten la comprensión.",
      5: "Integra todas las herramientas aprendidas en un proyecto final. Demuestra dominio completo del flujo de trabajo con IA."
    };

    return descriptions[moduleId] || "Aplica los conceptos aprendidos en este módulo para resolver el desafío práctico.";
  };

  // Criterios de evaluación por módulo
  const getEvaluationCriteria = () => {
    const criteria = {
      1: [
        "Claridad y especificidad del prompt",
        "Uso de técnicas avanzadas (CoT, few-shot)",
        "Contextualización adecuada del problema",
        "Estructura lógica y progresiva"
      ],
      2: [
        "Definición clara del caso de uso",
        "Optimización de system prompts",
        "Integración con function calling",
        "Evaluación de resultados"
      ],
      3: [
        "Profundidad de la investigación",
        "Validación de fuentes y fact-checking",
        "Síntesis y organización de información",
        "Aplicabilidad práctica"
      ],
      4: [
        "Curaduría efectiva de fuentes",
        "Calidad de la síntesis documental",
        "Utilidad de los audio overviews",
        "Organización del conocimiento"
      ],
      5: [
        "Integración de múltiples herramientas",
        "Innovación en la solución propuesta",
        "Viabilidad y escalabilidad",
        "Calidad de la presentación final"
      ]
    };

    return criteria[moduleId] || [
      "Aplicación correcta de conceptos",
      "Creatividad en la solución",
      "Estructura y claridad",
      "Viabilidad práctica"
    ];
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta Principal de Actividad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#004B63] to-[#0A3550] rounded-[2rem] p-6 text-white border border-white/10 shadow-[0_8px_32px_rgba(0,75,99,0.2)] relative overflow-hidden"
      >
        {/* Elementos decorativos */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD166] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4DA8C4] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon name="fa-bolt" className="text-[#FFD166]" />
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider">Actividad Práctica</p>
            <h3 className="text-lg font-normal text-white">Módulo {moduleId}: {moduleTitle}</h3>
          </div>
          {isCompleted && (
            <div className="ml-auto bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Completada</span>
            </div>
          )}
        </div>

        {/* Descripción del Desafío */}
        <div className="mb-6 relative z-10">
          <p className="text-white/80 italic text-lg mb-4">"{challenge}"</p>
          <p className="text-white/60 text-sm">{getActivityDescription()}</p>
        </div>

        {/* Estado de Completitud */}
        {isCompleted ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-normal text-white">¡Actividad Completada!</h4>
                <p className="text-white/60 text-sm">Has enviado tu solución correctamente.</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowFeedback(!showFeedback)}
              className="w-full py-3 bg-white/10 text-white rounded-xl font-normal hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="fa-eye" />
              {showFeedback ? 'Ocultar Feedback' : 'Ver Feedback y Solución'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {/* Área de Texto */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Tu Solución:</label>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Describe tu solución al desafío. Incluye detalles, ejemplos y justificaciones..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] min-h-[120px]"
                rows={4}
              />
            </div>

            {/* Subida de Archivos */}
            <div>
              <label className="block text-white/70 text-sm mb-2">O sube un archivo:</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="activity-file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.md,.pdf,.doc,.docx,.jpg,.png"
                />
                <label
                  htmlFor="activity-file"
                  className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {submissionFile ? `Archivo: ${submissionFile.name}` : 'Seleccionar Archivo'}
                </label>
                {submissionFile && (
                  <button
                    onClick={() => setSubmissionFile(null)}
                    className="px-4 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all"
                  >
                    <Icon name="fa-times" />
                  </button>
                )}
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!submission.trim() && !submissionFile)}
              className="w-full py-4 bg-gradient-to-r from-[#FFD166] to-[#FF8E53] text-[#004B63] rounded-xl font-normal hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#004B63] border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Icon name="fa-paper-plane" />
                  Enviar Solución
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>

      {/* Criterios de Evaluación */}
      <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
        <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon name="fa-clipboard-check" className="text-white" />
            </div>
            <div>
              <h3 className="font-normal text-white">Criterios de Evaluación</h3>
              <p className="text-white/70 text-xs">Cómo será evaluada tu solución</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getEvaluationCriteria().map((criterion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="w-6 h-6 bg-[#4DA8C4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4DA8C4] text-sm font-normal">{index + 1}</span>
                </div>
                <p className="text-sm text-[#64748B]">{criterion}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-[#FFD166]/10 rounded-xl border border-[#FFD166]/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#FF8E53]" />
              <p className="text-sm font-normal text-[#004B63]">Consejo para una solución destacada</p>
            </div>
            <p className="text-sm text-[#64748B]">
              Incluye ejemplos concretos, justifica tus decisiones y muestra cómo aplicarías tu solución en un contexto real.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback y Solución Ejemplar */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#66CCCC] to-[#4DA8C4] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="fa-comment-dots" className="text-white" />
              </div>
              <div>
                <h3 className="font-normal text-white">Feedback y Solución Ejemplar</h3>
                <p className="text-white/70 text-xs">Retroalimentación detallada sobre tu entrega</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Feedback Personalizado */}
            <div className="mb-6">
              <h4 className="font-normal text-[#004B63] mb-3">Feedback sobre tu solución:</h4>
              <div className="p-4 bg-[#66CCCC]/10 rounded-xl border border-[#66CCCC]/20">
                <p className="text-[#64748B]">{feedback}</p>
              </div>
            </div>

            {/* Solución Ejemplar */}
            <div>
              <h4 className="font-normal text-[#004B63] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4DA8C4]" />
                Solución Ejemplar de Referencia:
              </h4>
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#4DA8C4] rounded-full mt-2"></div>
                    <p className="text-sm text-[#64748B]">
                      <strong>Enfoque recomendado:</strong> Analizar el problema desde múltiples perspectivas antes de diseñar la solución.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#66CCCC] rounded-full mt-2"></div>
                    <p className="text-sm text-[#64748B]">
                      <strong>Estructura ideal:</strong> Introducción → Análisis → Solución → Validación → Conclusión.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#FFD166] rounded-full mt-2"></div>
                    <p className="text-sm text-[#64748B]">
                      <strong>Elementos clave a incluir:</strong> Contexto claro, justificación técnica, ejemplos prácticos y métricas de éxito.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Puntos de Mejora */}
            <div className="mt-6">
              <h4 className="font-normal text-[#004B63] mb-3 flex items-center gap-2">
                <Icon name="fa-chart-line" className="text-[#4DA8C4]" />
                Puntos para Mejorar:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-sm font-normal text-[#004B63] mb-1">Profundidad Técnica</p>
                  <p className="text-xs text-[#64748B]">Incluir más detalles sobre implementación específica</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-sm font-normal text-[#004B63] mb-1">Originalidad</p>
                  <p className="text-xs text-[#64748B]">Explorar enfoques innovadores no convencionales</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-sm font-normal text-[#004B63] mb-1">Aplicabilidad</p>
                  <p className="text-xs text-[#64748B]">Conectar más directamente con casos de uso reales</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-sm font-normal text-[#004B63] mb-1">Presentación</p>
                  <p className="text-xs text-[#64748B]">Mejorar estructura visual y organización del contenido</p>
                </div>
              </div>
            </div>

            {/* Próximos Pasos */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#004B63]/10 to-[#4DA8C4]/10 rounded-xl border border-[#4DA8C4]/20">
              <h4 className="font-normal text-[#004B63] mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#4DA8C4]" />
                Próximos Pasos Recomendados:
              </h4>
              <ol className="space-y-2 text-sm text-[#64748B] ml-6 list-decimal">
                <li>Revisar los conceptos clave del módulo que necesitan refuerzo</li>
                <li>Practicar con ejercicios adicionales de la sección de recursos</li>
                <li>Consultar con el coach Valerio para dudas específicas</li>
                <li>Avanzar al siguiente módulo aplicando lo aprendido</li>
              </ol>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recursos Adicionales */}
      {!isCompleted && (
        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
          <div className="p-6">
            <h4 className="font-normal text-[#004B63] mb-4 flex items-center gap-2">
              <Icon name="fa-life-ring" className="text-[#4DA8C4]" />
              Recursos de Ayuda:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a href="#" className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-[#4DA8C4] transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="fa-video" className="text-[#4DA8C4] group-hover:text-[#004B63]" />
                  <p className="text-sm font-normal text-[#004B63]">Video Tutorial</p>
                </div>
                <p className="text-xs text-[#64748B]">Revisa el video explicativo del tema</p>
              </a>
              <a href="#" className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-[#4DA8C4] transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="fa-book" className="text-[#4DA8C4] group-hover:text-[#004B63]" />
                  <p className="text-sm font-normal text-[#004B63]">Documentación</p>
                </div>
                <p className="text-xs text-[#64748B]">Accede a la documentación técnica completa</p>
              </a>
              <button
                onClick={() => {
                  // En un sistema real, esto abriría el chat con Valerio
                  alert('Redirigiendo al coach Valerio para asistencia personalizada...');
                }}
                className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-[#4DA8C4] transition-all group text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="fa-comments" className="text-[#4DA8C4] group-hover:text-[#004B63]" />
                  <p className="text-sm font-normal text-[#004B63]">Coach Valerio</p>
                </div>
                <p className="text-xs text-[#64748B]">Consulta dudas específicas con nuestro experto</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySystem;