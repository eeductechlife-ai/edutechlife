import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';
import { useSupabase } from './useSupabase';
import { 
  syncProgressToSupabase, 
  syncActivityToSupabase,
  loadProgressFromSupabase, 
  mergeProgress,
  setupConnectionListener
} from '../services/progressSync';

const STORAGE_KEYS = {
  videos: 'ialab_completed_videos',
  modules: 'ialab_completed_modules',
  exams: 'ialab_completed_exams',
  infographics: 'ialab_completed_infographics',
  activities: 'ialab_completed_activities',
  progress: 'ialab_overall_progress'
};

const MODULE_CONFIG = [
  { id: 1, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 2, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 3, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 4, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 5, videos: 1, infographics: 2, hasExam: false, hasProject: true }
];

const TOTAL_ITEMS = MODULE_CONFIG.reduce((acc, m) => 
  acc + m.videos + m.infographics + (m.hasExam ? 1 : 0) + (m.hasActivity ? 1 : 0), 0);

/**
 * Hook unificado para gestión de progreso con persistencia Clerk + Supabase
 * 
 * Características:
 * - Sincronización automática con Supabase cuando hay conexión
 * - Fallback a localStorage cuando no hay conexión
 * - Merge inteligente de datos locales y remotos
 * - Limpieza automática al cerrar sesión
 * - Cola de sincronización para modo offline
 * 
 * @returns {Object} Estado y funciones de progreso
 */
