import { useEffect } from "react";
import { useAuthIdentity } from "../hooks/useAuthIdentity";
import { initAnalytics, identify, reset } from "../lib/analytics";

export function AnalyticsProvider({ children }) {
  const { userId, isSignedIn, isLoaded } = useAuthIdentity();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && userId) {
      identify(userId);
    } else {
      reset();
    }
  }, [isLoaded, isSignedIn, userId]);

  return children;
}
