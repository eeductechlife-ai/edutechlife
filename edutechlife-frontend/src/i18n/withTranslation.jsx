import React from 'react';
import { useTranslation } from './I18nProvider';

export function withTranslation(Component) {
  function WrappedComponent(props) {
    const { t } = useTranslation();
    return <Component {...props} t={t} />;
  }
  WrappedComponent.displayName = `withTranslation(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
}
