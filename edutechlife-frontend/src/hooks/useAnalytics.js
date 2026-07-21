import { useCallback } from 'react';
import { track, identify } from '../lib/analytics';

export function useAnalytics() {
  const trackEvent = useCallback((event, properties = {}) => {
    track(event, properties);
  }, []);

  const identifyUser = useCallback((userId, traits = {}) => {
    identify(userId, traits);
  }, []);

  return { trackEvent, identifyUser };
}
