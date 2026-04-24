import React from 'react';
import { ClerkProvider } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { clerkConfig } from '../lib/clerk-config';

const ClerkProviderWrapper = ({ children }) => {
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
