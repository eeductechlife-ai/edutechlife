import { ClerkProvider } from '@clerk/react';
import { esES, enUS } from '@clerk/localizations';
import { useTranslation } from '../i18n/I18nProvider';
import { clerkConfig } from '../lib/clerk-config';

const ClerkProviderWrapper = ({ children }) => {
  const { locale } = useTranslation();
  return (
    <ClerkProvider
      publishableKey={clerkConfig.publishableKey}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
      appearance={clerkConfig.appearance}
      localization={locale === 'en' ? enUS : esES}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
