import { loadFromCache, saveToCache } from "./supabaseQueries";

export function restoreFromCache(userId, setters) {
  const cached = loadFromCache(userId);
  if (cached) {
    if (typeof cached.courseProgress === "number")
      setters.setCourseProgress(cached.courseProgress);
    if (Array.isArray(cached.completedModules))
      setters.setCompletedModules(cached.completedModules);
    if (Array.isArray(cached.visitedModules)) {
      setters.setVisitedModules((prev) => {
        const merged = [...new Set([...prev, ...cached.visitedModules])];
        return merged.sort((a, b) => a - b);
      });
    }
    return true;
  }
  return false;
}

export function persistProgressToCache(courseProgress, completedModules, visitedModules, userId) {
  saveToCache(
    { courseProgress, completedModules, visitedModules },
    userId,
  );
}
