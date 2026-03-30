import React, { useState, useEffect } from 'react';
import { Button } from '../../../design-system/components';
import { voiceService } from '../services/voiceService';

const VoiceControl = ({ 
  onVoiceToggle,
  isVoiceEnabled: externalIsEnabled,
  className = ''
}) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(externalIsEnabled || false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setIsVoiceEnabled(externalIsEnabled);
    voiceService.setEnabled(externalIsEnabled);
  }, [externalIsEnabled]);

  useEffect(() => {
    if (!voiceService.isAvailable()) return;

    const updateStatus = () => {
      setIsSpeaking(voiceService.isSpeaking);
      setIsPaused(voiceService.isPaused());
      setQueueLength(voiceService.getQueueLength());
    };

    // Actualizar estado periódicamente
    const interval = setInterval(updateStatus, 500);
    
    // Configurar parámetros iniciales
    voiceService.setRate(rate);
    voiceService.setPitch(pitch);
    voiceService.setVolume(volume);

    return () => clearInterval(interval);
  }, []);

  const handleToggleVoice = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    voiceService.setEnabled(newState);
    
    if (onVoiceToggle) {
      onVoiceToggle(newState);
    }
  };

  const handleStop = () => {
    voiceService.stop();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      voiceService.resume();
    } else {
      voiceService.pause();
    }
  };

  const handleClearQueue = () => {
    voiceService.clearQueue();
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    voiceService.setRate(newRate);
  };

  const handlePitchChange = (newPitch) => {
    setPitch(newPitch);
    voiceService.setPitch(newPitch);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    voiceService.setVolume(newVolume);
  };

  const handleTestVoice = () => {
    voiceService.speakWithQueue(
      'Hola, soy tu asistente de voz de EdutechLife. Estoy aquí para guiarte en tu diagnóstico de aprendizaje.',
      'high',
      () => console.log('Test voice started'),
      () => console.log('Test voice ended')
    );
  };

  if (!voiceService.isAvailable()) {
    return (
      <div className={`p-4 bg-warning/10 border border-warning rounded-premium ${className}`}>
        <p className="text-warning text-sm">
          ⚠️ El asistente de voz no está disponible en este navegador.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controles principales */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleVoice}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              isVoiceEnabled 
                ? 'bg-accent text-white shadow-glass-accent' 
                : 'bg-bg-glass text-text-sub border border-border-glass'
            }`}
            aria-label={isVoiceEnabled ? 'Desactivar voz' : 'Activar voz'}
          >
            {isVoiceEnabled ? (
              isSpeaking ? (
                <span className="animate-pulse">🔊</span>
              ) : isPaused ? (
                <span>⏸️</span>
              ) : (
                <span>🔊</span>
              )
            ) : (
              <span>🔇</span>
            )}
          </button>
          
          <div>
            <p className="text-sm font-medium text-text-main">
              Asistente de voz {isVoiceEnabled ? 'activado' : 'desactivado'}
            </p>
            {isVoiceEnabled && queueLength > 0 && (
              <p className="text-xs text-text-sub">
                {queueLength} mensaje{queueLength !== 1 ? 's' : ''} en cola
              </p>
            )}
          </div>
        </div>

        {isVoiceEnabled && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-premium hover:bg-bg-glass transition-colors"
              aria-label="Configuración de voz"
            >
              <span>⚙️</span>
            </button>
            
            {isSpeaking && (
              <>
                <button
                  onClick={handlePauseResume}
                  className="p-2 rounded-premium hover:bg-bg-glass transition-colors"
                  aria-label={isPaused ? 'Reanudar' : 'Pausar'}
                >
                  <span>{isPaused ? '▶️' : '⏸️'}</span>
                </button>
                
                <button
                  onClick={handleStop}
                  className="p-2 rounded-premium hover:bg-bg-glass transition-colors"
                  aria-label="Detener"
                >
                  <span>⏹️</span>
                </button>
              </>
            )}
            
            {queueLength > 0 && (
              <button
                onClick={handleClearQueue}
                className="p-2 rounded-premium hover:bg-bg-glass transition-colors"
                aria-label="Limpiar cola"
              >
                <span>🗑️</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Panel de configuración */}
      {showSettings && isVoiceEnabled && (
        <div className="p-4 bg-bg-glass border border-border-glass rounded-premium space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-text-main">Configuración de voz</h4>
            <button
              onClick={handleTestVoice}
              className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
              Probar voz
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-text-sub mb-1">
                Velocidad: {rate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-bg-glass-dark rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-sub mt-1">
                <span>Lento</span>
                <span>Normal</span>
                <span>Rápido</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-text-sub mb-1">
                Tono: {pitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-bg-glass-dark rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-sub mt-1">
                <span>Grave</span>
                <span>Normal</span>
                <span>Agudo</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-text-sub mb-1">
                Volumen: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-bg-glass-dark rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-sub mt-1">
                <span>Bajo</span>
                <span>Medio</span>
                <span>Alto</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border-glass">
            <p className="text-xs text-text-sub">
              {voiceService.voice ? `Voz: ${voiceService.voice.name}` : 'Cargando voces...'}
            </p>
          </div>
        </div>
      )}

      {/* Estado de voz */}
      {isVoiceEnabled && (
        <div className="flex items-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-success animate-pulse' : 'bg-text-sub'}`} />
          <span className="text-text-sub">
            {isSpeaking ? 'Hablando...' : 
             isPaused ? 'Pausado' : 
             queueLength > 0 ? 'En cola...' : 'Listo'}
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceControl;