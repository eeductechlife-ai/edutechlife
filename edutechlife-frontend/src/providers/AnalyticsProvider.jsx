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

    if (isSignedIn && user) {
      identify(userId, {
        email: authEmail,
        name: displayName,
      });
    } else {
      reset();
    }
  }, [isLoaded, isSignedIn, user]);

  return children;
}
