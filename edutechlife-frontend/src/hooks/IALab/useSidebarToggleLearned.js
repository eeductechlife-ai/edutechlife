import { useCallback, useState } from "react";

const KEY = "ialab_sidebar_toggle_learned";

const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Recuerda si el estudiante ya usó el círculo de progreso para abrir/cerrar el
 * sidebar. Mientras no lo haya hecho, el aviso del círculo anima para llamar la
 * atención; después queda solo el chevrón estático.
 */
export function useSidebarToggleLearned() {
  const [learned, setLearned] = useState(read);
  const markLearned = useCallback(() => {
    setLearned(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* storage no disponible: el aviso simplemente no se recuerda */
    }
  }, []);
  return { learned, markLearned };
}

export default useSidebarToggleLearned;
