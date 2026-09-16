import { useEffect, useState } from "react";
import {
  EVALUATION_HISTORY_KEY,
  parseEvaluationHistory,
  buildAxisAverages,
} from "../../utils/evaluationHistory";

const emptyState = { averages: [], samples: [] };

const read = () => {
  try {
    return buildAxisAverages(
      parseEvaluationHistory(localStorage.getItem(EVALUATION_HISTORY_KEY)),
    );
  } catch {
    return emptyState;
  }
};

/**
 * Promedios por eje a partir del historial real de evaluaciones (Fase C).
 * Aditivo: solo lee una clave propia de localStorage.
 */
export default function useEvaluationHistory() {
  const [state, setState] = useState(read);

  useEffect(() => {
    const onFocus = () => setState(read());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return state;
}
