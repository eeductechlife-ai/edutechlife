import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';
import { useSupabase } from './useSupabase';
import { 
  syncProgressToSupabase, 
  syncActivityToSupabase,
  syncGamificationToSupabase,
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
  challenges: 'ialab_challenge_scores',
  progress: 'ialab_overall_progress',
  community: 'ialab_completed_community'
};

const MODULE_CONFIG = [
  { id: 1, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 2, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 3, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 4, videos: 2, infographics: 3, hasExam: true, hasActivity: true },
  { id: 5, videos: 1, infographics: 2, hasExam: true, hasActivity: true }
];

const MODULE_WEIGHTS = { exam: 35, challenge: 30, resources: 30, community: 5 };
const MODULE_PERCENTAGE = 20;

const MODULE_THRESHOLD = 80;

const calculateModuleProgressInternal = (moduleId, completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity = []) => {
  const config = MODULE_CONFIG.find(m => m.id === moduleId);
  if (!config) return 0;

  const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`));
  const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`));
  const moduleActivities = completedActivities.filter(a => a.startsWith(`a${moduleId}`));
  const examScore = completedExams[moduleId] || 0;
  const challengeScore = challengeScores?.[moduleId] || 0;

  let moduleScore = 0;

  const totalResources = 8;
  if (totalResources > 0) {
    const resourcesCompleted = moduleVideos.length + moduleInfographics.length;
    if (resourcesCompleted >= totalResources) {
      moduleScore += MODULE_WEIGHTS.resources;
    }
  }

  moduleScore += (examScore / 100) * MODULE_WEIGHTS.exam;
  moduleScore += (challengeScore / 100) * MODULE_WEIGHTS.challenge;
  if (completedCommunity.includes(moduleId)) {
    moduleScore += MODULE_WEIGHTS.community;
  }

  return Math.min(100, Math.round(moduleScore * 10) / 10);
};

