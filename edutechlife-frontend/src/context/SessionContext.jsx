import { createContext, useContext, useMemo } from "react";
import { SmartBoardKidsContext } from "./SmartBoardKidsContext";

const SessionContext = createContext(null);

export const useSessions = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessions must be used within SessionProvider");
  return ctx;
};

export const SessionProvider = ({ children }) => {
  const ctx = useContext(SmartBoardKidsContext);
  const value = useMemo(
    () => ({
      sessions: ctx?.sessions || [],
      subjectTime: ctx?.subjectTime || {},
      totalActiveMinutes: ctx?.totalActiveMinutes || 0,
    }),
    [ctx?.sessions, ctx?.subjectTime, ctx?.totalActiveMinutes],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
