import { createContext, useContext, useEffect } from 'react';
import { usePersistentProgress } from '../hooks/usePersistentProgress';
import { useIALabStore } from '../store/ialabStore';

const ProgressContext = createContext();

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext debe usarse dentro de ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const progress = usePersistentProgress();

  useEffect(() => {
    useIALabStore.getState().syncFromPersistence({
      completedModules: progress.completedModules,
      completedVideos: progress.completedVideos,
      completedExams: progress.completedExams,
      completedInfographics: progress.completedInfographics,
      completedActivities: progress.completedActivities,
      challengeScores: progress.challengeScores,
      completedCommunity: progress.completedCommunity,
      courseProgress: progress.courseProgress,
      syncStatus: progress.syncStatus,
      isUsingJWT: progress.isUsingJWT,
      userId: progress.userId,
    });
  }, [
    progress.completedModules, progress.completedVideos, progress.completedExams,
    progress.completedInfographics, progress.completedActivities, progress.challengeScores,
    progress.completedCommunity, progress.courseProgress,
    progress.syncStatus, progress.isUsingJWT, progress.userId,
  ]);

  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
