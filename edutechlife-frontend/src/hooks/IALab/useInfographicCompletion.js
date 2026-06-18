import { useCallback } from 'react';
import { useProgressContext } from '../../context/ProgressContext';

export default function useInfographicCompletion() {
  const { completedInfographics } = useProgressContext();

  const isInfographicCompleted = useCallback(
    (infographicId) => completedInfographics.includes(`${infographicId}`),
    [completedInfographics]
  );

  return isInfographicCompleted;
}
