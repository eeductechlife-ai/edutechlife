import { useEffect, useState } from "react";
import { useIALabStore } from "../../store/ialabStore";
import {
  COMPETENCY_HISTORY_KEY,
  parseHistory,
  recordSnapshot,
  buildTrend,
} from "../../utils/competencyHistory";

const todayKey = () => new Date().toISOString().split("T")[0];

/**
 * Historial de competencia: registra un punto por día cuando el puntaje de
 * los módulos cambia y devuelve la serie para graficar. Aditivo: solo escribe
 * una clave propia en localStorage; no altera el store ni el sync.
 */
export default function useCompetencyHistory() {
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const courseProgress = useIALabStore((s) => s.courseProgress);

  const [history, setHistory] = useState(() => {
    try {
      return parseHistory(localStorage.getItem(COMPETENCY_HISTORY_KEY));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const scores = [1, 2, 3, 4, 5].map(
      (id) => moduleProgress?.[id]?.currentScore ?? 0,
    );
    const average = Math.round(
      scores.reduce((sum, value) => sum + value, 0) / scores.length,
    );

    setHistory((prev) => {
      const next = recordSnapshot(prev, { date: todayKey(), average, scores });
      if (next === prev) return prev;
      try {
        localStorage.setItem(COMPETENCY_HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* almacenamiento no disponible */
      }
      return next;
    });
  }, [moduleProgress, courseProgress]);

  return { history, trend: buildTrend(history) };
}
