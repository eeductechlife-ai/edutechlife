/**
 * useIALabProgress — Carga/guarda progreso de usuario desde Supabase
 *
 * Responsabilidad: Gestiona la carga inicial de progreso (con cache localStorage
 * para UX instantánea), track de actividades (exam, challenge, community,
 * resource), y persistencia bidireccional localStorage ↔ Supabase.
 *
 * Store access: useIALabContext() para lecturas reactivas del progreso,
 *   useIALabStore.getState() para cache operations (set/get/removeProgressCache)
 *
 * Flujo de carga:
 *   1. Cache hit → aplicar inmediato (UX instantánea)
 *   2. Supabase fetch → getAllProgress() → calculateGlobalProgressFromDB() (5 queries)
 *   3. Guardar en cache → actualizar store con syncFromPersistence
 *
 * Side effects: beforeunload handler para cache, debounced save de última lección
 *
 * @see src/lib/progress.js — createProgressService (capa de datos Supabase)
 */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  useIALabProgressContext,
  useIALabUIContext,
} from "../../../context/IALabContext";
import { useIALabStore } from "../../../store/ialabStore";
import { useSupabase } from "../../useSupabase";
import {
  setSupabaseClient,
  createProgressService,
} from "../../../lib/progress";
import { checkAndFixRLS } from "../../../lib/rls-fixer";
import { PROGRESS_STATUS } from "./progressCalculations";
import { loadFromCache } from "./supabaseQueries";
import {
  trackResourceViewed as trackResourceViewedFn,
  trackExamResult as trackExamResultFn,
  trackChallengeResult as trackChallengeResultFn,
  trackCommunityComment as trackCommunityCommentFn,
  loadModuleBreakdown as loadModuleBreakdownFn,
} from "./progressTracking";
import {
  restoreFromCache as restoreFromCacheFn,
  persistProgressToCache,
} from "./progressStorage";

/**
 * HOOK: useIALabProgress
 *
 * Responsabilidad: Gestión del progreso del usuario en Supabase
 * - Inyecta cliente Supabase con JWT de Clerk
 * - Cargar progreso al iniciar
 * - Guardar progreso al completar módulos/lecciones
 * - Sincronizar con estados del contexto
 * - Manejar estados de loading/error
 */

