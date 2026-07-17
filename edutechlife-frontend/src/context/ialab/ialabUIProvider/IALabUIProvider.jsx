import { createContext, useContext } from "react";
import { useIALabUI } from "./useIALabUI";

export const IALabUIContext = createContext(null);

export const useIALabUIContext = () => {
  return useContext(IALabUIContext);
};

export function IALabUIProvider({ children, onBack }) {
  const contextValue = useIALabUI(onBack);
  return (
    <IALabUIContext.Provider value={contextValue}>
      {children}
    </IALabUIContext.Provider>
  );
}
