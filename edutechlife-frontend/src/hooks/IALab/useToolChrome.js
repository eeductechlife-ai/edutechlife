import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ialab-tool-chrome";

/* Evento propio: el evento nativo `storage` no se dispara en la misma
   pestaña, así que las instancias del hook se notifican entre sí para
   mantener el toggle sincronizado (header ↔ workspace). */
const SYNC_EVENT = "ialab-tool-chrome-change";

export const TOOL_CHROME_THEMES = ["chatgpt", "gemini", "notebooklm"];

const THEME_DEFAULT = {
  chatgpt: true,
  gemini: true,
  notebooklm: true,
};

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    if (raw === "on") return { "*": true };
    if (raw === "off") return { "*": false };
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function isEnabledFor(stored, theme) {
  if (theme in stored) return stored[theme];
  if ("*" in stored) return stored["*"];
  return THEME_DEFAULT[theme] || false;
}

export function useToolChrome(theme) {
  const [state, setState] = useState(() => ({
    theme,
    enabled: isEnabledFor(readStored(), theme),
  }));

  if (state.theme !== theme) {
    setState({ theme, enabled: isEnabledFor(readStored(), theme) });
  }

  useEffect(() => {
    const sync = () =>
      setState({ theme, enabled: isEnabledFor(readStored(), theme) });
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [theme]);

  const toggle = useCallback(() => {
    const stored = readStored();
    const next = !isEnabledFor(stored, theme);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, [theme]: next }),
      );
    } catch {
      // almacenamiento no disponible: el toggle sigue funcionando en memoria
    }
    setState({ theme, enabled: next });
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, [theme]);

  return {
    enabled: state.enabled,
    toggle,
    supported: TOOL_CHROME_THEMES.includes(theme),
  };
}
