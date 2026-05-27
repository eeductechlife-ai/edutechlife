import React, { ReactNode } from 'react';

interface ProviderComposerProps {
  providers: (React.ReactElement | React.ComponentType<{ children?: ReactNode }>)[];
  children: ReactNode;
}

export const ProviderComposer = ({ providers, children }: ProviderComposerProps) => {
  return providers.reduceRight<ReactNode>((acc, provider) => {
    if (React.isValidElement(provider)) {
      return React.cloneElement(provider, null, acc);
    }
    if (typeof provider === 'function') {
      const Provider = provider as React.ComponentType<{ children?: ReactNode }>;
      return <Provider>{acc}</Provider>;
    }
    return acc;
  }, children);
};
