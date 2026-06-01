import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const A11yContext = createContext(null);

export const useA11y = () => useContext(A11yContext);

const A11yProvider = ({ children }) => {
  const [announcement, setAnnouncement] = useState('');
  const liveRef = useRef(null);
  const skipLinkRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    const lang = html.getAttribute('lang');
    if (!lang || lang === 'en') {
      const userLang = navigator.language?.startsWith('es') ? 'es' : 'en';
      html.setAttribute('lang', userLang);
    }
  }, []);

  const announce = useCallback((message) => {
    setAnnouncement('');
    requestAnimationFrame(() => setAnnouncement(message));
  }, []);

  const focusMain = useCallback(() => {
    const main = document.querySelector('main, #main-content, [role="main"]');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
      setTimeout(() => main.removeAttribute('tabindex'), 100);
    }
  }, []);

  const handleSkipClick = useCallback((e) => {
    e.preventDefault();
    focusMain();
  }, [focusMain]);

  return (
    <A11yContext.Provider value={{ announce, focusMain }}>
      <a
        ref={skipLinkRef}
        href="#main-content"
        onClick={handleSkipClick}
        className="skip-link"
      >
        Saltar al contenido principal / Skip to main content
      </a>

      {children}

      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </A11yContext.Provider>
  );
};

export default React.memo(A11yProvider);
