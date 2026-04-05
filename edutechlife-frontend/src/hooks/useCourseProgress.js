import { useState, useEffect, useCallback } from 'react';

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

export const useCourseProgress = () => {
  const [completedVideos, setCompletedVideos] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [completedExams, setCompletedExams] = useState({});
  const [completedInfographics, setCompletedInfographics] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const calculateProgress = useCallback((videos, modules, exams, infographics, activities) => {
    const modulesCompleted = modules.length;
    const examsCompleted = Object.values(exams).filter(Boolean).length;
    const videosCompleted = videos.length;
    const infographicsCompleted = infographics.length;
    const activitiesCompleted = activities.length;
    
    const totalProgressItems = MODULE_CONFIG.reduce((acc, m) => 
      acc + m.videos + m.infographics + (m.hasExam ? 1 : 0) + (m.hasActivity ? 1 : 0), 0);
    const completedItems = modulesCompleted + examsCompleted + videosCompleted + infographicsCompleted + activitiesCompleted;
    
    return Math.min(100, Math.round((completedItems / totalProgressItems) * 100));
  }, []);

  const loadProgress = useCallback(() => {
    try {
      setIsLoading(true);
      
      const savedVideos = localStorage.getItem(STORAGE_KEYS.videos);
      const savedModules = localStorage.getItem(STORAGE_KEYS.modules);
      const savedExams = localStorage.getItem(STORAGE_KEYS.exams);
      const savedInfographics = localStorage.getItem(STORAGE_KEYS.infographics);
      const savedActivities = localStorage.getItem(STORAGE_KEYS.activities);
      
      const videos = savedVideos ? JSON.parse(savedVideos) : [];
      const modules = savedModules ? JSON.parse(savedModules) : [];
      const exams = savedExams ? JSON.parse(savedExams) : {};
      const infographics = savedInfographics ? JSON.parse(savedInfographics) : [];
      const activities = savedActivities ? JSON.parse(savedActivities) : [];
      
      setCompletedVideos(videos);
      setCompletedModules(modules);
      setCompletedExams(exams);
      setCompletedInfographics(infographics);
      setCompletedActivities(activities);
      
      const progress = calculateProgress(videos, modules, exams, infographics, activities);
      setCourseProgress(progress);
      
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify({
        percent: progress,
        videos: videos.length,
        modules: modules.length,
        exams: Object.values(exams).filter(Boolean).length,
        infographics: infographics.length,
        activities: activities.length,
        lastUpdate: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateProgress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const markVideoComplete = useCallback((videoId) => {
    const videoKey = `m${videoId}`;
    if (!completedVideos.includes(videoKey)) {
      const newVideos = [...completedVideos, videoKey];
      setCompletedVideos(newVideos);
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(newVideos));
      
      const progress = calculateProgress(newVideos, completedModules, completedExams, completedInfographics, completedActivities);
      setCourseProgress(progress);
      
      return progress;
    }
    return courseProgress;
  }, [completedVideos, completedModules, completedExams, completedInfographics, completedActivities, calculateProgress, courseProgress]);

  const markModuleComplete = useCallback((moduleId) => {
    if (!completedModules.includes(moduleId)) {
      const newModules = [...completedModules, moduleId];
      setCompletedModules(newModules);
      localStorage.setItem(STORAGE_KEYS.modules, JSON.stringify(newModules));
      
      const progress = calculateProgress(completedVideos, newModules, completedExams, completedInfographics, completedActivities);
      setCourseProgress(progress);
      
      return progress;
    }
    return courseProgress;
  }, [completedVideos, completedModules, completedExams, completedInfographics, completedActivities, calculateProgress, courseProgress]);

  const markExamComplete = useCallback((moduleId) => {
    if (!completedExams[moduleId]) {
      const newExams = { ...completedExams, [moduleId]: true };
      setCompletedExams(newExams);
      localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(newExams));
      
      const progress = calculateProgress(completedVideos, completedModules, newExams, completedInfographics, completedActivities);
      setCourseProgress(progress);
      
      if (!completedModules.includes(moduleId)) {
        markModuleComplete(moduleId);
      }
      
      return progress;
    }
    return courseProgress;
  }, [completedVideos, completedModules, completedExams, completedInfographics, completedActivities, calculateProgress, courseProgress, markModuleComplete]);

  const markInfographicComplete = useCallback((infographicId) => {
    const infographicKey = `i${infographicId}`;
    if (!completedInfographics.includes(infographicKey)) {
      const newInfographics = [...completedInfographics, infographicKey];
      setCompletedInfographics(newInfographics);
      localStorage.setItem(STORAGE_KEYS.infographics, JSON.stringify(newInfographics));
      
      const progress = calculateProgress(completedVideos, completedModules, completedExams, newInfographics, completedActivities);
      setCourseProgress(progress);
      
      return progress;
    }
    return courseProgress;
  }, [completedVideos, completedModules, completedExams, completedInfographics, completedActivities, calculateProgress, courseProgress]);

  const markActivityComplete = useCallback((activityId) => {
    const activityKey = `a${activityId}`;
    if (!completedActivities.includes(activityKey)) {
      const newActivities = [...completedActivities, activityKey];
      setCompletedActivities(newActivities);
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(newActivities));
      
      const progress = calculateProgress(completedVideos, completedModules, completedExams, completedInfographics, newActivities);
      setCourseProgress(progress);
      
      return progress;
    }
    return courseProgress;
  }, [completedVideos, completedModules, completedExams, completedInfographics, completedActivities, calculateProgress, courseProgress]);

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

  const getModuleStats = useCallback((moduleId) => {
    const config = MODULE_CONFIG.find(m => m.id === moduleId);
    if (!config) return { completed: 0, total: config?.videos || 0 };
    
    const moduleVideos = completedVideos.filter(v => v.startsWith(`m${moduleId}`));
    const moduleInfographics = completedInfographics.filter(i => i.startsWith(`i${moduleId}`));
    const moduleActivities = completedActivities.filter(a => a.startsWith(`a${moduleId}`));
    const examPassed = completedExams[moduleId];
    
    return {
      completed: moduleVideos.length + moduleInfographics.length + moduleActivities.length + (examPassed ? 1 : 0),
      total: config.videos + config.infographics + (config.hasExam ? 1 : 0) + (config.hasActivity ? 1 : 0)
    };
  }, [completedVideos, completedExams, completedInfographics, completedActivities]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.videos);
    localStorage.removeItem(STORAGE_KEYS.modules);
    localStorage.removeItem(STORAGE_KEYS.exams);
    localStorage.removeItem(STORAGE_KEYS.infographics);
    localStorage.removeItem(STORAGE_KEYS.activities);
    localStorage.removeItem(STORAGE_KEYS.progress);
    
    setCompletedVideos([]);
    setCompletedModules([]);
    setCompletedExams({});
    setCompletedInfographics([]);
    setCompletedActivities([]);
    setCourseProgress(0);
  }, []);

  return {
    courseProgress,
    completedVideos,
    completedModules,
    completedExams,
    completedInfographics,
    completedActivities,
    isLoading,
    getModuleProgress,
    getModuleStats,
    markVideoComplete,
    markModuleComplete,
    markExamComplete,
    markInfographicComplete,
    markActivityComplete,
    resetProgress,
    refreshProgress: loadProgress,
    totalItems: TOTAL_ITEMS
  };
};

export default useCourseProgress;
