import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../utils/iconMapping.jsx';
import { ChevronLeft, ChevronRight, Download, CheckCircle, Maximize2, X } from 'lucide-react';

const InfographicsGallery = ({ moduleId, moduleTitle, infographicsCount = 3, onInfographicComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedInfographics, setCompletedInfographics] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generar IDs de infografías para este módulo
  const infographicIds = Array.from({ length: infographicsCount }, (_, i) => `i${moduleId}_${i + 1}`);

  // Cargar estado de completitud desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ialab_completed_infographics');
    if (saved) {
      const completed = JSON.parse(saved);
      setCompletedInfographics(completed.filter(id => id.startsWith(`i${moduleId}`)));
    }
    setIsLoading(false);
  }, [moduleId]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % infographicsCount);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + infographicsCount) % infographicsCount);
  };

  const handleComplete = (infographicId) => {
    if (!completedInfographics.includes(infographicId)) {
      const newCompleted = [...completedInfographics, infographicId];
      setCompletedInfographics(newCompleted);
      
      // Guardar en localStorage
      const saved = localStorage.getItem('ialab_completed_infographics');
      const allCompleted = saved ? JSON.parse(saved) : [];
      const updated = [...allCompleted.filter(id => !id.startsWith(`i${moduleId}`)), ...newCompleted];
      localStorage.setItem('ialab_completed_infographics', JSON.stringify(updated));
      
      // Notificar al componente padre
      if (onInfographicComplete) {
        onInfographicComplete(infographicId);
      }
    }
  };

  const handleDownload = () => {
    const infographicId = infographicIds[currentIndex];
    const infographicNumber = currentIndex + 1;
    
    // Crear un enlace de descarga simulado
    const link = document.createElement('a');
    link.href = `/infographics/module-${moduleId}/infographic-${infographicNumber}.pdf`;
    link.download = `Infografia_${moduleId}_${infographicNumber}_${moduleTitle.replace(/\s+/g, '_')}.pdf`;
    link.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Títulos de infografías por módulo
  const getInfographicTitle = (index) => {
    const titlesByModule = {
      1: [
        'Framework de Ingeniería de Prompts',
        'Técnicas Avanzadas: Zero-Shot vs Few-Shot',
        'Chain-of-Thought: Guiando el Razonamiento IA'
      ],
      2: [
        'Arquitectura y Capacidades de ChatGPT',
        'GPTs Personalizados: Creación y Optimización',
        'Function Calling: Integración con APIs'
      ],
      3: [
        'Gemini: Arquitectura Multimodal',
        'Técnicas de Investigación Profunda',
        'Fact-Checking y Validación de Fuentes'
      ],
      4: [
        'Notebook LM: Flujo de Trabajo Documental',
        'Síntesis de Conocimiento y Audio Overviews',
        'Curaduría de Fuentes y Gestión del Conocimiento'
      ],
      5: [
        'Integración de Herramientas de IA',
        'Metodología de Proyecto Final',
        'Presentación y Evaluación de Resultados'
      ]
    };

    return titlesByModule[moduleId]?.[index] || `Infografía ${index + 1}: ${moduleTitle}`;
  };

  // Descripciones por infografía
  const getInfographicDescription = (index) => {
    const descriptions = [
      'Visualiza los conceptos clave y técnicas principales de este tema.',
      'Aprende mediante diagramas y flujos de trabajo optimizados.',
      'Domina las mejores prácticas y casos de estudio reales.'
    ];
    return descriptions[index] || 'Infografía educativa para reforzar el aprendizaje visual.';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#4DA8C4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Galería Principal */}
      <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,75,99,0.06)] rounded-[2rem] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="fa-images" className="text-white" />
              </div>
              <div>
                <h3 className="font-normal text-white">Infografías del Módulo</h3>
                <p className="text-white/70 text-xs">Visualiza y estudia {infographicsCount} infografías especializadas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">
                {completedInfographics.length}/{infographicsCount} completadas
              </span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Navegación y Controles */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center hover:bg-[#4DA8C4] hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <h4 className="font-normal text-[#004B63] text-lg">
                  {getInfographicTitle(currentIndex)}
                </h4>
                <p className="text-[#64748B] text-sm">
                  Infografía {currentIndex + 1} de {infographicsCount}
                </p>
              </div>
              
              <button
                onClick={handleNext}
                className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center hover:bg-[#4DA8C4] hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[#4DA8C4]/10 text-[#004B63] rounded-xl hover:bg-[#4DA8C4]/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-[#66CCCC]/10 text-[#004B63] rounded-xl hover:bg-[#66CCCC]/20 transition-all flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Pantalla Completa
              </button>
            </div>
          </div>

          {/* Vista de Infografía */}
          <div className="relative bg-gradient-to-br from-[#F8FAFC] to-[#E8F4F8] rounded-2xl overflow-hidden border border-[#E2E8F0] min-h-[400px]">
            {/* Placeholder de Infografía - En producción sería una imagen real */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-2xl flex items-center justify-center mb-6">
                <Icon name="fa-chart-bar" className="text-white text-3xl" />
              </div>
              
              <h3 className="text-2xl font-normal text-[#004B63] mb-3 text-center">
                {getInfographicTitle(currentIndex)}
              </h3>
              
              <p className="text-[#64748B] text-center max-w-2xl mb-6">
                {getInfographicDescription(currentIndex)}
              </p>
              
              {/* Elementos visuales de infografía */}
              <div className="grid grid-cols-3 gap-4 max-w-3xl w-full">
                <div className="bg-white/80 rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
                  <div className="h-32 bg-gradient-to-r from-[#4DA8C4]/20 to-[#66CCCC]/20 rounded-lg mb-3"></div>
                  <p className="text-sm font-normal text-[#004B63]">Diagrama Conceptual</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
                  <div className="h-32 bg-gradient-to-r from-[#FFD166]/20 to-[#FF8E53]/20 rounded-lg mb-3"></div>
                  <p className="text-sm font-normal text-[#004B63]">Flujo de Trabajo</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
                  <div className="h-32 bg-gradient-to-r from-[#004B63]/20 to-[#4DA8C4]/20 rounded-lg mb-3"></div>
                  <p className="text-sm font-normal text-[#004B63]">Casos de Estudio</p>
                </div>
              </div>
            </div>
            
            {/* Overlay de Completitud */}
            {completedInfographics.includes(infographicIds[currentIndex]) && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-normal">Completada</span>
              </div>
            )}
          </div>

          {/* Indicadores de Progreso */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-normal text-[#64748B]">Progreso de Infografías</span>
              <span className="text-sm font-normal text-[#004B63]">
                {completedInfographics.length}/{infographicsCount}
              </span>
            </div>
            <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedInfographics.length / infographicsCount) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Miniaturas */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {infographicIds.map((id, index) => (
              <button
                key={id}
                onClick={() => setCurrentIndex(index)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  currentIndex === index
                    ? 'border-[#4DA8C4] bg-[#4DA8C4]/10'
                    : 'border-[#E2E8F0] hover:border-[#4DA8C4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    completedInfographics.includes(id)
                      ? 'bg-green-500 text-white'
                      : 'bg-[#F8FAFC] text-[#64748B]'
                  }`}>
                    {completedInfographics.includes(id) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-normal">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-normal text-[#004B63] truncate">
                      {getInfographicTitle(index)}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {completedInfographics.includes(id) ? 'Completada' : 'Por estudiar'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Botón de Completar */}
          {!completedInfographics.includes(infographicIds[currentIndex]) && (
            <div className="mt-6 text-center">
              <button
                onClick={() => handleComplete(infographicIds[currentIndex])}
                className="px-8 py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-normal hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <CheckCircle className="w-5 h-5" />
                Marcar como Completada
              </button>
              <p className="text-sm text-[#64748B] mt-2">
                Estudia la infografía y marca como completada para avanzar en tu progreso.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={toggleFullscreen}
          >
            <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#004B63] to-[#4DA8C4] px-6 py-4">
                  <h3 className="text-xl font-normal text-white text-center">
                    {getInfographicTitle(currentIndex)} - Vista Completa
                  </h3>
                </div>
                
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                  {/* Contenido de infografía en fullscreen */}
                  <div className="bg-gradient-to-br from-[#F8FAFC] to-[#E8F4F8] rounded-2xl p-8 border border-[#E2E8F0]">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-2xl flex items-center justify-center mb-8">
                        <Icon name="fa-chart-bar" className="text-white text-5xl" />
                      </div>
                      
                      <h2 className="text-3xl font-normal text-[#004B63] mb-4 text-center">
                        {getInfographicTitle(currentIndex)}
                      </h2>
                      
                      <p className="text-lg text-[#64748B] text-center max-w-4xl mb-8">
                        {getInfographicDescription(currentIndex)}
                      </p>
                      
                      {/* Contenido expandido */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                            <h4 className="font-normal text-[#004B63] text-lg mb-3">Conceptos Clave</h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-[#4DA8C4] rounded-full mt-2"></div>
                                <span className="text-[#64748B]">Fundamentos teóricos y definiciones</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-[#66CCCC] rounded-full mt-2"></div>
                                <span className="text-[#64748B]">Aplicaciones prácticas y casos de uso</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-[#FFD166] rounded-full mt-2"></div>
                                <span className="text-[#64748B]">Mejores prácticas y recomendaciones</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                            <h4 className="font-normal text-[#004B63] text-lg mb-3">Beneficios</h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-green-500 mt-1" />
                                <span className="text-[#64748B]">Aprendizaje visual acelerado</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-green-500 mt-1" />
                                <span className="text-[#64748B]">Retención mejorada de conceptos</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-green-500 mt-1" />
                                <span className="text-[#64748B]">Referencia rápida para proyectos</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                            <h4 className="font-normal text-[#004B63] text-lg mb-3">Pasos de Aplicación</h4>
                            <ol className="space-y-3 list-decimal list-inside">
                              <li className="text-[#64748B]">Revisar la estructura conceptual</li>
                              <li className="text-[#64748B]">Identificar elementos clave</li>
                              <li className="text-[#64748B]">Aplicar a tu contexto específico</li>
                              <li className="text-[#64748B]">Iterar y optimizar según resultados</li>
                            </ol>
                          </div>
                          
                          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
                            <h4 className="font-normal text-[#004B63] text-lg mb-3">Recursos Adicionales</h4>
                            <div className="space-y-2">
                              <a href="#" className="flex items-center gap-2 text-[#4DA8C4] hover:text-[#004B63]">
                                <Icon name="fa-external-link" />
                                <span>Video tutorial complementario</span>
                              </a>
                              <a href="#" className="flex items-center gap-2 text-[#4DA8C4] hover:text-[#004B63]">
                                <Icon name="fa-download" />
                                <span>Plantilla descargable</span>
                              </a>
                              <a href="#" className="flex items-center gap-2 text-[#4DA8C4] hover:text-[#004B63]">
                                <Icon name="fa-book" />
                                <span>Documentación técnica</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-8 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2 bg-[#4DA8C4]/10 text-[#004B63] rounded-xl hover:bg-[#4DA8C4]/20 transition-all flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-[#4DA8C4] text-white rounded-xl hover:bg-[#004B63] transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Infografía
                    </button>
                    
                    {!completedInfographics.includes(infographicIds[currentIndex]) && (
                      <button
                        onClick={() => handleComplete(infographicIds[currentIndex])}
                        className="px-4 py-2 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marcar como Completada
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-[#4DA8C4]/10 text-[#004B63] rounded-xl hover:bg-[#4DA8C4]/20 transition-all flex items-center gap-2"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfographicsGallery;