/**
 * IALabContext — Punto de entrada del contexto del módulo IALab
 *
 * Responsabilidad: Componer los 2 sub-contextos (Progress, UI) en un solo
 * provider y exportar useIALabContext() para backward compatibility.
 *
 * El estado de quiz/evaluación se lee directamente del store Zustand
 * (useIALabStore) en lugar de pasar por un provider adicional.
 *
 * @see IALabProgressProvider — progreso, módulos, sync con ProgressContext
 * @see IALabUIProvider — UI, gamificación, certificado, auth, efectos
 */
import { useContext } from 'react';
import { IALabProgressContext, IALabProgressProvider } from './ialab/IALabProgressProvider';
import { IALabUIContext, IALabUIProvider } from './ialab/IALabUIProvider';

export { useIALabProgressContext } from './ialab/IALabProgressProvider';
export { useIALabUIContext } from './ialab/IALabUIProvider';

export const useIALabContext = () => {
  const progress = useContext(IALabProgressContext);
  const ui = useContext(IALabUIContext);

  if (!progress || !ui) {
    throw new Error('useIALabContext debe usarse dentro de IALabProvider');
  }

  return { ...progress, ...ui };
};

export const IALabProvider = ({ children, onBack }) => {
  return (
    <IALabProgressProvider>
      <IALabUIProvider onBack={onBack}>
        {children}
      </IALabUIProvider>
    </IALabProgressProvider>
  );
};