const calculateGlobalProgressInternal = (completedModules, completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity = []) => {
  let totalProgress = 0;

  for (let i = 1; i <= 5; i++) {
    const moduleScore = calculateModuleProgressInternal(i, completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity);
    const moduleCompleted = completedModules.includes(i);
    const effectiveScore = Math.max(moduleScore, moduleCompleted ? 100 : 0);
    totalProgress += (effectiveScore / 100) * MODULE_PERCENTAGE;
  }

  return Math.min(100, Math.round(totalProgress));
};

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
  const [challengeScores, setChallengeScores] = useState({});
  const [completedCommunity, setCompletedCommunity] = useState([]);
  const [gamification, setGamification] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error | offline
  
  const syncTimeoutRef = useRef(null);
  const connectionCleanupRef = useRef(null);

  // Calcular progreso general
  const calculateProgress = useCallback((videos, modules, exams, infographics, activities, challenges, community = []) => {
    return calculateGlobalProgressInternal(modules, videos, exams, infographics, activities, challenges, community);
  }, []);

  // Guardar en localStorage
  const saveToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(data.completedVideos));
      localStorage.setItem(STORAGE_KEYS.modules, JSON.stringify(data.completedModules));
      localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(data.completedExams));
      localStorage.setItem(STORAGE_KEYS.infographics, JSON.stringify(data.completedInfographics));
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(data.completedActivities));
      localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(data.challengeScores || {}));
      localStorage.setItem(STORAGE_KEYS.community, JSON.stringify(data.completedCommunity || []));
      
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify({
        percent: calculateProgress(data.completedVideos, data.completedModules, data.completedExams, 
          data.completedInfographics, data.completedActivities, data.challengeScores),
        videos: data.completedVideos.length,
        modules: data.completedModules.length,
        exams: Object.values(data.completedExams).filter(s => s >= MODULE_THRESHOLD).length,
        infographics: data.completedInfographics.length,
        activities: data.completedActivities.length,
        challenges: Object.values(data.challengeScores || {}).filter(s => s >= MODULE_THRESHOLD).length,
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
      const savedChallenges = localStorage.getItem(STORAGE_KEYS.challenges);
      const savedCommunity = localStorage.getItem(STORAGE_KEYS.community);
      
      return {
        completedVideos: savedVideos ? JSON.parse(savedVideos) : [],
        completedModules: savedModules ? JSON.parse(savedModules) : [],
        completedExams: savedExams ? JSON.parse(savedExams) : {},
        completedInfographics: savedInfographics ? JSON.parse(savedInfographics) : [],
        completedActivities: savedActivities ? JSON.parse(savedActivities) : [],
        challengeScores: savedChallenges ? JSON.parse(savedChallenges) : {},
        completedCommunity: savedCommunity ? JSON.parse(savedCommunity) : []
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

  // Sincronizar gamificación con Supabase
  const syncGamification = useCallback(async (gamificationData) => {
    if (!userId || !supabase) return;
    const result = await syncGamificationToSupabase(supabase, userId, gamificationData);
    if (result.success) {
      setGamification(gamificationData);
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
        setChallengeScores(mergedData.challengeScores || {});
        setCompletedCommunity(mergedData.completedCommunity || []);
        if (mergedData.gamification) setGamification(mergedData.gamification);
        
        const progress = calculateProgress(
          mergedData.completedVideos,
          mergedData.completedModules,
          mergedData.completedExams,
          mergedData.completedInfographics,
          mergedData.completedActivities,
          mergedData.challengeScores,
          mergedData.completedCommunity
        );
        setCourseProgress(progress);

        // Guardar merge en localStorage
        saveToLocalStorage(mergedData);

        setSyncStatus(remoteData ? 'synced' : (isUsingJWT ? 'syncing' : 'synced'));
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
          setChallengeScores(localData.challengeScores || {});
          setCompletedCommunity(localData.completedCommunity || []);
          setCourseProgress(calculateProgress(
            localData.completedVideos, localData.completedModules, localData.completedExams,
            localData.completedInfographics, localData.completedActivities, localData.challengeScores, localData.completedCommunity
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

  // Registrar timestamp de actividad (para deteccion de inactividad)
  const recordActivity = useCallback(() => {
    try {
      localStorage.setItem('ialab_last_activity_date', new Date().toISOString());
    } catch (err) {
      console.warn('[PROGRESS] Error registrando actividad:', err);
    }
  }, []);

  // Registrar ultimo tema visto (para notificaciones de inactividad con contexto)
  const recordLastTopic = useCallback((moduleId, moduleName, resourceType, resourceTitle, resourceId) => {
    try {
      localStorage.setItem('ialab_last_viewed_topic', JSON.stringify({
        moduleId,
        moduleName,
        resourceType,
        resourceTitle,
        resourceId,
        timestamp: new Date().toISOString(),
      }));
    } catch (err) {
      console.warn('[PROGRESS] Error registrando ultimo tema:', err);
    }
  }, []);

  // Actualizar estado y sincronizar
  const updateProgress = useCallback(async (updates, immediate = false) => {
    const newData = {
      completedVideos: updates.completedVideos ?? completedVideos,
      completedModules: updates.completedModules ?? completedModules,
      completedExams: updates.completedExams ?? completedExams,
      completedInfographics: updates.completedInfographics ?? completedInfographics,
      completedActivities: updates.completedActivities ?? completedActivities,
      challengeScores: updates.challengeScores ?? challengeScores,
      completedCommunity: updates.completedCommunity ?? completedCommunity
    };

    // Actualizar estado local
    if (updates.completedVideos) setCompletedVideos(updates.completedVideos);
    if (updates.completedModules) setCompletedModules(updates.completedModules);
    if (updates.completedExams) setCompletedExams(updates.completedExams);
    if (updates.completedInfographics) setCompletedInfographics(updates.completedInfographics);
    if (updates.completedActivities) setCompletedActivities(updates.completedActivities);
    if (updates.challengeScores) setChallengeScores(updates.challengeScores);
    if (updates.completedCommunity) setCompletedCommunity(updates.completedCommunity);

    // Calcular nuevo progreso
    const progress = calculateProgress(
      newData.completedVideos,
      newData.completedModules,
      newData.completedExams,
      newData.completedInfographics,
      newData.completedActivities,
      newData.challengeScores,
      newData.completedCommunity
    );
    setCourseProgress(progress);

    // Guardar en localStorage
    saveToLocalStorage(newData);

    // Sincronizar con Supabase
    syncToSupabase(newData, immediate);

    return progress;
  }, [completedVideos, completedModules, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity, calculateProgress, saveToLocalStorage, syncToSupabase]);

  // Marcar video como completado
  const markVideoComplete = useCallback(async (videoId) => {
    const videoKey = `m${videoId}`;
    if (!completedVideos.includes(videoKey)) {
      const newVideos = [...completedVideos, videoKey];
      recordActivity();
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
  }, [completedVideos, updateProgress, userId, supabase, courseProgress, recordActivity]);

  // Marcar módulo como completado
  const markModuleComplete = useCallback(async (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      const newModules = [...completedModules, moduleId];
      recordActivity();
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
  }, [completedModules, updateProgress, userId, supabase, courseProgress, recordActivity]);

  // Marcar examen como completado (solo si score >= 80%)
  const markExamComplete = useCallback(async (moduleId, score) => {
    const examScore = score || completedExams[moduleId];
    
    if (examScore) {
      const newExams = { ...completedExams, [moduleId]: examScore };
      recordActivity();
      const progress = await updateProgress({ completedExams: newExams });
      
      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: 'exam',
          resourceId: null,
          moduleId: moduleId,
          isCompleted: true,
          score: examScore
        });
      }
      
      return progress;
    } else if (!examScore) {
    }
    return courseProgress;
  }, [completedExams, updateProgress, userId, supabase, courseProgress, recordActivity]);

  // Marcar infografía como completada
  const markInfographicComplete = useCallback(async (infographicId) => {
    const infographicKey = `i${infographicId}`;
    if (!completedInfographics.includes(infographicKey)) {
      const newInfographics = [...completedInfographics, infographicKey];
      recordActivity();
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
  }, [completedInfographics, updateProgress, userId, supabase, courseProgress, recordActivity]);

  // Marcar actividad como completada
  const markActivityComplete = useCallback(async (activityId) => {
    const activityKey = `a${activityId}`;
    if (!completedActivities.includes(activityKey)) {
      const newActivities = [...completedActivities, activityKey];
      recordActivity();
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
  }, [completedActivities, updateProgress, userId, supabase, courseProgress, recordActivity]);

  // Marcar desafio como completado (solo si score >= 80%)
  const markChallengeComplete = useCallback(async (moduleId, score) => {
    if (!score || score < MODULE_THRESHOLD) {
      return { progress: courseProgress, passed: false };
    }

    const newChallengeScores = { ...challengeScores, [moduleId]: score };
    recordActivity();
    const progress = await updateProgress({ challengeScores: newChallengeScores });
    
    if (userId && supabase) {
      syncActivityToSupabase(supabase, userId, {
        activityType: 'challenge',
        resourceId: null,
        moduleId: moduleId,
        isCompleted: true,
        score: score
      });
    }
    
    return { progress, passed: true };
  }, [challengeScores, updateProgress, userId, supabase, courseProgress, recordActivity]);

  // Marcar comunidad como completada
  const markCommunityComplete = useCallback(async (moduleId) => {
    if (!completedCommunity.includes(moduleId)) {
      const newCommunity = [...completedCommunity, moduleId];
      recordActivity();
      const progress = await updateProgress({ completedCommunity: newCommunity });

      if (userId && supabase) {
        syncActivityToSupabase(supabase, userId, {
          activityType: 'community_comment',
          resourceId: null,
          moduleId: moduleId,
          isCompleted: true
        });
      }

      return progress;
    }
    return courseProgress;
  }, [completedCommunity, updateProgress, userId, supabase, courseProgress, recordActivity]);

  // Obtener progreso de un módulo
  const getModuleProgress = useCallback((moduleId) => {
    return calculateModuleProgressInternal(moduleId, completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity);
  }, [completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity]);

  const getModuleStats = useCallback((moduleId) => {
    const config = MODULE_CONFIG.find(m => m.id === moduleId);
    if (!config) return { completed: 0, total: 0, score: 0 };

    const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`));
    const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`));
    const moduleActivities = completedActivities.filter(a => a.startsWith(`a${moduleId}`));
    const examScore = completedExams[moduleId] || 0;
    const challengeScore = challengeScores[moduleId] || 0;

    const totalResources = 8;
    const resourcesCompleted = moduleVideos.length + moduleInfographics.length;

    return {
      videosWatched: moduleVideos.length,
      totalVideos: config.videos,
      infographicsViewed: moduleInfographics.length,
      totalInfographics: config.infographics,
      activityCompleted: moduleActivities.length > 0,
      examPassed: examScore >= MODULE_THRESHOLD,
      examScore,
      challengePassed: challengeScore >= MODULE_THRESHOLD,
      challengeScore,
      communityDone: completedCommunity.includes(moduleId),
      resourcesPct: totalResources > 0 ? Math.round((resourcesCompleted / totalResources) * 100) : 0,
      score: calculateModuleProgressInternal(moduleId, completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity)
    };
  }, [completedVideos, completedExams, completedInfographics, completedActivities, challengeScores, completedCommunity]);

  // Resetear progreso (solo localStorage, Supabase mantiene datos)
  const resetProgress = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    
    setCompletedVideos([]);
    setCompletedModules([]);
    setCompletedExams({});
    setCompletedInfographics([]);
    setCompletedActivities([]);
    setChallengeScores({});
    setCompletedCommunity([]);
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
      setChallengeScores(mergedData.challengeScores || {});
      setCompletedCommunity(mergedData.completedCommunity || []);
      
      const progress = calculateProgress(
        mergedData.completedVideos, mergedData.completedModules, mergedData.completedExams,
        mergedData.completedInfographics, mergedData.completedActivities, mergedData.challengeScores, mergedData.completedCommunity
      );
      setCourseProgress(progress);
      saveToLocalStorage(mergedData);
    }
    
    setIsLoading(false);
  }, [userId, supabase, loadFromLocalStorage, calculateProgress, saveToLocalStorage]);

  return {
    courseProgress,
    gamification,
    completedVideos,
    completedModules,
    completedExams,
    completedInfographics,
    completedActivities,
    challengeScores,
    completedCommunity,
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
    markChallengeComplete,
    markCommunityComplete,
    resetProgress,
    refreshProgress,
    syncGamification,
    setCompletedModules,
    setCourseProgress,
    recordLastTopic,
  };
};

export default usePersistentProgress;
