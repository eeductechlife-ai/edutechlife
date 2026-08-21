import { useCallback, useState } from "react";

const STORAGE_KEY = "ialab-tool-chrome";

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

  const toggle = useCallback(() => {
    setState((prev) => {
      const next = !prev.enabled;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...readStored(), [theme]: next }),
        );
      } catch {
        // almacenamiento no disponible: el toggle sigue funcionando en memoria
      }
      return { theme, enabled: next };
    });
  }, [theme]);

  return {
    enabled: state.enabled,
    toggle,
    supported: TOOL_CHROME_THEMES.includes(theme),
  };
}
