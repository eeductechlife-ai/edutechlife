import { useCallback, useMemo } from "react";
import { useIALabStore } from "../../store/ialabStore";

const INITIAL_INTERVAL = 1;
const MIN_INTERVAL = 1;
const MAX_INTERVAL = 365;

function calculateSM2(quality, previousInterval, previousRepetitions) {
  let interval = previousInterval || INITIAL_INTERVAL;
  let repetitions = previousRepetitions || 0;

  if (quality < 3) {
    repetitions = 0;
    interval = MIN_INTERVAL;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * (quality > 3 ? 2.5 : 1.3));
    }
  }

  return {
    interval: Math.min(interval, MAX_INTERVAL),
    repetitions,
    nextReview: new Date(Date.now() + interval * 86400000).toISOString(),
    lastReview: new Date().toISOString(),
    ease: quality,
  };
}

export function useSpacedRepetition(contentId) {
  const contentReviews = useIALabStore((s) => s.contentReviews || {});
  const updateContentReview = useIALabStore((s) => s.updateContentReview);

  const review = contentReviews[contentId];

  const dueForReview = useMemo(() => {
    if (!review) return true;
    return new Date(review.nextReview) <= new Date();
  }, [review]);

  const submitReview = useCallback(
    (quality) => {
      const prevInterval = review?.interval || INITIAL_INTERVAL;
      const prevReps = review?.repetitions || 0;
      const result = calculateSM2(quality, prevInterval, prevReps);
      updateContentReview(contentId, result);
      return result;
    },
    [contentId, review, updateContentReview],
  );

  return { review, dueForReview, submitReview };
}
