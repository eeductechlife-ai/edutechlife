import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';

export function TrafficLightControls({
  onClose,
  onToggleFullscreen,
  isFullscreen = false,
  showFullscreen = true,
  closeLabel = 'Cerrar',
  fullscreenEnterLabel = 'Pantalla completa',
  fullscreenExitLabel = 'Salir de pantalla completa',
}) {
  return (
    <div className="flex items-center gap-[3px]" role="group" aria-label="Controles de ventana">
      {showFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="w-[7px] h-[7px] rounded-full bg-[#22C55E] hover:brightness-110 transition-all flex items-center justify-center focus-visible:outline-none"
          aria-label={isFullscreen ? fullscreenExitLabel : fullscreenEnterLabel}
          title={isFullscreen ? fullscreenExitLabel : fullscreenEnterLabel}
        >
          <Icon name={isFullscreen ? 'fa-compress' : 'fa-expand'} className="text-[3px] text-[#0D4F1E]" />
        </button>
      )}
      <button
        onClick={onClose}
        className="w-[7px] h-[7px] rounded-full bg-[#EF4444] hover:brightness-110 transition-all flex items-center justify-center focus-visible:outline-none"
        aria-label={closeLabel}
        title={closeLabel}
      >
        <Icon name="fa-times" className="text-[3px] text-[#7F1D1D]" />
      </button>
    </div>
  );
}

export default TrafficLightControls;
