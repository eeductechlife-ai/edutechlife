import { useState, useEffect, useCallback, useRef } from 'react';
import { useIALabContext } from '../../context/IALabContext';
import { 
  getAllProgress, 
  saveProgress, 
  PROGRESS_STATUS, 
  saveLastLesson, 
  getUserLastProgress, 
  getProgress 
} from '../../lib/progress';

/**
 * HOOK: useIALabProgress
 * 
 * Responsabilidad: Gestión del progreso del usuario en Supabase
 * - Cargar progreso al iniciar
 * - Guardar progreso al completar módulos/lecciones
 * - Sincronizar con estados del contexto
 * - Manejar estados de loading/error
 */

export const useIALabProgress = () => {
  const {
    user,
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
    modules
  } = useIALabContext();
  
  const [progressError, setProgressError] = useState(null);
  const hasLoadedRef = useRef(false);
  
  // ==================== CARGAR PROGRESO INICIAL ====================
  
  const loadUserProgress = useCallback(async () => {
    if (!user || !user.id) {
      console.log('Usuario no autenticado, saltando carga de progreso');
      setIsLoadingProgress(false);
      return;
    }
    
    try {
      setIsLoadingProgress(true);
      setProgressError(null);
      
      console.log(`Cargando progreso para usuario: ${user.id}`);
      
      // 1. Obtener todo el progreso del usuario
      const allProgress = await getAllProgress(user.id);
      
      if (allProgress && allProgress.length > 0) {
        // 2. Extraer módulos completados
        const completed = allProgress
          .filter(p => p.status === PROGRESS_STATUS.COMPLETED)
          .map(p => p.module_id);
        
        // 3. Extraer módulos visitados (cualquier estado)
        const visited = allProgress.map(p => p.module_id);
        
        // 4. Actualizar estados
        setCompletedModules(completed);
        setVisitedModules(prev => {
          const uniqueVisited = [...new Set([...prev, ...visited])];
          return uniqueVisited.sort((a, b) => a - b);
        });
        
        // 5. Calcular progreso general del curso
        const progressPercentage = Math.min((completed.length / 5) * 100, 100);
        setCourseProgress(progressPercentage);
        
        console.log(`Progreso cargado: ${completed.length}/5 módulos completados (${progressPercentage}%)`);
        
        // 6. Obtener última lección vista si existe
        const lastProgress = await getUserLastProgress(user.id);
        if (lastProgress && lastProgress.module_id === activeMod) {
          const lastLessonData = lastProgress.progress_data?.last_lesson_index;
          if (lastLessonData !== undefined && lastLessonData >= 0) {
            setCurrentLessonIndex(Math.min(lastLessonData, 5)); // Máximo 6 lecciones (0-5)
          }
        }
      } else {
        console.log('Usuario sin progreso previo, iniciando desde cero');
        // Usuario nuevo, mantener valores por defecto
        setCompletedModules([]);
        setVisitedModules([1]); // Módulo 1 siempre visitado
        setCourseProgress(20); // 20% por defecto (módulo 1 iniciado)
      }
      
    } catch (error) {
      console.error('Error cargando progreso:', error);
      setProgressError(error.message || 'Error al cargar progreso');
      
      // Fallback: mantener valores por defecto
      setCompletedModules([]);
      setVisitedModules([1]);
      setCourseProgress(20);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user, activeMod, setCompletedModules, setVisitedModules, setCourseProgress, setCurrentLessonIndex, setIsLoadingProgress]);
  
  // ==================== GUARDAR PROGRESO ====================
  
  const saveModuleProgress = useCallback(async (moduleId, status, additionalData = {}) => {
    if (!user || !user.id) {
      console.log('Usuario no autenticado, no se puede guardar progreso');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    try {
      console.log(`Guardando progreso: módulo ${moduleId}, estado: ${status}`);
      
      const result = await saveProgress(
        moduleId,
        status,
        additionalData,
        user.id
      );
      
      if (result.success) {
        console.log(`Progreso guardado exitosamente para módulo ${moduleId}`);
        
        // Actualizar estados locales según el tipo de progreso
        if (status === PROGRESS_STATUS.COMPLETED) {
          // Agregar a módulos completados si no está ya
          setCompletedModules(prev => {
            if (!prev.includes(moduleId)) {
              return [...prev, moduleId].sort((a, b) => a - b);
            }
            return prev;
          });
          
          // Actualizar progreso general del curso
          const newCompleted = [...completedModules, moduleId].filter((v, i, a) => a.indexOf(v) === i);
          const progressPercentage = Math.min((newCompleted.length / 5) * 100, 100);
          setCourseProgress(progressPercentage);
          
          console.log(`Módulo ${moduleId} marcado como completado. Progreso total: ${progressPercentage}%`);
        }
        
        // Siempre agregar a módulos visitados
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
  }, [user, completedModules, setCompletedModules, setVisitedModules, setCourseProgress]);
  
  // ==================== GUARDAR ÚLTIMA LECCIÓN ====================
  
  const saveCurrentLesson = useCallback(async () => {
    if (!user || !user.id) {
      console.log('Usuario no autenticado, no se puede guardar lección actual');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    try {
      const result = await saveLastLesson(
        user.id,
        activeMod,
        currentLessonIndex,
        { timestamp: new Date().toISOString() }
      );
      
      if (result.success) {
        console.log(`Lección actual guardada: módulo ${activeMod}, lección ${currentLessonIndex}`);
        return { success: true };
      } else {
        console.error('Error guardando lección actual:', result.error);
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      console.error('Excepción guardando lección actual:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  }, [user, activeMod, currentLessonIndex]);
  
  // ==================== COMPLETAR MÓDULO ====================
  
  const completeCurrentModule = useCallback(async () => {
    if (!user || !user.id) {
      console.log('Usuario no autenticado, no se puede completar módulo');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    try {
      console.log(`Completando módulo ${activeMod} para usuario ${user.id}`);
      
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
        console.log(`Módulo ${activeMod} completado exitosamente`);
        
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
  
  // ==================== EFFECTS ====================
  
  // Cargar progreso al montar o cuando cambia el usuario
  useEffect(() => {
    // GUARDIA CRÍTICA: Solo ejecutar si hay usuario válido
    if (!user?.id) {
      setIsLoadingProgress(false);
      return;
    }
    
    // Evitar llamadas duplicadas
    if (hasLoadedRef.current) return;
    
    loadUserProgress();
    hasLoadedRef.current = true;
  }, [user?.id]); // Dependencia específica, no la función completa
  
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
    isLoadingProgress,
    progressError,
    completedModules,
    visitedModules,
    courseProgress,
    
    // Funciones
    loadUserProgress,
    saveModuleProgress,
    saveCurrentLesson,
    completeCurrentModule,
    
    // Constantes
    PROGRESS_STATUS,
    
    // Estados del desafío (para componentes que los necesiten)
    isChallengeCompleted,
    challengeScore,
    quizPassed,
    quizScore
  };
};

// Nota: modules, isChallengeCompleted, challengeScore, quizPassed, quizScore
// se obtendrán del contexto cuando se use este hook en componentes
// Para mantener la independencia del hook, estos valores se pasan como parámetros
// cuando se llaman las funciones que los necesitan