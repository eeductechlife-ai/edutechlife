import { useState } from "react";

const STORAGE_KEY = "edutechlife_parental_controls";

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { features: {}, dailyTimeLimitMin: 0, chatEnabled: true };
};

export function useParentalControls() {
  const [controls] = useState(readStorage);

  const isFeatureEnabled = (tabId) => {
    if (!controls.features || Object.keys(controls.features).length === 0)
      return true;
    return controls.features[tabId] !== false;
  };

  return { controls, isFeatureEnabled };
}
