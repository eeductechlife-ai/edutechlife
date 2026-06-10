import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types';;
import { Icon } from '../../utils/iconMapping.jsx';
import { getModuleContent } from './constants/moduleContent';
import { useIALabProgressContext } from '../../context/IALabContext';
import { useTranslation } from '../../i18n/I18nProvider';

const SEARCHABLE_TYPES = [
  'video', 'document', 'documento', 'pdf', 'pdf-thumbnail',
  'image', 'imagen', 'interactive', 'interactivo',
  'ova', 'ova-thumbnail', 'ova_interactive',
];

const fuzzyScore = (query, target) => {
  if (!query || !target) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 100 + q.length;
  let qi = 0;
  let score = 0;
  let consecutive = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      consecutive++;
      score += consecutive * 10;
    } else {
      consecutive = 0;
    }
  }
  if (qi < q.length) return 0;
  const gapPenalty = Math.max(0, t.length - q.length);
  return Math.max(1, score - gapPenalty);
};

/**
 * GlobalSearchBar — Barra de búsqueda global del IA Lab.
 * Filtra en tiempo real todos los módulos y sus recursos
 * (videos, documentos, PDFs, imágenes, OVAs interactivas).
 * Soporta vista móvil con overlay deslizable.
 *
 * @param {Object}   props
 * @param {boolean}  [props.mobile=false] - Activa variante móvil con overlay
 * @param {Function} [props.onClose]      - Callback al cerrar la búsqueda
 */
const GlobalSearchBar = ({ mobile, onClose }) => {
  const { t } = useTranslation();
  const { modules, activeMod, setActiveMod, openResourceById } = useIALabProgressContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const performSearch = useCallback((q) => {
    if (!q.trim()) { setResults([]); return; }
    const hits = [];

    modules.forEach(mod => {
      const modScore = fuzzyScore(q, mod.title);
      if (modScore > 0) {
        hits.push({ score: modScore, type: 'module', id: mod.id, label: mod.title, sublabel: t('ialab.global_search.module_label', { id: mod.id }), modId: mod.id });
      }
      const content = getModuleContent(mod.id);
      if (content?.accordion) {
        const topics = Array.isArray(content.accordion) ? content.accordion : [];
        topics.forEach(topic => {
          const topicScore = fuzzyScore(q, topic.title || '');
          if (topicScore > 0) {
            hits.push({ score: topicScore, type: 'topic', id: `mod${mod.id}-${topic.id}`, label: topic.title, sublabel: t('ialab.global_search.topic_label', { title: mod.title }), modId: mod.id });
          }
          if (topic.resources) {
            topic.resources.forEach(r => {
              const rTitle = r.title || r.name || '';
              if (!SEARCHABLE_TYPES.includes(r.type)) return;
              const resScore = fuzzyScore(q, rTitle);
              if (resScore > 0) {
                hits.push({ score: resScore, type: 'resource', id: r.id, label: rTitle, sublabel: `${mod.title}`,
                  modId: mod.id, resource: r, topicId: topic.id });
              }
            });
          }
        });
      }
    });

    hits.sort((a, b) => b.score - a.score);
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
      <div role="dialog" aria-modal="true" aria-label={t('ialab.search_aria')} className="fixed inset-0 z-[1002] bg-white dark:bg-slate-900 flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 -ml-1" aria-label={t('ialab.global_search.close_aria')}>
            <Icon name="fa-arrow-left" className="text-lg" aria-hidden="true" />
          </button>
          <div className="flex-1 relative">
            <Icon name="fa-search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              placeholder={t('ialab.global_search.placeholder')}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50"
              autoFocus
              aria-label={t('ialab.search_aria')}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {query && (
            <p className="text-xs text-slate-400 mb-3" aria-live="polite" aria-atomic="true">
              {results.length > 0 ? t('ialab.global_search.results_count', { count: results.length }) : t('ialab.global_search.no_results', { query })}
            </p>
          )}
          {results.map((hit, i) => (
            <button key={`${hit.type}-${hit.id}-${i}`}
              onClick={() => { handleSelect(hit); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-petroleum/5 dark:hover:bg-petroleum/10 transition-colors text-left border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div className="w-8 h-8 rounded-xl bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
                {hit.type === 'module' ? <Icon name="fa-layer-group" className="text-sm text-petroleum" aria-hidden="true" /> :
                 hit.type === 'topic' ? <Icon name="fa-folder" className="text-sm text-petroleum" aria-hidden="true" /> :
                 <Icon name="fa-file" className="text-sm text-petroleum" aria-hidden="true" />}
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
                <Icon name="fa-search" className="text-2xl text-slate-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-slate-500">{t('ialab.global_search.empty_title')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('ialab.global_search.empty_hint')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const [activeDescendant, setActiveDescendant] = useState(null);

  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = activeIndex < results.length - 1 ? activeIndex + 1 : 0;
      setActiveIndex(next);
      setActiveDescendant(`search-result-${next}`);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = activeIndex > 0 ? activeIndex - 1 : results.length - 1;
      setActiveIndex(prev);
      setActiveDescendant(`search-result-${prev}`);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  return (
    <div ref={panelRef} className="relative">
      <div className="flex items-center">
        <div className="relative" role="combobox" aria-expanded={isOpen && query.length > 0} aria-haspopup="listbox" aria-controls="search-listbox">
          <Icon name="fa-search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(-1); setActiveDescendant(null); }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={t('ialab.global_search.placeholder_short')}
            className="min-w-[180px] h-9 pl-8 pr-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-petroleum/40 focus:border-petroleum/50 transition-all duration-200"
            aria-label={t('ialab.global_search.search_aria')}
            aria-autocomplete="list"
            aria-controls="search-listbox"
            aria-activedescendant={activeDescendant}
            role="searchbox"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-600 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>
      </div>

      {isOpen && query && results.length > 0 && (
        <div id="search-listbox" role="listbox" aria-label={t('ialab.global_search.results_label')} aria-live="polite" aria-atomic="true" className="absolute top-full mt-1.5 left-0 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-[300] overflow-hidden">
          <div className="p-1.5 space-y-0.5">
            {results.map((hit, i) => (
              <button
                key={`${hit.type}-${hit.id}-${i}`}
                id={`search-result-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onClick={() => handleSelect(hit)}
                onMouseEnter={() => { setActiveIndex(i); setActiveDescendant(`search-result-${i}`); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  i === activeIndex
                    ? 'bg-petroleum/10 dark:bg-petroleum/20'
                    : 'hover:bg-petroleum/5 dark:hover:bg-petroleum/10'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-petroleum/8 dark:bg-petroleum/20 flex items-center justify-center flex-shrink-0">
                  {hit.type === 'module' ? <Icon name="fa-layer-group" className="text-[10px] text-petroleum" aria-hidden="true" /> :
                   hit.type === 'topic' ? <Icon name="fa-folder" className="text-[10px] text-petroleum" aria-hidden="true" /> :
                   <Icon name="fa-file" className="text-[10px] text-petroleum" aria-hidden="true" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{hit.label}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-500 truncate">{hit.sublabel}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-700">
            <p className="text-[10px] text-slate-600">{t('ialab.global_search.results_count', { count: results.length })}</p>
          </div>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div aria-live="polite" aria-atomic="true" className="absolute top-full mt-1.5 left-0 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-[300] p-4 text-center">
          <p className="text-xs text-slate-600">{t('ialab.global_search.no_results', { query })}</p>
        </div>
      )}
    </div>
  );
};


GlobalSearchBar.propTypes = {
  mobile: PropTypes.bool,
  onClose: PropTypes.func,
};

export default GlobalSearchBar;
