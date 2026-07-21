import { mergeProgress } from "../../services/progressSync";
import { calculateGlobalProgressInternal } from "./courseProgressUtils";

export function applyProgressData(setters, data) {
  setters.setCompletedVideos(data.completedVideos);
  setters.setCompletedModules(data.completedModules);
  setters.setCompletedExams(data.completedExams);
  setters.setCompletedInfographics(data.completedInfographics);
  setters.setCompletedActivities(data.completedActivities);
  setters.setChallengeScores(data.challengeScores || {});
  setters.setCompletedCommunity(data.completedCommunity || []);
}

export function computeGlobalProgress(data) {
  return calculateGlobalProgressInternal(
    data.completedModules,
    data.completedVideos,
    data.completedExams,
    data.completedInfographics,
    data.completedActivities,
    data.challengeScores,
    data.completedCommunity,
  );
}

export function mergeLocalWithRemote(localData, remoteData) {
  return mergeProgress(localData, remoteData);
}
