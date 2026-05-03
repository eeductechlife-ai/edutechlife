import { createContext, useContext } from 'react';
import { usePersistentProgress } from '../hooks/usePersistentProgress';

const ProgressContext = createContext();

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext debe usarse dentro de ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const progress = usePersistentProgress();

  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
