import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Bookmark, Download, Share2, Maximize2, Moon } from 'lucide-react';

const AudioGuides = () => {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [completedAudios, setCompletedAudios] = useState([]);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  
  const audioModules = [
    {
      id: 1,
      title: "Fundamentos de IA",
      description: "Conceptos básicos y terminología esencial",
      color: "from-[#2D7A94] to-[#4DA8C4]",
      audios: [
        {
          id: 1,
          title: "¿Qué es la Inteligencia Artificial?",
          duration: "18:45",
          description: "Introducción a los conceptos fundamentales de IA",
          audioUrl: "/ialab-resources/audio/fundamentos-ia-1.mp3",
          transcript: "La inteligencia artificial es el campo de la informática que se centra en crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana..."
        },
        {
          id: 2,
          title: "Machine Learning vs Deep Learning",
          duration: "22:30",
          description: "Diferencias clave entre estos dos enfoques",
          audioUrl: "/ialab-resources/audio/fundamentos-ia-2.mp3",
          transcript: "El machine learning es un subconjunto de la IA que permite a los sistemas aprender de datos sin ser programados explícitamente..."
        },
        {
          id: 3,
          title: "Tipos de Aprendizaje Automático",
          duration: "25:15",
          description: "Supervisado, no supervisado y por refuerzo",
          audioUrl: "/ialab-resources/audio/fundamentos-ia-3.mp3",
          transcript: "Existen tres tipos principales de aprendizaje automático: supervisado, no supervisado y por refuerzo..."
        }
      ]
    },
    {
      id: 2,
      title: "Prompt Engineering Avanzado",
      description: "Técnicas profesionales para prompts efectivos",
      color: "from-[#4DA8C4] to-[#66CCCC]",
      audios: [
        {
          id: 4,
          title: "Estructura de Prompts Profesionales",
          duration: "28:20",
          description: "Cómo estructurar prompts para resultados óptimos",
          audioUrl: "/ialab-resources/audio/prompt-engineering-1.mp3",
          transcript: "Un prompt profesional debe incluir contexto, instrucciones específicas, ejemplos y restricciones..."
        },
        {
          id: 5,
          title: "Técnicas de Iteración y Refinamiento",
          duration: "24:45",
          description: "Mejorar resultados mediante iteraciones",
          audioUrl: "/ialab-resources/audio/prompt-engineering-2.mp3",
          transcript: "El proceso de iteración es fundamental en prompt engineering. Comienza con un prompt básico y refina basándote en los resultados..."
        }
      ]
    },
    {
      id: 3,
      title: "Aplicaciones Prácticas",
      description: "Casos reales de implementación de IA",
      color: "from-[#66CCCC] to-[#B2D8E5]",
      audios: [
        {
          id: 6,
          title: "IA en Marketing Digital",
          duration: "32:10",
          description: "Cómo usar IA para estrategias de marketing",
          audioUrl: "/ialab-resources/audio/aplicaciones-1.mp3",
          transcript: "La IA está revolucionando el marketing digital mediante personalización, análisis predictivo y automatización..."
        },
        {
          id: 7,
          title: "Automatización de Procesos",
          duration: "29:35",
          description: "Automatizar tareas repetitivas con IA",
          audioUrl: "/ialab-resources/audio/aplicaciones-2.mp3",
          transcript: "La automatización de procesos con IA puede aumentar la eficiencia en un 40-60% en tareas repetitivas..."
        }
      ]
    }
  ];
  
  const currentAudioData = audioModules[currentModule]?.audios[currentAudio];
  
  useEffect(() => {
    const savedProgress = localStorage.getItem('audioGuidesProgress');
    if (savedProgress) {
      setCompletedAudios(JSON.parse(savedProgress));
    }
  }, []);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);
  
  useEffect(() => {
    localStorage.setItem('audioGuidesProgress', JSON.stringify(completedAudios));
  }, [completedAudios]);
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      
      if (audioRef.current.currentTime >= audioRef.current.duration * 0.95) {
        markAudioAsCompleted();
      }
    }
  };
  
  const handleProgressClick = (e) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const markAudioAsCompleted = () => {
    const audioId = currentAudioData.id;
    if (!completedAudios.includes(audioId)) {
      setCompletedAudios([...completedAudios, audioId]);
    }
  };
  
  const addBookmark = () => {
    const newBookmark = {
      id: Date.now(),
      module: currentModule,
      audio: currentAudio,
      time: currentTime,
      title: `Marcador en ${formatTime(currentTime)}`
    };
    setBookmarks([...bookmarks, newBookmark]);
  };
  
  const toggleSleepTimer = (minutes) => {
    setSleepTimer(minutes);
    if (minutes > 0) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        setSleepTimer(0);
      }, minutes * 60 * 1000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2D7A94] font-montserrat mb-2">
            Guías de Audio Educativas
          </h1>
          <p className="text-gray-600 font-open-sans">
            Aprende sobre IA a través de guías auditivas de 15-30 minutos. Perfecto para aprender mientras viajas, haces ejercicio o descansas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white">
                    Módulo {currentModule + 1}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800 mt-2 font-montserrat">
                    {audioModules[currentModule]?.title}
                  </h2>
                  <p className="text-gray-600 font-open-sans">
                    {currentAudioData?.title}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-open-sans"
                  >
                    {showTranscript ? 'Ocultar' : 'Mostrar'} Transcripción
                  </button>
                  <button
                    onClick={addBookmark}
                    className="p-2 bg-[#B2D8E5] hover:bg-[#66CCCC] rounded-full transition-colors"
                  >
                    <Bookmark className="w-5 h-5 text-[#2D7A94]" />
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="relative h-2 bg-gray-200 rounded-full mb-2 cursor-pointer" ref={progressRef} onClick={handleProgressClick}>
                  <div 
                    className="absolute h-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 font-open-sans">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <SkipBack className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-4 bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] hover:from-[#4DA8C4] hover:to-[#66CCCC] rounded-full transition-all transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white" />
                  )}
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <SkipForward className="w-6 h-6 text-gray-700" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-24 accent-[#2D7A94]"
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
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-5 h-5 text-gray-600" />
                    <select
                      value={sleepTimer}
                      onChange={(e) => toggleSleepTimer(parseInt(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg font-open-sans"
                    >
                      <option value="0">Sin temporizador</option>
                      <option value="5">5 minutos</option>
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">60 minutos</option>
                    </select>
                  </div>
                  {sleepTimer > 0 && (
                    <span className="text-sm text-[#2D7A94] font-open-sans">
                      Apagando en {sleepTimer} min
                    </span>
                  )}
                </div>
              </div>
              
              {showTranscript && currentAudioData?.transcript && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2 font-montserrat">Transcripción</h3>
                  <p className="text-gray-700 leading-relaxed font-open-sans">
                    {currentAudioData.transcript}
                  </p>
                </div>
              )}
              
              <audio
                ref={audioRef}
                src={currentAudioData?.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={() => {
                  setIsPlaying(false);
                  markAudioAsCompleted();
                }}
                className="hidden"
              />
            </div>
            
            {bookmarks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Marcadores</h3>
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 font-open-sans">{bookmark.title}</p>
                        <p className="text-sm text-gray-600 font-open-sans">
                          {audioModules[bookmark.module]?.title} • {formatTime(bookmark.time)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentModule(bookmark.module);
                          setCurrentAudio(bookmark.audio);
                          if (audioRef.current) {
                            audioRef.current.currentTime = bookmark.time;
                          }
                        }}
                        className="px-3 py-1 bg-[#2D7A94] text-white rounded-lg hover:bg-[#4DA8C4] transition-colors font-open-sans"
                      >
                        Ir al marcador
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Módulos de Audio</h3>
              <div className="space-y-4">
                {audioModules.map((module, index) => (
                  <div
                    key={module.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                      currentModule === index
                        ? 'bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setCurrentModule(index);
                      setCurrentAudio(0);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold font-montserrat">{module.title}</h4>
                        <p className={`text-sm ${currentModule === index ? 'text-gray-200' : 'text-gray-600'} font-open-sans`}>
                          {module.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium font-open-sans">{module.audios.length} audios</p>
                        <p className="text-sm opacity-75 font-open-sans">15-30 min c/u</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Audios del Módulo</h3>
              <div className="space-y-3">
                {audioModules[currentModule]?.audios.map((audio, index) => (
                  <div
                    key={audio.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentAudio === index
                        ? 'bg-[#B2D8E5] border-l-4 border-[#2D7A94]'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentAudio(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          completedAudios.includes(audio.id)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {completedAudios.includes(audio.id) ? '✓' : index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 font-open-sans">{audio.title}</p>
                          <p className="text-sm text-gray-600 font-open-sans">{audio.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-open-sans">{audio.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Tu Progreso</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1 font-open-sans">
                    <span>Audios completados</span>
                    <span>{completedAudios.length} / 7</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2D7A94] to-[#4DA8C4] rounded-full"
                      style={{ width: `${(completedAudios.length / 7) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-open-sans">
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-open-sans">
                    <Share2 className="w-4 h-4" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-open-sans">
            <strong>Metodología VAK:</strong> Este contenido está diseñado específicamente para el aprendizaje auditivo, 
            complementando los recursos visuales y kinestésicos del curso.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioGuides;