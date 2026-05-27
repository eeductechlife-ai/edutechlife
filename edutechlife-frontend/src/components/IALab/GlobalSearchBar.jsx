import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { getModuleContent } from './constants/moduleContent';
import { useIALabProgressContext } from '../../context/IALabContext';

const SEARCHABLE_TYPES = [
  'video', 'document', 'documento', 'pdf', 'pdf-thumbnail',
  'image', 'imagen', 'interactive', 'interactivo',
  'ova', 'ova-thumbnail', 'ova_interactive',
];

const GlobalSearchBar = ({ mobile, onClose }) => {
  const { modules, activeMod, setActiveMod, openResourceById } = useIALabProgressContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const performSearch = useCallback((q) => {
    if (!q.trim()) { setResults([]); return; }
    const lower = q.toLowerCase();
    const hits = [];

    modules.forEach(mod => {
      if (mod.title.toLowerCase().includes(lower)) {
        hits.push({ type: 'module', id: mod.id, label: mod.title, sublabel: `Módulo ${mod.id}`, modId: mod.id });
      }
      const content = getModuleContent(mod.id);
      if (content?.accordion) {
        const topics = Array.isArray(content.accordion) ? content.accordion : [];
        topics.forEach(topic => {
          if (topic.title?.toLowerCase().includes(lower)) {
            hits.push({ type: 'topic', id: `mod${mod.id}-${topic.id}`, label: topic.title, sublabel: `${mod.title} - Tema`, modId: mod.id });
          }
          if (topic.resources) {
            topic.resources.forEach(r => {
              const rTitle = r.title || r.name || '';
              if (rTitle.toLowerCase().includes(lower) && SEARCHABLE_TYPES.includes(r.type)) {
                hits.push({ type: 'resource', id: r.id, label: rTitle, sublabel: `${mod.title}`,
                  modId: mod.id, resource: r, topicId: topic.id });
              }
            });
          }
        });
      }
    });

    setResults(hits.slice(0, 10));
  }, [modules]);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    const timer = setTimeout(() => performSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (hit) => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
    setActiveMod(hit.modId);
  };

  if (mobile) {
    return (
      <div className="fixed inset-0 z-[1002] bg-white dark:bg-slate-900 flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 -ml-1" aria-label="Cerrar búsqueda">
            <Icon name="fa-arrow-left" className="text-lg" />
          </button>
          <div className="flex-1 relative">
            <Icon name="fa-search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              placeholder="Buscar módulos, temas y recursos..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50"
              autoFocus
              aria-label="Buscar"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {query && (
            <p className="text-xs text-slate-400 mb-3">
              {results.length > 0 ? `${results.length} resultado${results.length !== 1 ? 's' : ''}` : `Sin resultados para "${query}"`}
            </p>
          )}
          {results.map((hit, i) => (
            <button key={`${hit.type}-${hit.id}-${i}`}
              onClick={() => { handleSelect(hit); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-colors text-left border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div className="w-8 h-8 rounded-xl bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
                {hit.type === 'module' ? <Icon name="fa-layer-group" className="text-sm text-petroleum" /> :
                 hit.type === 'topic' ? <Icon name="fa-folder" className="text-sm text-petroleum" /> :
                 <Icon name="fa-file" className="text-sm text-petroleum" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{hit.label}</p>
                <p className="text-xs text-slate-400">{hit.sublabel}</p>
              </div>
            </button>
          ))}
          {!query && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Icon name="fa-search" className="text-2xl text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-500">Busca módulos, temas y recursos</p>
              <p className="text-xs text-slate-400 mt-1">Escribe para comenzar a buscar</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="relative">
      <div className="flex items-center">
        <div className="relative">
          <Icon name="fa-search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar..."
            className="min-w-[180px] h-9 pl-8 pr-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50 transition-all duration-200"
            aria-label="Buscar módulos, temas y recursos"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-600 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>
      </div>

      {isOpen && query && results.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-[300] overflow-hidden">
          <div className="p-1.5 space-y-0.5">
            {results.map((hit, i) => (
              <button
                key={`${hit.type}-${hit.id}-${i}`}
                onClick={() => handleSelect(hit)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
                  {hit.type === 'module' ? <Icon name="fa-layer-group" className="text-[10px] text-petroleum" /> :
                   hit.type === 'topic' ? <Icon name="fa-folder" className="text-[10px] text-petroleum" /> :
                   <Icon name="fa-file" className="text-[10px] text-petroleum" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{hit.label}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-500 truncate">{hit.sublabel}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-700">
            <p className="text-[10px] text-slate-600">{results.length} resultado{results.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full mt-1.5 left-0 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-[300] p-4 text-center">
          <p className="text-xs text-slate-600">Sin resultados para "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;
