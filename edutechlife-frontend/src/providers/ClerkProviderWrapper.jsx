import React, { useState, useEffect } from 'react';
import { ClerkProvider } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { clerkConfig } from '../lib/clerk-config';

const CLERK_JS_URL = 'https://cdn.clerk.com/clerk-js@6/dist/clerk.browser.js';

const ClerkProviderWrapper = ({ children }) => {
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.Clerk) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = CLERK_JS_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => setScriptReady(true);
    script.onerror = () => {
      console.error('Failed to load Clerk JS from CDN');
      setScriptReady(true);
    };
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  if (!scriptReady) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkConfig.publishableKey}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
      appearance={clerkConfig.appearance}
      localization={esES}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
