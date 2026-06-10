import React, { useState } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useReadingPreferences } from '../../../hooks/IALab/useReadingPreferences';

const FONT_SIZES = [14, 16, 18, 20, 24];

const THEMES = [
  { id: 'light', icon: 'fa-sun', label: 'Claro' },
  { id: 'sepia', icon: 'fa-book', label: 'Sepia' },
  { id: 'dark', icon: 'fa-moon', label: 'Oscuro' },
];

const FONTS = [
  { id: 'sans', label: 'Sans' },
  { id: 'serif', label: 'Serif' },
  { id: 'mono', label: 'Mono' },
];

const THEME_STYLES = {
  light: { bg: '#FFFFFF', text: '#1A1A2E', accent: '#004B63' },
  sepia: { bg: '#F5F0E8', text: '#3D2E1A', accent: '#8B6914' },
  dark: { bg: '#1A1A2E', text: '#E0E0E0', accent: '#00BCD4' },
};

export function ReadingModeOverlay({ children }) {
  const { fontSize, theme, fontFamily, setFontSize, setTheme, setFontFamily, resetDefaults } = useReadingPreferences();
  const [toolbarOpen, setToolbarOpen] = useState(false);

  const styles = THEME_STYLES[theme];
  const fontClass = fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <div
      className="relative rounded-xl overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'mono' ? '"Courier New", monospace' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.8,
      }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: styles.accent + '20', backgroundColor: styles.bg }}>
        <button
          onClick={() => setToolbarOpen(v => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors hover:opacity-70"
          style={{ color: styles.accent }}
          aria-label={toolbarOpen ? 'Cerrar controles' : 'Abrir controles de lectura'}
        >
          <Icon name="fa-font" aria-hidden="true" />
          {toolbarOpen ? 'Ocultar' : 'Lectura'}
        </button>

        {toolbarOpen && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {FONT_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${fontSize === size ? 'bg-petroleum text-white' : ''}`}
                  style={fontSize === size ? {} : { color: styles.text, opacity: 0.6 }}
                  aria-label={`Tamaño ${size}px`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="w-px h-5" style={{ backgroundColor: styles.accent + '20' }} />

            <div className="flex items-center gap-1">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${theme === t.id ? 'ring-2' : 'opacity-50 hover:opacity-80'}`}
                  style={{
                    backgroundColor: THEME_STYLES[t.id].bg,
                    color: THEME_STYLES[t.id].text,
                    ringColor: styles.accent,
                  }}
                  aria-label={`Tema ${t.label}`}
                  title={t.label}
                >
                  <Icon name={t.icon} aria-hidden="true" />
                </button>
              ))}
            </div>

            <div className="w-px h-5" style={{ backgroundColor: styles.accent + '20' }} />

            <div className="flex items-center gap-1">
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFontFamily(f.id)}
                  className={`px-2 h-7 rounded text-xs font-semibold transition-colors ${fontFamily === f.id ? 'bg-petroleum text-white' : ''}`}
                  style={fontFamily === f.id ? {} : { color: styles.text, opacity: 0.6 }}
                  aria-label={`Fuente ${f.label}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5" style={{ backgroundColor: styles.accent + '20' }} />

            <button
              onClick={resetDefaults}
              className="text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ color: styles.text, opacity: 0.5 }}
              aria-label="Restaurar valores por defecto"
            >
              <Icon name="fa-rotate" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className={`px-6 py-4 ${fontClass} leading-relaxed`}
        style={{ lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

export default ReadingModeOverlay;
