import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Modal } from '../../../design-system/components';
import { voiceService } from '../services/voiceService';
import { analyticsService } from '../services/analyticsService';
import confetti from 'canvas-confetti';

const FarewellExperience = ({ 
  isOpen,
  onClose,
  userName,
  userEmail,
  dominantStyle,
  results,
  onRestart
}) => {
  const [step, setStep] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      startFarewellExperience();
    }
  }, [isOpen]);

  const startFarewellExperience = () => {
    // Paso 1: Felicitación inicial
    setTimeout(() => {
      setStep(1);
      playCongratulationsAudio();
      launchConfetti();
    }, 1000);

    // Paso 2: Mostrar resultados
    setTimeout(() => {
      setStep(2);
    }, 4000);

    // Paso 3: Ofertas y próximos pasos
    setTimeout(() => {
      setStep(3);
    }, 8000);
  };

  const playCongratulationsAudio = () => {
    const messages = [
      `¡Felicidades ${userName}! Has completado exitosamente tu diagnóstico de aprendizaje VAK.`,
      `Tu estilo de aprendizaje predominante es ${dominantStyle.name}.`,
      `Esto significa que aprendes mejor ${getLearningDescription(dominantStyle)}.`,
      `En EdutechLife estamos emocionados de acompañarte en tu camino educativo.`,
      `Te hemos enviado un resumen completo a ${userEmail}.`,
      `¡Que tengas un excelente día y sigue aprendiendo!`
    ];

    messages.forEach((message, index) => {
      voiceService.speakWithQueue(
        message,
        'high',
        index === 0 ? () => setIsPlayingAudio(true) : null,
        index === messages.length - 1 ? () => setIsPlayingAudio(false) : null
      );
    });
  };

  const getLearningDescription = (style) => {
    switch (style.name) {
      case 'APRENDIZ VISUAL':
        return 'viendo imágenes, diagramas y colores';
      case 'APRENDIZ AUDITIVO':
        return 'escuchando explicaciones y participando en discusiones';
      case 'APRENDIZ KINESTÉSICO':
        return 'haciendo, practicando y experimentando';
      default:
        return 'de manera única y personalizada';
    }
  };

  const launchConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti desde la izquierda
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });

      // Confetti desde la derecha
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleShare = () => {
    const shareText = `¡Acabo de descubrir mi estilo de aprendizaje con EdutechLife! Soy ${dominantStyle.name}. ¡Descubre el tuyo también!`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi Diagnóstico VAK - EdutechLife',
        text: shareText,
        url: shareUrl
      }).then(() => {
        setHasShared(true);
        analyticsService.trackResultsShared('native_share', dominantStyle.name);
      });
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        setHasShared(true);
        analyticsService.trackResultsShared('clipboard', dominantStyle.name);
        alert('¡Enlace copiado al portapapeles!');
      });
    }
  };

  const handleDownload = () => {
    // Simular descarga de PDF
    setTimeout(() => {
      setHasDownloaded(true);
      analyticsService.trackPDFDownloaded(userName, dominantStyle.name);
      
      // Crear un enlace de descarga simulado
      const link = document.createElement('a');
      link.href = '#';
      link.download = `Diagnostico-VAK-${userName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const handleScheduleCall = () => {
    analyticsService.trackConsultationScheduled({ name: userName, email: userEmail });
    window.open('https://calendly.com/edutechlife/consulta', '_blank');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-6" />
            <Typography variant="h4" className="mb-2">
              Preparando tu experiencia de despedida...
            </Typography>
          </div>
        );

      case 1:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <Typography variant="h2" gradient className="mb-4">
              ¡Felicidades!
            </Typography>
            <Typography variant="h4" className="mb-6">
              Has completado tu diagnóstico
            </Typography>
            {isPlayingAudio && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-accent animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-6 bg-accent animate-pulse" style={{ animationDelay: '100ms' }} />
                  <div className="w-1 h-4 bg-accent animate-pulse" style={{ animationDelay: '200ms' }} />
                </div>
                <Typography variant="body2" className="text-accent">
                  Escuchando resultados...
                </Typography>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Typography variant="h3" className="mb-2">
                {dominantStyle.name}
              </Typography>
              <Typography variant="body" color="sub" className="mb-6">
                {dominantStyle.description}
              </Typography>
              
              <div className="inline-flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-premium">
                <Typography variant="h4" gradient>
                  {results.percentage}%
                </Typography>
                <Typography variant="body">
                  de coincidencia con tu estilo
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dominantStyle.characteristics.slice(0, 3).map((char, index) => (
                <Card key={index} variant="glass" padding="sm">
                  <Typography variant="body2">{char}</Typography>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <Typography variant="h3" className="mb-4">
                ¡Tu viaje acaba de comenzar!
              </Typography>
              <Typography variant="body" color="sub">
                Te hemos enviado un resumen completo a {userEmail}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="premium"
                fullWidth
                onClick={handleDownload}
                disabled={hasDownloaded}
              >
                {hasDownloaded ? '✅ Descargado' : '📥 Descargar PDF Completo'}
              </Button>

              <Button
                variant="accent"
                fullWidth
                onClick={handleShare}
                disabled={hasShared}
              >
                {hasShared ? '✅ Compartido' : '📤 Compartir Resultados'}
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-premium border border-border-glass">
              <Typography variant="h5" className="mb-3">
                ¿Quieres llevar tu aprendizaje al siguiente nivel?
              </Typography>
              <Typography variant="body2" color="sub" className="mb-4">
                Agenda una consulta gratuita con nuestros expertos en educación
              </Typography>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleScheduleCall}
              >
                🗓️ Agendar Consulta Gratuita
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={onRestart}
              >
                🔄 Realizar Nuevo Diagnóstico
              </Button>
              
              <Button
                variant="ghost"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      variant="premium"
      showCloseButton={step === 3}
      closeOnOverlayClick={step === 3}
    >
      <div className="min-h-[400px] flex flex-col">
        {renderStep()}
        
        {/* Indicador de progreso */}
        <div className="mt-8 pt-6 border-t border-border-glass">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step >= s ? 'bg-primary' : 'bg-border-glass'
                  }`}
                />
              ))}
            </div>
            
            <Typography variant="caption" color="sub">
              {step === 0 && 'Preparando...'}
              {step === 1 && '¡Felicidades!'}
              {step === 2 && 'Tus resultados'}
              {step === 3 && 'Próximos pasos'}
            </Typography>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FarewellExperience;