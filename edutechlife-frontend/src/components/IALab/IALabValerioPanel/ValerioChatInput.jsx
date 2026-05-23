import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import ValerioClearConfirm from './ValerioClearConfirm';

const ValerioChatInput = ({
  userInput,
  onInputChange,
  onKeyDown,
  onSend,
  onClear,
  onVoiceToggle,
  isProcessing,
  isListening,
  speechSupported,
  speechError,
  showClearConfirm,
  onConfirmClear,
  onCancelClear,
  conversationLength,
  moduleTitle,
}) => {
  return (
    <div className="border-t border-slate-200 p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={userInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Pregunta a Valerio sobre ${moduleTitle}...`}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-corporate focus:border-transparent text-petroleum-darker placeholder-slate-500 resize-none min-h-[60px] max-h-[120px]"
            disabled={isProcessing}
            rows={2}
            aria-describedby="input-hint"
          />
          <div className="flex items-center justify-between mt-2">
            <div id="input-hint" className="text-xs text-slate-500">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </div>
            {showClearConfirm ? (
              <ValerioClearConfirm
                onConfirm={onConfirmClear}
                onCancel={onCancelClear}
              />
            ) : (
              <button
                onClick={onClear}
                className="text-xs text-slate-500 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 rounded px-1"
                disabled={conversationLength === 0}
              >
                <Icon name="fa-trash" className="mr-1" /> Limpiar
              </button>
            )}
          </div>
        </div>

        {speechError && (
          <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
            <Icon name="fa-triangle-exclamation" className="text-xs" />
            {speechError}
          </div>
        )}

        {speechSupported && (
          <button
            onClick={onVoiceToggle}
            disabled={isProcessing}
            className={`w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate ${
              isListening
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-petroleum'
            }`}
            aria-label={isListening ? 'Detener grabación' : 'Preguntar por voz'}
            title={isListening ? 'Detener grabación' : 'Preguntar por voz'}
          >
            <Icon name={isListening ? 'fa-microphone-slash' : 'fa-microphone'} className="text-sm" />
          </button>
        )}

        <button
          onClick={onSend}
          disabled={isProcessing || !userInput.trim()}
          className="w-12 h-12 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_15px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate focus-visible:ring-offset-2"
          aria-label="Enviar mensaje"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Icon name="fa-paper-plane" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ValerioChatInput;
