import { createContext, useContext, useMemo } from "react";
import { SmartBoardKidsContext } from "./SmartBoardKidsContext";

const GamificationContext = createContext(null);

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx)
    throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
};

export const GamificationProvider = ({ children }) => {
  const ctx = useContext(SmartBoardKidsContext);
  const value = useMemo(
    () => ({
      totalPoints: ctx.totalPoints,
      streak: ctx.streak,
      missions: ctx.missions,
      streakLog: ctx.streakLog,
    }),
    [ctx.totalPoints, ctx.streak, ctx.missions, ctx.streakLog],
  );
  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
