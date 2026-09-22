import React, { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Award, Lock } from "lucide-react";

const AchievementBadgeCard = memo(
  ({
    achievement,
    isUnlocked = false,
    unlockedAt = null,
    onClaim = () => {},
    onClick = () => {},
    size = "md", // sm, md, lg
    showPoints = true,
    className = "",
  }) => {
    const sizeMap = {
      sm: { container: "w-20 h-20", badge: "w-12 h-12", text: "text-xs" },
      md: { container: "w-24 h-28", badge: "w-16 h-16", text: "text-sm" },
      lg: { container: "w-32 h-40", badge: "w-24 h-24", text: "text-base" },
    };

    const sizeClass = sizeMap[size] || sizeMap.md;

    const rarityColors = {
      common: "from-slate-400 to-slate-600",
      uncommon: "from-green-400 to-green-600",
      rare: "from-blue-400 to-blue-600",
      epic: "from-purple-400 to-purple-600",
      legendary: "from-yellow-400 to-yellow-600",
    };

    const badgeBgColor = isUnlocked
      ? rarityColors[achievement.rarity] || rarityColors.common
      : "from-gray-400 to-gray-600";

    return (
      <motion.div
        onClick={() => isUnlocked && onClick()}
        className={`${className} cursor-pointer group`}
        whileHover={isUnlocked ? { scale: 1.05 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
      >
        <div
          className={`
          ${sizeClass.container} relative flex flex-col items-center justify-center
          rounded-2xl transition-all duration-300
          ${
            isUnlocked
              ? "bg-white shadow-lg border-2 border-yellow-300 hover:shadow-2xl"
              : "bg-gray-100 shadow-sm border-2 border-gray-300"
          }
        `}
        >
          {/* Badge Image / Icon */}
          <div
            className={`
            ${sizeClass.badge} mb-1 rounded-full
            bg-gradient-to-br ${badgeBgColor}
            flex items-center justify-center
            relative overflow-hidden
          `}
          >
            {isUnlocked ? (
              <>
                {achievement.badge_url ? (
                  <img
                    src={achievement.badge_url}
                    alt={achievement.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                )}

                {/* Unlock animation (glow) */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-yellow-400/0 to-white/20"
                  animate={{ opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </>
            ) : (
              <div className="flex items-center justify-center">
                <Lock className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <p
            className={`
            ${sizeClass.text} font-bold text-center
            ${isUnlocked ? "text-gray-900" : "text-gray-500"}
            line-clamp-2 px-1
          `}
          >
            {achievement.title}
          </p>

          {/* Points Badge */}
          {showPoints && isUnlocked && (
            <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              +{achievement.points_reward || 0}
            </div>
          )}

          {/* Unlock Date */}
          {isUnlocked && unlockedAt && size === "lg" && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(unlockedAt).toLocaleDateString("es-ES")}
            </p>
          )}

          {/* Claim Button (only on hover, if unlocked) */}
          {isUnlocked && size === "lg" && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClaim();
              }}
              className="
              mt-2 px-3 py-1 bg-yellow-400 hover:bg-yellow-500
              text-yellow-900 font-bold rounded-lg text-xs
              transition-colors
            "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reclamar
            </motion.button>
          )}

          {/* Rarity Badge */}
          {size !== "sm" && (
            <div
              className={`
              absolute bottom-1 left-1 text-xs font-semibold px-2 py-0.5
              rounded-full uppercase tracking-wide
              ${
                achievement.rarity === "legendary"
                  ? "bg-yellow-100 text-yellow-800"
                  : achievement.rarity === "epic"
                    ? "bg-purple-100 text-purple-800"
                    : achievement.rarity === "rare"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
              }
            `}
            >
              {achievement.rarity}
            </div>
          )}

          {/* New Badge (if recently unlocked) */}
          {isUnlocked &&
            unlockedAt &&
            (() => {
              const daysSinceUnlock = Math.floor(
                (Date.now() - new Date(unlockedAt)) / (1000 * 60 * 60 * 24),
              );
              if (daysSinceUnlock <= 3) {
                return (
                  <motion.div
                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                );
              }
            })()}
        </div>

        {/* Tooltip on hover */}
        <motion.div
          className="
          hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2
          mb-2 bg-gray-900 text-white text-xs rounded-lg p-2
          w-32 text-center whitespace-normal z-50
        "
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          {achievement.description}
        </motion.div>
      </motion.div>
    );
  },
);

AchievementBadgeCard.displayName = "AchievementBadgeCard";

export default AchievementBadgeCard;
