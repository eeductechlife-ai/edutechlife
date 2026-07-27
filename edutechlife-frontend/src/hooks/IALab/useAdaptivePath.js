import { useMemo } from "react";
import { useIALabStore } from "../../store/ialabStore";

const MASTERY_THRESHOLD = 85;
const REMEDIATION_THRESHOLD = 60;

export function useAdaptivePath() {
  const moduleProgress = useIALabStore((s) => s.moduleProgress || {});

  return useMemo(() => {
    const needsReview = [];
    const readyForNext = [];
    const mastered = [];

    Object.entries(moduleProgress).forEach(([moduleId, mod]) => {
      const currentScore = mod?.currentScore ?? 0;
      if (currentScore >= MASTERY_THRESHOLD) {
        mastered.push(Number(moduleId));
      } else if (currentScore <= REMEDIATION_THRESHOLD) {
        needsReview.push(Number(moduleId));
      } else {
        readyForNext.push(Number(moduleId));
      }
    });

    return {
      needsReview,
      readyForNext,
      mastered,
      nextRecommended:
        needsReview.length > 0
          ? needsReview[0]
          : readyForNext.length > 0
            ? readyForNext[0]
            : mastered.length + 1,
      masteredCount: mastered.length,
    };
  }, [moduleProgress]);
}
