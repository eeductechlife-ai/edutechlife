import { useIALabStore } from "../../../store/ialabStore";

const CACHE_DURATION = 3600000;

export function saveToCache(data, userId) {
  try {
    useIALabStore.getState().setProgressCache({
      ...data,
      timestamp: Date.now(),
      userId,
    });
  } catch (e) {
    console.warn("[PROGRESS] Error guardando caché:", e);
  }
}

export function loadFromCache(userId) {
  try {
    const cached = useIALabStore.getState().getProgressCache();
    if (!cached) return null;
    if (cached.userId !== userId) return null;
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      useIALabStore.getState().removeProgressCache();
      return null;
    }
    return cached;
  } catch (e) {
    console.warn("[PROGRESS] Error cargando caché:", e);
    return null;
  }
}
