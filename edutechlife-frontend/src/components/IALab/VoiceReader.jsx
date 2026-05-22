import React, { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speakTextConversational, stopSpeech } from '../../utils/speech';

const VoiceReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }
    speakTextConversational(text, 'valerio', () => setIsPlaying(false));
    setIsPlaying(true);
  };

  return (
    <button
      onClick={speak}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-[#E0F7FA] text-petroleum hover:bg-[#B2EBF2]'}`}
      title="Escuchar con voz de Valerio"
    >
      {isPlaying ? <Square size={16} /> : <Volume2 size={16} />}
      {isPlaying ? 'Detener' : 'Escuchar con Valerio'}
    </button>
  );
};

export default VoiceReader;
