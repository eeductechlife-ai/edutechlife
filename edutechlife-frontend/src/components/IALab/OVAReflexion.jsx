import React, { useState, useEffect } from 'react';
import { BrainCircuit, PlayCircle, PauseCircle, Volume2, VolumeX, ChevronRight, ChevronLeft, CheckCircle, XCircle, HelpCircle, BookOpen, Target, Zap, Award, X } from 'lucide-react';

const OVAReflexion = ({ onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [matchingPairs, setMatchingPairs] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);
  const [showGlossary, setShowGlossary] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [ttsText, setTtsText] = useState('');
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  
  const sections = [
    { id: 0, title: 'Historia de la IA', icon: <BookOpen size={24} /> },
    { id: 1, title: 'Tecnología Actual', icon: <Zap size={24} /> },
    { id: 2, title: 'Ética y Sociedad', icon: <Target size={24} /> },
    { id: 3, title: 'Juego de Emparejamiento', icon: <BrainCircuit size={24} /> },
    { id: 4, title: 'Cuestionario Final', icon: <HelpCircle size={24} /> },
    { id: 5, title: 'Glosario', icon: <BookOpen size={24} /> }
  ];

  const glossaryTerms = [
    { term: 'Algoritmo', definition: 'Conjunto de instrucciones paso a paso para resolver un problema' },
    { term: 'Machine Learning', definition: 'Rama de la IA que permite a las máquinas aprender de datos' },
    { term: 'Deep Learning', definition: 'Subcampo del ML que utiliza redes neuronales profundas' },
    { term: 'Sesgo Algorítmico', definition: 'Prejuicios en sistemas de IA que reflejan sesgos humanos' },
    { term: 'Transparencia', definition: 'Capacidad de entender cómo un sistema de IA toma decisiones' }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: '¿Cuál es el principal desafío ético de la IA actual?',
      options: [
        'Velocidad de procesamiento',
        'Sesgo algorítmico',
        'Costo de implementación',
        'Compatibilidad con hardware antiguo'
      ],
      correct: 1
    },
    {
      id: 2,
      question: '¿Qué tecnología permite a las máquinas aprender de datos?',
      options: [
        'Blockchain',
        'Machine Learning',
        'Realidad Virtual',
        'Computación Cuántica'
      ],
      correct: 1
    },
    {
      id: 3,
      question: '¿Por qué es importante la transparencia en sistemas de IA?',
      options: [
        'Para reducir costos',
        'Para aumentar la velocidad',
        'Para entender cómo se toman decisiones',
        'Para mejorar la compatibilidad'
      ],
      correct: 2
    }
  ];

  const matchingGameItems = [
    { id: 1, type: 'concept', text: 'Machine Learning', matchId: 4 },
    { id: 2, type: 'concept', text: 'Deep Learning', matchId: 5 },
    { id: 3, type: 'concept', text: 'Sesgo Algorítmico', matchId: 6 },
    { id: 4, type: 'definition', text: 'Aprendizaje automático a partir de datos', matchId: 1 },
    { id: 5, type: 'definition', text: 'Redes neuronales profundas', matchId: 2 },
    { id: 6, type: 'definition', text: 'Prejuicios en sistemas de IA', matchId: 3 }
  ];

  useEffect(() => {
    const shuffled = [...matchingGameItems].sort(() => Math.random() - 0.5);
    setMatchingPairs(shuffled);
  }, []);

  useEffect(() => {
    const newProgress = ((currentSection + 1) / sections.length) * 100;
    setProgress(newProgress);
    
    if (currentSection === sections.length - 1 && newProgress === 100) {
      setTimeout(() => setShowCertificate(true), 1000);
    }
  }, [currentSection]);

  const handleCardClick = (cardId) => {
    if (matchedPairs.includes(cardId) || selectedCard === cardId) return;

    if (selectedCard === null) {
      setSelectedCard(cardId);
      return;
    }

    const firstCard = matchingPairs.find(card => card.id === selectedCard);
    const secondCard = matchingPairs.find(card => card.id === cardId);

    if (firstCard.matchId === secondCard.id || secondCard.matchId === firstCard.id) {
      setMatchedPairs([...matchedPairs, selectedCard, cardId]);
    }

    setTimeout(() => setSelectedCard(null), 1000);
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
    
    const question = quizQuestions.find(q => q.id === questionId);
    if (question.correct === answerIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleTtsPlay = () => {
    if (!ttsText.trim()) return;
    
    setIsTtsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.volume = isMuted ? 0 : volume;
    utterance.onend = () => setIsTtsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const handleTtsPause = () => {
    speechSynthesis.cancel();
    setIsTtsPlaying(false);
  };

  const renderSectionContent = () => {
    switch(currentSection) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-indigo-800">Historia de la Inteligencia Artificial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-100 to-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-indigo-700 mb-3">Orígenes (1950s)</h4>
                <p className="text-gray-700">El término "Inteligencia Artificial" fue acuñado por John McCarthy en 1956 durante la Conferencia de Dartmouth.</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-blue-700 mb-3">Inviernos de la IA</h4>
                <p className="text-gray-700">Períodos de reducción de financiamiento y expectativas debido a limitaciones tecnológicas.</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-100 to-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-cyan-700 mb-3">Resurgimiento (2010s)</h4>
                <p className="text-gray-700">Avances en deep learning y disponibilidad de grandes conjuntos de datos revitalizaron el campo.</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-white mb-3">IA Actual</h4>
                <p className="text-white">Integración en vida cotidiana: asistentes virtuales, recomendaciones, diagnóstico médico.</p>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-indigo-800">Tecnologías Actuales de IA</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md">
                <Zap className="text-blue-500" size={32} />
                <div>
                  <h4 className="font-semibold text-indigo-700">Procesamiento del Lenguaje Natural</h4>
                  <p className="text-gray-600">Chatbots, traducción automática, análisis de sentimientos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md">
                <BrainCircuit className="text-cyan-500" size={32} />
                <div>
                  <h4 className="font-semibold text-indigo-700">Visión por Computadora</h4>
                  <p className="text-gray-600">Reconocimiento facial, detección de objetos, diagnóstico médico</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md">
                <Target className="text-indigo-600" size={32} />
                <div>
                  <h4 className="font-semibold text-indigo-700">Sistemas de Recomendación</h4>
                  <p className="text-gray-600">Personalización de contenido, comercio electrónico, streaming</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-indigo-800">Ética y Impacto Social</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">Desafíos Éticos</h4>
                <ul className="space-y-1 text-sm text-red-600">
                  <li>• Sesgo algorítmico</li>
                  <li>• Privacidad de datos</li>
                  <li>• Transparencia</li>
                  <li>• Responsabilidad</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-yellow-700 mb-2">Impacto Laboral</h4>
                <ul className="space-y-1 text-sm text-yellow-600">
                  <li>• Automatización de tareas</li>
                  <li>• Nuevas oportunidades</li>
                  <li>• Requerimiento de habilidades</li>
                  <li>• Transformación digital</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">Oportunidades</h4>
                <ul className="space-y-1 text-sm text-green-600">
                  <li>• Soluciones a problemas complejos</li>
                  <li>• Personalización masiva</li>
                  <li>• Innovación en salud</li>
                  <li>• Sostenibilidad ambiental</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-indigo-800">Juego de Emparejamiento</h3>
            <p className="text-gray-600">Empareja cada concepto con su definición correcta</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {matchingPairs.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    selectedCard === card.id 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : matchedPairs.includes(card.id)
                      ? 'bg-cyan-500 text-white shadow-md'
                      : card.type === 'concept'
                      ? 'bg-gradient-to-r from-indigo-100 to-white border-2 border-indigo-300'
                      : 'bg-gradient-to-r from-white to-blue-100 border-2 border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{card.text}</span>
                    {matchedPairs.includes(card.id) && (
                      <CheckCircle size={20} className="text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-indigo-700 rounded-xl text-white">
              <div className="flex justify-between items-center">
                <span>Progreso del juego:</span>
                <span className="font-bold">{matchedPairs.length / 2} / {matchingGameItems.length / 2} pares</span>
              </div>
              <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${(matchedPairs.length / matchingGameItems.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-indigo-800">Cuestionario Final</h3>
            
            <div className="space-y-8">
              {quizQuestions.map(question => (
                <div key={question.id} className="bg-white p-6 rounded-xl shadow-md">
                  <h4 className="text-lg font-semibold text-indigo-700 mb-4">{question.id}. {question.question}</h4>
                  
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(question.id, index)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          quizAnswers[question.id] === index
                            ? question.correct === index
                              ? 'bg-green-100 border-2 border-green-500 text-green-800'
                              : 'bg-red-100 border-2 border-red-500 text-red-800'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                            quizAnswers[question.id] === index
                              ? question.correct === index
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              : 'bg-gray-300'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                          {quizAnswers[question.id] === index && question.correct === index && (
                            <CheckCircle size={20} className="ml-auto text-green-500" />
                          )}
                          {quizAnswers[question.id] === index && question.correct !== index && (
                            <XCircle size={20} className="ml-auto text-red-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl text-white">
              <div className="flex justify-between items-center">
                <span>Puntuación:</span>
                <span className="text-2xl font-bold">{quizScore} / {quizQuestions.length}</span>
              </div>
              <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${(quizScore / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-indigo-800">Glosario de Términos</h3>
            
            <div className="space-y-4">
              {glossaryTerms.map((term, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-700">{term.term}</h4>
                      <p className="text-gray-600 mt-1">{term.definition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-indigo-700 mb-2">Texto a Voz</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  placeholder="Escribe texto para convertir a voz..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={isTtsPlaying ? handleTtsPause : handleTtsPlay}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {isTtsPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Volumen:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <button onClick={onClose} className="fixed top-6 right-6 z-[100] bg-slate-900/80 backdrop-blur-md text-white px-6 py-3 rounded-full font-black text-sm hover:bg-rose-500 transition-all shadow-2xl flex items-center gap-2">
        <X size={20} /> Cerrar OVA
      </button>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50/20 to-white">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <BrainCircuit size={32} className="text-indigo-600" />
                <div>
                  <h1 className="text-2xl font-bold text-indigo-800">OVA Interactivo: Más Allá de Usar la IA</h1>
                  <p className="text-gray-600">Explora los fundamentos, ética y futuro de la Inteligencia Artificial</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        currentSection === section.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {section.icon}
                      <span className="hidden md:inline">{section.title}</span>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                    disabled={currentSection === 0}
                    className="p-2 rounded-full bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                    disabled={currentSection === sections.length - 1}
                    className="p-2 rounded-full bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {renderSectionContent()}
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                disabled={currentSection === 0}
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <ChevronLeft size={20} />
                <span>Anterior</span>
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowGlossary(!showGlossary)}
                  className="px-6 py-3 rounded-lg bg-blue-100 text-indigo-700 hover:bg-blue-200 transition-colors flex items-center space-x-2"
                >
                  <BookOpen size={20} />
                  <span>Glosario</span>
                </button>
                
                <button
                  onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                  disabled={currentSection === sections.length - 1}
                  className="px-6 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <span>Siguiente</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {showGlossary && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-indigo-700">Glosario Completo</h3>
                <button
                  onClick={() => setShowGlossary(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {glossaryTerms.map((term, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-indigo-700">{term.term}</h4>
                      <p className="text-gray-600 mt-1">{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 rounded-2xl max-w-md w-full p-8 text-white text-center">
              <Award size={64} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">¡Felicidades!</h3>
              <p className="mb-6">Has completado el OVA Interactivo sobre Inteligencia Artificial</p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="text-4xl font-bold mb-2">{quizScore}/{quizQuestions.length}</div>
                <div className="text-sm opacity-90">Puntuación en cuestionario</div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowCertificate(false);
                    onClose();
                  }}
                  className="w-full py-3 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Finalizar Actividad
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="w-full py-3 bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Continuar Explorando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OVAReflexion;