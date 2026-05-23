import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import ValerioAvatar from '../../ValerioAvatar';
import { stopSpeech } from '../../../utils/speech';

const ValerioPanelHeader = ({ valerioState, setValerioState, currentModule, userLevel, onClose }) => {
  return (
    <div className="sticky top-0 bg-gradient-to-r from-petroleum to-corporate text-white p-6 rounded-t-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <ValerioAvatar
            state={valerioState}
            size={48}
            onStateChange={setValerioState}
          />
          <div>
            <h2 className="text-xl font-bold">Valerio - Coach de IA</h2>
            <p className="text-sm opacity-90">
              Módulo: {currentModule?.title}
            </p>
          </div>
        </div>

        <button
          onClick={() => { stopSpeech(); onClose(); }}
          className="text-white hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Cerrar panel"
        >
          <Icon name="fa-xmark" className="text-xl" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            valerioState === 'idle' ? 'bg-emerald-400' :
            valerioState === 'thinking' ? 'bg-purple-400' :
            valerioState === 'speaking' ? 'bg-cyan-400' :
            'bg-blue-400'
          }`} />
          <span>
            {valerioState === 'idle' ? 'Listo para ayudarte' :
             valerioState === 'thinking' ? 'Pensando...' :
             valerioState === 'speaking' ? 'Hablando...' :
             'Escuchando...'}
          </span>
        </div>
        <div className="h-4 w-px bg-white/30" />
        <div className="flex items-center gap-2">
          <Icon name="fa-layer-group" className="text-xs" />
          <span>Nivel {userLevel < 3 ? 'Principiante' : userLevel < 6 ? 'Intermedio' : 'Avanzado'}</span>
        </div>
      </div>
    </div>
  );
};

export default ValerioPanelHeader;
