import React from 'react';
import { Mic, Send, Volume2 } from 'lucide-react';

export default function NicoPremiumTest() {
  return (
    <>
      <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-gradient-to-b from-[#0A1628]/95 to-[#004B63]/95 backdrop-blur-xl border border-[#4DA8C4]/30 rounded-3xl shadow-2xl z-[9999]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#4DA8C4]/20 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center text-[#0A1628] font-bold">N</div>
            <div>
              <h3 className="text-white font-bold text-sm">Nico Soporte</h3>
              <p className="text-[#4DA8C4] text-xs">En línea</p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 text-[#4DA8C4] transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Burbuja Nico */}
          <div className="self-start max-w-[85%] p-4 rounded-2xl rounded-tl-sm bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-lg">
            ¡Hola! Soy Nico, el agente de soporte premium de Edutechlife. ¿En qué te puedo ayudar hoy con tu proyecto?
          </div>
          
          {/* Burbuja Usuario */}
          <div className="self-end max-w-[85%] p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-[#0A1628] font-semibold shadow-lg">
            Necesito ayuda para configurar mi entorno virtual, por favor.
          </div>
        </div>

        {/* Input Área */}
        <div className="p-4 border-t border-[#4DA8C4]/20 bg-black/20 flex gap-3 items-center">
          <button className="p-3 rounded-full bg-white/5 text-[#4DA8C4] hover:bg-white/10 transition-colors border border-white/10">
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            placeholder="Escribe tu mensaje..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#4DA8C4]/50 transition-all text-sm"
          />
          <button className="p-3 rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-[#0A1628] hover:scale-105 transition-transform shadow-lg shadow-[#4DA8C4]/20">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
