import { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Gem } from "lucide-react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

// ==========================================
// Reward Card Component
// ==========================================
const RewardCard = memo(({ reward, isUnlocked, canAfford, onUnlock }) => (
  <motion.button
    type="button"
    whileHover={
      isUnlocked
        ? {}
        : {
            y: -8,
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(77, 168, 196, 0.2)",
          }
    }
    whileTap={{ scale: 0.95 }}
    disabled={isUnlocked || !canAfford}
    onClick={() => !isUnlocked && canAfford && onUnlock(reward)}
    className={`relative p-4 rounded-2xl border-2 transition-all backdrop-blur-xl w-full text-left ${
      isUnlocked
        ? "border-[#66CCCC] bg-white/30 opacity-75 cursor-default"
        : canAfford
          ? "border-[#4DA8C4]/50 bg-white/70 hover:border-[#4DA8C4] cursor-pointer shadow-lg"
          : "border-[#E2E8F0] bg-white/30 opacity-60 cursor-not-allowed"
    }`}
  >
    {isUnlocked && (
      <div className="absolute top-2 right-2 w-6 h-6 bg-[#06D6A0] rounded-full flex items-center justify-center text-white">
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </div>
    )}

    <div className="text-center mb-3">
      <span className="text-4xl">{reward.icon}</span>
    </div>

    <h4 className="text-sm font-bold text-[#004B63] text-center mb-1">
      {reward.name}
    </h4>

    <p className="text-xs text-[#64748B] text-center mb-3 line-clamp-2">
      {reward.description}
    </p>

    <div className="flex items-center justify-center gap-1 text-sm font-black text-[#FB8500] tabular-nums">
      <Gem className="w-4 h-4" strokeWidth={2.4} />
      <span>{reward.cost}</span>
    </div>
  </motion.button>
));

RewardCard.displayName = "RewardCard";

// ==========================================
// Points Display Component
// ==========================================
const PointsDisplay = memo(({ totalPoints, totalActiveMinutes }) => {
  const { t } = useTranslation();
  const safeMinutes = totalActiveMinutes || 0;
  const level = useMemo(() => {
    if (totalPoints >= 5000)
      return {
        levelKey: "kid.points_rewards.level_maestro",
        emoji: "🏆",
        color: "#FFD166",
      };
    if (totalPoints >= 2500)
      return {
        levelKey: "kid.points_rewards.level_experto",
        emoji: "⭐",
        color: "#4DA8C4",
      };
    if (totalPoints >= 1000)
      return {
        levelKey: "kid.points_rewards.level_avanzado",
        emoji: "📚",
        color: "#66CCCC",
      };
    if (totalPoints >= 500)
      return {
        levelKey: "kid.points_rewards.level_intermedio",
        emoji: "🌟",
        color: "#B2D8E5",
      };
    return {
      levelKey: "kid.points_rewards.level_principiante",
      emoji: "🌱",
      color: "#66CCCC",
    };
  }, [totalPoints]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 backdrop-blur-xl border-2 border-[#FFD166]/60 rounded-2xl p-6 text-[#004B63] shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[#64748B] text-sm">
            {t("kid.points_rewards.your_points")}
          </p>
          <motion.p
            className="text-4xl font-black"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {totalPoints.toLocaleString()}
          </motion.p>
        </div>
        <div className="text-right">
          <p className="text-[#64748B] text-sm">
            {t("kid.points_rewards.level")}
          </p>
          <p className="text-2xl font-bold text-[#00303F]">
            <span style={{ color: level.color }}>{level.emoji}</span>{" "}
            {t(level.levelKey)}
          </p>
        </div>
      </div>

      <div className="bg-white/20 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-[#FFD166] rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min((totalPoints % 500) / 5, 100)}%`,
          }}
          transition={{ duration: 1 }}
        />
      </div>
      <p className="text-xs text-[#64748B] mt-2">
        {t("kid.points_rewards.minutes_to_next_level", {
          minutes: safeMinutes,
          current: totalPoints % 500,
          next: 500,
        })}
      </p>
    </motion.div>
  );
});

PointsDisplay.displayName = "PointsDisplay";

// ==========================================
// Points History Component
// ==========================================
const PointsHistory = memo(({ history }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-[#E2E8F0]/50 rounded-2xl p-4 shadow-lg">
      <h4 className="text-sm font-bold text-[#004B63] mb-3">
        {t("kid.points_rewards.points_history_title")}
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {history
          .slice(-10)
          .reverse()
          .map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-[#F8FAFC]/50"
            >
              <span className="text-xs text-[#64748B]">{entry.reason}</span>
              <span
                className={`text-xs font-bold ${entry.points > 0 ? "text-[#66CCCC]" : "text-[#FF6B9D]"}`}
              >
                {entry.points > 0 ? "+" : ""}
                {entry.points}
              </span>
            </motion.div>
          ))}
      </div>
    </div>
  );
});

