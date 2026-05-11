import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabStore } from '../../store/ialabStore';
import { useSupabase } from '../useSupabase';
import { 
  setSupabaseClient,
  createProgressService,
  PROGRESS_STATUS,
  countModuleResources
} from '../../lib/progress';

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
    user,
    isLoaded,
    activeMod,
    completedModules,
    setCompletedModules,
    visitedModules,
    setVisitedModules,
    isLoadingProgress,
    setIsLoadingProgress,
    courseProgress,
    setCourseProgress,
    currentLessonIndex,
    setCurrentLessonIndex,
    isChallengeCompleted,
    challengeScore,
    quizPassed,
    quizScore,
    modules,
    updateModuleActivity
  } = useIALabContext();
  
  // Obtener cliente Supabase con JWT de Clerk
  const { supabase: supabaseClient, isLoading: supabaseLoading } = useSupabase();
  
  // Crear servicio de progreso con el cliente inyectado
  const progressService = useMemo(() => {
    if (!supabaseClient) return null;
    // Inyectar cliente para compatibilidad backward
    setSupabaseClient(supabaseClient);
    return createProgressService(supabaseClient);
  }, [supabaseClient]);
  
  const [progressError, setProgressError] = useState(null);
  const hasLoadedRef = useRef(false);
  
  // ==================== PERSISTENCIA LOCAL ====================
  
  const CACHE_DURATION = 3600000; // 1 hora
  
  const saveToCache = useCallback((data) => {
    try {
      const cacheData = {
        ...data,
        timestamp: Date.now(),
        userId: user?.id
      };
      useIALabStore.getState().setProgressCache(cacheData);
    } catch (e) {
      console.warn('[PROGRESS] Error guardando caché:', e);
    }
  }, [user?.id]);
  
  const loadFromCache = useCallback(() => {
    try {
      const cached = useIALabStore.getState().getProgressCache();
      if (!cached) return null;
      
      const data = cached;
      
      if (data.userId !== user?.id) return null;
      if (Date.now() - data.timestamp > CACHE_DURATION) {
        useIALabStore.getState().removeProgressCache();
        return null;
      }
      
      return data;
    } catch (e) {
      console.warn('[PROGRESS] Error cargando caché:', e);
      return null;
    }
  }, [user?.id]);
  
  // Restaurar progreso desde caché inmediatamente (UX instantánea)
  const restoreFromCache = useCallback(() => {
    const cached = loadFromCache();
    if (cached) {
      if (typeof cached.courseProgress === 'number') setCourseProgress(cached.courseProgress);
      if (Array.isArray(cached.completedModules)) setCompletedModules(cached.completedModules);
      if (Array.isArray(cached.visitedModules)) {
        setVisitedModules(prev => {
          const merged = [...new Set([...prev, ...cached.visitedModules])];
          return merged.sort((a, b) => a - b);
        });
      }
      return true;
    }
    return false;
  }, [loadFromCache, setCourseProgress, setCompletedModules, setVisitedModules]);
  
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
      setIsLoadingProgress(true);
      setProgressError(null);
      
      // Paso 1: Restaurar caché inmediatamente para UX instantánea
      const hasCache = restoreFromCache();
      
      
      
      // 2. Obtener todo el progreso del usuario
      const allProgress = await progressService.getAllProgress(user.id);
      
      if (allProgress && allProgress.length > 0) {
        // 3. Filtrar filas resumen
        const summaryRows = allProgress.filter(p => !p.activity_type && !p.resource_id);
        
        // 4. Extraer módulos completados
        const completed = summaryRows
          .filter(p => p.is_completed || (p.module_score && p.module_score >= 80))
          .map(p => p.module_id);
        
        // 5. Extraer módulos visitados
        const visited = [...new Set(allProgress.map(p => p.module_id))];
        
        // 6. Actualizar estados
        setCompletedModules(completed);
        setVisitedModules(prev => {
          const uniqueVisited = [...new Set([...prev, ...visited])];
          return uniqueVisited.sort((a, b) => a - b);
        });
        
        // 7. Calcular progreso global real
        const globalProgress = await progressService.calculateGlobalProgressFromDB(user.id);
        setCourseProgress(globalProgress || 0);
        
        
        // 8. Cargar moduleProgress desde la DB para cada módulo
        for (let modId = 1; modId <= 5; modId++) {
          try {
            const breakdown = await progressService.getModuleBreakdown(modId, user.id);
            if (breakdown) {
              if (breakdown.exam.passed) updateModuleActivity(modId, 'exam', true);
              if (breakdown.challenge.score > 0) updateModuleActivity(modId, 'challenge', true);
              if (breakdown.resources.earned > 0) updateModuleActivity(modId, 'resourcesCompleted', true);
              if (breakdown.community.commented) updateModuleActivity(modId, 'community', true);
            }
          } catch (err) {
            console.error(`[PROGRESS] Error cargando módulo ${modId}:`, err);
          }
        }
        
        // 9. Guardar en caché local
        saveToCache({
          courseProgress: globalProgress || 0,
          completedModules: completed,
          visitedModules: visited
        });
        
        // 10. Obtener última lección vista
        const lastProgress = await progressService.getUserLastProgress(user.id);
        if (lastProgress && lastProgress.module_id === activeMod) {
          const lastLessonData = lastProgress.last_lesson_id || lastProgress.current_lesson;
          if (lastLessonData && lastLessonData >= 0) {
            setCurrentLessonIndex(Math.min(lastLessonData, 5));
          }
        }
      } else {
        setCompletedModules([]);
        setVisitedModules([1]);
        setCourseProgress(0);
      }
      
    } catch (error) {
      console.error('[PROGRESS] Error cargando progreso:', error);
      setProgressError(error.message || 'Error al cargar progreso');
      
      // Fallback: mantener valores del caché o valores por defecto
      if (!loadFromCache()) {
        setCompletedModules([]);
        setVisitedModules([1]);
        setCourseProgress(0);
      }
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user, activeMod, setCompletedModules, setVisitedModules, setCourseProgress, setCurrentLessonIndex, setIsLoadingProgress, updateModuleActivity, restoreFromCache, saveToCache, loadFromCache, progressService]);
  
  // ==================== GUARDAR PROGRESO ====================
  
  const saveModuleProgress = useCallback(async (moduleId, status, additionalData = {}) => {
    if (!user || !user.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    if (!progressService) {
      return { success: false, error: 'Servicio de progreso no disponible' };
    }
    
    try {
      const result = await progressService.saveProgress(
        moduleId,
        status,
        additionalData,
        user.id
      );
      
      if (result.success) {
        
        if (status === PROGRESS_STATUS.COMPLETED) {
          setCompletedModules(prev => {
            if (!prev.includes(moduleId)) {
              return [...prev, moduleId].sort((a, b) => a - b);
            }
            return prev;
          });
          
          const newCompleted = [...completedModules, moduleId].filter((v, i, a) => a.indexOf(v) === i);
          const progressPercentage = Math.min((newCompleted.length / 5) * 100, 100);
          setCourseProgress(progressPercentage);
        }
        
        setVisitedModules(prev => {
          if (!prev.includes(moduleId)) {
            return [...prev, moduleId].sort((a, b) => a - b);
          }
          return prev;
        });
        
        return { success: true, data: result.data };
      } else {
        console.error('Error guardando progreso:', result.error);
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      console.error('Excepción guardando progreso:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }, [user, completedModules, setCompletedModules, setVisitedModules, setCourseProgress, progressService]);
  
  // ==================== GUARDAR ÚLTIMA LECCIÓN ====================
  
  const saveCurrentLesson = useCallback(async () => {
    if (!user || !user.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    if (!progressService) {
      return { success: false, error: 'Servicio de progreso no disponible' };
    }
    
    try {
      const result = await progressService.saveLastLesson(
        activeMod,
        currentLessonIndex,
        user.id
      );
      
      if (result.success) {
        return { success: true };
      } else {
        console.error('Error guardando lección actual:', result.error);
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      console.error('Excepción guardando lección actual:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }, [user, activeMod, currentLessonIndex, progressService]);
  
  // ==================== COMPLETAR MÓDULO ====================
  
  const completeCurrentModule = useCallback(async () => {
    if (!user || !user.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    try {
      
      // Datos adicionales para el progreso
      const additionalData = {
        completed_at: new Date().toISOString(),
        module_title: modules.find(m => m.id === activeMod)?.title || `Módulo ${activeMod}`,
        challenge_completed: isChallengeCompleted,
        challenge_score: challengeScore,
        quiz_passed: quizPassed,
        quiz_score: quizScore
      };
      
      const result = await saveModuleProgress(
        activeMod,
        PROGRESS_STATUS.COMPLETED,
        additionalData
      );
      
      if (result.success) {
        
        // Mostrar notificación de éxito
        // (esto se manejará en el componente que llama a esta función)
        
        return { success: true, data: result.data };
      } else {
        console.error(`Error completando módulo ${activeMod}:`, result.error);
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      console.error(`Excepción completando módulo ${activeMod}:`, error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }, [user, activeMod, saveModuleProgress, isChallengeCompleted, challengeScore, quizPassed, quizScore]);
  
  // ==================== NUEVAS FUNCIONES DE TRACKING ====================
  
  const trackResourceViewed = useCallback(async (moduleId, resourceId, resourceType) => {
    if (!user?.id) return { success: false, error: 'Usuario no autenticado' };
    if (!progressService) return { success: false, error: 'Servicio no disponible' };
    try {
      const total = countModuleResources(moduleId);
      const result = await progressService.saveResourceViewed(moduleId, resourceId, resourceType, total, user.id);
      if (result.success) {
        if (result.viewedCount >= Math.ceil(total * 0.8)) {
          updateModuleActivity(moduleId, 'resourcesCompleted', true);
        }
        const newProgress = await progressService.calculateGlobalProgressFromDB(user.id);
        setCourseProgress(newProgress);
      }
      return result;
    } catch (error) {
      console.error('Error tracking resource:', error);
      return { success: false, error: error.message };
    }
  }, [user, setCourseProgress, updateModuleActivity, progressService]);
  
  const trackExamResult = useCallback(async (moduleId, score, passed) => {
    if (!user?.id) return { success: false, error: 'Usuario no autenticado' };
    if (!progressService) return { success: false, error: 'Servicio no disponible' };
    try {
      const result = await progressService.saveExamProgress(moduleId, score, passed, user.id);
      if (result.success) {
        // Actualizar progreso con score proporcional (siempre actualiza, pero suma proporcional)
        updateModuleActivity(moduleId, 'exam', score >= 80, score);
        const newProgress = await progressService.calculateGlobalProgressFromDB(user.id);
        setCourseProgress(newProgress);
      }
      return result;
    } catch (error) {
      console.error('Error tracking exam:', error);
      return { success: false, error: error.message };
    }
  }, [user, setCourseProgress, updateModuleActivity, progressService]);
  
  const trackChallengeResult = useCallback(async (moduleId, score) => {
    if (!user?.id) return { success: false, error: 'Usuario no autenticado' };
    if (!progressService) return { success: false, error: 'Servicio no disponible' };
    try {
      const result = await progressService.saveChallengeProgress(moduleId, score, user.id);
      if (result.success) {
        // Actualizar progreso con score proporcional (siempre actualiza, pero suma proporcional)
        updateModuleActivity(moduleId, 'challenge', score >= 80, score);
        const newProgress = await progressService.calculateGlobalProgressFromDB(user.id);
        setCourseProgress(newProgress);
      }
      return result;
    } catch (error) {
      console.error('Error tracking challenge:', error);
      return { success: false, error: error.message };
    }
  }, [user, setCourseProgress, updateModuleActivity, progressService]);
  
  const trackCommunityComment = useCallback(async (moduleId) => {
    if (!user?.id) return { success: false, error: 'Usuario no autenticado' };
    if (!progressService) return { success: false, error: 'Servicio no disponible' };
    try {
      const result = await progressService.saveCommunityProgress(moduleId, user.id);
      if (result.success) {
        updateModuleActivity(moduleId, 'community', true);
        const newProgress = await progressService.calculateGlobalProgressFromDB(user.id);
        setCourseProgress(newProgress);
      }
      return result;
    } catch (error) {
      console.error('Error tracking community:', error);
      return { success: false, error: error.message };
    }
  }, [user, setCourseProgress, updateModuleActivity, progressService]);
  
  const loadModuleBreakdown = useCallback(async (moduleId) => {
    if (!user?.id) return null;
    if (!progressService) return null;
    try {
      return await progressService.getModuleBreakdown(moduleId, user.id);
    } catch (error) {
      console.error('Error loading module breakdown:', error);
      return null;
    }
  }, [user, progressService]);
  
  // ==================== EFFECTS ====================
  
  // Cargar progreso al montar o cuando cambia el usuario o el cliente Supabase
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
    
    loadUserProgress();
  }, [user?.id, isLoaded, progressService]);
  
  // Guardar en caché al salir del AI Lab (cleanup)
  useEffect(() => {
    return () => {
      saveToCache({
        courseProgress,
        completedModules,
        visitedModules
      });
    };
  }, [courseProgress, completedModules, visitedModules, saveToCache]);
  
  // Guardar al cerrar pestaña/navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        useIALabStore.getState().setProgressCache({
          courseProgress,
          completedModules,
          visitedModules,
          timestamp: Date.now(),
          userId: user?.id
        });
      } catch (e) {
        // Silenciar errores en beforeunload
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [courseProgress, completedModules, visitedModules, user?.id]);
  
  // Guardar lección actual cuando cambia (con debounce)
  useEffect(() => {
    // GUARDIA: Solo si hay usuario y lessonIndex válido
    if (!user?.id || currentLessonIndex === 0) return;
    
    const timer = setTimeout(() => {
      saveCurrentLesson();
    }, 1000); // Debounce de 1 segundo
    
    return () => clearTimeout(timer);
  }, [user?.id, currentLessonIndex]); // Dependencias específicas
  
  // ==================== RETURN ====================
  
  return {
    // Estados
    isLoadingProgress: isLoadingProgress || supabaseLoading,
    progressError,
    completedModules,
    visitedModules,
    courseProgress,
    
    // Funciones existentes
    loadUserProgress,
    saveModuleProgress,
    saveCurrentLesson,
    completeCurrentModule,
    
    // Nuevas funciones de tracking
    trackResourceViewed,
    trackExamResult,
    trackChallengeResult,
    trackCommunityComment,
    loadModuleBreakdown,
    
    // Constantes
    PROGRESS_STATUS,
    
    // Estados del desafío
    isChallengeCompleted,
    challengeScore,
    quizPassed,
    quizScore,
  };
};

// Nota: modules, isChallengeCompleted, challengeScore, quizPassed, quizScore
// se obtendrán del contexto cuando se use este hook en componentes
// Para mantener la independencia del hook, estos valores se pasan como parámetros
// cuando se llaman las funciones que los necesitan