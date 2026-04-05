import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Bookmark, Download, Share2, Maximize2, MessageSquare, ThumbsUp, BookOpen, Award, Briefcase, Globe } from 'lucide-react';

const ExpertInterviews = () => {
  const [selectedInterview, setSelectedInterview] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showKeyPoints, setShowKeyPoints] = useState(true);
  const [likedInterviews, setLikedInterviews] = useState([]);
  const [bookmarkedSegments, setBookmarkedSegments] = useState([]);
  const [activeTab, setActiveTab] = useState('interview');
  
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  
  const interviews = [
    {
      id: 1,
      expertName: "Dr. Elena Rodríguez",
      title: "Directora de Investigación en IA",
      company: "Google AI Research",
      experience: "15+ años en ML",
      specialization: "Aprendizaje por Refuerzo",
      interviewTitle: "El Futuro del Aprendizaje Automático",
      duration: "42:18",
      description: "Conversación sobre tendencias emergentes en ML y cómo prepararse para la próxima década",
      videoUrl: "/ialab-resources/interviews/google-ai-future.mp4",
      transcript: "Hoy estamos con la Dra. Elena Rodríguez, directora de investigación en Google AI. Vamos a hablar sobre el futuro del aprendizaje automático...",
      keyPoints: [
        "La importancia de los modelos multimodales",
        "Ética y responsabilidad en IA",
        "Oportunidades de carrera en investigación",
        "Herramientas esenciales para desarrolladores"
      ],
      questions: [
        "¿Cuál es el mayor desafío actual en IA?",
        "¿Cómo ve la evolución de los LLMs?",
        "¿Qué consejo daría a nuevos investigadores?",
        "¿Cuál es el papel de la ética en IA?"
      ],
      resources: [
        "Paper: 'Advances in Reinforcement Learning'",
        "Presentación: 'Future of AI Research'",
        "Lista de recursos recomendados",
        "Contacto para colaboraciones"
      ],
      color: "from-[#2D7A94] to-[#4DA8C4]",
      views: "15.2K",
      likes: "2.4K",
      date: "2024-03-15"
    },
    {
      id: 2,
      expertName: "Carlos Mendoza",
      title: "CTO & Co-founder",
      company: "AI Startup Solutions",
      experience: "12+ años en startups",
      specialization: "IA Aplicada a Negocios",
      interviewTitle: "De la Teoría a la Práctica: Implementando IA en Startups",
      duration: "38:45",
      description: "Estrategias prácticas para implementar soluciones de IA en empresas emergentes",
      videoUrl: "/ialab-resources/interviews/ai-startups-practical.mp4",
      transcript: "Bienvenidos a esta entrevista con Carlos Mendoza, CTO de AI Startup Solutions. Hoy hablaremos sobre cómo llevar la IA del laboratorio al mercado...",
      keyPoints: [
        "MVP con IA: por dónde empezar",
        "Medición de ROI en proyectos de IA",
        "Construcción de equipos multidisciplinarios",
        "Evitando errores comunes"
      ],
      questions: [
        "¿Cuál es el primer paso para una startup que quiere usar IA?",
        "¿Cómo medir el éxito de un proyecto de IA?",
        "¿Qué habilidades busca en un equipo de IA?",
        "¿Cuál ha sido tu mayor aprendizaje?"
      ],
      resources: [
        "Plantilla: Business Case para IA",
        "Checklist: Implementación de IA",
        "Casos de éxito documentados",
        "Red de mentores"
      ],
      color: "from-[#4DA8C4] to-[#66CCCC]",
      views: "12.8K",
      likes: "1.9K",
      date: "2024-03-10"
    },
    {
      id: 3,
      expertName: "Prof. Sarah Chen",
      title: "Profesora de Ciencias de la Computación",
      company: "Stanford University",
      experience: "20+ años en academia",
      specialization: "Educación en IA",
      interviewTitle: "Enseñando IA a la Próxima Generación",
      duration: "51:22",
      description: "Metodologías pedagógicas para enseñar conceptos complejos de IA de manera accesible",
      videoUrl: "/ialab-resources/interviews/teaching-ai-next-gen.mp4",
      transcript: "Hoy tenemos el honor de conversar con la Profesora Sarah Chen de Stanford University. Vamos a explorar cómo enseñar IA efectivamente...",
      keyPoints: [
        "Enfoques pedagógicos para IA",
        "Recursos educativos abiertos",
        "Evaluación de competencias en IA",
        "Preparación para la industria"
      ],
      questions: [
        "¿Cómo hacer la IA accesible para todos?",
        "¿Qué cambió en la enseñanza de IA en la última década?",
        "¿Cómo equilibrar teoría y práctica?",
        "¿Qué recomiendas a educadores?"
      ],
      resources: [
        "Syllabus: Introduction to AI",
        "Kit de actividades prácticas",
        "Lista de proyectos estudiantiles",
        "Recursos de evaluación"
      ],
      color: "from-[#66CCCC] to-[#B2D8E5]",
      views: "18.5K",
      likes: "3.1K",
      date: "2024-03-05"
    },
    {
      id: 4,
      expertName: "Miguel Torres",
      title: "Líder de Ética en IA",
      company: "Microsoft Research",
      experience: "8+ años en ética tecnológica",
      specialization: "IA Responsable",
      interviewTitle: "Ética, Sesgos y Responsabilidad en Sistemas de IA",
      duration: "46:33",
      description: "Discusión profunda sobre los desafíos éticos en el desarrollo e implementación de IA",
      videoUrl: "/ialab-resources/interviews/ai-ethics-responsibility.mp4",
      transcript: "Hoy conversamos con Miguel Torres, líder de ética en IA en Microsoft Research. Un tema crucial en el desarrollo tecnológico actual...",
      keyPoints: [
        "Identificación y mitigación de sesgos",
        "Marco ético para desarrollo de IA",
        "Transparencia y explicabilidad",
        "Responsabilidad en sistemas autónomos"
      ],
      questions: [
        "¿Cómo detectar sesgos en modelos de IA?",
        "¿Qué frameworks éticos recomiendas?",
        "¿Cómo balancear innovación y responsabilidad?",
        "¿Cuál es el futuro de la regulación en IA?"
      ],
      resources: [
        "Guía: Ethical AI Framework",
        "Herramientas de detección de sesgos",
        "Casos de estudio éticos",
        "Checklist de responsabilidad"
      ],
      color: "from-[#B2D8E5] to-[#2D7A94]",
      views: "14.7K",
      likes: "2.2K",
      date: "2024-02-28"
    }
  ];
  
  const currentInterview = interviews[selectedInterview];
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleProgressClick = (e) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleLike = (interviewId) => {
    if (likedInterviews.includes(interviewId)) {
      setLikedInterviews(likedInterviews.filter(id => id !== interviewId));
    } else {
      setLikedInterviews([...likedInterviews, interviewId]);
    }
  };
  
  const addBookmark = () => {
    const newBookmark = {
      id: Date.now(),
      interview: selectedInterview,
      time: currentTime,
      title: `Marcador en ${formatTime(currentTime)}`,
      note: ""
    };
    setBookmarkedSegments([...bookmarkedSegments, newBookmark]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2D7A94] font-montserrat mb-2">
            Entrevistas con Expertos en IA
          </h1>
          <p className="text-gray-600 font-open-sans">
            Aprende directamente de líderes de la industria, investigadores y educadores. Conversaciones profundas sobre tendencias, desafíos y oportunidades en IA.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${currentInterview.color}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Briefcase className="w-5 h-5 text-[#2D7A94]" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 font-montserrat">{currentInterview.expertName}</h2>
                        <p className="text-gray-600 font-open-sans">{currentInterview.title} • {currentInterview.company}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mt-4 font-montserrat">{currentInterview.interviewTitle}</h3>
                    <p className="text-gray-600 mt-2 font-open-sans">{currentInterview.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(currentInterview.id)}
                      className={`flex items-center space-x-1 ${
                        likedInterviews.includes(currentInterview.id)
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      } transition-colors`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium font-open-sans">{currentInterview.likes}</span>
                    </button>
                    <button
                      onClick={addBookmark}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform"
                             onClick={handlePlayPause}>
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <p className="text-white font-open-sans">Haz clic para {isPlaying ? 'pausar' : 'reproducir'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="relative h-2 bg-gray-200 rounded-full mb-2 cursor-pointer" ref={progressRef} onClick={handleProgressClick}>
                      <div 
                        className="absolute h-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 font-open-sans">
                      <span>{formatTime(currentTime)}</span>
                      <span>{currentInterview.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-gray-700" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                      <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                        <SkipBack className="w-5 h-5 text-gray-700" />
                      </button>
                      <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                        <SkipForward className="w-5 h-5 text-gray-700" />
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-gray-600" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-20 accent-[#2D7A94]"
                        />
                      </div>
                      
                      <select
                        value={playbackRate}
                        onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-lg font-open-sans"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1.0">1.0x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2.0">2.0x</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Maximize2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('interview')}
                      className={`pb-3 px-1 font-medium transition-colors ${
                        activeTab === 'interview'
                          ? 'text-[#2D7A94] border-b-2 border-[#2D7A94]'
                          : 'text-gray-500 hover:text-gray-700'
                      } font-open-sans`}
                    >
                      Detalles de la Entrevista
                    </button>
                    <button
                      onClick={() => setActiveTab('transcript')}
                      className={`pb-3 px-1 font-medium transition-colors ${
                        activeTab === 'transcript'
                          ? 'text-[#2D7A94] border-b-2 border-[#2D7A94]'
                          : 'text-gray-500 hover:text-gray-700'
                      } font-open-sans`}
                    >
                      Transcripción
                    </button>
                    <button
                      onClick={() => setActiveTab('resources')}
                      className={`pb-3 px-1 font-medium transition-colors ${
                        activeTab === 'resources'
                          ? 'text-[#2D7A94] border-b-2 border-[#2D7A94]'
                          : 'text-gray-500 hover:text-gray-700'
                      } font-open-sans`}
                    >
                      Recursos
                    </button>
                  </div>
                </div>
                
                {activeTab === 'interview' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3 font-montserrat flex items-center">
                        <Award className="w-5 h-5 mr-2 text-[#2D7A94]" />
                        Puntos Clave de la Conversación
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentInterview.keyPoints.map((point, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                              </div>
                              <p className="text-gray-700 font-open-sans">{point}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3 font-montserrat flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-[#2D7A94]" />
                        Preguntas Realizadas
                      </h4>
                      <div className="space-y-3">
                        {currentInterview.questions.map((question, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full bg-[#B2D8E5] flex items-center justify-center flex-shrink-0">
                                <span className="text-[#2D7A94] font-bold">Q{index + 1}</span>
                              </div>
                              <p className="text-gray-800 font-medium font-open-sans">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-[#2D7A94]" />
                          <span className="text-sm text-gray-600 font-open-sans">Experiencia</span>
                        </div>
                        <p className="font-bold text-gray-800 font-open-sans">{currentInterview.experience}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <BookOpen className="w-4 h-4 text-[#2D7A94]" />
                          <span className="text-sm text-gray-600 font-open-sans">Especialización</span>
                        </div>
                        <p className="font-bold text-gray-800 font-open-sans">{currentInterview.specialization}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Globe className="w-4 h-4 text-[#2D7A94]" />
                          <span className="text-sm text-gray-600 font-open-sans">Visualizaciones</span>
                        </div>
                        <p className="font-bold text-gray-800 font-open-sans">{currentInterview.views}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'transcript' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-800 font-montserrat">Transcripción Completa</h4>
                      <button className="px-4 py-2 bg-[#2D7A94] text-white rounded-lg hover:bg-[#4DA8C4] transition-colors font-open-sans">
                        Descargar PDF
                      </button>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed font-open-sans">
                        {currentInterview.transcript}
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'resources' && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-4 font-montserrat">Recursos del Experto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentInterview.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#B2D8E5] flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-[#2D7A94]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 font-open-sans">{resource}</p>
                              <p className="text-sm text-gray-600 font-open-sans">PDF • Gratuito</p>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-gray-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-open-sans">
                      <Share2 className="w-4 h-4" />
                      <span>Compartir entrevista</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white rounded-lg hover:from-[#4DA8C4] hover:to-[#66CCCC] transition-all font-open-sans">
                      <Download className="w-4 h-4" />
                      <span>Descargar kit completo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {bookmarkedSegments.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Tus Marcadores</h3>
                <div className="space-y-3">
                  {bookmarkedSegments.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 font-open-sans">{bookmark.title}</p>
                        <p className="text-sm text-gray-600 font-open-sans">
                          {interviews[bookmark.interview]?.expertName} • {formatTime(bookmark.time)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedInterview(bookmark.interview);
                          if (videoRef.current) {
                            videoRef.current.currentTime = bookmark.time;
                          }
                        }}
                        className="px-3 py-1 bg-[#2D7A94] text-white rounded-lg hover:bg-[#4DA8C4] transition-colors font-open-sans"
                      >
                        Ir al momento
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Todas las Entrevistas</h3>
              <div className="space-y-4">
                {interviews.map((interview, index) => (
                  <div
                    key={interview.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedInterview === index
                        ? 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedInterview(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium font-open-sans">{interview.company}</span>
                        </div>
                        <h4 className="font-bold font-montserrat">{interview.expertName}</h4>
                        <p className={`text-sm mt-1 ${selectedInterview === index ? 'text-gray-200' : 'text-gray-600'} font-open-sans`}>
                          {interview.interviewTitle}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="flex items-center space-x-1 text-sm font-open-sans">
                            <Clock className="w-3 h-3" />
                            <span>{interview.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-sm font-open-sans">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{interview.likes}</span>
                          </span>
                        </div>
                      </div>
                      {likedInterviews.includes(interview.id) && (
                        <ThumbsUp className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Próximos Expertos</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] flex items-center justify-center">
                      <span className="text-white font-bold">ML</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 font-montserrat">María González</p>
                      <p className="text-sm text-gray-600 font-open-sans">Lead Data Scientist, Netflix</p>
                      <p className="text-xs text-gray-500 font-open-sans">15 de Abril - "IA en Recomendación de Contenido"</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center">
                      <span className="text-white font-bold">AI</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 font-montserrat">Dr. James Wilson</p>
                      <p className="text-sm text-gray-600 font-open-sans">Research Director, OpenAI</p>
                      <p className="text-xs text-gray-500 font-open-sans">22 de Abril - "El Futuro de los LLMs"</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#66CCCC] to-[#B2D8E5] flex items-center justify-center">
                      <span className="text-white font-bold">ET</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 font-montserrat">Emma Thompson</p>
                      <p className="text-sm text-gray-600 font-open-sans">AI Ethics Lead, European Commission</p>
                      <p className="text-xs text-gray-500 font-open-sans">29 de Abril - "Regulación Global de IA"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Sugerencias de Aprendizaje</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Toma notas durante la entrevista sobre conceptos clave
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Investiga más sobre los temas mencionados por el experto
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Conecta los aprendizajes con tus proyectos actuales
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#2D7A94] flex items-center justify-center mt-1 flex-shrink-0">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-sm text-gray-700 font-open-sans">
                    Únete a discusiones en nuestra comunidad sobre cada entrevista
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-open-sans">
            <strong>Metodología VAK:</strong> Estas entrevistas combinan contenido visual (video), auditivo (diálogo) 
            y kinestésico (notas, marcadores, recursos descargables) para un aprendizaje multisensorial completo.
          </p>
        </div>
      </div>
      
      <video
        ref={videoRef}
        src={currentInterview.videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        className="hidden"
      />
    </div>
  );
};

export default ExpertInterviews;