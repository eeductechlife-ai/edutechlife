import { memo } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { CATEGORY_MAP, CATEGORIES, PREMIUM_TABS } from "../kidsDashboardConfig";
import { glow } from "../smartboardTheme";

const MobileBottomBar = memo(
  ({ activeTab, onTabChange, darkMode, subscriptionTier }) => {
    const { t } = useTranslation();
    const isPremium = subscriptionTier === "premium";
    const activeCategory = CATEGORY_MAP[activeTab] || "home";

    const getFirstTab = (catId) => {
      const cat = CATEGORIES.find((c) => c.id === catId);
      return cat ? cat.tabs[0] : "inicio";
    };

    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-500 ${
          darkMode
            ? "bg-[#151F32]/90 border-[#2A3A54]/60"
            : "bg-white/90 border-[#E2E8F0]"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav className="flex justify-around items-center py-1.5 px-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const anyPremiumInCategory = cat.tabs.some((tb) =>
              PREMIUM_TABS.includes(tb),
            );
            const locked = anyPremiumInCategory && !isPremium;
            return (
              <motion.button
                key={cat.id}
                onClick={() =>
                  onTabChange(
                    activeCategory === cat.id ? activeTab : getFirstTab(cat.id),
                  )
                }
                whileTap={{ scale: 0.88 }}
                aria-label={cat.label}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all min-w-[58px] ${
                  isActive
                    ? "text-white"
                    : darkMode
                      ? "text-[#64748B]"
                      : "text-[#94A3B8]"
                }`}
                style={
                  isActive
                    ? {
                        background: cat.gradient,
                        boxShadow: glow(cat.glowColor, 0.5),
                      }
                    : {}
                }
              >
                <motion.span
                  className="flex items-center justify-center"
                  animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <cat.Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={isActive ? 2.6 : 2.2}
                  />
                </motion.span>
                <span className="text-[9px] font-bold whitespace-nowrap">
                  {cat.label}
                </span>
                {locked && (
                  <Lock className="w-2.5 h-2.5 absolute top-0.5 right-1 opacity-70" />
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.div>
    );
  },
);

export default MobileBottomBar;
