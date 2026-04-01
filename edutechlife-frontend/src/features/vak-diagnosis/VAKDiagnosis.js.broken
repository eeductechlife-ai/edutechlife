import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Typography, Progress, Modal } from '../../design-system/components';
import { getQuestionsByAge, calculateVAKResult, VAK_STYLES } from '../../constants/vakData';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const VAKDiagnosis = () => {
  const [step, setStep] = useState(0); // 0: onboarding, 1: questions, 2: results
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    email: '',
  });
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioQueue, setAudioQueue] = useState([]);

  // Questions based on age
  const questions = userData.age ? getQuestionsByAge(parseInt(userData.age)) : [];

  // Handle voice functionality with premium Google Cloud TTS
  const speakText = async (text, onEnd) => {
    if (!isVoiceEnabled) return;

    setIsSpeaking(true);
    
    try {
      await speakTextConversational(text, 'valeria', () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      });
    } catch (error) {
      console.error('Error en síntesis de voz premium:', error);
      setIsSpeaking(false);
      if (onEnd) onEnd();
    }
  };

  const stopSpeaking = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  // Handle onboarding
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    if (userData.name && userData.age && userData.email) {
      setStep(1);
      
      // Start voice introduction if enabled
      if (isVoiceEnabled) {
        setTimeout(() => {
          speakText(`Hola ${userData.name}, bienvenido al diagnóstico VAK de EdutechLife. Vamos a descubrir tu estilo de aprendizaje preferido.`);
        }, 500);
      }
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);

    // Speak the selected option if voice is enabled
    if (isVoiceEnabled) {
      speakText(`Has seleccionado: ${option.text}`, () => {
        // Move to next question or show results after speech ends
        if (currentQuestion < questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestion(currentQuestion + 1);
            
            // Speak next question
            if (isVoiceEnabled) {
              setTimeout(() => {
                speakText(`Pregunta ${currentQuestion + 2}: ${questions[currentQuestion + 1].text}`);
              }, 500);
            }
          }, 500);
        } else {
          // Calculate results
          const result = calculateVAKResult(newAnswers);
          setResults(result);
          setStep(2);
          
          // Speak completion message
          if (isVoiceEnabled) {
            setTimeout(() => {
              speakText(`¡Excelente! Has completado el diagnóstico. Tu estilo de aprendizaje predominante es: ${VAK_STYLES[result.dominant].name}.`);
            }, 1000);
          }
        }
      });
    } else {
      // If voice is not enabled, proceed immediately
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
        }, 500);
      } else {
        const result = calculateVAKResult(newAnswers);
        setResults(result);
        setStep(2);
      }
    }

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        
        // Speak next question
        if (isVoiceEnabled) {
          setTimeout(() => {
            speakText(`Pregunta ${currentQuestion + 2}: ${questions[currentQuestion + 1].text}`);
          }, 1000);
        }
      }, 500);
    } else {
      // Calculate results
      const result = calculateVAKResult(newAnswers);
      setResults(result);
      setStep(2);
      
      // Speak completion message
      if (isVoiceEnabled) {
        setTimeout(() => {
          speakText(`¡Excelente! Has completado el diagnóstico. Tu estilo de aprendizaje predominante es: ${VAK_STYLES[result.dominant].name}.`);
        }, 1000);
      }
    }
  };

  // Calculate progress
  const progress = step === 1 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Render onboarding step
  const renderOnboarding = () => (
    <div className="min-h-screen bg-gradient-to-br from-bg-glass to-bg-glass-dark flex items-center justify-center p-4">
      <Card variant="premium" padding="xl" className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Typography variant="h1" gradient className="mb-4">
            Diagnóstico VAK Premium
          </Typography>
          <Typography variant="subtitle1" color="sub" className="mb-6">
            Descubre tu estilo de aprendizaje preferido con nuestra experiencia premium
          </Typography>
        </div>

        <form onSubmit={handleOnboardingSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full px-4 py-3 bg-bg-glass border border-border-glass rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Edad
              </label>
              <select
                value={userData.age}
                onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                className="w-full px-4 py-3 bg-bg-glass border border-border-glass rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Selecciona tu edad</option>
                <option value="8">8 años</option>
                <option value="9">9 años</option>
                <option value="10">10 años</option>
                <option value="11">11 años</option>
                <option value="12">12 años</option>
                <option value="13">13 años</option>
                <option value="14">14 años</option>
                <option value="15">15 años</option>
                <option value="16">16 años</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full px-4 py-3 bg-bg-glass border border-border-glass rounded-premium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  isVoiceEnabled 
                    ? 'bg-accent text-white shadow-glass-accent' 
                    : 'bg-bg-glass text-text-sub border border-border-glass'
                }`}
              >
                <i className={`fas fa-volume-${isVoiceEnabled ? 'up' : 'mute'}`} />
              </button>
              <Typography variant="body2" color="sub">
                {isVoiceEnabled 
                  ? 'Asistente de voz activado' 
                  : 'Activar asistente de voz para una experiencia premium'}
              </Typography>
            </div>

            <Button
              type="submit"
              variant="premium"
              fullWidth
              size="lg"
              className="mt-8"
            >
              Comenzar Diagnóstico
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border-glass">
          <Typography variant="body2" color="sub" align="center">
            Al continuar, aceptas nuestros términos y condiciones. Tus datos están protegidos.
          </Typography>
        </div>
      </Card>
    </div>
  );

  // Render questions step
  const renderQuestions = () => (
    <div className="min-h-screen bg-gradient-to-br from-bg-glass to-bg-glass-dark p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h3" className="text-white">
              Diagnóstico VAK
            </Typography>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isVoiceEnabled 
                    ? 'bg-accent text-white shadow-glass-accent' 
                    : 'bg-bg-glass text-text-sub border border-border-glass'
                }`}
              >
                <i className={`fas fa-volume-${isVoiceEnabled ? 'up' : 'mute'}`} />
              </button>
              <Typography variant="body2" color="light">
                Pregunta {currentQuestion + 1} de {questions.length}
              </Typography>
            </div>
          </div>
          
          <Progress 
            value={progress} 
            variant="gradient" 
            size="lg" 
            animated 
            showValue 
            label={`Progreso: ${Math.round(progress)}%`}
          />
        </div>

        {/* Question Card */}
        <Card variant="glass" padding="lg" className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-premium flex items-center justify-center">
              <Typography variant="h4" color="inverse">
                {currentQuestion + 1}
              </Typography>
            </div>
            
            <div className="flex-1">
              <Typography variant="h4" className="mb-4">
                {questions[currentQuestion]?.text}
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 rounded-premium border transition-all duration-300 text-left ${
                      answers[currentQuestion]?.letra === option.letra
                        ? 'border-primary bg-primary/10 shadow-glass-accent'
                        : 'border-border-glass bg-bg-glass hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        answers[currentQuestion]?.letra === option.letra
                          ? 'bg-primary text-white'
                          : 'bg-bg-glass-dark text-text-sub'
                      }`}>
                        <Typography variant="body" weight="bold">
                          {option.letra}
                        </Typography>
                      </div>
                      <Typography variant="body">
                        {option.text}
                      </Typography>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
              } else {
                setStep(0);
              }
            }}
          >
            {currentQuestion > 0 ? 'Anterior' : 'Volver'}
          </Button>
          
          <Typography variant="body2" color="sub">
            Selecciona la opción que mejor te describa
          </Typography>
        </div>
      </div>
    </div>
  );

  // Render results step
  const renderResults = () => {
    if (!results) return null;

    const dominantStyle = VAK_STYLES[results.dominant];
    const otherStyles = Object.keys(VAK_STYLES)
      .filter(key => key !== results.dominant)
      .map(key => ({ ...VAK_STYLES[key], percentage: results.percentages[key] }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-glass to-bg-glass-dark p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Typography variant="h1" gradient className="mb-4">
              ¡Diagnóstico Completado!
            </Typography>
            <Typography variant="subtitle1" color="light" className="mb-6">
              {userData.name}, hemos analizado tus respuestas y encontramos tu estilo de aprendizaje
            </Typography>
          </div>

          {/* Main Results Card */}
          <Card variant="premium" padding="xl" className="mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent mb-6">
                <i className={`fas ${dominantStyle.icon} text-4xl text-white`} />
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

            {/* Progress Bars */}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="premium"
                size="lg"
                onClick={() => setShowResultsModal(true)}
              >
                Ver Detalles Completos
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

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dominantStyle.characteristics.slice(0, 3).map((characteristic, index) => (
              <Card key={index} variant="glass" padding="md">
                <Typography variant="body" weight="medium" className="mb-2">
                  {characteristic}
                </Typography>
              </Card>
            ))}
          </div>
        </div>

        {/* Results Modal */}
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          title="Resultados Detallados"
          size="xl"
          variant="glass"
        >
          <div className="space-y-8">
            {/* Dominant Style Details */}
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
                        <i className="fas fa-check text-success mt-1" />
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
                        <i className="fas fa-lightbulb text-warning mt-1" />
                        <Typography variant="body2">{strategy}</Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Career Suggestions */}
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

            {/* Other Styles */}
            <div>
              <Typography variant="h5" className="mb-3">
                Tus Otros Estilos
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherStyles.map((style, index) => (
                  <Card key={index} variant="glass" padding="sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: style.color + '20' }}
                      >
                        <i className={`fas ${style.icon}`} style={{ color: style.color }} />
                      </div>
                      <div>
                        <Typography variant="body" weight="medium">
                          {style.name}
                        </Typography>
                        <Typography variant="body2" color="sub">
                          {style.percentage}% de coincidencia
                        </Typography>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Download/Share Options */}
            <div className="pt-6 border-t border-border-glass">
              <Typography variant="h5" className="mb-4">
                Guarda tus Resultados
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">
                  <i className="fas fa-download mr-2" />
                  Descargar PDF
                </Button>
                <Button variant="outline">
                  <i className="fas fa-envelope mr-2" />
                  Enviar por Email
                </Button>
                <Button variant="outline">
                  <i className="fas fa-share-alt mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );

  // Render based on current step
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

export default VAKDiagnosis;