import { ReactNode } from 'react';

interface ProviderComposerProps {
  providers: (React.ReactElement | React.ComponentType<{ children?: ReactNode }>)[];
  children: ReactNode;
}

export const ProviderComposer = ({ providers, children }: ProviderComposerProps) => {
  let result = children;
  for (let i = providers.length - 1; i >= 0; i--) {
    const provider = providers[i];
    if (typeof provider === 'function') {
      const Provider = provider as React.ComponentType<{ children?: ReactNode }>;
      result = <Provider>{result}</Provider>;
    } else {
      const el = provider as React.ReactElement<{ children?: ReactNode }>;
      result = <el.type {...el.props}>{result}</el.type>;
    }
  }
  return result;
};
