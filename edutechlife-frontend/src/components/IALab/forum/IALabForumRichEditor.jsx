import React, { useState } from 'react';

const IALabForumRichEditor = ({ placeholder, onSubmit, buttonLabel, compact, onCancel }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    await onSubmit(content.trim());
    setContent('');
    setIsSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Escribe algo...'}
          className={`w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-corporate/20 focus:border-corporate/30 transition-all resize-none ${
            compact ? 'min-h-[60px]' : 'min-h-[80px]'
          }`}
          maxLength={2000}
        />
        <span className={`absolute bottom-2 right-2 text-[9px] font-medium ${content.length > 1800 ? 'text-amber-500' : 'text-slate-600'}`}>
          {content.length}/2000
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-slate-600">
          <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9px] font-mono">⌘Enter</kbd> para enviar
        </p>
        <div className="flex items-center gap-1.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-petroleum to-corporate text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-sm ${
              compact ? 'text-[11px]' : 'text-xs'
            }`}
          >
            {isSubmitting ? 'Enviando...' : buttonLabel || 'Enviar'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default IALabForumRichEditor;