export const usePersistentProgress = () => {
  const { user: clerkUser } = useUser();
  const { isSignedIn } = useClerkAuth();
  const { supabase, isLoading: supabaseLoading, isUsingJWT, userId: supabaseUserId } = useSupabase();
  
  // Use userId from Supabase hook (extracted from JWT token) as primary source
  const userId = supabaseUserId || clerkUser?.id;
  const isUserReady = isSignedIn && userId;
  
  const [completedVideos, setCompletedVideos] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [completedExams, setCompletedExams] = useState({});
  const [completedInfographics, setCompletedInfographics] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error | offline
  
  const syncTimeoutRef = useRef(null);
  const connectionCleanupRef = useRef(null);

  // Calcular progreso general
  const calculateProgress = useCallback((videos, modules, exams, infographics, activities) => {
    const modulesCompleted = modules.length;
    const examsCompleted = Object.values(exams).filter(Boolean).length;
    const videosCompleted = videos.length;
    const infographicsCompleted = infographics.length;
    const activitiesCompleted = activities.length;
    
    const completedItems = modulesCompleted + examsCompleted + videosCompleted + infographicsCompleted + activitiesCompleted;
    return Math.min(100, Math.round((completedItems / TOTAL_ITEMS) * 100));
  }, []);

  // Guardar en localStorage
  const saveToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(data.completedVideos));
      localStorage.setItem(STORAGE_KEYS.modules, JSON.stringify(data.completedModules));
      localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(data.completedExams));
      localStorage.setItem(STORAGE_KEYS.infographics, JSON.stringify(data.completedInfographics));
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(data.completedActivities));
      
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify({
        percent: calculateProgress(data.completedVideos, data.completedModules, data.completedExams, 
          data.completedInfographics, data.completedActivities),
        videos: data.completedVideos.length,
        modules: data.completedModules.length,
        exams: Object.values(data.completedExams).filter(Boolean).length,
        infographics: data.completedInfographics.length,
        activities: data.completedActivities.length,
        lastUpdate: new Date().toISOString()
      }));
    } catch (error) {
      console.error('❌ Error guardando en localStorage:', error);
    }
  }, [calculateProgress]);

  // Cargar desde localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedVideos = localStorage.getItem(STORAGE_KEYS.videos);
      const savedModules = localStorage.getItem(STORAGE_KEYS.modules);
      const savedExams = localStorage.getItem(STORAGE_KEYS.exams);
      const savedInfographics = localStorage.getItem(STORAGE_KEYS.infographics);
      const savedActivities = localStorage.getItem(STORAGE_KEYS.activities);
      
      return {
        completedVideos: savedVideos ? JSON.parse(savedVideos) : [],
        completedModules: savedModules ? JSON.parse(savedModules) : [],
        completedExams: savedExams ? JSON.parse(savedExams) : {},
        completedInfographics: savedInfographics ? JSON.parse(savedInfographics) : [],
        completedActivities: savedActivities ? JSON.parse(savedActivities) : []
      };
    } catch (error) {
      console.error('❌ Error cargando desde localStorage:', error);
      return null;
    }
  }, []);

  // Sincronizar con Supabase (con debounce)
  const syncToSupabase = useCallback(async (data, immediate = false) => {
    if (!userId || !supabase) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    const doSync = async () => {
      setSyncStatus('syncing');
      const result = await syncProgressToSupabase(supabase, userId, data);
      
      if (result.success) {
        setSyncStatus('synced');
      } else if (result.offline) {
        setSyncStatus('offline');
      } else {
        setSyncStatus('error');
        console.warn('⚠️ Error de sync, pero datos guardados en localStorage');
      }
    };

    if (immediate) {
      await doSync();
    } else {
      syncTimeoutRef.current = setTimeout(doSync, 500);
    }
  }, [userId, supabase]);

  // Inicializar progreso al cargar
  useEffect(() => {
    if (!isUserReady) {
      setIsLoading(false);
      return;
    }

    const initializeProgress = async () => {
      setIsLoading(true);
      setSyncStatus('syncing');

      try {
        const localData = loadFromLocalStorage();
        
        let remoteData = null;
        if (supabase && navigator.onLine) {
          const result = await loadProgressFromSupabase(supabase, userId);
          if (result.success) {
            remoteData = result.data;
          }
        }

        // Merge de datos (Supabase tiene prioridad si existe)
        const mergedData = mergeProgress(localData, remoteData);
        
        // Actualizar estado
        setCompletedVideos(mergedData.completedVideos);
        setCompletedModules(mergedData.completedModules);
        setCompletedExams(mergedData.completedExams);
        setCompletedInfographics(mergedData.completedInfographics);
        setCompletedActivities(mergedData.completedActivities);
        
        const progress = calculateProgress(
          mergedData.completedVideos,
          mergedData.completedModules,
          mergedData.completedExams,
          mergedData.completedInfographics,
          mergedData.completedActivities
        );
        setCourseProgress(progress);

        // Guardar merge en localStorage
        saveToLocalStorage(mergedData);

        setSyncStatus(remoteData ? 'synced' : (isUsingJWT ? 'syncing' : 'synced'));
        console.log(`✅ Progreso inicializado: ${progress}% (${mergedData.completedVideos.length} videos, ${mergedData.completedModules.length} módulos)`);
        console.log(`🔐 Modo: ${isUsingJWT ? 'JWT verificado' : 'Anon key (fallback)'}`);
      } catch (error) {
        console.error('❌ Error inicializando progreso:', error);
        setSyncStatus('error');
        
        // Fallback a localStorage
        const localData = loadFromLocalStorage();
        if (localData) {
          setCompletedVideos(localData.completedVideos);
          setCompletedModules(localData.completedModules);
          setCompletedExams(localData.completedExams);
          setCompletedInfographics(localData.completedInfographics);
          setCompletedActivities(localData.completedActivities);
          setCourseProgress(calculateProgress(
            localData.completedVideos, localData.completedModules, localData.completedExams,
            localData.completedInfographics, localData.completedActivities
          ));
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeProgress();
  }, [isUserReady, userId, supabase, calculateProgress, loadFromLocalStorage, saveToLocalStorage, isUsingJWT]);

  useEffect(() => {
    if (!userId || !supabase) return;

    connectionCleanupRef.current = setupConnectionListener(supabase, userId);

    return () => {
      if (connectionCleanupRef.current) {
        connectionCleanupRef.current();
      }
    };
  }, [userId, supabase]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // Actualizar estado y sincronizar
  const updateProgress = useCallback(async (updates, immediate = false) => {
    const newData = {
      completedVideos: updates.completedVideos ?? completedVideos,
      completedModules: updates.completedModules ?? completedModules,
      completedExams: updates.completedExams ?? completedExams,
      completedInfographics: updates.completedInfographics ?? completedInfographics,
      completedActivities: updates.completedActivities ?? completedActivities
    };

    // Actualizar estado local
    if (updates.completedVideos) setCompletedVideos(updates.completedVideos);
    if (updates.completedModules) setCompletedModules(updates.completedModules);
    if (updates.completedExams) setCompletedExams(updates.completedExams);
    if (updates.completedInfographics) setCompletedInfographics(updates.completedInfographics);
    if (updates.completedActivities) setCompletedActivities(updates.completedActivities);

    // Calcular nuevo progreso
    const progress = calculateProgress(
      newData.completedVideos,
      newData.completedModules,
      newData.completedExams,
      newData.completedInfographics,
      newData.completedActivities
    );
    setCourseProgress(progress);

    // Guardar en localStorage
    saveToLocalStorage(newData);

    // Sincronizar con Supabase
    syncToSupabase(newData, immediate);

    return progress;
  }, [completedVideos, completedModules, completedExams, completedInfographics, completedActivities, calculateProgress, saveToLocalStorage, syncToSupabase]);

  // Marcar video como completado
  const markVideoComplete = useCallback(async (videoId) => {
    const videoKey = `m${videoId}`;
    if (!completedVideos.includes(videoKey)) {
      const newVideos = [...completedVideos, videoKey];
      const progress = await updateProgress({ completedVideos: newVideos });
      
      // Sync individual inmediato
      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: 'video',
          resourceId: videoKey,
          moduleId: videoId,
          isCompleted: true
        });
      }
      
      return progress;
    }
    return courseProgress;
  }, [completedVideos, updateProgress, userId, supabase, courseProgress]);

  // Marcar módulo como completado
  const markModuleComplete = useCallback(async (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      const newModules = [...completedModules, moduleId];
      const progress = await updateProgress({ completedModules: newModules });
      
      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: 'module',
          resourceId: `module_${moduleId}`,
          moduleId: moduleId,
          isCompleted: true
        });
      }
      
      return progress;
    }
    return courseProgress;
  }, [completedModules, updateProgress, userId, supabase, courseProgress]);

  // Marcar examen como completado
  const markExamComplete = useCallback(async (moduleId) => {
    if (!completedExams[moduleId]) {
      const newExams = { ...completedExams, [moduleId]: true };
      const progress = await updateProgress({ completedExams: newExams });
      
      // Auto-completar módulo si no está completo
      if (!completedModules.includes(moduleId)) {
        await markModuleComplete(moduleId);
      }
      
      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: 'exam',
          resourceId: null,
          moduleId: moduleId,
          isCompleted: true
        });
      }
      
      return progress;
    }
    return courseProgress;
  }, [completedExams, completedModules, updateProgress, markModuleComplete, userId, supabase, courseProgress]);

  // Marcar infografía como completada
  const markInfographicComplete = useCallback(async (infographicId) => {
    const infographicKey = `i${infographicId}`;
    if (!completedInfographics.includes(infographicKey)) {
      const newInfographics = [...completedInfographics, infographicKey];
      const progress = await updateProgress({ completedInfographics: newInfographics });
      
      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: 'infographic',
          resourceId: infographicKey,
          moduleId: infographicId,
          isCompleted: true
        });
      }
      
      return progress;
    }
    return courseProgress;
  }, [completedInfographics, updateProgress, userId, supabase, courseProgress]);

  // Marcar actividad como completada
  const markActivityComplete = useCallback(async (activityId) => {
    const activityKey = `a${activityId}`;
    if (!completedActivities.includes(activityKey)) {
      const newActivities = [...completedActivities, activityKey];
      const progress = await updateProgress({ completedActivities: newActivities });
      
      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: 'activity',
          resourceId: activityKey,
          moduleId: activityId,
          isCompleted: true
        });
      }
      
      return progress;
    }
    return courseProgress;
  }, [completedActivities, updateProgress, userId, supabase, courseProgress]);

  // Obtener progreso de un módulo
  const getModuleProgress = useCallback((moduleId) => {
    const config = MODULE_CONFIG.find(m => m.id === moduleId);
    if (!config) return 0;
    
    const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`));
    const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`));
    const moduleActivities = completedActivities.filter(a => a.startsWith(`a${moduleId}`));
    const examPassed = completedExams[moduleId];
    
    const totalItems = config.videos + config.infographics + (config.hasExam ? 1 : 0) + (config.hasActivity ? 1 : 0);
    const completedItems = moduleVideos.length + moduleInfographics.length + moduleActivities.length + (examPassed ? 1 : 0);
    
    return Math.round((completedItems / totalItems) * 100);
  }, [completedVideos, completedExams, completedInfographics, completedActivities]);

  // Obtener estadísticas de un módulo
  const getModuleStats = useCallback((moduleId) => {
    const config = MODULE_CONFIG.find(m => m.id === moduleId);
    if (!config) return { completed: 0, total: 0 };
    
    const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`));
    const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`));
    const moduleActivities = completedActivities.filter(a => a.startsWith(`a${moduleId}`));
    const examPassed = completedExams[moduleId];
    
    return {
      completed: moduleVideos.length + moduleInfographics.length + moduleActivities.length + (examPassed ? 1 : 0),
      total: config.videos + config.infographics + (config.hasExam ? 1 : 0) + (config.hasActivity ? 1 : 0)
    };
  }, [completedVideos, completedExams, completedInfographics, completedActivities]);

  // Resetear progreso (solo localStorage, Supabase mantiene datos)
  const resetProgress = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    
    setCompletedVideos([]);
    setCompletedModules([]);
    setCompletedExams({});
    setCompletedInfographics([]);
    setCompletedActivities([]);
    setCourseProgress(0);
  }, []);

  // Refrescar progreso desde Supabase
  const refreshProgress = useCallback(async () => {
    if (!userId || !supabase) return;

    setIsLoading(true);
    const result = await loadProgressFromSupabase(supabase, userId);
    
    if (result.success) {
      const mergedData = mergeProgress(loadFromLocalStorage(), result.data);
      
      setCompletedVideos(mergedData.completedVideos);
      setCompletedModules(mergedData.completedModules);
      setCompletedExams(mergedData.completedExams);
      setCompletedInfographics(mergedData.completedInfographics);
      setCompletedActivities(mergedData.completedActivities);
      
      const progress = calculateProgress(
        mergedData.completedVideos, mergedData.completedModules, mergedData.completedExams,
        mergedData.completedInfographics, mergedData.completedActivities
      );
      setCourseProgress(progress);
      saveToLocalStorage(mergedData);
    }
    
    setIsLoading(false);
  }, [userId, supabase, loadFromLocalStorage, calculateProgress, saveToLocalStorage]);

  return {
    courseProgress,
    completedVideos,
    completedModules,
    completedExams,
    completedInfographics,
    completedActivities,
    isLoading,
    syncStatus,
    isUsingJWT,
    userId,
    isUserReady,
    getModuleProgress,
    getModuleStats,
    markVideoComplete,
    markModuleComplete,
    markExamComplete,
    markInfographicComplete,
    markActivityComplete,
    resetProgress,
    refreshProgress,
    totalItems: TOTAL_ITEMS,
    setCompletedModules,
    setCourseProgress,
  };
};

export default usePersistentProgress;
