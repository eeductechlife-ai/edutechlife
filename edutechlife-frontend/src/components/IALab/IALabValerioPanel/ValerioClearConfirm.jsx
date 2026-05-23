import React from 'react';

const ValerioClearConfirm = ({ onConfirm, onCancel }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">¿Limpiar conversación?</span>
      <button
        onClick={onConfirm}
        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 rounded px-1"
        aria-label="Confirmar limpiar conversación"
      >
        Sí, limpiar
      </button>
      <button
        onClick={onCancel}
        className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded px-1"
        aria-label="Cancelar limpiar conversación"
      >
        Cancelar
      </button>
    </div>
  );
};

export default ValerioClearConfirm;
