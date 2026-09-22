import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, TrendingUp } from "lucide-react";
import GlassCard from "@/components/GlassCard";

const LeaderboardWidget = memo(
  ({
    leaderboard = [],
    userRank = null,
    period = "weekly",
    onPeriodChange = () => {},
    loading = false,
    className = "",
  }) => {
    const [displayedLeaderboard, setDisplayedLeaderboard] = useState([]);

    useEffect(() => {
      setDisplayedLeaderboard(leaderboard.slice(0, 10)); // Top 10
    }, [leaderboard]);

    const getMedalIcon = (rank) => {
      if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
      if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
      if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
      return <TrendingUp className="w-5 h-5 text-blue-500" />;
    };

    const getRankBgColor = (rank) => {
      if (rank === 1)
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-500";
      if (rank === 2)
        return "bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-400";
      if (rank === 3)
        return "bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-400";
      return "bg-white border-l-4 border-blue-300";
    };

    return (
      <GlassCard className={`${className}`} animate>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">Top Estudiantes</h3>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {["weekly", "monthly", "all_time"].map((p) => (
              <motion.button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`
                px-3 py-1 text-xs font-semibold rounded-lg transition-all
                ${
                  period === p
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {p === "weekly"
                  ? "Semanal"
                  : p === "monthly"
                    ? "Mensual"
                    : "Todo"}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}

        {/* Leaderboard List */}
        {!loading && displayedLeaderboard.length > 0 ? (
          <div className="space-y-2">
            {displayedLeaderboard.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                p-3 rounded-lg flex items-center justify-between
                ${getRankBgColor(entry.rank)}
                ${userRank === entry.rank ? "ring-2 ring-blue-500" : ""}
              `}
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Rank Medal */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getMedalIcon(entry.rank)}
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-2 flex-1">
                    {entry.student?.avatarUrl ? (
                      <img
                        src={entry.student.avatarUrl}
                        alt={entry.student.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {entry.student?.name?.[0] || "E"}
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {entry.student?.name || "Estudiante"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.pointsThisPeriod || 0} puntos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Points & Streak */}
                <div className="flex items-center gap-3">
                  {entry.streakBonus > 0 && (
                    <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-lg">
                      <Flame className="w-3 h-3 text-red-500" />
                      <span className="text-xs font-bold text-red-600">
                        {entry.streakBonus}
                      </span>
                    </div>
                  )}

                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">
                      {entry.totalPoints || 0}
                    </p>
                    <p className="text-xs text-gray-500">pts totales</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* User Position (if not in top 10) */}
            {userRank && userRank > 10 && (
              <motion.div
                className="mt-4 pt-4 border-t-2 border-dashed border-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-sm text-gray-500 text-center mb-2">
                  Tu posición actual:
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border-2 border-blue-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      {userRank}
                    </div>
                    <span className="font-semibold text-gray-900">Tú</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    Sigue compitiendo!
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        ) : !loading ? (
          <div className="py-8 text-center">
            <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">
              Sin datos de leaderboard disponibles
            </p>
          </div>
        ) : null}
      </GlassCard>
    );
  },
);

LeaderboardWidget.displayName = "LeaderboardWidget";

export default LeaderboardWidget;
