import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';

const COLORS = {
  NAVY: '#0A1628',
  PETROLEUM: '#004B63',
  CORPORATE: '#4DA8C4',
  MINT: '#66CCCC',
  SOFT_BLUE: '#B2D8E5'
};

const NicoModernSimple = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        style={{ 
          backgroundColor: COLORS.PETROLEUM,
          background: `linear-gradient(135deg, ${COLORS.PETROLEUM} 0%, ${COLORS.CORPORATE} 100%)`
        }}
      >
        <Bot className="w-8 h-8 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px]">
      <div 
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 h-full"
        style={{ borderColor: COLORS.SOFT_BLUE }}
      >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: COLORS.NAVY }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.CORPORATE }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white">Nico Assistant</h3>
              <p className="text-xs" style={{ color: COLORS.SOFT_BLUE }}>
                EdutechLife AI Support
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:opacity-80 transition"
            style={{ backgroundColor: COLORS.PETROLEUM }}
            title="Cerrar"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 p-4 h-[calc(100%-80px)] flex items-center justify-center"
          style={{ 
            backgroundColor: COLORS.NAVY,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${COLORS.PETROLEUM}20 0%, transparent 50%)`
          }}
        >
          <div className="text-center">
            <p className="text-lg font-semibold mb-2" style={{ color: COLORS.SOFT_BLUE }}>
              ¡Componente NicoModern cargado!
            </p>
            <p className="text-sm" style={{ color: COLORS.MINT }}>
              Diseño premium con paleta corporativa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicoModernSimple;