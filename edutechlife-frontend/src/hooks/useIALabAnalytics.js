import { useCallback, useEffect, useRef } from "react";
import { track } from "../lib/analytics";

const EVENT_PREFIX = "ialab:";

export function useIALabAnalytics(context = {}) {
  const sessionStartRef = useRef(Date.now());

  const trackEvent = useCallback(
    (event, properties = {}) => {
      track(`${EVENT_PREFIX}${event}`, {
        ...context,
        ...properties,
        timestamp: new Date().toISOString(),
        session_duration_ms: Date.now() - sessionStartRef.current,
      });
    },
    [context],
  );

  const trackModuleView = useCallback(
    (moduleId) => trackEvent("module_view", { module_id: moduleId }),
    [trackEvent],
  );

  const trackChallengeStart = useCallback(
    (moduleId) => trackEvent("challenge_start", { module_id: moduleId }),
    [trackEvent],
  );

  const trackChallengeComplete = useCallback(
    (moduleId, score, timeSpentMs) =>
      trackEvent("challenge_complete", {
        module_id: moduleId,
        score,
        time_spent_ms: timeSpentMs,
        pass: score >= 80,
      }),
    [trackEvent],
  );

  const trackExamStart = useCallback(
    (moduleId) => trackEvent("exam_start", { module_id: moduleId }),
    [trackEvent],
  );

  const trackExamComplete = useCallback(
    (moduleId, score, questionCount, timeSpentMs) =>
      trackEvent("exam_complete", {
        module_id: moduleId,
        score,
        question_count: questionCount,
        time_spent_ms: timeSpentMs,
        pass: score >= 80,
      }),
    [trackEvent],
  );

  const trackResourceComplete = useCallback(
    (moduleId, resourceId, resourceType) =>
      trackEvent("resource_complete", {
        module_id: moduleId,
        resource_id: resourceId,
        resource_type: resourceType,
      }),
    [trackEvent],
  );

  const trackCoachInteraction = useCallback(
    (moduleId, messageLength) =>
      trackEvent("coach_interaction", {
        module_id: moduleId,
        message_length: messageLength,
      }),
    [trackEvent],
  );

  const trackError = useCallback(
    (errorType, errorMessage, context = {}) =>
      trackEvent("error", {
        error_type: errorType,
        error_message: errorMessage,
        ...context,
      }),
    [trackEvent],
  );

  const trackEngagement = useCallback(
    (action, target, value) =>
      trackEvent("engagement", {
        action,
        target,
        value,
      }),
    [trackEvent],
  );

  const trackFeatureUse = useCallback(
    (feature, metadata = {}) =>
      trackEvent("feature_use", {
        feature,
        ...metadata,
      }),
    [trackEvent],
  );

  return {
    trackEvent,
    trackModuleView,
    trackChallengeStart,
    trackChallengeComplete,
    trackExamStart,
    trackExamComplete,
    trackResourceComplete,
    trackCoachInteraction,
    trackError,
    trackEngagement,
    trackFeatureUse,
  };
}

export function usePageTimeTracking(pageName, context = {}) {
  const { trackEvent } = useIALabAnalytics(context);
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const duration = Date.now() - startTime.current;
      if (duration > 1000) {
        trackEvent("page_time", {
          page: pageName,
          duration_ms: duration,
          duration_s: Math.round(duration / 1000),
        });
      }
    };
  }, [pageName, trackEvent]);
}
