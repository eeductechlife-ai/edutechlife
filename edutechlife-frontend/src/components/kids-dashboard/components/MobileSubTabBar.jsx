import { memo } from "react";
import { motion } from "framer-motion";
import {
  CATEGORIES,
  CATEGORY_TAB_LABELS,
  CATEGORY_MAP,
} from "../kidsDashboardConfig";

const MobileSubTabBar = memo(
  ({ activeTab, onTabChange, darkMode, isFeatureEnabled = () => true }) => {
    const activeCategory = CATEGORY_MAP[activeTab] || "home";
    const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

    // Only show sub-tabs if there are multiple tabs in the category
    if (!activeCat || activeCat.tabs.length <= 1 || activeCat.id === "home") {
      return null;
    }

    const visibleTabs = activeCat.tabs.filter(isFeatureEnabled);
    const hasOverflow = visibleTabs.length > 3;

    return (
      <div
        className={`md:hidden relative border-b transition-colors duration-500 ${darkMode ? "border-[#2A3A54]/60" : "border-[#E2E8F0]"}`}
      >
        <div
          className={`overflow-x-auto overflow-y-hidden px-4 py-2.5 transition-colors duration-500 ${darkMode ? "bg-[#1E293B]/50" : "bg-[#F8FAFC]/50"}`}
          style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
        >
          <div className="flex gap-2 pr-4">
            {visibleTabs.map((tabId) => {
              const isActive = activeTab === tabId;
              return (
                <motion.button
                  key={tabId}
                  onClick={() => onTabChange(tabId)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? "text-white"
                      : darkMode
                        ? "text-[#94A3B8]"
                        : "text-[#64748B]"
                  }`}
                  style={
                    isActive
                      ? {
                          background: activeCat.gradient,
                          boxShadow: `0 2px 10px ${activeCat.glowColor}50`,
                        }
                      : {
                          background: darkMode
                            ? "rgba(71,85,105,0.12)"
                            : "rgba(148,163,184,0.12)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {CATEGORY_TAB_LABELS[tabId] || tabId}
                </motion.button>
              );
            })}
          </div>
        </div>
        {/* Fade-out gradient on the right to hint at horizontal scroll */}
        {hasOverflow && (
          <div
            className="absolute top-0 right-0 h-full w-8 pointer-events-none"
            style={{
              background: darkMode
                ? "linear-gradient(to right, transparent, #1E293B)"
                : "linear-gradient(to right, transparent, #F8FAFC)",
            }}
          />
        )}
      </div>
    );
  },
);

MobileSubTabBar.displayName = "MobileSubTabBar";

export default MobileSubTabBar;
