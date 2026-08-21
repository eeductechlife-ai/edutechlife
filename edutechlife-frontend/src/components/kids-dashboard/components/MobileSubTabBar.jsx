import { memo } from "react";
import { motion } from "framer-motion";
import {
  CATEGORIES,
  CATEGORY_TAB_LABELS,
  CATEGORY_MAP,
} from "../kidsDashboardConfig";

const MobileSubTabBar = memo(({ activeTab, onTabChange, darkMode }) => {
  const activeCategory = CATEGORY_MAP[activeTab] || "home";
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  console.log("MobileSubTabBar:", {
    activeTab,
    activeCategory,
    activeCat: activeCat?.id,
    tabs: activeCat?.tabs?.length,
  });

  // Only show sub-tabs if there are multiple tabs in the category
  if (!activeCat || activeCat.tabs.length <= 1 || activeCat.id === "home") {
    return null;
  }

  return (
    <div
      className={`md:hidden px-4 py-3 overflow-x-auto overflow-y-hidden border-b transition-colors duration-500 ${
        darkMode
          ? "bg-[#1E293B]/50 border-[#2A3A54]/60"
          : "bg-[#F8FAFC]/50 border-[#E2E8F0]"
      }`}
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="flex gap-2">
        {activeCat.tabs.map((tabId) => {
          const isActive = activeTab === tabId;
          return (
            <motion.button
              key={tabId}
              onClick={() => onTabChange(tabId)}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? darkMode
                    ? "text-white"
                    : "text-white"
                  : darkMode
                    ? "text-[#94A3B8]"
                    : "text-[#64748B]"
              }`}
              style={
                isActive
                  ? {
                      background: activeCat.gradient,
                      boxShadow: `0 0 8px ${activeCat.glowColor}40`,
                    }
                  : {
                      background: darkMode
                        ? "rgba(71, 85, 105, 0.1)"
                        : "rgba(148, 163, 184, 0.1)",
                    }
              }
            >
              {CATEGORY_TAB_LABELS[tabId] || tabId}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

MobileSubTabBar.displayName = "MobileSubTabBar";

export default MobileSubTabBar;
