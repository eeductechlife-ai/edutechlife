import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/react';
import { initAnalytics, identify, reset } from '../lib/analytics';

export function AnalyticsProvider({ children }) {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    } else {
      reset();
    }
  }, [isLoaded, isSignedIn, user]);

  return children;
}
