import { useState, useCallback } from "react";

const MAX_SAVED = 20;

function storageKey() {
  let owner = "anon";
  try {
    owner = localStorage.getItem("user_email") || owner;
  } catch {
    // storage unavailable
  }
  return `practicar_materiales::${owner}`;
}

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(storageKey()) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(list));
  } catch {
    // storage full or blocked; the in-memory list still works this session
  }
}

export function useSavedMaterials() {
  const [saved, setSaved] = useState(read);

  const save = useCallback((material) => {
    const entry = {
      ...material,
      id: `${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setSaved((prev) => {
      const next = [entry, ...prev].slice(0, MAX_SAVED);
      write(next);
      return next;
    });
    return entry.id;
  }, []);

  const remove = useCallback((id) => {
    setSaved((prev) => {
      const next = prev.filter((m) => m.id !== id);
      write(next);
      return next;
    });
  }, []);

  return { saved, save, remove };
}