PointsHistory.displayName = "PointsHistory";

// ==========================================
// Main Points & Rewards System Component
// ==========================================
const PointsRewardsSystem = memo(() => {
  const { t } = useTranslation();
  const {
    totalPoints,
    pointsHistory,
    unlockedRewards,
    unlockReward,
    addPoints,
    totalActiveMinutes,
  } = useSmartBoardKids();
  const [activeTab, setActiveTab] = useState("puntos");

  const rewards = useMemo(
    () => [
      {
        id: 1,
        name: "Tema Oscuro",
        icon: "🌙",
        cost: 500,
        description: "Cambia a modo oscuro el dashboard",
        category: "personalization",
      },
      {
        id: 2,
        name: "Avatar Dani Animado",
        icon: "🤖",
        cost: 750,
        description: "Desbloquea avatar animado de Dani",
        category: "avatar",
      },
      {
        id: 3,
        name: "Fondo Galaxia",
        icon: "🌌",
        cost: 1000,
        description: "Fondo de pantalla espacial",
        category: "personalization",
      },
      {
        id: 4,
        name: "Día Libre",
        icon: "🏖️",
        cost: 1500,
        description: "Un día sin tareas asignadas",
        category: "special",
      },
      {
        id: 5,
        name: "Curso IA Básico",
        icon: "🤖",
        cost: 2000,
        description: "Acceso a curso introductorio de IA",
        category: "education",
      },
      {
        id: 6,
        name: "Certificado VAK",
        icon: "📜",
        cost: 3000,
        description: "Certificado oficial de tu perfil VAK",
        category: "education",
      },
    ],
    [],
  );

  const handleUnlock = useCallback(
    (reward) => {
      if (totalPoints >= reward.cost && !unlockedRewards.includes(reward.id)) {
        unlockReward(reward);
      }
    },
    [totalPoints, unlockedRewards, unlockReward],
  );

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <PointsDisplay
        totalPoints={totalPoints}
        totalActiveMinutes={totalActiveMinutes || 0}
      />

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white/70 backdrop-blur-xl border border-[#E2E8F0]/50 rounded-full p-1.5 shadow-sm">
        {["puntos", "tienda", "historial"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "text-white"
                : "text-[#64748B] hover:text-[#004B63]"
            }`}
          >
            {activeTab === tab && (
              <motion.span
                layoutId="pointsTabPill"
                className="absolute inset-0 rounded-full bg-[#4DA8C4] shadow-md"
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
              />
            )}
            <span className="relative z-10">
              {tab === "puntos" && "💎 "}
              {tab === "tienda" && "🛒 "}
              {tab === "historial" && "📜 "}
              {tab === "puntos"
                ? t("kid.points_rewards.tab_points")
                : tab === "tienda"
                  ? t("kid.points_rewards.tab_store")
                  : t("kid.points_rewards.tab_history")}
            </span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeTab === "puntos" && (
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#004B63] mb-4">
                {t("kid.points_rewards.how_to_earn_title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: "⏱️",
                    actionKey: "kid.points_rewards.action_active_minute",
                    points: 1,
                    color: "#4DA8C4",
                  },
                  {
                    icon: "📝",
                    actionKey: "kid.points_rewards.action_upload_activity",
                    points: 50,
                    color: "#66CCCC",
                  },
                  {
                    icon: "✅",
                    actionKey: "kid.points_rewards.action_complete_mission",
                    points: 100,
                    color: "#FFD166",
                  },
                  {
                    icon: "🧠",
                    actionKey: "kid.points_rewards.action_vak_diagnosis",
                    points: 300,
                    color: "#FF6B9D",
                  },
                  {
                    icon: "📚",
                    actionKey: "kid.points_rewards.action_complete_subject",
                    points: 200,
                    color: "#B2D8E5",
                  },
                  {
                    icon: "🔥",
                    actionKey: "kid.points_rewards.action_daily_streak",
                    points: 150,
                    color: "#4DA8C4",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.actionKey}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#004B63]">
                        {t(item.actionKey)}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {t("kid.points_rewards.points_format", {
                          points: item.points,
                        })}
                      </p>
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: item.color }}
                    >
                      +{item.points}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tienda" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  isUnlocked={unlockedRewards.includes(reward.id)}
                  canAfford={totalPoints >= reward.cost}
                  onUnlock={handleUnlock}
                />
              ))}
            </div>
          )}

          {activeTab === "historial" && (
            <PointsHistory history={pointsHistory} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

PointsRewardsSystem.displayName = "PointsRewardsSystem";

export default PointsRewardsSystem;
