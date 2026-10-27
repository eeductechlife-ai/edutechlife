import { useEffect, useRef, useState } from "react";
import { useAuthIdentity } from "../useAuthIdentity";

// Estado de un OVA que sobrevive a cerrar el recurso o recargar la página.
// Se guarda en el navegador, por estudiante y por OVA:
//   ialab_ova_state::<userId>::<ovaId>::<nombre>
const PREFIX = "ialab_ova_state";

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin cuota o modo privado: el OVA sigue funcionando sin guardar */
  }
};

/**
 * Igual que useState, pero recuerda el valor entre sesiones.
 * Si la identidad del estudiante llega después del primer render, el valor
 * guardado de ese estudiante reemplaza al inicial.
 */
export function usePersistedOvaState(ovaId, name, initial) {
  const { userId } = useAuthIdentity();
  const key = `${PREFIX}::${userId || "anon"}::${ovaId}::${name}`;
  const [value, setValue] = useState(() => {
    const saved = read(key);
    if (saved !== undefined) return saved;
    return typeof initial === "function" ? initial() : initial;
  });
  const hydratedKey = useRef(key);
  const skipWrite = useRef(false);

  useEffect(() => {
    if (hydratedKey.current === key) return;
    hydratedKey.current = key;
    const saved = read(key);
    if (saved !== undefined) {
      skipWrite.current = true;
      setValue(saved);
    }
  }, [key]);

  useEffect(() => {
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    write(key, value);
  }, [key, value]);

  return [value, setValue];
}

/** Borra todo el estado guardado de un OVA del estudiante actual. */
export function clearOvaState(userId, ovaId) {
  try {
    const prefix = `${PREFIX}::${userId || "anon"}::${ovaId}::`;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* nada que borrar */
  }
}
