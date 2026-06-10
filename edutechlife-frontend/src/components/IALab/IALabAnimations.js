import { SLIDE_DISTANCE } from './constants/IALabConfig';

export function createSlideVariants(shouldReduceMotion) {
  return {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE,
      opacity: shouldReduceMotion ? 1 : 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
      opacity: shouldReduceMotion ? 1 : 0,
    }),
  };
}
