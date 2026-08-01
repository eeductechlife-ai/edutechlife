import { useEffect } from "react";
import { useAuthIdentity } from "../hooks/useAuthIdentity";
import { useStudentProfile } from "../hooks/useStudentProfile";
import { initAnalytics, identify, reset } from "../lib/analytics";

export function AnalyticsProvider({ children }) {
  const { userId, email: authEmail, isSignedIn, isLoaded } = useAuthIdentity();
  const { displayName } = useStudentProfile();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && userId) {
      identify(userId, {
        email: authEmail,
        name: displayName,
      });
    } else {
      reset();
    }
  }, [isLoaded, isSignedIn, userId, authEmail, displayName]);

  return children;
}
