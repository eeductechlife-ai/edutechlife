import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMultimediaAnalytics } from '../utils/multimediaAnalytics';

// Componente memoizado para tarjetas de video
const VideoCard = memo(({ video, index, isActive, isCompleted, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
        isActive
          ? 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white'
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCompleted
              ? 'bg-green-100 text-green-600'
              : isActive
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {isCompleted ? '✓' : index + 1}
          </div>
          <div>
            <p className="font-medium font-montserrat">{video.title}</p>
            <p className={`text-sm ${isActive ? 'text-gray-200' : 'text-gray-600'} font-open-sans`}>
              {video.duration}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-open-sans">{video.duration}</span>
        </div>
      </div>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';

// Componente memoizado para módulos
const ModuleCard = memo(({ module, index, isActive, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] ${
        isActive
          ? 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white shadow-xl'
          : 'bg-white hover:bg-gray-50 shadow-lg'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isActive ? 'bg-white/20' : 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4]'
            }`}>
              <span className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-white'}`}>
                {module.id}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-montserrat">{module.title}</h3>
              <p className={`text-sm ${isActive ? 'text-gray-200' : 'text-gray-600'} font-open-sans`}>
                {module.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {module.topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-700'
                } font-open-sans`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg font-montserrat">{module.videos.length} videos</p>
          <p className="text-sm opacity-75 font-open-sans">5-10 min c/u</p>
        </div>
      </div>
    </motion.div>
  );
});

ModuleCard.displayName = 'ModuleCard';

const MicroVideos = () => {
  const [activeModule, setActiveModule] = useState(1);
  const [activeVideo, setActiveVideo] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [notes, setNotes] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  
  const videoRef = useRef(null);

  // Estructura de micro-videos por módulo (5-10 minutos cada uno)
  const videoModules = [
    {
      id: 1,
      title: 'Módulo 1: Ingeniería de Prompts Avanzada',
      color: '#4DA8C4',
      videos: [
        {
          id: 'm1v1',
          title: 'Introducción a Chain-of-Thought Prompting',
          duration: '5:30',
          description: 'Aprende la técnica más poderosa para prompts complejos',
          youtubeId: 'w3e1H8Qqg_c',
          transcript: `En este video aprenderás Chain-of-Thought Prompting, una técnica que permite a los modelos de IA desglosar problemas complejos en pasos lógicos.

1. ¿Qué es Chain-of-Thought?
   - Técnica que guía a la IA paso a paso
   - Mejora la precisión en problemas complejos
   - Reduce errores de razonamiento

2. Ejemplo práctico:
   En lugar de: "Resuelve este problema matemático"
   Usa: "Paso 1: Identifica las variables. Paso 2: Aplica la fórmula. Paso 3: Verifica el resultado"

3. Casos de uso:
   - Análisis de datos complejos
   - Solución de problemas técnicos
   - Toma de decisiones estratégicas`,
          keyPoints: [
            'Chain-of-Thought mejora la precisión en 40%',
            'Ideal para problemas que requieren razonamiento paso a paso',
            'Reduce alucinaciones de la IA'
          ]
        },
        {
          id: 'm1v2',
          title: 'MasterPrompt: La Plantilla Definitiva',
          duration: '7:15',
          description: 'Crea prompts profesionales reutilizables',
          youtubeId: 'dQw4w9WgXcQ',
          transcript: `El MasterPrompt es una plantilla estructurada que garantiza resultados consistentes y profesionales.

Estructura del MasterPrompt:
1. ROL: Define la identidad del asistente
2. CONTEXTO: Establece el escenario y restricciones
3. TAREA: Especifica la acción principal
4. FORMATO: Define cómo debe responder
5. EJEMPLOS: Proporciona casos de referencia

Beneficios:
- Consistencia en resultados
- Fácil de modificar y reutilizar
- Reduce tiempo de desarrollo`,
          keyPoints: [
            'Estructura de 5 componentes esenciales',
            'Ahorra 70% del tiempo en desarrollo de prompts',
            'Garantiza resultados profesionales'
          ]
        },
        {
          id: 'm1v3',
          title: 'Few-Shot Learning en la Práctica',
          duration: '6:45',
          description: 'Cómo entrenar IA con ejemplos mínimos',
          youtubeId: 'jC6yDqBChCw',
          transcript: `Few-Shot Learning permite entrenar modelos con muy pocos ejemplos.

Técnicas:
1. Zero-Shot: Sin ejemplos
2. One-Shot: Un ejemplo
3. Few-Shot: 2-5 ejemplos

Mejores prácticas:
- Selecciona ejemplos representativos
- Varía los casos de uso
- Incluye casos límite`,
          keyPoints: [
            'Efectivo con solo 3-5 ejemplos',
            'Reduce necesidad de datos masivos',
            'Ideal para nichos específicos'
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Módulo 2: Potencia ChatGPT',
      color: '#66CCCC',
      videos: [
        {
          id: 'm2v1',
          title: 'GPTs Personalizados: De Cero a Héroe',
          duration: '8:20',
          description: 'Crea asistentes especializados desde cero',
          youtubeId: '7h6gS7bwVys',
          transcript: `Los GPTs personalizados son versiones especializadas de ChatGPT para tareas específicas.

Pasos para crear un GPT:
1. Define el propósito específico
2. Configura las instrucciones del sistema
3. Agrega conocimientos especializados
4. Configura acciones y APIs
5. Prueba y refina

Casos de éxito:
- Asistente legal para contratos
- Tutor de matemáticas
- Analista de datos financieros`,
          keyPoints: [
            'Puedes crear GPTs sin programación',
            'Integración con APIs externas',
            'Compartibles y monetizables'
          ]
        },
        {
          id: 'm2v2',
          title: 'Function Calling Avanzado',
          duration: '9:10',
          description: 'Conecta ChatGPT con el mundo real',
          youtubeId: 'dQw4w9WgXcQ',
          transcript: `Function Calling permite que ChatGPT interactúe con sistemas externos.

Aplicaciones:
1. Consultas a bases de datos
2. Automatización de workflows
3. Integración con herramientas empresariales

Implementación:
- Define funciones claramente
- Maneja errores adecuadamente
- Valida inputs y outputs`,
          keyPoints: [
            'Convierte ChatGPT en un asistente activo',
            'Automatiza procesos complejos',
            'Requiere planificación cuidadosa'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Módulo 3: Rastreo Profundo',
      color: '#B2D8E5',
      videos: [
        {
          id: 'm3v1',
          title: 'Metodología Deep Research',
          duration: '10:00',
          description: 'Técnicas de investigación profunda con IA',
          youtubeId: 'w3e1H8Qqg_c',
          transcript: `Deep Research combina múltiples fuentes y técnicas para investigación exhaustiva.

Metodología:
1. Búsqueda estratificada
2. Validación cruzada
3. Síntesis de información
4. Generación de insights

Herramientas:
- Búsqueda web en tiempo real
- Análisis de documentos
- Comparación de fuentes`,
          keyPoints: [
            'Reduce tiempo de investigación en 80%',
            'Mayor precisión que métodos tradicionales',
            'Ideal para due diligence'
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Módulo 4: NotebookLM y Podcasts',
      color: '#FF8E53',
      videos: [
        {
          id: 'm4v1',
          title: 'NotebookLM para Investigación Académica',
          duration: '7:30',
          description: 'Organiza y analiza investigación con IA',
          youtubeId: 'jC6yDqBChCw',
          transcript: `NotebookLM es una herramienta de Google para investigación asistida por IA.

Características:
- Análisis de documentos múltiples
- Generación de resúmenes
- Preguntas y respuestas contextuales
- Síntesis de información

Flujo de trabajo:
1. Carga tus documentos
2. Haz preguntas específicas
3. Genera resúmenes automáticos
4. Exporta insights`,
          keyPoints: [
            'Analiza múltiples formatos (PDF, DOC, TXT)',
            'Mantiene el contexto entre documentos',
            'Ideal para tesis y papers'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Módulo 5: Proyecto Final',
      color: '#FFD166',
      videos: [
        {
          id: 'm5v1',
          title: 'De Idea a Pitch Deck en 7 Días',
          duration: '9:45',
          description: 'Estructura tu proyecto y crea presentaciones impactantes',
          youtubeId: '7h6gS7bwVys',
          transcript: `Transforma tu idea en un proyecto presentable profesionalmente.

Roadmap de 7 días:
Día 1: Validación de idea
Día 2: Investigación de mercado
Día 3: Definición de MVP
Día 4: Desarrollo de prototipo
Día 5: Creación de pitch deck
Día 6: Práctica de presentación
Día 7: Feedback y refinamiento

Elementos clave del pitch:
- Problema y solución
- Mercado y competencia
- Modelo de negocio
- Equipo y roadmap`,
          keyPoints: [
            'Estructura probada para startups',
            'Incluye templates descargables',
            'Enfoque práctico y realista'
          ]
        }
      ]
    }
  ];

  const currentModule = videoModules.find(m => m.id === activeModule);
  const currentVideo = currentModule?.videos[activeVideo];

  useEffect(() => {
    // Cargar progreso desde localStorage
    const savedProgress = localStorage.getItem('ialab_video_progress');
    const savedNotes = localStorage.getItem('ialab_video_notes');
    const savedCompleted = localStorage.getItem('ialab_completed_videos');
    
    if (savedProgress) setVideoProgress(JSON.parse(savedProgress));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedCompleted) setCompletedVideos(JSON.parse(savedCompleted));
  }, []);

  useEffect(() => {
    // Guardar progreso en localStorage
    localStorage.setItem('ialab_video_progress', JSON.stringify(videoProgress));
    localStorage.setItem('ialab_video_notes', JSON.stringify(notes));
    localStorage.setItem('ialab_completed_videos', JSON.stringify(completedVideos));
  }, [videoProgress, notes, completedVideos]);

  const handleVideoEnd = useCallback(() => {
    const videoId = currentVideo?.id;
    if (videoId && !completedVideos.includes(videoId)) {
      const newCompleted = [...completedVideos, videoId];
      setCompletedVideos(newCompleted);
      localStorage.setItem('ialab_completed_videos', JSON.stringify(newCompleted));
      
      // Track completion in analytics
      const analytics = getMultimediaAnalytics();
      analytics.trackContentCompletion('microvideo', videoId, 600); // 10 minutos estimados
      analytics.trackContentInteraction('microvideo', videoId, 'completed', {
        moduleId: activeModule,
        videoTitle: currentVideo?.title
      });
    }
  }, [currentVideo, completedVideos, activeModule]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && currentVideo) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(prev => ({
        ...prev,
        [currentVideo.id]: progress
      }));
    }
  }, [currentVideo]);

  const handleSpeedChange = useCallback((speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, []);

  const handleNoteSave = useCallback((videoId, noteText) => {
    if (noteText.trim()) {
      const videoNotes = notes[videoId] || [];
      const newNote = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toLocaleString()
      };
      const updatedNotes = { ...notes, [videoId]: [...videoNotes, newNote] };
      setNotes(updatedNotes);
      localStorage.setItem('ialab_video_notes', JSON.stringify(updatedNotes));
      
      // Track note creation in analytics
      const analytics = getMultimediaAnalytics();
      analytics.trackNoteCreation('microvideo', videoId, noteText.length);
    }
  }, [notes]);

  const handleNoteDelete = useCallback((videoId, noteId) => {
    const videoNotes = notes[videoId] || [];
    const updatedVideoNotes = videoNotes.filter(note => note.id !== noteId);
    const updatedNotes = { ...notes, [videoId]: updatedVideoNotes };
    setNotes(updatedNotes);
    localStorage.setItem('ialab_video_notes', JSON.stringify(updatedNotes));
  }, [notes]);

  const getModuleProgress = useCallback((moduleId) => {
    const moduleVideos = videoModules.find(m => m.id === moduleId)?.videos || [];
    const completedModuleVideos = moduleVideos.filter(v => completedVideos.includes(v.id));
    return (completedModuleVideos.length / moduleVideos.length) * 100;
  }, [completedVideos]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const handleVideoSelect = useCallback((moduleId, videoIndex) => {
    const analytics = getMultimediaAnalytics();
    
    // Track video selection
    if (currentVideo) {
      analytics.trackContentInteraction('microvideo', currentVideo.id, 'viewed', {
        moduleId: activeModule,
        duration: 0, // Se actualizará con el tiempo real
        progress: videoProgress[currentVideo.id] || 0
      });
    }
    
    setActiveModule(moduleId);
    setActiveVideo(videoIndex);
    
    // Track new video selection
    const newVideo = videoModules.find(m => m.id === moduleId)?.videos[videoIndex];
    if (newVideo) {
      analytics.trackContentInteraction('microvideo', newVideo.id, 'selected', {
        moduleId,
        videoIndex
      });
    }
  }, [currentVideo, activeModule, videoProgress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E2E8F0] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#004B63] font-montserrat mb-3">
            Micro-Videos Educativos
          </h1>
          <p className="text-lg text-slate-600">
            Videos cortos (5-10 minutos) para aprendizaje rápido y efectivo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Modules List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6">
              <h2 className="text-2xl font-bold text-[#004B63] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                  <span className="text-white font-bold">🎬</span>
                </div>
                Módulos
              </h2>
              
              <div className="space-y-4">
                {videoModules.map(module => {
                  const progress = getModuleProgress(module.id);
                  return (
                     <button
                      key={module.id}
                      onClick={() => handleVideoSelect(module.id, 0)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${activeModule === module.id ? 'border-[#4DA8C4] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#4DA8C4]'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-[#004B63]">Módulo {module.id}</div>
                        <div className="text-sm text-slate-500">
                          {module.videos.length} videos
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {module.title}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Progreso</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: module.color }}
                        />
                        <span>{module.videos.reduce((total, v) => total + parseInt(v.duration.split(':')[0]), 0)} min total</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#4DA8C4]">
                      {videoModules.reduce((total, m) => total + m.videos.length, 0)}
                    </div>
                    <div className="text-sm text-slate-600">Videos totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#66CCCC]">
                      {completedVideos.length}
                    </div>
                    <div className="text-sm text-slate-600">Completados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
              {/* Video Header */}
              <div className="p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-[#F0F9FF]">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-[#004B63] mb-2">
                      {currentVideo?.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Duración: {currentVideo?.duration}</span>
                      <span>•</span>
                      <span>Módulo {activeModule}</span>
                      {completedVideos.includes(currentVideo?.id) && (
                        <>
                          <span>•</span>
                          <span className="text-green-500 font-bold">✅ Completado</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Playback Speed */}
                    <div className="relative group">
                      <button className="px-3 py-1 bg-[#F1F5F9] text-slate-600 rounded-lg text-sm">
                        {playbackSpeed}x
                      </button>
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-[#E2E8F0] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`w-full px-4 py-2 text-left hover:bg-[#F8FAFC] ${playbackSpeed === speed ? 'text-[#4DA8C4] font-bold' : 'text-slate-600'}`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Transcript Toggle */}
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className={`px-3 py-1 rounded-lg text-sm ${showTranscript ? 'bg-[#4DA8C4] text-white' : 'bg-[#F1F5F9] text-slate-600'}`}
                    >
                      Transcripción
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="p-6">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-6">
                  <iframe
                    ref={videoRef}
                    src={`https://www.youtube.com/embed/${currentVideo?.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                    title={currentVideo?.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onEnded={handleVideoEnd}
                    onTimeUpdate={handleTimeUpdate}
                  />
                  
                  {/* Progress Overlay */}
                  {videoProgress[currentVideo?.id] > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
                      <div 
                        className="h-full bg-[#4DA8C4]"
                        style={{ width: `${videoProgress[currentVideo?.id] || 0}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Video Description */}
                <div className="mb-6">
                  <p className="text-slate-600">{currentVideo?.description}</p>
                </div>

                {/* Key Points */}
                <div className="mb-6">
                  <h3 className="font-bold text-[#004B63] mb-3 flex items-center gap-2">
                    <span>🔑</span>
                    Puntos Clave
                  </h3>
                  <ul className="space-y-2">
                    {currentVideo?.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#4DA8C4]/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-[#4DA8C4] text-sm">{index + 1}</span>
                        </div>
                        <span className="text-slate-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setActiveVideo(Math.max(0, activeVideo - 1))}
                    disabled={activeVideo === 0}
                    className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 rounded-lg hover:bg-[#F1F5F9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="text-sm text-slate-500">
                    Video {activeVideo + 1} de {currentModule?.videos.length}
                  </div>
                  
                  <button
                    onClick={() => setActiveVideo(Math.min(currentModule.videos.length - 1, activeVideo + 1))}
                    disabled={activeVideo === currentModule.videos.length - 1}
                    className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6">
              <h3 className="text-xl font-bold text-[#004B63] mb-4 flex items-center gap-2">
                <span>📝</span>
                Mis Notas
              </h3>
              
              {/* Add Note */}
              <div className="mb-6">
                <textarea
                  placeholder="Escribe tus notas sobre este video..."
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 resize-none"
                  rows="3"
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      handleNoteSave(currentVideo?.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-slate-400">
                    Presiona Ctrl+Enter para guardar
                  </div>
                  <button
                    onClick={(e) => {
                      const textarea = e.target.previousElementSibling;
                      handleNoteSave(currentVideo?.id, textarea.value);
                      textarea.value = '';
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-lg hover:shadow-md transition-all text-sm"
                  >
                    Guardar Nota
                  </button>
                </div>
              </div>
              
              {/* Existing Notes */}
              <AnimatePresence>
                {notes[currentVideo?.id]?.length > 0 ? (
                  <div className="space-y-4">
                    {notes[currentVideo?.id].map(note => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm text-slate-500">
                            {new Date(note.timestamp).toLocaleDateString()} • {formatTime(note.videoTime)}
                          </div>
                          <button
                            onClick={() => handleNoteDelete(currentVideo?.id, note.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-slate-700">{note.text}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F0F9FF] flex items-center justify-center">
                      <span className="text-2xl text-[#4DA8C4]">📝</span>
                    </div>
                    <p>No hay notas para este video aún</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Video List and Transcript */}
          <div className="lg:col-span-1">
            {/* Video List */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6 mb-6">
              <h3 className="text-xl font-bold text-[#004B63] mb-4 flex items-center gap-2">
                <span>🎥</span>
                Videos del Módulo
              </h3>
              
              <div className="space-y-3">
                {currentModule?.videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${activeVideo === index ? 'border-[#4DA8C4] bg-[#F0F9FF]' : 'border-[#E2E8F0] hover:border-[#4DA8C4]'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-[#004B63]">{video.title}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{video.duration}</span>
                        {completedVideos.includes(video.id) && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{video.description}</p>
                    
                    {/* Progress Indicator */}
                    {videoProgress[video.id] > 0 && (
                      <div className="mt-3">
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                            style={{ width: `${videoProgress[video.id]}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript Panel */}
            <AnimatePresence>
              {showTranscript && currentVideo && (
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#004B63] flex items-center gap-2">
                      <span>📄</span>
                      Transcripción
                    </h3>
                    <button
                      onClick={() => setShowTranscript(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans">
                      {currentVideo.transcript}
                    </pre>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => {
                        const blob = new Blob([currentVideo.transcript], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `transcripcion-${currentVideo.title}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-600 rounded-lg hover:bg-[#F1F5F9] transition-colors text-sm"
                    >
                      Descargar Transcripción
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-[#004B63] to-[#2D7A94] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span>💡</span>
              Consejos para Aprendizaje con Micro-Videos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">1. Ajusta la Velocidad</h3>
                <p className="text-white/80 text-sm">
                  Usa 1.25x o 1.5x para contenido familiar. Reduce a 0.75x para conceptos complejos.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">2. Toma Notas Activas</h3>
                <p className="text-white/80 text-sm">
                  Escribe preguntas y conexiones. Usa el timestamp para referencias futuras.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">3. Aplica Inmediatamente</h3>
                <p className="text-white/80 text-sm">
                  Después de cada video, practica la técnica aprendida en un caso real.
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white/80 text-sm">
                <span className="font-bold">Metodología VAK aplicada:</span> Cada video combina elementos visuales (diagramas), auditivos (explicación) y kinestésicos (ejercicios prácticos) para maximizar el aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroVideos;