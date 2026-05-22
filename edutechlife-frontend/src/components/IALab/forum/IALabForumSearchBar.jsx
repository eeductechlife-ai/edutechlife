import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';

const IALabForumSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const handleChange = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(value);
    }, 400);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className={`relative mb-3 transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-white dark:bg-slate-800 transition-all duration-200 ${
        isFocused
          ? 'border-petroleum/40 dark:border-petroleum/60 shadow-sm shadow-petroleum/5'
          : 'border-slate-200 dark:border-slate-700'
      }`}>
        <Icon name="fa-search" className={`text-sm transition-colors ${isFocused ? 'text-petroleum' : 'text-slate-600'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Buscar en la comunidad..."
          className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-600 focus:outline-none"
          maxLength={200}
        />
        {query && (
          <button onClick={handleClear} className="text-slate-600 hover:text-slate-600 transition-colors">
            <Icon name="fa-xmark" className="text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

export default IALabForumSearchBar;
