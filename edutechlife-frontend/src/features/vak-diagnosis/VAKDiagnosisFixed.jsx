import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button, Card, Typography, Progress, Modal } from '../../design-system/components';
import { getQuestionsByAge, calculateVAKResult, VAK_STYLES } from '../../constants/vakData';
import VoiceControl from './components/VoiceControl';
import FarewellExperience from './components/FarewellExperience';
import GlassmorphismEffects, { AnimatedGradient, GlassGrid, FloatingOrbs } from './components/GlassmorphismEffects';
import { useRenderOptimization, useMemoizedCallback, OptimizedLoading } from './components/PerformanceOptimizer';
import { voiceService } from './services/voiceService';
import { analyticsService } from './services/analyticsService';

const VAKDiagnosisFixed = () => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    email: '',
  });
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showFarewellModal, setShowFarewellModal] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const pageLoadTime = useRef(Date.now());
  const questionTimes = useRef({});
  const userId = useRef(`user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleVoiceToggle = useCallback((enabled) => {
    setIsVoiceEnabled(enabled);
    analyticsService.trackVoiceToggle(enabled);
  }, []);

  // Track session start
  useEffect(() => {
    analyticsService.trackEvent('user_session_start', {
      user_id: userId.current,
      timestamp: new Date().toISOString()
    });
  }, [userData]);

  // Optimización: Memoizar preguntas y progreso
  const questions = useMemo(() => 
    userData.age ? getQuestionsByAge(parseInt(userData.age)) : [], 
    [userData.age]
  );
  
  const progress = useMemo(() => 
    step === 1 ? ((currentQuestion + 1) / questions.length) * 100 : 0,
    [step, currentQuestion, questions.length]
  );
  
  // Track render optimizations
  const renderCount = useRenderOptimization([step, currentQuestion, answers.length]);

  // Efecto para leer la pregunta actual cuando cambia
  useEffect(() => {
    if (step === 1 && isVoiceEnabled && questions[currentQuestion]) {
      const question = questions[currentQuestion];
      voiceService.speakWithQueue(
        `Pregunta ${currentQuestion + 1}: ${question.text}`,
        'high'
      );
    }
    
    // Track question view
    if (step === 1 && questions[currentQuestion]) {
      questionTimes.current[currentQuestion] = Date.now();
    }
  }, [currentQuestion, step, isVoiceEnabled]);

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    if (userData.name && userData.age && userData.email) {
      // Track diagnosis started
      analyticsService.trackDiagnosisStarted(userData);
      
      // Track time on onboarding page
      const timeOnPage = (Date.now() - pageLoadTime.current) / 1000;
      analyticsService.trackTimeOnPage('onboarding', timeOnPage);
      
      setStep(1);
      pageLoadTime.current = Date.now();
      
      // Iniciar guía de voz si está habilitada
      if (isVoiceEnabled) {
        setTimeout(() => {
          voiceService.speakWithQueue(
            `Hola ${userData.name}, bienvenido al diagnóstico VAK de EdutechLife.`,
            'high',
            null,
            () => {
              voiceService.speakWithQueue(
                'Vamos a descubrir tu estilo de aprendizaje preferido a través de 10 preguntas.',
                'high',
                null,
                () => {
                  voiceService.speakWithQueue(
                    'Selecciona la opción que mejor te describa en cada situación.',
                    'high',
                    null,
                    () => {
                      voiceService.speakWithQueue(
                        `Empecemos con la primera pregunta.`,
                        'high'
                      );
                    }
                  );
                }
              );
            }
          );
        }, 500);
      }
    }
  };

  const handleAnswerSelect = useMemoizedCallback((option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);

    // Track question answered
    const question = questions[currentQuestion];
    const timeSpent = questionTimes.current[currentQuestion] 
      ? (Date.now() - questionTimes.current[currentQuestion]) / 1000 
      : 0;
    
    analyticsService.trackQuestionAnswered(
      question.id,
      option.letra,
      currentQuestion + 1,
      questions.length
    );
    
    analyticsService.trackEngagement('question_answered', timeSpent);

    // Feedback de voz para la selección
    if (isVoiceEnabled) {
      voiceService.speakWithQueue(
        `Has seleccionado la opción ${option.letra}.`,
        'high'
      );
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        
        // Reset timer for next question
        questionTimes.current[currentQuestion + 1] = Date.now();
        
        // Leer siguiente pregunta
        if (isVoiceEnabled) {
          setTimeout(() => {
            const nextQuestion = questions[currentQuestion + 1];
            voiceService.speakWithQueue(
              `Pregunta ${currentQuestion + 2}: ${nextQuestion.text}`,
              'high'
            );
          }, 500);
        }
      }, 300);
    } else {
      const result = calculateVAKResult(newAnswers);
      setResults(result);
      setStep(2);
      
      // Track diagnosis completion
      analyticsService.trackDiagnosisCompleted(result, userData);
      
      // Track time on questions page
      const totalTimeOnQuestions = (Date.now() - pageLoadTime.current) / 1000;
      analyticsService.trackTimeOnPage('questions', totalTimeOnQuestions);
      
      // Anunciar finalización
      if (isVoiceEnabled) {
        setTimeout(() => {
          voiceService.speakWithQueue(
            `¡Excelente! Has completado todas las preguntas.`,
            'high',
            null,
            () => {
              voiceService.speakWithQueue(
                `Analizando tus respuestas para descubrir tu estilo de aprendizaje...`,
                'high',
                null,
                () => {
                  setTimeout(() => {
                    setShowFarewellModal(true);
                  }, 1000);
                }
              );
            }
          );
        }, 500);
      } else {
        setTimeout(() => {
          setShowFarewellModal(true);
        }, 1000);
      }
    }
  }, [currentQuestion, questions, isVoiceEnabled, userData]);

  const renderOnboarding = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden">
      {/* Efectos de fondo glassmorphism */}
      <GlassmorphismEffects intensity={1.5} />
      <AnimatedGradient />
      <GlassGrid />
      <FloatingOrbs count={8} />
      
      <div className="relative z-10 flex items-center justify-center p-4">
        <Card variant="premium" padding="xl" className="max-w-2xl w-full backdrop-blur-lg bg-white/80">
          <div className="text-center mb-8">
            <Typography variant="h1" gradient glow className="mb-4">
              Diagnóstico VAK Premium
            </Typography>
            <Typography variant="subtitle1" color="sub" className="mb-6">
              Descubre tu estilo de aprendizaje preferido con nuestra experiencia premium
            </Typography>
          </div>

          <form onSubmit={handleOnboardingSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-petroleum mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-petroleum placeholder:text-text-sub"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-petroleum mb-2">
                  Edad
                </label>
                <select
                  value={userData.age}
                  onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-petroleum"
                  required
                >
                  <option value="" className="text-text-sub">Selecciona tu edad</option>
                  {[8, 9, 10, 11, 12, 13, 14, 15, 16].map(age => (
                    <option key={age} value={age} className="text-text-dark">{age} años</option>
                  ))}
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-petroleum mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-petroleum placeholder:text-text-sub"
                  placeholder="tu@email.com"
                  required
                />
                <div className="mt-1 text-xs text-text-sub">
                  Te enviaremos tus resultados y recomendaciones personalizadas
                </div>
              </div>

            <VoiceControl
              onVoiceToggle={handleVoiceToggle}
              isVoiceEnabled={isVoiceEnabled}
              className="mt-4"
            />

              <Button
                type="submit"
                variant="premium"
                fullWidth
                size="lg"
                className="mt-8 animate-pulse-slow"
              >
                🚀 Comenzar Diagnóstico
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-border-glass">
            <div className="flex items-center justify-center space-x-4 text-sm text-text-sub">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-2" />
                Seguro y privado
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2" />
                Resultados instantáneos
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                Guía personalizada
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 relative overflow-hidden p-4">
      {/* Efectos de fondo glassmorphism */}
      <GlassmorphismEffects intensity={2} />
      <AnimatedGradient />
      <GlassGrid />
      <FloatingOrbs count={6} />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h3" glow className="text-petroleum">
              🧠 Diagnóstico VAK
            </Typography>
            <div className="flex items-center space-x-4">
              <VoiceControl
                onVoiceToggle={handleVoiceToggle}
                isVoiceEnabled={isVoiceEnabled}
              />
              <div className="px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                <Typography variant="body2" className="text-primary">
                  {currentQuestion + 1} / {questions.length}
                </Typography>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={progress} 
              variant="gradient" 
              size="xl" 
              animated 
              showValue={false}
              className="backdrop-blur-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Typography variant="h4" className="text-petroleum drop-shadow-lg">
                {Math.round(progress)}%
              </Typography>
            </div>
          </div>
        </div>

        <Card variant="glass" padding="lg" className="mb-8 backdrop-blur-lg border-2 border-blue-200 bg-white/70">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-premium flex items-center justify-center shadow-glass-accent">
              <Typography variant="h4" color="inverse" className="drop-shadow-lg">
                {currentQuestion + 1}
              </Typography>
            </div>
            
               <div className="flex-1">
               <Typography variant="h4" className="mb-4 text-petroleum">
                {questions[currentQuestion]?.text}
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 rounded-premium border-2 transition-all duration-300 text-left transform hover:scale-[1.02] ${
                      answers[currentQuestion]?.letra === option.letra
                        ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 shadow-glass-accent animate-pulse-border'
                        : 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        answers[currentQuestion]?.letra === option.letra
                          ? 'bg-gradient-to-br from-primary to-accent text-petroleum shadow-inner-glow'
                          : 'bg-blue-50 text-slate-600 border border-blue-200'
                      }`}>
                        <Typography variant="body" weight="bold">
                          {option.letra}
                        </Typography>
                      </div>
                      <Typography variant="body" className="text-petroleum">
                        {option.text}
                      </Typography>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="glass"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
              } else {
                setStep(0);
              }
            }}
            className="backdrop-blur-sm"
          >
            {currentQuestion > 0 ? '← Anterior' : '← Volver al inicio'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <Typography variant="caption" color="light">
              Selecciona la opción que mejor te describa
            </Typography>
          </div>
        </div>

        {/* Indicador de gamificación */}
        <div className="mt-8 p-4 bg-blue-50/50 backdrop-blur-sm rounded-premium border border-blue-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-petroleum text-sm">🏆</span>
              </div>
              <div>
                <Typography variant="body2" className="text-petroleum">
                  Completando tu perfil de aprendizaje
                </Typography>
                <Typography variant="caption" color="sub">
                  {answers.length} de {questions.length} preguntas respondidas
                </Typography>
              </div>
            </div>
            
            <div className="px-3 py-1 bg-accent/20 rounded-full">
              <Typography variant="caption" className="text-accent">
                Nivel {Math.floor(answers.length / 3) + 1}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    const dominantStyle = VAK_STYLES[results.dominant];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Typography variant="h1" gradient className="mb-4">
              ¡Diagnóstico Completado!
            </Typography>
            <Typography variant="subtitle1" color="light" className="mb-6">
              {userData.name}, hemos analizado tus respuestas y encontramos tu estilo de aprendizaje
            </Typography>
          </div>

          <Card variant="premium" padding="xl" className="mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent mb-6">
                <span className="text-4xl text-petroleum">
                  {dominantStyle.icon === 'fa-eye' ? '👁️' : 
                   dominantStyle.icon === 'fa-ear-listen' ? '👂' : '✋'}
                </span>
              </div>
              
              <Typography variant="h2" className="mb-2">
                {dominantStyle.name}
              </Typography>
              
              <Typography variant="h3" gradient className="mb-4">
                {results.percentage}% de coincidencia
              </Typography>
              
              <Typography variant="body" className="mb-6 max-w-2xl mx-auto">
                {dominantStyle.description}
              </Typography>
            </div>

            <div className="space-y-4 mb-8">
              {Object.entries(results.percentages).map(([type, percentage]) => {
                const style = VAK_STYLES[type];
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between">
                      <Typography variant="body" weight="medium">
                        {style.name}
                      </Typography>
                      <Typography variant="body" color="sub">
                        {percentage}%
                      </Typography>
                    </div>
                    <Progress 
                      value={percentage} 
                      variant={type === results.dominant ? 'gradient' : 'primary'}
                      size="lg"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="premium"
                size="lg"
                onClick={() => setShowResultsModal(true)}
              >
                Ver Detalles Completos
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowRecommendations(true)}
              >
                Ver Recomendaciones Personalizadas
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStep(0);
                  setUserData({ name: '', age: '', email: '' });
                  setAnswers([]);
                  setCurrentQuestion(0);
                  setResults(null);
                }}
              >
                Realizar Nuevo Diagnóstico
              </Button>
            </div>
          </Card>
        </div>

        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          title="Resultados Detallados"
          size="xl"
          variant="glass"
        >
          <div className="space-y-6">
            <div>
              <Typography variant="h4" className="mb-4">
                Tu Estilo Dominante: {dominantStyle.name}
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="h5" className="mb-3">
                    Características Principales
                  </Typography>
                  <ul className="space-y-2">
                    {dominantStyle.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-success mt-1">✓</span>
                        <Typography variant="body2">{char}</Typography>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <Typography variant="h5" className="mb-3">
                    Estrategias de Estudio
                  </Typography>
                  <ul className="space-y-2">
                    {dominantStyle.strategies.map((strategy, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-warning mt-1">💡</span>
                        <Typography variant="body2">{strategy}</Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <Typography variant="h5" className="mb-3">
                Carreras Recomendadas
              </Typography>
              <div className="flex flex-wrap gap-2">
                {dominantStyle.careers.map((career, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>

        {/* Farewell Experience Modal */}
        <FarewellExperience
          isOpen={showFarewellModal}
          onClose={() => setShowFarewellModal(false)}
          userName={userData.name}
          userEmail={userData.email}
          dominantStyle={VAK_STYLES[results.dominant]}
          results={results}
          onRestart={() => {
            setStep(0);
            setUserData({ name: '', age: '', email: '' });
            setAnswers([]);
            setCurrentQuestion(0);
            setResults(null);
            setShowFarewellModal(false);
            voiceService.stop();
          }}
        />

      </div>
    );
  };

  switch (step) {
    case 0:
      return renderOnboarding();
    case 1:
      return renderQuestions();
    case 2:
      return renderResults();
    default:
      return renderOnboarding();
  }
};

export default VAKDiagnosisFixed;