export const useIALabProgress = () => {
  const {
    activeMod,
    completedModules,
    setCompletedModules,
    visitedModules,
    setVisitedModules,
    isLoadingProgress,
    setIsLoadingProgress,
    courseProgress,
    setCourseProgress,
    modules,
    updateModuleActivity,
  } = useIALabProgressContext();

  const isChallengeCompleted = useIALabStore((s) => s.isChallengeCompleted);
  const challengeScore = useIALabStore((s) => s.challengeScore);
  const quizPassed = useIALabStore((s) => s.quizPassed);
  const quizScore = useIALabStore((s) => s.quizScore);

  const { user, isLoaded, currentLessonIndex, setCurrentLessonIndex } =
    useIALabUIContext();

  const { supabase: supabaseClient, isLoading: supabaseLoading } =
    useSupabase();

  const progressService = useMemo(() => {
    if (!supabaseClient) return null;
    setSupabaseClient(supabaseClient);
    return createProgressService(supabaseClient);
  }, [supabaseClient]);

  const [progressError, setProgressError] = useState(null);
  const hasLoadedRef = useRef(false);
  const cancelledRef = useRef(false);

  // ==================== PERSISTENCIA LOCAL ====================

  const restoreFromCache = useCallback(() => {
    return restoreFromCacheFn(user?.id, {
      setCourseProgress,
      setCompletedModules,
      setVisitedModules,
    });
  }, [user?.id, setCourseProgress, setCompletedModules, setVisitedModules]);

  // ==================== CARGAR PROGRESO INICIAL ====================

  const loadUserProgress = useCallback(async () => {
    if (!user || !user.id) {
      setIsLoadingProgress(false);
      return;
    }

    if (!progressService) {
      return;
    }

    try {
      setProgressError(null);

      const hasCache = restoreFromCache();

      if (!hasCache) {
        setIsLoadingProgress(true);
      }

      if (cancelledRef.current) return;

      const fullProgress = await progressService.getFullUserProgress(user.id);

      if (cancelledRef.current) return;

      if (fullProgress && fullProgress.allProgress.length > 0) {
        const { allProgress, moduleBreakdowns, globalProgress, lastProgress } =
          fullProgress;
        const summaryRows = allProgress.filter(
          (p) => !p.activity_type && !p.resource_id,
        );

        const completed = summaryRows
          .filter(
            (p) => p.is_completed || (p.module_score && p.module_score >= 80),
          )
          .map((p) => p.module_id);

        const visited = [...new Set(allProgress.map((p) => p.module_id))];

        if (!cancelledRef.current) {
          setCompletedModules(completed);
          setVisitedModules((prev) => {
            const uniqueVisited = [...new Set([...prev, ...visited])];
            return uniqueVisited.sort((a, b) => a - b);
          });
        }

        if (!cancelledRef.current && globalProgress > 0) {
          setCourseProgress(globalProgress);
        }

        if (cancelledRef.current) return;

        // Restaurar no es progresar: `silent` evita volver a premiar con XP,
        // marcar la racha del día y reenviar a Supabase lo ya leído. Sin él,
        // cada recarga inflaba el XP y falseaba la constancia.
        const restore = { silent: true };

        for (let modId = 1; modId <= 5; modId++) {
          if (cancelledRef.current) return;
          const breakdown = moduleBreakdowns[modId];
          if (breakdown) {
            if (breakdown.exam.passed) {
              if (cancelledRef.current) return;
              updateModuleActivity(
                modId,
                "exam",
                true,
                breakdown.exam.score,
                restore,
              );
            }
            if (breakdown.challenge.score > 0) {
              if (cancelledRef.current) return;
              updateModuleActivity(
                modId,
                "challenge",
                true,
                breakdown.challenge.score,
                restore,
              );
            }
            if (breakdown.resources.earned > 0) {
              if (cancelledRef.current) return;
              updateModuleActivity(
                modId,
                "resourcesCompleted",
                true,
                undefined,
                restore,
              );
            }
            if (breakdown.community.commented) {
              if (cancelledRef.current) return;
              updateModuleActivity(
                modId,
                "community",
                true,
                undefined,
                restore,
              );
            }
          }
        }

        if (cancelledRef.current) return;

        persistProgressToCache(
          globalProgress > 0 ? globalProgress : 0,
          completed,
          visited,
          user?.id,
        );

        if (
          !cancelledRef.current &&
          lastProgress &&
          lastProgress.module_id === activeMod
        ) {
          const lastLessonData =
            lastProgress.last_lesson_id || lastProgress.current_lesson;
          if (lastLessonData && lastLessonData >= 0) {
            setCurrentLessonIndex(Math.min(lastLessonData, 5));
          }
        }
      } else {
        if (!cancelledRef.current) {
          setCompletedModules([]);
          setVisitedModules([1]);
        }
      }

      if (!cancelledRef.current) {
        setIsLoadingProgress(false);
        hasLoadedRef.current = true;
      }
    } catch (error) {
      console.error("[PROGRESS] Error cargando progreso:", error);
      if (!cancelledRef.current) {
        setProgressError(error.message || "Error al cargar progreso");

        if (!loadFromCache(user?.id)) {
          setCompletedModules([]);
          setVisitedModules([1]);
        }
        setIsLoadingProgress(false);
      }
    }
  }, [
    user,
    activeMod,
    setCompletedModules,
    setVisitedModules,
    setCourseProgress,
    setCurrentLessonIndex,
    setIsLoadingProgress,
    updateModuleActivity,
    restoreFromCache,
    progressService,
  ]);

  // ==================== GUARDAR PROGRESO ====================

  const saveModuleProgress = useCallback(
    async (moduleId, status, additionalData = {}) => {
      if (!user || !user.id) {
        return { success: false, error: "Usuario no autenticado" };
      }

      if (!progressService) {
        return { success: false, error: "Servicio de progreso no disponible" };
      }

      try {
        const result = await progressService.saveProgress(
          moduleId,
          status,
          additionalData,
          user.id,
        );

        if (result.success) {
          if (status === PROGRESS_STATUS.COMPLETED) {
            updateModuleActivity(moduleId, "exam", true, 100);
            updateModuleActivity(moduleId, "challenge", true, 100);
            updateModuleActivity(moduleId, "resourcesCompleted", true);
            updateModuleActivity(moduleId, "community", true);

            setCompletedModules((prev) => {
              if (!prev.includes(moduleId)) {
                return [...prev, moduleId].sort((a, b) => a - b);
              }
              return prev;
            });

            const storeGlobalProgress = useIALabStore.getState().courseProgress;
            if (storeGlobalProgress > 0) setCourseProgress(storeGlobalProgress);
          }

          setVisitedModules((prev) => {
            if (!prev.includes(moduleId)) {
              return [...prev, moduleId].sort((a, b) => a - b);
            }
            return prev;
          });

          return { success: true, data: result.data };
        } else {
          console.error("Error guardando progreso:", result.error);
          return { success: false, error: result.error };
        }
      } catch (error) {
        console.error("Excepción guardando progreso:", error);
        return { success: false, error: error.message || "Error desconocido" };
      }
    },
    [
      user,
      setCompletedModules,
      setVisitedModules,
      setCourseProgress,
      updateModuleActivity,
      progressService,
    ],
  );

  // ==================== GUARDAR ÚLTIMA LECCIÓN ====================

  const saveCurrentLesson = useCallback(async () => {
    if (!user || !user.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    if (!progressService) {
      return { success: false, error: "Servicio de progreso no disponible" };
    }

    try {
      const result = await progressService.saveLastLesson(
        activeMod,
        currentLessonIndex,
        user.id,
      );

      if (result.success) {
        return { success: true };
      } else {
        console.error("Error guardando lección actual:", result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Excepción guardando lección actual:", error);
      return { success: false, error: error.message || "Error desconocido" };
    }
  }, [user, activeMod, currentLessonIndex, progressService]);

  // ==================== COMPLETAR MÓDULO ====================

  const completeCurrentModule = useCallback(async () => {
    if (!user || !user.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    try {
      const additionalData = {
        completed_at: new Date().toISOString(),
        module_title:
          modules.find((m) => m.id === activeMod)?.title ||
          `Módulo ${activeMod}`,
        challenge_completed: isChallengeCompleted,
        challenge_score: challengeScore,
        quiz_passed: quizPassed,
        quiz_score: quizScore,
      };

      const result = await saveModuleProgress(
        activeMod,
        PROGRESS_STATUS.COMPLETED,
        additionalData,
      );

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        console.error(`Error completando módulo ${activeMod}:`, result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error(`Excepción completando módulo ${activeMod}:`, error);
      return { success: false, error: error.message || "Error desconocido" };
    }
  }, [
    user,
    activeMod,
    saveModuleProgress,
    isChallengeCompleted,
    challengeScore,
    quizPassed,
    quizScore,
  ]);

  // ==================== NUEVAS FUNCIONES DE TRACKING ====================

  const trackResourceViewed = useCallback(
    async (moduleId, resourceId, resourceType) => {
      return trackResourceViewedFn(
        moduleId,
        resourceId,
        resourceType,
        user,
        progressService,
        updateModuleActivity,
      );
    },
    [user, updateModuleActivity, progressService],
  );

  const trackExamResult = useCallback(
    async (moduleId, score, passed) => {
      return trackExamResultFn(
        moduleId,
        score,
        passed,
        user,
        progressService,
        updateModuleActivity,
      );
    },
    [user, updateModuleActivity, progressService],
  );

  const trackChallengeResult = useCallback(
    async (moduleId, score) => {
      return trackChallengeResultFn(
        moduleId,
        score,
        user,
        progressService,
        updateModuleActivity,
      );
    },
    [user, updateModuleActivity, progressService],
  );

  const trackCommunityComment = useCallback(
    async (moduleId) => {
      return trackCommunityCommentFn(
        moduleId,
        user,
        progressService,
        updateModuleActivity,
      );
    },
    [user, updateModuleActivity, progressService],
  );

  const loadModuleBreakdown = useCallback(
    async (moduleId) => {
      return loadModuleBreakdownFn(moduleId, user, progressService);
    },
    [user, progressService],
  );

  // ==================== EFFECTS ====================

  // Diagnóstico: verificar RLS en user_progress al cargarse
  useEffect(() => {
    if (supabaseClient && user?.id) {
      checkAndFixRLS(supabaseClient, user.id);
    }
  }, [supabaseClient, user?.id]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user?.id) {
      setIsLoadingProgress(false);
      return;
    }

    if (!progressService) {
      return;
    }

    cancelledRef.current = false;
    loadUserProgress();

    return () => {
      cancelledRef.current = true;
    };
  }, [user?.id, isLoaded, progressService]);

  useEffect(() => {
    return () => {
      persistProgressToCache(
        courseProgress,
        completedModules,
        visitedModules,
        user?.id,
      );
    };
  }, [courseProgress, completedModules, visitedModules, user?.id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        useIALabStore.getState().setProgressCache({
          courseProgress,
          completedModules,
          visitedModules,
          timestamp: Date.now(),
          userId: user?.id,
        });
      } catch (e) {}
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [courseProgress, completedModules, visitedModules, user?.id]);

  useEffect(() => {
    if (!user?.id || currentLessonIndex === 0) return;

    const timer = setTimeout(() => {
      saveCurrentLesson();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user?.id, currentLessonIndex]);

  // ==================== RETURN ====================

  return {
    isLoadingProgress: isLoadingProgress || supabaseLoading,
    progressError,
    completedModules,
    visitedModules,
    courseProgress,

    loadUserProgress,
    saveModuleProgress,
    saveCurrentLesson,
    completeCurrentModule,

    trackResourceViewed,
    trackExamResult,
    trackChallengeResult,
    trackCommunityComment,
    loadModuleBreakdown,

    PROGRESS_STATUS,

    isChallengeCompleted,
    challengeScore,
    quizPassed,
    quizScore,
  };
};
