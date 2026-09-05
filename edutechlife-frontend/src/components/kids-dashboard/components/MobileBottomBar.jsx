import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  CATEGORY_MAP,
  PREMIUM_TABS,
  getTabsForAgeGroup,
} from "../kidsDashboardConfig";
import { glow } from "../smartboardTheme";

// Hide the bar when the on-screen keyboard is up so it never covers the input.
// Detected via visualViewport: keyboard shrinks the viewport by ≥25%.
function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!vv) return;
    const check = () => setVisible(window.innerHeight - vv.height > 150);
    vv.addEventListener("resize", check, { passive: true });
    check();
    return () => vv.removeEventListener("resize", check);
  }, []);
  return visible;
}

const MobileBottomBar = memo(
  ({
    activeTab,
    onTabChange,
    darkMode,
    subscriptionTier,
    isFeatureEnabled = () => true,
    ageGroup = "middle",
  }) => {
    const { t } = useTranslation();
    const isPremium = subscriptionTier === "premium";
    const activeCategory = CATEGORY_MAP[activeTab] || "home";
    const keyboardVisible = useKeyboardVisible();
    const visibleCategories = getTabsForAgeGroup(ageGroup);

    if (keyboardVisible) return null;

    const getFirstTab = (catId) => {
      const cat = visibleCategories.find((c) => c.id === catId);
      if (!cat) return "inicio";
      return cat.tabs.find(isFeatureEnabled) || cat.tabs[0];
    };

    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-500 ${
          darkMode
            ? "bg-[#151F32]/92 border-[#2A3A54]/60"
            : "bg-white/92 border-[#E2E8F0]"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav className="flex items-center py-1.5 px-1">
          {visibleCategories.map((cat) => {
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
                className="relative flex flex-1 flex-col items-center gap-0.5 py-2 px-1 rounded-2xl transition-all"
                style={
                  isActive
                    ? {
                        background: cat.gradient,
                        boxShadow: glow(cat.glowColor, 0.5),
                        color: "white",
                      }
                    : { color: cat.color + "90" }
                }
              >
                {/* Active indicator bar at top */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pip"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-white/70"
                  />
                )}
                <motion.span
                  className="flex items-center justify-center"
                  animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <cat.Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={isActive ? 2.6 : 2}
                  />
                </motion.span>
                <span
                  className="text-[9px] font-bold whitespace-nowrap"
                  style={isActive ? { color: "white" } : {}}
                >
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
