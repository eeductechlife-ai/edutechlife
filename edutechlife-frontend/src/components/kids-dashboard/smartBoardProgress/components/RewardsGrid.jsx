import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { supabase } from "../../../../lib/supabase";
import { useSmartBoardKidsSafe } from "../../../../context/SmartBoardKidsContext";
import { REWARDS as FALLBACK_REWARDS, item } from "../gamificationData";

const RewardsGrid = ({ unlockedRewards, totalPoints, darkMode }) => {
  const { t } = useTranslation();
  const smartBoard = useSmartBoardKidsSafe();
  const [rewards, setRewards] = useState(FALLBACK_REWARDS);
  const achievements = smartBoard?.supabaseQueries?.achievements?.data || [];

  useEffect(() => {
    supabase
      .from("rewards")
      .select("id, name, icon, cost, description, category")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data?.length) setRewards(data);
      });
  }, []);

  return (
    <motion.div
      variants={item}
      className={`rounded-2xl p-5 border transition-colors duration-500 ${
        darkMode
          ? "bg-[#1E293B]/80 border-[#334155]/50"
          : "bg-white/80 border-[#E2E8F0]/50"
      } backdrop-blur-xl`}
    >
      <h3
        className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-[#1E293B]"}`}
      >
        🎁 Recompensas & Logros
      </h3>

      {/* Rewards (Recompensas) */}
      <div className="mb-4">
        <div
          className={`text-xs font-semibold mb-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          Recompensas Especiales
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {rewards.map((r) => {
            const unlocked = unlockedRewards.includes(r.id);
            const canAfford = totalPoints >= r.cost;
            return (
              <div
                key={r.id}
                className={`rounded-xl p-3 border text-center transition-all ${
                  unlocked
                    ? darkMode
                      ? "bg-[#334155]/50 border-[#FB8500]/30"
                      : "bg-[#FFF7ED] border-[#FB8500]/30"
                    : darkMode
                      ? "bg-[#1E293B] border-[#334155]/50 opacity-60"
                      : "bg-[#F8FAFC] border-[#E2E8F0]/50 opacity-60"
                }`}
              >
                <div className="text-2xl mb-1">{r.icon}</div>
                <div
                  className={`text-[11px] font-bold mb-0.5 ${darkMode ? "text-white" : "text-[#1E293B]"}`}
                >
                  {r.name}
                </div>
                <div
                  className={`text-[10px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                >
                  {r.cost} pts
                </div>
                {unlocked && (
                  <div className="text-[10px] text-green-500 font-semibold mt-1">
                    {t("smartboard.unlocked")}
                  </div>
                )}
                {!unlocked && canAfford && (
                  <div className="text-[10px] text-[#FB8500] font-semibold mt-1">
                    {t("smartboard.available")}
                  </div>
                )}
                {!unlocked && !canAfford && (
                  <div className="text-[10px] text-[#64748B] mt-1">
                    {t("smartboard.missing_points", {
                      count: r.cost - totalPoints,
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements (Logros) from Supabase */}
      {achievements && achievements.length > 0 && (
        <div>
          <div
            className={`text-xs font-semibold mb-2 ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
          >
            Logros Desbloqueados
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`rounded-xl p-3 border text-center transition-all ${
                  darkMode
                    ? "bg-[#334155]/50 border-[#8B5CF6]/30"
                    : "bg-[#F3E8FF] border-[#8B5CF6]/30"
                }`}
              >
                <div className="text-2xl mb-1">{a.badge_url ? "🏆" : "⭐"}</div>
                <div
                  className={`text-[11px] font-bold mb-0.5 line-clamp-2 ${darkMode ? "text-white" : "text-[#1E293B]"}`}
                >
                  {a.title}
                </div>
                <div
                  className={`text-[10px] ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                >
                  +{a.points_awarded || 0} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RewardsGrid;
